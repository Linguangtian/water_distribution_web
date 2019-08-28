Page({
    data: {
        url: ""
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e), getApp().core.canIUse("web-view") ? this.setData({
            url: decodeURIComponent(e.url)
        }) : getApp().core.showModal({
            title: "提示",
            content: "您的版本过低，无法打开本页面，请升级至最新版。",
            showCancel: !1,
            success: function(e) {
                e.confirm && getApp().core.navigateBack({
                    delta: 1
                });
            }
        });
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this);
    },
    onHide: function(e) {
        getApp().page.onHide(this);
    },
    onUnload: function(e) {
        getApp().page.onUnload(this);
    },
    onShareAppMessage: function(e) {
        return getApp().page.onShareAppMessage(this), {
            path: "pages/web/web?url=" + encodeURIComponent(e.webViewUrl)
        };
    }
});