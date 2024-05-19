// const db = require('../models/index');
import * as db from '../models/index';
import { StatusCodes } from "http-status-codes";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {createToken, verifyExpiration} = db.authToken;



const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await db.User.findOne({
            where: {email}
        });
        if (userExists) {
            return res.status(StatusCodes.BAD_REQUEST).send({message: 'Email is already taken'})
        }
        await db.User.create({
            name,
            email,
            password: await bcrypt.hash(password, 15)
        });

        return res.status(StatusCodes.CREATED).send({message: 'Registered successfully'})
    } catch (e) {
        console.log(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error: 'Error while registering user'});
    }
}

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.User.findOne({
            where: {email}
        });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json('Email not found');
        }


        // Verify password
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(StatusCodes.NOT_FOUND).json('Incorrect email and password combination');
        }


        // Authenticate user with jwt
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION
        });
   
        let refreshToken = await createToken(user);

        res.status(StatusCodes.OK).send({
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: token,
            refreshToken
        });
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message:'Sign in error', error});
    }
}

const refreshToken = async (req, res) => {
    const {refreshToken: requestToken} = req.body;
    if (refreshToken == null) {
        return res.status(StatusCodes.FORBIDDEN).send({message: 'Refresh token is required'});
    } 
    try {
        let refreshToken = await db.authToken.findOne({where: {token: requestToken}});
        if (!refreshToken) {
            res.status(StatusCodes.FORBIDDEN).send({message: 'invalid token'});
            return;
        }
        if (verifyExpiration(refreshToken)) {
            db.authToken.destroy({ where: { id: refreshToken.id } });
            res.status(StatusCodes.FORBIDDEN).send({message: 'Your session is expired, please login again'});
            return;
        }

        const user = await db.User.findOne({
            where: {id: refreshToken.user},
            attributes: {
                exclude: ['password']
            }
        });

        let newAccessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        });

        return res.status(StatusCodes.OK).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token
        });

    } catch(error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: error});
    }
};

module.exports = {
    registerUser,
    signInUser,
    refreshToken
}