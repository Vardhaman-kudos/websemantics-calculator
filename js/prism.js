
// Add twist class to shadowlift,pre,code blocks
/*
(function () {
  "use strict";
  var shadowlifts = d.getElementsByClassName("shadowlift"),
      i = shadowlifts.length,
      c = 0;
  while (i--) {
    shadowlifts[i].classList.add("twist" + ++c);
    c = (c > 4) ? 0 : c;
  }
}());
*/
(function(){for(var a=d.getElementsByClassName("shadowlift"),b=a.length,c=0;b--;)a[b].classList.add("twist"+ ++c),c=4<c?0:c;}());



/*
// expander.js - Deprecaed in favour of contenteditable and resize:horizontal
(function(){
  var dataAttribute;

  // http://www.quirksmode.org/js/findpos.html
  function findXYPos(obj) {
    var X = Y = 0;
    if (obj.offsetParent) {
      do {
        X += obj.offsetLeft;
        Y += obj.offsetTop;
      } while (obj = obj.offsetParent);
    }
    return {x : X, y : Y};
  }

  function willHaveScrollBars(element) {
    // if preW > maxW - (2* left px) then should have scroll bars when expanded, but may be auto-hidden
    var maxW = d.body.scrollWidth - (2 * findXYPos(element).x);
    return element.getElementsByTagName("pre")[0].scrollWidth > maxW;
  }

  function hasScrollBars(element) {
    // true if div height > pre height
    return element.scrollHeight > element.getElementsByTagName("pre")[0].scrollHeight;
  }

  function isExpandable(element) {
    // true if pre width > div width
    var preObj = element.getElementsByTagName("pre"),
        value = false;
    if (preObj) {
      value = preObj[0].scrollWidth > element.scrollWidth;
    }
    return value;
  }

  function removeClone(prop) {
    var cloneObj = d.getElementById(prop.expandId);
    if (cloneObj) {
      var style = cloneObj.getAttribute("style");
      style = style.replace("max-width:" + prop.maxWidth, "max-width:" + prop.minWidth);
      requestAnimationFrame(function(){
        openingSound.play();
        cloneObj.setAttribute("style", style);
        cloneObj.getElementsByTagName("button")[0].classList.remove("ON");
        // remove clone button ON

        // allow animation time to complete before complete removal
        setTimeout(function(){
          requestAnimationFrame(function(){
            var blockObj = d.getElementById(prop.blockId);
            d.body.removeChild(cloneObj);

            // Restore original shadows
            blockObj.classList.remove("OFF");
          });
        }, 700);
      });
    }
  }

  function addClone(prop) {
    var blockObj = d.getElementById(prop.blockId);

    // clone the whole block
    var cloneObj = blockObj.cloneNode(true);
    cloneObj.classList.add("cloned");
    cloneObj.id = prop.expandId;
    cloneObj.setAttribute("style",
      "top:" + prop.top + "px; "
      + "left:" + prop.left + "px; "
      + "min-width:" + prop.minWidth + "px; "
      + "max-width:" + prop.minWidth + "px; "
    );

    // add button click event to close
    clonedBtn = cloneObj.getElementsByTagName("button")[0];
    if (clonedBtn) {
      clonedBtn.prop = prop;
      clonedBtn.addEventListener("click", btnClicked, false);
    }
    var style = cloneObj.getAttribute("style");
    style = style.replace("max-width:" + prop.minWidth, "max-width:" + prop.maxWidth);
    requestAnimationFrame(function(){

      // Remove original shadows
      blockObj.classList.add("OFF");
      d.body.appendChild(cloneObj);

      // Animate in
      requestAnimationFrame(function(){
        cloneObj.setAttribute("style", style);
        cloneObj.getElementsByTagName("button")[0].classList.add("ON");
        openingSound.play();
      });
    });
  }

  function btnClicked() {
    var btn = this;
    var isExpanded = d.getElementById(btn.prop.expandId);
    if (isExpanded) {
      removeClone(btn.prop);
    } else {
      addClone(btn.prop);
    }
  }

  function btnFocussed() {
    d.getElementById(this.prop.blockId).classList.add("lift");
  }

  function btnBlurred() {
    d.getElementById(this.prop.blockId).classList.remove("lift");
  }

  function addButtonListeners(btn) {
    //console.log("Adding Events to btn = " + btn.prop.blockId);
    btn.addEventListener("click", btnClicked, false);

    // hovering / focussing the button should lift the entire block visually.
    btn.addEventListener("mouseover", btnFocussed, false);
    btn.addEventListener("focus", btnFocussed, false);
    btn.addEventListener("mouseout", btnBlurred, false);
    btn.addEventListener("blur", btnBlurred, false);
  }


  function newButton(blockObj, config) {
    var btn = d.createElement('button');
    var XY = findXYPos(blockObj);
    var svgClasses = config.svgClasses ? config.svgClasses : "svg-plus";

    // btn.setAttribute("aria-pressed", false);
    btn.className = config.btnClasses ? config.btnClasses : "expand-btn";
    btn.id = blockObj.id + "_btn";
    btn.prop = {
      blockId : blockObj.id,
      expandId : blockObj.id + "_clone",
      top : XY.y,
      left: XY.x,
      minWidth : blockObj.scrollWidth,
      maxWidth : d.body.scrollWidth - 2 * XY.x
    };
    btn.innerHTML = '<span><svg class="' + svgClasses +'" width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><title>More</title><path d="M10.5 19l17 0"/><path class="h" d="M19 10.5l0 17"/></svg></span>';
    // addButtonListeners(btn);
    return btn;
  }

  function removeClones() {
    var clones = d.getElementsByClassName("cloned"),
        i = clones.length;
    while (i--) {
      clones[i].parentNode.removeChild(clones[i]);
    }
  }

  function removeExpander() {
    var clones = d.getElementsByClassName("cloned"),
        i = clones.length,
        timer,
        expands,
        buttons;

    while (i--) {
      clones[i].setAttribute("style", clones[i].getAttribute("style") + ";max-width:280px");
    }

    timer = setTimeout(removeClones, 500);

    var expands = d.querySelectorAll("[" + dataAttribute + "]");
    i = expands.length;
    while (i--) {
      buttons = expands[i].getElementsByTagName("button");
      if (buttons.length) {
        buttons[0].parentNode.removeChild(buttons[0]);
      }
      expands[i].classList.remove("OFF");
      expands[i].removeAttribute("id");
    }
  }

  function initialise(config) {
    dataAttribute = config.dataAttribute ? config.dataAttribute : "data-expand";
    var expands = d.querySelectorAll("[" + dataAttribute + "]");
    var i = expands.length;
    var blockObj, btnObj;
    if (i) {
      while (i--) {
        blockObj = expands[i];
        if (!isExpandable(blockObj)) {
          continue;
        }
        if (!blockObj.id) {
          blockObj.id = "cb" + i;
        }
        btnObj = newButton(blockObj, config);
        blockObj.appendChild(btnObj);
        addButtonListeners(btnObj);
      }
    }
  }

  function addExpander() {
    initialise({
      dataAttribute : "data-expand",
      btnClasses : "expand-btn"
    });
  }

  addExpander();
  window.addEventListener('resize', debounce(addExpander, 300, false));
  window.addEventListener('resize', debounce(removeExpander, 300, true));
})();
//*/

/*// expander.min.js
// 1.1KB gzipped (2.72KB uncompressed)
(function(){function l(a,c){var b;return function(){var f=this,k=arguments,g=c&&!b;clearTimeout(b);b=setTimeout(function(){b=null;c||a.apply(f,k)},300);g&&a.apply(f,k)}}function u(a){var c=d.getElementById(a.c);if(c){var b=c.getAttribute("style"),b=b.replace("max-width:"+a.maxWidth,"max-width:"+a.minWidth);requestAnimationFrame(function(){openingSound.play();c.setAttribute("style",b);c.getElementsByTagName("button")[0].classList.remove("ON");setTimeout(function(){requestAnimationFrame(function(){var b=
d.getElementById(a.b);d.body.removeChild(c);b.classList.remove("OFF")})},700)})}}function v(a){var c=d.getElementById(a.b),b=c.cloneNode(!0);b.classList.add("cloned");b.id=a.c;b.setAttribute("style","top:"+a.top+"px; left:"+a.left+"px; min-width:"+a.minWidth+"px; max-width:"+a.minWidth+"px; ");if(clonedBtn=b.getElementsByTagName("button")[0])clonedBtn.a=a,clonedBtn.addEventListener("click",p,!1);var f=b.getAttribute("style"),f=f.replace("max-width:"+a.minWidth,"max-width:"+a.maxWidth);requestAnimationFrame(function(){c.classList.add("OFF");
d.body.appendChild(b);requestAnimationFrame(function(){b.setAttribute("style",f);b.getElementsByTagName("button")[0].classList.add("ON");openingSound.play()})})}function p(){d.getElementById(this.a.c)?u(this.a):v(this.a)}function q(){d.getElementById(this.a.b).classList.add("ON")}function r(){d.getElementById(this.a.b).classList.remove("ON")}function t(){var a,c,b={g:"data-expand",f:"expand-btn",h:"svg-plus"};n=b.g?b.g:"data-expand";var f=d.querySelectorAll("["+n+"]"),k=f.length,g,h;if(k)for(;k--;){g=
f[k];h=g.getElementsByTagName("pre");var e=!1;h&&(e=h[0].scrollWidth>g.scrollWidth);if(e){g.id||(g.id="cb"+k);var e=g,m=b;h=d.createElement("button");a=e;c=Y=0;if(a.offsetParent){do c+=a.offsetLeft,Y+=a.offsetTop;while(a=a.offsetParent)}a=c;c=Y;var l=m.h?m.h:"svg-plus";h.className=m.f?m.f:"expand-btn";h.a={b:e.id,c:e.id+"_clone",top:c,left:a,minWidth:e.scrollWidth,maxWidth:d.body.scrollWidth-2*a};h.innerHTML='<span><svg class="'+l+'" width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><title>More</title><path d="M10.5 19l17 0"/><path class="h" d="M19 10.5l0 17"/></svg></span>';
e=h;e.addEventListener("click",p,!1);e.addEventListener("mouseover",q,!1);e.addEventListener("focus",q,!1);e.addEventListener("mouseout",r,!1);e.addEventListener("blur",r,!1);g.appendChild(h)}}}var n;t();window.addEventListener("resize",l(function(){t()},!1));window.addEventListener("resize",l(function(){var a,c;c=d.getElementsByClassName("cloned");for(a=c.length;a--;)c[a].parentNode.removeChild(c[a]);var b=d.querySelectorAll("["+n+"]");for(a=b.length;a--;)c=b[a].getElementsByTagName("button"),c.length&&
c[0].parentNode.removeChild(c[0]),b[a].classList.remove("OFF"),b[a].removeAttribute("id")},!0))})();
*/


// Add .lift class to code blocks figure parent on focus
(function(){
  var codes = d.getElementsByTagName("code");
  var i = codes.length;
  function addLiftClass(e) {
    // figure element
    e.target.parentElement.parentElement.classList.add("lift");
  }
  function removeLiftClass(e) {
    // figure element
    e.target.parentElement.parentElement.classList.remove("lift");
  }
  while (i--) {
    if (codes[i].className.match("language-")) {
      codes[i].setAttribute("contenteditable", true);
      codes[i].setAttribute("spellcheck", false);
      codes[i].addEventListener("focus", addLiftClass, false);
      codes[i].addEventListener("blur", removeLiftClass, false);
    }
  }
})();


/* http://prismjs.com/download.html?themes=prism&languages=markup+css+clike+javascript */
self=typeof window!="undefined"?window:typeof WorkerGlobalScope!="undefined"&&self instanceof WorkerGlobalScope?self:{};var Prism=function(){var e=/\blang(?:uage)?-(?!\*)(\w+)\b/i,t=self.Prism={util:{encode:function(e){return e instanceof n?new n(e.type,t.util.encode(e.content),e.alias):t.util.type(e)==="Array"?e.map(t.util.encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]},clone:function(e){var n=t.util.type(e);switch(n){case"Object":var r={};for(var i in e)e.hasOwnProperty(i)&&(r[i]=t.util.clone(e[i]));return r;case"Array":return e.slice()}return e}},languages:{extend:function(e,n){var r=t.util.clone(t.languages[e]);for(var i in n)r[i]=n[i];return r},insertBefore:function(e,n,r,i){i=i||t.languages;var s=i[e];if(arguments.length==2){r=arguments[1];for(var o in r)r.hasOwnProperty(o)&&(s[o]=r[o]);return s}var u={};for(var a in s)if(s.hasOwnProperty(a)){if(a==n)for(var o in r)r.hasOwnProperty(o)&&(u[o]=r[o]);u[a]=s[a]}t.languages.DFS(t.languages,function(t,n){n===i[e]&&t!=e&&(this[t]=u)});return i[e]=u},DFS:function(e,n,r){for(var i in e)if(e.hasOwnProperty(i)){n.call(e,i,e[i],r||i);t.util.type(e[i])==="Object"?t.languages.DFS(e[i],n):t.util.type(e[i])==="Array"&&t.languages.DFS(e[i],n,i)}}},highlightAll:function(e,n){var r=document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');for(var i=0,s;s=r[i++];)t.highlightElement(s,e===!0,n)},highlightElement:function(r,i,s){var o,u,a=r;while(a&&!e.test(a.className))a=a.parentNode;if(a){o=(a.className.match(e)||[,""])[1];u=t.languages[o]}if(!u)return;r.className=r.className.replace(e,"").replace(/\s+/g," ")+" language-"+o;a=r.parentNode;/pre/i.test(a.nodeName)&&(a.className=a.className.replace(e,"").replace(/\s+/g," ")+" language-"+o);var f=r.textContent;if(!f)return;var l={element:r,language:o,grammar:u,code:f};t.hooks.run("before-highlight",l);if(i&&self.Worker){var c=new Worker(t.filename);c.onmessage=function(e){l.highlightedCode=n.stringify(JSON.parse(e.data),o);t.hooks.run("before-insert",l);l.element.innerHTML=l.highlightedCode;s&&s.call(l.element);t.hooks.run("after-highlight",l)};c.postMessage(JSON.stringify({language:l.language,code:l.code}))}else{l.highlightedCode=t.highlight(l.code,l.grammar,l.language);t.hooks.run("before-insert",l);l.element.innerHTML=l.highlightedCode;s&&s.call(r);t.hooks.run("after-highlight",l)}},highlight:function(e,r,i){var s=t.tokenize(e,r);return n.stringify(t.util.encode(s),i)},tokenize:function(e,n,r){var i=t.Token,s=[e],o=n.rest;if(o){for(var u in o)n[u]=o[u];delete n.rest}e:for(var u in n){if(!n.hasOwnProperty(u)||!n[u])continue;var a=n[u];a=t.util.type(a)==="Array"?a:[a];for(var f=0;f<a.length;++f){var l=a[f],c=l.inside,h=!!l.lookbehind,p=0,d=l.alias;l=l.pattern||l;for(var v=0;v<s.length;v++){var m=s[v];if(s.length>e.length)break e;if(m instanceof i)continue;l.lastIndex=0;var g=l.exec(m);if(g){h&&(p=g[1].length);var y=g.index-1+p,g=g[0].slice(p),b=g.length,w=y+b,E=m.slice(0,y+1),S=m.slice(w+1),x=[v,1];E&&x.push(E);var T=new i(u,c?t.tokenize(g,c):g,d);x.push(T);S&&x.push(S);Array.prototype.splice.apply(s,x)}}}}return s},hooks:{all:{},add:function(e,n){var r=t.hooks.all;r[e]=r[e]||[];r[e].push(n)},run:function(e,n){var r=t.hooks.all[e];if(!r||!r.length)return;for(var i=0,s;s=r[i++];)s(n)}}},n=t.Token=function(e,t,n){this.type=e;this.content=t;this.alias=n};n.stringify=function(e,r,i){if(typeof e=="string")return e;if(Object.prototype.toString.call(e)=="[object Array]")return e.map(function(t){return n.stringify(t,r,e)}).join("");var s={type:e.type,content:n.stringify(e.content,r,i),tag:"span",classes:["token",e.type],attributes:{},language:r,parent:i};s.type=="comment"&&(s.attributes.spellcheck="true");if(e.alias){var o=t.util.type(e.alias)==="Array"?e.alias:[e.alias];Array.prototype.push.apply(s.classes,o)}t.hooks.run("wrap",s);var u="";for(var a in s.attributes)u+=a+'="'+(s.attributes[a]||"")+'"';return"<"+s.tag+' class="'+s.classes.join(" ")+'" '+u+">"+s.content+"</"+s.tag+">"};if(!self.document){if(!self.addEventListener)return self.Prism;self.addEventListener("message",function(e){var n=JSON.parse(e.data),r=n.language,i=n.code;self.postMessage(JSON.stringify(t.util.encode(t.tokenize(i,t.languages[r]))));self.close()},!1);return self.Prism}var r=document.getElementsByTagName("script");r=r[r.length-1];if(r){t.filename=r.src;document.addEventListener&&!r.hasAttribute("data-manual")&&document.addEventListener("DOMContentLoaded",t.highlightAll)}return self.Prism}();typeof module!="undefined"&&module.exports&&(module.exports=Prism);;
Prism.languages.markup={comment:/<!--[\w\W]*?-->/g,prolog:/<\?.+?\?>/,doctype:/<!DOCTYPE.+?>/,cdata:/<!\[CDATA\[[\w\W]*?]]>/i,tag:{pattern:/<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,inside:{tag:{pattern:/^<\/?[\w:-]+/i,inside:{punctuation:/^<\/?/,namespace:/^[\w-]+?:/}},"attr-value":{pattern:/=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,inside:{punctuation:/=|>|"/g}},punctuation:/\/?>/g,"attr-name":{pattern:/[\w:-]+/g,inside:{namespace:/^[\w-]+?:/}}}},entity:/\&#?[\da-z]{1,8};/gi},Prism.hooks.add("wrap",function(t){"entity"===t.type&&(t.attributes.title=t.content.replace(/&amp;/,"&"))});;
Prism.languages.css={comment:/\/\*[\w\W]*?\*\//g,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*{))/gi,inside:{punctuation:/[;:]/g}},url:/url\((["']?).*?\1\)/gi,selector:/[^\{\}\s][^\{\};]*(?=\s*\{)/g,property:/(\b|\B)[\w-]+(?=\s*:)/gi,string:/("|')(\\?.)*?\1/g,important:/\B!important\b/gi,punctuation:/[\{\};:]/g,"function":/[-a-z0-9]+(?=\()/gi},Prism.languages.markup&&(Prism.languages.insertBefore("markup","tag",{style:{pattern:/<style[\w\W]*?>[\w\W]*?<\/style>/gi,inside:{tag:{pattern:/<style[\w\W]*?>|<\/style>/gi,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.css},alias:"language-css"}}),Prism.languages.insertBefore("inside","attr-value",{"style-attr":{pattern:/\s*style=("|').+?\1/gi,inside:{"attr-name":{pattern:/^\s*style/gi,inside:Prism.languages.markup.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/gi,inside:Prism.languages.css}},alias:"language-css"}},Prism.languages.markup.tag));;
Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\w\W]*?\*\//g,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*?(\r?\n|$)/g,lookbehind:!0}],string:/("|')(\\?.)*?\1/g,"class-name":{pattern:/((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/gi,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,"boolean":/\b(true|false)\b/g,"function":{pattern:/[a-z0-9_]+\(/gi,inside:{punctuation:/\(/}},number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,operator:/[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,ignore:/&(lt|gt|amp);/gi,punctuation:/[{}[\];(),.:]/g};;
Prism.languages.javascript=Prism.languages.extend("clike",{keyword:/\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g,number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g}),Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,lookbehind:!0}}),Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{script:{pattern:/<script[\w\W]*?>[\w\W]*?<\/script>/gi,inside:{tag:{pattern:/<script[\w\W]*?>|<\/script>/gi,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.javascript},alias:"language-javascript"}});;
Prism.highlightAll();
