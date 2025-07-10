import { Router } from 'express';
import { getCats, getCatById, createCat, updateCat, deleteCat, patchCat, patchAvailability } from '../controllers/catController';
import protect from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getCats);
router.get('/:id', getCatById);
router.post('/', protect, createCat);
router.put('/:id', protect, updateCat);
router.delete('/:id', protect, deleteCat);
// Ruta pública para cambiar solo la disponibilidad del gato
router.patch('/:id/availability', patchAvailability);
router.patch('/:id', protect, patchCat);

export default router; 