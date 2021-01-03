import { ServerHttp2Stream } from 'http2';

export const serverError = (stream: ServerHttp2Stream, err: Error) => {
	stream.respond({
		'content-type': 'text/html; charset=utf-8',
		':status': 500
	});
	const stack = process.env.NODE_ENV !== 'production' ? err.stack : '';
	stream.end(`<pre><h1>Internal Server Error</h1><br>${stack}</pre>`);
};

export const notFound = (stream: ServerHttp2Stream) => {
	stream.respond({
		'content-type': 'text/html; charset=utf-8',
		':status': 404
	});
	stream.end('<pre><h1>Not Found</h1></pre>');
};