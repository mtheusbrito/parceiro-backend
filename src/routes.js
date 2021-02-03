import { Router } from 'express';

import multer from 'multer';
import UserController from './app/controllers/adm/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

const upload = multer(multerConfig);

const routes = new Router();

routes.get('/', (res) => res.json({ message: 'Hello Horld!' }));
routes.post('/usuarios', UserController.store);
routes.post('/usuarios', SessionController.store);
routes.use(authMiddleware);

routes.put('/usuarios', UserController.update);
routes.get('/usuarios', UserController.index);
routes.delete('/usuarios/:id', UserController.destroy);
// routes.post('/files', upload.single('file'));
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
