var app = getApp(), api = getApp().api, is_no_more = !1, is_loading = !1, p = 2;

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
                0 == e.code && getApp().core.redirectTo({
                    url: "/pages/user-watervoucher/order"
                }),1 == e.code && getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
            }
        });
    },


});