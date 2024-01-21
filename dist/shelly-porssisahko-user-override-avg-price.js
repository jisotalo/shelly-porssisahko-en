/**
 * @license
 * 
 * shelly-porssisahko
 * 
 * (c) Jussi isotalo - http://jisotalo.fi
 * https://github.com/jisotalo/shelly-porssisahko
 * 
 * License: GNU Affero General Public License v3.0 
 */
let C_HIST=24,C_ERRC=3,C_ERRD=120,C_DEF={mode:0,m0:{cmd:0},m1:{lim:0},m2:{per:24,cnt:0,lim:-999,sq:0,m:999},vat:24,day:0,night:0,bk:0,err:0,outs:[0],fh:0,fhCmd:0,inv:0,min:60},_={s:{v:"2.10.1",dn:"",st:0,str:"",cmd:0,chkTs:0,errCnt:0,errTs:0,upTs:0,timeOK:0,configOK:0,fCmdTs:0,fCmd:0,tz:"+02:00",p:{ts:0,now:0,low:0,high:0,avg:0}},p:[],h:[],c:C_DEF},l=!1,i=!1;function r(t,e){e-=t;return 0<=e&&e<3600}function c(t){return Math.floor((t?t.getTime():Date.now())/1e3)}function n(t,e,s){let n=t.toString();for(;n.length<e;)n=s?s+n:" "+n;return n}function a(t){return t.getDate()}function o(t){let e=t.toString();(e="+0000"==(e=e.substring(3+e.indexOf("GMT")))?"Z":e.substring(0,3)+":"+e.substring(3))!=_.s.tz&&(_.s.p.ts=0),_.s.tz=e}function u(t,e){console.log((new Date).toISOString().substring(11)+": "+(e?e+" - ":""),t)}function f(){var t=new Date;_.s.timeOK=2e3<t.getFullYear()?1:0,_.s.dn=Shelly.getComponentConfig("sys").device.name,!_.s.upTs&&_.s.timeOK&&(_.s.upTs=c(t))}function b(t){Shelly.call("KVS.Get",{key:"porssi-config"},function(e,t,s,n){_.c=e?e.value:{},"function"==typeof USER_CONFIG&&(_.c=USER_CONFIG(_.c,_,!0));{e=function(t){_.s.configOK=t?1:0,_.s.chkTs=0,n&&(l=!1,m())};let t=0;if(C_DEF){for(var o in null==_.c.fhCmd&&null!=_.c.fh&&(_.c.fhCmd=_.c.fh),C_DEF)if(void 0===_.c[o])_.c[o]=C_DEF[o],t++;else if("object"==typeof C_DEF[o])for(var i in C_DEF[o])void 0===_.c[o][i]&&(_.c[o][i]=C_DEF[o][i],t++);void 0!==_.c.out&&(_.c.outs=[_.c.out],_.c.out=void 0),C_DEF=null,0<t?Shelly.call("KVS.Set",{key:"porssi-config",value:_.c},function(t,e,s,n){n&&n(0===e)},e):e&&e(!0)}else e&&e(!0)}},t)}function m(){if(!l)if(l=!0,f(),_.s.configOK)if(function(){let t=new Date,e=!1;e=_.s.timeOK&&(0===_.s.p.ts||a(new Date(1e3*_.s.p.ts))!==a(t)),_.s.errCnt>=C_ERRC&&c(t)-_.s.errTs<C_ERRD?(C_ERRD,c(t),_.s.errTs,e=!1):_.s.errCnt>=C_ERRC&&(_.s.errCnt=0);return e}()){let e=new Date;o(e);try{let t=e.getFullYear()+"-"+n(1+e.getMonth(),2,"0")+"-"+n(a(e),2,"0")+"T00:00:00"+_.s.tz.replace("+","%2b");var s=t.replace("T00:00:00","T23:59:59");let l={url:"https://dashboard.elering.ee/api/nps/price/csv?fields=fi&start="+t+"&end="+s,timeout:5,ssl_ca:"*"};e=null,t=null,Shelly.call("HTTP.GET",l,function(e,t,s){l=null;try{if(0!==t||null==e||200!==e.code||!e.body_b64)throw Error("conn.err ("+s+") "+JSON.stringify(e));{e.headers=null,s=e.message=null,_.p=[],_.s.p.high=-999,_.s.p.low=999,e.body_b64=atob(e.body_b64),e.body_b64=e.body_b64.substring(1+e.body_b64.indexOf("\n"));let t=0;for(;0<=t;){e.body_b64=e.body_b64.substring(t);var n=[t=0,0];if(0===(t=1+e.body_b64.indexOf('"',t)))break;n[0]=+e.body_b64.substring(t,e.body_b64.indexOf('"',t)),t=2+e.body_b64.indexOf('"',t),t=2+e.body_b64.indexOf(';"',t),n[1]=+(""+e.body_b64.substring(t,e.body_b64.indexOf('"',t)).replace(",",".")),n[1]=n[1]/10*(100+(0<n[1]?_.c.vat:0))/100;var o=new Date(1e3*n[0]).getHours();n[1]+=7<=o&&o<22?_.c.day:_.c.night,_.p.push(n),_.s.p.avg+=n[1],n[1]>_.s.p.high&&(_.s.p.high=n[1]),n[1]<_.s.p.low&&(_.s.p.low=n[1]),t=e.body_b64.indexOf("\n",t)}e=null,_.s.p.avg=0<_.p.length?_.s.p.avg/_.p.length:0;var i=new Date,r=new Date(1e3*_.p[0][0]);if(a(r)!==a(i))throw Error("date err "+i.toString()+" - "+r.toString());_.s.p.ts=c(i),_.s.p.now=y()}}catch(t){_.s.errCnt+=1,_.s.errTs=c(),_.s.p.ts=0,_.p=[],u(t)}v()})}catch(t){u(t),v()}}else!function(){if(0==_.s.chkTs)return 1;var t=new Date,e=new Date(1e3*_.s.chkTs);return e.getHours()!=t.getHours()||e.getFullYear()!=t.getFullYear()||0<_.s.fCmdTs&&_.s.fCmdTs-c(t)<0||0==_.s.fCmdTs&&_.c.min<60&&t.getMinutes()>=_.c.min&&_.s.cmd+_.c.inv==1}()?l=!1:v();else b(!0)}function d(e){_.c.inv&&(i=!i);let s=0,n=0;for(let t=0;t<_.c.outs.length;t++)!function(o,t){var e="{id:"+o+",on:"+(i?"true":"false")+"}";Shelly.call("Switch.Set",e,function(t,e,s,n){0!=e&&u("error setting output "+o+" "+(i?"ON":"OFF")+": "+e+" - "+s),n(0==e)},t)}(_.c.outs[t],function(t){if(s++,t&&n++,s==_.c.outs.length)if(n==s){for(;_.h.length>=C_HIST;)_.h.splice(0,1);_.h.push([c(),i?1:0]),_.s.cmd=i?1:0,e(!0)}else e(!1)})}function v(){"function"==typeof USER_CONFIG&&(_.c=USER_CONFIG(_.c,_,!1));var t,e,s=new Date;o(s),i=!1;try{function n(t){i!=t&&(_.s.st=12,u("HUOMIO: ohjaus muuttunut käyttäjän skriptin toimesta")),i=t,d(function(t){t&&(_.s.chkTs=c()),l=!1})}0===_.c.mode?(i=1===_.c.m0.cmd,_.s.st=1):_.s.timeOK&&0<_.s.p.ts&&a(new Date(1e3*_.s.p.ts))===a(s)?(_.s.p.now=y(),1===_.c.mode?(i=_.s.p.now<=("avg"==_.c.m1.lim?_.s.p.avg:_.c.m1.lim),_.s.st=i?2:3):2===_.c.mode&&(i=function(){if(0!=_.c.m2.cn){var n=[];for(g=0;g<_.p.length;g+=_.c.m2.per){var o=[];for(ind=g;ind<g+_.c.m2.per&&!(ind>_.p.length-1);ind++)o.push(ind);if(_.c.m2.sq){let e=999,s=0;for(A=0;A<=o.length-_.c.m2.cnt;A++){let t=0;for(h=A;h<A+_.c.m2.cnt;h++)t+=_.p[o[h]][1];t/_.c.m2.cnt<e&&(e=t/_.c.m2.cnt,s=A)}for(A=s;A<s+_.c.m2.cnt;A++)n.push(o[A])}else{for(A=1;A<o.length;A++){var t=o[A];for(h=A-1;0<=h&&_.p[t][1]<_.p[o[h]][1];h--)o[h+1]=o[h];o[h+1]=t}for(A=0;A<_.c.m2.cnt;A++)n.push(o[A])}}var s=c();let e=!1;for(let t=0;t<n.length;t++)if(r(_.p[n[t]][0],s)){e=!0;break}return g=null,A=null,h=null,e}}(),_.s.st=i?5:4,!i&&_.s.p.now<=("avg"==_.c.m2.lim?_.s.p.avg:_.c.m2.lim)&&(i=!0,_.s.st=6),i)&&_.s.p.now>("avg"==_.c.m2.m?_.s.p.avg:_.c.m2.m)&&(i=!1,_.s.st=11)):_.s.timeOK?(_.s.st=7,t=1<<s.getHours(),(_.c.bk&t)==t&&(i=!0)):(i=1===_.c.err,_.s.st=8),_.s.timeOK&&0<_.c.fh&&(e=1<<s.getHours(),(_.c.fh&e)==e)&&(i=(_.c.fhCmd&e)==e,_.s.st=10),i&&_.s.timeOK&&s.getMinutes()>=_.c.min&&(_.s.st=13,i=!1),_.s.timeOK&&0<_.s.fCmdTs&&(0<_.s.fCmdTs-c(s)?(i=1==_.s.fCmd,_.s.st=9):_.s.fCmdTs=0),"function"==typeof USER_OVERRIDE?USER_OVERRIDE(i,_,n):n(i)}catch(t){u(t),l=!1}}let g=0,A=0,h=0;function y(){var e=c();for(let t=0;t<_.p.length;t++)if(r(_.p[t][0],e))return _.p[t][1];throw _.p.length<24&&(_.s.p.ts=0),Error("no price for this hour")}u("shelly-porssisahko v."+_.s.v),u("URL: http://"+(Shelly.getComponentStatus("wifi").sta_ip??"192.168.33.1")+"/script/"+Shelly.getCurrentScriptId()),HTTPServer.registerEndpoint("",function(s,n){try{if(l)return s=null,n.code=503,void n.send();var o=function(t){var e={},s=t.split("&");for(let t=0;t<s.length;t++){var n=s[t].split("=");e[n[0]]=n[1]}return e}(s.query);s=null;let t="application/json",e=(n.code=200,!0);var i="text/html",r="text/javascript";"s"===o.r?(f(),n.body=JSON.stringify(_),e=!1):"r"===o.r?(b(_.s.configOK=!1),_.s.p.ts=0,n.code=204,e=!1):"f"===o.r&&o.ts?(_.s.fCmdTs=+(""+o.ts),_.s.fCmd=+(""+o.c),_.s.chkTs=0,n.code=204,e=!1):o.r?"s.js"===o.r?(n.body=atob("H4sIAAAAAAAACo1W4W7bNhB+FYXrAhJmCKft/thTjbbJ1nVJM9RegaEoFkaiI9o06ZAnt4art8mb5MV2lGRHCdx2f+KY/O7uu7vvjjYKkr/fn6WEcPwYx8+bkEL6IndZuVAWxE2p/HqsjMrAeQqMn7z6PaUsfbGp+HjycnL673jyPv1I/ry7XVurAyi4u727tYTHo6BdMZNlwG9vtAWZSGNU4uVM2t3R2uhHJ0onhTQrvVhqmaA7Y+5uk4iYyXlwxsgd8n/C6qhSW5ksI7kaeLSN+UH6RVkGKC20bBMaGaClm0mOdnN0r1XuQpAs+ry7xWigjdzCawjadFF/yfncHW0RP4dEBtAPLwDKpA77oBYLZK8XeksvFhYw3gyLmoS518sdTUTPtZ85DSBjspMSO2CT5nahbVmChmQeHSiANfnEzy9OOg173J0YEv9/G8tn29ouJESOVgOaB5Cg0pXTedLnr1+N04+f+ELVckDluKWyE3mVyrC2WYIi2jTIgzSFw0NC4ufXrxRSAvLqKPrC0Ix/1jZ3n4VxmcTMrChkKFIYrqRPZHoTKPmJ9IAN5eEhlSIrVDZXeXrQZ5yQNG0A2VGECG2t8m8m52eHh/KzxNSXblkapHyytnKhsxMJkkKPiAIWBhNt7SquVtK8dlgBjQ7GWazxRF6HlLbcnDVO5k1itfbbVOk+7iKUVwG8ttf0uLcXgGfqy8U0ZsYYht8/bC+NoUQAlkhMnT+VWYGlewFC5vnpCtFncdiQLyVZIe21Ihw6zEBgP68VCJ2zijGOTmOIP3LEoDsayxvqTEOs4e6a7SHR4LBVOu0P9a+tmTDKXkMx1L0ea48+6k9NEybqC4xiVem+GzaYKsB0OnfBZ0xAoSydljaLpaI5dott4l8BaEQf33u2qSN4zK9ivONsKT3m8s7lSni1cCv1utAm74SL+D3aaBsMXMYeg19vTk4/1IqNy7FHRj5FvaDPpZGZorWMUUbYoN3RVlrY2FrBKm2UiJ1o1McPjtlQCTcfUSy77Ig2VSIm+y0xIpYNHpuQU++dj94B9ZZE+0FCekrAF6hQclEzbJM5i/tQCRXBeFBVvOXTZoxB40S1SUfeuuXdNEqyoZ5SjazZxuCTAaktjRl6BaW3ydP+cxxtLZqJxjGFVI0acy1muEooG2y/Np1EJbVovnHzwUGfZ9iswe4Q2e++RMHwOjGoqjbiw4Rkj8Skuwas8Xu8x+/lk42sBsmTTRdfJRSPH3Cs2GUTNqZa3RdzL4XWKTp5O754J5rx19N1LDa7fMjm6LjL4xsm3dAVx4HFPXwSly/OOFqCaBqo4lS4cbNtGAo/H+PYA33KSZ+wSjzZUEJ6uIdqg3NUVYHV3wO8bBC/YcB/lPSUtTEnOu53nAjURxTJMYsrCJFvXOnDd6NjV0gbF58iUD9AUznaGYwVljf/vsGARCM1ImIXxRgdvmv5bGfZKem+FO9vsR09guq6L0eEcsV4ucQeqTPnlp2HoX6OwlJbXAoB1iiQlQ76ShsN65TU/xtFhtsxg0frYbdncOsPIW6J5smFejUMfuk/i4+oiDrCOWvuokhYfI0fPBPY5m8vAH5vWU3xZ5Ex6x8wL3SeK/w5ElRdA1cCvc+fH6vnuFSGuC1HXt28RU+5WuHoY63vUZQN/wMZPoY6bwoAAA=="),t=r):"s.css"===o.r?(n.body=atob("H4sIAAAAAAAACo1VS2/jNhD+K8QGBZJsJEvJOnUkNGhPCxRF0Ut7WeyBooYWa4oUSMqPXfi/75B6mHYctBdb5Dz4zTevxf09uSe2ASkPSaeNtcLSZqOJv75ld+T3Hq+IsNpRqUlCGue6YrH4d7xJuUBFf2nxdi1c01cp0+2ssHjH9x+CgbJQkM9//k1+4xyMJp9BgaGS/NVXUrBJhWyf0ozcL9DoO6n0PrHim1DrAr9NDSbBq5Ic8VQfHghFHaalNgW5AcYznk8yb0zZZm10r2qUPrInWGYlkUJB0oBYN64gefoJ2pJwrZx/BuFl6ct8w2kr5KEg/4CpqaIlaek+2YnaNQX59GK83njKs+wnLzZrodAHob3TJeloXQfky26PKl3AfeOEk4DookdHGIM9BuicboNVMGC6O5zrZ+nK61Mp1iqxIHlBuIR9AqouiYO9S4KoIMaH6Z2kXO7RRy1sJ+lhUA/3jlYWBZ22wgntTUBSJ7ZQntOX04q9sNmkKCrg2sDDdKTcgQnJUA4UUvvhQ3l6DnUkRMaztgRqfGZdM0l9pFJT9CCBD9idjaErrWZXiaQVyFhaSc02F1l+TH9eer7mfGTI+HMeOByLyoyamCirpagx4GearZYlYb2xvrw6LTAyM788Bopvn9XAiUgMVMveIdZviVA17FEFs6O7EyAfIaKJkOWhqs6Y55yXc41PVaw7yoQ7BOPAUMEaYBuoP57R8t+Ohviv+AkuPl6EOj+bR1E9Dqa6i/OwNgJr0f8mDlq8c4B+ZN8qi9bchBbxH8HYdioUYaA4gS2+ZqdMT/Smj4GbU+sO5zmAcB6z5wxVtqMG/cwpniKfKnm8RtyTaNcIn66pJGgtekSx9GmlSrR0yKvHmttQYdQQobhQwexIft3AgRvagiVDQL4k8C+gwW7BnjY4JB3cPj1nNazv0OY49EbK2KvzY+vVmVdXF1wY6xLWCFlji1Xrh1HNtugtlk6DYTfSUmmJvG/BOMGonOYABvl+P+NoSFrt0yxD8+EgqYUBNs4DvQuxtVALehtPwBVOtDsfXkDWxvivdORZlxyvGV2ENU7DsUf8LDxlLNTrvA+GcZlFbt+SFNvm2OWVRDaGavkfJAyVe6n4WovtDHQEMEI4vWh9y4ShE1eipJ1fhtPXW3pOmK/gjRfL0HzM5yEa/LhJp2HFRTyk0Hso84ALfI/tDO2C4i5fZZHmalxYaevy7JSPgcFJhmzkI19hKHh1s4xJmTG2cnmZ1UlUPZAbm7D2nWo+Ypd1vfviDh38UvWYbvX1coHmfhYcT13y/cpSHyMblnOkG8ieOH3ymK5TafsW4ftd/HYp/AAEMhq2WQkAAA=="),t="text/css"):"status"===o.r?(n.body=atob("H4sIAAAAAAAACqVSS07DMBS8iuUVLJo2CyQWqSV2CFUqElzgxXbJax07xK8tuU/OwAVyMZxPU6UtbFjYi5nxvJmXJASp0Uwa8H7JcyYlFwmV4agBPMaPC7HOtrD3zFbUEqiWfiZzJVaggABsFEXDo16589oyrw2SHvWeTsbiramzXfNtWYaWYOJq3fFSxqipbVOHa1QpqMRkoKeqKgocBblTelSsAIl0SGQxP0uUHQXvaGDE0W6cSObdXkSi8HBazsZ8sXCCdzqTzvAJSbLlYpaXD1dETvEigKl4bWo8hB5tbwvEtsBclz6Zp2FkeBXi9HMnn4ATSz+4eMIdXIHP7Qqv0PVg29mkTlV9t+JcrJ92q4H5o0Hvm6EnVyL8I/YvAVvny4znpJ3kRq5e4WWJBYlSf774Ox4swi8HtPfR1vP7ZD7QP8yL/z3xAgAA"),t=i):"status.js"===o.r?(n.body=atob("H4sIAAAAAAAACoVW627bNhR+FZntDHKSFTsbBiQSbWy9oENbpFgMbIBhzKxER6xlUhVpZ4Gtf3mUPENfwC+2Q11sy3M6xLHJw3P5+PHwHG5SbpyM9r0x/M9pP1iz3OGU6QcZYUKHG5M/bMQcr5WInX6HUm2Y4cSKOtXQJLm6d97kucoxksqJmWGIlH7yStsTNPe1x+A78gzth7mf+SmXdybxFMWxilZLLo1vhEk5nb3cCD+WI/vlIqfnoGuEik+7b7nWQu+eksXu28z7qjF6oXvRMkbEF1Ly/N344wcqfJCM0Kfd4+7xw4fdI9h+uvn9FrX1tXlIuR+pVOWNxV3OuQTtnMd75aWKecv7x5vXb/6+Hf8xYb5dmzaKsTwBEcvtFoVi+EY4THPDjVmFF2K49yzVfcvCwG4zH6S+UW/FPzzGlwT2Hl0s/kzs9hs7bVpm+IpSiKbN6Hb867iCZqdTP+dZyiKO0Q8aeXOVL5l5DScxFkuOJb937AQP+E8/Cn/+ahmPNfE6A0KuT/wQFzOItx4hBy92T7snabiQXBILingIdcrwebeLzyJ0KQo/50P7j9xSk+w5Yw8nFMzec70QLF+ra8fmQOaz9d0RIUXFh3X2jqVrIRu1tMXbkdp7lqb8oJeIu+S/irMjfoWcqxaq2U3yha20Y1i+ELo8SHBWEXqOzChZAJfguufMXNwPbVijRygBl8w4CSs9IPd5D1YfDsJawN0R3KgvrLRjTPq+j/YErttA3++eHqSsMD7sMT536KusgmlPtTSDiwVGGO8ViX/HK4Ckd874sEwuQHzxS99+Ln8me4bRAEGEbPck1jZ1CHCy5rkWCqgR/tqbTEkAZeQScri6T92uIQAb25IEZSIwR4UiMK7VuvQznpONLS5LOpkGjTqnJuChcRuVbreD+fBg3huQgLsuWfrZSieYl5FLZf2VbCoPV1dXnoSwjU8NYx3SZeOiVI+kCTQ42jQgDwg0INDuXsuGA9CAYbKc8Ol0MpgG5qJZDmG3GFDvBRBak+LgTYI32famKvDWGyl4qvkZEAMwaxCXRiVXmlqjUs1Q3hsE/ZCabtdi0xZYWKE0Ncpej8DEHUyplQX1WB+h60OY57EVQC64zzq2OtmE3m7HMG7n1ju1yjVkz6bO56yVzwgF9RkAMZ1B8J28qPcYl1SbqZfSVr7Gkz4kWgUb94+SDX77tvhvt4MjaWzpoBhB7UGldOCnYjmqy9F1IyDb7XHiKoAepauYa2zIGSeXfssFTE8cnLE4CXtZh4W0nSfdQRgaQqn9gUSyIijjx1Jir8AZXWCgrU6CssSX6djhxDNDqo/uEdaHi2ePQlatPaGz0EBi2U5K0ctNenSkz5z0CM2VNL17DmXYXH9WaRyUrf3lRo7QZxYt7nK1kvH1Cx7bv2oRDWdeQrH9uDZk7EQp05qiuTBo2CrFqW1hRXhh4uGMuFYX1i2vZ5pDW4mP0F9ltEruIviFjhWcy0yXJkVWpzU8ms7u1OZ/7ieQkImvVW4w5h6cwNBAKva4zUfPPoKSOoe73TncDpjDil1sbkQiTvo9XAp7D8onmqPmDphUuS+hz1rEcEBY/h9PrdtRoTlDHAfiRqhuf5kt4NBLgaRGooR+jq9T3C6Vxfywv6IoImYiW4U3kZJawVuMl89HKMtQnugQ/PCTfT/z3kNjkTKHCwc6Zay0Zt956VVvO7N/sdXD8i1Wj6sXXz3J9qPqWVBP7N6KIoDG57367bbpJ8W/+p3on0kLAAA="),t=r):"config"===o.r?(n.body=atob("H4sIAAAAAAAACp1U7U7bMBR9FSvSBPwIaUMHaEot5QeoLWuK1sC0n65jiBvHDrFT1v3eo/QZeIG82JzPNtkAMalV0+t77rk591w7Ad0AzJCUY0NhsDLgj69X0+WV71j6BDoKrRhpEmKAsaFjqf4GdfB5eDmAi3CNMqlQgvQBdCRhBCtAg3EsAgIdqwo0yDJdKbRBCrB8Fwb5iypxlCdZCROZkkDSX2Q8akE3+S7fcUUoJxyIkvAApLYJGeOQ4GglfhYlKN+00KUmifIXDtyv912iooWSx4bgU5tOaapEjCKZlX0NLkzb/gL2qABtWxS2ou+hs1cxVsMBtG1zcHGI4PQxVD1MLXDFeY/SONMSZpzTgrQAraL2eJLvlP5Qht5/c5KmEDgMrQgDDyIt/y88a3F97VhltK16i6JImGXFSJJqBgFRiDLZvA37rMeZxTFKt9DLd1vdhZVQyoRCeqz1Qe0Szf0QNl6RMSik0HaxylP9W5fu2CCTMeVZpmjPATrayqWf2yJduxYMhWdv8t/L6WIyc++W/+Hbt8SMByaOg46edagn6dsNTqae735zZ+6H2ptQrlCK1qinzdBkNO676U3+mXuzXHhgohdgOp+7PvDvPG/6sSV314iv9VKI/o7bZkJ0tkgUFRxsEMt0XyNoj7qhoQ2Hdjd0CS+7gXN43g2MYK/KGTzrMUG7vWBA2HjLz7iicXFlpPmuJ59tYr5fxhZyS3RqFOU72uzCa56wTfnUutilHIGkYGL6MgNmb14VTQ3TY2vmVaPnWlAa07CY9Guo+P0ZGwfvJ9GGVE2vMqVanXzEGOEcwXro/zaKv5jOp5638P/KUrjh2F90HZpi/UWKSc13cLnolV+l76AFx4ziaHz0THkgnk9FQvixYRknR1W5ZUgY2zbNS5zSRMGUPM3ksaFlMbHgD/TxdC2NE22H6vgP2ZOGgt0GAAA="),t=i):"config.js"===o.r?(n.body=atob("H4sIAAAAAAAACoVWbW/bNhD+KwoXuGQtK7JX5INl2tiaFNvaJEOdFQWGYWZkOmatt4hnt4aif9N/0j+2IyXLUpNtX2zdC++Od/c8UhFJcCJ+MgzCNNHgaE6lC4xPFxNYTicqybbgwD6TnORiqVLiJCJG4bSQJXF2ItpaAUoynZzhiUWwE7kjudD7JKQYp4B8X6gV3aVq6fgnnGsQIHu9k6jXs4+sMCfiSu+FwYOm5Ic4XUrCPJUkMv/l9uodv7q5uPx7fvvei0VGmxLTDFSadMswlU3OKst0wdx2vMox9oxYGdIt6JbBiN6nVCWUuKQ+q5IdeoRrGW7kEn1QnpFaJGNCKq+dgFYclCr1UuxbapQqdaLu121/KwdmFsAJCVZpTo0guR/IyehVIPt9Bn2+6AzE1nCXfiGOWnLy0Y5kOonEnYwcjNCoTgtKSF8yLxPLOYgc6MglPmHYJus8dRZV1+82nZ6Dl8ssEqH8KYoo+YgduSPMFik4mUA+NStyu01A2dEb6ebNm+Z5cNReV49neOZfLifM5eqQ/1GvtWpTTF+6PiuPwmDYlobWOZ/WF1utOxcTTy62wos9W1fVF1vNYQNo7N1tesPJRDLOzZ97WMhimYbbWCbgPWxlvp/LSIaQ5ibL4k+LGzOQvxbMw1yXIlxTyaeyCSzrdeDASkaxJrwIJlut28lmVvM6XnaUw7E/xg7U4FFJe9dVUu2czPPOHqP8zB7H/iCMlx3H2PdQ9ZzvcBCpuJ1r6KGiNo4GmczbxpGHisYYJtA1oqIx6oduBSNPPzxXwGgQd4Mck39X2chWhkznl2UowPSeFYbz0kiaVuDwJSvLQFLmvv557mVbbVyqcFrsDH2I5fJyh+N9pzRIXCZKwkiFG+JatsPFmRbSy3JpfC7kSmwjoCwwBGgoTjQUV+Ec3fvVogcVA6KCiN094RyTyrr2mVWNgbZ0LBCWwrjVdtmNucKyGH9Cb57OIgWW2CyLYjrAkOYAUhp/ynVmq9CIXHZI1CI5cwzp7GBp8ZyxWD472DpkZ6x3G24Cr9aItCPqRLXXbfQVT+HX61EbwPw8WgjY7tn71iBbWZSN6wOLOnEwGJ5wbY9jYvNjj7uHtPX/ozYxS2F2gj/FTd0TBFXT/CPaWG25ErDGFn+hvls94vvkvD5m+10hij8LuEMGCyUet2BmtBZDTeoOxGo7wog3WQ8n3OOJFu5YfUQ/8OeAd6hkdKxk1K6k0aHGDiHk4rNQ4NxLuBAg6B/v3/VfnOVZePb2w9ybS5ht5J6TLM21VgME30rdk14F0Rf93+Y3156GXCX3arWngrFg5Puch16I+z1rBZ33ySzn5uKwlolZ5EJEEt8T5FZEkUSeB9ieYJnmw6bE+1R4b9wWH1S+lmPH7AlbINmOv9eHHnwBa2u4os5Qu+BKerHUWtwb1qhpAnc5/H+esF9F9ivJBW4ZIMvTOMPYv4vNJh2k609iu9EycTZSQ+oAvmGlSsTMob7DHZzm1kn2m71KZMIIdknpa3FNgT0+4h39CcwykWv5awL0aWAQItmkjs2hnezb129fsWMOHTL8ilJOliqNadgMWWKIsXEBqui4Kxgevhvw4rQw4yhxGqsecs5pYdLb7VtFKSL7whBekn6m7Gwof+yf+y/h5bmPYcteyBd9s7O2rSP/Fb72qkGTm7cnSPFNo8HMguGUyn8Aduejt60KAAA="),t=r):n.code=404:(n.body=atob("H4sIAAAAAAAACo1SzY7TMBB+FeMDakWTihvajb1CsAf2xAFxRa49bWbr2sYzaVUh3oZn2Bfoi+E02Z8srODieOYbf983k2leuWj5mKDlnddNfwpvwkZB0M0O2AjbmkzAquN19U43jOxBfz7dZSKk0692e7prlkN2eBDMDtQe4ZBiZmFjYAis5AEdt8rBHi1U52CBARmNr8gaD+qt1I3DvbDeECmOaQjRqb9rFvChghKG8SGl4nwC2piO+nV/XoqbrlCITxTZ+ChmjRFthrVqmRNdLJe3OCD1GgWbvCl9f1uVeWz1E6RZGj0fJR6FRttmRc9i3WBIHYt+yiobh3EYkTm3ZlYVseGOyqDBbqHYHb73BKRF480KvFjHPKm/F6jOsP6C3jTL4T51UI0/4TyM6pFCv9zEP00XyjVuXjY5xR9Mvi+r1G3L8b9OB56p0+EkmzGxLgXE4uP1V3XA4OKh9tEaxhjqmHGDocZgfeeAZrJHfBuJ5fzSAwunyvJ3u6K3sBkMw7WHPlKgtKsnqRnMFyYlCO5Di94NFavojvWTbF+U4fsN9fCPvcmC1JRFDqaLPtWUrSq2r+BCXmUl30CdIXljYSb7xuVCyonmjOY/F5b+oPQYtoWwIIXAK0l89EAtAMu+vD4veC8kqS6xPMsN1wl9SYz2i836lmTZ8XHGvwHYLtlMJgQAAA=="),t=i),n.headers=[["Content-Type",t]],e&&n.headers.push(["Content-Encoding","gzip"])}catch(t){u(t),n.code=500}n.send()}),Timer.set(1e4,!0,m),m();

/**
 * Tämä yksinkertainen esimerkki näyttää kuinka voi tehdä vapaasti omia 
 * ohjauslogiikoita. Se asettaa ohjauksen pois, jos tuntihinta on 
 * yli 80% päivän keskiarvosta.
 * 
 * Eli jos keskiarvo on 10 c/kWh, ohjaus laitetaan pois tuntihinnan 
 * ollessa yli 8 c/kWh
 * 
 * Katso lisää:
 * https://github.com/jisotalo/shelly-porssisahko?tab=readme-ov-file#esimerkki-hinnan-ja-keskiarvon-hy%C3%B6dynt%C3%A4minen
 */
function USER_OVERRIDE(cmd, state, callback) {
  try {
    //console.log("Suoritetaan USER_OVERRIDE. Ohjauksen tila ennen: ", cmd);

    if (cmd && state.s.p.now > 0.8 * state.s.p.avg) {
      state.s.str = "Hinta (" + state.s.p.now.toFixed(2) + "c/kWh) on yli 80% keskiarvosta -> ohjaus pois";
      console.log("Hinta (" + state.s.p.now.toFixed(2) + "c/kWh) on yli 80% keskiarvosta -> ohjaus pois");
      cmd = false;

    } else {
      state.s.str = "Keskiarvo-ohjaus: hinta OK -> ei muutosta";
    }

    //console.log("USER_OVERRIDE suoritettu. Ohjauksen tila nyt: ", cmd);
    callback(cmd);

  } catch (err) {
    console.log("Virhe tapahtui USER_OVERRIDE-funktiossa. Virhe:", err);
    state.s.str = "Keskiarvo-ohjauksen virhe:" + err;
    callback(cmd);
  }
}