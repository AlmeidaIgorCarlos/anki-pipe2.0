import { EjsTemplateEngine } from '../template-engine/ejs-template-engine';
import config from '../config/config';

export const makeEjsTemplateEngine = (): EjsTemplateEngine => {
	return new EjsTemplateEngine({
		dir: config.templateEngine.dirname,
		ext: config.templateEngine.ext
	});
};