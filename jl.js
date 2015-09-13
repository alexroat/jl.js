//fix indexof
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function (elt /*, from*/)
    {
        var len = this.length;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++)
        {
            if (from in this &&
                    this[from] === elt)
                return from;
        }
        return -1;
    };
}
//jl core function
jl = function (e, layout)
{
    //default: usa il body
    if (!e)
        e = document.body;
    //se è impostato il layout lo applica
    if (layout)
        jl.setLayout(e, layout);
    //read layout
    var ll = jl.getLayout(e);
    if (jl.fn[ll.sz])
    {
        jl.setStyle(e, {"overflow": "auto"});
        jl.fn[ll.sz](e);
    }


    //children process
    var cc = jl.children(e);
    for (var i = 0; i < cc.length; i++)
    {
        if (jl.getStyle(cc[i]).display !== "none")
            jl(cc[i]);
    }
};
//schedule boot of jl
jl.boot = function ()
{
    window.onload = function ()
    {
        jl();
    };
};
//if <0 set to 0
jl.clip = function (x)
{
    return x >= 0 ? x : 0;
};
//set the text
jl.setText = function (e, txt)
{
    if (e.textContent !== undefined)
        e.textContent = txt;
    else
        e.innerText = txt;
}
//create a new element with defined attributes
jl.create = function (tag, attr) {
    var e = document.createElement(tag);
    for (var k in attr)
        e.setAttribute(k, attr[k]);
    return e;
};
//standard MAP function : return list with the result of f() called on each element of s
jl.map = function (f, s) {
    r = [];
    for (var i = 0; i < s.length; i++)
        r.push(f(s[i]));
    return r;
};
//read and parse layout attribute as an object
jl.readLayout = function (e) {
    try {
        return eval("[{" + (e.getAttribute("data-layout") || e.getAttribute("layout") || "") + "}]")[0];
    } catch (ex) {
        return {};
    }
};
//get layout object, if not cached read it from attribute and then cache it
jl.getLayout = function (e) {
    if (e._jl === undefined)
        e._jl = jl.readLayout(e);
    return e._jl;
};
//set layout object, it does not touch the attribute
jl.setLayout = function (e, ll) {
    var r = JSON.stringify(ll);
    e.setAttribute("layout", r.substr(1, r.length - 2));
};
//read the current css styles
jl.getStyle = function (e) {
    if (e)
        return e.currentStyle || window.getComputedStyle(e);
};
//set the attributes in the object style to the element style, preexisting attributes not in "style" will stay untouched
jl.setStyle = function (e, style) {
    for (var s in style)
        try
        {
            var v = style[s];
            v = isNaN(v)||s=="z-index"? v : v + "px";
            e.style[s] = v;
        }
        catch (ex) {
            console.log(ex);
        }
};
//set style in order to fit the parent
jl.setFillParent = function (e) {
    jl.setStyle(e, {position: "absolute", top: 0, bottom: 0, left: 0, right: 0});
};
//test if element has class cls
jl.hasClass = function (e, cls) {
    var cl = (e.className || "").split(' ');
    return (cl.indexOf(cls) >= 0);
};
jl.toggleClass = function (e, cls, b)
{
    var cl2 = (cls || "").split(' ');
    if (cl2.length !== 1)
        return jl.map(function (c) {
            jl.toggleClass(e, c, b);
        }, cl2);
    var cl = (e.className || "").split(' ');
    var hc = jl.hasClass(e, cls);
    var i;
    if (!hc && b)
        cl.push(cls);
    if (hc && !b)
        while ((i = cl.indexOf(cls)) >= 0)
            cl.splice(i);
    e.className = cl.join(' ');
};

//build recursively a dom node from JS object format
jl.build = function (obj)
{
    if (typeof obj === 'string' || obj instanceof String)
        return document.createTextNode(obj);
    var e = jl.create(obj.tag || "div", obj.attr || {});
    var cl = obj.children || [];
    for (var i = 0; i < cl.length; i++)
        e.appendChild(jl.build(cl[i]));
    return e;
}
//vonvert object to Layout string
jl.toLayout = function (obj)
{
    var r = JSON.stringify(obj);
    return r.substr(1, r.length - 2);
}

//bind event
jl.bindEvent = function (el, ev, fn) {
    var evl = ev.split(' ');
    for (var i = 0; i < evl.length; i++)
    {
        ev = evl[i];
        if (el.addEventListener) { // modern browsers including IE9+
            el.addEventListener(ev, fn, false);
        } else if (window.attachEvent) { // IE8 and below
            el.attachEvent('on' + ev, fn);
        } else {
            el['on' + ev] = fn;
        }
    }
};
//unbind event
jl.unbindEvent = function (el, ev, fn) {
    var evl = ev.split(' ');
    for (var i = 0; i < evl.length; i++)
    {
        ev = evl[i];
        if (el.removeEventListener) {
            el.removeEventListener(ev, fn, false);
        } else if (window.detachEvent) {
            el.detachEvent('on' + ev, fn);
        } else {
            elem['on' + ev] = null;
        }
    }
};
//stop event propagation
jl.stopEvent = function (ev) {
    var e = ev || window.event;
    e.cancelBubble = true;
    if (e.stopPropagation)
        e.stopPropagation();
};
//stop event propagation
jl.preventEvent = function (ev) {
    var e = ev || window.event;
    if (e.preventDefault)
        e.preventDefault();
};
//get the children elements of element
jl.children = function (e) {
    var r = [];
    for (var i = 0; i < e.children.length; i++)
        if (!jl.hasClass(e.children[i], "jlexclude"))
            r.push(e.children[i]);
    return r;
};

jl.delete = function (e)
{
    e.parentNode.removeChild(e);
    jl(e.parentNode);
}

//set the focus on the element
jl.focus = function (e)
{
    var old = jl.focused;
    jl.focused = e;
    jl(old);
    jl(e);
}

//get the current "sizes" of the element, in also compute the delta (padding+border+margin) and the tot ( plus delta)
jl.getSizes = function (e)
{
    var s = jl.getStyle(e);
    var r = {
        width: parseInt(e.clientWidth) || 0,
        height: parseInt(e.clientHeight) || 0,
        borderLeft: parseInt(s.borderLeftWidth) || 0,
        borderRight: parseInt(s.borderRightWidth) || 0,
        borderTop: parseInt(s.borderTopWidth) || 0,
        borderBottom: parseInt(s.borderBottomWidth) || 0,
        paddingLeft: parseInt(s.paddingLeft) || 0,
        paddingRight: parseInt(s.paddingRight) || 0,
        paddingTop: parseInt(s.paddingTop) || 0,
        paddingBottom: parseInt(s.paddingBottom) || 0,
        marginLeft: parseInt(s.marginLeft) || 0,
        marginRight: parseInt(s.marginRight) || 0,
        marginTop: parseInt(s.marginTop) || 0,
        marginBottom: parseInt(s.marginBottom) || 0
    };
    r.innerWidth = r.width - r.paddingLeft - r.paddingRight;
    r.innerHeight = r.height - r.paddingTop - r.paddingBottom;
    r.outerWidth = r.width + r.borderLeft + r.borderRight;
    r.outerHeight = r.height + r.borderTop + r.borderBottom;
    r.totWidth = r.outerWidth + r.marginLeft + r.marginRight;
    r.totHeight = r.outerHeight + r.marginTop + r.marginBottom;
    r.deltaWidth = r.totWidth - r.innerWidth;
    r.deltaHeight = r.totHeight - r.innerHeight;
    return r;
};
//set the size in pixels
jl.setSizes = function (e, r)
{
    ns = {};
    var ss = ["width", "height", "borderLeft", "borderRight", "borderTop", "borderBottom", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom"];
    for (var i = 0; i < ss.length; i++)
        if (r[ss[i]] !== undefined)
            ns[ss[i]] = r[ss[i]];
    if (r["position"])
        ns["position"] = r["position"];
    jl.setStyle(e, ns);
};



//object of sizers functions, could be extended in jquery plugin fashion
jl.fn = {};


//------------------
//layout functions
//------------------
//fullpage : all children fill page
jl.fn.fullpage = function (e) {
    jl.setStyle(e, {position: "fixed", top: 0, bottom: 0, left: 0, right: 0});
    var cc = jl.children(e);
    for (var i = 0; i < cc.length; i++)
        jl.setStyle(cc[i], {position: "absolute", top: 0, bottom: 0, left: 0, right: 0});
    if (!e._jlcfg)
    {
        e._jlcfg = {};
        /*window.addEventListener("resize", function() {
         jl(e);
         });*/
        jl.bindEvent(window, "resize", function () {
            jl(e);
        });
    }
};
//fullpage : all children fill page
jl.fn.dialog = function (e) {
    var ll = jl.getLayout(e);
    ll.x = ll.x || e.offsetLeft;
    ll.y = ll.y || e.offsetTop;
    ll.w = ll.w || 200;
    ll.h = ll.h || 200;
    var g = 4;//bordo
    jl.setStyle(e, {position: "fixed", top: ll.y , left: ll.x , width: jl.clip(ll.w) , height: jl.clip(ll.h) , background: "white", overflow: "auto", "border-radius": 5, "z-index": (jl.focused == e ? 10 : 1)});

    if (!e._jlcfg)
    {
        jl.toggleClass(e, "dialog", true);

        e._jlcfg = {};
        e._jlcfg.header = jl.create("div");
        e.appendChild(e._jlcfg.header);
        jl.toggleClass(e._jlcfg.header, "dialogheader jlexclude", true);
        jl.setText(e._jlcfg.header, ll.title || "dialog");
        jl.setStyle(e._jlcfg.header, {position: "absolute", top: 0, left: 0, right: 0});
        var cc = jl.children(e);
        var testb = function (evt) {
            var test = 0;
            var x = evt.pageX - e.offsetLeft;
            var y = evt.pageY - e.offsetTop;
            test |= (x < g);
            test |= (x - g > ll.w) << 1;
            test |= (y < g) << 2;
            test |= (y - g > ll.h) << 3;
            return test;
        };
        for (var i = 0; i < cc.length; i++)
        {
            var c = cc[i];
            if (c === e._jlcfg.header)
                continue;
            jl.setStyle(c, {position: "absolute", top: e._jlcfg.header.offsetHeight , bottom: 0, left: 0, right: 0, overflow: "auto"});
        }
        jl.bindEvent(e._jlcfg.header, "mousedown", function (evt) {
            var d = {left: evt.pageX - ll.x, top: evt.pageY - ll.y};
            jl.focus(e);
            var mouseup = function (evt) {
                jl.unbindEvent(document, "mouseup", mouseup);
                jl.unbindEvent(document, "mousemove", mousemove);
            };
            var mousemove = function (evt) {
                ll.x = evt.pageX - d.left;
                ll.y = evt.pageY - d.top;
                jl.setLayout(e, ll);
                jl(e);
                jl.preventEvent(evt);
            };
            jl.bindEvent(document, "mouseup", mouseup);
            jl.bindEvent(document, "mousemove", mousemove);
        });
        //handle resize
        jl.bindEvent(e, "mousemove", function (evt) {
            var cur = {
                0: "default",
                1: "ew-resize", 2: "ew-resize", 4: "ns-resize", 8: "ns-resize",
                5: "nw-resize", 6: "ne-resize", 9: "sw-resize", 10: "se-resize"
            }[testb(evt)];
            jl.setStyle(e, {cursor: cur});
        });
        //start drag
        jl.bindEvent(e, "mousedown", function (evt) {
            var d = {t: testb(evt), x: evt.pageX - ll.x, y: evt.pageY - ll.y, w: evt.pageX - ll.w, h: evt.pageY - ll.h};
            if (!d.t)
                return;
            var mouseup = function (evt) {
                jl.unbindEvent(document, "mouseup", mouseup);
                jl.unbindEvent(document, "mousemove", mousemove);
            };
            var mousemove = function (evt) {
                if (d.t & 1)
                {
                    ll.w -= evt.pageX - d.x - ll.x;
                    ll.x = evt.pageX - d.x;
                }
                if (d.t & 2)
                {
                    ll.w = evt.pageX - d.w;
                }
                if (d.t & 4)
                {
                    ll.h -= evt.pageY - d.y - ll.y;
                    ll.y = evt.pageY - d.y;
                }
                if (d.t & 8)
                {
                    ll.h = evt.pageY - d.h;
                }
                jl.setLayout(e, ll);
                jl(e);
                jl.preventEvent(evt);
                jl.stopEvent(evt);
            };
            jl.bindEvent(document, "mouseup", mouseup);
            jl.bindEvent(document, "mousemove", mousemove);
            jl.preventEvent(evt);
            jl.stopEvent(evt);
        });



        //crea il buttonslot
        var bs = jl.create("div");
        jl.setStyle(bs, {position: "absolute", right: 0, top: 0})
        e._jlcfg.header.appendChild(bs);


        var addBtn = function (title, fn, bgcolor)
        {
            var b = jl.create("div");
            jl.setText(b, title);
            jl.setStyle(b, {background: bgcolor, border: "1px solid black", width: 18, height: 18, margin: 0, "text-align": "center", display: "inline-block"})
            jl.bindEvent(b, "click", fn);
            bs.appendChild(b);
        }



        //crea i pulsanti
        addBtn("×", function () {
            jl.delete(e);
        }, "salmon");

    }
    ;

};
//fitme : all children fit parent
jl.fn.fitme = function (e) {
    var cc = jl.children(e);
    for (var i = 0; i < cc.length; i++)
        jl.setStyle(cc[i], {position: "absolute", top: 0, bottom: 0, left: 0, right: 0});
};
//box : all children handled by weight p and minimum size s
jl.fn.box = function (e) {
    var ll = jl.getLayout(e);
    var sss = jl.getSizes(e);
    ll.dir = ll.dir === 'v' ? 'v' : 'h';
    var ts = jl.getSizes(e)[{'h': "width", 'v': "height"}[ll.dir]];
    var tp = 0;
    var cc = jl.children(e);
    for (var i = 0; i < cc.length; i++)
    {
        var cll = jl.getLayout(cc[i]);
        cll.s = parseInt(cll[{'v': 'h', 'h': 'w'}[ll.dir]]) || 0;
        cll.p = parseInt(cll.p) || 0;
        ts -= cll.s;
        tp += cll.p;
    }
    var offset = 0;
    for (var i = 0; i < cc.length; i++)
    {
        var cll = jl.getLayout(cc[i]);
        var cs = jl.getSizes(cc[i]);
        var s = cll.s;
        if (tp)
        {
            var ds = ts * cll.p / tp;
            s += ds >= 0 ? ds : 0;
        }
        if (ll.dir === "h")
            jl.setStyle(cc[i], {position: "absolute", top: 0, bottom: 0, left: offset , width: jl.clip(s - cs.deltaWidth) });
        else
            jl.setStyle(cc[i], {position: "absolute", left: 0, right: 0, top: offset , height: jl.clip(s - cs.deltaHeight) });
        offset += s;
    }
};
//split : 2 children, one constant, other dynamic
jl.fn.split = function (e) {
    var ll = jl.getLayout(e);
    var cc = jl.children(e);
    var c0 = cc[0];
    var c1 = cc[1];
    var s = jl.getSizes(e);
    var c0s = jl.getSizes(c0);
    var c1s = jl.getSizes(c1);
    ll.dir = ll.dir === 'v' ? 'v' : 'h';
    ll.splitpos = ll.splitpos ? ll.splitpos : {'h': s.width, 'v': s.height}[ll.dir] / 2;
    ll.splitsize = parseInt(ll.splitsize) || 4;
    if (!e._jlcfg)
    {
        e._jlcfg = {};
        var bar = jl.create("div");
        e._jlcfg.bar = bar;
        e.appendChild(bar);
        //drag
        jl.bindEvent(bar, "mousedown", function (evt) {
            var delta = {'h': evt.pageX, 'v': evt.pageY}[ll.dir] - ll.splitpos;
            var mousemove = function (evt) {
                ll.splitpos = {'h': evt.pageX, 'v': evt.pageY}[ll.dir] - delta;
                jl.setLayout(e, ll);
                jl(e);
                jl.preventEvent(evt);
            };
            var mouseup = function (evt) {
                jl.unbindEvent(document, "mouseup", mouseup);
                jl.unbindEvent(document, "mousemove", mousemove);
            };
            jl.bindEvent(document, "mousemove", mousemove);
            jl.bindEvent(document, "mouseup", mouseup);
        });
        jl.setStyle(bar, {background: "rgb(154, 161, 165)", "z-index": 1});
    }
    if (ll.dir === 'h')
    {
        var c0w = ll.splitpos - c0s.deltaWidth;
        var c1w = s.width - ll.splitpos - ll.splitsize - c1s.deltaWidth;
        jl.setStyle(c0, {overflow: "auto", position: "absolute", top: 0, bottom: 0, left: 0, width: jl.clip(c0w) , display: (c0w < 0 ? "none" : "block")});
        jl.setStyle(c1, {overflow: "auto", position: "absolute", top: 0, bottom: 0, right: 0, width: jl.clip(c1w) , display: (c1w < 0 ? "none" : "block")});
        jl.setStyle(e._jlcfg.bar, {position: "absolute", top: 0, bottom: 0, width: jl.clip(ll.splitsize) , left: ll.splitpos , cursor: "ew-resize"});
    }
    else
    {
        var c0h = ll.splitpos - c0s.deltaHeight;
        var c1h = s.height - ll.splitpos - ll.splitsize - c1s.deltaHeight;
        jl.setStyle(c0, {overflow: "auto", position: "absolute", top: 0, left: 0, right: 0, height: jl.clip(c0h) , display: (c0h < 0 ? "none" : "block")});
        jl.setStyle(c1, {overflow: "auto", position: "absolute", bottom: 0, left: 0, right: 0, height: jl.clip(c1h) , display: (c1h < 0 ? "none" : "block")});
        jl.setStyle(e._jlcfg.bar, {position: "absolute", left: 0, right: 0, height: jl.clip(ll.splitsize) , top: ll.splitpos , cursor: "ns-resize"});
    }

};
//tabs: set children in tabs ( you can choose orientation )
jl.fn.tabs = function (e) {
    var ll = jl.getLayout(e);
    ll.sel = ll.sel || 0;
    ll.dir = ['top', 'left', 'bottom', 'right'].indexOf(ll.dir) >= 0 ? ll.dir : 'top';
    if (!e._jlcfg)
    {
        e._jlcfg = {};
        e._jlcfg.flaps = [];
        e._jlcfg.cc = jl.children(e);
        var header = jl.create("div");
        e._jlcfg.header = header;
        e.appendChild(e._jlcfg.header);
        jl.toggleClass(e._jlcfg.header, "jlexclude tabheader", true);
        var hstyle = {"top": 0, "left": 0, "bottom": 0, "right": 0, "position": "absolute"};
        delete hstyle[{"top": "bottom", "left": "right", "bottom": "top", "right": "left"}[ll.dir]];
        jl.setStyle(header, hstyle);
        for (var i = 0; i < e._jlcfg.cc.length; i++)
        {
            var c = e._jlcfg.cc[i];
            var cll = jl.getLayout(c);
            var flap = jl.create("div");
            e._jlcfg.flaps.push(flap);
            jl.setText(flap, cll.title || "tab " + i);
            header.appendChild(flap);
            if (ll.dir === "top" || ll.dir === "bottom")
                jl.setStyle(flap, {display: "inline-block"});
            jl.bindEvent(flap, "click", (function (i) {
                return function () {
                    ll.sel = i;
                    jl.setLayout(e, ll);
                    jl(e);
                };
            })(i));
        }

    }
    var hs = jl.getSizes(e._jlcfg.header);
    var cstyle = {"top": 0, "left": 0, "bottom": 0, "right": 0, "position": "absolute"};
    cstyle[ll.dir] = {"top": hs.totHeight, "left": hs.totWidth, "bottom": hs.totHeight, "right": hs.totWidth}[ll.dir] ;
    for (var i = 0; i < e._jlcfg.cc.length; i++)
    {
        var c = e._jlcfg.cc[i];
        var issel = (i === ll.sel);
        cstyle.display = issel ? "block" : "none";
        jl.setStyle(c, cstyle);
        var flap = e._jlcfg.flaps[i];
        jl.toggleClass(flap, "selected", issel);
    }

};
//flaps: set children in hiddable flaps ( you can choose orientation )
jl.fn.flaps = function (e) {
    var ll = jl.getLayout(e);
    ll.dir = ['top', 'left', 'bottom', 'right'].indexOf(ll.dir) >= 0 ? ll.dir : 'top';
    if (!e._jlcfg)
    {
        e._jlcfg = {};
        e._jlcfg.flaps = [];
        e._jlcfg.cc = jl.children(e);
        var header = jl.create("div");
        e._jlcfg.header = header;
        e.appendChild(e._jlcfg.header);
        jl.toggleClass(e._jlcfg.header, "jlexclude tabheader", true);
        var hstyle = {"top": 0, "left": 0, "bottom": 0, "right": 0, "position": "absolute"};
        delete hstyle[{"top": "bottom", "left": "right", "bottom": "top", "right": "left"}[ll.dir]];
        jl.setStyle(header, hstyle);
        for (var i = 0; i < e._jlcfg.cc.length; i++)
        {
            var c = e._jlcfg.cc[i];
            var cll = jl.getLayout(c);
            var flap = jl.create("div");
            e._jlcfg.flaps.push(flap);
            jl.setText(flap, cll.title || "flap " + i);
            header.appendChild(flap);
            if (ll.dir === "top" || ll.dir === "bottom")
                jl.setStyle(flap, {display: "inline-block"});
            jl.bindEvent(flap, "click", (function (i) {
                return function () {
                    ll.sel = (ll.sel === i) ? null : i;
                    jl.setLayout(e, ll);
                    jl(e);
                    jl(e.parentNode);
                };
            })(i));
        }
        //schedule parent revalidation
        setTimeout(function () {
            jl(e.parentNode);
        }, 0);
    }

    var hs = jl.getSizes(e._jlcfg.header);
    var cstyle = {"top": 0, "left": 0, "bottom": 0, "right": 0, "position": "absolute"};
    cstyle[ll.dir] = {"top": hs.totHeight, "left": hs.totWidth, "bottom": hs.totHeight, "right": hs.totWidth}[ll.dir] ;
    //delete cstyle[{"top":"bottom","left":"right","bottom":"top","right":"left"}[ll.dir]];

    var esize = parseInt(cstyle[ll.dir]);
    esize += jl.getSizes(e)[{"top": "deltaHeight", "left": "deltaWidth", "bottom": "deltaHeight", "right": "deltaWidth"}[ll.dir]];
    for (var i = 0; i < e._jlcfg.cc.length; i++)
    {
        var c = e._jlcfg.cc[i];
        var issel = (i === ll.sel);
        cstyle.display = issel ? "block" : "none";
        jl.setStyle(c, cstyle);
        var cl = jl.getLayout(c);
        var csize = jl.getSizes(c);
        if (issel)
            esize += cl[{"top": 'h', "left": 'w', "bottom": 'h', "right": 'w'}[ll.dir]] || 0;
        ll[{"top": 'h', "left": 'w', "bottom": 'h', "right": 'w'}[ll.dir]] = esize;
        var flap = e._jlcfg.flaps[i];
        jl.toggleClass(flap, "selected", issel);
    }
};
//sequence : set sequence of tabs
jl.fn.sequence = function (e) {
    var ll = jl.getLayout(e);
    ll.sel = ll.sel || 0;
    if (!e._jlcfg)
    {
        e._jlcfg = {};
        e._jlcfg.prev = jl.create("span");
        jl.setText(e._jlcfg.prev, "<");
        jl.toggleClass(e._jlcfg.prev, "jlexclude jlbutton", true);
        e.appendChild(e._jlcfg.prev);
        jl.bindEvent(e._jlcfg.prev, "click", function () {
            var n = jl.children(e).length;
            ll.sel = (ll.sel + n - 1) % n;
            jl.setLayout(e, ll);
            jl(e);
        });
        e._jlcfg.next = jl.create("span");
        jl.setText(e._jlcfg.next, ">");
        jl.toggleClass(e._jlcfg.next, "jlexclude jlbutton", true);
        e.appendChild(e._jlcfg.next);
        jl.bindEvent(e._jlcfg.next, "click", function () {
            var n = jl.children(e).length;
            ll.sel = (ll.sel + n + 1) % n;
            jl.setLayout(e, ll);
            jl(e);
        });
//        jl.toggleClass(e._jlcfg.prev, "jlbutton", true);
//        jl.toggleClass(e._jlcfg.next, "jlbutton", true);
    }
    var cc = jl.children(e);
    for (var i = 0; i < cc.length; i++)
    {
        var c = cc[i];
        jl.setStyle(c, {"display": (ll.sel === i ? "block" : "none")});
        jl.setStyle(c, {position: "absolute", top: 0, bottom: 0, left: 0, right: 0});
        var cmdtop = (e.offsetHeight - e._jlcfg.prev.offsetHeight) / 2;
        jl.setStyle(e._jlcfg.prev, {position: "absolute", top: cmdtop , left: 3});
        jl.setStyle(e._jlcfg.next, {position: "absolute", top: cmdtop , right: 3});
    }
};

//crumb : set sequence of tabs
jl.fn.crumb = function (e) {
    var ll = jl.getLayout(e);
    ll.sel = ll.sel || 0;
    if (!e._jlcfg)
    {
        e._jlcfg = {};
        e._jlcfg.flaps = [];
        e._jlcfg.header = jl.create("div");
        jl.toggleClass(e._jlcfg.header, "jlexclude", true);
        jl.setStyle(e._jlcfg.header, {display: "inline-block", position: "absolute", bottom: 0 , "z-index": 1});
        e.appendChild(e._jlcfg.header);
        var cc = jl.children(e);
        for (var i = 0; i < cc.length; i++)
        {
            var flap = jl.create("div");
            e._jlcfg.flaps.push(flap);
            jl.toggleClass(flap, "jlaccordionflap", true);
            jl.setStyle(flap, {display: "inline-block", width: 10, height: 10, margin: 5, "border-radius": 5});
            e._jlcfg.header.appendChild(flap);
            jl.bindEvent(flap, "click", (function (i) {
                return function () {
                    ll.sel = i;
                    jl.setLayout(e, ll);
                    jl(e);
                };
            })(i));
        }
    }
    var cc = jl.children(e);
    for (var i = 0; i < cc.length; i++)
    {
        var c = cc[i];
        var issel = (i === ll.sel);
        jl.setStyle(c, {"display": (ll.sel === i ? "block" : "none")});
        jl.setStyle(c, {position: "absolute", top: 0, bottom: 0, left: 0, right: 0});
        var flap = e._jlcfg.flaps[i];
        jl.toggleClass(flap, "selected", issel);
    }
    var cmdtop = (e.offsetWidth - e._jlcfg.header.offsetWidth) / 2;
    jl.setStyle(e._jlcfg.header, {display: "inline-block", position: "absolute", bottom: 0 , left: cmdtop });
};

//accordion : set children in an accordion
jl.fn.accordion = function (e)
{
    var ll = jl.getLayout(e);
    ll.sel = ll.sel || 0;
    if (!e._jlcfg)
    {
        e._jlcfg = {};
        e._jlcfg.flaps = [];
        e._jlcfg.cc = jl.children(e);
        for (var i = 0; i < e._jlcfg.cc.length; i++)
        {
            var c = e._jlcfg.cc[i];
            var cll = jl.getLayout(c);
            var flap = jl.create("div");
            e._jlcfg.flaps.push(flap);
            jl.setText(flap, cll.title || "section " + i);
            e.insertBefore(flap, c);
            jl.toggleClass(flap, "jlaccordionflap jlexclude", true);
            jl.bindEvent(flap, "click", (function (i) {
                return function () {
                    ll.sel = i;
                    jl.setLayout(e, ll);
                    jl(e);
                };
            })(i));
        }
    }
    //compute the amount of free space
    var h = jl.getSizes(e).height;
    for (var i = 0; i < e._jlcfg.flaps.length; i++)
        h -= jl.getSizes(e._jlcfg.flaps[i]).totHeight;
    var offs = 0;
    for (var i = 0; i < e._jlcfg.flaps.length; i++)
    {
        var c = e._jlcfg.cc[i];
        var f = e._jlcfg.flaps[i];
        var issel = (i === ll.sel);
        //flap positioning
        jl.setStyle(f, {position: "absolute", top: offs , left: 0, right: 0, cursor: "pointer"});
        offs += jl.getSizes(f).totHeight;
        //child positioning
        var s = {position: "absolute", top: offs , left: 0, right: 0};
        s.height = jl.clip(issel ? (h - jl.getSizes(c).deltaHeight) : 0) ;
        s.display = (issel ? "block" : "none");
        jl.setStyle(c, s);
        offs += (issel ? h : 0);
        jl.toggleClass(f, "selected", issel);
    }
};
//snap : grid based fluid layout, at the end of the line it starts a new line of children computing the max space taken by the first
jl.fn.snap = function (e)
{
    var ll = jl.getLayout(e);
    var s = jl.getSizes(e);
    var cc = jl.children(e);
    ll.stepx = parseInt(ll.stepx) || 24;
    ll.marginx = parseInt(ll.marginx) || 4;
    ll.stepy = parseInt(ll.stepy) || 24;
    ll.marginy = parseInt(ll.marginy) || 4;
    var ox = 0;
    var oy = 0;
    var dw = ll.stepx + 2 * ll.marginx;
    var dh = ll.stepy + 2 * ll.marginy;
    var maxny = 0;
    for (var j = 0; j < cc.length; j++)
    {
        var c = cc[j];
        var cll = jl.getLayout(c);
        cll.nx = parseInt(cll.nx) || 1;
        cll.ny = parseInt(cll.ny) || 1;
        cs = jl.getSizes(c);
        var nox = ox + cll.nx;
        if (nox * dw > s.width && ox > 0)
        {
            ox = 0;
            nox = ox + cll.nx;
            oy += maxny;
            maxny = cll.ny;
        }
        jl.setStyle(c, {position: "absolute", left: (ox * dw + ll.marginx) , top: (oy * dh + ll.marginy) , width: jl.clip(cll.nx * dw - 2 * ll.marginx - cs.deltaWidth) , height: jl.clip(cll.ny * dh - 2 * ll.marginy - cs.deltaHeight) });
        maxny = cll.ny > maxny ? cll.ny : maxny;
        ox = nox;
    }

};
//smart : smart place children along a grid but try to cover all the free spaces
jl.fn.smart = function (e)
{
    var ll = jl.getLayout(e);
    var s = jl.getSizes(e);
    var cc = jl.children(e);
    ll.stepx = parseInt(ll.stepx) || 24;
    ll.marginx = parseInt(ll.marginx) || 4;
    ll.stepy = parseInt(ll.stepy) || 24;
    ll.marginy = parseInt(ll.marginy) || 4;
    var dw = ll.stepx + 2 * ll.marginx;
    var dh = ll.stepy + 2 * ll.marginy;
    var map = {};
    for (var j = 0; j < cc.length; j++)
    {
        var c = cc[j];
        var cll = jl.getLayout(c);
        cll.nx = parseInt(cll.nx) || 1;
        cll.ny = parseInt(cll.ny) || 1;
        cs = jl.getSizes(c);
        var lim = s.width / dw;
        lim = lim < 1 ? 1 : lim;
        var go = true;
        for (var iy = 0; go; iy++)
            for (var ix = 0; go && ix < lim; ix++)
            {
                //ricerca degli slot sulla mappa
                var ok = true;
                for (var ty = 0; ok && ty < cll.ny; ty++)
                    for (var tx = 0; ok && tx < cll.nx; tx++)
                        ok = (map[((ix + tx) + "," + (iy + ty))] === undefined) && (!ix || (ix + cll.nx) <= lim);
                //se trova lo spazio piazza l'elemento
                if (ok)
                {
                    for (var ty = 0; ok && ty < cll.ny; ty++)
                        for (var tx = 0; ok && tx < cll.nx; tx++)
                            map[((ix + tx) + "," + (iy + ty))] = 1;
                    go = false;

                    jl.setStyle(c, {position: "absolute", left: (ix * dw + ll.marginx) , top: (iy * dh + ll.marginy) , width: jl.clip(cll.nx * dw - 2 * ll.marginx - cs.deltaWidth) , height: jl.clip(cll.ny * dh - 2 * ll.marginy - cs.deltaHeight) });


                }
            }
    }
};
//closable : closable container, with an x to close it
jl.fn.closable = function (e)
{
    var ll = jl.getLayout(e);
    if (!e._jlcfg)
    {
        e._jlcfg = {};
        e._jlcfg.flaps = [];
        e._jlcfg.cc = jl.children(e);
        var btn = jl.create("div");
        jl.setText(btn, "×");
        e.appendChild(btn);
        jl.setStyle(btn, {position: "absolute", top: 0, right: 0, padding: 3, width: 15, height: 15, "text-align": "center", "vertical-align": "middle", cursor: "pointer"});
        jl.bindEvent(btn, "click", function () {
            e.parentNode.removeChild(e);
            jl(e.parentNode);
        });
    }
};
//backdrop: closable backdrop --- not used yet
jl.fn.backdrop = function (e)
{
    var ll = jl.getLayout(e);
    if (!e._jlcfg)
    {
        e._jlcfg = {};
        e._jlcfg.flaps = [];
        e._jlcfg.cc = jl.children(e);
        var es = {position: "fixed", top: 0, bottom: 0, left: 0, right: 0, "background-color": "rgba(10, 10, 10, 0.8)", "z-index": 90};
        jl.setStyle(e, es);
        jl.bindEvent(e, "click", function () {
            e.parentNode.removeChild(e);
            jl(e.parentNode);
        });
    }
};
//tree: div containing a tree
jl.fn.tree = function (e)
{

    var ll = jl.getLayout(e);
    if (!e._jlcfg)
    {
        e._jlcfg = {};
        var nodes = e.querySelectorAll("ul>li");
        for (var i = 0; i < nodes.length; i++)
        {
            var n = nodes[i];
            var nt = jl.create("span");
            //jl.setText(nt,"+");
            jl.setStyle(nt, {cursor: "pointer"});
            n.insertBefore(nt, n.firstChild);

            jl.bindEvent(nt, "click", (function (x) {
                return function () {
                    var isclosed = jl.hasClass(x, "closed");
                    var ctx = x.querySelector("ul");
                    //console.log(ctx);
                    jl.toggleClass(x, "closed", !isclosed);
                    if (ctx)
                        jl.setStyle(ctx, {display: (isclosed ? "block" : "none")});
                }
            })(n));
        }


    }
    jl.setStyle(e, {overflow: "auto"});
};
