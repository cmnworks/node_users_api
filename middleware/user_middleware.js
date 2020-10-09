const jwt = require('express-jwt');
const { secret } = require('config.json');
const apiDatabase = require('configs/api_database');

module.exports = {
    handleError,
    handleRequest,
    handleAuthentication
}
function handleError(err, req, res, next) {
    switch (true) {
        case err.name === 'UnauthorizedError':
            return res.status(401).json({ message: 'Unauthorized' });
        case typeof err === 'string':
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        default:
            return res.status(500).json({ message: err.message });
    }
}

function handleRequest(req, next, schema) {
    const options = {stripUnknown: true, abortEarly: false, allowUnknown: true};
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        next(`Request error: ${error.details.map(val => val.message).join(', ')}`);
    } else {
        req.body = value;
        next();
    }
}

function handleAuthentication() {
    return [
        jwt({ secret, algorithms: ['HS256'] }),
        async (req, res, next) => {
            const user = await apiDatabase.Users.findByPk(req.user.sub);
            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });
            req.user = user.get();
            next();
        }
    ];
}

