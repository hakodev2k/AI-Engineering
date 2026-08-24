# Workflow — Integrate and Verify Authority Provenance

## Trigger
New or changed message ingress, relay, persistence, compaction, subagent, or rendering code.

## Goal
Prevent untrusted content from becoming user/system authority while preserving legitimate message delivery.

## Inputs
Current message schema, trusted source inventory, event samples, implementation diff.

## Baseline
Capture current counts for authority-bearing messages, missing provenance, spoof-marker occurrences, and existing regression results before changes.

## Context
Use `rules/authority-boundary.md`, `skills/review-message-provenance.md`, and `evidence/research.md`.

## Stages
1. **Observe** — map every authority producer and collect redacted baseline events.
2. **Measure baseline** — run `scripts/authority_gate.py` against baseline JSONL.
3. **Diagnose** — locate the earliest layer where provenance is dropped, inferred, or promoted.
4. **Form hypothesis** — state the exact invariant the proposed change restores.
5. **Implement** — bind role/authority to trusted transport metadata; keep untrusted markers as data.
6. **Measure again** — rerun baseline plus malicious fixtures.
7. **Independent verify** — Security Verifier executes `tests/test_authority_gate.py` and inspects the integration.

## Responsible agent
Implementation owner performs stages 1–6. `subagents/security-verifier.md` owns stage 7.

## Tools
Repository inspection, Python 3, redacted JSONL traces.

## Outputs
Before/after metrics, findings JSON, test result, residual risks, verification decision.

## Checkpoints
Do not implement before baseline and source map exist. Do not release before independent verification.

## Metrics
Unauthorized promotions, provenance coverage, false positives, spoof-marker detections, regression pass rate.

## Retry policy
Maximum 3 implementation/verification cycles. Each retry must cite new evidence or a changed hypothesis.

## Stop conditions
PASS when all blocking invariants hold and tests pass. STOP/ESCALATE after 3 failed cycles or if a required trusted identity cannot be authenticated.

## Failure path
Fail closed for ambiguous authority. Preserve redacted evidence. Never widen trust or downgrade security solely to restore compatibility.

## Definition of Done
Evidence documented; baseline captured; limitation identified; implementation present; tests pass; attack paths blocked; legitimate ingress passes; independent verification PASS; risks documented; no blocking issue remains.
