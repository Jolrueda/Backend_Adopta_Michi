import { Request, Response, NextFunction } from 'express';
import { query } from '../db';

// 👉 Crear una donación (mejorado)
export async function createDonation(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, monto, nombre, tarjeta, fecha_tarjeta, cvv } = req.body as any;

    // ✅ Validaciones básicas
    if (!email || !monto || !nombre || !tarjeta || !fecha_tarjeta || !cvv) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (isNaN(monto) || monto <= 0) {
      return res.status(400).json({ message: 'El monto debe ser un número positivo' });
    }

    if (!/^\d{16}$/.test(tarjeta)) {
      return res.status(400).json({ message: 'La tarjeta debe tener 16 dígitos numéricos' });
    }

    if (!/^\d{3}$/.test(cvv)) {
      return res.status(400).json({ message: 'El CVV debe tener 3 dígitos numéricos' });
    }

    if (!/^\d{2}\/\d{2}$/.test(fecha_tarjeta)) {
      return res.status(400).json({ message: 'La fecha debe tener formato MM/AA' });
    }

    // ✅ Solo almacenamos últimos 4 dígitos de la tarjeta
    const ultimos4 = tarjeta.slice(-4);

    // 👉 Insertar donación en la base de datos
    const result = await query(
      `INSERT INTO donations (email, monto, nombre, ultimos4, fecha_tarjeta, cvv)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [email, monto, nombre, ultimos4, fecha_tarjeta, cvv]
    );
    

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
}

// 👉 Listar todas las donaciones
export async function listDonations(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await query('SELECT * FROM donations ORDER BY createdAt DESC');
    return res.json(result.rows);
  } catch (err) {
    return next(err);
  }
}


// 👉 Obtener una donación por ID
export async function getDonationById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM donations WHERE id = $1', [id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: 'Donación no encontrada' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    return next(err);
  }
}
