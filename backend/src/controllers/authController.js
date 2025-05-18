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
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'El email y la contraseña son obligatorios'
        });
    }
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error del servidor al procesar la solicitud. Intenta nuevamente.'
            });
        }
        if (!user) {
            // Mensaje más específico según la información disponible
            const errorMessage = info?.message === 'Incorrect password'
                ? 'Contraseña incorrecta'
                : (info?.message === 'User not found'
                    ? 'Usuario no encontrado'
                    : 'Credenciales incorrectas');

            return res.status(401).json({
                success: false,
                message: errorMessage
            });
        }
        if (err || !user) {
            return res.status(401).json({
                success: false,
                message: info?.message || 'Credenciales inválidas'
            });
        }

        const token = user.getSignedJwtToken(); // Generar token
        if (!loginField || !password) {
            return res.status(400).json({
                success: false,
                message: "Usuario/email y contraseña son requeridos"
            });
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Contraseña incorrecta"
            });
        }
        req.login(user, (err) => {
            if (err) return next(err);
            res.cookie('jwt', token, { // Opcional: enviar en cookie
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
            }).json({
                success: true,
                token, // Enviar token en body
                user: user.toAuthJSON()
            });
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
