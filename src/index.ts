import 'reflect-metadata';
import * as http from './server/server';
import { HomeController } from './server/controllers/home-controller';
import config from './server/config/config';
import fs from 'fs';
import { Methods } from './server/contracts/methods';
import { Route } from './server/route';
import {container} from './config/container/container';
import { TYPES } from './config/container/types';
import { ServerError } from './server/contracts/server-error';
import { makeEjsTemplateEngine } from './server/factories/ejs-template-engine-factory';
import { ScriptPusher } from './server/server-push/script-pusher';
import { StylePusher } from './server/server-push/style-pusher';
import { SearchController } from './server/controllers/search-controller';

const server = new http.Server(
	{
		key: fs.readFileSync(config.sslKey),
		cert: fs.readFileSync(config.sslCert),
		genericServerError: container.get<ServerError>(TYPES.GenericServerError),
		notFoundServerError: container.get<ServerError>(TYPES.NotFoundServerError),
		templateEngine: makeEjsTemplateEngine(),
		serverPushers: [new ScriptPusher(), new StylePusher()]
	}, [
		new Route(
			Methods.GET,
			'/',
			new HomeController()
		),
		new Route(
			Methods.POST,
			'/search',
			new SearchController()
		)
	]);

server.listen(3000);