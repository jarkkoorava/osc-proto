import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGiftCardReport, giftCardYears } from '../src/data/giftCards.ts';
import { giftCardApi } from '../server/giftCards.ts';

test('expiry uses balance at expiry, sales use paid year and refunds use refund year', () => {
 const raw = [{pimwick_gift_card_id:'1',number:'TEST',product_id:'10',order_item_id:'20',balance:'30',expiration_date:'2025-12-31',active:'1'}];
 const activity = new Map([['1', [{activity_date:'2024-01-01',action:'transaction',amount:'100'}, {activity_date:'2025-02-01',action:'transaction',amount:'-40'}, {activity_date:'2025-03-01',action:'transaction',amount:'-10'}, {activity_date:'2026-01-01',action:'transaction',amount:'-20'}]]]);
 const report = buildGiftCardReport(raw, activity, new Map([['10','Course']]), [{id:1,status:'completed',currency:'EUR',date_paid:'2024-01-01',line_items:[{id:20,product_id:10,name:'Course',quantity:1,total:'100',total_tax:'0'}]}], [{date_created:'2026-01-02',line_items:[{product_id:10,total:'-10'}]}], '2026-10-28');
 const years = giftCardYears(report, '2026-10-28');
 assert.equal(report.cards[0].expiredUnusedCents,5000);
 assert.equal(years.find(y=>y.year===2025).used,1);
 assert.equal(years.find(y=>y.year===2025).expiredUnusedCents,5000);
 assert.equal(years.find(y=>y.year===2024).bought,1);
 assert.equal(years.find(y=>y.year===2026).revenueCents,-1000);
 assert.equal(giftCardYears(report,'2026-10-28','999')[0].bought,0);
});
test('missing or unreconciled activity never invents an expiry balance', () => {
 const raw=[{pimwick_gift_card_id:'1',number:'TEST',balance:'100',expiration_date:'2025-01-01'}];
 for (const details of [new Map(),new Map([['1',[]]])]) {
 const report=buildGiftCardReport(raw,details,new Map(),[],[],'2026-10-28');
 assert.equal(report.cards[0].expiredUnusedCents,null);
 assert.equal(giftCardYears(report,'2026-10-28').find(y=>y.year===2025).unknownExpiryBalances,1);
 }
});
test('unconfigured API hides feature and denies gift-card requests', () => {
 const middleware=giftCardApi({});
 let body; const res={setHeader(){},end(value){body=JSON.parse(value);},statusCode:200};
 middleware({url:'/api/features',method:'GET'},res,()=>assert.fail());
 assert.deepEqual(body,{giftCards:false});
 middleware({url:'/api/gift-cards',method:'GET'},res,()=>assert.fail());
 assert.equal(res.statusCode,404);
});

test('detail endpoint resolves number to numeric ID and returns complete live response', async () => {
 const previous=globalThis.fetch;
 const calls=[];
 const payload={gift_card:{number:'TEST-123',recipient_email:'test@example.com',custom:'kept'},activity:[{note:'history'}]};
 globalThis.fetch=async url=>{
 calls.push(String(url));
 return new Response(JSON.stringify(calls.length===1?[{number:'TEST-123',pimwick_gift_card_id:'42'}]:payload),{status:200});
 };
 try {
 const api=giftCardApi({WOOCOMMERCE_CONSUMER_KEY:'test',WOOCOMMERCE_CONSUMER_SECRET:'test',WOOCOMMERCE_URL:'https://example.com',PIMWICK_API_URL:'https://example.com/wp-json/wc-pimwick/v1'});
 const body=await new Promise(resolve=>api({url:'/api/gift-cards/detail?number=TEST-123',method:'GET'},{setHeader(){},end(value){resolve(JSON.parse(value));}},()=>assert.fail()));
 assert.deepEqual(body,payload);
 assert.ok(calls[1].endsWith('/pw-gift-cards/42'));
 } finally {globalThis.fetch=previous;}
});
