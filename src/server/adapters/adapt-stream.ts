import { Http2ServerRequest, Http2ServerResponse, ServerHttp2Stream } from 'http2';

export const adaptStream = (req: Http2ServerRequest, res: Http2ServerResponse): ServerHttp2Stream => {
	return {
		on: (event: any, callback: any) => req.on(event, callback),
		respond: () => {},
		end: (body: any) => res.end(body),
		pushStream: () => {}
	} as unknown as ServerHttp2Stream;
};