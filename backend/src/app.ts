import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import uploadRouter from './routes/upload';
import commentsRouter from './routes/comments';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/upload', uploadRouter);
app.use('/comments', commentsRouter);

app.get('/', (req, res) => res.send({ status: 'ok' }));

export default app;