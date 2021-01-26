import 'reflect-metadata';
import assert from 'assert';
import { createSandbox } from 'sinon';
import {ScriptPusher} from '../../../src/server/server-push/script-pusher';


describe('server.ts', () => {

	const scriptPusher = new ScriptPusher();
	const sinon = createSandbox();
    
	beforeEach(() => {
		sinon.restore();
	});

	describe('pushAssets', ()=>{		
		it('Once it is identified a local javascript dependency, it must push the asset to the client', ()=>{
			const contentBody = `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
        <title>AnkiPipe2.0</title>
        <script src="./views/scripts/homepage-script.js"></script>

        </head>
        <body>
            <section id="search-content">
                <textarea class="form-control" placeholder="Type your sentence right here" id="floatingTextarea"></textarea>
            </section>
            <section id="result-content">
            </section>
        </body>
        </html>`;

			const stream = {
				pushStream: sinon.spy()
			};
    
			scriptPusher.pushAssets(stream, contentBody);

			assert(stream.pushStream.calledOnce);
		});
        
		it('Once it is identified a external javascript dependency, it must not push the external asset to the client', ()=>{
			const contentBody = `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
        <title>AnkiPipe2.0</title>
        <script src="http://views/scripts/homepage-script.js"></script>

        </head>
        <body>
            <section id="search-content">
                <textarea class="form-control" placeholder="Type your sentence right here" id="floatingTextarea"></textarea>
            </section>
            <section id="result-content">
            </section>
        </body>
        </html>`;

			const stream = {
				pushStream: sinon.spy()
			};
    
			scriptPusher.pushAssets(stream, contentBody);

			assert(stream.pushStream.calledOnce === false);
		});
	});
});