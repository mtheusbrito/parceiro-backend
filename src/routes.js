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
routes.post('/session', SessionController.store);
// usuarioPadrao
routes.post('/files', upload.single('file'), FileController.store);
routes.use(authMiddleware);

// routes.post('/files', upload.single('file'));

// admin
routes.use(adminMidlware);
routes.post('/adm/usuarios', UserAdmController.store);
routes.put('/adm/usuarios', UserAdmController.update);
routes.get('/adm/usuarios', UserAdmController.index);
routes.delete('/adm/usuarios/:id', UserAdmController.destroy);

export default routes;
