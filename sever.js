const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")

const PORT = 8000
const authRoute = require("./routes/auth")
const postsRoute = require("./routes/posts")
const usersRoute = require("./routes/users")

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/posts", postsRoute)
app.use("/api/users", usersRoute)



app.listen(PORT, () => console.log("sever listen", PORT))