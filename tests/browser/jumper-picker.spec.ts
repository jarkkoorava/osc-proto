import { test, expect } from '@playwright/test';
import { availableJumpTypes, skydivers } from '../../src/data/manifest';

test('queue picker stays open for scrollbar clicks and shows available jump types',async({page})=>{
 await page.goto('/');
 await page.locator('.queue-heading-actions > button').click();
 const dialog=page.locator('#queue-add-popup');
 const combo=dialog.locator('input[role=combobox]');
 await combo.focus();
 const list=dialog.getByRole('listbox');
 await expect(list).toBeVisible();
 const dimensions=await list.evaluate(element=>({height:element.clientHeight,scroll:element.scrollHeight}));
 expect(dimensions.scroll).toBeGreaterThan(dimensions.height);
 const rect=(await list.boundingBox())!;
 await page.mouse.click(rect.x+rect.width-8,rect.y+rect.height-20);
 await expect(list).toBeVisible();
 await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);
 await page.mouse.wheel(0,400);
 await expect.poll(()=>list.evaluate(element=>element.scrollTop)).toBeGreaterThan(0);
 const person=skydivers.slice(15).find(person=>availableJumpTypes(person).length>1)!;
 await combo.fill(person.name);
 const option=list.getByRole('option');
 await expect(option).toHaveCount(1);
 await expect(option.locator('.queue-role-tag')).toHaveCount(availableJumpTypes(person).length);
 await option.click();
 await expect(list).toHaveCount(0);
 await expect(dialog.locator('.queue-selected-name')).toHaveText(person.name);
});

test('queue combobox uses keyboard selection and Escape only closes its dropdown',async({page})=>{
 await page.goto('/');
 await page.locator('.queue-heading-actions > button').click();
 const dialog=page.locator('#queue-add-popup');
 const combo=dialog.locator('input[role=combobox]');
 await combo.focus();
 const expected=skydivers.slice(15)[1];
 await combo.press('ArrowDown');
 await expect(combo).toHaveAttribute('aria-activedescendant',/./);
 await combo.press('Enter');
 await expect(dialog.locator('.queue-selected-name')).toHaveText(expected.name);
 await combo.fill('no matching person');
 await expect(dialog.getByText('Ei hakutuloksia')).toBeVisible();
 await combo.press('Escape');
 await expect(dialog).toBeVisible();
 await expect(combo).toHaveAttribute('aria-expanded','false');
});
