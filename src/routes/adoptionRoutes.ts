import { Router } from 'express';
import { createRequest, listRequests, listUserRequests, updateStatus } from '../controllers/adoptionController';
import protect from '../middlewares/authMiddleware';

const router = Router();

router.post('/', protect, createRequest);
router.get('/', protect, listRequests);
router.get('/user', protect, listUserRequests);
router.put('/:id', protect, updateStatus);

export default router; 