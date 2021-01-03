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
import { Ejs } from './server/template-engine/ejs';
import configTemplateEngine from './config/template-engine';

const ejs = new Ejs({
	dir: configTemplateEngine.dirname,
	ext: configTemplateEngine.ext
});

const server = new http.Server(
	{
		key: fs.readFileSync(config.sslKey),
		cert: fs.readFileSync(config.sslCert),
		genericServerError: container.get<ServerError>(TYPES.GenericServerError),
		notFoundServerError: container.get<ServerError>(TYPES.NotFoundServerError),
		templateEngine: ejs
	}, [
		new Route(
			Methods.GET,
			'/home/:id',
			new HomeController()
		)
	]);

server.listen(3000);