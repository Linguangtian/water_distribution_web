var quickNavigation = require("./../../components/quick-navigation/quick-navigation.js"), interval = 0, page_first_init = !0, timer = 1, fullScreen = !1;

Page({
    data: {
        x: getApp().core.getSystemInfoSync().windowWidth,
        y: getApp().core.getSystemInfoSync().windowHeight,
        left: 0,
        show_notice: !1,
        animationData: {},
        play: -1,
        time: 0,
        buy: !1,
        opendate: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), this.loadData(t), quickNavigation.init(this);
    },
    suspension: function() {
        var s = this;
        interval = setInterval(function() {
            getApp().request({
                url: getApp().api.default.buy_data,
                data: {
                    time: s.data.time
                },
                method: "POST",
                success: function(t) {
                    if (0 == t.code) {
                        var a = !1;
                        s.data.msgHistory == t.md5 && (a = !0);
                        var e = "", i = t.cha_time, o = Math.floor(i / 60 - 60 * Math.floor(i / 3600));
                        e = 0 == o ? i % 60 + "秒" : o + "分" + i % 60 + "秒", !a && t.cha_time <= 300 ? s.setData({
                            buy: {
                                time: e,
                                type: t.data.type,
                                url: t.data.url,
                                user: 5 <= t.data.user.length ? t.data.user.slice(0, 4) + "..." : t.data.user,
                                avatar_url: t.data.avatar_url,
                                address: 8 <= t.data.address.length ? t.data.address.slice(0, 7) + "..." : t.data.address,
                                content: t.data.content
                            },
                            msgHistory: t.md5
                        }) : s.setData({
                            buy: !1
                        });
                    }
                },
                noHandlerFail: !0
            });
        }, 1e4);
    },
    loadData: function(t) {
        var a = this, e = getApp().core.getStorageSync(getApp().const.PAGE_INDEX_INDEX);
        e && (e.act_modal_list = [], a.setData(e)), getApp().request({
            url: getApp().api.default.index,
            success: function(t) {
                0 == t.code && (page_first_init ? a.data.user_info_show || (page_first_init = !1) : t.data.act_modal_list = [], 
                a.setData(t.data), getApp().core.setStorageSync(getApp().const.PAGE_INDEX_INDEX, t.data), 
                a.miaoshaTimer());
            },
            complete: function() {
                getApp().core.stopPullDownRefresh();
            }
        });
    },
    onShow: function() {
        var e = this;
        getApp().page.onShow(this), getApp().getConfig(function(t) {
            var a = t.store;
            a && a.name && getApp().core.setNavigationBarTitle({
                title: a.name
            }), a && 1 === a.purchase_frame ? e.suspension(e.data.time) : e.setData({
                buy_user: ""
            });
        }), e.notice();
    },
    onPullDownRefresh: function() {
        getApp().getStoreData(), clearInterval(timer), this.loadData();
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
        return {
            path: "/pages/index/index?user_id=" + getApp().getUser().id,
            title: this.data.store.name
        };
    },
    showshop: function(t) {
        var a = this, e = t.currentTarget.dataset.id, i = t.currentTarget.dataset;
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: e
            },
            success: function(t) {
                0 == t.code && a.setData({
                    data: i,
                    attr_group_list: t.data.attr_group_list,
                    goods: t.data,
                    showModal: !0
                });
            }
        });
    },
    receive: function(t) {
        var e = this, a = t.currentTarget.dataset.index;
        getApp().core.showLoading({
            title: "领取中",
            mask: !0
        }), e.hideGetCoupon || (e.hideGetCoupon = function(t) {
            var a = t.currentTarget.dataset.url || !1;
            e.setData({
                get_coupon_list: null
            }), wx.navigateTo({
                url: a || "/pages/list/list"
            });
        }), getApp().request({
            url: getApp().api.coupon.receive,
            data: {
                id: a
            },
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code ? e.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                }) : (getApp().core.showToast({
                    title: t.msg,
                    duration: 2e3
                }), e.setData({
                    coupon_list: t.data.coupon_list
                }));
            }
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    notice: function() {
        var t = this.data.notice;
        if (void 0 !== t) t.length;
    },
    miaoshaTimer: function() {
        var t = this;
        t.data.miaosha && 0 != t.data.miaosha.rest_time && (t.data.miaosha.ms_next || (timer = setInterval(function() {
            0 < t.data.miaosha.rest_time ? (t.data.miaosha.rest_time = t.data.miaosha.rest_time - 1, 
            t.data.miaosha.times = t.setTimeList(t.data.miaosha.rest_time), t.setData({
                miaosha: t.data.miaosha
            })) : clearInterval(timer);
        }, 1e3)));
    },
    onHide: function() {
        getApp().page.onHide(this), this.setData({
            play: -1
        }), clearInterval(interval);
    },
    onUnload: function() {
        getApp().page.onUnload(this), this.setData({
            play: -1
        }), clearInterval(timer), clearInterval(interval);
    },
    showNotice: function() {
        this.setData({
            show_notice: !0
        });
    },
    closeNotice: function() {
        this.setData({
            show_notice: !1
        });
    },
    to_dial: function() {
        var t = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: t
        });
    },
    closeActModal: function() {
        var t, a = this, e = a.data.act_modal_list, i = !0;
        for (var o in e) {
            var s = parseInt(o);
            e[s].show && (e[s].show = !1, void 0 !== e[t = s + 1] && i && (i = !1, setTimeout(function() {
                a.data.act_modal_list[t].show = !0, a.setData({
                    act_modal_list: a.data.act_modal_list
                });
            }, 500)));
        }
        a.setData({
            act_modal_list: e
        });
    },
    naveClick: function(t) {
        getApp().navigatorClick(t, this);
    },
    play: function(t) {
        this.setData({
            play: t.currentTarget.dataset.index
        });
    },
    onPageScroll: function(t) {
        var a = this;
        if (!fullScreen && -1 != a.data.play) {
            var e = getApp().core.getSystemInfoSync().windowHeight;
            "undefined" == typeof my ? getApp().core.createSelectorQuery().select(".video").fields({
                rect: !0
            }, function(t) {
                (t.top <= -200 || t.top >= e - 57) && a.setData({
                    play: -1
                });
            }).exec() : getApp().core.createSelectorQuery().select(".video").boundingClientRect().scrollOffset().exec(function(t) {
                (t[0].top <= -200 || t[0].top >= e - 57) && a.setData({
                    play: -1
                });
            });
        }
    },
    fullscreenchange: function(t) {
        fullScreen = !!t.detail.fullScreen;
    }
});