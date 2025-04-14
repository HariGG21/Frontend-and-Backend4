import { Router } from 'express';
import { registerUser , loginUser  } from '../controller/authControllers'; // Adjust the path as necessary
const router = Router();

// Route for user registration
router.post('/', registerUser);

// Route for user login
router.post('/login', loginUser );

export default router;



