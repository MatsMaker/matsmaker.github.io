(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{"3009944aef5bc6ec0a31":function(e,t,r){"use strict";r.r(t);var n=r("8af190b70a6bc55c6f1b"),a=r.n(n),o=(r("8a2d1b95e05b6a321e74"),r("ab4cb61bcb2dc161defb")),c=r("d7dd51e1bf6bfc2c9c3d"),i=r("e95a63b25fb92ed15721"),s=r("a28fc3c963a1d4d1a2e5"),u=r("1fd9d98b35012b8839cd"),d=r("2e3498e449d79b9ef394"),f=r("74bce0c9b39d7efa1e6d"),l="editTaskPage",b="app/editTask/RESET",p="app/editTask/UPDATE_TASK_REQUEST",v=Object(d.a)({form:"editTask"})(f.a),m=r("d95b0cf107403b178365"),k=r("adc20f99e57c573c589c"),y=r("7edf83707012a871cdfb"),T={isCreating:!1,result:void 0,errors:void 0},g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:T,t=arguments.length>1?arguments[1]:void 0;return Object(y.a)(e,function(e){switch(t.type){case p:e.result=void 0,e.isCreating=!0;break;case"app/editTask/UPDATE_TASK_FAIL":e.isCreating=!1,e.errors=t.error.message;break;case"app/editTask/UPDATE_TASK_SUCCEEDED":e.isCreating=!1,e.result=t.payload,e.errors=void 0;break;case b:e.isCreating=!1,e.result=void 0,e.errors=void 0}})},h=r("d782b72bc5b680c7122c"),E=r("a63b0d047588ea783f61"),S=r.n(E),w=r("8f8aa622d567257d0a5d"),O=function(e){return{type:"app/editTask/UPDATE_TASK_FAIL",error:e}},_=function(e){return{type:"app/editTask/UPDATE_TASK_SUCCEEDED",payload:e}},j=regeneratorRuntime.mark(A),L=regeneratorRuntime.mark(C);function A(e){var t,r,n;return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,t=e.request.id,a.next=4,Object(h.call)(Object(w.b)({headers:{"Content-Type":"application/x-www-form-urlencoded"}}).post,"/edit/".concat(t,"?developer=").concat("developer"),S.a.stringify(e.request,{encode:!0}));case 4:if(r=a.sent,!Object(w.a)(r)){a.next=7;break}throw r.data;case 7:return n=r.data,a.next=10,Object(h.put)(_(n));case 10:a.next=16;break;case 12:return a.prev=12,a.t0=a.catch(0),a.next=16,Object(h.put)(O(a.t0));case 16:case"end":return a.stop()}},j,null,[[0,12]])}function C(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(h.takeLatest)(p,A);case 2:case"end":return e.stop()}},L)}var R,I=C,D=r("369a2015feb3eb249252"),P=function(e){return e[l]||T},x=r("2ab42699bc2d99fcb76e"),U=r("b74a65a6fc6394d57886"),F=r("3dde4251a4e36fb3d2d7"),K=r.n(F),N=r("0b3cb19af78752326f59");function q(e,t,r,n){R||(R="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=e&&e.defaultProps,o=arguments.length-3;if(t||0===o||(t={children:void 0}),t&&a)for(var c in a)void 0===t[c]&&(t[c]=a[c]);else t||(t=a||{});if(1===o)t.children=n;else if(o>1){for(var i=new Array(o),s=0;s<o;s++)i[s]=arguments[s+3];t.children=i}return{$$typeof:R,type:e,key:void 0===r?null:""+r,ref:null,props:t,_owner:null}}var $,H=Object(N.b)(function(e){var t=e.className,r=e.result;return r?q("ul",{className:t},void 0,K()(r,function(e,t){return q("li",{},String(t),t," ",e)})):null}).withConfig({displayName:"FormResults__ResultList",componentId:"ygmr3s-0"})(["li{color:green;}"]),J=r("6542cd13fd5dd1bcffd4"),Q=r("64f6921acb61f3f462ec");function V(e,t,r,n){$||($="function"===typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=e&&e.defaultProps,o=arguments.length-3;if(t||0===o||(t={children:void 0}),t&&a)for(var c in a)void 0===t[c]&&(t[c]=a[c]);else t||(t=a||{});if(1===o)t.children=n;else if(o>1){for(var i=new Array(o),s=0;s<o;s++)i[s]=arguments[s+3];t.children=i}return{$$typeof:$,type:e,key:void 0===r?null:""+r,ref:null,props:t,_owner:null}}function z(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function B(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=[],n=!0,a=!1,o=void 0;try{for(var c,i=e[Symbol.iterator]();!(n=(c=i.next()).done)&&(r.push(c.value),!t||r.length!==t);n=!0);}catch(e){a=!0,o=e}finally{try{n||null==i.return||i.return()}finally{if(a)throw o}}return r}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var G=l,M=V(i.Redirect,{to:"/"}),W=V(x.a,{});var X=Object(s.b)({state:Object(s.a)(P,function(e){return e}),tasks:Object(s.a)(D.b,function(e){return e.taskList}),auth:Object(J.b)()}),Y=Object(c.connect)(X,function(e){return{updateTask:function(t){return e({type:p,request:t})},reset:function(){return e({type:b})}}});t.default=Object(o.compose)(Y,n.memo)(function(e){var t=e.state,r=e.updateTask,o=e.match,c=e.tasks,i=e.auth,s=e.reset;Object(m.a)({key:G,reducer:g}),Object(k.a)({key:G,saga:I});var d,f=B(Object(n.useState)((d=Number(o.params.id),c.find(function(e){return e.id===d}))),1)[0];return t.result&&setTimeout(function(){s()},3e3),f&&i.token?a.a.createElement(a.a.Fragment,null,W,V(Q.a,{className:"edit-form"},void 0,V("div",{},void 0,V(U.a,{},void 0,"Edit task: ",o.params.id),V(u.a,{},void 0,V(v,{className:"edit-task-form",onSubmit:function(e){r(function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),n.forEach(function(t){z(e,t,r[t])})}return e}({token:i.token},e))},errors:t.errors,initialValues:f,isReset:!!t.result})),V(H,{result:t.result})))):M})},"369a2015feb3eb249252":function(e,t,r){"use strict";r.d(t,"b",function(){return c}),r.d(t,"a",function(){return i});var n=r("a28fc3c963a1d4d1a2e5"),a=r("b0bc3e68122dc9015576"),o=r("a237392145f68026c892"),c=function(e){return e[o.a]||a.b},i=function(){return Object(n.a)(c,function(e){return e})}},a237392145f68026c892:function(e,t,r){"use strict";r.d(t,"a",function(){return n}),r.d(t,"b",function(){return a}),r.d(t,"d",function(){return o}),r.d(t,"c",function(){return c}),r.d(t,"e",function(){return i});var n="home",a="app/home/SET_FILTER",o="app/home/TASK_LIST_FETCH_REQUEST",c="app/home/TASK_LIST_FETCH_FAIL",i="app/home/TASK_LIST_FETCH_SUCCEEDED"},b0bc3e68122dc9015576:function(e,t,r){"use strict";r.d(t,"b",function(){return o});var n=r("7edf83707012a871cdfb"),a=r("a237392145f68026c892"),o={taskListIsLoading:!1,taskList:[],loadError:void 0,totalTaskCount:void 0,taskListRequest:{sort_field:"id",sort_direction:"asc",page:0}};t.a=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,t=arguments.length>1?arguments[1]:void 0;return Object(n.a)(e,function(e){switch(t.type){case a.b:e.taskListRequest=t.filter;break;case a.d:e.taskListIsLoading=!0;break;case a.c:e.taskListIsLoading=!1,e.taskList=[],e.loadError=t.payload.message;break;case a.e:e.taskListIsLoading=!1,e.loadError=void 0,e.taskList=t.payload.tasks,e.totalTaskCount=t.payload.total_task_count}})}}}]);