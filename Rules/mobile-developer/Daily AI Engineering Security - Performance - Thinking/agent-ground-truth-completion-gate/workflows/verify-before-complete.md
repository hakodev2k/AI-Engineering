# Workflow: Verify Before Complete

## Trigger
Agent believes implementation is complete or is about to report success, merge, push, or deploy.

## Goal
Make final claims no stronger than fresh observable evidence.

## Inputs
Acceptance criteria, changed files, tool-event ledger, canonical verification commands, intended completion claims.

## Baseline
Record current failing behavior or unmet criterion when reproducible. If no baseline is possible, state why and define post-change evidence requirements before implementation.

## Context
Use repository rules and task acceptance criteria. Do not use hidden chain-of-thought as evidence.

## Stages
1. **Observe** — enumerate facts, changed state, and acceptance criteria.
2. **Measure baseline** — capture relevant failures/metrics when possible.
3. **Diagnose** — identify what evidence would prove each criterion.
4. **Form hypothesis** — link proposed change to the observed failure.
5. **Implement improvement** — perform scoped edits.
6. **Measure again** — run relevant targeted checks and canonical verification.
7. **Freshness checkpoint** — invalidate checks that predate relevant later edits.
8. **Claim gate** — run `scripts/completion_gate.py` for intended claims.
9. **Independent verify** — `subagents/independent-verifier.md` reruns/samples authoritative checks for high-impact changes.

## Responsible agent
Implementer for 1–8; independent verifier for 9.

## Tools
Repository inspection, build/test commands, version-control tools, completion gate.

## Outputs
Evidence ledger, acceptance coverage, supported/blocked claims, status.

## Checkpoints
No `verified` status before canonical evidence. Any edit after verification triggers freshness re-evaluation. Contradictory evidence blocks completion.

## Metrics
Coverage ratio, unsupported claims, stale evidence, failed canonical checks, post-completion rework.

## Retry policy
At most 2 implementation/verification retries for the same hypothesis. Then re-diagnose or escalate.

## Stop conditions
Verified pass; unsupported claim remains after retries; authoritative command unavailable; acceptance criterion ambiguous enough to require human decision.

## Failure path
Preserve failure evidence, downgrade status, identify missing evidence, and hand back to diagnosis. Never weaken required verification to obtain green status.

## Verification
A verifier distinct from the implementer confirms high-impact completion.

## Definition of Done
Evidence documented; acceptance criteria mapped; required commands actually executed; evidence fresh; gate passes only supported claims; risks documented; independent verification complete when required.