import { Router } from 'express';
import { register, login, getProfile, updateProfile, getUserByEmail, updatePassword } from '../controllers/authController';
import protect from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', getUserByEmail); // GET /api/auth?email=...
router.patch('/:id', updatePassword);

export default router; 