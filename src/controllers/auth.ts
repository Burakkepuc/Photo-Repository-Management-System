import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

require('dotenv').config();

export const register = async (req: Request, res: Response) => {
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({message: 'Please fill in all fields'});
  }

  try {
    const user = new User({username, email, password});
    await user.save();
    res.json({message: 'Registration successful'});
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export const login = async (req: Request, res: Response) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: 'Please fill in all fields'});
  }

  try {
    const user = await User.findOne({username});
    if (!user) {
      return res.status(400).json({message: 'User does not exist'});
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign(
      {userId: user._id},
      process.env.SECRET_KEY as string,
      {
        expiresIn: '1 hour',
      }
    );
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.json({message: 'Logged in successfully'});
  } catch (error: any) {
    return res.status(500).json({message: error.message});
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.json({message: 'Logout successful'});
};
