import {test,expect} from '@playwright/test';
import {availableJumpTypes,skydivers} from '../../src/data/manifest';
const instructor=skydivers.slice(15).find(person=>availableJumpTypes(person).includes('Instructor'))!;

test('instructor can queue without altitude from own page and choose it manually on the load',async({page})=>{
 await page.goto('/#account');await page.locator('.member-search select').selectOption(instructor.id);
 const panel=page.locator('.account-queue');
 await panel.getByRole('combobox',{name:'Jonon hyppääjätyyppi',exact:true}).selectOption('Instructor');
 await panel.getByRole('combobox',{name:'Jonon hyppykorkeus',exact:true}).selectOption('0');
 await panel.getByRole('button',{name:'Liity jonoon',exact:true}).click();
 await expect(panel.getByRole('status')).toContainText('Korkeus valitsematta');
 await page.reload();await page.locator('.member-search select').selectOption(instructor.id);
 await expect(panel.getByRole('status')).toContainText('Korkeus valitsematta');
 await page.goto('/#planning');const picker=page.locator('.add-jumper-row input[role=combobox]');
 await picker.fill(instructor.name);await picker.press('Enter');
 const altitude=page.getByRole('combobox',{name:`Hyppykorkeus: ${instructor.name}`,exact:true});
 await expect(altitude).toHaveValue('0');
 await expect(page.getByRole('button',{name:'Tallenna poka 1',exact:true})).toBeDisabled();
 await page.reload();await expect(altitude).toHaveValue('0');
 await altitude.selectOption('1000');
 await expect(page.getByRole('button',{name:'Tallenna poka 1',exact:true})).toBeEnabled();
});

test('sidebar supports instructor role and unset altitude, but licensed jumps require altitude',async({page})=>{
 await page.goto('/');await page.locator('.queue-heading-actions > button').click();
 const popup=page.locator('#queue-add-popup');
 await popup.locator('input[role=combobox]').fill(instructor.name);await popup.getByRole('option',{name:instructor.name,exact:true}).click();
 const role=popup.getByRole('combobox',{name:'Jonoon lisättävän hyppääjän tyyppi',exact:true});
 await role.selectOption('Instructor');
 const altitude=popup.getByRole('combobox',{name:'Jonoon lisättävän hyppääjän korkeus',exact:true});
 await altitude.selectOption('0');
 await role.selectOption('License');await expect(altitude.locator('option[value="0"]')).toHaveCount(0);
 await role.selectOption('Instructor');await altitude.selectOption('0');
 await popup.getByRole('button',{name:'Lisää jonoon',exact:true}).click();
 await page.reload();
 await expect(page.locator('.queue .person-card').filter({hasText:instructor.name}).locator('.queue-jump-detail')).toHaveText('Korkeus valitsematta');
 const jump=await page.evaluate(id=>JSON.parse(localStorage.getItem('osc-manifest-v3')!).queueJumps[id],instructor.id);
 expect(jump.type).toBe('Instructor');expect(jump.altitude).toBe(0);
});
