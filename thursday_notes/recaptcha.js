!function (e) {
    !function (e) {
        var t, s, r;

        function n() {
        }

        function i() {
            this.headerTags = {}, this.errorHandler = function (e) {
            };
            var e = t.getClientInfo();
            this.session = new s(e)
        }

        e = e.Challenge || (e.Challenge = {}), n.getClientInfo = function () {
            try {
                var e = "Unknown", t = "";
                screen.width && (t += (screen.width || "") + " x " + (screen.height || ""));
                var s, r, n, i, a = navigator.appVersion, o = navigator.userAgent, c = navigator.appName,
                    d = "" + parseFloat(navigator.appVersion);
                parseInt(navigator.appVersion, 10);
                -1 !== (n = o.indexOf("Opera")) ? (c = "Opera", d = o.substring(n + 6), -1 !== (n = o.indexOf("Version")) && (d = o.substring(n + 8))) : -1 !== (n = o.indexOf("MSIE")) ? (c = "Microsoft Internet Explorer", d = o.substring(n + 5)) : "Netscape" === c && -1 !== o.indexOf("Trident/") ? (c = "Microsoft Internet Explorer", d = o.substring(n + 5), -1 !== (n = o.indexOf("rv:")) && (d = o.substring(n + 3))) : -1 !== (n = o.indexOf("Chrome")) ? (c = "Chrome", d = o.substring(n + 7)) : -1 !== (n = o.indexOf("Safari")) ? (c = "Safari", d = o.substring(n + 7), -1 !== (n = o.indexOf("Version")) && (d = o.substring(n + 8)), -1 !== o.indexOf("CriOS") && (c = "Chrome")) : -1 !== (n = o.indexOf("Firefox")) ? (c = "Firefox", d = o.substring(n + 8)) : (r = o.lastIndexOf(" ") + 1) < (n = o.lastIndexOf("/")) && (c = o.substring(r, n), d = o.substring(n + 1), c.toLowerCase() === c.toUpperCase() && (c = navigator.appName)), -1 !== (i = (d = -1 !== (i = (d = -1 !== (i = d.indexOf(";")) ? d.substring(0, i) : d).indexOf(" ")) ? d.substring(0, i) : d).indexOf(")")) && (d = d.substring(0, i)), s = parseInt("" + d, 10), isNaN(s) && (d = "" + parseFloat(navigator.appVersion), parseInt(navigator.appVersion, 10));
                var l = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(a), h = !!navigator.cookieEnabled;
                void 0 !== navigator.cookieEnabled || h || (document.cookie = "testcookie", h = -1 !== document.cookie.indexOf("testcookie"));
                var u, p = e, g = [{s: "Windows 3.11", r: /Win16/}, {
                    s: "Windows 95",
                    r: /(Windows 95|Win95|Windows_95)/
                }, {s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/}, {
                    s: "Windows 98",
                    r: /(Windows 98|Win98)/
                }, {s: "Windows CE", r: /Windows CE/}, {
                    s: "Windows 2000",
                    r: /(Windows NT 5.0|Windows 2000)/
                }, {s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/}, {
                    s: "Windows Server 2003",
                    r: /Windows NT 5.2/
                }, {s: "Windows Vista", r: /Windows NT 6.0/}, {
                    s: "Windows 7",
                    r: /(Windows 7|Windows NT 6.1)/
                }, {s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/}, {
                    s: "Windows 8",
                    r: /(Windows 8|Windows NT 6.2)/
                }, {s: "Windows 10", r: /(Windows NT 10.0)/}, {
                    s: "Windows NT 4.0",
                    r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
                }, {s: "Windows ME", r: /Windows ME/}, {s: "Android", r: /Android/}, {
                    s: "Open BSD",
                    r: /OpenBSD/
                }, {s: "Sun OS", r: /SunOS/}, {s: "Linux", r: /(Linux|X11)/}, {
                    s: "iOS",
                    r: /(iPhone|iPad|iPod)/
                }, {s: "Mac OS X", r: /Mac OS X/}, {
                    s: "Mac OS",
                    r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
                }, {s: "QNX", r: /QNX/}, {s: "UNIX", r: /UNIX/}, {s: "BeOS", r: /BeOS/}, {
                    s: "OS/2",
                    r: /OS\/2/
                }, {
                    s: "Search Bot",
                    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
                }];
                for (u in g) {
                    var f = g[u];
                    if (f.r.test(o)) {
                        p = f.s;
                        break
                    }
                }
                var w = e;
                switch (/Windows/.test(p) && (w = /Windows (.*)/.exec(p)[1], p = "Windows"), p) {
                    case"Mac OS X":
                        w = /Mac OS X (10[\.\_\d]+)/.exec(o)[1];
                        break;
                    case"Android":
                        w = /Android ([\.\_\d]+)/.exec(o)[1];
                        break;
                    case"iOS":
                        var b = /OS (\d+)_(\d+)_?(\d+)?/.exec(a), w = b[1] + "." + b[2] + "." + (0 | parseInt(b[3]))
                }
                return {screen: t, browser: c, browserVersion: d, mobile: l, os: p, osVersion: w, cookies: h}
            } catch (e) {
                return {screen: "", browser: "", browserVersion: "", mobile: !1, os: "", osVersion: "", cookies: !1}
            }
        }, t = n, s = function (e) {
            this.stats = new r, this.stats.userAgent = navigator.userAgent, this.stats.screen = e.screen, this.stats.browser = e.browser, this.stats.browserVersion = e.browserVersion, this.stats.isMobile = e.mobile, this.stats.os = e.os, this.stats.osVersion = e.osVersion, this.stats.cookiesEnabled = e.cookies, this.stats.tries = 0, this.tags = new Array
        }, r = function () {
        }, i.prototype.init = function (e) {
            if (e.callback && (this.callback = e.callback), e.errorHandler && (this.errorHandler = e.errorHandler), this.session.userId = e.userId, this.session.stats.tries++, this.setupDefaultRequestHeaders(e), e.tags && this.isObject(e.tags)) for (var t in e.tags) {
                var s = e.tags[t];
                this.isObject(s) || Array.isArray(s) || (this.headerTags[t = "X-Queueit-Challange-" + t] = s, this.session.tags.push(t + ":" + s))
            }
        }, i.prototype.setupDefaultRequestHeaders = function (e) {
            e = e.challengesIssuedByReason;
            this.headerTags["X-Queueit-Challange-reason"] = e
        }, i.prototype.registerChallenge = function (e) {
            this.session.meta = e.meta, this.session.sessionId = e.sessionId, this.session.parameters = e.parameters
        }, i.prototype.resolve = function (e, t, s) {
            this.session.solution = e, this.session.key = t, this.session.stats.duration = (new Date).getTime() - this.beforeChallenge, this.session.meta = s, this.callback(this.sessionId, this.challengeDetails, e, this.session.stats)
        }, i.prototype.getChallengeUrl = function (e, t) {
            var s = "/challengeapi/".concat(t, "/challenge/"), t = "";
            return e && (t = e.startsWith("/") ? e : "/".concat(e)), "".concat(t).concat(s)
        }, i.prototype.getChallenge = function (e, s) {
            var t, r = this, n = new XMLHttpRequest;
            for (t in n.onload = function (e) {
                var t;
                200 === n.status ? (t = JSON.parse(n.responseText), r.beforeChallenge = (new Date).getTime(), r.sessionId = t.sessionId, r.challengeDetails = t.challengeDetails, r.registerChallenge(r.session), s(t)) : 400 <= n.status && n.status < 500 ? (t = JSON.parse(n.responseText), r.errorHandler({
                    errorText: (null == t ? void 0 : t.title) || "Could not fetch challenge. Server returned '" + n.statusText + "'",
                    errorCodes: null != t && t.detail ? [t.detail] : []
                })) : r.errorHandler({
                    errorText: "Could not fetch challenge. Server returned '" + n.statusText + "'",
                    errorCodes: []
                })
            }, n.addEventListener("error", function (e) {
                r.errorHandler("Failed to execute ajax request. Error: '" + JSON.stringify({
                    lengthComputable: e.lengthComputable,
                    isProgressEvent: e instanceof ProgressEvent,
                    loaded: e.loaded,
                    total: e.total,
                    currentTarget: e.currentTarget,
                    eventPhase: e.eventPhase,
                    target: e.target,
                    timeStamp: e.timeStamp,
                    type: e.type,
                    isTrusted: e.isTrusted
                }) + "'")
            }), n.open("POST", e, !0), this.headerTags) n.setRequestHeader(t, this.headerTags[t]);
            n.withCredentials = !1, n.send()
        }, i.prototype.verifyCaptcha = function (e, t) {
            var s, r = this, n = new XMLHttpRequest;
            for (s in this.headerTags) n.setRequestHeader(s, this.headerTags[s]);
            n.onload = function (e) {
                200 === n.status ? t(!0) : (r.errorHandler("Could not fetch challenge. Server returned '" + n.statusText + "'"), t(!1))
            }, n.addEventListener("error", function (e) {
                r.errorHandler("Failed to execute ajax request. Error: '" + JSON.stringify({
                    lengthComputable: e.lengthComputable,
                    isProgressEvent: e instanceof ProgressEvent,
                    loaded: e.loaded,
                    total: e.total,
                    currentTarget: e.currentTarget,
                    eventPhase: e.eventPhase,
                    target: e.target,
                    timeStamp: e.timeStamp,
                    type: e.type,
                    isTrusted: e.isTrusted
                }) + "'")
            }), n.open("POST", e, !0), n.withCredentials = !1, n.send()
        }, i.prototype.isObject = function (e) {
            return !!e && e === Object(e)
        }, e.ChallengeBase = i
    }(e.BotsAbuse || (e.BotsAbuse = {}))
}(QueueIt = QueueIt || {});
var QueueIt, __extends = this && this.__extends || function () {
    var r = function (e, t) {
        return (r = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
            e.__proto__ = t
        } || function (e, t) {
            for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s])
        })(e, t)
    };
    return function (e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

        function s() {
            this.constructor = e
        }

        r(e, t), e.prototype = null === t ? Object.create(t) : (s.prototype = t.prototype, new s)
    }
}();
!function (e) {
    (function (e) {
        var t, s;

        function r() {
            var e = s.call(this) || this;
            return e.loadedCallbackName = "__recaptchaOnload" + Math.random().toString().substring(2), e
        }

        t = e.ReCaptcha || (e.ReCaptcha = {}), s = e.ChallengeBase, __extends(r, s), r.prototype.render = function (e, t) {
            this.container = "string" == typeof e ? document.getElementById(e) : e, this.parameters = t, this.initializeChallenge()
        }, r.prototype.reset = function () {
            window.grecaptcha && window.grecaptcha.reset(), this.container.innerHTML = "", this.initializeChallenge()
        }, r.prototype.initializeChallenge = function () {
            var t = this;
            this.init(this.parameters);
            var e = this.parameters.invisible ? "recaptchainvisible" : "recaptcha",
                e = this.getChallengeUrl(this.parameters.queuePathPrefix, e);
            this.getChallenge(e, function (e) {
                t.loadReCaptcha(), window[t.loadedCallbackName] = function () {
                    t.renderReCaptcha(e.siteKey)
                }
            })
        }, r.prototype.loadReCaptcha = function () {
            var e = this,
                t = "https://www.recaptcha.net/recaptcha/api.js?onload=".concat(this.loadedCallbackName, "&render=explicit&hl=").concat(this.parameters.culture),
                s = document.createElement("script"), r = document.head || document.getElementsByTagName("head")[0];
            s.async = !0, s.src = t, s.type = "text/javascript", s.defer = !0, s.onerror = function () {
                e.parameters.scriptLoadErrorHandler()
            }, r.appendChild(s)
        }, r.prototype.renderReCaptcha = function (e) {
            var t = this;
            window.grecaptcha ? (grecaptcha.render(this.container, {
                sitekey: e, callback: function (e) {
                    t.resolve(e, "", "")
                }, size: this.parameters.invisible ? "invisible" : "normal"
            }), this.parameters.invisible && grecaptcha.execute()) : this.parameters.errorHandler("reCaptcha initialization error - grecaptcha not found in window"), delete window[this.loadedCallbackName]
        }, r.prototype.canRetry = function () {
            return this.session.stats.tries < 10
        }, t.ReCaptchaV2Challenge = r
    })((e = e.BotsAbuse || (e.BotsAbuse = {})).Challenge || (e.Challenge = {}))
}(QueueIt = QueueIt || {}), window.recaptcha = new QueueIt.BotsAbuse.Challenge.ReCaptcha.ReCaptchaV2Challenge, window.loadChallengeWidget();