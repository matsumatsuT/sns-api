const router = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const isAuthenticated = require("../middleware/isAuthenticated")

//呟き投稿用API
router.post("/post",  isAuthenticated, async(req, res) => {
  const {content} = req.body

  if(!content) return res.status(400).json("投稿内容がありません。")

  try {
    const postRes = await prisma.post.create({
      data: {
        content,
        authorId: req.userId
      }
    })
    return res.json(postRes)

  } catch(err) {
    res.status(401).json({message: "サーバーエラーです"})
  }
})

//呟き取得用API
router.get("/get_posts", async( req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: {createdAt: "desc"},
      include: {
        author: {
          include: {
            profile: true
          }
        }
      }
    })
    return res.json(latestPosts)

  }catch (err){
    res.status(401).json({message: "サーバーエラーです"})
  }
})

router.get("/:userId", async(req, res) => {
  const {userId} = req.params
  try {
    const postRes = await prisma.post.findMany({
      where: {
        authorId: Number(userId)
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: {
          include: {
            profile: true
          }
        }
      }
    })
    return res.json(postRes)
  }catch {
    res.status(500).json({message: "サーバーエラーです"})
  }
})


module.exports = router