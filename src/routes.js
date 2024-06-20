import { Router } from 'express';

import UserController from '@controllers/UserController';

import { verifyMagicLink } from '@middlewares/verifyMagicLink';
import { authenticate } from '@middlewares/authenticate';

export const routes = Router();

routes.get('/api/users/me', authenticate(), UserController.me);

routes.post('/api/users/magic-link', UserController.login);
routes.post('/api/users/verify', verifyMagicLink(), UserController.verify);
