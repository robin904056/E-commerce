import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get all products (public)
router.get('/', async (req, res) => {
  res.json({ message: 'Get all products', products: [] });
});

// Get product by ID (public)
router.get('/:id', async (req, res) => {
  res.json({ message: `Get product ${req.params.id}` });
});

// Create product (seller only)
router.post('/', authenticate, async (req, res) => {
  res.json({ message: 'Create product' });
});

// Update product (seller only)
router.put('/:id', authenticate, async (req, res) => {
  res.json({ message: `Update product ${req.params.id}` });
});

// Delete product (seller only)
router.delete('/:id', authenticate, async (req, res) => {
  res.json({ message: `Delete product ${req.params.id}` });
});

export default router;
