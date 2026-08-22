import importlib.util
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "working_set_guard.py"
spec = importlib.util.spec_from_file_location("working_set_guard", SCRIPT)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
POLICY={"max_context_bytes":120000,"max_duplicate_ratio":0.15,"min_required_fact_coverage":1.0,"require_fresh_hash_for_required_files":True}
H="a"*64

def test_all_required_facts_allow():
    m={"context_bytes":1000,"segments":[{"id":"x","sha256":H,"bytes":1000}],"facts":[{"id":"api","required":True,"fresh":True,"present":True,"source":"a.cs","sha256":H}]}
    assert mod.analyze(m,POLICY)["decision"] == "allow"

def test_missing_fact_blocks():
    m={"context_bytes":1000,"segments":[],"facts":[{"id":"api","required":True,"fresh":True,"present":False,"source":"a.cs","sha256":H}]}
    r=mod.analyze(m,POLICY); assert r["decision"] == "block" and "api" in r["missing"]

def test_stale_fact_blocks():
    m={"context_bytes":1000,"segments":[],"facts":[{"id":"cfg","required":True,"fresh":False,"present":True,"source":"cfg.json","sha256":H}]}
    assert mod.analyze(m,POLICY)["decision"] == "block"

def test_duplicate_ratio_blocks():
    m={"context_bytes":1000,"segments":[{"id":"a","sha256":H,"bytes":500},{"id":"b","sha256":H,"bytes":500}],"facts":[]}
    assert mod.analyze(m,POLICY)["decision"] == "block"
