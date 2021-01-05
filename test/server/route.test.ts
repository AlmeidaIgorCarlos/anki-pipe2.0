import assert from 'assert';
import { Methods } from '../../src/server/contracts/methods';
import { BaseController } from '../../src/server/controllers/base-controller';
import { Route } from '../../src/server/route';

describe('route.ts', () => {
	describe('equals', () => {
		it('Once it is called it must returns true if pathName is equal to the pathName of the given route', () => {
			const firstRoute = new Route(Methods.GET, '/', new BaseController());
			const secondRoute = new Route(Methods.GET, '/', new BaseController());
			assert(firstRoute.equals(secondRoute));
		});

		it('Once it is called it must returns false if pathName is different to the pathName of the given route', () => {
			const firstRoute = new Route(Methods.GET, '/', new BaseController());
			const secondRoute = new Route(Methods.GET, '/home', new BaseController());
			assert(!firstRoute.equals(secondRoute));
		});

		it('Once it is called it must returns true if pathName and method is equal to the pathName and method from the given route', () => {
			const firstRoute = new Route(Methods.GET, '/', new BaseController());
			const secondRoute = new Route(Methods.GET, '/', new BaseController());
			assert(firstRoute.equals(secondRoute));
		});

		it('Once it is called it must returns false if method is not equal to the method from the given route', () => {
			const firstRoute = new Route(Methods.GET, '/', new BaseController());
			const secondRoute = new Route(Methods.POST, '/', new BaseController());
			assert(!firstRoute.equals(secondRoute));
		});


	});
});