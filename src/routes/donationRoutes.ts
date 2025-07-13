import { Router } from 'express';
import { createDonation, listDonations, getDonationById } from '../controllers/donationController';
import protect from '../middlewares/authMiddleware';

const router = Router();

router.post('/', createDonation);
router.get('/', /* protect, */ listDonations);
router.get('/:id', /* protect, */ getDonationById);


export default router; 