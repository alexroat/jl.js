
function jl(e,layout)
{
	//default: usa il body
	if(!e)
		e=document.body;
    //se è impostato il layout lo applica
    if (layout) 
        jl.setLayout(e,layout);
	//read layout
	var ll=jl.getLayout(e);
	if (jl.fn[ll.sz])
    {
        var st={"overflow":"hidden"};
        jl.setStyle(e,st);
		jl.fn[ll.sz](e);
    }
	//children process
	for (var i=0;i<e.children.length;i++)
    {
        if (jl.getStyle(e.children[i]).display!="none")
    		jl(e.children[i]);
    }
}
jl.create=function(tag,attr){var e = document.createElement(tag);for (var k in attr) e.setAttribute(k,attr[k]);return e;};
jl.map=function(f,s){r=[]; for (var i in s) r.push(f.apply(null,[s[i]])); return r;};
jl.readLayout=function(e){try {return eval("[{"+(e.getAttribute("layout")||"")+"}]")[0];}catch (ex){ return {};}};
jl.getLayout=function(e){
    if (e._jl==undefined)
        e._jl=jl.readLayout(e);
    return e._jl;
};
jl.setLayout=function(e,ll){var r=JSON.stringify(ll);e.setAttribute("layout",r.substr(1,r.length-2));};
jl.getStyle=function(e){return e.currentStyle || window.getComputedStyle(e);};
jl.setStyle=function(e,style){for (var s in style) e.style[s]=style[s];};
jl.setFillParent=function(e){jl.setStyle(e,{position:"absolute",top:"0px",bottom:"0px",left:"0px",right:"0px"});};
jl.hasClass=function(e, cls) {var cl=e.className.split(' ');for (var i in cl) if (cl[i]==cls) return true;return false;};
jl.toggleClass222=function(e, cls) {var cl2=[];var cl=e.className.split(' ');for (var i in cl) if (cl[i]!=cls)cl2.push(cls); if (cl2.length==cl.lenght) cl2.push(cls);e.className=cl2.join(' ');};
jl.toggleClass=function(e, cls) {
var cl2=[];
var cl=e.className.split(' ');
for (var i in cl) 
    if (cl[i]!=cls)
        cl2.push(cl[i]);
     if (cl2.length==cl.length)
         cl2.push(cls);
     e.className=cl2.join(' ');
};
jl.children=function(e){
    var r =[];
    for (var i=0;i<e.children.length;i++) 
        if (!jl.hasClass(e.children[i],"jlexclude"))
            r.push(e.children[i]);
    return r;
};
jl.getSizes=function(e)
{
    var s=jl.getStyle(e);
    var r={
        width:parseInt(s.width)||0,
        height:parseInt(s.height)||0,
        borderLeft:parseInt(s.borderLeftWidth)||0,
        borderRight:parseInt(s.borderRightWidth)||0,
        borderTop:parseInt(s.borderTopWidth)||0,
        borderBottom:parseInt(s.borderBottomWidth)||0,
        paddingLeft:parseInt(s.paddingLeft)||0,
        paddingRight:parseInt(s.paddingRight)||0,
        paddingTop:parseInt(s.paddingTop)||0,
        paddingBottom:parseInt(s.paddingBottom)||0,
        marginLeft:parseInt(s.marginLeft)||0,
        marginRight:parseInt(s.marginRight)||0,
        marginTop:parseInt(s.marginTop)||0,
        marginBottom:parseInt(s.marginBottom)||0
    };
    r.deltaWidth=r.paddingLeft+r.borderLeft+r.marginLeft+r.paddingRight+r.borderRight+r.marginRight;
    r.deltaHeight=r.paddingTop+r.borderTop+r.marginTop+r.paddingBottom+r.borderBottom+r.marginBottom;
    r.totWidth=r.width+r.deltaWidth;
    r.totHeight=r.height+r.deltaHeight;
    return r;
};
jl.setSizes=function(e,r)
{
var ss=["width","height","borderLeft","borderRight","borderTop","borderBottom","paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom"];

}
jl.fn={};
//funzioni di layout
//------------------
//fullpage : all children fill page
jl.fn.fullpage=function(e){
	jl.setStyle(e,{position:"fixed",top:"0px",bottom:"0px",left:"0px",right:"0px"});
	for (var i=0;i<e.children.length;i++)
        jl.setStyle(e.children[i],{position:"absolute",top:"0px",bottom:"0px",left:"0px",right:"0px"});
    if (!e.layout)
	{
		e.layout={};
        window.addEventListener("resize",function(){jl(e);});
    }
};
//fullpage : all children fill page
jl.fn.dialog=function(e){
	var ll=jl.getLayout(e);
    ll.x=ll.x||e.offsetLeft;
    ll.y=ll.y||e.offsetTop;
    ll.w=ll.w||200;
    ll.h=ll.h||200;
    var g=4;//bordo
    jl.setStyle(e,{position:"fixed",top:ll.y+"px",left:ll.x+"px",width:ll.w+"px",height:ll.h+"px","z-index":200,background:"white",border:g+"px solid rgb(154, 161, 165)",overflow:"auto", "border-radius":"5px"});
    if (!e.layout)
	{
   		e.layout={};
        e.layout.header=document.createElement("div");
        e.appendChild(e.layout.header);
        jl.toggleClass(e.layout.header,"dialogheader");
        jl.toggleClass(e.layout.header,"jlexclude");
        e.layout.header.textContent=ll.title||"dialog";
        jl.setStyle(e.layout.header,{position:"absolute",top:"0px",left:"0px",right:"0px"});
        var cc=jl.children(e);
        var testb=function(evt){
            var test=0;
            var x=evt.pageX-e.offsetLeft;
            var y=evt.pageY-e.offsetTop;
            test|=(x<g);
            test|=(x-g>ll.w)<<1;
            test|=(y<g)<<2;
            test|=(y-g>ll.h)<<3;
            return test;
        }
        for (var i=0;i<cc.length;i++)
        {
            var c=cc[i];
            if (c==e.layout.header)
                continue;
            jl.setStyle(c,{position:"absolute",top:e.layout.header.offsetHeight+"px",bottom:"0px",left:"0px",right:"0px",overflow:"auto"});
        }
        e.layout.header.addEventListener("mousedown",function(evt){
            var d={left:evt.pageX-ll.x,top:evt.pageY-ll.y};
            var mouseup=function(evt){
                document.removeEventListener("mouseup",mouseup);
                document.removeEventListener("mousemove",mousemove);
            };
            var mousemove=function(evt){
                ll.x=evt.pageX-d.left;
                ll.y=evt.pageY-d.top;
                jl.setLayout(e,ll);
                jl(e);
                evt.preventDefault();
            };
            document.addEventListener("mouseup",mouseup);
            document.addEventListener("mousemove",mousemove);
        });
        //gestione resize
        e.addEventListener("mousemove",function(evt){
            var cur={
            0:"initial",
            1:"ew-resize",2:"ew-resize",4:"ns-resize",8:"ns-resize",
            5:"nw-resize",6:"ne-resize",9:"sw-resize",10:"se-resize"
            }[testb(evt)];            
            jl.setStyle(e,{cursor:cur});
        });
        e.addEventListener("mousedown",function(evt){
            var d={t:testb(evt),x:evt.pageX-ll.x,y:evt.pageY-ll.y,w:evt.pageX-ll.w,h:evt.pageY-ll.h};
            if (!d.t)
                return;
            var mouseup=function(evt){
                document.removeEventListener("mouseup",mouseup);
                document.removeEventListener("mousemove",mousemove);
            };
            var mousemove=function(evt){
                if (d.t&1)
                {
                    ll.w-=evt.pageX-d.x-ll.x;
                    ll.x=evt.pageX-d.x;
                }
                if (d.t&2)
                {
                    ll.w=evt.pageX-d.w;
                }
                if (d.t&4)
                {
                    ll.h-=evt.pageY-d.y-ll.y;
                    ll.y=evt.pageY-d.y;
                }
                if (d.t&8)
                {
                    ll.h=evt.pageY-d.h;
                }
                jl.setLayout(e,ll);
                jl(e);
                evt.preventDefault();
                evt.stopPropagation();
            };
            document.addEventListener("mouseup",mouseup);
            document.addEventListener("mousemove",mousemove);
            evt.preventDefault();
            evt.stopPropagation();
        });
    }
};
//fitme : all children fit parent
jl.fn.fitme=function(e){
    var cc=jl.children(e);
	for (var i=0;i<cc.length;i++)
		jl.setStyle(cc[i],{position:"absolute",top:"0px",bottom:"0px",left:"0px",right:"0px"});
};
//box : all children handled by weight p and minimum size s
jl.fn.box=function(e){
    var ll=jl.getLayout(e);
    ll.dir=ll.dir=='v'?'v':'h';
	var ts=jl.getSizes(e)[{'h':"width",'v':"height"}[ll.dir]];
	var tp=0;
    var cc=jl.children(e);
	for (var i=0;i<cc.length;i++)
	{
		var cll=jl.getLayout(cc[i]);
		cll.s=parseInt(cll[{'v':'h','h':'w'}[ll.dir]])||0;
		cll.p=parseInt(cll.p)||0;
		ts-=cll.s;
		tp+=cll.p;
	}
	var offset=0;
	for (var i=0;i<cc.length;i++)
	{
		var cll=jl.getLayout(cc[i]);
        var cs=jl.getSizes(cc[i]);
		var s=cll.s;
		if (tp)
			s+=ts*cll.p/tp;
        if (ll.dir=="h")
            jl.setStyle(cc[i],{position:"absolute",top:"0px",bottom:"0px",left:offset+"px",width:(s-cs.deltaWidth)+"px"});
        else
            jl.setStyle(cc[i],{position:"absolute",left:"0px",right:"0px",top:offset+"px",height:(s-cs.deltaHeight)+"px"});
		offset+=s;
	}
};
//split : 2 children, one constant, other dynamic
jl.fn.split=function(e){
    var ll=jl.getLayout(e);
	var c0=e.children[0];
	var c1=e.children[1];
    var s=jl.getSizes(e);
    var c0s=jl.getSizes(c0);
    var c1s=jl.getSizes(c1);
    ll.dir=ll.dir=='v'?'v':'h';
    ll.splitpos=ll.splitpos?ll.splitpos:{'h':s.width,'v':s.height}[ll.dir]/2;
    ll.splitsize=parseInt(ll.splitsize)||4
    if (!e.layout)
	{
		e.layout={};
		var bar=document.createElement("div");
		e.layout.bar=bar;
		e.appendChild(bar);
		//drag
		bar.addEventListener("mousedown",function(evt){
			var delta={'h':evt.pageX,'v':evt.pageY}[ll.dir]-ll.splitpos;
			var mousemove=function(evt){
				ll.splitpos={'h':evt.pageX,'v':evt.pageY}[ll.dir]-delta;
				jl.setLayout(e,ll);
				jl(e);
                evt.preventDefault();
			};
			var mouseup=function(evt){
					document.removeEventListener("mouseup",mouseup);
					document.removeEventListener("mousemove",mousemove);
				};
			document.addEventListener("mousemove",mousemove);
			document.addEventListener("mouseup",mouseup);
		});
        jl.setStyle(bar,{background:"rgb(154, 161, 165)","z-index":1});
	}
    if (ll.dir=='h')
    {
        var c0w=ll.splitpos-c0s.deltaWidth;
        var c1w=s.width-ll.splitpos-ll.splitsize-c1s.deltaWidth;
        jl.setStyle(c0,{position:"absolute",top:"0px",bottom:"0px",left:"0px",width:c0w+"px", overflow:"hidden",display:(c0w<0?"none":"initial")});
        jl.setStyle(c1,{position:"absolute",top:"0px",bottom:"0px",right:"0px",width:c1w+"px", overflow:"hidden",display:(c1w<0?"none":"initial")});
        jl.setStyle(e.layout.bar,{position:"absolute",top:"0px",bottom:"0px",width:ll.splitsize+"px",left:ll.splitpos+"px",cursor:"ew-resize"});
    }
    else
    {
        var c0h=ll.splitpos-c0s.deltaHeight;
        var c1h=s.height-ll.splitpos-ll.splitsize-c1s.deltaHeight;
        jl.setStyle(c0,{position:"absolute",top:"0px",left:"0px",right:"0px",height:c0h+"px", overflow:"hidden",display:(c0h<0?"none":"initial")});
        jl.setStyle(c1,{position:"absolute",bottom:"0px",left:"0px",right:"0px",height:c1h+"px", overflow:"hidden",display:(c1h<0?"none":"initial")});
        jl.setStyle(e.layout.bar,{position:"absolute",left:"0px",right:"0px",height:ll.splitsize+"px",top:ll.splitpos+"px",cursor:"ns-resize"});
    }
    
};
//tabs: set children in tabs ( you can choose orientation )
jl.fn.tabs=function(e){
    var ll=jl.getLayout(e);
    ll.sel=ll.sel||0;
    ll.dir=['top','left','bottom','right'].indexOf(ll.dir)>=0?ll.dir:'top';
    if (!e.layout)
	{
   		e.layout={};
        e.layout.flaps=[];
        e.layout.cc=jl.children(e);
        var header=document.createElement("div");
        e.layout.header=header;
        e.appendChild(e.layout.header);
        jl.toggleClass(e.layout.header,"jlexclude");
        jl.toggleClass(e.layout.header,"tabheader");
        var hstyle={"top":"0px","left":"0px","bottom":"0px","right":"0px","position":"absolute"};
        delete hstyle[{"top":"bottom","left":"right","bottom":"top","right":"left"}[ll.dir]];
        jl.setStyle(header,hstyle);
        for (var i=0;i<e.layout.cc.length;i++)
        {
            var c=e.layout.cc[i];
            var cll=jl.getLayout(c);
            var flap=document.createElement("div");
            e.layout.flaps.push(flap);
            flap.textContent=cll.title||"tab "+i;
            header.appendChild(flap);
            if (ll.dir=="top" || ll.dir=="bottom")
                jl.setStyle(flap,{display:"inline-block"});
            flap.addEventListener("click",(function (i){return function(){ll.sel=i;jl.setLayout(e,ll);jl(e);};})(i));
        }

    }
    var hs=jl.getSizes(e.layout.header);
    var cstyle={"top":"0px","left":"0px","bottom":"0px","right":"0px","position":"absolute"};
    cstyle[ll.dir]={"top":hs.totHeight,"left":hs.totWidth,"bottom":hs.totHeight,"right":hs.totWidth}[ll.dir]+"px";
    for (var i=0;i<e.layout.cc.length;i++)
    {
        var c=e.layout.cc[i];
        var issel=(i==ll.sel);
        cstyle.display=issel?"initial":"none";
        jl.setStyle(c,cstyle);
        var flap=e.layout.flaps[i];
        var flapsel=jl.hasClass(flap,"selected");
        if ((flapsel && !issel) || (!flapsel && issel))
            jl.toggleClass(flap,"selected");
    }
    
}
//flaps: set children in hiddable flaps ( you can choose orientation )
jl.fn.flaps=function(e){
    var ll=jl.getLayout(e);
    ll.dir=['top','left','bottom','right'].indexOf(ll.dir)>=0?ll.dir:'top';
    if (!e.layout)
	{
   		e.layout={};
        e.layout.flaps=[];
        e.layout.cc=jl.children(e);
        var header=document.createElement("div");
        e.layout.header=header;
        e.appendChild(e.layout.header);
        jl.toggleClass(e.layout.header,"jlexclude");
        jl.toggleClass(e.layout.header,"tabheader");
        var hstyle={"top":"0px","left":"0px","bottom":"0px","right":"0px","position":"absolute"};
        delete hstyle[{"top":"bottom","left":"right","bottom":"top","right":"left"}[ll.dir]];
        jl.setStyle(header,hstyle);
        for (var i=0;i<e.layout.cc.length;i++)
        {
            var c=e.layout.cc[i];
            var cll=jl.getLayout(c);
            var flap=document.createElement("div");
            e.layout.flaps.push(flap);
            flap.textContent=cll.title||"flap "+i;
            header.appendChild(flap);
            if (ll.dir=="top" || ll.dir=="bottom")
                jl.setStyle(flap,{display:"inline-block"});
            flap.addEventListener("click",(function (i){return function(){ll.sel=(ll.sel==i)?null:i;jl.setLayout(e,ll);jl(e);jl(e.parentNode);};})(i));
        }
        //schedula la rivalidazione del padre
        setTimeout(function(){jl(e.parentNode);},0);
    }
    
    var hs=jl.getSizes(e.layout.header);
    var cstyle={"top":"0px","left":"0px","bottom":"0px","right":"0px","position":"absolute"};
    cstyle[ll.dir]={"top":hs.totHeight,"left":hs.totWidth,"bottom":hs.totHeight,"right":hs.totWidth}[ll.dir]+"px";
    //delete cstyle[{"top":"bottom","left":"right","bottom":"top","right":"left"}[ll.dir]];

    var esize=parseInt(cstyle[ll.dir]);
    esize+=jl.getSizes(e)[{"top":"deltaHeight","left":"deltaWidth","bottom":"deltaHeight","right":"deltaWidth"}[ll.dir]];
    for (var i=0;i<e.layout.cc.length;i++)
    {
        var c=e.layout.cc[i];
        var issel=(i==ll.sel);
        cstyle.display=issel?"initial":"none";
        jl.setStyle(c,cstyle);
        var cl=jl.getLayout(c);
        var csize=jl.getSizes(c);
        if (issel)
            esize+=cl[{"top":'h',"left":'w',"bottom":'h',"right":'w'}[ll.dir]]||0;
        ll[{"top":'h',"left":'w',"bottom":'h',"right":'w'}[ll.dir]]=esize;
        var flap=e.layout.flaps[i];
        var flapsel=jl.hasClass(flap,"selected");
        if ((flapsel && !issel) || (!flapsel && issel))
            jl.toggleClass(flap,"selected");
    }
}
//sequence : set sequence of tabs
jl.fn.sequence=function(e){
    var ll=jl.getLayout(e);
    ll.sel=ll.sel||0;
    if (!e.layout)
	{
   		e.layout={};
        e.layout.prev=document.createElement("span");
        e.layout.prev.textContent="<";
        jl.toggleClass(e.layout.prev,"jlexclude");
        e.appendChild(e.layout.prev);
        e.layout.prev.addEventListener("click",function(){var n=jl.children(e).length;ll.sel=(ll.sel+n-1)%n;jl.setLayout(e,ll);jl(e);});        
        e.layout.next=document.createElement("span");
        e.layout.next.textContent=">";
        jl.toggleClass(e.layout.next,"jlexclude");
        e.appendChild(e.layout.next);
        e.layout.next.addEventListener("click",function(){var n=jl.children(e).length;ll.sel=(ll.sel+n+1)%n;jl.setLayout(e,ll);jl(e);});
        jl.toggleClass(e.layout.prev,"jlbutton");
        jl.toggleClass(e.layout.next,"jlbutton");        
    }
    var cc=jl.children(e)
    for (var i=0;i<cc.length;i++)
    {
        var c=cc[i];
        jl.setStyle(c,{"display":(ll.sel==i?"initial":"none")});
        jl.setStyle(c,{position:"absolute",top:"0px",bottom:"0px",left:"0px",right:"0px"});
        var cmdtop=(e.offsetHeight-e.layout.prev.offsetHeight)/2;
        jl.setStyle(e.layout.prev,{position:"absolute",top:cmdtop+"px",left:"3px"});
        jl.setStyle(e.layout.next,{position:"absolute",top:cmdtop+"px",right:"3px"});
    }
}
//accordion : set children in an accordion
jl.fn.accordion=function(e)
{
    var ll=jl.getLayout(e);
    ll.sel=ll.sel||0;
    if (!e.layout)
	{
   		e.layout={};
        e.layout.flaps=[];
        e.layout.cc=jl.children(e);
        for (var i=0;i<e.layout.cc.length;i++)
        {
            var c=e.layout.cc[i];
            var cll=jl.getLayout(c);
            var flap=document.createElement("div");
            e.layout.flaps.push(flap);
            flap.textContent=cll.title||"section "+i;
            e.insertBefore(flap,c);
            jl.toggleClass(flap,"jlaccordionflap");
            jl.toggleClass(flap,"jlexclude");
            flap.addEventListener("click",(function (i){return function(){ll.sel=i;jl.setLayout(e,ll);jl(e);};})(i));
        }
    }
    //calcola il resto
    var h=jl.getSizes(e).height;
    for (var i=0;i<e.layout.flaps.length;i++)
        h-=jl.getSizes(e.layout.flaps[i]).totHeight;
    var offs=0;
    for (var i=0;i<e.layout.flaps.length;i++)
    {
        var c=e.layout.cc[i];
        var f=e.layout.flaps[i];
        var issel=(i==ll.sel);
        //posizionamento flap
        jl.setStyle(f,{position:"absolute",top:offs+"px",left:"0px",right:"0px",overflow:"hidden",cursor: "pointer"});
        offs+=jl.getSizes(f).totHeight;
        //posizionamento child
        var s={position:"absolute",top:offs+"px",left:"0px",right:"0px",overflow:"hidden"};
        s.height=(issel?(h-jl.getSizes(c).deltaHeight):0)+"px";
        s.display=(issel?"initial":"none");
        jl.setStyle(c,s);
        offs+=(issel?h:0);
        var flapsel=jl.hasClass(f,"selected");
        if ((flapsel && !issel) || (!flapsel && issel))
            jl.toggleClass(f,"selected");
    }
}
//snap : grid based fluid layout
jl.fn.snap=function(e)
{
    var ll=jl.getLayout(e);
    var s=jl.getSizes(e);
    ll.stepx=parseInt(ll.stepx)||24;
    ll.marginx=parseInt(ll.marginx)||4;
    ll.stepy=parseInt(ll.stepy)||24;
    ll.marginy=parseInt(ll.marginy)||4;
    var ox=0;
    var oy=0;
    var dw=ll.stepx+2*ll.marginx;
    var dh=ll.stepy+2*ll.marginy;
    var maxny=0;
    for (var j=0;j<e.children.length;j++)
    {
        var c=e.children[j];
        var cll=jl.getLayout(c);
        cll.nx=parseInt(cll.nx)||1;
        cll.ny=parseInt(cll.ny)||1;
        cs=jl.getSizes(c);
        var nox=ox+cll.nx;
        if (nox*dw>s.width && ox>0)
        {
            ox=0;
            nox=ox+cll.nx;
            oy+=maxny;
            maxny=cll.ny;
        }
        jl.setStyle(c,{position:"absolute",left:(ox*dw+ll.marginx)+"px",top:(oy*dh+ll.marginy)+"px",width:(cll.nx*dw-2*ll.marginx-cs.deltaWidth)+"px",height:(cll.ny*dh-2*ll.marginy-  cs.deltaHeight)+"px",overflow:"hidden"});
        maxny=cll.ny>maxny?cll.ny:maxny;
        ox=nox;
    }

}
//smart : smart place children along a grid
jl.fn.smart=function(e)
{
    var ll=jl.getLayout(e);
    var s=jl.getSizes(e);
    ll.stepx=parseInt(ll.stepx)||24;
    ll.marginx=parseInt(ll.marginx)||4;
    ll.stepy=parseInt(ll.stepy)||24;
    ll.marginy=parseInt(ll.marginy)||4;
    var dw=ll.stepx+2*ll.marginx;
    var dh=ll.stepy+2*ll.marginy;
    var map={}
    for (var j=0;j<e.children.length;j++)
    {
        var c=e.children[j];
        var cll=jl.getLayout(c);
        cll.nx=parseInt(cll.nx)||1;
        cll.ny=parseInt(cll.ny)||1;
        cs=jl.getSizes(c);
        var lim=s.width/dw;
        lim=lim<1?1:lim;
        var go=true;
        for (var iy=0;go;iy++)
            for (var ix=0;go&&ix<lim;ix++)
            {
                //ricerca degli slot sulla mappa
                var ok=true;
                for (var ty=0;ok&&ty<cll.ny;ty++)
                    for (var tx=0;ok&&tx<cll.nx;tx++)
                        ok=(map[((ix+tx)+","+(iy+ty))]==undefined) && (!ix || (ix+cll.nx)<=lim);
                //se trova lo spazio piazza l'elemento
                if (ok)
                {
                    for (var ty=0;ok&&ty<cll.ny;ty++)
                        for (var tx=0;ok&&tx<cll.nx;tx++)
                            map[((ix+tx)+","+(iy+ty))]=1;
                    go=false;

                    jl.setStyle(c,{position:"absolute",left:(ix*dw+ll.marginx)+"px",top:(iy*dh+ll.marginy)+"px",width:(cll.nx*dw-2*ll.marginx-cs.deltaWidth)+"px",height:(cll.ny*dh-2*ll.marginy-  cs.deltaHeight)+"px",overflow:"hidden"});


                }
            }
    }
}
//closable : closable container
jl.fn.closable=function(e)
{
    var ll=jl.getLayout(e);
    ll.dir
    if (!e.layout)
	{
   		e.layout={};
        e.layout.flaps=[];
        e.layout.cc=jl.children(e);
        var btn=document.createElement("div");
        btn.textContent="×";
        e.appendChild(btn);
        jl.setStyle(btn,{position:"absolute",top:"0px",right:"0px",padding:"3px",width:"15px",height:"15px","text-align": "center","vertical-align": "middle",cursor: "pointer"});
        btn.addEventListener("click",function(){e.parentNode.removeChild(e); jl(e.parentNode);});
    }
}
//backdrop: closable backdrop
jl.fn.backdrop=function(e)
{
	var ll=jl.getLayout(e);
    ll.dir
    if (!e.layout)
	{
   		e.layout={};
        e.layout.flaps=[];
        e.layout.cc=jl.children(e);
		var es={position: "fixed",top: "0px",bottom: "0px",left: "0px",right: "0px","background-color": "rgba(10, 10, 10, 0.8)","z-index": 90};
        jl.setStyle(e,es);
        e.addEventListener("click",function(){e.parentNode.removeChild(e); jl(e.parentNode);});
    }

}

