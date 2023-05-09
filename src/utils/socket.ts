import { Server } from 'socket.io';
import http from 'http';

class SocketConnection {
  public io: Server;

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_APP_URL,
        methods: ['GET', 'POST'],
      },
    });

    this.addReceptionSockets();
  }

  private addReceptionSockets() {
    this.io.on('connection', (socket) => {
      socket.on('refresh-reception-appointments', (message) => {
        this.io.emit('refresh-reception-appointments', message);
      });

      socket.on('refresh-doctor-appointments', (message) => {
        this.io.emit('refresh-doctor-appointments', message);
      });
    });

    this.io.on('disconnect', (socket) => {
      console.log('a user disconnected');
    });
  }
}

export default SocketConnection;
