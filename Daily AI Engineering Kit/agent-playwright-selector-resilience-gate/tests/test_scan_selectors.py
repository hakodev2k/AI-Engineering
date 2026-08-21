import json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SCRIPT=ROOT/'scripts/scan_selectors.py'; POLICY=ROOT/'config/policy.yaml'

def run(source):
    with tempfile.TemporaryDirectory() as d:
        root=Path(d); (root/'sample.spec.ts').write_text(source,encoding='utf-8')
        p=subprocess.run([sys.executable,str(SCRIPT),'--root',str(root),'--policy',str(POLICY)],capture_output=True,text=True)
        return p.returncode,json.loads(p.stdout)

class ScannerTests(unittest.TestCase):
    def test_semantic_locator_passes(self):
        code,r=run("import { test, expect } from '@playwright/test';\ntest('x',async({page})=>{ await page.getByRole('button',{name:'Save'}).click(); await expect(page.getByRole('status')).toBeVisible(); });")
        self.assertEqual(code,0); self.assertEqual(r['status'],'passed')
    def test_nth_child_blocks(self):
        code,r=run("test('x',async({page})=>{ await page.locator('div:nth-child(2)').click(); });")
        self.assertEqual(code,2); self.assertTrue(any(x['pattern']=='nth-child(' for x in r['findings']))
    def test_xpath_blocks(self):
        code,r=run("test('x',async({page})=>{ await page.locator('xpath=//button[2]').click(); });")
        self.assertEqual(code,2)
    def test_positional_nth_warns(self):
        code,r=run("import {expect} from '@playwright/test'; test('x',async({page})=>{ await page.getByRole('button').nth(1).click(); await expect(page).toHaveURL(/x/); });")
        self.assertEqual(code,1); self.assertEqual(r['status'],'warnings')
    def test_action_without_assertion_warns(self):
        code,r=run("test('x',async({page})=>{ await page.getByRole('button',{name:'Save'}).click(); });")
        self.assertEqual(code,1); self.assertTrue(any(x['pattern']=='action-without-nearby-assertion' for x in r['findings']))
if __name__=='__main__': unittest.main()
