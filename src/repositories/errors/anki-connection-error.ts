export class AnkiConnectionError extends Error {
	constructor () {
	  super('Anki Connect did not respond. Please make sure the plugin is installed');
	  this.name = 'ConnectionError';
	}
}