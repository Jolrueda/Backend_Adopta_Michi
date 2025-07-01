import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
  id: number;
  email: string;
  type: string;
}

export default function generateToken(user: UserPayload) {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
} 