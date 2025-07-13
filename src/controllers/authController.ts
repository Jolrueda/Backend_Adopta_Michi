import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db';
import generateToken from '../utils/generateToken';

// Helper to map DB columns to camelCase keys expected by frontend
function formatUser(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    fullName: row.fullName ?? row.fullname,
    email: row.email,
    type: row.type,
    createdAt: row.createdAt ?? row.createdat,
    profilePicture: row.profilePicture ?? row.profilepicture ?? null,
  };
}

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
      'INSERT INTO users (fullName, email, password, type) VALUES ($1,$2,$3,$4) RETURNING id, fullName, email, type, createdAt AS "createdAt", profilePicture AS "profilePicture"',
      [fullName, email, hash, type || 'regular']
    );

    const user = result.rows[0];
    
    // Para el token, solo incluimos campos esenciales (sin profilePicture)
    const tokenPayload = {
      id: user.id,
      email: user.email,
      type: user.type
    };
    const token = generateToken(tokenPayload);
    
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as any;

    // Validar correo institucional
    if (!email.endsWith('@unal.edu.co')) {
      return res.status(400).json({
        message: 'Debe iniciar sesión con un correo institucional @unal.edu.co',
      });
    }

    const result = await query('SELECT id, fullName, email, password, type, createdAt AS "createdAt", profilePicture AS "profilePicture" FROM users WHERE email = $1', [email]);
    if (!result.rows.length) {
      return res.status(400).json({ message: 'El correo no está registrado' });
    }

    // Necesitamos la contraseña hasheada para compararla, por lo que utilizamos la fila original
    const dbUser = result.rows[0];

    const match = await bcrypt.compare(password, dbUser.password);
    if (!match) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Eliminamos la contraseña antes de enviar la respuesta
    delete dbUser.password;

    // Formateamos el usuario para devolver únicamente los campos esperados por el frontend
    const safeUser = formatUser(dbUser);
    
    // Para el token, solo incluimos campos esenciales (sin profilePicture)
    const tokenPayload = {
      id: safeUser.id,
      email: safeUser.email,
      type: safeUser.type
    };
    const token = generateToken(tokenPayload);

    return res.json({ user: safeUser, token });
  } catch (err) {
    return next(err);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = (req as any).user;
    const result = await query('SELECT id, fullName, email, type, createdAt AS "createdAt", profilePicture AS "profilePicture" FROM users WHERE id = $1', [id]);
    return res.json(formatUser(result.rows[0]));
  } catch (err) {
    return next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = (req as any).user;
    const allowedFields = ['fullName', 'profilePicture'];
    const setClauses: string[] = [];
    const values: any[] = [];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        values.push(req.body[field]);
        setClauses.push(`${field} = $${values.length}`);
      }
    });

    if (!setClauses.length) {
      return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
    }

    values.push(id);
    const queryText = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING id, fullName, email, type, createdAt AS "createdAt", profilePicture`;
    const result = await query(queryText, values);
    return res.json(formatUser(result.rows[0]));
  } catch (err) {
    return next(err);
  }
} 