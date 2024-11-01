(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[935],{

/***/ 2864:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 6734));


/***/ }),

/***/ 6734:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Auctions; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7437);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2265);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6463);
/* harmony import */ var _styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6596);
/* harmony import */ var _styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8871);
/* __next_internal_client_entry_do_not_use__ default auto */ 

 // Changed from 'next/router'


function Auctions() {
    const [auctions, setAuctions] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [sortOption, setSortOption] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("default");
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const backendUrl = "https://silent-auction.shop";
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        fetchAuctions();
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (auctions.length > 0) {
            sortAuctions(sortOption);
        }
    }, [
        sortOption
    ]);
    const fetchAuctions = async ()=>{
        try {
            setLoading(true);
            const response = await fetch("".concat(backendUrl, "/items/running"));
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
    const sortAuctions = (option)=>{
        let sortedAuctions = [
            ...auctions
        ];
        switch(option){
            case "priceAsc":
                sortedAuctions.sort((a, b)=>a.minimumPrice - b.minimumPrice);
                break;
            case "priceDesc":
                sortedAuctions.sort((a, b)=>b.minimumPrice - a.minimumPrice);
                break;
            case "endingSoon":
                sortedAuctions.sort((a, b)=>new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
                break;
            case "endingLater":
                sortedAuctions.sort((a, b)=>new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
                break;
            default:
                break;
        }
        setAuctions(sortedAuctions);
        setSortOption(option);
    };
    const handleRegisterClick = (auctionId)=>{
        router.push("/register/".concat(auctionId));
    };
    const handleLiveAuctionClick = (auctionId)=>{
        router.push("/bid/".concat(auctionId));
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().container),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_Header__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, {}),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", {
                className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().mainContent),
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", {
                        className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().title),
                        children: "Live Auctions"
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().contentWrapper),
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().sortSection),
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", {
                                        children: "Sort Options"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                        className: "".concat((_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().sortButton), " ").concat(sortOption === "priceAsc" ? (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().active) : ""),
                                        onClick: ()=>sortAuctions("priceAsc"),
                                        children: "Price: Low to High"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                        className: "".concat((_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().sortButton), " ").concat(sortOption === "priceDesc" ? (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().active) : ""),
                                        onClick: ()=>sortAuctions("priceDesc"),
                                        children: "Price: High to Low"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                        className: "".concat((_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().sortButton), " ").concat(sortOption === "endingSoon" ? (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().active) : ""),
                                        onClick: ()=>sortAuctions("endingSoon"),
                                        children: "Ending Soon"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                        className: "".concat((_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().sortButton), " ").concat(sortOption === "endingLater" ? (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().active) : ""),
                                        onClick: ()=>sortAuctions("endingLater"),
                                        children: "Ending Later"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().auctionListContainer),
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                                    className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().auctionList),
                                    children: loading ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                        children: "Loading auctions..."
                                    }) : error ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                        className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().error),
                                        children: error
                                    }) : auctions.length > 0 ? auctions.map((auction)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().auctionItem),
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().itemDetails),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", {
                                                            children: auction.name
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                                            children: auction.description
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                            children: [
                                                                "Minimum Price: ",
                                                                auction.minimumPrice,
                                                                " Mina"
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                            children: [
                                                                "Ends: ",
                                                                new Date(auction.endTime).toLocaleString()
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                    className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().itemActions),
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                                            className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().registerButton),
                                                            onClick: ()=>handleRegisterClick(auction.id),
                                                            children: "Register to Bid"
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                                                            className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().liveAuctionButton),
                                                            onClick: ()=>handleLiveAuctionClick(auction.id),
                                                            children: "Live Auction"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }, auction.id)) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
                                        children: "No auctions available at the moment."
                                    })
                                })
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("footer", {
                className: (_styles_Auctions_module_css__WEBPACK_IMPORTED_MODULE_3___default().footer),
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

/***/ 6596:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"Auctions_container__WRhd_","header":"Auctions_header__CqezL","headerContent":"Auctions_headerContent__99IbD","logo":"Auctions_logo__TwrC8","nav":"Auctions_nav__qO1ys","navLink":"Auctions_navLink__p_BXO","mainContent":"Auctions_mainContent__mHXIM","title":"Auctions_title__y8s4L","contentWrapper":"Auctions_contentWrapper__9VOQY","sortSection":"Auctions_sortSection__x_ott","sortButton":"Auctions_sortButton__rHUfQ","active":"Auctions_active___c_MF","auctionListContainer":"Auctions_auctionListContainer__bw6th","auctionList":"Auctions_auctionList__MF6Ax","auctionItem":"Auctions_auctionItem__Trke6","itemDetails":"Auctions_itemDetails__EhCxT","itemActions":"Auctions_itemActions__S1P32","registerButton":"Auctions_registerButton__Lstf7","liveAuctionButton":"Auctions_liveAuctionButton___sjBX","footer":"Auctions_footer__sVFne","error":"Auctions_error__iTkNa"};

/***/ }),

/***/ 6063:
/***/ (function(module) {

// extracted by mini-css-extract-plugin
module.exports = {"container":"Home_container__d256j","main":"Home_main__VkIEL","title":"Home_title__hYX6j","background":"Home_background__nqUIs","backgroundGradients":"Home_backgroundGradients__6K9ld","tagline":"Home_tagline__q1jNE","start":"Home_start__3ARHr","code":"Home_code__VVrIr","grid":"Home_grid__AVljO","card":"Home_card__E5spL","center":"Home_center__O_TIN","logo":"Home_logo__IOQAX","content":"Home_content__tkQPU","header":"Home_header__y2QYS","footer":"Home_footer__yFiaX","description":"Home_description__uXNdx","hero":"Home_hero__VkeT1","button":"Home_button__G93Ef","auctionScrollContainer":"Home_auctionScrollContainer__ctYG4","auctionGrid":"Home_auctionGrid__MlTb0","auctionBox":"Home_auctionBox__bD_T2","chartContainer":"Home_chartContainer__5eFbK"};

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [898,610,412,971,23,744], function() { return __webpack_exec__(2864); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);