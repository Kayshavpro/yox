!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).Yox=e()}(this,function(){"use strict";var t=!0,e=!1,n=null,r=void 0,i="component",o="transition",u="length",c="function",a="absoluteKeypath",s="undefined"!=typeof window?window:r,f="undefined"!=typeof document?document:r,p=function(){},v={},h=[],d="";function l(t){return t!==r}var m=Object.prototype.toString;function y(t,e){return"numeric"===e?C(t):m.call(t).toLowerCase()==="[object "+e+"]"}function g(t){return typeof t===c}function x(t){return Array.isArray(t)}function b(t){return t!==n&&"object"==typeof t}function $(t){return"string"==typeof t}function k(t){return"number"==typeof t}function w(t){return"boolean"==typeof t}function C(t){return k(t)||$(t)&&!isNaN(parseFloat(t))&&isFinite(t)}var T=Object.freeze({is:y,func:g,array:x,object:b,string:$,number:k,boolean:w,numeric:C});function E(t,e,n){if(g(t))return x(n)?t.apply(e,n):l(e)?t.call(e,n):l(n)?t(n):t()}var A=function(t,e){this.type=t,this.originalEvent=e};function S(t,n,r){var i=t.length;if(i)if(r)for(var o=i-1;o>=0&&n(t[o],o,t)!==e;o--);else for(var u=0;u<i&&n(t[u],u,t)!==e;u++);}function P(t,e){return t.join(e)}function O(t,e){t[t.length]=e}function j(t,e){t.unshift(e)}function z(t,e,n){x(e)?S(e,function(e){n(t,e)}):n(t,e)}function L(t,e){z(t,e,O)}function N(t,e){z(t,e,j)}function q(t){return x(t)?t:E([].slice,t)}function K(t,e,n){var r={};return S(t,function(t){r[e?t[e]:t]=n||t}),r}function I(t,n,r){var i=-1;return S(t,function(t,o){if(r===e?t==n:t===n)return i=o,e}),i}function M(t,e,n){return I(t,e,n)>=0}function D(t){var e=t.length;if(e>0)return t[e-1]}function U(t){return t.pop()}function B(n,r,i){var o=0;return S(n,function(t,u){(i===e?t==r:t===r)&&(n.splice(u,1),o++)},t),o}function Y(t){return!x(t)||!t.length}A.prototype.preventDefault=function(){if(!this.isPrevented){var e=this.originalEvent;e&&e.preventDefault(),this.isPrevented=t}return this},A.prototype.stopPropagation=function(){if(!this.isStoped){var e=this.originalEvent;e&&e.stopPropagation(),this.isStoped=t}return this},A.prototype.prevent=function(){return this.preventDefault()},A.prototype.stop=function(){return this.stopPropagation()};var F=Object.freeze({each:S,join:P,push:L,unshift:N,toArray:q,toObject:K,indexOf:I,has:M,last:D,pop:U,remove:B,falsy:Y}),H=/-([a-z])/gi,W=/\B([A-Z])/g,G={},J={};function R(t,e,n){return k(n)?e===n?d:t.slice(e,n):t.slice(e)}function V(t,e,n){return t.indexOf(e,l(n)?n:0)}function Z(t,e,n){return t.lastIndexOf(e,l(n)?n:t.length)}function _(t,e){return V(t,e)>=0}function Q(t,e){return 0===V(t,e)}function X(t,e){return t.charCodeAt(e||0)}function tt(t){return!$(t)||!t.length}var et=Object.freeze({camelize:function(t){return G[t]||(G[t]=t.replace(H,function(t,e){return e.toUpperCase()})),G[t]},hyphenate:function(t){return J[t]||(J[t]=t.replace(W,function(t,e){return"-"+e.toLowerCase()})),J[t]},trim:function(t){return tt(t)?d:t.trim()},slice:R,indexOf:V,lastIndexOf:Z,has:_,startsWith:Q,endsWith:function(t,e){var n=t.length-e.length;return n>=0&&Z(t,e)===n},charAt:function(t,e){return t.charAt(e||0)},codeAt:X,falsy:tt}),nt=".",rt={},it={};function ot(t,e){return t===e?e.length:Q(t,e+=nt)?e.length:-1}function ut(t,n){for(var r=$(rt[t])?rt[t]:rt[t]=t.split(nt),i=0,o=r.length-1;i<=o&&n(r[i],i===o)!==e;i++);}function ct(t,e){return t&&e?t+nt+e:t||e}function at(t){return _(t,"*")}function st(t,e){var n=it[e];n||(n=e.replace(/\./g,"\\.").replace(/\*\*/g,"([.\\w]+?)").replace(/\*/g,"(\\w+)"),n=it[e]=new RegExp("^"+n+"$"));var r=t.match(n);if(r)return r[1]}function ft(t){return Object.keys(t)}function pt(t){return!b(t)||x(t)||!ft(t).length}function vt(t,e){return t.length-e.length}function ht(t,e){return e.length-t.length}function dt(t,e){return ft(t).sort(e?ht:vt)}function lt(t,n){for(var r in t)if(n(t[r],r)===e)break}function mt(t,e){return l(t[e])||t.hasOwnProperty(e)}function yt(t){lt(t,function(e,n){delete t[n]})}function gt(t){for(var e=[],n=arguments.length-1;n-- >0;)e[n]=arguments[n+1];return S(e,function(e){lt(e,function(e,n){t[n]=e})}),t}function xt(t,e){var n=t;return x(t)?e?(n=[],S(t,function(t,r){n[r]=xt(t,e)})):n=t.slice():b(t)&&(n={},lt(t,function(t,r){n[r]=e?xt(t,e):t})),n}var bt={};function $t(t,i){return ut(i,function(i,o){if(t==n)return t=r,e;var u=t[i],c=l(u)||t.hasOwnProperty(i);u&&g(u.get)&&(u=u.get()),o?c?(bt.value=u,t=bt):t=r:t=u}),t}function kt(t,n,r,i){ut(n,function(n,o){if(o)t[n]=r;else if(t[n])t=t[n];else{if(!i)return e;t=t[n]={}}})}var wt=Object.freeze({keys:ft,falsy:pt,sort:dt,each:lt,has:mt,clear:yt,extend:gt,copy:xt,get:$t,set:kt});function Ct(t,e){return t!=n&&t.toString?t.toString():l(e)?e:d}var Tt="undefined"!=typeof console?console:n,Et=/yox/.test(Ct(p));function At(){if(s){var t=s.DEBUG;if(w(t))return t}return Et}function St(t){Tt&&At()&&Tt.warn("[Yox warn]: "+t)}var Pt=Object.freeze({log:function(t){Tt&&At()&&Tt.log("[Yox log]: "+t)},warn:St,error:function(t){Tt&&Tt.error("[Yox error]: "+t)},fatal:function(t){throw new Error("[Yox fatal]: "+t)}}),Ot=function(t){this.ns=t||e,this.listeners={}};function jt(t,e){var n={name:e,ns:d};if(t){var r=V(e,".");r>=0&&(n.name=R(e,0,r),n.ns=R(e,r+1))}return n}function zt(e){return b(e)?function(t){return e===t}:g(e)?function(t){return e===t.fn}:function(e){return t}}function Lt(t,e){return!t.length||t===e.ns}function Nt(t){return g(t)&&/native code/.test(Ct(t))}Ot.prototype.fire=function(n,r,i){var o,u,c;n instanceof A?(o=n,u=n.type,c=b(r)?[o,r]:o):(u=n,r&&(c=r));var a=this,s=jt(a.ns,u),f=s.name,p=s.ns,v=a.listeners[f],h=t;return v&&S(xt(v),function(t,n,s){if((i?i(t,r):Lt(p,t))&&M(s,t)){o&&(o.listener=t.fn);var f=E(t.fn,t.ctx,c);return t.num=t.num?t.num+1:1,t.num===t.max&&a.off(u,t),o&&(f===e?o.prevent().stop():o.isStoped&&(f=e)),f===e?h=e:void 0}}),h},Ot.prototype.has=function(n,r){var i=this.listeners,o=jt(this.ns,n),u=o.name,c=o.ns,a=t,s=zt(r),f=function(t){return S(t,function(t){if(s(t)&&Lt(c,t))return a=e}),a};return u?i[u]&&f(i[u]):c&&lt(i,f),!a},Ot.prototype.on=function(t,e,n){var r=this,i=r.listeners,o=function(t,e){if(t){var o=g(t)?{fn:t}:t;if(b(o)&&g(o.fn)){n&&gt(o,n);var u=jt(r.ns,e),c=u.name,a=u.ns;return o.ns=a,void L(i[c]||(i[c]=[]),o)}}};$(t)?o(e,t):lt(t,o)},Ot.prototype.off=function(e,n){var r=this.listeners;if(e){var i=jt(this.ns,e),o=i.name,u=i.ns,c=zt(n),a=function(e,n){S(e,function(t,e,n){c(t)&&Lt(u,t)&&n.splice(e,1)},t),e.length||delete r[n]};o?r[o]&&a(r[o],o):u&&lt(r,a)}else this.listeners={}},typeof setImmediate===c&&Nt(setImmediate)&&setImmediate;var qt,Kt=typeof MessageChannel===c&&Nt(MessageChannel)?function(t){var e=new MessageChannel;e.port1.onmessage=t,e.port2.postMessage(1)}:setTimeout,It=function(){this.nextTasks=[]};It.shared=function(){return qt||(qt=new It),qt},It.prototype.append=function(t){L(this.nextTasks,t),this.start()},It.prototype.prepend=function(t){N(this.nextTasks,t),this.start()},It.prototype.start=function(){var t=this;1===t.nextTasks.length&&Kt(function(){t.run()})},It.prototype.clear=function(){this.nextTasks.length=0},It.prototype.run=function(){var t=this.nextTasks;t.length&&(this.nextTasks=[],S(t,E))};var Mt="$slot_",Dt="lazy",Ut="model",Bt="event",Yt="binding",Ft="$id",Ht="$vnode",Wt="$loading",Gt="$component",Jt="$leaving";function Rt(t,e,n){var r=e.node,i=e.nativeAttrs,o=n&&n.nativeAttrs;if(i||o){var u=i||v,c=o||v;lt(u,function(e,n){c[n]&&e.value===c[n].value||t.attr(r,n,e.value)}),lt(c,function(e,n){u[n]||t.removeAttr(r,n)})}}function Vt(t,e,n){var r=e.node,i=e.nativeProps,o=n&&n.nativeProps;if(i||o){var u=i||v,c=o||v;lt(u,function(e,n){c[n]&&e.value===c[n].value||t.prop(r,n,e.value)}),lt(c,function(e,n){u[n]||t.removeProp(r,n,e.hint)})}}function Zt(t,e){var n=t.data,r=t.directives,i=e&&e.directives;if(r||i){var o=n[Gt]||t.node,u=e&&t.keypath!==e.keypath,c=r||v,a=i||v;lt(c,function(n,r){var i=n.hooks,c=i.bind,s=i.unbind;a[r]?(n.value!==a[r].value||u)&&(s&&s(o,a[r],e),c(o,n,t)):c(o,n,t)}),lt(a,function(t,n){if(!c[n]){var r=t.hooks.unbind;r&&r(o,t,e)}})}}function _t(t){var e=t.directives;if(e){var n=t.data[Gt]||t.node;lt(e,function(e){var r=e.hooks.unbind;r&&r(n,e,t)})}}function Qt(t,e){var n,r=t.data,i=t.ref,o=t.props,u=t.slots,c=t.context;if(t.isComponent?(n=r[Gt],e&&(o&&n.set(n.checkPropTypes(o)),u&&n.set(u))):n=t.node,i){var a=c.$refs;a&&(a[i]=n)}}function Xt(t,e){return t.tag===e.tag&&t.key===e.key}function te(t,e,n){for(var r,i,o;e<=n;)(i=t[e])&&(o=i.key)&&(r||(r={}),r[o]=e),e++;return r||v}function ee(t,e,n,r){r?t.before(e,n,r):t.append(e,n)}function ne(t,n){if(n){var r=(t.parent||t.context).create(n,t,t.node),i=r.$el;return i&&(t.node=i),t.data[Gt]=r,t.data[Wt]=e,Qt(t),Zt(t),r}}var re=0;function ie(){var t={};return t[Ft]=++re,t}function oe(n,r){var o=r.tag,u=r.node,c=r.data,a=r.isComponent,s=r.isComment,f=r.isText,p=r.isStyle,v=r.children,h=r.text,d=r.html,m=r.context;if(!u||!c)if(c=ie(),r.data=c,f)r.node=n.createText(h);else if(s)r.node=n.createComment(h);else if(a){var y=t;m.component(o,function(t){l(c[Wt])?c[Wt]&&(c[Ht]&&(r=c[Ht],delete c[Ht]),pe(r,ne(r,t))):(ne(r,t),y=e)}),y&&(r.node=n.createComment(i),c[Wt]=t)}else u=r.node=n.createElement(r.tag),v?ue(n,u,v):h?n.text(u,h,p):d&&n.html(u,d,p),Rt(n,r),Vt(n,r),Qt(r),Zt(r)}function ue(t,e,n,r,i,o){for(var u,c=r||0,a=l(i)?i:n.length-1;c<=a;)oe(t,u=n[c]),ce(t,e,u,o),c++}function ce(e,n,r,i){var o=r.node,u=r.data,c=r.context,a=e.parent(o);if(i?e.before(n,o,i.node):e.append(n,o),!a){var s;if(r.isComponent){var f=u[Gt];f&&(s=function(){pe(r,f)})}else r.isStatic||r.isText||r.isComment||(s=function(){pe(r)});s&&c.nextTick(s,t)}}function ae(t,e,n,r,i){for(var o,u=r||0,c=l(i)?i:n.length-1;u<=c;)(o=n[u])&&se(t,e,o),u++}function se(t,e,n){var i=n.node;if(n.isStatic||n.isText||n.isComment)t.remove(e,i);else{var o,u=function(){fe(t,n),t.remove(e,i)};if(n.isComponent&&!(o=n.data[Gt]))return void u();!function(t,e,n){var i=t.data,o=t.transition;e&&!o&&(o=e.$vnode.transition);if(o){var u=o.leave;if(u)return void u(t.node,i[Jt]=function(){i[Jt]&&(n(),i[Jt]=r)})}n()}(n,o,u)}}function fe(t,n){var r=n.data,i=n.children,o=n.parent;n.context;if(!o||!o.$vnode||o===n.context)if(n.isComponent){var u=r[Gt];u?(_t(n),u.destroy()):r[Wt]=e}else _t(n),i&&S(i,function(e){fe(t,e)})}function pe(t,e){var n=t.data,r=t.transition;if(e&&!r&&(r=e.$vnode.transition),E(n[Jt]),r){var i=r.enter;if(i)return void i(t.node,p)}}function ve(t,e,n){if(e!==n){var i=n.node,o=n.data;if(!Xt(e,n)){var u=t.parent(i);return oe(t,e),void(u&&(ce(t,u,e,n),se(t,u,n)))}if(e.node=i,e.data=o,n.isComponent&&o[Wt])o[Ht]=e;else if(!e.isStatic||!n.isStatic){Rt(t,e,n),Vt(t,e,n),Qt(e,n),Zt(e,n);var c=e.text,a=e.html,s=e.children,f=e.isStyle,p=n.text,v=n.html,h=n.children;$(c)?c!==p&&t.text(i,c,f):$(a)?a!==v&&t.html(i,a,f):s&&h?s!==h&&function(t,e,n,i){for(var o,u,c=0,a=n.length-1,s=n[c],f=n[a],p=0,v=i.length-1,h=i[p],d=i[v];p<=v&&c<=a;)s?f?h?d?Xt(s,h)?(ve(t,s,h),s=n[++c],h=i[++p]):Xt(f,d)?(ve(t,f,d),f=n[--a],d=i[--v]):Xt(f,h)?(ve(t,f,h),ee(t,e,h.node,t.next(d.node)),f=n[--a],h=i[++p]):Xt(s,d)?(ve(t,s,d),ee(t,e,d.node,h.node),s=n[++c],d=i[--v]):(o||(o=te(i,p,v)),l(u=s.key?o[s.key]:r)?(ve(t,s,i[u]),i[u]=r):oe(t,s),ce(t,e,s,h),s=n[++c]):d=i[--v]:h=i[++p]:f=n[--a]:s=n[++c];p>v?ue(t,e,n,c,a,n[a+1]):c>a&&ae(t,e,i,p,v)}(t,i,s,h):s?(($(p)||$(v))&&t.text(i,d,f),ue(t,i,s)):h?ae(t,i,h):($(p)||$(v))&&t.text(i,d,f)}}}function he(t,e){return C(t)?+t:l(e)?e:0}var de={"+":{exec:function(t){return+t}},"-":{exec:function(t){return-t}},"~":{exec:function(t){return~t}},"!":{exec:function(t){return!t}},"!!":{exec:function(t){return!!t}}},le={"*":{prec:14,exec:function(t,e){return t*e}},"/":{prec:14,exec:function(t,e){return t/e}},"%":{prec:14,exec:function(t,e){return t%e}},"+":{prec:13,exec:function(t,e){return t+e}},"-":{prec:13,exec:function(t,e){return t-e}},"<<":{prec:12,exec:function(t,e){return t<<e}},">>":{prec:12,exec:function(t,e){return t>>e}},">>>":{prec:12,exec:function(t,e){return t>>>e}},"<":{prec:11,exec:function(t,e){return t<e}},"<=":{prec:11,exec:function(t,e){return t<=e}},">":{prec:11,exec:function(t,e){return t>e}},">=":{prec:11,exec:function(t,e){return t>=e}},"==":{prec:10,exec:function(t,e){return t==e}},"!=":{prec:10,exec:function(t,e){return t!=e}},"===":{prec:10,exec:function(t,e){return t===e}},"!==":{prec:10,exec:function(t,e){return t!==e}},"&":{prec:9,exec:function(t,e){return t&e}},"^":{prec:8,exec:function(t,e){return t^e}},"|":{prec:7,exec:function(t,e){return t|e}},"&&":{prec:6,exec:function(t,e){return t&&e}},"||":{prec:5,exec:function(t,e){return t||e}},"->":{prec:0,exec:function(t,e){return t>e?function(n){for(var r=t,i=0;r>e;r--)n(r,i++)}:function(n){for(var r=t,i=0;r<e;r++)n(r,i++)}}},"=>":{prec:0,exec:function(t,e){return t>e?function(n){for(var r=t,i=0;r>=e;r--)n(r,i++)}:function(n){for(var r=t,i=0;r<=e;r++)n(r,i++)}}}},me=2,ye=3,ge=4,xe=13;function be(t){return t===r}$e=d,JSON.stringify($e),P(["c","d","e","f","g","a","h","i","b"],",");var $e,ke={};function we(t,e,n){return ke[t.type](t,e,n)}function Ce(t,e,n,r){(t[e]||(t[e]={}))[n]=r}function Te(n,i,u,c,s,f){var p,h=d,l={$keypath:h},m=[h,l],y=[],$={},k=function(t,r,o,u,c,a){var s=ct(t[r],o),f=t[r+1];if(u.absoluteKeypath=s,be(a)&&(a=s),p&&mt(p,o))return p[o];if(mt(f,o))return f[o];if(mt(f,"$item")){if(f=f.$item,o===d)return f;if(f&&mt(f,o))return f[o]}var v=n.get(s,k,c);if(v===k){if(u.lookup!==e&&r>1)return k(t,r-=2,o,u,c,a);if(!(v=$t(i,o)))return u.absoluteKeypath=a,void St("data ["+u.raw+"] is not found.");v=v.value}return v},w=function(t,e,r){var i=r||m,o=i.length;return we(t,function(t,n){return k(i,o-2*((n.offset||0)+1),t,n,e)},n)},C=function(e,n){var r=n.expr,i=w(r,t),o=ct(Yt,n.name),u=c[Yt];return u&&Ce(e,"directives",o,{ns:Yt,name:n.name,key:o,hooks:u,binding:r.absoluteKeypath,hint:n.hint}),i},T=function(t){return function(e,r){e.type!==t&&(e=new A(t,e)),n.fire(e,r)}},P=function(t,i,o){return function(u,c){var a,s=n[t];u instanceof A?(i?(p={$event:u,$data:c},a=E(s,n,i(o)),p=r):a=E(s,n,c?[u,c]:u),a===e&&u.prevent().stop()):E(s,n,i?i(o):r)}},O=function(t,e){return function(){return t(e)}},j=function(t,e){var n=w(t);return e?Ct(n):n},z=function(t,e){return w(t,r,e)},N=function(t,e){q(j(t,e))},q=function(e){var r=D(y);if(r){var i=D(r);i&&i.isText?i.text+=e:L(r,{isText:t,text:e,context:n,keypath:h})}},K=function(e,r,i,u){if(r&&(S(r,function(n){var r=n.name,i=n.value;switch(n.type){case me:n.binding&&(i=C(e,n)),e.isComponent?Ce(e,"props",r,i):Ce(e,"nativeAttrs",r,{name:r,value:i});break;case ge:Ce(e,"nativeProps",r,{name:r,value:n.binding?C(e,n):i,hint:n.hint});break;case ye:!function(e,n){var r,i,u,a,f,p=n.ns,v=n.name,h=n.value,d=ct(p,v);switch(p){case Bt:i=c[Bt],a=n.event?T(n.event):P(n.method,n.args,m);break;case o:return void((f=s[h])&&(e.transition=f));case Ut:i=c[Ut],e.model=w(n.expr,t),r=n.expr.absoluteKeypath;break;case Dt:return void Ce(e,"lazy",v,h);default:i=c[v],n.method?a=P(n.method,n.args,m):n.getter&&(u=O(n.getter,m))}i&&Ce(e,"directives",d,{ns:p,name:v,key:d,value:h,binding:r,hooks:i,getter:u,handler:a})}(e,n);break;case xe:!function(t,e){var n=e.expr,r=w(n,e.binding);if(b(r)&&!x(r)){lt(r,function(e,n){Ce(t,"props",n,e)});var i=n[a];if(i){var o=ct(Yt,i),u=c[Yt];u&&Ce(t,"directives",o,{ns:Yt,name:d,key:o,hooks:u,binding:ct(i,"*")})}}else St("["+n.raw+"] 不是对象，延展个毛啊")}(e,n)}}),e.directives&&!e.lazy&&(e.lazy=v)),i)y.push(e.children=[]),i(),U(y);else if(u){var f={};lt(u,function(t,e){y.push([]),t(),f[e]=U(y)}),e.slots=f}e.context=n,e.keypath=h;var p=D(y);return p&&L(p,e),e},I=function(t,e){var r=D(y),i=n.get(t);i?S(i,function(t){L(r,t),t.parent=n}):e&&e()},M=function(t,e){$[t]=e},B=function(t){if($[t])$[t]();else{var e=u[t];e&&e(j,z,N,q,K,I,M,B,Y)}},Y=function(t,e,n){var i,o;g(e)?(o=e,i=r):(o=n,i=e);var u=w(t),c=t[a],s=c||ct(h,t.raw),f=function(t,e){var n=h,r=l,u=m;h=ct(s,Ct(e)),l={},L(m=xt(m),h),L(m,l),l.$keypath=h,c||(l.$item=t),i&&(l[i]=e),o(t,e),h=n,l=r,m=u};x(u)?S(u,f):b(u)?lt(u,f):g(u)&&u(f)};return f(j,z,N,q,K,I,M,B,Y)}ke[1]=function(t){return t.value},ke[2]=function(t,e){return e(t.name,t)},ke[3]=function(t,e,n){var i,o,u=t.props,c=t.staticKeypath;if(be(c)){2===(i=u[0]).type?c=i.name:(c=d,o=we(i,e,n));for(var a=1,s=u.length;a<s;a++)c=ct(c,we(u[a],e,n))}return l(o)?(o=$t(o,c))?o.value:r:e?e(c,t):void 0},ke[4]=function(t,e,n){return de[t.op].exec(we(t.a,e,n))},ke[5]=function(t,e,n){return le[t.op].exec(we(t.a,e,n),we(t.b,e,n))},ke[6]=function(t,e,n){return we(t.test,e,n)?we(t.yes,e,n):we(t.no,e,n)},ke[7]=function(t,e,n){return t.nodes.map(function(t){return we(t,e,n)})},ke[8]=function(t,e,n){var r={};return S(t.keys,function(i,o){r[i]=we(t.values[o],e,n)}),r},ke[9]=function(t,e,n){return E(we(t.name,e,n),n,t.args.map(function(t){return we(t,e,n)}))};var Ee={sync:t},Ae={sync:e},Se=function(e,n,r,i,o,u,c){var a=this;a.keypath=e,a.sync=n,a.cache=r,a.deps=[],a.context=o.context,a.observer=o,a.getter=u,a.setter=c,a.unique={},a.callback=function(n,r,i){var u=a.value,c=a.get(t);c!==u&&o.diff(e,c,u)},(a.fixed=!Y(i))&&(S(i,function(t){a.add(t)}),a.bind())};function Pe(t,n){var r;return S(t,function(t){var i=ot(n,t);if(i>=0)return r={name:t,prop:R(n,i)},e}),r}function Oe(t,e){if(t==n||e===d)return t;var r=$t(t,e);return r?r.value:void 0}function je(e,n,i,o,c){var a=function(t,n,r){if(n!==r){var i=ct(e,t);S(o,function(t){l(st(i,t))&&c(t,i,n,r)}),je(i,n,r,o,c)}};(function(e,n,i){var o=$(e),c=$(n);if(o||c)return i(u,o?e.length:r,c?n.length:r),t})(n,i,a)||function(e,n,i){var o=x(e),c=x(n);if(o||c){var a=o?e.length:r,s=c?n.length:r;i(u,a,s);for(var f=0,p=Math.max(a||0,s||0);f<p;f++)i(""+f,e?e[f]:r,n?n[f]:r);return t}}(n,i,a)||function(t,e,n){var r=b(t),i=b(e);(r||i)&&(t=r?t:v,e=i?e:v,r&&lt(t,function(t,r){t!==e[r]&&n(r,t,e[r])}),i&&lt(e,function(e,r){e!==t[r]&&n(r,t[r],e)}))}(n,i,a)}function ze(t,e,n,r,i,o){var u;lt(r,function(r,c){if(at(c))l(st(t,c))?o(c,t,e,n):i&&(u?L(u,c):u=[c]);else{var a=ot(c,t);if(a>=0){var s=R(c,a),f=Oe(e,s),p=Oe(n,s);f!==p&&o(c,c,f,p)}}}),u&&je(t,e,n,u,o)}function Le(t,e){if(t.count&&e)return t.count--,e[0]!==e[1]}function Ne(e){return e===t?{immediate:t}:b(e)?xt(e):{}}Se.build=function(e,n,r){var i,o,u=t,c=t,a=h;if(g(r)?i=r:b(r)&&(w(r.cache)&&(u=r.cache),w(r.sync)&&(c=r.sync),x(r.deps)&&(a=r.deps),g(r.get)&&(i=r.get),g(r.set)&&(o=r.set)),i)return new Se(e,c,u,a,n,i,o)},Se.prototype.get=function(t){var e=this.getter,n=this.context;if(this.cache){if(t||!mt(this,"value"))if(this.fixed)this.value=E(e,n);else{this.unbind();var r=Se.current;Se.current=this,this.value=E(e,n),this.bind(),Se.current=r}}else this.value=E(e,n);return this.value},Se.prototype.set=function(t){var e=this.setter,n=this.context;e&&e.call(n,t)},Se.prototype.add=function(e){this.unique[e]=t},Se.prototype.bind=function(){var t=this.unique,e=this.deps,n=this.observer,r=this.callback,i=this.sync;lt(t,function(t,o){L(e,o),n.watch(o,r,i?Ee:Ae)}),this.unique={}},Se.prototype.unbind=function(){var e=this.deps,n=this.observer,r=this.callback;S(e,function(t){n.unwatch(t,r)},t),e.length=0};var qe=function(t,e){this.data=t||{},this.context=e||this,this.nextTask=new It,this.syncEmitter=new Ot,this.asyncEmitter=new Ot,this.asyncChanges={}};qe.prototype.get=function(t,e,n){var r,i,o=Se.current,u=this.data,c=this.computed,a=this.reversedComputedKeys;if(t===d)return u;if(o&&!n&&o.add(t),c){if(i=c[t])return i.get();if(a){var s=Pe(a,t);s&&s.prop&&(r=$t(c[s.name].get(),s.prop))}}return r||(r=$t(u,t)),r?r.value:e},qe.prototype.set=function(t,e){var n=this,r=n.data,i=n.computed,o=n.reversedComputedKeys,u=function(t,e){var u=n.get(e);if(t!==u){var c;if(i&&((c=i[e])&&c.set(t),o)){var a=Pe(o,e);if(a&&a.prop&&(c=i[a.name])){var s=c.get();(b(s)||x(s))&&kt(s,a.prop,t)}}c||kt(r,e,t),n.diff(e,t,u)}};$(t)?u(e,t):b(t)&&lt(t,u)},qe.prototype.diff=function(e,n,i){var o=this,u=o.syncEmitter,c=o.asyncEmitter,a=o.asyncChanges,s=36!==X(e);ze(e,n,i,u.listeners,s,function(t,e,n,r){u.fire(t,[n,r,e])}),ze(e,n,i,c.listeners,s,function(e,n,i,u){S(c.listeners[e],function(t){t.count++});var s=(a[n]||(a[n]={value:u,list:[]})).list;M(s,e)||L(s,e),o.pending||(o.pending=t,o.nextTask.append(function(){o.pending&&(o.pending=r,o.diffAsync())}))})},qe.prototype.diffAsync=function(){var t=this,e=t.asyncEmitter,n=t.asyncChanges;t.asyncChanges={},lt(n,function(n,r){var i=[t.get(r),n.value,r];S(n.list,function(t){e.fire(t,i,Le)})})},qe.prototype.addComputed=function(e,n){var r=Se.build(e,this,n);if(r)return this.computed||(this.computed={}),this.computed[e]=r,this.reversedComputedKeys=dt(this.computed,t),r},qe.prototype.removeComputed=function(e){var n=this.computed;n&&mt(n,e)&&(delete n[e],this.reversedComputedKeys=dt(n,t))},qe.prototype.watch=function(t,e,n){var i=this,o=i.context,u=i.syncEmitter,c=i.asyncEmitter,a=function(t,e,n){b(e)&&(w(e.immediate)&&(n.immediate=e.immediate),w(e.sync)&&(n.sync=e.sync),w(e.once)&&(n.once=e.once),g(e.watcher)&&(e=e.watcher));var a=n.sync?u:c;if(g(e)){var s={fn:e,ctx:o,count:0};n.once&&(s.max=1),a.on(t,s)}n.immediate&&E(e,o,[i.get(t),r,t])};$(t)?(g(e)||b(e))&&a(t,e,Ne(n)):lt(t,function(t,e){a(e,t,{})})},qe.prototype.unwatch=function(t,e){this.syncEmitter.off(t,e),this.asyncEmitter.off(t,e)},qe.prototype.toggle=function(t){var e=!this.get(t);return this.set(t,e),e},qe.prototype.increase=function(t,e,n){var r=he(this.get(t),0)+(e||1);if(!k(n)||r<=n)return this.set(t,r),r},qe.prototype.decrease=function(t,e,n){var r=he(this.get(t),0)-(e||1);if(!k(n)||r>=n)return this.set(t,r),r},qe.prototype.insert=function(n,r,i){var o=this.get(n),u=(o=x(o)?xt(o):[]).length;if(i===t||i===u)o.push(r);else if(i===e||0===i)o.unshift(r);else{if(!(i>0&&i<u))return;o.splice(i,0,r)}return this.set(n,o),t},qe.prototype.append=function(e,n){return this.insert(e,n,t)},qe.prototype.prepend=function(t,n){return this.insert(t,n,e)},qe.prototype.removeAt=function(e,n){var r=this.get(e);if(x(r)&&n>=0&&n<r.length)return(r=xt(r)).splice(n,1),this.set(e,r),t},qe.prototype.remove=function(e,n){var r=this.get(e);if(x(r)&&B(r=xt(r),n))return this.set(e,r),t},qe.prototype.copy=function(t,e){return xt(t,e)},qe.prototype.destroy=function(){this.syncEmitter.off(),this.asyncEmitter.off(),this.nextTask.clear(),yt(this)};var Ke=f,Ie="textContent",Me=function(t){var e=Ke.querySelector(t);if(e)return e},De=function(t,n,r){t.addEventListener(n,r,e)},Ue=function(t,n,r){t.removeEventListener(n,r,e)},Be=function(t,e){t.classList.add(e)},Ye=function(t,e){t.classList.remove(e)},Fe=function(t,e){return t};if(Ke&&(Ke.body.classList||(Be=function(t,e){var n=t.className.split(Ge);M(n,e)||(L(n,e),t.className=P(n,Ge))},Ye=function(t,e){var n=t.className.split(Ge);B(n,e)&&(t.className=P(n,Ge))}),!Ke.addEventListener)){function He(t){return"INPUT"===t.tagName&&("radio"===t.type||"checkbox"===t.type)}De=function(t,e,n){"input"===e?De(t,"propertychange",n[Je]=function(t){"value"===t.propertyName&&((t=new A(t)).type="input",E(n,this,t))}):"change"===e&&He(t)?De(t,"click",n[Je]=function(t){(t=new A(t)).type="change",E(n,this,t)}):t.attachEvent("on"+e,n)},Ue=function(t,e,n){"input"===e?(Ue(t,"propertychange",n[Je]),delete n[Je]):"change"===e&&He(t)?(Ue(t,"click",n[Je]),delete n[Je]):t.detachEvent("on"+e,n)};var We=function(t,e){gt(this,t),this.currentTarget=e,this.target=t.srcElement||e,this.originalEvent=t};We.prototype.preventDefault=function(){this.originalEvent.returnValue=e},We.prototype.stopPropagation=function(){this.originalEvent.cancelBubble=t},Ie="innerText",Fe=function(t,e){return new We(t,e)},Me=function(t){35===X(t,0)&&(t=R(t,1));var e=Ke.getElementById(t);if(e)return e}}var Ge=" ",Je="$emitter",Re={svg:"http://www.w3.org/2000/svg"},Ve={},Ze={createElement:function(t,e){return e?Ke.createElementNS(Re.svg,t):Ke.createElement(t)},createText:function(t){return Ke.createTextNode(t)},createComment:function(t){return Ke.createComment(t)},prop:function(t,n,r){if(!l(r))return $t(t,n);kt(t,n,r,e)},removeProp:function(t,n,r){kt(t,n,3===r?e:d,e)},attr:function(t,e,r){if(l(r))t.setAttribute(e,r);else{var i=t.getAttribute(e);if(i!=n)return i}},removeAttr:function(t,e){t.removeAttribute(e)},before:function(t,e,n){t.insertBefore(e,n)},append:function(t,e){t.appendChild(e)},replace:function(t,e,n){t.replaceChild(e,n)},remove:function(t,e){t.removeChild(e)},parent:function(t){var e=t.parentNode;if(e)return e},next:function(t){var e=t.nextSibling;if(e)return e},find:Me,tag:function(t){if(1===t.nodeType)return t.tagName.toLowerCase()},text:function(t,e,n){if(!l(e))return t[Ie];n&&l(t.styleSheet)?t.styleSheet.cssText=e:t[Ie]=e},html:function(t,e,n){if(!l(e))return t.innerHTML;n&&l(t.styleSheet)?t.styleSheet.cssText=e:t.innerHTML=e},addClass:Be,removeClass:Ye,on:function(t,e,n,r){var i=t[Je]||(t[Je]=new Ot),o=i.nativeListeners||(i.nativeListeners={});if(!o[e]){var u=Ve[e],c=function(e){i.fire(e instanceof A?e:new A(e.type,Fe(e,t)))};o[e]=c,u?u.on(t,c):De(t,e,c)}i.on(e,{fn:n,ctx:r})},off:function(t,e,n){var i=t[Je],o=i.listeners,u=i.nativeListeners;if(i.off(e,n),u&&!i.has(e)){var c=Ve[e],a=u[e];c?c.off(t,a):Ue(t,e,a),delete u[e]}pt(o)&&(t[Je]=r)},specialEvents:Ve};function _e(t,e,n){var i;return function(){if(!i){var o=q(arguments);n&&E(t,r,o),i=setTimeout(function(){i=r,n||E(t,r,o)},e)}}}Ve.input={on:function(n,r){var i=e;Ze.on(n,"compositionstart",r.compositionstart=function(){i=t}),Ze.on(n,"compositionend",r.compositionend=function(t){i=e,t.type="input",r(t)}),De(n,"input",r.input=function(t){i||r(t)})},off:function(t,e){Ze.off(t,"compositionstart",e.compositionstart),Ze.off(t,"compositionend",e.compositionend),Ue(t,"input",e.input),e.compositionstart=e.compositionend=e.input=r}};var Qe=K(["click","tap"]),Xe={bind:function(e,n,r){var i=n.name,o=n.handler,u=r.lazy[i]||r.lazy[d];if(o)if(u&&(u===t?i="change":o=_e(o,u,Qe[i])),r.isComponent){var c=e;c.on(i,o),r.data[n.key]=function(){c.off(i,o)}}else{var a=e;Ze.on(a,i,o),r.data[n.key]=function(){Ze.off(a,i,o)}}},unbind:function(t,e,n){E(n.data[e.key])}};function tn(t){return l(t.value)?t.value:t.text}var en={sync:t},nn={set:function(t,e,n){t.value=Ct(n.get(e))},sync:function(t,e,n){n.set(e,t.value)},name:"value"},rn={set:function(t,e,n){t.set(t.$model,n.get(e))},sync:function(t,e,n){n.set(e,t.get(t.$model))},name:"value"},on={radio:{set:function(t,e,n){t.checked=t.value===Ct(n.get(e))},sync:function(t,e,n){t.checked&&n.set(e,t.value)},name:"checked"},checkbox:{set:function(t,n,r){var i=r.get(n);t.checked=x(i)?M(i,t.value,e):w(i)?i:!!i},sync:function(t,n,r){var i=r.get(n);x(i)?t.checked?r.append(n,t.value):r.removeAt(n,I(i,t.value,e)):r.set(n,t.checked)},name:"checked"},select:{set:function(t,n,r){var i=r.get(n);S(q(t.options),t.multiple?function(t){t.selected=M(i,tn(t),e)}:function(n,r){if(tn(n)==i)return t.selectedIndex=r,e})},sync:function(t,e,n){var r=q(t.options);if(t.multiple){var i=[];S(r,function(t){t.selected&&L(i,tn(t))}),Y(i)&&Y(n.get(e))||n.set(e,i)}else n.set(e,tn(r[t.selectedIndex]))},name:"value"}},un={bind:function(n,r,i){var o,u,c,a,s=r.binding,f=i.context,p=i.nativeProps,v=i.lazy[Ut]||i.lazy[d],h=function(){m||c.set(o||u,s,f)},l=function(){m=t,c.sync(o||u,s,f),m=e},m=e;v&&v!==t&&(l=_e(l,v)),i.isComponent?(c=rn,(o=n).watch(o.$model,l)):(c=on[(u=n).type]||on[Ze.tag(u)],a="change",c||(c=nn,v!==t&&(a="input")),p&&mt(p,c.name)||h(),Ze.on(u,a,l)),f.watch(s,h,en),i.data[r.key]=function(){i.isComponent?o.unwatch(o.$model,l):Ze.off(u,a,l),f.unwatch(s,h)}},unbind:function(t,e,n){E(n.data[e.key])}},cn={bind:function(t,e,n){var r=e.binding;if(r){var i=at(r),o=function(o,u,c){var a=i?st(c,r):e.name;n.isComponent?t.set(a,o):l(e.hint)?Ze.prop(t,a,o):Ze.attr(t,a,o)};n.context.watch(r,o),n.data[e.key]=function(){n.context.unwatch(r,o)}}},unbind:function(t,e,n){E(n.data[e.key])}};var an={},sn={},fn={},pn={},vn={},hn=/^[#.][-\w+]+$/,dn=function n(u){var c=this;b(u)||(u=v),c.$options=u,E(u.beforeCreate,c,u);var a=u.el,s=u.data,f=u.props,p=u.model,h=u.parent,l=u.replace,m=u.computed,y=u.template,x=u.transitions,k=u.components,w=u.directives,C=u.partials,T=u.filters,A=u.slots,S=u.events,P=u.methods,O=u.watchers,j=u.extensions;j&&gt(c,j),p&&(c.$model=p);var z=f?c.checkPropTypes(f):{};A&&gt(z,A),f&&b(s)&&St('"data" option expected to be a function.');var L=c.$observer=new qe(z,c);m&&lt(m,function(t,e){L.addComputed(e,t)});var N=g(s)?E(s,c,u):s;b(N)&&lt(N,function(t,e){mt(z,e)?St('"'+e+'" is already defined as a prop. Use prop default value instead.'):z[e]=t}),c.$emitter=new Ot(t);var q,K=e;if($(y)?hn.test(y)&&(q=Ze.find(y))&&(y=Ze.html(q),q=r):y=r,a)if($(a)){var I=a;hn.test(I)&&(q=Ze.find(I))}else q=a;q&&!l&&(K=t,Ze.append(q,q=Ze.createComment(d))),h&&(c.$parent=h),ln(c,o,x),ln(c,i,k),ln(c,"directive",w),ln(c,"partial",C),ln(c,"filter",T),P&&lt(P,function(t,e){c[e]=t}),E(u.afterCreate,c),y&&(c.$template=n.compile(y),L.addComputed("$template",{sync:e,get:function(){return c.render()}}),(O=O?xt(O):{}).$template=function(t){c.update(t,c.$vnode)},q||(K=t,q=Ze.createComment(d)),c.update(c.get("$template"),function(t,e,n,r,i){return{tag:t.tag(e),data:ie(),isComment:n,node:e,context:r,keypath:i}}(Ze,q,K,c,d))),S&&c.on(S),O&&L.nextTask.prepend(function(){c.$observer&&c.watch(O)})};function ln(t,e,n){g(n)?t[e](E(n,t)):b(n)&&t[e](n)}function mn(e,n,i){if(e&&mt(e,n)){var o=e[n];if(g(o)){var u=o.$queue;u?L(u,i):(u=o.$queue=[i],o(function(t){o.$queue=r,e[n]=t,S(u,function(e){e(t)})}))}else i(o);return t}}function yn(t,e,n){return t&&t[e]?t[e]:n?n(e):void 0}function gn(t,e,n,r){$(e)?t[e]=r?r(n):n:lt(e,function(e,n){t[n]=r?r(e):e})}function xn(t,e){return t&&e?gt({},e,t):t||e}return dn.use=function(t){t.install(dn)},dn.nextTick=function(t){It.shared().append(t)},dn.compile=function(t,e){return new Function("return "+t)()},dn.directive=function(t,e){if($(t)&&!e)return yn(an,t);gn(an,t,e)},dn.transition=function(t,e){if($(t)&&!e)return yn(sn,t);gn(sn,t,e)},dn.component=function(t,e){if($(t)){if(!e)return yn(fn,t);if(g(e))return void mn(fn,t,e)}gn(fn,t,e)},dn.partial=function(t,e){if($(t)&&!e)return yn(pn,t);gn(pn,t,e,dn.compile)},dn.filter=function(t,e){if($(t)&&!e)return yn(vn,t);gn(vn,t,e)},dn.checkPropTypes=function(n,r){var i=xt(n);return lt(r,function(r,o){var u,a=r.type,s=r.value,f=r.required,p=n[o];(g(f)&&(f=f(n)),l(p))?a?(tt(a)?Y(a)||S(a,function(n){if(y(p,n))return u=t,e}):u=y(p,a),u!==t&&St('The prop "'+o+'" type is not matched.')):St('The prop "'+o+'" in propTypes has no type.'):f?St('The prop "'+o+'" is marked as required, but its value is not found.'):l(s)&&(i[o]=a===c?s:g(s)?s(n):s)}),i},dn.prototype.addComputed=function(t,e){return this.$observer.addComputed(t,e)},dn.prototype.removeComputed=function(t){this.$observer.removeComputed(t)},dn.prototype.get=function(t,e,n){return this.$observer.get(t,e,n)},dn.prototype.set=function(t,e){var n=this.$observer;n&&n.set(t,e)},dn.prototype.on=function(t,e){return this.$emitter.on(t,e,{ctx:this}),this},dn.prototype.once=function(t,e){return this.$emitter.on(t,e,{ctx:this,max:1}),this},dn.prototype.off=function(t,e){return this.$emitter.off(t,e),this},dn.prototype.fire=function(e,n,r){var i,o,u=e instanceof A?e:new A(e);return u.target||(u.target=this),b(n)?i=n:n===t&&(r=t),(o=this.$emitter.fire(u,i))&&(r?this.$children&&S(this.$children,function(e){return o=e.fire(u,n,t)}):this.$parent&&(o=this.$parent.fire(u,n))),o},dn.prototype.watch=function(t,e,n){return this.$observer.watch(t,e,n),this},dn.prototype.watchOnce=function(e,n,r){var i=Ne(r);return i.once=t,this.$observer.watch(e,n,i),this},dn.prototype.unwatch=function(t,e){return this.$observer.unwatch(t,e),this},dn.prototype.directive=function(t,e){var n=this.$directives;if($(t)&&!e)return yn(n,t,dn.directive);gn(n||(this.$directives={}),t,e)},dn.prototype.transition=function(t,e){var n=this.$transitions;if($(t)&&!e)return yn(n,t,dn.transition);gn(n||(this.$transitions={}),t,e)},dn.prototype.component=function(t,e){var n=this.$components;if($(t)){if(!e)return yn(n,t,dn.component);if(g(e))return void(mn(n,t,e)||mn(fn,t,e))}gn(n||(this.$components={}),t,e)},dn.prototype.partial=function(t,e){var n=this.$partials;if($(t)&&!e)return yn(n,t,dn.partial);gn(n||(this.$partials={}),t,e,dn.compile)},dn.prototype.filter=function(t,e){var n=this.$filters;if($(t)&&!e)return yn(n,t,dn.filter);gn(n||(this.$filters={}),t,e)},dn.prototype.forceUpdate=function(){var e=this.$vnode,n=this.$observer;if(e){var r=n.computed.$template,i=r.get();n.nextTask.run(),i===r.get()&&this.update(r.get(t),e)}},dn.prototype.render=function(){return Te(this,xn(this.$filters,vn),xn(this.$partials,pn),xn(this.$directives,an),xn(this.$transitions,sn),this.$template)},dn.prototype.update=function(t,e){var n,r=this,i=r.$vnode,o=r.$options;r.$refs={},i?(E(o.beforeUpdate,r),ve(Ze,t,e),n=o.afterUpdate):(E(o.beforeMount,r),ve(Ze,t,e),r.$el=t.node,n=o.afterMount),r.$vnode=t,n&&r.nextTick(function(){r.$vnode&&E(n,r)})},dn.prototype.checkPropTypes=function(t){var e=this.$options.propTypes;return e?dn.checkPropTypes(t,e):t},dn.prototype.create=function(e,n,r){if((e=xt(e)).parent=this,n){r&&(e.el=r,e.replace=t);var i=n.slots,o=n.props,u=n.model;if(i&&(e.slots=i),l(u)){o||(o={});var c=e.model||"value";mt(o,c)||(o[c]=u),e.model=c}e.props=o}var a=new dn(e);return L(this.$children||(this.$children=[]),a),a},dn.prototype.destroy=function(){var t=this.$options,e=this.$emitter,n=this.$observer;E(t.beforeDestroy,this);var r=this.$vnode,i=this.$parent;i&&i.$children&&B(i.$children,this),r&&(delete this.$vnode,function(t,e,n){if(n){var r=t.parent(e.node);r&&se(t,r,e)}else fe(t,e)}(Ze,r,!i)),e.off(),n.destroy(),yt(this),E(t.afterDestroy,this)},dn.prototype.nextTick=function(t,e){var n=this.$observer.nextTask;e?n.prepend(t):n.append(t)},dn.prototype.toggle=function(t){return this.$observer.toggle(t)},dn.prototype.increase=function(t,e,n){return this.$observer.increase(t,e,n)},dn.prototype.decrease=function(t,e,n){return this.$observer.decrease(t,e,n)},dn.prototype.insert=function(t,e,n){return this.$observer.insert(t,e,n)},dn.prototype.append=function(t,e){return this.$observer.append(t,e)},dn.prototype.prepend=function(t,e){return this.$observer.prepend(t,e)},dn.prototype.removeAt=function(t,e){return this.$observer.removeAt(t,e)},dn.prototype.remove=function(t,e){return this.$observer.remove(t,e)},dn.prototype.copy=function(t,e){return this.$observer.copy(t,e)},dn.version="1.0.0-alpha",dn.is=T,dn.array=F,dn.object=wt,dn.string=et,dn.logger=Pt,dn.Event=A,dn.Emitter=Ot,dn.dom=Ze,dn.directive({event:Xe,model:un,binding:cn}),dn.filter({hasSlot:function(t){return l(this.get(Mt+t))}}),dn});
//# sourceMappingURL=yox.js.map
