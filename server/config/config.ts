import path from 'path';

export default {
	sslKey: path.join(__dirname, '..', 'ssl', 'localhost-privkey.pem'),
	sslCert: path.join(__dirname, '..', 'ssl', 'localhost-cert.pem')
};