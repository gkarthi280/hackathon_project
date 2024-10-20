import{e as E}from"./eth_sendRawTransaction-DPdnXbFR.js";import{a2 as L,B as P,d as b,K as F,x as s,a7 as I,O as G,R as h,ah as v,cn as _,a0 as z}from"./index-CYUBhEOJ.js";import{concatHex as D}from"./concat-hex-aYp195_m.js";import{a as M,s as S,t as H}from"./sha256-axn0qNHj.js";function l(a){if(["string","number"].includes(typeof a)&&!Number.isInteger(Number(a)))throw new Error(`Expected value to be an integer to convert to a bigint, got ${a} of type ${typeof a}`);return a instanceof Uint8Array?BigInt(L(a)):BigInt(a)}const B=M*32n;class $ extends P{constructor({givenLength:t,maxBytecodeSize:e}){super(`Bytecode cannot be longer than ${e} bytes. Given length: ${t}`,{name:"BytecodeLengthExceedsMaxSizeError"})}}class A extends P{constructor({givenLengthInWords:t}){super(`Bytecode length in 32-byte words must be odd. Given length in words: ${t}`,{name:"BytecodeLengthInWordsMustBeOddError"})}}class R extends P{constructor({givenLength:t}){super(`The bytecode length in bytes must be divisible by 32. Given length: ${t}`,{name:"BytecodeLengthMustBeDivisibleBy32Error"})}}function W(a){const t=b(a);if(t.length%32!==0)throw new R({givenLength:t.length});if(t.length>B)throw new $({givenLength:t.length,maxBytecodeSize:B});const e=S(t),n=b(e),r=t.length/32;if(r%2===0)throw new A({givenLengthInWords:r});const o=b(r),c=F(o,{size:2}),m=new Uint8Array([1,0]);return n.set(m,0),n.set(c,2),n}const T=50000n,O=a=>{const t=U(a);return{domain:{name:"zkSync",version:"2",chainId:a.chainId},types:{Transaction:[{name:"txType",type:"uint256"},{name:"from",type:"uint256"},{name:"to",type:"uint256"},{name:"gasLimit",type:"uint256"},{name:"gasPerPubdataByteLimit",type:"uint256"},{name:"maxFeePerGas",type:"uint256"},{name:"maxPriorityFeePerGas",type:"uint256"},{name:"paymaster",type:"uint256"},{name:"nonce",type:"uint256"},{name:"value",type:"uint256"},{name:"data",type:"bytes"},{name:"factoryDeps",type:"bytes32[]"},{name:"paymasterInput",type:"bytes"}]},primaryType:"Transaction",message:t}};function U(a){const{gas:t,nonce:e,to:n,from:r,value:o,maxFeePerGas:c,maxPriorityFeePerGas:m,paymaster:y,paymasterInput:i,gasPerPubdata:d,data:p,factoryDeps:u}=a;return{txType:113n,from:BigInt(r),to:n?BigInt(n):0n,gasLimit:t??0n,gasPerPubdataByteLimit:d??T,maxFeePerGas:c??0n,maxPriorityFeePerGas:m??0n,paymaster:y?BigInt(y):0n,nonce:e?BigInt(e):0n,value:o??0n,data:p||"0x0",factoryDeps:(u==null?void 0:u.map(x=>s(W(x))))??[],paymasterInput:i||"0x"}}async function J(a){const{account:t,transaction:e}=a,n=await N(a),r=await k({account:t,eip712Transaction:n,chainId:e.chain.id}),o=I(e);return{transactionHash:await E(o,r),chain:e.chain,client:e.client}}async function k(a){const{account:t,eip712Transaction:e,chainId:n}=a,r=O(e),o=await t.signTypedData({...r});return V({...e,chainId:n,customSignature:o})}async function N(a){var u;const{account:t,transaction:e}=a;let[n,r,o,c,m,y,i]=await Promise.all([G(e),h(e.to),h(e.value),h(e.gas),h(e.maxFeePerGas),h(e.maxPriorityFeePerGas),h(e.eip712)]),d=i==null?void 0:i.gasPerPubdata;if(!c||!m||!y){const g=await I(e)({method:"zks_estimateFee",params:[{from:t.address,to:r,data:n,value:o?v(o):void 0,gasPerPubdata:d,eip712Meta:{...i,gasPerPubdata:d?s(d):s(50000n),factoryDeps:(u=i==null?void 0:i.factoryDeps)==null?void 0:u.map(w=>Array.from(_(w)))},type:"0x71"}]});c=l(g.gas_limit),m=l(g.max_fee_per_gas)*2n,y=l(g.max_priority_fee_per_gas)||1n,d=l(g.gas_per_pubdata_limit)*2n}return{...await z({transaction:{...e,gas:c,maxFeePerGas:m,maxPriorityFeePerGas:y},from:t.address}),...e.eip712,gasPerPubdata:d,from:t.address}}function V(a){const{chainId:t,gas:e,nonce:n,to:r,from:o,value:c,maxFeePerGas:m,maxPriorityFeePerGas:y,customSignature:i,factoryDeps:d,paymaster:p,paymasterInput:u,gasPerPubdata:x,data:g}=a,f=[n?s(n):"0x",y?s(y):"0x",m?s(m):"0x",e?s(e):"0x",r??"0x",c?s(c):"0x",g??"0x0",s(t),s(""),s(""),s(t),o??"0x",x?s(x):s(T),d??[],i??"0x",p&&u?[p,u]:[]];return D(["0x71",H(f)])}export{N as populateEip712Transaction,J as sendEip712Transaction,k as signEip712Transaction};
