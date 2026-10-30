import {test,expect} from '@playwright/test';
import {skydivers,createJump,createLoad,AIRCRAFT_EMPTY_WEIGHTS,LICENSE_JUMP_PRICES} from '../../src/data/manifest';
const student=skydivers.find(person=>createJump(person.id).type==='Student')!;
const tandem=skydivers.find(person=>createJump(person.id).type==='Tandem student')!;
const others=skydivers.filter(person=>!['Student','Tandem student'].includes(createJump(person.id).type)).slice(0,23);
const people=[...others,student,tandem];
const data={aircraftWeightsVersion:2,demoHistoryVersion:6,groundHistoryVersion:1,loads:[createLoad(1)],history:[],nextLoad:2,queueIds:people.map(person=>person.id),queueJumps:Object.fromEntries(people.map(person=>[person.id,createJump(person.id)])),emptyWeights:AIRCRAFT_EMPTY_WEIGHTS,licensePrices:LICENSE_JUMP_PRICES};

test('TV queue groups students and tandem students and fits 25 names on desktop screens',async({page})=>{
 await page.addInitScript(data=>localStorage.setItem('osc-manifest-v3',JSON.stringify(data)),data);
 await page.goto('/#queue');
 const sidebar=page.locator('.tv-queue-sidebar');
 await expect(sidebar.locator('li')).toHaveCount(25);
 await expect(sidebar.locator('.tv-queue-students li')).toHaveText([student.name,tandem.name]);
 await expect(sidebar.locator('.tv-queue-licensed li')).toHaveCount(23);
 for(const viewport of [{width:1280,height:720},{width:1366,height:768},{width:1920,height:1080}]){
 await page.setViewportSize(viewport);
 await page.evaluate(()=>document.fonts.ready);
 const box=(await sidebar.boundingBox())!;
 expect(box.y+box.height).toBeLessThanOrEqual(viewport.height);
 expect(await sidebar.evaluate(element=>element.scrollHeight<=element.clientHeight)).toBe(true);
 }
});

test('TV sidebar excludes jumpers already assigned to a load and synchronizes updates',async({page})=>{
 await page.addInitScript(data=>localStorage.setItem('osc-manifest-v3',JSON.stringify(data)),data);
 await page.goto('/#queue');
 await expect(page.locator('.tv-queue-sidebar li')).toHaveCount(25);
 await page.evaluate(()=>{
 const data=JSON.parse(localStorage.getItem('osc-manifest-v3')!);
 data.loads[0].jumps=[data.queueJumps[data.queueIds[0]]];
 const raw=JSON.stringify(data);localStorage.setItem('osc-manifest-v3',raw);
 window.dispatchEvent(new StorageEvent('storage',{key:'osc-manifest-v3',newValue:raw}));
 });
 await expect(page.locator('.tv-queue-sidebar li')).toHaveCount(24);
 await expect(page.locator('.tv-queue-sidebar li').filter({hasText:others[0].name})).toHaveCount(0);
});
