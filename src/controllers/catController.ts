import { Request, Response, NextFunction } from 'express';
import { query } from '../db';
// Valores permitidos para el campo "disponibilidad"
export const ALLOWED_AVAILABILITIES = ['disponible', 'en proceso', 'adoptado'] as const;

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
    // Orden estable por id para que la posición del gato no cambie al modificar disponibilidad
    baseQuery += ` ORDER BY id LIMIT $${values.length - 1} OFFSET $${values.length}`;

    // Consulta principal
    const result = await query(baseQuery, values);

    // Consulta para total (para paginación)
    const countQuery = disponibilidad
      ? 'SELECT COUNT(*) FROM cats WHERE disponibilidad = $1'
      : 'SELECT COUNT(*) FROM cats';
    const countResult = await query(countQuery, disponibilidad ? [disponibilidad] : []);
    res.set('X-Total-Count', countResult.rows[0].count);

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

export async function patchCat(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    // Validar disponibilidad cuando se envía en el body
    if (req.body.disponibilidad && !ALLOWED_AVAILABILITIES.includes(req.body.disponibilidad as any)) {
      return res.status(400).json({ message: 'Valor de disponibilidad inválido' });
    }

    // Campos permitidos para actualizar
    const allowedFields = [
      'nombre',
      'edad',
      'descripcion',
      'estado',
      'condicion',
      'disponibilidad',
      'imagen',
      'imagen2',
      'imagen3',
    ];

    // Construir dinámicamente la consulta según los campos presentes en el body
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

    // Agregar el id al final de los valores para la cláusula WHERE
    values.push(id);

    const queryText = `UPDATE cats SET ${setClauses.join(', ')} WHERE id = $${
      values.length
    } RETURNING *`;

    const result = await query(queryText, values);

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Gato no encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

// Controlador dedicado para actualizar únicamente la disponibilidad del gato
export async function patchAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { disponibilidad } = req.body as { disponibilidad?: string };

    if (!disponibilidad) {
      return res.status(400).json({ message: 'Se requiere el campo disponibilidad' });
    }

    if (!ALLOWED_AVAILABILITIES.includes(disponibilidad as any)) {
      return res.status(400).json({ message: 'Valor de disponibilidad inválido' });
    }

    const result = await query('UPDATE cats SET disponibilidad = $1 WHERE id = $2 RETURNING *', [disponibilidad, id]);

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Gato no encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
} 