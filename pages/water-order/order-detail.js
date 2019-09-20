var app = getApp(), api = getApp().api;

Page({
    data: {
        isPageShow: !1,
        order: null,
        getGoodsTotalPrice: function() {
            return this.data.order.total_price;
        },
        return_bucket:'',
        notis:'',
        order_id:''
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var t = this;
        getApp().core.showLoading({
            title: "正在加载"
        });

      var order_id= e.id;
        var o = getCurrentPages(), a = o[o.length - 2];
        getApp().request({
            url: getApp().api.waterman.order_detail,
            data: {
               order_id: e.id,
               route: a.route
            },
            success: function(e) {
                0 == e.code && t.setData({
                    order: e.data,
                    bucket: e.bucket,
                    isPageShow: !0,
                    order_id: order_id
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    copyText: function(e) {
        var t = e.currentTarget.dataset.text;
        getApp().core.setClipboardData({
            data: t,
            success: function() {
                getApp().core.showToast({
                    title: "已复制"
                });
            }
        });
    },

    callTel: function(e) {
        var t = e.currentTarget.dataset.tel;
        getApp().core.makePhoneCall({
            phoneNumber: t
        });
    },

    commentSubmit:function(e){
        var a=this;
        var num=a.data.return_bucket;
        if(!num) return false;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
                url: getApp().api.waterman.order_confirm,
                method: "post",
                data: {
                    return_bucket: num,
                    order_id: this.data.order.id,

                },
                success: function(t) {
                    getApp().core.hideLoading();
                    getApp().core.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && 0 == t.code && getApp().core.redirectTo({
                                url: "/pages/waterman/index"
                            });
                        }
                    });
                }
        })

    },
    returnBucket:function(e){
        var num=e.detail.value;
        if(parseInt(num)||num>=0){
            this.setData({
                return_bucket:num,
                notis:''
            });
        }else{
            this.setData({
                return_bucket:'',
                notis:'请输入正确桶数'
            });
        }

    },

});