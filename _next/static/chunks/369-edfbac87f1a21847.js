(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[369],{

/***/ 2372:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({});


/***/ }),

/***/ 6726:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const bignumber_js_1 = __webpack_require__(1267);
class Ar {
    /**
     * Method to take a string value and return a bignumber object.
     *
     * @protected
     * @type {Function}
     * @memberof Arweave
     */
    BigNum;
    constructor() {
        // Configure and assign the constructor function for the bignumber library.
        this.BigNum = (value, decimals) => {
            let instance = bignumber_js_1.BigNumber.clone({ DECIMAL_PLACES: decimals });
            return new instance(value);
        };
    }
    winstonToAr(winstonString, { formatted = false, decimals = 12, trim = true } = {}) {
        let number = this.stringToBigNum(winstonString, decimals).shiftedBy(-12);
        return formatted ? number.toFormat(decimals) : number.toFixed(decimals);
    }
    arToWinston(arString, { formatted = false } = {}) {
        let number = this.stringToBigNum(arString).shiftedBy(12);
        return formatted ? number.toFormat() : number.toFixed(0);
    }
    compare(winstonStringA, winstonStringB) {
        let a = this.stringToBigNum(winstonStringA);
        let b = this.stringToBigNum(winstonStringB);
        return a.comparedTo(b);
    }
    isEqual(winstonStringA, winstonStringB) {
        return this.compare(winstonStringA, winstonStringB) === 0;
    }
    isLessThan(winstonStringA, winstonStringB) {
        let a = this.stringToBigNum(winstonStringA);
        let b = this.stringToBigNum(winstonStringB);
        return a.isLessThan(b);
    }
    isGreaterThan(winstonStringA, winstonStringB) {
        let a = this.stringToBigNum(winstonStringA);
        let b = this.stringToBigNum(winstonStringB);
        return a.isGreaterThan(b);
    }
    add(winstonStringA, winstonStringB) {
        let a = this.stringToBigNum(winstonStringA);
        let b = this.stringToBigNum(winstonStringB);
        return a.plus(winstonStringB).toFixed(0);
    }
    sub(winstonStringA, winstonStringB) {
        let a = this.stringToBigNum(winstonStringA);
        let b = this.stringToBigNum(winstonStringB);
        return a.minus(winstonStringB).toFixed(0);
    }
    stringToBigNum(stringValue, decimalPlaces = 12) {
        return this.BigNum(stringValue, decimalPlaces);
    }
}
exports["default"] = Ar;


/***/ }),

/***/ 6303:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const error_1 = __webpack_require__(2944);
__webpack_require__(2372);
class Blocks {
    api;
    network;
    static HASH_ENDPOINT = "block/hash/";
    static HEIGHT_ENDPOINT = "block/height/";
    constructor(api, network) {
        this.api = api;
        this.network = network;
    }
    /**
     * Gets a block by its "indep_hash"
     */
    async get(indepHash) {
        const response = await this.api.get(`${Blocks.HASH_ENDPOINT}${indepHash}`);
        if (response.status === 200) {
            return response.data;
        }
        else {
            if (response.status === 404) {
                throw new error_1.default("BLOCK_NOT_FOUND" /* ArweaveErrorType.BLOCK_NOT_FOUND */);
            }
            else {
                throw new Error(`Error while loading block data: ${response}`);
            }
        }
    }
    /**
     * Gets a block by its "height"
     */
    async getByHeight(height) {
        const response = await this.api.get(`${Blocks.HEIGHT_ENDPOINT}${height}`);
        if (response.status === 200) {
            return response.data;
        }
        else {
            if (response.status === 404) {
                throw new error_1.default("BLOCK_NOT_FOUND" /* ArweaveErrorType.BLOCK_NOT_FOUND */);
            }
            else {
                throw new Error(`Error while loading block data: ${response}`);
            }
        }
    }
    /**
     * Gets current block data (ie. block with indep_hash = Network.getInfo().current)
     */
    async getCurrent() {
        const { current } = await this.network.getInfo();
        return await this.get(current);
    }
}
exports["default"] = Blocks;


/***/ }),

/***/ 6105:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const error_1 = __webpack_require__(2944);
const ArweaveUtils = __webpack_require__(7509);
class Chunks {
    api;
    constructor(api) {
        this.api = api;
    }
    async getTransactionOffset(id) {
        const resp = await this.api.get(`tx/${id}/offset`);
        if (resp.status === 200) {
            return resp.data;
        }
        throw new Error(`Unable to get transaction offset: ${(0, error_1.getError)(resp)}`);
    }
    async getChunk(offset) {
        const resp = await this.api.get(`chunk/${offset}`);
        if (resp.status === 200) {
            return resp.data;
        }
        throw new Error(`Unable to get chunk: ${(0, error_1.getError)(resp)}`);
    }
    async getChunkData(offset) {
        const chunk = await this.getChunk(offset);
        const buf = ArweaveUtils.b64UrlToBuffer(chunk.chunk);
        return buf;
    }
    firstChunkOffset(offsetResponse) {
        return parseInt(offsetResponse.offset) - parseInt(offsetResponse.size) + 1;
    }
    async downloadChunkedData(id) {
        const offsetResponse = await this.getTransactionOffset(id);
        const size = parseInt(offsetResponse.size);
        const endOffset = parseInt(offsetResponse.offset);
        const startOffset = endOffset - size + 1;
        const data = new Uint8Array(size);
        let byte = 0;
        while (byte < size) {
            if (this.api.config.logging) {
                console.log(`[chunk] ${byte}/${size}`);
            }
            let chunkData;
            try {
                chunkData = await this.getChunkData(startOffset + byte);
            }
            catch (error) {
                console.error(`[chunk] Failed to fetch chunk at offset ${startOffset + byte}`);
                console.error(`[chunk] This could indicate that the chunk wasn't uploaded or hasn't yet seeded properly to a particular gateway/node`);
            }
            if (chunkData) {
                data.set(chunkData, byte);
                byte += chunkData.length;
            }
            else {
                throw new Error(`Couldn't complete data download at ${byte}/${size}`);
            }
        }
        return data;
    }
}
exports["default"] = Chunks;


/***/ }),

/***/ 1967:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const ar_1 = __webpack_require__(6726);
const api_1 = __webpack_require__(1288);
const node_driver_1 = __webpack_require__(9766);
const network_1 = __webpack_require__(2389);
const transactions_1 = __webpack_require__(9134);
const wallets_1 = __webpack_require__(2202);
const transaction_1 = __webpack_require__(5681);
const ArweaveUtils = __webpack_require__(7509);
const silo_1 = __webpack_require__(3112);
const chunks_1 = __webpack_require__(6105);
const blocks_1 = __webpack_require__(6303);
class Arweave {
    api;
    wallets;
    transactions;
    network;
    blocks;
    ar;
    silo;
    chunks;
    static init;
    static crypto = new node_driver_1.default();
    static utils = ArweaveUtils;
    constructor(apiConfig) {
        this.api = new api_1.default(apiConfig);
        this.wallets = new wallets_1.default(this.api, Arweave.crypto);
        this.chunks = new chunks_1.default(this.api);
        this.transactions = new transactions_1.default(this.api, Arweave.crypto, this.chunks);
        this.silo = new silo_1.default(this.api, this.crypto, this.transactions);
        this.network = new network_1.default(this.api);
        this.blocks = new blocks_1.default(this.api, this.network);
        this.ar = new ar_1.default();
    }
    /** @deprecated */
    get crypto() {
        return Arweave.crypto;
    }
    /** @deprecated */
    get utils() {
        return Arweave.utils;
    }
    getConfig() {
        return {
            api: this.api.getConfig(),
            crypto: null,
        };
    }
    async createTransaction(attributes, jwk) {
        const transaction = {};
        Object.assign(transaction, attributes);
        if (!attributes.data && !(attributes.target && attributes.quantity)) {
            throw new Error(`A new Arweave transaction must have a 'data' value, or 'target' and 'quantity' values.`);
        }
        if (attributes.owner == undefined) {
            if (jwk && jwk !== "use_wallet") {
                transaction.owner = jwk.n;
            }
        }
        if (attributes.last_tx == undefined) {
            transaction.last_tx = await this.transactions.getTransactionAnchor();
        }
        if (typeof attributes.data === "string") {
            attributes.data = ArweaveUtils.stringToBuffer(attributes.data);
        }
        if (attributes.data instanceof ArrayBuffer) {
            attributes.data = new Uint8Array(attributes.data);
        }
        if (attributes.data && !(attributes.data instanceof Uint8Array)) {
            throw new Error("Expected data to be a string, Uint8Array or ArrayBuffer");
        }
        if (attributes.reward == undefined) {
            const length = attributes.data ? attributes.data.byteLength : 0;
            transaction.reward = await this.transactions.getPrice(length, transaction.target);
        }
        // here we should call prepare chunk
        transaction.data_root = "";
        transaction.data_size = attributes.data
            ? attributes.data.byteLength.toString()
            : "0";
        transaction.data = attributes.data || new Uint8Array(0);
        const createdTransaction = new transaction_1.default(transaction);
        await createdTransaction.getSignatureData();
        return createdTransaction;
    }
    async createSiloTransaction(attributes, jwk, siloUri) {
        const transaction = {};
        Object.assign(transaction, attributes);
        if (!attributes.data) {
            throw new Error(`Silo transactions must have a 'data' value`);
        }
        if (!siloUri) {
            throw new Error(`No Silo URI specified.`);
        }
        if (attributes.target || attributes.quantity) {
            throw new Error(`Silo transactions can only be used for storing data, sending AR to other wallets isn't supported.`);
        }
        if (attributes.owner == undefined) {
            if (!jwk || !jwk.n) {
                throw new Error(`A new Arweave transaction must either have an 'owner' attribute, or you must provide the jwk parameter.`);
            }
            transaction.owner = jwk.n;
        }
        if (attributes.last_tx == undefined) {
            transaction.last_tx = await this.transactions.getTransactionAnchor();
        }
        const siloResource = await this.silo.parseUri(siloUri);
        if (typeof attributes.data == "string") {
            const encrypted = await this.crypto.encrypt(ArweaveUtils.stringToBuffer(attributes.data), siloResource.getEncryptionKey());
            transaction.reward = await this.transactions.getPrice(encrypted.byteLength);
            transaction.data = ArweaveUtils.bufferTob64Url(encrypted);
        }
        if (attributes.data instanceof Uint8Array) {
            const encrypted = await this.crypto.encrypt(attributes.data, siloResource.getEncryptionKey());
            transaction.reward = await this.transactions.getPrice(encrypted.byteLength);
            transaction.data = ArweaveUtils.bufferTob64Url(encrypted);
        }
        const siloTransaction = new transaction_1.default(transaction);
        siloTransaction.addTag("Silo-Name", siloResource.getAccessKey());
        siloTransaction.addTag("Silo-Version", `0.1.0`);
        return siloTransaction;
    }
    arql(query) {
        return this.api
            .post("/arql", query)
            .then((response) => response.data || []);
    }
}
exports["default"] = Arweave;


/***/ }),

/***/ 8125:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1967);
const net_config_1 = __webpack_require__(5299);
common_1.default.init = function (apiConfig = {}) {
    const defaults = {
        host: "arweave.net",
        port: 443,
        protocol: "https",
    };
    if (typeof location !== "object" ||
        !location.protocol ||
        !location.hostname) {
        return new common_1.default({
            ...apiConfig,
            ...defaults,
        });
    }
    // window.location.protocol has a trailing colon (http:, https:, file: etc)
    const locationProtocol = location.protocol.replace(":", "");
    const locationHost = location.hostname;
    const locationPort = location.port
        ? parseInt(location.port)
        : locationProtocol == "https"
            ? 443
            : 80;
    const defaultConfig = (0, net_config_1.getDefaultConfig)(locationProtocol, locationHost);
    const protocol = apiConfig.protocol || defaultConfig.protocol;
    const host = apiConfig.host || defaultConfig.host;
    const port = apiConfig.port || defaultConfig.port || locationPort;
    return new common_1.default({
        ...apiConfig,
        host,
        protocol,
        port,
    });
};
if (typeof globalThis === "object") {
    globalThis.Arweave = common_1.default;
}
else if (typeof self === "object") {
    self.Arweave = common_1.default;
}
__exportStar(__webpack_require__(1967), exports);
exports["default"] = common_1.default;


/***/ }),

/***/ 1288:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Api {
    METHOD_GET = "GET";
    METHOD_POST = "POST";
    config;
    constructor(config) {
        this.applyConfig(config);
    }
    applyConfig(config) {
        this.config = this.mergeDefaults(config);
    }
    getConfig() {
        return this.config;
    }
    mergeDefaults(config) {
        const protocol = config.protocol || "http";
        const port = config.port || (protocol === "https" ? 443 : 80);
        return {
            host: config.host || "127.0.0.1",
            protocol,
            port,
            timeout: config.timeout || 20000,
            logging: config.logging || false,
            logger: config.logger || console.log,
            network: config.network,
        };
    }
    async get(endpoint, config) {
        return await this.request(endpoint, { ...config, method: this.METHOD_GET });
    }
    async post(endpoint, body, config) {
        const headers = new Headers(config?.headers || {});
        if (!headers.get("content-type")?.includes("application/json")) {
            headers.append("content-type", "application/json");
        }
        headers.append("accept", "application/json, text/plain, */*");
        return await this.request(endpoint, {
            ...config,
            method: this.METHOD_POST,
            body: typeof body !== "string" ? JSON.stringify(body) : body,
            headers,
        });
    }
    async request(endpoint, init) {
        const headers = new Headers(init?.headers || {});
        const baseURL = `${this.config.protocol}://${this.config.host}:${this.config.port}`;
        /* responseType is purely for backwards compatibility with external apps */
        const responseType = init?.responseType;
        delete init?.responseType;
        if (endpoint.startsWith("/")) {
            endpoint = endpoint.slice(1);
        }
        if (this.config.network) {
            headers.append("x-network", this.config.network);
        }
        if (this.config.logging) {
            this.config.logger(`Requesting: ${baseURL}/${endpoint}`);
        }
        let res = await fetch(`${baseURL}/${endpoint}`, {
            ...(init || {}),
            headers,
        });
        if (this.config.logging) {
            this.config.logger(`Response:   ${res.url} - ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        const charset = contentType?.match(/charset=([^()<>@,;:\"/[\]?.=\s]*)/i)?.[1];
        const response = res;
        const decodeText = async () => {
            if (charset) {
                try {
                    response.data = new TextDecoder(charset).decode(await res.arrayBuffer());
                }
                catch (e) {
                    response.data = (await res.text());
                }
            }
            else {
                response.data = (await res.text());
            }
        };
        if (responseType === "arraybuffer") {
            response.data = (await res.arrayBuffer());
        }
        else if (responseType === "text") {
            await decodeText();
        }
        else if (responseType === "webstream") {
            response.data = addAsyncIterator(res.body);
        }
        else {
            /** axios defaults to JSON, and then text, we mimic the behaviour */
            try {
                let test = await res.clone().json();
                if (typeof test !== "object") {
                    await decodeText();
                }
                else {
                    response.data = (await res.json());
                }
                test = null;
            }
            catch {
                await decodeText();
            }
        }
        return response;
    }
}
exports["default"] = Api;
// | ReadableStream<Uint8Array>
const addAsyncIterator = (body) => {
    const bodyWithIter = body;
    if (typeof bodyWithIter[Symbol.asyncIterator] === "undefined") {
        bodyWithIter[Symbol.asyncIterator] = webIiterator(body);
    }
    return bodyWithIter;
};
const webIiterator = function (stream) {
    return async function* iteratorGenerator() {
        const reader = stream.getReader(); //lock
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    return;
                yield value;
            }
        }
        finally {
            reader.releaseLock(); //unlock
        }
    };
};


/***/ }),

/***/ 9766:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const ArweaveUtils = __webpack_require__(7509);
class WebCryptoDriver {
    keyLength = 4096;
    publicExponent = 0x10001;
    hashAlgorithm = "sha256";
    driver;
    constructor() {
        if (!this.detectWebCrypto()) {
            throw new Error("SubtleCrypto not available!");
        }
        this.driver = crypto.subtle;
    }
    async generateJWK() {
        let cryptoKey = await this.driver.generateKey({
            name: "RSA-PSS",
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-256",
            },
        }, true, ["sign"]);
        let jwk = await this.driver.exportKey("jwk", cryptoKey.privateKey);
        return {
            kty: jwk.kty,
            e: jwk.e,
            n: jwk.n,
            d: jwk.d,
            p: jwk.p,
            q: jwk.q,
            dp: jwk.dp,
            dq: jwk.dq,
            qi: jwk.qi,
        };
    }
    async sign(jwk, data, { saltLength } = {}) {
        let signature = await this.driver.sign({
            name: "RSA-PSS",
            saltLength: 32,
        }, await this.jwkToCryptoKey(jwk), data);
        return new Uint8Array(signature);
    }
    async hash(data, algorithm = "SHA-256") {
        let digest = await this.driver.digest(algorithm, data);
        return new Uint8Array(digest);
    }
    async verify(publicModulus, data, signature) {
        const publicKey = {
            kty: "RSA",
            e: "AQAB",
            n: publicModulus,
        };
        const key = await this.jwkToPublicCryptoKey(publicKey);
        const digest = await this.driver.digest("SHA-256", data);
        const salt0 = await this.driver.verify({
            name: "RSA-PSS",
            saltLength: 0,
        }, key, signature, data);
        const salt32 = await this.driver.verify({
            name: "RSA-PSS",
            saltLength: 32,
        }, key, signature, data);
        // saltN's salt-length is derived from a formula described here
        // https://developer.mozilla.org/en-US/docs/Web/API/RsaPssParams
        const saltLengthN = Math.ceil((key.algorithm.modulusLength - 1) / 8) -
            digest.byteLength -
            2;
        const saltN = await this.driver.verify({
            name: "RSA-PSS",
            saltLength: saltLengthN,
        }, key, signature, data);
        const result = salt0 || salt32 || saltN;
        if (!result) {
            const details = {
                algorithm: key.algorithm.name,
                modulusLength: key.algorithm.modulusLength,
                keyUsages: key.usages,
                saltLengthsAttempted: `0, 32, ${saltLengthN}`,
            };
            console.warn("Transaction Verification Failed! \n", `Details: ${JSON.stringify(details, null, 2)} \n`, "N.B. ArweaveJS is only guaranteed to verify txs created using ArweaveJS.");
        }
        return result;
    }
    async jwkToCryptoKey(jwk) {
        return this.driver.importKey("jwk", jwk, {
            name: "RSA-PSS",
            hash: {
                name: "SHA-256",
            },
        }, false, ["sign"]);
    }
    async jwkToPublicCryptoKey(publicJwk) {
        return this.driver.importKey("jwk", publicJwk, {
            name: "RSA-PSS",
            hash: {
                name: "SHA-256",
            },
        }, false, ["verify"]);
    }
    detectWebCrypto() {
        if (typeof crypto === "undefined") {
            return false;
        }
        const subtle = crypto?.subtle;
        if (subtle === undefined) {
            return false;
        }
        const names = [
            "generateKey",
            "importKey",
            "exportKey",
            "digest",
            "sign",
        ];
        return names.every((name) => typeof subtle[name] === "function");
    }
    async encrypt(data, key, salt) {
        const initialKey = await this.driver.importKey("raw", typeof key == "string" ? ArweaveUtils.stringToBuffer(key) : key, {
            name: "PBKDF2",
            length: 32,
        }, false, ["deriveKey"]);
        // const salt = ArweaveUtils.stringToBuffer("salt");
        // create a random string for deriving the key
        // const salt = this.driver.randomBytes(16).toString('hex');
        const derivedkey = await this.driver.deriveKey({
            name: "PBKDF2",
            salt: salt
                ? ArweaveUtils.stringToBuffer(salt)
                : ArweaveUtils.stringToBuffer("salt"),
            iterations: 100000,
            hash: "SHA-256",
        }, initialKey, {
            name: "AES-CBC",
            length: 256,
        }, false, ["encrypt", "decrypt"]);
        const iv = new Uint8Array(16);
        crypto.getRandomValues(iv);
        const encryptedData = await this.driver.encrypt({
            name: "AES-CBC",
            iv: iv,
        }, derivedkey, data);
        return ArweaveUtils.concatBuffers([iv, encryptedData]);
    }
    async decrypt(encrypted, key, salt) {
        const initialKey = await this.driver.importKey("raw", typeof key == "string" ? ArweaveUtils.stringToBuffer(key) : key, {
            name: "PBKDF2",
            length: 32,
        }, false, ["deriveKey"]);
        // const salt = ArweaveUtils.stringToBuffer("pepper");
        const derivedkey = await this.driver.deriveKey({
            name: "PBKDF2",
            salt: salt
                ? ArweaveUtils.stringToBuffer(salt)
                : ArweaveUtils.stringToBuffer("salt"),
            iterations: 100000,
            hash: "SHA-256",
        }, initialKey, {
            name: "AES-CBC",
            length: 256,
        }, false, ["encrypt", "decrypt"]);
        const iv = encrypted.slice(0, 16);
        const data = await this.driver.decrypt({
            name: "AES-CBC",
            iv: iv,
        }, derivedkey, encrypted.slice(16));
        // We're just using concat to convert from an array buffer to uint8array
        return ArweaveUtils.concatBuffers([data]);
    }
}
exports["default"] = WebCryptoDriver;


/***/ }),

/***/ 5161:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = deepHash;
const common_1 = __webpack_require__(1967);
async function deepHash(data) {
    if (Array.isArray(data)) {
        const tag = common_1.default.utils.concatBuffers([
            common_1.default.utils.stringToBuffer("list"),
            common_1.default.utils.stringToBuffer(data.length.toString()),
        ]);
        return await deepHashChunks(data, await common_1.default.crypto.hash(tag, "SHA-384"));
    }
    const tag = common_1.default.utils.concatBuffers([
        common_1.default.utils.stringToBuffer("blob"),
        common_1.default.utils.stringToBuffer(data.byteLength.toString()),
    ]);
    const taggedHash = common_1.default.utils.concatBuffers([
        await common_1.default.crypto.hash(tag, "SHA-384"),
        await common_1.default.crypto.hash(data, "SHA-384"),
    ]);
    return await common_1.default.crypto.hash(taggedHash, "SHA-384");
}
async function deepHashChunks(chunks, acc) {
    if (chunks.length < 1) {
        return acc;
    }
    const hashPair = common_1.default.utils.concatBuffers([
        acc,
        await deepHash(chunks[0]),
    ]);
    const newAcc = await common_1.default.crypto.hash(hashPair, "SHA-384");
    return await deepHashChunks(chunks.slice(1), newAcc);
}


/***/ }),

/***/ 2944:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getError = getError;
class ArweaveError extends Error {
    type;
    response;
    constructor(type, optional = {}) {
        if (optional.message) {
            super(optional.message);
        }
        else {
            super();
        }
        this.type = type;
        this.response = optional.response;
    }
    getType() {
        return this.type;
    }
}
exports["default"] = ArweaveError;
// Safely get error string
// from a response, falling back to
// resp.data, statusText or 'unknown'.
// Note: a wrongly set content-type can
// cause what is a json response to be interepted
// as a string or Buffer, so we handle that too.
function getError(resp) {
    let data = resp.data;
    if (typeof resp.data === "string") {
        try {
            data = JSON.parse(resp.data);
        }
        catch (e) { }
    }
    if (resp.data instanceof ArrayBuffer || resp.data instanceof Uint8Array) {
        try {
            data = JSON.parse(data.toString());
        }
        catch (e) { }
    }
    return data ? data.error || data : resp.statusText || "unknown";
}


/***/ }),

/***/ 9943:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(6300)["Buffer"];

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.arrayCompare = exports.MIN_CHUNK_SIZE = exports.MAX_CHUNK_SIZE = void 0;
exports.chunkData = chunkData;
exports.generateLeaves = generateLeaves;
exports.computeRootHash = computeRootHash;
exports.generateTree = generateTree;
exports.generateTransactionChunks = generateTransactionChunks;
exports.buildLayers = buildLayers;
exports.generateProofs = generateProofs;
exports.arrayFlatten = arrayFlatten;
exports.intToBuffer = intToBuffer;
exports.bufferToInt = bufferToInt;
exports.validatePath = validatePath;
exports.debug = debug;
/**
 * @see {@link https://github.com/ArweaveTeam/arweave/blob/fbc381e0e36efffa45d13f2faa6199d3766edaa2/apps/arweave/src/ar_merkle.erl}
 */
const common_1 = __webpack_require__(1967);
const utils_1 = __webpack_require__(7509);
exports.MAX_CHUNK_SIZE = 256 * 1024;
exports.MIN_CHUNK_SIZE = 32 * 1024;
const NOTE_SIZE = 32;
const HASH_SIZE = 32;
/**
 * Takes the input data and chunks it into (mostly) equal sized chunks.
 * The last chunk will be a bit smaller as it contains the remainder
 * from the chunking process.
 */
async function chunkData(data) {
    let chunks = [];
    let rest = data;
    let cursor = 0;
    while (rest.byteLength >= exports.MAX_CHUNK_SIZE) {
        let chunkSize = exports.MAX_CHUNK_SIZE;
        // If the total bytes left will produce a chunk < MIN_CHUNK_SIZE,
        // then adjust the amount we put in this 2nd last chunk.
        let nextChunkSize = rest.byteLength - exports.MAX_CHUNK_SIZE;
        if (nextChunkSize > 0 && nextChunkSize < exports.MIN_CHUNK_SIZE) {
            chunkSize = Math.ceil(rest.byteLength / 2);
            // console.log(`Last chunk will be: ${nextChunkSize} which is below ${MIN_CHUNK_SIZE}, adjusting current to ${chunkSize} with ${rest.byteLength} left.`)
        }
        const chunk = rest.slice(0, chunkSize);
        const dataHash = await common_1.default.crypto.hash(chunk);
        cursor += chunk.byteLength;
        chunks.push({
            dataHash,
            minByteRange: cursor - chunk.byteLength,
            maxByteRange: cursor,
        });
        rest = rest.slice(chunkSize);
    }
    chunks.push({
        dataHash: await common_1.default.crypto.hash(rest),
        minByteRange: cursor,
        maxByteRange: cursor + rest.byteLength,
    });
    return chunks;
}
async function generateLeaves(chunks) {
    return Promise.all(chunks.map(async ({ dataHash, minByteRange, maxByteRange }) => {
        return {
            type: "leaf",
            id: await hash(await Promise.all([hash(dataHash), hash(intToBuffer(maxByteRange))])),
            dataHash: dataHash,
            minByteRange,
            maxByteRange,
        };
    }));
}
/**
 * Builds an arweave merkle tree and gets the root hash for the given input.
 */
async function computeRootHash(data) {
    const rootNode = await generateTree(data);
    return rootNode.id;
}
async function generateTree(data) {
    const rootNode = await buildLayers(await generateLeaves(await chunkData(data)));
    return rootNode;
}
/**
 * Generates the data_root, chunks & proofs
 * needed for a transaction.
 *
 * This also checks if the last chunk is a zero-length
 * chunk and discards that chunk and proof if so.
 * (we do not need to upload this zero length chunk)
 *
 * @param data
 */
async function generateTransactionChunks(data) {
    const chunks = await chunkData(data);
    const leaves = await generateLeaves(chunks);
    const root = await buildLayers(leaves);
    const proofs = await generateProofs(root);
    // Discard the last chunk & proof if it's zero length.
    const lastChunk = chunks.slice(-1)[0];
    if (lastChunk.maxByteRange - lastChunk.minByteRange === 0) {
        chunks.splice(chunks.length - 1, 1);
        proofs.splice(proofs.length - 1, 1);
    }
    return {
        data_root: root.id,
        chunks,
        proofs,
    };
}
/**
 * Starting with the bottom layer of leaf nodes, hash every second pair
 * into a new branch node, push those branch nodes onto a new layer,
 * and then recurse, building up the tree to it's root, where the
 * layer only consists of two items.
 */
async function buildLayers(nodes, level = 0) {
    // If there is only 1 node left, this is going to be the root node
    if (nodes.length < 2) {
        const root = nodes[0];
        // console.log("Root layer", root);
        return root;
    }
    const nextLayer = [];
    for (let i = 0; i < nodes.length; i += 2) {
        nextLayer.push(await hashBranch(nodes[i], nodes[i + 1]));
    }
    // console.log("Layer", nextLayer);
    return buildLayers(nextLayer, level + 1);
}
/**
 * Recursively search through all branches of the tree,
 * and generate a proof for each leaf node.
 */
function generateProofs(root) {
    const proofs = resolveBranchProofs(root);
    if (!Array.isArray(proofs)) {
        return [proofs];
    }
    return arrayFlatten(proofs);
}
function resolveBranchProofs(node, proof = new Uint8Array(), depth = 0) {
    if (node.type == "leaf") {
        return {
            offset: node.maxByteRange - 1,
            proof: (0, utils_1.concatBuffers)([
                proof,
                node.dataHash,
                intToBuffer(node.maxByteRange),
            ]),
        };
    }
    if (node.type == "branch") {
        const partialProof = (0, utils_1.concatBuffers)([
            proof,
            node.leftChild.id,
            node.rightChild.id,
            intToBuffer(node.byteRange),
        ]);
        return [
            resolveBranchProofs(node.leftChild, partialProof, depth + 1),
            resolveBranchProofs(node.rightChild, partialProof, depth + 1),
        ];
    }
    throw new Error(`Unexpected node type`);
}
function arrayFlatten(input) {
    const flat = [];
    input.forEach((item) => {
        if (Array.isArray(item)) {
            flat.push(...arrayFlatten(item));
        }
        else {
            flat.push(item);
        }
    });
    return flat;
}
async function hashBranch(left, right) {
    if (!right) {
        return left;
    }
    let branch = {
        type: "branch",
        id: await hash([
            await hash(left.id),
            await hash(right.id),
            await hash(intToBuffer(left.maxByteRange)),
        ]),
        byteRange: left.maxByteRange,
        maxByteRange: right.maxByteRange,
        leftChild: left,
        rightChild: right,
    };
    return branch;
}
async function hash(data) {
    if (Array.isArray(data)) {
        data = common_1.default.utils.concatBuffers(data);
    }
    return new Uint8Array(await common_1.default.crypto.hash(data));
}
function intToBuffer(note) {
    const buffer = new Uint8Array(NOTE_SIZE);
    for (var i = buffer.length - 1; i >= 0; i--) {
        var byte = note % 256;
        buffer[i] = byte;
        note = (note - byte) / 256;
    }
    return buffer;
}
function bufferToInt(buffer) {
    let value = 0;
    for (var i = 0; i < buffer.length; i++) {
        value *= 256;
        value += buffer[i];
    }
    return value;
}
const arrayCompare = (a, b) => a.every((value, index) => b[index] === value);
exports.arrayCompare = arrayCompare;
async function validatePath(id, dest, leftBound, rightBound, path) {
    if (rightBound <= 0) {
        return false;
    }
    if (dest >= rightBound) {
        return validatePath(id, 0, rightBound - 1, rightBound, path);
    }
    if (dest < 0) {
        return validatePath(id, 0, 0, rightBound, path);
    }
    if (path.length == HASH_SIZE + NOTE_SIZE) {
        const pathData = path.slice(0, HASH_SIZE);
        const endOffsetBuffer = path.slice(pathData.length, pathData.length + NOTE_SIZE);
        const pathDataHash = await hash([
            await hash(pathData),
            await hash(endOffsetBuffer),
        ]);
        let result = (0, exports.arrayCompare)(id, pathDataHash);
        if (result) {
            return {
                offset: rightBound - 1,
                leftBound: leftBound,
                rightBound: rightBound,
                chunkSize: rightBound - leftBound,
            };
        }
        return false;
    }
    const left = path.slice(0, HASH_SIZE);
    const right = path.slice(left.length, left.length + HASH_SIZE);
    const offsetBuffer = path.slice(left.length + right.length, left.length + right.length + NOTE_SIZE);
    const offset = bufferToInt(offsetBuffer);
    const remainder = path.slice(left.length + right.length + offsetBuffer.length);
    const pathHash = await hash([
        await hash(left),
        await hash(right),
        await hash(offsetBuffer),
    ]);
    if ((0, exports.arrayCompare)(id, pathHash)) {
        if (dest < offset) {
            return await validatePath(left, dest, leftBound, Math.min(rightBound, offset), remainder);
        }
        return await validatePath(right, dest, Math.max(leftBound, offset), rightBound, remainder);
    }
    return false;
}
/**
 * Inspect an arweave chunk proof.
 * Takes proof, parses, reads and displays the values for console logging.
 * One proof section per line
 * Format: left,right,offset => hash
 */
async function debug(proof, output = "") {
    if (proof.byteLength < 1) {
        return output;
    }
    const left = proof.slice(0, HASH_SIZE);
    const right = proof.slice(left.length, left.length + HASH_SIZE);
    const offsetBuffer = proof.slice(left.length + right.length, left.length + right.length + NOTE_SIZE);
    const offset = bufferToInt(offsetBuffer);
    const remainder = proof.slice(left.length + right.length + offsetBuffer.length);
    const pathHash = await hash([
        await hash(left),
        await hash(right),
        await hash(offsetBuffer),
    ]);
    const updatedOutput = `${output}\n${JSON.stringify(Buffer.from(left))},${JSON.stringify(Buffer.from(right))},${offset} => ${JSON.stringify(pathHash)}`;
    return debug(remainder, updatedOutput);
}


/***/ }),

/***/ 6688:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionUploader = void 0;
const transaction_1 = __webpack_require__(5681);
const ArweaveUtils = __webpack_require__(7509);
const error_1 = __webpack_require__(2944);
const merkle_1 = __webpack_require__(9943);
// Maximum amount of chunks we will upload in the body.
const MAX_CHUNKS_IN_BODY = 1;
// We assume these errors are intermitment and we can try again after a delay:
// - not_joined
// - timeout
// - data_root_not_found (we may have hit a node that just hasn't seen it yet)
// - exceeds_disk_pool_size_limit
// We also try again after any kind of unexpected network errors
// Errors from /chunk we should never try and continue on.
const FATAL_CHUNK_UPLOAD_ERRORS = [
    "invalid_json",
    "chunk_too_big",
    "data_path_too_big",
    "offset_too_big",
    "data_size_too_big",
    "chunk_proof_ratio_not_attractive",
    "invalid_proof",
];
// Amount we will delay on receiving an error response but do want to continue.
const ERROR_DELAY = 1000 * 40;
class TransactionUploader {
    api;
    chunkIndex = 0;
    txPosted = false;
    transaction;
    lastRequestTimeEnd = 0;
    totalErrors = 0; // Not serialized.
    data;
    lastResponseStatus = 0;
    lastResponseError = "";
    get isComplete() {
        return (this.txPosted &&
            this.chunkIndex === this.transaction.chunks.chunks.length);
    }
    get totalChunks() {
        return this.transaction.chunks.chunks.length;
    }
    get uploadedChunks() {
        return this.chunkIndex;
    }
    get pctComplete() {
        return Math.trunc((this.uploadedChunks / this.totalChunks) * 100);
    }
    constructor(api, transaction) {
        this.api = api;
        if (!transaction.id) {
            throw new Error(`Transaction is not signed`);
        }
        if (!transaction.chunks) {
            throw new Error(`Transaction chunks not prepared`);
        }
        // Make a copy of transaction, zeroing the data so we can serialize.
        this.data = transaction.data;
        this.transaction = new transaction_1.default(Object.assign({}, transaction, { data: new Uint8Array(0) }));
    }
    /**
     * Uploads the next part of the transaction.
     * On the first call this posts the transaction
     * itself and on any subsequent calls uploads the
     * next chunk until it completes.
     */
    async uploadChunk(chunkIndex_) {
        if (this.isComplete) {
            throw new Error(`Upload is already complete`);
        }
        if (this.lastResponseError !== "") {
            this.totalErrors++;
        }
        else {
            this.totalErrors = 0;
        }
        // We have been trying for about an hour receiving an
        // error every time, so eventually bail.
        if (this.totalErrors === 100) {
            throw new Error(`Unable to complete upload: ${this.lastResponseStatus}: ${this.lastResponseError}`);
        }
        let delay = this.lastResponseError === ""
            ? 0
            : Math.max(this.lastRequestTimeEnd + ERROR_DELAY - Date.now(), ERROR_DELAY);
        if (delay > 0) {
            // Jitter delay bcoz networks, subtract up to 30% from 40 seconds
            delay = delay - delay * Math.random() * 0.3;
            await new Promise((res) => setTimeout(res, delay));
        }
        this.lastResponseError = "";
        if (!this.txPosted) {
            await this.postTransaction();
            return;
        }
        if (chunkIndex_) {
            this.chunkIndex = chunkIndex_;
        }
        const chunk = this.transaction.getChunk(chunkIndex_ || this.chunkIndex, this.data);
        const chunkOk = await (0, merkle_1.validatePath)(this.transaction.chunks.data_root, parseInt(chunk.offset), 0, parseInt(chunk.data_size), ArweaveUtils.b64UrlToBuffer(chunk.data_path));
        if (!chunkOk) {
            throw new Error(`Unable to validate chunk ${this.chunkIndex}`);
        }
        // Catch network errors and turn them into objects with status -1 and an error message.
        const resp = await this.api
            .post(`chunk`, this.transaction.getChunk(this.chunkIndex, this.data))
            .catch((e) => {
            console.error(e.message);
            return { status: -1, data: { error: e.message } };
        });
        this.lastRequestTimeEnd = Date.now();
        this.lastResponseStatus = resp.status;
        if (this.lastResponseStatus == 200) {
            this.chunkIndex++;
        }
        else {
            this.lastResponseError = (0, error_1.getError)(resp);
            if (FATAL_CHUNK_UPLOAD_ERRORS.includes(this.lastResponseError)) {
                throw new Error(`Fatal error uploading chunk ${this.chunkIndex}: ${this.lastResponseError}`);
            }
        }
    }
    /**
     * Reconstructs an upload from its serialized state and data.
     * Checks if data matches the expected data_root.
     *
     * @param serialized
     * @param data
     */
    static async fromSerialized(api, serialized, data) {
        if (!serialized ||
            typeof serialized.chunkIndex !== "number" ||
            typeof serialized.transaction !== "object") {
            throw new Error(`Serialized object does not match expected format.`);
        }
        // Everything looks ok, reconstruct the TransactionUpload,
        // prepare the chunks again and verify the data_root matches
        var transaction = new transaction_1.default(serialized.transaction);
        if (!transaction.chunks) {
            await transaction.prepareChunks(data);
        }
        const upload = new TransactionUploader(api, transaction);
        // Copy the serialized upload information, and data passed in.
        upload.chunkIndex = serialized.chunkIndex;
        upload.lastRequestTimeEnd = serialized.lastRequestTimeEnd;
        upload.lastResponseError = serialized.lastResponseError;
        upload.lastResponseStatus = serialized.lastResponseStatus;
        upload.txPosted = serialized.txPosted;
        upload.data = data;
        if (upload.transaction.data_root !== serialized.transaction.data_root) {
            throw new Error(`Data mismatch: Uploader doesn't match provided data.`);
        }
        return upload;
    }
    /**
     * Reconstruct an upload from the tx metadata, ie /tx/<id>.
     *
     * @param api
     * @param id
     * @param data
     */
    static async fromTransactionId(api, id) {
        const resp = await api.get(`tx/${id}`);
        if (resp.status !== 200) {
            throw new Error(`Tx ${id} not found: ${resp.status}`);
        }
        const transaction = resp.data;
        transaction.data = new Uint8Array(0);
        const serialized = {
            txPosted: true,
            chunkIndex: 0,
            lastResponseError: "",
            lastRequestTimeEnd: 0,
            lastResponseStatus: 0,
            transaction,
        };
        return serialized;
    }
    toJSON() {
        return {
            chunkIndex: this.chunkIndex,
            transaction: this.transaction,
            lastRequestTimeEnd: this.lastRequestTimeEnd,
            lastResponseStatus: this.lastResponseStatus,
            lastResponseError: this.lastResponseError,
            txPosted: this.txPosted,
        };
    }
    // POST to /tx
    async postTransaction() {
        const uploadInBody = this.totalChunks <= MAX_CHUNKS_IN_BODY;
        if (uploadInBody) {
            // Post the transaction with data.
            this.transaction.data = this.data;
            const resp = await this.api.post(`tx`, this.transaction).catch((e) => {
                console.error(e);
                return { status: -1, data: { error: e.message } };
            });
            this.lastRequestTimeEnd = Date.now();
            this.lastResponseStatus = resp.status;
            this.transaction.data = new Uint8Array(0);
            if (resp.status >= 200 && resp.status < 300) {
                // We are complete.
                this.txPosted = true;
                this.chunkIndex = MAX_CHUNKS_IN_BODY;
                return;
            }
            this.lastResponseError = (0, error_1.getError)(resp);
            throw new Error(`Unable to upload transaction: ${resp.status}, ${this.lastResponseError}`);
        }
        // Post the transaction with no data.
        const resp = await this.api.post(`tx`, this.transaction);
        this.lastRequestTimeEnd = Date.now();
        this.lastResponseStatus = resp.status;
        if (!(resp.status >= 200 && resp.status < 300)) {
            this.lastResponseError = (0, error_1.getError)(resp);
            throw new Error(`Unable to upload transaction: ${resp.status}, ${this.lastResponseError}`);
        }
        this.txPosted = true;
    }
}
exports.TransactionUploader = TransactionUploader;


/***/ }),

/***/ 5681:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tag = void 0;
const ArweaveUtils = __webpack_require__(7509);
const deepHash_1 = __webpack_require__(5161);
const merkle_1 = __webpack_require__(9943);
class BaseObject {
    get(field, options) {
        if (!Object.getOwnPropertyNames(this).includes(field)) {
            throw new Error(`Field "${field}" is not a property of the Arweave Transaction class.`);
        }
        // Handle fields that are Uint8Arrays.
        // To maintain compat we encode them to b64url
        // if decode option is not specificed.
        if (this[field] instanceof Uint8Array) {
            if (options && options.decode && options.string) {
                return ArweaveUtils.bufferToString(this[field]);
            }
            if (options && options.decode && !options.string) {
                return this[field];
            }
            return ArweaveUtils.bufferTob64Url(this[field]);
        }
        if (this[field] instanceof Array) {
            if (options?.decode !== undefined || options?.string !== undefined) {
                if (field === "tags") {
                    console.warn(`Did you mean to use 'transaction["tags"]' ?`);
                }
                throw new Error(`Cannot decode or stringify an array.`);
            }
            return this[field];
        }
        if (options && options.decode == true) {
            if (options && options.string) {
                return ArweaveUtils.b64UrlToString(this[field]);
            }
            return ArweaveUtils.b64UrlToBuffer(this[field]);
        }
        return this[field];
    }
}
class Tag extends BaseObject {
    name;
    value;
    constructor(name, value, decode = false) {
        super();
        this.name = name;
        this.value = value;
    }
}
exports.Tag = Tag;
class Transaction extends BaseObject {
    format = 2;
    id = "";
    last_tx = "";
    owner = "";
    tags = [];
    target = "";
    quantity = "0";
    data_size = "0";
    data = new Uint8Array();
    data_root = "";
    reward = "0";
    signature = "";
    // Computed when needed.
    chunks;
    constructor(attributes = {}) {
        super();
        Object.assign(this, attributes);
        // If something passes in a Tx that has been toJSON'ed and back,
        // or where the data was filled in from /tx/data endpoint.
        // data will be b64url encoded, so decode it.
        if (typeof this.data === "string") {
            this.data = ArweaveUtils.b64UrlToBuffer(this.data);
        }
        if (attributes.tags) {
            this.tags = attributes.tags.map((tag) => {
                return new Tag(tag.name, tag.value);
            });
        }
    }
    addTag(name, value) {
        this.tags.push(new Tag(ArweaveUtils.stringToB64Url(name), ArweaveUtils.stringToB64Url(value)));
    }
    toJSON() {
        return {
            format: this.format,
            id: this.id,
            last_tx: this.last_tx,
            owner: this.owner,
            tags: this.tags,
            target: this.target,
            quantity: this.quantity,
            data: ArweaveUtils.bufferTob64Url(this.data),
            data_size: this.data_size,
            data_root: this.data_root,
            data_tree: this.data_tree,
            reward: this.reward,
            signature: this.signature,
        };
    }
    setOwner(owner) {
        this.owner = owner;
    }
    setSignature({ id, owner, reward, tags, signature, }) {
        this.id = id;
        this.owner = owner;
        if (reward)
            this.reward = reward;
        if (tags)
            this.tags = tags;
        this.signature = signature;
    }
    async prepareChunks(data) {
        // Note: we *do not* use `this.data`, the caller may be
        // operating on a transaction with an zero length data field.
        // This function computes the chunks for the data passed in and
        // assigns the result to this transaction. It should not read the
        // data *from* this transaction.
        if (!this.chunks && data.byteLength > 0) {
            this.chunks = await (0, merkle_1.generateTransactionChunks)(data);
            this.data_root = ArweaveUtils.bufferTob64Url(this.chunks.data_root);
        }
        if (!this.chunks && data.byteLength === 0) {
            this.chunks = {
                chunks: [],
                data_root: new Uint8Array(),
                proofs: [],
            };
            this.data_root = "";
        }
    }
    // Returns a chunk in a format suitable for posting to /chunk.
    // Similar to `prepareChunks()` this does not operate `this.data`,
    // instead using the data passed in.
    getChunk(idx, data) {
        if (!this.chunks) {
            throw new Error(`Chunks have not been prepared`);
        }
        const proof = this.chunks.proofs[idx];
        const chunk = this.chunks.chunks[idx];
        return {
            data_root: this.data_root,
            data_size: this.data_size,
            data_path: ArweaveUtils.bufferTob64Url(proof.proof),
            offset: proof.offset.toString(),
            chunk: ArweaveUtils.bufferTob64Url(data.slice(chunk.minByteRange, chunk.maxByteRange)),
        };
    }
    async getSignatureData() {
        switch (this.format) {
            case 1:
                let tags = this.tags.reduce((accumulator, tag) => {
                    return ArweaveUtils.concatBuffers([
                        accumulator,
                        tag.get("name", { decode: true, string: false }),
                        tag.get("value", { decode: true, string: false }),
                    ]);
                }, new Uint8Array());
                return ArweaveUtils.concatBuffers([
                    this.get("owner", { decode: true, string: false }),
                    this.get("target", { decode: true, string: false }),
                    this.get("data", { decode: true, string: false }),
                    ArweaveUtils.stringToBuffer(this.quantity),
                    ArweaveUtils.stringToBuffer(this.reward),
                    this.get("last_tx", { decode: true, string: false }),
                    tags,
                ]);
            case 2:
                if (!this.data_root) {
                    await this.prepareChunks(this.data);
                }
                const tagList = this.tags.map((tag) => [
                    tag.get("name", { decode: true, string: false }),
                    tag.get("value", { decode: true, string: false }),
                ]);
                return await (0, deepHash_1.default)([
                    ArweaveUtils.stringToBuffer(this.format.toString()),
                    this.get("owner", { decode: true, string: false }),
                    this.get("target", { decode: true, string: false }),
                    ArweaveUtils.stringToBuffer(this.quantity),
                    ArweaveUtils.stringToBuffer(this.reward),
                    this.get("last_tx", { decode: true, string: false }),
                    tagList,
                    ArweaveUtils.stringToBuffer(this.data_size),
                    this.get("data_root", { decode: true, string: false }),
                ]);
            default:
                throw new Error(`Unexpected transaction format: ${this.format}`);
        }
    }
}
exports["default"] = Transaction;


/***/ }),

/***/ 7509:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.concatBuffers = concatBuffers;
exports.b64UrlToString = b64UrlToString;
exports.bufferToString = bufferToString;
exports.stringToBuffer = stringToBuffer;
exports.stringToB64Url = stringToB64Url;
exports.b64UrlToBuffer = b64UrlToBuffer;
exports.bufferTob64 = bufferTob64;
exports.bufferTob64Url = bufferTob64Url;
exports.b64UrlEncode = b64UrlEncode;
exports.b64UrlDecode = b64UrlDecode;
const B64js = __webpack_require__(8738);
function concatBuffers(buffers) {
    let total_length = 0;
    for (let i = 0; i < buffers.length; i++) {
        total_length += buffers[i].byteLength;
    }
    let temp = new Uint8Array(total_length);
    let offset = 0;
    temp.set(new Uint8Array(buffers[0]), offset);
    offset += buffers[0].byteLength;
    for (let i = 1; i < buffers.length; i++) {
        temp.set(new Uint8Array(buffers[i]), offset);
        offset += buffers[i].byteLength;
    }
    return temp;
}
function b64UrlToString(b64UrlString) {
    let buffer = b64UrlToBuffer(b64UrlString);
    return bufferToString(buffer);
}
function bufferToString(buffer) {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
}
function stringToBuffer(string) {
    return new TextEncoder().encode(string);
}
function stringToB64Url(string) {
    return bufferTob64Url(stringToBuffer(string));
}
function b64UrlToBuffer(b64UrlString) {
    return new Uint8Array(B64js.toByteArray(b64UrlDecode(b64UrlString)));
}
function bufferTob64(buffer) {
    return B64js.fromByteArray(new Uint8Array(buffer));
}
function bufferTob64Url(buffer) {
    return b64UrlEncode(bufferTob64(buffer));
}
function b64UrlEncode(b64UrlString) {
    try {
        return b64UrlString
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/\=/g, "");
    }
    catch (error) {
        throw new Error("Failed to encode string", { cause: error });
    }
}
function b64UrlDecode(b64UrlString) {
    try {
        b64UrlString = b64UrlString.replace(/\-/g, "+").replace(/\_/g, "/");
        let padding;
        b64UrlString.length % 4 == 0
            ? (padding = 0)
            : (padding = 4 - (b64UrlString.length % 4));
        return b64UrlString.concat("=".repeat(padding));
    }
    catch (error) {
        throw new Error("Failed to decode string", { cause: error });
    }
}


/***/ }),

/***/ 5299:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDefaultConfig = void 0;
/** exhaustive localhost testing */
const isLocal = (protocol, hostname) => {
    const regexLocalIp = /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;
    const split = hostname.split(".");
    const tld = split[split.length - 1]; // check if subdomain on the localhost
    const localStrings = ["localhost", "[::1]"];
    return (localStrings.includes(hostname) ||
        protocol == "file" ||
        localStrings.includes(tld) ||
        !!hostname.match(regexLocalIp) ||
        !!tld.match(regexLocalIp));
};
/** simplified tests for ip addresses */
const isIpAdress = (host) => {
    // an IPv6 location.hostname (and only IPv6 hostnames) must be surrounded by square brackets
    const isIpv6 = host.charAt(0) === "[";
    // Potential speed-up for IPv4 detection:
    // the tld of a domain name cannot be a number (IDN location.hostnames appear to be converted, needs further clarification)
    const regexMatchIpv4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    return !!host.match(regexMatchIpv4) || isIpv6;
};
const getDefaultConfig = (protocol, host) => {
    // If we're running in what looks like a local dev environment
    // then default to using arweave.net
    if (isLocal(protocol, host)) {
        return {
            protocol: "https",
            host: "arweave.net",
            port: 443,
        };
    }
    //check if hostname is an IP address before removing first subdomain
    if (!isIpAdress(host)) {
        let split = host.split(".");
        if (split.length >= 3) {
            split.shift();
            const parentDomain = split.join(".");
            return {
                protocol,
                host: parentDomain,
            };
        }
    }
    // there are 2 potential garbage returns here:
    // a non-GW ip address & a non-GW hostname without ArNS. garbage in, garbage out.
    // they should be overridden with user inputs in apiConfig.
    // otherwise we have a valid ip based GW address.
    return {
        protocol,
        host,
    };
};
exports.getDefaultConfig = getDefaultConfig;


/***/ }),

/***/ 2389:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Network {
    api;
    constructor(api) {
        this.api = api;
    }
    getInfo() {
        return this.api.get(`info`).then((response) => {
            return response.data;
        });
    }
    getPeers() {
        return this.api.get(`peers`).then((response) => {
            return response.data;
        });
    }
}
exports["default"] = Network;


/***/ }),

/***/ 3112:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SiloResource = void 0;
const ArweaveUtils = __webpack_require__(7509);
class Silo {
    api;
    crypto;
    transactions;
    constructor(api, crypto, transactions) {
        this.api = api;
        this.crypto = crypto;
        this.transactions = transactions;
    }
    async get(siloURI) {
        if (!siloURI) {
            throw new Error(`No Silo URI specified`);
        }
        const resource = await this.parseUri(siloURI);
        const ids = await this.transactions.search("Silo-Name", resource.getAccessKey());
        if (ids.length == 0) {
            throw new Error(`No data could be found for the Silo URI: ${siloURI}`);
        }
        const transaction = await this.transactions.get(ids[0]);
        if (!transaction) {
            throw new Error(`No data could be found for the Silo URI: ${siloURI}`);
        }
        const encrypted = transaction.get("data", { decode: true, string: false });
        return this.crypto.decrypt(encrypted, resource.getEncryptionKey());
    }
    async readTransactionData(transaction, siloURI) {
        if (!siloURI) {
            throw new Error(`No Silo URI specified`);
        }
        const resource = await this.parseUri(siloURI);
        const encrypted = transaction.get("data", { decode: true, string: false });
        return this.crypto.decrypt(encrypted, resource.getEncryptionKey());
    }
    async parseUri(siloURI) {
        const parsed = siloURI.match(/^([a-z0-9-_]+)\.([0-9]+)/i);
        if (!parsed) {
            throw new Error(`Invalid Silo name, must be a name in the format of [a-z0-9]+.[0-9]+, e.g. 'bubble.7'`);
        }
        const siloName = parsed[1];
        const hashIterations = Math.pow(2, parseInt(parsed[2]));
        const digest = await this.hash(ArweaveUtils.stringToBuffer(siloName), hashIterations);
        const accessKey = ArweaveUtils.bufferTob64(digest.slice(0, 15));
        const encryptionkey = await this.hash(digest.slice(16, 31), 1);
        return new SiloResource(siloURI, accessKey, encryptionkey);
    }
    async hash(input, iterations) {
        let digest = await this.crypto.hash(input);
        for (let count = 0; count < iterations - 1; count++) {
            digest = await this.crypto.hash(digest);
        }
        return digest;
    }
}
exports["default"] = Silo;
class SiloResource {
    uri;
    accessKey;
    encryptionKey;
    constructor(uri, accessKey, encryptionKey) {
        this.uri = uri;
        this.accessKey = accessKey;
        this.encryptionKey = encryptionKey;
    }
    getUri() {
        return this.uri;
    }
    getAccessKey() {
        return this.accessKey;
    }
    getEncryptionKey() {
        return this.encryptionKey;
    }
}
exports.SiloResource = SiloResource;


/***/ }),

/***/ 9134:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const error_1 = __webpack_require__(2944);
const transaction_1 = __webpack_require__(5681);
const ArweaveUtils = __webpack_require__(7509);
const transaction_uploader_1 = __webpack_require__(6688);
__webpack_require__(2372);
class Transactions {
    api;
    crypto;
    chunks;
    constructor(api, crypto, chunks) {
        this.api = api;
        this.crypto = crypto;
        this.chunks = chunks;
    }
    async getTransactionAnchor() {
        const res = await this.api.get(`tx_anchor`);
        if (!res.data.match(/^[a-z0-9_-]{43,}/i) || !res.ok) {
            throw new Error(`Could not getTransactionAnchor. Received: ${res.data}. Status: ${res.status}, ${res.statusText}`);
        }
        return res.data;
    }
    async getPrice(byteSize, targetAddress) {
        let endpoint = targetAddress
            ? `price/${byteSize}/${targetAddress}`
            : `price/${byteSize}`;
        const res = await this.api.get(endpoint);
        if (!/^\d+$/.test(res.data) || !res.ok) {
            throw new Error(`Could not getPrice. Received: ${res.data}. Status: ${res.status}, ${res.statusText}`);
        }
        return res.data;
    }
    async get(id) {
        const response = await this.api.get(`tx/${id}`);
        if (response.status == 200) {
            const data_size = parseInt(response.data.data_size);
            if (response.data.format >= 2 &&
                data_size > 0 &&
                data_size <= 1024 * 1024 * 12) {
                const data = await this.getData(id);
                return new transaction_1.default({
                    ...response.data,
                    data,
                });
            }
            return new transaction_1.default({
                ...response.data,
                format: response.data.format || 1,
            });
        }
        if (response.status == 404) {
            throw new error_1.default("TX_NOT_FOUND" /* ArweaveErrorType.TX_NOT_FOUND */);
        }
        if (response.status == 410) {
            throw new error_1.default("TX_FAILED" /* ArweaveErrorType.TX_FAILED */);
        }
        throw new error_1.default("TX_INVALID" /* ArweaveErrorType.TX_INVALID */);
    }
    fromRaw(attributes) {
        return new transaction_1.default(attributes);
    }
    /** @deprecated use GQL https://gql-guide.arweave.net */
    async search(tagName, tagValue) {
        return this.api
            .post(`arql`, {
            op: "equals",
            expr1: tagName,
            expr2: tagValue,
        })
            .then((response) => {
            if (!response.data) {
                return [];
            }
            return response.data;
        });
    }
    getStatus(id) {
        return this.api.get(`tx/${id}/status`).then((response) => {
            if (response.status == 200) {
                return {
                    status: 200,
                    confirmed: response.data,
                };
            }
            return {
                status: response.status,
                confirmed: null,
            };
        });
    }
    async getData(id, options) {
        let data = undefined;
        try {
            data = await this.chunks.downloadChunkedData(id);
        }
        catch (error) {
            console.error(`Error while trying to download chunked data for ${id}`);
            console.error(error);
        }
        if (!data) {
            console.warn(`Falling back to gateway cache for ${id}`);
            try {
                const { data: resData, ok, status, statusText, } = await this.api.get(`/${id}`, { responseType: "arraybuffer" });
                if (!ok) {
                    throw new Error(`Bad http status code`, {
                        cause: { status, statusText },
                    });
                }
                data = resData;
            }
            catch (error) {
                console.error(`Error while trying to download contiguous data from gateway cache for ${id}`);
                console.error(error);
            }
        }
        if (!data) {
            throw new Error(`${id} data was not found!`);
        }
        if (options && options.decode && !options.string) {
            return data;
        }
        if (options && options.decode && options.string) {
            return ArweaveUtils.bufferToString(data);
        }
        // Since decode wasn't requested, caller expects b64url encoded data.
        return ArweaveUtils.bufferTob64Url(data);
    }
    async sign(transaction, jwk, //"use_wallet" for backwards compatibility only
    options) {
        /** Non-exhaustive (only checks key names), but previously no jwk checking was done */
        const isJwk = (obj) => {
            let valid = true;
            ["n", "e", "d", "p", "q", "dp", "dq", "qi"].map((key) => !(key in obj) && (valid = false));
            return valid;
        };
        const validJwk = typeof jwk === "object" && isJwk(jwk);
        const externalWallet = typeof arweaveWallet === "object";
        if (!validJwk && !externalWallet) {
            throw new Error(`No valid JWK or external wallet found to sign transaction.`);
        }
        else if (validJwk) {
            transaction.setOwner(jwk.n);
            let dataToSign = await transaction.getSignatureData();
            let rawSignature = await this.crypto.sign(jwk, dataToSign, options);
            let id = await this.crypto.hash(rawSignature);
            transaction.setSignature({
                id: ArweaveUtils.bufferTob64Url(id),
                owner: jwk.n,
                signature: ArweaveUtils.bufferTob64Url(rawSignature),
            });
        }
        else if (externalWallet) {
            try {
                const existingPermissions = await arweaveWallet.getPermissions();
                if (!existingPermissions.includes("SIGN_TRANSACTION"))
                    await arweaveWallet.connect(["SIGN_TRANSACTION"]);
            }
            catch {
                // Permission is already granted
            }
            const signedTransaction = await arweaveWallet.sign(transaction, options);
            transaction.setSignature({
                id: signedTransaction.id,
                owner: signedTransaction.owner,
                reward: signedTransaction.reward,
                tags: signedTransaction.tags,
                signature: signedTransaction.signature,
            });
        }
        else {
            //can't get here, but for sanity we'll throw an error.
            throw new Error(`An error occurred while signing. Check wallet is valid`);
        }
    }
    async verify(transaction) {
        const signaturePayload = await transaction.getSignatureData();
        /**
         * The transaction ID should be a SHA-256 hash of the raw signature bytes, so this needs
         * to be recalculated from the signature and checked against the transaction ID.
         */
        const rawSignature = transaction.get("signature", {
            decode: true,
            string: false,
        });
        const expectedId = ArweaveUtils.bufferTob64Url(await this.crypto.hash(rawSignature));
        if (transaction.id !== expectedId) {
            throw new Error(`Invalid transaction signature or ID! The transaction ID doesn't match the expected SHA-256 hash of the signature.`);
        }
        /**
         * Now verify the signature is valid and signed by the owner wallet (owner field = originating wallet public key).
         */
        return this.crypto.verify(transaction.owner, signaturePayload, rawSignature);
    }
    async post(transaction) {
        if (typeof transaction === "string") {
            transaction = new transaction_1.default(JSON.parse(transaction));
        }
        else if (typeof transaction.readInt32BE === "function") {
            transaction = new transaction_1.default(JSON.parse(transaction.toString()));
        }
        else if (typeof transaction === "object" &&
            !(transaction instanceof transaction_1.default)) {
            transaction = new transaction_1.default(transaction);
        }
        if (!(transaction instanceof transaction_1.default)) {
            throw new Error(`Must be Transaction object`);
        }
        if (!transaction.chunks) {
            await transaction.prepareChunks(transaction.data);
        }
        const uploader = await this.getUploader(transaction, transaction.data);
        // Emulate existing error & return value behavior.
        try {
            while (!uploader.isComplete) {
                await uploader.uploadChunk();
            }
        }
        catch (e) {
            if (uploader.lastResponseStatus > 0) {
                return {
                    status: uploader.lastResponseStatus,
                    statusText: uploader.lastResponseError,
                    data: {
                        error: uploader.lastResponseError,
                    },
                };
            }
            throw e;
        }
        return {
            status: 200,
            statusText: "OK",
            data: {},
        };
    }
    /**
     * Gets an uploader than can be used to upload a transaction chunk by chunk, giving progress
     * and the ability to resume.
     *
     * Usage example:
     *
     * ```
     * const uploader = arweave.transactions.getUploader(transaction);
     * while (!uploader.isComplete) {
     *   await uploader.uploadChunk();
     *   console.log(`${uploader.pctComplete}%`);
     * }
     * ```
     *
     * @param upload a Transaction object, a previously save progress object, or a transaction id.
     * @param data the data of the transaction. Required when resuming an upload.
     */
    async getUploader(upload, data) {
        let uploader;
        if (data instanceof ArrayBuffer) {
            data = new Uint8Array(data);
        }
        if (upload instanceof transaction_1.default) {
            if (!data) {
                data = upload.data;
            }
            if (!(data instanceof Uint8Array)) {
                throw new Error("Data format is invalid");
            }
            if (!upload.chunks) {
                await upload.prepareChunks(data);
            }
            uploader = new transaction_uploader_1.TransactionUploader(this.api, upload);
            if (!uploader.data || uploader.data.length === 0) {
                uploader.data = data;
            }
        }
        else {
            if (typeof upload === "string") {
                upload = await transaction_uploader_1.TransactionUploader.fromTransactionId(this.api, upload);
            }
            if (!data || !(data instanceof Uint8Array)) {
                throw new Error(`Must provide data when resuming upload`);
            }
            // upload should be a serialized upload.
            uploader = await transaction_uploader_1.TransactionUploader.fromSerialized(this.api, upload, data);
        }
        return uploader;
    }
    /**
     * Async generator version of uploader
     *
     * Usage example:
     *
     * ```
     * for await (const uploader of arweave.transactions.upload(tx)) {
     *  console.log(`${uploader.pctComplete}%`);
     * }
     * ```
     *
     * @param upload a Transaction object, a previously save uploader, or a transaction id.
     * @param data the data of the transaction. Required when resuming an upload.
     */
    async *upload(upload, data) {
        const uploader = await this.getUploader(upload, data);
        while (!uploader.isComplete) {
            await uploader.uploadChunk();
            yield uploader;
        }
        return uploader;
    }
}
exports["default"] = Transactions;


/***/ }),

/***/ 2202:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const ArweaveUtils = __webpack_require__(7509);
__webpack_require__(2372);
class Wallets {
    api;
    crypto;
    constructor(api, crypto) {
        this.api = api;
        this.crypto = crypto;
    }
    /**
     * Get the wallet balance for the given address.
     *
     * @param {string} address - The arweave address to get the balance for.
     *
     * @returns {Promise<string>} - Promise which resolves with a winston string balance.
     */
    getBalance(address) {
        return this.api.get(`wallet/${address}/balance`).then((response) => {
            return response.data;
        });
    }
    /**
     * Get the last transaction ID for the given wallet address.
     *
     * @param {string} address - The arweave address to get the transaction for.
     *
     * @returns {Promise<string>} - Promise which resolves with a transaction ID.
     */
    getLastTransactionID(address) {
        return this.api.get(`wallet/${address}/last_tx`).then((response) => {
            return response.data;
        });
    }
    generate() {
        return this.crypto.generateJWK();
    }
    async jwkToAddress(jwk) {
        if (!jwk || jwk === "use_wallet") {
            return this.getAddress();
        }
        else {
            return this.getAddress(jwk);
        }
    }
    async getAddress(jwk) {
        if (!jwk || jwk === "use_wallet") {
            try {
                // @ts-ignore
                await arweaveWallet.connect(["ACCESS_ADDRESS"]);
            }
            catch {
                // Permission is already granted
            }
            // @ts-ignore
            return arweaveWallet.getActiveAddress();
        }
        else {
            return this.ownerToAddress(jwk.n);
        }
    }
    async ownerToAddress(owner) {
        return ArweaveUtils.bufferTob64Url(await this.crypto.hash(ArweaveUtils.b64UrlToBuffer(owner)));
    }
}
exports["default"] = Wallets;


/***/ }),

/***/ 8738:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ 1267:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;;(function (globalObject) {
  'use strict';

/*
 *      bignumber.js v9.1.2
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */


  var BigNumber,
    isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
    mathceil = Math.ceil,
    mathfloor = Math.floor,

    bignumberError = '[BigNumber Error] ',
    tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

    BASE = 1e14,
    LOG_BASE = 14,
    MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
    // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
    POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
    SQRT_BASE = 1e7,

    // EDITABLE
    // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
    // the arguments to toExponential, toFixed, toFormat, and toPrecision.
    MAX = 1E9;                                   // 0 to MAX_INT32


  /*
   * Create and return a BigNumber constructor.
   */
  function clone(configObject) {
    var div, convertBase, parseNumeric,
      P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
      ONE = new BigNumber(1),


      //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


      // The default values below must be integers within the inclusive ranges stated.
      // The values can also be changed at run-time using BigNumber.set.

      // The maximum number of decimal places for operations involving division.
      DECIMAL_PLACES = 20,                     // 0 to MAX

      // The rounding mode used when rounding to the above decimal places, and when using
      // toExponential, toFixed, toFormat and toPrecision, and round (default value).
      // UP         0 Away from zero.
      // DOWN       1 Towards zero.
      // CEIL       2 Towards +Infinity.
      // FLOOR      3 Towards -Infinity.
      // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      ROUNDING_MODE = 4,                       // 0 to 8

      // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

      // The exponent value at and beneath which toString returns exponential notation.
      // Number type: -7
      TO_EXP_NEG = -7,                         // 0 to -MAX

      // The exponent value at and above which toString returns exponential notation.
      // Number type: 21
      TO_EXP_POS = 21,                         // 0 to MAX

      // RANGE : [MIN_EXP, MAX_EXP]

      // The minimum exponent value, beneath which underflow to zero occurs.
      // Number type: -324  (5e-324)
      MIN_EXP = -1e7,                          // -1 to -MAX

      // The maximum exponent value, above which overflow to Infinity occurs.
      // Number type:  308  (1.7976931348623157e+308)
      // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
      MAX_EXP = 1e7,                           // 1 to MAX

      // Whether to use cryptographically-secure random number generation, if available.
      CRYPTO = false,                          // true or false

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP        0 The remainder is positive if the dividend is negative, else is negative.
      // DOWN      1 The remainder has the same sign as the dividend.
      //             This modulo mode is commonly known as 'truncated division' and is
      //             equivalent to (a % n) in JavaScript.
      // FLOOR     3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
      // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
      //             The remainder is always positive.
      //
      // The truncated division, floored division, Euclidian division and IEEE 754 remainder
      // modes are commonly used for the modulus operation.
      // Although the other rounding modes can also be used, they may not give useful results.
      MODULO_MODE = 1,                         // 0 to 9

      // The maximum number of significant digits of the result of the exponentiatedBy operation.
      // If POW_PRECISION is 0, there will be unlimited significant digits.
      POW_PRECISION = 0,                       // 0 to MAX

      // The format specification used by the BigNumber.prototype.toFormat method.
      FORMAT = {
        prefix: '',
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ',',
        decimalSeparator: '.',
        fractionGroupSize: 0,
        fractionGroupSeparator: '\xA0',        // non-breaking space
        suffix: ''
      },

      // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
      // '-', '.', whitespace, or repeated character.
      // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
      ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
      alphabetHasNormalDecimalDigits = true;


    //------------------------------------------------------------------------------------------


    // CONSTRUCTOR


    /*
     * The BigNumber constructor and exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * v {number|string|BigNumber} A numeric value.
     * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
     */
    function BigNumber(v, b) {
      var alphabet, c, caseChanged, e, i, isNum, len, str,
        x = this;

      // Enable constructor call without `new`.
      if (!(x instanceof BigNumber)) return new BigNumber(v, b);

      if (b == null) {

        if (v && v._isBigNumber === true) {
          x.s = v.s;

          if (!v.c || v.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (v.e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = v.e;
            x.c = v.c.slice();
          }

          return;
        }

        if ((isNum = typeof v == 'number') && v * 0 == 0) {

          // Use `1 / n` to handle minus zero also.
          x.s = 1 / v < 0 ? (v = -v, -1) : 1;

          // Fast path for integers, where n < 2147483648 (2**31).
          if (v === ~~v) {
            for (e = 0, i = v; i >= 10; i /= 10, e++);

            if (e > MAX_EXP) {
              x.c = x.e = null;
            } else {
              x.e = e;
              x.c = [v];
            }

            return;
          }

          str = String(v);
        } else {

          if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

          x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
        }

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

        // Exponential form?
        if ((i = str.search(/e/i)) > 0) {

          // Determine exponent.
          if (e < 0) e = i;
          e += +str.slice(i + 1);
          str = str.substring(0, i);
        } else if (e < 0) {

          // Integer.
          e = str.length;
        }

      } else {

        // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
        intCheck(b, 2, ALPHABET.length, 'Base');

        // Allow exponential notation to be used with base 10 argument, while
        // also rounding to DECIMAL_PLACES as with other bases.
        if (b == 10 && alphabetHasNormalDecimalDigits) {
          x = new BigNumber(v);
          return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
        }

        str = String(v);

        if (isNum = typeof v == 'number') {

          // Avoid potential interpretation of Infinity and NaN as base 44+ values.
          if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

          x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

          // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
          if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
            throw Error
             (tooManyDigits + v);
          }
        } else {
          x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
        }

        alphabet = ALPHABET.slice(0, b);
        e = i = 0;

        // Check that str is a valid base b number.
        // Don't use RegExp, so alphabet can contain special characters.
        for (len = str.length; i < len; i++) {
          if (alphabet.indexOf(c = str.charAt(i)) < 0) {
            if (c == '.') {

              // If '.' is not the first character and it has not be found before.
              if (i > e) {
                e = len;
                continue;
              }
            } else if (!caseChanged) {

              // Allow e.g. hexadecimal 'FF' as well as 'ff'.
              if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                  str == str.toLowerCase() && (str = str.toUpperCase())) {
                caseChanged = true;
                i = -1;
                e = 0;
                continue;
              }
            }

            return parseNumeric(x, String(v), isNum, b);
          }
        }

        // Prevent later check for length on converted number.
        isNum = false;
        str = convertBase(str, b, 10, x.s);

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
        else e = str.length;
      }

      // Determine leading zeros.
      for (i = 0; str.charCodeAt(i) === 48; i++);

      // Determine trailing zeros.
      for (len = str.length; str.charCodeAt(--len) === 48;);

      if (str = str.slice(i, ++len)) {
        len -= i;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (isNum && BigNumber.DEBUG &&
          len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
            throw Error
             (tooManyDigits + (x.s * v));
        }

         // Overflow?
        if ((e = e - i - 1) > MAX_EXP) {

          // Infinity.
          x.c = x.e = null;

        // Underflow?
        } else if (e < MIN_EXP) {

          // Zero.
          x.c = [x.e = 0];
        } else {
          x.e = e;
          x.c = [];

          // Transform base

          // e is the base 10 exponent.
          // i is where to slice str to get the first element of the coefficient array.
          i = (e + 1) % LOG_BASE;
          if (e < 0) i += LOG_BASE;  // i < 1

          if (i < len) {
            if (i) x.c.push(+str.slice(0, i));

            for (len -= LOG_BASE; i < len;) {
              x.c.push(+str.slice(i, i += LOG_BASE));
            }

            i = LOG_BASE - (str = str.slice(i)).length;
          } else {
            i -= len;
          }

          for (; i--; str += '0');
          x.c.push(+str);
        }
      } else {

        // Zero.
        x.c = [x.e = 0];
      }
    }


    // CONSTRUCTOR PROPERTIES


    BigNumber.clone = clone;

    BigNumber.ROUND_UP = 0;
    BigNumber.ROUND_DOWN = 1;
    BigNumber.ROUND_CEIL = 2;
    BigNumber.ROUND_FLOOR = 3;
    BigNumber.ROUND_HALF_UP = 4;
    BigNumber.ROUND_HALF_DOWN = 5;
    BigNumber.ROUND_HALF_EVEN = 6;
    BigNumber.ROUND_HALF_CEIL = 7;
    BigNumber.ROUND_HALF_FLOOR = 8;
    BigNumber.EUCLID = 9;


    /*
     * Configure infrequently-changing library-wide settings.
     *
     * Accept an object with the following optional properties (if the value of a property is
     * a number, it must be an integer within the inclusive range stated):
     *
     *   DECIMAL_PLACES   {number}           0 to MAX
     *   ROUNDING_MODE    {number}           0 to 8
     *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
     *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
     *   CRYPTO           {boolean}          true or false
     *   MODULO_MODE      {number}           0 to 9
     *   POW_PRECISION       {number}           0 to MAX
     *   ALPHABET         {string}           A string of two or more unique characters which does
     *                                       not contain '.'.
     *   FORMAT           {object}           An object with some of the following properties:
     *     prefix                 {string}
     *     groupSize              {number}
     *     secondaryGroupSize     {number}
     *     groupSeparator         {string}
     *     decimalSeparator       {string}
     *     fractionGroupSize      {number}
     *     fractionGroupSeparator {string}
     *     suffix                 {string}
     *
     * (The values assigned to the above FORMAT object properties are not checked for validity.)
     *
     * E.g.
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     *
     * Ignore properties/parameters set to null or undefined, except for ALPHABET.
     *
     * Return an object with the properties current values.
     */
    BigNumber.config = BigNumber.set = function (obj) {
      var p, v;

      if (obj != null) {

        if (typeof obj == 'object') {

          // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            DECIMAL_PLACES = v;
          }

          // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
          // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
            v = obj[p];
            intCheck(v, 0, 8, p);
            ROUNDING_MODE = v;
          }

          // EXPONENTIAL_AT {number|number[]}
          // Integer, -MAX to MAX inclusive or
          // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
          // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, 0, p);
              intCheck(v[1], 0, MAX, p);
              TO_EXP_NEG = v[0];
              TO_EXP_POS = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
            }
          }

          // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
          // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
          // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
          if (obj.hasOwnProperty(p = 'RANGE')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, -1, p);
              intCheck(v[1], 1, MAX, p);
              MIN_EXP = v[0];
              MAX_EXP = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              if (v) {
                MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
              } else {
                throw Error
                 (bignumberError + p + ' cannot be zero: ' + v);
              }
            }
          }

          // CRYPTO {boolean} true or false.
          // '[BigNumber Error] CRYPTO not true or false: {v}'
          // '[BigNumber Error] crypto unavailable'
          if (obj.hasOwnProperty(p = 'CRYPTO')) {
            v = obj[p];
            if (v === !!v) {
              if (v) {
                if (typeof crypto != 'undefined' && crypto &&
                 (crypto.getRandomValues || crypto.randomBytes)) {
                  CRYPTO = v;
                } else {
                  CRYPTO = !v;
                  throw Error
                   (bignumberError + 'crypto unavailable');
                }
              } else {
                CRYPTO = v;
              }
            } else {
              throw Error
               (bignumberError + p + ' not true or false: ' + v);
            }
          }

          // MODULO_MODE {number} Integer, 0 to 9 inclusive.
          // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
            v = obj[p];
            intCheck(v, 0, 9, p);
            MODULO_MODE = v;
          }

          // POW_PRECISION {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            POW_PRECISION = v;
          }

          // FORMAT {object}
          // '[BigNumber Error] FORMAT not an object: {v}'
          if (obj.hasOwnProperty(p = 'FORMAT')) {
            v = obj[p];
            if (typeof v == 'object') FORMAT = v;
            else throw Error
             (bignumberError + p + ' not an object: ' + v);
          }

          // ALPHABET {string}
          // '[BigNumber Error] ALPHABET invalid: {v}'
          if (obj.hasOwnProperty(p = 'ALPHABET')) {
            v = obj[p];

            // Disallow if less than two characters,
            // or if it contains '+', '-', '.', whitespace, or a repeated character.
            if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
              alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
              ALPHABET = v;
            } else {
              throw Error
               (bignumberError + p + ' invalid: ' + v);
            }
          }

        } else {

          // '[BigNumber Error] Object expected: {v}'
          throw Error
           (bignumberError + 'Object expected: ' + obj);
        }
      }

      return {
        DECIMAL_PLACES: DECIMAL_PLACES,
        ROUNDING_MODE: ROUNDING_MODE,
        EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
        RANGE: [MIN_EXP, MAX_EXP],
        CRYPTO: CRYPTO,
        MODULO_MODE: MODULO_MODE,
        POW_PRECISION: POW_PRECISION,
        FORMAT: FORMAT,
        ALPHABET: ALPHABET
      };
    };


    /*
     * Return true if v is a BigNumber instance, otherwise return false.
     *
     * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
     *
     * v {any}
     *
     * '[BigNumber Error] Invalid BigNumber: {v}'
     */
    BigNumber.isBigNumber = function (v) {
      if (!v || v._isBigNumber !== true) return false;
      if (!BigNumber.DEBUG) return true;

      var i, n,
        c = v.c,
        e = v.e,
        s = v.s;

      out: if ({}.toString.call(c) == '[object Array]') {

        if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

          // If the first element is zero, the BigNumber value must be zero.
          if (c[0] === 0) {
            if (e === 0 && c.length === 1) return true;
            break out;
          }

          // Calculate number of digits that c[0] should have, based on the exponent.
          i = (e + 1) % LOG_BASE;
          if (i < 1) i += LOG_BASE;

          // Calculate number of digits of c[0].
          //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
          if (String(c[0]).length == i) {

            for (i = 0; i < c.length; i++) {
              n = c[i];
              if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
            }

            // Last element cannot be zero, unless it is the only element.
            if (n !== 0) return true;
          }
        }

      // Infinity/NaN
      } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
        return true;
      }

      throw Error
        (bignumberError + 'Invalid BigNumber: ' + v);
    };


    /*
     * Return a new BigNumber whose value is the maximum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.maximum = BigNumber.max = function () {
      return maxOrMin(arguments, -1);
    };


    /*
     * Return a new BigNumber whose value is the minimum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.minimum = BigNumber.min = function () {
      return maxOrMin(arguments, 1);
    };


    /*
     * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
     * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
     * zeros are produced).
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
     * '[BigNumber Error] crypto unavailable'
     */
    BigNumber.random = (function () {
      var pow2_53 = 0x20000000000000;

      // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
      // Check if Math.random() produces more than 32 bits of randomness.
      // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
      // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
      var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
       ? function () { return mathfloor(Math.random() * pow2_53); }
       : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
         (Math.random() * 0x800000 | 0); };

      return function (dp) {
        var a, b, e, k, v,
          i = 0,
          c = [],
          rand = new BigNumber(ONE);

        if (dp == null) dp = DECIMAL_PLACES;
        else intCheck(dp, 0, MAX);

        k = mathceil(dp / LOG_BASE);

        if (CRYPTO) {

          // Browsers supporting crypto.getRandomValues.
          if (crypto.getRandomValues) {

            a = crypto.getRandomValues(new Uint32Array(k *= 2));

            for (; i < k;) {

              // 53 bits:
              // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
              // 11111 11111111 11111111 11111111 11100000 00000000 00000000
              // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
              //                                     11111 11111111 11111111
              // 0x20000 is 2^21.
              v = a[i] * 0x20000 + (a[i + 1] >>> 11);

              // Rejection sampling:
              // 0 <= v < 9007199254740992
              // Probability that v >= 9e15, is
              // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
              if (v >= 9e15) {
                b = crypto.getRandomValues(new Uint32Array(2));
                a[i] = b[0];
                a[i + 1] = b[1];
              } else {

                // 0 <= v <= 8999999999999999
                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 2;
              }
            }
            i = k / 2;

          // Node.js supporting crypto.randomBytes.
          } else if (crypto.randomBytes) {

            // buffer
            a = crypto.randomBytes(k *= 7);

            for (; i < k;) {

              // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
              // 0x100000000 is 2^32, 0x1000000 is 2^24
              // 11111 11111111 11111111 11111111 11111111 11111111 11111111
              // 0 <= v < 9007199254740992
              v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                 (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                 (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

              if (v >= 9e15) {
                crypto.randomBytes(7).copy(a, i);
              } else {

                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 7;
              }
            }
            i = k / 7;
          } else {
            CRYPTO = false;
            throw Error
             (bignumberError + 'crypto unavailable');
          }
        }

        // Use Math.random.
        if (!CRYPTO) {

          for (; i < k;) {
            v = random53bitInt();
            if (v < 9e15) c[i++] = v % 1e14;
          }
        }

        k = c[--i];
        dp %= LOG_BASE;

        // Convert trailing digits to zeros according to dp.
        if (k && dp) {
          v = POWS_TEN[LOG_BASE - dp];
          c[i] = mathfloor(k / v) * v;
        }

        // Remove trailing elements which are zero.
        for (; c[i] === 0; c.pop(), i--);

        // Zero?
        if (i < 0) {
          c = [e = 0];
        } else {

          // Remove leading elements which are zero and adjust exponent accordingly.
          for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

          // Count the digits of the first element of c to determine leading zeros, and...
          for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

          // adjust the exponent accordingly.
          if (i < LOG_BASE) e -= LOG_BASE - i;
        }

        rand.e = e;
        rand.c = c;
        return rand;
      };
    })();


    /*
     * Return a BigNumber whose value is the sum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.sum = function () {
      var i = 1,
        args = arguments,
        sum = new BigNumber(args[0]);
      for (; i < args.length;) sum = sum.plus(args[i++]);
      return sum;
    };


    // PRIVATE FUNCTIONS


    // Called by BigNumber and BigNumber.prototype.toString.
    convertBase = (function () {
      var decimal = '0123456789';

      /*
       * Convert string of baseIn to an array of numbers of baseOut.
       * Eg. toBaseOut('255', 10, 16) returns [15, 15].
       * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
       */
      function toBaseOut(str, baseIn, baseOut, alphabet) {
        var j,
          arr = [0],
          arrL,
          i = 0,
          len = str.length;

        for (; i < len;) {
          for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

          arr[0] += alphabet.indexOf(str.charAt(i++));

          for (j = 0; j < arr.length; j++) {

            if (arr[j] > baseOut - 1) {
              if (arr[j + 1] == null) arr[j + 1] = 0;
              arr[j + 1] += arr[j] / baseOut | 0;
              arr[j] %= baseOut;
            }
          }
        }

        return arr.reverse();
      }

      // Convert a numeric string of baseIn to a numeric string of baseOut.
      // If the caller is toString, we are converting from base 10 to baseOut.
      // If the caller is BigNumber, we are converting from baseIn to base 10.
      return function (str, baseIn, baseOut, sign, callerIsToString) {
        var alphabet, d, e, k, r, x, xc, y,
          i = str.indexOf('.'),
          dp = DECIMAL_PLACES,
          rm = ROUNDING_MODE;

        // Non-integer.
        if (i >= 0) {
          k = POW_PRECISION;

          // Unlimited precision.
          POW_PRECISION = 0;
          str = str.replace('.', '');
          y = new BigNumber(baseIn);
          x = y.pow(str.length - i);
          POW_PRECISION = k;

          // Convert str as if an integer, then restore the fraction part by dividing the
          // result by its base raised to a power.

          y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
           10, baseOut, decimal);
          y.e = y.c.length;
        }

        // Convert the number as integer.

        xc = toBaseOut(str, baseIn, baseOut, callerIsToString
         ? (alphabet = ALPHABET, decimal)
         : (alphabet = decimal, ALPHABET));

        // xc now represents str as an integer and converted to baseOut. e is the exponent.
        e = k = xc.length;

        // Remove trailing zeros.
        for (; xc[--k] == 0; xc.pop());

        // Zero?
        if (!xc[0]) return alphabet.charAt(0);

        // Does str represent an integer? If so, no need for the division.
        if (i < 0) {
          --e;
        } else {
          x.c = xc;
          x.e = e;

          // The sign is needed for correct rounding.
          x.s = sign;
          x = div(x, y, dp, rm, baseOut);
          xc = x.c;
          r = x.r;
          e = x.e;
        }

        // xc now represents str converted to baseOut.

        // THe index of the rounding digit.
        d = e + dp + 1;

        // The rounding digit: the digit to the right of the digit that may be rounded up.
        i = xc[d];

        // Look at the rounding digits and mode to determine whether to round up.

        k = baseOut / 2;
        r = r || d < 0 || xc[d + 1] != null;

        r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
              : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
               rm == (x.s < 0 ? 8 : 7));

        // If the index of the rounding digit is not greater than zero, or xc represents
        // zero, then the result of the base conversion is zero or, if rounding up, a value
        // such as 0.00001.
        if (d < 1 || !xc[0]) {

          // 1^-dp or 0
          str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
        } else {

          // Truncate xc to the required number of decimal places.
          xc.length = d;

          // Round up?
          if (r) {

            // Rounding up may mean the previous digit has to be rounded up and so on.
            for (--baseOut; ++xc[--d] > baseOut;) {
              xc[d] = 0;

              if (!d) {
                ++e;
                xc = [1].concat(xc);
              }
            }
          }

          // Determine trailing zeros.
          for (k = xc.length; !xc[--k];);

          // E.g. [4, 11, 15] becomes 4bf.
          for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

          // Add leading zeros, decimal point and trailing zeros as required.
          str = toFixedPoint(str, e, alphabet.charAt(0));
        }

        // The caller will add the sign.
        return str;
      };
    })();


    // Perform division in the specified base. Called by div and convertBase.
    div = (function () {

      // Assume non-zero x and k.
      function multiply(x, k, base) {
        var m, temp, xlo, xhi,
          carry = 0,
          i = x.length,
          klo = k % SQRT_BASE,
          khi = k / SQRT_BASE | 0;

        for (x = x.slice(); i--;) {
          xlo = x[i] % SQRT_BASE;
          xhi = x[i] / SQRT_BASE | 0;
          m = khi * xlo + xhi * klo;
          temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
          carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
          x[i] = temp % base;
        }

        if (carry) x = [carry].concat(x);

        return x;
      }

      function compare(a, b, aL, bL) {
        var i, cmp;

        if (aL != bL) {
          cmp = aL > bL ? 1 : -1;
        } else {

          for (i = cmp = 0; i < aL; i++) {

            if (a[i] != b[i]) {
              cmp = a[i] > b[i] ? 1 : -1;
              break;
            }
          }
        }

        return cmp;
      }

      function subtract(a, b, aL, base) {
        var i = 0;

        // Subtract b from a.
        for (; aL--;) {
          a[aL] -= i;
          i = a[aL] < b[aL] ? 1 : 0;
          a[aL] = i * base + a[aL] - b[aL];
        }

        // Remove leading zeros.
        for (; !a[0] && a.length > 1; a.splice(0, 1));
      }

      // x: dividend, y: divisor.
      return function (x, y, dp, rm, base) {
        var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
          yL, yz,
          s = x.s == y.s ? 1 : -1,
          xc = x.c,
          yc = y.c;

        // Either NaN, Infinity or 0?
        if (!xc || !xc[0] || !yc || !yc[0]) {

          return new BigNumber(

           // Return NaN if either NaN, or both Infinity or 0.
           !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
         );
        }

        q = new BigNumber(s);
        qc = q.c = [];
        e = x.e - y.e;
        s = dp + e + 1;

        if (!base) {
          base = BASE;
          e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
          s = s / LOG_BASE | 0;
        }

        // Result exponent may be one less then the current value of e.
        // The coefficients of the BigNumbers from convertBase may have trailing zeros.
        for (i = 0; yc[i] == (xc[i] || 0); i++);

        if (yc[i] > (xc[i] || 0)) e--;

        if (s < 0) {
          qc.push(1);
          more = true;
        } else {
          xL = xc.length;
          yL = yc.length;
          i = 0;
          s += 2;

          // Normalise xc and yc so highest order digit of yc is >= base / 2.

          n = mathfloor(base / (yc[0] + 1));

          // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
          // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
          if (n > 1) {
            yc = multiply(yc, n, base);
            xc = multiply(xc, n, base);
            yL = yc.length;
            xL = xc.length;
          }

          xi = yL;
          rem = xc.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL; rem[remL++] = 0);
          yz = yc.slice();
          yz = [0].concat(yz);
          yc0 = yc[0];
          if (yc[1] >= base / 2) yc0++;
          // Not necessary, but to prevent trial digit n > base, when using base 3.
          // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

          do {
            n = 0;

            // Compare divisor and remainder.
            cmp = compare(yc, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, n.

              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // n is how many times the divisor goes into the current remainder.
              n = mathfloor(rem0 / yc0);

              //  Algorithm:
              //  product = divisor multiplied by trial digit (n).
              //  Compare product and remainder.
              //  If product is greater than remainder:
              //    Subtract divisor from product, decrement trial digit.
              //  Subtract product from remainder.
              //  If product was less than remainder at the last compare:
              //    Compare new remainder and divisor.
              //    If remainder is greater than divisor:
              //      Subtract divisor from remainder, increment trial digit.

              if (n > 1) {

                // n may be > base only when base is 3.
                if (n >= base) n = base - 1;

                // product = divisor * trial digit.
                prod = multiply(yc, n, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                // If product > remainder then trial digit n too high.
                // n is 1 too high about 5% of the time, and is not known to have
                // ever been more than 1 too high.
                while (compare(prod, rem, prodL, remL) == 1) {
                  n--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yc, prodL, base);
                  prodL = prod.length;
                  cmp = 1;
                }
              } else {

                // n is 0 or 1, cmp is -1.
                // If n is 0, there is no need to compare yc and rem again below,
                // so change cmp to 1 to avoid it.
                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                if (n == 0) {

                  // divisor < remainder, so n must be at least 1.
                  cmp = n = 1;
                }

                // product = divisor
                prod = yc.slice();
                prodL = prod.length;
              }

              if (prodL < remL) prod = [0].concat(prod);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);
              remL = rem.length;

               // If product was < remainder.
              if (cmp == -1) {

                // Compare divisor and new remainder.
                // If divisor < new remainder, subtract divisor from remainder.
                // Trial digit n too low.
                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                while (compare(yc, rem, yL, remL) < 1) {
                  n++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yc, remL, base);
                  remL = rem.length;
                }
              }
            } else if (cmp === 0) {
              n++;
              rem = [0];
            } // else cmp === 1 and n will be 0

            // Add the next digit, n, to the result array.
            qc[i++] = n;

            // Update the remainder.
            if (rem[0]) {
              rem[remL++] = xc[xi] || 0;
            } else {
              rem = [xc[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] != null) && s--);

          more = rem[0] != null;

          // Leading zero?
          if (!qc[0]) qc.splice(0, 1);
        }

        if (base == BASE) {

          // To calculate q.e, first get the number of digits of qc[0].
          for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

          round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

        // Caller is convertBase.
        } else {
          q.e = e;
          q.r = +more;
        }

        return q;
      };
    })();


    /*
     * Return a string representing the value of BigNumber n in fixed-point or exponential
     * notation rounded to the specified decimal places or significant digits.
     *
     * n: a BigNumber.
     * i: the index of the last digit required (i.e. the digit that may be rounded up).
     * rm: the rounding mode.
     * id: 1 (toExponential) or 2 (toPrecision).
     */
    function format(n, i, rm, id) {
      var c0, e, ne, len, str;

      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      if (!n.c) return n.toString();

      c0 = n.c[0];
      ne = n.e;

      if (i == null) {
        str = coeffToString(n.c);
        str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
         ? toExponential(str, ne)
         : toFixedPoint(str, ne, '0');
      } else {
        n = round(new BigNumber(n), i, rm);

        // n.e may have changed if the value was rounded up.
        e = n.e;

        str = coeffToString(n.c);
        len = str.length;

        // toPrecision returns exponential notation if the number of significant digits
        // specified is less than the number of digits necessary to represent the integer
        // part of the value in fixed-point notation.

        // Exponential notation.
        if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

          // Append zeros?
          for (; len < i; str += '0', len++);
          str = toExponential(str, e);

        // Fixed-point notation.
        } else {
          i -= ne;
          str = toFixedPoint(str, e, '0');

          // Append zeros?
          if (e + 1 > len) {
            if (--i > 0) for (str += '.'; i--; str += '0');
          } else {
            i += e - len;
            if (i > 0) {
              if (e + 1 == len) str += '.';
              for (; i--; str += '0');
            }
          }
        }
      }

      return n.s < 0 && c0 ? '-' + str : str;
    }


    // Handle BigNumber.max and BigNumber.min.
    // If any number is NaN, return NaN.
    function maxOrMin(args, n) {
      var k, y,
        i = 1,
        x = new BigNumber(args[0]);

      for (; i < args.length; i++) {
        y = new BigNumber(args[i]);
        if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
          x = y;
        }
      }

      return x;
    }


    /*
     * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
     * Called by minus, plus and times.
     */
    function normalise(n, c, e) {
      var i = 1,
        j = c.length;

       // Remove trailing zeros.
      for (; !c[--j]; c.pop());

      // Calculate the base 10 exponent. First get the number of digits of c[0].
      for (j = c[0]; j >= 10; j /= 10, i++);

      // Overflow?
      if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

        // Infinity.
        n.c = n.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        n.c = [n.e = 0];
      } else {
        n.e = e;
        n.c = c;
      }

      return n;
    }


    // Handle values that fail the validity test in BigNumber.
    parseNumeric = (function () {
      var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
        dotAfter = /^([^.]+)\.$/,
        dotBefore = /^\.([^.]+)$/,
        isInfinityOrNaN = /^-?(Infinity|NaN)$/,
        whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

      return function (x, str, isNum, b) {
        var base,
          s = isNum ? str : str.replace(whitespaceOrPlus, '');

        // No exception on ±Infinity or NaN.
        if (isInfinityOrNaN.test(s)) {
          x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
        } else {
          if (!isNum) {

            // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
            s = s.replace(basePrefix, function (m, p1, p2) {
              base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
              return !b || b == base ? p1 : m;
            });

            if (b) {
              base = b;

              // E.g. '1.' to '1', '.1' to '0.1'
              s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
            }

            if (str != s) return new BigNumber(s, base);
          }

          // '[BigNumber Error] Not a number: {n}'
          // '[BigNumber Error] Not a base {b} number: {n}'
          if (BigNumber.DEBUG) {
            throw Error
              (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
          }

          // NaN
          x.s = null;
        }

        x.c = x.e = null;
      }
    })();


    /*
     * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
     * If r is truthy, it is known that there are more digits after the rounding digit.
     */
    function round(x, sd, rm, r) {
      var d, i, j, k, n, ni, rd,
        xc = x.c,
        pows10 = POWS_TEN;

      // if x is not Infinity or NaN...
      if (xc) {

        // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
        // n is a base 1e14 number, the value of the element of array x.c containing rd.
        // ni is the index of n within x.c.
        // d is the number of digits of n.
        // i is the index of rd within n including leading zeros.
        // j is the actual index of rd within n (if < 0, rd is a leading zero).
        out: {

          // Get the number of digits of the first element of xc.
          for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
          i = sd - d;

          // If the rounding digit is in the first element of xc...
          if (i < 0) {
            i += LOG_BASE;
            j = sd;
            n = xc[ni = 0];

            // Get the rounding digit at index j of n.
            rd = mathfloor(n / pows10[d - j - 1] % 10);
          } else {
            ni = mathceil((i + 1) / LOG_BASE);

            if (ni >= xc.length) {

              if (r) {

                // Needed by sqrt.
                for (; xc.length <= ni; xc.push(0));
                n = rd = 0;
                d = 1;
                i %= LOG_BASE;
                j = i - LOG_BASE + 1;
              } else {
                break out;
              }
            } else {
              n = k = xc[ni];

              // Get the number of digits of n.
              for (d = 1; k >= 10; k /= 10, d++);

              // Get the index of rd within n.
              i %= LOG_BASE;

              // Get the index of rd within n, adjusted for leading zeros.
              // The number of leading zeros of n is given by LOG_BASE - d.
              j = i - LOG_BASE + d;

              // Get the rounding digit at index j of n.
              rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
            }
          }

          r = r || sd < 0 ||

          // Are there any non-zero digits after the rounding digit?
          // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
          // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
           xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

          r = rm < 4
           ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
           : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

            // Check whether the digit to the left of the rounding digit is odd.
            ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
             rm == (x.s < 0 ? 8 : 7));

          if (sd < 1 || !xc[0]) {
            xc.length = 0;

            if (r) {

              // Convert sd to decimal places.
              sd -= x.e + 1;

              // 1, 0.1, 0.01, 0.001, 0.0001 etc.
              xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
              x.e = -sd || 0;
            } else {

              // Zero.
              xc[0] = x.e = 0;
            }

            return x;
          }

          // Remove excess digits.
          if (i == 0) {
            xc.length = ni;
            k = 1;
            ni--;
          } else {
            xc.length = ni + 1;
            k = pows10[LOG_BASE - i];

            // E.g. 56700 becomes 56000 if 7 is the rounding digit.
            // j > 0 means i > number of leading zeros of n.
            xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
          }

          // Round up?
          if (r) {

            for (; ;) {

              // If the digit to be rounded up is in the first element of xc...
              if (ni == 0) {

                // i will be the length of xc[0] before k is added.
                for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                j = xc[0] += k;
                for (k = 1; j >= 10; j /= 10, k++);

                // if i != k the length has increased.
                if (i != k) {
                  x.e++;
                  if (xc[0] == BASE) xc[0] = 1;
                }

                break;
              } else {
                xc[ni] += k;
                if (xc[ni] != BASE) break;
                xc[ni--] = 0;
                k = 1;
              }
            }
          }

          // Remove trailing zeros.
          for (i = xc.length; xc[--i] === 0; xc.pop());
        }

        // Overflow? Infinity.
        if (x.e > MAX_EXP) {
          x.c = x.e = null;

        // Underflow? Zero.
        } else if (x.e < MIN_EXP) {
          x.c = [x.e = 0];
        }
      }

      return x;
    }


    function valueOf(n) {
      var str,
        e = n.e;

      if (e === null) return n.toString();

      str = coeffToString(n.c);

      str = e <= TO_EXP_NEG || e >= TO_EXP_POS
        ? toExponential(str, e)
        : toFixedPoint(str, e, '0');

      return n.s < 0 ? '-' + str : str;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
     * Return a new BigNumber whose value is the absolute value of this BigNumber.
     */
    P.absoluteValue = P.abs = function () {
      var x = new BigNumber(this);
      if (x.s < 0) x.s = 1;
      return x;
    };


    /*
     * Return
     *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
     *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
     *   0 if they have the same value,
     *   or null if the value of either is NaN.
     */
    P.comparedTo = function (y, b) {
      return compare(this, new BigNumber(y, b));
    };


    /*
     * If dp is undefined or null or true or false, return the number of decimal places of the
     * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     *
     * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.decimalPlaces = P.dp = function (dp, rm) {
      var c, n, v,
        x = this;

      if (dp != null) {
        intCheck(dp, 0, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), dp + x.e + 1, rm);
      }

      if (!(c = x.c)) return null;
      n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last number.
      if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
      if (n < 0) n = 0;

      return n;
    };


    /*
     *  n / 0 = I
     *  n / N = N
     *  n / I = 0
     *  0 / n = 0
     *  0 / 0 = N
     *  0 / N = N
     *  0 / I = 0
     *  N / n = N
     *  N / 0 = N
     *  N / N = N
     *  N / I = N
     *  I / n = I
     *  I / 0 = I
     *  I / N = N
     *  I / I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
     * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.dividedBy = P.div = function (y, b) {
      return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
    };


    /*
     * Return a new BigNumber whose value is the integer part of dividing the value of this
     * BigNumber by the value of BigNumber(y, b).
     */
    P.dividedToIntegerBy = P.idiv = function (y, b) {
      return div(this, new BigNumber(y, b), 0, 1);
    };


    /*
     * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
     *
     * If m is present, return the result modulo m.
     * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
     * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
     *
     * The modular power operation works efficiently when x, n, and m are integers, otherwise it
     * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
     *
     * n {number|string|BigNumber} The exponent. An integer.
     * [m] {number|string|BigNumber} The modulus.
     *
     * '[BigNumber Error] Exponent not an integer: {n}'
     */
    P.exponentiatedBy = P.pow = function (n, m) {
      var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
        x = this;

      n = new BigNumber(n);

      // Allow NaN and ±Infinity, but not other non-integers.
      if (n.c && !n.isInteger()) {
        throw Error
          (bignumberError + 'Exponent not an integer: ' + valueOf(n));
      }

      if (m != null) m = new BigNumber(m);

      // Exponent of MAX_SAFE_INTEGER is 15.
      nIsBig = n.e > 14;

      // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
      if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

        // The sign of the result of pow when x is negative depends on the evenness of n.
        // If +n overflows to ±Infinity, the evenness of n would be not be known.
        y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
        return m ? y.mod(m) : y;
      }

      nIsNeg = n.s < 0;

      if (m) {

        // x % m returns NaN if abs(m) is zero, or m is NaN.
        if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

        isModExp = !nIsNeg && x.isInteger() && m.isInteger();

        if (isModExp) x = x.mod(m);

      // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
      // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
      } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
        // [1, 240000000]
        ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
        // [80000000000000]  [99999750000000]
        : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

        // If x is negative and n is odd, k = -0, else k = 0.
        k = x.s < 0 && isOdd(n) ? -0 : 0;

        // If x >= 1, k = ±Infinity.
        if (x.e > -1) k = 1 / k;

        // If n is negative return ±0, else return ±Infinity.
        return new BigNumber(nIsNeg ? 1 / k : k);

      } else if (POW_PRECISION) {

        // Truncating each coefficient array to a length of k after each multiplication
        // equates to truncating significant digits to POW_PRECISION + [28, 41],
        // i.e. there will be a minimum of 28 guard digits retained.
        k = mathceil(POW_PRECISION / LOG_BASE + 2);
      }

      if (nIsBig) {
        half = new BigNumber(0.5);
        if (nIsNeg) n.s = 1;
        nIsOdd = isOdd(n);
      } else {
        i = Math.abs(+valueOf(n));
        nIsOdd = i % 2;
      }

      y = new BigNumber(ONE);

      // Performs 54 loop iterations for n of 9007199254740991.
      for (; ;) {

        if (nIsOdd) {
          y = y.times(x);
          if (!y.c) break;

          if (k) {
            if (y.c.length > k) y.c.length = k;
          } else if (isModExp) {
            y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
          }
        }

        if (i) {
          i = mathfloor(i / 2);
          if (i === 0) break;
          nIsOdd = i % 2;
        } else {
          n = n.times(half);
          round(n, n.e + 1, 1);

          if (n.e > 14) {
            nIsOdd = isOdd(n);
          } else {
            i = +valueOf(n);
            if (i === 0) break;
            nIsOdd = i % 2;
          }
        }

        x = x.times(x);

        if (k) {
          if (x.c && x.c.length > k) x.c.length = k;
        } else if (isModExp) {
          x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
        }
      }

      if (isModExp) return y;
      if (nIsNeg) y = ONE.div(y);

      return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
     * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
     */
    P.integerValue = function (rm) {
      var n = new BigNumber(this);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(n, n.e + 1, rm);
    };


    /*
     * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isEqualTo = P.eq = function (y, b) {
      return compare(this, new BigNumber(y, b)) === 0;
    };


    /*
     * Return true if the value of this BigNumber is a finite number, otherwise return false.
     */
    P.isFinite = function () {
      return !!this.c;
    };


    /*
     * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isGreaterThan = P.gt = function (y, b) {
      return compare(this, new BigNumber(y, b)) > 0;
    };


    /*
     * Return true if the value of this BigNumber is greater than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

    };


    /*
     * Return true if the value of this BigNumber is an integer, otherwise return false.
     */
    P.isInteger = function () {
      return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
    };


    /*
     * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isLessThan = P.lt = function (y, b) {
      return compare(this, new BigNumber(y, b)) < 0;
    };


    /*
     * Return true if the value of this BigNumber is less than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isLessThanOrEqualTo = P.lte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
    };


    /*
     * Return true if the value of this BigNumber is NaN, otherwise return false.
     */
    P.isNaN = function () {
      return !this.s;
    };


    /*
     * Return true if the value of this BigNumber is negative, otherwise return false.
     */
    P.isNegative = function () {
      return this.s < 0;
    };


    /*
     * Return true if the value of this BigNumber is positive, otherwise return false.
     */
    P.isPositive = function () {
      return this.s > 0;
    };


    /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
     */
    P.isZero = function () {
      return !!this.c && this.c[0] == 0;
    };


    /*
     *  n - 0 = n
     *  n - N = N
     *  n - I = -I
     *  0 - n = -n
     *  0 - 0 = 0
     *  0 - N = N
     *  0 - I = -I
     *  N - n = N
     *  N - 0 = N
     *  N - N = N
     *  N - I = N
     *  I - n = I
     *  I - 0 = I
     *  I - N = N
     *  I - I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber minus the value of
     * BigNumber(y, b).
     */
    P.minus = function (y, b) {
      var i, j, t, xLTy,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
      if (a != b) {
        y.s = -b;
        return x.plus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Either Infinity?
        if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

        // Either zero?
        if (!xc[0] || !yc[0]) {

          // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
          return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

           // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
           ROUNDING_MODE == 3 ? -0 : 0);
        }
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Determine which is the bigger number.
      if (a = xe - ye) {

        if (xLTy = a < 0) {
          a = -a;
          t = xc;
        } else {
          ye = xe;
          t = yc;
        }

        t.reverse();

        // Prepend zeros to equalise exponents.
        for (b = a; b--; t.push(0));
        t.reverse();
      } else {

        // Exponents equal. Check digit by digit.
        j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

        for (a = b = 0; b < j; b++) {

          if (xc[b] != yc[b]) {
            xLTy = xc[b] < yc[b];
            break;
          }
        }
      }

      // x < y? Point xc to the array of the bigger number.
      if (xLTy) {
        t = xc;
        xc = yc;
        yc = t;
        y.s = -y.s;
      }

      b = (j = yc.length) - (i = xc.length);

      // Append zeros to xc if shorter.
      // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
      if (b > 0) for (; b--; xc[i++] = 0);
      b = BASE - 1;

      // Subtract yc from xc.
      for (; j > a;) {

        if (xc[--j] < yc[j]) {
          for (i = j; i && !xc[--i]; xc[i] = b);
          --xc[i];
          xc[j] += BASE;
        }

        xc[j] -= yc[j];
      }

      // Remove leading zeros and adjust exponent accordingly.
      for (; xc[0] == 0; xc.splice(0, 1), --ye);

      // Zero?
      if (!xc[0]) {

        // Following IEEE 754 (2008) 6.3,
        // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
        y.s = ROUNDING_MODE == 3 ? -1 : 1;
        y.c = [y.e = 0];
        return y;
      }

      // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
      // for finite x and y.
      return normalise(y, xc, ye);
    };


    /*
     *   n % 0 =  N
     *   n % N =  N
     *   n % I =  n
     *   0 % n =  0
     *  -0 % n = -0
     *   0 % 0 =  N
     *   0 % N =  N
     *   0 % I =  0
     *   N % n =  N
     *   N % 0 =  N
     *   N % N =  N
     *   N % I =  N
     *   I % n =  N
     *   I % 0 =  N
     *   I % N =  N
     *   I % I =  N
     *
     * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
     * BigNumber(y, b). The result depends on the value of MODULO_MODE.
     */
    P.modulo = P.mod = function (y, b) {
      var q, s,
        x = this;

      y = new BigNumber(y, b);

      // Return NaN if x is Infinity or NaN, or y is NaN or zero.
      if (!x.c || !y.s || y.c && !y.c[0]) {
        return new BigNumber(NaN);

      // Return x if y is Infinity or x is zero.
      } else if (!y.c || x.c && !x.c[0]) {
        return new BigNumber(x);
      }

      if (MODULO_MODE == 9) {

        // Euclidian division: q = sign(y) * floor(x / abs(y))
        // r = x - qy    where  0 <= r < abs(y)
        s = y.s;
        y.s = 1;
        q = div(x, y, 0, 3);
        y.s = s;
        q.s *= s;
      } else {
        q = div(x, y, 0, MODULO_MODE);
      }

      y = x.minus(q.times(y));

      // To match JavaScript %, ensure sign of zero is sign of dividend.
      if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

      return y;
    };


    /*
     *  n * 0 = 0
     *  n * N = N
     *  n * I = I
     *  0 * n = 0
     *  0 * 0 = 0
     *  0 * N = N
     *  0 * I = N
     *  N * n = N
     *  N * 0 = N
     *  N * N = N
     *  N * I = N
     *  I * n = I
     *  I * 0 = N
     *  I * N = N
     *  I * I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
     * of BigNumber(y, b).
     */
    P.multipliedBy = P.times = function (y, b) {
      var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
        base, sqrtBase,
        x = this,
        xc = x.c,
        yc = (y = new BigNumber(y, b)).c;

      // Either NaN, ±Infinity or ±0?
      if (!xc || !yc || !xc[0] || !yc[0]) {

        // Return NaN if either is NaN, or one is 0 and the other is Infinity.
        if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
          y.c = y.e = y.s = null;
        } else {
          y.s *= x.s;

          // Return ±Infinity if either is ±Infinity.
          if (!xc || !yc) {
            y.c = y.e = null;

          // Return ±0 if either is ±0.
          } else {
            y.c = [0];
            y.e = 0;
          }
        }

        return y;
      }

      e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
      y.s *= x.s;
      xcL = xc.length;
      ycL = yc.length;

      // Ensure xc points to longer array and xcL to its length.
      if (xcL < ycL) {
        zc = xc;
        xc = yc;
        yc = zc;
        i = xcL;
        xcL = ycL;
        ycL = i;
      }

      // Initialise the result array with zeros.
      for (i = xcL + ycL, zc = []; i--; zc.push(0));

      base = BASE;
      sqrtBase = SQRT_BASE;

      for (i = ycL; --i >= 0;) {
        c = 0;
        ylo = yc[i] % sqrtBase;
        yhi = yc[i] / sqrtBase | 0;

        for (k = xcL, j = i + k; j > i;) {
          xlo = xc[--k] % sqrtBase;
          xhi = xc[k] / sqrtBase | 0;
          m = yhi * xlo + xhi * ylo;
          xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
          c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
          zc[j--] = xlo % base;
        }

        zc[j] = c;
      }

      if (c) {
        ++e;
      } else {
        zc.splice(0, 1);
      }

      return normalise(y, zc, e);
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber negated,
     * i.e. multiplied by -1.
     */
    P.negated = function () {
      var x = new BigNumber(this);
      x.s = -x.s || null;
      return x;
    };


    /*
     *  n + 0 = n
     *  n + N = N
     *  n + I = I
     *  0 + n = n
     *  0 + 0 = 0
     *  0 + N = N
     *  0 + I = I
     *  N + n = N
     *  N + 0 = N
     *  N + N = N
     *  N + I = N
     *  I + n = I
     *  I + 0 = I
     *  I + N = N
     *  I + I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber plus the value of
     * BigNumber(y, b).
     */
    P.plus = function (y, b) {
      var t,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
       if (a != b) {
        y.s = -b;
        return x.minus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Return ±Infinity if either ±Infinity.
        if (!xc || !yc) return new BigNumber(a / 0);

        // Either zero?
        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
      if (a = xe - ye) {
        if (a > 0) {
          ye = xe;
          t = yc;
        } else {
          a = -a;
          t = xc;
        }

        t.reverse();
        for (; a--; t.push(0));
        t.reverse();
      }

      a = xc.length;
      b = yc.length;

      // Point xc to the longer array, and b to the shorter length.
      if (a - b < 0) {
        t = yc;
        yc = xc;
        xc = t;
        b = a;
      }

      // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
      for (a = 0; b;) {
        a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
        xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
      }

      if (a) {
        xc = [a].concat(xc);
        ++ye;
      }

      // No need to check for zero, as +x + +y != 0 && -x + -y != 0
      // ye = MAX_EXP + 1 possible
      return normalise(y, xc, ye);
    };


    /*
     * If sd is undefined or null or true or false, return the number of significant digits of
     * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     * If sd is true include integer-part trailing zeros in the count.
     *
     * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
     *                     boolean: whether to count integer-part trailing zeros: true or false.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.precision = P.sd = function (sd, rm) {
      var c, n, v,
        x = this;

      if (sd != null && sd !== !!sd) {
        intCheck(sd, 1, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), sd, rm);
      }

      if (!(c = x.c)) return null;
      v = c.length - 1;
      n = v * LOG_BASE + 1;

      if (v = c[v]) {

        // Subtract the number of trailing zeros of the last element.
        for (; v % 10 == 0; v /= 10, n--);

        // Add the number of digits of the first element.
        for (v = c[0]; v >= 10; v /= 10, n++);
      }

      if (sd && x.e + 1 > n) n = x.e + 1;

      return n;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
     * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
     *
     * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
     */
    P.shiftedBy = function (k) {
      intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
      return this.times('1e' + k);
    };


    /*
     *  sqrt(-n) =  N
     *  sqrt(N) =  N
     *  sqrt(-I) =  N
     *  sqrt(I) =  I
     *  sqrt(0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new BigNumber whose value is the square root of the value of this BigNumber,
     * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.squareRoot = P.sqrt = function () {
      var m, n, r, rep, t,
        x = this,
        c = x.c,
        s = x.s,
        e = x.e,
        dp = DECIMAL_PLACES + 4,
        half = new BigNumber('0.5');

      // Negative/NaN/Infinity/zero?
      if (s !== 1 || !c || !c[0]) {
        return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
      }

      // Initial estimate.
      s = Math.sqrt(+valueOf(x));

      // Math.sqrt underflow/overflow?
      // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
      if (s == 0 || s == 1 / 0) {
        n = coeffToString(c);
        if ((n.length + e) % 2 == 0) n += '0';
        s = Math.sqrt(+n);
        e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

        if (s == 1 / 0) {
          n = '5e' + e;
        } else {
          n = s.toExponential();
          n = n.slice(0, n.indexOf('e') + 1) + e;
        }

        r = new BigNumber(n);
      } else {
        r = new BigNumber(s + '');
      }

      // Check for zero.
      // r could be zero if MIN_EXP is changed after the this value was created.
      // This would cause a division by zero (x/t) and hence Infinity below, which would cause
      // coeffToString to throw.
      if (r.c[0]) {
        e = r.e;
        s = e + dp;
        if (s < 3) s = 0;

        // Newton-Raphson iteration.
        for (; ;) {
          t = r;
          r = half.times(t.plus(div(x, t, dp, 1)));

          if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

            // The exponent of r may here be one less than the final result exponent,
            // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
            // are indexed correctly.
            if (r.e < e) --s;
            n = n.slice(s - 3, s + 1);

            // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
            // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
            // iteration.
            if (n == '9999' || !rep && n == '4999') {

              // On the first iteration only, check to see if rounding up gives the
              // exact result as the nines may infinitely repeat.
              if (!rep) {
                round(t, t.e + DECIMAL_PLACES + 2, 0);

                if (t.times(t).eq(x)) {
                  r = t;
                  break;
                }
              }

              dp += 4;
              s += 4;
              rep = 1;
            } else {

              // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
              // result. If not, then there are further digits and m will be truthy.
              if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                // Truncate to the first rounding digit.
                round(r, r.e + DECIMAL_PLACES + 2, 1);
                m = !r.times(r).eq(x);
              }

              break;
            }
          }
        }
      }

      return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
    };


    /*
     * Return a string representing the value of this BigNumber in exponential notation and
     * rounded using ROUNDING_MODE to dp fixed decimal places.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toExponential = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp++;
      }
      return format(this, dp, rm, 1);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounding
     * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toFixed = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp = dp + this.e + 1;
      }
      return format(this, dp, rm);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounded
     * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
     * of the format or FORMAT object (see BigNumber.set).
     *
     * The formatting object may contain some or all of the properties shown below.
     *
     * FORMAT = {
     *   prefix: '',
     *   groupSize: 3,
     *   secondaryGroupSize: 0,
     *   groupSeparator: ',',
     *   decimalSeparator: '.',
     *   fractionGroupSize: 0,
     *   fractionGroupSeparator: '\xA0',      // non-breaking space
     *   suffix: ''
     * };
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     * [format] {object} Formatting options. See FORMAT pbject above.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     * '[BigNumber Error] Argument not an object: {format}'
     */
    P.toFormat = function (dp, rm, format) {
      var str,
        x = this;

      if (format == null) {
        if (dp != null && rm && typeof rm == 'object') {
          format = rm;
          rm = null;
        } else if (dp && typeof dp == 'object') {
          format = dp;
          dp = rm = null;
        } else {
          format = FORMAT;
        }
      } else if (typeof format != 'object') {
        throw Error
          (bignumberError + 'Argument not an object: ' + format);
      }

      str = x.toFixed(dp, rm);

      if (x.c) {
        var i,
          arr = str.split('.'),
          g1 = +format.groupSize,
          g2 = +format.secondaryGroupSize,
          groupSeparator = format.groupSeparator || '',
          intPart = arr[0],
          fractionPart = arr[1],
          isNeg = x.s < 0,
          intDigits = isNeg ? intPart.slice(1) : intPart,
          len = intDigits.length;

        if (g2) {
          i = g1;
          g1 = g2;
          g2 = i;
          len -= i;
        }

        if (g1 > 0 && len > 0) {
          i = len % g1 || g1;
          intPart = intDigits.substr(0, i);
          for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
          if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
          if (isNeg) intPart = '-' + intPart;
        }

        str = fractionPart
         ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
          ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
           '$&' + (format.fractionGroupSeparator || ''))
          : fractionPart)
         : intPart;
      }

      return (format.prefix || '') + str + (format.suffix || '');
    };


    /*
     * Return an array of two BigNumbers representing the value of this BigNumber as a simple
     * fraction with an integer numerator and an integer denominator.
     * The denominator will be a positive non-zero value less than or equal to the specified
     * maximum denominator. If a maximum denominator is not specified, the denominator will be
     * the lowest value necessary to represent the number exactly.
     *
     * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
     *
     * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
     */
    P.toFraction = function (md) {
      var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
        x = this,
        xc = x.c;

      if (md != null) {
        n = new BigNumber(md);

        // Throw if md is less than one or is not an integer, unless it is Infinity.
        if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
          throw Error
            (bignumberError + 'Argument ' +
              (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
        }
      }

      if (!xc) return new BigNumber(x);

      d = new BigNumber(ONE);
      n1 = d0 = new BigNumber(ONE);
      d1 = n0 = new BigNumber(ONE);
      s = coeffToString(xc);

      // Determine initial denominator.
      // d is a power of 10 and the minimum max denominator that specifies the value exactly.
      e = d.e = s.length - x.e - 1;
      d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
      md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

      exp = MAX_EXP;
      MAX_EXP = 1 / 0;
      n = new BigNumber(s);

      // n0 = d1 = 0
      n0.c[0] = 0;

      for (; ;)  {
        q = div(n, d, 0, 1);
        d2 = d0.plus(q.times(d1));
        if (d2.comparedTo(md) == 1) break;
        d0 = d1;
        d1 = d2;
        n1 = n0.plus(q.times(d2 = n1));
        n0 = d2;
        d = n.minus(q.times(d2 = d));
        n = d2;
      }

      d2 = div(md.minus(d0), d1, 0, 1);
      n0 = n0.plus(d2.times(n1));
      d0 = d0.plus(d2.times(d1));
      n0.s = n1.s = x.s;
      e = e * 2;

      // Determine which fraction is closer to x, n0/d0 or n1/d1
      r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
          div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

      MAX_EXP = exp;

      return r;
    };


    /*
     * Return the value of this BigNumber converted to a number primitive.
     */
    P.toNumber = function () {
      return +valueOf(this);
    };


    /*
     * Return a string representing the value of this BigNumber rounded to sd significant digits
     * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
     * necessary to represent the integer part of the value in fixed-point notation, then use
     * exponential notation.
     *
     * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.toPrecision = function (sd, rm) {
      if (sd != null) intCheck(sd, 1, MAX);
      return format(this, sd, rm, 2);
    };


    /*
     * Return a string representing the value of this BigNumber in base b, or base 10 if b is
     * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
     * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
     * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
     * TO_EXP_NEG, return exponential notation.
     *
     * [b] {number} Integer, 2 to ALPHABET.length inclusive.
     *
     * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
     */
    P.toString = function (b) {
      var str,
        n = this,
        s = n.s,
        e = n.e;

      // Infinity or NaN?
      if (e === null) {
        if (s) {
          str = 'Infinity';
          if (s < 0) str = '-' + str;
        } else {
          str = 'NaN';
        }
      } else {
        if (b == null) {
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS
           ? toExponential(coeffToString(n.c), e)
           : toFixedPoint(coeffToString(n.c), e, '0');
        } else if (b === 10 && alphabetHasNormalDecimalDigits) {
          n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
          str = toFixedPoint(coeffToString(n.c), n.e, '0');
        } else {
          intCheck(b, 2, ALPHABET.length, 'Base');
          str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
        }

        if (s < 0 && n.c[0]) str = '-' + str;
      }

      return str;
    };


    /*
     * Return as toString, but do not accept a base argument, and include the minus sign for
     * negative zero.
     */
    P.valueOf = P.toJSON = function () {
      return valueOf(this);
    };


    P._isBigNumber = true;

    if (configObject != null) BigNumber.set(configObject);

    return BigNumber;
  }


  // PRIVATE HELPER FUNCTIONS

  // These functions don't need access to variables,
  // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


  function bitFloor(n) {
    var i = n | 0;
    return n > 0 || n === i ? i : i - 1;
  }


  // Return a coefficient array as a string of base 10 digits.
  function coeffToString(a) {
    var s, z,
      i = 1,
      j = a.length,
      r = a[0] + '';

    for (; i < j;) {
      s = a[i++] + '';
      z = LOG_BASE - s.length;
      for (; z--; s = '0' + s);
      r += s;
    }

    // Determine trailing zeros.
    for (j = r.length; r.charCodeAt(--j) === 48;);

    return r.slice(0, j + 1 || 1);
  }


  // Compare the value of BigNumbers x and y.
  function compare(x, y) {
    var a, b,
      xc = x.c,
      yc = y.c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either NaN?
    if (!i || !j) return null;

    a = xc && !xc[0];
    b = yc && !yc[0];

    // Either zero?
    if (a || b) return a ? b ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    a = i < 0;
    b = k == l;

    // Either Infinity?
    if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

    // Compare exponents.
    if (!b) return k > l ^ a ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

    // Compare lengths.
    return k == l ? 0 : k > l ^ a ? 1 : -1;
  }


  /*
   * Check that n is a primitive number, an integer, and in range, otherwise throw.
   */
  function intCheck(n, min, max, name) {
    if (n < min || n > max || n !== mathfloor(n)) {
      throw Error
       (bignumberError + (name || 'Argument') + (typeof n == 'number'
         ? n < min || n > max ? ' out of range: ' : ' not an integer: '
         : ' not a primitive number: ') + String(n));
    }
  }


  // Assumes finite n.
  function isOdd(n) {
    var k = n.c.length - 1;
    return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
  }


  function toExponential(str, e) {
    return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
     (e < 0 ? 'e' : 'e+') + e;
  }


  function toFixedPoint(str, e, z) {
    var len, zs;

    // Negative exponent?
    if (e < 0) {

      // Prepend zeros.
      for (zs = z + '.'; ++e; zs += z);
      str = zs + str;

    // Positive exponent
    } else {
      len = str.length;

      // Append zeros.
      if (++e > len) {
        for (zs = z, e -= len; --e; zs += z);
        str += zs;
      } else if (e < len) {
        str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    return str;
  }


  // EXPORT


  BigNumber = clone();
  BigNumber['default'] = BigNumber.BigNumber = BigNumber;

  // AMD.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () { return BigNumber; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

  // Node.js and other environments that support module.exports.
  } else {}
})(this);


/***/ }),

/***/ 2558:
/***/ (function(module) {

/* eslint-env browser */
module.exports = typeof self == 'object' ? self.FormData : window.FormData;


/***/ }),

/***/ 8030:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: function() { return /* binding */ createLucideIcon; }
});

// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(2265);
;// CONCATENATED MODULE: ./node_modules/lucide-react/dist/esm/shared/src/utils.js
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = function() {
    for(var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++){
        classes[_key] = arguments[_key];
    }
    return classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
};
 //# sourceMappingURL=utils.js.map

;// CONCATENATED MODULE: ./node_modules/lucide-react/dist/esm/defaultAttributes.js
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
 //# sourceMappingURL=defaultAttributes.js.map

;// CONCATENATED MODULE: ./node_modules/lucide-react/dist/esm/Icon.js
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 


const Icon = /*#__PURE__*/ (0,react.forwardRef)((param, ref)=>{
    let { color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest } = param;
    return /*#__PURE__*/ (0,react.createElement)("svg", {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
    }, [
        ...iconNode.map((param)=>{
            let [tag, attrs] = param;
            return /*#__PURE__*/ (0,react.createElement)(tag, attrs);
        }),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]);
});
 //# sourceMappingURL=Icon.js.map

;// CONCATENATED MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 


const createLucideIcon = (iconName, iconNode)=>{
    const Component = /*#__PURE__*/ (0,react.forwardRef)((param, ref)=>{
        let { className, ...props } = param;
        return /*#__PURE__*/ (0,react.createElement)(Icon, {
            ref,
            iconNode,
            className: mergeClasses("lucide-".concat(toKebabCase(iconName)), className),
            ...props
        });
    });
    Component.displayName = "".concat(iconName);
    return Component;
};
 //# sourceMappingURL=createLucideIcon.js.map


/***/ }),

/***/ 4104:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ Box; }
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8030);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 
const Box = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)("Box", [
    [
        "path",
        {
            d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
            key: "hh9hay"
        }
    ],
    [
        "path",
        {
            d: "m3.3 7 8.7 5 8.7-5",
            key: "g66t2b"
        }
    ],
    [
        "path",
        {
            d: "M12 22V12",
            key: "d0xqtd"
        }
    ]
]);
 //# sourceMappingURL=box.js.map


/***/ }),

/***/ 7668:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ Gem; }
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8030);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 
const Gem = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)("Gem", [
    [
        "path",
        {
            d: "M6 3h12l4 6-10 13L2 9Z",
            key: "1pcd5k"
        }
    ],
    [
        "path",
        {
            d: "M11 3 8 9l4 13 4-13-3-6",
            key: "1fcu3u"
        }
    ],
    [
        "path",
        {
            d: "M2 9h20",
            key: "16fsjt"
        }
    ]
]);
 //# sourceMappingURL=gem.js.map


/***/ }),

/***/ 4436:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ Globe; }
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8030);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 
const Globe = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)("Globe", [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }
    ],
    [
        "path",
        {
            d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
            key: "13o1zl"
        }
    ],
    [
        "path",
        {
            d: "M2 12h20",
            key: "9i4pu4"
        }
    ]
]);
 //# sourceMappingURL=globe.js.map


/***/ }),

/***/ 994:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: function() { return /* binding */ Send; }
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8030);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ 
const Send = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)("Send", [
    [
        "path",
        {
            d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
            key: "1ffxy3"
        }
    ],
    [
        "path",
        {
            d: "m21.854 2.147-10.94 10.939",
            key: "12cjpa"
        }
    ]
]);
 //# sourceMappingURL=send.js.map


/***/ }),

/***/ 3931:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ARWEAVE: function() { return /* reexport */ ARWEAVE; },
  BackendPlugin: function() { return /* reexport */ BackendPlugin; },
  BadgeData: function() { return /* reexport */ BadgeData; },
  BadgeDataWitness: function() { return /* reexport */ BadgeDataWitness; },
  BaseMinaNFT: function() { return /* reexport */ BaseMinaNFT; },
  BaseMinaNFTObject: function() { return /* reexport */ BaseMinaNFTObject; },
  BaseRedactedMinaNFTTreeState: function() { return /* reexport */ BaseRedactedMinaNFTTreeState; },
  Berkeley: function() { return /* reexport */ Berkeley; },
  BuyParams: function() { return /* reexport */ BuyParams; },
  Devnet: function() { return /* reexport */ Devnet; },
  Escrow: function() { return /* reexport */ Escrow; },
  EscrowApproval: function() { return /* reexport */ EscrowApproval; },
  EscrowDeposit: function() { return /* reexport */ EscrowDeposit; },
  EscrowTransfer: function() { return /* reexport */ EscrowTransfer; },
  EscrowTransferApproval: function() { return /* reexport */ EscrowTransferApproval; },
  EscrowTransferProof: function() { return /* reexport */ EscrowTransferProof; },
  EscrowTransferVerification: function() { return /* reexport */ EscrowTransferVerification; },
  FILE_TREE_ELEMENTS: function() { return /* reexport */ FILE_TREE_ELEMENTS; },
  FILE_TREE_HEIGHT: function() { return /* reexport */ FILE_TREE_HEIGHT; },
  FileData: function() { return /* reexport */ FileData; },
  IPFS: function() { return /* reexport */ IPFS; },
  KYCSignatureData: function() { return /* reexport */ KYCSignatureData; },
  Lightnet: function() { return /* reexport */ Lightnet; },
  Local: function() { return /* reexport */ Local; },
  MINANFT_NAME_SERVICE: function() { return /* binding */ src_MINANFT_NAME_SERVICE; },
  MINANFT_NAME_SERVICE_V2: function() { return /* binding */ MINANFT_NAME_SERVICE_V2; },
  Mainnet: function() { return /* reexport */ Mainnet; },
  MapData: function() { return /* reexport */ MapData; },
  MapElement: function() { return /* reexport */ MapElement; },
  Memory: function() { return /* reexport */ Memory; },
  MerkleTreeWitness20: function() { return /* reexport */ MerkleTreeWitness20; },
  Metadata: function() { return /* reexport */ Metadata; },
  MetadataMap: function() { return /* reexport */ MetadataMap; },
  MetadataParams: function() { return /* reexport */ MetadataParams; },
  MetadataTransition: function() { return /* reexport */ MetadataTransition; },
  MetadataUpdate: function() { return /* reexport */ MetadataUpdate; },
  MetadataWitness: function() { return /* reexport */ MetadataWitness; },
  MinaNFT: function() { return /* reexport */ MinaNFT; },
  MinaNFTBadge: function() { return /* reexport */ MinaNFTBadge; },
  MinaNFTBadgeCalculation: function() { return /* reexport */ MinaNFTBadgeCalculation; },
  MinaNFTBadgeProof: function() { return /* reexport */ MinaNFTBadgeProof; },
  MinaNFTContract: function() { return /* reexport */ MinaNFTContract; },
  MinaNFTEscrow: function() { return /* reexport */ MinaNFTEscrow; },
  MinaNFTMetadataUpdate: function() { return /* reexport */ MinaNFTMetadataUpdate; },
  MinaNFTMetadataUpdateProof: function() { return /* reexport */ MinaNFTMetadataUpdateProof; },
  MinaNFTNameService: function() { return /* reexport */ MinaNFTNameService; },
  MinaNFTNameServiceContract: function() { return /* reexport */ MinaNFTNameServiceContract; },
  MinaNFTNameServiceV2: function() { return /* reexport */ MinaNFTNameServiceV2; },
  MinaNFTTreeVerifier20: function() { return /* reexport */ MinaNFTTreeVerifier20; },
  MinaNFTTreeVerifierFunction: function() { return /* reexport */ MinaNFTTreeVerifierFunction; },
  MinaNFTVerifier: function() { return /* reexport */ MinaNFTVerifier; },
  MinaNFTVerifierBadge: function() { return /* reexport */ MinaNFTVerifierBadge; },
  MinaNFTVerifierBadgeEvent: function() { return /* reexport */ MinaNFTVerifierBadgeEvent; },
  MintData: function() { return /* reexport */ MintData; },
  MintEvent: function() { return /* reexport */ MintEvent; },
  MintParams: function() { return /* reexport */ MintParams; },
  MintSignatureData: function() { return /* reexport */ MintSignatureData; },
  NAMES_ORACLE: function() { return /* binding */ NAMES_ORACLE; },
  NFTContractV2: function() { return /* reexport */ NFTContractV2; },
  NFTMintData: function() { return /* reexport */ NFTMintData; },
  NFTparams: function() { return /* reexport */ NFTparams; },
  NameContractV2: function() { return /* reexport */ NameContractV2; },
  PrivateMetadata: function() { return /* reexport */ PrivateMetadata; },
  RedactedMinaNFT: function() { return /* reexport */ RedactedMinaNFT; },
  RedactedMinaNFTMapCalculation: function() { return /* reexport */ RedactedMinaNFTMapCalculation; },
  RedactedMinaNFTMapState: function() { return /* reexport */ RedactedMinaNFTMapState; },
  RedactedMinaNFTMapStateProof: function() { return /* reexport */ RedactedMinaNFTMapStateProof; },
  RedactedMinaNFTTreeCalculation20: function() { return /* reexport */ RedactedMinaNFTTreeCalculation20; },
  RedactedMinaNFTTreeState20: function() { return /* reexport */ RedactedMinaNFTTreeState20; },
  RedactedMinaNFTTreeStateProof20: function() { return /* reexport */ RedactedMinaNFTTreeStateProof20; },
  RedactedTree: function() { return /* reexport */ RedactedTree; },
  RollupNFT: function() { return /* reexport */ RollupNFT; },
  RollupUpdate: function() { return /* reexport */ RollupUpdate; },
  SELL_FEE: function() { return /* reexport */ SELL_FEE; },
  SellParams: function() { return /* reexport */ SellParams; },
  SignTestContract: function() { return /* reexport */ SignTestContract; },
  Storage: function() { return /* reexport */ Storage; },
  TRANSFER_FEE: function() { return /* reexport */ TRANSFER_FEE; },
  TestWorld2: function() { return /* reexport */ TestWorld2; },
  TextData: function() { return /* reexport */ TextData; },
  TransferParams: function() { return /* reexport */ TransferParams; },
  TreeElement: function() { return /* reexport */ TreeElement; },
  UPDATE_FEE: function() { return /* reexport */ UPDATE_FEE; },
  Update: function() { return /* reexport */ Update; },
  UpdateParams: function() { return /* reexport */ UpdateParams; },
  VERIFICATION_KEY_HASH: function() { return /* binding */ VERIFICATION_KEY_HASH; },
  VERIFICATION_KEY_V2_JSON: function() { return /* binding */ VERIFICATION_KEY_V2_JSON; },
  VERIFIER: function() { return /* binding */ VERIFIER; },
  Zeko: function() { return /* reexport */ Zeko; },
  accountBalance: function() { return /* reexport */ accountBalance; },
  accountBalanceMina: function() { return /* reexport */ accountBalanceMina; },
  api: function() { return /* reexport */ api; },
  bigintFromBase64: function() { return /* reexport */ bigintFromBase64; },
  bigintToBase64: function() { return /* reexport */ bigintToBase64; },
  calculateMerkleTreeRootFast: function() { return /* reexport */ calculateMerkleTreeRootFast; },
  calculateNetworkIdHash: function() { return /* reexport */ calculateNetworkIdHash; },
  checkMinaZkappTransaction: function() { return /* reexport */ checkMinaZkappTransaction; },
  currentNetwork: function() { return /* reexport */ currentNetwork; },
  deserializeFields: function() { return /* reexport */ deserializeFields; },
  fetchMinaAccount: function() { return /* reexport */ fetchMinaAccount; },
  fetchMinaActions: function() { return /* reexport */ fetchMinaActions; },
  fieldFromBase64: function() { return /* reexport */ fieldFromBase64; },
  fieldToBase64: function() { return /* reexport */ fieldToBase64; },
  formatTime: function() { return /* reexport */ formatTime; },
  getDeployer: function() { return /* reexport */ getDeployer; },
  getNetworkIdHash: function() { return /* reexport */ getNetworkIdHash; },
  initBlockchain: function() { return /* reexport */ initBlockchain; },
  makeString: function() { return /* reexport */ makeString; },
  networkIdHash: function() { return /* reexport */ networkIdHash; },
  networks: function() { return /* reexport */ networks; },
  serializeFields: function() { return /* reexport */ serializeFields; },
  sleep: function() { return /* reexport */ sleep; },
  wallet: function() { return /* reexport */ wallet; }
});

// NAMESPACE OBJECT: ./node_modules/axios/lib/platform/common/utils.js
var common_utils_namespaceObject = {};
__webpack_require__.r(common_utils_namespaceObject);
__webpack_require__.d(common_utils_namespaceObject, {
  hasBrowserEnv: function() { return hasBrowserEnv; },
  hasStandardBrowserEnv: function() { return hasStandardBrowserEnv; },
  hasStandardBrowserWebWorkerEnv: function() { return hasStandardBrowserWebWorkerEnv; },
  navigator: function() { return _navigator; },
  origin: function() { return origin; }
});

;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/config.js
const config = {
    MINAFEE: 100_000_000,
    MINANFT_API_AUTH: "AkRjS8yioA7i1CwvB3nOvcyLYh6sNMi4em7C0ybmYy67lhDC2KxEQtm1z45llEAR",
    MINANFT_API: "https://n1zjzclr99.execute-api.eu-west-1.amazonaws.com/dev/api",
    CONTRACT_DEPLOYER: "B62qiTrtDyWmDFMQvUDRUdWVsVwNFhUV4rkPVgeANi4adKhrUwfdNFT",
    NAMES_ORACLE: "B62qids6rU9iqjvBV4DHxW8z67mgHFws1rPmFoqpcyRq2arYxUw6sZu",
    MINANFT_NAME_SERVICE: "B62qrryunX2LzaZ1sGtqfJqzSdNdN7pVSZw8YtnxQNxrrF9Vt56bNFT",
    MINANFT_NAME_SERVICE_V2: 
    //"B62qnzkHunByjReoEwMKCJ9HQxZP2MSYcUe8Lfesy4SpufxWp3viNFT",
    "B62qs2NthDuxAT94tTFg6MtuaP1gaBxTZyNv9D3uQiQciy1VsaimNFT",
    MINANFT_NAME_SERVICE_OLD: "B62qpiD9ZWPi1JCx7hd4XcRujM1qc5jCADhhJVzTm3zZBWBpyRr3NFT",
    MINANFT_NFT_ADDRESS: "B62qjfEWNWx4WzD5WvMomzv37FiPhuph4pTMtKDvkSQbNt8HN1BDGtQ",
    BADGE_TWITTER: "B62qmYSotSkUHY8XwsinGpW3gqTpsyoZcQoLK5d3qTAJ9oy1dRVD11b",
    BADGE_DISCORD: "B62qnVYz1TiirtTuqj5oM3Nke8jvdMV8MKEKQvGDc4hUy86n2txx9MG",
    BADGE_TELEGRAM: "B62qk2JqK8ttXdyhGToSU82Bt3xEZZs5AszxF6Xoa8Gy4Bq41PVWZXH",
    BADGE_GITHUB: "B62qjVBj9nn5io9zeooweWzPqKGLzaXZptxWuFJcKLLkJUaDGXxn7E1",
    BADGE_LINKEDIN: "B62qqsvkxnzr6nyDGQQzKUktm6km3PTND9Lz9yaLcJLSBd9Fm3KZMUJ",
    VERIFIER: "B62qqzwDxiH172SXE4SUVYsNV2FteL2UeYFsjRqF4Qf42KnE1q1VNFT",
    ESCROW: "B62qoc7Juw7Q41y2QGwhadKck3qWB9brzCEegCBY8SPZWzUNtZXyQGd",
    BADGE_TWITTER_ORACLE: "B62qkvDzFG2VLkDDnkJvpG3Zp2QfRooiZDhnDcJEr4HTrnS8z5xc7qn",
    BADGE_DISCORD_ORACLE: "B62qnBQWrZPYBUq856nSMN5bPbUnEKVeXhbeb9o9dWKkHhCmDfFz8pG",
    BADGE_TELEGRAM_ORACLE: "B62qqSFncUiht898ukZr7vxVPCMfztk2jnMRxJzddJr6sdRJZApcotT",
    BADGE_GITHUB_ORACLE: "B62qmFn6DnRzNmhiHRYSCL5Aaabe7nQVSC78NdzfRuw1p77mjBNVwrb",
    BADGE_LINKEDIN_ORACLE: "B62qkHnwZGjiLnJwUrVJVrBp3bxqYe8cW4nrLuAB5p9QJwS16Q4Msn1",
    VERIFICATION_KEY_V2_JSON: {
        devnet: {
            hash: "6066211904755873509029517833979311169218619595163132349151228328092282280766",
            data: "AACbQW7Ui5kXAmLYXMIi1esmfeF0njjbkI32bMDTbeRdEg2iROS1dYZSBKrogFDr6nUV8VJp14ro1x9bvC2WJoQo0fsmpe6A3Y9GkpTjPxR6QOMvKNW7fqcfdlPZN7wNuThz2PxhNMksMmCULbfP04etnNvDgMqdBImitMj3iCKKEZbcbK4UX3zIorFecGFWLOyGE3KBNYRXGqAFsgfqIjMunGyp22JTUd9VvICJEluSj83WWNUIBKntC/PgHXgHnQ+zk03BQFYTjoMjSOimSWFuCyzAD6x09NYivvKTIn65Kclm4GGPfdDw2irfYkMOMjTu82rhsYjrChdrRy0qeCAocgnJ0p/7414EqJYWNu8aAdUHy5tYA1WZieFvYOPmKBEVrZcSfq5IjB6f+ztMmm1/RPlfYkRFqQF/EN72qDR6DKfyLry+Tjqt6yRQOtDkdVEXajs/hy5gyPo80E37XOsVKXBmUVZzu8efVbt8+g6/2GmNZOPAhn7kyGAO0EUvZQ0cyktXbXF2T3uXTjg/t6xPo+UUOMgYN6VvqEy0UmKOCOiiWbRajXBwOGlTan3bpXkzPjoqCaNExf/X92LL7iMdAGw3MtPVadrrvvbUNPyh56LGEaSHzK4KuQ4u52UdLfgjpKQsH0ez3gNsAfDbvkJ9pVTO98Z7TXyLprAx0WV11R4xlU2dq9f6S92haFnBmtPKC26Wsh6hjsIy7LMsWtV8Da2TQyINlDgxbehG8+3QakCALKTCtT1S5NY7w2FmDpkGMRgHQgUcxKsYJmWqyw+hDpqxp843bWongvPBPtSNUSFMf7+GKZxLD48EnFqDfox5xXzO5hn9sEwf9YbKuDpLPLx7Hz8GT9E9aONYAty/Q/QkPRFaABnN498+npdnGzMYZsMERxzGwDQiW40A3KGvSR7KS7gTfho4uqanBib2biMTUSEl+dpt6/G5sz6idWx6B2skStm73nrE8hlq+HuUJOen9iiggpsL2r/h7dyQKtkXDn84pokKOglh8nV70yoLkMAV0i9q8P1RVTk74T8K7+u5Iu4T3Ee5aH2C12g5FxLYOE4vODhRI3sK3d/ct15CZT7EkFDh+N7p29ewr1/VAJLAr4/Zs4kRR7SQ3F9gulaun+AwLxLLMERzZ8B1ij4ZDT2+8svVyIqQleBrn0g1JWJi1xp7uJxVYlAd09Gv2zjOvYya8BmdohC/um4yf7p9ioIIR40IY8y0mRszHp0IAgAyP7nhvUdlWydsV+GMJ7J8x29PQANCsYgQzmMtCGcSt/E9P+kZSf9MZdWXglTzdX39N0642VFvwF1m8i+oFy+L2YE+NYea4/KBG55M3qPeWYJLyzuhn2ZFsyXI+2adCDDlAOcPB+vpZwF/BtweoEl75EEsJm3F0CfCNHKwR+YdFOkv3iVptgYn4cnRbvF+mDyL49RzIt1TVryiQCYjdS3/5qMDJdQtV5ZnQm2ylyih6RiiA0Hc7bwCfrcsdEvRMWIsyMG3aRJZuSZ1Ma+sysunPMf2nuNmHk6sStcyGFcaQ/SXBc6t4LPyc5xVFlE5/T7v/+FKrpzphjZ/Bq28VA8s12Vf3ASXjSAeA9le3AYzmhL41pa2VKKRGtqrCUAqPzu2qbD5kqN9MLS+ULZ8cC3YUiHwCfUaaw/uZpELE2srFPLWZuBsMowGEkF0pfsrh/a0L4catQfyleB60/YDgS3G3JVGO9FSwfeM1/Bxzgxst9asnUyyTOsyZZ21mFY2Pax0ZnlOHF694xpmjYk27foF3nFQrIRFdMMr+cNke4kA9Mkd+Wx3C5awyZ3mTxFKdz81iIScWLRzJzkQ22W32CoUY1LTvLN7XC1PMUtelYR6+/cqsxtrttoUixJ23mtBKgAkX6vA4IH657wlwEaCptiicKbnwotSuxVetTYpmm0QMnm8+vfi336LScc5ep64raOaWZr3Z9BCzlRIAz//7sUCzbEpxiXfvuOZk96gj5VDPaF1B9tB7ouXdf70h7NPzRYk0zsOPjLGibt23+BP9q+oLMXwXmkcmlQ6TWIao1+LJxd6cIktO7bazEdwAAUblrz13iJ6TBYa84pColzaNLUk2H/ngD1Jd2vBz7P2B9HQQ/YwiI5mFp46UodD04LQ6S+4/tf07qtKGplmLzjmoScM+gApWY7ofltR3oEc8I4XFaqRIu/29G8nRacyeeKatJQDEvYLrru1AsuOTft6zBcTrx4KFhrq2o3JFkcVYxKIuGgkEgc99sD7K0cYcJ2VDg5C/Se4KWL0xKdvvL1jag0Ju/aCNSrkO7jLHV28yVgSHVvSyFY+idIf7P8lfmBTMWQLMYu0QM4SEvgzIJCACCI2LllY9dyJuNbPytjzk078UQFB9OnmixCK7CcGmU09VBE=",
            nameHash: "6917570092496487860169033479826113111386127324856820912221963430930481268223",
        },
        mainnet: {
            hash: "19598809197575993038539243112808085696121087889056375482257803925816746642628",
            data: "AACbQW7Ui5kXAmLYXMIi1esmfeF0njjbkI32bMDTbeRdEg2iROS1dYZSBKrogFDr6nUV8VJp14ro1x9bvC2WJoQo0fsmpe6A3Y9GkpTjPxR6QOMvKNW7fqcfdlPZN7wNuThz2PxhNMksMmCULbfP04etnNvDgMqdBImitMj3iCKKEZbcbK4UX3zIorFecGFWLOyGE3KBNYRXGqAFsgfqIjMunGyp22JTUd9VvICJEluSj83WWNUIBKntC/PgHXgHnQ+zk03BQFYTjoMjSOimSWFuCyzAD6x09NYivvKTIn65Kclm4GGPfdDw2irfYkMOMjTu82rhsYjrChdrRy0qeCAocgnJ0p/7414EqJYWNu8aAdUHy5tYA1WZieFvYOPmKBEVrZcSfq5IjB6f+ztMmm1/RPlfYkRFqQF/EN72qDR6DKfyLry+Tjqt6yRQOtDkdVEXajs/hy5gyPo80E37XOsVKXBmUVZzu8efVbt8+g6/2GmNZOPAhn7kyGAO0EUvZQ0cyktXbXF2T3uXTjg/t6xPo+UUOMgYN6VvqEy0UmKOCOiiWbRajXBwOGlTan3bpXkzPjoqCaNExf/X92LL7iMdAAKli3kpeZ+5aCPOxSQVjhJHSm18jS97GxdpB2oVmPkT3ygXWf9u2OxEbg8lw4BYlRM1Eo5f2AjLZNdl1w/NKjP0c54vXmjy1cY3kEtHNeiF7Cn03lxlUyx5iVVUBGGcEIzAaxKcnnwrY+68zRW1kNDosFz7iMiHAHhJV9499o46MRgHQgUcxKsYJmWqyw+hDpqxp843bWongvPBPtSNUSFMf7+GKZxLD48EnFqDfox5xXzO5hn9sEwf9YbKuDpLPLx7Hz8GT9E9aONYAty/Q/QkPRFaABnN498+npdnGzMYZsMERxzGwDQiW40A3KGvSR7KS7gTfho4uqanBib2biMTUSEl+dpt6/G5sz6idWx6B2skStm73nrE8hlq+HuUJOen9iiggpsL2r/h7dyQKtkXDn84pokKOglh8nV70yoLwWNbLXlkEMVLaUj1+1k0x1ix30yzIPHG0vgc2o82agKDuHiXOwjhLPNRntvGPkKvoEqHPKQpc7B7G1Pmvod4EBg8tLEfr0SwEdIYuycnXXy0X2ARnckZo9oYpjI/7K88nwEyX44iq0rDpLoNhKtzBc4jp2nZsZQuYYmVSk6GUD/OvYya8BmdohC/um4yf7p9ioIIR40IY8y0mRszHp0IAgAyP7nhvUdlWydsV+GMJ7J8x29PQANCsYgQzmMtCGcSt/E9P+kZSf9MZdWXglTzdX39N0642VFvwF1m8i+oFy+L2YE+NYea4/KBG55M3qPeWYJLyzuhn2ZFsyXI+2adCDDlAOcPB+vpZwF/BtweoEl75EEsJm3F0CfCNHKwR+YdFOkv3iVptgYn4cnRbvF+mDyL49RzIt1TVryiQCYjdS3/5qMDJdQtV5ZnQm2ylyih6RiiA0Hc7bwCfrcsdEvRMWIsyMG3aRJZuSZ1Ma+sysunPMf2nuNmHk6sStcyGFcaQ/SXBc6t4LPyc5xVFlE5/T7v/+FKrpzphjZ/Bq28VA8s12Vf3ASXjSAeA9le3AYzmhL41pa2VKKRGtqrCUAqPzu2qbD5kqN9MLS+ULZ8cC3YUiHwCfUaaw/uZpELE2srFPLWZuBsMowGEkF0pfsrh/a0L4catQfyleB60/YDgS3G3JVGO9FSwfeM1/Bxzgxst9asnUyyTOsyZZ21mFY2Pax0ZnlOHF694xpmjYk27foF3nFQrIRFdMMr+cNke4kA9Mkd+Wx3C5awyZ3mTxFKdz81iIScWLRzJzkQ22W32CoUY1LTvLN7XC1PMUtelYR6+/cqsxtrttoUixJ23mtBKgAkX6vA4IH657wlwEaCptiicKbnwotSuxVetTYpmm0QMnm8+vfi336LScc5ep64raOaWZr3Z9BCzlRIAz//7sUCzbEpxiXfvuOZk96gj5VDPaF1B9tB7ouXdf70h7NPzRYk0zsOPjLGibt23+BP9q+oLMXwXmkcmlQ6TWIao1+LJxd6cIktO7bazEdwAAUblrz13iJ6TBYa84pColzaNLUk2H/ngD1Jd2vBz7P2B9HQQ/YwiI5mFp46UodD04LQ6S+4/tf07qtKGplmLzjmoScM+gApWY7ofltR3oEc8I4XFaqRIu/29G8nRacyeeKatJQDEvYLrru1AsuOTft6zBcTrx4KFhrq2o3JFkcVYxKIuGgkEgc99sD7K0cYcJ2VDg5C/Se4KWL0xKdvvL1jag0Ju/aCNSrkO7jLHV28yVgSHVvSyFY+idIf7P8lfmBTMWQLMYu0QM4SEvgzIJCACCI2LllY9dyJuNbPytjzk078UQFB9OnmixCK7CcGmU09VBE=",
            nameHash: "24746186622553277662878141131507829208482831484370089159005999912111636956018",
        },
    },
};
/* harmony default export */ var src_config = (config);
//# sourceMappingURL=config.js.map
// EXTERNAL MODULE: ./node_modules/o1js/dist/web/index.js
var web = __webpack_require__(337);
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/bind.js


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/utils.js
/* provided dependency */ var process = __webpack_require__(357);




// utils is a library of generic helper functions non-specific to axios

const {toString: utils_toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = utils_toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const utils_hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz'

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
}

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0]
  }

  return str;
}

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************

/* harmony default export */ var utils = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty: utils_hasOwnProperty,
  hasOwnProp: utils_hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosError.js




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const AxiosError_prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(AxiosError_prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(AxiosError_prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ var core_AxiosError = (AxiosError);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/null.js
// eslint-disable-next-line strict
/* harmony default export */ var helpers_null = (null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toFormData.js
/* provided dependency */ var Buffer = __webpack_require__(6300)["Buffer"];




// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored


/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (helpers_null || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);

  if (!utils.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils.isBlob(value)) {
      throw new core_AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils.isArray(value) && isFlatArray(value)) ||
        ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ var helpers_toFormData = (toFormData);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && helpers_toFormData(params, this, options);
}

const AxiosURLSearchParams_prototype = AxiosURLSearchParams.prototype;

AxiosURLSearchParams_prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

AxiosURLSearchParams_prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ var helpers_AxiosURLSearchParams = (AxiosURLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/buildURL.js





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function buildURL_encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || buildURL_encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ?
      params.toString() :
      new helpers_AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/InterceptorManager.js




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ var core_InterceptorManager = (InterceptorManager);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/transitional.js


/* harmony default export */ var defaults_transitional = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js



/* harmony default export */ var classes_URLSearchParams = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : helpers_AxiosURLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/FormData.js


/* harmony default export */ var classes_FormData = (typeof FormData !== 'undefined' ? FormData : null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/classes/Blob.js


/* harmony default export */ var classes_Blob = (typeof Blob !== 'undefined' ? Blob : null);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/browser/index.js




/* harmony default export */ var browser = ({
  isBrowser: true,
  classes: {
    URLSearchParams: classes_URLSearchParams,
    FormData: classes_FormData,
    Blob: classes_Blob
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/common/utils.js
const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';



;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/index.js



/* harmony default export */ var platform = ({
  ...common_utils_namespaceObject,
  ...browser
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toURLEncodedForm.js






function toURLEncodedForm(data, options) {
  return helpers_toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/formDataToJSON.js




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};

    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ var helpers_formDataToJSON = (formDataToJSON);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/index.js










/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: defaults_transitional,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils.isObject(data);

    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(helpers_formDataToJSON(data)) : data;
    }

    if (utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data) ||
      utils.isReadableStream(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return helpers_toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (utils.isResponse(data) || utils.isReadableStream(data)) {
      return data;
    }

    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw core_AxiosError.from(e, core_AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

/* harmony default export */ var lib_defaults = (defaults);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseHeaders.js




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ var parseHeaders = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosHeaders.js





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils.isString(value)) return;

  if (utils.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils.isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils.freezeMethods(AxiosHeaders);

/* harmony default export */ var core_AxiosHeaders = (AxiosHeaders);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/transformData.js






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || lib_defaults;
  const context = response || config;
  const headers = core_AxiosHeaders.from(context.headers);
  let data = context.data;

  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/isCancel.js


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CanceledError.js





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  core_AxiosError.call(this, message == null ? 'canceled' : message, core_AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, core_AxiosError, {
  __CANCEL__: true
});

/* harmony default export */ var cancel_CanceledError = (CanceledError);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/settle.js




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new core_AxiosError(
      'Request failed with status code ' + response.status,
      [core_AxiosError.ERR_BAD_REQUEST, core_AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseProtocol.js


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/speedometer.js


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ var helpers_speedometer = (speedometer);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/throttle.js
/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  }

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs)
        }, threshold - passed);
      }
    }
  }

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

/* harmony default export */ var helpers_throttle = (throttle);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/progressEventReducer.js




const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = helpers_speedometer(50, 250);

  return helpers_throttle(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
}

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
}

const asyncDecorator = (fn) => (...args) => utils.asap(() => fn(...args));

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isURLSameOrigin.js





/* harmony default export */ var isURLSameOrigin = (platform.hasStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover its components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })());

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/cookies.js



/* harmony default export */ var cookies = (platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      utils.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      utils.isString(path) && cookie.push('path=' + path);

      utils.isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  });


;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAbsoluteURL.js


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/combineURLs.js


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/buildFullPath.js





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/mergeConfig.js





const headersToObject = (thing) => thing instanceof core_AxiosHeaders ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({caseless}, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/resolveConfig.js









/* harmony default export */ var resolveConfig = ((config) => {
  const newConfig = mergeConfig({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = core_AxiosHeaders.from(headers);

  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (utils.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
});


;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/xhr.js











const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ var xhr = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = core_AxiosHeaders.from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = core_AxiosHeaders.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new core_AxiosError('Request aborted', core_AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new core_AxiosError('Network Error', core_AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || defaults_transitional;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new core_AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? core_AxiosError.ETIMEDOUT : core_AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new cancel_CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new core_AxiosError('Unsupported protocol ' + protocol + ':', core_AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/composeSignals.js




const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof core_AxiosError ? err : new cancel_CanceledError(err instanceof Error ? err.message : err));
      }
    }

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new core_AxiosError(`timeout ${timeout} of ms exceeded`, core_AxiosError.ETIMEDOUT))
    }, timeout)

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    }

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => utils.asap(unsubscribe);

    return signal;
  }
}

/* harmony default export */ var helpers_composeSignals = (composeSignals);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/trackStream.js

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
}

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
}

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
}

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  }

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/fetch.js










const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
}

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => utils.isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = utils.isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new core_AxiosError(`Response type '${type}' is not supported`, core_AxiosError.ERR_NOT_SUPPORT, config);
      })
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(utils.isBlob(body)) {
    return body.size;
  }

  if(utils.isSpecCompliantForm(body)) {
    const _request = new Request(platform.origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(utils.isArrayBufferView(body) || utils.isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(utils.isURLSearchParams(body)) {
    body = body + '';
  }

  if(utils.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
}

const resolveBodyLength = async (headers, body) => {
  const length = utils.toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
}

/* harmony default export */ var adapters_fetch = (isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = resolveConfig(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = helpers_composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (utils.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader)
      }

      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );

        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!utils.isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = utils.toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];

      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[utils.findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: core_AxiosHeaders.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      })
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new core_AxiosError('Network Error', core_AxiosError.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw core_AxiosError.from(err, err && err.code, config, request);
  }
}));



;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/adapters.js






const knownAdapters = {
  http: helpers_null,
  xhr: xhr,
  fetch: adapters_fetch
}

utils.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils.isFunction(adapter) || adapter === null || adapter === false;

/* harmony default export */ var adapters = ({
  getAdapter: (adapters) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new core_AxiosError(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new core_AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/dispatchRequest.js









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new cancel_CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = core_AxiosHeaders.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || lib_defaults.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = core_AxiosHeaders.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = core_AxiosHeaders.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/env/data.js
const VERSION = "1.7.7";
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/validator.js





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new core_AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        core_AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new core_AxiosError('options must be an object', core_AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new core_AxiosError('option ' + opt + ' must be ' + result, core_AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new core_AxiosError('Unknown option ' + opt, core_AxiosError.ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ var validator = ({
  assertOptions,
  validators
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/Axios.js











const Axios_validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new core_InterceptorManager(),
      response: new core_InterceptorManager()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy;

        Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
        forcedJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
        clarifyTimeoutError: Axios_validators.transitional(Axios_validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        }
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: Axios_validators.function,
          serialize: Axios_validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = core_AxiosHeaders.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ var core_Axios = (Axios);

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CancelToken.js




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new cancel_CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ var cancel_CancelToken = (CancelToken);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/spread.js


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAxiosError.js




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/HttpStatusCode.js
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ var helpers_HttpStatusCode = (HttpStatusCode);

;// CONCATENATED MODULE: ./node_modules/axios/lib/axios.js




















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new core_Axios(defaultConfig);
  const instance = bind(core_Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, core_Axios.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(lib_defaults);

// Expose Axios class to allow class inheritance
axios.Axios = core_Axios;

// Expose Cancel & CancelToken
axios.CanceledError = cancel_CanceledError;
axios.CancelToken = cancel_CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = helpers_toFormData;

// Expose AxiosError class
axios.AxiosError = core_AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = core_AxiosHeaders;

axios.formToJSON = thing => helpers_formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = helpers_HttpStatusCode;

axios.default = axios;

// this module should only have a default export
/* harmony default export */ var lib_axios = (axios);

;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/networks.js

const Mainnet = {
    mina: [
        //"https://proxy.devnet.minaexplorer.com/graphql",
        "https://api.minascan.io/node/mainnet/v1/graphql",
    ],
    archive: [
        "https://api.minascan.io/archive/mainnet/v1/graphql",
        //"https://archive.devnet.minaexplorer.com",
    ],
    explorerAccountUrl: "https://minascan.io/mainnet/account/",
    explorerTransactionUrl: "https://minascan.io/mainnet/tx/",
    chainId: "mainnet",
    name: "Mainnet",
};
const Local = {
    mina: [],
    archive: [],
    chainId: "local",
};
const Berkeley = {
    mina: [
        "https://api.minascan.io/node/berkeley/v1/graphql",
        "https://proxy.berkeley.minaexplorer.com/graphql",
    ],
    archive: [
        "https://api.minascan.io/archive/berkeley/v1/graphql",
        "https://archive.berkeley.minaexplorer.com",
    ],
    explorerAccountUrl: "https://minascan.io/berkeley/account/",
    explorerTransactionUrl: "https://minascan.io/berkeley/tx/",
    chainId: "berkeley",
    name: "Berkeley",
};
const Devnet = {
    mina: [
        //"https://proxy.devnet.minaexplorer.com/graphql",
        "https://api.minascan.io/node/devnet/v1/graphql",
    ],
    archive: [
        "https://api.minascan.io/archive/devnet/v1/graphql",
        //"https://archive.devnet.minaexplorer.com",
    ],
    explorerAccountUrl: "https://minascan.io/devnet/account/",
    explorerTransactionUrl: "https://minascan.io/devnet/tx/",
    chainId: "devnet",
    name: "Devnet",
};
const Zeko = {
    mina: ["https://devnet.zeko.io/graphql"], //["http://sequencer-zeko-dev.dcspark.io/graphql"], //
    archive: [],
    chainId: "zeko",
    name: "Zeko",
    explorerAccountUrl: "https://zekoscan.io/devnet/account/",
    explorerTransactionUrl: "https://zekoscan.io/devnet/tx/",
};
const TestWorld2 = {
    mina: ["https://api.minascan.io/node/testworld/v1/graphql"],
    archive: ["https://archive.testworld.minaexplorer.com"],
    explorerAccountUrl: "https://minascan.io/testworld/account/",
    explorerTransactionUrl: "https://minascan.io/testworld/tx/",
    chainId: "testworld2",
    name: "TestWorld2",
};
const Lightnet = {
    mina: ["http://localhost:8080/graphql"],
    archive: ["http://localhost:8282"],
    accountManager: "http://localhost:8181",
    chainId: "lighnet",
    name: "Lightnet",
};
const networks = [
    Mainnet,
    Local,
    Berkeley,
    Devnet,
    Zeko,
    TestWorld2,
    Lightnet,
];
//# sourceMappingURL=networks.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/mina.js
/* provided dependency */ var mina_process = __webpack_require__(357);



let currentNetwork = undefined;
function getNetworkIdHash() {
    if (currentNetwork === undefined) {
        throw new Error("Network is not initialized");
    }
    return currentNetwork.networkIdHash;
}
function calculateNetworkIdHash(chain) {
    return web.CircuitString.fromString(chain).hash();
}
function getDeployer() {
    if (currentNetwork === undefined) {
        throw new Error("Network is not initialized");
    }
    return currentNetwork.keys[0].privateKey;
}
/*function getNetworkIdHash(params: {
  chainId?: blockchain;
  verbose?: boolean;
}): Field {
  const { chainId, verbose } = params;
  if (chainId !== undefined) {
    if (verbose) console.log(`Chain ID: ${chainId}`);
    return CircuitString.fromString(chainId).hash();
  }
  const networkId = Mina.getNetworkId();
  if (verbose) console.log(`Network ID: ${networkId}`);
  if (networkId === "testnet")
    throw new Error(
      "Network ID is not set, please call initBlockchain() first"
    );

  if (networkId === "mainnet")
    return CircuitString.fromString("mainnet").hash();
  else {
    if (
      networkId.custom === undefined ||
      typeof networkId.custom !== "string"
    ) {
      throw new Error(
        "Network ID is not set, please call initBlockchain() first"
      );
    }
    return CircuitString.fromString(networkId.custom).hash();
  }
}
*/
async function initBlockchain(instance, deployersNumber = 0) {
    /*
    if (instance === "mainnet") {
      throw new Error("Mainnet is not supported yet by zkApps");
    }
    */
    const networkIdHash = calculateNetworkIdHash(instance);
    if (instance === "local") {
        const local = await web.Mina.LocalBlockchain({
            proofsEnabled: true,
        });
        web.Mina.setActiveInstance(local);
        currentNetwork = {
            keys: local.testAccounts.map((key) => ({
                privateKey: key.key,
                publicKey: key,
            })),
            network: Local,
            networkIdHash,
        };
        return currentNetwork;
    }
    const network = networks.find((n) => n.chainId === instance);
    if (network === undefined) {
        throw new Error("Unknown network");
    }
    const networkInstance = web.Mina.Network({
        mina: network.mina,
        archive: network.archive,
        lightnetAccountManager: network.accountManager,
        networkId: instance === "mainnet" ? "mainnet" : "testnet",
    });
    web.Mina.setActiveInstance(networkInstance);
    const keys = [];
    if (deployersNumber > 0) {
        if (instance === "lighnet") {
            throw new Error("Use await Lightnet.acquireKeyPair() to get keys for Lightnet");
        }
        else {
            const deployers = mina_process.env.DEPLOYERS;
            if (deployers === undefined ||
                Array.isArray(deployers) === false ||
                deployers.length < deployersNumber)
                throw new Error("Deployers are not set");
            for (let i = 0; i < deployersNumber; i++) {
                const privateKey = web.PrivateKey.fromBase58(deployers[i]);
                const publicKey = privateKey.toPublicKey();
                keys.push({ publicKey, privateKey });
            }
        }
    }
    currentNetwork = {
        keys,
        network,
        networkIdHash,
    };
    return currentNetwork;
}
async function accountBalance(address) {
    try {
        await (0,web.fetchAccount)({ publicKey: address });
        if (web.Mina.hasAccount(address))
            return web.Mina.getBalance(address);
        else
            return web.UInt64.from(0);
    }
    catch (error) {
        //console.error(error);
        return web.UInt64.from(0);
    }
}
async function accountBalanceMina(address) {
    return Number((await accountBalance(address)).toBigInt()) / 1e9;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function makeString(length) {
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let outString = ``;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const inOptions = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
    for (let i = 0; i < length; i++) {
        outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
    }
    return outString;
}
function formatTime(ms) {
    if (ms === undefined)
        return "";
    if (ms < 1000)
        return ms.toString() + " ms";
    if (ms < 60 * 1000)
        return parseInt((ms / 1000).toString()).toString() + " sec";
    if (ms < 60 * 60 * 1000) {
        const minutes = parseInt((ms / 1000 / 60).toString());
        const seconds = parseInt(((ms - minutes * 60 * 1000) / 1000).toString());
        return minutes.toString() + " min " + seconds.toString() + " sec";
    }
    else {
        const hours = parseInt((ms / 1000 / 60 / 60).toString());
        const minutes = parseInt(((ms - hours * 60 * 60 * 1000) / 1000 / 60).toString());
        return hours.toString() + " h " + minutes.toString() + " min";
    }
}
class Memory {
    constructor() {
        Memory.rss = 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    static info(description = ``, fullInfo = false) {
        const memoryData = mina_process.memoryUsage();
        const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024)} MB`;
        const oldRSS = Memory.rss;
        Memory.rss = Math.round(memoryData.rss / 1024 / 1024);
        const memoryUsage = fullInfo
            ? {
                step: `${description}:`,
                rssDelta: `${(oldRSS === 0
                    ? 0
                    : Memory.rss - oldRSS).toString()} MB -> Resident Set Size memory change`,
                rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated`,
                heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
                heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
                external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
            }
            : `RSS memory ${description}: ${formatMemoryUsage(memoryData.rss)}${oldRSS === 0
                ? ``
                : `, changed by ` + (Memory.rss - oldRSS).toString() + ` MB`}`;
        console.log(memoryUsage);
    }
}
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
Memory.rss = 0;
//# sourceMappingURL=mina.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/fetch.js


async function fetchMinaAccount(params) {
    const { publicKey, tokenId, force } = params;
    const timeout = 1000 * 60 * 10; // 10 minutes
    const startTime = Date.now();
    let result = { account: undefined };
    while (Date.now() - startTime < timeout) {
        try {
            const result = await (0,web.fetchAccount)({
                publicKey,
                tokenId,
            });
            return result;
            /*
            if (result.account !== undefined) return result;
            if (force !== true) return result;
            console.log(
              "Cannot fetch account",
              typeof publicKey === "string" ? publicKey : publicKey.toBase58(),
              result
            );
            */
        }
        catch (error) {
            if (force === true)
                console.log("Error in fetchAccount:", error);
            else {
                console.log("fetchMinaAccount error", typeof publicKey === "string" ? publicKey : publicKey.toBase58(), tokenId?.toString(), force, error);
                return result;
            }
        }
        await sleep(1000 * 10);
    }
    console.log("fetchMinaAccount timeout", typeof publicKey === "string" ? publicKey : publicKey.toBase58(), tokenId?.toString(), force);
    return result;
}
async function fetchMinaActions(publicKey, fromActionState, endActionState) {
    const timeout = 1000 * 60 * 600; // 10 hours
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        try {
            let actions = await web.Mina.fetchActions(publicKey, {
                fromActionState,
                endActionState,
            });
            if (Array.isArray(actions))
                return actions;
            else
                console.log("Cannot fetch actions - wrong format");
        }
        catch (error) {
            console.log("Error in fetchMinaActions", error.toString().substring(0, 300));
        }
        await sleep(1000 * 60 * 2);
    }
    console.log("Timeout in fetchMinaActions");
    return undefined;
}
async function checkMinaZkappTransaction(hash) {
    try {
        const result = await (0,web.checkZkappTransaction)(hash);
        return result;
    }
    catch (error) {
        console.error("Error in checkZkappTransaction:", error);
        return { success: false };
    }
}
//# sourceMappingURL=fetch.js.map
;// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.mjs
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownKeys = function(o) {
  ownKeys = Object.getOwnPropertyNames || function (o) {
    var ar = [];
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownKeys(o);
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
      });
  }
  return path;
}

/* harmony default export */ var tslib_es6 = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esDecorate,
  __runInitializers,
  __propKey,
  __setFunctionName,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension,
});

;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/contract/metadata.js


/**
 * Metadata is the metadata of the NFT written to the Merkle Map
 * @property data The root of the Merkle Map of the data or data itself if it is a leaf
 * @property kind The root of the Merkle Map of the kind or kind itself if it is a leaf.
 * Kind can be one of the "string" or "text" or "map" or "image" or any string like "mykind"
 */
class Metadata extends (0,web.Struct)({
    data: web.Field,
    kind: web.Field,
}) {
    /**
     * Asserts that two Metadata objects are equal
     * @param state1 first Metadata object
     * @param state2 second Metadata object
     */
    static assertEquals(state1, state2) {
        state1.data.assertEquals(state2.data);
        state1.kind.assertEquals(state2.kind);
    }
}
/**
 * MetadataWitness is the witness of the metadata in the Merkle Map
 * @property data The witness of the data
 * @property kind The witness of the kind
 */
class MetadataWitness extends (0,web.Struct)({
    data: web.MerkleMapWitness,
    kind: web.MerkleMapWitness,
}) {
    /**
     * Asserts that two MetadataWitness objects are equal
     * @param state1 first MetadataWitness object
     * @param state2 second MetadataWitness object
     */
    static assertEquals(state1, state2) {
        state1.data.assertEquals(state2.data);
        state1.kind.assertEquals(state2.kind);
    }
}
/**
 * Storage is the hash of the IPFS or Arweave storage where the NFT metadata is written
 * format of the IPFS hash string: i:...
 * format of the Arweave hash string: a:...
 * @property hashString The hash string of the storage
 */
class Storage extends (0,web.Struct)({
    hashString: web.Provable.Array(web.Field, 2),
}) {
    constructor(value) {
        super(value);
    }
    static empty() {
        return new Storage({ hashString: [(0,web.Field)(0), (0,web.Field)(0)] });
    }
    isEmpty() {
        return this.hashString[0]
            .equals((0,web.Field)(0))
            .and(this.hashString[1].equals((0,web.Field)(0)));
    }
    static assertEquals(a, b) {
        a.hashString[0].assertEquals(b.hashString[0]);
        a.hashString[1].assertEquals(b.hashString[1]);
    }
    static fromIpfsHash(hash) {
        const fields = web.Encoding.stringToFields("i:" + hash);
        if (fields.length !== 2)
            throw new Error("Invalid IPFS hash");
        return new Storage({ hashString: [fields[0], fields[1]] });
    }
    toIpfsHash() {
        const hash = web.Encoding.stringFromFields(this.hashString);
        if (hash.startsWith("i:")) {
            return hash.substring(2);
        }
        else
            throw new Error("Invalid IPFS hash");
    }
    toString() {
        if (this.isEmpty().toBoolean())
            return "";
        else
            return web.Encoding.stringFromFields(this.hashString);
    }
    static fromString(storage) {
        if (storage.startsWith("i:") === false &&
            storage.startsWith("a:") === false)
            throw new Error("Invalid storage string");
        const fields = web.Encoding.stringToFields(storage);
        if (fields.length !== 2)
            throw new Error("Invalid storage string");
        return new Storage({ hashString: [fields[0], fields[1]] });
    }
}
/**
 * Update is the data for the update of the metadata to be written to the NFT state
 * @property oldRoot The old root of the Merkle Map of the metadata
 * @property newRoot The new root of the Merkle Map of the metadata
 * @property storage The storage of the NFT - IPFS (i:...) or Arweave (a:...) hash string
 * @property name The name of the NFT
 * @property owner The owner of the NFT - Poseidon hash of owner's public key
 * @property version The new version of the NFT, increases by one with the changing of the metadata or owner
 * @property verifier The verifier of the NFT - the contract that sends this update
 */
class Update extends (0,web.Struct)({
    oldRoot: Metadata,
    newRoot: Metadata,
    storage: Storage,
    name: web.Field,
    owner: web.Field,
    version: web.UInt64,
    verifier: web.PublicKey,
}) {
    constructor(value) {
        super(value);
    }
}
//# sourceMappingURL=metadata.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/contract/update.js



/**
 * MetadataMap is a wrapper around MerkleMap that stores Metadata
 * @property data The MerkleMap of the data
 * @property kind The MerkleMap of the kind
 */
class MetadataMap {
    constructor() {
        this.data = new web.MerkleMap();
        this.kind = new web.MerkleMap();
    }
    /**
     * Calculates the root of the MerkleMap
     * @returns {@link Metadata} root of the MerkleMap
     */
    getRoot() {
        return new Metadata({
            data: this.data.getRoot(),
            kind: this.kind.getRoot(),
        });
    }
    /**
     * Get value at key
     * @param key key of the data and kind requested
     * @returns {@link Metadata} value of the data and kind at key
     */
    get(key) {
        return new Metadata({
            data: this.data.get(key),
            kind: this.kind.get(key),
        });
    }
    /**
     * Sets the data and kind at key
     * @param key key of the data and kind to set
     * @param value {@link Metadata} data and kind to set
     */
    set(key, value) {
        this.data.set(key, value.data);
        this.kind.set(key, value.kind);
    }
    /**
     * Calculates the witness of the data and kind at key
     * @param key key of the data and kind, for which witness is requested
     * @returns {@link MetadataWitness} witness of the data and kind at key
     */
    getWitness(key) {
        return new MetadataWitness({
            data: this.data.getWitness(key),
            kind: this.kind.getWitness(key),
        });
    }
}
class MetadataUpdate extends (0,web.Struct)({
    oldRoot: Metadata,
    newRoot: Metadata,
    key: web.Field,
    oldValue: Metadata,
    newValue: Metadata,
    witness: MetadataWitness,
}) {
}
class MetadataTransition extends (0,web.Struct)({
    oldRoot: Metadata,
    newRoot: Metadata,
}) {
    static create(update) {
        const [dataWitnessRootBefore, dataWitnessKey] = update.witness.data.computeRootAndKeyV2(update.oldValue.data);
        update.oldRoot.data.assertEquals(dataWitnessRootBefore);
        dataWitnessKey.assertEquals(update.key);
        const [kindWitnessRootBefore, kindWitnessKey] = update.witness.kind.computeRootAndKeyV2(update.oldValue.kind);
        update.oldRoot.kind.assertEquals(kindWitnessRootBefore);
        kindWitnessKey.assertEquals(update.key);
        const [dataWitnessRootAfter, _] = update.witness.data.computeRootAndKeyV2(update.newValue.data);
        update.newRoot.data.assertEquals(dataWitnessRootAfter);
        const [kindWitnessRootAfter, __] = update.witness.kind.computeRootAndKeyV2(update.newValue.kind);
        update.newRoot.kind.assertEquals(kindWitnessRootAfter);
        return new MetadataTransition({
            oldRoot: update.oldRoot,
            newRoot: update.newRoot,
        });
    }
    static merge(transition1, transition2) {
        return new MetadataTransition({
            oldRoot: transition1.oldRoot,
            newRoot: transition2.newRoot,
        });
    }
    static assertEquals(transition1, transition2) {
        Metadata.assertEquals(transition1.oldRoot, transition2.oldRoot);
        Metadata.assertEquals(transition1.newRoot, transition2.newRoot);
    }
}
const MinaNFTMetadataUpdate = (0,web.ZkProgram)({
    name: "MinaNFTMetadataUpdate",
    publicInput: MetadataTransition,
    methods: {
        update: {
            privateInputs: [MetadataUpdate],
            async method(state, update) {
                const computedState = MetadataTransition.create(update);
                MetadataTransition.assertEquals(computedState, state);
            },
        },
        merge: {
            privateInputs: [web.SelfProof, web.SelfProof],
            async method(newState, proof1, proof2) {
                proof1.verify();
                proof2.verify();
                Metadata.assertEquals(proof1.publicInput.newRoot, proof2.publicInput.oldRoot);
                Metadata.assertEquals(proof1.publicInput.oldRoot, newState.oldRoot);
                Metadata.assertEquals(proof2.publicInput.newRoot, newState.newRoot);
            },
        },
    },
});
class MinaNFTMetadataUpdateProof extends web.ZkProgram.Proof(MinaNFTMetadataUpdate) {
}
//# sourceMappingURL=update.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/contract/escrow.js


/**
 * EscrowTransfer is the data for transfer of the NFT from one owner to another
 * @property oldOwner The old owner of the NFT
 * @property newOwner The new owner of the NFT
 * @property name The name of the NFT
 * @property escrow The escrow of the NFT - Poseidon hash of the escrow public key
 * @property version The new version of the NFT, increases by one with the changing of the metadata or owner
 * @property price The price of the NFT
 * @property tokenId The tokenId of the NFT, Field(0) for MINA payments
 */
class EscrowTransfer extends (0,web.Struct)({
    oldOwner: web.Field,
    newOwner: web.Field,
    name: web.Field,
    escrow: web.Field,
    version: web.UInt64,
    price: web.UInt64,
    tokenId: web.Field, // Field(0) for MINA payments
}) {
    constructor(value) {
        super(value);
    }
}
/**
 * EscrowApproval is the data for approval of the escrow change
 * @property name The name of the NFT
 * @property escrow The escrow of the NFT - Poseidon hash of the escrow public key
 * @property owner The owner of the NFT - Poseidon hash of the owner public key
 * @property version The new version of the NFT, increases by one with the changing of the metadata or owner
 */
class EscrowApproval extends (0,web.Struct)({
    name: web.Field,
    escrow: web.Field,
    owner: web.Field,
    version: web.UInt64,
}) {
    constructor(value) {
        super(value);
    }
}
//# sourceMappingURL=escrow.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/contract/transfer.js


class EscrowTransferApproval extends (0,web.Struct)({
    approval: EscrowApproval,
    owner: web.Field,
}) {
}
const EscrowTransferVerification = (0,web.ZkProgram)({
    name: "EscrowTransferVerification",
    publicInput: EscrowTransferApproval,
    methods: {
        check: {
            privateInputs: [web.Signature, web.PublicKey],
            async method(data, signature, publicKey) {
                signature
                    .verify(publicKey, EscrowApproval.toFields(data.approval))
                    .assertEquals((0,web.Bool)(true));
                data.owner.assertEquals(web.Poseidon.hash(publicKey.toFields()));
            },
        },
    },
});
class EscrowTransferProof extends web.ZkProgram.Proof(EscrowTransferVerification) {
}
//# sourceMappingURL=transfer.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/contract/nft.js







/**
 * MinaNFTContract is a smart contract that implements the Mina NFT standard.
 * @property name The name of the NFT.
 * @property metadata The metadata of the NFT.
 * @property storage The storage of the NFT - IPFS (i:...) or Arweave (a:...) hash string
 * @property owner The owner of the NFT - Poseidon hash of owner's public key
 * @property escrow The escrow of the NFT - Poseidon hash of three escrow's public keys
 * @property version The version of the NFT, increases by one with the changing of the metadata or the owner
 */
class MinaNFTContract extends web.SmartContract {
    constructor() {
        super(...arguments);
        this.name = (0,web.State)();
        this.metadata = (0,web.State)();
        this.storage = (0,web.State)();
        this.owner = (0,web.State)();
        this.escrow = (0,web.State)();
        this.version = (0,web.State)();
    }
    /**
     * Update metadata of the NFT
     * @param update {@link Update} - data for the update
     * @param signature signature of the owner
     * @param owner owner's public key
     * @param proof {@link MinaNFTMetadataUpdateProof} - proof of the update of the metadata to be correctly inserted into the Merkle Map
     */
    async update(update, signature, owner, proof) {
        // Check that the metadata is correct
        const metadata = this.metadata.getAndRequireEquals();
        Metadata.assertEquals(metadata, update.oldRoot);
        Metadata.assertEquals(metadata, proof.publicInput.oldRoot);
        Metadata.assertEquals(proof.publicInput.newRoot, update.newRoot);
        // Check that the proof verifies
        proof.verify();
        signature.verify(owner, Update.toFields(update)).assertEquals((0,web.Bool)(true));
        //signature.verify(owner, [Field(30)]).assertEquals(Bool(true));
        update.owner.assertEquals(web.Poseidon.hash(owner.toFields()));
        this.owner
            .getAndRequireEquals()
            .assertEquals(update.owner, "Owner mismatch");
        this.name.getAndRequireEquals().assertEquals(update.name, "Name mismatch");
        const version = this.version.getAndRequireEquals();
        const newVersion = version.add(web.UInt64.from(1));
        newVersion.assertEquals(update.version);
        this.metadata.set(update.newRoot);
        this.version.set(update.version);
        this.storage.set(update.storage);
    }
    /**
     * Transfer the NFT to new owner
     * @param data {@link EscrowTransfer} - data for the transfer
     * @param signature1 signature of the first escrow
     * @param signature2 signature of the second escrow
     * @param signature3 signature of the third escrow
     * @param escrow1 public key of the first escrow
     * @param escrow2 public key of the second escrow
     * @param escrow3 public key of the third escrow
     */
    async escrowTransfer(data, signature1, signature2, signature3, escrow1, escrow2, escrow3) {
        this.owner
            .getAndRequireEquals()
            .assertEquals(data.oldOwner, "Owner mismatch");
        const escrow = this.escrow.getAndRequireEquals();
        escrow.assertNotEquals((0,web.Field)(0), "Escrow is not set");
        escrow.assertEquals(data.escrow);
        this.name.getAndRequireEquals().assertEquals(data.name, "Name mismatch");
        const version = this.version.getAndRequireEquals();
        const newVersion = version.add(web.UInt64.from(1));
        newVersion.assertEquals(data.version);
        const dataFields = EscrowTransfer.toFields(data);
        signature1.verify(escrow1, dataFields).assertEquals(true);
        signature2.verify(escrow2, dataFields).assertEquals(true);
        signature3.verify(escrow3, dataFields).assertEquals(true);
        data.escrow.assertEquals(web.Poseidon.hash([
            web.Poseidon.hash(escrow1.toFields()),
            web.Poseidon.hash(escrow2.toFields()),
            web.Poseidon.hash(escrow3.toFields()),
        ]));
        this.owner.set(data.newOwner);
        this.version.set(newVersion);
        this.escrow.set((0,web.Field)(0));
    }
    /**
     * Approve setting of the new escrow
     * @param proof {@link EscrowTransferProof} - escrow proof
     */
    async approveEscrow(proof) {
        proof.verify();
        this.owner
            .getAndRequireEquals()
            .assertEquals(proof.publicInput.owner, "Owner mismatch");
        this.name
            .getAndRequireEquals()
            .assertEquals(proof.publicInput.approval.name, "Name mismatch");
        const version = this.version.getAndRequireEquals();
        const newVersion = version.add(web.UInt64.from(1));
        newVersion.assertEquals(proof.publicInput.approval.version);
        this.version.set(proof.publicInput.approval.version);
        this.escrow.set(proof.publicInput.approval.escrow);
    }
}
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], MinaNFTContract.prototype, "name", void 0);
__decorate([
    (0,web.state)(Metadata),
    __metadata("design:type", Object)
], MinaNFTContract.prototype, "metadata", void 0);
__decorate([
    (0,web.state)(Storage),
    __metadata("design:type", Object)
], MinaNFTContract.prototype, "storage", void 0);
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], MinaNFTContract.prototype, "owner", void 0);
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], MinaNFTContract.prototype, "escrow", void 0);
__decorate([
    (0,web.state)(web.UInt64),
    __metadata("design:type", Object)
], MinaNFTContract.prototype, "version", void 0);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Update,
        web.Signature,
        web.PublicKey,
        MinaNFTMetadataUpdateProof]),
    __metadata("design:returntype", Promise)
], MinaNFTContract.prototype, "update", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EscrowTransfer,
        web.Signature,
        web.Signature,
        web.Signature,
        web.PublicKey,
        web.PublicKey,
        web.PublicKey]),
    __metadata("design:returntype", Promise)
], MinaNFTContract.prototype, "escrowTransfer", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EscrowTransferProof]),
    __metadata("design:returntype", Promise)
], MinaNFTContract.prototype, "approveEscrow", null);
//# sourceMappingURL=nft.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/contract/names.js








/**
 * NFTMintData is the data for the minting of the NFT
 * @property address The address of the NFT
 * @property name The name of the NFT encoded in Field
 * @property initialState The initial state of the NFT (8 Fields)
 * @property verifier The verifier of the NFT - the Name Service contract that sends this update
 */
class NFTMintData extends (0,web.Struct)({
    address: web.PublicKey,
    name: web.Field,
    initialState: [web.Field, web.Field, web.Field, web.Field, web.Field, web.Field, web.Field, web.Field],
    verifier: web.PublicKey,
}) {
    constructor(value) {
        super(value);
    }
}
/**
 * MintData is the data for the minting of the NFT
 * @property nft The {@link NFTMintData} of the NFT
 * @property verificationKey The verification key of the MinaNFTContract
 * @property signature The signature of the name service allowing the use of name
 */
class MintData extends (0,web.Struct)({
    nft: NFTMintData,
    verificationKey: web.VerificationKey,
    signature: web.Signature,
}) {
    constructor(value) {
        super(value);
    }
}
/**
 * MinaNFTNameServiceContract is a smart contract that implements the Mina NFT Name Service standard.
 * @property oracle The oracle of the contract - the public key used to sign name allowances
 */
class MinaNFTNameServiceContract extends web.TokenContract {
    constructor() {
        super(...arguments);
        this.oracle = (0,web.State)();
        this.events = {
            mint: NFTMintData,
            upgrade: web.PublicKey,
            update: Update,
            escrowTransfer: EscrowTransfer,
            approveEscrow: EscrowApproval,
        };
    }
    init() {
        super.init();
    }
    async deploy(args) {
        super.deploy(args);
        this.account.permissions.set({
            ...web.Permissions.default(),
            editState: web.Permissions.proof(),
        });
    }
    async approveBase(forest) {
        // https://discord.com/channels/484437221055922177/1215258350577647616
        // this.checkZeroBalanceChange(forest);
        //forest.isEmpty().assertEquals(Bool(true));
        throw Error("transfers of tokens are not allowed, change the owner instead");
    }
    async setOracle(newOracle, signature) {
        const oracle = this.oracle.getAndRequireEquals();
        signature
            .verify(oracle, [...newOracle.toFields(), ...this.address.toFields()])
            .assertEquals(true);
        this.oracle.set(newOracle);
    }
    isNFT(address) {
        web.AccountUpdate.create(address, this.deriveTokenId())
            .account.balance.getAndRequireEquals()
            .assertEquals(web.UInt64.from(1_000_000_000));
    }
    /**
     * Upgrade the NFT to the new version
     * @param address the address of the NFT
     * @param vk the verification key of the new MinaNFTContract
     * @param signature the signature of the name service allowing the upgrading of the NFT
     */
    async upgrade(address, vk, signature) {
        this.isNFT(address);
        const oracle = this.oracle.getAndRequireEquals();
        signature
            .verify(oracle, [...address.toFields(), vk.hash])
            .assertEquals(true);
        const tokenId = this.deriveTokenId();
        const update = web.AccountUpdate.createSigned(address, tokenId);
        update.body.update.verificationKey = { isSome: (0,web.Bool)(true), value: vk };
        this.emitEvent("upgrade", address);
    }
    /**
     * Mints the NFT
     * @param data the {@link MintData} of the NFT
     */
    async mint(data) {
        const oracle = this.oracle.getAndRequireEquals();
        data.signature
            .verify(oracle, [
            ...data.nft.address.toFields(),
            data.nft.name,
            data.verificationKey.hash,
            ...data.nft.verifier.toFields(),
        ])
            .assertEquals(true);
        data.nft.verifier.assertEquals(this.address);
        data.nft.name.assertEquals(data.nft.initialState[0]);
        this.internal.mint({ address: data.nft.address, amount: 1_000_000_000 });
        const tokenId = this.deriveTokenId();
        const update = web.AccountUpdate.createSigned(data.nft.address, tokenId);
        update.body.update.verificationKey = {
            isSome: (0,web.Bool)(true),
            value: data.verificationKey,
        };
        update.body.update.permissions = {
            isSome: (0,web.Bool)(true),
            value: {
                ...web.Permissions.default(),
                editState: web.Permissions.proof(),
            },
        };
        data.nft.initialState[0].assertEquals(data.nft.name);
        update.body.update.appState = [
            { isSome: (0,web.Bool)(true), value: data.nft.initialState[0] },
            { isSome: (0,web.Bool)(true), value: data.nft.initialState[1] },
            { isSome: (0,web.Bool)(true), value: data.nft.initialState[2] },
            { isSome: (0,web.Bool)(true), value: data.nft.initialState[3] },
            { isSome: (0,web.Bool)(true), value: data.nft.initialState[4] },
            { isSome: (0,web.Bool)(true), value: data.nft.initialState[5] },
            { isSome: (0,web.Bool)(true), value: data.nft.initialState[6] },
            { isSome: (0,web.Bool)(true), value: data.nft.initialState[7] },
        ];
        this.emitEvent("mint", data.nft);
    }
    /**
     * Updates metadata of the NFT
     * @param address address of the NFT
     * @param update {@link Update} - data for the update
     * @param signature signature of the owner
     * @param owner owner's public key
     * @param proof {@link MinaNFTMetadataUpdateProof} - proof of the update of the metadata to be correctly inserted into the Merkle Map
     */
    async update(address, update, signature, owner, proof) {
        this.isNFT(address);
        this.address.assertEquals(update.verifier);
        const tokenId = this.deriveTokenId();
        const nft = new MinaNFTContract(address, tokenId);
        await nft.update(update, signature, owner, proof);
        this.emitEvent("update", update);
    }
    /**
     * Transfer the NFT to new owner
     * @param address address of the NFT
     * @param data {@link EscrowTransfer} - data for the transfer
     * @param signature1 signature of the first escrow
     * @param signature2 signature of the second escrow
     * @param signature3 signature of the third escrow
     * @param escrow1 public key of the first escrow
     * @param escrow2 public key of the second escrow
     * @param escrow3 public key of the third escrow
     */
    async escrowTransfer(address, data, signature1, signature2, signature3, escrow1, escrow2, escrow3) {
        this.isNFT(address);
        const tokenId = this.deriveTokenId();
        const nft = new MinaNFTContract(address, tokenId);
        await nft.escrowTransfer(data, signature1, signature2, signature3, escrow1, escrow2, escrow3);
        this.emitEvent("escrowTransfer", data);
    }
    /**
     * Approve setting of the new escrow
     * @param address address of the NFT
     * @param proof {@link EscrowTransferProof} - escrow proof
     */
    async approveEscrow(address, proof) {
        this.isNFT(address);
        const tokenId = this.deriveTokenId();
        const nft = new MinaNFTContract(address, tokenId);
        await nft.approveEscrow(proof);
        this.emitEvent("approveEscrow", proof.publicInput.approval);
    }
}
__decorate([
    (0,web.state)(web.PublicKey),
    __metadata("design:type", Object)
], MinaNFTNameServiceContract.prototype, "oracle", void 0);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey, web.Signature]),
    __metadata("design:returntype", Promise)
], MinaNFTNameServiceContract.prototype, "setOracle", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey,
        web.VerificationKey,
        web.Signature]),
    __metadata("design:returntype", Promise)
], MinaNFTNameServiceContract.prototype, "upgrade", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MintData]),
    __metadata("design:returntype", Promise)
], MinaNFTNameServiceContract.prototype, "mint", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey,
        Update,
        web.Signature,
        web.PublicKey,
        MinaNFTMetadataUpdateProof]),
    __metadata("design:returntype", Promise)
], MinaNFTNameServiceContract.prototype, "update", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey,
        EscrowTransfer,
        web.Signature,
        web.Signature,
        web.Signature,
        web.PublicKey,
        web.PublicKey,
        web.PublicKey]),
    __metadata("design:returntype", Promise)
], MinaNFTNameServiceContract.prototype, "escrowTransfer", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey, EscrowTransferProof]),
    __metadata("design:returntype", Promise)
], MinaNFTNameServiceContract.prototype, "approveEscrow", null);
//# sourceMappingURL=names.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/plugins/redactedmap.js



class MapElement extends (0,web.Struct)({
    originalRoot: Metadata,
    redactedRoot: Metadata,
    key: web.Field,
    value: Metadata,
}) {
}
class RedactedMinaNFTMapState extends (0,web.Struct)({
    originalRoot: Metadata, // root of the original Map
    redactedRoot: Metadata, // root of the Redacted Map
    hash: web.Field, // hash of all the keys and values of the Redacted Map
    count: web.Field, // number of keys in the Redacted Map
}) {
    static create(element, originalWitness, redactedWitness) {
        // TODO: remove comments from key validation after https://github.com/o1-labs/o1js/issues/1552
        const [originalDataWitnessRoot, originalDataWitnessKey] = originalWitness.data.computeRootAndKeyV2(element.value.data);
        element.originalRoot.data.assertEquals(originalDataWitnessRoot);
        //originalDataWitnessKey.assertEquals(element.key);
        const [originalKindWitnessRoot, originalKindWitnessKey] = originalWitness.kind.computeRootAndKeyV2(element.value.kind);
        element.originalRoot.kind.assertEquals(originalKindWitnessRoot);
        //originalKindWitnessKey.assertEquals(element.key);
        const [redactedDataWitnessRoot, redactedDataWitnessKey] = redactedWitness.data.computeRootAndKeyV2(element.value.data);
        element.redactedRoot.data.assertEquals(redactedDataWitnessRoot);
        //redactedDataWitnessKey.assertEquals(element.key);
        const [redactedKindWitnessRoot, redactedKindWitnessKey] = redactedWitness.kind.computeRootAndKeyV2(element.value.kind);
        element.redactedRoot.kind.assertEquals(redactedKindWitnessRoot);
        //redactedKindWitnessKey.assertEquals(element.key);
        return new RedactedMinaNFTMapState({
            originalRoot: element.originalRoot,
            redactedRoot: element.redactedRoot,
            hash: web.Poseidon.hash([
                element.key,
                element.value.data,
                element.value.kind,
            ]),
            count: (0,web.Field)(1),
        });
    }
    static merge(state1, state2) {
        Metadata.assertEquals(state1.originalRoot, state2.originalRoot);
        Metadata.assertEquals(state1.redactedRoot, state2.redactedRoot);
        return new RedactedMinaNFTMapState({
            originalRoot: state1.originalRoot,
            redactedRoot: state1.redactedRoot,
            hash: state1.hash.add(state2.hash),
            count: state1.count.add(state2.count),
        });
    }
    static assertEquals(state1, state2) {
        Metadata.assertEquals(state1.originalRoot, state2.originalRoot);
        Metadata.assertEquals(state1.redactedRoot, state2.redactedRoot);
        state1.hash.assertEquals(state2.hash);
        state1.count.assertEquals(state2.count);
    }
}
const RedactedMinaNFTMapCalculation = (0,web.ZkProgram)({
    name: "RedactedMinaNFTMapCalculation",
    publicInput: RedactedMinaNFTMapState,
    methods: {
        create: {
            privateInputs: [MapElement, MetadataWitness, MetadataWitness],
            async method(state, element, originalWitness, redactedWitness) {
                const computedState = RedactedMinaNFTMapState.create(element, originalWitness, redactedWitness);
                RedactedMinaNFTMapState.assertEquals(computedState, state);
            },
        },
        merge: {
            privateInputs: [web.SelfProof, web.SelfProof],
            async method(newState, proof1, proof2) {
                proof1.verify();
                proof2.verify();
                const computedState = RedactedMinaNFTMapState.merge(proof1.publicInput, proof2.publicInput);
                RedactedMinaNFTMapState.assertEquals(computedState, newState);
            },
        },
    },
});
class RedactedMinaNFTMapStateProof extends web.ZkProgram.Proof(RedactedMinaNFTMapCalculation) {
}
//# sourceMappingURL=redactedmap.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/plugins/verifier.js






class MinaNFTVerifier extends web.SmartContract {
    async deploy(args) {
        super.deploy(args);
        this.account.permissions.set({
            ...web.Permissions.default(),
            setDelegate: web.Permissions.proof(),
            incrementNonce: web.Permissions.proof(),
            setVotingFor: web.Permissions.proof(),
            setTiming: web.Permissions.proof(),
        });
    }
    async verifyRedactedMetadata(nft, tokenId, proof) {
        const minanft = new MinaNFTContract(nft, tokenId);
        const nftMetadata = minanft.metadata.get();
        Metadata.assertEquals(nftMetadata, proof.publicInput.originalRoot);
        proof.verify();
    }
}
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey,
        web.Field,
        RedactedMinaNFTMapStateProof]),
    __metadata("design:returntype", Promise)
], MinaNFTVerifier.prototype, "verifyRedactedMetadata", null);
//# sourceMappingURL=verifier.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/plugins/badgeproof.js



class BadgeDataWitness extends (0,web.Struct)({
    root: Metadata,
    value: Metadata,
    key: web.Field,
    witness: MetadataWitness,
}) {
}
class BadgeData extends (0,web.Struct)({
    root: Metadata,
    data: Metadata,
    key: web.Field,
}) {
    // TODO: remove comments from key validation after https://github.com/o1-labs/o1js/issues/1552
    static create(badgeDataWitness) {
        const [dataWitnessRootBefore, dataWitnessKey] = badgeDataWitness.witness.data.computeRootAndKeyV2(badgeDataWitness.value.data);
        badgeDataWitness.root.data.assertEquals(dataWitnessRootBefore);
        //dataWitnessKey.assertEquals(badgeDataWitness.key);
        const [kindWitnessRootBefore, kindWitnessKey] = badgeDataWitness.witness.kind.computeRootAndKeyV2(badgeDataWitness.value.kind);
        badgeDataWitness.root.kind.assertEquals(kindWitnessRootBefore);
        //kindWitnessKey.assertEquals(badgeDataWitness.key);
        return new BadgeData({
            root: badgeDataWitness.root,
            data: badgeDataWitness.value,
            key: badgeDataWitness.key,
        });
    }
    static assertEquals(data1, data2) {
        Metadata.assertEquals(data1.root, data2.root);
        Metadata.assertEquals(data1.data, data2.data);
        data1.key.assertEquals(data2.key);
    }
}
const MinaNFTBadgeCalculation = (0,web.ZkProgram)({
    name: "MinaNFTBadgeCalculation",
    publicInput: BadgeData,
    methods: {
        create: {
            privateInputs: [BadgeDataWitness],
            async method(state, badgeDataWitness) {
                const computedState = BadgeData.create(badgeDataWitness);
                BadgeData.assertEquals(computedState, state);
            },
        },
    },
});
class MinaNFTBadgeProof extends web.ZkProgram.Proof(MinaNFTBadgeCalculation) {
}
//# sourceMappingURL=badgeproof.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/plugins/badge.js







class MinaNFTVerifierBadgeEvent extends (0,web.Struct)({
    address: web.PublicKey,
    owner: web.Field,
    name: web.Field,
    version: web.UInt64,
    data: Metadata,
    key: web.Field,
}) {
    constructor(args) {
        super(args);
    }
}
class MinaNFTVerifierBadge extends web.TokenContract {
    constructor() {
        super(...arguments);
        this.name = (0,web.State)();
        this.owner = (0,web.State)();
        this.verifiedKey = (0,web.State)();
        this.verifiedKind = (0,web.State)();
        this.oracle = (0,web.State)();
        this.events = {
            deploy: web.Field,
            issue: MinaNFTVerifierBadgeEvent,
            revoke: web.PublicKey,
        };
    }
    async deploy(args) {
        super.deploy(args);
        this.account.permissions.set({
            ...web.Permissions.default(),
            editState: web.Permissions.proof(),
        });
    }
    async approveBase(forest) {
        // https://discord.com/channels/484437221055922177/1215258350577647616
        // this.checkZeroBalanceChange(forest);
        //forest.isEmpty().assertEquals(Bool(true));
        throw Error("transfers of tokens are not allowed, change the owner instead");
    }
    async issueBadge(nft, nftTokenId, badgeEvent, signature, proof, badgeProof) {
        /*
        Excluded pending resolution of the issue
        https://github.com/o1-labs/o1js/issues/1245
       
        const minanft = new MinaNFTContract(nft, nftTokenId);
        badgeEvent.owner.assertEquals(minanft.owner.getAndRequireEquals());
        badgeEvent.address.assertEquals(nft);
        badgeEvent.name.assertEquals(minanft.name.getAndRequireEquals());
        badgeEvent.version.assertEquals(minanft.version.getAndRequireEquals());
        Metadata.assertEquals(
          minanft.metadata.getAndRequireEquals(),
          proof.publicInput.originalRoot
        );
        */
        badgeProof.publicInput.data.kind.assertEquals(this.verifiedKind.getAndRequireEquals(), "Kind mismatch");
        badgeProof.publicInput.key.assertEquals(this.verifiedKey.getAndRequireEquals(), "Key mismatch");
        Metadata.assertEquals(badgeProof.publicInput.root, proof.publicInput.redactedRoot);
        Metadata.assertEquals(badgeProof.publicInput.data, badgeEvent.data);
        signature
            .verify(this.oracle.getAndRequireEquals(), MinaNFTVerifierBadgeEvent.toFields(badgeEvent))
            .assertEquals(true);
        proof.verify();
        badgeProof.verify();
        // Issue verification badge
        const tokenId = this.deriveTokenId();
        const tokenBalance = web.AccountUpdate.create(nft, tokenId).account.balance.getAndRequireEquals();
        this.internal.mint({
            address: nft,
            amount: badgeEvent.version.sub(tokenBalance),
        });
        // Emit event
        this.emitEvent("issue", badgeEvent);
    }
    async revokeBadge(nft, signature) {
        const oracle = this.oracle.getAndRequireEquals();
        signature.verify(oracle, nft.toFields());
        const tokenId = this.deriveTokenId();
        const tokenBalance = web.AccountUpdate.create(nft, tokenId).account.balance.getAndRequireEquals();
        // Revoke verification badge
        this.internal.burn({ address: nft, amount: tokenBalance });
        // Emit event
        this.emitEvent("revoke", nft);
    }
    async verifyBadge(nft, nftTokenId) {
        const tokenId = this.deriveTokenId();
        const tokenBalance = web.AccountUpdate.create(nft, tokenId).account.balance.getAndRequireEquals();
        const minanft = new MinaNFTContract(nft, nftTokenId);
        const version = minanft.version.getAndRequireEquals();
        version.assertEquals(tokenBalance);
    }
}
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], MinaNFTVerifierBadge.prototype, "name", void 0);
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], MinaNFTVerifierBadge.prototype, "owner", void 0);
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], MinaNFTVerifierBadge.prototype, "verifiedKey", void 0);
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], MinaNFTVerifierBadge.prototype, "verifiedKind", void 0);
__decorate([
    (0,web.state)(web.PublicKey),
    __metadata("design:type", Object)
], MinaNFTVerifierBadge.prototype, "oracle", void 0);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey,
        web.Field,
        MinaNFTVerifierBadgeEvent,
        web.Signature,
        RedactedMinaNFTMapStateProof,
        MinaNFTBadgeProof]),
    __metadata("design:returntype", Promise)
], MinaNFTVerifierBadge.prototype, "issueBadge", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey, web.Signature]),
    __metadata("design:returntype", Promise)
], MinaNFTVerifierBadge.prototype, "revokeBadge", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey, web.Field]),
    __metadata("design:returntype", Promise)
], MinaNFTVerifierBadge.prototype, "verifyBadge", null);
//# sourceMappingURL=badge.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/plugins/escrow.js





class EscrowDeposit extends (0,web.Struct)({
    data: EscrowTransfer,
    signature: web.Signature,
}) {
    constructor(args) {
        super(args);
    }
}
/**
 * class Escrow
 *
 */
class Escrow extends web.SmartContract {
    constructor() {
        super(...arguments);
        this.events = {
            deploy: web.Field,
            transfer: EscrowTransfer,
            deposit: EscrowTransfer,
            approveSale: EscrowTransfer,
        };
    }
    async deploy(args) {
        super.deploy(args);
        this.account.permissions.set({
            ...web.Permissions.default(),
            editState: web.Permissions.proof(),
        });
        this.emitEvent("deploy", (0,web.Field)(0));
    }
    async deposit(deposited, buyer) {
        deposited.data.newOwner.assertEquals(web.Poseidon.hash(buyer.toFields()));
        deposited.data.tokenId.assertEquals((0,web.Field)(0)); // should be MINA
        //const senderUpdate = AccountUpdate.create(buyer);
        //senderUpdate.requireSignature();
        //senderUpdate.send({ to: this.address, amount: deposited.data.price });
        this.emitEvent("deposit", deposited.data);
    }
    async approveSale(deposited, seller) {
        deposited.data.oldOwner.assertEquals(web.Poseidon.hash(seller.toFields()));
        deposited.data.tokenId.assertEquals((0,web.Field)(0)); // should be MINA
        this.emitEvent("approveSale", deposited.data);
    }
    async transfer(nft, nameService, data, signature1, signature2, signature3, escrow1, escrow2, escrow3, amount, seller, buyer) {
        data.price.assertEquals(amount);
        data.tokenId.assertEquals((0,web.Field)(0)); // should be MINA
        data.oldOwner.assertEquals(web.Poseidon.hash(seller.toFields()));
        data.newOwner.assertEquals(web.Poseidon.hash(buyer.toFields()));
        const minanft = new MinaNFTNameServiceContract(nameService);
        await minanft.escrowTransfer(nft, data, signature1, signature2, signature3, escrow1, escrow2, escrow3);
        //this.send({ to: seller, amount });
        this.emitEvent("transfer", data);
    }
}
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EscrowDeposit, web.PublicKey]),
    __metadata("design:returntype", Promise)
], Escrow.prototype, "deposit", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EscrowDeposit, web.PublicKey]),
    __metadata("design:returntype", Promise)
], Escrow.prototype, "approveSale", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey,
        web.PublicKey,
        EscrowTransfer,
        web.Signature,
        web.Signature,
        web.Signature,
        web.PublicKey,
        web.PublicKey,
        web.PublicKey,
        web.UInt64,
        web.PublicKey,
        web.PublicKey]),
    __metadata("design:returntype", Promise)
], Escrow.prototype, "transfer", null);
//# sourceMappingURL=escrow.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/baseminanft.js














/**
 * Base class for MinaNFT
 */
class BaseMinaNFT {
    constructor() {
        this.metadata = new Map();
    }
    /**
     * Gets public attribute
     * @param key key of the attribute
     * @returns value of the attribute
     */
    getMetadata(key) {
        return this.metadata.get(key);
    }
    /**
     * updates Metadata with key and value
     * @param mapToUpdate map to update
     * @param keyToUpdate key to update
     * @param newValue new value
     * @returns MapUpdate object
     */
    updateMetadataMap(keyToUpdate, newValue) {
        const { root, map } = this.getMetadataRootAndMap();
        const key = MinaNFT.stringToField(keyToUpdate);
        const witness = map.getWitness(key);
        const oldValue = map.get(key);
        this.metadata.set(keyToUpdate, newValue);
        map.set(key, new Metadata({ data: newValue.data, kind: newValue.kind }));
        const newRoot = map.getRoot();
        return new MetadataUpdate({
            oldRoot: root,
            newRoot,
            key,
            oldValue,
            newValue: new Metadata({ data: newValue.data, kind: newValue.kind }),
            witness,
        });
    }
    /**
     * Calculates a root and MerkleMap of the publicAttributes
     * @returns Root and MerkleMap of the publicAttributes
     */
    getMetadataRootAndMap() {
        return this.getMapRootAndMap(this.metadata);
    }
    /**
     * Calculates a root and MerkleMap of the Map
     * @param data Map to calculate root and MerkleMap
     * @returns Root and MerkleMap of the Map
     */
    getMapRootAndMap(data) {
        const map = new MetadataMap();
        data.forEach((value, key) => {
            const keyField = MinaNFT.stringToField(key);
            map.data.set(keyField, value.data);
            map.kind.set(keyField, value.kind);
        });
        return {
            root: new Metadata({
                data: map.data.getRoot(),
                kind: map.kind.getRoot(),
            }),
            map,
        };
    }
    /*
    public async getPublicJson(): Promise<object | undefined> {
      if (!this.publicAttributes.get("image")) return undefined;
      const publicAttributes: MerkleMap = new MerkleMap();
      Object.keys(this.publicAttributes).map((key) => {
        const value = this.publicAttributes.get(key);
        if (value) publicAttributes.set(MinaNFT.stringToField(key), value);
        else {
          console.error("Map error");
          return undefined;
        }
      });
      const publicMapRoot: string = publicAttributes.getRoot().toJSON();
      return {
        publicMapRoot,
        publicAttributes: MinaNFT.mapToJSON(this.publicAttributes),
      };
    }
  */
    /**
     * Converts a string to a Field
     * @param item string to convert
     * @returns string as a Field
     */
    static stringToField(item) {
        const fields = web.Encoding.stringToFields(item);
        //const fields: Field[] = stringToFields(item);
        if (fields.length === 1) {
            if (MinaNFT.stringFromFields(fields) === item)
                return fields[0];
            else
                throw Error(`stringToField error: encoding error`);
        }
        else
            throw new Error(`stringToField error: string ${item} is too long, requires ${fields.length} Fields`);
    }
    /**
     * Converts a string to a Fields
     * @param item string to convert
     * @returns string as a Field[]
     */
    static stringToFields(item) {
        const fields = web.Encoding.stringToFields(item);
        //const fields: Field[] = stringToFields(item);
        if (MinaNFT.stringFromFields(fields) === item)
            return fields;
        else
            throw Error(`stringToField error: encoding error`);
    }
    /**
     * Converts a Field to a string
     * @param field Field to convert
     * @returns string
     */
    static stringFromField(field) {
        return MinaNFT.stringFromFields([field]);
    }
    /**
     * Converts a Field[] to a string
     * @param fields Fields to convert
     * @returns string
     */
    static stringFromFields(fields) {
        // Encoding.stringFromFields is not working properly in o1js 0.14.0, use internal implementation
        // It is working again in o1js 0.14.1
        return web.Encoding.stringFromFields(fields);
    }
    /**
     * Converts a string "i:..." or "a:..." to a storage url string
     * @param storageStr string to convert
     * @returns string
     */
    static urlFromStorageString(storageStr) {
        if (storageStr.length < 2 ||
            (storageStr[0] !== "i" && storageStr[0] !== "a")) {
            throw new Error("Invalid storage string");
        }
        const url = storageStr[0] === "i"
            ? "https://gateway.pinata.cloud/ipfs/" + storageStr.slice(2)
            : "https://arweave.net/" + storageStr.slice(2);
        return url;
    }
    /**
     * Converts a Storage to a storage url string
     * @param storage Storage to convert
     * @returns string
     */
    static urlFromStorage(storage) {
        return BaseMinaNFT.urlFromStorageString(web.Encoding.stringFromFields(storage.hashString));
    }
    /**
     * Sets a cache for prover keys
     */
    static setCache(cache) {
        MinaNFT.cache = cache;
    }
    /**
     * Sets a cache folder for prover keys
     * @param folder folder for prover keys
     * default is "./cache"
     */
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    static setCacheFolder(folder = "./cache") {
        BaseMinaNFT.cache = web.Cache.FileSystem(folder);
    }
    /**
     * Compiles MinaNFT contract
     * @returns verification key
     */
    static async compile(rollup = false) {
        const options = BaseMinaNFT.cache
            ? { cache: BaseMinaNFT.cache }
            : undefined;
        if (BaseMinaNFT.updateVerificationKey === undefined) {
            console.time("MinaNFTMetadataUpdate compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await MinaNFTMetadataUpdate.compile(options);
            console.timeEnd("MinaNFTMetadataUpdate compiled");
            BaseMinaNFT.updateVerificationKey = verificationKey;
        }
        if (rollup)
            return BaseMinaNFT.updateVerificationKey;
        if (MinaNFT.transferVerificationKey === undefined) {
            console.time("EscrowTransferVerification compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await EscrowTransferVerification.compile(options);
            console.timeEnd("EscrowTransferVerification compiled");
            MinaNFT.transferVerificationKey = verificationKey;
        }
        if (MinaNFT.verificationKey == undefined) {
            console.time("MinaNFT compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await MinaNFTContract.compile(options);
            console.timeEnd("MinaNFT compiled");
            MinaNFT.verificationKey = verificationKey;
        }
        if (MinaNFT.namesVerificationKey == undefined) {
            console.time("MinaNFTNameServiceContract compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await MinaNFTNameServiceContract.compile(options);
            console.timeEnd("MinaNFTNameServiceContract compiled");
            MinaNFT.namesVerificationKey = verificationKey;
        }
        return MinaNFT.verificationKey;
    }
    /**
     * Compiles MinaNFTVerifier contract
     * @returns verification key
     */
    static async compileVerifier() {
        const options = MinaNFT.cache ? { cache: MinaNFT.cache } : undefined;
        if (MinaNFT.redactedMapVerificationKey === undefined) {
            console.time("RedactedMinaNFTMapCalculation compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await RedactedMinaNFTMapCalculation.compile(options);
            console.timeEnd("RedactedMinaNFTMapCalculation compiled");
            MinaNFT.redactedMapVerificationKey = verificationKey;
        }
        if (MinaNFT.verifierVerificationKey === undefined) {
            console.time("MinaNFTVerifier compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await MinaNFTVerifier.compile(options);
            console.timeEnd("MinaNFTVerifier compiled");
            MinaNFT.verifierVerificationKey = verificationKey;
        }
        return MinaNFT.verifierVerificationKey;
    }
    /**
     * Compiles MinaNFTVerifierBadge contract
     * @returns verification key
     */
    static async compileBadge() {
        const options = MinaNFT.cache ? { cache: MinaNFT.cache } : undefined;
        if (MinaNFT.redactedMapVerificationKey === undefined) {
            console.time("RedactedMinaNFTMapCalculation compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await RedactedMinaNFTMapCalculation.compile(options);
            console.timeEnd("RedactedMinaNFTMapCalculation compiled");
            MinaNFT.redactedMapVerificationKey = verificationKey;
        }
        if (MinaNFT.badgeVerificationKey === undefined) {
            console.time("MinaNFTBadgeCalculation compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await MinaNFTBadgeCalculation.compile(options);
            console.timeEnd("MinaNFTBadgeCalculation compiled");
            MinaNFT.badgeVerificationKey = verificationKey;
        }
        if (MinaNFT.badgeVerifierVerificationKey === undefined) {
            console.time("MinaNFTVerifierBadge compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await MinaNFTVerifierBadge.compile(options);
            console.timeEnd("MinaNFTVerifierBadge compiled");
            MinaNFT.badgeVerifierVerificationKey = verificationKey;
        }
        return MinaNFT.badgeVerifierVerificationKey;
    }
    /**
     * Compiles Escrow contract
     * @returns verification key
     */
    static async compileEscrow() {
        const options = MinaNFT.cache ? { cache: MinaNFT.cache } : undefined;
        if (MinaNFT.escrowVerificationKey === undefined) {
            console.time("Escrow compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await Escrow.compile(options);
            console.timeEnd("Escrow compiled");
            MinaNFT.escrowVerificationKey = verificationKey;
        }
        return MinaNFT.escrowVerificationKey;
    }
    /**
     * Compiles RedactedMinaNFTMapCalculation contract
     * @returns verification key
     */
    static async compileRedactedMap() {
        const options = MinaNFT.cache ? { cache: MinaNFT.cache } : undefined;
        if (MinaNFT.redactedMapVerificationKey === undefined) {
            console.time("RedactedMinaNFTMapCalculation compiled");
            await sleep(100); // alow GC to run
            const { verificationKey } = await RedactedMinaNFTMapCalculation.compile(options);
            console.timeEnd("RedactedMinaNFTMapCalculation compiled");
            MinaNFT.redactedMapVerificationKey = verificationKey;
        }
        return MinaNFT.redactedMapVerificationKey;
    }
}
//# sourceMappingURL=baseminanft.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/privatemetadata.js


class PrivateMetadata {
    constructor(value) {
        this.data = value.data;
        this.kind = value.kind;
        this.isPrivate = value.isPrivate ?? false;
        this.linkedObject = value.linkedObject;
    }
    toJSON() {
        const kind = MinaNFT.stringFromField(this.kind);
        let data;
        if (kind === "string")
            data = MinaNFT.stringFromField(this.data);
        else
            data = this.data.toJSON();
        const isPrivate = this.isPrivate === true ? true : undefined;
        return {
            data,
            kind,
            isPrivate,
            linkedObject: this.linkedObject?.toJSON(),
        };
    }
}
//# sourceMappingURL=privatemetadata.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/baseminanftobject.js


class BaseMinaNFTObject {
    constructor(type) {
        this.root = web.Field.from(0);
        this.type = type;
    }
}
//# sourceMappingURL=baseminanftobject.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/storage/text.js



class TextData extends BaseMinaNFTObject {
    constructor(text) {
        super("text");
        this.text = text;
        this.size = text.length;
        this.height = Math.ceil(Math.log2(this.size + 2)) + 1;
        const tree = new web.MerkleTree(this.height);
        if (this.size + 2 > tree.leafCount)
            throw new Error(`Text is too big for this Merkle tree`);
        tree.setLeaf(BigInt(0), web.Field.from(this.height));
        tree.setLeaf(BigInt(1), web.Field.from(this.size));
        for (let i = 0; i < this.size; i++) {
            tree.setLeaf(BigInt(i + 2), web.Field.from(this.text.charCodeAt(i)));
        }
        this.root = tree.getRoot();
    }
    toJSON() {
        return {
            type: this.type,
            MerkleTreeHeight: this.height,
            size: this.size,
            text: this.text,
        };
    }
    static fromJSON(json) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj = json;
        const data = obj.data;
        const kind = obj.kind;
        const linkedObject = obj.linkedObject;
        if (data === undefined)
            throw new Error("uri: NFT metadata: data should present");
        if (kind === undefined || typeof kind !== "string" || kind !== "text")
            throw new Error("uri: NFT metadata: kind mismatch");
        if (linkedObject === undefined ||
            typeof linkedObject !== "object" ||
            linkedObject.text === undefined ||
            typeof linkedObject.text !== "string" ||
            linkedObject.size === undefined ||
            linkedObject.MerkleTreeHeight === undefined ||
            linkedObject.type === undefined ||
            typeof linkedObject.type !== "string" ||
            linkedObject.type !== "text")
            throw new Error("uri: NFT metadata: text json mismatch");
        const text = new TextData(linkedObject.text);
        if (text.root.toJSON() !== data)
            throw new Error("uri: NFT metadata: text root mismatch");
        if (text.size !== linkedObject.size)
            throw new Error("uri: NFT metadata: text size mismatch");
        if (text.height !== linkedObject.MerkleTreeHeight)
            throw new Error("uri: NFT metadata: text height mismatch");
        return text;
    }
}
//# sourceMappingURL=text.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/plugins/redactedtree.js



class TreeElement extends (0,web.Struct)({
    originalRoot: web.Field,
    redactedRoot: web.Field,
    index: web.Field,
    value: web.Field,
}) {
    toJSON() {
        return {
            originalRoot: this.originalRoot.toJSON(),
            redactedRoot: this.redactedRoot.toJSON(),
            index: this.index.toJSON(),
            value: this.value.toJSON(),
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromJSON(json) {
        return new TreeElement({
            originalRoot: web.Field.fromJSON(json.originalRoot),
            redactedRoot: web.Field.fromJSON(json.redactedRoot),
            index: web.Field.fromJSON(json.index),
            value: web.Field.fromJSON(json.value),
        });
    }
}
class BaseRedactedMinaNFTTreeState extends (0,web.Struct)({
    originalRoot: web.Field, // root of the original Tree
    redactedRoot: web.Field, // root of the Redacted Tree
    hash: web.Field, // hash of all the keys and values of the Redacted Tree
    count: web.Field, // number of keys in the Redacted Map
}) {
}
function MinaNFTTreeVerifierFunction(height) {
    class MerkleTreeWitness extends (0,web.MerkleWitness)(height) {
    }
    class RedactedMinaNFTTreeState extends BaseRedactedMinaNFTTreeState {
        static create(element, originalWitness, redactedWitness) {
            const originalWitnessRoot = originalWitness.calculateRoot(element.value);
            element.originalRoot.assertEquals(originalWitnessRoot);
            const calculatedOriginalIndex = originalWitness.calculateIndex();
            calculatedOriginalIndex.assertEquals(element.index);
            const redactedWitnessRoot = redactedWitness.calculateRoot(element.value);
            element.redactedRoot.assertEquals(redactedWitnessRoot);
            const calculatedRedactedIndex = redactedWitness.calculateIndex();
            calculatedRedactedIndex.assertEquals(element.index);
            return new RedactedMinaNFTTreeState({
                originalRoot: element.originalRoot,
                redactedRoot: element.redactedRoot,
                hash: web.Poseidon.hash([element.index, element.value]),
                count: (0,web.Field)(1),
            });
        }
        static merge(state1, state2) {
            state1.originalRoot.assertEquals(state2.originalRoot);
            state1.redactedRoot.assertEquals(state2.redactedRoot);
            return new RedactedMinaNFTTreeState({
                originalRoot: state1.originalRoot,
                redactedRoot: state1.redactedRoot,
                hash: state1.hash.add(state2.hash),
                count: state1.count.add(state2.count),
            });
        }
        static assertEquals(state1, state2) {
            state1.originalRoot.assertEquals(state2.originalRoot);
            state1.redactedRoot.assertEquals(state2.redactedRoot);
            state1.hash.assertEquals(state2.hash);
            state1.count.assertEquals(state2.count);
        }
    }
    const RedactedMinaNFTTreeCalculation = (0,web.ZkProgram)({
        name: "RedactedMinaNFTTreeCalculation_" + height.toString(),
        publicInput: RedactedMinaNFTTreeState,
        methods: {
            create: {
                privateInputs: [TreeElement, MerkleTreeWitness, MerkleTreeWitness],
                async method(state, element, originalWitness, redactedWitness) {
                    const computedState = RedactedMinaNFTTreeState.create(element, originalWitness, redactedWitness);
                    RedactedMinaNFTTreeState.assertEquals(computedState, state);
                },
            },
            merge: {
                privateInputs: [web.SelfProof, web.SelfProof],
                async method(newState, proof1, proof2) {
                    proof1.verify();
                    proof2.verify();
                    const computedState = RedactedMinaNFTTreeState.merge(proof1.publicInput, proof2.publicInput);
                    RedactedMinaNFTTreeState.assertEquals(computedState, newState);
                },
            },
        },
    });
    class RedactedMinaNFTTreeStateProof extends web.ZkProgram.Proof(RedactedMinaNFTTreeCalculation) {
    }
    class MinaNFTTreeVerifier extends web.SmartContract {
        async deploy(args) {
            super.deploy(args);
            this.account.permissions.set({
                ...web.Permissions.default(),
                setDelegate: web.Permissions.proof(),
                incrementNonce: web.Permissions.proof(),
                setVotingFor: web.Permissions.proof(),
                setTiming: web.Permissions.proof(),
            });
        }
        async verifyRedactedTree(proof) {
            proof.verify();
        }
    }
    __decorate([
        web.method,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [RedactedMinaNFTTreeStateProof]),
        __metadata("design:returntype", Promise)
    ], MinaNFTTreeVerifier.prototype, "verifyRedactedTree", null);
    return {
        RedactedMinaNFTTreeState,
        RedactedMinaNFTTreeCalculation,
        MinaNFTTreeVerifier,
        MerkleTreeWitness,
        RedactedMinaNFTTreeStateProof,
    };
}
//# sourceMappingURL=redactedtree.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/redactedtree.js






class RedactedTree {
    constructor(height, originalTree) {
        this.leafs = [];
        /*
            RedactedMinaNFTTreeState,
            RedactedMinaNFTTreeCalculation,
            MinaNFTTreeVerifier,
            MerkleTreeWitness,
            RedactedMinaNFTTreeStateProof,
        */
        this.verificationKey = undefined;
        this.height = height;
        this.originalTree = originalTree;
        this.redactedTree = new web.MerkleTree(height);
        this.contracts = MinaNFTTreeVerifierFunction(height);
    }
    /**
     * copy public attribute
     * @param key key of the attribute
     */
    set(key, value) {
        this.redactedTree.setLeaf(BigInt(key), value);
        this.leafs.push({ key, value });
    }
    async compile() {
        if (this.verificationKey !== undefined)
            return this.verificationKey;
        console.time(`compiled RedactedTreeCalculation`);
        await sleep(100); // alow GC to run
        const verificationKey = (await this.contracts.RedactedMinaNFTTreeCalculation.compile()).verificationKey;
        console.timeEnd(`compiled RedactedTreeCalculation`);
        this.verificationKey = verificationKey;
        return verificationKey;
    }
    /**
     *
     * @returns proof
     */
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    async proof(verbose = false) {
        class TreeStateProof extends this.contracts.RedactedMinaNFTTreeStateProof {
        }
        const verificationKey = await this.compile();
        console.time(`calculated proofs`);
        console.log(`calculating ${this.leafs.length} proofs...`);
        const originalRoot = this.originalTree.getRoot();
        const redactedRoot = this.redactedTree.getRoot();
        const proofs = [];
        for (let i = 0; i < this.leafs.length; i++) {
            await sleep(100); // alow GC to run
            const originalWitness = new this.contracts.MerkleTreeWitness(this.originalTree.getWitness(BigInt(this.leafs[i].key)));
            const redactedWitness = new this.contracts.MerkleTreeWitness(this.redactedTree.getWitness(BigInt(this.leafs[i].key)));
            const element = new TreeElement({
                originalRoot,
                redactedRoot,
                index: (0,web.Field)(this.leafs[i].key),
                value: this.leafs[i].value,
            });
            const state = this.contracts.RedactedMinaNFTTreeState.create(element, originalWitness, redactedWitness);
            const proof = await this.contracts.RedactedMinaNFTTreeCalculation.create(state, element, originalWitness, redactedWitness);
            proofs.push(proof);
            if (verbose)
                Memory.info(`proof ${i} calculated`);
        }
        console.timeEnd(`calculated proofs`);
        Memory.info(`calculated proofs`);
        console.time(`merged proofs`);
        let proof = proofs[0];
        for (let i = 1; i < proofs.length; i++) {
            await sleep(100); // alow GC to run
            const state = this.contracts.RedactedMinaNFTTreeState.merge(proof.publicInput, proofs[i].publicInput);
            const mergedProof = await this.contracts.RedactedMinaNFTTreeCalculation.merge(state, proof, proofs[i]);
            proof = mergedProof;
            if (verbose)
                Memory.info(`proof ${i} merged`);
        }
        console.timeEnd(`merged proofs`);
        Memory.info(`merged proofs`);
        const ok = (0,web.verify)(proof, verificationKey);
        if (!ok) {
            throw new Error("proof verification failed");
        }
        return proof;
    }
    async deploy(deployer, privateKey, nonce) {
        const sender = deployer.toPublicKey();
        const zkAppPrivateKey = privateKey;
        const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
        await this.contracts.MinaNFTTreeVerifier.compile();
        console.log(`deploying the MinaNFTTreeVerifier contract to an address ${zkAppPublicKey.toBase58()} using the deployer with public key ${sender.toBase58()}...`);
        await fetchMinaAccount({ publicKey: sender });
        await fetchMinaAccount({ publicKey: zkAppPublicKey });
        const deployNonce = nonce ?? Number(web.Mina.getAccount(sender).nonce.toBigint());
        const hasAccount = web.Mina.hasAccount(zkAppPublicKey);
        const zkApp = new this.contracts.MinaNFTTreeVerifier(zkAppPublicKey);
        const transaction = await web.Mina.transaction({
            sender,
            fee: await MinaNFT.fee(),
            memo: "minanft.io",
            nonce: deployNonce,
        }, async () => {
            if (!hasAccount)
                web.AccountUpdate.fundNewAccount(sender);
            await zkApp.deploy({});
            zkApp.account.tokenSymbol.set("VERIFY");
            zkApp.account.zkappUri.set("https://minanft.io/@treeverifier");
        });
        transaction.sign([deployer, zkAppPrivateKey]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "verifier deploy", false);
        if (tx.status === "pending") {
            return tx;
        }
        else
            return undefined;
    }
}
//# sourceMappingURL=redactedtree.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/storage/file.js




const FILE_TREE_HEIGHT = 5;
const FILE_TREE_ELEMENTS = 14;
class FileData extends BaseMinaNFTObject {
    constructor(value) {
        super("file");
        this.fileRoot = value.fileRoot;
        this.height = value.height;
        this.size = value.size;
        this.mimeType = value.mimeType;
        this.sha3_512 = value.sha3_512;
        this.filename = value.filename;
        this.storage = value.storage;
        this.fileType = value.fileType ?? "binary";
        this.metadata = value.metadata ?? (0,web.Field)(0);
        const tree = this.buildTree().tree;
        this.root = tree.getRoot();
    }
    buildTree() {
        const tree = new web.MerkleTree(FILE_TREE_HEIGHT);
        if (Number(tree.leafCount) < FILE_TREE_ELEMENTS)
            throw new Error(`FileData has wrong encoding, should be at least FILE_TREE_ELEMENTS (12) leaves`);
        const fields = [];
        // First field is the height, second number is the number of fields
        fields.push(web.Field.from(FILE_TREE_HEIGHT)); // 0
        fields.push(web.Field.from(FILE_TREE_ELEMENTS)); // Number of data fields // 1
        fields.push(this.fileRoot); //2
        fields.push(web.Field.from(this.height)); //3
        fields.push(web.Field.from(this.size)); //4
        const mimeTypeFields = web.Encoding.stringToFields(this.mimeType.substring(0, 30));
        if (mimeTypeFields.length !== 1)
            throw new Error(`FileData: MIME type string is too long, should be less than 30 bytes`);
        fields.push(mimeTypeFields[0]); //5
        const sha512Fields = web.Encoding.stringToFields(this.sha3_512);
        if (sha512Fields.length !== 3)
            throw new Error(`SHA512 has wrong encoding, should be base64`);
        fields.push(...sha512Fields); // 6,7,8
        const filenameFields = web.Encoding.stringToFields(this.filename.substring(0, 30));
        if (filenameFields.length !== 1)
            throw new Error(`FileData: Filename string is too long, should be less than 30 bytes`);
        fields.push(filenameFields[0]); // 9
        const storageFields = this.storage === ""
            ? [(0,web.Field)(0), (0,web.Field)(0)]
            : web.Encoding.stringToFields(this.storage);
        if (storageFields.length !== 2)
            throw new Error(`Storage string has wrong encoding`);
        fields.push(...storageFields); // 10, 11
        const fileType = this.fileType ?? "binary";
        const fileTypeFields = web.Encoding.stringToFields(fileType.substring(0, 30));
        if (fileTypeFields.length !== 1)
            throw new Error(`FileData: fileType string is too long, should be less than 30 bytes`);
        fields.push(...fileTypeFields); // 12
        const metadata = this.metadata ?? (0,web.Field)(0);
        fields.push(metadata); // 13
        if (fields.length !== FILE_TREE_ELEMENTS)
            throw new Error(`FileData has wrong encoding, should be FILE_TREE_ELEMENTS (14) fields`);
        tree.fill(fields);
        return { tree, fields };
    }
    toJSON() {
        const metadata = this.metadata ?? (0,web.Field)(0);
        return {
            fileMerkleTreeRoot: this.fileRoot.toJSON(),
            MerkleTreeHeight: this.height,
            size: this.size,
            mimeType: this.mimeType,
            SHA3_512: this.sha3_512,
            filename: this.filename,
            storage: this.storage,
            fileType: this.fileType ?? "binary",
            metadata: metadata.toJSON(),
        };
    }
    static fromJSON(json) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj = json;
        const data = obj.linkedObject;
        if (data === undefined)
            throw new Error(`uri: NFT metadata: data should be present: ${json}`);
        if (data.fileMerkleTreeRoot === undefined)
            throw new Error(`uri: NFT metadata: fileMerkleTreeRoot should be present: ${json}`);
        if (data.MerkleTreeHeight === undefined)
            throw new Error(`uri: NFT metadata: MerkleTreeHeight should be present: ${json}`);
        if (data.size === undefined)
            throw new Error(`uri: NFT metadata: size should be present: ${json}`);
        if (data.mimeType === undefined)
            throw new Error(`uri: NFT metadata: mimeType should be present: ${json}`);
        if (data.SHA3_512 === undefined)
            throw new Error(`uri: NFT metadata: SHA3_512 should be present: ${json}`);
        if (data.filename === undefined)
            throw new Error(`uri: NFT metadata: filename should be present: ${json}`);
        if (data.storage === undefined)
            throw new Error(`uri: NFT metadata: storage should be present: ${json}`);
        return new FileData({
            fileRoot: web.Field.fromJSON(data.fileMerkleTreeRoot),
            height: Number(data.MerkleTreeHeight),
            size: Number(data.size),
            mimeType: data.mimeType,
            sha3_512: data.SHA3_512,
            filename: data.filename,
            storage: data.storage,
            fileType: data.fileType ?? "binary",
            metadata: data.metadata ? web.Field.fromJSON(data.metadata) : (0,web.Field)(0),
        });
    }
    async proof(verbose) {
        const { tree, fields } = this.buildTree();
        if (fields.length !== FILE_TREE_ELEMENTS)
            throw new Error(`FileData: proof: wrong number of fields`);
        const redactedTree = new RedactedTree(FILE_TREE_HEIGHT, tree);
        for (let i = 0; i < fields.length; i++) {
            redactedTree.set(i, fields[i]);
        }
        const proof = await redactedTree.proof(verbose);
        return proof;
    }
}
//# sourceMappingURL=file.js.map
// EXTERNAL MODULE: ./node_modules/form-data/lib/browser.js
var lib_browser = __webpack_require__(2558);
var browser_default = /*#__PURE__*/__webpack_require__.n(lib_browser);
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/storage/ipfs.js




class IPFS {
    constructor(token) {
        this.auth = token;
    }
    async pinJSON(params) {
        const { data, name, keyvalues } = params;
        console.log("saveToIPFS:", { name, keyvalues });
        if (this.auth === "local") {
            const hash = makeString(`bafkreibwikqybinoumbe6v2mpzwgluhqw7n4h6d5y7eq2nogils6ibflbi`.length);
            IPFS.ipfsData[hash] = data;
            IPFS.useLocalIpfsData = true;
            return hash;
        }
        try {
            const pinataData = {
                pinataOptions: {
                    cidVersion: 1,
                },
                pinataMetadata: {
                    name,
                    keyvalues,
                },
                pinataContent: data,
            };
            const str = JSON.stringify(pinataData);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + this.auth,
                },
            };
            if (this.auth === "")
                //for running tests
                return `bafkreibwikqybinoumbe6v2mpzwgluhqw7n4h6d5y7eq2nogils6ibflbi`;
            const res = await lib_axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", str, config);
            console.log("saveToIPFS result:", res.data);
            return res.data.IpfsHash;
        }
        catch (error) {
            console.error("saveToIPFS error:", error?.message);
            return undefined;
        }
    }
    async pinFile(params) {
        const { stream, name, size, mimeType, keyvalues } = params;
        console.log("pinFile:", { name, size, mimeType, keyvalues });
        try {
            const form = new (browser_default())();
            form.append("file", stream, {
                contentType: mimeType,
                knownLength: size,
                filename: name,
            });
            form.append("pinataMetadata", JSON.stringify({ name, keyvalues }));
            form.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));
            if (this.auth === "")
                //for running tests
                return `bafkreibwikqybinoumbe6v2mpzwgluhqw7n4h6d5y7eq2nogils6ibflbi`;
            // TODO: add retry logic
            const response = await lib_axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", form, {
                headers: {
                    Authorization: "Bearer " + this.auth,
                    "Content-Type": "multipart/form-data",
                },
                maxBodyLength: 25 * 1024 * 1024,
            });
            console.log("pinFile result:", response.data);
            if (response && response.data && response.data.IpfsHash) {
                return response.data.IpfsHash;
            }
            else {
                console.error("pinFile error", response.data.error);
                return undefined;
            }
        }
        catch (err) {
            console.error("pinFile error 2 - catch", err);
            return undefined;
        }
    }
}
IPFS.ipfsData = {};
IPFS.useLocalIpfsData = false;
//# sourceMappingURL=ipfs.js.map
// EXTERNAL MODULE: ./node_modules/arweave/web/index.js
var arweave_web = __webpack_require__(8125);
var web_default = /*#__PURE__*/__webpack_require__.n(arweave_web);
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/storage/arweave.js
/* provided dependency */ var arweave_Buffer = __webpack_require__(6300)["Buffer"];



class ARWEAVE {
    constructor(key) {
        if (typeof key === "string") {
            if (key === "")
                key = { test: true };
            else
                this.key = JSON.parse(key);
        }
        else {
            this.key = key;
        }
        this.arweave = web_default().init({
            host: "arweave.net",
            port: 443,
            protocol: "https",
        });
    }
    // TODO: change to pinJSON with the same parameters as pinJSON in IPFS
    async pinString(data, 
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    waitForConfirmation = false) {
        try {
            if (this.key === undefined)
                return undefined;
            if (this.key?.test === true)
                return "CtQFMSLwvvWDkl5b2epJAroxXVbr1ISlAl1quCaxrOc";
            const address = await this.arweave.wallets.jwkToAddress(this.key);
            const balance = await this.arweave.wallets.getBalance(address);
            if (parseInt(balance) === 0)
                return undefined;
            const transaction = await this.arweave.createTransaction({
                data: arweave_Buffer.from(data, "utf8"),
            }, this.key);
            transaction.addTag("Content-Type", "application/json");
            await this.arweave.transactions.sign(transaction, this.key);
            const uploader = await this.arweave.transactions.getUploader(transaction);
            while (!uploader.isComplete) {
                await uploader.uploadChunk();
                console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
            }
            //console.log("transaction", transaction);
            const hash = transaction.id;
            console.log("arweave hash", hash);
            if (waitForConfirmation)
                await this.wait({ hash }); // wait for confirmation, can take a while
            return hash;
        }
        catch (err) {
            console.error(err);
            return undefined;
        }
    }
    async pinFile(data, filename, size, mimeType, 
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    waitForConfirmation = false) {
        try {
            if (this.key === undefined)
                return undefined;
            if (this.key?.test === true)
                return "CtQFMSLwvvWDkl5b2epJAroxXVbr1ISlAl1quCaxrOc";
            const address = await this.arweave.wallets.jwkToAddress(this.key);
            const balance = await this.arweave.wallets.getBalance(address);
            if (parseInt(balance) === 0)
                return undefined;
            const transaction = await this.arweave.createTransaction({ data: data }, this.key);
            transaction.addTag("Content-Type", mimeType);
            transaction.addTag("knownLength", size.toString());
            transaction.addTag("filename", filename);
            await this.arweave.transactions.sign(transaction, this.key);
            const uploader = await this.arweave.transactions.getUploader(transaction);
            while (!uploader.isComplete) {
                await uploader.uploadChunk();
                console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
            }
            //console.log("transaction", transaction);
            const hash = transaction.id;
            console.log("arweave hash", hash);
            if (waitForConfirmation)
                await this.wait({ hash }); // wait for confirmation, can take a while
            return hash;
        }
        catch (err) {
            console.error(err);
            return undefined;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async status(hash) {
        try {
            const status = await this.arweave.transactions.getStatus(hash);
            return { success: true, data: status };
        }
        catch (err) {
            console.error(err);
            return { success: false, error: err };
        }
    }
    async wait(data) {
        const maxAttempts = data?.maxAttempts ?? 360;
        const interval = data?.interval ?? 5000;
        const maxErrors = data?.maxErrors ?? 10;
        const errorDelay = 30000; // 30 seconds
        let attempts = 0;
        let errors = 0;
        while (attempts < maxAttempts) {
            const result = await this.status(data.hash);
            if (result.success === false) {
                errors++;
                if (errors > maxErrors) {
                    return {
                        success: false,
                        error: "Too many network errors",
                        result: undefined,
                    };
                }
                await sleep(errorDelay * errors);
            }
            else {
                if (result.data?.confirmed?.block_height !== undefined) {
                    return {
                        success: result.success,
                        result: result.data,
                    };
                }
                await sleep(interval);
            }
            attempts++;
        }
        return {
            success: false,
            error: "Timeout",
            result: undefined,
        };
    }
    async balance() {
        const address = await this.arweave.wallets.jwkToAddress(this.key);
        const balance = await this.arweave.wallets.getBalance(address);
        const ar = this.arweave.ar.winstonToAr(balance);
        return ar;
    }
}
//# sourceMappingURL=arweave.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/storage/map.js








class MapData extends BaseMinaNFTObject {
    constructor() {
        super("map");
        this.metadata = new Map();
    }
    /**
     * Calculates and sets a root of the MapData
     * Should be called before updating the NFT state!!!
     */
    setRoot() {
        const map = new MetadataMap();
        this.metadata.forEach((value, key) => {
            const keyField = MinaNFT.stringToField(key);
            map.data.set(keyField, value.data);
            map.kind.set(keyField, value.kind);
        });
        this.root = web.Poseidon.hash([map.data.getRoot(), map.kind.getRoot()]);
    }
    /**
     * updates Metadata
     * @param key key to update
     * @param value value to update
     */
    updateMetadata(key, value) {
        this.metadata.set(key, value);
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTStringUpdate} update data
     */
    update(data) {
        this.updateMetadata(data.key, new PrivateMetadata({
            data: MinaNFT.stringToField(data.value),
            kind: MinaNFT.stringToField(data.kind ?? "string"),
            isPrivate: data.isPrivate ?? false,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTTextUpdate} update data
     */
    updateText(data) {
        const text = new TextData(data.text);
        this.updateMetadata(data.key, new PrivateMetadata({
            data: text.root,
            kind: MinaNFT.stringToField("text"),
            isPrivate: data.isPrivate ?? false,
            linkedObject: text,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTTextDataUpdate} update data
     */
    updateTextData(data) {
        this.updateMetadata(data.key, new PrivateMetadata({
            data: data.textData.root,
            kind: MinaNFT.stringToField("text"),
            isPrivate: data.isPrivate ?? false,
            linkedObject: data.textData,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTFileDataUpdate} update data
     */
    updateFileData(data) {
        this.updateMetadata(data.key, new PrivateMetadata({
            data: data.fileData.root,
            kind: MinaNFT.stringToField(data.fileData.type),
            isPrivate: data.isPrivate ?? false,
            linkedObject: data.fileData,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTTextUpdate} update data
     */
    updateMap(data) {
        data.map.setRoot();
        this.updateMetadata(data.key, new PrivateMetadata({
            data: data.map.root,
            kind: MinaNFT.stringToField("map"),
            isPrivate: data.isPrivate ?? false,
            linkedObject: data.map,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTFieldUpdate} update data
     */
    updateField(data) {
        this.updateMetadata(data.key, {
            data: data.value,
            kind: MinaNFT.stringToField(data.kind ?? "string"),
            isPrivate: data.isPrivate ?? false,
        });
    }
    /**
     * Converts a MapData to JSON
     * @returns map as JSON object
     */
    toJSON() {
        return {
            type: this.type,
            properties: Object.fromEntries(this.metadata),
        };
    }
    static fromJSON(json, 
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    skipCalculatingMetadataRoot = false) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj = json;
        const data = obj.data;
        const kind = obj.kind;
        const linkedObject = obj.linkedObject;
        if (data === undefined)
            throw new Error(`uri: NFT metadata: data should present: ${json}`);
        if (kind === undefined || typeof kind !== "string" || kind !== "map")
            throw new Error("uri: NFT metadata: kind mismatch");
        if (linkedObject === undefined ||
            typeof linkedObject !== "object" ||
            linkedObject.properties === undefined ||
            typeof linkedObject.properties !== "object" ||
            linkedObject.type === undefined ||
            typeof linkedObject.type !== "string" ||
            linkedObject.type !== "map")
            throw new Error("uri: NFT metadata: map json mismatch");
        const map = new MapData();
        for (const key in linkedObject.properties) {
            const value = linkedObject.properties[key];
            if (value === undefined || typeof value !== "object")
                throw new Error("uri: NFT metadata: map json mismatch");
            const kind = value.kind;
            const data = value.data;
            const isPrivate = value.isPrivate ?? false;
            if (kind === undefined ||
                typeof kind !== "string" ||
                data === undefined ||
                typeof data !== "string")
                throw new Error("uri: NFT metadata: map kind or data mismatch");
            switch (kind) {
                case "string":
                    map.update({
                        key,
                        value: data,
                        isPrivate,
                    });
                    break;
                case "text":
                    map.updateTextData({
                        key,
                        textData: TextData.fromJSON(value),
                        isPrivate,
                    });
                    break;
                case "map":
                    map.updateMap({
                        key,
                        map: MapData.fromJSON(value, skipCalculatingMetadataRoot),
                        isPrivate,
                    });
                    break;
                case "file":
                    map.updateFileData({
                        key,
                        fileData: FileData.fromJSON(value),
                        isPrivate,
                    });
                    break;
                default:
                    throw new Error("uri: NFT metadata: map json mismatch");
            }
        }
        if (skipCalculatingMetadataRoot === false) {
            map.setRoot();
            if (map.root.toJSON() !== data)
                throw new Error("uri: NFT metadata: map root mismatch");
        }
        return map;
    }
}
//# sourceMappingURL=map.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/minanftnames.js





class MinaNFTNameService {
    /**
     * Create MinaNFTNameService object
     * @param value Object with address and oraclePrivateKey fields
     * @param value.address Public key of the deployed Names Service
     * @param value.oraclePrivateKey Private key of the oracle
     */
    constructor(value) {
        this.address = value.address;
        this.oraclePrivateKey = value.oraclePrivateKey;
    }
    async deploy(deployer, privateKey = undefined, nonce) {
        const sender = deployer.toPublicKey();
        if (this.oraclePrivateKey === undefined)
            throw new Error("Oracle private key is not set");
        const oracle = this.oraclePrivateKey.toPublicKey();
        const zkAppPrivateKey = privateKey ?? web.PrivateKey.random();
        const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
        await MinaNFT.compile();
        console.log(`deploying the MinaNFTNameServiceContract to an address ${zkAppPublicKey.toBase58()} using the deployer with public key ${sender.toBase58()}...`);
        const zkApp = new MinaNFTNameServiceContract(zkAppPublicKey);
        await fetchMinaAccount({ publicKey: sender });
        await fetchMinaAccount({ publicKey: zkAppPublicKey });
        const deployNonce = nonce ?? Number(web.Mina.getAccount(sender).nonce.toBigint());
        const hasAccount = web.Mina.hasAccount(zkAppPublicKey);
        const transaction = await web.Mina.transaction({
            sender,
            fee: await MinaNFT.fee(),
            memo: "minanft.io",
            nonce: deployNonce,
        }, async () => {
            if (!hasAccount)
                web.AccountUpdate.fundNewAccount(sender);
            await zkApp.deploy({});
            zkApp.oracle.set(oracle);
            zkApp.account.zkappUri.set("https://minanft.io");
            zkApp.account.tokenSymbol.set("NFT");
        });
        transaction.sign([deployer, zkAppPrivateKey]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "name service deploy", false);
        if (tx.status === "pending") {
            this.address = zkAppPublicKey;
            this.tokenId = zkApp.deriveTokenId();
            return tx;
        }
        else
            return undefined;
    }
    async upgrade(deployer, privateKey, nonce) {
        const sender = deployer.toPublicKey();
        if (this.address === undefined)
            throw new Error("Address is not set");
        const zkAppPrivateKey = privateKey;
        const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
        if (this.address.toBase58() !== zkAppPublicKey.toBase58())
            throw new Error("Address mismatch");
        await MinaNFT.compile();
        if (MinaNFT.namesVerificationKey === undefined)
            throw new Error("Compilation error: Verification key is not set");
        const verificationKey = MinaNFT.namesVerificationKey;
        console.log(`upgrading the MinaNFTNameServiceContract on address ${zkAppPublicKey.toBase58()} using the deployer with public key ${sender.toBase58()}...`);
        const zkApp = new MinaNFTNameServiceContract(zkAppPublicKey);
        await fetchMinaAccount({ publicKey: sender });
        await fetchMinaAccount({ publicKey: zkAppPublicKey });
        const deployNonce = nonce ?? Number(web.Mina.getAccount(sender).nonce.toBigint());
        const hasAccount = web.Mina.hasAccount(zkAppPublicKey);
        if (!hasAccount)
            throw new Error("Account does not exist");
        const transaction = await web.Mina.transaction({
            sender,
            fee: await MinaNFT.fee(),
            memo: "minanft.io",
            nonce: deployNonce,
        }, async () => {
            const update = web.AccountUpdate.createSigned(zkAppPublicKey);
            update.account.verificationKey.set(verificationKey);
        });
        transaction.sign([deployer, zkAppPrivateKey]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "name service upgrade", false);
        if (tx.status === "pending") {
            this.address = zkAppPublicKey;
            this.tokenId = zkApp.deriveTokenId();
            return tx;
        }
        else
            return undefined;
    }
    async issueNameSignature(nft, verificationKeyHash) {
        if (nft.address === undefined)
            throw new Error("NFT address is not set");
        if (nft.name.toJSON() !== nft.initialState[0].toJSON())
            throw new Error("Name mismatch");
        if (this.address === undefined)
            throw new Error("Names service address is not set");
        if (this.oraclePrivateKey === undefined)
            throw new Error("Oracle is not set");
        // TODO: change to api call
        const signature = web.Signature.create(this.oraclePrivateKey, [
            ...nft.address.toFields(),
            nft.name,
            verificationKeyHash,
            ...this.address.toFields(),
        ]);
        return signature;
    }
}
//# sourceMappingURL=minanftnames.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/minanft.js
/* eslint-disable @typescript-eslint/no-inferrable-types */




















const { MINAFEE, MINANFT_NAME_SERVICE } = src_config;
/**
 * MinaNFT is the class for the NFT, wrapper around the MinaNFTContract
 * @property name Name of the NFT
 * @property creator Creator of the NFT
 * @property storage Storage of the NFT - IPFS (i:...) or Arweave (a:...) hash string
 * @property owner Owner of the NFT - Poseidon hash of owner's public key
 * @property escrow Escrow of the NFT - Poseidon hash of three escrow's public keys
 * @property version Version of the NFT, increases by one with the changing of the metadata or owner
 * @property isMinted True if the NFT is minted
 * @property address Public key of the deployed NFT zkApp
 * @property tokenId Token ID of the NFT Name Service
 * @property nameService Public key of the NFT Name Service
 * @property updates Array of the metadata updates
 * @property metadataRoot Root of the Merkle Map of the metadata
 */
class MinaNFT extends BaseMinaNFT {
    /**
     * Create MinaNFT object
     * @param params arguments
     * @param params.name Name of NFT
     * @param params.address Public key of the deployed NFT zkApp
     * @param params.creator Creator of the NFT
     * @param params.storage Storage of the NFT - IPFS (i:...) or Arweave (a:...) hash string
     * @param params.owner Owner of the NFT - Poseidon hash of owner's public key
     * @param params.escrow Escrow of the NFT - Poseidon hash of three escrow's public keys
     * @param params.nameService Public key of the NFT Name Service
     */
    constructor(params) {
        super();
        this.name = params.name[0] === "@" ? params.name : "@" + params.name;
        this.creator = params.creator ?? "MinaNFT library";
        this.storage = params.storage ?? "";
        this.owner = params.owner ?? (0,web.Field)(0);
        this.escrow = params.escrow ?? (0,web.Field)(0);
        this.version = web.UInt64.from(0);
        this.isMinted = params.address === undefined ? false : true;
        this.address = params.address;
        this.updates = [];
        const metadataMap = new MetadataMap();
        this.metadataRoot = metadataMap.getRoot();
        this.nameService = params.nameService;
        if (this.nameService === undefined) {
            this.nameService = web.PublicKey.fromBase58(MINANFT_NAME_SERVICE);
        }
        const nameService = new MinaNFTNameServiceContract(this.nameService);
        this.tokenId = nameService.deriveTokenId();
    }
    /**
     * Load metadata from blockchain and IPFS/Arweave
     * @param metadataURI URI of the metadata. Obligatorily in case there is private metadata as private metadata cannot be fetched from IPFS/Arweave
     * @param skipCalculatingMetadataRoot Skip calculating metadata root in case metadataURI is not provided and NFT contains private data
     */
    async loadMetadata(metadataURI = undefined, skipCalculatingMetadataRoot = false) {
        if (this.address === undefined) {
            throw new Error("address is undefined");
            return;
        }
        if (this.nameService === undefined) {
            this.nameService = web.PublicKey.fromBase58(MINANFT_NAME_SERVICE);
        }
        const nameService = new MinaNFTNameServiceContract(this.nameService);
        const tokenId = nameService.deriveTokenId();
        const nft = new MinaNFTContract(this.address, tokenId);
        await fetchMinaAccount({ publicKey: this.address, tokenId });
        if (!web.Mina.hasAccount(this.address, tokenId)) {
            throw new Error("NFT is not deployed");
            return;
        }
        const name = nft.name.get();
        const storage = nft.storage.get();
        const owner = nft.owner.get();
        const escrow = nft.escrow.get();
        const metadata = nft.metadata.get();
        const version = nft.version.get();
        /*
          metadata: Map<string, PrivateMetadata>;
          +name: string;
          creator: string;
          +storage: string;
          +owner: Field;
          +escrow: Field;
          +version: UInt64;
          +isMinted: boolean;
          +address: PublicKey | undefined;
          +tokenId: Field | undefined;
          +nameService: PublicKey | undefined;
    
          +private updates: MetadataUpdate[];
          +private metadataRoot: Metadata;
        */
        const nameStr = MinaNFT.stringFromField(name);
        if (nameStr !== this.name)
            throw new Error("NFT name mismatch");
        const storageStr = MinaNFT.stringFromFields(Storage.toFields(storage));
        this.storage = storageStr;
        this.owner = owner;
        this.escrow = escrow;
        this.version = version;
        this.metadataRoot = metadata;
        this.isMinted = true;
        this.tokenId = tokenId;
        this.nameService = nameService.address;
        //try {
        if (storageStr.length < 2 ||
            (storageStr[0] !== "i" && storageStr[0] !== "a")) {
            throw new Error("Invalid storage string");
        }
        const uriURL = storageStr[0] === "i"
            ? "https://gateway.pinata.cloud/ipfs/" + storageStr.slice(2)
            : "https://arweave.net/" + storageStr.slice(2);
        const uri = metadataURI === undefined
            ? (await lib_axios.get(uriURL)).data
            : JSON.parse(metadataURI);
        //const image = data.data.properties.image;
        //console.log("IPFS uri:", JSON.stringify(uri, null, 2));
        //console.log("IPFS image:", image);
        this.creator = uri.creator ?? "";
        if (uri.name !== this.name)
            throw new Error("uri: NFT name mismatch");
        if (uri.version !== this.version.toString())
            throw new Error("uri: NFT version mismatch");
        if (uri.metadata.data !== this.metadataRoot.data.toJSON())
            throw new Error("uri: NFT metadata data mismatch");
        if (uri.metadata.kind !== this.metadataRoot.kind.toJSON())
            throw new Error("uri: NFT metadata kind mismatch");
        Object.entries(uri.properties).forEach(([key, value]) => {
            if (typeof key !== "string")
                throw new Error("uri: NFT metadata key mismatch - should be string");
            if (typeof value !== "object")
                throw new Error("uri: NFT metadata value mismatch - should be object");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const obj = value;
            const data = obj.data;
            const kind = obj.kind;
            const isPrivate = obj.isPrivate ?? false;
            if (data === undefined)
                throw new Error(`uri: NFT metadata: data should present: ${key} : ${value} kind: ${kind} daya: ${data} isPrivate: ${isPrivate}`);
            if (kind === undefined || typeof kind !== "string")
                throw new Error(`uri: NFT metadata: kind mismatch - should be string: ${key} : ${value}`);
            switch (kind) {
                case "text":
                    this.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: TextData.fromJSON(obj),
                    }));
                    break;
                case "string":
                    this.metadata.set(key, new PrivateMetadata({
                        data: MinaNFT.stringToField(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                    }));
                    break;
                case "file":
                    this.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: FileData.fromJSON(obj),
                    }));
                    break;
                case "image":
                    this.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: FileData.fromJSON(obj),
                    }));
                    break;
                case "map":
                    this.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: MapData.fromJSON(obj, skipCalculatingMetadataRoot),
                    }));
                    break;
                default:
                    this.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                    }));
                    break;
            }
        });
        /*
        } catch (error) {
          throw new Error(`IPFS uri import error: ${error}`);
        }
        */
        if (!(await this.checkState("load metadata")))
            throw new Error("State verification error after loading metadata");
        if (skipCalculatingMetadataRoot === false) {
            const { root } = this.getMetadataRootAndMap();
            if (root.data.toJSON() !== this.metadataRoot.data.toJSON())
                throw new Error("Metadata root data mismatch");
            if (root.kind.toJSON() !== this.metadataRoot.kind.toJSON())
                throw new Error("Metadata root kind mismatch");
        }
    }
    /**
     * Load metadata from blockchain and IPFS/Arweave
     * @param params arguments
     * @param params.metadataURI URI of the metadata. Obligatorily in case there is private metadata as private metadata cannot be fetched from IPFS/Arweave
     * @param params.nameServiceAddress Public key of the Name Service
     * @param params.skipCalculatingMetadataRoot Skip calculating metadata root
     * @returns MinaNFT object
     */
    static fromJSON(params) {
        const nameService = new MinaNFTNameServiceContract(params.nameServiceAddress);
        const tokenId = nameService.deriveTokenId();
        const skipCalculatingMetadataRoot = params.skipCalculatingMetadataRoot ?? false;
        const uri = JSON.parse(params.metadataURI);
        const nft = new MinaNFT({
            name: uri.name,
            nameService: params.nameServiceAddress,
            creator: uri.creator,
            owner: web.Field.fromJSON(uri.owner),
            address: web.PublicKey.fromBase58(uri.address),
        });
        nft.version = web.UInt64.from(uri.version);
        nft.metadataRoot = new Metadata({
            data: web.Field.fromJSON(uri.metadata.data),
            kind: web.Field.fromJSON(uri.metadata.kind),
        });
        nft.owner = web.Field.fromJSON(uri.owner);
        nft.escrow = web.Field.fromJSON(uri.escrow);
        nft.tokenId = tokenId;
        Object.entries(uri.properties).forEach(([key, value]) => {
            if (typeof key !== "string")
                throw new Error("uri: NFT metadata key mismatch - should be string");
            if (typeof value !== "object")
                throw new Error("uri: NFT metadata value mismatch - should be object");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const obj = value;
            const data = obj.data;
            const kind = obj.kind;
            const isPrivate = obj.isPrivate ?? false;
            if (data === undefined)
                throw new Error(`uri: NFT metadata: data should present: ${key} : ${value} kind: ${kind} data: ${data} isPrivate: ${isPrivate}`);
            if (kind === undefined || typeof kind !== "string")
                throw new Error(`uri: NFT metadata: kind mismatch - should be string: ${key} : ${value}`);
            switch (kind) {
                case "text":
                    nft.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: TextData.fromJSON(obj),
                    }));
                    break;
                case "string":
                    nft.metadata.set(key, new PrivateMetadata({
                        data: MinaNFT.stringToField(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                    }));
                    break;
                case "file":
                    nft.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: FileData.fromJSON(obj),
                    }));
                    break;
                case "image":
                    nft.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: FileData.fromJSON(obj),
                    }));
                    break;
                case "map":
                    nft.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: MapData.fromJSON(obj, skipCalculatingMetadataRoot),
                    }));
                    break;
                default:
                    nft.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: FileData.fromJSON(obj),
                    }));
                    break;
            }
        });
        return nft;
    }
    /**
     * Creates a Map from JSON
     * @param json json with map data
     * @returns map as JSON object
     */
    static mapFromJSON(json) {
        const map = new Map();
        Object.entries(json).forEach(([key, value]) => map.set(key, value));
        return map;
    }
    /**
     * Converts to JSON
     * @param params parameters
     * @param params.increaseVersion increase version by one
     * @param params.includePrivateData include private data
     * @returns JSON object
     */
    toJSON(params = {}) {
        const increaseVersion = params.increaseVersion ?? false;
        const includePrivateData = params.includePrivateData ?? false;
        let description = undefined;
        const descriptionObject = this.getMetadata("description");
        if (descriptionObject !== undefined &&
            descriptionObject.linkedObject !== undefined &&
            descriptionObject.linkedObject instanceof TextData)
            description = descriptionObject.linkedObject.text;
        let image = undefined;
        const imageObject = this.getMetadata("image");
        if (imageObject !== undefined &&
            imageObject.linkedObject !== undefined &&
            imageObject.linkedObject instanceof FileData &&
            imageObject.linkedObject.storage !== undefined &&
            imageObject.linkedObject.storage.length > 2)
            image =
                imageObject.linkedObject.storage[0] === "i"
                    ? "https://gateway.pinata.cloud/ipfs/" +
                        imageObject.linkedObject.storage.slice(2)
                    : "https://arweave.net/" + imageObject.linkedObject.storage.slice(2);
        const { root } = this.getMetadataRootAndMap();
        const version = increaseVersion
            ? this.version.add(web.UInt64.from(1)).toJSON()
            : this.version.toJSON();
        const json = {
            name: this.name,
            description: description ?? "",
            image,
            external_url: "https://minanft.io/" + this.name,
            version,
            time: Date.now(),
            creator: this.creator,
            address: this.address.toBase58(),
            owner: this.owner.toJSON(),
            escrow: this.escrow.toJSON(),
            metadata: { data: root.data.toJSON(), kind: root.kind.toJSON() },
            properties: Object.fromEntries(this.metadata),
        };
        return includePrivateData
            ? JSON.parse(JSON.stringify(json))
            : JSON.parse(JSON.stringify(json, (_, value) => value?.isPrivate === true ? undefined : value));
    }
    /**
     * Initialize Mina o1js library
     * @param chain blockchain to initialize
     */
    static async minaInit(chain) {
        return await initBlockchain(chain);
    }
    /**
     * Get current Mina network fee
     * @returns current Mina network fee
     */
    static async fee() {
        if (web.Mina.getNetworkId() === "mainnet")
            return web.UInt64.from(MINAFEE);
        else
            return web.UInt64.from(MINAFEE * 2);
    }
    /**
     * updates Metadata
     * @param key key to update
     * @param value value to update
     */
    updateMetadata(key, value) {
        if (this.isMinted) {
            const update = this.updateMetadataMap(key, value);
            this.updates.push(update);
        }
        else
            this.metadata.set(key, value);
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTStringUpdate} update data
     */
    update(data) {
        this.updateMetadata(data.key, new PrivateMetadata({
            data: MinaNFT.stringToField(data.value),
            kind: MinaNFT.stringToField(data.kind ?? "string"),
            isPrivate: data.isPrivate ?? false,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTTextUpdate} update data
     */
    updateText(data) {
        const text = new TextData(data.text);
        this.updateMetadata(data.key, new PrivateMetadata({
            data: text.root,
            kind: MinaNFT.stringToField("text"),
            isPrivate: data.isPrivate ?? false,
            linkedObject: text,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTTextUpdate} update data
     */
    updateMap(data) {
        data.map.setRoot();
        this.updateMetadata(data.key, new PrivateMetadata({
            data: data.map.root,
            kind: MinaNFT.stringToField("map"),
            isPrivate: data.isPrivate ?? false,
            linkedObject: data.map,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param params arguments
     * @param params.key key to update
     * @param params.type type of metadata ('file' or 'image' for example)
     * @param params.data {@link FileData} file data
     * @param params.isPrivate is metadata private
     */
    updateFileData(params) {
        const { key, type, data, isPrivate } = params;
        this.updateMetadata(key, new PrivateMetadata({
            data: data.root,
            kind: MinaNFT.stringToField(type ?? "file"),
            isPrivate: isPrivate ?? false,
            linkedObject: data,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTFieldUpdate} update data
     */
    updateField(data) {
        this.updateMetadata(data.key, {
            data: data.value,
            kind: MinaNFT.stringToField(data.kind ?? "string"),
            isPrivate: data.isPrivate ?? false,
        });
    }
    /**
     * Checks that on-chain state is equal to off-chain state
     * @param info additional info for logging
     * @returns true if on-chain state is equal to off-chain state
     */
    async checkState(info = "") {
        //console.log("Checking state for", this.name, "at", info);
        if (this.address === undefined)
            throw new Error("NFT contract is not deployed");
        if (this.nameService === undefined)
            throw new Error("Names contract address is undefined");
        const address = this.address;
        const nameService = new MinaNFTNameServiceContract(this.nameService);
        const tokenId = nameService.deriveTokenId();
        await fetchMinaAccount({ publicKey: address, tokenId });
        if (!web.Mina.hasAccount(address, tokenId)) {
            console.error("NFT contract is not deployed");
            return false;
        }
        const zkApp = new MinaNFTContract(address, tokenId);
        let result = true;
        const version = zkApp.version.get();
        //console.log("Version:", this.name, info, version.toString());
        if (version.toBigInt().valueOf() !== this.version.toBigInt().valueOf()) {
            console.error("Version mismatch");
            result = false;
        }
        //console.log("After version:", this.name, info, version.toString());
        const oldEscrow = zkApp.escrow.get();
        if (oldEscrow.toBigInt().valueOf() !== this.escrow.toBigInt().valueOf()) {
            console.error("Escrow mismatch");
            result = false;
        }
        const oldOwner = zkApp.owner.get();
        if (oldOwner.toBigInt().valueOf() !== this.owner.toBigInt().valueOf()) {
            console.error("Owner mismatch");
            result = false;
        }
        const oldMetadata = zkApp.metadata.get();
        if (oldMetadata.data.toBigInt().valueOf() !==
            this.metadataRoot.data.toBigInt().valueOf()) {
            console.error("Metadata data mismatch");
            result = false;
        }
        if (oldMetadata.kind.toBigInt().valueOf() !==
            this.metadataRoot.kind.toBigInt().valueOf()) {
            console.error("Metadata kind mismatch");
            result = false;
        }
        const oldStorage = zkApp.storage.get();
        const storage = MinaNFT.stringFromFields(Storage.toFields(oldStorage));
        if (this.storage !== storage) {
            throw new Error("Storage mismatch");
        }
        const name = zkApp.name.get();
        if (MinaNFT.stringFromField(name) !== this.name) {
            console.error("Name mismatch");
            result = false;
        }
        if (result === false)
            console.error("State verification error for", this.name, "at", info);
        return result;
    }
    /**
     * Commit updates of the MinaNFT to blockchain
     * Generates recursive proofs for all updates,
     * than verify the proof locally and send the transaction to the blockchain
     *
     * @param commitData {@link MinaNFTCommit} commit data
     */
    async commit(commitData) {
        const { deployer, ownerPrivateKey, pinataJWT, arweaveKey, nameService, nonce: nonceArg, } = commitData;
        if (this.address === undefined) {
            console.error("NFT contract is not deployed");
            return undefined;
        }
        const address = this.address;
        if (this.updates.length === 0) {
            console.error("No updates to commit");
            return undefined;
        }
        if (this.isMinted === false) {
            console.error("NFT is not minted");
            return undefined;
        }
        if (nameService === undefined)
            throw new Error("Names Service is undefined");
        if (nameService.address === undefined)
            throw new Error("Names service address is undefined");
        /*
        const proof: MinaNFTMetadataUpdateProof | undefined =
          await this.generateProof();
        if (proof === undefined) {
          console.error("Proof generation error");
          return undefined;
        }
        */
        if (MinaNFT.updateVerificationKey === undefined) {
            console.error("Update verification key is undefined");
            return undefined;
        }
        //console.log("Creating proofs...");
        const logMsg = `Update proofs created for ${this.name} version ${this.version.toString()}`;
        console.time(logMsg);
        let proofs = [];
        for (const update of this.updates) {
            await sleep(100); // alow GC to run
            let state = MetadataTransition.create(update);
            let proof = await MinaNFTMetadataUpdate.update(state, update);
            proofs.push(proof);
            state = null;
            proof = null;
        }
        //console.log("Merging proofs...");
        let proof = proofs[0];
        for (let i = 1; i < proofs.length; i++) {
            await sleep(100); // alow GC to run
            let state = MetadataTransition.merge(proof.publicInput, proofs[i].publicInput);
            let mergedProof = await MinaNFTMetadataUpdate.merge(state, proof, proofs[i]);
            proof = mergedProof;
            state = null;
            mergedProof = null;
        }
        proofs = [];
        //console.time("Update proof verified");
        const verificationResult = await (0,web.verify)(proof.toJSON(), MinaNFT.updateVerificationKey);
        //console.timeEnd("Update proof verified");
        console.timeEnd(logMsg);
        //console.log("Proof verification result:", verificationResult);
        if (verificationResult === false) {
            throw new Error("Proof verification error");
        }
        const storage = await this.pinToStorage(pinataJWT, arweaveKey);
        if (storage === undefined) {
            throw new Error("IPFS Storage error");
        }
        const storageHash = storage.hash;
        if (false === (await this.checkState("commit"))) {
            throw new Error("State verification error");
        }
        //console.log("Commiting updates to blockchain...");
        const sender = deployer.toPublicKey();
        const zkApp = new MinaNFTNameServiceContract(nameService.address);
        const tokenId = zkApp.deriveTokenId();
        await fetchMinaAccount({ publicKey: nameService.address, force: true });
        const zkAppNFT = new MinaNFTContract(address, tokenId);
        await fetchMinaAccount({ publicKey: this.address, tokenId });
        await fetchMinaAccount({ publicKey: sender });
        const hasAccount = web.Mina.hasAccount(this.address, tokenId);
        if (!hasAccount)
            throw new Error("NFT is not deployed, no account");
        const account = web.Mina.getAccount(sender);
        const nonce = nonceArg ?? Number(account.nonce.toBigint());
        const version = zkAppNFT.version.get();
        const newVersion = version.add(web.UInt64.from(1));
        const oldOwner = zkAppNFT.owner.get();
        const ownerPublicKey = ownerPrivateKey.toPublicKey();
        const owner = web.Poseidon.hash(ownerPublicKey.toFields());
        if (oldOwner.equals(owner).toBoolean() === false) {
            throw new Error("Owner privateKey mismatch");
        }
        const update = new Update({
            oldRoot: proof.publicInput.oldRoot,
            newRoot: proof.publicInput.newRoot,
            storage: storageHash,
            verifier: nameService.address,
            version: newVersion,
            name: MinaNFT.stringToField(this.name),
            owner,
        });
        const signature = web.Signature.create(ownerPrivateKey, Update.toFields(update));
        //console.log("Sending update...");
        const tx = await web.Mina.transaction({ sender, fee: await MinaNFT.fee(), memo: "minanft.io", nonce }, async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await zkApp.update(address, update, signature, ownerPublicKey, proof);
        });
        let sentTx = undefined;
        try {
            await sleep(100); // alow GC to run
            await tx.prove();
            tx.sign([deployer]);
            console.time("Update transaction sent");
            sentTx = await tx.send();
            console.timeEnd("Update transaction sent");
        }
        catch (error) {
            throw new Error("Prooving error");
        }
        if (sentTx === undefined) {
            throw new Error("Transaction error");
        }
        await MinaNFT.transactionInfo(sentTx, "update", false);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const newRoot = proof.publicInput.newRoot;
        proof = null;
        if (sentTx.status === "pending") {
            this.metadataRoot = newRoot;
            this.updates = [];
            this.version = newVersion;
            this.storage = storage.hashStr;
            return sentTx;
        }
        else
            return undefined;
    }
    /**
     * Prepare commit updates of the MinaNFT to blockchain
     *
     * @param commitData {@link MinaNFTPrepareCommit} commit data
     */
    async prepareCommitData(commitData) {
        const { ownerPrivateKey, ownerPublicKey, nameServiceAddress, pinataJWT, arweaveKey, } = commitData;
        if (this.address === undefined) {
            console.error("NFT contract is not deployed");
            return undefined;
        }
        const address = this.address;
        if (this.updates.length === 0) {
            console.error("No updates to commit");
            return undefined;
        }
        if (this.isMinted === false) {
            console.error("NFT is not minted");
            return undefined;
        }
        const transactions = [];
        for (const update of this.updates) {
            const state = MetadataTransition.create(update);
            transactions.push({ state, update });
        }
        //console.log("Merging states...");
        let mergedState = transactions[0].state;
        for (let i = 1; i < transactions.length; i++) {
            const state = MetadataTransition.merge(mergedState, transactions[i].state);
            mergedState = state;
        }
        const storage = await this.pinToStorage(pinataJWT, arweaveKey);
        if (storage === undefined) {
            throw new Error("Storage error");
        }
        const storageHash = storage.hash;
        if (false === (await this.checkState("commit"))) {
            throw new Error("State verification error");
        }
        const newVersion = this.version.add(web.UInt64.from(1));
        const owner = web.Poseidon.hash(ownerPublicKey.toFields());
        const update = new Update({
            oldRoot: mergedState.oldRoot,
            newRoot: mergedState.newRoot,
            storage: storageHash,
            verifier: nameServiceAddress,
            version: newVersion,
            name: MinaNFT.stringToField(this.name),
            owner,
        });
        let signatureStr = "";
        if (ownerPrivateKey !== undefined) {
            if (ownerPrivateKey.toPublicKey().toBase58() !== ownerPublicKey.toBase58())
                throw new Error("Owner privateKey mismatch");
            const signature = web.Signature.create(ownerPrivateKey, Update.toFields(update));
            signatureStr = signature.toBase58();
        }
        const transactionsStr = transactions.map((t) => JSON.stringify({
            state: MetadataTransition.toFields(t.state).map((f) => f.toJSON()),
            update: MetadataUpdate.toFields(t.update).map((f) => f.toJSON()),
        }));
        const updateStr = JSON.stringify({
            update: Update.toFields(update).map((f) => f.toJSON()),
        });
        const addressStr = address.toBase58();
        return {
            signature: signatureStr,
            update: updateStr,
            transactions: transactionsStr,
            address: addressStr,
        };
    }
    /**
     * Commit updates of the MinaNFT to blockchain using prepared data
     * Generates recursive proofs for all updates,
     * than verify the proof locally and send the transaction to the blockchain
     *
     * @param commitData {@link MinaNFTCommit} commit data
     */
    static async commitPreparedData(commitData) {
        const { deployer, preparedCommitData, nameService, ownerPublicKey: ownerPublicKeyStr, nonce: nonceArg, } = commitData;
        const { address: addressStr, signature: signatureStr, update: updateStr, transactions: transactionsStr, } = preparedCommitData;
        if (nameService.address === undefined)
            throw new Error("Names service address is undefined");
        const transactions = transactionsStr.map((t) => {
            const obj = JSON.parse(t);
            const state = MetadataTransition.fromFields(obj.state.map((f) => web.Field.fromJSON(f)));
            const update = MetadataUpdate.fromFields(obj.update.map((f) => web.Field.fromJSON(f)));
            return { state, update };
        });
        const address = web.PublicKey.fromBase58(addressStr);
        const ownerPublicKey = web.PublicKey.fromBase58(ownerPublicKeyStr);
        const signature = web.Signature.fromBase58(signatureStr);
        const update = Update.fromFields(JSON.parse(updateStr).update.map((f) => web.Field.fromJSON(f)));
        if (MinaNFT.updateVerificationKey === undefined) {
            console.error("Update verification key is undefined");
            return undefined;
        }
        console.log("Creating proofs...");
        const logMsg = `Update proofs created`;
        console.time(logMsg);
        let proofs = [];
        for (const transaction of transactions) {
            await sleep(100); // alow GC to run
            const proof = await MinaNFTMetadataUpdate.update(transaction.state, transaction.update);
            proofs.push(proof);
        }
        console.log("Merging proofs...");
        let proof = proofs[0];
        for (let i = 1; i < proofs.length; i++) {
            await sleep(100); // alow GC to run
            const state = MetadataTransition.merge(proof.publicInput, proofs[i].publicInput);
            const mergedProof = await MinaNFTMetadataUpdate.merge(state, proof, proofs[i]);
            proof = mergedProof;
        }
        proofs = [];
        console.time("Update proof verified");
        const verificationResult = await (0,web.verify)(proof.toJSON(), MinaNFT.updateVerificationKey);
        console.timeEnd("Update proof verified");
        console.timeEnd(logMsg);
        console.log("Proof verification result:", verificationResult);
        if (verificationResult === false) {
            throw new Error("Proof verification error");
        }
        console.log("Commiting updates to blockchain...");
        const sender = deployer.toPublicKey();
        const zkApp = new MinaNFTNameServiceContract(nameService.address);
        const tokenId = zkApp.deriveTokenId();
        await fetchMinaAccount({ publicKey: nameService.address, force: true });
        await fetchMinaAccount({ publicKey: address, tokenId });
        await fetchMinaAccount({ publicKey: sender });
        const hasAccount = web.Mina.hasAccount(address, tokenId);
        if (!hasAccount)
            throw new Error("NFT is not deployed, no account");
        const account = web.Mina.getAccount(sender);
        const nonce = nonceArg ?? Number(account.nonce.toBigint());
        //console.log("Sending update...");
        const tx = await web.Mina.transaction({ sender, fee: await MinaNFT.fee(), memo: "minanft.io", nonce }, async () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await zkApp.update(address, update, signature, ownerPublicKey, proof);
        });
        let sentTx = undefined;
        try {
            await sleep(100); // alow GC to run
            await tx.prove();
            tx.sign([deployer]);
            console.time("Update transaction sent");
            sentTx = await tx.send();
            console.timeEnd("Update transaction sent");
        }
        catch (error) {
            throw new Error("Prooving error");
        }
        if (sentTx === undefined) {
            throw new Error("Transaction error");
        }
        await MinaNFT.transactionInfo(sentTx, "update", false);
        if (sentTx.status === "pending") {
            return sentTx;
        }
        else
            return undefined;
    }
    /*
    private async generateProof(): Promise<
      MinaNFTMetadataUpdateProof | undefined
    > {
      if (MinaNFT.updateVerificationKey === undefined) {
        console.error("Update verification key is undefined");
        return undefined;
      }
  
      //console.log("Creating proofs...");
      console.time("Update proofs created");
      const proofs: MinaNFTMetadataUpdateProof[] = [];
      for (const update of this.updates) {
        const state = MetadataTransition.create(update);
        const proof = await MinaNFTMetadataUpdate.update(state, update);
        proofs.push(proof);
      }
  
      //console.log("Merging proofs...");
      let proof: MinaNFTMetadataUpdateProof = proofs[0];
      for (let i = 1; i < proofs.length; i++) {
        const state = MetadataTransition.merge(
          proof.publicInput,
          proofs[i].publicInput
        );
        const mergedProof = await MinaNFTMetadataUpdate.merge(
          state,
          proof,
          proofs[i]
        );
        proof = mergedProof;
      }
  
      const verificationResult: boolean = await verify(
        proof.toJSON(),
        MinaNFT.updateVerificationKey
      );
      console.timeEnd("Update proofs created");
      //console.log("Proof verification result:", verificationResult);
      if (verificationResult === false) {
        throw new Error("Proof verification error");
        return undefined;
      }
      return proof;
    }
  */
    /**
     * Pins NFT to IPFS or Arweave
     * @param pinataJWT Pinata JWT
     * @param arweaveKey Arweave key
     * @returns NFT's storage hash and hash string
     */
    async pinToStorage(pinataJWT, arweaveKey) {
        if (pinataJWT === undefined && arweaveKey === undefined) {
            throw new Error("No storage service key provided. Provide pinateJWT or arweaveKey");
        }
        if (pinataJWT !== undefined) {
            console.log("Pinning to IPFS...");
            const ipfs = new IPFS(pinataJWT);
            let hash = await ipfs.pinJSON({
                data: this.toJSON({
                    increaseVersion: true,
                    includePrivateData: false,
                }),
                name: this.name + ".json",
                keyvalues: { project: "MinaNFT", type: "metadata", nft: this.name },
            });
            if (hash === undefined) {
                console.error("Pinning to IPFS failed. Retrying...");
                await sleep(10000);
                hash = await ipfs.pinJSON({
                    data: this.toJSON({
                        increaseVersion: true,
                        includePrivateData: false,
                    }),
                    name: this.name + ".json",
                    keyvalues: { project: "MinaNFT", type: "metadata", nft: this.name },
                });
            }
            if (hash === undefined) {
                console.error("Pinning to IPFS failed");
                return undefined;
            }
            const hashStr = "i:" + hash;
            const ipfs_fields = MinaNFT.stringToFields(hashStr);
            if (ipfs_fields.length !== 2)
                throw new Error("IPFS hash encoding error");
            return {
                hash: new Storage({ hashString: ipfs_fields }),
                hashStr,
            };
        }
        else if (arweaveKey !== undefined) {
            console.log("Pinning to Arweave...");
            const arweave = new ARWEAVE(arweaveKey);
            const hash = await arweave.pinString(JSON.stringify(this.toJSON({
                increaseVersion: true,
                includePrivateData: false,
            }), null, 2));
            if (hash === undefined)
                return undefined;
            const hashStr = "a:" + hash;
            const arweave_fields = MinaNFT.stringToFields(hashStr);
            if (arweave_fields.length !== 2)
                throw new Error("Arweave hash encoding error");
            return {
                hash: new Storage({ hashString: arweave_fields }),
                hashStr,
            };
        }
        else
            return undefined;
    }
    /*
  
    public async getPrivateJson(): Promise<Object | undefined> {
      if (!this.publicAttributes.get("name") || !this.publicAttributes.get("image"))
        return undefined;
      const publicAttributes: MerkleMap = new MerkleMap();
      Object.keys(this.publicAttributes).map((key) => {
        const value = this.publicAttributes.get(key);
        if (value)
          publicAttributes.set(
            MinaNFT.stringToField(key),
            MinaNFT.stringToField(value)
          );
        else {
          console.error("Map error");
          return undefined;
        }
      });
      const publicMapRoot: string = publicAttributes.getRoot().toJSON();
  
      const privateAttributes: MerkleMap = new MerkleMap();
      Object.keys(this.privateAttributes).map((key) => {
        const value = this.publicAttributes.get(key);
        if (value)
          privateAttributes.set(
            MinaNFT.stringToField(key),
            MinaNFT.stringToField(value)
          );
        else {
          console.error("Map error");
          return undefined;
        }
      });
      const privateMapRoot: string = privateAttributes.getRoot().toJSON();
  
      return {
        publicMapRoot,
        privateMapRoot,
        secret: this.secret ? this.secret.toJSON() : "",
        salt: this.salt ? this.salt.toJSON() : "",
        publicAttributes: MinaNFT.mapToJSON(this.publicAttributes),
        privateAttributes: MinaNFT.mapToJSON(this.privateAttributes),
      };
    }
    */
    /**
     * Logs transaction info
     * @param tx transaction
     * @param description description
     * @param wait wait for transaction to be included in the block
     */
    static async transactionInfo(tx, description = "", wait = true) {
        if (tx.status === "rejected") {
            console.error("Transaction failed");
            return;
        }
        try {
            web.Mina.getNetworkState();
        }
        catch (error) {
            // We're on Berkeley or TestWorld2
            const hash = tx.hash;
            if (hash === undefined) {
                throw new Error("Transaction hash is undefined");
                return;
            }
            console.log(`MinaNFT ${description} transaction sent: ${hash}`);
            if (wait) {
                try {
                    //console.log("Waiting for transaction...");
                    console.time("Transaction time");
                    await tx.wait({ maxAttempts: 120, interval: 30 * 1000 }); //one hour
                    console.timeEnd("Transaction time");
                }
                catch (error) {
                    console.log("Error waiting for transaction", error);
                }
            }
        }
    }
    /*
     * Wait for transaction to be included in the block
     * @param tx transaction
     */
    static async wait(tx) {
        /*
        try {
          Mina.getNetworkState();
        } catch (error) {
          // We're on Berkeley
          */
        try {
            //console.log("Waiting for transaction...");
            console.time("Transaction wait time");
            await tx.wait({ maxAttempts: 120, interval: 30 * 1000 }); //one hour
            console.timeEnd("Transaction wait time");
            return true;
        }
        catch (error) {
            console.log("Error waiting for transaction", error);
            return false;
        }
        //}
        //return true;
    }
    /**
     * Mints an NFT. Deploys and compiles the MinaNFT contract if needed.
     * @param minaData {@link MinaNFTMint} mint data
     * @param skipCalculatingMetadataRoot skip calculating metadata root in case the NFT is imported from the JSON that do not contains private metadata and therefore the root cannot be calculated
     */
    async mint(minaData, skipCalculatingMetadataRoot = false) {
        const { nameService: nameServiceArg, deployer, owner: ownerArg, pinataJWT, arweaveKey, privateKey, escrow: escrowArg, nonce: nonceArg, signature: signatureArg, } = minaData;
        const nameService = nameServiceArg ??
            new MinaNFTNameService({
                address: web.PublicKey.fromBase58(MINANFT_NAME_SERVICE),
            });
        const escrow = escrowArg ?? (0,web.Field)(0);
        const owner = ownerArg ?? this.owner;
        if (owner.toJSON() === (0,web.Field)(0).toJSON())
            throw new Error("Owner is not defined");
        if (nameService.address === undefined)
            throw new Error("Names service address is undefined");
        await MinaNFT.compile();
        if (MinaNFT.verificationKey === undefined)
            throw new Error("Compilation error");
        const verificationKey = MinaNFT.verificationKey;
        //console.log("Minting NFT...");
        const sender = deployer.toPublicKey();
        const zkAppPrivateKey = privateKey ?? web.PrivateKey.random();
        this.address = zkAppPrivateKey.toPublicKey();
        console.log("Deploying NFT to address", this.address.toBase58());
        //const zkApp = new MinaNFTContract(this.address);
        const root = skipCalculatingMetadataRoot
            ? this.metadataRoot
            : this.getMetadataRootAndMap().root;
        const storage = await this.pinToStorage(pinataJWT, arweaveKey);
        if (storage === undefined) {
            console.error("IPFS/Arweave Storage error");
            return undefined;
        }
        const storageHash = storage.hash;
        //const url = "https://minanft.io/" + this.name;
        const name = MinaNFT.stringToField(this.name);
        /*
            class MinaNFTContract extends SmartContract {
                  @state(Field) name = State<Field>();
                  @state(Metadata) metadata = State<Metadata>();
                  @state(Storage) storage = State<Storage>();
                  @state(Field) owner = State<Field>();
                  @state(Field) escrow = State<Field>();
                  @state(UInt64) version = State<UInt64>();
        */
        const nft = new NFTMintData({
            name,
            address: this.address,
            initialState: [
                name,
                root.data, // metadata.data,
                root.kind, // metadata.kind,
                storageHash.hashString[0],
                storageHash.hashString[1],
                owner,
                escrow,
                web.Field.from(1), //version
            ],
            verifier: nameService.address,
        });
        const signature = signatureArg ??
            (await nameService.issueNameSignature(nft, verificationKey.hash));
        const mintData = new MintData({
            nft,
            verificationKey,
            signature,
        });
        const zkApp = new MinaNFTNameServiceContract(nameService.address);
        const tokenId = zkApp.deriveTokenId();
        this.tokenId = tokenId;
        await fetchMinaAccount({ publicKey: nameService.address, force: true });
        //await fetchMinaAccount({ publicKey: this.address, tokenId });
        await fetchMinaAccount({ publicKey: sender, force: true });
        const account = web.Mina.getAccount(sender);
        const nonce = nonceArg ?? Number(account.nonce.toBigint());
        const hasAccount = web.Mina.hasAccount(this.address, tokenId);
        const transaction = await web.Mina.transaction({ sender, fee: await MinaNFT.fee(), memo: "minanft.io", nonce }, async () => {
            if (!hasAccount)
                web.AccountUpdate.fundNewAccount(sender);
            await zkApp.mint(mintData);
        });
        await sleep(100); // alow GC to run
        await transaction.prove();
        transaction.sign([deployer, zkAppPrivateKey]);
        const sentTx = await transaction.send();
        await MinaNFT.transactionInfo(sentTx, "mint", false);
        if (sentTx.status === "pending") {
            this.isMinted = true;
            this.metadataRoot = root;
            this.storage = storage.hashStr;
            this.owner = owner;
            this.escrow = escrow;
            this.version = web.UInt64.from(1);
            this.nameService = nameService.address;
            return sentTx;
        }
        else
            return undefined;
        /*
        await sleep(10 * 1000);
    
        // Check that the contract is deployed correctly
        await fetchMinaAccount({ publicKey: this.address });
    
        const newName = zkApp.name.get();
        if (newName.toJSON() !== MinaNFT.stringToField(this.name).toJSON())
          throw new Error("Wrong name");
    
        const newMetadataRoot = zkApp.metadata.get();
        if (
          newMetadataRoot.data.toJSON() !== root.data.toJSON() ||
          newMetadataRoot.kind.toJSON() !== root.kind.toJSON()
        )
          throw new Error("Wrong metadata");
    
        const newStorage = zkApp.storage.get();
        if (newStorage.toJSON() !== storageHash.toJSON())
          throw new Error("Wrong storage");
    
        const newOwner = zkApp.owner.get();
        if (newOwner.toJSON() !== owner.toJSON()) throw new Error("Wrong owner");
    
        const newVersion = zkApp.version.get();
        if (newVersion.toJSON() !== UInt64.from(0).toJSON())
          throw new Error("Wrong version");
    
        const newEscrow = zkApp.escrow.get();
        if (newEscrow.toJSON() !== Field(0).toJSON())
          throw new Error("Wrong escrow");
       */
    }
    /**
     * Transfer the NFT. Compiles the contract if needed.
     * @param transferData {@link MinaNFTTransfer} transfer data
     */
    async transfer(transferData) {
        const { deployer, data, signature1, signature2, signature3, escrow1, escrow2, escrow3, nameService, nonce: nonceArg, } = transferData;
        if (this.address === undefined) {
            throw new Error("NFT contract is not deployed");
            return;
        }
        const address = this.address;
        if (this.isMinted === false) {
            throw new Error("NFT is not minted");
            return undefined;
        }
        if (nameService === undefined)
            throw new Error("Names service is undefined");
        if (nameService.address === undefined)
            throw new Error("Names service address is undefined");
        await MinaNFT.compile();
        if (MinaNFT.verificationKey === undefined) {
            throw new Error("Compilation error");
            return undefined;
        }
        //console.log("Transferring NFT...");
        this.nameService = nameService.address;
        if (false === (await this.checkState("transfer"))) {
            throw new Error("State verification error");
        }
        const sender = deployer.toPublicKey();
        const zkApp = new MinaNFTNameServiceContract(nameService.address);
        const tokenId = zkApp.deriveTokenId();
        await fetchMinaAccount({ publicKey: sender });
        await fetchMinaAccount({ publicKey: address, tokenId });
        const account = web.Mina.getAccount(sender);
        const nonce = nonceArg ?? Number(account.nonce.toBigint());
        if (!web.Mina.hasAccount(address, tokenId))
            throw new Error("NFT is not deployed, no account exists");
        const tx = await web.Mina.transaction({ sender, fee: await MinaNFT.fee(), memo: "minanft.io", nonce }, async () => {
            await zkApp.escrowTransfer(address, data, signature1, signature2, signature3, escrow1, escrow2, escrow3);
        });
        await sleep(100); // alow GC to run
        await tx.prove();
        tx.sign([deployer]);
        const txSent = await tx.send();
        await MinaNFT.transactionInfo(txSent, "transfer", false);
        if (txSent.status === "pending") {
            this.owner = data.newOwner;
            this.escrow = (0,web.Field)(0);
            this.version = this.version.add(web.UInt64.from(1));
            return txSent;
        }
        else
            return undefined;
    }
    /**
     * Approve the escrow for the NFT. Compiles the contract if needed.
     * @param approvalData {@link MinaNFTApproval} approval data
     */
    async approve(approvalData) {
        const { deployer, data, signature, ownerPublicKey, nameService, nonce: nonceArg, } = approvalData;
        if (this.address === undefined) {
            throw new Error("NFT contract is not deployed");
        }
        const address = this.address;
        if (this.isMinted === false) {
            throw new Error("NFT is not minted");
        }
        if (nameService === undefined)
            throw new Error("Names service is undefined");
        if (nameService.address === undefined)
            throw new Error("Names service address is undefined");
        await MinaNFT.compile();
        if (MinaNFT.verificationKey === undefined) {
            throw new Error("Compilation error");
        }
        this.nameService = nameService.address;
        if (false === (await this.checkState("approve"))) {
            throw new Error("State verification error");
        }
        const sender = deployer.toPublicKey();
        const zkApp = new MinaNFTNameServiceContract(nameService.address);
        const tokenId = zkApp.deriveTokenId();
        console.time("Calculated approval proof");
        const proof = await EscrowTransferVerification.check(new EscrowTransferApproval({
            approval: data,
            owner: web.Poseidon.hash(ownerPublicKey.toFields()),
        }), signature, ownerPublicKey);
        console.timeEnd("Calculated approval proof");
        await fetchMinaAccount({ publicKey: nameService.address, force: true });
        await fetchMinaAccount({ publicKey: address, tokenId });
        await fetchMinaAccount({ publicKey: sender });
        const account = web.Mina.getAccount(sender);
        const nonce = nonceArg ?? Number(account.nonce.toBigint());
        const tx = await web.Mina.transaction({ sender, fee: await MinaNFT.fee(), memo: "minanft.io", nonce }, async () => {
            await zkApp.approveEscrow(address, proof);
        });
        await sleep(100); // alow GC to run
        await tx.prove();
        tx.sign([deployer]);
        const txSent = await tx.send();
        await MinaNFT.transactionInfo(txSent, "approve", false);
        if (txSent.status === "pending") {
            this.escrow = data.escrow;
            this.version = this.version.add(web.UInt64.from(1));
            return txSent;
        }
        else
            return undefined;
    }
    /**
     * Verify Redacted MinaNFT proof
     * @param params arguments
     * @param params.deployer Private key of the account that will commit the updates
     * @param params.verifier Public key of the Verifier contract that will verify the proof
     * @param params.nft Public key of the NFT contract
     * @param params.nameServiceAddress Public key of the Name Service contract
     * @param params.proof Redacted MinaNFT proof
     */
    static async verify(params) {
        const { deployer, verifier, nft, nameServiceAddress, proof } = params;
        const address = nft;
        await MinaNFT.compileVerifier();
        console.log("Verifying the proof...");
        const sender = deployer.toPublicKey();
        await fetchMinaAccount({ publicKey: sender });
        await fetchMinaAccount({ publicKey: address });
        const zkApp = new MinaNFTVerifier(verifier);
        const zkAppNFT = new MinaNFTNameServiceContract(nameServiceAddress);
        const tokenId = zkAppNFT.deriveTokenId();
        const tx = await web.Mina.transaction({ sender, fee: await MinaNFT.fee(), memo: "minanft.io" }, async () => {
            await zkApp.verifyRedactedMetadata(address, tokenId, proof);
        });
        await sleep(100); // alow GC to run
        await tx.prove();
        tx.sign([deployer]);
        const res = await tx.send();
        await MinaNFT.transactionInfo(res, "verify", false);
        return res;
    }
}
//# sourceMappingURL=minanft.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/redactedminanft.js









class RedactedMinaNFT extends BaseMinaNFT {
    constructor(nft) {
        super();
        this.nft = nft;
    }
    /**
     * copy public attribute
     * @param key key of the attribute
     */
    copyMetadata(key) {
        const value = this.nft.getMetadata(key);
        if (value)
            this.metadata.set(key, value);
        else
            throw new Error("Map error");
    }
    /**
     *
     * @returns proof
     */
    async proof(
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    verbose = false) {
        await MinaNFT.compileRedactedMap();
        //console.log("Creating proof for redacted maps...");
        const { root, map } = this.getMetadataRootAndMap();
        const { root: originalRoot, map: originalMap } = this.nft.getMetadataRootAndMap();
        const elements = [];
        let originalWitnesses = [];
        let redactedWitnesses = [];
        this.metadata.forEach((value, key) => {
            const keyField = MinaNFT.stringToField(key);
            const redactedWitness = map.getWitness(keyField);
            const originalWitness = originalMap.getWitness(keyField);
            const element = new MapElement({
                originalRoot: originalRoot,
                redactedRoot: root,
                key: keyField,
                value: new Metadata({ data: value.data, kind: value.kind }),
            });
            elements.push(element);
            originalWitnesses.push(originalWitness);
            redactedWitnesses.push(redactedWitness);
        });
        let proofs = [];
        for (let i = 0; i < elements.length; i++) {
            await sleep(100); // alow GC to run
            const state = RedactedMinaNFTMapState.create(elements[i], originalWitnesses[i], redactedWitnesses[i]);
            const proof = await RedactedMinaNFTMapCalculation.create(state, elements[i], originalWitnesses[i], redactedWitnesses[i]);
            proofs.push(proof);
            if (verbose)
                Memory.info(`Proof ${i + 1}/${elements.length} created`);
        }
        originalWitnesses = [];
        redactedWitnesses = [];
        //console.log("Merging redacted proofs...");
        let proof = proofs[0];
        for (let i = 1; i < proofs.length; i++) {
            await sleep(100); // alow GC to run
            const state = RedactedMinaNFTMapState.merge(proof.publicInput, proofs[i].publicInput);
            let mergedProof = await RedactedMinaNFTMapCalculation.merge(state, proof, proofs[i]);
            proof = mergedProof;
            mergedProof = null;
            if (verbose)
                Memory.info(`Proof ${i}/${proofs.length - 1} merged`);
        }
        proofs = [];
        if (MinaNFT.redactedMapVerificationKey === undefined) {
            throw new Error("Redacted map verification key is missing");
        }
        const verificationResult = await (0,web.verify)(proof.toJSON(), MinaNFT.redactedMapVerificationKey);
        //console.log("Proof verification result:", verificationResult);
        if (verificationResult === false) {
            throw new Error("Proof verification error");
        }
        return proof;
    }
    /**
     *
     * @returns proof
     */
    async prepareProofData() {
        const { root, map } = this.getMetadataRootAndMap();
        const { root: originalRoot, map: originalMap } = this.nft.getMetadataRootAndMap();
        const transactions = [];
        //const elements: MapElement[] = [];
        //let originalWitnesses: MetadataWitness[] = [];
        //let redactedWitnesses: MetadataWitness[] = [];
        this.metadata.forEach((value, key) => {
            const keyField = MinaNFT.stringToField(key);
            const redactedWitness = map.getWitness(keyField);
            const originalWitness = originalMap.getWitness(keyField);
            const element = new MapElement({
                originalRoot: originalRoot,
                redactedRoot: root,
                key: keyField,
                value: new Metadata({ data: value.data, kind: value.kind }),
            });
            transactions.push(JSON.stringify({
                element: MapElement.toFields(element).map((f) => f.toJSON()),
                originalWitness: MetadataWitness.toFields(originalWitness).map((f) => f.toJSON()),
                redactedWitness: MetadataWitness.toFields(redactedWitness).map((f) => f.toJSON()),
            }));
        });
        return transactions;
    }
    static async deploy(deployer, privateKey, nonce) {
        const sender = deployer.toPublicKey();
        const zkAppPrivateKey = privateKey;
        const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
        await MinaNFT.compileVerifier();
        console.log(`deploying the MinaNFTVerifier contract to an address ${zkAppPublicKey.toBase58()} using the deployer with public key ${sender.toBase58()}...`);
        await fetchMinaAccount({ publicKey: sender });
        await fetchMinaAccount({ publicKey: zkAppPublicKey });
        const deployNonce = nonce ?? Number(web.Mina.getAccount(sender).nonce.toBigint());
        const hasAccount = web.Mina.hasAccount(zkAppPublicKey);
        const zkApp = new MinaNFTVerifier(zkAppPublicKey);
        const transaction = await web.Mina.transaction({
            sender,
            fee: await MinaNFT.fee(),
            memo: "minanft.io",
            nonce: deployNonce,
        }, async () => {
            if (!hasAccount)
                web.AccountUpdate.fundNewAccount(sender);
            await zkApp.deploy({});
            zkApp.account.tokenSymbol.set("VERIFY");
            zkApp.account.zkappUri.set("https://minanft.io/@verifier");
        });
        transaction.sign([deployer, zkAppPrivateKey]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "verifier deploy", false);
        if (tx.status === "pending") {
            return tx;
        }
        else
            return undefined;
    }
}
//# sourceMappingURL=redactedminanft.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/minanftbadge.js










class MinaNFTBadge {
    /**
     * Create MinaNFT object
     * @param args {@link MinaNFTBadgeConstructor}
     */
    constructor(args) {
        if (args.name.length > 30)
            throw new Error("Badge name too long, must be maximum 30 character");
        this.name = args.name;
        if (args.owner.length > 30)
            throw new Error("Badge owner too long, must be maximum 30 character");
        this.owner = args.owner;
        if (args.verifiedKey.length > 30)
            throw new Error("Badge verifiedKey too long, must be maximum 30 character");
        this.verifiedKey = args.verifiedKey;
        if (args.verifiedKind.length > 30)
            throw new Error("Badge verifiedKind too long, must be maximum 30 character");
        this.verifiedKind = args.verifiedKind;
        this.oracle = args.oracle;
        this.address = args.address;
        if (args.tokenSymbol.length > 6)
            throw new Error("Token symbol too long, must be maximum 6 characters");
        this.tokenSymbol = args.tokenSymbol;
    }
    static async fromPublicKey(badgePublicKey) {
        const zkApp = new MinaNFTVerifierBadge(badgePublicKey);
        await fetchMinaAccount({ publicKey: badgePublicKey });
        if (!web.Mina.hasAccount(badgePublicKey))
            return undefined;
        const name = zkApp.name.get();
        const owner = zkApp.owner.get();
        const verifiedKey = zkApp.verifiedKey.get();
        const verifiedKind = zkApp.verifiedKind.get();
        const oracle = zkApp.oracle.get();
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        const tokenSymbol = "BADGE";
        return new MinaNFTBadge({
            name: MinaNFT.stringFromField(name),
            owner: MinaNFT.stringFromField(owner),
            verifiedKey: MinaNFT.stringFromField(verifiedKey),
            verifiedKind: MinaNFT.stringFromField(verifiedKind),
            oracle,
            address: badgePublicKey,
            tokenSymbol,
        });
    }
    async deploy(deployer, privateKey = undefined, nonce) {
        const sender = deployer.toPublicKey();
        const zkAppPrivateKey = privateKey ?? web.PrivateKey.random();
        const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
        await MinaNFT.compileBadge();
        console.log(`deploying the MinaNFTVerifierBadge contract to an address ${zkAppPublicKey.toBase58()} using the deployer with public key ${sender.toBase58()}...`);
        await fetchMinaAccount({ publicKey: sender });
        await fetchMinaAccount({ publicKey: zkAppPublicKey });
        const deployNonce = nonce ?? Number(web.Mina.getAccount(sender).nonce.toBigint());
        const hasAccount = web.Mina.hasAccount(zkAppPublicKey);
        const zkApp = new MinaNFTVerifierBadge(zkAppPublicKey);
        const transaction = await web.Mina.transaction({
            sender,
            fee: await MinaNFT.fee(),
            memo: "minanft.io",
            nonce: deployNonce,
        }, async () => {
            if (!hasAccount)
                web.AccountUpdate.fundNewAccount(sender);
            await zkApp.deploy({});
            zkApp.name.set(MinaNFT.stringToField(this.name));
            zkApp.owner.set(MinaNFT.stringToField(this.owner));
            zkApp.verifiedKey.set(MinaNFT.stringToField(this.verifiedKey));
            zkApp.verifiedKind.set(MinaNFT.stringToField(this.verifiedKind));
            zkApp.oracle.set(this.oracle);
            zkApp.account.tokenSymbol.set(this.tokenSymbol);
            zkApp.account.zkappUri.set("https://minanft.io/" + this.name);
        });
        transaction.sign([deployer, zkAppPrivateKey]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "badge deploy", false);
        if (tx.status === "pending") {
            this.address = zkAppPublicKey;
            return tx;
        }
        else
            return undefined;
    }
    async issue(deployer, nft, oraclePrivateKey, nonce) {
        if (this.address === undefined) {
            throw new Error("Badge not deployed");
        }
        if (nft.address === undefined) {
            throw new Error("NFT not deployed");
        }
        if (nft.tokenId === undefined)
            throw new Error("NFT tokenId not set");
        const nftTokenId = nft.tokenId;
        const nftAddress = nft.address;
        await MinaNFT.compileBadge();
        //console.log("Creating proofs for", verifiedKey);
        const logStr = `Badge proofs created for ${nft.name} ${nft.version.toJSON()}`;
        console.time(logStr);
        const disclosure = new RedactedMinaNFT(nft);
        disclosure.copyMetadata(this.verifiedKey);
        const redactedProof = await disclosure.proof();
        /*
            class MinaNFTVerifierBadgeEvent extends Struct({
              address: PublicKey,
              owner: Field,
              name: Field,
              version: UInt64,
              data: Metadata,
              key: Field,
            })
        */
        const privateData = nft.getMetadata(this.verifiedKey);
        if (privateData === undefined)
            throw new Error("Metadata not found");
        const nftdata = new Metadata({
            data: privateData.data,
            kind: privateData.kind,
        });
        const badgeEvent = new MinaNFTVerifierBadgeEvent({
            address: nftAddress,
            owner: nft.owner,
            name: MinaNFT.stringToField(nft.name),
            version: nft.version,
            data: nftdata,
            key: MinaNFT.stringToField(this.verifiedKey),
        });
        /*
              class BadgeDataWitness extends Struct({
                root: Metadata,
                value: Metadata,
                key: Field,
                witness: MetadataWitness,
              }) {}
        */
        const data = new web.MerkleMap();
        const kind = new web.MerkleMap();
        data.set(badgeEvent.key, badgeEvent.data.data);
        kind.set(badgeEvent.key, badgeEvent.data.kind);
        const badgeDataWitness = {
            root: {
                data: data.getRoot(),
                kind: kind.getRoot(),
            },
            value: badgeEvent.data,
            key: badgeEvent.key,
            witness: {
                data: data.getWitness(badgeEvent.key),
                kind: kind.getWitness(badgeEvent.key),
            },
        };
        if (badgeDataWitness.root.data.toJSON() !==
            redactedProof.publicInput.redactedRoot.data.toJSON()) {
            throw new Error("Data root mismatch");
        }
        if (badgeDataWitness.root.kind.toJSON() !==
            redactedProof.publicInput.redactedRoot.kind.toJSON()) {
            throw new Error("Kind root mismatch");
        }
        const badgeState = BadgeData.create(badgeDataWitness);
        const badgeStateProof = await MinaNFTBadgeCalculation.create(badgeState, badgeDataWitness);
        const signature = web.Signature.create(oraclePrivateKey, MinaNFTVerifierBadgeEvent.toFields(badgeEvent));
        const issuer = new MinaNFTVerifierBadge(this.address);
        const tokenId = issuer.deriveTokenId();
        console.timeEnd(logStr);
        const sender = deployer.toPublicKey();
        await fetchMinaAccount({ publicKey: sender });
        await fetchMinaAccount({ publicKey: nftAddress, tokenId: nftTokenId });
        await fetchMinaAccount({ publicKey: this.address });
        await fetchMinaAccount({ publicKey: nftAddress, tokenId });
        const hasAccount = web.Mina.hasAccount(nftAddress, tokenId);
        const deployNonce = nonce ?? Number(web.Mina.getAccount(sender).nonce.toBigint());
        const hasNftAccount = web.Mina.hasAccount(nftAddress, nftTokenId);
        if (!hasNftAccount)
            throw new Error("NFT account not found");
        const zkAppNFT = new MinaNFTContract(nftAddress, nftTokenId);
        const version = zkAppNFT.version.get();
        console.log("Issuing badge for", nft.name, "version", version.toJSON());
        const transaction = await web.Mina.transaction({
            sender,
            fee: await MinaNFT.fee(),
            memo: "minanft.io",
            nonce: deployNonce,
        }, async () => {
            if (!hasAccount)
                web.AccountUpdate.fundNewAccount(sender);
            await issuer.issueBadge(nftAddress, nftTokenId, badgeEvent, signature, redactedProof, badgeStateProof);
        });
        await sleep(100); // alow GC to run
        await transaction.prove();
        transaction.sign([deployer]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "issue badge", false);
        if (tx.status === "pending") {
            return tx;
        }
        else
            return undefined;
    }
    async verify(nft) {
        if (this.address === undefined) {
            throw new Error("Badge not deployed");
        }
        if (nft.address === undefined) {
            throw new Error("NFT not deployed");
        }
        if (nft.tokenId === undefined)
            throw new Error("NFT tokenId not set");
        const nftAddress = nft.address;
        const issuer = new MinaNFTVerifierBadge(this.address);
        const tokenId = issuer.deriveTokenId();
        const zkNFT = new MinaNFTContract(nftAddress, nft.tokenId);
        await fetchMinaAccount({ publicKey: nftAddress, tokenId });
        await fetchMinaAccount({ publicKey: nftAddress, tokenId: nft.tokenId });
        const hasAccount = web.Mina.hasAccount(nftAddress, tokenId);
        if (!hasAccount)
            return false;
        const version = zkNFT.version.get();
        const balance = web.Mina.getBalance(nftAddress, tokenId);
        return version.equals(balance).toBoolean();
    }
}
//# sourceMappingURL=minanftbadge.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/escrow.js






class MinaNFTEscrow {
    /**
     * Create MinaNFTEscrow
     * @param address Public key of the deployed NFT zkApp
     */
    constructor(address) {
        this.address = address;
    }
    async deploy(deployer, privateKey = undefined) {
        const sender = deployer.toPublicKey();
        const zkAppPrivateKey = privateKey ?? web.PrivateKey.random();
        const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
        await MinaNFT.compileEscrow();
        console.log(`deploying the Escrow contract to an address ${zkAppPublicKey.toBase58()} using the deployer with public key ${sender.toBase58()}...`);
        await (0,web.fetchAccount)({ publicKey: sender });
        await (0,web.fetchAccount)({ publicKey: zkAppPublicKey });
        const hasAccount = web.Mina.hasAccount(zkAppPublicKey);
        const zkApp = new Escrow(zkAppPublicKey);
        const transaction = await web.Mina.transaction({ sender, fee: await MinaNFT.fee(), memo: "minanft.io" }, async () => {
            if (!hasAccount)
                web.AccountUpdate.fundNewAccount(sender);
            await zkApp.deploy({});
            zkApp.account.tokenSymbol.set("ESCROW");
            zkApp.account.zkappUri.set("https://minanft.io/@escrow");
        });
        transaction.sign([deployer, zkAppPrivateKey]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "escrow deploy", false);
        if (tx.status === "pending") {
            this.address = zkAppPublicKey;
            return tx;
        }
        else
            return undefined;
    }
    async deposit(data, buyer, escrow) {
        if (this.address === undefined) {
            throw new Error("Escrow not deployed");
        }
        await MinaNFT.compileEscrow();
        const sender = buyer.toPublicKey();
        const zkApp = new Escrow(this.address);
        const signature = web.Signature.create(buyer, EscrowTransfer.toFields(data));
        const deposited = { data, signature };
        await (0,web.fetchAccount)({ publicKey: sender });
        await (0,web.fetchAccount)({ publicKey: this.address });
        const transaction = await web.Mina.transaction({ sender, fee: await MinaNFT.fee(), memo: "minanft.io" }, async () => {
            await zkApp.deposit(deposited, buyer.toPublicKey());
            const senderUpdate = web.AccountUpdate.create(buyer.toPublicKey());
            senderUpdate.requireSignature();
            senderUpdate.send({ to: escrow, amount: data.price });
        });
        await sleep(100); // alow GC to run
        await transaction.prove();
        transaction.sign([buyer]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "deposit", false);
        if (tx.status === "pending") {
            return { tx, deposited };
        }
        else
            return undefined;
    }
    async approveSale(data, seller) {
        if (this.address === undefined) {
            throw new Error("Escrow not deployed");
        }
        await MinaNFT.compileEscrow();
        const sender = seller.toPublicKey();
        const zkApp = new Escrow(this.address);
        const signature = web.Signature.create(seller, EscrowTransfer.toFields(data));
        //console.log("signature length", signature.toFields().length);
        const deposited = { data, signature };
        await (0,web.fetchAccount)({ publicKey: sender });
        await (0,web.fetchAccount)({ publicKey: this.address });
        const transaction = await web.Mina.transaction({ sender, fee: await MinaNFT.fee(), memo: "minanft.io" }, async () => {
            await zkApp.approveSale(deposited, seller.toPublicKey());
        });
        await sleep(100); // alow GC to run
        await transaction.prove();
        transaction.sign([seller]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "approve sale", false);
        if (tx.status === "pending") {
            return { tx, deposited };
        }
        else
            return undefined;
    }
    async transfer(transferData) {
        const { data, escrow, sellerDeposited, buyerDeposited, nft, nameService, tokenId, seller, buyer, isKYCpassed, } = transferData;
        if (this.address === undefined) {
            throw new Error("Escrow not deployed");
        }
        if (isKYCpassed === false) {
            throw new Error("KYC not passed. It is obligation of the escrow agent to check the KYC status of the buyer and the seller.");
        }
        await MinaNFT.compileEscrow();
        const sender = escrow.toPublicKey();
        const zkApp = new Escrow(this.address);
        const signature = web.Signature.create(escrow, EscrowTransfer.toFields(data));
        await (0,web.fetchAccount)({ publicKey: sender });
        await (0,web.fetchAccount)({ publicKey: this.address });
        await (0,web.fetchAccount)({ publicKey: nameService });
        await (0,web.fetchAccount)({ publicKey: nft, tokenId });
        const hasAccount = web.Mina.hasAccount(nft, tokenId);
        const account = web.Mina.getAccount(nft, tokenId);
        const balance = web.Mina.getBalance(nft, tokenId);
        console.log(`transfer checks result:`, hasAccount, tokenId.toJSON(), account.balance.toString(), balance.toString());
        /*
          @method transfer(
            nft: PublicKey,
            data: EscrowTransfer,
            signature1: Signature,
            signature2: Signature,
            signature3: Signature,
            escrow1: PublicKey,
            escrow2: PublicKey,
            escrow3: PublicKey,
            amount: UInt64,
            seller: PublicKey,
            buyer: PublicKey
          ) {
        */
        const transaction = await web.Mina.transaction({ sender, fee: await MinaNFT.fee(), memo: "minanft.io" }, async () => {
            await zkApp.transfer(nft, nameService, data, sellerDeposited.signature, buyerDeposited.signature, signature, seller, buyer, escrow.toPublicKey(), data.price, seller, buyer);
            const senderUpdate = web.AccountUpdate.create(escrow.toPublicKey());
            senderUpdate.requireSignature();
            senderUpdate.send({ to: seller, amount: data.price });
        });
        await sleep(100); // alow GC to run
        await transaction.prove();
        transaction.sign([escrow]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "transfer", false);
        if (tx.status === "pending") {
            return tx;
        }
        else
            return undefined;
    }
}
//# sourceMappingURL=escrow.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/plugins/redactedtree20.js




class MerkleTreeWitness20 extends (0,web.MerkleWitness)(20) {
}
class RedactedMinaNFTTreeState20 extends BaseRedactedMinaNFTTreeState {
    static create(element, originalWitness, redactedWitness) {
        const originalWitnessRoot = originalWitness.calculateRoot(element.value);
        element.originalRoot.assertEquals(originalWitnessRoot);
        const calculatedOriginalIndex = originalWitness.calculateIndex();
        calculatedOriginalIndex.assertEquals(element.index);
        const redactedWitnessRoot = redactedWitness.calculateRoot(element.value);
        element.redactedRoot.assertEquals(redactedWitnessRoot);
        const calculatedRedactedIndex = redactedWitness.calculateIndex();
        calculatedRedactedIndex.assertEquals(element.index);
        return new RedactedMinaNFTTreeState20({
            originalRoot: element.originalRoot,
            redactedRoot: element.redactedRoot,
            hash: web.Poseidon.hash([element.index, element.value]),
            count: (0,web.Field)(1),
        });
    }
    static merge(state1, state2) {
        state1.originalRoot.assertEquals(state2.originalRoot);
        state1.redactedRoot.assertEquals(state2.redactedRoot);
        return new RedactedMinaNFTTreeState20({
            originalRoot: state1.originalRoot,
            redactedRoot: state1.redactedRoot,
            hash: state1.hash.add(state2.hash),
            count: state1.count.add(state2.count),
        });
    }
    static assertEquals(state1, state2) {
        state1.originalRoot.assertEquals(state2.originalRoot);
        state1.redactedRoot.assertEquals(state2.redactedRoot);
        state1.hash.assertEquals(state2.hash);
        state1.count.assertEquals(state2.count);
    }
}
const RedactedMinaNFTTreeCalculation20 = (0,web.ZkProgram)({
    name: "RedactedMinaNFTTreeCalculation20",
    publicInput: RedactedMinaNFTTreeState20,
    methods: {
        create: {
            privateInputs: [TreeElement, MerkleTreeWitness20, MerkleTreeWitness20],
            async method(state, element, originalWitness, redactedWitness) {
                const computedState = RedactedMinaNFTTreeState20.create(element, originalWitness, redactedWitness);
                RedactedMinaNFTTreeState20.assertEquals(computedState, state);
            },
        },
        merge: {
            privateInputs: [web.SelfProof, web.SelfProof],
            async method(newState, proof1, proof2) {
                proof1.verify();
                proof2.verify();
                const computedState = RedactedMinaNFTTreeState20.merge(proof1.publicInput, proof2.publicInput);
                RedactedMinaNFTTreeState20.assertEquals(computedState, newState);
            },
        },
    },
});
class RedactedMinaNFTTreeStateProof20 extends web.ZkProgram.Proof(RedactedMinaNFTTreeCalculation20) {
}
class MinaNFTTreeVerifier20 extends web.SmartContract {
    async deploy(args) {
        super.deploy(args);
        this.account.permissions.set({
            ...web.Permissions.default(),
            setDelegate: web.Permissions.proof(),
            incrementNonce: web.Permissions.proof(),
            setVotingFor: web.Permissions.proof(),
            setTiming: web.Permissions.proof(),
        });
    }
    async verifyRedactedTree(proof) {
        proof.verify();
    }
}
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RedactedMinaNFTTreeStateProof20]),
    __metadata("design:returntype", Promise)
], MinaNFTTreeVerifier20.prototype, "verifyRedactedTree", null);
//# sourceMappingURL=redactedtree20.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/storage/fast-tree.js

class DynamicMerkleTree {
    constructor(height) {
        this.height = height;
        this.nodes = {};
        this.generateZeroes();
        this.size = 0;
    }
    generateZeroes() {
        this.zeroes = new Array(this.height);
        this.zeroes[0] = (0,web.Field)(0);
        for (let i = 1; i < this.height; i += 1) {
            this.zeroes[i] = web.Poseidon.hash([this.zeroes[i - 1], this.zeroes[i - 1]]);
        }
    }
    recalculateMerkleTree(newHeight) {
        if (newHeight <= this.height) {
            throw Error("New height must not be lower or equal to existed");
        }
        this.height = newHeight;
        this.generateZeroes();
        const levelZeroNodes = this.nodes[0];
        if (!levelZeroNodes) {
            return [];
        }
        const nodes = Object.entries(levelZeroNodes).map(([index, digest]) => ({
            level: 0,
            index: BigInt(index),
            digest,
        }));
        this.setLeaves(nodes);
    }
    getRoot() {
        return this.getNode(this.height - 1, BigInt(0));
    }
    setLeaves(leaves) {
        if (this.size + leaves.length >= this.leafCount) {
            this.recalculateMerkleTree(this.height + 1);
        }
        let cacheSet = new Set();
        for (let i = 0; i < leaves.length; i++) {
            const currentIndex = leaves[i].index;
            const parentIndex = (currentIndex - (currentIndex % BigInt(2))) / BigInt(2);
            cacheSet.add(parentIndex);
            this.setLeaf(currentIndex, leaves[i].digest);
        }
        for (let level = 1; level < this.height; level += 1) {
            const intermediateCacheSet = new Set();
            intermediateCacheSet.clear();
            for (const currentIndex of cacheSet) {
                const parentIndex = (currentIndex - (currentIndex % BigInt(2))) / BigInt(2);
                intermediateCacheSet.add(parentIndex);
                const leftChild = this.getNode(level - 1, currentIndex * BigInt(2));
                const rightChild = this.getNode(level - 1, currentIndex * BigInt(2) + BigInt(1));
                this.setNode({
                    level,
                    index: currentIndex,
                    digest: web.Poseidon.hash([leftChild, rightChild]),
                });
            }
            cacheSet = intermediateCacheSet;
        }
    }
    getNode(level, index) {
        return this.nodes[level]?.[index.toString()] ?? this.zeroes[level];
    }
    isNodeExist(level, index) {
        return !!this.nodes[level]?.[index.toString()];
    }
    setNode(node) {
        (this.nodes[node.level] ??= {})[node.index.toString()] = node.digest;
    }
    setLeaf(index, digest) {
        if (!this.isNodeExist(0, index)) {
            this.size += 1;
        }
        this.setNode({
            level: 0,
            index,
            digest,
        });
    }
    get leafCount() {
        return 2 ** (this.height - 1);
    }
}
function calculateMerkleTreeRootFast(height, fields) {
    const nodes = [];
    const length = fields.length;
    for (let i = 0; i < length; i++) {
        nodes.push({ level: 0, index: BigInt(i), digest: fields[i] });
    }
    const tree = new DynamicMerkleTree(height);
    tree.setLeaves(nodes);
    return { leafCount: tree.leafCount, root: tree.getRoot() };
}
//# sourceMappingURL=fast-tree.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/plugins/backend.js

class BackendPlugin {
    constructor(params) {
        const { name, task, args, jobId } = params;
        this.name = name;
        this.task = task;
        this.args = args;
        this.jobId = jobId;
    }
}
//# sourceMappingURL=backend.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/api/api.js



const { MINANFT_API_AUTH, MINANFT_API } = src_config;
/**
 * API class for interacting with the serverless api
 * @property jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
 * @property endpoint The endpoint of the serverless api
 */
class api {
    /**
     * Constructor for the API class
     * @param jwt The jwt token for authentication, get it at https://t.me/minanft_bot?start=auth
     */
    constructor(jwt) {
        this.jwt = jwt;
        this.endpoint = MINANFT_API;
    }
    /**
     * Gets the address (publicKey) of the NFT using serverless api call
     * @param name The name of the NFT
     */
    async lookupName(name) {
        const result = await this.apiHub("lookupName", {
            transactions: [],
            developer: "@dfst",
            name: "lookupName",
            task: "lookupName",
            args: [name],
        });
        try {
            const data = JSON.parse(result.data);
            const { found, name, publicKey, chain, contract } = data;
            if (found === true)
                return {
                    success: result.success,
                    error: result.error,
                    address: publicKey,
                    found: found,
                    chain: chain,
                    contract: contract,
                };
            else
                return {
                    success: result.success,
                    error: result.error,
                    reason: "not found",
                    found: found,
                };
        }
        catch (error) {
            return {
                success: result.success,
                error: error?.toString() ?? result.error,
                reason: result.error,
            };
        }
    }
    /**
     * Reserves the name of the NFT using serverless api call
     * @param data The data for the reserveName call
     * @param data.name The name of the NFT
     * @param data.publicKey The public key of the NFT
     * @param data.chain The blockchain
     * @param data.contract The contract
     * @param data.version The version of signature ("v1" or "v2")
     * @param data.developer The developer of the NFT
     * @param data.repo The repo of the NFT
     */
    async reserveName(data) {
        const result = await this.apiHub("reserveName", {
            transactions: [],
            developer: "@dfst",
            name: "reserveName",
            task: "reserveName",
            args: [JSON.stringify(data, null, 2)],
        });
        const reserved = result.data === undefined ? { success: false } : result.data;
        const price = reserved.price ? JSON.parse(reserved.price) : {};
        return {
            success: result.success,
            error: result.error,
            price: price,
            isReserved: reserved.success ?? false,
            signature: reserved.signature,
            expiry: reserved.expiry,
            reason: reserved.reason ?? reserved.toString(),
        };
    }
    /**
     * Index the NFT using serverless api call
     * The NFT mint transaction should be included in the block before calling this function
     * otherwise it will fail and return isIndexed : false
     * @param data The data for the indexName call
     * @param data.name The name of the NFT
     */
    async indexName(data) {
        const result = await this.apiHub("indexName", {
            transactions: [],
            developer: "@dfst",
            name: "indexName",
            task: "indexName",
            args: [data.name],
        });
        const isIndexed = result?.data?.success ?? false;
        return {
            success: result.success,
            isIndexed,
            error: result.error ?? "",
            reason: result?.data?.reason ?? "",
        };
    }
    /**
     * Mints a new NFT using serverless api call
     * @param data the data for the mint call
     * @param data.uri the uri of the metadata
     * @param data.signature the signature returned by the reserveName call
     * @param data.privateKey the private key of the address where NFT should be minted
     * @param data.useArweave true if the metadata should be uploaded to the Arweave, default is IPFS
     * @returns { success: boolean, error?: string, jobId?: string }
     * where jonId is the jobId of the minting transaction
     */
    async mint(data) {
        const result = await this.apiHub("mint_v3", {
            transactions: [data.uri],
            developer: "@dfst",
            name: "nft",
            task: "mint",
            args: [
                data.signature,
                data.privateKey,
                (data.useArweave ?? false).toString(),
            ],
        });
        return { success: result.success, jobId: result.data, error: result.error };
    }
    /**
     * Creates a new post for existing NFT using serverless api call
     * @param data the data for the post call
     * @param data.commitData the commit data
     * @param data.ownerPublicKey the owner's public key
     * @param data.nftName the name of the NFT
     * @param data.postName the name of the post
     * @returns { success: boolean, error?: string, jobId?: string }
     * where jonId is the jobId of the minting transaction
     */
    async post(data) {
        const result = await this.apiHub("post_v3", {
            transactions: data.commitData.transactions,
            developer: "@dfst",
            name: "post",
            task: "mint",
            args: [
                data.commitData.signature,
                data.commitData.address,
                data.commitData.update,
                data.ownerPublicKey,
                data.nftName,
                data.postName,
            ],
        });
        return { success: result.success, jobId: result.data, error: result.error };
    }
    /**
     * Starts a new job for the proof calculation using serverless api call
     * The developer and name should correspond to the BackupPlugin of the API
     * All other parameters should correspond to the parameters of the BackupPlugin
     * @param data the data for the proof call
     * @param data.transactions the transactions
     * @param data.developer the developer
     * @param data.name the name of the job
     * @param data.task the task of the job
     * @param data.args the arguments of the job
     * @returns { success: boolean, error?: string, jobId?: string }
     * where jonId is the jobId of the job
     */
    async proof(data) {
        const result = await this.apiHub("proof", data);
        if (result.data === "error")
            return {
                success: false,
                error: result.error,
            };
        else
            return {
                success: result.success,
                jobId: result.data,
                error: result.error,
            };
    }
    /**
     * Gets the result of the job using serverless api call
     * @param data the data for the jobResult call
     * @param data.jobId the jobId of the job
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the result of the job
     * if the job is not finished yet, the result will be undefined
     * if the job failed, the result will be undefined and error will be set
     * if the job is finished, the result will be set and error will be undefined
     * if the job is not found, the result will be undefined and error will be set
     */
    async jobResult(data) {
        const result = await this.apiHub("jobResult", data);
        if (this.isError(result.data))
            return {
                success: false,
                error: result.error,
                result: result.data,
            };
        else
            return {
                success: result.success,
                error: result.error,
                result: result.data,
            };
    }
    /**
     * Gets the billing report for the jobs sent using JWT
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the billing report
     */
    async queryBilling() {
        const result = await this.apiHub("queryBilling", {});
        if (this.isError(result.data))
            return {
                success: false,
                error: result.error,
                result: result.data,
            };
        else
            return {
                success: result.success,
                error: result.error,
                result: result.data,
            };
    }
    /**
     * Waits for the job to finish
     * @param data the data for the waitForJobResult call
     * @param data.jobId the jobId of the job
     * @param data.maxAttempts the maximum number of attempts, default is 360 (2 hours)
     * @param data.interval the interval between attempts, default is 20000 (20 seconds)
     * @param data.maxErrors the maximum number of network errors, default is 10
     * @returns { success: boolean, error?: string, result?: any }
     * where result is the result of the job
     */
    async waitForJobResult(data) {
        const maxAttempts = data?.maxAttempts ?? 360; // 2 hours
        const interval = data?.interval ?? 20000;
        const maxErrors = data?.maxErrors ?? 10;
        const errorDelay = 30000; // 30 seconds
        let attempts = 0;
        let errors = 0;
        while (attempts < maxAttempts) {
            const result = await this.apiHub("jobResult", data);
            if (result.success === false) {
                errors++;
                if (errors > maxErrors) {
                    return {
                        success: false,
                        error: "Too many network errors",
                        result: undefined,
                    };
                }
                await sleep(errorDelay * errors);
            }
            else {
                if (this.isError(result.data))
                    return {
                        success: false,
                        error: result.error,
                        result: result.data,
                    };
                else if (result.data?.result !== undefined) {
                    return {
                        success: result.success,
                        error: result.error,
                        result: result.data,
                    };
                }
                await sleep(interval);
            }
            attempts++;
        }
        return {
            success: false,
            error: "Timeout",
            result: undefined,
        };
    }
    /**
     * Calls the serverless API
     * @param command the command of the API
     * @param data the data of the API
     * */
    async apiHub(command, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) {
        const apiData = {
            auth: MINANFT_API_AUTH,
            command: command,
            jwtToken: this.jwt,
            data: data,
        };
        try {
            const response = await lib_axios.post(this.endpoint, apiData);
            return { success: true, data: response.data };
        }
        catch (error) {
            console.error("catch api", error);
            return { success: false, error: error };
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isError(data) {
        if (data === "error")
            return true;
        if (data?.jobStatus === "failed")
            return true;
        if (typeof data === "string" && data.toLowerCase().startsWith("error"))
            return true;
        return false;
    }
}
//# sourceMappingURL=api.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/lib/base64.js

// URL friendly base64 encoding
const TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function fieldToBase64(field) {
    const digits = toBase(field.toBigInt(), BigInt(64));
    //console.log("digits:", digits);
    const str = digits.map((x) => TABLE[Number(x)]).join("");
    //console.log("str:", str);
    return str;
}
function bigintToBase64(value) {
    const digits = toBase(value, BigInt(64));
    //console.log("digits:", digits);
    const str = digits.map((x) => TABLE[Number(x)]).join("");
    //console.log("str:", str);
    return str;
}
function fieldFromBase64(str) {
    const base64Digits = str.split("").map((x) => BigInt(TABLE.indexOf(x)));
    const x = fromBase(base64Digits, BigInt(64));
    return (0,web.Field)(x);
}
function bigintFromBase64(str) {
    const base64Digits = str.split("").map((x) => BigInt(TABLE.indexOf(x)));
    const x = fromBase(base64Digits, BigInt(64));
    return x;
}
function fromBase(digits, base) {
    if (base <= BigInt(0))
        throw Error("fromBase: base must be positive");
    // compute powers base, base^2, base^4, ..., base^(2^k)
    // with largest k s.t. n = 2^k < digits.length
    let basePowers = [];
    for (let power = base, n = 1; n < digits.length; power **= BigInt(2), n *= 2) {
        basePowers.push(power);
    }
    let k = basePowers.length;
    // pad digits array with zeros s.t. digits.length === 2^k
    digits = digits.concat(Array(2 ** k - digits.length).fill(0n));
    // accumulate [x0, x1, x2, x3, ...] -> [x0 + base*x1, x2 + base*x3, ...] -> [x0 + base*x1 + base^2*(x2 + base*x3), ...] -> ...
    // until we end up with a single element
    for (let i = 0; i < k; i++) {
        let newDigits = Array(digits.length >> 1);
        let basePower = basePowers[i];
        for (let j = 0; j < newDigits.length; j++) {
            newDigits[j] = digits[2 * j] + basePower * digits[2 * j + 1];
        }
        digits = newDigits;
    }
    console.assert(digits.length === 1);
    let [digit] = digits;
    return digit;
}
function toBase(x, base) {
    if (base <= 0n)
        throw Error("toBase: base must be positive");
    // compute powers base, base^2, base^4, ..., base^(2^k)
    // with largest k s.t. base^(2^k) < x
    let basePowers = [];
    for (let power = base; power <= x; power **= 2n) {
        basePowers.push(power);
    }
    let digits = [x]; // single digit w.r.t base^(2^(k+1))
    // successively split digits w.r.t. base^(2^j) into digits w.r.t. base^(2^(j-1))
    // until we arrive at digits w.r.t. base
    let k = basePowers.length;
    for (let i = 0; i < k; i++) {
        let newDigits = Array(2 * digits.length);
        let basePower = basePowers[k - 1 - i];
        for (let j = 0; j < digits.length; j++) {
            let x = digits[j];
            let high = x / basePower;
            newDigits[2 * j + 1] = high;
            newDigits[2 * j] = x - high * basePower;
        }
        digits = newDigits;
    }
    // pop "leading" zero digits
    while (digits[digits.length - 1] === 0n) {
        digits.pop();
    }
    return digits;
}
//# sourceMappingURL=base64.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/lib/fields.js


function serializeFields(fields) {
    const hash = web.Poseidon.hash(fields);
    const value = [(0,web.Field)(fields.length), hash, ...fields];
    //return value.map((f) => f.toBigInt().toString(36)).join(".");
    return value.map((f) => fieldToBase64(f)).join(".");
}
function deserializeFields(s) {
    try {
        //const value = s.split(".").map((n) => Field(BigInt(convert(n, 36))));
        const value = s.split(".").map((n) => fieldFromBase64(n));
        const length = value[0];
        if ((0,web.Field)(value.length - 2)
            .equals(length)
            .toBoolean() === false)
            throw new Error("deserializeFields: invalid length");
        const hash = web.Poseidon.hash(value.slice(2));
        if (hash.equals(value[1]).toBoolean()) {
            return value.slice(2);
        }
        else
            throw new Error("deserializeFields: invalid hash: data mismatch");
    }
    catch (e) {
        throw new Error(`deserializeFields: invalid string: ${s}: ${e}`);
    }
}
//# sourceMappingURL=fields.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/rollupnft.js














/**
 * RollupUpdate is the data for the update of the metadata to be written to the NFT state
 * @property oldRoot The old root of the Merkle Map of the metadata
 * @property newRoot The new root of the Merkle Map of the metadata
 * @property storage The storage of the NFT - IPFS (i:...) or Arweave (a:...) hash string
 */
class RollupUpdate extends (0,web.Struct)({
    oldRoot: Metadata,
    newRoot: Metadata,
    storage: Storage,
}) {
    constructor(value) {
        super(value);
    }
}
/**
 * RollupNFT are the NFT used in the Rollup
 * TODO: change parameters
 * @property name Name of the NFT
 * @property storage Storage of the NFT - IPFS (i:...) or Arweave (a:...) hash string
 * @property address Public key of the NFT
 * @property updates Array of the metadata updates
 * @property metadataRoot Root of the Merkle Map of the metadata
 * @property isSomeMetadata Boolean if there is some metadata
 * @property external_url External URL of the NFT
 */
class RollupNFT extends BaseMinaNFT {
    /**
     * Create RollupNFT object
     * @param params arguments
     * @param params.name Name of NFT
     * @param params.address Public key of the NFT
     * @param params.root Root of the Merkle Map of the metadata
     * @param params.storage Storage of the NFT - IPFS (i:...) or Arweave (a:...) hash string
     * @param params.external_url External URL of the NFT
     */
    constructor(params = {}) {
        const { storage, root, name, address, external_url } = params;
        super();
        this.isSomeMetadata = false;
        this.updates = [];
        const metadataMap = new MetadataMap();
        if (root !== undefined) {
            this.metadataRoot = root;
            this.isSomeMetadata = true;
        }
        else
            this.metadataRoot = metadataMap.getRoot();
        this.storage = storage;
        this.name = name;
        this.external_url = external_url;
        if (address !== undefined)
            this.address =
                typeof address === "string" ? web.PublicKey.fromBase58(address) : address;
    }
    /**
     * Compiles RollupNFT MetadataUpdate contract
     * @returns verification key
     */
    static async compile() {
        return BaseMinaNFT.compile(true);
    }
    /**
     * Load metadata from blockchain and IPFS/Arweave
     * @param metadataURI URI of the metadata. Obligatorily in case there is private metadata as private metadata cannot be fetched from IPFS/Arweave
     * @param skipCalculatingMetadataRoot Skip calculating metadata root in case metadataURI is not provided and NFT contains private data
     */
    async loadMetadata(metadataURI = undefined, skipCalculatingMetadataRoot = false) {
        const uri = metadataURI
            ? JSON.parse(metadataURI)
            : this.storage
                ? (await lib_axios.get("https://gateway.pinata.cloud/ipfs/" + this.storage.toIpfsHash())).data
                : undefined;
        if (uri === undefined)
            throw new Error("uri: NFT metadata not found");
        if (this.isSomeMetadata) {
            if (uri.metadata.data !== this.metadataRoot.data.toJSON())
                throw new Error("uri: NFT metadata data mismatch");
            if (uri.metadata.kind !== this.metadataRoot.kind.toJSON())
                throw new Error("uri: NFT metadata kind mismatch");
        }
        else {
            this.metadataRoot = new Metadata({
                data: web.Field.fromJSON(uri.metadata.data),
                kind: web.Field.fromJSON(uri.metadata.kind),
            });
            this.isSomeMetadata = true;
        }
        this.name = uri.name;
        this.address =
            uri.address && typeof uri.address === "string"
                ? web.PublicKey.fromBase58(uri.address)
                : undefined;
        this.external_url = uri.external_url;
        Object.entries(uri.properties).forEach(([key, value]) => {
            if (typeof key !== "string")
                throw new Error("uri: NFT metadata key mismatch - should be string");
            if (typeof value !== "object")
                throw new Error("uri: NFT metadata value mismatch - should be object");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const obj = value;
            const data = obj.data;
            const kind = obj.kind;
            const isPrivate = obj.isPrivate ?? false;
            if (data === undefined)
                throw new Error(`uri: NFT metadata: data should present: ${key} : ${value} kind: ${kind} daya: ${data} isPrivate: ${isPrivate}`);
            if (kind === undefined || typeof kind !== "string")
                throw new Error(`uri: NFT metadata: kind mismatch - should be string: ${key} : ${value}`);
            switch (kind) {
                case "text":
                    this.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: TextData.fromJSON(obj),
                    }));
                    break;
                case "string":
                    this.metadata.set(key, new PrivateMetadata({
                        data: MinaNFT.stringToField(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                    }));
                    break;
                case "file":
                    this.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: FileData.fromJSON(obj),
                    }));
                    break;
                case "image":
                    this.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: FileData.fromJSON(obj),
                    }));
                    break;
                case "map":
                    this.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                        linkedObject: MapData.fromJSON(obj, skipCalculatingMetadataRoot),
                    }));
                    break;
                default:
                    this.metadata.set(key, new PrivateMetadata({
                        data: web.Field.fromJSON(data),
                        kind: MinaNFT.stringToField(kind),
                        isPrivate: isPrivate,
                    }));
                    break;
            }
        });
        if (skipCalculatingMetadataRoot === false) {
            const { root } = this.getMetadataRootAndMap();
            if (root.data.toJSON() !== this.metadataRoot.data.toJSON())
                throw new Error("Metadata root data mismatch");
            if (root.kind.toJSON() !== this.metadataRoot.kind.toJSON())
                throw new Error("Metadata root kind mismatch");
            this.isSomeMetadata = true;
        }
    }
    /**
     * Creates a Map from JSON
     * @param json json with map data
     * @returns map as JSON object
     */
    static mapFromJSON(json) {
        const map = new Map();
        Object.entries(json).forEach(([key, value]) => map.set(key, value));
        return map;
    }
    /**
     * Converts to JSON
     * @returns JSON object
     */
    toJSON(params = {}) {
        const includePrivateData = params.includePrivateData ?? false;
        let description = undefined;
        const descriptionObject = this.getMetadata("description");
        if (descriptionObject !== undefined &&
            descriptionObject.linkedObject !== undefined &&
            descriptionObject.linkedObject instanceof TextData)
            description = descriptionObject.linkedObject.text;
        let collection = undefined;
        const collectionObject = this.getMetadata("collection");
        if (collectionObject !== undefined &&
            collectionObject.kind.toBigInt() ===
                MinaNFT.stringToField("string").toBigInt())
            collection = MinaNFT.stringFromField(collectionObject.data);
        let image = undefined;
        const imageObject = this.getMetadata("image");
        if (imageObject !== undefined &&
            imageObject.linkedObject !== undefined &&
            imageObject.linkedObject instanceof FileData &&
            imageObject.linkedObject.storage !== undefined &&
            imageObject.linkedObject.storage.length > 2)
            image =
                imageObject.linkedObject.storage[0] === "i"
                    ? "https://gateway.pinata.cloud/ipfs/" +
                        imageObject.linkedObject.storage.slice(2)
                    : "https://arweave.net/" + imageObject.linkedObject.storage.slice(2);
        const { root } = this.getMetadataRootAndMap();
        const json = {
            name: this.name,
            collection: collection,
            address: this.address?.toBase58(),
            description: description,
            image,
            external_url: this.external_url ?? this.getURL(),
            uri: this.storage
                ? "https://gateway.pinata.cloud/ipfs/" + this.storage.toIpfsHash()
                : undefined,
            storage: this.storage?.toString(),
            time: Date.now(),
            metadata: { data: root.data.toJSON(), kind: root.kind.toJSON() },
            properties: Object.fromEntries(this.metadata),
        };
        return includePrivateData
            ? JSON.parse(JSON.stringify(json))
            : JSON.parse(JSON.stringify(json, (_, value) => value?.isPrivate === true ? undefined : value));
    }
    /**
     * updates Metadata
     * @param key key to update
     * @param value value to update
     */
    updateMetadata(key, value) {
        const update = this.updateMetadataMap(key, value);
        this.updates.push(update);
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTStringUpdate} update data
     */
    update(data) {
        this.updateMetadata(data.key, new PrivateMetadata({
            data: MinaNFT.stringToField(data.value),
            kind: MinaNFT.stringToField(data.kind ?? "string"),
            isPrivate: data.isPrivate ?? false,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTTextUpdate} update data
     */
    updateText(data) {
        const text = new TextData(data.text);
        this.updateMetadata(data.key, new PrivateMetadata({
            data: text.root,
            kind: MinaNFT.stringToField("text"),
            isPrivate: data.isPrivate ?? false,
            linkedObject: text,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTTextUpdate} update data
     */
    updateMap(data) {
        data.map.setRoot();
        this.updateMetadata(data.key, new PrivateMetadata({
            data: data.map.root,
            kind: MinaNFT.stringToField("map"),
            isPrivate: data.isPrivate ?? false,
            linkedObject: data.map,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param params arguments
     * @param params.key key to update
     * @param params.type type of metadata ('file' or 'image' for example)
     * @param params.data {@link FileData} file data
     * @param params.isPrivate is metadata private
     */
    updateFileData(params) {
        const { key, type, data, isPrivate } = params;
        this.updateMetadata(key, new PrivateMetadata({
            data: data.root,
            kind: MinaNFT.stringToField(type ?? "file"),
            isPrivate: isPrivate ?? false,
            linkedObject: data,
        }));
    }
    /**
     * updates PrivateMetadata
     * @param data {@link MinaNFTFieldUpdate} update data
     */
    updateField(data) {
        this.updateMetadata(data.key, {
            data: data.value,
            kind: MinaNFT.stringToField(data.kind ?? "string"),
            isPrivate: data.isPrivate ?? false,
        });
    }
    /**
     * Prepare commit updates of the MinaNFT to blockchain
     *
     * @param commitData {@link MinaNFTPrepareCommit} commit data
     */
    async prepareCommitData(commitData) {
        const { pinataJWT, arweaveKey, generateProofData } = commitData;
        if (this.updates.length !== 0) {
            const transactions = [];
            console.log("Creating transactions...");
            for (const update of this.updates) {
                const state = MetadataTransition.create(update);
                transactions.push({ state, update });
            }
            console.log("Merging states...");
            let mergedState = transactions[0].state;
            for (let i = 1; i < transactions.length; i++) {
                const state = MetadataTransition.merge(mergedState, transactions[i].state);
                mergedState = state;
            }
            if (this.isSomeMetadata &&
                (this.metadataRoot.data.toJSON() !==
                    mergedState.oldRoot.data.toJSON() ||
                    this.metadataRoot.kind.toJSON() !== mergedState.oldRoot.kind.toJSON()))
                throw new Error("Metadata old root data mismatch");
            this.metadataRoot = mergedState.newRoot;
            const storage = await this.pinToStorage(pinataJWT, arweaveKey);
            if (storage === undefined) {
                throw new Error("Storage error");
            }
            this.storage = storage.hash;
            if (generateProofData !== true)
                return undefined;
            const update = new RollupUpdate({
                oldRoot: mergedState.oldRoot,
                newRoot: mergedState.newRoot,
                storage: this.storage,
            });
            const transactionsStr = transactions.map((t) => JSON.stringify({
                state: serializeFields(MetadataTransition.toFields(t.state)),
                update: serializeFields(MetadataUpdate.toFields(t.update)),
            }));
            const updateStr = JSON.stringify({
                update: serializeFields(RollupUpdate.toFields(update)),
            });
            this.isSomeMetadata = true;
            return {
                update: updateStr,
                transactions: transactionsStr,
            };
        }
        else {
            const storage = await this.pinToStorage(pinataJWT, arweaveKey);
            if (storage === undefined) {
                throw new Error("Storage error");
            }
            this.storage = storage.hash;
            if (generateProofData !== true)
                return undefined;
            const update = new RollupUpdate({
                oldRoot: this.metadataRoot,
                newRoot: this.metadataRoot,
                storage: this.storage,
            });
            const updateStr = JSON.stringify({
                update: serializeFields(RollupUpdate.toFields(update)),
            });
            return {
                update: updateStr,
                transactions: [],
            };
        }
    }
    getURL() {
        if (this.storage === undefined)
            return undefined;
        return "https://minanft.io/nft/i" + this.storage.toIpfsHash();
    }
    /**
     * Commit updates of the MinaNFT to blockchain using prepared data
     * Generates recursive proofs for all updates,
     * than verify the proof locally and send the transaction to the blockchain
     * @param preparedCommitData {@link RollupNFTCommitData} commit data
     * @param verbose verbose mode
     * @returns proof {@link MinaNFTMetadataUpdateProof}
     */
    static async generateProof(preparedCommitData, verbose = false) {
        const { update: updateStr, transactions: transactionsStr } = preparedCommitData;
        const transactions = transactionsStr.map((t) => {
            const obj = JSON.parse(t);
            const state = MetadataTransition.fromFields(deserializeFields(obj.state));
            const update = MetadataUpdate.fromFields(deserializeFields(obj.update));
            return { state, update };
        });
        const update = RollupUpdate.fromFields(deserializeFields(JSON.parse(updateStr).update));
        if (MinaNFT.updateVerificationKey === undefined) {
            throw new Error("generateProof: Update verification key is undefined");
        }
        console.log("Creating proofs...");
        const logMsg = `Update proofs created`;
        console.time(logMsg);
        let proofs = [];
        let count = 1;
        for (const transaction of transactions) {
            if (verbose)
                console.log(`Creating proof ${count++}/${transactions.length}`);
            await sleep(100); // alow GC to run
            const proof = await MinaNFTMetadataUpdate.update(transaction.state, transaction.update);
            proofs.push(proof);
        }
        console.log("Merging proofs...");
        let proof = proofs[0];
        count = 1;
        for (let i = 1; i < proofs.length; i++) {
            if (verbose)
                console.log(`Merging proof ${count++}/${proofs.length - 1}`);
            await sleep(100); // alow GC to run
            const state = MetadataTransition.merge(proof.publicInput, proofs[i].publicInput);
            const mergedProof = await MinaNFTMetadataUpdate.merge(state, proof, proofs[i]);
            proof = mergedProof;
        }
        console.time("Update proof verified");
        const verificationResult = await (0,web.verify)(proof.toJSON(), MinaNFT.updateVerificationKey);
        console.timeEnd("Update proof verified");
        console.timeEnd(logMsg);
        console.log("Proof verification result:", verificationResult);
        if (verificationResult === false) {
            throw new Error("Proof verification error");
        }
        return proof;
    }
    /**
     * Pins NFT to IPFS or Arweave
     * @param pinataJWT Pinata JWT
     * @param arweaveKey Arweave key
     * @returns NFT's storage hash and hash string
     */
    async pinToStorage(pinataJWT, arweaveKey) {
        if (pinataJWT === undefined && arweaveKey === undefined) {
            throw new Error("No storage service key provided. Provide pinateJWT or arweaveKey");
        }
        if (pinataJWT !== undefined) {
            console.log("Pinning to IPFS...");
            const ipfs = new IPFS(pinataJWT);
            let hash = await ipfs.pinJSON({
                data: this.toJSON({
                    includePrivateData: false,
                }),
                name: (this.name ? this.name + "-" : "") + "rollup-nft.json",
                keyvalues: {
                    name: this.name,
                    address: this.address?.toBase58(),
                    project: "MinaNFT",
                    type: "metadata",
                    nftType: "RollupNFT",
                },
            });
            if (hash === undefined) {
                console.error("Pinning to IPFS failed. Retrying...");
                await sleep(10000);
                hash = await ipfs.pinJSON({
                    data: this.toJSON({
                        includePrivateData: false,
                    }),
                    name: "rollup-nft.json",
                    keyvalues: {
                        project: "MinaNFT",
                        type: "metadata",
                        nftType: "RollupNFT",
                    },
                });
            }
            if (hash === undefined) {
                console.error("Pinning to IPFS failed");
                return undefined;
            }
            const hashStr = "i:" + hash;
            const ipfs_fields = MinaNFT.stringToFields(hashStr);
            if (ipfs_fields.length !== 2)
                throw new Error("IPFS hash encoding error");
            return {
                hash: new Storage({ hashString: ipfs_fields }),
                hashStr,
            };
        }
        else if (arweaveKey !== undefined) {
            console.log("Pinning to Arweave...");
            const arweave = new ARWEAVE(arweaveKey);
            const hash = await arweave.pinString(JSON.stringify(this.toJSON({
                includePrivateData: false,
            }), null, 2));
            if (hash === undefined)
                return undefined;
            const hashStr = "a:" + hash;
            const arweave_fields = MinaNFT.stringToFields(hashStr);
            if (arweave_fields.length !== 2)
                throw new Error("Arweave hash encoding error");
            return {
                hash: new Storage({ hashString: arweave_fields }),
                hashStr,
            };
        }
        else
            return undefined;
    }
}
//# sourceMappingURL=rollupnft.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/contract-v2/nft.js




let printed = false;
function networkIdHash() {
    const networkId = web.Mina.getNetworkId().toString();
    if (!printed) {
        console.log("NameContractV2 networkId", networkId);
        printed = true;
    }
    return web.Encoding.stringToFields(networkId)[0];
}
const SELL_FEE = 1000000000n;
const TRANSFER_FEE = 1000000000n;
const UPDATE_FEE = 1000000000n;
const wallet = web.PublicKey.fromBase58("B62qq7ecvBQZQK68dwstL27888NEKZJwNXNFjTyu3xpQcfX5UBivCU6");
class MetadataParams extends (0,web.Struct)({
    metadata: Metadata,
    storage: Storage,
}) {
}
class SellParams extends (0,web.Struct)({
    address: web.PublicKey,
    price: web.UInt64,
}) {
}
class BuyParams extends (0,web.Struct)({
    address: web.PublicKey,
    price: web.UInt64,
}) {
}
class TransferParams extends (0,web.Struct)({
    address: web.PublicKey,
    newOwner: web.PublicKey,
}) {
}
class KYCSignatureData extends (0,web.Struct)({
    contract: web.PublicKey,
    address: web.PublicKey,
    price: web.UInt64,
    kycHolder: web.PublicKey,
    networkIdHash: web.Field,
    expiry: web.UInt32,
    sell: web.Bool, // true - sell, false - buy
}) {
}
class MintParams extends (0,web.Struct)({
    name: web.Field,
    address: web.PublicKey,
    owner: web.PublicKey,
    price: web.UInt64,
    fee: web.UInt64,
    feeMaster: web.PublicKey,
    metadataParams: MetadataParams,
    verificationKey: web.VerificationKey,
    signature: web.Signature,
    expiry: web.UInt32,
}) {
}
class MintSignatureData extends (0,web.Struct)({
    contract: web.PublicKey,
    name: web.Field,
    owner: web.PublicKey,
    fee: web.UInt64,
    feeMaster: web.PublicKey,
    networkIdHash: web.Field,
    expiry: web.UInt32,
}) {
}
class MintEvent extends (0,web.Struct)({
    name: web.Field,
    address: web.PublicKey,
    owner: web.PublicKey,
    price: web.UInt64,
    metadataParams: MetadataParams,
}) {
}
class UpdateParams extends (0,web.Struct)({
    address: web.PublicKey,
    metadataParams: MetadataParams,
    // TODO: Update proof with sideloaded verification key??
}) {
}
class NFTparams extends (0,web.Struct)({
    price: web.UInt64,
    version: web.UInt32,
    // TODO: add more fields
    // isUpdated: Bool,
    // isAddedOnly: Bool,
}) {
    pack() {
        const price = this.price.value.toBits(64);
        const version = this.version.value.toBits(32);
        return web.Field.fromBits([...price, ...version]);
    }
    static unpack(packed) {
        const bits = packed.toBits(64 + 32);
        const price = web.UInt64.from(0);
        price.value = web.Field.fromBits(bits.slice(0, 64));
        const version = web.UInt32.from(0);
        version.value = web.Field.fromBits(bits.slice(64, 64 + 32));
        return new NFTparams({ price, version });
    }
}
class NFTContractV2 extends web.SmartContract {
    constructor() {
        super(...arguments);
        this.name = (0,web.State)();
        this.metadataParams = (0,web.State)();
        this.owner = (0,web.State)();
        this.data = (0,web.State)();
    }
    async update(params, sender) {
        const { metadataParams } = params;
        this.owner.getAndRequireEquals().assertEquals(sender);
        this.metadataParams.set(metadataParams);
        const data = NFTparams.unpack(this.data.getAndRequireEquals());
        this.data.set(new NFTparams({
            price: data.price,
            version: data.version.add(1),
        }).pack());
    }
    async sell(price, sender) {
        this.owner.getAndRequireEquals().assertEquals(sender);
        const data = NFTparams.unpack(this.data.getAndRequireEquals());
        this.data.set(new NFTparams({
            price: price,
            version: data.version.add(1),
        }).pack());
    }
    async buy(price, buyer) {
        const owner = this.owner.getAndRequireEquals();
        const data = NFTparams.unpack(this.data.getAndRequireEquals());
        data.price.equals(web.UInt64.from(0)).assertFalse(); // the NFT is for sale
        data.price.assertEquals(price); // price is correct
        this.owner.set(buyer);
        this.data.set(new NFTparams({
            price: web.UInt64.from(0),
            version: data.version.add(1),
        }).pack());
        return owner;
    }
    async transferNFT(newOwner, sender) {
        this.owner.getAndRequireEquals().assertEquals(sender);
        const data = NFTparams.unpack(this.data.getAndRequireEquals());
        this.owner.set(newOwner);
        this.data.set(new NFTparams({
            price: web.UInt64.from(0),
            version: data.version.add(1),
        }).pack());
    }
}
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], NFTContractV2.prototype, "name", void 0);
__decorate([
    (0,web.state)(MetadataParams),
    __metadata("design:type", Object)
], NFTContractV2.prototype, "metadataParams", void 0);
__decorate([
    (0,web.state)(web.PublicKey),
    __metadata("design:type", Object)
], NFTContractV2.prototype, "owner", void 0);
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], NFTContractV2.prototype, "data", void 0);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateParams, web.PublicKey]),
    __metadata("design:returntype", Promise)
], NFTContractV2.prototype, "update", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.UInt64, web.PublicKey]),
    __metadata("design:returntype", Promise)
], NFTContractV2.prototype, "sell", null);
__decorate([
    web.method.returns(web.PublicKey),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.UInt64, web.PublicKey]),
    __metadata("design:returntype", Promise)
], NFTContractV2.prototype, "buy", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey, web.PublicKey]),
    __metadata("design:returntype", Promise)
], NFTContractV2.prototype, "transferNFT", null);
class NameContractV2 extends web.TokenContract {
    constructor() {
        super(...arguments);
        this.priceLimit = (0,web.State)();
        this.oracle = (0,web.State)();
        this.verificationKeyHash = (0,web.State)(); // TODO: create test with wrong verification key
        this.events = {
            mint: MintEvent,
            update: UpdateParams,
            sell: SellParams,
            buy: BuyParams,
            transfer: TransferParams,
            oracle: web.PublicKey,
            limit: web.UInt64,
            verificationKey: web.Field,
        };
    }
    async deploy(args) {
        super.deploy(args);
        this.account.permissions.set({
            ...web.Permissions.default(),
            editState: web.Permissions.signature(),
        });
    }
    async approveBase(forest) {
        throw Error("transfers of tokens are not allowed, change the owner instead");
    }
    async setOracle(oracle) {
        this.oracle.set(oracle);
        this.emitEvent("oracle", oracle);
    }
    async setPriceLimit(limit) {
        this.priceLimit.set(limit);
        this.emitEvent("limit", limit);
    }
    async setVerificationKeyHash(verificationKeyHash) {
        this.verificationKeyHash.set(verificationKeyHash);
        this.emitEvent("verificationKey", verificationKeyHash);
    }
    async mint(params) {
        const { name, address, owner, price, fee, feeMaster, metadataParams, verificationKey, signature, expiry, } = params;
        // TODO: add time limit to the signature
        const oracle = this.oracle.getAndRequireEquals();
        const sender = this.sender.getUnconstrained();
        this.network.globalSlotSinceGenesis.requireBetween(web.UInt32.from(0), expiry);
        signature
            .verify(oracle, MintSignatureData.toFields(new MintSignatureData({
            contract: this.address,
            owner,
            name,
            fee,
            feeMaster,
            networkIdHash: networkIdHash(),
            expiry,
        })))
            .assertEquals(true);
        this.verificationKeyHash
            .getAndRequireEquals()
            .assertEquals(verificationKey.hash);
        const tokenId = this.deriveTokenId();
        const update = web.AccountUpdate.createSigned(address, tokenId);
        update.account.isNew.getAndRequireEquals().assertTrue();
        const senderUpdate = web.AccountUpdate.createSigned(sender);
        // AccountUpdate.fundNewAccount(sender);
        senderUpdate.label = "AccountUpdate.fundNewAccount()";
        senderUpdate.balance.subInPlace(1_000_000_000);
        senderUpdate.send({ to: feeMaster, amount: fee });
        this.internal.mint({ address: update, amount: 1_000_000_000 });
        update.body.update.verificationKey = {
            isSome: (0,web.Bool)(true),
            value: verificationKey,
        };
        update.body.update.permissions = {
            isSome: (0,web.Bool)(true),
            value: {
                ...web.Permissions.default(),
            },
        };
        const state = [
            name,
            ...MetadataParams.toFields(metadataParams),
            ...owner.toFields(),
            new NFTparams({
                price,
                version: web.UInt32.from(1),
            }).pack(),
        ];
        update.body.update.appState = state.map((field) => ({
            isSome: (0,web.Bool)(true),
            value: field,
        }));
        this.emitEvent("mint", {
            name,
            address,
            owner,
            price,
            metadataParams,
        });
    }
    async update(params) {
        const { address } = params;
        const sender = this.sender.getUnconstrained();
        const ownerUpdate = web.AccountUpdate.createSigned(sender);
        ownerUpdate.send({ to: wallet, amount: UPDATE_FEE });
        const tokenId = this.deriveTokenId();
        const nft = new NFTContractV2(address, tokenId);
        await nft.update(params, sender);
        this.emitEvent("update", params);
    }
    async sell(params) {
        params.price.assertLessThanOrEqual(this.priceLimit.getAndRequireEquals());
        const sender = this.sender.getUnconstrained();
        await this.internalSell(params, sender);
    }
    async sellWithKYC(params, signature, expiry) {
        const oracle = this.oracle.getAndRequireEquals();
        const sender = this.sender.getUnconstrained();
        this.network.globalSlotSinceGenesis.requireBetween(web.UInt32.from(0), expiry);
        signature
            .verify(oracle, KYCSignatureData.toFields(new KYCSignatureData({
            contract: this.address,
            address: params.address,
            price: params.price,
            kycHolder: sender,
            networkIdHash: networkIdHash(),
            expiry,
            sell: (0,web.Bool)(true),
        })))
            .assertEquals(true);
        await this.internalSell(params, sender);
    }
    async buy(params) {
        params.price.assertLessThanOrEqual(this.priceLimit.getAndRequireEquals());
        await this.internalBuy(params);
    }
    async buyWithKYC(params, signature, expiry) {
        this.network.globalSlotSinceGenesis.requireBetween(web.UInt32.from(0), expiry);
        signature
            .verify(this.oracle.getAndRequireEquals(), KYCSignatureData.toFields(new KYCSignatureData({
            contract: this.address,
            address: params.address,
            price: params.price,
            kycHolder: this.sender.getAndRequireSignature(),
            networkIdHash: networkIdHash(),
            expiry,
            sell: (0,web.Bool)(false),
        })))
            .assertEquals(true);
        await this.internalBuy(params);
    }
    async internalSell(params, sender) {
        const { address, price } = params;
        const ownerUpdate = web.AccountUpdate.createSigned(sender);
        ownerUpdate.send({ to: wallet, amount: SELL_FEE });
        const tokenId = this.deriveTokenId();
        const nft = new NFTContractV2(address, tokenId);
        await nft.sell(price, sender);
        this.emitEvent("sell", params);
    }
    async internalBuy(params) {
        const { address, price } = params;
        const buyer = this.sender.getUnconstrained();
        const buyerUpdate = web.AccountUpdate.createSigned(buyer);
        const tokenId = this.deriveTokenId();
        const nft = new NFTContractV2(address, tokenId);
        const seller = await nft.buy(price, buyer);
        const commission = price.div(web.UInt64.from(10));
        const payment = price.sub(commission);
        buyerUpdate.send({ to: seller, amount: payment });
        buyerUpdate.send({ to: wallet, amount: commission });
        this.emitEvent("buy", params);
    }
    /*
    private mintPrice(name: Field): UInt64 {
      const price: UInt64 = Provable.if(
        name.greaterThan(Field(BigInt(2 ** 43))),
        UInt64.from(10_000_000_000n),
        Provable.if(
          name.lessThan(Field(BigInt(2 ** 27))),
          UInt64.from(99_000_000_000n),
          UInt64.from(19_000_000_000n)
        )
      );
      return price;
    }
    */
    async transferNFT(params) {
        const { address, newOwner } = params;
        const sender = this.sender.getUnconstrained();
        const ownerUpdate = web.AccountUpdate.createSigned(sender);
        ownerUpdate.send({ to: wallet, amount: TRANSFER_FEE });
        const tokenId = this.deriveTokenId();
        const nft = new NFTContractV2(address, tokenId);
        await nft.transferNFT(newOwner, sender);
        this.emitEvent("transfer", params);
    }
}
__decorate([
    (0,web.state)(web.UInt64),
    __metadata("design:type", Object)
], NameContractV2.prototype, "priceLimit", void 0);
__decorate([
    (0,web.state)(web.PublicKey),
    __metadata("design:type", Object)
], NameContractV2.prototype, "oracle", void 0);
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], NameContractV2.prototype, "verificationKeyHash", void 0);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.PublicKey]),
    __metadata("design:returntype", Promise)
], NameContractV2.prototype, "setOracle", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.UInt64]),
    __metadata("design:returntype", Promise)
], NameContractV2.prototype, "setPriceLimit", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.Field]),
    __metadata("design:returntype", Promise)
], NameContractV2.prototype, "setVerificationKeyHash", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MintParams]),
    __metadata("design:returntype", Promise)
], NameContractV2.prototype, "mint", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateParams]),
    __metadata("design:returntype", Promise)
], NameContractV2.prototype, "update", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SellParams]),
    __metadata("design:returntype", Promise)
], NameContractV2.prototype, "sell", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SellParams,
        web.Signature,
        web.UInt32]),
    __metadata("design:returntype", Promise)
], NameContractV2.prototype, "sellWithKYC", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BuyParams]),
    __metadata("design:returntype", Promise)
], NameContractV2.prototype, "buy", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BuyParams,
        web.Signature,
        web.UInt32]),
    __metadata("design:returntype", Promise)
], NameContractV2.prototype, "buyWithKYC", null);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TransferParams]),
    __metadata("design:returntype", Promise)
], NameContractV2.prototype, "transferNFT", null);
//# sourceMappingURL=nft.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/contract-v2/sign-test.js


class SignTestContract extends web.SmartContract {
    constructor() {
        super(...arguments);
        this.value = (0,web.State)();
    }
    async setValue(value) {
        this.value.set(value);
    }
}
__decorate([
    (0,web.state)(web.Field),
    __metadata("design:type", Object)
], SignTestContract.prototype, "value", void 0);
__decorate([
    web.method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [web.Field]),
    __metadata("design:returntype", Promise)
], SignTestContract.prototype, "setValue", null);
//# sourceMappingURL=sign-test.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/minanftnames2.js






class MinaNFTNameServiceV2 {
    /**
     * Create MinaNFTNameService object
     * @param value Object with address and oraclePrivateKey fields
     * @param value.address Public key of the deployed Names Service
     * @param value.oraclePrivateKey Private key of the oracle
     */
    constructor(value) {
        this.address = value.address;
        this.oraclePrivateKey = value.oraclePrivateKey;
        this.priceLimit = value.priceLimit;
    }
    async deploy(params) {
        const { deployer, privateKey, nonce } = params;
        const sender = deployer.toPublicKey();
        if (this.oraclePrivateKey === undefined)
            throw new Error("Oracle private key is not set");
        if (this.priceLimit === undefined)
            throw new Error("Price limit is not set");
        const oracle = this.oraclePrivateKey.toPublicKey();
        const zkAppPrivateKey = privateKey ?? web.PrivateKey.random();
        const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
        console.log(`deploying the NameContractV2 to an address ${zkAppPublicKey.toBase58()} using the deployer with public key ${sender.toBase58()}...`);
        console.time(`compiled`);
        const verificationKey = (await NFTContractV2.compile()).verificationKey;
        const vk = (await NameContractV2.compile()).verificationKey;
        console.timeEnd(`compiled`);
        console.log(`vk hash: ${vk.hash.toJSON()}`);
        const zkApp = new NameContractV2(zkAppPublicKey);
        await fetchMinaAccount({ publicKey: sender });
        const deployNonce = nonce ?? Number(web.Mina.getAccount(sender).nonce.toBigint());
        const hasAccount = web.Mina.hasAccount(zkAppPublicKey);
        const transaction = await web.Mina.transaction({
            sender,
            fee: await MinaNFT.fee(),
            memo: "deploy minanft.io",
            nonce: deployNonce,
        }, async () => {
            if (!hasAccount)
                web.AccountUpdate.fundNewAccount(sender);
            await zkApp.deploy({});
            zkApp.oracle.set(oracle);
            zkApp.priceLimit.set(this.priceLimit);
            zkApp.account.zkappUri.set("https://minanft.io");
            zkApp.account.tokenSymbol.set("NFT");
            zkApp.verificationKeyHash.set(verificationKey.hash);
        });
        transaction.sign([deployer, zkAppPrivateKey]);
        const tx = await transaction.send();
        await MinaNFT.transactionInfo(tx, "name service deploy", false);
        if (tx.status === "pending") {
            this.address = zkAppPublicKey;
            this.tokenId = zkApp.deriveTokenId();
            return tx;
        }
        else
            return undefined;
    }
    async upgrade(params) {
        const { deployer, privateKey, nonce } = params;
        const sender = deployer.toPublicKey();
        if (this.address === undefined)
            throw new Error("Address is not set");
        const zkAppPrivateKey = privateKey;
        const zkAppPublicKey = zkAppPrivateKey.toPublicKey();
        if (this.address.toBase58() !== zkAppPublicKey.toBase58())
            throw new Error("Address mismatch");
        console.time(`compiled`);
        const verificationKey = (await NFTContractV2.compile()).verificationKey;
        const vk = (await NameContractV2.compile()).verificationKey;
        console.timeEnd(`compiled`);
        console.log(`vk hash: ${vk.hash.toJSON()}`);
        const zkApp = new NameContractV2(zkAppPublicKey);
        console.log(`upgrading the NameContractV2 on address ${zkAppPublicKey.toBase58()} using the deployer with public key ${sender.toBase58()}...`);
        await fetchMinaAccount({ publicKey: sender });
        await fetchMinaAccount({ publicKey: zkAppPublicKey });
        const deployNonce = nonce ?? Number(web.Mina.getAccount(sender).nonce.toBigint());
        const hasAccount = web.Mina.hasAccount(zkAppPublicKey);
        if (!hasAccount)
            throw new Error("Account does not exist");
        const transaction = await web.Mina.transaction({
            sender,
            fee: await MinaNFT.fee(),
            memo: "upgrade minanft.io 1/2",
            nonce: deployNonce,
        }, async () => {
            const update = web.AccountUpdate.createSigned(zkAppPublicKey);
            update.account.verificationKey.set(vk);
        });
        transaction.sign([deployer, zkAppPrivateKey]);
        const tx1 = await transaction.send();
        await MinaNFT.transactionInfo(tx1, "name service upgrade 1/2", false);
        if (tx1.status === "pending") {
            this.address = zkAppPublicKey;
            this.tokenId = zkApp.deriveTokenId();
        }
        else
            return undefined;
        const tx1included = await tx1.wait({ maxAttempts: 1000 });
        await sleep(10000);
        await fetchMinaAccount({ publicKey: sender });
        await fetchMinaAccount({ publicKey: zkAppPublicKey });
        const transaction2 = await web.Mina.transaction({
            sender,
            fee: await MinaNFT.fee(),
            memo: "upgrade minanft.io 2/2",
            nonce: deployNonce,
        }, async () => {
            await zkApp.setVerificationKeyHash(verificationKey.hash);
        });
        transaction2.sign([deployer, zkAppPrivateKey]);
        await transaction2.prove();
        const tx2 = await transaction2.send();
        await MinaNFT.transactionInfo(tx2, "name service upgrade 2/2", false);
        const tx2included = await tx2.wait({ maxAttempts: 1000 });
        return { tx1included, tx2included };
    }
    async issueNameSignature(params) {
        const { fee, feeMaster, owner, name, chain, expiryInBlocks } = params;
        if (this.address === undefined)
            throw new Error("Names service address is not set");
        if (this.oraclePrivateKey === undefined)
            throw new Error("Oracle is not set");
        const networkId = web.Mina.getNetworkId();
        if (chain === "mainnet" && networkId !== "mainnet")
            throw new Error("Network mismatch at issueNameSignature");
        const lastBlock = await (0,web.fetchLastBlock)();
        console.log(`${chain} globalSlotSinceGenesis:`, lastBlock.globalSlotSinceGenesis.toBigint());
        const expiry = lastBlock.globalSlotSinceGenesis.add(web.UInt32.from(expiryInBlocks));
        /*
        const { oracle, contract, address, fee, feeMaster, owner, name, expiry } =
        params;
        */
        return {
            signature: web.Signature.create(this.oraclePrivateKey, MintSignatureData.toFields(new MintSignatureData({
                fee,
                feeMaster,
                name,
                owner,
                contract: this.address,
                networkIdHash: networkIdHash(),
                expiry,
            }))),
            expiry,
        };
    }
}
//# sourceMappingURL=minanftnames2.js.map
;// CONCATENATED MODULE: ./node_modules/minanft/lib/web/src/index.js










































const NAMES_ORACLE = "B62qids6rU9iqjvBV4DHxW8z67mgHFws1rPmFoqpcyRq2arYxUw6sZu";
const src_MINANFT_NAME_SERVICE = "B62qrryunX2LzaZ1sGtqfJqzSdNdN7pVSZw8YtnxQNxrrF9Vt56bNFT";
const VERIFICATION_KEY_HASH = "9689101879662038518187439125596529724359011056818448961374724346336569336054";
const VERIFIER = "B62qqzwDxiH172SXE4SUVYsNV2FteL2UeYFsjRqF4Qf42KnE1q1VNFT";
const { MINANFT_NAME_SERVICE_V2, VERIFICATION_KEY_V2_JSON } = src_config;

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6463:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _client_components_navigation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1169);
/* harmony import */ var _client_components_navigation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_client_components_navigation__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (checked) */ if(__webpack_require__.o(_client_components_navigation__WEBPACK_IMPORTED_MODULE_0__, "useRouter")) __webpack_require__.d(__webpack_exports__, { useRouter: function() { return _client_components_navigation__WEBPACK_IMPORTED_MODULE_0__.useRouter; } });


//# sourceMappingURL=navigation.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var _global_process, _global_process1;
module.exports = ((_global_process = __webpack_require__.g.process) == null ? void 0 : _global_process.env) && typeof ((_global_process1 = __webpack_require__.g.process) == null ? void 0 : _global_process1.env) === "object" ? __webpack_require__.g.process : __webpack_require__(8081);

//# sourceMappingURL=process.js.map

/***/ }),

/***/ 6300:
/***/ (function(module) {

var __dirname = "/";
(function(){var e={675:function(e,r){"use strict";r.byteLength=byteLength;r.toByteArray=toByteArray;r.fromByteArray=fromByteArray;var t=[];var f=[];var n=typeof Uint8Array!=="undefined"?Uint8Array:Array;var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var o=0,u=i.length;o<u;++o){t[o]=i[o];f[i.charCodeAt(o)]=o}f["-".charCodeAt(0)]=62;f["_".charCodeAt(0)]=63;function getLens(e){var r=e.length;if(r%4>0){throw new Error("Invalid string. Length must be a multiple of 4")}var t=e.indexOf("=");if(t===-1)t=r;var f=t===r?0:4-t%4;return[t,f]}function byteLength(e){var r=getLens(e);var t=r[0];var f=r[1];return(t+f)*3/4-f}function _byteLength(e,r,t){return(r+t)*3/4-t}function toByteArray(e){var r;var t=getLens(e);var i=t[0];var o=t[1];var u=new n(_byteLength(e,i,o));var a=0;var s=o>0?i-4:i;var h;for(h=0;h<s;h+=4){r=f[e.charCodeAt(h)]<<18|f[e.charCodeAt(h+1)]<<12|f[e.charCodeAt(h+2)]<<6|f[e.charCodeAt(h+3)];u[a++]=r>>16&255;u[a++]=r>>8&255;u[a++]=r&255}if(o===2){r=f[e.charCodeAt(h)]<<2|f[e.charCodeAt(h+1)]>>4;u[a++]=r&255}if(o===1){r=f[e.charCodeAt(h)]<<10|f[e.charCodeAt(h+1)]<<4|f[e.charCodeAt(h+2)]>>2;u[a++]=r>>8&255;u[a++]=r&255}return u}function tripletToBase64(e){return t[e>>18&63]+t[e>>12&63]+t[e>>6&63]+t[e&63]}function encodeChunk(e,r,t){var f;var n=[];for(var i=r;i<t;i+=3){f=(e[i]<<16&16711680)+(e[i+1]<<8&65280)+(e[i+2]&255);n.push(tripletToBase64(f))}return n.join("")}function fromByteArray(e){var r;var f=e.length;var n=f%3;var i=[];var o=16383;for(var u=0,a=f-n;u<a;u+=o){i.push(encodeChunk(e,u,u+o>a?a:u+o))}if(n===1){r=e[f-1];i.push(t[r>>2]+t[r<<4&63]+"==")}else if(n===2){r=(e[f-2]<<8)+e[f-1];i.push(t[r>>10]+t[r>>4&63]+t[r<<2&63]+"=")}return i.join("")}},72:function(e,r,t){"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var f=t(675);var n=t(783);var i=typeof Symbol==="function"&&typeof Symbol.for==="function"?Symbol.for("nodejs.util.inspect.custom"):null;r.Buffer=Buffer;r.SlowBuffer=SlowBuffer;r.INSPECT_MAX_BYTES=50;var o=2147483647;r.kMaxLength=o;Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport();if(!Buffer.TYPED_ARRAY_SUPPORT&&typeof console!=="undefined"&&typeof console.error==="function"){console.error("This browser lacks typed array (Uint8Array) support which is required by "+"`buffer` v5.x. Use `buffer` v4.x if you require old browser support.")}function typedArraySupport(){try{var e=new Uint8Array(1);var r={foo:function(){return 42}};Object.setPrototypeOf(r,Uint8Array.prototype);Object.setPrototypeOf(e,r);return e.foo()===42}catch(e){return false}}Object.defineProperty(Buffer.prototype,"parent",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.buffer}});Object.defineProperty(Buffer.prototype,"offset",{enumerable:true,get:function(){if(!Buffer.isBuffer(this))return undefined;return this.byteOffset}});function createBuffer(e){if(e>o){throw new RangeError('The value "'+e+'" is invalid for option "size"')}var r=new Uint8Array(e);Object.setPrototypeOf(r,Buffer.prototype);return r}function Buffer(e,r,t){if(typeof e==="number"){if(typeof r==="string"){throw new TypeError('The "string" argument must be of type string. Received type number')}return allocUnsafe(e)}return from(e,r,t)}Buffer.poolSize=8192;function from(e,r,t){if(typeof e==="string"){return fromString(e,r)}if(ArrayBuffer.isView(e)){return fromArrayLike(e)}if(e==null){throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof e)}if(isInstance(e,ArrayBuffer)||e&&isInstance(e.buffer,ArrayBuffer)){return fromArrayBuffer(e,r,t)}if(typeof SharedArrayBuffer!=="undefined"&&(isInstance(e,SharedArrayBuffer)||e&&isInstance(e.buffer,SharedArrayBuffer))){return fromArrayBuffer(e,r,t)}if(typeof e==="number"){throw new TypeError('The "value" argument must not be of type number. Received type number')}var f=e.valueOf&&e.valueOf();if(f!=null&&f!==e){return Buffer.from(f,r,t)}var n=fromObject(e);if(n)return n;if(typeof Symbol!=="undefined"&&Symbol.toPrimitive!=null&&typeof e[Symbol.toPrimitive]==="function"){return Buffer.from(e[Symbol.toPrimitive]("string"),r,t)}throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, "+"or Array-like Object. Received type "+typeof e)}Buffer.from=function(e,r,t){return from(e,r,t)};Object.setPrototypeOf(Buffer.prototype,Uint8Array.prototype);Object.setPrototypeOf(Buffer,Uint8Array);function assertSize(e){if(typeof e!=="number"){throw new TypeError('"size" argument must be of type number')}else if(e<0){throw new RangeError('The value "'+e+'" is invalid for option "size"')}}function alloc(e,r,t){assertSize(e);if(e<=0){return createBuffer(e)}if(r!==undefined){return typeof t==="string"?createBuffer(e).fill(r,t):createBuffer(e).fill(r)}return createBuffer(e)}Buffer.alloc=function(e,r,t){return alloc(e,r,t)};function allocUnsafe(e){assertSize(e);return createBuffer(e<0?0:checked(e)|0)}Buffer.allocUnsafe=function(e){return allocUnsafe(e)};Buffer.allocUnsafeSlow=function(e){return allocUnsafe(e)};function fromString(e,r){if(typeof r!=="string"||r===""){r="utf8"}if(!Buffer.isEncoding(r)){throw new TypeError("Unknown encoding: "+r)}var t=byteLength(e,r)|0;var f=createBuffer(t);var n=f.write(e,r);if(n!==t){f=f.slice(0,n)}return f}function fromArrayLike(e){var r=e.length<0?0:checked(e.length)|0;var t=createBuffer(r);for(var f=0;f<r;f+=1){t[f]=e[f]&255}return t}function fromArrayBuffer(e,r,t){if(r<0||e.byteLength<r){throw new RangeError('"offset" is outside of buffer bounds')}if(e.byteLength<r+(t||0)){throw new RangeError('"length" is outside of buffer bounds')}var f;if(r===undefined&&t===undefined){f=new Uint8Array(e)}else if(t===undefined){f=new Uint8Array(e,r)}else{f=new Uint8Array(e,r,t)}Object.setPrototypeOf(f,Buffer.prototype);return f}function fromObject(e){if(Buffer.isBuffer(e)){var r=checked(e.length)|0;var t=createBuffer(r);if(t.length===0){return t}e.copy(t,0,0,r);return t}if(e.length!==undefined){if(typeof e.length!=="number"||numberIsNaN(e.length)){return createBuffer(0)}return fromArrayLike(e)}if(e.type==="Buffer"&&Array.isArray(e.data)){return fromArrayLike(e.data)}}function checked(e){if(e>=o){throw new RangeError("Attempt to allocate Buffer larger than maximum "+"size: 0x"+o.toString(16)+" bytes")}return e|0}function SlowBuffer(e){if(+e!=e){e=0}return Buffer.alloc(+e)}Buffer.isBuffer=function isBuffer(e){return e!=null&&e._isBuffer===true&&e!==Buffer.prototype};Buffer.compare=function compare(e,r){if(isInstance(e,Uint8Array))e=Buffer.from(e,e.offset,e.byteLength);if(isInstance(r,Uint8Array))r=Buffer.from(r,r.offset,r.byteLength);if(!Buffer.isBuffer(e)||!Buffer.isBuffer(r)){throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array')}if(e===r)return 0;var t=e.length;var f=r.length;for(var n=0,i=Math.min(t,f);n<i;++n){if(e[n]!==r[n]){t=e[n];f=r[n];break}}if(t<f)return-1;if(f<t)return 1;return 0};Buffer.isEncoding=function isEncoding(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return true;default:return false}};Buffer.concat=function concat(e,r){if(!Array.isArray(e)){throw new TypeError('"list" argument must be an Array of Buffers')}if(e.length===0){return Buffer.alloc(0)}var t;if(r===undefined){r=0;for(t=0;t<e.length;++t){r+=e[t].length}}var f=Buffer.allocUnsafe(r);var n=0;for(t=0;t<e.length;++t){var i=e[t];if(isInstance(i,Uint8Array)){i=Buffer.from(i)}if(!Buffer.isBuffer(i)){throw new TypeError('"list" argument must be an Array of Buffers')}i.copy(f,n);n+=i.length}return f};function byteLength(e,r){if(Buffer.isBuffer(e)){return e.length}if(ArrayBuffer.isView(e)||isInstance(e,ArrayBuffer)){return e.byteLength}if(typeof e!=="string"){throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. '+"Received type "+typeof e)}var t=e.length;var f=arguments.length>2&&arguments[2]===true;if(!f&&t===0)return 0;var n=false;for(;;){switch(r){case"ascii":case"latin1":case"binary":return t;case"utf8":case"utf-8":return utf8ToBytes(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return t*2;case"hex":return t>>>1;case"base64":return base64ToBytes(e).length;default:if(n){return f?-1:utf8ToBytes(e).length}r=(""+r).toLowerCase();n=true}}}Buffer.byteLength=byteLength;function slowToString(e,r,t){var f=false;if(r===undefined||r<0){r=0}if(r>this.length){return""}if(t===undefined||t>this.length){t=this.length}if(t<=0){return""}t>>>=0;r>>>=0;if(t<=r){return""}if(!e)e="utf8";while(true){switch(e){case"hex":return hexSlice(this,r,t);case"utf8":case"utf-8":return utf8Slice(this,r,t);case"ascii":return asciiSlice(this,r,t);case"latin1":case"binary":return latin1Slice(this,r,t);case"base64":return base64Slice(this,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,r,t);default:if(f)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase();f=true}}}Buffer.prototype._isBuffer=true;function swap(e,r,t){var f=e[r];e[r]=e[t];e[t]=f}Buffer.prototype.swap16=function swap16(){var e=this.length;if(e%2!==0){throw new RangeError("Buffer size must be a multiple of 16-bits")}for(var r=0;r<e;r+=2){swap(this,r,r+1)}return this};Buffer.prototype.swap32=function swap32(){var e=this.length;if(e%4!==0){throw new RangeError("Buffer size must be a multiple of 32-bits")}for(var r=0;r<e;r+=4){swap(this,r,r+3);swap(this,r+1,r+2)}return this};Buffer.prototype.swap64=function swap64(){var e=this.length;if(e%8!==0){throw new RangeError("Buffer size must be a multiple of 64-bits")}for(var r=0;r<e;r+=8){swap(this,r,r+7);swap(this,r+1,r+6);swap(this,r+2,r+5);swap(this,r+3,r+4)}return this};Buffer.prototype.toString=function toString(){var e=this.length;if(e===0)return"";if(arguments.length===0)return utf8Slice(this,0,e);return slowToString.apply(this,arguments)};Buffer.prototype.toLocaleString=Buffer.prototype.toString;Buffer.prototype.equals=function equals(e){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(this===e)return true;return Buffer.compare(this,e)===0};Buffer.prototype.inspect=function inspect(){var e="";var t=r.INSPECT_MAX_BYTES;e=this.toString("hex",0,t).replace(/(.{2})/g,"$1 ").trim();if(this.length>t)e+=" ... ";return"<Buffer "+e+">"};if(i){Buffer.prototype[i]=Buffer.prototype.inspect}Buffer.prototype.compare=function compare(e,r,t,f,n){if(isInstance(e,Uint8Array)){e=Buffer.from(e,e.offset,e.byteLength)}if(!Buffer.isBuffer(e)){throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. '+"Received type "+typeof e)}if(r===undefined){r=0}if(t===undefined){t=e?e.length:0}if(f===undefined){f=0}if(n===undefined){n=this.length}if(r<0||t>e.length||f<0||n>this.length){throw new RangeError("out of range index")}if(f>=n&&r>=t){return 0}if(f>=n){return-1}if(r>=t){return 1}r>>>=0;t>>>=0;f>>>=0;n>>>=0;if(this===e)return 0;var i=n-f;var o=t-r;var u=Math.min(i,o);var a=this.slice(f,n);var s=e.slice(r,t);for(var h=0;h<u;++h){if(a[h]!==s[h]){i=a[h];o=s[h];break}}if(i<o)return-1;if(o<i)return 1;return 0};function bidirectionalIndexOf(e,r,t,f,n){if(e.length===0)return-1;if(typeof t==="string"){f=t;t=0}else if(t>2147483647){t=2147483647}else if(t<-2147483648){t=-2147483648}t=+t;if(numberIsNaN(t)){t=n?0:e.length-1}if(t<0)t=e.length+t;if(t>=e.length){if(n)return-1;else t=e.length-1}else if(t<0){if(n)t=0;else return-1}if(typeof r==="string"){r=Buffer.from(r,f)}if(Buffer.isBuffer(r)){if(r.length===0){return-1}return arrayIndexOf(e,r,t,f,n)}else if(typeof r==="number"){r=r&255;if(typeof Uint8Array.prototype.indexOf==="function"){if(n){return Uint8Array.prototype.indexOf.call(e,r,t)}else{return Uint8Array.prototype.lastIndexOf.call(e,r,t)}}return arrayIndexOf(e,[r],t,f,n)}throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(e,r,t,f,n){var i=1;var o=e.length;var u=r.length;if(f!==undefined){f=String(f).toLowerCase();if(f==="ucs2"||f==="ucs-2"||f==="utf16le"||f==="utf-16le"){if(e.length<2||r.length<2){return-1}i=2;o/=2;u/=2;t/=2}}function read(e,r){if(i===1){return e[r]}else{return e.readUInt16BE(r*i)}}var a;if(n){var s=-1;for(a=t;a<o;a++){if(read(e,a)===read(r,s===-1?0:a-s)){if(s===-1)s=a;if(a-s+1===u)return s*i}else{if(s!==-1)a-=a-s;s=-1}}}else{if(t+u>o)t=o-u;for(a=t;a>=0;a--){var h=true;for(var c=0;c<u;c++){if(read(e,a+c)!==read(r,c)){h=false;break}}if(h)return a}}return-1}Buffer.prototype.includes=function includes(e,r,t){return this.indexOf(e,r,t)!==-1};Buffer.prototype.indexOf=function indexOf(e,r,t){return bidirectionalIndexOf(this,e,r,t,true)};Buffer.prototype.lastIndexOf=function lastIndexOf(e,r,t){return bidirectionalIndexOf(this,e,r,t,false)};function hexWrite(e,r,t,f){t=Number(t)||0;var n=e.length-t;if(!f){f=n}else{f=Number(f);if(f>n){f=n}}var i=r.length;if(f>i/2){f=i/2}for(var o=0;o<f;++o){var u=parseInt(r.substr(o*2,2),16);if(numberIsNaN(u))return o;e[t+o]=u}return o}function utf8Write(e,r,t,f){return blitBuffer(utf8ToBytes(r,e.length-t),e,t,f)}function asciiWrite(e,r,t,f){return blitBuffer(asciiToBytes(r),e,t,f)}function latin1Write(e,r,t,f){return asciiWrite(e,r,t,f)}function base64Write(e,r,t,f){return blitBuffer(base64ToBytes(r),e,t,f)}function ucs2Write(e,r,t,f){return blitBuffer(utf16leToBytes(r,e.length-t),e,t,f)}Buffer.prototype.write=function write(e,r,t,f){if(r===undefined){f="utf8";t=this.length;r=0}else if(t===undefined&&typeof r==="string"){f=r;t=this.length;r=0}else if(isFinite(r)){r=r>>>0;if(isFinite(t)){t=t>>>0;if(f===undefined)f="utf8"}else{f=t;t=undefined}}else{throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")}var n=this.length-r;if(t===undefined||t>n)t=n;if(e.length>0&&(t<0||r<0)||r>this.length){throw new RangeError("Attempt to write outside buffer bounds")}if(!f)f="utf8";var i=false;for(;;){switch(f){case"hex":return hexWrite(this,e,r,t);case"utf8":case"utf-8":return utf8Write(this,e,r,t);case"ascii":return asciiWrite(this,e,r,t);case"latin1":case"binary":return latin1Write(this,e,r,t);case"base64":return base64Write(this,e,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,e,r,t);default:if(i)throw new TypeError("Unknown encoding: "+f);f=(""+f).toLowerCase();i=true}}};Buffer.prototype.toJSON=function toJSON(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function base64Slice(e,r,t){if(r===0&&t===e.length){return f.fromByteArray(e)}else{return f.fromByteArray(e.slice(r,t))}}function utf8Slice(e,r,t){t=Math.min(e.length,t);var f=[];var n=r;while(n<t){var i=e[n];var o=null;var u=i>239?4:i>223?3:i>191?2:1;if(n+u<=t){var a,s,h,c;switch(u){case 1:if(i<128){o=i}break;case 2:a=e[n+1];if((a&192)===128){c=(i&31)<<6|a&63;if(c>127){o=c}}break;case 3:a=e[n+1];s=e[n+2];if((a&192)===128&&(s&192)===128){c=(i&15)<<12|(a&63)<<6|s&63;if(c>2047&&(c<55296||c>57343)){o=c}}break;case 4:a=e[n+1];s=e[n+2];h=e[n+3];if((a&192)===128&&(s&192)===128&&(h&192)===128){c=(i&15)<<18|(a&63)<<12|(s&63)<<6|h&63;if(c>65535&&c<1114112){o=c}}}}if(o===null){o=65533;u=1}else if(o>65535){o-=65536;f.push(o>>>10&1023|55296);o=56320|o&1023}f.push(o);n+=u}return decodeCodePointsArray(f)}var u=4096;function decodeCodePointsArray(e){var r=e.length;if(r<=u){return String.fromCharCode.apply(String,e)}var t="";var f=0;while(f<r){t+=String.fromCharCode.apply(String,e.slice(f,f+=u))}return t}function asciiSlice(e,r,t){var f="";t=Math.min(e.length,t);for(var n=r;n<t;++n){f+=String.fromCharCode(e[n]&127)}return f}function latin1Slice(e,r,t){var f="";t=Math.min(e.length,t);for(var n=r;n<t;++n){f+=String.fromCharCode(e[n])}return f}function hexSlice(e,r,t){var f=e.length;if(!r||r<0)r=0;if(!t||t<0||t>f)t=f;var n="";for(var i=r;i<t;++i){n+=s[e[i]]}return n}function utf16leSlice(e,r,t){var f=e.slice(r,t);var n="";for(var i=0;i<f.length;i+=2){n+=String.fromCharCode(f[i]+f[i+1]*256)}return n}Buffer.prototype.slice=function slice(e,r){var t=this.length;e=~~e;r=r===undefined?t:~~r;if(e<0){e+=t;if(e<0)e=0}else if(e>t){e=t}if(r<0){r+=t;if(r<0)r=0}else if(r>t){r=t}if(r<e)r=e;var f=this.subarray(e,r);Object.setPrototypeOf(f,Buffer.prototype);return f};function checkOffset(e,r,t){if(e%1!==0||e<0)throw new RangeError("offset is not uint");if(e+r>t)throw new RangeError("Trying to access beyond buffer length")}Buffer.prototype.readUIntLE=function readUIntLE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=this[e];var n=1;var i=0;while(++i<r&&(n*=256)){f+=this[e+i]*n}return f};Buffer.prototype.readUIntBE=function readUIntBE(e,r,t){e=e>>>0;r=r>>>0;if(!t){checkOffset(e,r,this.length)}var f=this[e+--r];var n=1;while(r>0&&(n*=256)){f+=this[e+--r]*n}return f};Buffer.prototype.readUInt8=function readUInt8(e,r){e=e>>>0;if(!r)checkOffset(e,1,this.length);return this[e]};Buffer.prototype.readUInt16LE=function readUInt16LE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);return this[e]|this[e+1]<<8};Buffer.prototype.readUInt16BE=function readUInt16BE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);return this[e]<<8|this[e+1]};Buffer.prototype.readUInt32LE=function readUInt32LE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return(this[e]|this[e+1]<<8|this[e+2]<<16)+this[e+3]*16777216};Buffer.prototype.readUInt32BE=function readUInt32BE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]*16777216+(this[e+1]<<16|this[e+2]<<8|this[e+3])};Buffer.prototype.readIntLE=function readIntLE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=this[e];var n=1;var i=0;while(++i<r&&(n*=256)){f+=this[e+i]*n}n*=128;if(f>=n)f-=Math.pow(2,8*r);return f};Buffer.prototype.readIntBE=function readIntBE(e,r,t){e=e>>>0;r=r>>>0;if(!t)checkOffset(e,r,this.length);var f=r;var n=1;var i=this[e+--f];while(f>0&&(n*=256)){i+=this[e+--f]*n}n*=128;if(i>=n)i-=Math.pow(2,8*r);return i};Buffer.prototype.readInt8=function readInt8(e,r){e=e>>>0;if(!r)checkOffset(e,1,this.length);if(!(this[e]&128))return this[e];return(255-this[e]+1)*-1};Buffer.prototype.readInt16LE=function readInt16LE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);var t=this[e]|this[e+1]<<8;return t&32768?t|4294901760:t};Buffer.prototype.readInt16BE=function readInt16BE(e,r){e=e>>>0;if(!r)checkOffset(e,2,this.length);var t=this[e+1]|this[e]<<8;return t&32768?t|4294901760:t};Buffer.prototype.readInt32LE=function readInt32LE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24};Buffer.prototype.readInt32BE=function readInt32BE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]};Buffer.prototype.readFloatLE=function readFloatLE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return n.read(this,e,true,23,4)};Buffer.prototype.readFloatBE=function readFloatBE(e,r){e=e>>>0;if(!r)checkOffset(e,4,this.length);return n.read(this,e,false,23,4)};Buffer.prototype.readDoubleLE=function readDoubleLE(e,r){e=e>>>0;if(!r)checkOffset(e,8,this.length);return n.read(this,e,true,52,8)};Buffer.prototype.readDoubleBE=function readDoubleBE(e,r){e=e>>>0;if(!r)checkOffset(e,8,this.length);return n.read(this,e,false,52,8)};function checkInt(e,r,t,f,n,i){if(!Buffer.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>n||r<i)throw new RangeError('"value" argument is out of bounds');if(t+f>e.length)throw new RangeError("Index out of range")}Buffer.prototype.writeUIntLE=function writeUIntLE(e,r,t,f){e=+e;r=r>>>0;t=t>>>0;if(!f){var n=Math.pow(2,8*t)-1;checkInt(this,e,r,t,n,0)}var i=1;var o=0;this[r]=e&255;while(++o<t&&(i*=256)){this[r+o]=e/i&255}return r+t};Buffer.prototype.writeUIntBE=function writeUIntBE(e,r,t,f){e=+e;r=r>>>0;t=t>>>0;if(!f){var n=Math.pow(2,8*t)-1;checkInt(this,e,r,t,n,0)}var i=t-1;var o=1;this[r+i]=e&255;while(--i>=0&&(o*=256)){this[r+i]=e/o&255}return r+t};Buffer.prototype.writeUInt8=function writeUInt8(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,1,255,0);this[r]=e&255;return r+1};Buffer.prototype.writeUInt16LE=function writeUInt16LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,65535,0);this[r]=e&255;this[r+1]=e>>>8;return r+2};Buffer.prototype.writeUInt16BE=function writeUInt16BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,65535,0);this[r]=e>>>8;this[r+1]=e&255;return r+2};Buffer.prototype.writeUInt32LE=function writeUInt32LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,4294967295,0);this[r+3]=e>>>24;this[r+2]=e>>>16;this[r+1]=e>>>8;this[r]=e&255;return r+4};Buffer.prototype.writeUInt32BE=function writeUInt32BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,4294967295,0);this[r]=e>>>24;this[r+1]=e>>>16;this[r+2]=e>>>8;this[r+3]=e&255;return r+4};Buffer.prototype.writeIntLE=function writeIntLE(e,r,t,f){e=+e;r=r>>>0;if(!f){var n=Math.pow(2,8*t-1);checkInt(this,e,r,t,n-1,-n)}var i=0;var o=1;var u=0;this[r]=e&255;while(++i<t&&(o*=256)){if(e<0&&u===0&&this[r+i-1]!==0){u=1}this[r+i]=(e/o>>0)-u&255}return r+t};Buffer.prototype.writeIntBE=function writeIntBE(e,r,t,f){e=+e;r=r>>>0;if(!f){var n=Math.pow(2,8*t-1);checkInt(this,e,r,t,n-1,-n)}var i=t-1;var o=1;var u=0;this[r+i]=e&255;while(--i>=0&&(o*=256)){if(e<0&&u===0&&this[r+i+1]!==0){u=1}this[r+i]=(e/o>>0)-u&255}return r+t};Buffer.prototype.writeInt8=function writeInt8(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,1,127,-128);if(e<0)e=255+e+1;this[r]=e&255;return r+1};Buffer.prototype.writeInt16LE=function writeInt16LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,32767,-32768);this[r]=e&255;this[r+1]=e>>>8;return r+2};Buffer.prototype.writeInt16BE=function writeInt16BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,2,32767,-32768);this[r]=e>>>8;this[r+1]=e&255;return r+2};Buffer.prototype.writeInt32LE=function writeInt32LE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,2147483647,-2147483648);this[r]=e&255;this[r+1]=e>>>8;this[r+2]=e>>>16;this[r+3]=e>>>24;return r+4};Buffer.prototype.writeInt32BE=function writeInt32BE(e,r,t){e=+e;r=r>>>0;if(!t)checkInt(this,e,r,4,2147483647,-2147483648);if(e<0)e=4294967295+e+1;this[r]=e>>>24;this[r+1]=e>>>16;this[r+2]=e>>>8;this[r+3]=e&255;return r+4};function checkIEEE754(e,r,t,f,n,i){if(t+f>e.length)throw new RangeError("Index out of range");if(t<0)throw new RangeError("Index out of range")}function writeFloat(e,r,t,f,i){r=+r;t=t>>>0;if(!i){checkIEEE754(e,r,t,4,34028234663852886e22,-34028234663852886e22)}n.write(e,r,t,f,23,4);return t+4}Buffer.prototype.writeFloatLE=function writeFloatLE(e,r,t){return writeFloat(this,e,r,true,t)};Buffer.prototype.writeFloatBE=function writeFloatBE(e,r,t){return writeFloat(this,e,r,false,t)};function writeDouble(e,r,t,f,i){r=+r;t=t>>>0;if(!i){checkIEEE754(e,r,t,8,17976931348623157e292,-17976931348623157e292)}n.write(e,r,t,f,52,8);return t+8}Buffer.prototype.writeDoubleLE=function writeDoubleLE(e,r,t){return writeDouble(this,e,r,true,t)};Buffer.prototype.writeDoubleBE=function writeDoubleBE(e,r,t){return writeDouble(this,e,r,false,t)};Buffer.prototype.copy=function copy(e,r,t,f){if(!Buffer.isBuffer(e))throw new TypeError("argument should be a Buffer");if(!t)t=0;if(!f&&f!==0)f=this.length;if(r>=e.length)r=e.length;if(!r)r=0;if(f>0&&f<t)f=t;if(f===t)return 0;if(e.length===0||this.length===0)return 0;if(r<0){throw new RangeError("targetStart out of bounds")}if(t<0||t>=this.length)throw new RangeError("Index out of range");if(f<0)throw new RangeError("sourceEnd out of bounds");if(f>this.length)f=this.length;if(e.length-r<f-t){f=e.length-r+t}var n=f-t;if(this===e&&typeof Uint8Array.prototype.copyWithin==="function"){this.copyWithin(r,t,f)}else if(this===e&&t<r&&r<f){for(var i=n-1;i>=0;--i){e[i+r]=this[i+t]}}else{Uint8Array.prototype.set.call(e,this.subarray(t,f),r)}return n};Buffer.prototype.fill=function fill(e,r,t,f){if(typeof e==="string"){if(typeof r==="string"){f=r;r=0;t=this.length}else if(typeof t==="string"){f=t;t=this.length}if(f!==undefined&&typeof f!=="string"){throw new TypeError("encoding must be a string")}if(typeof f==="string"&&!Buffer.isEncoding(f)){throw new TypeError("Unknown encoding: "+f)}if(e.length===1){var n=e.charCodeAt(0);if(f==="utf8"&&n<128||f==="latin1"){e=n}}}else if(typeof e==="number"){e=e&255}else if(typeof e==="boolean"){e=Number(e)}if(r<0||this.length<r||this.length<t){throw new RangeError("Out of range index")}if(t<=r){return this}r=r>>>0;t=t===undefined?this.length:t>>>0;if(!e)e=0;var i;if(typeof e==="number"){for(i=r;i<t;++i){this[i]=e}}else{var o=Buffer.isBuffer(e)?e:Buffer.from(e,f);var u=o.length;if(u===0){throw new TypeError('The value "'+e+'" is invalid for argument "value"')}for(i=0;i<t-r;++i){this[i+r]=o[i%u]}}return this};var a=/[^+/0-9A-Za-z-_]/g;function base64clean(e){e=e.split("=")[0];e=e.trim().replace(a,"");if(e.length<2)return"";while(e.length%4!==0){e=e+"="}return e}function utf8ToBytes(e,r){r=r||Infinity;var t;var f=e.length;var n=null;var i=[];for(var o=0;o<f;++o){t=e.charCodeAt(o);if(t>55295&&t<57344){if(!n){if(t>56319){if((r-=3)>-1)i.push(239,191,189);continue}else if(o+1===f){if((r-=3)>-1)i.push(239,191,189);continue}n=t;continue}if(t<56320){if((r-=3)>-1)i.push(239,191,189);n=t;continue}t=(n-55296<<10|t-56320)+65536}else if(n){if((r-=3)>-1)i.push(239,191,189)}n=null;if(t<128){if((r-=1)<0)break;i.push(t)}else if(t<2048){if((r-=2)<0)break;i.push(t>>6|192,t&63|128)}else if(t<65536){if((r-=3)<0)break;i.push(t>>12|224,t>>6&63|128,t&63|128)}else if(t<1114112){if((r-=4)<0)break;i.push(t>>18|240,t>>12&63|128,t>>6&63|128,t&63|128)}else{throw new Error("Invalid code point")}}return i}function asciiToBytes(e){var r=[];for(var t=0;t<e.length;++t){r.push(e.charCodeAt(t)&255)}return r}function utf16leToBytes(e,r){var t,f,n;var i=[];for(var o=0;o<e.length;++o){if((r-=2)<0)break;t=e.charCodeAt(o);f=t>>8;n=t%256;i.push(n);i.push(f)}return i}function base64ToBytes(e){return f.toByteArray(base64clean(e))}function blitBuffer(e,r,t,f){for(var n=0;n<f;++n){if(n+t>=r.length||n>=e.length)break;r[n+t]=e[n]}return n}function isInstance(e,r){return e instanceof r||e!=null&&e.constructor!=null&&e.constructor.name!=null&&e.constructor.name===r.name}function numberIsNaN(e){return e!==e}var s=function(){var e="0123456789abcdef";var r=new Array(256);for(var t=0;t<16;++t){var f=t*16;for(var n=0;n<16;++n){r[f+n]=e[t]+e[n]}}return r}()},783:function(e,r){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
r.read=function(e,r,t,f,n){var i,o;var u=n*8-f-1;var a=(1<<u)-1;var s=a>>1;var h=-7;var c=t?n-1:0;var l=t?-1:1;var p=e[r+c];c+=l;i=p&(1<<-h)-1;p>>=-h;h+=u;for(;h>0;i=i*256+e[r+c],c+=l,h-=8){}o=i&(1<<-h)-1;i>>=-h;h+=f;for(;h>0;o=o*256+e[r+c],c+=l,h-=8){}if(i===0){i=1-s}else if(i===a){return o?NaN:(p?-1:1)*Infinity}else{o=o+Math.pow(2,f);i=i-s}return(p?-1:1)*o*Math.pow(2,i-f)};r.write=function(e,r,t,f,n,i){var o,u,a;var s=i*8-n-1;var h=(1<<s)-1;var c=h>>1;var l=n===23?Math.pow(2,-24)-Math.pow(2,-77):0;var p=f?0:i-1;var y=f?1:-1;var g=r<0||r===0&&1/r<0?1:0;r=Math.abs(r);if(isNaN(r)||r===Infinity){u=isNaN(r)?1:0;o=h}else{o=Math.floor(Math.log(r)/Math.LN2);if(r*(a=Math.pow(2,-o))<1){o--;a*=2}if(o+c>=1){r+=l/a}else{r+=l*Math.pow(2,1-c)}if(r*a>=2){o++;a/=2}if(o+c>=h){u=0;o=h}else if(o+c>=1){u=(r*a-1)*Math.pow(2,n);o=o+c}else{u=r*Math.pow(2,c-1)*Math.pow(2,n);o=0}}for(;n>=8;e[t+p]=u&255,p+=y,u/=256,n-=8){}o=o<<n|u;s+=n;for(;s>0;e[t+p]=o&255,p+=y,o/=256,s-=8){}e[t+p-y]|=g*128}}};var r={};function __nccwpck_require__(t){var f=r[t];if(f!==undefined){return f.exports}var n=r[t]={exports:{}};var i=true;try{e[t](n,n.exports,__nccwpck_require__);i=false}finally{if(i)delete r[t]}return n.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var t=__nccwpck_require__(72);module.exports=t})();

/***/ }),

/***/ 8081:
/***/ (function(module) {

var __dirname = "/";
(function(){var e={229:function(e){var t=e.exports={};var r;var n;function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}(function(){try{if(typeof setTimeout==="function"){r=setTimeout}else{r=defaultSetTimout}}catch(e){r=defaultSetTimout}try{if(typeof clearTimeout==="function"){n=clearTimeout}else{n=defaultClearTimeout}}catch(e){n=defaultClearTimeout}})();function runTimeout(e){if(r===setTimeout){return setTimeout(e,0)}if((r===defaultSetTimout||!r)&&setTimeout){r=setTimeout;return setTimeout(e,0)}try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}function runClearTimeout(e){if(n===clearTimeout){return clearTimeout(e)}if((n===defaultClearTimeout||!n)&&clearTimeout){n=clearTimeout;return clearTimeout(e)}try{return n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}var i=[];var o=false;var u;var a=-1;function cleanUpNextTick(){if(!o||!u){return}o=false;if(u.length){i=u.concat(i)}else{a=-1}if(i.length){drainQueue()}}function drainQueue(){if(o){return}var e=runTimeout(cleanUpNextTick);o=true;var t=i.length;while(t){u=i;i=[];while(++a<t){if(u){u[a].run()}}a=-1;t=i.length}u=null;o=false;runClearTimeout(e)}t.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1){for(var r=1;r<arguments.length;r++){t[r-1]=arguments[r]}}i.push(new Item(e,t));if(i.length===1&&!o){runTimeout(drainQueue)}};function Item(e,t){this.fun=e;this.array=t}Item.prototype.run=function(){this.fun.apply(null,this.array)};t.title="browser";t.browser=true;t.env={};t.argv=[];t.version="";t.versions={};function noop(){}t.on=noop;t.addListener=noop;t.once=noop;t.off=noop;t.removeListener=noop;t.removeAllListeners=noop;t.emit=noop;t.prependListener=noop;t.prependOnceListener=noop;t.listeners=function(e){return[]};t.binding=function(e){throw new Error("process.binding is not supported")};t.cwd=function(){return"/"};t.chdir=function(e){throw new Error("process.chdir is not supported")};t.umask=function(){return 0}}};var t={};function __nccwpck_require__(r){var n=t[r];if(n!==undefined){return n.exports}var i=t[r]={exports:{}};var o=true;try{e[r](i,i.exports,__nccwpck_require__);o=false}finally{if(o)delete t[r]}return i.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var r=__nccwpck_require__(229);module.exports=r})();

/***/ })

}]);