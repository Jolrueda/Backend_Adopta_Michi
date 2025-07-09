import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db';
import generateToken from '../utils/generateToken';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, email, password, type } = req.body as any;

    // Validar correo institucional
    if (!email.endsWith('@unal.edu.co')) {
      return res.status(400).json({
        message: 'Debe registrarse con correo institucional @unal.edu.co',
      });
    }

    // Validar contraseña con regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'La contraseña debe tener más de 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
      });
    }

    // Verificar si el correo ya existe
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Crear usuario
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
        'INSERT INTO users (fullName, email, password, type) VALUES ($1,$2,$3,$4) RETURNING id, fullName, email, type, createdAt',
        [fullName, email, hash, type || 'regular']
    );

    const user = result.rows[0];
    const token = generateToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as any;
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows.length) {
      return res.status(400).json({ message: 'El correo no está registrado' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    delete user.password;
    const token = generateToken(user);
    return res.json({ user, token });
  } catch (err) {
    return next(err);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = (req as any).user;
    const result = await query('SELECT id, fullName, email, type, createdAt FROM users WHERE id = $1', [id]);
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = (req as any).user;
    const { fullName, profilePicture } = req.body as any;
    const result = await query(
      'UPDATE users SET fullName = $1, profilePicture = $2 WHERE id = $3 RETURNING id, fullName, email, type, createdAt, profilePicture',
      [fullName, profilePicture, id]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
} 