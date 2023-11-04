const express=require("express")
const cors=require("cors");
const dotenv=require("dotenv")
const AuthRoutes=require("./routes/AuthRouting/AuthRoutes.js")
const UserRoutes=require("./routes/UserRoutings/UserRoutes.js")
const mongodbConnection=require("./db/config.js")
const cookieParser=require("cookie-parser")
// config the dotenv
dotenv.config();
// create react app
const app=express();
// connect to db
mongodbConnection();
// set application middlewares

app.use(express.urlencoded({extended: false}))
        app.use(cors({
          credentials: true,
          origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
          optionsSuccessStatus: 200,
        }))
app.use(express.json());

app.use(cookieParser())

// add routing prefix
app.get("/test",(req,res)=>res.send("success"))
app.use("/miraigate",AuthRoutes);
app.use("/miraigate",UserRoutes)


// define port
const PORT=process.env.PORT||9000;


app.listen(PORT,()=>{
  console.log(`app is running on port ${PORT}`)
})