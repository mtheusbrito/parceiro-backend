import { Router } from 'express';

import multer from 'multer';
import UserAdmController from './app/controllers/adm/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import adminMidlware from './app/middlewares/admin';
import multerConfig from './config/multer';
import StatusBudgetController from './app/controllers/adm/StatusBudgetController';
import BudgetController from './app/controllers/adm/BudgetController';
import ClientController from './app/controllers/adm/ClientController';

const upload = multer(multerConfig);

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Hello my friend!' }));
// routes free
routes.post('/adm/users', UserAdmController.store);
routes.post('/files', upload.single('file'), FileController.store);

routes.post('/files', upload.single('file'));
routes.post('/session', SessionController.store);
// admin
routes.use('/adm', [adminMidlware]);
routes.put('/adm/users', UserAdmController.update);
routes.get('/adm/users', UserAdmController.index);
routes.delete('/adm/users/:id', UserAdmController.destroy);

routes.get('/adm/status-budgets', StatusBudgetController.index);
routes.post('/adm/status-budgets', StatusBudgetController.store);
routes.delete('/adm/status-budgets/:id', StatusBudgetController.destroy);
routes.put('/adm/status-budgets', StatusBudgetController.update);

routes.get('/adm/budgets', BudgetController.index);
routes.post('/adm/budgets', BudgetController.store);
routes.delete('/adm/budgets/:id', BudgetController.destroy);
routes.put('/adm/budgets', BudgetController.update);

routes.get('/adm/clients', ClientController.index);
routes.post('/adm/clients', ClientController.store);
routes.put('/adm/clients', ClientController.update);
routes.delete('/adm/clients/:id', ClientController.destroy);

routes.use('/', [authMiddleware]);

export default routes;
