#!/usr/bin/env python3
import json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=["README.md","config/policy.json","schemas/cache-request.schema.json","scripts/semantic_cache_gate.py","scripts/verify_package.py","skills/cache-eligibility-investigation.md","skills/cache-hit-verification.md","rules/semantic-cache-safety.md","subagents/cache-explorer.md","subagents/cache-implementer.md","subagents/cache-verifier.md","workflows/semantic-cache-safety-workflow.md","hooks/pre-cache-decision.md","hooks/final-verification.md","examples/request.json","examples/entries.json","tests/run_tests.py"]
errors=[]
for rel in REQUIRED:
    p=ROOT/rel
    if not p.is_file() or p.stat().st_size==0: errors.append(f"missing-or-empty:{rel}")
try:
    policy=json.loads((ROOT/"config/policy.json").read_text())
    if not 0 < policy["similarity_threshold"] <= 1: errors.append("invalid-threshold")
except Exception as e: errors.append(f"invalid-policy:{e}")
for p in ROOT.rglob("*"):
    if p.is_file() and p.suffix in {".md",".py",".json"}:
        text=p.read_text(encoding="utf-8",errors="replace").lower()
        for marker in ["implementation omitted","remaining files omitted","same as above","add logic here","continue similarly","other files omitted for brevity"]:
            if marker in text: errors.append(f"forbidden-marker:{p.relative_to(ROOT)}:{marker}")
if errors:
    print("FAIL"); [print(x) for x in errors]; sys.exit(1)
print(f"PASS: {len(REQUIRED)} required files present and policy valid")
