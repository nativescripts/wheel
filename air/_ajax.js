/*
 * DOM基本操作、获取URL参数、Cookie基本操作、
 * AJAX简单封装、支持链式写法
 * todo：对DOM事件没有封装，不能基于该组件获取DOM后，直接绑定事件,
 * 可以这样使用 $$().dom.onclick = function () {};
 * None++
 * 2017/3/20
 */

function _ajax(el,index){
    this.el = el || 'html';
    this.index = index || 0;
    this.dom = document.querySelectorAll(this.el)[this.index];
    return this;
}
_ajax.prototype = {
    query: function (el,index) {
        this.el = el || 'html';
        this.index = index || 0;
        this.dom = document.querySelectorAll(this.el)[this.index];
        return this;
    },
    show: function () {
        if(this.dom){ this.dom.style.display = "block"; }
        return this;
    },
    hide: function () {
        if(this.dom){ this.dom.style.display = "none"; }
        return this;
    },
    html: function (html) {
        if(this.dom && html){ this.dom.innerHTML = html; }
        return this.dom.innerHTML;
    },
    text: function () {
        if(this.dom){ return this.dom.textContent || this.dom.innerText; }
        return this;
    },
    val: function () {
        if(this.dom){ return this.dom.value; }
        return this;
    },
    remove: function () {
        if(this.dom){
            var toRemove = document.querySelector(this.dom);
            toRemove.parentNode.removeChild(toRemove);
        }
        return this;
    },
    parent: function () {
        if(this.dom){ return this.dom.parentNode; }
        return this;
    },
    prev: function () {
        if(this.dom){ return this.dom.previousElementSibling; }
        return this;
    },
    next: function () {
        if(this.dom){ return this.dom.nextElementSibling; }
        return this;
    },
    height: function () {
        if(this.dom){
            var _height = this.dom.clientHeight;
            var style = this.dom.currentStyle || getComputedStyle(this.dom);
            return _height - (parseInt(style.paddingTop) + parseInt(style.paddingBottom));
        }
        return this;
    },
    type: function (fn) {
        return Object.prototype.toString.call(fn).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
    },
    isArray: function (value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    },
    extend: function (obj1,obj2) {
        return Object.assign({},obj1,obj2);
    },
    trim: function (str) {
        var reExtraSpace = /^\s*(.*?)\s+$/;
        return str.replace(reExtraSpace, "$1");
    },
    replaceAll: function (str,s1,s2) {
        return str.replace(new RegExp(s1, "gm"), s2);
    },
    setCss: function (css) {
        if(this.dom && css){ this.dom.style.cssText = css; }
        return this;
    },
    getCss: function (css) {
        if(this.dom && css){
            if(this.dom.currentStyle){
                return this.dom.currentStyle[css];
            }else{
                return getComputedStyle(this.dom,null)[css];
            }
        }
        return this;
    },
    attr: function (key,value) {
        if(!this.dom || !key){ return this; }
        if(value){
            this.dom.setAttribute(key, value);
            return this;
        }else{
            return this.dom.getAttribute(key);
        }
    },
    removeAttr: function (key) {
        if(!this.dom || !key){ return this; }
        this.dom.removeAttribute(key);
        return this;
    },
    addClass: function (cl) {
        if(this.dom){ this.dom.classList.add(cl); }
        return this;
    },
    removeClass: function (cl) {
        if(this.dom){ this.dom.classList.remove(cl); }
        return this;
    },
    hasClass: function (cl) {
        if(this.dom){ return this.dom.classList.contains(cl); }
        return this;
    },
    toggleClass: function (cl) {
        if(this.dom){ this.dom.classList.toggle(cl); }
        return this;
    },
    setCookie: function (key, value, expires) {
        var date = new Date(),
            exp = '';
        if (typeof expires === 'number') {
            date.setMinutes(date.getMinutes() + expires);
            exp = "; expires=" + date.toUTCString();
        }
        return document.cookie = [key, "=", window.encodeURIComponent(value), exp, "; path=/", "; domain=" + document.domain].join("");
    },
    getCookie: function (key) {
        var value;
        return (value = new window.RegExp("(?:^|; )" + key + "=([^;]*)").exec(document.cookie)) ? window.decodeURIComponent(value[1]) : null;
    },
    // 删除指定cookie
    delCookie: function (key) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(key);
        if(cval!=null){
            document.cookie= key + "="+cval+";expires="+exp.toGMTString();
        }
    },
    // 清除该域名下所有cookie
    clearCookie: function () {
        var keys = document.cookie.match(/[^ =;]+(?==)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + '; path=/; domain=' + document.domain;
            }
        }
    },
    // 获取url参数
    getUrlQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
            r = location.search.substr(1).match(reg);
        if (r !== null) {
            return window.decodeURIComponent(r[2]);
        }
        return '';
    },
    ajax: function (options) {
        var xhr, params;
        options = options || {};
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        options.async = options.async || true;
        if(options.data){
            params = options.data;
        }

        // 创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        // 接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        };

        // 连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, options.async);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, options.async);
            // 设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            xhr.setRequestHeader("X-Auth-Token", options.token);
            if(params){
                xhr.send(params);
            }else{
                xhr.send();
            }
        }
    },
    // 获取ua
    getUa: function () {
        var ua = {};
        var userAgent = navigator.userAgent.toLowerCase();
        var data = {
            platforms: [
                // windows phone must be tested before win
                { tag: 'windows phone', flags: ['winPhone', 'mobile']},
                { tag: 'win', flags: ['win']},
                // ipad and ipod must be tested before iphone
                { tag: 'ipad', flags: ['ipad', 'ios'] },
                { tag: 'ipod', flags: ['ipod', 'ios', 'mobile'] },
                // iphone must be tested before mac
                { tag: 'iphone', flags: ['iphone', 'ios', 'mobile'] },
                { tag: 'macintosh', flags: ['mac', 'ios'] },
                // android must be tested before linux
                { tag: 'android', flags: ['android'] },
                //versionSearch: '(?:blackberry\\d{4}[a-z]?|version)/',
                { tag: 'blackberry', flags: ['blackberry', 'mobile'] },
                { tag: 'linux', flags: ['linux'] }
            ],
            browsers: [
                { tag: 'micromessenger', flags: ['weixin'] },
                { tag: '__weibo__', flags: ['weibo'] },
                { tag: /ucbrowser|ucweb/, flags: ['uc'] },
                { tag: 'qqbrowser', flags: ['qq'] },
                { tag: /letvmobileclient\s+android;letv;/, flags: ['superLetvClient'] },
                { tag: /leuibrowser|eui browser/, flags: ['letvMobile', 'letvBrowser'] },
                { tag: 'baiduboxapp', flags: ['baidubox'] },
                { tag: 'baidubrowser', flags: ['baidu'] },
                { tag: 'xiaomi', flags: ['xiaomi'] },
                { tag: 'iemobile', flags: ['ieMobile', 'mobile']}, // IE手机浏览器
                { tag: 'msie ', flags: ['msie']}, // IE浏览器
                { tag: 'chrome', flags: ['chrome']}, // 谷歌浏览器
                { tag: 'crios', flags: ['chrome']}, // 谷歌浏览器
                { tag: 'firefox', flags: ['firefox']}, // firefox浏览器
                { tag: 'opera', flags: ['opera']}, // opera浏览器
                { tag: /iphone.+?safari/, flags: ['safari']} // safari浏览器
            ],
            engines: [
                { tag: 'trident', flags: ['trident'] },
                // webkit must be tested before gecko
                { tag: 'webkit', flags: ['webkit'] },
                { tag: 'gecko', flags: ['gecko'] },
                { tag: 'presto', flags: ['presto'] }
            ]
        };

        var detect = function (items) {
            var flags, item, i, len, tag, got, j;
            for (i = 0, len = items.length; i < len; i++) {
                item = items[i];
                tag = item.tag;
                got = typeof tag==='string' ? userAgent.indexOf(tag)>-1 : tag.test(userAgent);
                if (got) {
                    flags = item.flags;
                    if (flags) {
                        for (j = flags.length; j--; ) {
                            ua[flags[j]] = true;
                        }
                    }
                    break;
                }
            }
        };

        detect(data.platforms);
        detect(data.browsers);
        detect(data.engines);
        ua.mobile || (ua.mobile = userAgent.indexOf('mobile')>0);
        ua.android && (ua.androidPad = !ua.mobile);
        if (!ua.msie) {
            //IE 11 的ua里已经没有msie字样
            ua.msie = !!window.ActiveXObject || 'ActiveXObject' in window;
        }
        ua.src = userAgent;
        return ua;
    }
};
// function $$$(){ return new _ajax(); }
// window.$$ = $$$();
window.$$ = function(el,index){
    return new _ajax(el,index);
};
