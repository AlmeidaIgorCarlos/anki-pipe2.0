import {ServerPush} from '../contracts/server-push';

export class ScriptPusher implements ServerPush{
	pushAssets(stream: any, contentBody: string): void {
		// eslint-disable-next-line no-useless-escape
		const regexScript = /src=\"(.*?)\"/g;

		const assetsUrlsScript = contentBody.match(regexScript);
		let filteredUrlsScript;
		
		if(assetsUrlsScript && assetsUrlsScript.length > 0)
			filteredUrlsScript = assetsUrlsScript.map(e => {
				const url: string = e.substring(5, e.length-1);
				if(url.substring(0, 4) === 'http')
					return undefined;
				else return url;
			}).filter(e => e);
		
		
		if(filteredUrlsScript)
			filteredUrlsScript.forEach(assetUrl => {
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