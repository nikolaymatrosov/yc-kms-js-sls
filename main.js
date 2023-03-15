import {cloudApi, serviceClients, Session} from '@yandex-cloud/nodejs-sdk';

const {kms: {symmetric_crypto_service: {SymmetricDecryptRequest}}} = cloudApi;

const {CIPHERTEXT, KEY_ID} = process.env;
const session = new Session();
const client = session.client(serviceClients.SymmetricCryptoServiceClient);

const result = client.decrypt(
    SymmetricDecryptRequest.fromPartial({
        keyId: KEY_ID,
        ciphertext: Buffer.from(CIPHERTEXT, 'base64'),
    })
);

export const handler = async function () {
    const secret = await result;
    return {
        statusCode: 200,
        body: Buffer.from(secret.plaintext).toString(),
    };
};
