(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[931],{

/***/ 1641:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 6774));


/***/ }),

/***/ 6774:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Home; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7437);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6063);
/* harmony import */ var _styles_Home_module_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8871);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7138);
/* __next_internal_client_entry_do_not_use__ default auto */ 



let transactionFee = 0.1;
const ZKAPP_ADDRESS = "B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP";
function Home() {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_1___default().container),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Header__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z, {}),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", {
                className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_1___default().main),
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("section", {
                        className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_1___default().hero),
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
                                children: "Welcome to AuctionHub"
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                children: "Discover unique items and place your bids in our exciting online auctions!"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_1___default().grid),
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(next_link__WEBPACK_IMPORTED_MODULE_3__["default"], {
                                href: "/auctions",
                                className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_1___default().card),
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                                        children: "View Auctions →"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                        children: "Browse our current auctions and place your bids."
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(next_link__WEBPACK_IMPORTED_MODULE_3__["default"], {
                                href: "/create",
                                className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_1___default().card),
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                                        children: "Create Auction →"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                        children: "List your item for auction and start receiving bids."
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("footer", {
                className: (_styles_Home_module_css__WEBPACK_IMPORTED_MODULE_1___default().footer),
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                    children: "\xa9 2024 Silent Auction. All rights reserved."
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

/***/ 6063:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"Home_container__d256j","main":"Home_main__VkIEL","title":"Home_title__hYX6j","background":"Home_background__nqUIs","backgroundGradients":"Home_backgroundGradients__6K9ld","tagline":"Home_tagline__q1jNE","start":"Home_start__3ARHr","code":"Home_code__VVrIr","grid":"Home_grid__AVljO","card":"Home_card__E5spL","center":"Home_center__O_TIN","logo":"Home_logo__IOQAX","content":"Home_content__tkQPU","header":"Home_header__y2QYS","footer":"Home_footer__yFiaX","description":"Home_description__uXNdx","hero":"Home_hero__VkeT1","button":"Home_button__G93Ef","auctionScrollContainer":"Home_auctionScrollContainer__ctYG4","auctionGrid":"Home_auctionGrid__MlTb0","auctionBox":"Home_auctionBox__bD_T2","chartContainer":"Home_chartContainer__5eFbK"};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [127,412,971,23,744], function() { return __webpack_exec__(1641); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);