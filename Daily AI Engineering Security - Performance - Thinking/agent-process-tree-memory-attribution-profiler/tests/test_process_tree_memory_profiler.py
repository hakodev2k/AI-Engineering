import json,subprocess,sys,tempfile,unittest
from pathlib import Path
SCRIPT=Path(__file__).parents[1]/'scripts'/'process_tree_memory_profiler.py'; M=1024*1024
class Tests(unittest.TestCase):
    def run_case(self,rows,policy):
        with tempfile.TemporaryDirectory() as d:
            tr=Path(d)/'t.jsonl'; po=Path(d)/'p.json'; tr.write_text('\n'.join(json.dumps(x) for x in rows)); po.write_text(json.dumps(policy)); cp=subprocess.run([sys.executable,str(SCRIPT),'--input',str(tr),'--root-pid','10','--policy',str(po)],capture_output=True,text=True); return cp.returncode,json.loads(cp.stdout)
    def test_unrelated_excluded(self):
        rows=[{'ts':0,'pid':10,'ppid':1,'rss_bytes':100*M,'label':'root'},{'ts':0,'pid':11,'ppid':10,'rss_bytes':10*M,'label':'child'},{'ts':0,'pid':99,'ppid':1,'rss_bytes':900*M,'label':'other'},{'ts':60,'pid':10,'ppid':1,'rss_bytes':100*M,'label':'root'},{'ts':60,'pid':11,'ppid':10,'rss_bytes':10*M,'label':'child'},{'ts':60,'pid':99,'ppid':1,'rss_bytes':900*M,'label':'other'}]
        rc,o=self.run_case(rows,{'max_peak_tree_mib':200}); self.assertEqual(rc,0); self.assertEqual(o['candidate']['tree_peak_mib'],110)
    def test_child_leak_blocks_tree_growth(self):
        rows=[{'ts':0,'pid':10,'ppid':1,'rss_bytes':100*M,'label':'root'},{'ts':0,'pid':11,'ppid':10,'rss_bytes':10*M,'label':'mcp'},{'ts':60,'pid':10,'ppid':1,'rss_bytes':100*M,'label':'root'},{'ts':60,'pid':11,'ppid':10,'rss_bytes':410*M,'label':'mcp'}]
        rc,o=self.run_case(rows,{'max_tree_growth_mib':200}); self.assertEqual(rc,2); self.assertEqual(o['candidate']['root_end_mib'],100); self.assertEqual(o['candidate']['tree_growth_mib'],400)
    def test_nested_descendant_counted(self):
        rows=[]
        for t in (0,60): rows += [{'ts':t,'pid':10,'ppid':1,'rss_bytes':100*M},{'ts':t,'pid':11,'ppid':10,'rss_bytes':20*M},{'ts':t,'pid':12,'ppid':11,'rss_bytes':30*M}]
        rc,o=self.run_case(rows,{'max_peak_tree_mib':200}); self.assertEqual(rc,0); self.assertEqual(o['candidate']['tree_peak_mib'],150); self.assertEqual(o['candidate']['max_descendants'],2)
if __name__=='__main__': unittest.main()
