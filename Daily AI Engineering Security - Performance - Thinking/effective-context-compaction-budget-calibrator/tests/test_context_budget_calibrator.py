import json,subprocess,sys,tempfile
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/"scripts"/"context_budget_calibrator.py"

def run(data):
    with tempfile.NamedTemporaryFile("w",suffix=".json",delete=False) as f:
        json.dump(data,f);name=f.name
    p=subprocess.run([sys.executable,str(SCRIPT),name],capture_output=True,text=True)
    return p.returncode,json.loads(p.stdout)

base={"raw_window":200000,"reserved_output":20000,"provider_reserve":10000,"observed_prompt_tokens":120000,"runtime_counted_tokens":121000,"compaction_trigger_tokens":145000}
code,out=run(base);assert code==0 and out["status"]=="pass"
bad=dict(base);bad["runtime_counted_tokens"]=150000
code,out=run(bad);assert code==2 and any("accounting_error_ratio" in x for x in out["violations"])
late=dict(base);late["compaction_trigger_tokens"]=165000
code,out=run(late);assert code==2 and any("headroom_ratio" in x for x in out["violations"])
print("3 tests passed")
