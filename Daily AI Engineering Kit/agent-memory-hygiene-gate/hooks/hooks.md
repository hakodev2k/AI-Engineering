# Hooks

## PrePersist
**Trigger:** immediately before durable memory is written.

**Action:** validate candidate against policy.

**Command:**
```bash
python scripts/validate-memory.py --policy config/memory-policy.json --record "$MEMORY_RECORD"
```

**Failure behavior:** non-zero blocks persistence. Never downgrade validator failure to a warning automatically.

## PreRetrieve
**Trigger:** before persisted memory is injected into an agent context.

**Action:** sweep records for expiry, invalid shape and conflicts.

**Command:**
```bash
python scripts/sweep-memory.py --policy config/memory-policy.json --dir "$MEMORY_DIR"
```

**Failure behavior:** on policy findings, exclude affected records. On operational error, inject no unchecked memory; continue without memory or escalate.

## PostEvidenceChange
**Trigger:** current-task evidence materially contradicts retrieved memory.

**Action:** mark the affected record as needing review in the host workflow and route the corrected claim through Memory Admission. Do not overwrite the old claim silently.

**Command:** semantic workflow action; no LLM-generated shell command is required.

**Failure behavior:** exclude contradicted memory from further use in the current task.

## PreHighImpactUse
**Trigger:** memory is about to be treated as an instruction for production, security, authorization, finance, infrastructure, destructive action, secrets or breaking contracts.

**Action:** require explicit human approval scoped to the proposed action.

**Failure behavior:** block the high-impact action; memory may remain informational only.