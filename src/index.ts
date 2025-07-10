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
// Configurar límites para evitar errores 413 y 431
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ 
  limit: '5mb', 
  extended: true,
  parameterLimit: 50000
}));

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