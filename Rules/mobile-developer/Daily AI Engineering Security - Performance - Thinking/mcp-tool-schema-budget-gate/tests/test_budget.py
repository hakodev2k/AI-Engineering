#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "tool_schema_budget.py"
EXAMPLE = ROOT / "examples" / "tools.json"


def run(cfg):
    with tempfile.TemporaryDirectory() as d:
        p=Path(d)/"cfg.json"; p.write_text(json.dumps(cfg),encoding="utf-8")
        return subprocess.run([sys.executable,str(SCRIPT),str(EXAMPLE),"--config",str(p)],capture_output=True,text=True)


def main():
    base={"policy_version":1,"max_total_tokens":100000,"max_hot_tokens":100000,"max_tool_tokens":100000,"max_hot_tools":100,"tokenizer":"estimate","bytes_per_token_estimate":4,"default_mode":"deferred","fail_on_budget_exceeded":True}
    ok=run(base)
    assert ok.returncode==0, ok.stderr+ok.stdout
    report=json.loads(ok.stdout)
    assert report["total_tokens"]>0 and len(report["tools"])==3
    strict=dict(base); strict["max_total_tokens"]=1
    bad=run(strict)
    assert bad.returncode==2
    bad_report=json.loads(bad.stdout)
    assert any(v.startswith("TOTAL_BUDGET:") for v in bad_report["violations"])
    hot=dict(base); hot.update({"default_mode":"hot","max_hot_tools":1})
    hot_result=run(hot)
    assert hot_result.returncode==2
    print("PASS: deterministic pass/fail budget cases")

if __name__=="__main__": main()
