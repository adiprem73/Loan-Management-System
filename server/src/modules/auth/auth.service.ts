import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../../models/user.model';

const signToken = (id: string, role: UserRole) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const signup = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');

  // Public signup always creates a borrower
  const user = await User.create({ name, email, password, role: 'borrower' });
  const token = signToken(String(user._id), user.role);

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = signToken(String(user._id), user.role);

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};