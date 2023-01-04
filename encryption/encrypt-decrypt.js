const nosejsJSEncrypt = require('nodejs-jsencrypt');
const config = require('config');

function generateKeys() {
    var crypt = new nosejsJSEncrypt.JSEncrypt({ default_key_size: 1024 });
    crypt.getKey();
    const publicKey = crypt.getPublicKey();
    const privateKey = crypt.getPrivateKey();
    return {publicKey, privateKey};
}

function getConfig() {
    return config;
}

function getEncryptedLicense() {
	console.log("Test");
	
	// const licenseInfo = '{"validUntil": 1622313000000, "customer": "SeventhSenseConsulting"}';
    const licenseInfo = '{"validUntil": 11111111111, "customer": "SeventhSenseConsulting"}';
    const crypt = new nosejsJSEncrypt.JSEncrypt();
    crypt.setKey(config.publicKey);
    return crypt.encrypt(licenseInfo);
}

function getDecryptedLicense() {
    var crypt = new nosejsJSEncrypt.JSEncrypt();
    crypt.setKey(config.privateKey);
    return crypt.decrypt(config.encryptedLicense);
}

module.exports = {generateKeys, getConfig, getEncryptedLicense, getDecryptedLicense};
