(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[572],{

/***/ 1696:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 5182));


/***/ }),

/***/ 5182:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ CreatePage; }
});

// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(7437);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/index.js
var react = __webpack_require__(2265);
// EXTERNAL MODULE: ./node_modules/next/dist/api/navigation.js
var navigation = __webpack_require__(6463);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/gem.js
var gem = __webpack_require__(7668);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/box.js
var box = __webpack_require__(4104);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/globe.js
var globe = __webpack_require__(4436);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/send.js
var send = __webpack_require__(994);
;// CONCATENATED MODULE: ./utils/send.js
/* provided dependency */ var process = __webpack_require__(357);


const { NEXT_PUBLIC_APP_DEBUG, REACT_APP_ZKCW_JWT, REACT_APP_ZKCW_AUTH, REACT_APP_ZKCW_ENDPOINT } = process.env;
const DEBUG = NEXT_PUBLIC_APP_DEBUG === "true";
async function sendMintTransaction(params) /*: Promise<{ isSent: boolean, hash: string }> */ {
    const { serializedTransaction, signedData, contractAddress, mintParams, chain, name } = params;
    if (DEBUG) console.log("sendMintTransaction", {
        name,
        serializedTransaction,
        signedData,
        contractAddress,
        mintParams,
        chain
    });
    let args = JSON.stringify({
        contractAddress
    });
    const transaction = JSON.stringify({
        serializedTransaction,
        signedData,
        mintParams
    }, null, 2);
    let answer = await zkCloudWorkerRequest({
        command: "execute",
        transactions: [
            transaction
        ],
        task: "mint",
        args,
        metadata: "mint NFT @".concat(name),
        mode: "async"
    });
    if (DEBUG) console.log("zkCloudWorker answer:", answer);
    const jobId = answer === null || answer === void 0 ? void 0 : answer.jobId;
    if (DEBUG) console.log("jobId:", jobId);
    return jobId;
}
async function sendSellTransaction(params) /*: Promise<{ isSent: boolean, hash: string }> */ {
    const { serializedTransaction, signedData, contractAddress, sellParams, chain, name } = params;
    if (DEBUG) console.log("sendSellTransaction", {
        name,
        serializedTransaction,
        signedData,
        contractAddress,
        sellParams,
        chain
    });
    let args = JSON.stringify({
        contractAddress
    });
    const transaction = JSON.stringify({
        serializedTransaction,
        signedData,
        sellParams,
        name
    }, null, 2);
    let answer = await zkCloudWorkerRequest({
        command: "execute",
        transactions: [
            transaction
        ],
        task: "sell",
        args,
        metadata: "sell NFT @".concat(name),
        mode: "async"
    });
    if (DEBUG) console.log("zkCloudWorker answer:", answer);
    const jobId = answer === null || answer === void 0 ? void 0 : answer.jobId;
    if (DEBUG) console.log("jobId:", jobId);
    return jobId;
}
async function sendTransferTransaction(params) /*: Promise<{ isSent: boolean, hash: string }> */ {
    const { serializedTransaction, signedData, contractAddress, transferParams, chain, name } = params;
    if (DEBUG) console.log("sendTransferTransaction", {
        name,
        serializedTransaction,
        signedData,
        contractAddress,
        transferParams,
        chain
    });
    let args = JSON.stringify({
        contractAddress
    });
    const transaction = JSON.stringify({
        serializedTransaction,
        signedData,
        transferParams,
        name
    }, null, 2);
    let answer = await zkCloudWorkerRequest({
        command: "execute",
        transactions: [
            transaction
        ],
        task: "transfer",
        args,
        metadata: "transfer NFT @".concat(name),
        mode: "async"
    });
    if (DEBUG) console.log("zkCloudWorker answer:", answer);
    const jobId = answer === null || answer === void 0 ? void 0 : answer.jobId;
    if (DEBUG) console.log("jobId:", jobId);
    return jobId;
}
async function sendUpdateTransaction(params) /*: Promise<{ isSent: boolean, hash: string }> */ {
    const { serializedTransaction, signedData, contractAddress, updateParams, chain, name, updateCode } = params;
    if (DEBUG) console.log("sendUpdateTransaction", {
        name,
        serializedTransaction,
        signedData,
        contractAddress,
        updateParams,
        chain,
        updateCode
    });
    let args = JSON.stringify({
        contractAddress
    });
    const transaction = JSON.stringify({
        serializedTransaction,
        signedData,
        updateParams,
        name,
        updateCode
    }, null, 2);
    let answer = await zkCloudWorkerRequest({
        command: "execute",
        transactions: [
            transaction
        ],
        task: "update",
        args,
        metadata: "update NFT @".concat(name),
        mode: "async"
    });
    if (DEBUG) console.log("zkCloudWorker answer:", answer);
    const jobId = answer === null || answer === void 0 ? void 0 : answer.jobId;
    if (DEBUG) console.log("jobId:", jobId);
    return jobId;
}
async function sendBuyTransaction(params) /*: Promise<{ isSent: boolean, hash: string }> */ {
    const { serializedTransaction, signedData, contractAddress, buyParams, chain, name } = params;
    if (DEBUG) console.log("sendBuyTransaction", {
        name,
        serializedTransaction,
        signedData,
        contractAddress,
        buyParams,
        chain
    });
    let args = JSON.stringify({
        contractAddress
    });
    const transaction = JSON.stringify({
        serializedTransaction,
        signedData,
        buyParams,
        name
    }, null, 2);
    let answer = await zkCloudWorkerRequest({
        command: "execute",
        transactions: [
            transaction
        ],
        task: "buy",
        args,
        metadata: "buy NFT @".concat(name),
        mode: "async"
    });
    if (DEBUG) console.log("zkCloudWorker answer:", answer);
    const jobId = answer === null || answer === void 0 ? void 0 : answer.jobId;
    if (DEBUG) console.log("jobId:", jobId);
    return jobId;
}
async function waitForTransaction(jobId) {
    if (jobId === undefined || jobId === "") {
        console.error("JobId is undefined");
        return {
            success: false,
            error: "JobId is undefined"
        };
    }
    let result;
    let answer = await zkCloudWorkerRequest({
        command: "jobResult",
        jobId
    });
    while(result === undefined && answer.jobStatus !== "failed"){
        await sleep(5000);
        answer = await zkCloudWorkerRequest({
            command: "jobResult",
            jobId
        });
        if (DEBUG) console.log("jobResult api call result:", answer);
        result = answer.result;
        if (result !== undefined) {
            if (DEBUG) console.log("jobResult result:", result);
        }
    }
    if (answer.jobStatus === "failed") {
        return {
            success: false,
            error: result
        };
    } else if (result === undefined) {
        return {
            success: false,
            error: "job error"
        };
    } else return {
        success: true,
        hash: result
    };
}
async function zkCloudWorkerRequest(params) {
    console.log("zkcloudworkerRequest");
    const { command, task, transactions, args, metadata, mode, jobId } = params;
    const chain = chainId();
    const apiData = {
        auth: REACT_APP_ZKCW_AUTH,
        command: command,
        jwtToken: REACT_APP_ZKCW_JWT,
        data: {
            task,
            transactions: transactions !== null && transactions !== void 0 ? transactions : [],
            args,
            repo: "mint-worker",
            developer: "DFST",
            metadata,
            mode: mode !== null && mode !== void 0 ? mode : "sync",
            jobId
        },
        chain
    };
    const endpoint = REACT_APP_ZKCW_ENDPOINT + chain;
    const response = await axios.post(endpoint, apiData);
    return response.data;
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}

;// CONCATENATED MODULE: ./utils/serverless/api.js
const API_BASE_URL = "http://localhost:3000" || 0;
const handleResponse = async (response)=>{
    if (!response.ok) {
        throw new Error("HTTP error! status: ".concat(response.status));
    }
    return response.json();
};
const fetchWithTimeout = async function(url, options) {
    let timeout = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 10000;
    const controller = new AbortController();
    const id = setTimeout(()=>controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};
const winston = async (info)=>{
    try {
        const response = await fetchWithTimeout("".concat(API_BASE_URL, "/api/winston"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Winston API error:", error);
        return {
            success: false,
            error: error.message
        };
    }
};
const nonce = async (account)=>{
    try {
        const response = await fetchWithTimeout("".concat(API_BASE_URL, "/api/nonce"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                account
            })
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Nonce API error:", error);
        return {
            success: false,
            error: error.message
        };
    }
};
const storage = async ()=>{
    try {
        const response = await fetchWithTimeout("".concat(API_BASE_URL, "/api/storage"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Storage API error:", error);
        return {
            success: false,
            error: error.message
        };
    }
};
/* harmony default export */ var api = ({
    winston,
    storage,
    nonce
});

;// CONCATENATED MODULE: ./utils/nonce.js

async function getNonce(account) {
    try {
        const result = await api.nonce(account);
        console.log("getNonce result:", result);
        if (!result || result.success === false) {
            console.warn("Failed to get nonce:", (result === null || result === void 0 ? void 0 : result.error) || "Unknown error");
            return -1;
        }
        const nonce = parseInt(result.nonce);
        if (isNaN(nonce)) {
            console.warn("Invalid nonce received:", result.nonce);
            return -1;
        }
        return nonce;
    } catch (error) {
        console.error("getNonce error:", error);
        return -1;
    }
}

// EXTERNAL MODULE: ./node_modules/minanft/lib/web/src/index.js + 90 modules
var src = __webpack_require__(3931);
// EXTERNAL MODULE: ./node_modules/o1js/dist/web/index.js
var web = __webpack_require__(337);
;// CONCATENATED MODULE: ./utils/transfer.js







const changeNonce = true;
const transfer_DEBUG = (/* unused pure expression or super */ null && ("true" === "true"));
async function transferNFT(params) {
    console.log("Starting transferNFT with params:", params);
    console.time("transferNFT");
    try {
        var _window_mina;
        const { newOwner, owner, showText, showPending, libraries } = params;
        const chain = "devnet";
        console.log("Chain:", chain);
        if (owner === undefined) {
            console.error("Owner address is undefined");
            return {
                success: false,
                error: "Owner address is undefined"
            };
        }
        if (newOwner === undefined || newOwner === "") {
            console.error("New owner address is undefined");
            return {
                success: false,
                error: "New owner address is undefined"
            };
        }
        if (libraries === undefined) {
            console.error("o1js library is missing");
            return {
                success: false,
                error: "o1js library is missing"
            };
        }
        console.log("Loading o1js library...");
        const o1jsInfo = /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
            children: [
                "Loading",
                " ",
                /*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
                    href: "https://docs.minaprotocol.com/zkapps/o1js",
                    target: "_blank",
                    children: "o1js"
                }),
                " ",
                "library..."
            ]
        });
        await showPending(o1jsInfo);
        const lib = await libraries;
        console.log("o1js library loaded");
        const { PublicKey, Mina } = lib.o1js;
        const { MinaNFT, NameContractV2, TransferParams, initBlockchain, MINANFT_NAME_SERVICE_V2, fetchMinaAccount, serializeFields, accountBalanceMina } = lib.minanft;
        console.log("Initializing blockchain...");
        const contractAddress = MINANFT_NAME_SERVICE_V2;
        console.log("Contract address:", contractAddress);
        try {
            console.log("Validating new owner address:", newOwner);
            const newOwnerAddress = PublicKey.fromBase58(newOwner);
        } catch (error) {
            console.error("Invalid new owner address:", error);
            await showText("Invalid new owner address", "red");
            await showPending(undefined);
            return {
                success: false,
                error: "Invalid new owner address"
            };
        }
        try {
            console.log("Validating NFT address:", params.address);
            const nftAddress = PublicKey.fromBase58(params.address);
        } catch (error) {
            console.error("Invalid NFT address:", error);
            await showText("Invalid NFT address", "red");
            await showPending(undefined);
            return {
                success: false,
                error: "Invalid NFT address"
            };
        }
        console.time("Account setup");
        const address = PublicKey.fromBase58(params.address);
        const newOwnerAddress = PublicKey.fromBase58(newOwner);
        const net = await initBlockchain(chain);
        const sender = PublicKey.fromBase58(owner);
        console.log("Sender address:", sender.toBase58());
        const zkAppAddress = PublicKey.fromBase58(MINANFT_NAME_SERVICE_V2);
        const zkApp = new NameContractV2(zkAppAddress);
        const tokenId = zkApp.deriveTokenId();
        const nftApp = new src.NFTContractV2(address, tokenId);
        const BASE_FEE = 150000000; // 0.15 MINA
        const fee = BASE_FEE;
        console.timeEnd("Account setup");
        console.log("Fetching account data...");
        await fetchMinaAccount({
            publicKey: sender
        });
        await fetchMinaAccount({
            publicKey: newOwnerAddress
        });
        await fetchMinaAccount({
            publicKey: zkAppAddress
        });
        await fetchMinaAccount({
            publicKey: address,
            tokenId
        });
        // Account validation checks
        if (!Mina.hasAccount(sender)) {
            console.error("Sender account not found:", sender.toBase58());
            await showText("Account ".concat(sender.toBase58(), " not found. Please fund your account or try again later, after all the previous transactions are included in the block."), "red");
            await showPending(undefined);
            return {
                success: false,
                error: "Account not found"
            };
        }
        console.log("Getting NFT owner and name...");
        const nftOwner = nftApp.owner.get();
        const name = web.Encoding.stringFromFields([
            nftApp.name.get()
        ]);
        const memo = ("transfer NFT @" + name).substring(0, 30);
        console.log("NFT name:", name);
        console.log("Transaction memo:", memo);
        console.log("Checking nonce and balance...");
        const blockberryNoncePromise = changeNonce ? getNonce(sender.toBase58()) : undefined;
        const requiredBalance = 1 + fee / 1000000000;
        const balance = await accountBalanceMina(sender);
        console.log("Account balance:", balance, "MINA");
        console.log("Required balance:", requiredBalance, "MINA");
        console.time("Transaction preparation");
        const transferParams = new TransferParams({
            address,
            newOwner: newOwnerAddress
        });
        const senderNonce = Number(Mina.getAccount(sender).nonce.toBigint());
        const blockberryNonce = changeNonce ? await blockberryNoncePromise : -1;
        const nonce = Math.max(senderNonce, blockberryNonce + 1);
        console.log("Transaction nonce:", nonce);
        await ensureWalletConnection();
        console.log("Creating transaction...");
        const tx = await Mina.transaction({
            sender,
            fee,
            memo,
            nonce
        }, async ()=>{
            await zkApp.transferNFT(transferParams);
        });
        console.timeEnd("Transaction preparation");
        await NameContractV2.compile();
        await src.NFTContractV2.compile();
        // Add local proving here
        console.log("Starting local proof generation...");
        console.time("proof");
        await showText("Generating proof locally... This may take a few minutes", "blue");
        const proof = await tx.prove();
        console.timeEnd("proof");
        console.log("Proof generated successfully");
        const serializedTransaction = tx.toJSON();
        const payload = {
            transaction: serializedTransaction,
            feePayer: {
                fee: fee,
                memo: memo
            }
        };
        console.log("Requesting user signature...");
        const txResult = await ((_window_mina = window.mina) === null || _window_mina === void 0 ? void 0 : _window_mina.sendTransaction(payload));
        console.log("Transaction signature result:", txResult);
        if (!(txResult === null || txResult === void 0 ? void 0 : txResult.hash)) {
            console.error("No transaction hash received");
            await showText("No transaction hash received", "red");
            await showPending(undefined);
            return {
                success: false,
                error: "No transaction hash"
            };
        }
        console.timeEnd("transferNFT");
        return {
            success: true,
            transactionHash: txResult.hash
        };
    } catch (error) {
        console.error("Transfer NFT error:", error);
        var _error_message;
        return {
            success: false,
            error: (_error_message = error === null || error === void 0 ? void 0 : error.message) !== null && _error_message !== void 0 ? _error_message : "Error while transferring NFT"
        };
    }
}
async function ensureWalletConnection() {
    if (!window.mina) {
        throw new Error("Auro wallet not installed");
    }
    try {
        const accounts = await window.mina.getAccounts();
        if (!accounts || accounts.length === 0) {
            // Try to connect if no accounts are found
            await window.mina.requestAccounts();
            const newAccounts = await window.mina.getAccounts();
            console.log(newAccounts);
            if (!newAccounts || newAccounts.length === 0) {
                throw new Error("No accounts available after connection");
            }
        }
        return true;
    } catch (error) {
        console.error("Wallet connection error:", error);
        throw new Error("Failed to connect to wallet");
    }
}

// EXTERNAL MODULE: ./styles/CreateAuction.module.css
var CreateAuction_module = __webpack_require__(5291);
var CreateAuction_module_default = /*#__PURE__*/__webpack_require__.n(CreateAuction_module);
// EXTERNAL MODULE: ./components/Header.tsx
var Header = __webpack_require__(8871);
;// CONCATENATED MODULE: ./app/create/page.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 




// Note: Move styles to a CSS module in the same directory
// app/create/page.module.css


function CreatePage() {
    const router = (0,navigation.useRouter)();
    const backendUrl = "https://silent-auction.shop";
    const [duration, setDuration] = (0,react.useState)("");
    const [title, setTitle] = (0,react.useState)("");
    const [currentBid, setCurrentBid] = (0,react.useState)("");
    const [endTime, setEndTime] = (0,react.useState)("");
    const [auctionType, setAuctionType] = (0,react.useState)("Others");
    const [step, setStep] = (0,react.useState)(1);
    const [isLoading, setIsLoading] = (0,react.useState)(false);
    const [pending, setPending] = (0,react.useState)();
    const [statusText, setStatusText] = (0,react.useState)("");
    const [statusColor, setStatusColor] = (0,react.useState)("");
    const [o1jsLibraries, setO1jsLibraries] = (0,react.useState)(null);
    const [nftAddress, setNftAddress] = (0,react.useState)("");
    (0,react.useEffect)(()=>{
        // Initialize o1js libraries
        const initO1js = async ()=>{
            const libraries = {
                o1js: await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 337)),
                minanft: await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 3931))
            };
            setO1jsLibraries(Promise.resolve(libraries));
        };
        initO1js();
    }, []);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (step === 1 && auctionType === "NFT") {
            setStep(2);
            return;
        }
        if (!backendUrl) {
            throw new Error("Backend URL is not defined in environment variables");
        }
        const newAuction = {
            title,
            currentBid: parseFloat(currentBid),
            endTime,
            auctionType
        };
        const itemData = {
            name: newAuction.title,
            description: "Description of the item",
            minimumPrice: newAuction.currentBid,
            type: newAuction.auctionType,
            endTime: newAuction.endTime,
            auctionType: newAuction.auctionType
        };
        try {
            const response = await fetch("".concat(backendUrl, "/items/create"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itemData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error("Failed to create auction: ".concat(response.status, " ").concat(response.statusText, ". ").concat(JSON.stringify(errorData)));
            }
            const createdAuction = await response.json();
            console.log("Auction created:", createdAuction);
            return createdAuction;
        } catch (error) {
            console.error("Error creating auction:", error);
            throw error;
        }
    };
    const handleNFTSend = async ()=>{
        if (!o1jsLibraries) {
            throw new Error("o1js libraries not initialized");
        }
        if (!nftAddress) {
            throw new Error("Please fill in both NFT address and new owner address");
        }
        const showPending = (text)=>{
            setPending(text);
        };
        const showText = async (text, color)=>{
            setStatusText(text);
            setStatusColor(color);
        };
        // Type assertion for window.mina
        const mina = window.mina;
        const publicKeyBase58 = await mina.requestAccounts();
        const owner = publicKeyBase58[0];
        const result = await transferNFT({
            newOwner: owner,
            owner: "B62qkUQoebsMDhaC6vn1PiherKgNeMW4p1hxWKhFw7xkNZwjy4zhDRJ",
            address: nftAddress,
            showText,
            showPending,
            libraries: o1jsLibraries
        });
        if (!result.success) {
            throw new Error(result.error || "NFT transfer failed");
        }
        return result;
    };
    // JSX remains largely the same, but update navigation
    const handleSuccess = ()=>{
        router.push("/auctions"); // Using new navigation
    };
    // Rest of your JSX remains the same
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: (CreateAuction_module_default()).container,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(Header/* default */.Z, {}),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("main", {
                className: (CreateAuction_module_default()).main,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h2", {
                        className: (CreateAuction_module_default()).title,
                        children: step === 1 ? "Create New Auction" : "Send NFT to Auction"
                    }),
                    step === 1 ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                        onSubmit: handleSubmit,
                        className: (CreateAuction_module_default()).formContainer,
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: (CreateAuction_module_default()).formGroup,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: (CreateAuction_module_default()).label,
                                        children: "Title"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                        type: "text",
                                        value: title,
                                        onChange: (e)=>setTitle(e.target.value),
                                        required: true,
                                        className: (CreateAuction_module_default()).input,
                                        placeholder: "Enter auction title"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: (CreateAuction_module_default()).formGroup,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: (CreateAuction_module_default()).label,
                                        children: "Starting Bid"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: (CreateAuction_module_default()).inputWithUnit,
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                type: "number",
                                                value: currentBid,
                                                onChange: (e)=>setCurrentBid(e.target.value),
                                                required: true,
                                                className: (CreateAuction_module_default()).input,
                                                placeholder: "Enter amount",
                                                min: "0",
                                                step: "0.1"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                className: (CreateAuction_module_default()).unitLabel,
                                                children: "MINA"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: (CreateAuction_module_default()).formGroup,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: (CreateAuction_module_default()).label,
                                        children: "Ends After"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("select", {
                                        value: duration,
                                        onChange: (e)=>{
                                            const selectedValue = e.target.value;
                                            setDuration(selectedValue);
                                            if (selectedValue) {
                                                const now = new Date();
                                                const hours = parseInt(selectedValue);
                                                const endDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
                                                setEndTime(endDate.toISOString());
                                            } else {
                                                setEndTime("");
                                            }
                                        },
                                        className: (CreateAuction_module_default()).input,
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "",
                                                children: "Select duration"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "24",
                                                children: "24 Hours"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "48",
                                                children: "2 Days"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "72",
                                                children: "3 Days"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("option", {
                                                value: "168",
                                                children: "7 Days"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: (CreateAuction_module_default()).formGroup,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                        className: (CreateAuction_module_default()).label,
                                        children: "Auction Type"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                        className: (CreateAuction_module_default()).auctionTypeContainer,
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: (CreateAuction_module_default()).auctionTypeCard,
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                        type: "radio",
                                                        id: "nft",
                                                        name: "auctionType",
                                                        value: "NFT",
                                                        checked: auctionType === "NFT",
                                                        onChange: (e)=>setAuctionType(e.target.value),
                                                        className: (CreateAuction_module_default()).auctionTypeInput
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                                        htmlFor: "nft",
                                                        className: (CreateAuction_module_default()).auctionTypeLabel,
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(gem/* default */.Z, {
                                                                className: (CreateAuction_module_default()).auctionTypeIcon
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: (CreateAuction_module_default()).auctionTypeName,
                                                                children: "NFT"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: (CreateAuction_module_default()).auctionTypeCard,
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                        type: "radio",
                                                        id: "rwa",
                                                        name: "auctionType",
                                                        value: "RWA",
                                                        checked: auctionType === "RWA",
                                                        onChange: (e)=>setAuctionType(e.target.value),
                                                        className: (CreateAuction_module_default()).auctionTypeInput
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                                        htmlFor: "rwa",
                                                        className: (CreateAuction_module_default()).auctionTypeLabel,
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(box/* default */.Z, {
                                                                className: (CreateAuction_module_default()).auctionTypeIcon
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: (CreateAuction_module_default()).auctionTypeName,
                                                                children: "RWA"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                                className: (CreateAuction_module_default()).auctionTypeCard,
                                                children: [
                                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                                        type: "radio",
                                                        id: "others",
                                                        name: "auctionType",
                                                        value: "Others",
                                                        checked: auctionType === "Others",
                                                        onChange: (e)=>setAuctionType(e.target.value),
                                                        className: (CreateAuction_module_default()).auctionTypeInput
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                                        htmlFor: "others",
                                                        className: (CreateAuction_module_default()).auctionTypeLabel,
                                                        children: [
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(globe/* default */.Z, {
                                                                className: (CreateAuction_module_default()).auctionTypeIcon
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                                                className: (CreateAuction_module_default()).auctionTypeName,
                                                                children: "Others"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                type: "submit",
                                className: (CreateAuction_module_default()).button,
                                disabled: isLoading,
                                children: isLoading ? "Creating..." : "Create Auction"
                            })
                        ]
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: (CreateAuction_module_default()).nftSendContainer,
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: (CreateAuction_module_default()).nftInstructions,
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                                        children: "Complete Your NFT Auction Setup"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "To list your NFT for auction, you'll need to send it to our auction smart contract."
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "Please make sure:"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("ul", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                                                children: "You own the NFT you're trying to auction"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                                                children: "The NFT is in your connected wallet"
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)("li", {
                                                children: "You have enough funds to cover gas fees"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: (CreateAuction_module_default()).nftInputs,
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: (CreateAuction_module_default()).formGroup,
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("label", {
                                            className: (CreateAuction_module_default()).label,
                                            children: "NFT Address"
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                                            type: "text",
                                            value: nftAddress,
                                            onChange: (e)=>setNftAddress(e.target.value),
                                            className: (CreateAuction_module_default()).input,
                                            placeholder: "Enter NFT contract address",
                                            required: true
                                        })
                                    ]
                                })
                            }),
                            statusText && /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: (CreateAuction_module_default()).statusMessage,
                                style: {
                                    color: statusColor
                                },
                                children: statusText
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                onClick: async (e)=>{
                                    try {
                                        setIsLoading(true);
                                        setStatusText("Initiating NFT transfer...");
                                        setStatusColor("blue");
                                        // First attempt NFT transfer
                                        await handleNFTSend();
                                        setStatusText("NFT transfer successful! Creating auction...");
                                        setStatusColor("green");
                                        // If NFT transfer succeeds, proceed with auction creation
                                        await handleSubmit(e);
                                        setStatusText("Auction created successfully!");
                                        setStatusColor("green");
                                        // Optional: Redirect after success
                                        setTimeout(()=>{
                                            router.push("/auctions");
                                        }, 2000);
                                    } catch (error) {
                                        console.error("Transaction failed:", error);
                                        setStatusText(error instanceof Error ? error.message : "Transaction failed");
                                        setStatusColor("red");
                                    } finally{
                                        setIsLoading(false);
                                    }
                                },
                                className: (CreateAuction_module_default()).sendButton,
                                disabled: isLoading || !nftAddress,
                                children: isLoading ? "Processing..." : /*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                    children: [
                                        "Send NFT to Auction ",
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(send/* default */.Z, {
                                            className: (CreateAuction_module_default()).sendIcon,
                                            size: 20
                                        })
                                    ]
                                })
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("footer", {
                className: (CreateAuction_module_default()).footer,
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                    children: "\xa9 2023 AuctionHub. All rights reserved."
                })
            })
        ]
    });
}


/***/ }),

/***/ 8871:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7437);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2265);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7449);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7138);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6063);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4__);
// components/Header.tsx





const Header = (param)=>{
    let { title = "SilentAuction", description = "Bid on exciting items!" } = param;
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_head__WEBPACK_IMPORTED_MODULE_2___default()), {
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("title", {
                        children: title
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("meta", {
                        name: "description",
                        content: description
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("link", {
                        rel: "icon",
                        href: "/favicon.ico"
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("header", {
                className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_4___default().header),
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_3__["default"], {
                        href: "/",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", {
                            children: "Silent-Auction"
                        })
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("nav", {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_3__["default"], {
                                href: "/",
                                children: "Home"
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_3__["default"], {
                                href: "/auctions",
                                children: "Live Auctions"
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_3__["default"], {
                                href: "/create",
                                children: "Create New Auction"
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_3__["default"], {
                                href: "/finished-auctions",
                                children: "Finished Auctions"
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ __webpack_exports__.Z = (Header);


/***/ }),

/***/ 5291:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"CreateAuction_container__E1Go8","header":"CreateAuction_header__ZE3KH","nav":"CreateAuction_nav__DE7gk","logo":"CreateAuction_logo__c6i4Y","navLink":"CreateAuction_navLink__n8IJN","main":"CreateAuction_main__OyCat","title":"CreateAuction_title__o8LpK","formContainer":"CreateAuction_formContainer__cRczx","nftSendContainer":"CreateAuction_nftSendContainer__6t_B4","formGroup":"CreateAuction_formGroup__TITUM","button":"CreateAuction_button__a2ckM","auctionTypeName":"CreateAuction_auctionTypeName__o2ey1","auctionTypeInput":"CreateAuction_auctionTypeInput__7JI1S","auctionTypeLabel":"CreateAuction_auctionTypeLabel__0hBOI","input":"CreateAuction_input__8x34y","label":"CreateAuction_label__ZLMlA","inputWithUnit":"CreateAuction_inputWithUnit__845Rs","unitLabel":"CreateAuction_unitLabel__2cg8f","auctionTypeContainer":"CreateAuction_auctionTypeContainer__5gBmB","auctionTypeCard":"CreateAuction_auctionTypeCard___JvEe","auctionTypeIcon":"CreateAuction_auctionTypeIcon__G5Yke","nftInstructions":"CreateAuction_nftInstructions__C8obR","nftInputs":"CreateAuction_nftInputs__tCQ3e","inputWithButton":"CreateAuction_inputWithButton__8rqTs","checkButton":"CreateAuction_checkButton__e7NbC","nftInfoBox":"CreateAuction_nftInfoBox__9r7If","nftDetails":"CreateAuction_nftDetails__B8tKK","verificationBadge":"CreateAuction_verificationBadge__qA9_U","statusMessage":"CreateAuction_statusMessage__SYTId","success":"CreateAuction_success__2KjRn","sendButton":"CreateAuction_sendButton__JhRVz","footer":"CreateAuction_footer__hBm2f"};

/***/ }),

/***/ 6063:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"Home_container__d256j","main":"Home_main__VkIEL","title":"Home_title__hYX6j","background":"Home_background__nqUIs","backgroundGradients":"Home_backgroundGradients__6K9ld","tagline":"Home_tagline__q1jNE","start":"Home_start__3ARHr","code":"Home_code__VVrIr","grid":"Home_grid__AVljO","card":"Home_card__E5spL","center":"Home_center__O_TIN","logo":"Home_logo__IOQAX","content":"Home_content__tkQPU","header":"Home_header__y2QYS","footer":"Home_footer__yFiaX","description":"Home_description__uXNdx","hero":"Home_hero__VkeT1","button":"Home_button__G93Ef","auctionScrollContainer":"Home_auctionScrollContainer__ctYG4","auctionGrid":"Home_auctionGrid__MlTb0","auctionBox":"Home_auctionBox__bD_T2","chartContainer":"Home_chartContainer__5eFbK"};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [733,127,917,412,369,971,23,744], function() { return __webpack_exec__(1696); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);