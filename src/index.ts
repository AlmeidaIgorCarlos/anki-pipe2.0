import * as http from './server/server';
import { HomeController } from './server/controllers/home-controller';
import { NotFoundController } from './server/controllers/not-found-controller';
import config from './server/config/config';
import fs from 'fs';
import { Methods } from './server/contracts/methods';
import { Route } from './server/route';

const server = new http.Server({
	key: fs.readFileSync(config.sslKey),
	cert: fs.readFileSync(config.sslCert)
}, [
	new Route(
		Methods.GET,
		'/home/:id',
		new HomeController()
	),
	new Route(
		Methods.ALL,
		'(.*)',
		new NotFoundController()
	)
]);

server.listen(8443);