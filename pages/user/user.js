Page({
    data: {
        contact_tel: "",
        show_customer_service: 0
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
    },
    loadData: function(e) {
        var t = this;
        t.setData({
            store: getApp().core.getStorageSync(getApp().const.STORE)
        }), getApp().request({
            url: getApp().api.user.index,
            success: function(a) {
                if (0 == a.code) {
                    if ("my" == t.data.__platform) a.data.menus.forEach(function(e, t, o) {
                        "bangding" === e.id && a.data.menus.splice(t, 1, 0);
                    });
                    t.setData(a.data), getApp().core.setStorageSync(getApp().const.PAGES_USER_USER, a.data), 
                    getApp().core.setStorageSync(getApp().const.SHARE_SETTING, a.data.share_setting), 
                    getApp().core.setStorageSync(getApp().const.USER_INFO, a.data.user_info);
                }
            }
        });
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this);
        this.loadData();
    },
    callTel: function(e) {
        var t = e.currentTarget.dataset.tel;
        getApp().core.makePhoneCall({
            phoneNumber: t
        });
    },
    apply: function(t) {
        var o = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), a = getApp().getUser();
        1 == o.share_condition ? getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != o.share_condition && 2 != o.share_condition || (0 == a.is_distributor ? getApp().core.showModal({
            title: "申请成为分销商",
            content: "是否申请？",
            success: function(e) {
                e.confirm && (getApp().core.showLoading({
                    title: "正在加载",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.share.join,
                    method: "POST",
                    data: {
                        form_id: t.detail.formId
                    },
                    success: function(e) {
                        0 == e.code && (0 == o.share_condition ? (a.is_distributor = 2, getApp().core.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (a.is_distributor = 1, getApp().core.navigateTo({
                            url: "/pages/share/index"
                        })), getApp().core.setStorageSync(getApp().const.USER_INFO, a));
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        }) : getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }));
    },
    verify: function(e) {
        getApp().core.scanCode({
            onlyFromCamera: !1,
            success: function(e) {
                getApp().core.navigateTo({
                    url: "/" + e.path
                });
            },
            fail: function(e) {
                getApp().core.showToast({
                    title: "失败"
                });
            }
        });
    },
    member: function() {
        getApp().core.navigateTo({
            url: "/pages/member/member"
        });
    },
    integral_mall: function(e) {
        var t, o;
        getApp().permission_list && getApp().permission_list.length && (t = getApp().permission_list, 
        o = "integralmall", -1 != ("," + t.join(",") + ",").indexOf("," + o + ",")) && getApp().core.navigateTo({
            url: "/pages/integral-mall/index/index"
        });
    },
    clearCache: function() {
        wx.showActionSheet({
            itemList: [ "清除缓存" ],
            success: function(e) {
                if (0 === e.tapIndex) {
                    wx.showLoading({
                        title: "清除中..."
                    });
                    getApp().getStoreData();
                    setInterval(function() {
                        wx.hideLoading();
                    }, 1e3);
                }
            }
        });
    }
});