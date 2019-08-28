module.exports = {
    currentPage: null,
    currentPageOptions: {},
    navbarPages: [ "pages/index/index", "pages/cat/cat", "pages/cart/cart", "pages/user/user", "pages/list/list", "pages/search/search", "pages/topic-list/topic-list", "pages/video/video-list", "pages/miaosha/miaosha", "pages/shop/shop", "pages/pt/index/index", "pages/book/index/index", "pages/share/index", "pages/quick-purchase/index/index", "mch/m/myshop/myshop", "mch/shop-list/shop-list", "pages/integral-mall/index/index", "pages/integral-mall/register/index", "pages/article-detail/article-detail", "pages/article-list/article-list", "pages/order/order" ],
    onLoad: function(t, e) {
        this.currentPage = t, this.currentPageOptions = e;
        var o = this;
        if (this.setUserInfo(), this.setWxappImg(), this.setStore(), this.setParentId(e), 
        this.getNavigationBarColor(), this.setDeviceInfo(), this.setPageClasses(), this.setPageNavbar(), 
        this.setBarTitle(), "function" == typeof t.onSelfLoad && t.onSelfLoad(e), o._setFormIdSubmit(), 
        "undefined" != typeof my && "pages/login/login" != t.route && e && (t.options || (t.options = e), 
        getApp().core.setStorageSync("last_page_options", e)), "lottery/goods/goods" == t.route && e.user_id) {
            var n = e.user_id, a = e.id;
            getApp().request({
                data: {
                    user_id: n,
                    lottery_id: a
                },
                url: getApp().api.lottery.clerk,
                success: function(e) {
                    e.code;
                }
            });
        }
        t.navigatorClick = function(e) {
            o.navigatorClick(e, t);
        }, t.setData({
            __platform: getApp().platform,
            _navigation_bar_color: getApp().core.getStorageSync(getApp().const.NAVIGATION_BAR_COLOR)
        }), void 0 === t.showToast && (t.showToast = function(e) {
            o.showToast(e);
        }), getApp().shareSendCoupon = function(e) {
            o.shareSendCoupon(e);
        }, void 0 === t.setTimeList && (t.setTimeList = function(e) {
            return o.setTimeList(e);
        }), void 0 === t.showLoading && (t.showLoading = function(e) {
            o.showLoading(e);
        }), void 0 === t.hideLoading && (t.hideLoading = function(e) {
            o.hideLoading(e);
        }), void 0 === t.modalConfirm && (t.modalConfirm = function(e) {
            o.modalConfirm(e);
        }), void 0 === t.modalClose && (t.modalClose = function(e) {
            o.modalClose(e);
        }), void 0 === t.modalShow && (t.modalShow = function(e) {
            o.modalShow(e);
        }), void 0 === t.myLogin && (t.myLogin = function() {
            o.myLogin();
        }), void 0 === t.getUserInfo && (t.getUserInfo = function(e) {
            o.getUserInfo(e);
        }), void 0 === t.getPhoneNumber && (t.getPhoneNumber = function(e) {
            o.getPhoneNumber(e);
        }), void 0 === t.bindParent && (t.bindParent = function(e) {
            o.bindParent(e);
        }), void 0 === t.closeCouponBox && (t.closeCouponBox = function(e) {
            o.closeCouponBox(e);
        }), void 0 === t.relevanceSuccess && (t.relevanceSuccess = function(e) {
            o.relevanceSuccess(e);
        }), void 0 === t.relevanceError && (t.relevanceError = function(e) {
            o.relevanceError(e);
        });
    },
    onReady: function(e) {
        this.currentPage = e;
    },
    onShow: function(e) {
        this.currentPage = e, getApp().orderPay.init(e, getApp());
    },
    onHide: function(e) {
        this.currentPage = e;
    },
    onUnload: function(e) {
        this.currentPage = e;
    },
    onPullDownRefresh: function(e) {
        this.currentPage = e;
    },
    onReachBottom: function(e) {
        this.currentPage = e;
    },
    onShareAppMessage: function(e) {
        this.currentPage = e, setTimeout(function() {
            getApp().shareSendCoupon(e);
        }, 1e3);
    },
    imageClick: function(e) {
        console.log("image click", e);
    },
    textClick: function(e) {
        console.log("text click", e);
    },
    tap1: function(e) {
        console.log("tap1", e);
    },
    tap2: function(e) {
        console.log("tap2", e);
    },
    formSubmit_collect: function(e) {
        e.detail.formId;
        console.log("formSubmit_collect--\x3e", e);
    },
    setUserInfo: function() {
        var e = this.currentPage, t = getApp().getUser();
        t && e.setData({
            __user_info: t
        });
    },
    setWxappImg: function(e) {
        var t = this.currentPage;
        getApp().getConfig(function(e) {
            t.setData({
                __wxapp_img: e.wxapp_img,
                store: e.store
            });
        });
    },
    setStore: function(e) {
        var t = this.currentPage;
        getApp().getConfig(function(e) {
            e.store && t.setData({
                store: e.store,
                __is_comment: e.store ? e.store.is_comment : 1,
                __is_sales: e.store ? e.store.is_sales : 1,
                __is_member_price: e.store ? e.store.is_member_price : 1,
                __is_share_price: e.store ? e.store.is_share_price : 1,
                __alipay_mp_config: e.alipay_mp_config
            });
        });
    },
    setParentId: function(e) {
        var t = this.currentPage;
        if ("/pages/index/index" == t.route && this.setOfficalAccount(), e) {
            var o = 0;
            if (e.user_id) o = e.user_id; else if (e.scene) {
                if (isNaN(e.scene)) {
                    var n = decodeURIComponent(e.scene);
                    n && (n = getApp().helper.scene_decode(n)) && n.uid && (o = n.uid);
                } else -1 == t.route.indexOf("clerk") && (o = e.scene);
                this.setOfficalAccount();
            } else if (null !== getApp().query) {
                var a = getApp().query;
                o = a.uid;
            }
            o && (getApp().core.setStorageSync(getApp().const.PARENT_ID, o), getApp().trigger.remove(getApp().trigger.events.login, "TRY_TO_BIND_PARENT"), 
            getApp().trigger.add(getApp().trigger.events.login, "TRY_TO_BIND_PARENT", function() {
                t.bindParent({
                    parent_id: o,
                    condition: 0
                });
            }));
        }
    },
    showToast: function(e) {
        var t = this.currentPage, o = e.duration || 2500, n = e.title || "", a = (e.success, 
        e.fail, e.complete || null);
        t._toast_timer && clearTimeout(t._toast_timer), t.setData({
            _toast: {
                title: n
            }
        }), t._toast_timer = setTimeout(function() {
            var e = t.data._toast;
            e.hide = !0, t.setData({
                _toast: e
            }), "function" == typeof a && a();
        }, o);
    },
    setDeviceInfo: function() {
        var e = this.currentPage, t = [ {
            id: "device_iphone_5",
            model: "iPhone 5"
        }, {
            id: "device_iphone_x",
            model: "iPhone X"
        } ], o = getApp().core.getSystemInfoSync();
        if (o.model) for (var n in 0 <= o.model.indexOf("iPhone X") && (o.model = "iPhone X"), 
        t) t[n].model == o.model && e.setData({
            __device: t[n].id
        });
    },
    setPageNavbar: function() {
        var t = this, r = this.currentPage, e = getApp().core.getStorageSync("_navbar");
        e && a(e);
        var o = !1;
        for (var n in t.navbarPages) if (r.route == t.navbarPages[n]) {
            o = !0;
            break;
        }
        function a(e) {
            var t = !1;
            for (var o in e.navs) {
                var n = e.navs[o].url, a = r.route || r.__route__ || null;
                if (e.navs[o].params) for (var i in n = e.navs[o].new_url, r.options) -1 == a.indexOf("?") ? a += "?" : a += "&", 
                a += i + "=" + r.options[i];
                console.log(a), n === "/" + a ? t = e.navs[o].active = !0 : e.navs[o].active = !1;
            }
            t && r.setData({
                _navbar: e
            });
        }
        o && getApp().request({
            url: getApp().api.default.navbar,
            success: function(e) {
                0 == e.code && (a(e.data), getApp().core.setStorageSync("_navbar", e.data), t.setPageClasses());
            }
        });
    },
    setPageClasses: function() {
        var e = this.currentPage, t = e.data.__device;
        e.data._navbar && e.data._navbar.navs && 0 < e.data._navbar.navs.length && (t += " show_navbar"), 
        t && e.setData({
            __page_classes: t
        });
    },
    showLoading: function(e) {
        var t = t;
        t.setData({
            _loading: !0
        });
    },
    hideLoading: function(e) {
        this.currentPage.setData({
            _loading: !1
        });
    },
    setTimeList: function(e) {
        function t(e) {
            return e <= 0 && (e = 0), e < 10 ? "0" + e : e;
        }
        var o = "00", n = "00", a = "00", i = 0;
        return 86400 <= e && (i = parseInt(e / 86400), e %= 86400), e < 86400 && (a = parseInt(e / 3600), 
        e %= 3600), e < 3600 && (n = parseInt(e / 60), e %= 60), e < 60 && (o = e), {
            d: i,
            h: t(a),
            m: t(n),
            s: t(o)
        };
    },
    setBarTitle: function(e) {
        var t = this.currentPage.route, o = getApp().core.getStorageSync(getApp().const.WX_BAR_TITLE);
        for (var n in o) o[n].url === t && getApp().core.setNavigationBarTitle({
            title: o[n].title
        });
    },
    getNavigationBarColor: function() {
        var t = getApp(), o = this;
        t.request({
            url: t.api.default.navigation_bar_color,
            success: function(e) {
                0 == e.code && (t.core.setStorageSync(getApp().const.NAVIGATION_BAR_COLOR, e.data), 
                o.setNavigationBarColor(), t.navigateBarColorCall && "function" == typeof t.navigateBarColorCall && t.navigateBarColorCall(e));
            }
        });
    },
    setNavigationBarColor: function() {
        var e = getApp().core.getStorageSync(getApp().const.NAVIGATION_BAR_COLOR);
        e && getApp().core.setNavigationBarColor(e), getApp().navigateBarColorCall = function(e) {
            getApp().core.setNavigationBarColor(e.data);
        };
    },
    navigatorClick: function(e, t) {
        var o = e.currentTarget.dataset.open_type;
        if ("redirect" == o) return !0;
        if ("wxapp" != o) {
            if ("tel" == o) {
                var n = e.currentTarget.dataset.tel;
                getApp().core.makePhoneCall({
                    phoneNumber: n
                });
            }
            return !1;
        }
    },
    shareSendCoupon: function(o) {
        var n = getApp();
        n.core.showLoading({
            mask: !0
        }), o.hideGetCoupon || (o.hideGetCoupon = function(e) {
            var t = e.currentTarget.dataset.url || !1;
            o.setData({
                get_coupon_list: null
            }), t && n.core.navigateTo({
                url: t
            });
        }), n.request({
            url: n.api.coupon.share_send,
            success: function(e) {
                0 == e.code && o.setData({
                    get_coupon_list: e.data.list
                });
            },
            complete: function() {
                n.core.hideLoading();
            }
        });
    },
    bindParent: function(e) {
        var t = getApp();
        if ("undefined" != e.parent_id && 0 != e.parent_id) {
            var o = t.getUser();
            if (0 < t.core.getStorageSync(t.const.SHARE_SETTING).level) 0 != e.parent_id && t.request({
                url: t.api.share.bind_parent,
                data: {
                    parent_id: e.parent_id,
                    condition: e.condition
                },
                success: function(e) {
                    0 == e.code && (o.parent = e.data, t.setUser(o));
                }
            });
        }
    },
    _setFormIdSubmit: function(e) {
        var p = this.currentPage;
        p._formIdSubmit || (p._formIdSubmit = function(e) {
            var t = e.currentTarget.dataset, o = e.detail.formId, n = t.bind || null, a = t.type || null, i = t.url || null, r = getApp().core.getStorageSync(getApp().const.FORM_ID_LIST);
            r && r.length || (r = []);
            var s = [];
            for (var c in r) s.push(r[c].form_id);
            switch ("the formId is a mock one" === o || getApp().helper.inArray(o, s) || (r.push({
                time: getApp().helper.time(),
                form_id: o
            }), getApp().core.setStorageSync(getApp().const.FORM_ID_LIST, r)), p[n] && "function" == typeof p[n] && p[n](e), 
            a) {
              case "navigate":
                i && getApp().core.navigateTo({
                    url: i
                });
                break;

              case "redirect":
                i && getApp().core.redirectTo({
                    url: i
                });
                break;

              case "switchTab":
                i && getApp().core.switchTab({
                    url: i
                });
                break;

              case "reLaunch":
                i && getApp().core.reLaunch({
                    url: i
                });
                break;

              case "navigateBack":
                i && getApp().core.navigateBack({
                    url: i
                });
            }
        });
    },
    modalClose: function(e) {
        this.currentPage.setData({
            modal_show: !1
        }), console.log("你点击了关闭按钮");
    },
    modalConfirm: function(e) {
        this.currentPage.setData({
            modal_show: !1
        }), console.log("你点击了确定按钮");
    },
    modalShow: function(e) {
        this.currentPage.setData({
            modal_show: !0
        }), console.log("点击会弹出弹框");
    },
    getUserInfo: function(o) {
        var n = this;
        "getUserInfo:ok" == o.detail.errMsg && getApp().core.login({
            success: function(e) {
                var t = e.code;
                n.unionLogin({
                    code: t,
                    user_info: o.detail.rawData,
                    encrypted_data: o.detail.encryptedData,
                    iv: o.detail.iv,
                    signature: o.detail.signature
                });
            },
            fail: function(e) {}
        });
    },
    myLogin: function() {
        var t = this;
        "my" === getApp().platform && (console.log(getApp().login_complete), getApp().login_complete || (getApp().login_complete = !0, 
        my.getAuthCode({
            scopes: "auth_user",
            success: function(e) {
                t.unionLogin({
                    code: e.authCode
                });
            },
            fail: function(e) {
                getApp().login_complete = !1, getApp().core.redirectTo({
                    url: "/pages/index/index"
                });
            }
        })));
    },
    unionLogin: function(e) {
        var o = this.currentPage, n = this;
        getApp().core.showLoading({
            title: "正在登录",
            mask: !0
        }), getApp().request({
            url: getApp().api.passport.login,
            method: "POST",
            data: e,
            success: function(e) {
                if (0 == e.code) {
                    o.setData({
                        __user_info: e.data
                    }), getApp().setUser(e.data), getApp().core.setStorageSync(getApp().const.ACCESS_TOKEN, e.data.access_token), 
                    getApp().trigger.run(getApp().trigger.events.login);
                    var t = getApp().core.getStorageSync(getApp().const.STORE);
                    e.data.binding || !t.option.phone_auth || t.option.phone_auth && 0 == t.option.phone_auth ? n.loadRoute() : ("undefined" == typeof wx && n.loadRoute(), 
                    n.setPhone()), n.setUserInfoShowFalse();
                } else getApp().login_complete = !1, getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    getPhoneNumber: function(o) {
        var n = this.currentPage;
        "getPhoneNumber:fail user deny" == o.detail.errMsg ? getApp().core.showModal({
            title: "提示",
            showCancel: !1,
            content: "未授权"
        }) : (getApp().core.showLoading({
            title: "授权中"
        }), getApp().core.login({
            success: function(e) {
                if (e.code) {
                    var t = e.code;
                    getApp().request({
                        url: getApp().api.user.user_binding,
                        method: "POST",
                        data: {
                            iv: o.detail.iv,
                            encryptedData: o.detail.encryptedData,
                            code: t
                        },
                        success: function(e) {
                            if (0 == e.code) {
                                var t = n.data.__user_info;
                                t.binding = e.data.dataObj, getApp().setUser(t), n.setData({
                                    PhoneNumber: e.data.dataObj,
                                    __user_info: t,
                                    binding: !0,
                                    binding_num: e.data.dataObj
                                }), _this.loadRoute();
                            } else getApp().core.showToast({
                                title: "授权失败,请重试"
                            });
                        },
                        complete: function(e) {
                            getApp().core.hideLoading();
                        }
                    });
                } else getApp().core.showToast({
                    title: "获取用户登录态失败！" + e.errMsg
                });
            }
        }));
    },
    setUserInfoShow: function() {
        var e = this.currentPage;
        "wx" == getApp().platform ? e.setData({
            user_info_show: !0
        }) : this.myLogin();
    },
    setPhone: function() {
        var e = this.currentPage;
        "undefined" == typeof my && e.setData({
            user_bind_show: !0
        });
    },
    setUserInfoShowFalse: function() {
        this.currentPage.setData({
            user_info_show: !1
        });
    },
    closeCouponBox: function(e) {
        this.currentPage.setData({
            get_coupon_list: ""
        });
    },
    relevanceSuccess: function(e) {
        console.log(e);
    },
    relevanceError: function(e) {
        console.log(e);
    },
    setOfficalAccount: function(e) {
        this.currentPage.setData({
            __is_offical_account: !0
        });
    },
    loadRoute: function() {
        var e = this.currentPage;
        "pages/index/index" == e.route || getApp().core.redirectTo({
            url: "/" + e.route + "?" + getApp().helper.objectToUrlParams(e.options)
        }), this.setUserInfoShowFalse();
    }
};