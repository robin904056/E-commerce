import { Router } from 'express';
import { 
  signup, 
  loginWithEmail, 
  loginWithPhone,
  loginWithOTP,
  sendOTP,
  verifyOTP,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
  socialAuth
} from '../controllers/auth';
import { authenticate } from '../middleware/auth';

const router = Router();

// Registration
router.post('/signup', signup);

// Login routes
router.post('/login/email', loginWithEmail);
router.post('/login/phone', loginWithPhone);
router.post('/login/otp', loginWithOTP);

// OTP routes
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);

// Token management
router.post('/token/refresh', refreshToken);
router.post('/logout', authenticate, logout);

// Password reset
router.post('/password/reset-request', requestPasswordReset);
router.post('/password/reset', resetPassword);

// Social authentication
router.post('/social/:provider', socialAuth);

export default router;
