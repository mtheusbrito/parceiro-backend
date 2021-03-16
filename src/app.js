import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
// import io from 'socket.io';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors('http:localhost:3000'));
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
<<<<<<< HEAD
=======

>>>>>>> 7ce84f1726c7dfb3d8cff6ff88d3aaa0673ec218
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
