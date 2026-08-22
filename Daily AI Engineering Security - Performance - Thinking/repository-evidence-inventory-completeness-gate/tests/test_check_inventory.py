#!/usr/bin/env python3
import json, subprocess, sys, tempfile
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/"scripts"/"check_inventory.py"

def main():
    with tempfile.TemporaryDirectory() as td:
        root=Path(td); (root/"src").mkdir(); (root/"docs").mkdir()
        (root/"src"/"a.py").write_text("print('x')")
        (root/"docs"/"handover.md").write_text("current state")
        cfg={"roots":["src","docs"],"evidence_classes":[{"name":"source","patterns":["src/**/*.py"],"required":True},{"name":"handover","patterns":["docs/**/*.md"],"required":True}],"exclude":[]}
        cp=root/"cfg.json"; cp.write_text(json.dumps(cfg))
        r=subprocess.run([sys.executable,str(SCRIPT),str(root),str(cp)],capture_output=True,text=True)
        assert r.returncode==0, r.stderr+r.stdout
        out=json.loads(r.stdout); assert out["complete"] and out["evidence_classes"][0]["count"]==1
        cfg["evidence_classes"].append({"name":"screenshots","patterns":["assets/**/*.png"],"required":True}); cp.write_text(json.dumps(cfg))
        r2=subprocess.run([sys.executable,str(SCRIPT),str(root),str(cp)],capture_output=True,text=True)
        assert r2.returncode==3, r2.stderr+r2.stdout
        print("2 inventory-completeness cases passed")

if __name__=="__main__": main()
