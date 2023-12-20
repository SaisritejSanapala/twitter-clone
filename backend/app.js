require('dotenv').config();

const express = require('express');
const PORT = 4000 || process.env.PORT;
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const DATABASE = process.env.DATABASE

const MongoDB_URL = process.env.MongoDB_URL


global.__basedir = __dirname;

mongoose.connect(DATABASE);

mongoose.connection.on('connected', () => {
    console.log("DB connected");
})
mongoose.connection.on('error', (error) => {
    console.log("Some error while connecting to DB");
})

require('./models/user_model')
require('./models/tweet_model')

const corsOptions = {
    origin: "https://twitter-clone-frontend-42gm.onrender.com", 
}


app.use(cors(corsOptions));
app.use(express.json());


app.use(require('./routes/user_route'))
app.use(require('./routes/tweet_route'))
app.use(require('./routes/file_route'))

app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});