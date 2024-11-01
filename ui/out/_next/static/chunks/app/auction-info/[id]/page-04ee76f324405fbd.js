(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[620],{

/***/ 8678:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 2539));


/***/ }),

/***/ 2539:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AuctionClient; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7437);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2265);
/* harmony import */ var _styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1955);
/* harmony import */ var _styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8871);
/* __next_internal_client_entry_do_not_use__ default auto */ 



function AuctionClient(param) {
    let { initialData, id } = param;
    var _auctionInfo_auctionWinner, _auctionInfo_auctionWinner1, _auctionInfo_auctionWinner2;
    const [auctionInfo] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialData);
    const [bidKey, setBidKey] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [isloading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [personalBidInfo, setPersonalBidInfo] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const handleVerifyBid = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            if (!id || !bidKey) {
                setError("Missing item ID or bid key");
                return;
            }
            const response = await fetch("".concat("https://silent-auction.shop", "/auction-log/verify"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    itemId: Number(id),
                    key: Number(bidKey)
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to verify bid");
            }
            const bidData = await response.json();
            if (bidData) {
                setPersonalBidInfo({
                    bidAmount: bidData.bidAmount,
                    timestamp: bidData.bidTime,
                    bidtxid: bidData.transactionHash,
                    merkleroot: bidData.merkleRoot || ""
                });
            } else {
                setError("No bid found with the provided key.");
            }
        } catch (err) {
            console.error("Bid verification error:", err);
            setError(err instanceof Error ? err.message : "An error occurred while verifying your bid.");
        } finally{
            setLoading(false);
        }
    };
    const truncateString = function(str) {
        let startLength = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, endLength = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 4;
        if (str.length <= startLength + endLength) return str;
        return "".concat(str.slice(0, startLength), "...").concat(str.slice(-endLength));
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().container),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("header", {
                className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().header),
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Header__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {})
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("main", {
                className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().mainContent),
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().twoColumnLayout),
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().leftColumn),
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().infoCard),
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                                            children: "Auction Information"
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                            children: [
                                                "Item: ",
                                                auctionInfo.name
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                            children: [
                                                "End Time: ",
                                                new Date(auctionInfo.endTime).toLocaleString()
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                            children: [
                                                "Winning Key: ",
                                                (_auctionInfo_auctionWinner = auctionInfo.auctionWinner) === null || _auctionInfo_auctionWinner === void 0 ? void 0 : _auctionInfo_auctionWinner.winningKey,
                                                " "
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                            children: [
                                                "Winning Bid: ",
                                                (_auctionInfo_auctionWinner1 = auctionInfo.auctionWinner) === null || _auctionInfo_auctionWinner1 === void 0 ? void 0 : _auctionInfo_auctionWinner1.winningBid,
                                                " MINA"
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().winnerInfo),
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", {
                                                    children: "Winner Information"
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                    children: [
                                                        "Winner Address: ",
                                                        (_auctionInfo_auctionWinner2 = auctionInfo.auctionWinner) === null || _auctionInfo_auctionWinner2 === void 0 ? void 0 : _auctionInfo_auctionWinner2.winnerAddress
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().nftDetailsSection),
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                                            children: "NFT Details"
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().nftContent),
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                                    className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().nftImageContainer)
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().nftInfo),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                            className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().infoRow),
                                                            children: [
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", {
                                                                    children: "Contract Address:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                                    children: auctionInfo.zkappAddress
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                                                    className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().copyButton),
                                                                    onClick: ()=>navigator.clipboard.writeText(auctionInfo.zkappAddress),
                                                                    children: "Copy"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                            className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().infoRow),
                                                            children: [
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", {
                                                                    children: "Auction ID:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                                    children: auctionInfo.id
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                            className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().descriptionRow),
                                                            children: [
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", {
                                                                    children: "Description:"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                                                    children: auctionInfo.description
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                            className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().rightColumn),
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().bidVerification),
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                                        children: "Verify Your Bid"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                        children: "Enter your bid key to see your bid information"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", {
                                        onSubmit: handleVerifyBid,
                                        className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().bidKeyForm),
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
                                                type: "text",
                                                value: bidKey,
                                                onChange: (e)=>setBidKey(e.target.value),
                                                placeholder: "Enter your bid key",
                                                className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().bidKeyInput),
                                                disabled: isloading
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                                type: "submit",
                                                className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().verifyButton),
                                                disabled: isloading || !bidKey,
                                                children: isloading ? "Verifying..." : "Verify"
                                            })
                                        ]
                                    }),
                                    error && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                        className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().error),
                                        children: error
                                    }),
                                    personalBidInfo && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().personalBidInfo),
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", {
                                                children: "Your Bid Information"
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().bidInfoGrid),
                                                children: [
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().bidInfoItem),
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                                                children: "Bid Amount:"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                children: [
                                                                    personalBidInfo.bidAmount,
                                                                    " MINA"
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().bidInfoItem),
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                                                children: "Transaction:"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
                                                                href: personalBidInfo.bidtxid,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().transactionLink),
                                                                children: "View on Explorer →"
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().bidInfoItem),
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                                                children: "Merkle Root:"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                                className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().merkleContainer),
                                                                children: [
                                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                                        children: truncateString(personalBidInfo.merkleroot)
                                                                    }),
                                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                                                        className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().copyButton),
                                                                        onClick: ()=>navigator.clipboard.writeText(personalBidInfo.merkleroot),
                                                                        title: "Copy full merkle root",
                                                                        children: "Copy"
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().bidInfoItem),
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                                                children: "Timestamp:"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                                children: new Date(personalBidInfo.timestamp).toLocaleString()
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().bidInfoItem),
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", {
                                                                children: "Status:"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                                className: personalBidInfo.isWinner ? (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().winner) : (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().notWinner),
                                                                children: personalBidInfo.isWinner ? "Winner!" : "Not the winning bid"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("footer", {
                className: (_styles_AuctionInfo_module_css__WEBPACK_IMPORTED_MODULE_2___default().footer),
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                    children: "\xa9 2024 Silent-Auction. All rights reserved."
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

/***/ 1955:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"pageContainer":"AuctionInfo_pageContainer__3iKFd","logo":"AuctionInfo_logo__QaWuY","nav":"AuctionInfo_nav__TkM9o","navLink":"AuctionInfo_navLink__GuNQ9","mainContent":"AuctionInfo_mainContent__TGvNa","twoColumnLayout":"AuctionInfo_twoColumnLayout__NKg_3","leftColumn":"AuctionInfo_leftColumn__cLOJg","rightColumn":"AuctionInfo_rightColumn__fTmuM","infoCard":"AuctionInfo_infoCard__ulyMT","nftDetailsSection":"AuctionInfo_nftDetailsSection__CxiKA","bidVerification":"AuctionInfo_bidVerification__JYAah","title":"AuctionInfo_title__VIm3_","nftContent":"AuctionInfo_nftContent__2vzxz","nftImageContainer":"AuctionInfo_nftImageContainer__IFEyF","nftImage":"AuctionInfo_nftImage__L14nl","nftInfo":"AuctionInfo_nftInfo__sxzq_","infoRow":"AuctionInfo_infoRow__ypHIE","copyButton":"AuctionInfo_copyButton__M0wmz","descriptionRow":"AuctionInfo_descriptionRow__zDJLO","bidKeyForm":"AuctionInfo_bidKeyForm__wtA1J","bidKeyInput":"AuctionInfo_bidKeyInput__bEUZK","verifyButton":"AuctionInfo_verifyButton__s3PZq","error":"AuctionInfo_error__w_P_n","personalBidInfo":"AuctionInfo_personalBidInfo__FOTH6","bidInfoGrid":"AuctionInfo_bidInfoGrid__5dQ7_","bidInfoItem":"AuctionInfo_bidInfoItem__eqGoE","transactionLink":"AuctionInfo_transactionLink___boUw","merkleContainer":"AuctionInfo_merkleContainer__TnRFw","winner":"AuctionInfo_winner__9PQAu","notWinner":"AuctionInfo_notWinner__CMWb4","bidStatus":"AuctionInfo_bidStatus__LOyKW","errorContainer":"AuctionInfo_errorContainer__vAMil","errorCard":"AuctionInfo_errorCard__4rrlQ","errorTitle":"AuctionInfo_errorTitle__u42Vd","errorMessage":"AuctionInfo_errorMessage__t1qGv","button":"AuctionInfo_button__pzLxI","primaryButton":"AuctionInfo_primaryButton__639KL","secondaryButton":"AuctionInfo_secondaryButton__bkWAk","spinner":"AuctionInfo_spinner__aeM9V","spin":"AuctionInfo_spin__1fQID","winnerInfo":"AuctionInfo_winnerInfo__20yOU","loading":"AuctionInfo_loading__U53vK","footer":"AuctionInfo_footer__cK2d9","loadingMessage":"AuctionInfo_loadingMessage__NIBNa","nftDetailsText":"AuctionInfo_nftDetailsText__tyqzD"};

/***/ }),

/***/ 6063:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"Home_container__d256j","main":"Home_main__VkIEL","title":"Home_title__hYX6j","background":"Home_background__nqUIs","backgroundGradients":"Home_backgroundGradients__6K9ld","tagline":"Home_tagline__q1jNE","start":"Home_start__3ARHr","code":"Home_code__VVrIr","grid":"Home_grid__AVljO","card":"Home_card__E5spL","center":"Home_center__O_TIN","logo":"Home_logo__IOQAX","content":"Home_content__tkQPU","header":"Home_header__y2QYS","footer":"Home_footer__yFiaX","description":"Home_description__uXNdx","hero":"Home_hero__VkeT1","button":"Home_button__G93Ef","auctionScrollContainer":"Home_auctionScrollContainer__ctYG4","auctionGrid":"Home_auctionGrid__MlTb0","auctionBox":"Home_auctionBox__bD_T2","chartContainer":"Home_chartContainer__5eFbK"};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [114,474,412,971,23,744], function() { return __webpack_exec__(8678); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);