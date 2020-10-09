const config = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const apiDatabase = require('../configs/api_database');

module.exports = {
    authenticate,
    create,
};

async function authenticate(res, { email, password }) {
    const user = await apiDatabase.Users.scope('withHash').findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.json({ message: 'Email or password is incorrect' })
    } else {
        const token = jwt.sign({sub: user.id}, config.secret, {expiresIn: '10d'});
        return {...omitHash(user.get()), token};
    }
}

async function create(res, args) {
    if (await apiDatabase.Users.findOne({ where: { email: args.email } })) {
        res.json({ message: 'Email "' + args.email + '" is already taken' })
    }

    if (args.password) {
        args.password = await bcrypt.hash(args.password, 15);
    }

    await apiDatabase.Users.create(args);
}


function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}
