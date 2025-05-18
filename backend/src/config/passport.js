// src/config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

// Estrategia email/password
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const normalizedEmail = email.toLowerCase().trim();
                const user = await User.findOne({ email: normalizedEmail }).select('+password');

                if (!user) {
                    return done(null, false, { message: 'Credenciales inválidas' });
                }

                const isMatch = await user.comparePassword(password);

                if (!isMatch) {
                    return done(null, false, { message: 'Credenciales inválidas' });
                }

                if (user.active === false) {
                    return done(null, false, { message: 'Cuenta desactivada' });
                }
                
                // Actualizar último login
                user.lastLogin = Date.now();
                await user.save({ validateBeforeSave: false });
                
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Estrategia JWT
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'ammae_jwt_secret_key'
        },
        async (jwtPayload, done) => {
            try {
                const user = await User.findById(jwtPayload.id);
                
                if (!user) {
                    return done(null, false);
                }
                
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

// Serialización/deserialización para sesiones
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;