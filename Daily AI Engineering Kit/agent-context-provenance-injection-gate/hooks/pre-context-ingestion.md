# Hook: Pre-Context Ingestion

**Trigger:** before retrieved content enters agent context.

**Preconditions:** input file/text, source, and origin are known.

**Action:** run `python scripts/context_gate.py --input <file> --source <source> --origin <origin> --policy config/policy.yaml --output .ai/context-record.json`.

**Expected result:** valid context record with status.

**Failure behavior:** exit 1/2/3 blocks ingestion. Exit 2 may resume only after explicit review approval bound to the digest.

**Blocking:** yes.