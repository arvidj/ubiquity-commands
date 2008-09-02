function cmd_up() {
    var l = getDocument().location;
    l.pathname = l.pathname.split("/").slice(0,-1).join("/");
}

function cmd_base() {
    getDocument().location.pathname = "";
}

function cmd_coral() {
    getDocument().location.hostname =  getDocument().location.hostname + ".nyud.net";
}

function cmd_src() {
    if ((h = $xs("//link[@rel='commands']", getDocument()).href)) {
	Utils.openUrlInBrowser(h);
    }
}

function getLocation() {
    return Application.activeWindow.activeTab.document.location;
}

function getDocument() {
    return Application.activeWindow.activeTab.document;
}


/* STD-Functions */
function $x(xpath, root) { // From Johan Sundström
    var doc = root ? root.evaluate ? root : root.ownerDocument : document, next;
    var got = doc.evaluate(xpath, root||doc, null, null, null), result = [];
    while((next = got.iterateNext()))
	result.push(next);
    return result;
}

function $xs(xpath, root) {
    return $x(xpath, root)[0];
}

String.prototype.trim = function() { return this.replace(/^\W+|\W+$/gi, ""); }

    function bind(method, obj) {
	return function() {
	    method.apply(obj, arguments);
	};
    }

function curry(method, obj) {
    var curryargs = $A(arguments).slice(2);
    return function() {
	return method.apply(obj || window, curryargs.concat($A(arguments)));
    };
}

function $A(arr) {
    var r = [], len = arr.length;
    while (len--) r.unshift(arr[len]);
    return r;
}

function sprintf(str) {
    var a;
    arguments.shift();
    while (a = arguments.shift()) 
	str = str.replace("\f", a);
    return str;
}