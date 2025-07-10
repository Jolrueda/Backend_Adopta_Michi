import { Request, Response, NextFunction } from 'express';
import { query } from '../db';

export async function createRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { catId, name, phone, email, message } = req.body as any;
    const result = await query(
      `INSERT INTO adoption_requests (catId, name, phone, email, message, status) VALUES ($1,$2,$3,$4,$5,'pendiente') RETURNING *`,
      [catId, name, phone, email, message]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

export async function listRequests(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await query('SELECT * FROM adoption_requests ORDER BY createdAt DESC');
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
}

export async function listUserRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = (req as any).user;
    const result = await query('SELECT * FROM adoption_requests WHERE email = $1 ORDER BY createdAt DESC', [email]);
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: string };

    const ALLOWED_STATUS = ['pendiente', 'aceptada', 'rechazada'] as const;
    if (!ALLOWED_STATUS.includes(status as any)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    // Actualizar la solicitud y obtener el catId relacionado
    const requestResult = await query(
      'UPDATE adoption_requests SET status=$1 WHERE id=$2 RETURNING catId, status',
      [status, id]
    );

    if (!requestResult.rows.length) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const { catid: catId, status: finalStatus } = requestResult.rows[0] as any;

    // Si la solicitud pasa a "aceptada" o "rechazada", actualizamos disponibilidad del gato
    let nuevaDisponibilidad: string | null = null;
    if (finalStatus === 'aceptada') nuevaDisponibilidad = 'adoptado';
    if (finalStatus === 'rechazada') nuevaDisponibilidad = 'disponible';

    if (nuevaDisponibilidad) {
      await query('UPDATE cats SET disponibilidad=$1 WHERE id=$2', [nuevaDisponibilidad, catId]);
    }

    return res.json(requestResult.rows[0]);
  } catch (err) {
    return next(err);
  }
} 