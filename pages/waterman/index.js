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

       url=getApp().api.waterman.info;
        getApp().request({
            url:url ,
            data: {
                type: a.data.type,

            },
            success: function(t) {
                console.info(t.info);
                 a.setData({
                    list: t.order.data.list,
                    info: t.info

                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },

  onReachBottom: function () {
      var a = this;
      if(a.data.status!=2) return false;
      //status==1 已使用  status==2水票记录
    is_loading || is_no_more || (is_loading = !0, getApp().request({
      url: getApp().api.waterman.order,
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