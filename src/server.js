import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.js';
import { setupSwagger } from './docs/swagger.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Swagger
setupSwagger(app);

// API routes
app.use('/api', routes);

// Errors
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API listening on :${config.port} (${config.env})`);
  console.log(`Swagger UI at /docs`);
});
