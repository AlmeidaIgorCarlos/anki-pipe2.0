import assert from 'assert';
import { Methods } from '../../src/server/contracts/methods';
import { HomeController } from '../../src/server/controllers/home-controller';
import { NotFoundController } from '../../src/server/controllers/not-found-controller';
import { Route } from '../../src/server/route';

describe('route.ts', () => {
    describe('equals', () => {
        it('Once it is called it must returns true if pathName is equal to the pathName of the given route', () => {
            const firstRoute = new Route(Methods.GET, '/', new NotFoundController())
            const secondRoute = new Route(Methods.GET, '/', new NotFoundController())
            assert(firstRoute.equals(secondRoute))
        });

        it('Once it is called it must returns false if pathName is different to the pathName of the given route', () => {
            const firstRoute = new Route(Methods.GET, '/', new NotFoundController())
            const secondRoute = new Route(Methods.GET, '/home', new NotFoundController())
            assert(!firstRoute.equals(secondRoute))
        });

        it('Once it is called it must returns true if pathName and method is equal to the pathName and method from the given route', () => {
            const firstRoute = new Route(Methods.GET, '/', new NotFoundController())
            const secondRoute = new Route(Methods.GET, '/', new NotFoundController())
            assert(firstRoute.equals(secondRoute))
        });

        it('Once it is called it must returns false if method is not equal to the method from the given route', () => {
            const firstRoute = new Route(Methods.GET, '/', new NotFoundController())
            const secondRoute = new Route(Methods.POST, '/', new NotFoundController())
            assert(!firstRoute.equals(secondRoute))
        });


    });
});