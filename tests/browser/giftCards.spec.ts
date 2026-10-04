import { test, expect } from '@playwright/test';
const report={cards:[{id:'1',number:'DEMO-CARD',productId:'10',type:'Tandem',created:'2026-01-01',expires:'2026-10-01',balanceCents:5000,active:true,usedYears:[2026],purchaseYear:2026,expiredUnusedCents:5000,activityAvailable:true}],sales:[{year:2026,productId:'10',cents:10000}],fetchedAt:'2026-10-28T12:00:00Z',warnings:[],currency:'EUR'};
test('gift card page shows yearly report and searchable cards',async({page})=>{
 await page.route('**/api/features',route=>route.fulfill({json:{giftCards:true}}));
 await page.route('**/api/gift-cards*',route=>route.fulfill({json:{status:'ready',report}}));
 await page.goto('/');
 await page.getByText('Ylläpito',{exact:true}).click();
 await page.getByRole('link',{name:'Lahjakortit',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Lahjakortit',exact:true})).toBeVisible();
 await expect(page.getByText('DEMO-CARD',{exact:true})).toBeVisible();
 await page.route('**/api/gift-cards/detail?*',route=>route.fulfill({json:{gift_card:{number:'DEMO-CARD',recipient_name:'Test Recipient',balance:'50.00',extra_field:'Additional information'},activity:[{activity_date:'2026-01-01',action:'transaction',amount:'100',note:'Initial credit'}]}}));
 await page.getByRole('button',{name:'N?yt? tiedot',exact:true}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog).toBeVisible();
 await expect(dialog.getByText('Test Recipient',{exact:true})).toBeVisible();
 await expect(dialog.getByText('Additional information',{exact:true})).toBeVisible();
 await expect(dialog.getByText('Initial credit',{exact:true})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(dialog).toHaveCount(0);
 await page.getByLabel('Hae kortin numerolla').fill('missing');
 await expect(page.getByText('Ei hakua vastaavia lahjakortteja.')).toBeVisible();
});
test('without credentials gift cards menu is absent',async({page})=>{
 await page.route('**/api/features',route=>route.fulfill({json:{giftCards:false}}));
 await page.goto('/');
 await page.getByText('Ylläpito',{exact:true}).click();
 await expect(page.getByRole('link',{name:'Lahjakortit',exact:true})).toHaveCount(0);
});
