import { Controller } from './contracts/controller';
import { Methods } from './contracts/methods';
import { match } from 'path-to-regexp';

export class Route {

	private readonly _method: Methods;
	private readonly _pathName: string;
	private readonly _controller: Controller;

	constructor(method: Methods, pathName: string, controller: Controller) {
		this._method = method;
		this._pathName = pathName;
		this._controller = controller;
	}

	get controller() {
		return this._controller;
	}

	public equals(route: Route): boolean {
		const matchPath = match(this._pathName, { decode: decodeURIComponent });
		const matched = Boolean(matchPath(route._pathName));

		if (matched && route._method === this._method)
			return true
		else return false
	}

}