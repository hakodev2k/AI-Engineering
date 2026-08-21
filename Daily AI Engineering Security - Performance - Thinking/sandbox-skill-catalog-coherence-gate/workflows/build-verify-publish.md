# Workflow — Build, Verify, and Publish Skill Catalog

## Trigger
Sandbox start/resume, eligible-skill change, materialization refresh, concurrent-run admission, or catalog/path inconsistency.

## Goal
Give planning one immutable, complete, sandbox-readable capability snapshot and prevent readers from observing a partial skill publication.

## Inputs
Trusted eligible-skill manifest, sandbox mapping, prior generation metadata, current materialization inputs, policy.

## Baseline
Record expected skill count, current advertised count, readable count, missing/extra entries, catalog hash, skill-read failures, retry/tool-call count, and concurrent-run hash variance.

## Context
Use observable capability facts only. Store assumptions explicitly, especially eligibility rules and sandbox mount mappings.

## Stages
1. **Observe** — collect current expected set, materialized set, advertised set, and read failures.
2. **Measure baseline** — compute completeness/readability and current generation/hash.
3. **Diagnose** — distinguish destructive-sync race, stale generation, host/sandbox path mismatch, eligibility disagreement, or independent truncation.
4. **Form hypothesis** — select one root cause supported by evidence; record alternatives.
5. **Implement improvement** — build a new staging generation; validate entries; publish atomically or bind the run to the immutable staging result.
6. **Measure again** — generate a snapshot and run `scripts/skill_catalog_guard.py`.
7. **Improved?** — if no and rebuild budget remains, re-evaluate once. Never loop indefinitely.
8. **Independent verification** — `subagents/capability-snapshot-verifier.md` checks a fresh snapshot and concurrency regression evidence.
9. **Complete** only when all invariants pass.

## Responsible agent
Materialization implementation agent for stages 1–7; Capability Snapshot Verifier for stage 8.

## Tools
Trusted eligibility manifest, sandbox-safe stat/read checks, atomic filesystem publication primitives, `scripts/skill_catalog_guard.py`, deterministic tests, and controlled concurrent-run harnesses.

## Outputs
Baseline/after metrics, generation ID, catalog hash, normalized skill snapshot, diagnosis/hypothesis evidence, remediation record, and independent verification result.

## Checkpoints
- CP1 expected eligibility is known.
- CP2 staging generation is complete before publication.
- CP3 every advertised path is readable in the effective sandbox.
- CP4 catalog/materialization generation and hash are fixed for the run.
- CP5 independent concurrency verification passes.

## Metrics
Completeness ratio, readability ratio, missing/extra count, cross-run hash variance, skill-read failures, rebuild count, retries/tool calls caused by mismatch, and planning rework attributable to capability drift.

## Retry policy
At most `max_rebuild_attempts` from policy (default 1). A verification failure after that blocks the run and escalates.

## Stop conditions
Unknown expected set, generation mismatch after bounded rebuild, unreadable advertised skill, partial publication observed, or any proposed fix requiring a sandbox/security downgrade.

## Failure path
Preserve snapshots and logs; return explicit blocked/degraded capability state. Do not silently continue with an incomplete catalog. Escalate materialization/path bugs to the platform owner.

## Verification
Run deterministic unit fixtures and a concurrency regression where identical eligibility inputs launch multiple runs simultaneously; all must expose the full expected set with identical catalog hashes and readable paths.

## Definition of Done
**Implemented:** immutable/atomic run-scoped catalog publication exists. **Measured:** baseline and after metrics captured. **Verified:** deterministic tests and concurrent regression pass; no expected skill is missing, no advertised skill is unreadable, generations match, sandbox remains enforced, and no blocking issue remains.
