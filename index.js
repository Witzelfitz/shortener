import express from 'express';
import {urlsRouter} from './routes/urls.js';
import mongoose from 'mongoose';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World von Beni!');
});

app.use('/api/urls', urlsRouter);

mongoose.connect('mongodb://localhost/mma2025')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.listen(7001, () => {
    console.log('Server started on http://localhost:7001');
});