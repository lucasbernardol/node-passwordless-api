import express from 'express';

import helmet from 'helmet';
import morgan from 'morgan';

import cors from 'cors';
import hpp from 'hpp';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(helmet());
app.use(cors());

app.use(hpp());

app.use(morgan('dev'));

export { app };
