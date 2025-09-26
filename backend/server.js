import express from 'express'
import dotenv from 'dotenv'
import { connectDB, sequelize } from './config/db.js';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.send('API is running');
})

// Sync models with DB (create tables if not exist)
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ All models synced with MySQL database');
});

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server Running on port http://localhost:${port}`);
});