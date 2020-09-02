const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("./users-model")
const middleware = require("./users-middleware")

const router = express.Router()

router.get("/api/users", middleware.restrict(), async (req, res, next) => {
    try {
        res.json(await Users.find())
    } catch (error) {
        next(err)
    }
})

router.post("/api/register", async (req, res, next) => {
    try {
        const { username, password} = req.body
        const user = await Users.findBy({username}).first()

        if (user) { 
            return res.status(409).json({
                message: "Sorry, you're not original."
            })
        }

        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 14)
         })

         res.status(201).json(newUser)
        
    } catch (err) {
        next(err)
    }
})

router.post("/api/login", middleware.restrict(), async (req, res, next) => {
    try {
        const { username, password} = req.body
        const user = await Users.findBy({username}).first()

        if (user) { 
            return res.status(401).json({
                message: "Sorry, you're not real."
            })
        }

        const passwordValid = await bcrypt.compare(password, user.password)

        if (!passwordValid) {
            return res.status(401).json({
                message: "Try again, but use the correct credentials next time."
            })
        }
        req.session.user = user

         res.status(200).json({
             message: `Welcome to the party, pal, ${user.username}`
         })
         
    } catch (error) {
        next(err)
    }
}) 

module.exports = router