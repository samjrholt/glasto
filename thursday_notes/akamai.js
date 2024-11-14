var QueueIT, __assign = this && this.__assign || function () {
    return (__assign = Object.assign || function (e) {
        for (var t, a = 1, r = arguments.length; a < r; a++) for (var n in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
        return e
    }).apply(this, arguments)
};
!function (e) {
    function t() {
        var r = this;
        this.headerTags = {}, this.tryToSolve = function () {
            var e, t = r.getChallengeUrl(r.parameters.queuePathPrefix), a = new XMLHttpRequest;
            for (e in a.onload = r.onChallengeResponse.bind(r), a.addEventListener("error", r.onChallengeRequestError), a.open("GET", t, !0), r.headerTags) a.setRequestHeader(e, r.headerTags[e]);
            a.withCredentials = !1, a.send()
        }
    }

    e = (e = e.BotsAndAbuse || (e.BotsAndAbuse = {})).AkamaiValidator || (e.AkamaiValidator = {}), t.prototype.init = function (e) {
        if (e.VerificationCallback && (this.verificationCallback = e.VerificationCallback), e.errorHandler && (this.errorHandler = e.errorHandler), this.setupDefaultRequestHeaders(e), e.tags && "object" == typeof e.tags) for (var t in e.tags) {
            var a = e.tags[t];
            "object" == typeof a || Array.isArray(a) || (this.headerTags["X-Queueit-Challange-" + t] = a)
        }
    }, t.prototype.render = function (e, t) {
        this.init(t), this.container = "string" == typeof e ? document.getElementById(e) : e, this.solutionCallback = this.tryToSolve, this.parameters = t, this.renderHtml(this.container)
    }, t.prototype.reset = function () {
        this.container && (this.container.innerHTML = "")
    }, t.prototype.setupDefaultRequestHeaders = function (e) {
        e = e.challengesIssuedByReason;
        this.headerTags["X-Queueit-Challange-reason"] = e
    }, t.prototype.onChallengePassed = function (e) {
        e = {solution: e.value, type: "success"};
        this.verificationCallback(e)
    }, t.prototype.onChallengeResponse = function (e) {
        var t, e = e.target;
        200 === e.status ? this.onChallengePassed(JSON.parse(e.responseText)) : 400 <= e.status && e.status < 500 ? (t = e.responseText ? JSON.parse(e.responseText) : null, this.errorHandler({
            errorText: (null == t ? void 0 : t.title) || "Could not fetch challenge. Server returned '" + e.statusText + "'",
            errorCodes: null != t && t.detail ? [t.detail] : []
        })) : this.errorHandler({
            errorText: "Could not fetch challenge. Server returned '" + e.statusText + "'",
            errorCodes: []
        })
    }, t.prototype.onChallengeRequestError = function (e) {
        this.errorHandler("Failed to execute ajax request. Error: '" + JSON.stringify({
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
    }, t.prototype.getChallengeUrl = function (e) {
        var t = this.parameters, a = t.customerId, t = t.waitingRoomId, a = "/validator/".concat(a, "/").concat(t);
        return "".concat(e || "").concat(a)
    }, t.prototype.loadTranslations = function () {
        var e, t = {
            buttonText: "Join the waiting room",
            headingText: "Welcome to the waiting room",
            descriptionText: "Please confirm your position in the line by clicking the button.",
            footerText: "Once you have confirmed your position, you will be assigned a random place in this waiting room and you will be able to access the ticketing site once it is your turn.</br></br>Please be ready with your device on this page."
        };
        return this.parameters.culture && (e = window["botdetect_" + this.parameters.culture.toLowerCase().replace("-", "_").replace("-", "_")], t = __assign(__assign({}, t), e)), t
    }, t.prototype.renderHtml = function (e) {
        var t = this.loadTranslations(), a = document.createElement("div"),
            e = (a.innerHTML = '\n<fieldset>\n    <div class="waitingroomentry-label">\n        <h2>'.concat(t.headingText, "</h2>\n        <p>").concat(t.descriptionText, '</p>\n    </div>\n    <div id="waitingroomentry-content-holder">\n    </div>\n    <div class="waitingroomentry-footer">\n        <p>').concat(t.footerText, "</p>\n    </div>\n</fieldset>"), e.appendChild(a), document.createElement("button")),
            t = (e.className = "botdetect-button btn", e.innerText = t.buttonText, e.onclick = this.solutionCallback, a.querySelector("#waitingroomentry-content-holder"));
        t && t.appendChild(e)
    }, e.AkamaiBotManagerHeaderValidatorChallenge = t
}(QueueIT = QueueIT || {}), window.akamaiBotManagerHeaderVerification = new QueueIT.BotsAndAbuse.AkamaiValidator.AkamaiBotManagerHeaderValidatorChallenge, window.akamaiBotManagerHeaderVerificationLoadedCallback();