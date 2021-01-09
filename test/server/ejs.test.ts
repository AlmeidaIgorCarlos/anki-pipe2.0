import 'reflect-metadata';
import assert from 'assert';
import sinon from 'sinon';
import { EjsTemplateEngine } from '../../src/server/template-engine/ejs-template-engine';
import path from 'path';

describe('generic-server-error.ts', () => {
	it('render should return template if view satisfied the condition', async () => {
		const ejs = new EjsTemplateEngine({
			dir: path.join(__dirname, 'view'),
			ext: 'ejs'
		});

		sinon.stub(ejs, 'isValid')
			.returns(true);

		const template = await ejs.render('@index', { hello: 'Hello World!' });

		assert.strictEqual(template, '<h1>Hello World!</h1>');
	});

	it('Given return view if the condition is not satisfied', async () => {
		const ejs = new EjsTemplateEngine({
			dir: path.join(__dirname, 'view'),
			ext: 'ejs'
		});

		sinon.stub(ejs, 'isValid')
			.returns(false);

		const template = await ejs.render('index', { hello: 'Hello World!' });

		assert.strictEqual(template, 'index');
	});

	it('Should return true if view satisfied condition', () => {
		const ejs = new EjsTemplateEngine({
			dir: path.join(__dirname, 'view'),
			ext: 'ejs'
		});

		assert(ejs.isValid('@index'));
	});
	it('Should return false if view does not satisfied condition', () => {
		const ejs = new EjsTemplateEngine({
			dir: path.join(__dirname, 'view'),
			ext: 'ejs'
		});

		assert(!ejs.isValid({}));
	});
	
});