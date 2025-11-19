import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Get seller profile (seller only)
router.get('/profile', authenticate, authorize('SELLER'), async (req, res) => {
  res.json({ message: 'Get seller profile' });
});

// Update seller profile (seller only)
router.put('/profile', authenticate, authorize('SELLER'), async (req, res) => {
  res.json({ message: 'Update seller profile' });
});

// Get seller products (seller only)
router.get('/products', authenticate, authorize('SELLER'), async (req, res) => {
  res.json({ message: 'Get seller products', products: [] });
});

// Get seller orders (seller only)
router.get('/orders', authenticate, authorize('SELLER'), async (req, res) => {
  res.json({ message: 'Get seller orders', orders: [] });
});

export default router;
