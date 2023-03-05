import createDebug from 'debug';
import http from 'http';


const debug = createDebug('SN');
const port = process.env.PORT || 3000;
const server = http.createServer()