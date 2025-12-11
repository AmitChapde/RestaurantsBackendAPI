import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import restaurantsRouter from './routes/restaurants.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.use('/', restaurantsRouter);


app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
