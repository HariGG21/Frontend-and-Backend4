import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';  // Ensure this path is correct

// Register a new user
const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  // Validate input fields
  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email, and password are required' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username: name, email, password: hashedPassword });
    await newUser.save();

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    // Generate a token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Respond with the token and user data
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Error during registration:', err);
    if (err instanceof Error) {
      res.status(500).json({ message: 'Error registering user', error: err.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred during registration' });
    }
  }
};

// Log in a user
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Respond with the token and user data
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Error during login:', err);
    if (err instanceof Error) {
      res.status(500).json({ message: 'Error logging in', error: err.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred during login' });
    }
  }
};

export { registerUser, loginUser };
