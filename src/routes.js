import { Router } from 'express';

import multer from 'multer';
import UserAdmController from './app/controllers/adm/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import adminMidlware from './app/middlewares/admin';
import multerConfig from './config/multer';

const upload = multer(multerConfig);

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Hello my friend!' }));

// usuarioPadrao
routes.post('/files', upload.single('file'), FileController.store);

routes.post('/files', upload.single('file'));
routes.post('/session', SessionController.store);
// admin
routes.use('/adm', [adminMidlware]);
routes.post('/adm/users', UserAdmController.store);
routes.put('/adm/users', UserAdmController.update);
routes.get('/adm/users', UserAdmController.index);
routes.delete('/adm/users/:id', UserAdmController.destroy);

routes.use('/', [authMiddleware]);

export default routes;
