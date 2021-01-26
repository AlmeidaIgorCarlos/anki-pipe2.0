import {ServerPush} from '../contracts/server-push';

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
				});
			});
	}
}