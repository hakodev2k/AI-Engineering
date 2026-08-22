# Workflow — Enforce at Action Boundary

## Trigger
Any action matched by a hard gate.

## Goal
Require fresh observable precondition evidence immediately before governed execution.

## Inputs
Action JSON, gate registry, evidence JSON, current time/epoch, optional approval evidence.

## Baseline
Measure current governed-action count, rule violations/rework, and manual corrections over representative tasks.

## Stages
1. **Observe** — identify hard rules and historical violations.
2. **Measure baseline** — quantify violations and cost.
3. **Diagnose** — locate missing action-boundary checks.
4. **Form hypothesis** — define minimal gate/evidence contract.
5. **Implement** — compile rule and integrate pre-action checker.
6. **Measure again** — replay violation plus valid workflows.
7. **Verify** — independent gate verifier checks correctness and false blocks.

## Responsible agent
Rule compiler/implementation owner for stages 1–6; `subagents/gate-verifier.md` for stage 7.

## Tools
`python3 scripts/check_action_gates.py --registry <gates.json> --action <action.json> --evidence <evidence.json>` plus normal build/test evidence producers.

## Outputs
Decision (`allow`, `block`, `review`), matching gate IDs, missing/stale evidence, and before/after metrics.

## Checkpoints
- CP1 hard rule classified.
- CP2 baseline captured.
- CP3 evidence source and invalidation defined.
- CP4 historical violation blocked.
- CP5 fresh valid case allowed.
- CP6 independent review complete.

## Metrics
Escaped hard-rule violations, false blocks, coverage, stale evidence catches, rework avoided, checker latency.

## Retry policy
Maximum 2 gate-definition retries. Retry only with new evidence or materially revised matcher/evidence semantics.

## Stop conditions
Stop on unsafe bypass, evidence forgery path, or unacceptable false-block pattern. Successful stop requires tests and independent verification.

## Failure path
Return `review`; preserve original hard rule; require human decision where deterministic evidence is insufficient.

## Definition of Done
Evidence documented; gate is observable; retry bounded; historical failure blocked; valid case allowed; no hidden reasoning requested; independent verifier returns `VERIFIED`.
