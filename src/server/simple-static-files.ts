import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { StaticFiles } from './contracts/static-files';

export class SimpleStaticFiles implements StaticFiles {
	constructor (private readonly staticPaths: string[]) {}

	async getFile (uri: string) {
		if (this.staticPaths.some(staticPath => uri.includes(staticPath))) {
			const isFilePath = uri.split('.').length > 1;
			const filePath = path.join(process.cwd(), uri);
			if (isFilePath && fs.existsSync(filePath)) {
				const readFile = promisify(fs.readFile);
				return readFile(filePath)
					.then((file) => Promise.resolve(file))
					.catch(err => Promise.reject(err));
			}
		}

		return Promise.resolve(null);
	}
}