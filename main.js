const express    = require('express')
const dotenv     = require('dotenv')
const cors       = require('cors')
const bodyParser = require('body-parser')
const connectDB  = require('./config/databaseConfig')


const userRoutes   = require('./routers/userRouter')
const deviceRoutes = require('./routers/deviceRouter')
const dataRoutes   = require('./routers/dataRouter')

// .env
dotenv.config(); 

// Database
connectDB();

// Express
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/user'  , userRoutes);
app.use('/device', deviceRoutes);
app.use('/data'  , dataRoutes);


app.listen(3000, () => {
  console.log(`Server is running on http://localhost: 3000`);
});
