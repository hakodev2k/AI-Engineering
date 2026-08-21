#!/usr/bin/env node
import fs from 'node:fs';

function arg(name, fallback=null){const i=process.argv.indexOf(name);return i>=0&&i+1<process.argv.length?process.argv[i+1]:fallback;}
function die(msg,code=2){console.error(msg);process.exit(code);}
const inventoryPath=arg('--inventory');
const baseUrl=arg('--base-url');
const output=arg('--output','selector-inventory.probed.json');
const browserName=arg('--browser','chromium');
if(!inventoryPath||!fs.existsSync(inventoryPath))die('Missing --inventory');
if(!baseUrl)die('Missing --base-url');
let playwright;try{playwright=await import('playwright');}catch{die('The playwright package is required for runtime probing. Install it in the host repository.',3);}
if(!['chromium','firefox','webkit'].includes(browserName))die(`Unsupported browser: ${browserName}`);
const inv=JSON.parse(fs.readFileSync(inventoryPath,'utf8'));

function quotedValues(expr){
  const out=[]; const rx=/(['"`])((?:\\.|(?!\1).)*)\1/g; let m;
  while((m=rx.exec(expr))!==null) out.push(m[2].replace(/\\(['"`])/g,'$1'));
  return out;
}
function buildLocator(page,s){
  const vals=quotedValues(s.expression);
  if(s.kind==='getByRole'){
    const role=vals[0]; if(!role) throw new Error('Cannot parse role');
    const nameMatch=s.expression.match(/name\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
    return nameMatch?page.getByRole(role,{name:nameMatch[2]}):page.getByRole(role);
  }
  if(s.kind==='getByLabel') return page.getByLabel(vals[0]??'');
  if(s.kind==='getByPlaceholder') return page.getByPlaceholder(vals[0]??'');
  if(s.kind==='getByTestId') return page.getByTestId(vals[0]??'');
  if(s.kind==='getByText') return page.getByText(vals[0]??'');
  if(s.kind==='locator-css'||s.kind==='locator-xpath') return page.locator(vals[0]??'');
  throw new Error(`Unsupported selector kind: ${s.kind}`);
}
const browser=await playwright[browserName].launch({headless:true});
const page=await browser.newPage();
try{
  await page.goto(baseUrl,{waitUntil:'domcontentloaded'});
  for(const s of inv.selectors){
    try{
      const locator=buildLocator(page,s);
      const matchCount=await locator.count();
      let visibleCount=0;
      const cap=Math.min(matchCount,20);
      for(let i=0;i<cap;i++){if(await locator.nth(i).isVisible())visibleCount++;}
      s.runtime_probe={status:'passed',match_count:matchCount,visible_count:visibleCount,url:page.url(),observed_at:new Date().toISOString(),error:null};
    }catch(e){
      s.runtime_probe={status:'failed',match_count:0,visible_count:0,url:page.url(),observed_at:new Date().toISOString(),error:String(e?.message||e)};
    }
  }
}finally{await browser.close();}
fs.writeFileSync(output,JSON.stringify(inv,null,2)+'\n');
console.log(JSON.stringify({status:'ok',output,selector_count:inv.selectors.length},null,2));
