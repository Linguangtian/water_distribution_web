var is_loading = !1;

Page({
    data: {
        page: 1,
        num: 0
    },
    onLoad: function(a) {
        if (getApp().page.onLoad(this, a), a) {
            var n = this;
            n.setData(a), getApp().core.showLoading({
                title: "加载中"
            }), getApp().request({
                url: getApp().api.lottery.lucky_code,
                data: {
                    id: a.id
                },
                success: function(a) {
                    if (0 == a.code) {
                        n.setData(a.data);
                        var t = a.data;
                        if (t.award && t.award.lucky_code == a.data.own.lucky_code) var e = a.data.parent.length; else e = a.data.parent.length + 1;
                        n.setData({
                            num: e
                        });
                    }
                },
                complete: function(a) {
                    getApp().core.hideLoading();
                }
            });
        }
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    userload: function() {
        if (!is_loading) {
            is_loading = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var t = this, e = t.data.page + 1;
            getApp().request({
                url: getApp().api.lottery.lucky_code,
                data: {
                    id: t.data.id,
                    page: e
                },
                success: function(a) {
                    if (0 == a.code) {
                        if (null == a.data.parent || 0 == a.data.parent.length) return void (is_loading = !0);
                        t.setData({
                            parent: t.data.parent.concat(a.data.parent),
                            page: e,
                            num: t.data.parent.concat(a.data.parent).length
                        });
                    } else t.showToast({
                        title: a.msg
                    });
                },
                complete: function() {
                    getApp().core.hideLoading(), this.data.is_loading = !1;
                }
            });
        }
    }
});