const kms = require("yandex-cloud/api/kms/v1");

const {CIPHERTEXT, KEY_ID} = process.env;

const cryptoService = new kms.SymmetricCryptoService();

// Если быстро запустить функцию в логах можно будет увидеть, что секрет
// запрашивался не на каждый вызов. Тем самым вынеся расшифровку секрета из тела
// функции обработчика мы можем сэкономить запросы к KMS.
console.log("before decrypt");
const response = cryptoService.decrypt({
    ciphertext: Buffer.from(CIPHERTEXT, 'base64'), keyId: KEY_ID
});
console.log("after decrypt");


module.exports.handler = async function () {
    const secret = await response;
    return {
        statusCode: 200,
        body: Buffer.from(secret.plaintext).toString(),
    };
};