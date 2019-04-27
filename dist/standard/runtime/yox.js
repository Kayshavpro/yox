!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).Yox=e()}(this,function(){"use strict";var t=!0,e=!1,n=null,r=void 0,i="component",o="transition",u="length",c="function",a="absoluteKeypath",s="undefined"!=typeof window?window:r,f="undefined"!=typeof document?document:r,p=function(){},v={},d=[],h="";function l(t){return t!==r}var m=Object.prototype.toString;function y(t,e){return"numeric"===e?C(t):m.call(t).toLowerCase()==="[object "+e+"]"}function g(t){return typeof t===c}function x(t){return Array.isArray(t)}function $(t){return t!==n&&"object"==typeof t}function b(t){return"string"==typeof t}function k(t){return"number"==typeof t}function w(t){return"boolean"==typeof t}function C(t){return k(t)||b(t)&&!isNaN(parseFloat(t))&&isFinite(t)}var T=Object.freeze({is:y,func:g,array:x,object:$,string:b,number:k,boolean:w,numeric:C});function E(t,e,n){if(g(t))return x(n)?t.apply(e,n):l(e)?t.call(e,n):l(n)?t(n):t()}var A=function(t,e){this.type=t,this.originalEvent=e};function P(t,n,r){var i=t.length;if(i)if(r)for(var o=i-1;o>=0&&n(t[o],o,t)!==e;o--);else for(var u=0;u<i&&n(t[u],u,t)!==e;u++);}function O(t,e){return t.join(e)}function S(t,e){t[t.length]=e}function j(t,e){t.unshift(e)}function z(t,e,n){x(e)?P(e,function(e){n(t,e)}):n(t,e)}function L(t,e){z(t,e,S)}function N(t,e){z(t,e,j)}function q(t){return x(t)?t:E([].slice,t)}function K(t,e,n){var r={};return P(t,function(t){r[e?t[e]:t]=n||t}),r}function M(t,n,r){var i=-1;return P(t,function(t,o){if(r===e?t==n:t===n)return i=o,e}),i}function I(t,e,n){return M(t,e,n)>=0}function D(t){var e=t.length;if(e>0)return t[e-1]}function U(t){return t.pop()}function Y(n,r,i){var o=0;return P(n,function(t,u){(i===e?t==r:t===r)&&(n.splice(u,1),o++)},t),o}function B(t){return!x(t)||!t.length}A.prototype.preventDefault=function(){if(!this.isPrevented){var e=this.originalEvent;e&&e.preventDefault(),this.isPrevented=t}return this},A.prototype.stopPropagation=function(){if(!this.isStoped){var e=this.originalEvent;e&&e.stopPropagation(),this.isStoped=t}return this},A.prototype.prevent=function(){return this.preventDefault()},A.prototype.stop=function(){return this.stopPropagation()};var F=Object.freeze({each:P,join:O,push:L,unshift:N,toArray:q,toObject:K,indexOf:M,has:I,last:D,pop:U,remove:Y,falsy:B}),H=/-([a-z])/gi,W=/\B([A-Z])/g,G={},J={};function R(t,e,n){return k(n)?e===n?h:t.slice(e,n):t.slice(e)}function Z(t,e,n){return t.indexOf(e,l(n)?n:0)}function _(t,e,n){return t.lastIndexOf(e,l(n)?n:t.length)}function Q(t,e){return Z(t,e)>=0}function V(t,e){return 0===Z(t,e)}function X(t,e){return t.charCodeAt(e||0)}function tt(t){return!b(t)||!t.length}var et=Object.freeze({camelize:function(t){return G[t]||(G[t]=t.replace(H,function(t,e){return e.toUpperCase()})),G[t]},hyphenate:function(t){return J[t]||(J[t]=t.replace(W,function(t,e){return"-"+e.toLowerCase()})),J[t]},trim:function(t){return tt(t)?h:t.trim()},slice:R,indexOf:Z,lastIndexOf:_,has:Q,startsWith:V,endsWith:function(t,e){var n=t.length-e.length;return n>=0&&_(t,e)===n},charAt:function(t,e){return t.charAt(e||0)},codeAt:X,falsy:tt}),nt=".",rt={},it={};function ot(t,e){return t===e?e.length:V(t,e+=nt)?e.length:-1}function ut(t,n){for(var r=b(rt[t])?rt[t]:rt[t]=t.split(nt),i=0,o=r.length-1;i<=o&&n(r[i],i===o)!==e;i++);}function ct(t,e){return t&&e?t+nt+e:t||e}function at(t){return Q(t,"*")}function st(t,e){var n=it[e];n||(n=e.replace(/\./g,"\\.").replace(/\*\*/g,"([.\\w]+?)").replace(/\*/g,"(\\w+)"),n=it[e]=new RegExp("^"+n+"$"));var r=t.match(n);if(r)return r[1]}function ft(t){return Object.keys(t)}function pt(t){return!$(t)||x(t)||!ft(t).length}function vt(t,e){return t.length-e.length}function dt(t,e){return e.length-t.length}function ht(t,e){return ft(t).sort(e?dt:vt)}function lt(t,n){for(var r in t)if(n(t[r],r)===e)break}function mt(t,e){return l(t[e])||t.hasOwnProperty(e)}function yt(t){lt(t,function(e,n){delete t[n]})}function gt(t){for(var e=[],n=arguments.length-1;n-- >0;)e[n]=arguments[n+1];return P(e,function(e){lt(e,function(e,n){t[n]=e})}),t}function xt(t,e){var n=t;return x(t)?e?(n=[],P(t,function(t,r){n[r]=xt(t,e)})):n=t.slice():$(t)&&(n={},lt(t,function(t,r){n[r]=e?xt(t,e):t})),n}var $t={};function bt(t,i){return ut(i,function(i,o){if(t==n)return t=r,e;var u=t[i],c=l(u)||t.hasOwnProperty(i);u&&g(u.get)&&(u=u.get()),o?c?($t.value=u,t=$t):t=r:t=u}),t}function kt(t,n,r,i){ut(n,function(n,o){if(o)t[n]=r;else if(t[n])t=t[n];else{if(!i)return e;t=t[n]={}}})}var wt=Object.freeze({keys:ft,falsy:pt,sort:ht,each:lt,has:mt,clear:yt,extend:gt,copy:xt,get:bt,set:kt});function Ct(t,e){return t!=n&&t.toString?t.toString():l(e)?e:h}var Tt="undefined"!=typeof console?console:n,Et=/yox/.test(Ct(p));function At(){if(s){var t=s.DEBUG;if(w(t))return t}return Et}function Pt(t){Tt&&At()&&Tt.warn("[Yox warn]: "+t)}var Ot=Object.freeze({log:function(t){Tt&&At()&&Tt.log("[Yox log]: "+t)},warn:Pt,error:function(t){Tt&&Tt.error("[Yox error]: "+t)},fatal:function(t){throw new Error("[Yox fatal]: "+t)}}),St=function(t){this.ns=t||e,this.listeners={}};function jt(t,e){var n={name:e,ns:h};if(t){var r=Z(e,".");r>=0&&(n.name=R(e,0,r),n.ns=R(e,r+1))}return n}function zt(e){return $(e)?function(t){return e===t}:g(e)?function(t){return e===t.fn}:function(e){return t}}function Lt(t,e){return!t.length||t===e.ns}function Nt(t){return g(t)&&/native code/.test(Ct(t))}St.prototype.fire=function(n,r,i){var o,u,c;n instanceof A?(o=n,u=n.type,c=$(r)?[o,r]:o):(u=n,r&&(c=r));var a=this,s=jt(a.ns,u),f=s.name,p=s.ns,v=a.listeners[f],d=t;return v&&P(xt(v),function(t,n,s){if((i?i(t,r):Lt(p,t))&&I(s,t)){o&&(o.listener=t.fn);var f=E(t.fn,t.ctx,c);return t.num=t.num?t.num+1:1,t.num===t.max&&a.off(u,t),o&&(f===e?o.prevent().stop():o.isStoped&&(f=e)),f===e?d=e:void 0}}),d},St.prototype.has=function(n,r){var i=this.listeners,o=jt(this.ns,n),u=o.name,c=o.ns,a=t,s=zt(r),f=function(t){return P(t,function(t){if(s(t)&&Lt(c,t))return a=e}),a};return u?i[u]&&f(i[u]):c&&lt(i,f),!a},St.prototype.on=function(t,e,n){var r=this,i=r.listeners,o=function(t,e){if(t){var o=g(t)?{fn:t}:t;if($(o)&&g(o.fn)){n&&gt(o,n);var u=jt(r.ns,e),c=u.name,a=u.ns;return o.ns=a,void L(i[c]||(i[c]=[]),o)}}};b(t)?o(e,t):lt(t,o)},St.prototype.off=function(e,n){var r=this.listeners;if(e){var i=jt(this.ns,e),o=i.name,u=i.ns,c=zt(n),a=function(e,n){P(e,function(t,e,n){c(t)&&Lt(u,t)&&n.splice(e,1)},t),e.length||delete r[n]};o?r[o]&&a(r[o],o):u&&lt(r,a)}else this.listeners={}},typeof setImmediate===c&&Nt(setImmediate)&&setImmediate;var qt,Kt=typeof MessageChannel===c&&Nt(MessageChannel)?function(t){var e=new MessageChannel;e.port1.onmessage=t,e.port2.postMessage(1)}:setTimeout,Mt=function(){this.nextTasks=[]};Mt.shared=function(){return qt||(qt=new Mt),qt},Mt.prototype.append=function(t){L(this.nextTasks,t),this.start()},Mt.prototype.prepend=function(t){N(this.nextTasks,t),this.start()},Mt.prototype.start=function(){var t=this;1===t.nextTasks.length&&Kt(function(){t.run()})},Mt.prototype.clear=function(){this.nextTasks.length=0},Mt.prototype.run=function(){var t=this.nextTasks;t.length&&(this.nextTasks=[],P(t,E))};var It="$slot_",Dt="lazy",Ut="model",Yt="event",Bt="binding",Ft="$id",Ht="$vnode",Wt="$loading",Gt="$component",Jt="$leaving";function Rt(t,e,n){var r=e.node,i=e.nativeAttrs,o=n&&n.nativeAttrs;if(i||o){var u=i||v,c=o||v;lt(u,function(e,n){c[n]&&e.value===c[n].value||t.attr(r,n,e.value)}),lt(c,function(e,n){u[n]||t.removeAttr(r,n)})}}function Zt(t,e,n){var r=e.node,i=e.nativeProps,o=n&&n.nativeProps;if(i||o){var u=i||v,c=o||v;lt(u,function(e,n){c[n]&&e.value===c[n].value||t.prop(r,n,e.value)}),lt(c,function(e,n){u[n]||t.removeProp(r,n,e.hint)})}}function _t(t,e){var n=t.data,r=t.directives,i=e&&e.directives;if(r||i){var o=n[Gt]||t.node,u=e&&t.keypath!==e.keypath,c=r||v,a=i||v;lt(c,function(n,r){var i=n.hooks,c=i.bind,s=i.unbind;a[r]?(n.value!==a[r].value||u)&&(s&&s(o,a[r],e),c(o,n,t)):c(o,n,t)}),lt(a,function(t,n){if(!c[n]){var r=t.hooks.unbind;r&&r(o,t,e)}})}}function Qt(t){var e=t.directives;if(e){var n=t.data[Gt]||t.node;lt(e,function(e){var r=e.hooks.unbind;r&&r(n,e,t)})}}function Vt(t,e){var n,r=t.data,i=t.ref,o=t.props,u=t.slots,c=t.context;if(t.isComponent?(n=r[Gt],e&&(o&&n.set(n.checkPropTypes(o)),u&&n.set(u))):n=t.node,i){var a=c.$refs;a&&(a[i]=n)}}function Xt(t,e){return t.tag===e.tag&&t.key===e.key}function te(t,e,n){for(var r,i,o;e<=n;)(i=t[e])&&(o=i.key)&&(r||(r={}),r[o]=e),e++;return r||v}function ee(t,e,n,r){r?t.before(e,n,r):t.append(e,n)}function ne(t,n){if(n){var r=(t.parent||t.context).create(n,t,t.node),i=r.$el;return i&&(t.node=i),t.data[Gt]=r,t.data[Wt]=e,Vt(t),_t(t),r}}var re=0;function ie(){var t={};return t[Ft]=++re,t}function oe(n,r){var o=r.tag,u=r.node,c=r.data,a=r.isComponent,s=r.isComment,f=r.isText,p=r.isStyle,v=r.children,d=r.text,h=r.html,m=r.context;if(!u||!c)if(c=ie(),r.data=c,f)r.node=n.createText(d);else if(s)r.node=n.createComment(d);else if(a){var y=t;m.component(o,function(t){l(c[Wt])?c[Wt]&&(c[Ht]&&(r=c[Ht],delete c[Ht]),pe(r,ne(r,t))):(ne(r,t),y=e)}),y&&(r.node=n.createComment(i),c[Wt]=t)}else u=r.node=n.createElement(r.tag),v?ue(n,u,v):d?n.text(u,d,p):h&&n.html(u,h,p),Rt(n,r),Zt(n,r),Vt(r),_t(r)}function ue(t,e,n,r,i,o){for(var u,c=r||0,a=l(i)?i:n.length-1;c<=a;)oe(t,u=n[c]),ce(t,e,u,o),c++}function ce(e,n,r,i){var o=r.node,u=r.data,c=r.context,a=e.parent(o);if(i?e.before(n,o,i.node):e.append(n,o),!a){var s;if(r.isComponent){var f=u[Gt];f&&(s=function(){pe(r,f)})}else r.isStatic||r.isText||r.isComment||(s=function(){pe(r)});s&&c.nextTick(s,t)}}function ae(t,e,n,r,i){for(var o,u=r||0,c=l(i)?i:n.length-1;u<=c;)(o=n[u])&&se(t,e,o),u++}function se(t,e,n){var i=n.node;if(n.isStatic||n.isText||n.isComment)t.remove(e,i);else{var o,u=function(){fe(t,n),t.remove(e,i)};if(n.isComponent&&!(o=n.data[Gt]))return void u();!function(t,e,n){var i=t.data,o=t.transition;e&&!o&&(o=e.$vnode.transition);if(o){var u=o.leave;if(u)return void u(t.node,i[Jt]=function(){i[Jt]&&(n(),i[Jt]=r)})}n()}(n,o,u)}}function fe(t,n){var r=n.data,i=n.children,o=n.parent;n.context;if(!o||!o.$vnode||o===n.context)if(n.isComponent){var u=r[Gt];u?(Qt(n),u.destroy()):r[Wt]=e}else Qt(n),i&&P(i,function(e){fe(t,e)})}function pe(t,e){var n=t.data,r=t.transition;if(e&&!r&&(r=e.$vnode.transition),E(n[Jt]),r){var i=r.enter;if(i)return void i(t.node,p)}}function ve(t,e,n){if(e!==n){var i=n.node,o=n.data;if(!Xt(e,n)){var u=t.parent(i);return oe(t,e),void(u&&(ce(t,u,e,n),se(t,u,n)))}if(e.node=i,e.data=o,n.isComponent&&o[Wt])o[Ht]=e;else if(!e.isStatic||!n.isStatic){Rt(t,e,n),Zt(t,e,n),Vt(e,n),_t(e,n);var c=e.text,a=e.html,s=e.children,f=e.isStyle,p=n.text,v=n.html,d=n.children;b(c)?c!==p&&t.text(i,c,f):b(a)?a!==v&&t.html(i,a,f):s&&d?s!==d&&function(t,e,n,i){for(var o,u,c=0,a=n.length-1,s=n[c],f=n[a],p=0,v=i.length-1,d=i[p],h=i[v];p<=v&&c<=a;)s?f?d?h?Xt(s,d)?(ve(t,s,d),s=n[++c],d=i[++p]):Xt(f,h)?(ve(t,f,h),f=n[--a],h=i[--v]):Xt(f,d)?(ve(t,f,d),ee(t,e,d.node,t.next(h.node)),f=n[--a],d=i[++p]):Xt(s,h)?(ve(t,s,h),ee(t,e,h.node,d.node),s=n[++c],h=i[--v]):(o||(o=te(i,p,v)),l(u=s.key?o[s.key]:r)?(ve(t,s,i[u]),i[u]=r):oe(t,s),ce(t,e,s,d),s=n[++c]):h=i[--v]:d=i[++p]:f=n[--a]:s=n[++c];p>v?ue(t,e,n,c,a,n[a+1]):c>a&&ae(t,e,i,p,v)}(t,i,s,d):s?((b(p)||b(v))&&t.text(i,h,f),ue(t,i,s)):d?ae(t,i,d):(b(p)||b(v))&&t.text(i,h,f)}}}function de(t,e){return C(t)?+t:l(e)?e:0}var he={"+":{exec:function(t){return+t}},"-":{exec:function(t){return-t}},"~":{exec:function(t){return~t}},"!":{exec:function(t){return!t}},"!!":{exec:function(t){return!!t}}},le={"*":{prec:14,exec:function(t,e){return t*e}},"/":{prec:14,exec:function(t,e){return t/e}},"%":{prec:14,exec:function(t,e){return t%e}},"+":{prec:13,exec:function(t,e){return t+e}},"-":{prec:13,exec:function(t,e){return t-e}},"<<":{prec:12,exec:function(t,e){return t<<e}},">>":{prec:12,exec:function(t,e){return t>>e}},">>>":{prec:12,exec:function(t,e){return t>>>e}},"<":{prec:11,exec:function(t,e){return t<e}},"<=":{prec:11,exec:function(t,e){return t<=e}},">":{prec:11,exec:function(t,e){return t>e}},">=":{prec:11,exec:function(t,e){return t>=e}},"==":{prec:10,exec:function(t,e){return t==e}},"!=":{prec:10,exec:function(t,e){return t!=e}},"===":{prec:10,exec:function(t,e){return t===e}},"!==":{prec:10,exec:function(t,e){return t!==e}},"&":{prec:9,exec:function(t,e){return t&e}},"^":{prec:8,exec:function(t,e){return t^e}},"|":{prec:7,exec:function(t,e){return t|e}},"&&":{prec:6,exec:function(t,e){return t&&e}},"||":{prec:5,exec:function(t,e){return t||e}},"->":{prec:0,exec:function(t,e){return t>e?function(n){for(var r=t,i=0;r>e;r--)n(r,i++)}:function(n){for(var r=t,i=0;r<e;r++)n(r,i++)}}},"=>":{prec:0,exec:function(t,e){return t>e?function(n){for(var r=t,i=0;r>=e;r--)n(r,i++)}:function(n){for(var r=t,i=0;r<=e;r++)n(r,i++)}}}},me=2,ye=3,ge=4,xe=13;function $e(t){return t===r}be=h,JSON.stringify(be),O(["c","d","e","f","g","a","h","i","b"],",");var be,ke={};function we(t,e,n){return ke[t.type](t,e,n)}function Ce(t,e,n,r){(t[e]||(t[e]={}))[n]=r}function Te(n,i,u,c,s,f){var p,d=h,l={$keypath:d},m=[d,l],y=[],b={},k=function(t,r,o,u,c,a){var s=ct(t[r],o),f=t[r+1];if(u.absoluteKeypath=s,$e(a)&&(a=s),p&&mt(p,o))return p[o];if(mt(f,o))return f[o];if(mt(f,"$item")){if(f=f.$item,o===h)return f;if(f&&mt(f,o))return f[o]}var v=n.get(s,k,c);if(v===k){if(u.lookup!==e&&r>1)return k(t,r-=2,o,u,c,a);if(!(v=bt(i,o)))return u.absoluteKeypath=a,void Pt("data ["+u.raw+"] is not found.");v=v.value}return v},w=function(t,e,r){var i=r||m,o=i.length;return we(t,function(t,n){return k(i,o-2*((n.offset||0)+1),t,n,e)},n)},C=function(e,n){var r=n.expr,i=w(r,t),o=ct(Bt,n.name),u=c[Bt];return u&&Ce(e,"directives",o,{ns:Bt,name:n.name,key:o,hooks:u,binding:r.absoluteKeypath,hint:n.hint}),i},T=function(t){return function(e,r){e.type!==t&&(e=new A(t,e)),n.fire(e,r)}},O=function(t,i,o){return function(u,c){var a,s=n[t];u instanceof A?(i?(p={$event:u,$data:c},a=E(s,n,i(o)),p=r):a=E(s,n,c?[u,c]:u),a===e&&u.prevent().stop()):E(s,n,i?i(o):r)}},S=function(t,e){return function(){return t(e)}},j=function(t,e){var n=w(t);return e?Ct(n):n},z=function(t,e){return w(t,r,e)},N=function(t,e){q(j(t,e))},q=function(e){var r=D(y);if(r){var i=D(r);i&&i.isText?i.text+=e:L(r,{isText:t,text:e,context:n,keypath:d})}},K=function(e,r,i,u){if(r&&(P(r,function(n){var r=n.name,i=n.value;switch(n.type){case me:n.binding&&(i=C(e,n)),e.isComponent?Ce(e,"props",r,i):Ce(e,"nativeAttrs",r,{name:r,value:i});break;case ge:Ce(e,"nativeProps",r,{name:r,value:n.binding?C(e,n):i,hint:n.hint});break;case ye:!function(e,n){var r,i,u,a,f,p=n.ns,v=n.name,d=n.value,h=ct(p,v);switch(p){case Yt:i=c[Yt],a=n.event?T(n.event):O(n.method,n.args,m);break;case o:return void((f=s[d])&&(e.transition=f));case Ut:i=c[Ut],e.model=w(n.expr,t),r=n.expr.absoluteKeypath;break;case Dt:return void Ce(e,"lazy",v,d);default:i=c[v],n.method?a=O(n.method,n.args,m):n.getter&&(u=S(n.getter,m))}i&&Ce(e,"directives",h,{ns:p,name:v,key:h,value:d,binding:r,hooks:i,getter:u,handler:a})}(e,n);break;case xe:!function(t,e){var n=e.expr,r=w(n,e.binding);if($(r)&&!x(r)){lt(r,function(e,n){Ce(t,"props",n,e)});var i=n[a];if(i){var o=ct(Bt,i),u=c[Bt];u&&Ce(t,"directives",o,{ns:Bt,name:h,key:o,hooks:u,binding:ct(i,"*")})}}else Pt("["+n.raw+"] 不是对象，延展个毛啊")}(e,n)}}),e.directives&&!e.lazy&&(e.lazy=v)),i)y.push(e.children=[]),i(),U(y);else if(u){var f={};lt(u,function(t,e){y.push([]),t(),f[e]=U(y)}),e.slots=f}e.context=n,e.keypath=d;var p=D(y);return p&&L(p,e),e},M=function(t,e){var r=D(y),i=n.get(t);i?P(i,function(t){L(r,t),t.parent=n}):e&&e()},I=function(t,e){b[t]=e},Y=function(t){if(b[t])b[t]();else{var e=u[t];e&&e(j,z,N,q,K,M,I,Y,B)}},B=function(t,e,n){var i,o;g(e)?(o=e,i=r):(o=n,i=e);var u=w(t),c=t[a],s=c||ct(d,t.raw),f=function(t,e){var n=d,r=l,u=m;d=ct(s,Ct(e)),l={},L(m=xt(m),d),L(m,l),l.$keypath=d,c||(l.$item=t),i&&(l[i]=e),o(t,e),d=n,l=r,m=u};x(u)?P(u,f):$(u)?lt(u,f):g(u)&&u(f)};return f(j,z,N,q,K,M,I,Y,B)}ke[1]=function(t){return t.value},ke[2]=function(t,e){return e(t.name,t)},ke[3]=function(t,e,n){var i,o,u=t.props,c=t.staticKeypath;if($e(c)){2===(i=u[0]).type?c=i.name:(c=h,o=we(i,e,n));for(var a=1,s=u.length;a<s;a++)c=ct(c,we(u[a],e,n))}return l(o)?(o=bt(o,c))?o.value:r:e?e(c,t):void 0},ke[4]=function(t,e,n){return he[t.op].exec(we(t.a,e,n))},ke[5]=function(t,e,n){return le[t.op].exec(we(t.a,e,n),we(t.b,e,n))},ke[6]=function(t,e,n){return we(t.test,e,n)?we(t.yes,e,n):we(t.no,e,n)},ke[7]=function(t,e,n){return t.nodes.map(function(t){return we(t,e,n)})},ke[8]=function(t,e,n){var r={};return P(t.keys,function(i,o){r[i]=we(t.values[o],e,n)}),r},ke[9]=function(t,e,n){return E(we(t.name,e,n),n,t.args.map(function(t){return we(t,e,n)}))};var Ee={sync:t},Ae={sync:e},Pe=function(e,n,r,i,o,u,c){var a=this;a.keypath=e,a.sync=n,a.cache=r,a.deps=[],a.context=o.context,a.observer=o,a.getter=u,a.setter=c,a.unique={},a.callback=function(n,r,i){var u=a.value,c=a.get(t);c!==u&&o.diff(e,c,u)},(a.fixed=!B(i))&&(P(i,function(t){a.add(t)}),a.bind())};function Oe(t,n){var r;return P(t,function(t){var i=ot(n,t);if(i>=0)return r={name:t,prop:R(n,i)},e}),r}function Se(t,e){if(t==n||e===h)return t;var r=bt(t,e);return r?r.value:void 0}function je(e,n,i,o,c){var a=function(t,n,r){if(n!==r){var i=ct(e,t);P(o,function(t){l(st(i,t))&&c(t,i,n,r)}),je(i,n,r,o,c)}};(function(e,n,i){var o=b(e),c=b(n);if(o||c)return i(u,o?e.length:r,c?n.length:r),t})(n,i,a)||function(e,n,i){var o=x(e),c=x(n);if(o||c){var a=o?e.length:r,s=c?n.length:r;i(u,a,s);for(var f=0,p=Math.max(a||0,s||0);f<p;f++)i(""+f,e?e[f]:r,n?n[f]:r);return t}}(n,i,a)||function(t,e,n){var r=$(t),i=$(e);(r||i)&&(t=r?t:v,e=i?e:v,r&&lt(t,function(t,r){t!==e[r]&&n(r,t,e[r])}),i&&lt(e,function(e,r){e!==t[r]&&n(r,t[r],e)}))}(n,i,a)}function ze(t,e,n,r,i,o){var u;lt(r,function(r,c){if(at(c))l(st(t,c))?o(c,t,e,n):i&&(u?L(u,c):u=[c]);else{var a=ot(c,t);if(a>=0){var s=R(c,a),f=Se(e,s),p=Se(n,s);f!==p&&o(c,c,f,p)}}}),u&&je(t,e,n,u,o)}function Le(t,e){if(t.count&&e)return t.count--,e[0]!==e[1]}function Ne(e){return e===t?{immediate:t}:$(e)?xt(e):{}}Pe.build=function(e,n,r){var i,o,u=t,c=t,a=d;if(g(r)?i=r:$(r)&&(w(r.cache)&&(u=r.cache),w(r.sync)&&(c=r.sync),x(r.deps)&&(a=r.deps),g(r.get)&&(i=r.get),g(r.set)&&(o=r.set)),i)return new Pe(e,c,u,a,n,i,o)},Pe.prototype.get=function(t){var e=this.getter,n=this.context;if(this.cache){if(t||!mt(this,"value"))if(this.fixed)this.value=E(e,n);else{this.unbind();var r=Pe.current;Pe.current=this,this.value=E(e,n),this.bind(),Pe.current=r}}else this.value=E(e,n);return this.value},Pe.prototype.set=function(t){var e=this.setter,n=this.context;e&&e.call(n,t)},Pe.prototype.add=function(e){this.unique[e]=t},Pe.prototype.bind=function(){var t=this.unique,e=this.deps,n=this.observer,r=this.callback,i=this.sync;lt(t,function(t,o){L(e,o),n.watch(o,r,i?Ee:Ae)}),this.unique={}},Pe.prototype.unbind=function(){var e=this.deps,n=this.observer,r=this.callback;P(e,function(t){n.unwatch(t,r)},t),e.length=0};var qe=function(t,e){this.data=t||{},this.context=e||this,this.nextTask=new Mt,this.syncEmitter=new St,this.asyncEmitter=new St,this.asyncChanges={}};qe.prototype.get=function(t,e,n){var r,i,o=Pe.current,u=this.data,c=this.computed,a=this.reversedComputedKeys;if(t===h)return u;if(o&&!n&&o.add(t),c){if(i=c[t])return i.get();if(a){var s=Oe(a,t);s&&s.prop&&(r=bt(c[s.name].get(),s.prop))}}return r||(r=bt(u,t)),r?r.value:e},qe.prototype.set=function(t,e){var n=this,r=n.data,i=n.computed,o=n.reversedComputedKeys,u=function(t,e){var u=n.get(e);if(t!==u){var c;if(i&&((c=i[e])&&c.set(t),o)){var a=Oe(o,e);if(a&&a.prop&&(c=i[a.name])){var s=c.get();($(s)||x(s))&&kt(s,a.prop,t)}}c||kt(r,e,t),n.diff(e,t,u)}};b(t)?u(e,t):$(t)&&lt(t,u)},qe.prototype.diff=function(e,n,i){var o=this,u=o.syncEmitter,c=o.asyncEmitter,a=o.asyncChanges,s=36!==X(e);ze(e,n,i,u.listeners,s,function(t,e,n,r){u.fire(t,[n,r,e])}),ze(e,n,i,c.listeners,s,function(e,n,i,u){P(c.listeners[e],function(t){t.count++});var s=(a[n]||(a[n]={value:u,list:[]})).list;I(s,e)||L(s,e),o.pending||(o.pending=t,o.nextTask.append(function(){o.pending&&(o.pending=r,o.diffAsync())}))})},qe.prototype.diffAsync=function(){var t=this,e=t.asyncEmitter,n=t.asyncChanges;t.asyncChanges={},lt(n,function(n,r){var i=[t.get(r),n.value,r];P(n.list,function(t){e.fire(t,i,Le)})})},qe.prototype.addComputed=function(e,n){var r=Pe.build(e,this,n);if(r)return this.computed||(this.computed={}),this.computed[e]=r,this.reversedComputedKeys=ht(this.computed,t),r},qe.prototype.removeComputed=function(e){var n=this.computed;n&&mt(n,e)&&(delete n[e],this.reversedComputedKeys=ht(n,t))},qe.prototype.watch=function(t,e,n){var i=this,o=i.context,u=i.syncEmitter,c=i.asyncEmitter,a=function(t,e,n){$(e)&&(w(e.immediate)&&(n.immediate=e.immediate),w(e.sync)&&(n.sync=e.sync),w(e.once)&&(n.once=e.once),g(e.watcher)&&(e=e.watcher));var a=n.sync?u:c;if(g(e)){var s={fn:e,ctx:o,count:0};n.once&&(s.max=1),a.on(t,s)}n.immediate&&E(e,o,[i.get(t),r,t])};b(t)?(g(e)||$(e))&&a(t,e,Ne(n)):lt(t,function(t,e){a(e,t,{})})},qe.prototype.unwatch=function(t,e){this.syncEmitter.off(t,e),this.asyncEmitter.off(t,e)},qe.prototype.toggle=function(t){var e=!this.get(t);return this.set(t,e),e},qe.prototype.increase=function(t,e,n){var r=de(this.get(t),0)+(e||1);if(!k(n)||r<=n)return this.set(t,r),r},qe.prototype.decrease=function(t,e,n){var r=de(this.get(t),0)-(e||1);if(!k(n)||r>=n)return this.set(t,r),r},qe.prototype.insert=function(n,r,i){var o=this.get(n),u=(o=x(o)?xt(o):[]).length;if(i===t||i===u)o.push(r);else if(i===e||0===i)o.unshift(r);else{if(!(i>0&&i<u))return;o.splice(i,0,r)}return this.set(n,o),t},qe.prototype.append=function(e,n){return this.insert(e,n,t)},qe.prototype.prepend=function(t,n){return this.insert(t,n,e)},qe.prototype.removeAt=function(e,n){var r=this.get(e);if(x(r)&&n>=0&&n<r.length)return(r=xt(r)).splice(n,1),this.set(e,r),t},qe.prototype.remove=function(e,n){var r=this.get(e);if(x(r)&&Y(r=xt(r),n))return this.set(e,r),t},qe.prototype.copy=function(t,e){return xt(t,e)},qe.prototype.destroy=function(){this.syncEmitter.off(),this.asyncEmitter.off(),this.nextTask.clear(),yt(this)};var Ke=f,Me=function(t,n,r){t.addEventListener(n,r,e)},Ie=function(t,n,r){t.removeEventListener(n,r,e)},De=function(t,e){t.classList.add(e)},Ue=function(t,e){t.classList.remove(e)};Ke&&(Ke.body.classList||(De=function(t,e){var n=t.className.split(Ye);I(n,e)||(L(n,e),t.className=O(n,Ye))},Ue=function(t,e){var n=t.className.split(Ye);Y(n,e)&&(t.className=O(n,Ye))}));var Ye=" ",Be={svg:"http://www.w3.org/2000/svg"},Fe={},He={createElement:function(t,e){return e?Ke.createElementNS(Be.svg,t):Ke.createElement(t)},createText:function(t){return Ke.createTextNode(t)},createComment:function(t){return Ke.createComment(t)},prop:function(t,n,r){if(!l(r))return bt(t,n);kt(t,n,r,e)},removeProp:function(t,n,r){kt(t,n,3===r?e:h,e)},attr:function(t,e,r){if(l(r))t.setAttribute(e,r);else{var i=t.getAttribute(e);if(i!=n)return i}},removeAttr:function(t,e){t.removeAttribute(e)},before:function(t,e,n){t.insertBefore(e,n)},append:function(t,e){t.appendChild(e)},replace:function(t,e,n){t.replaceChild(e,n)},remove:function(t,e){t.removeChild(e)},parent:function(t){var e=t.parentNode;if(e)return e},next:function(t){var e=t.nextSibling;if(e)return e},find:function(t){var e=Ke.querySelector(t);if(e)return e},tag:function(t){if(1===t.nodeType)return t.tagName.toLowerCase()},text:function(t,e,n){if(!l(e))return t.textContent;t.textContent=e},html:function(t,e,n){if(!l(e))return t.innerHTML;t.innerHTML=e},addClass:De,removeClass:Ue,on:function(t,e,n,r){var i=t.$emitter||(t.$emitter=new St),o=i.nativeListeners||(i.nativeListeners={});if(!o[e]){var u=Fe[e],c=function(t){i.fire(t instanceof A?t:new A(t.type,function(t,e){return t}(t)))};o[e]=c,u?u.on(t,c):Me(t,e,c)}i.on(e,{fn:n,ctx:r})},off:function(t,e,n){var i=t.$emitter,o=i.listeners,u=i.nativeListeners;if(i.off(e,n),u&&!i.has(e)){var c=Fe[e],a=u[e];c?c.off(t,a):Ie(t,e,a),delete u[e]}pt(o)&&(t.$emitter=r)},specialEvents:Fe};function We(t,e,n){var i;return function(){if(!i){var o=q(arguments);n&&E(t,r,o),i=setTimeout(function(){i=r,n||E(t,r,o)},e)}}}Fe.input={on:function(n,r){var i=e;He.on(n,"compositionstart",r.compositionstart=function(){i=t}),He.on(n,"compositionend",r.compositionend=function(t){i=e,t.type="input",r(t)}),Me(n,"input",r.input=function(t){i||r(t)})},off:function(t,e){He.off(t,"compositionstart",e.compositionstart),He.off(t,"compositionend",e.compositionend),Ie(t,"input",e.input),e.compositionstart=e.compositionend=e.input=r}};var Ge=K(["click","tap"]),Je={bind:function(e,n,r){var i=n.name,o=n.handler,u=r.lazy[i]||r.lazy[h];if(o)if(u&&(u===t?i="change":o=We(o,u,Ge[i])),r.isComponent){var c=e;c.on(i,o),r.data[n.key]=function(){c.off(i,o)}}else{var a=e;He.on(a,i,o),r.data[n.key]=function(){He.off(a,i,o)}}},unbind:function(t,e,n){E(n.data[e.key])}};function Re(t){return l(t.value)?t.value:t.text}var Ze={sync:t},_e={set:function(t,e,n){t.value=Ct(n.get(e))},sync:function(t,e,n){n.set(e,t.value)},name:"value"},Qe={set:function(t,e,n){t.set(t.$model,n.get(e))},sync:function(t,e,n){n.set(e,t.get(t.$model))},name:"value"},Ve={radio:{set:function(t,e,n){t.checked=t.value===Ct(n.get(e))},sync:function(t,e,n){t.checked&&n.set(e,t.value)},name:"checked"},checkbox:{set:function(t,n,r){var i=r.get(n);t.checked=x(i)?I(i,t.value,e):w(i)?i:!!i},sync:function(t,n,r){var i=r.get(n);x(i)?t.checked?r.append(n,t.value):r.removeAt(n,M(i,t.value,e)):r.set(n,t.checked)},name:"checked"},select:{set:function(t,n,r){var i=r.get(n);P(q(t.options),t.multiple?function(t){t.selected=I(i,Re(t),e)}:function(n,r){if(Re(n)==i)return t.selectedIndex=r,e})},sync:function(t,e,n){var r=q(t.options);if(t.multiple){var i=[];P(r,function(t){t.selected&&L(i,Re(t))}),B(i)&&B(n.get(e))||n.set(e,i)}else n.set(e,Re(r[t.selectedIndex]))},name:"value"}},Xe={bind:function(n,r,i){var o,u,c,a,s=r.binding,f=i.context,p=i.nativeProps,v=i.lazy[Ut]||i.lazy[h],d=function(){m||c.set(o||u,s,f)},l=function(){m=t,c.sync(o||u,s,f),m=e},m=e;v&&v!==t&&(l=We(l,v)),i.isComponent?(c=Qe,(o=n).watch(o.$model,l)):(c=Ve[(u=n).type]||Ve[He.tag(u)],a="change",c||(c=_e,v!==t&&(a="input")),p&&mt(p,c.name)||d(),He.on(u,a,l)),f.watch(s,d,Ze),i.data[r.key]=function(){i.isComponent?o.unwatch(o.$model,l):He.off(u,a,l),f.unwatch(s,d)}},unbind:function(t,e,n){E(n.data[e.key])}},tn={bind:function(t,e,n){var r=e.binding;if(r){var i=at(r),o=function(o,u,c){var a=i?st(c,r):e.name;n.isComponent?t.set(a,o):l(e.hint)?He.prop(t,a,o):He.attr(t,a,o)};n.context.watch(r,o),n.data[e.key]=function(){n.context.unwatch(r,o)}}},unbind:function(t,e,n){E(n.data[e.key])}};var en={},nn={},rn={},on={},un={},cn=/^[#.][-\w+]+$/,an=function n(u){var c=this;$(u)||(u=v),c.$options=u,E(u.beforeCreate,c,u);var a=u.el,s=u.data,f=u.props,p=u.model,d=u.parent,l=u.replace,m=u.computed,y=u.template,x=u.transitions,k=u.components,w=u.directives,C=u.partials,T=u.filters,A=u.slots,P=u.events,O=u.methods,S=u.watchers,j=u.extensions;j&&gt(c,j),p&&(c.$model=p);var z=f?c.checkPropTypes(f):{};A&&gt(z,A),f&&$(s)&&Pt('"data" option expected to be a function.');var L=c.$observer=new qe(z,c);m&&lt(m,function(t,e){L.addComputed(e,t)});var N=g(s)?E(s,c,u):s;$(N)&&lt(N,function(t,e){mt(z,e)?Pt('"'+e+'" is already defined as a prop. Use prop default value instead.'):z[e]=t}),c.$emitter=new St(t);var q,K=e;if(b(y)?cn.test(y)&&(q=He.find(y))&&(y=He.html(q),q=r):y=r,a)if(b(a)){var M=a;cn.test(M)&&(q=He.find(M))}else q=a;q&&!l&&(K=t,He.append(q,q=He.createComment(h))),d&&(c.$parent=d),sn(c,o,x),sn(c,i,k),sn(c,"directive",w),sn(c,"partial",C),sn(c,"filter",T),O&&lt(O,function(t,e){c[e]=t}),E(u.afterCreate,c),y&&(c.$template=n.compile(y),L.addComputed("$template",{sync:e,get:function(){return c.render()}}),(S=S?xt(S):{}).$template=function(t){c.update(t,c.$vnode)},q||(K=t,q=He.createComment(h)),c.update(c.get("$template"),function(t,e,n,r,i){return{tag:t.tag(e),data:ie(),isComment:n,node:e,context:r,keypath:i}}(He,q,K,c,h))),P&&c.on(P),S&&L.nextTask.prepend(function(){c.$observer&&c.watch(S)})};function sn(t,e,n){g(n)?t[e](E(n,t)):$(n)&&t[e](n)}function fn(e,n,i){if(e&&mt(e,n)){var o=e[n];if(g(o)){var u=o.$queue;u?L(u,i):(u=o.$queue=[i],o(function(t){o.$queue=r,e[n]=t,P(u,function(e){e(t)})}))}else i(o);return t}}function pn(t,e,n){return t&&t[e]?t[e]:n?n(e):void 0}function vn(t,e,n,r){b(e)?t[e]=r?r(n):n:lt(e,function(e,n){t[n]=r?r(e):e})}function dn(t,e){return t&&e?gt({},e,t):t||e}return an.use=function(t){t.install(an)},an.nextTick=function(t){Mt.shared().append(t)},an.compile=function(t,e){return new Function("return "+t)()},an.directive=function(t,e){if(b(t)&&!e)return pn(en,t);vn(en,t,e)},an.transition=function(t,e){if(b(t)&&!e)return pn(nn,t);vn(nn,t,e)},an.component=function(t,e){if(b(t)){if(!e)return pn(rn,t);if(g(e))return void fn(rn,t,e)}vn(rn,t,e)},an.partial=function(t,e){if(b(t)&&!e)return pn(on,t);vn(on,t,e,an.compile)},an.filter=function(t,e){if(b(t)&&!e)return pn(un,t);vn(un,t,e)},an.checkPropTypes=function(n,r){var i=xt(n);return lt(r,function(r,o){var u,a=r.type,s=r.value,f=r.required,p=n[o];(g(f)&&(f=f(n)),l(p))?a?(tt(a)?B(a)||P(a,function(n){if(y(p,n))return u=t,e}):u=y(p,a),u!==t&&Pt('The prop "'+o+'" type is not matched.')):Pt('The prop "'+o+'" in propTypes has no type.'):f?Pt('The prop "'+o+'" is marked as required, but its value is not found.'):l(s)&&(i[o]=a===c?s:g(s)?s(n):s)}),i},an.prototype.addComputed=function(t,e){return this.$observer.addComputed(t,e)},an.prototype.removeComputed=function(t){this.$observer.removeComputed(t)},an.prototype.get=function(t,e,n){return this.$observer.get(t,e,n)},an.prototype.set=function(t,e){var n=this.$observer;n&&n.set(t,e)},an.prototype.on=function(t,e){return this.$emitter.on(t,e,{ctx:this}),this},an.prototype.once=function(t,e){return this.$emitter.on(t,e,{ctx:this,max:1}),this},an.prototype.off=function(t,e){return this.$emitter.off(t,e),this},an.prototype.fire=function(e,n,r){var i,o,u=e instanceof A?e:new A(e);return u.target||(u.target=this),$(n)?i=n:n===t&&(r=t),(o=this.$emitter.fire(u,i))&&(r?this.$children&&P(this.$children,function(e){return o=e.fire(u,n,t)}):this.$parent&&(o=this.$parent.fire(u,n))),o},an.prototype.watch=function(t,e,n){return this.$observer.watch(t,e,n),this},an.prototype.watchOnce=function(e,n,r){var i=Ne(r);return i.once=t,this.$observer.watch(e,n,i),this},an.prototype.unwatch=function(t,e){return this.$observer.unwatch(t,e),this},an.prototype.directive=function(t,e){var n=this.$directives;if(b(t)&&!e)return pn(n,t,an.directive);vn(n||(this.$directives={}),t,e)},an.prototype.transition=function(t,e){var n=this.$transitions;if(b(t)&&!e)return pn(n,t,an.transition);vn(n||(this.$transitions={}),t,e)},an.prototype.component=function(t,e){var n=this.$components;if(b(t)){if(!e)return pn(n,t,an.component);if(g(e))return void(fn(n,t,e)||fn(rn,t,e))}vn(n||(this.$components={}),t,e)},an.prototype.partial=function(t,e){var n=this.$partials;if(b(t)&&!e)return pn(n,t,an.partial);vn(n||(this.$partials={}),t,e,an.compile)},an.prototype.filter=function(t,e){var n=this.$filters;if(b(t)&&!e)return pn(n,t,an.filter);vn(n||(this.$filters={}),t,e)},an.prototype.forceUpdate=function(){var e=this.$vnode,n=this.$observer;if(e){var r=n.computed.$template,i=r.get();n.nextTask.run(),i===r.get()&&this.update(r.get(t),e)}},an.prototype.render=function(){return Te(this,dn(this.$filters,un),dn(this.$partials,on),dn(this.$directives,en),dn(this.$transitions,nn),this.$template)},an.prototype.update=function(t,e){var n,r=this,i=r.$vnode,o=r.$options;r.$refs={},i?(E(o.beforeUpdate,r),ve(He,t,e),n=o.afterUpdate):(E(o.beforeMount,r),ve(He,t,e),r.$el=t.node,n=o.afterMount),r.$vnode=t,n&&r.nextTick(function(){r.$vnode&&E(n,r)})},an.prototype.checkPropTypes=function(t){var e=this.$options.propTypes;return e?an.checkPropTypes(t,e):t},an.prototype.create=function(e,n,r){if((e=xt(e)).parent=this,n){r&&(e.el=r,e.replace=t);var i=n.slots,o=n.props,u=n.model;if(i&&(e.slots=i),l(u)){o||(o={});var c=e.model||"value";mt(o,c)||(o[c]=u),e.model=c}e.props=o}var a=new an(e);return L(this.$children||(this.$children=[]),a),a},an.prototype.destroy=function(){var t=this.$options,e=this.$emitter,n=this.$observer;E(t.beforeDestroy,this);var r=this.$vnode,i=this.$parent;i&&i.$children&&Y(i.$children,this),r&&(delete this.$vnode,function(t,e,n){if(n){var r=t.parent(e.node);r&&se(t,r,e)}else fe(t,e)}(He,r,!i)),e.off(),n.destroy(),yt(this),E(t.afterDestroy,this)},an.prototype.nextTick=function(t,e){var n=this.$observer.nextTask;e?n.prepend(t):n.append(t)},an.prototype.toggle=function(t){return this.$observer.toggle(t)},an.prototype.increase=function(t,e,n){return this.$observer.increase(t,e,n)},an.prototype.decrease=function(t,e,n){return this.$observer.decrease(t,e,n)},an.prototype.insert=function(t,e,n){return this.$observer.insert(t,e,n)},an.prototype.append=function(t,e){return this.$observer.append(t,e)},an.prototype.prepend=function(t,e){return this.$observer.prepend(t,e)},an.prototype.removeAt=function(t,e){return this.$observer.removeAt(t,e)},an.prototype.remove=function(t,e){return this.$observer.remove(t,e)},an.prototype.copy=function(t,e){return this.$observer.copy(t,e)},an.version="1.0.0-alpha",an.is=T,an.array=F,an.object=wt,an.string=et,an.logger=Ot,an.Event=A,an.Emitter=St,an.dom=He,an.directive({event:Je,model:Xe,binding:tn}),an.filter({hasSlot:function(t){return l(this.get(It+t))}}),an});
//# sourceMappingURL=yox.js.map
