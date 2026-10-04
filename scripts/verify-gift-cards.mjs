import { giftCardApi } from '../server/giftCards.ts';
const api=giftCardApi(process.env);
const read=()=>new Promise(resolve=>api({url:'/api/gift-cards',method:'GET'},{setHeader(){},end(body){resolve(JSON.parse(body));}},()=>{throw new Error('Missing route');}));
let last='';
for(let i=0;i<600;i++){
 const state=await read();
 if(state.status==='ready') { console.log(JSON.stringify({status:state.status,cards:state.report.cards.length,salesRows:state.report.sales.length,missingActivity:state.report.cards.filter(card=>!card.activityAvailable).length,unknownExpiredBalances:state.report.cards.filter(card=>card.expires && card.expires<'2026-10-28' && card.expiredUnusedCents===null).length}));process.exit(0); }
 if(state.status==='error'){console.log(state.error);process.exit(1);}
 if(state.progress!==last){last=state.progress;if(i%10===0)console.log(last);}
 await new Promise(resolve=>setTimeout(resolve,1000));
}
throw new Error('Timed out');
