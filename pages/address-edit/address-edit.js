var area_picker = require("./../../components/area-picker/area-picker.js");

Page({
    data: {
        name: "",
        mobile: "",
        detail: "",
        district: null
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var t = this;
        t.getDistrictData(function(e) {
            area_picker.init({
                page: t,
                data: e
            });
        }), t.setData({
            address_id: e.id
        }), e.id && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.user.address_detail,
            data: {
                id: e.id
            },
            success: function(e) {
                getApp().core.hideLoading(), 0 == e.code && t.setData(e.data);
            }
        }));
    },
    getDistrictData: function(t) {
        var a = getApp().core.getStorageSync(getApp().const.DISTRICT);
        if (!a) return getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), void getApp().request({
            url: getApp().api.default.district,
            success: function(e) {
                getApp().core.hideLoading(), 0 == e.code && (a = e.data, getApp().core.setStorageSync(getApp().const.DISTRICT, a), 
                t(a));
            }
        });
        t(a);
    },
    onAreaPickerConfirm: function(e) {
        this.setData({
            district: {
                province: {
                    id: e[0].id,
                    name: e[0].name
                },
                city: {
                    id: e[1].id,
                    name: e[1].name
                },
                district: {
                    id: e[2].id,
                    name: e[2].name
                }
            }
        });
    },
    saveAddress: function() {
        var t = this;
        if (!/^([0-9]{6,12})$/.test(t.data.mobile) && !/^(\d{3,4}-\d{6,9})$/.test(t.data.mobile) && !/^\+?\d[\d -]{8,12}\d/.test(t.data.mobile)) return t.showToast({
            title: "联系电话格式不正确"
        }), !1;
        getApp().core.showLoading({
            title: "正在保存",
            mask: !0
        });
        var e = t.data.district;
        e || (e = {
            province: {
                id: ""
            },
            city: {
                id: ""
            },
            district: {
                id: ""
            }
        }), getApp().request({
            url: getApp().api.user.address_save,
            method: "post",
            data: {
                address_id: t.data.address_id || "",
                name: t.data.name,
                mobile: t.data.mobile,
                province_id: e.province.id,
                city_id: e.city.id,
                district_id: e.district.id,
                detail: t.data.detail
            },
            success: function(e) {
                getApp().core.hideLoading(), 0 == e.code && getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.navigateBack();
                    }
                }), 1 == e.code && t.showToast({
                    title: e.msg
                });
            }
        });
    },
    inputBlur: function(e) {
        var t = '{"' + e.currentTarget.dataset.name + '":"' + e.detail.value + '"}';
        this.setData(JSON.parse(t));
    },
    getWechatAddress: function(e) {
        var a = this;
        getApp().core.chooseAddress({
            success: function(t) {
                "chooseAddress:ok" == t.errMsg && (getApp().core.showLoading(), getApp().request({
                    url: getApp().api.user.wechat_district,
                    data: {
                        national_code: t.nationalCode,
                        province_name: t.provinceName,
                        city_name: t.cityName,
                        county_name: t.countyName
                    },
                    success: function(e) {
                        1 == e.code && getApp().core.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1
                        }), a.setData({
                            name: t.userName || "",
                            mobile: t.telNumber || "",
                            detail: t.detailInfo || "",
                            district: e.data.district
                        });
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
    }
});