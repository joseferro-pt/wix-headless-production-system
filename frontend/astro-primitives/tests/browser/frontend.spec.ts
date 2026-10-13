import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('actual React island hydrates and filters synthetic items',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/framework baseline/i})).toBeVisible();
  await expect(page.getByRole('main')).toHaveCount(1);
  const filter=page.getByRole('searchbox',{name:'Filter items'});
  await expect(filter).toBeVisible();
  // Astro client:idle renders SSR input before React listeners are attached.
  await expect(page.locator('astro-island')).not.toHaveAttribute('ssr','');
  await expect(page.getByRole('status')).toContainText('3 results');
  await filter.fill('Appointments');
  await expect(page.getByRole('status')).toContainText('1 results');
  await expect(page.getByText('Editorial pages')).toHaveCount(0);
  await expect(page.getByText('Appointments',{exact:true})).toBeVisible();
  await filter.fill('missing synthetic term');
  await expect(page.getByText('No matching items.')).toBeVisible();
  await expect(page.getByRole('status').first()).toContainText('0 results');
  await filter.fill('');
  await expect(page.getByRole('status')).toContainText('3 results');
});

test('skip navigation is keyboard-focusable and targets the main landmark',async({page})=>{
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
});

test('automated WCAG A/AA scan includes hydrated content',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('searchbox',{name:'Filter items'})).toBeVisible();
  await expect(page.locator('astro-island')).not.toHaveAttribute('ssr','');
  const accessibility=new AxeBuilder({page})
    .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']);
  const scanned=await accessibility.analyze();
  expect(scanned.violations).toEqual([]);
});

test('mobile, tablet and desktop render without horizontal overflow',async({page})=>{
  for(const width of [375,768,1440]){
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    await expect(page.getByRole('searchbox',{name:'Filter items'})).toBeVisible();
    const layout=await page.evaluate(()=>({
      scrollWidth:document.documentElement.scrollWidth,
      viewport:window.innerWidth,
    }));
    expect(layout.scrollWidth,{message:'unexpected horizontal overflow at '+width+'px'})
      .toBeLessThanOrEqual(layout.viewport+1);
  }
});

test('reduced motion has no forced smooth scrolling',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const scrollBehavior=await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior);
  expect(scrollBehavior).toBe('auto');
});

test('synthetic reference requests no Wix-hosted resources',async({page})=>{
  const external: string[]=[];
  page.on('request',request=>{
    const url=request.url();
    if(url.startsWith('http://')||url.startsWith('https://')){
      if(!url.startsWith('http://127.0.0.1:4321/'))external.push(url);
    }
  });
  await page.goto('/');
  await expect(page.getByRole('searchbox',{name:'Filter items'})).toBeVisible();
  expect(external).toEqual([]);
});
