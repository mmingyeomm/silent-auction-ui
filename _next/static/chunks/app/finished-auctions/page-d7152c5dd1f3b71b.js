(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[295],{

/***/ 14:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 779));


/***/ }),

/***/ 779:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FinishedAuctions; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7437);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2265);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6463);
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8871);
/* harmony import */ var _styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9165);
/* harmony import */ var _styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4__);
// app/finished-auctions/page.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 




function FinishedAuctions() {
    const [auctions, setAuctions] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const backendUrl = "https://silent-auction.shop";
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        fetchAuctions();
    }, []);
    const fetchAuctions = async ()=>{
        try {
            setLoading(true);
            const response = await fetch("".concat(backendUrl, "/items/finished"));
            if (!response.ok) {
                throw new Error("Failed to fetch auctions");
            }
            const data = await response.json();
            setAuctions(data);
            setLoading(false);
        } catch (err) {
            setError("Error fetching auctions. Please try again later.");
            setLoading(false);
        }
    };
    const handleAuctionClick = (id)=>{
        router.push("/auction-info/".concat(id));
    };
    const formatDate = (dateString)=>{
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().container),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Header__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {}),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", {
                className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().main),
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
                        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().title),
                        children: "Finished Auctions"
                    }),
                    loading ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().loading),
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
                                className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().spinner),
                                viewBox: "0 0 50 50",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", {
                                    className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().path),
                                    cx: "25",
                                    cy: "25",
                                    r: "20",
                                    fill: "none",
                                    strokeWidth: "5"
                                })
                            }),
                            "Loading auctions..."
                        ]
                    }) : error ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().error),
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
                                className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().errorIcon),
                                viewBox: "0 0 20 20",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
                                    d: "M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"
                                })
                            }),
                            error
                        ]
                    }) : auctions.length > 0 ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().auctionGrid),
                        children: auctions.map((auction)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().auctionBox),
                                onClick: ()=>handleAuctionClick(auction.id),
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().auctionInfo),
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", {
                                                children: "Name:"
                                            }),
                                            " ",
                                            auction.name
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().auctionInfo),
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", {
                                                children: "Description:"
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                children: auction.description
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().auctionInfo),
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", {
                                                children: "Minimum Price:"
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                children: [
                                                    auction.minimumPrice,
                                                    " MINA"
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().auctionInfo),
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", {
                                                children: "End Time:"
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                                                children: formatDate(auction.endTime)
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().winnerBadge),
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
                                                className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().trophyIcon),
                                                viewBox: "0 0 20 20",
                                                width: "16",
                                                height: "16",
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
                                                    fill: "currentColor",
                                                    d: "M15 2v2h-1v1h-1v1h-1v1h-1v1H7V7H6V6H5V5H4V4H3V2h12zm-2 7v1h-1v1H8v-1H7V9h6zM8 11v1h4v-1H8z"
                                                })
                                            }),
                                            "Winning Bid: ",
                                            auction.auctionWinner ? auction.auctionWinner.winningBid : "No bids"
                                        ]
                                    })
                                ]
                            }, auction.id))
                    }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                        className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().noAuctions),
                        children: "No finished auctions available at the moment."
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("footer", {
                className: (_styles_FinishedAuctions_module_css__WEBPACK_IMPORTED_MODULE_4___default().footer),
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
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

/***/ 6463:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _client_components_navigation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1169);
/* harmony import */ var _client_components_navigation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_client_components_navigation__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (checked) */ if(__webpack_require__.o(_client_components_navigation__WEBPACK_IMPORTED_MODULE_0__, "useRouter")) __webpack_require__.d(__webpack_exports__, { useRouter: function() { return _client_components_navigation__WEBPACK_IMPORTED_MODULE_0__.useRouter; } });


//# sourceMappingURL=navigation.js.map

/***/ }),

/***/ 9165:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"spinner":"FinishedAuctions_spinner__lkfnF","rotate":"FinishedAuctions_rotate__8dqEh","path":"FinishedAuctions_path__mRRZa","dash":"FinishedAuctions_dash__5L7Pw","container":"FinishedAuctions_container__IIunt","main":"FinishedAuctions_main__OQy6Z","title":"FinishedAuctions_title__eoBeX","auctionGrid":"FinishedAuctions_auctionGrid__W3OrX","auctionBox":"FinishedAuctions_auctionBox__DhCeb","auctionTitle":"FinishedAuctions_auctionTitle__wOC_h","auctionInfo":"FinishedAuctions_auctionInfo__zRIPC","winnerBadge":"FinishedAuctions_winnerBadge__Wfxt0","trophyIcon":"FinishedAuctions_trophyIcon__03cSp","loading":"FinishedAuctions_loading__FXN_O","error":"FinishedAuctions_error__YfEIf","errorIcon":"FinishedAuctions_errorIcon__Yb1n_","noAuctions":"FinishedAuctions_noAuctions__n5OY9","footer":"FinishedAuctions_footer__Dy51u","header":"FinishedAuctions_header__2JnXo","nav":"FinishedAuctions_nav__xWW9L","logo":"FinishedAuctions_logo__42yIq","navLinks":"FinishedAuctions_navLinks__jBrSt","navLink":"FinishedAuctions_navLink__9hdzM"};

/***/ }),

/***/ 6063:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"Home_container__d256j","main":"Home_main__VkIEL","title":"Home_title__hYX6j","background":"Home_background__nqUIs","backgroundGradients":"Home_backgroundGradients__6K9ld","tagline":"Home_tagline__q1jNE","start":"Home_start__3ARHr","code":"Home_code__VVrIr","grid":"Home_grid__AVljO","card":"Home_card__E5spL","center":"Home_center__O_TIN","logo":"Home_logo__IOQAX","content":"Home_content__tkQPU","header":"Home_header__y2QYS","footer":"Home_footer__yFiaX","description":"Home_description__uXNdx","hero":"Home_hero__VkeT1","button":"Home_button__G93Ef","auctionScrollContainer":"Home_auctionScrollContainer__ctYG4","auctionGrid":"Home_auctionGrid__MlTb0","auctionBox":"Home_auctionBox__bD_T2","chartContainer":"Home_chartContainer__5eFbK"};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [610,412,971,23,744], function() { return __webpack_exec__(14); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);