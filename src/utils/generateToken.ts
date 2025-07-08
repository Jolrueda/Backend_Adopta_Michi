import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
  id: number;
  email: string;
  type: string;
}

export default function generateToken(user: UserPayload) {
  const secret = process.env.JWT_SECRET || 'dev_secret'; // Valor por defecto para desarrollo
  return jwt.sign(user, secret, {
    expiresIn: '7d',
  });
} 