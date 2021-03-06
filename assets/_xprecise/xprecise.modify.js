/*

 jQuery Browser Plugin
 * Version 2.3
 * 2008-09-17 19:27:05
 * URL: http://jquery.thewikies.com/browser
 * Description: jQuery Browser Plugin extends browser detection capabilities and can assign browser selectors to CSS classes.
 * Author: Nate Cavanaugh, Minhchau Dang, & Jonathan Neal
 * Copyright: Copyright (c) 2008 Jonathan Neal under dual MIT/GPL license.
 * JSLint: This javascript file passes JSLint verification.
 *//*jslint
 bitwise: true,
 browser: true,
 eqeqeq: true,
 forin: true,
 nomen: true,
 plusplus: true,
 undef: true,
 white: true
 *//*global
 jQuery
 */

(function ($) {
    $.browserTest = function (a, z) {
        var u = 'unknown', x = 'X', m = function (r, h) {
            for (var i = 0; i < h.length; i = i + 1) {
                r = r.replace(h[i][0], h[i][1]);
            }

            return r;
        }, c = function (i, a, b, c) {
            var r = {
                name: m((a.exec(i) || [u, u])[1], b)
            };

            r[r.name] = true;

            r.version = (c.exec(i) || [x, x, x, x])[3];

            if (r.name.match(/safari/) && r.version > 400) {
                r.version = '2.0';
            }

            if (r.name === 'presto') {
                r.version = ($.browser.version > 9.27) ? 'futhark' : 'linear_b';
            }
            r.versionNumber = parseFloat(r.version, 10) || 0;
            r.versionX = (r.version !== x) ? (r.version + '').substr(0, 1) : x;
            r.className = r.name + r.versionX;

            return r;
        };

        a = (a.match(/Opera|Navigator|Minefield|KHTML|Chrome/) ? m(a, [
            [/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/, ''],
            ['Chrome Safari', 'Chrome'],
            ['KHTML', 'Konqueror'],
            ['Minefield', 'Firefox'],
            ['Navigator', 'Netscape']
        ]) : a).toLowerCase();

        $.browser = $.extend((!z) ? $.browser : {}, c(a, /(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/, [], /(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));

        $.layout = c(a, /(gecko|konqueror|msie|opera|webkit)/, [
            ['konqueror', 'khtml'],
            ['msie', 'trident'],
            ['opera', 'presto']
        ], /(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);

        $.os = {
            name: (/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase()) || [u])[0].replace('sunos', 'solaris')
        };

        if (!z) {
            $('html').addClass([$.os.name, $.browser.name, $.browser.className, $.layout.name, $.layout.className].join(' '));
        }
    };

    $.browserTest(navigator.userAgent);
})(jQuery);


jQuery.ui || (function (c) {
    var i = c.fn.remove,
        d = c.browser.mozilla && (parseFloat(c.browser.version) < 1.9);
    c.ui = {
        version: "1.7.2",
        plugin: {
            add: function (k, l, n) {
                var m = c.ui[k].prototype;
                for (var j in n) {
                    m.plugins[j] = m.plugins[j] || [];
                    m.plugins[j].push([l, n[j]])
                }
            },
            call: function (j, l, k) {
                var n = j.plugins[l];
                if (!n || !j.element[0].parentNode) {
                    return
                }
                for (var m = 0; m < n.length; m++) {
                    if (j.options[n[m][0]]) {
                        n[m][1].apply(j.element, k)
                    }
                }
            }
        },
        contains: function (k, j) {
            return document.compareDocumentPosition ? k.compareDocumentPosition(j) & 16 : k !== j && k.contains(j)
        },
        hasScroll: function (m, k) {
            if (c(m).css("overflow") == "hidden") {
                return false
            }
            var j = (k && k == "left") ? "scrollLeft" : "scrollTop",
                l = false;
            if (m[j] > 0) {
                return true
            }
            m[j] = 1;
            l = (m[j] > 0);
            m[j] = 0;
            return l
        },
        isOverAxis: function (k, j, l) {
            return (k > j) && (k < (j + l))
        },
        isOver: function (o, k, n, m, j, l) {
            return c.ui.isOverAxis(o, n, j) && c.ui.isOverAxis(k, m, l)
        },
        keyCode: {
            BACKSPACE: 8,
            CAPS_LOCK: 20,
            COMMA: 188,
            CONTROL: 17,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            INSERT: 45,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SHIFT: 16,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    };
    if (d) {
        var f = c.attr,
            e = c.fn.removeAttr,
            h = "http://www.w3.org/2005/07/aaa",
            a = /^aria-/,
            b = /^wairole:/;
        c.attr = function (k, j, l) {
            var m = l !== undefined;
            return (j == "role" ? (m ? f.call(this, k, j, "wairole:" + l) : (f.apply(this, arguments) || "").replace(b, "")) : (a.test(j) ? (m ? k.setAttributeNS(h, j.replace(a, "aaa:"), l) : f.call(this, k, j.replace(a, "aaa:"))) : f.apply(this, arguments)))
        };
        c.fn.removeAttr = function (j) {
            return (a.test(j) ? this.each(function () {
                this.removeAttributeNS(h, j.replace(a, ""))
            }) : e.call(this, j))
        }
    }
    c.fn.extend({
        remove: function () {
            c("*", this).add(this).each(function () {
                c(this).triggerHandler("remove")
            });
            return i.apply(this, arguments)
        },
        enableSelection: function () {
            return this.attr("unselectable", "off").css("MozUserSelect", "").unbind("selectstart.ui")
        },
        disableSelection: function () {
            return this.attr("unselectable", "on").css("MozUserSelect", "none").bind("selectstart.ui", function () {
                return false
            })
        },
        scrollParent: function () {
            var j;
            if ((c.browser.msie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
                j = this.parents().filter(function () {
                    return (/(relative|absolute|fixed)/).test(c.css(this, "position", 1)) && (/(auto|scroll)/).test(c.css(this, "overflow", 1) + c.css(this, "overflow-y", 1) + c.css(this, "overflow-x", 1))
                }).eq(0)
            } else {
                j = this.parents().filter(function () {
                    return (/(auto|scroll)/).test(c.css(this, "overflow", 1) + c.css(this, "overflow-y", 1) + c.css(this, "overflow-x", 1))
                }).eq(0)
            }
            return (/fixed/).test(this.css("position")) || !j.length ? c(document) : j
        }
    });
    c.extend(c.expr[":"], {
        data: function (l, k, j) {
            return !!c.data(l, j[3])
        },
        focusable: function (k) {
            var l = k.nodeName.toLowerCase(),
                j = c.attr(k, "tabindex");
            return (/input|select|textarea|button|object/.test(l) ? !k.disabled : "a" == l || "area" == l ? k.href || !isNaN(j) : !isNaN(j)) && !c(k)["area" == l ? "parents" : "closest"](":hidden").length
        },
        tabbable: function (k) {
            var j = c.attr(k, "tabindex");
            return (isNaN(j) || j >= 0) && c(k).is(":focusable")
        }
    });

    function g(m, n, o, l) {
        function k(q) {
            var p = c[m][n][q] || [];
            return (typeof p == "string" ? p.split(/,?\s+/) : p)
        }
        var j = k("getter");
        if (l.length == 1 && typeof l[0] == "string") {
            j = j.concat(k("getterSetter"))
        }
        return (c.inArray(o, j) != -1)
    }
    c.widget = function (k, j) {
        var l = k.split(".")[0];
        k = k.split(".")[1];
        c.fn[k] = function (p) {
            var n = (typeof p == "string"),
                o = Array.prototype.slice.call(arguments, 1);
            if (n && p.substring(0, 1) == "_") {
                return this
            }
            if (n && g(l, k, p, o)) {
                var m = c.data(this[0], k);
                return (m ? m[p].apply(m, o) : undefined)
            }
            return this.each(function () {
                var q = c.data(this, k);
                (!q && !n && c.data(this, k, new c[l][k](this, p))._init());
                (q && n && c.isFunction(q[p]) && q[p].apply(q, o))
            })
        };
        c[l] = c[l] || {};
        c[l][k] = function (o, n) {
            var m = this;
            this.namespace = l;
            this.widgetName = k;
            this.widgetEventPrefix = c[l][k].eventPrefix || k;
            this.widgetBaseClass = l + "-" + k;
            this.options = c.extend({}, c.widget.defaults, c[l][k].defaults, c.metadata && c.metadata.get(o)[k], n);
            this.element = c(o).bind("setData." + k, function (q, p, r) {
                if (q.target == o) {
                    return m._setData(p, r)
                }
            }).bind("getData." + k, function (q, p) {
                    if (q.target == o) {
                        return m._getData(p)
                    }
                }).bind("remove", function () {
                    return m.destroy()
                })
        };
        c[l][k].prototype = c.extend({}, c.widget.prototype, j);
        c[l][k].getterSetter = "option"
    };
    c.widget.prototype = {
        _init: function () {},
        destroy: function () {
            this.element.removeData(this.widgetName).removeClass(this.widgetBaseClass + "-disabled " + this.namespace + "-state-disabled").removeAttr("aria-disabled")
        },
        option: function (l, m) {
            var k = l,
                j = this;
            if (typeof l == "string") {
                if (m === undefined) {
                    return this._getData(l)
                }
                k = {};
                k[l] = m
            }
            c.each(k, function (n, o) {
                j._setData(n, o)
            })
        },
        _getData: function (j) {
            return this.options[j]
        },
        _setData: function (j, k) {
            this.options[j] = k;
            if (j == "disabled") {
                this.element[k ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled " + this.namespace + "-state-disabled").attr("aria-disabled", k)
            }
        },
        enable: function () {
            this._setData("disabled", false)
        },
        disable: function () {
            this._setData("disabled", true)
        },
        _trigger: function (l, m, n) {
            var p = this.options[l],
                j = (l == this.widgetEventPrefix ? l : this.widgetEventPrefix + l);
            m = c.Event(m);
            m.type = j;
            if (m.originalEvent) {
                for (var k = c.event.props.length, o; k;) {
                    o = c.event.props[--k];
                    m[o] = m.originalEvent[o]
                }
            }
            this.element.trigger(m, n);
            return !(c.isFunction(p) && p.call(this.element[0], m, n) === false || m.isDefaultPrevented())
        }
    };
    c.widget.defaults = {
        disabled: false
    };
    c.ui.mouse = {
        _mouseInit: function () {
            var j = this;
            this.element.bind("mousedown." + this.widgetName, function (k) {
                return j._mouseDown(k)
            }).bind("click." + this.widgetName, function (k) {
                    if (j._preventClickEvent) {
                        j._preventClickEvent = false;
                        k.stopImmediatePropagation();
                        return false
                    }
                });
            if (c.browser.msie) {
                this._mouseUnselectable = this.element.attr("unselectable");
                this.element.attr("unselectable", "on")
            }
            this.started = false
        },
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName);
            (c.browser.msie && this.element.attr("unselectable", this._mouseUnselectable))
        },
        _mouseDown: function (l) {
            l.originalEvent = l.originalEvent || {};
            if (l.originalEvent.mouseHandled) {
                return
            }(this._mouseStarted && this._mouseUp(l));
            this._mouseDownEvent = l;
            var k = this,
                m = (l.which == 1),
                j = (typeof this.options.cancel == "string" ? c(l.target).parents().add(l.target).filter(this.options.cancel).length : false);
            if (!m || j || !this._mouseCapture(l)) {
                return true
            }
            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet) {
                this._mouseDelayTimer = setTimeout(function () {
                    k.mouseDelayMet = true
                }, this.options.delay)
            }
            if (this._mouseDistanceMet(l) && this._mouseDelayMet(l)) {
                this._mouseStarted = (this._mouseStart(l) !== false);
                if (!this._mouseStarted) {
                    l.preventDefault();
                    return true
                }
            }
            this._mouseMoveDelegate = function (n) {
                return k._mouseMove(n)
            };
            this._mouseUpDelegate = function (n) {
                return k._mouseUp(n)
            };
            c(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
            (c.browser.safari || l.preventDefault());
            l.originalEvent.mouseHandled = true;
            return true
        },
        _mouseMove: function (j) {
            if (c.browser.msie && !j.button) {
                return this._mouseUp(j)
            }
            if (this._mouseStarted) {
                this._mouseDrag(j);
                return j.preventDefault()
            }
            if (this._mouseDistanceMet(j) && this._mouseDelayMet(j)) {
                this._mouseStarted = (this._mouseStart(this._mouseDownEvent, j) !== false);
                (this._mouseStarted ? this._mouseDrag(j) : this._mouseUp(j))
            }
            return !this._mouseStarted
        },
        _mouseUp: function (j) {
            c(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                this._preventClickEvent = (j.target == this._mouseDownEvent.target);
                this._mouseStop(j)
            }
            return false
        },
        _mouseDistanceMet: function (j) {
            return (Math.max(Math.abs(this._mouseDownEvent.pageX - j.pageX), Math.abs(this._mouseDownEvent.pageY - j.pageY)) >= this.options.distance)
        },
        _mouseDelayMet: function (j) {
            return this.mouseDelayMet
        },
        _mouseStart: function (j) {},
        _mouseDrag: function (j) {},
        _mouseStop: function (j) {},
        _mouseCapture: function (j) {
            return true
        }
    };
    c.ui.mouse.defaults = {
        cancel: null,
        distance: 1,
        delay: 0
    }
})(jQuery);;
(function (a) {
    a.widget("ui.draggable", a.extend({}, a.ui.mouse, {
        _init: function () {
            if (this.options.helper == "original" && !(/^(?:r|a|f)/).test(this.element.css("position"))) {
                this.element[0].style.position = "relative"
            }(this.options.addClasses && this.element.addClass("ui-draggable"));
            (this.options.disabled && this.element.addClass("ui-draggable-disabled"));
            this._mouseInit()
        },
        destroy: function () {
            if (!this.element.data("draggable")) {
                return
            }
            this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
            this._mouseDestroy()
        },
        _mouseCapture: function (b) {
            var c = this.options;
            if (this.helper || c.disabled || a(b.target).is(".ui-resizable-handle")) {
                return false
            }
            this.handle = this._getHandle(b);
            if (!this.handle) {
                return false
            }
            return true
        },
        _mouseStart: function (b) {
            var c = this.options;
            this.helper = this._createHelper(b);
            this._cacheHelperProportions();
            if (a.ui.ddmanager) {
                a.ui.ddmanager.current = this
            }
            this._cacheMargins();
            this.cssPosition = this.helper.css("position");
            this.scrollParent = this.helper.scrollParent();
            this.offset = this.element.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };
            a.extend(this.offset, {
                click: {
                    left: b.pageX - this.offset.left,
                    top: b.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            });
            this.originalPosition = this._generatePosition(b);
            this.originalPageX = b.pageX;
            this.originalPageY = b.pageY;
            if (c.cursorAt) {
                this._adjustOffsetFromHelper(c.cursorAt)
            }
            if (c.containment) {
                this._setContainment()
            }
            this._trigger("start", b);
            this._cacheHelperProportions();
            if (a.ui.ddmanager && !c.dropBehaviour) {
                a.ui.ddmanager.prepareOffsets(this, b)
            }
            this.helper.addClass("ui-draggable-dragging");
            this._mouseDrag(b, true);
            return true
        },
        _mouseDrag: function (b, d) {
            this.position = this._generatePosition(b);
            this.positionAbs = this._convertPositionTo("absolute");
            if (!d) {
                var c = this._uiHash();
                this._trigger("drag", b, c);
                this.position = c.position
            }
            if (!this.options.axis || this.options.axis != "y") {
                this.helper[0].style.left = this.position.left + "px"
            }
            if (!this.options.axis || this.options.axis != "x") {
                this.helper[0].style.top = this.position.top + "px"
            }
            if (a.ui.ddmanager) {
                a.ui.ddmanager.drag(this, b)
            }
            return false
        },
        _mouseStop: function (c) {
            var d = false;
            if (a.ui.ddmanager && !this.options.dropBehaviour) {
                d = a.ui.ddmanager.drop(this, c)
            }
            if (this.dropped) {
                d = this.dropped;
                this.dropped = false
            }
            if ((this.options.revert == "invalid" && !d) || (this.options.revert == "valid" && d) || this.options.revert === true || (a.isFunction(this.options.revert) && this.options.revert.call(this.element, d))) {
                var b = this;
                a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                    b._trigger("stop", c);
                    b._clear()
                })
            } else {
                this._trigger("stop", c);
                this._clear()
            }
            return false
        },
        _getHandle: function (b) {
            var c = !this.options.handle || !a(this.options.handle, this.element).length ? true : false;
            a(this.options.handle, this.element).find("*").addBack().each(function () {
                if (this == b.target) {
                    c = true
                }
            });
            return c
        },
        _createHelper: function (c) {
            var d = this.options;
            var b = a.isFunction(d.helper) ? a(d.helper.apply(this.element[0], [c])) : (d.helper == "clone" ? this.element.clone() : this.element);
            if (!b.parents("body").length) {
                b.appendTo((d.appendTo == "parent" ? this.element[0].parentNode : d.appendTo))
            }
            if (b[0] != this.element[0] && !(/(fixed|absolute)/).test(b.css("position"))) {
                b.css("position", "absolute")
            }
            return b
        },
        _adjustOffsetFromHelper: function (b) {
            if (b.left != undefined) {
                this.offset.click.left = b.left + this.margins.left
            }
            if (b.right != undefined) {
                this.offset.click.left = this.helperProportions.width - b.right + this.margins.left
            }
            if (b.top != undefined) {
                this.offset.click.top = b.top + this.margins.top
            }
            if (b.bottom != undefined) {
                this.offset.click.top = this.helperProportions.height - b.bottom + this.margins.top
            }
        },
        _getParentOffset: function () {
            this.offsetParent = this.helper.offsetParent();
            var b = this.offsetParent.offset();
            if (this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
                b.left += this.scrollParent.scrollLeft();
                b.top += this.scrollParent.scrollTop()
            }
            if ((this.offsetParent[0] == document.body) || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie)) {
                b = {
                    top: 0,
                    left: 0
                }
            }
            return {
                top: b.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: b.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
        },
        _getRelativeOffset: function () {
            if (this.cssPosition == "relative") {
                var b = this.element.position();
                return {
                    top: b.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: b.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            } else {
                return {
                    top: 0,
                    left: 0
                }
            }
        },
        _cacheMargins: function () {
            this.margins = {
                left: (parseInt(this.element.css("marginLeft"), 10) || 0),
                top: (parseInt(this.element.css("marginTop"), 10) || 0)
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            }
        },
        _setContainment: function () {
            var e = this.options;
            if (e.containment == "parent") {
                e.containment = this.helper[0].parentNode
            }
            if (e.containment == "document" || e.containment == "window") {
                this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, a(e.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (a(e.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]
            }
            if (!(/^(document|window|parent)$/).test(e.containment) && e.containment.constructor != Array) {
                var c = a(e.containment)[0];
                if (!c) {
                    return
                }
                var d = a(e.containment).offset();
                var b = (a(c).css("overflow") != "hidden");
                this.containment = [d.left + (parseInt(a(c).css("borderLeftWidth"), 10) || 0) + (parseInt(a(c).css("paddingLeft"), 10) || 0) - this.margins.left, d.top + (parseInt(a(c).css("borderTopWidth"), 10) || 0) + (parseInt(a(c).css("paddingTop"), 10) || 0) - this.margins.top, d.left + (b ? Math.max(c.scrollWidth, c.offsetWidth) : c.offsetWidth) - (parseInt(a(c).css("borderLeftWidth"), 10) || 0) - (parseInt(a(c).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, d.top + (b ? Math.max(c.scrollHeight, c.offsetHeight) : c.offsetHeight) - (parseInt(a(c).css("borderTopWidth"), 10) || 0) - (parseInt(a(c).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
            } else {
                if (e.containment.constructor == Array) {
                    this.containment = e.containment
                }
            }
        },
        _convertPositionTo: function (f, h) {
            if (!h) {
                h = this.position
            }
            var c = f == "absolute" ? 1 : -1;
            var e = this.options,
                b = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                g = (/(html|body)/i).test(b[0].tagName);
            return {
                top: (h.top + this.offset.relative.top * c + this.offset.parent.top * c - (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : (g ? 0 : b.scrollTop())) * c)),
                left: (h.left + this.offset.relative.left * c + this.offset.parent.left * c - (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : g ? 0 : b.scrollLeft()) * c))
            }
        },
        _generatePosition: function (e) {
            var h = this.options,
                b = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                i = (/(html|body)/i).test(b[0].tagName);
            if (this.cssPosition == "relative" && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
                this.offset.relative = this._getRelativeOffset()
            }
            var d = e.pageX;
            var c = e.pageY;
            if (this.originalPosition) {
                if (this.containment) {
                    if (e.pageX - this.offset.click.left < this.containment[0]) {
                        d = this.containment[0] + this.offset.click.left
                    }
                    if (e.pageY - this.offset.click.top < this.containment[1]) {
                        c = this.containment[1] + this.offset.click.top
                    }
                    if (e.pageX - this.offset.click.left > this.containment[2]) {
                        d = this.containment[2] + this.offset.click.left
                    }
                    if (e.pageY - this.offset.click.top > this.containment[3]) {
                        c = this.containment[3] + this.offset.click.top
                    }
                }
                if (h.grid) {
                    var g = this.originalPageY + Math.round((c - this.originalPageY) / h.grid[1]) * h.grid[1];
                    c = this.containment ? (!(g - this.offset.click.top < this.containment[1] || g - this.offset.click.top > this.containment[3]) ? g : (!(g - this.offset.click.top < this.containment[1]) ? g - h.grid[1] : g + h.grid[1])) : g;
                    var f = this.originalPageX + Math.round((d - this.originalPageX) / h.grid[0]) * h.grid[0];
                    d = this.containment ? (!(f - this.offset.click.left < this.containment[0] || f - this.offset.click.left > this.containment[2]) ? f : (!(f - this.offset.click.left < this.containment[0]) ? f - h.grid[0] : f + h.grid[0])) : f
                }
            }
            return {
                top: (c - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : (i ? 0 : b.scrollTop())))),
                left: (d - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : i ? 0 : b.scrollLeft())))
            }
        },
        _clear: function () {
            this.helper.removeClass("ui-draggable-dragging");
            if (this.helper[0] != this.element[0] && !this.cancelHelperRemoval) {
                this.helper.remove()
            }
            this.helper = null;
            this.cancelHelperRemoval = false
        },
        _trigger: function (b, c, d) {
            d = d || this._uiHash();
            a.ui.plugin.call(this, b, [c, d]);
            if (b == "drag") {
                this.positionAbs = this._convertPositionTo("absolute")
            }
            return a.widget.prototype._trigger.call(this, b, c, d)
        },
        plugins: {},
        _uiHash: function (b) {
            return {
                helper: this.helper,
                position: this.position,
                absolutePosition: this.positionAbs,
                offset: this.positionAbs
            }
        }
    }));
    a.extend(a.ui.draggable, {
        version: "1.7.2",
        eventPrefix: "drag",
        defaults: {
            addClasses: true,
            appendTo: "parent",
            axis: false,
            cancel: ":input,option",
            connectToSortable: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            delay: 0,
            distance: 1,
            grid: false,
            handle: false,
            helper: "original",
            iframeFix: false,
            opacity: false,
            refreshPositions: false,
            revert: false,
            revertDuration: 500,
            scope: "default",
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: false,
            snapMode: "both",
            snapTolerance: 20,
            stack: false,
            zIndex: false
        }
    });
    a.ui.plugin.add("draggable", "connectToSortable", {
        start: function (c, e) {
            var d = a(this).data("draggable"),
                f = d.options,
                b = a.extend({}, e, {
                    item: d.element
                });
            d.sortables = [];
            a(f.connectToSortable).each(function () {
                var g = a.data(this, "sortable");
                if (g && !g.options.disabled) {
                    d.sortables.push({
                        instance: g,
                        shouldRevert: g.options.revert
                    });
                    g._refreshItems();
                    g._trigger("activate", c, b)
                }
            })
        },
        stop: function (c, e) {
            var d = a(this).data("draggable"),
                b = a.extend({}, e, {
                    item: d.element
                });
            a.each(d.sortables, function () {
                if (this.instance.isOver) {
                    this.instance.isOver = 0;
                    d.cancelHelperRemoval = true;
                    this.instance.cancelHelperRemoval = false;
                    if (this.shouldRevert) {
                        this.instance.options.revert = true
                    }
                    this.instance._mouseStop(c);
                    this.instance.options.helper = this.instance.options._helper;
                    if (d.options.helper == "original") {
                        this.instance.currentItem.css({
                            top: "auto",
                            left: "auto"
                        })
                    }
                } else {
                    this.instance.cancelHelperRemoval = false;
                    this.instance._trigger("deactivate", c, b)
                }
            })
        },
        drag: function (c, f) {
            var e = a(this).data("draggable"),
                b = this;
            var d = function (i) {
                var n = this.offset.click.top,
                    m = this.offset.click.left;
                var g = this.positionAbs.top,
                    k = this.positionAbs.left;
                var j = i.height,
                    l = i.width;
                var p = i.top,
                    h = i.left;
                return a.ui.isOver(g + n, k + m, p, h, j, l)
            };
            a.each(e.sortables, function (g) {
                this.instance.positionAbs = e.positionAbs;
                this.instance.helperProportions = e.helperProportions;
                this.instance.offset.click = e.offset.click;
                if (this.instance._intersectsWith(this.instance.containerCache)) {
                    if (!this.instance.isOver) {
                        this.instance.isOver = 1;
                        this.instance.currentItem = a(b).clone().appendTo(this.instance.element).data("sortable-item", true);
                        this.instance.options._helper = this.instance.options.helper;
                        this.instance.options.helper = function () {
                            return f.helper[0]
                        };
                        c.target = this.instance.currentItem[0];
                        this.instance._mouseCapture(c, true);
                        this.instance._mouseStart(c, true, true);
                        this.instance.offset.click.top = e.offset.click.top;
                        this.instance.offset.click.left = e.offset.click.left;
                        this.instance.offset.parent.left -= e.offset.parent.left - this.instance.offset.parent.left;
                        this.instance.offset.parent.top -= e.offset.parent.top - this.instance.offset.parent.top;
                        e._trigger("toSortable", c);
                        e.dropped = this.instance.element;
                        e.currentItem = e.element;
                        this.instance.fromOutside = e
                    }
                    if (this.instance.currentItem) {
                        this.instance._mouseDrag(c)
                    }
                } else {
                    if (this.instance.isOver) {
                        this.instance.isOver = 0;
                        this.instance.cancelHelperRemoval = true;
                        this.instance.options.revert = false;
                        this.instance._trigger("out", c, this.instance._uiHash(this.instance));
                        this.instance._mouseStop(c, true);
                        this.instance.options.helper = this.instance.options._helper;
                        this.instance.currentItem.remove();
                        if (this.instance.placeholder) {
                            this.instance.placeholder.remove()
                        }
                        e._trigger("fromSortable", c);
                        e.dropped = false
                    }
                }
            })
        }
    });
    a.ui.plugin.add("draggable", "cursor", {
        start: function (c, d) {
            var b = a("body"),
                e = a(this).data("draggable").options;
            if (b.css("cursor")) {
                e._cursor = b.css("cursor")
            }
            b.css("cursor", e.cursor)
        },
        stop: function (b, c) {
            var d = a(this).data("draggable").options;
            if (d._cursor) {
                a("body").css("cursor", d._cursor)
            }
        }
    });
    a.ui.plugin.add("draggable", "iframeFix", {
        start: function (b, c) {
            var d = a(this).data("draggable").options;
            a(d.iframeFix === true ? "iframe" : d.iframeFix).each(function () {
                a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
                    width: this.offsetWidth + "px",
                    height: this.offsetHeight + "px",
                    position: "absolute",
                    opacity: "0.001",
                    zIndex: 1000
                }).css(a(this).offset()).appendTo("body")
            })
        },
        stop: function (b, c) {
            a("div.ui-draggable-iframeFix").each(function () {
                this.parentNode.removeChild(this)
            })
        }
    });
    a.ui.plugin.add("draggable", "opacity", {
        start: function (c, d) {
            var b = a(d.helper),
                e = a(this).data("draggable").options;
            if (b.css("opacity")) {
                e._opacity = b.css("opacity")
            }
            b.css("opacity", e.opacity)
        },
        stop: function (b, c) {
            var d = a(this).data("draggable").options;
            if (d._opacity) {
                a(c.helper).css("opacity", d._opacity)
            }
        }
    });
    a.ui.plugin.add("draggable", "scroll", {
        start: function (c, d) {
            var b = a(this).data("draggable");
            if (b.scrollParent[0] != document && b.scrollParent[0].tagName != "HTML") {
                b.overflowOffset = b.scrollParent.offset()
            }
        },
        drag: function (d, e) {
            var c = a(this).data("draggable"),
                f = c.options,
                b = false;
            if (c.scrollParent[0] != document && c.scrollParent[0].tagName != "HTML") {
                if (!f.axis || f.axis != "x") {
                    if ((c.overflowOffset.top + c.scrollParent[0].offsetHeight) - d.pageY < f.scrollSensitivity) {
                        c.scrollParent[0].scrollTop = b = c.scrollParent[0].scrollTop + f.scrollSpeed
                    } else {
                        if (d.pageY - c.overflowOffset.top < f.scrollSensitivity) {
                            c.scrollParent[0].scrollTop = b = c.scrollParent[0].scrollTop - f.scrollSpeed
                        }
                    }
                }
                if (!f.axis || f.axis != "y") {
                    if ((c.overflowOffset.left + c.scrollParent[0].offsetWidth) - d.pageX < f.scrollSensitivity) {
                        c.scrollParent[0].scrollLeft = b = c.scrollParent[0].scrollLeft + f.scrollSpeed
                    } else {
                        if (d.pageX - c.overflowOffset.left < f.scrollSensitivity) {
                            c.scrollParent[0].scrollLeft = b = c.scrollParent[0].scrollLeft - f.scrollSpeed
                        }
                    }
                }
            } else {
                if (!f.axis || f.axis != "x") {
                    if (d.pageY - a(document).scrollTop() < f.scrollSensitivity) {
                        b = a(document).scrollTop(a(document).scrollTop() - f.scrollSpeed)
                    } else {
                        if (a(window).height() - (d.pageY - a(document).scrollTop()) < f.scrollSensitivity) {
                            b = a(document).scrollTop(a(document).scrollTop() + f.scrollSpeed)
                        }
                    }
                }
                if (!f.axis || f.axis != "y") {
                    if (d.pageX - a(document).scrollLeft() < f.scrollSensitivity) {
                        b = a(document).scrollLeft(a(document).scrollLeft() - f.scrollSpeed)
                    } else {
                        if (a(window).width() - (d.pageX - a(document).scrollLeft()) < f.scrollSensitivity) {
                            b = a(document).scrollLeft(a(document).scrollLeft() + f.scrollSpeed)
                        }
                    }
                }
            } if (b !== false && a.ui.ddmanager && !f.dropBehaviour) {
                a.ui.ddmanager.prepareOffsets(c, d)
            }
        }
    });
    a.ui.plugin.add("draggable", "snap", {
        start: function (c, d) {
            var b = a(this).data("draggable"),
                e = b.options;
            b.snapElements = [];
            a(e.snap.constructor != String ? (e.snap.items || ":data(draggable)") : e.snap).each(function () {
                var g = a(this);
                var f = g.offset();
                if (this != b.element[0]) {
                    b.snapElements.push({
                        item: this,
                        width: g.outerWidth(),
                        height: g.outerHeight(),
                        top: f.top,
                        left: f.left
                    })
                }
            })
        },
        drag: function (u, p) {
            var g = a(this).data("draggable"),
                q = g.options;
            var y = q.snapTolerance;
            var x = p.offset.left,
                w = x + g.helperProportions.width,
                f = p.offset.top,
                e = f + g.helperProportions.height;
            for (var v = g.snapElements.length - 1; v >= 0; v--) {
                var s = g.snapElements[v].left,
                    n = s + g.snapElements[v].width,
                    m = g.snapElements[v].top,
                    A = m + g.snapElements[v].height;
                if (!((s - y < x && x < n + y && m - y < f && f < A + y) || (s - y < x && x < n + y && m - y < e && e < A + y) || (s - y < w && w < n + y && m - y < f && f < A + y) || (s - y < w && w < n + y && m - y < e && e < A + y))) {
                    if (g.snapElements[v].snapping) {
                        (g.options.snap.release && g.options.snap.release.call(g.element, u, a.extend(g._uiHash(), {
                            snapItem: g.snapElements[v].item
                        })))
                    }
                    g.snapElements[v].snapping = false;
                    continue
                }
                if (q.snapMode != "inner") {
                    var c = Math.abs(m - e) <= y;
                    var z = Math.abs(A - f) <= y;
                    var j = Math.abs(s - w) <= y;
                    var k = Math.abs(n - x) <= y;
                    if (c) {
                        p.position.top = g._convertPositionTo("relative", {
                            top: m - g.helperProportions.height,
                            left: 0
                        }).top - g.margins.top
                    }
                    if (z) {
                        p.position.top = g._convertPositionTo("relative", {
                            top: A,
                            left: 0
                        }).top - g.margins.top
                    }
                    if (j) {
                        p.position.left = g._convertPositionTo("relative", {
                            top: 0,
                            left: s - g.helperProportions.width
                        }).left - g.margins.left
                    }
                    if (k) {
                        p.position.left = g._convertPositionTo("relative", {
                            top: 0,
                            left: n
                        }).left - g.margins.left
                    }
                }
                var h = (c || z || j || k);
                if (q.snapMode != "outer") {
                    var c = Math.abs(m - f) <= y;
                    var z = Math.abs(A - e) <= y;
                    var j = Math.abs(s - x) <= y;
                    var k = Math.abs(n - w) <= y;
                    if (c) {
                        p.position.top = g._convertPositionTo("relative", {
                            top: m,
                            left: 0
                        }).top - g.margins.top
                    }
                    if (z) {
                        p.position.top = g._convertPositionTo("relative", {
                            top: A - g.helperProportions.height,
                            left: 0
                        }).top - g.margins.top
                    }
                    if (j) {
                        p.position.left = g._convertPositionTo("relative", {
                            top: 0,
                            left: s
                        }).left - g.margins.left
                    }
                    if (k) {
                        p.position.left = g._convertPositionTo("relative", {
                            top: 0,
                            left: n - g.helperProportions.width
                        }).left - g.margins.left
                    }
                }
                if (!g.snapElements[v].snapping && (c || z || j || k || h)) {
                    (g.options.snap.snap && g.options.snap.snap.call(g.element, u, a.extend(g._uiHash(), {
                        snapItem: g.snapElements[v].item
                    })))
                }
                g.snapElements[v].snapping = (c || z || j || k || h)
            }
        }
    });
    a.ui.plugin.add("draggable", "stack", {
        start: function (b, c) {
            var e = a(this).data("draggable").options;
            var d = a.makeArray(a(e.stack.group)).sort(function (g, f) {
                return (parseInt(a(g).css("zIndex"), 10) || e.stack.min) - (parseInt(a(f).css("zIndex"), 10) || e.stack.min)
            });
            a(d).each(function (f) {
                this.style.zIndex = e.stack.min + f
            });
            this[0].style.zIndex = e.stack.min + d.length
        }
    });
    a.ui.plugin.add("draggable", "zIndex", {
        start: function (c, d) {
            var b = a(d.helper),
                e = a(this).data("draggable").options;
            if (b.css("zIndex")) {
                e._zIndex = b.css("zIndex")
            }
            b.css("zIndex", e.zIndex)
        },
        stop: function (b, c) {
            var d = a(this).data("draggable").options;
            if (d._zIndex) {
                a(c.helper).css("zIndex", d._zIndex)
            }
        }
    })
})(jQuery);;
(function (a) {
    a.widget("ui.slider", a.extend({}, a.ui.mouse, {
        _init: function () {
            var b = this,
                c = this.options;
            this._keySliding = false;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all");
            this.range = a([]);
            if (c.range) {
                if (c.range === true) {
                    this.range = a("<div></div>");
                    if (!c.values) {
                        c.values = [this._valueMin(), this._valueMin()]
                    }
                    if (c.values.length && c.values.length != 2) {
                        c.values = [c.values[0], c.values[0]]
                    }
                } else {
                    this.range = a("<div></div>")
                }
                this.range.appendTo(this.element).addClass("ui-slider-range");
                if (c.range == "min" || c.range == "max") {
                    this.range.addClass("ui-slider-range-" + c.range)
                }
                this.range.addClass("ui-widget-header")
            }
            if (a(".ui-slider-handle", this.element).length == 0) {
                a('<a href="#"></a>').appendTo(this.element).addClass("ui-slider-handle")
            }
            if (c.values && c.values.length) {
                while (a(".ui-slider-handle", this.element).length < c.values.length) {
                    a('<a href="#"></a>').appendTo(this.element).addClass("ui-slider-handle")
                }
            }
            this.handles = a(".ui-slider-handle", this.element).addClass("ui-state-default ui-corner-all");
            this.handle = this.handles.eq(0);
            this.handles.add(this.range).filter("a").click(function (d) {
                d.preventDefault()
            }).hover(function () {
                    if (!c.disabled) {
                        a(this).addClass("ui-state-hover")
                    }
                }, function () {
                    a(this).removeClass("ui-state-hover")
                }).focus(function () {
                    if (!c.disabled) {
                        a(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
                        a(this).addClass("ui-state-focus")
                    } else {
                        a(this).blur()
                    }
                }).blur(function () {
                    a(this).removeClass("ui-state-focus")
                });
            this.handles.each(function (d) {
                a(this).data("index.ui-slider-handle", d)
            });
            this.handles.keydown(function (i) {
                var f = true;
                var e = a(this).data("index.ui-slider-handle");
                if (b.options.disabled) {
                    return
                }
                switch (i.keyCode) {
                    case a.ui.keyCode.HOME:
                    case a.ui.keyCode.END:
                    case a.ui.keyCode.UP:
                    case a.ui.keyCode.RIGHT:
                    case a.ui.keyCode.DOWN:
                    case a.ui.keyCode.LEFT:
                        f = false;
                        if (!b._keySliding) {
                            b._keySliding = true;
                            a(this).addClass("ui-state-active");
                            b._start(i, e)
                        }
                        break
                }
                var g, d, h = b._step();
                if (b.options.values && b.options.values.length) {
                    g = d = b.values(e)
                } else {
                    g = d = b.value()
                }
                switch (i.keyCode) {
                    case a.ui.keyCode.HOME:
                        d = b._valueMin();
                        break;
                    case a.ui.keyCode.END:
                        d = b._valueMax();
                        break;
                    case a.ui.keyCode.UP:
                    case a.ui.keyCode.RIGHT:
                        if (g == b._valueMax()) {
                            return
                        }
                        d = g + h;
                        break;
                    case a.ui.keyCode.DOWN:
                    case a.ui.keyCode.LEFT:
                        if (g == b._valueMin()) {
                            return
                        }
                        d = g - h;
                        break
                }
                b._slide(i, e, d);
                return f
            }).keyup(function (e) {
                    var d = a(this).data("index.ui-slider-handle");
                    if (b._keySliding) {
                        b._stop(e, d);
                        b._change(e, d);
                        b._keySliding = false;
                        a(this).removeClass("ui-state-active")
                    }
                });
            this._refreshValue()
        },
        destroy: function () {
            this.handles.remove();
            this.range.remove();
            this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
            this._mouseDestroy()
        },
        _mouseCapture: function (d) {
            var e = this.options;
            if (e.disabled) {
                return false
            }
            this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
            this.elementOffset = this.element.offset();
            var h = {
                x: d.pageX,
                y: d.pageY
            };
            var j = this._normValueFromMouse(h);
            var c = this._valueMax() - this._valueMin() + 1,
                f;
            var k = this,
                i;
            this.handles.each(function (l) {
                var m = Math.abs(j - k.values(l));
                if (c > m) {
                    c = m;
                    f = a(this);
                    i = l
                }
            });
            if (e.range == true && this.values(1) == e.min) {
                f = a(this.handles[++i])
            }
            this._start(d, i);
            k._handleIndex = i;
            f.addClass("ui-state-active").focus();
            var g = f.offset();
            var b = !a(d.target).parents().addBack().is(".ui-slider-handle");
            this._clickOffset = b ? {
                left: 0,
                top: 0
            } : {
                left: d.pageX - g.left - (f.width() / 2),
                top: d.pageY - g.top - (f.height() / 2) - (parseInt(f.css("borderTopWidth"), 10) || 0) - (parseInt(f.css("borderBottomWidth"), 10) || 0) + (parseInt(f.css("marginTop"), 10) || 0)
            };
            j = this._normValueFromMouse(h);
            this._slide(d, i, j);
            return true
        },
        _mouseStart: function (b) {
            return true
        },
        _mouseDrag: function (d) {
            var b = {
                x: d.pageX,
                y: d.pageY
            };
            var c = this._normValueFromMouse(b);
            this._slide(d, this._handleIndex, c);
            return false
        },
        _mouseStop: function (b) {
            this.handles.removeClass("ui-state-active");
            this._stop(b, this._handleIndex);
            this._change(b, this._handleIndex);
            this._handleIndex = null;
            this._clickOffset = null;
            return false
        },
        _detectOrientation: function () {
            this.orientation = this.options.orientation == "vertical" ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function (d) {
            var c, h;
            if ("horizontal" == this.orientation) {
                c = this.elementSize.width;
                h = d.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)
            } else {
                c = this.elementSize.height;
                h = d.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)
            }
            var f = (h / c);
            if (f > 1) {
                f = 1
            }
            if (f < 0) {
                f = 0
            }
            if ("vertical" == this.orientation) {
                f = 1 - f
            }
            var e = this._valueMax() - this._valueMin(),
                i = f * e,
                b = i % this.options.step,
                g = this._valueMin() + i - b;
            if (b > (this.options.step / 2)) {
                g += this.options.step
            }
            return parseFloat(g.toFixed(5))
        },
        _start: function (d, c) {
            var b = {
                handle: this.handles[c],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                b.value = this.values(c);
                b.values = this.values()
            }
            this._trigger("start", d, b)
        },
        _slide: function (f, e, d) {
            var g = this.handles[e];
            if (this.options.values && this.options.values.length) {
                var b = this.values(e ? 0 : 1);
                if ((this.options.values.length == 2 && this.options.range === true) && ((e == 0 && d > b) || (e == 1 && d < b))) {
                    d = b
                }
                if (d != this.values(e)) {
                    var c = this.values();
                    c[e] = d;
                    var h = this._trigger("slide", f, {
                        handle: this.handles[e],
                        value: d,
                        values: c
                    });
                    var b = this.values(e ? 0 : 1);
                    if (h !== false) {
                        this.values(e, d, (f.type == "mousedown" && this.options.animate), true)
                    }
                }
            } else {
                if (d != this.value()) {
                    var h = this._trigger("slide", f, {
                        handle: this.handles[e],
                        value: d
                    });
                    if (h !== false) {
                        this._setData("value", d, (f.type == "mousedown" && this.options.animate))
                    }
                }
            }
        },
        _stop: function (d, c) {
            var b = {
                handle: this.handles[c],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                b.value = this.values(c);
                b.values = this.values()
            }
            this._trigger("stop", d, b)
        },
        _change: function (d, c) {
            var b = {
                handle: this.handles[c],
                value: this.value()
            };
            if (this.options.values && this.options.values.length) {
                b.value = this.values(c);
                b.values = this.values()
            }
            this._trigger("change", d, b)
        },
        value: function (b) {
            if (arguments.length) {
                this._setData("value", b);
                this._change(null, 0)
            }
            return this._value()
        },
        values: function (b, e, c, d) {
            if (arguments.length > 1) {
                this.options.values[b] = e;
                this._refreshValue(c);
                if (!d) {
                    this._change(null, b)
                }
            }
            if (arguments.length) {
                if (this.options.values && this.options.values.length) {
                    return this._values(b)
                } else {
                    return this.value()
                }
            } else {
                return this._values()
            }
        },
        _setData: function (b, d, c) {
            a.widget.prototype._setData.apply(this, arguments);
            switch (b) {
                case "disabled":
                    if (d) {
                        this.handles.filter(".ui-state-focus").blur();
                        this.handles.removeClass("ui-state-hover");
                        this.handles.attr("disabled", "disabled")
                    } else {
                        this.handles.removeAttr("disabled")
                    }
                case "orientation":
                    this._detectOrientation();
                    this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                    this._refreshValue(c);
                    break;
                case "value":
                    this._refreshValue(c);
                    break
            }
        },
        _step: function () {
            var b = this.options.step;
            return b
        },
        _value: function () {
            var b = this.options.value;
            if (b < this._valueMin()) {
                b = this._valueMin()
            }
            if (b > this._valueMax()) {
                b = this._valueMax()
            }
            return b
        },
        _values: function (b) {
            if (arguments.length) {
                var c = this.options.values[b];
                if (c < this._valueMin()) {
                    c = this._valueMin()
                }
                if (c > this._valueMax()) {
                    c = this._valueMax()
                }
                return c
            } else {
                return this.options.values
            }
        },
        _valueMin: function () {
            var b = this.options.min;
            return b
        },
        _valueMax: function () {
            var b = this.options.max;
            return b
        },
        _refreshValue: function (c) {
            var f = this.options.range,
                d = this.options,
                l = this;
            if (this.options.values && this.options.values.length) {
                var i, h;
                this.handles.each(function (p, n) {
                    var o = (l.values(p) - l._valueMin()) / (l._valueMax() - l._valueMin()) * 100;
                    var m = {};
                    m[l.orientation == "horizontal" ? "left" : "bottom"] = o + "%";
                    a(this).stop(1, 1)[c ? "animate" : "css"](m, d.animate);
                    if (l.options.range === true) {
                        if (l.orientation == "horizontal") {
                            (p == 0) && l.range.stop(1, 1)[c ? "animate" : "css"]({
                                left: o + "%"
                            }, d.animate);
                            (p == 1) && l.range[c ? "animate" : "css"]({
                                width: (o - lastValPercent) + "%"
                            }, {
                                queue: false,
                                duration: d.animate
                            })
                        } else {
                            (p == 0) && l.range.stop(1, 1)[c ? "animate" : "css"]({
                                bottom: (o) + "%"
                            }, d.animate);
                            (p == 1) && l.range[c ? "animate" : "css"]({
                                height: (o - lastValPercent) + "%"
                            }, {
                                queue: false,
                                duration: d.animate
                            })
                        }
                    }
                    lastValPercent = o
                })
            } else {
                var j = this.value(),
                    g = this._valueMin(),
                    k = this._valueMax(),
                    e = k != g ? (j - g) / (k - g) * 100 : 0;
                var b = {};
                b[l.orientation == "horizontal" ? "left" : "bottom"] = e + "%";
                this.handle.stop(1, 1)[c ? "animate" : "css"](b, d.animate);
                (f == "min") && (this.orientation == "horizontal") && this.range.stop(1, 1)[c ? "animate" : "css"]({
                    width: e + "%"
                }, d.animate);
                (f == "max") && (this.orientation == "horizontal") && this.range[c ? "animate" : "css"]({
                    width: (100 - e) + "%"
                }, {
                    queue: false,
                    duration: d.animate
                });
                (f == "min") && (this.orientation == "vertical") && this.range.stop(1, 1)[c ? "animate" : "css"]({
                    height: e + "%"
                }, d.animate);
                (f == "max") && (this.orientation == "vertical") && this.range[c ? "animate" : "css"]({
                    height: (100 - e) + "%"
                }, {
                    queue: false,
                    duration: d.animate
                })
            }
        }
    }));
    a.extend(a.ui.slider, {
        getter: "value values",
        version: "1.7.2",
        eventPrefix: "slide",
        defaults: {
            animate: false,
            delay: 0,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: false,
            step: 1,
            value: 0,
            values: null
        }
    })
})(jQuery);;;
jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};;
var XPrecise = {
    init: function () {
        XPrecise.interfaceAppend();
        XPrecise.overlayChange();
        XPrecise.overlayToggle();
        XPrecise.overlayDrag();
        XPrecise.overlayPosition();
        XPrecise.overlayOpacity();
        XPrecise.pageOpacity();
        XPrecise.overlayFineTuning();
        XPrecise.overUnderToggle();
        XPrecise.interfaceDrag();
        XPrecise.interfaceToggle();
    },
    overlayChange: function () {
        jQuery("#xprecise-image").bind('change', function () {
            jQuery("#xprecise-overlay img").attr('src', jQuery(this).val());
            XPrecise.saveSettings();
        });
    },
    overlayToggle: function () {
        var link = jQuery("#xprecise a.xprecise-toggle");
        var overlay = jQuery("#xprecise-overlay");
        link.bind('click', function () {
            if (link.text() === "On") {
                link.text("Off");
                link.addClass('xprecise-off');
            } else {
                link.text("On");
                link.removeClass('xprecise-off');
            }
            overlay.toggle();
            XPrecise.saveSettings();
            return false;
        });
        if (link.text() === "Off") {
            overlay.hide();
            link.addClass('xprecise-off');
        }
    },
    overlayDrag: function () {
        jQuery("#xprecise-overlay").draggable({
            drag: function (event, ui) {
                jQuery("#xprecise-top").val(ui.position.top);
                jQuery("#xprecise-left").val(ui.position.left);
            },
            stop: function (event, ui) {
                XPrecise.saveSettings();
            }
        });
    },
    overlayPosition: function () {
        var overlay = jQuery("#xprecise-overlay");
        var top_field = jQuery("#xprecise-top")
        var left_field = jQuery("#xprecise-left")
        top_field.bind('change', function () {
            overlay.css('top', jQuery(this).val() + 'px');
            XPrecise.saveSettings();
        });
        left_field.bind('change', function () {
            overlay.css('left', jQuery(this).val() + 'px');
            XPrecise.saveSettings();
        });
        overlay.css('top', top_field.val() + 'px');
        overlay.css('left', left_field.val() + 'px');
    },
    overlayFineTuning: function () {
        var overlay = jQuery("#xprecise-overlay");
        var top_field = jQuery("#xprecise-top")
        var left_field = jQuery("#xprecise-left")
        var top, left;
        overlay.hover(function () {
            jQuery(document).unbind('keypress.xprecise');
            jQuery(document).bind('keydown.xprecise', function (e) {
                switch (e.keyCode) {
                    case 87:
                        setTop('up');
                        break;
                    case 83:
                        setTop('down');
                        break;
                    case 65:
                        setLeft('left');
                        break;
                    case 68:
                        setLeft('right');
                        break;
                }
            });
        }, function () {
            jQuery(document).unbind('keydown.xprecise');
        });

        function setTop(direction) {
            var top = top_field.val() * 1 - 1;
            if (direction === 'down') {
                top = top_field.val() * 1 + 1;
            }
            top_field.val(top);
            overlay.css('top', top + 'px');
            XPrecise.saveSettings();
        }

        function setLeft(direction) {
            var left = left_field.val() * 1 - 1;
            if (direction === 'right') {
                left = left_field.val() * 1 + 1;
            }
            left_field.val(left);
            overlay.css('left', left + 'px');
            XPrecise.saveSettings();
        }
    },
    overlayOpacity: function () {
        var overlay = jQuery("#xprecise-overlay");
        var overlay_value = jQuery("#xprecise-opacity-value");
        var overlay_opacity = overlay_value.text() * 1;
        overlay.css('opacity', overlay_opacity / 100);
        jQuery("#xprecise-opacity").slider({
            value: overlay_opacity,
            slide: function (event, ui) {
                overlay_value.text(ui.value);
                overlay.css('opacity', ui.value / 100)
            },
            stop: function (event, ui) {
                XPrecise.saveSettings();
            }
        });
    },
    pageOpacity: function () {
        var page = jQuery("#xprecise-wrapper");
        var page_value = jQuery("#xprecise-page-opacity-value");
        var page_opacity = page_value.text() * 1;
        page.ClearTypeFadeTo({
            speed: 1,
            opacity: page_opacity / 100,
            bgColor: 'transparent'
        })
        jQuery("#xprecise-page-opacity").slider({
            value: page_opacity,
            slide: function (event, ui) {
                page_value.text(ui.value);
                page.ClearTypeFadeTo({
                    speed: 1,
                    opacity: ui.value / 100,
                    bgColor: 'transparent'
                })
            },
            stop: function (event, ui) {
                XPrecise.saveSettings();
            }
        });
    },
    overUnderToggle: function () {
        var overlay = jQuery("#xprecise-overlay");
        jQuery("#xprecise-over").bind('click', function () {
            overlay.css("z-index", 10000);
            XPrecise.saveSettings();
        });
        jQuery("#xprecise-under").bind('click', function () {
            overlay.css("z-index", 1000);
            XPrecise.saveSettings();
        });
        if (jQuery("#xprecise-over").is(":checked")) {
            overlay.css("z-index", 10000);
        } else {
            overlay.css("z-index", 1000);
        }
    },
    interfaceDrag: function () {
        jQuery("#xprecise").draggable({
            handle: 'h2',
            stop: function (event, ui) {
                XPrecise.saveSettings();
            }
        });
    },
    interfaceToggle: function () {
        var form = jQuery("#xprecise form");
        var link = jQuery("#xprecise a.xprecise-close");
        link.bind('click', function () {
            var link = jQuery(this);
            form.toggle();
            if (link.text() === "-") {
                link.text("+");
                link.addClass('xprecise-closed');
            } else {
                link.text("-");
                link.removeClass('xprecise-closed');
            }
            XPrecise.saveSettings();
            return false;
        });
        if (link.text() === "+") {
            form.hide();
            link.addClass('xprecise-closed');
        }
    },
    getImageFromURL: function () {
        var image_name = '';
        var url_parts = location.pathname.split('/');
        url_parts.reverse();
        if (url_parts[0] !== '') {
            image_name = '_xprecise/' + url_parts[0].replace(/.html/, '.jpg');
        } else {
            image_name = '_xprecise/index.jpg';
        }
        return image_name;
    },
    saveSettings: function () {
        var delimiter = '|';
        var interface_toggle, overlay_toggle, over_under;
        if (jQuery("#xprecise a.xprecise-close").text() === "-") {
            interface_toggle = '-';
        } else {
            interface_toggle = '+';
        }
        if (jQuery("#xprecise a.xprecise-toggle").text() === "On") {
            overlay_toggle = 'On';
        } else {
            overlay_toggle = 'Off';
        }
        var interface_position = jQuery("#xprecise").position();
        if (jQuery("#xprecise-over").is(":checked")) {
            over_under = 'over';
        } else {
            over_under = 'under';
        }
        var xprecise_settings = interface_toggle + delimiter +
            interface_position.top + delimiter +
            interface_position.left + delimiter +
            overlay_toggle + delimiter +
            jQuery("#xprecise-image").val() + delimiter +
            jQuery("#xprecise-top").val() + delimiter +
            jQuery("#xprecise-left").val() + delimiter +
            jQuery("#xprecise-opacity-value").text() + delimiter +
            jQuery("#xprecise-page-opacity-value").text() + delimiter +
            over_under;
        var cookie_info = XPrecise.getCookieInfo();
        jQuery.cookie(cookie_info['cookie_name'], xprecise_settings, {
            path: cookie_info['cookie_path'],
            expires: 365
        });
    },
    getCookieInfo: function () {
        var cookie_info = [];
        var path_parts = location.pathname.split('/');
        var file_name = path_parts.pop();
        cookie_info['cookie_path'] = path_parts.join('/') + '/';
        cookie_info['cookie_name'] = '_xprecise_' + file_name;
        return cookie_info;
    },
    loadSettings: function () {
        var settings = [];
        var cookie_info = XPrecise.getCookieInfo();
        if (jQuery.cookie(cookie_info['cookie_name'])) {
            var xprecise_settings = jQuery.cookie(cookie_info['cookie_name']).split('|')
            settings['interface'] = xprecise_settings[0];
            settings['interface_top'] = xprecise_settings[1];
            settings['interface_left'] = xprecise_settings[2];
            settings['overlay'] = xprecise_settings[3];
            settings['image'] = xprecise_settings[4];
            settings['overlay_top'] = xprecise_settings[5];
            settings['overlay_left'] = xprecise_settings[6];
            settings['overlay_opacity'] = xprecise_settings[7];
            settings['page_opacity'] = xprecise_settings[8];
            settings['over_under'] = xprecise_settings[9];
        } else {
            settings['interface'] = '-';
            settings['interface_top'] = 20;
            settings['interface_left'] = 20;
            settings['overlay'] = 'On';
            settings['image'] = XPrecise.getImageFromURL();
            settings['overlay_top'] = 0;
            settings['overlay_left'] = 0;
            settings['overlay_opacity'] = 50;
            settings['page_opacity'] = 100;
            settings['over_under'] = 'over';
        }
        return settings;
    },
    interfaceAppend: function () {
        var settings = this.loadSettings();
        var over_checked, under_checked;
        if (settings['over_under'] === 'over') {
            over_checked = ' checked="checked" ';
            under_checked = '';
        } else {
            under_checked = ' checked="checked" ';
            over_checked = '';
        }
        var body = jQuery('body');
        jQuery('head').append('<link rel="stylesheet" type="text/css" media="all" href="_xprecise/xprecise.css" />');
        body.wrapInner('<div id="xprecise-wrapper"></div>');
        body.append('<div id="xprecise-overlay"><img src="' + settings['image'] + '" alt="X-Precise Overlay" /></div>');
        body.append('<div id="xprecise"> <div id="xprecise-inner"> <h2><img src="_xprecise/images/logo.png" alt="X-Precise" width="80" height="17" /> <span class="ie6">X-Precise</span> <a href="#" class="xprecise-close">' + settings['interface'] + '</a></h2> <form action="#"> <ol> <li class="first"> <h3><label for="xprecise-image">Design</label> <a href="#" class="xprecise-toggle">' + settings['overlay'] + '</a></h3> <p><input type="text" value="' + settings['image'] + '" id="xprecise-image" /></p> </li> <li class="xprecise-over-under"> <input type="radio" name="xprecise-over-under" id="xprecise-over" ' + over_checked + '/> <label for="xprecise-over">over</label> <input type="radio" name="xprecise-over-under" id="xprecise-under"' + under_checked + '/> <label for="xprecise-under">under</label> </li> <li class="xprecise-position"> <h3>Position</h3> <p> <label for="xprecise-top">top</label> <input type="text" value="' + settings['overlay_top'] + '" id="xprecise-top" /> <label for="xprecise-left">left</label> <input type="text" value="' + settings['overlay_left'] + '" id="xprecise-left" /> </p> </li> <li> <h3> Design opacity <span id="xprecise-opacity-value">' + settings['overlay_opacity'] + '</span><span>%</span> </h3> <div id="xprecise-opacity"></div> </li> <li> <h3> Page opacity <span id="xprecise-page-opacity-value">' + settings['page_opacity'] + '</span><span>%</span> </h3> <div id="xprecise-page-opacity"></div> </li> </ol> </form> </div> <div id="xprecise-bottom"></div></div>');
        jQuery("#xprecise, #xprecise-overlay").css('position', 'absolute');
        jQuery("#xprecise").css('top', settings['interface_top'] + 'px');
        jQuery("#xprecise").css('left', settings['interface_left'] + 'px');
    }
};
(function ($) {
    $.fn.ClearTypeFadeTo = function (options) {
        if (options)
            $(this).show().each(function () {
                if (jQuery.browser.msie) {
                    $(this).attr('oBgColor', $(this).css('background-color'));
                    $(this).css({
                        'background-color': (options.bgColor ? options.bgColor : '#fff')
                    })
                }
            }).fadeTo(options.speed, options.opacity, function () {
                    if (jQuery.browser.msie) {
                        if (options.opacity == 0 || options.opacity == 1) {
                            $(this).css({
                                'background-color': $(this).attr('oBgColor')
                            }).removeAttr('oBgColor');
                            $(this).get(0).style.removeAttribute('filter');
                        }
                    }
                    if (options.callback != undefined) options.callback();
                });
    };
    $.fn.ClearTypeFadeIn = function (options) {
        if (options)
            $(this).css({
                opacity: 0
            }).ClearTypeFadeTo({
                    speed: options.speed,
                    opacity: 1,
                    callback: options.callback
                });
    };
    $.fn.ClearTypeFadeOut = function (options) {
        if (options)
            $(this).css({
                opacity: 1
            }).ClearTypeFadeTo({
                    speed: options.speed,
                    opacity: 0,
                    callback: options.callback
                });
    };
})(jQuery);
jQuery(document).ready(function () {
    XPrecise.init();
});