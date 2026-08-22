# Tool Call Lifecycle Integrity Guard

**Category:** Security  
**Run date:** 2026-08-22 (UTC+7)

## Problem
Agent runtimes that pause, resume, stream, retry, or trip guardrails can persist incomplete or duplicated tool-call lifecycle state. If call identity, arguments, approval, guardrail status, and terminal output are not correlated deterministically, high-impact side effects can be replayed or authorized with stale state.

## Evidence
See `evidence/research.md`. Current evidence includes OpenAI Agents SDK issue #4125 on an orphaned streamed tool call after a guardrail trip, current Agents SDK lifecycle requirements for deduplication/revalidation, and MCP 2026-07-28 output-validation guidance.

## Existing approach
Persist call IDs/approvals in sessions, rely on framework execution ordering and guardrails, use downstream idempotency when available, and retry transient failures.

## Existing limitations
Exceptional control flow can still leave orphaned records; approval can become stale after arguments change; streaming/non-streaming persistence paths can diverge; not every downstream API is idempotent; and missing output does not prove a side effect did not occur.

## Proposed improvement
Model tool invocation as an explicit finite lifecycle record. Bind approval to call ID + tool identity + canonical argument hash, re-run required pre-invocation checks after resume, prohibit replay of executed call IDs, and require exactly one terminal output/error correlation.

## Architecture
```text
call created
  -> canonical argument hash
  -> approval binding
  -> pause/resume if needed
  -> fresh pre-invocation guardrail + tool lookup
  -> duplicate/execution check
  -> side effect
  -> terminal output/error persistence
  -> post-persist integrity validation
```

## Package tree
```text
README.md
evidence/research.md
config/policy.json
skills/lifecycle-integrity-analysis.md
rules/lifecycle-invariants.md
subagents/lifecycle-verifier.md
workflows/validate-before-side-effects.md
hooks/preinvoke-lifecycle-check.md
scripts/lifecycle_guard.py
scripts/test_lifecycle_guard.py
tests/cases.json
```

## Installation
Requires Python 3.10+ and only the standard library. Scripts are local validators and perform no network calls or side effects.

## Configuration
Edit `config/policy.json` to match actual high-impact capabilities. Keep unique-call, argument-binding, post-resume guardrail, terminal-correlation, and fail-closed controls enabled for write-capable agents.

## Usage
```bash
python3 scripts/lifecycle_guard.py record.json --policy config/policy.json --phase preinvoke
python3 scripts/lifecycle_guard.py record.json --policy config/policy.json --phase postpersist
python3 scripts/test_lifecycle_guard.py
```

Exit codes: 0 allow, 2 invalid state/configuration, 4 approval/reapproval required, 5 deny/integrity error.

## Workflow
Follow `workflows/validate-before-side-effects.md`: reproduce lifecycle failures, baseline duplicates/orphans, identify the state transition that loses correlation, integrate the validator immediately before side effects and after terminal persistence, replay the same cases, then obtain independent verification.

## Metrics
Duplicate execution count, orphan record count, stale-approval rejection count, post-resume guardrail coverage, terminal correlation coverage, and unresolved execution ambiguities.

## Verification
**Implemented:** deterministic lifecycle validator, policy, rules, skill, workflow, hook, fixtures, and independent verifier role are present.  
**Measured:** adopters must capture before/after lifecycle metrics on their actual runtime; this package does not claim production incident reduction without those measurements.  
**Verified:** package verification requires `python3 scripts/test_lifecycle_guard.py` to pass. Production verification additionally requires streaming/non-streaming replay where applicable and proof that every high-impact side effect crosses the pre-invocation gate.

## Safety
The package fails closed on high-impact lifecycle ambiguity. It never treats a missing tool output as proof that execution did not happen and never recommends blind replay. Downstream idempotency is additive, not a replacement for local invocation identity checks.

## Failure handling
Detection: validator exit 5/2, duplicate call ID, stale approval, missing fresh guardrail after resume, executed call without exactly one terminal record, or disabled/stale tool.  
Evidence: preserve bounded lifecycle metadata and hashes.  
Retry: deterministic validation itself is not retried; an ambiguous side effect may be reconsidered only once after external reconciliation provides new evidence.  
Fallback: block the action, inspect downstream idempotency/status, or require human resolution.  
Escalation: runtime/security owner.  
Stop condition: unresolved execution ambiguity for a high-impact action.

## Definition of Done
- Current evidence documented.
- Baseline lifecycle failures measured.
- Stable call identity and canonical argument hash implemented.
- Approval is bound to current call/tool/hash.
- Required guardrails rerun after resume.
- Executed call IDs cannot execute twice.
- Exactly one terminal record correlates to each executed call.
- Duplicate/orphan/stale-approval fixtures pass.
- Independent verifier signs off.
- No blocking lifecycle ambiguity remains.

## Customization
Integrate lifecycle records with the runtime's session store and downstream idempotency key when available. Store hashes and bounded metadata rather than secrets or full sensitive tool arguments in audit logs.
