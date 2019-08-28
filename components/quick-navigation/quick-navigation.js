module.exports = {
    init: function(t) {
        var o = this;
        o.currentPage = t, o.setNavi(), void 0 === t.cutover && (t.cutover = function(t) {
            o.cutover(t);
        }), void 0 === t.to_dial && (t.to_dial = function(t) {
            o.to_dial(t);
        }), void 0 === t.map_goto && (t.map_goto = function(t) {
            o.map_goto(t);
        }), void 0 === t.map_power && (t.map_power = function(t) {
            o.map_power(t);
        });
    },
    setNavi: function() {
        var e = this.currentPage;
        -1 != [ "pages/index/index", "pages/book/details/details", "pages/pt/details/details", "pages/goods/goods" ].indexOf(this.getCurrentPageUrl()) && e.setData({
            home_icon: !0
        }), getApp().getConfig(function(t) {
            var o = t.store.quick_navigation;
            o.home_img || (o.home_img = "/images/quick-home.png"), e.setData({
                setnavi: o
            });
        });
    },
    getCurrentPageUrl: function() {
        var t = getCurrentPages();
        return t[t.length - 1].route;
    },
    to_dial: function() {
        getApp().getConfig(function(t) {
            var o = t.store.contact_tel;
            console.log(o), getApp().core.makePhoneCall({
                phoneNumber: o
            });
        });
    },
    map_power: function() {
        var e = this.currentPage;
        getApp().getConfig(function(t) {
            var o = t.store.option.quick_map;
            void 0 !== o ? e.map_goto(o) : getApp().core.getSetting({
                success: function(t) {
                    t.authSetting["scope.userLocation"] ? e.map_goto(o) : getApp().getauth({
                        content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                        cancel: !1,
                        author: "scope.userLocation",
                        success: function(t) {
                            t.authSetting["scope.userLocation"] && e.map_goto(o);
                        }
                    });
                }
            });
        });
    },
    map_goto: function(t) {
        this.currentPage;
        var o = t.lal.split(",");
        getApp().core.openLocation({
            latitude: parseFloat(o[0]),
            longitude: parseFloat(o[1]),
            address: t.address
        });
    },
    cutover: function() {
        var i = this.currentPage;
        i.setData({
            quick_icon: !i.data.quick_icon
        });
        var a = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        }), n = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        }), p = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        }), c = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        }), r = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        }), s = getApp().core.createAnimation({
            duration: 350,
            timingFunction: "ease-out"
        });
        getApp().getConfig(function(t) {
            var o = i.data.store, e = -55;
            i.data.quick_icon ? (o.option && o.option.wxapp && o.option.wxapp.pic_url && (r.translateY(e).opacity(1).step(), 
            e -= 55), o.show_customer_service && 1 == o.show_customer_service && o.service && (c.translateY(e).opacity(1).step(), 
            e -= 55), o.option && o.option.web_service && (p.translateY(e).opacity(1).step(), 
            e -= 55), 1 == o.dial && o.dial_pic && (n.translateY(e).opacity(1).step(), e -= 55), 
            o.option && 1 == o.option.quick_map.status && (s.translateY(e).opacity(1).step(), 
            e -= 55), a.translateY(e).opacity(1).step()) : (a.opacity(0).step(), p.opacity(0).step(), 
            n.opacity(0).step(), c.opacity(0).step(), r.opacity(0).step(), s.opacity(0).step()), 
            i.setData({
                animationPlus: a.export(),
                animationcollect: p.export(),
                animationPic: n.export(),
                animationTranspond: c.export(),
                animationInput: r.export(),
                animationMapPlus: s.export()
            });
        });
    }
};