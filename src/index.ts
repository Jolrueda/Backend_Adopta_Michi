import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import catRoutes from './routes/catRoutes';
import adoptionRoutes from './routes/adoptionRoutes';
import donationRoutes from './routes/donationRoutes';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'API de Adopta un Michi funcionando' });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/cats', catRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/donations', donationRoutes);

// Manejador global de errores
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor escuchando en el puerto ${PORT}`);
}); 