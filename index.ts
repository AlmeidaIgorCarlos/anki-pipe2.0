import * as http from './server/server';
import { HomeController } from './controllers/home-controller';
import { NotFoundController } from './controllers/not-found-controller';
import config from './server/config/config';
import fs from 'fs';

const server = new http.Server({
	key: fs.readFileSync(config.sslKey),
	cert: fs.readFileSync(config.sslCert)
});

server.setRoutes([{
	method: http.Methods.GET,
	pathname: '/home/:id',
	controller: new HomeController()
}, {
	method: http.Methods.ALL,
	pathname: '(.*)',
	controller: new NotFoundController()
}]);

server.listen(8443);