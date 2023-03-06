import createDebug from 'debug';
import { dbConnect } from './db/db.connect.js';
import http from 'http';
import { app } from './app.js';

const debug = createDebug('CH5:index');
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));

server.on('error', (error) => {
  debug('Server error:', error.message);
});

server.on('listening', () => {
  debug('Listening in http://localhost:' + PORT);
});
