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

app.use(cors({ origin: "*", credentials: true }));

app.disable('trust proxy');



// Middlewares
app.use(bodyParser.json())



// Routes
app.use('/user'  , userRoutes)
app.use('/device', deviceRoutes)
app.use('/data'  , dataRoutes)


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});