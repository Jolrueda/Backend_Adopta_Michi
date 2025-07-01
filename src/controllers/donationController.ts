import { Request, Response, NextFunction } from 'express';
import { query } from '../db';

export async function createDonation(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, monto, nombre, tarjeta, fecha_tarjeta, cvv } = req.body as any;
    const result = await query(
      `INSERT INTO donations (email, monto, nombre, tarjeta, fecha_tarjeta, cvv) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [email, monto, nombre, tarjeta, fecha_tarjeta, cvv]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

export async function listDonations(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await query('SELECT * FROM donations ORDER BY createdAt DESC');
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
}

export async function getDonationById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM donations WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Donación no encontrada' });
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
} 