const bcrypt = require('bcryptjs')
const Users = require("./users-model")

const restrict = () => { 
    const authError = { 
        message: "You have failed me for the last time."
    }

    return async (req, res, next) => { 
        try { 
            if (!req.session || !req.session.user ) {
                return res.status(401).json(authError)
            }
            next()
            }  catch (err) {
                next(err)
        }
    }
}

module.exports = {
    restrict,
}