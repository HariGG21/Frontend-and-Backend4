import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
req.user = decoded;
        next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};