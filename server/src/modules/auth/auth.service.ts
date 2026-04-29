import jwt from 'jsonwebtoken';
import User, { UserRole } from '../../models/user.model';

const signToken = (id: string, role: UserRole): string => {
  const secret = process.env.JWT_SECRET as string;
  // Cast options to any to avoid strict type issues with jsonwebtoken overloads
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' } as any);
};

export const signup = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');

  const user = await User.create({ name, email, password, role: 'borrower' });
  const token = signToken(String(user._id), user.role);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = signToken(String(user._id), user.role);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};