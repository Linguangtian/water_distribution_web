module.exports = {
    currentPage: null,
    shoppingCart: null,
    init: function(t, a) {
        var r = this;
        r.currentPage = t, r.shoppingCart = a, void 0 === t.showDialogBtn && (t.showDialogBtn = function(t) {
            r.showDialogBtn(t);
        }), void 0 === t.attrClick && (t.attrClick = function(t) {
            r.attrClick(t);
        }), void 0 === t.onConfirm && (t.onConfirm = function(t) {
            r.onConfirm(t);
        }), void 0 === t.guigejian && (t.guigejian = function(t) {
            r.guigejian(t);
        }), void 0 === t.close_box && (t.close_box = function(t) {
            r.close_box(t);
        }), void 0 === t.hideModal && (t.hideModal = function(t) {
            r.hideModal(t);
        });
    },
    showDialogBtn: function(t) {
        var a = this.currentPage, r = this, i = t.currentTarget.dataset;
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: i.id
            },
            success: function(t) {
                0 == t.code && (a.setData({
                    currentGood: t.data,
                    goods_name: t.data.name,
                    attr_group_list: t.data.attr_group_list,
                    showModal: !0
                }), r.resetData(), r.updateData(), r.checkAttrNum());
            }
        });
    },
    resetData: function() {
        this.currentPage.setData({
            checked_attr: [],
            check_num: 0,
            check_goods_price: 0,
            temporaryGood: {
                price: "0.00",
                num: 0
            }
        });
    },
    updateData: function() {
        var t = this.currentPage, a = t.data.currentGood, r = t.data.carGoods, i = JSON.parse(a.attr), o = a.attr_group_list;
        for (var e in i) {
            var n = [];
            for (var s in i[e].attr_list) n.push([ i[e].attr_list[s].attr_id, a.id ]);
            for (var c in r) {
                var d = [];
                for (var u in r[c].attr) d.push([ r[c].attr[u].attr_id, r[c].goods_id ]);
                if (n.sort().join() === d.sort().join()) {
                    for (var _ in o) for (var p in o[_].attr_list) for (var h in n) {
                        if (parseInt(o[_].attr_list[p].attr_id) === parseInt(n[h])) {
                            o[_].attr_list[p].checked = !0;
                            break;
                        }
                        o[_].attr_list[p].checked = !1;
                    }
                    var g = {
                        price: r[c].price
                    };
                    return void t.setData({
                        attr_group_list: o,
                        check_num: r[c].num,
                        check_goods_price: r[c].goods_price,
                        checked_attr: n,
                        temporaryGood: g
                    });
                }
            }
        }
    },
    checkUpdateData: function(t) {
        var a = this.currentPage, r = a.data.carGoods;
        for (var i in r) {
            var o = [];
            for (var e in r[i].attr) o.push([ r[i].attr[e].attr_id, r[i].goods_id ]);
            o.sort().join() === t.sort().join() && a.setData({
                check_num: r[i].num,
                check_goods_price: r[i].goods_price
            });
        }
    },
    attrClick: function(t) {
        var a = this.currentPage, r = this, i = parseInt(t.target.dataset.groupId), o = parseInt(t.target.dataset.id), e = a.data.attr_group_list, n = a.data.currentGood;
        for (var s in e) if (e[s].attr_group_id == i) for (var c in e[s].attr_list) {
            (u = e[s].attr_list[c]).attr_id == o && !0 !== u.checked ? u.checked = !0 : u.checked = !1;
        }
        var d = [];
        for (var s in e) for (var c in e[s].attr_list) {
            var u;
            !0 === (u = e[s].attr_list[c]).checked && d.push([ u.attr_id, n.id ]);
        }
        var _ = JSON.parse(n.attr), p = a.data.temporaryGood;
        for (var h in _) {
            var g = [];
            for (var l in _[h].attr_list) g.push([ _[h].attr_list[l].attr_id, n.id ]);
            if (g.sort().join() === d.sort().join()) {
                if (0 === parseInt(_[h].num)) return;
                p = parseFloat(_[h].price) ? {
                    price: parseFloat(_[h].price).toFixed(2),
                    num: _[h].num
                } : {
                    price: parseFloat(n.price).toFixed(2),
                    num: _[h].num
                };
            }
        }
        r.resetData(), r.checkUpdateData(d), a.setData({
            attr_group_list: e,
            temporaryGood: p,
            checked_attr: d
        }), r.checkAttrNum();
    },
    checkAttrNum: function() {
        var t = this.currentPage, a = t.data.attr_group_list, r = JSON.parse(t.data.currentGood.attr), i = t.data.checked_attr, o = [];
        for (var e in i) for (var n in r) {
            var s = [];
            for (var c in r[n].attr_list) s.push(r[n].attr_list[c].attr_id);
            if (getApp().helper.inArray(i[e][0], s) && 0 === r[n].num) for (var d in s) s[d] !== i[e][0] && o.push(s[d]);
        }
        for (var u in a) for (var _ in a[u].attr_list) {
            var p = a[u].attr_list[_];
            p.is_attr_num = !1, getApp().helper.inArray(p.attr_id, o) && (p.is_attr_num = !0);
        }
        t.setData({
            attr_group_list: a
        });
    },
    onConfirm: function(t) {
        var a = this.currentPage, r = a.data.attr_group_list, i = a.data.checked_attr, o = a.data.currentGood;
        if (i.length === r.length) {
            var e = a.data.check_num ? a.data.check_num + 1 : 1, n = JSON.parse(o.attr);
            for (var s in n) {
                var c = [];
                for (var d in n[s].attr_list) if (c.push([ n[s].attr_list[d].attr_id, o.id ]), c.sort().join() === i.sort().join()) {
                    var u = n[s].price ? n[s].price : o.price, _ = n[s].attr_list;
                    if (e > n[s].num) return void wx.showToast({
                        title: "商品库存不足",
                        image: "/images/icon-warning.png"
                    });
                }
            }
            var p = a.data.carGoods, h = 1, g = parseFloat(u * e).toFixed(2);
            for (var l in p) {
                var f = [];
                for (var v in p[l].attr) f.push([ p[l].attr[v].attr_id, p[l].goods_id ]);
                if (f.sort().join() === i.sort().join()) {
                    h = 0, p[l].num = p[l].num + 1, p[l].goods_price = parseFloat(u * p[l].num).toFixed(2);
                    break;
                }
            }
            1 !== h && 0 !== p.length || p.push({
                goods_id: o.id,
                attr: _,
                goods_name: o.name,
                goods_price: u,
                num: 1,
                price: u
            }), a.setData({
                carGoods: p,
                check_goods_price: g,
                check_num: e
            }), this.shoppingCart.carStatistics(a), this.attrGoodStatistics(), this.shoppingCart.updateGoodNum();
        } else wx.showToast({
            title: "请选择规格",
            image: "/images/icon-warning.png"
        });
    },
    guigejian: function(t) {
        var a = this.currentPage, r = a.data.checked_attr, i = a.data.carGoods, o = a.data.check_num ? --a.data.check_num : 1;
        a.data.currentGood;
        for (var e in i) {
            var n = [];
            for (var s in i[e].attr) n.push([ i[e].attr[s].attr_id, i[e].goods_id ]);
            if (n.sort().join() === r.sort().join()) return 0 < i[e].num && (i[e].num -= 1, 
            i[e].goods_price = parseFloat(i[e].num * i[e].price).toFixed(2)), a.setData({
                carGoods: i,
                check_goods_price: i[e].goods_price,
                check_num: o
            }), this.shoppingCart.carStatistics(a), this.attrGoodStatistics(), void this.shoppingCart.updateGoodNum();
        }
    },
    attrGoodStatistics: function() {
        var t = this.currentPage, a = t.data.currentGood, r = t.data.carGoods, i = t.data.quick_list, o = t.data.quick_hot_goods_lists, e = 0;
        for (var n in r) r[n].goods_id === a.id && (e += r[n].num);
        for (var n in i) for (var s in i[n].goods) parseInt(i[n].goods[s].id) === a.id && (i[n].goods[s].num = e);
        for (var n in o) parseInt(o[n].id) === a.id && (o[n].num = e);
        t.setData({
            quick_list: i,
            quick_hot_goods_lists: o
        });
    },
    close_box: function(t) {
        this.currentPage.setData({
            showModal: !1
        });
    },
    hideModal: function() {
        this.currentPage.setData({
            showModal: !1
        });
    }
};