# Hooks

## Pre-Task Output Budget Validation
**Trigger:** Before a tool/subagent is launched.  
**Action:** Load policy, validate limits, initialize/read session counter, classify workload.  
**Command:** `python scripts/output_backpressure.py capture --policy config/output-policy.json --session-counter <counter> --session-id <session> --tool-id <tool>` is the capture adapter; hosts should validate policy before opening the producer stream.  
**Expected result:** Valid explicit budgets and writable accounting storage.  
**Failure behavior:** Fail closed when policy/accounting is invalid; do not launch unbounded capture.

## Stream Capture Hook
**Trigger:** stdout/stderr/tool-result bytes arrive.  
**Action:** Route stream through `output_backpressure.py`, enforce byte/rate/session limits, preserve previews, persist large output by reference.  
**Expected result:** Inline output stays bounded; oversized output is explicit and retrievable.  
**Failure behavior:** Emit reason code and block further capture under hard limits. Producer cancellation remains a separate host authorization decision.

## Post-Tool Verification Hook
**Trigger:** Tool exits.  
**Action:** Record exit status separately from output completeness; if result was clipped and verification depends on omitted bytes, require explicit artifact retrieval.  
**Expected result:** Agent cannot confuse “command exited” with “all diagnostic output was inspected.”  
**Failure behavior:** Mark verification incomplete rather than silently treating preview as full output.

## Pre-Session-Persist Hook
**Trigger:** Session/transcript record is serialized.  
**Action:** Reject inline records above `max_inline_session_record_bytes`; store artifact reference instead.  
**Expected result:** Large payload is not duplicated into active session history.  
**Failure behavior:** Block persistence or store an explicit missing-artifact error; never silently drop the result.

## Pre-Resume Audit Hook
**Trigger:** Resume/replay of retained session.  
**Action:** Run `python scripts/session_bloat_audit.py --policy config/output-policy.json --session <session.jsonl> --report <report.json>`.  
**Expected result:** Oversized or repeated payloads are visible before eager replay.  
**Failure behavior:** Prefer preview/reference-only replay; if integrity is uncertain, stop rather than load unbounded history.

## Post-Change Regression Hook
**Trigger:** Runtime, serializer, tool integration, or policy changes.  
**Action:** Run unit tests and target-runtime large-output benchmark.  
**Expected result:** Hard budgets remain enforced and reference mode still works.  
**Failure behavior:** Block rollout after one bounded fix/retest cycle.

## Artifact Cleanup Hook
**Trigger:** Retention/TTL sweep.  
**Action:** Delete only artifacts proven unreachable from retained sessions and older than retention policy.  
**Expected result:** Storage is reclaimed without breaking references.  
**Failure behavior:** Ambiguous reachability means keep the artifact and report it for later reconciliation.