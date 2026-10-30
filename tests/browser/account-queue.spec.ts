import {test,expect} from '@playwright/test';
import {createJump,skydivers} from '../../src/data/manifest';

test('own page shows queue status first and licensed members can join with chosen altitude',async({page})=>{
 await page.goto('/#account');
 const panel=page.locator('.account-queue');
 await expect(panel.getByRole('status')).toContainText('Olet jonossa');
 const person=skydivers.slice(15).find(person=>createJump(person.id).type==='License')!;
 await page.locator('.member-search select').selectOption(person.id);
 await panel.getByRole('combobox',{name:'Jonon hyppykorkeus',exact:true}).selectOption('1500');
 await panel.getByRole('button',{name:'Liity jonoon',exact:true}).click();
 await expect(panel.getByRole('status')).toContainText('Olet jonossa');
 await expect(panel.getByRole('status')).toContainText('1 500 m');
 await expect(panel.getByRole('button',{name:'Liity jonoon'})).toHaveCount(0);
 await page.reload();
 await page.locator('.member-search select').selectOption(person.id);
 await expect(panel.getByRole('status')).toContainText('1 500 m');
 await page.goto('/#planning');
 const card=page.locator('.queue .person-card').filter({hasText:person.name});
 await expect(card.locator('.queue-jump-detail')).toHaveText('1 500 m');
});

test('student joins with exercise and corresponding altitude saved to planning queue',async({page})=>{
 const student=skydivers.slice(15).find(person=>createJump(person.id).type==='Student')!;
 await page.goto('/#account');
 await page.locator('.member-search select').selectOption(student.id);
 const panel=page.locator('.account-queue');
 await expect(panel.getByRole('button',{name:'Liity jonoon'})).toBeDisabled();
 await panel.getByRole('combobox',{name:'Jonon harjoitus',exact:true}).selectOption('15 sek');
 await panel.getByRole('button',{name:'Liity jonoon',exact:true}).click();
 await expect(panel.getByRole('status')).toContainText('15 sek');
 const saved=await page.evaluate(id=>JSON.parse(localStorage.getItem('osc-manifest-v3')!).queueJumps[id],student.id);
 expect(saved.altitude).toBe(1800);expect(saved.exercise).toBe('15 sek');
 await page.goto('/#planning');
 await expect(page.locator('.queue .person-card').filter({hasText:student.name}).locator('.queue-jump-detail')).toHaveText('15 sek');
});
