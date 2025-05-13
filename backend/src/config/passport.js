const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

/**
 * - Local: username/password para login inicial
 * - JWT: Tokens para rutas protegidas
 */

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

                if (!user)
                    return done(null, false, { message: 'Credenciales inválidas' });

                const isMatch = await user.comparePassword(password);

                if (!isMatch)
                    return done(null, false, { message: 'Credenciales inválidas' });

                if (!user.active)
                    return done(null, false, { message: 'Esta cuenta ha sido desactivada' });

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),   // Extraer de Authorization Bearer

        req => { // Extraer de cookie

            let token = null;
            if (req && req.cookies) {
                token = req.cookies['token'];
            }
            return token;
        },
        // Extraer de query param 
        req => {
            let token = null;
            if (req && req.query && req.query.token) {
                token = req.query.token;
            }
            return token;
        }
    ]),
    secretOrKey: process.env.JWT_SECRET || 'gymshock_secret_dev'
};

passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id);

            if (!user)
                return done(null, false);

            if (!user.active)
                return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
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