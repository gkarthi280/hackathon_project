import{co as a,a8 as l,cn as r,B as g,cp as u,i as c,d as p,p as y}from"./index-CYUBhEOJ.js";function U(t,e="hex"){const s=o(t),i=a(new Uint8Array(s.length));return s.encode(i),e==="hex"?l(i.bytes):i.bytes}function o(t){return Array.isArray(t)?x(t.map(e=>o(e))):B(t)}function x(t){const e=t.reduce((n,h)=>n+h.length,0),s=f(e);return{length:e<=55?1+e:1+s+e,encode(n){e<=55?n.pushByte(192+e):(n.pushByte(247+s),s===1?n.pushUint8(e):s===2?n.pushUint16(e):s===3?n.pushUint24(e):n.pushUint32(e));for(const{encode:h}of t)h(n)}}}function B(t){const e=typeof t=="string"?r(t):t,s=f(e.length);return{length:e.length===1&&e[0]<128?1:e.length<=55?1+e.length:1+s+e.length,encode(n){e.length===1&&e[0]<128?n.pushBytes(e):e.length<=55?(n.pushByte(128+e.length),n.pushBytes(e)):(n.pushByte(183+s),s===1?n.pushUint8(e.length):s===2?n.pushUint16(e.length):s===3?n.pushUint24(e.length):n.pushUint32(e.length),n.pushBytes(e))}}}function f(t){if(t<2**8)return 1;if(t<2**16)return 2;if(t<2**24)return 3;if(t<2**32)return 4;throw new g("Length is too large.")}const b=2n**16n-1n,m=2n**96n-1n,L=2n**256n-1n;function E(t,e){const s=e||"hex",i=u(c(t,{strict:!1})?p(t):t);return s==="bytes"?i:y(i)}export{b as a,L as b,m,E as s,U as t};
