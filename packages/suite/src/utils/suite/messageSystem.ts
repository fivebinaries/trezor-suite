import { verify, decode, Algorithm, Signature } from 'jws';

// TODO: use production ready key; move to suite-data?
export const secp256k1PublicKey = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE77bZRAszhhlCqJDokcvjlXOPPPRnAOh+
ZkxZDuo75OAmRZFUJtb3jZQrLRhMa/YwOjUHgSa350GIi5L5oJ59+A==
-----END PUBLIC KEY-----
`;

export const decodeMessageSystemJwsConfig = (jwsConfig: string): Signature | null => {
    return decode(jwsConfig);
};

export const verifyMessageSystemJwsConfig = (jwsConfig: string, alg: Algorithm): boolean => {
    return verify(jwsConfig, alg, secp256k1PublicKey);
};
