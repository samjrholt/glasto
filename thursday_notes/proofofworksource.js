!function (e) {
    var s = String.fromCharCode, n = btoa;

    function t(e) {
        var r = e.charCodeAt(0);
        if (55296 <= r && r <= 56319) {
            e = e.charCodeAt(1);
            if (e != e) return s(239, 191, 189);
            if (!(56320 <= e && e <= 57343)) return s(239, 191, 189);
            if (65535 < (r = 1024 * (r - 55296) + e - 56320 + 65536)) return s(240 | r >>> 18, 128 | r >>> 12 & 63, 128 | r >>> 6 & 63, 128 | 63 & r)
        }
        return r <= 127 ? inputString : r <= 2047 ? s(192 | r >>> 6, 128 | 63 & r) : s(224 | r >>> 12, 128 | r >>> 6 & 63, 128 | 63 & r)
    }

    e.queueitProofOfWorkBase64 = function (e, r) {
        return n((r ? "Ã¯Â»Â¿" : "") + e.replace(/[\x80-\uD7ff\uDC00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]?/g, t))
    }
}(typeof global == "" + void 0 ? typeof self == "" + void 0 ? this : self : global);
var queueitProofOfWork, scriptElement = document.querySelector('script[data-name="queueitProofOfWork"]'),
    callbackName = scriptElement.getAttribute("data-onload"), host = scriptElement.getAttribute("data-host");
callbackName ? window[callbackName] ? (queueitProofOfWork = function () {
    function t(e) {
        return e && e === Object(e)
    }

    var o, i, e = scriptElement.getAttribute("src");
    -1 !== e.indexOf("/js/") || (host || (-1 !== e.indexOf("/serviceapi") ? e.split("/serviceapi")[0] : -1 !== e.indexOf("/challengeapi") && e.split("/challengeapi")[0]));
    var a, d, c, u, l = {}, f = function () {
        try {
            var e = "Unknown", r = "";
            screen.width && (r += (screen.width || "") + " x " + (screen.height || ""));
            var s, n, t, o, i = navigator.appVersion, a = navigator.userAgent, d = navigator.appName,
                c = "" + parseFloat(navigator.appVersion);
            parseInt(navigator.appVersion, 10);
            -1 !== (t = a.indexOf("Opera")) ? (d = "Opera", c = a.substring(t + 6), -1 !== (t = a.indexOf("Version")) && (c = a.substring(t + 8))) : -1 !== (t = a.indexOf("MSIE")) ? (d = "Microsoft Internet Explorer", c = a.substring(t + 5)) : "Netscape" === d && -1 !== a.indexOf("Trident/") ? (d = "Microsoft Internet Explorer", c = a.substring(t + 5), -1 !== (t = a.indexOf("rv:")) && (c = a.substring(t + 3))) : -1 !== (t = a.indexOf("Chrome")) ? (d = "Chrome", c = a.substring(t + 7)) : -1 !== (t = a.indexOf("Safari")) ? (d = "Safari", c = a.substring(t + 7), -1 !== (t = a.indexOf("Version")) && (c = a.substring(t + 8)), -1 !== a.indexOf("CriOS") && (d = "Chrome")) : -1 !== (t = a.indexOf("Firefox")) ? (d = "Firefox", c = a.substring(t + 8)) : (n = a.lastIndexOf(" ") + 1) < (t = a.lastIndexOf("/")) && (d = a.substring(n, t), c = a.substring(t + 1), d.toLowerCase() === d.toUpperCase() && (d = navigator.appName)), -1 !== (o = (c = -1 !== (o = (c = -1 !== (o = c.indexOf(";")) ? c.substring(0, o) : c).indexOf(" ")) ? c.substring(0, o) : c).indexOf(")")) && (c = c.substring(0, o)), s = parseInt("" + c, 10), isNaN(s) && (c = "" + parseFloat(navigator.appVersion), parseInt(navigator.appVersion, 10));
            var u = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(i), l = !!navigator.cookieEnabled;
            void 0 !== navigator.cookieEnabled || l || (document.cookie = "testcookie", l = -1 !== document.cookie.indexOf("testcookie"));
            var f, p = e, w = [{s: "Windows 3.11", r: /Win16/}, {
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
            }, {s: "Mac OS X", r: /Mac OS X/}, {s: "Mac OS", r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/}, {
                s: "QNX",
                r: /QNX/
            }, {s: "UNIX", r: /UNIX/}, {s: "BeOS", r: /BeOS/}, {s: "OS/2", r: /OS\/2/}, {
                s: "Search Bot",
                r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
            }];
            for (f in w) {
                var g = w[f];
                if (g.r.test(a)) {
                    p = g.s;
                    break
                }
            }
            var b = e;
            switch (/Windows/.test(p) && (b = /Windows (.*)/.exec(p)[1], p = "Windows"), p) {
                case"Mac OS X":
                    b = /Mac OS X (10[\.\_\d]+)/.exec(a)[1];
                    break;
                case"Android":
                    b = /Android ([\.\_\d]+)/.exec(a)[1];
                    break;
                case"iOS":
                    b = (b = /OS (\d+)_(\d+)_?(\d+)?/.exec(i))[1] + "." + b[2] + "." + (0 | b[3])
            }
            return {screen: r, browser: d, browserVersion: c, mobile: u, os: p, osVersion: b, cookies: l}
        } catch (e) {
            return {screen: "", browser: "", browserVersion: "", mobile: !1, os: "", osVersion: "", cookies: !1}
        }
    }(), p = {}, w = "";

    function r(e) {
        if (o = e.callback, i = e.errorHandler, w = e.queuePathPrefix, (p = {
            userId: "",
            meta: {},
            sessionId: "",
            solution: "",
            tags: [],
            stats: {
                duration: 0,
                tries: 0,
                userAgent: navigator.userAgent,
                screen: f.screen,
                browser: f.browser,
                browserVersion: f.browserVersion,
                isMobile: f.mobile,
                os: f.os,
                osVersion: f.osVersion,
                cookiesEnabled: f.cookies
            }
        }).userId = e.userId, p.stats.tries++, p.tags.length = 0, l = {}, e.tags && t(e.tags)) for (var r in e.tags) {
            var s, n = e.tags[r];
            t(n) || Array.isArray(n) || (l[s = "powTag-" + r] = n, p.tags.push(s + ":" + n), l[r = "X-Queueit-Challange-" + r] = n, p.tags.push(r + ":" + n))
        }
        !function (e) {
            e = e.challengesIssuedByReason;
            l["X-Queueit-Challange-reason"] = e
        }(e)
    }

    function g() {
        p.stats.duration = (new Date).getTime() - c;
        var e = JSON.stringify(p.solution), e = queueitProofOfWorkBase64(e, !1);
        o(p.sessionId, d, e, p.stats)
    }

    function s() {
        function n(e) {
            p.meta = e.meta, d = e.challengeDetails, p.sessionId = e.sessionId, p.parameters = e.parameters;
            var r, s = p.parameters;
            window.Worker && URL.createObjectURL && !window.document.documentMode ? (r = 'run("' + s.type + '", "' + s.input + '", ' + s.runs + ", " + s.complexity + ", true);", a = URL.createObjectURL(new Blob([e.function, " ", r], {type: "application/javascript"}))) : (r = 'run("' + s.type + '", "' + s.input + '", ' + s.runs + ", " + s.complexity + ", false);", u = new Function(e.function + " return " + r))
        }

        let e = `${function (e, r) {
            r = `/challengeapi/${r}/challenge/`;
            let s = "";
            return e && (s = e.startsWith("/") ? e : `/${e}`), `${s}${r}`
        }(w, "pow")}${p.userId}`;
        "" !== p.sessionId && (e = e + "/" + p.sessionId), function (e) {
            var r, s = new XMLHttpRequest;
            for (r in s.open("POST", e, !0), s.withCredentials = !1, l) s.setRequestHeader(r, l[r]);
            s.onload = function () {
                200 === this.status ? (n(JSON.parse(this.responseText)), c = (new Date).getTime(), a ? (worker = new Worker(a), worker.onmessage = function (e) {
                    p.solution = e.data, g()
                }) : (p.solution = u(), g())) : i("Could not fetch challenge. Server returned '" + this.statusText + "'")
            }, s.addEventListener("error", function (e) {
                i("Failed to execute ajax request. Error: '" + JSON.stringify({
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
            }), s.send()
        }(e)
    }

    return {
        execute: function (e) {
            if (!(e && e.callback && e.errorHandler && e.userId)) throw Error("Missing required parameter property");
            e.tags.UserId = e.userId, r(e), s()
        }, canRetry: function () {
            return p.stats.tries < 10
        }, retry: function () {
            if (!o || !i) throw Error("Execute has not been called");
            p.stats.tries++, s()
        }
    }
}(), window[callbackName]()) : console.log("The provided callback is not accessible. Please make sure it's in the global scope.") : console.log("Please specify a callback to be called when the proof of work script has been loaded");/**/