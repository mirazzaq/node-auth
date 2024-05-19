const jwt = require('jsonwebtoken');
import { StatusCodes } from "http-status-codes";

const jwtDataOptions = {
    secret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION
}

const { TokenExpiredError } = jwt;
const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).send({message: 'Unauthorized! access token expired'})
    }
    return res.status(StatusCodes.UNAUTHORIZED).send({message: 'Unauthorized'});
}

const verifyToken = (req, res, next) => {
    let t = req.headers["authorization"];
    if (!t) {
        res.status(StatusCodes.FORBIDDEN).send({message: 'Unauthenticated'})
    }
    const x = t.split('Bearer ');
    const token = x[1];

    if (!token) {
        res.status(StatusCodes.FORBIDDEN).send({message: 'Unauthenticated'})
    }

    jwt.verify(token, jwtDataOptions.secret, (err, decoded) => {
        if(err) {
            return catchError(err, res)
        }
        req.user = decoded;
        next();
    });
};

module.exports = {
    verifyToken,
}