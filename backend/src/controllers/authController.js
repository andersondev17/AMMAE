const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const passport = require('passport');

exports.register = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Email y contraseña son requeridos', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new ErrorResponse('Usuario ya existe', 400));

    const user = await User.create({ email: email.toLowerCase().trim(), password });

    // Autenticar directamente con Passport
    req.login(user, (err) => {
        if (err) return next(new ErrorResponse('Error al registrar', 500));
        res.status(201).json({
            success: true,
            user: user.toAuthJSON() // Método en el modelo User que devuelve datos seguros
        });
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(new ErrorResponse('Error de autenticación', 500));
        if (!user) return next(new ErrorResponse(info.message || 'Credenciales inválidas', 401));
        
        const token = user.getSignedJwtToken();
        
        res.status(200).json({
            success: true,
            token,
            user: user.toAuthJSON()
        });
    })(req, res, next);
});
    
exports.logout = asyncHandler(async (req, res) => {
    req.logout(() => {
        res.clearCookie('connect.sid'); // Si usas sesiones
        res.status(200).json({ success: true });
    });
});

exports.getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user.toAuthJSON()
    });
});

exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };

    // Limpiar campos undefined
    Object.keys(fieldsToUpdate).forEach(key => {
        if (!fieldsToUpdate[key]) delete fieldsToUpdate[key];
    });

    const user = await User.findByIdAndUpdate(
        req.user.id,
        fieldsToUpdate,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: user
    });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    // Validar campos
    if (!currentPassword || !newPassword) {
        return next(new ErrorResponse("Debes proporcionar la contraseña actual y la nueva", 400));
    }

    const user = await User.findById(req.user.id).select("+password");

    // Verificar contraseña actual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return next(new ErrorResponse("Contraseña actual incorrecta", 401));
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Contraseña actualizada correctamente"
    });
});
