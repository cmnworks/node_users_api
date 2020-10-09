const express = require('express');
const router = express.Router();
const Joi = require('joi');
const userMiddleware = require('middleware/user_middleware');
const userService = require('services/user_service');

router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    userMiddleware.handleRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(res, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    userMiddleware.handleRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(res, req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}
