# RAG Index Freshness Gate Workflow

## Trigger
Run after source-content updates, ingestion failures, suspiciously old RAG answers, index rebuilds, or before high-impact releases relying on retrieval.

## Entry conditions
Authoritative source and target index are known; read-only metadata access is available.

## Inputs
Source/index metadata sample, `config/freshness-policy.yaml`, retrieval acceptance queries, ingestion logs/jobs.

## Stages
1. **Context** — Index Freshness Investigator identifies authoritative source, index, ingestion path, and sample scope.
2. **Measure** — Run `scripts/freshness_gate.py`; save result evidence.
3. **Diagnose** — Classify stale records and locate earliest divergence.
4. **Checkpoint** — If result passes, proceed directly to independent verification. If blocked, create remediation plan.
5. **Approval** — Explicit human approval is mandatory for full production reindex, production index deletion/recreation, production configuration change, or materially costly/high-impact action.
6. **Repair** — Execute the smallest scoped reindex or ingestion recovery allowed by current permissions.
7. **Retest** — Rerun freshness gate and acceptance retrievals.
8. **Independent verify** — Verification Agent performs fresh reads and validates current versions/hashes.
9. **Complete** — Record status and residual risk.

## Produced artifacts
Freshness result JSON, evidence references, remediation record, verification result.

## Checkpoints
No repair without identified stale evidence. No completion without independent verification after a repair.

## Retry rules
- Transient metadata/API read: maximum 2 retries.
- Ingestion/reindex transient failure: maximum 2 retries.
- Verification retrieval transient failure: maximum 2 retries.
- Validation, permission, hash mismatch, policy violation: no automatic retry.
Evidence from every attempt must be preserved.

## Failure paths
Repeated transient failure -> escalate with attempts/evidence. Permission failure -> stop without increasing privilege. Validation failure -> return to diagnosis once; if unchanged, stop. Production approval missing -> stop before action.

## Definition of Done
Required metadata collected; gate passes; repaired documents show current versions/hashes; acceptance retrievals return current content; independent verifier passes; approvals are recorded where required; unresolved risk is documented; no blocking failure remains.
