import express from 'express';
import {urlsRouter} from './routes/urls.js';
import mongoose from 'mongoose';
import http from 'http';
import {fileURLToPath} from 'url';
import path from 'path';

const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

app.use('/api/urls', urlsRouter);

mongoose.connect('mongodb://localhost/mma2025')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.listen(7001, () => {
    console.log('Server started on http://localhost:7001');
});