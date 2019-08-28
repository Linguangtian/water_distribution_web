var app = getApp();

function setOnShowScene(e) {
    app.onShowData || (app.onShowData = {}), app.onShowData.scene = e;
}

var pay = {
    init: function(l, e) {
        var _ = this, m = getApp().api;
        _.page = l, app = e;
        var A = getApp().core.getStorageSync(getApp().const.PARENT_ID);
        A || (A = 0), _.page.orderPay = function(e) {
            var t = e.currentTarget.dataset.index, a = _.page.data.order_list[t], o = new Array();
            if (void 0 !== _.page.data.pay_type_list) o = _.page.data.pay_type_list; else if (void 0 !== a.pay_type_list) o = a.pay_type_list; else if (void 0 !== a.goods_list[0].pay_type_list) o = a.goods_list[0].pay_type_list; else {
                var r = {
                    payment: 0
                };
                o.push(r);
            }
            var p = getCurrentPages(), s = p[p.length - 1].route, i = {};
            if (-1 != s.indexOf("pt")) n = m.group.pay_data, i.order_id = a.order_id; else if (-1 != s.indexOf("miaosha")) n = m.miaosha.pay_data, 
            i.order_id = a.order_id; else if (-1 != s.indexOf("book")) n = m.book.order_pay, 
            i.id = a.id; else {
                var n = m.order.pay_data;
                i.order_id = a.order_id;
            }
            function c(e, t, a) {
                e.pay_type = "WECHAT_PAY", app.request({
                    url: t,
                    data: e,
                    complete: function() {
                        getApp().core.hideLoading();
                    },
                    success: function(e) {
                        0 == e.code && (setOnShowScene("pay"), getApp().core.requestPayment({
                            _res: e,
                            timeStamp: e.data.timeStamp,
                            nonceStr: e.data.nonceStr,
                            package: e.data.package,
                            signType: e.data.signType,
                            paySign: e.data.paySign,
                            success: function(e) {},
                            fail: function(e) {},
                            complete: function(e) {
                                "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? getApp().core.redirectTo({
                                    url: "/" + a + "?status=1"
                                }) : getApp().core.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: !1,
                                    confirmText: "确认",
                                    success: function(e) {
                                        e.confirm && getApp().core.redirectTo({
                                            url: "/" + a + "?status=0"
                                        });
                                    }
                                });
                            }
                        })), 1 == e.code && getApp().core.showToast({
                            title: e.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
            function d(t, a, o) {
                t.pay_type = "BALANCE_PAY";
                var e = getApp().getUser();
                getApp().core.showModal({
                    title: "当前账户余额：" + e.money,
                    content: "是否使用余额",
                    success: function(e) {
                        e.confirm && (getApp().core.showLoading({
                            title: "正在提交",
                            mask: !0
                        }), app.request({
                            url: a,
                            data: t,
                            complete: function() {
                                getApp().core.hideLoading();
                            },
                            success: function(e) {
                                0 == e.code && getApp().core.redirectTo({
                                    url: "/" + o + "?status=1"
                                }), 1 == e.code && getApp().core.showModal({
                                    title: "提示",
                                    content: e.msg,
                                    showCancel: !1
                                });
                            }
                        }));
                    }
                });
            }
            i.parent_id = A, i.condition = 2, 1 == o.length ? (getApp().core.showLoading({
                title: "正在提交",
                mask: !0
            }), 0 == o[0].payment && c(i, n, s), 3 == o[0].payment && d(i, n, s)) : getApp().core.showModal({
                title: "提示",
                content: "选择支付方式",
                cancelText: "余额支付",
                confirmText: "线上支付",
                success: function(e) {
                    e.confirm ? (getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), c(i, n, s)) : e.cancel && d(i, n, s);
                }
            });
        }, _.page.order_submit = function(r, g) {
            var e = m.order.submit, p = m.order.pay_data, u = "/pages/order/order";
            if ("pt" == g ? (e = m.group.submit, p = m.group.pay_data, u = "/pages/pt/order/order") : "ms" == g ? (e = m.miaosha.submit, 
            p = m.miaosha.pay_data, u = "/pages/miaosha/order/order") : "pond" == g ? (e = m.pond.submit, 
            p = m.order.pay_data, u = "/pages/order/order") : "scratch" == g ? (e = m.scratch.submit, 
            p = m.order.pay_data, u = "/pages/order/order") : "lottery" == g ? (e = m.lottery.submit, 
            p = m.order.pay_data, u = "/pages/order/order") : "s" == g && (e = m.order.new_submit, 
            p = m.order.pay_data, u = "/pages/order/order"), 3 == r.payment) {
                var t = getApp().getUser();
                getApp().core.showModal({
                    title: "当前账户余额：" + t.money,
                    content: "是否确定使用余额支付",
                    success: function(e) {
                        e.confirm && a();
                    }
                });
            } else a();
            function a() {
                getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), app.request({
                    url: e,
                    method: "post",
                    data: r,
                    success: function(e) {
                        if (0 == e.code) {
                            var t = function() {
                                app.request({
                                    url: p,
                                    data: {
                                        order_id: d,
                                        order_id_list: a,
                                        pay_type: o,
                                        form_id: r.formId,
                                        parent_user_id: A,
                                        condition: 2
                                    },
                                    success: function(e) {
                                        if (0 != e.code) return getApp().core.hideLoading(), void getApp().core.showModal({
                                            title: "提示",
                                            content: e.msg,
                                            showCancel: !1,
                                            confirmText: "确认",
                                            success: function(e) {
                                                e.confirm && getApp().core.redirectTo({
                                                    url: u + "?status=0"
                                                });
                                            }
                                        });
                                        setTimeout(function() {
                                            getApp().core.hideLoading();
                                        }, 1e3), "pt" == g ? "ONLY_BUY" == _.page.data.type ? getApp().core.redirectTo({
                                            url: u + "?status=2"
                                        }) : getApp().core.redirectTo({
                                            url: "/pages/pt/group/details?oid=" + d
                                        }) : void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length && 2 != r.payment ? _.page.setData({
                                            show_card: !0
                                        }) : getApp().core.redirectTo({
                                            url: u + "?status=-1"
                                        });
                                    }
                                });
                            };
                            if (getApp().page.bindParent({
                                parent_id: A,
                                condition: 1
                            }), null != e.data.p_price && 0 === e.data.p_price) return l.showToast({
                                title: "提交成功"
                            }), void setTimeout(function() {
                                getApp().core.redirectTo({
                                    url: "/pages/order/order?status=1"
                                });
                            }, 2e3);
                            setTimeout(function() {
                                _.page.setData({
                                    options: {}
                                });
                            }, 1);
                            var d = e.data.order_id || "", a = e.data.order_id_list ? JSON.stringify(e.data.order_id_list) : "", o = "";
                            0 == r.payment ? app.request({
                                url: p,
                                data: {
                                    order_id: d,
                                    order_id_list: a,
                                    pay_type: "WECHAT_PAY",
                                    parent_user_id: A,
                                    condition: 2
                                },
                                success: function(e) {
                                    if (0 != e.code) {
                                        if (1 == e.code) return getApp().core.hideLoading(), void _.page.showToast({
                                            title: e.msg,
                                            image: "/images/icon-warning.png"
                                        });
                                    } else {
                                        setTimeout(function() {
                                            getApp().core.hideLoading();
                                        }, 1e3), setOnShowScene("pay"), e.data && 0 == e.data.price ? void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length ? _.page.setData({
                                            show_card: !0
                                        }) : getApp().core.redirectTo({
                                            url: u + "?status=1"
                                        }) : getApp().core.requestPayment({
                                            _res: e,
                                            timeStamp: e.data.timeStamp,
                                            nonceStr: e.data.nonceStr,
                                            package: e.data.package,
                                            signType: e.data.signType,
                                            paySign: e.data.paySign,
                                            success: function(e) {},
                                            fail: function(e) {},
                                            complete: function(e) {
                                                "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? "requestPayment:ok" != e.errMsg || (void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length ? _.page.setData({
                                                    show_card: !0
                                                }) : "pt" == g ? "ONLY_BUY" == _.page.data.type ? getApp().core.redirectTo({
                                                    url: u + "?status=2"
                                                }) : getApp().core.redirectTo({
                                                    url: "/pages/pt/group/details?oid=" + d
                                                }) : getApp().core.redirectTo({
                                                    url: u + "?status=1"
                                                })) : getApp().core.showModal({
                                                    title: "提示",
                                                    content: "订单尚未支付",
                                                    showCancel: !1,
                                                    confirmText: "确认",
                                                    success: function(e) {
                                                        e.confirm && getApp().core.redirectTo({
                                                            url: u + "?status=0"
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                        var t = getApp().core.getStorageSync(getApp().const.QUICK_LIST);
                                        if (t) {
                                            for (var a = t.length, o = 0; o < a; o++) for (var r = t[o].goods, p = r.length, s = 0; s < p; s++) r[s].num = 0;
                                            getApp().core.setStorageSync(getApp().const.QUICK_LISTS, t);
                                            var i = getApp().core.getStorageSync(getApp().const.CARGOODS);
                                            for (a = i.length, o = 0; o < a; o++) i[o].num = 0, i[o].goods_price = 0, l.setData({
                                                carGoods: i
                                            });
                                            getApp().core.setStorageSync(getApp().const.CARGOODS, i);
                                            var n = getApp().core.getStorageSync(getApp().const.TOTAL);
                                            n && (n.total_num = 0, n.total_price = 0, getApp().core.setStorageSync(getApp().const.TOTAL, n));
                                            getApp().core.getStorageSync(getApp().const.CHECK_NUM);
                                            0, getApp().core.setStorageSync(getApp().const.CHECK_NUM, 0);
                                            var c = getApp().core.getStorageSync(getApp().const.QUICK_HOT_GOODS_LISTS);
                                            for (a = c.length, o = 0; o < a; o++) c[o].num = 0, l.setData({
                                                quick_hot_goods_lists: c
                                            });
                                            getApp().core.setStorageSync(getApp().const.QUICK_HOT_GOODS_LISTS, c);
                                        }
                                    }
                                }
                            }) : 2 == r.payment ? (o = "HUODAO_PAY", t()) : 3 == r.payment && (o = "BALANCE_PAY", 
                            t());
                        }
                        if (1 == e.code) return getApp().core.hideLoading(), void _.page.showToast({
                            title: e.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
        };
     }
};

module.exports = pay;