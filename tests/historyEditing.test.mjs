import { test } from 'node:test';
import assert from 'node:assert/strict';
import { historySeed } from '../src/data/historySeed.ts';
import { createLoad, LICENSE_JUMP_PRICES } from '../src/data/manifest.ts';
import { historyLoadErrors, historyTimestamp, helsinkiDateTime, replaceHistoryLoad } from '../src/data/historyEditing.ts';
import { reconcileTransactions } from '../src/data/transactions.ts';

test('all existing historical loads are valid without changing their data',()=>{
 for(const load of historySeed) assert.deepEqual(historyLoadErrors(load,'2026-10-30'),[],load.id);
});
test('Helsinki flight time handles winter, summer, and midnight independently of host timezone',()=>{
 for(const [date,time,expected] of [['2026-07-15','09:00','2026-07-15T06:00:00.000Z'],['2026-10-30','09:00','2026-10-30T07:00:00.000Z'],['2026-07-15','00:15','2026-07-14T21:15:00.000Z']]){
 const stamp=historyTimestamp(date,time);
 assert.equal(stamp,expected);
 assert.deepEqual(helsinkiDateTime(stamp),{date,time});
 }
 assert.equal(historyTimestamp('2026-03-29','03:30'),'');
});
test('date moves close the old day gap and insert in new day while IDs and drafts remain stable',()=>{
 const old=structuredClone(historySeed.at(-1));
 const target=historySeed.find(load=>load.date!==old.date);
 const draft={...createLoad(99,'load-test-draft'),date:target.date};
 const edited={...old,date:target.date,jumpedAt:historyTimestamp(target.date,'09:00'),number:1};
 const updated=replaceHistoryLoad([...historySeed,draft],edited);
 assert.equal(updated.length,101);
 assert.equal(updated.find(load=>load.id===old.id).number,1);
 for(const date of [old.date,target.date]) {
 const day=updated.filter(load=>load.date===date).sort((a,b)=>a.number-b.number);
 assert.deepEqual(day.map(load=>load.number),day.map((_,i)=>i+1));
 if(date===target.date)assert.equal(day.at(-1).id,draft.id);
 }
 assert.equal(old.date,historySeed.at(-1).date);
});
test('historical edits append the correct charge corrections and repeat saves do not charge twice',()=>{
 const old=structuredClone(historySeed.at(-1));
 let ledger=reconcileTransactions(undefined,[old],LICENSE_JUMP_PRICES);
 const edited=structuredClone(old);
 edited.jumps[0].altitude=1000;
 const member=edited.jumps[0].skydiverId;
 const before=ledger.filter(item=>item.memberId===member).reduce((sum,item)=>sum+item.amountCents,0);
 ledger=reconcileTransactions(ledger,[edited],LICENSE_JUMP_PRICES);
 const after=ledger.filter(item=>item.memberId===member).reduce((sum,item)=>sum+item.amountCents,0);
 assert.equal(after-before,1500);
 assert.deepEqual(reconcileTransactions(ledger,[edited],LICENSE_JUMP_PRICES),ledger);
 edited.jumps=edited.jumps.filter(jump=>jump.skydiverId!==member);
 ledger=reconcileTransactions(ledger,[edited],LICENSE_JUMP_PRICES);
 assert.equal(ledger.filter(item=>item.memberId===member).reduce((sum,item)=>sum+item.amountCents,0),20000);
});
test('invalid historical edits reject future dates, duplicate people, and conflicting ground duties',()=>{
 const load=structuredClone(historySeed.at(-1));
 load.date='2027-01-01';load.groundPersonId=load.jumps[0].skydiverId;load.jumps.push({...load.jumps[0]});
 assert.ok(historyLoadErrors(load,'2026-10-30').length>=3);
});
