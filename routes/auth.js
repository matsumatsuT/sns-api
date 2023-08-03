const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const identicon = require("../utils/identicon")


//新規ユーザ登録API
router.post("/register", async(req, res) => {
  const {username, email, password} = req.body
  const defaultUserIcon = identicon(email)
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      profile: { 
        create: {
          bio: "初めまして",
          profilePictureUrl: defaultUserIcon,
        }
      }
    },
    include: {
      profile: true
    }
  })
  return res.json({user})
})

//ログインAPI
router.post("/login", async( req, res) => {
  const {email, password} = req.body
  const user = await prisma.user.findUnique({where: {email}})

  if(!user) {
    return res.status(401).json({error: "ユーザが存在しません。"})
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if(!isPasswordValid) {
    return res.status(401).json({error: "パスワードが一致しません。"})
  }

  const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {
    expiresIn: "1d"
  })

  return res.json({token})
})

module.exports = router