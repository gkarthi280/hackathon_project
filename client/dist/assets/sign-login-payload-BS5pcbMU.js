function g(e){let s=[`${e.domain} wants you to sign in with your Ethereum account:`,e.address].join(`
`);s=[s,e.statement].join(`

`),e.statement&&(s+=`
`);const n=[];if(e.uri){const i=`URI: ${e.uri}`;n.push(i)}const o=`Version: ${e.version}`;if(n.push(o),e.chain_id){const i=`Chain ID: ${e.chain_id}`||"1";n.push(i)}const c=`Nonce: ${e.nonce}`;n.push(c);const u=`Issued At: ${e.issued_at}`;n.push(u);const f=`Expiration Time: ${e.expiration_time}`;if(n.push(f),e.invalid_before){const i=`Not Before: ${e.invalid_before}`;n.push(i)}e.resources&&n.push(["Resources:",...e.resources.map(i=>`- ${i}`)].join(`
`));const h=n.join(`
`);return[s,h].join(`
`)}async function $(e){const{payload:t,account:r}=e;return{signature:await r.signMessage({message:g(t)}),payload:t}}export{$ as signLoginPayload};
