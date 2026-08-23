#!/usr/bin/env python3
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
REQUIRED=[
"README.md","skills/investigate-schema-drift.md","skills/verify-schema-change.md","rules/schema-safety.md",
"subagents/schema-investigator.md","subagents/verification-agent.md","workflows/schema-drift-gate.md",
"hooks/pre-migration.md","hooks/final-verification.md","scripts/schema_drift.py","scripts/verify_package.py",
"config/schema-drift.yaml","schemas/schema-snapshot.schema.json","examples/baseline-schema.json","examples/candidate-schema.json"]
FORBIDDEN=["implementation omitted","remaining files omitted","same as above","add logic here","continue similarly","other files omitted for brevity"]

def main():
    errors=[]
    for rel in REQUIRED:
        p=ROOT/rel
        if not p.is_file() or p.stat().st_size==0: errors.append(f"missing/empty: {rel}")
        elif p.suffix in {".md",".py",".yaml",".json"}:
            text=p.read_text(encoding="utf-8").lower()
            for bad in FORBIDDEN:
                if bad in text: errors.append(f"forbidden placeholder in {rel}: {bad}")
    readme=(ROOT/"README.md").read_text(encoding="utf-8") if (ROOT/"README.md").exists() else ""
    for rel in REQUIRED[1:]:
        if f"`{rel}`" not in readme and rel not in readme: errors.append(f"README does not reference {rel}")
    if errors:
        print("\n".join(errors),file=sys.stderr); return 1
    print(f"verified {len(REQUIRED)} required files")
    return 0
if __name__=="__main__": sys.exit(main())
