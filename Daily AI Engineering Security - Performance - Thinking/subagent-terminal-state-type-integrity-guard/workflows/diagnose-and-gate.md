# Workflow: Diagnose and Gate

## Trigger
Child emits a terminal notification or the parent detects missing/partial delegated output.

## Goal
Ensure parent completion depends on consistent typed terminal evidence.

## Inputs
Terminal JSONL, raw child evidence, deliverable contract, current dispatch identity.

## Baseline
Capture at least 30 representative child runs when available and measure success labels, unsupported success claims, missing deliverables, unresolved tool calls, and re-dispatches.

## Context
Record runtime version, model, background/foreground mode, task type, and resource limits.

## Stages
1. **Observe** — preserve terminal notification and transcript tail.
2. **Measure baseline** — run validator on historical/current samples.
3. **Diagnose** — locate contradictions among status, terminal reason, deliverable, tools, descendants, dispatch identity.
4. **Form hypothesis** — identify adapter mapping, limit/deferred path, event loss, or stale-notification cause using evidence.
5. **Implement improvement** — change classification/adapter behavior, not the evidence rule.
6. **Measure again** — compare unsupported-success rate and re-dispatch rate.
7. **Improved?** If no, re-evaluate once; maximum two remediation iterations total.
8. **Verify** — independent Completion Verifier reproduces results and tests pass.
9. **Complete** — parent may accept only verified-success children.

## Responsible agent
Runtime/orchestration engineer implements; Completion Verifier reviews.

## Tools
Status guard, raw transcript/status inspection, tests, metrics collector.

## Outputs
Before/after report, violation samples, corrected classification, verification verdict.

## Checkpoints
Before parent completion, after adapter changes, after retry/recovery.

## Metrics
Unsupported-success rate, missing deliverables, unresolved tools, live descendants, re-dispatches, verification coverage.

## Retry policy
Maximum two remediation iterations. Child task replay is separate and MUST follow idempotency/approval policy.

## Stop conditions
Metrics meet target and verification passes; or two remediation iterations fail; or evidence remains conflicting.

## Failure path
Keep delegated item incomplete, preserve evidence, escalate to runtime owner. Never weaken success criteria.

## Verification
Unit tests plus independent sample review. For rollout, target zero unsupported success claims in the verification corpus and no increase in false failures beyond the team's predeclared tolerance.

## Definition of Done
Evidence documented, baseline captured, mapping limitation identified, implementation applied, before/after metrics recorded, tests pass, independent verification complete, no blocking contradiction remains.