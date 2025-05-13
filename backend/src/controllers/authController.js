const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.register = asyncHandler(async (req, res, next) => {// POST /api/auth/register
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorResponse('Este correo electrónico ya está registrado', 400));
    }

    // Crear usuario (username es opcional, se generará automáticamente si no se proporciona)
    const user = await User.create({
        email,
        password,
        username // Si existe en el cuerpo de la solicitud se usa, si no, se generará automáticamente
    });
    // Generar token para verificación de email (deshabilitado en desarrollo)
    // const verificationToken = crypto.randomBytes(20).toString('hex');
    // user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    // await user.save({ validateBeforeSave: false });
    // Aquí se enviaría el email de verificación en producción
    sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {//  @route   POST /api/auth/login

    const { email, password } = req.body;
    if (!email || !password)
        return next(new ErrorResponse('Por favor ingresa email y contraseña', 400));

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return next(new ErrorResponse('Credenciales inválidas', 401));

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
        return next(new ErrorResponse('Credenciales inválidas', 401));

    if (!user.active)
        return next(new ErrorResponse('Esta cuenta ha sido desactivada', 401));

    user.lastLogin = Date.now();    // Actualizar último login
    await user.save({ validateBeforeSave: false });
    sendTokenResponse(user, 200, res);
});

exports.logout = asyncHandler(async (req, res, next) => {//  @route   GET /api/auth/logout

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente'
    });
});

exports.getMe = asyncHandler(async (req, res, next) => {// usuario actual  GET /api/auth/me
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

exports.updateDetails = asyncHandler(async (req, res, next) => { //PUT /api/auth/updatedetails private
    const fieldsToUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        weightUnit: req.body.weightUnit
    };

    Object.keys(fieldsToUpdate).forEach( // Limpiar campos undefined

        key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {// PUT /api/auth/updatepassword  private 
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Contraseña actual incorrecta', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {//   POST /api/auth/forgotpassword publico
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse('No existe un usuario con ese email', 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`; // Crear URL de reseteo

    // En producción, enviar email
    // await sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({
        success: true,
        message: 'Email enviado',
        resetUrl // Solo para desarrollo
    });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {//PUT /api/auth/resetpassword/:resettoken publico
    const resetPasswordToken = crypto //token hasheado
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user)
        return next(new ErrorResponse('Token inválido o expirado', 400));

    user.password = req.body.password;    // para nueva contraseña
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});

exports.verifyToken = asyncHandler(async (req, res, next) => {//GET /api/auth/verify
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {    // Obtener token de header || cookie
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(200).json({
            success: false,
            isValid: false
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verificar token

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(200).json({
                success: false,
                isValid: false
            });
        }

        return res.status(200).json({
            success: true,
            isValid: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        return res.status(200).json({
            success: false,
            isValid: false
        });
    }
});

exports.refreshToken = asyncHandler(async (req, res, next) => {//POST /api/auth/refresh
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new ErrorResponse('No se proporcionó token de refresco', 400));
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorResponse('Usuario no encontrado', 404));
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        return next(new ErrorResponse('Token de refresco inválido', 401));
    }
});
// para enviar token como respuesta
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();
    const options = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000),// 30 dias
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production')     // Cookies seguras en producción
        options.secure = true;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture
            }
        });
};