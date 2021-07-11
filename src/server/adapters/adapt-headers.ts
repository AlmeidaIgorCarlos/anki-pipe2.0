import { Http2ServerRequest } from 'http2';

export const adaptHeaders = (req: Http2ServerRequest) => {
	return {
		':method': req.method,
		':path': req.url,
		':authority': req.headers.host,
		':scheme': 'https',
		'user-agent': req.headers['user-agent'],
		accept: req.headers.accept,
		'accept-language': req.headers['accept-language'],
		'accept-encoding': req.headers['accept-encoding'],
		referer: req.headers.host,
		cookie: req.headers.cookie,
		pragma: req.headers.pragma,
		'cache-control': req.headers['cache-control'],
		te: null,
	};
};