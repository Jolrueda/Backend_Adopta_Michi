import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  id: number;
  email: string;
  type: string;
}

export default function protect(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(401).json({ message: 'Token inválido' });
  }
} 