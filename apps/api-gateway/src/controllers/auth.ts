import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  hashPassword, 
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  generateOTP,
  verifyRefreshToken
} from '../../../../packages/auth';
import {
  emailLoginSchema,
  phoneLoginSchema,
  otpLoginSchema,
  signupSchema,
  passwordResetRequestSchema,
  passwordResetSchema
} from '../../../../packages/shared';

const prisma = new PrismaClient();

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);
    
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone,
        name: data.name,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
      }
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    // Send verification OTP
    const otp = generateOTP();
    await prisma.oTPVerification.create({
      data: {
        userId: user.id,
        otp: otp,
        type: data.email ? 'EMAIL_VERIFICATION' : 'PHONE_VERIFICATION',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      }
    });

    // TODO: Send OTP via email/SMS

    res.status(201).json({
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
      message: 'User created successfully. Please verify your account.',
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message || 'Signup failed' });
  }
};

// Login with email
export const loginWithEmail = async (req: Request, res: Response) => {
  try {
    const data = emailLoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        password: true,
        isActive: true,
      }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    const isValidPassword = await verifyPassword(data.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    const { password, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message || 'Login failed' });
  }
};

// Login with phone
export const loginWithPhone = async (req: Request, res: Response) => {
  try {
    const data = phoneLoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { phone: data.phone },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        password: true,
        isActive: true,
      }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    const isValidPassword = await verifyPassword(data.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    const { password, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message || 'Login failed' });
  }
};

// Login with OTP
export const loginWithOTP = async (req: Request, res: Response) => {
  try {
    const data = otpLoginSchema.parse(req.body);

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.identifier },
          { phone: data.identifier }
        ]
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        isActive: true,
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    // Verify OTP
    const otpRecord = await prisma.oTPVerification.findFirst({
      where: {
        userId: user.id,
        otp: data.otp,
        type: 'LOGIN',
        verified: false,
        expiresAt: { gte: new Date() }
      }
    });

    if (!otpRecord) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as verified
    await prisma.oTPVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    res.json({
      user,
      tokens: {
        accessToken,
        refreshToken,
      }
    });
  } catch (error: any) {
    console.error('OTP login error:', error);
    res.status(400).json({ error: error.message || 'Login failed' });
  }
};

// Send OTP
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { identifier, type } = req.body;

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP
    await prisma.oTPVerification.create({
      data: {
        userId: user.id,
        otp: otp,
        type: type || 'LOGIN',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      }
    });

    // TODO: Send OTP via email/SMS
    console.log(`OTP for ${identifier}: ${otp}`);

    res.json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    res.status(400).json({ error: error.message || 'Failed to send OTP' });
  }
};

// Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { identifier, otp } = req.body;

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify OTP
    const otpRecord = await prisma.oTPVerification.findFirst({
      where: {
        userId: user.id,
        otp: otp,
        verified: false,
        expiresAt: { gte: new Date() }
      }
    });

    if (!otpRecord) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as verified
    await prisma.oTPVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    });

    // Update user verification status
    if (otpRecord.type === 'EMAIL_VERIFICATION') {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true }
      });
    } else if (otpRecord.type === 'PHONE_VERIFICATION') {
      await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true }
      });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(400).json({ error: error.message || 'Failed to verify OTP' });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Check if session exists
    const session = await prisma.session.findFirst({
      where: {
        userId: decoded.userId,
        refreshToken: token,
      }
    });

    if (!session) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    res.json({
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }
    });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Delete session
    await prisma.session.deleteMany({
      where: { token }
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(400).json({ error: error.message || 'Logout failed' });
  }
};

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const data = passwordResetRequestSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.identifier },
          { phone: data.identifier }
        ]
      }
    });

    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'If the account exists, a reset link will be sent' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP
    await prisma.oTPVerification.create({
      data: {
        userId: user.id,
        otp: otp,
        type: 'PASSWORD_RESET',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      }
    });

    // TODO: Send OTP via email/SMS
    console.log(`Password reset OTP for ${data.identifier}: ${otp}`);

    res.json({ message: 'If the account exists, a reset link will be sent' });
  } catch (error: any) {
    console.error('Password reset request error:', error);
    res.status(400).json({ error: error.message || 'Failed to process request' });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify OTP
    const otpRecord = await prisma.oTPVerification.findFirst({
      where: {
        userId: user.id,
        otp: otp,
        type: 'PASSWORD_RESET',
        verified: false,
        expiresAt: { gte: new Date() }
      }
    });

    if (!otpRecord) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // Mark OTP as verified
    await prisma.oTPVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    });

    // Delete all sessions for security
    await prisma.session.deleteMany({
      where: { userId: user.id }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    console.error('Password reset error:', error);
    res.status(400).json({ error: error.message || 'Failed to reset password' });
  }
};

// Social authentication
export const socialAuth = async (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    const { providerId, email, name } = req.body;

    // Check if social auth exists
    let socialAuth = await prisma.socialAuth.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            name: true,
            role: true,
            isActive: true,
          }
        }
      }
    });

    let user;

    if (socialAuth) {
      user = socialAuth.user;
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          role: 'CUSTOMER',
          emailVerified: true,
          socialAuth: {
            create: {
              provider,
              providerId,
            }
          }
        },
        select: {
          id: true,
          email: true,
          phone: true,
          name: true,
          role: true,
          isActive: true,
        }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email || undefined,
      role: user.role,
    });

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    });

    res.json({
      user,
      tokens: {
        accessToken,
        refreshToken,
      }
    });
  } catch (error: any) {
    console.error('Social auth error:', error);
    res.status(400).json({ error: error.message || 'Social authentication failed' });
  }
};
