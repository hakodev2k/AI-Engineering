#!/usr/bin/env python3
import importlib.util
from pathlib import Path

SCRIPT=Path(__file__).parents[1]/"scripts"/"stream_arg_bench.py"
spec=importlib.util.spec_from_file_location("bench",SCRIPT); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)

def test_final_semantics_equal_reference():
    s=m.payload(4096); assert m.final_parse(s,37)==m.naive_reparse(s,37)

def test_unicode_and_escapes_survive():
    s=m.payload(2048); out=m.final_parse(s,11); assert out["path"]=="generated.txt" and "αβγ" in out["content"]

def test_multiple_sizes_run():
    rows=m.run([1024,4096,16384],64,1); assert len(rows)==3 and all(r["chunks"]>1 for r in rows)

def test_malformed_final_json_rejected():
    try: m.final_parse('{"x":',2)
    except Exception: return
    raise AssertionError("malformed final JSON must be rejected")

if __name__=="__main__":
    tests=[v for k,v in globals().items() if k.startswith("test_") and callable(v)]
    for t in tests:t()
    print(f"PASS {len(tests)} tests")
