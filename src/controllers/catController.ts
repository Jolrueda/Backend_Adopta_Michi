import { Request, Response, NextFunction } from 'express';
import { query } from '../db';

export async function getCats(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const { disponibilidad } = req.query as { disponibilidad?: string };

    const offset = (page - 1) * limit;
    let baseQuery = 'SELECT * FROM cats';
    const values: any[] = [];

    if (disponibilidad) {
      values.push(disponibilidad);
      baseQuery += ` WHERE disponibilidad = $${values.length}`;
    }

    values.push(limit, offset);
    baseQuery += ` ORDER BY createdAt DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await query(baseQuery, values);
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
}

export async function getCatById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM cats WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Gato no encontrado' });
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

export async function createCat(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, edad, descripcion, estado, condicion, disponibilidad, imagen, imagen2, imagen3 } = req.body as any;
    const result = await query(
      `INSERT INTO cats (nombre, edad, descripcion, estado, condicion, disponibilidad, imagen, imagen2, imagen3)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nombre, edad, descripcion, estado, condicion, disponibilidad, imagen, imagen2, imagen3]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

export async function updateCat(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { nombre, edad, descripcion, estado, condicion, disponibilidad, imagen, imagen2, imagen3 } = req.body as any;
    const result = await query(
      `UPDATE cats SET nombre=$1, edad=$2, descripcion=$3, estado=$4, condicion=$5, disponibilidad=$6, imagen=$7, imagen2=$8, imagen3=$9
       WHERE id=$10 RETURNING *`,
      [nombre, edad, descripcion, estado, condicion, disponibilidad, imagen, imagen2, imagen3, id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Gato no encontrado' });
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

export async function deleteCat(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await query('DELETE FROM cats WHERE id = $1', [id]);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
} 