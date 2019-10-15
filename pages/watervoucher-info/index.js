var app = getApp(), api = getApp().api, is_no_more = !1, is_loading = !1, p = 2;

function setOnShowScene(e) {
    app.onShowData || (app.onShowData = {}), app.onShowData.scene = e;
}


Page({
    data: {
        list: [],
        info: [],
        goods_id:'',
        price:'',
        cost_price:'',
        default_code:'',
        v_id:''

    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), this.setData({
            status: t.status || 0,
            type: 0,
        }), this.loadData(t);
    },
    loadData: function(t) {
        var a = this;
        a.setData({goods_id:t.goods_id});
        var  url;
        getApp().core.showLoading({
            title: "加载中"
        });

       url=getApp().api.watervoucher.info;
        getApp().request({
            url:url ,
            data: {
                goods_id:t.goods_id
            },
            success: function(t) {
                 a.setData({
                     list: t.data.list,
                     info: t.data,
                     price:t.data.default_price,
                     cost_price:t.data.default_cost_price,
                     default_code:t.data.default,
                     v_id:t.data.default_id,



                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },

    //选择优惠卷
    voucherClick: function(t) {
        var r = this,
            a = t.target.dataset.id,
            e = t.target.dataset.code,
            p = t.target.dataset.price,
            c = t.target.dataset.costprice;
        r.setData({
            price:p,
            cost_price:c,
            default_code:e,
            v_id:a,
        });

    },




    //提交订单
    buyVoucher :function(){

        var a = this;
        getApp().request({
            url: getApp().api.order.pay_voucher,
            data: {
                goods_id:a.data.goods_id,
                voucher_id:a.data.v_id,
                type: "voucher",

            },
            complete: function() {
                getApp().core.hideLoading();
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
                            console.info(56);
                            getApp().core.redirectTo({
                                url: "/pages/user-watervoucher/order"
                            })
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









       /*         0 == e.code && getApp().core.redirectTo({
                    url: "/pages/user-watervoucher/order"
                }),1 == e.code && getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });*/
            }
        });
    },


});