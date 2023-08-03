const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const isAuthenticated = require("../middleware/isAuthenticated")

//ユーザ情報取得用API
router.get("/find", isAuthenticated, async(req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {id: req.userId}
    })
    if(!user) return res.status(404).json({message: "ユーザが見つかりませんでした。"})
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    })
  } catch(err) {
    res.status(500).json({message: "サーバーエラー"})
  }
})

// プロフィール取得用API
router.get("/profile/:userId", async(req, res) => {
  const {userId} = req.params

  try {
    const profile = await prisma.profile.findUnique({
      where: {userId: Number(userId)
      },
      include: {
        user: true
      }
    })
    if(!profile) return res.status(404).json({message: "プロフィールが見つかりませんでした。"})
    return res.json(profile)
  } catch(err) {
    res.status(500).json({message: "サーバーエラー"})
  }
})

module.exports = router