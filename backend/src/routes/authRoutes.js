const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authRateLimiter, protect } = require('../middleware/auth');

//  públicas
router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.get('/logout', authController.logout);
router.post('/forgotpassword', authRateLimiter, authController.forgotPassword);
router.put('/resetpassword/:resettoken', authController.resetPassword);
router.get('/verify', authController.verifyToken);
router.post('/refresh', authController.refreshToken);

//  protegidas
router.use(protect); // Middleware de protección para las siguientes rutas
router.get('/me', authController.getMe);
router.put('/updatedetails', authController.updateDetails);
router.put('/updatepassword', authController.updatePassword);

module.exports = router;