var utils = require("../../../utils/helper.js"), WxParse = require("../../../wxParse/wxParse.js"), goodsBanner = require("../../../components/goods/goods_banner.js"), gSpecificationsModel = require("../../../components/goods/specifications_model.js"), goodsInfo = require("../../../components/goods/goods_info.js"), goodsBuy = require("../../../components/goods/goods_buy.js"), quickNavigation = require("../../../components/quick-navigation/quick-navigation.js"), p = 1, is_loading_comment = !1, is_more_comment = !0, share_count = 0;

Page({
    data: {
        pageType: "MIAOSHA",
        id: null,
        goods: {},
        show_attr_picker: !1,
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        },
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: getApp().core.getSystemInfoSync().windowWidth,
        y: getApp().core.getSystemInfoSync().windowHeight - 20,
        miaosha_end_time_over: {
            h: "--",
            m: "--",
            s: "--",
            type: 0
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), is_more_comment = !(is_loading_comment = !(p = 1));
        share_count = 0;
        var a = t.user_id, e = decodeURIComponent(t.scene), o = 0;
        if (void 0 !== a) a; else if ("undefined" == typeof my) {
            if (void 0 !== t.scene) {
                o = 1;
                e = decodeURIComponent(t.scene);
                var i = utils.scene_decode(e);
                i.uid && i.gid ? (i.uid, t.id = i.gid) : e;
            }
        } else if (null !== getApp().query) {
            o = 1;
            var s = getApp().query;
            getApp().query = null, t.id = s.gid;
        }
        var n = this;
        n.setData({
            id: t.id,
            scene_type: o
        }), n.getGoods(), n.getCommentList();
    },
    getGoods: function() {
        var n = this, t = {};
        n.data.id && (t.id = n.data.id), n.data.goods_id && (t.goods_id = n.datat.goods_id), 
        t.scene_type = n.data.scene_type, getApp().request({
            url: getApp().api.miaosha.details,
            data: t,
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.detail;
                    WxParse.wxParse("detail", "html", a, n);
                    var e = t.data, o = t.data.miaosha, i = [];
                    for (var s in e.pic_list) i.push(e.pic_list[s].pic_url);
                    e.pic_list = i, e.min_price = o.new_small_price, e.sales_volume = o.sell_num, n.setData({
                        goods: e,
                        attr_group_list: t.data.attr_group_list,
                        miaosha_data: t.data.miaosha.miaosha_data
                    }), 1 == n.data.scene_type && n.setData({
                        id: t.data.miaosha.miaosha_goods_id
                    }), n.data.goods.miaosha && n.setMiaoshaTimeOver(), n.selectDefaultAttr();
                }
                1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var e in t.data.attr_group_list[a].attr_list) 0 == a && 0 == e && (t.data.attr_group_list[a].attr_list[e].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    getCommentList: function(a) {
        var e = this;
        a && "active" != e.data.tab_comment || is_loading_comment || is_more_comment && (is_loading_comment = !0, 
        getApp().request({
            url: getApp().api.miaosha.comment_list,
            data: {
                goods_id: e.data.id,
                page: p
            },
            success: function(t) {
                0 == t.code && (is_loading_comment = !1, p++, e.setData({
                    comment_count: t.data.comment_count,
                    comment_list: a ? e.data.comment_list.concat(t.data.list) : t.data.list
                }), 0 == t.data.list.length && (is_more_comment = !1));
            }
        }));
    },
    addCart: function() {
        this.submit("ADD_CART");
    },
    buyNow: function() {
        this.data.goods.miaosha ? this.submit("BUY_NOW") : getApp().core.showModal({
            title: "提示",
            content: "秒杀商品当前时间暂无活动",
            showCancel: !1,
            success: function(t) {}
        });
    },
    submit: function(t) {
        var a = this;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        if (a.data.miaosha_data && 0 < a.data.miaosha_data.rest_num && a.data.form.number > a.data.miaosha_data.rest_num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (1e3 * this.data.goods.miaosha.begin_time > Date.parse(new Date())) return getApp().core.showToast({
            title: "活动未开始",
            image: "/images/icon-warning.png"
        }), !0;
        if (a.data.form.number > a.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var e = a.data.attr_group_list, o = [];
        for (var i in e) {
            var s = !1;
            for (var n in e[i].attr_list) if (e[i].attr_list[n].checked) {
                s = {
                    attr_id: e[i].attr_list[n].attr_id,
                    attr_name: e[i].attr_list[n].attr_name
                };
                break;
            }
            if (!s) return getApp().core.showToast({
                title: "请选择" + e[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            o.push({
                attr_group_id: e[i].attr_group_id,
                attr_group_name: e[i].attr_group_name,
                attr_id: s.attr_id,
                attr_name: s.attr_name
            });
        }
        "ADD_CART" == t && (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: a.data.id,
                attr: JSON.stringify(o),
                num: a.data.form.number
            },
            success: function(t) {
                getApp().core.showToast({
                    title: t.msg,
                    duration: 1500
                }), getApp().core.hideLoading(), a.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == t && (a.setData({
            show_attr_picker: !1
        }), getApp().core.redirectTo({
            url: "/pages/miaosha/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.id,
                attr: o,
                num: a.data.form.number
            })
        }));
    },
    favoriteAdd: function() {
        var e = this;
        getApp().request({
            url: getApp().api.user.favorite_add,
            method: "post",
            data: {
                goods_id: e.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = e.data.goods;
                    a.is_favorite = 1, e.setData({
                        goods: a
                    });
                }
            }
        });
    },
    favoriteRemove: function() {
        var e = this;
        getApp().request({
            url: getApp().api.user.favorite_remove,
            method: "post",
            data: {
                goods_id: e.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = e.data.goods;
                    a.is_favorite = 0, e.setData({
                        goods: a
                    });
                }
            }
        });
    },
    tabSwitch: function(t) {
        "detail" == t.currentTarget.dataset.tab ? this.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : this.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var a = t.currentTarget.dataset.index, e = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: this.data.comment_list[a].pic_list[e],
            urls: this.data.comment_list[a].pic_list
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), goodsBanner.init(this), gSpecificationsModel.init(this), 
        goodsInfo.init(this), goodsBuy.init(this), quickNavigation.init(this);
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
        this.getCommentList(!0);
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
        var a = this, e = getApp().getUser();
        return {
            path: "/pages/miaosha/details/details?id=" + this.data.id + "&user_id=" + e.id,
            success: function(t) {
                1 == ++share_count && getApp().shareSendCoupon(a);
            },
            title: a.data.goods.name,
            imageUrl: a.data.goods.pic_list[0]
        };
    },
    play: function(t) {
        var a = t.target.dataset.url;
        this.setData({
            url: a,
            hide: "",
            show: !0
        }), getApp().core.createVideoContext("video").play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), getApp().core.createVideoContext("video").pause();
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    setMiaoshaTimeOver: function() {
        var a = this;
        function t() {
            var t = a.data.goods.miaosha.end_time - a.data.goods.miaosha.now_time;
            t = t < 0 ? 0 : t, a.data.goods.miaosha.now_time++, a.setData({
                goods: a.data.goods,
                miaosha_end_time_over: function(t) {
                    var a = parseInt(t / 3600), e = parseInt(t % 3600 / 60), o = t % 60, i = 0;
                    1 <= a && (a -= 1, i = 1);
                    return {
                        h: a < 10 ? "0" + a : "" + a,
                        m: e < 10 ? "0" + e : "" + e,
                        s: o < 10 ? "0" + o : "" + o,
                        type: i
                    };
                }(t)
            });
        }
        t(), setInterval(function() {
            t();
        }, 1e3);
    },
    to_dial: function(t) {
        var a = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: a
        });
    }
});