const express    = require('express')
const dotenv     = require('dotenv')
const cors       = require('cors')
const bodyParser = require('body-parser')
const connectDB  = require('./config/databaseConfig')


const userRoutes   = require('./routers/userRouter')
const deviceRoutes = require('./routers/deviceRouter')
const dataRoutes   = require('./routers/dataRouter')

// .env
dotenv.config()

// Database
connectDB()

// Express
const app = express()


// HTTPS yönlendirmesini kaldır
app.disable('trust proxy');

// HTTP üzerinden çalıştır
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https') {
    return res.redirect(307, `http://${req.headers.host}${req.url}`);
  }
  next();
});

// Middlewares
app.use(bodyParser.json())

const corsOrigin ={
  origin: process.env.FRONTEND_URL, //or whatever port your frontend is using
  credentials:true,            
  optionSuccessStatus:200
}
app.use(cors(corsOrigin));


// Routes
app.use('/user'  , userRoutes)
app.use('/device', deviceRoutes)
app.use('/data'  , dataRoutes)


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});