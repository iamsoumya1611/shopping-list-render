const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const items = require('./routes/items');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());

// CORS Middleware
app.use(cors(
    {origin: '*'}
));

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected successfully'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// API Routes
app.use('/api/items', items);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    
    // Serve the React app for any route
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => console.log(`Server started on port ${port}`));
