import 'reflect-metadata';
import assert from 'assert';
import { createSandbox } from 'sinon';
import {StylePusher} from '../../../src/server/server-push/style-pusher';


describe('server.ts', () => {

	const scriptPusher = new StylePusher();
	const sinon = createSandbox();
    
	beforeEach(() => {
		sinon.restore();
	});

	describe('pushAssets', ()=>{		
		it('Once it is identified an external dependency, it must ignore it', ()=>{
			const contentBody = `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
    <title>AnkiPipe2.0</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
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
    
		it('Once it is identified a local css dependency, it must push the assert to the client', ()=>{
			const contentBody = `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
        <title>AnkiPipe2.0</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
        <link rel="stylesheet" href="views/styles/homepage-style.css">
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
	});
});