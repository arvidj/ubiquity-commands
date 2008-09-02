Object.prototype.extend = function (src) {
  for (var prop in src)
    this[prop] = this[prop] || src[prop];
  return this;
}

var metadata = {
  homepage: "http://web.student.chalmers.se/~arvidj",
  author: {
    name: "Arvid Jakobsson", email: "arvid.jakobsson@gmail.com"},
  license: "GPL"
  /*
   *   name: "date",
   *   help: "If you're in an editable text area, inserts today's date, formatted for the current locale.",
   *   description: "Inserts today's date.",
   * */
};

var ArvidsCommands = [
  {
    name: "up",
    description: "Moves up one dir, e.g.: from <em>http://example.com/aaa/bbb/ccc.html</em> to <em>http://example.com/aaa/</em>",
    execute: function() {
      var l = getDocument().location.pathname = this._parentDir();
    },
    preview: function(pblock) {
      var msg = 'Go to: "<i>${parentDir}</i>"';
      pblock.innerHTML = CmdUtils.renderTemplate( msg, {parentDir: this._parentDir()} );
    },
    _parentDir: function() {
      var l = getDocument().location;
      return l.pathname.split("/").slice(0,-1).join("/");
    }
  },

  {
    name: "base",
    description: "Goes to the root of the host, e.g.: from <em>http://example.com/aaa/bbb/ccc.html</em> to <em>http://example.com/</em>",
    execute: function() {
      getDocument().location.href = this._baseDir();
    },
    preview: function(pblock) {
      var msg = 'Go to: "<i>${baseDir}</i>"';
      pblock.innerHTML = CmdUtils.renderTemplate( msg, {baseDir: this._baseDir()} );
    },
    _baseDir: function() {
      var l = getDocument().location;
      return l.protocol + "://" + l.hostname + l.port;
    }
  },

  {
    name: "coral",
    description: "Finds mirror of the current page using the coral content network.",
    execute: function() {
      getDocument().location.href = this._baseDir();
    },
    preview: function(pblock) {
      var msg = 'Coralize this url, goes to a mirror at: "<i>${coralUrl}</i>"';
      pblock.innerHTML = CmdUtils.renderTemplate( msg, {coralUrl: this._coralize()} );
    },
    _coralize: function() {
      var l = getDocument().location;
      return l.protocol + "://" + l.hostname + ".nyud.net" + l.port + l.pathname + l.search + l.hash;
    }
  },

  {
    name: "src",
    description: "Goes to the source of any ubiquity commands on page.",
    execute: function() {
      if ((h = $xs("//link[@rel='commands']", getDocument()).href)) {
	Utils.openUrlInBrowser(h);
      }
    },
    preview: function(pblock) {
      var msg = 'Goes to the source of any ubiquity commands on this page.';
      pblock.innerHTML = CmdUtils.renderTemplate(msg);
    }
  }
];
ArvidsCommands = ArvidsCommands.map(function (cmd) {
				      return cmd.extend(metadata);
				    });

ArvidsCommands.forEach(function(cmd) {
			 if (this.CmdUtils !== undefined) CmdUtils.CreateCommand(cmd);
		       });

function getCmdsMeta() {
  var metaprops = ["homepage", "author", "name", "email", "license", "help", "description"];
  return ArvidsCommands.map(function(cmd) {
			      var ret = {};
			      for (var prop in cmd)
				if (metaprops.indexOf(prop))
				  ret[prop] = cmd[prop];
			      return ret;
			    });
}
/* STD-Functions */

function getLocation() {
  return Application.activeWindow.activeTab.document.location;
}

function getDocument() {
  return Application.activeWindow.activeTab.document;
}

function $x(xpath, root) {
  // From Johan Sundström
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
  var a, args = $A(arguments);
  args.shift();
  while (a = args.shift())
    str = str.replace("\f", a);
  return str;
}
