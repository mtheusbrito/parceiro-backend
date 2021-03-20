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

import ClientUsuarioController from './app/controllers/ClientController';
import StatusBudgetUsuarioController from './app/controllers/StatusBudgetController';
import BudgetUsuarioController from './app/controllers/BudgetController';
import ProfileController from './app/controllers/ProfileController';
import AvatarController from './app/controllers/AvatarController';
import ConfigurationController from './app/controllers/adm/ConfigurationController';
import ReportController from './app/controllers/adm/ReportController';
import GratificationController from './app/controllers/adm/GratificationController';
import ItemController from './app/controllers/adm/ItemController';
import GratificationUserController from './app/controllers/GratificationController';

const upload = multer(multerConfig);

const routes = new Router();
routes.get('/', (req, res) => res.json({ message: 'Hello my friend!' }));
routes.get(
  '/orcamentos/servicos/:hash',
  BudgetController.reportServicesDownload
);

// routes free
routes.post('/adm/users', UserAdmController.store);
routes.post('/files', upload.single('file'), FileController.store);

// routes.post('/files', upload.single('file'));
routes.post('/session', SessionController.store);
// admin
routes.use('/adm', [adminMidlware]);
routes.use('/adm/reports', ReportController.index);
routes.put('/adm/users', UserAdmController.update);
routes.get('/adm/users', UserAdmController.index);
routes.delete('/adm/users/:id', UserAdmController.destroy);
routes.get('/adm/users/:id', UserAdmController.show);

routes.get('/adm/status-budgets', StatusBudgetController.index);
routes.post('/adm/status-budgets', StatusBudgetController.store);
routes.delete('/adm/status-budgets/:id', StatusBudgetController.destroy);
routes.put('/adm/status-budgets', StatusBudgetController.update);
routes.get('/adm/status-budgets/:id', StatusBudgetController.show);

routes.get('/adm/budgets', BudgetController.index);
routes.post('/adm/budgets', BudgetController.store);
routes.put('/adm/budgets', BudgetController.update);
routes.get('/adm/budgets/:id', BudgetController.show);

routes.delete('/adm/budgets/:id', BudgetController.destroy);
routes.put('/adm/budgets', BudgetController.update);
routes.get('/adm/budgets/:id/approve', BudgetController.approve);

routes.get('/adm/clients', ClientController.index);
routes.post('/adm/clients', ClientController.store);
routes.put('/adm/clients', ClientController.update);
routes.delete('/adm/clients/:id', ClientController.destroy);
routes.get('/adm/clients/:id', ClientController.show);

routes.get('/adm/configuration', ConfigurationController.show);
routes.put('/adm/configuration', ConfigurationController.update);

routes.post('/adm/gratification', GratificationController.store);
routes.put('/adm/gratification', GratificationController.update);

routes.post('/adm/itens', ItemController.store);
routes.delete('/adm/itens/:id', ItemController.delete);
routes.put('/adm/itens', ItemController.update);

routes.use('/', [authMiddleware]);
routes.use('/reports', ReportController.index);
routes.get('/clients', ClientUsuarioController.index);
routes.get('/clients/:id', ClientUsuarioController.show);
routes.post('/clients', ClientUsuarioController.store);
routes.put('/clients', ClientUsuarioController.update);
routes.delete('/clients/:id', ClientUsuarioController.destroy);

routes.get('/budgets', BudgetUsuarioController.index);
routes.get('/budgets/lasteds/:limit', BudgetUsuarioController.index);

routes.post('/budgets', BudgetUsuarioController.store);
routes.get('/budgets/:id', BudgetUsuarioController.show);

routes.get('/status-budgets', StatusBudgetUsuarioController.index);

routes.put('/profile', ProfileController.update);
routes.put('/avatar', upload.single('file'), AvatarController.update);

routes.get('/gratifications', GratificationUserController.index);
routes.get('/gratifications/lasteds/:limit', GratificationUserController.index);

export default routes;
