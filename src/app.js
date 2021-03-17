import express from 'express';
import path from 'path';
import cors from 'cors';
// import io from 'socket.io';
import routes from './routes';
import './database';

require('dotenv').config();

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors(process.env.URL_SITE));
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(
      '/reports',
      express.static(path.resolve(__dirname, '..', 'tmp', 'reports'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
