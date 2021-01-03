import { ServerHttp2Stream } from 'http2';

export interface ServerError{
    handle(stream: ServerHttp2Stream, err: Error): void
}