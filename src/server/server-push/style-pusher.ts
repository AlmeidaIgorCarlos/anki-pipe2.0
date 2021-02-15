import {ServerPush} from '../contracts/server-push';
import { constants as http2Constants } from 'http2';

const NGHTTP2_REFUSED_STREAM = http2Constants.NGHTTP2_REFUSED_STREAM;

export class StylePusher implements ServerPush{
	pushAssets(stream: any, contentBody: string): void {
		// eslint-disable-next-line no-useless-escape
		const regex = /href=\"(.*?)\"/g;

		const assetsUrls = contentBody.match(regex);
		let filteredUrls;
        
		if(assetsUrls && assetsUrls.length > 0)
			filteredUrls = assetsUrls.map(e => {
				const url: string = e.substring(6, e.length-1);
				if(url.substring(0, 4) === 'http')
					return undefined;
				else return url;
			}).filter(e => e);
        
        
		if(filteredUrls)
			filteredUrls.forEach(assetUrl => {
				stream.pushStream({':path': assetUrl?.substring(1, assetUrl.length)}, (err: any, localStream: any)=>{
					if(err)
						throw err;
            
					localStream.respondWithFile(assetUrl, {
						'status': 200,
					});

					localStream.on('error', (err: any) => {
						const isRefusedStream = err.code === 'ERR_HTTP2_STREAM_ERROR' &&
												localStream.rstCode === NGHTTP2_REFUSED_STREAM;
						if (!isRefusedStream)
						  throw err;
					  });
				});
			});
	}
}