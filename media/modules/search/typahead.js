! function(a, b) {
    "function" == typeof define && define.amd ? define("bloodhound", ["jquery"], function(c) {
        return a.Bloodhound = b(c)
    }) : "object" == typeof exports ? module.exports = b(require("jquery")) : a.Bloodhound = b(jQuery)
}(this, function(a) {
    var b = function() {
            "use strict";
            return {
                isMsie: function() {
                    return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : !1
                },
                isBlankString: function(a) {
                    return !a || /^\s*$/.test(a)
                },
                escapeRegExChars: function(a) {
                    return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                },
                isString: function(a) {
                    return "string" == typeof a
                },
                isNumber: function(a) {
                    return "number" == typeof a
                },
                isArray: a.isArray,
                isFunction: a.isFunction,
                isObject: a.isPlainObject,
                isUndefined: function(a) {
                    return "undefined" == typeof a
                },
                isElement: function(a) {
                    return !(!a || 1 !== a.nodeType)
                },
                isJQuery: function(b) {
                    return b instanceof a
                },
                toStr: function(a) {
                    return b.isUndefined(a) || null === a ? "" : a + ""
                },
                bind: a.proxy,
                each: function(b, c) {
                    function d(a, b) {
                        return c(b, a)
                    }
                    a.each(b, d)
                },
                map: a.map,
                filter: a.grep,
                every: function(b, c) {
                    var d = !0;
                    return b ? (a.each(b, function(a, e) {
                        return (d = c.call(null, e, a, b)) ? void 0 : !1
                    }), !!d) : d
                },
                some: function(b, c) {
                    var d = !1;
                    return b ? (a.each(b, function(a, e) {
                        return (d = c.call(null, e, a, b)) ? !1 : void 0
                    }), !!d) : d
                },
                mixin: a.extend,
                identity: function(a) {
                    return a
                },
                clone: function(b) {
                    return a.extend(!0, {}, b)
                },
                getIdGenerator: function() {
                    var a = 0;
                    return function() {
                        return a++
                    }
                },
                templatify: function(b) {
                    function c() {
                        return String(b)
                    }
                    return a.isFunction(b) ? b : c
                },
                defer: function(a) {
                    setTimeout(a, 0)
                },
                debounce: function(a, b, c) {
                    var d, e;
                    return function() {
                        var f, g, h = this,
                            i = arguments;
                        return f = function() {
                            d = null, c || (e = a.apply(h, i))
                        }, g = c && !d, clearTimeout(d), d = setTimeout(f, b), g && (e = a.apply(h, i)), e
                    }
                },
                throttle: function(a, b) {
                    var c, d, e, f, g, h;
                    return g = 0, h = function() {
                            g = new Date, e = null, f = a.apply(c, d)
                        },
                        function() {
                            var i = new Date,
                                j = b - (i - g);
                            return c = this, d = arguments, 0 >= j ? (clearTimeout(e), e = null, g = i, f = a.apply(c, d)) : e || (e = setTimeout(h, j)), f
                        }
                },
                stringify: function(a) {
                    return b.isString(a) ? a : JSON.stringify(a)
                },
                noop: function() {}
            }
        }(),
        c = "0.11.1",
        d = function() {
            "use strict";

            function a(a) {
                return a = b.toStr(a), a ? a.split(/\s+/) : []
            }

            function c(a) {
                return a = b.toStr(a), a ? a.split(/\W+/) : []
            }

            function d(a) {
                return function(c) {
                    return c = b.isArray(c) ? c : [].slice.call(arguments, 0),
                        function(d) {
                            var e = [];
                            return b.each(c, function(c) {
                                e = e.concat(a(b.toStr(d[c])))
                            }), e
                        }
                }
            }
            return {
                nonword: c,
                whitespace: a,
                obj: {
                    nonword: d(c),
                    whitespace: d(a)
                }
            }
        }(),
        e = function() {
            "use strict";

            function c(c) {
                this.maxSize = b.isNumber(c) ? c : 100, this.reset(), this.maxSize <= 0 && (this.set = this.get = a.noop)
            }

            function d() {
                this.head = this.tail = null
            }

            function e(a, b) {
                this.key = a, this.val = b, this.prev = this.next = null
            }
            return b.mixin(c.prototype, {
                set: function(a, b) {
                    var c, d = this.list.tail;
                    this.size >= this.maxSize && (this.list.remove(d), delete this.hash[d.key], this.size--), (c = this.hash[a]) ? (c.val = b, this.list.moveToFront(c)) : (c = new e(a, b), this.list.add(c), this.hash[a] = c, this.size++)
                },
                get: function(a) {
                    var b = this.hash[a];
                    return b ? (this.list.moveToFront(b), b.val) : void 0
                },
                reset: function() {
                    this.size = 0, this.hash = {}, this.list = new d
                }
            }), b.mixin(d.prototype, {
                add: function(a) {
                    this.head && (a.next = this.head, this.head.prev = a), this.head = a, this.tail = this.tail || a
                },
                remove: function(a) {
                    a.prev ? a.prev.next = a.next : this.head = a.next, a.next ? a.next.prev = a.prev : this.tail = a.prev
                },
                moveToFront: function(a) {
                    this.remove(a), this.add(a)
                }
            }), c
        }(),
        f = function() {
            "use strict";

            function c(a, c) {
                this.prefix = ["__", a, "__"].join(""), this.ttlKey = "__ttl__", this.keyMatcher = new RegExp("^" + b.escapeRegExChars(this.prefix)), this.ls = c || h, !this.ls && this._noop()
            }

            function d() {
                return (new Date).getTime()
            }

            function e(a) {
                return JSON.stringify(b.isUndefined(a) ? null : a)
            }

            function f(b) {
                return a.parseJSON(b)
            }

            function g(a) {
                var b, c, d = [],
                    e = h.length;
                for (b = 0; e > b; b++)(c = h.key(b)).match(a) && d.push(c.replace(a, ""));
                return d
            }
            var h;
            try {
                h = window.localStorage, h.setItem("~~~", "!"), h.removeItem("~~~")
            } catch (i) {
                h = null
            }
            return b.mixin(c.prototype, {
                _prefix: function(a) {
                    return this.prefix + a
                },
                _ttlKey: function(a) {
                    return this._prefix(a) + this.ttlKey
                },
                _noop: function() {
                    this.get = this.set = this.remove = this.clear = this.isExpired = b.noop
                },
                _safeSet: function(a, b) {
                    try {
                        this.ls.setItem(a, b)
                    } catch (c) {
                        "QuotaExceededError" === c.name && (this.clear(), this._noop())
                    }
                },
                get: function(a) {
                    return this.isExpired(a) && this.remove(a), f(this.ls.getItem(this._prefix(a)))
                },
                set: function(a, c, f) {
                    return b.isNumber(f) ? this._safeSet(this._ttlKey(a), e(d() + f)) : this.ls.removeItem(this._ttlKey(a)), this._safeSet(this._prefix(a), e(c))
                },
                remove: function(a) {
                    return this.ls.removeItem(this._ttlKey(a)), this.ls.removeItem(this._prefix(a)), this
                },
                clear: function() {
                    var a, b = g(this.keyMatcher);
                    for (a = b.length; a--;) this.remove(b[a]);
                    return this
                },
                isExpired: function(a) {
                    var c = f(this.ls.getItem(this._ttlKey(a)));
                    return b.isNumber(c) && d() > c ? !0 : !1
                }
            }), c
        }(),
        g = function() {
            "use strict";

            function c(a) {
                a = a || {}, this.cancelled = !1, this.lastReq = null, this._send = a.transport, this._get = a.limiter ? a.limiter(this._get) : this._get, this._cache = a.cache === !1 ? new e(0) : h
            }
            var d = 0,
                f = {},
                g = 6,
                h = new e(10);
            return c.setMaxPendingRequests = function(a) {
                g = a
            }, c.resetCache = function() {
                h.reset()
            }, b.mixin(c.prototype, {
                _fingerprint: function(b) {
                    return b = b || {}, b.url + b.type + a.param(b.data || {})
                },
                _get: function(a, b) {
                    function c(a) {
                        b(null, a), k._cache.set(i, a)
                    }

                    function e() {
                        b(!0)
                    }

                    function h() {
                        d--, delete f[i], k.onDeckRequestArgs && (k._get.apply(k, k.onDeckRequestArgs), k.onDeckRequestArgs = null)
                    }
                    var i, j, k = this;
                    i = this._fingerprint(a), this.cancelled || i !== this.lastReq || ((j = f[i]) ? j.done(c).fail(e) : g > d ? (d++, f[i] = this._send(a).done(c).fail(e).always(h)) : this.onDeckRequestArgs = [].slice.call(arguments, 0))
                },
                get: function(c, d) {
                    var e, f;
                    d = d || a.noop, c = b.isString(c) ? {
                        url: c
                    } : c || {}, f = this._fingerprint(c), this.cancelled = !1, this.lastReq = f, (e = this._cache.get(f)) ? d(null, e) : this._get(c, d)
                },
                cancel: function() {
                    this.cancelled = !0
                }
            }), c
        }(),
        h = window.SearchIndex = function() {
            "use strict";

            function c(c) {
                c = c || {}, c.datumTokenizer && c.queryTokenizer || a.error("datumTokenizer and queryTokenizer are both required"), this.identify = c.identify || b.stringify, this.datumTokenizer = c.datumTokenizer, this.queryTokenizer = c.queryTokenizer, this.reset()
            }

            function d(a) {
                return a = b.filter(a, function(a) {
                    return !!a
                }), a = b.map(a, function(a) {
                    return a.toLowerCase()
                })
            }

            function e() {
                var a = {};
                return a[i] = [], a[h] = {}, a
            }

            function f(a) {
                for (var b = {}, c = [], d = 0, e = a.length; e > d; d++) b[a[d]] || (b[a[d]] = !0, c.push(a[d]));
                return c
            }

            function g(a, b) {
                var c = 0,
                    d = 0,
                    e = [];
                a = a.sort(), b = b.sort();
                for (var f = a.length, g = b.length; f > c && g > d;) a[c] < b[d] ? c++ : a[c] > b[d] ? d++ : (e.push(a[c]), c++, d++);
                return e
            }
            var h = "c",
                i = "i";
            return b.mixin(c.prototype, {
                bootstrap: function(a) {
                    this.datums = a.datums, this.trie = a.trie
                },
                add: function(a) {
                    var c = this;
                    a = b.isArray(a) ? a : [a], b.each(a, function(a) {
                        var f, g;
                        c.datums[f = c.identify(a)] = a, g = d(c.datumTokenizer(a)), b.each(g, function(a) {
                            var b, d, g;
                            for (b = c.trie, d = a.split(""); g = d.shift();) b = b[h][g] || (b[h][g] = e()), b[i].push(f)
                        })
                    })
                },
                get: function(a) {
                    var c = this;
                    return b.map(a, function(a) {
                        return c.datums[a]
                    })
                },
                search: function(a) {
                    var c, e, j = this;
                    return c = d(this.queryTokenizer(a)), b.each(c, function(a) {
                        var b, c, d, f;
                        if (e && 0 === e.length) return !1;
                        for (b = j.trie, c = a.split(""); b && (d = c.shift());) b = b[h][d];
                        return b && 0 === c.length ? (f = b[i].slice(0), void(e = e ? g(e, f) : f)) : (e = [], !1)
                    }), e ? b.map(f(e), function(a) {
                        return j.datums[a]
                    }) : []
                },
                all: function() {
                    var a = [];
                    for (var b in this.datums) a.push(this.datums[b]);
                    return a
                },
                reset: function() {
                    this.datums = {}, this.trie = e()
                },
                serialize: function() {
                    return {
                        datums: this.datums,
                        trie: this.trie
                    }
                }
            }), c
        }(),
        i = function() {
            "use strict";

            function a(a) {
                this.url = a.url, this.ttl = a.ttl, this.cache = a.cache, this.prepare = a.prepare, this.transform = a.transform, this.transport = a.transport, this.thumbprint = a.thumbprint, this.storage = new f(a.cacheKey)
            }
            var c;
            return c = {
                data: "data",
                protocol: "protocol",
                thumbprint: "thumbprint"
            }, b.mixin(a.prototype, {
                _settings: function() {
                    return {
                        url: this.url,
                        type: "GET",
                        dataType: "json"
                    }
                },
                store: function(a) {
                    this.cache && (this.storage.set(c.data, a, this.ttl), this.storage.set(c.protocol, location.protocol, this.ttl), this.storage.set(c.thumbprint, this.thumbprint, this.ttl))
                },
                fromCache: function() {
                    var a, b = {};
                    return this.cache ? (b.data = this.storage.get(c.data), b.protocol = this.storage.get(c.protocol), b.thumbprint = this.storage.get(c.thumbprint), a = b.thumbprint !== this.thumbprint || b.protocol !== location.protocol, b.data && !a ? b.data : null) : null
                },
                fromNetwork: function(a) {
                    function b() {
                        a(!0)
                    }

                    function c(b) {
                        a(null, e.transform(b))
                    }
                    var d, e = this;
                    a && (d = this.prepare(this._settings()), this.transport(d).fail(b).done(c))
                },
                clear: function() {
                    return this.storage.clear(), this
                }
            }), a
        }(),
        j = function() {
            "use strict";

            function a(a) {
                this.url = a.url, this.prepare = a.prepare, this.transform = a.transform, this.transport = new g({
                    cache: a.cache,
                    limiter: a.limiter,
                    transport: a.transport
                })
            }
            return b.mixin(a.prototype, {
                _settings: function() {
                    return {
                        url: this.url,
                        type: "GET",
                        dataType: "json"
                    }
                },
                get: function(a, b) {
                    function c(a, c) {
                        b(a ? [] : e.transform(c))
                    }
                    var d, e = this;
                    if (b) return a = a || "", d = this.prepare(a, this._settings()), this.transport.get(d, c)
                },
                cancelLastRequest: function() {
                    this.transport.cancel()
                }
            }), a
        }(),
        k = function() {
            "use strict";

            function d(d) {
                var e;
                return d ? (e = {
                    url: null,
                    ttl: 864e5,
                    cache: !0,
                    cacheKey: null,
                    thumbprint: "",
                    prepare: b.identity,
                    transform: b.identity,
                    transport: null
                }, d = b.isString(d) ? {
                    url: d
                } : d, d = b.mixin(e, d), !d.url && a.error("prefetch requires url to be set"), d.transform = d.filter || d.transform, d.cacheKey = d.cacheKey || d.url, d.thumbprint = c + d.thumbprint, d.transport = d.transport ? h(d.transport) : a.ajax, d) : null
            }

            function e(c) {
                var d;
                if (c) return d = {
                    url: null,
                    cache: !0,
                    prepare: null,
                    replace: null,
                    wildcard: null,
                    limiter: null,
                    rateLimitBy: "debounce",
                    rateLimitWait: 300,
                    transform: b.identity,
                    transport: null
                }, c = b.isString(c) ? {
                    url: c
                } : c, c = b.mixin(d, c), !c.url && a.error("remote requires url to be set"), c.transform = c.filter || c.transform, c.prepare = f(c), c.limiter = g(c), c.transport = c.transport ? h(c.transport) : a.ajax, delete c.replace, delete c.wildcard, delete c.rateLimitBy, delete c.rateLimitWait, c
            }

            function f(a) {
                function b(a, b) {
                    return b.url = f(b.url, a), b
                }

                function c(a, b) {
                    return b.url = b.url.replace(g, encodeURIComponent(a)), b
                }

                function d(a, b) {
                    return b
                }
                var e, f, g;
                return e = a.prepare, f = a.replace, g = a.wildcard, e ? e : e = f ? b : a.wildcard ? c : d
            }

            function g(a) {
                function c(a) {
                    return function(c) {
                        return b.debounce(c, a)
                    }
                }

                function d(a) {
                    return function(c) {
                        return b.throttle(c, a)
                    }
                }
                var e, f, g;
                return e = a.limiter, f = a.rateLimitBy, g = a.rateLimitWait, e || (e = /^throttle$/i.test(f) ? d(g) : c(g)), e
            }

            function h(c) {
                return function(d) {
                    function e(a) {
                        b.defer(function() {
                            g.resolve(a)
                        })
                    }

                    function f(a) {
                        b.defer(function() {
                            g.reject(a)
                        })
                    }
                    var g = a.Deferred();
                    return c(d, e, f), g
                }
            }
            return function(c) {
                var f, g;
                return f = {
                    initialize: !0,
                    identify: b.stringify,
                    datumTokenizer: null,
                    queryTokenizer: null,
                    sufficient: 5,
                    sorter: null,
                    local: [],
                    prefetch: null,
                    remote: null
                }, c = b.mixin(f, c || {}), !c.datumTokenizer && a.error("datumTokenizer is required"), !c.queryTokenizer && a.error("queryTokenizer is required"), g = c.sorter, c.sorter = g ? function(a) {
                    return a.sort(g)
                } : b.identity, c.local = b.isFunction(c.local) ? c.local() : c.local, c.prefetch = d(c.prefetch), c.remote = e(c.remote), c
            }
        }(),
        l = function() {
            "use strict";

            function c(a) {
                a = k(a), this.sorter = a.sorter, this.identify = a.identify, this.sufficient = a.sufficient, this.local = a.local, this.remote = a.remote ? new j(a.remote) : null, this.prefetch = a.prefetch ? new i(a.prefetch) : null, this.index = new h({
                    identify: this.identify,
                    datumTokenizer: a.datumTokenizer,
                    queryTokenizer: a.queryTokenizer
                }), a.initialize !== !1 && this.initialize()
            }
            var e;
            return e = window && window.Bloodhound, c.noConflict = function() {
                return window && (window.Bloodhound = e), c
            }, c.tokenizers = d, b.mixin(c.prototype, {
                __ttAdapter: function() {
                    function a(a, b, d) {
                        return c.search(a, b, d)
                    }

                    function b(a, b) {
                        return c.search(a, b)
                    }
                    var c = this;
                    return this.remote ? a : b
                },
                _loadPrefetch: function() {
                    function b(a, b) {
                        return a ? c.reject() : (e.add(b), e.prefetch.store(e.index.serialize()), void c.resolve())
                    }
                    var c, d, e = this;
                    return c = a.Deferred(), this.prefetch ? (d = this.prefetch.fromCache()) ? (this.index.bootstrap(d), c.resolve()) : this.prefetch.fromNetwork(b) : c.resolve(), c.promise()
                },
                _initialize: function() {
                    function a() {
                        b.add(b.local)
                    }
                    var b = this;
                    return this.clear(), (this.initPromise = this._loadPrefetch()).done(a), this.initPromise
                },
                initialize: function(a) {
                    return !this.initPromise || a ? this._initialize() : this.initPromise
                },
                add: function(a) {
                    return this.index.add(a), this
                },
                get: function(a) {
                    return a = b.isArray(a) ? a : [].slice.call(arguments), this.index.get(a)
                },
                search: function(a, c, d) {
                    function e(a) {
                        var c = [];
                        b.each(a, function(a) {
                            !b.some(f, function(b) {
                                return g.identify(a) === g.identify(b)
                            }) && c.push(a)
                        }), d && d(c)
                    }
                    var f, g = this;
                    return f = this.sorter(this.index.search(a)), c(this.remote ? f.slice() : f), this.remote && f.length < this.sufficient ? this.remote.get(a, e) : this.remote && this.remote.cancelLastRequest(), this
                },
                all: function() {
                    return this.index.all()
                },
                clear: function() {
                    return this.index.reset(), this
                },
                clearPrefetchCache: function() {
                    return this.prefetch && this.prefetch.clear(), this
                },
                clearRemoteCache: function() {
                    return g.resetCache(), this
                },
                ttAdapter: function() {
                    return this.__ttAdapter()
                }
            }), c
        }();
    return l
}),
function(a, b) {
    "function" == typeof define && define.amd ? define("typeahead.js", ["jquery"], function(a) {
        return b(a)
    }) : "object" == typeof exports ? module.exports = b(require("jquery")) : b(jQuery)
}(this, function(a) {
    var b = function() {
            "use strict";
            return {
                isMsie: function() {
                    return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : !1
                },
                isBlankString: function(a) {
                    return !a || /^\s*$/.test(a)
                },
                escapeRegExChars: function(a) {
                    return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                },
                isString: function(a) {
                    return "string" == typeof a
                },
                isNumber: function(a) {
                    return "number" == typeof a
                },
                isArray: a.isArray,
                isFunction: a.isFunction,
                isObject: a.isPlainObject,
                isUndefined: function(a) {
                    return "undefined" == typeof a
                },
                isElement: function(a) {
                    return !(!a || 1 !== a.nodeType)
                },
                isJQuery: function(b) {
                    return b instanceof a
                },
                toStr: function(a) {
                    return b.isUndefined(a) || null === a ? "" : a + ""
                },
                bind: a.proxy,
                each: function(b, c) {
                    function d(a, b) {
                        return c(b, a)
                    }
                    a.each(b, d)
                },
                map: a.map,
                filter: a.grep,
                every: function(b, c) {
                    var d = !0;
                    return b ? (a.each(b, function(a, e) {
                        return (d = c.call(null, e, a, b)) ? void 0 : !1
                    }), !!d) : d
                },
                some: function(b, c) {
                    var d = !1;
                    return b ? (a.each(b, function(a, e) {
                        return (d = c.call(null, e, a, b)) ? !1 : void 0
                    }), !!d) : d
                },
                mixin: a.extend,
                identity: function(a) {
                    return a
                },
                clone: function(b) {
                    return a.extend(!0, {}, b)
                },
                getIdGenerator: function() {
                    var a = 0;
                    return function() {
                        return a++
                    }
                },
                templatify: function(b) {
                    function c() {
                        return String(b)
                    }
                    return a.isFunction(b) ? b : c
                },
                defer: function(a) {
                    setTimeout(a, 0)
                },
                debounce: function(a, b, c) {
                    var d, e;
                    return function() {
                        var f, g, h = this,
                            i = arguments;
                        return f = function() {
                            d = null, c || (e = a.apply(h, i))
                        }, g = c && !d, clearTimeout(d), d = setTimeout(f, b), g && (e = a.apply(h, i)), e
                    }
                },
                throttle: function(a, b) {
                    var c, d, e, f, g, h;
                    return g = 0, h = function() {
                            g = new Date, e = null, f = a.apply(c, d)
                        },
                        function() {
                            var i = new Date,
                                j = b - (i - g);
                            return c = this, d = arguments, 0 >= j ? (clearTimeout(e), e = null, g = i, f = a.apply(c, d)) : e || (e = setTimeout(h, j)), f
                        }
                },
                stringify: function(a) {
                    return b.isString(a) ? a : JSON.stringify(a)
                },
                noop: function() {}
            }
        }(),
        c = function() {
            "use strict";

            function a(a) {
                var g, h;
                return h = b.mixin({}, f, a), g = {
                    css: e(),
                    classes: h,
                    html: c(h),
                    selectors: d(h)
                }, {
                    css: g.css,
                    html: g.html,
                    classes: g.classes,
                    selectors: g.selectors,
                    mixin: function(a) {
                        b.mixin(a, g)
                    }
                }
            }

            function c(a) {
                return {
                    wrapper: '<span class="' + a.wrapper + '"></span>',
                    menu: '<div class="' + a.menu + '"></div>'
                }
            }

            function d(a) {
                var c = {};
                return b.each(a, function(a, b) {
                    c[b] = "." + a
                }), c
            }

            function e() {
                var a = {
                    wrapper: {
                        position: "relative",
                        display: "block"
                    },
                    hint: {
                        position: "absolute",
                        top: "0",
                        left: "0",
                        borderColor: "transparent",
                        boxShadow: "none",
                        opacity: "1"
                    },
                    input: {
                        position: "relative",
                        verticalAlign: "top",
                        backgroundColor: "transparent"
                    },
                    inputWithNoHint: {
                        position: "relative",
                        verticalAlign: "top"
                    },
                    menu: {
                        position: "absolute",
                        top: "38px",
                        left: "0",
                        zIndex: "100",
                        //display: "none",


                    },
                    ltr: {
                        left: "0",
                        right: "auto"
                    },
                    rtl: {
                        left: "auto",
                        right: " 0"
                    }
                };
                return b.isMsie() && b.mixin(a.input, {
                    backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
                }), a
            }
            var f = {
                wrapper: "twitter-typeahead",
                input: "tt-input",
                hint: "tt-hint",
                menu: "tt-menu",
                dataset: "tt-dataset",
                suggestion: "tt-suggestion",
                selectable: "tt-selectable",
                empty: "tt-empty",
                open: "tt-open",
                cursor: "tt-cursor",
                highlight: "tt-highlight"
            };
            return a
        }(),
        d = function() {
            "use strict";

            function c(b) {
                b && b.el || a.error("EventBus initialized without el"), this.$el = a(b.el)
            }
            var d, e;
            return d = "typeahead:", e = {
                render: "rendered",
                cursorchange: "cursorchanged",
                select: "selected",
                autocomplete: "autocompleted"
            }, b.mixin(c.prototype, {
                _trigger: function(b, c) {
                    var e;
                    return e = a.Event(d + b), (c = c || []).unshift(e), this.$el.trigger.apply(this.$el, c), e
                },
                before: function(a) {
                    var b, c;
                    return b = [].slice.call(arguments, 1), c = this._trigger("before" + a, b), c.isDefaultPrevented()
                },
                trigger: function(a) {
                    var b;
                    this._trigger(a, [].slice.call(arguments, 1)), (b = e[a]) && this._trigger(b, [].slice.call(arguments, 1))
                }
            }), c
        }(),
        e = function() {
            "use strict";

            function a(a, b, c, d) {
                var e;
                if (!c) return this;
                for (b = b.split(i), c = d ? h(c, d) : c, this._callbacks = this._callbacks || {}; e = b.shift();) this._callbacks[e] = this._callbacks[e] || {
                    sync: [],
                    async: []
                }, this._callbacks[e][a].push(c);
                return this
            }

            function b(b, c, d) {
                return a.call(this, "async", b, c, d)
            }

            function c(b, c, d) {
                return a.call(this, "sync", b, c, d)
            }

            function d(a) {
                var b;
                if (!this._callbacks) return this;
                for (a = a.split(i); b = a.shift();) delete this._callbacks[b];
                return this
            }

            function e(a) {
                var b, c, d, e, g;
                if (!this._callbacks) return this;
                for (a = a.split(i), d = [].slice.call(arguments, 1);
                    (b = a.shift()) && (c = this._callbacks[b]);) e = f(c.sync, this, [b].concat(d)), g = f(c.async, this, [b].concat(d)), e() && j(g);
                return this
            }

            function f(a, b, c) {
                function d() {
                    for (var d, e = 0, f = a.length; !d && f > e; e += 1) d = a[e].apply(b, c) === !1;
                    return !d
                }
                return d
            }

            function g() {
                var a;
                return a = window.setImmediate ? function(a) {
                    setImmediate(function() {
                        a()
                    })
                } : function(a) {
                    setTimeout(function() {
                        a()
                    }, 0)
                }
            }

            function h(a, b) {
                return a.bind ? a.bind(b) : function() {
                    a.apply(b, [].slice.call(arguments, 0))
                }
            }
            var i = /\s+/,
                j = g();
            return {
                onSync: c,
                onAsync: b,
                off: d,
                trigger: e
            }
        }(),
        f = function(a) {
            "use strict";

            function c(a, c, d) {
                for (var e, f = [], g = 0, h = a.length; h > g; g++) f.push(b.escapeRegExChars(a[g]));
                return e = d ? "\\b(" + f.join("|") + ")\\b" : "(" + f.join("|") + ")", c ? new RegExp(e) : new RegExp(e, "i")
            }
            var d = {
                node: null,
                pattern: null,
                tagName: "strong",
                className: null,
                wordsOnly: !1,
                caseSensitive: !1
            };
            return function(e) {
                function f(b) {
                    var c, d, f;
                    return (c = h.exec(b.data)) && (f = a.createElement(e.tagName), e.className && (f.className = e.className), d = b.splitText(c.index), d.splitText(c[0].length), f.appendChild(d.cloneNode(!0)), b.parentNode.replaceChild(f, d)), !!c
                }

                function g(a, b) {
                    for (var c, d = 3, e = 0; e < a.childNodes.length; e++) c = a.childNodes[e], c.nodeType === d ? e += b(c) ? 1 : 0 : g(c, b)
                }
                var h;
                e = b.mixin({}, d, e), e.node && e.pattern && (e.pattern = b.isArray(e.pattern) ? e.pattern : [e.pattern], h = c(e.pattern, e.caseSensitive, e.wordsOnly), g(e.node, f))
            }
        }(window.document),
        g = function() {
            "use strict";

            function c(c, e) {
                c = c || {}, c.input || a.error("input is missing"), e.mixin(this), this.$hint = a(c.hint), this.$input = a(c.input), this.query = this.$input.val(), this.queryWhenFocused = this.hasFocus() ? this.query : null, this.$overflowHelper = d(this.$input), this._checkLanguageDirection(), 0 === this.$hint.length && (this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = b.noop)
            }

            function d(b) {
                return a('<pre aria-hidden="true"></pre>').css({
                    position: "absolute",
                    visibility: "hidden",
                    whiteSpace: "pre",
                    fontFamily: b.css("font-family"),
                    fontSize: b.css("font-size"),
                    fontStyle: b.css("font-style"),
                    fontVariant: b.css("font-variant"),
                    fontWeight: b.css("font-weight"),
                    wordSpacing: b.css("word-spacing"),
                    letterSpacing: b.css("letter-spacing"),
                    textIndent: b.css("text-indent"),
                    textRendering: b.css("text-rendering"),
                    textTransform: b.css("text-transform")
                }).insertAfter(b)
            }

            function f(a, b) {
                return c.normalizeQuery(a) === c.normalizeQuery(b)
            }

            function g(a) {
                return a.altKey || a.ctrlKey || a.metaKey || a.shiftKey
            }
            var h;
            return h = {
                9: "tab",
                27: "esc",
                37: "left",
                39: "right",
                13: "enter",
                38: "up",
                40: "down"
            }, c.normalizeQuery = function(a) {
                return b.toStr(a).replace(/^\s*/g, "").replace(/\s{2,}/g, " ")
            }, b.mixin(c.prototype, e, {
                _onBlur: function() {
                    this.resetInputValue(), this.trigger("blurred")
                },
                _onFocus: function() {
                    this.queryWhenFocused = this.query, this.trigger("focused")
                },
                _onKeydown: function(a) {
                    var b = h[a.which || a.keyCode];
                    this._managePreventDefault(b, a), b && this._shouldTrigger(b, a) && this.trigger(b + "Keyed", a)
                },
                _onInput: function() {
                    this._setQuery(this.getInputValue()), this.clearHintIfInvalid(), this._checkLanguageDirection()
                },
                _managePreventDefault: function(a, b) {
                    var c;
                    switch (a) {
                        case "up":
                        case "down":
                            c = !g(b);
                            break;
                        default:
                            c = !1
                    }
                    c && b.preventDefault()
                },
                _shouldTrigger: function(a, b) {
                    var c;
                    switch (a) {
                        case "tab":
                            c = !g(b);
                            break;
                        default:
                            c = !0
                    }
                    return c
                },
                _checkLanguageDirection: function() {
                    var a = (this.$input.css("direction") || "ltr").toLowerCase();
                    this.dir !== a && (this.dir = a, this.$hint.attr("dir", a), this.trigger("langDirChanged", a))
                },
                _setQuery: function(a, b) {
                    var c, d;
                    c = f(a, this.query), d = c ? this.query.length !== a.length : !1, this.query = a, b || c ? !b && d && this.trigger("whitespaceChanged", this.query) : this.trigger("queryChanged", this.query)
                },
                bind: function() {
                    var a, c, d, e, f = this;
                    return a = b.bind(this._onBlur, this), c = b.bind(this._onFocus, this), d = b.bind(this._onKeydown, this), e = b.bind(this._onInput, this), this.$input.on("blur.tt", a).on("focus.tt", c).on("keydown.tt", d), !b.isMsie() || b.isMsie() > 9 ? this.$input.on("input.tt", e) : this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function(a) {
                        h[a.which || a.keyCode] || b.defer(b.bind(f._onInput, f, a))
                    }), this
                },
                focus: function() {
                    this.$input.focus()
                },
                blur: function() {
                    this.$input.blur()
                },
                getLangDir: function() {
                    return this.dir
                },
                getQuery: function() {
                    return this.query || ""
                },
                setQuery: function(a, b) {
                    this.setInputValue(a), this._setQuery(a, b)
                },
                hasQueryChangedSinceLastFocus: function() {
                    return this.query !== this.queryWhenFocused
                },
                getInputValue: function() {
                    return this.$input.val()
                },
                setInputValue: function(a) {
                    this.$input.val(a), this.clearHintIfInvalid(), this._checkLanguageDirection()
                },
                resetInputValue: function() {
                    this.setInputValue(this.query)
                },
                getHint: function() {
                    return this.$hint.val()
                },
                setHint: function(a) {
                    this.$hint.val(a)
                },
                clearHint: function() {
                    this.setHint("")
                },
                clearHintIfInvalid: function() {
                    var a, b, c, d;
                    a = this.getInputValue(), b = this.getHint(), c = a !== b && 0 === b.indexOf(a), d = "" !== a && c && !this.hasOverflow(), !d && this.clearHint()
                },
                hasFocus: function() {
                    return this.$input.is(":focus")
                },
                hasOverflow: function() {
                    var a = this.$input.width() - 2;
                    return this.$overflowHelper.text(this.getInputValue()), this.$overflowHelper.width() >= a
                },
                isCursorAtEnd: function() {
                    var a, c, d;
                    return a = this.$input.val().length, c = this.$input[0].selectionStart, b.isNumber(c) ? c === a : document.selection ? (d = document.selection.createRange(), d.moveStart("character", -a), a === d.text.length) : !0
                },
                destroy: function() {
                    this.$hint.off(".tt"), this.$input.off(".tt"), this.$overflowHelper.remove(), this.$hint = this.$input = this.$overflowHelper = a("<div>")
                }
            }), c
        }(),
        h = function() {
            "use strict";

            function c(c, e) {
                c = c || {}, c.templates = c.templates || {}, 
                c.templates.notFound = c.templates.notFound || c.templates.empty, 
                c.source || a.error("missing source"), 
                c.node || a.error("missing node"), 
                c.name && !h(c.name) && a.error("invalid dataset name: " + c.name), 
                e.mixin(this), this.highlight = !!c.highlight, this.name = c.name  || j(), 
                this.limit = c.limit || 15, this.displayFn = d(c.display || c.displayKey), 
                this.templates = g(c.templates, this.displayFn), 
                this.source = c.source.__ttAdapter ? c.source.__ttAdapter() : c.source,
                this.async = b.isUndefined(c.async) ? this.source.length > 2 : !!c.async,
                this._resetLastSuggestion(),
                ////////////////////////
                //c.name = a(c.name).wrapAll("<div class='govniche'>") 
                this.$el = a(c.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name)
                //this.$el = a(c.node)
                //this.$el = a(c.node)
            }

            function d(a) {
                function c(b) {
                    return b[a]
                }
                return a = a || b.stringify, b.isFunction(a) ? a : c
            }

            function g(c, d) {
                function e(b) {
                    return a("<div>").text(d(b))
                }
                return {
                    notFound: c.notFound && b.templatify(c.notFound),
                    pending: c.pending && b.templatify(c.pending),
                    header: c.header && b.templatify(c.header),
                    footer: c.footer && b.templatify(c.footer),
                    header1: c.header1 && b.templatify(c.header1),
                    suggestion: c.suggestion || e
                }
            }

            function h(a) {
                return /^[_a-zA-Z0-9-]+$/.test(a)
            }
            var i, j;
            return i = {
                val: "tt-selectable-display",
                obj: "tt-selectable-object"
            }, j = b.getIdGenerator(), c.extractData = function(b) {
                var c = a(b);
                return c.data(i.obj) ? {
                    val: c.data(i.val) || "",
                    obj: c.data(i.obj) || null
                } : null
            }, b.mixin(c.prototype, e, {
                _overwrite: function(a, b) {
                    b = b || [], b.length ? this._renderSuggestions(a, b) : this.async && this.templates.pending ? this._renderPending(a) : !this.async && this.templates.notFound ? this._renderNotFound(a) : this._empty(), this.trigger("rendered", this.name, b, !1)
                },
                _append: function(a, b) {
                    b = b || [], b.length && this.$lastSuggestion.length ? this._appendSuggestions(a, b) : b.length ? this._renderSuggestions(a, b) : !this.$lastSuggestion.length && this.templates.notFound && this._renderNotFound(a), this.trigger("rendered", this.name, b, !0)
                },
                _renderSuggestions: function(a, b) {
                    var c;
                    c = this._getSuggestionsFragment(a, b), this.$lastSuggestion = c.children().last(), 
                    this.$el.html(c).prepend(this._getHeader(a, b),this._getHeader1(a, b)).wrapInner("<div class='visible_cont'>").append(this._getFooter(a, b))
                    //this.$el.html(c).wrapInner("<div class='gg1'>")

                },
                _appendSuggestions: function(a, b) {
                    var c, d;
                    c = this._getSuggestionsFragment(a, b), d = c.children().last(), this.$lastSuggestion.after(c), this.$lastSuggestion = d
                },
                _renderPending: function(a) {
                    var b = this.templates.pending;
                    this._resetLastSuggestion(), b && this.$el.html(b({
                        query: a,
                        dataset: this.name
                    }))
                },
                _renderNotFound: function(a) {
                    var b = this.templates.notFound;
                    this._resetLastSuggestion(), b && this.$el.html(b({
                        query: a,
                        dataset: this.name
                    }))
                },
                _empty: function() {
                    this.$el.empty(), this._resetLastSuggestion()
                },
                _getSuggestionsFragment: function(c, d) {
                    var e, g = this;
                    return e = document.createDocumentFragment(), b.each(d, function(b) {
                        var d, f;
                        f = g._injectQuery(c, b), d = a(g.templates.suggestion(f)).data(i.obj, b).data(i.val, g.displayFn(b)).addClass(g.classes.suggestion + " " + g.classes.selectable), e.appendChild(d[0])
                    }), this.highlight && f({
                        className: this.classes.highlight,
                        node: e,
                        pattern: c
                    }), a(e)
                },
                _getFooter: function(a, b) {
                    return this.templates.footer ? this.templates.footer({
                        query: a,
                        suggestions: b,
                        dataset: this.name
                    }) : null
                },
                _getHeader: function(a, b) {
                    return this.templates.header ? this.templates.header({
                        query: a,
                        suggestions: b,
                        dataset: this.name
                    }) : null
                },
                _getHeader1: function(a, b) {
                    return this.templates.header1 ? this.templates.header1({
                        query: a,
                        suggestions: b,
                        dataset: this.name
                    }) : null
                },
                _resetLastSuggestion: function() {
                    this.$lastSuggestion = a()
                },
                _injectQuery: function(a, c) {
                    return b.isObject(c) ? b.mixin({
                        _query: a
                    }, c) : c
                },
                update: function(b) {
                    function c(a) {
                        g || (g = !0, a = (a || []).slice(0, e.limit), h = a.length, e._overwrite(b, a), h < e.limit && e.async && e.trigger("asyncRequested", b))
                    }

                    function d(c) {
                        c = c || [], !f && h < e.limit && (e.cancel = a.noop, c = c.slice(0, e.limit - h), h += c.length, e._append(b, c), e.async && e.trigger("asyncReceived", b))
                    }
                    var e = this,
                        f = !1,
                        g = !1,
                        h = 0;
                    this.cancel(), this.cancel = function() {
                        f = !0, e.cancel = a.noop, e.async && e.trigger("asyncCanceled", b)
                    }, this.source(b, c, d), !g && c([])
                },
                cancel: a.noop,
                clear: function() {
                    this._empty(), this.cancel(), this.trigger("cleared")
                },
                isEmpty: function() {
                    return this.$el.is(":empty")
                },
                destroy: function() {
                    this.$el = a("<div>")
                }
            }), c
        }(),
        i = function() {
            "use strict";

            function c(c, d) {
                function e(b) {
                    var c = f.$node.find(b.node).first();
                    return b.node = c.length ? c : a("<div>").appendTo(f.$node), new h(b, d)
                }
                var f = this;
                c = c || {}, c.node || a.error("node is required"), d.mixin(this), this.$node = a(c.node), this.query = null, this.datasets = b.map(c.datasets, e)
            }
            return b.mixin(c.prototype, e, {
                _onSelectableClick: function(b) {
                    this.trigger("selectableClicked", a(b.currentTarget))
                },
                _onRendered: function(a, b, c, d) {
                    this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()), this.trigger("datasetRendered", b, c, d)
                },
                _onCleared: function() {
                    this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()), this.trigger("datasetCleared")
                },
                _propagate: function() {
                    this.trigger.apply(this, arguments)
                },
                _allDatasetsEmpty: function() {
                    function a(a) {
                        return a.isEmpty()
                    }
                    return b.every(this.datasets, a)
                },
                _getSelectables: function() {
                    return this.$node.find(this.selectors.selectable)
                },
                _removeCursor: function() {
                    var a = this.getActiveSelectable();
                    a && a.removeClass(this.classes.cursor)
                },
                _ensureVisible: function(a) {
                    var b, c, d, e;
                    b = a.position().top, c = b + a.outerHeight(!0), d = this.$node.scrollTop(), e = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10), 0 > b ? this.$node.scrollTop(d + b) : c > e && this.$node.scrollTop(d + (c - e))
                },
                bind: function() {
                    var a, c = this;
                    return a = b.bind(this._onSelectableClick, this), this.$node.on("click.tt", this.selectors.selectable, a), b.each(this.datasets, function(a) {
                        a.onSync("asyncRequested", c._propagate, c).onSync("asyncCanceled", c._propagate, c).onSync("asyncReceived", c._propagate, c).onSync("rendered", c._onRendered, c).onSync("cleared", c._onCleared, c)
                    }), this
                },
                isOpen: function() {
                    return this.$node.hasClass(this.classes.open)
                },
                open: function() {
                    this.$node.addClass(this.classes.open)
                },
                close: function() {
                    // если мы кликаем в любое место то класс не удаляется
                        this.$node.removeClass(this.classes.open), this._removeCursor()
                },
                setLanguageDirection: function(a) {
                    this.$node.attr("dir", a)
                },
                selectableRelativeToCursor: function(a) {
                    var b, c, d, e;
                    return c = this.getActiveSelectable(), b = this._getSelectables(), d = c ? b.index(c) : -1, e = d + a, e = (e + 1) % (b.length + 1) - 1, e = -1 > e ? b.length - 1 : e, -1 === e ? null : b.eq(e)
                },
                setCursor: function(a) {
                    this._removeCursor(), (a = a && a.first()) && (a.addClass(this.classes.cursor), this._ensureVisible(a))
                },
                getSelectableData: function(a) {
                    return a && a.length ? h.extractData(a) : null
                },
                getActiveSelectable: function() {
                    var a = this._getSelectables().filter(this.selectors.cursor).first();
                    return a.length ? a : null
                },
                getTopSelectable: function() {
                    var a = this._getSelectables().first();
                    return a.length ? a : null
                },
                update: function(a) {
                    function c(b) {
                        b.update(a)
                    }
                    var d = a !== this.query;
                    return d && (this.query = a, b.each(this.datasets, c)), d
                },
                empty: function() {
                    function a(a) {
                        a.clear()
                    }
                    b.each(this.datasets, a), this.query = null, this.$node.addClass(this.classes.empty)
                },
                destroy: function() {
                    function c(a) {
                        a.destroy()
                    }
                    this.$node.off(".tt"), this.$node = a("<div>"), b.each(this.datasets, c)
                }
            }), c
        }(),
        j = function() {
            "use strict";

            function a() {
                i.apply(this, [].slice.call(arguments, 0))
            }
            var c = i.prototype;
            return b.mixin(a.prototype, i.prototype, {
                open: function() {
                    return !this._allDatasetsEmpty() && this._show(), c.open.apply(this, [].slice.call(arguments, 0))
                },
                close: function() {
                    return this._hide(), c.close.apply(this, [].slice.call(arguments, 0))
                },
                _onRendered: function() {
                    return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(), c._onRendered.apply(this, [].slice.call(arguments, 0))
                },
                _onCleared: function() {
                    return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(), c._onCleared.apply(this, [].slice.call(arguments, 0))
                },
                setLanguageDirection: function(a) {
                    return this.$node.css("ltr" === a ? this.css.ltr : this.css.rtl), c.setLanguageDirection.apply(this, [].slice.call(arguments, 0))
                },
                _hide: function() {
                    this.$node.hide()
                },
                _show: function() {
                    this.$node.css("display", "block")
                }
            }), a
        }(),
        k = function() {
            "use strict";

            function c(c, e) {
                var f, g, h, i, j, k, l, m, n, o, p;
                c = c || {}, c.input || a.error("missing input"), c.menu || a.error("missing menu"), c.eventBus || a.error("missing event bus"), e.mixin(this), this.eventBus = c.eventBus, this.minLength = b.isNumber(c.minLength) ? c.minLength : 1, this.input = c.input, this.menu = c.menu, this.enabled = !0, this.active = !1, this.input.hasFocus() && this.activate(), this.dir = this.input.getLangDir(), this._hacks(), this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this), f = d(this, "activate", "open", "_onFocused"), g = d(this, "deactivate", "_onBlurred"), h = d(this, "isActive", "isOpen", "_onEnterKeyed"), i = d(this, "isActive", "isOpen", "_onTabKeyed"), j = d(this, "isActive", "_onEscKeyed"), k = d(this, "isActive", "open", "_onUpKeyed"), l = d(this, "isActive", "open", "_onDownKeyed"), m = d(this, "isActive", "isOpen", "_onLeftKeyed"), n = d(this, "isActive", "isOpen", "_onRightKeyed"), o = d(this, "_openIfActive", "_onQueryChanged"), p = d(this, "_openIfActive", "_onWhitespaceChanged"), this.input.bind().onSync("focused", f, this).onSync("blurred", g, this).onSync("enterKeyed", h, this).onSync("tabKeyed", i, this).onSync("escKeyed", j, this).onSync("upKeyed", k, this).onSync("downKeyed", l, this).onSync("leftKeyed", m, this).onSync("rightKeyed", n, this).onSync("queryChanged", o, this).onSync("whitespaceChanged", p, this).onSync("langDirChanged", this._onLangDirChanged, this)
            }

            function d(a) {
                var c = [].slice.call(arguments, 1);
                return function() {
                    var d = [].slice.call(arguments);
                    b.each(c, function(b) {
                        return a[b].apply(a, d)
                    })
                }
            }
            return b.mixin(c.prototype, {
                _hacks: function() {
                    var c, d;
                    c = this.input.$input || a("<div>"), d = this.menu.$node || a("<div>"), c.on("blur.tt", function(a) {
                        var e, f, g;
                        e = document.activeElement, f = d.is(e), g = d.has(e).length > 0, b.isMsie() && (f || g) && (a.preventDefault(), a.stopImmediatePropagation(), b.defer(function() {
                            c.focus()
                        }))
                    }), d.on("mousedown.tt", function(a) {
                        a.preventDefault()
                    })
                },
                _onSelectableClicked: function(a, b) {
                    this.select(b)
                },
                _onDatasetCleared: function() {
                    this._updateHint()
                },
                _onDatasetRendered: function(a, b, c, d) {
                    this._updateHint(), this.eventBus.trigger("render", c, d, b)
                },
                _onAsyncRequested: function(a, b, c) {
                    this.eventBus.trigger("asyncrequest", c, b)
                },
                _onAsyncCanceled: function(a, b, c) {
                    this.eventBus.trigger("asynccancel", c, b)
                },
                _onAsyncReceived: function(a, b, c) {
                    this.eventBus.trigger("asyncreceive", c, b)
                },
                _onFocused: function() {
                    this._minLengthMet() && this.menu.update(this.input.getQuery())
                },
                _onBlurred: function() {
                    this.input.hasQueryChangedSinceLastFocus() && this.eventBus.trigger("change", this.input.getQuery())
                },
                _onEnterKeyed: function(a, b) {
                    var c;
                    (c = this.menu.getActiveSelectable()) && this.select(c) && b.preventDefault()
                },
                _onTabKeyed: function(a, b) {
                    var c;
                    (c = this.menu.getActiveSelectable()) ? this.select(c) && b.preventDefault(): (c = this.menu.getTopSelectable()) && this.autocomplete(c) && b.preventDefault()
                },
                _onEscKeyed: function() {
                    this.close()
                },
                _onUpKeyed: function() {
                    this.moveCursor(-1)
                },
                _onDownKeyed: function() {
                    this.moveCursor(1)
                },
                _onLeftKeyed: function() {
                    "rtl" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
                },
                _onRightKeyed: function() {
                    "ltr" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
                },
                _onQueryChanged: function(a, b) {
                    this._minLengthMet(b) ? this.menu.update(b) : this.menu.empty()
                },
                _onWhitespaceChanged: function() {
                    this._updateHint()
                },
                _onLangDirChanged: function(a, b) {
                    this.dir !== b && (this.dir = b, this.menu.setLanguageDirection(b))
                },
                _openIfActive: function() {
                    this.isActive() && this.open()
                },
                _minLengthMet: function(a) {
                    return a = b.isString(a) ? a : this.input.getQuery() || "", a.length >= this.minLength
                },
                _updateHint: function() {
                    var a, c, d, e, f, h, i;
                    a = this.menu.getTopSelectable(), c = this.menu.getSelectableData(a), d = this.input.getInputValue(), !c || b.isBlankString(d) || this.input.hasOverflow() ? this.input.clearHint() : (e = g.normalizeQuery(d), f = b.escapeRegExChars(e), h = new RegExp("^(?:" + f + ")(.+$)", "i"), i = h.exec(c.val), i && this.input.setHint(d + i[1]))
                },
                isEnabled: function() {
                    return this.enabled
                },
                enable: function() {
                    this.enabled = !0
                },
                disable: function() {
                    this.enabled = !1
                },
                isActive: function() {
                    return this.active
                },
                activate: function() {
                    return this.isActive() ? !0 : !this.isEnabled() || this.eventBus.before("active") ? !1 : (this.active = !0, this.eventBus.trigger("active"), !0)
                },
                deactivate: function() {
                    return this.isActive() ? this.eventBus.before("idle") ? !1 : (this.active = !1, this.close(), this.eventBus.trigger("idle"), !0) : !0
                },
                isOpen: function() {
                    return this.menu.isOpen()
                },
                open: function() {
                    return this.isOpen() || this.eventBus.before("open") || (this.menu.open(), this._updateHint(), this.eventBus.trigger("open")), this.isOpen()
                },
                close: function() {
                    return this.isOpen() && !this.eventBus.before("close") && (this.menu.close(), this.input.clearHint(), this.input.resetInputValue(), this.eventBus.trigger("close")), !this.isOpen()
                },
                setVal: function(a) {
                    this.input.setQuery(b.toStr(a))
                },
                getVal: function() {
                    return this.input.getQuery()
                },
                select: function(a) {
                    var b = this.menu.getSelectableData(a);
                    return b && !this.eventBus.before("select", b.obj) ? (this.input.setQuery(b.val, !0), this.eventBus.trigger("select", b.obj), this.close(), !0) : !1
                },
                autocomplete: function(a) {
                    var b, c, d;
                    return b = this.input.getQuery(), c = this.menu.getSelectableData(a), d = c && b !== c.val, d && !this.eventBus.before("autocomplete", c.obj) ? (this.input.setQuery(c.val), this.eventBus.trigger("autocomplete", c.obj), !0) : !1
                },
                moveCursor: function(a) {
                    var b, c, d, e, f;
                    return b = this.input.getQuery(), c = this.menu.selectableRelativeToCursor(a), d = this.menu.getSelectableData(c), e = d ? d.obj : null, f = this._minLengthMet() && this.menu.update(b), f || this.eventBus.before("cursorchange", e) ? !1 : (this.menu.setCursor(c), d ? this.input.setInputValue(d.val) : (this.input.resetInputValue(), this._updateHint()), this.eventBus.trigger("cursorchange", e), !0)
                },
                destroy: function() {
                    this.input.destroy(), this.menu.destroy()
                }
            }), c
        }();
    ! function() {
        "use strict";

        function e(b, c) {
            b.each(function() {
                var b, d = a(this);
                (b = d.data(p.typeahead)) && c(b, d)
            })
        }

        function f(a, b) {
            return a.clone().addClass(b.classes.hint).removeData().css(b.css.hint).css(l(a)).prop("readonly", !0).removeAttr("id name placeholder required").attr({
                autocomplete: "off",
                spellcheck: "false",
                tabindex: -1
            })
        }

        function h(a, b) {
            a.data(p.attrs, {
                dir: a.attr("dir"),
                autocomplete: a.attr("autocomplete"),
                spellcheck: a.attr("spellcheck"),
                style: a.attr("style")
            }), a.addClass(b.classes.input).attr({
                autocomplete: "off",
                spellcheck: !1
            });
            try {
                !a.attr("dir") && a.attr("dir", "auto")
            } catch (c) {}
            return a
        }

        function l(a) {
            return {
                backgroundAttachment: a.css("background-attachment"),
                backgroundClip: a.css("background-clip"),
                backgroundColor: a.css("background-color"),
                backgroundImage: a.css("background-image"),
                backgroundOrigin: a.css("background-origin"),
                backgroundPosition: a.css("background-position"),
                backgroundRepeat: a.css("background-repeat"),
                backgroundSize: a.css("background-size")
            }
        }

        function m(a) {
            var c, d;
            c = a.data(p.www), d = a.parent().filter(c.selectors.wrapper), b.each(a.data(p.attrs), function(c, d) {
                b.isUndefined(c) ? a.removeAttr(d) : a.attr(d, c)
            }), a.removeData(p.typeahead).removeData(p.www).removeData(p.attr).removeClass(c.classes.input), d.length && (a.detach().insertAfter(d), d.remove())
        }

        function n(c) {
            var d, e;
            return d = b.isJQuery(c) || b.isElement(c), e = d ? a(c).first() : [], e.length ? e : null
        }
        var o, p, q;
        o = a.fn.typeahead, p = {
            www: "tt-www",
            attrs: "tt-attrs",
            typeahead: "tt-typeahead"
        }, q = {
            initialize: function(e, l) {
                function m() {
                    var c, m, q, r, s, t, u, v, w, x, y;
                    b.each(l, function(a) {
                        a.highlight = !!e.highlight
                    }), c = a(this), m = a(o.html.wrapper), q = n(e.hint), r = n(e.menu), s = e.hint !== !1 && !q, t = e.menu !== !1 && !r, s && (q = f(c, o)), t && (r = a(o.html.menu).css(o.css.menu)), q && q.val(""), c = h(c, o), (s || t) && (m.css(o.css.wrapper), c.css(s ? o.css.input : o.css.inputWithNoHint), c.wrap(m).parent().prepend(s ? q : null).append(t ? r : null)), y = t ? j : i, u = new d({
                        el: c
                    }), v = new g({
                        hint: q,
                        input: c
                    }, o), w = new y({
                        node: r,
                        datasets: l
                    }, o), x = new k({
                        input: v,
                        menu: w,
                        eventBus: u,
                        minLength: e.minLength
                    }, o), c.data(p.www, o), c.data(p.typeahead, x)
                }
                var o;
                return l = b.isArray(l) ? l : [].slice.call(arguments, 1), e = e || {}, o = c(e.classNames), this.each(m)
            },
            isEnabled: function() {
                var a;
                return e(this.first(), function(b) {
                    a = b.isEnabled()
                }), a
            },
            enable: function() {
                return e(this, function(a) {
                    a.enable()
                }), this
            },
            disable: function() {
                return e(this, function(a) {
                    a.disable()
                }), this
            },
            isActive: function() {
                var a;
                return e(this.first(), function(b) {
                    a = b.isActive()
                }), a
            },
            activate: function() {
                return e(this, function(a) {
                    a.activate()
                }), this
            },
            deactivate: function() {
                return e(this, function(a) {
                    a.deactivate()
                }), this
            },
            isOpen: function() {
                var a;
                return e(this.first(), function(b) {
                    a = b.isOpen()
                }), a
            },
            open: function() {
                return e(this, function(a) {
                    a.open()
                }), this
            },
            close: function() {
                return e(this, function(a) {
                    a.close()
                }), this
            },
            select: function(b) {
                var c = !1,
                    d = a(b);
                return e(this.first(), function(a) {
                    c = a.select(d)
                }), c
            },
            autocomplete: function(b) {
                var c = !1,
                    d = a(b);
                return e(this.first(), function(a) {
                    c = a.autocomplete(d)
                }), c
            },
            moveCursor: function(a) {
                var b = !1;
                return e(this.first(), function(c) {
                    b = c.moveCursor(a)
                }), b
            },
            val: function(a) {
                var b;
                return arguments.length ? (e(this, function(b) {
                    b.setVal(a)
                }), this) : (e(this.first(), function(a) {
                    b = a.getVal()
                }), b)
            },
            destroy: function() {
                return e(this, function(a, b) {
                    m(b), a.destroy()
                }), this
            }
        }, a.fn.typeahead = function(a) {
            return q[a] ? q[a].apply(this, [].slice.call(arguments, 1)) : q.initialize.apply(this, arguments)
        }, a.fn.typeahead.noConflict = function() {
            return a.fn.typeahead = o, this
        }
    }()
});