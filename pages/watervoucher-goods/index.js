var app = getApp(), api = getApp().api, is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {
        list: [],
        info: []
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), this.setData({
            status: t.status || 0,
            type: 0,
        }), this.loadData(t);
    },
    loadData: function(t) {
        var a = this;
        var  url;
        getApp().core.showLoading({
            title: "加载中"
        });

       url=getApp().api.watervoucher.goods_list_info;
        getApp().request({
            url:url ,
            data: { },
            success: function(t) {
                 a.setData({
                    list: t.goodsList.data.list,
                    info: t.mybucket

                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },

  onReachBottom: function () {
      var a = this;
    is_loading || is_no_more || (is_loading = !0, getApp().request({
      url: getApp().api.watervoucher.goods_list,
      data: {
          page: p
      },
      success: function (t) {
        if (0 == t.code) {
            var e = a.data.list.concat(t.data.list);
          a.setData({
              list: e
          }); 0 == t.data.list.length && (is_no_more = !0);
        }
        p++;
      },
      complete: function () {
        is_loading = !1;
      }
    }));
  },



});