var shoppingCart = require("../../../components/shopping_cart/shopping_cart.js"), specificationsModel = require("../../../components/specifications_model/specifications_model.js");

Page({
    data: {
        quick_list: [],
        goods_list: [],
        carGoods: [],
        currentGood: {},
        checked_attr: [],
        checkedGood: [],
        attr_group_list: [],
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        check_goods_price: 0,
        showModal: !1,
        checked: !1,
        cat_checked: !1,
        color: "",
        total: {
            total_price: 0,
            total_num: 0
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    onShow: function() {
        getApp().page.onShow(this), shoppingCart.init(this), specificationsModel.init(this, shoppingCart), 
        this.loadData();
    },
    onHide: function() {
        getApp().page.onHide(this), shoppingCart.saveItemData(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this), shoppingCart.saveItemData(this);
    },
    loadData: function(t) {
        var d = this, r = getApp().core.getStorageSync(getApp().const.ITEM);
        d.setData({
            total: void 0 !== r.total ? r.total : {
                total_num: 0,
                total_price: 0
            },
            carGoods: void 0 !== r.carGoods ? r.carGoods : []
        }), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.quick.quick,
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var o = t.data.list, a = [], e = [];
                    for (var s in o) if (0 < o[s].goods.length) for (var i in e.push(o[s]), o[s].goods) {
                        var c = d.data.carGoods;
                        for (var n in c) r.carGoods[n].goods_id === parseInt(o[s].goods[i].id) && (o[s].goods[i].num = o[s].goods[i].num ? o[s].goods[i].num : 0, 
                        o[s].goods[i].num += r.carGoods[n].num);
                        parseInt(o[s].goods[i].hot_cakes) && a.push(o[s].goods[i]);
                    }
                    d.setData({
                        quick_hot_goods_lists: a,
                        quick_list: e
                    });
                }
            }
        });
    },
    get_goods_info: function(t) {
        var o = this, a = o.data.carGoods, e = o.data.total, s = o.data.quick_hot_goods_lists, i = o.data.quick_list, c = {
            carGoods: a,
            total: e,
            quick_hot_goods_lists: s,
            check_num: o.data.check_num,
            quick_list: i
        };
        getApp().core.setStorageSync(getApp().const.ITEM, c);
        var n = t.currentTarget.dataset.id;
        getApp().core.navigateTo({
            url: "/pages/goods/goods?id=" + n + "&quick=1"
        });
    },
    selectMenu: function(t) {
        var o = t.currentTarget.dataset, a = this.data.quick_list;
        if ("hot_cakes" == o.tag) for (var e = !0, s = a.length, i = 0; i < s; i++) a[i].cat_checked = !1; else {
            var c = o.index;
            for (s = a.length, i = 0; i < s; i++) a[i].cat_checked = !1, a[i].id == a[c].id && (a[i].cat_checked = !0);
            e = !1;
        }
        this.setData({
            toView: o.tag,
            quick_list: a,
            cat_checked: e
        });
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
        var o = this;
        return {
            path: "/pages/quick-purchase/index/index?user_id=" + getApp().core.getStorageSync(getApp().const.USER_INFO).id,
            success: function(t) {
                share_count++, 1 == share_count && o.shareSendCoupon(o);
            }
        };
    },
    close_box: function(t) {
        this.setData({
            showModal: !1
        });
    },
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    }
});