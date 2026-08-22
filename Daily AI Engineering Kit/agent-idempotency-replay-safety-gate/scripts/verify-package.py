#!/usr/bin/env python3
import pathlib, sys
REQUIRED=["README.md","config/policy.yaml","schemas/investigation-result.schema.json","scripts/scan-replay-risk.py","scripts/replay-http.py","scripts/verify-package.py","skills/investigate-replay-safety.md","skills/implement-idempotency.md","rules/replay-safety-rules.md","subagents/repository-explorer.md","subagents/implementation-agent.md","subagents/verification-agent.md","workflows/replay-safety-workflow.md","hooks/pre-task.md","hooks/final-verification.md","templates/investigation-result.json"]
FORBIDDEN=["implementation omitted","remaining files omitted","same as above","add logic here","continue similarly","other files omitted for brevity"]
def main():
    root=pathlib.Path(__file__).resolve().parents[1]; errors=[]
    for rel in REQUIRED:
        p=root/rel
        if not p.is_file() or p.stat().st_size==0: errors.append(f"missing/empty: {rel}")
        elif p.suffix in {".md",".py",".json",".yaml",".yml"}:
            text=p.read_text(encoding="utf-8",errors="ignore").lower()
            for bad in FORBIDDEN:
                if bad in text: errors.append(f"forbidden placeholder in {rel}: {bad}")
    if errors:
        print("\n".join(errors),file=sys.stderr); return 1
    print(f"package verification passed: {len(REQUIRED)} required files")
    return 0
if __name__=="__main__": raise SystemExit(main())
