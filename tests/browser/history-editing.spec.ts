import { test, expect } from '@playwright/test';

test('history editor saves corrections, cancels drafts, moves dates, and persists',async({page})=>{
 await page.goto('/#history');
 await page.locator('tbody tr').first().getByRole('button',{name:'Muokkaa pokaa'}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog).toBeVisible();
 await dialog.getByLabel('Lentoaika (min)',{exact:true}).fill('42');
 await dialog.getByLabel('Pokan lisätiedot',{exact:true}).fill('Historical correction');
 await dialog.locator('.history-jump-editor').first().getByLabel('Korkeus (m)',{exact:true}).selectOption('1000');
 await dialog.getByRole('button',{name:'Tallenna muutokset',exact:true}).click();
 await expect(dialog).toHaveCount(0);
 await expect(page.locator('tbody tr').first().getByRole('spinbutton')).toHaveValue('42');
 await page.reload();
 await page.locator('tbody tr').first().getByRole('button',{name:'Muokkaa pokaa'}).click();
 await expect(dialog.getByLabel('Pokan lisätiedot',{exact:true})).toHaveValue('Historical correction');
 await expect(dialog.locator('.history-jump-editor').first().getByLabel('Korkeus (m)',{exact:true})).toHaveValue('1000');
 await dialog.getByLabel('Pokan lisätiedot',{exact:true}).fill('Discarded');
 await dialog.getByRole('button',{name:'Peruuta',exact:true}).click();
 await page.locator('tbody tr').first().getByRole('button',{name:'Muokkaa pokaa'}).click();
 await expect(dialog.getByLabel('Pokan lisätiedot',{exact:true})).toHaveValue('Historical correction');
 await dialog.getByLabel('Lentopäivä',{exact:true}).fill('2026-10-19');
 await dialog.getByLabel('Pokan numero',{exact:true}).fill('1');
 await dialog.getByRole('button',{name:'Tallenna muutokset',exact:true}).click();
 await expect(dialog).toHaveCount(0);
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('osc-manifest-v3')!));
 const edited=state.history.find((load:{additionalInfo?:string})=>load.additionalInfo==='Historical correction');
 expect(edited.date).toBe('2026-10-19');expect(edited.number).toBe(1);
 for(const date of ['2026-10-19','2026-10-20']) {
 const day=state.history.filter((load:{date:string})=>load.date===date).sort((a:{number:number},b:{number:number})=>a.number-b.number);
 expect(day.map((load:{number:number})=>load.number)).toEqual(day.map((_:unknown,i:number)=>i+1));
 }
 expect(state.transactions.some((item:{kind:string;reference?:string})=>item.kind==='correction' && item.reference?.startsWith(edited.id+':'))).toBe(true);
});

test('history editor adds and removes people, validates ground duties, and saves plane returns',async({page})=>{
 await page.goto('/#history');
 await page.locator('tbody tr').first().getByRole('button',{name:'Muokkaa pokaa'}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog.locator('.history-jump-editor')).toHaveCount(4);
 const added=await dialog.getByLabel('Valitse hyppääjä',{exact:true}).locator('option').evaluateAll(options=>options.map(option=>({id:(option as HTMLOptionElement).value,text:option.textContent})).filter(option=>option.id));
 await dialog.getByLabel('Valitse hyppääjä',{exact:true}).selectOption(added[0].id);
 await expect(dialog.locator('.history-jump-editor')).toHaveCount(5);
 await dialog.locator('.history-jump-editor').last().getByRole('button',{name:'Poista hyppääjä'}).click();
 await expect(dialog.locator('.history-jump-editor')).toHaveCount(4);
 await dialog.getByLabel('Koko poka koneella alas',{exact:true}).check();
 await dialog.getByRole('button',{name:'Tallenna muutokset',exact:true}).click();
 await expect(dialog).toHaveCount(0);
 await expect(page.locator('tbody tr').first().locator('.returned-by-plane')).toHaveCount(4);
});

test('student loads require a ground person and assigned instructor',async({page})=>{
 await page.goto('/#history');
 const row=page.locator('tbody tr').filter({has:page.locator('.queue-role-tag.student')}).first();
 await row.getByRole('button',{name:'Muokkaa pokaa'}).click();
 const dialog=page.getByRole('dialog');
 await dialog.getByLabel('Maahenkilö',{exact:true}).selectOption('');
 await dialog.getByRole('button',{name:'Tallenna muutokset',exact:true}).click();
 await expect(dialog.getByRole('alert')).toContainText('maahenkilö');
 await expect(dialog).toBeVisible();
 await dialog.getByRole('button',{name:'Peruuta',exact:true}).click();
});

test('completed loads can repeat participants today and survive reload',async({page})=>{
 await page.goto('/#history');
 await page.locator('tbody tr').first().getByRole('spinbutton').fill('40');
 const ids=await page.evaluate(()=>{
 const state=JSON.parse(localStorage.getItem('osc-manifest-v3')!);
 const now=new Date(); const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
 const sample=state.history.at(-1);
 const other=state.history.at(-2);
 const first={...sample,date:today,number:1};
 const second={...sample,id:other.id,date:today,number:2};
 state.history=state.history.filter((load:{id:string})=>![first.id,second.id].includes(load.id));
 state.loads=[first,second,...state.loads];
 localStorage.setItem('osc-manifest-v3',JSON.stringify(state));
 return [first.id,second.id];
 });
 await page.reload();
 await expect(page.locator('tbody tr')).toHaveCount(100);
 await page.locator('tbody tr').first().getByRole('button',{name:'Muokkaa pokaa'}).click();
 const dialog=page.getByRole('dialog');
 await dialog.getByLabel('Lentoaika (min)',{exact:true}).fill('41');
 await dialog.getByRole('button',{name:'Tallenna muutokset',exact:true}).click();
 await expect(dialog).toHaveCount(0);
 await page.reload();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('osc-manifest-v3')!));
 expect(state.loads.filter((load:{id:string})=>ids.includes(load.id))).toHaveLength(2);
 await expect(page.locator('tbody tr')).toHaveCount(100);
});
