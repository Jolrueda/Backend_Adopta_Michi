import { Router } from 'express';
import { getCats, getCatById, createCat, updateCat, deleteCat, patchCat } from '../controllers/catController';
import protect from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getCats);
router.get('/:id', getCatById);
router.post('/', protect, createCat);
router.put('/:id', protect, updateCat);
router.delete('/:id', protect, deleteCat);
router.patch('/:id', protect, patchCat);

export default router; 