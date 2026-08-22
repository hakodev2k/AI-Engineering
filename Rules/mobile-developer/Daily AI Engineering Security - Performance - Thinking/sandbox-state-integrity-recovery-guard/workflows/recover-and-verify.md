# Workflow — Recover and Verify Sandbox State

## Trigger
Sandbox setup fails due to parse/integrity/version state errors, or setup repeats because shared state appears incompatible.

## Goal
Restore a usable sandbox while preserving or strengthening the configured security boundary.

## Inputs
Failure log, state path, state classification, expected schema/runtime owner, supported rebuild command, and boundary probe.

## Baseline
Record failure signature, setup attempts, state hash/size/mtime, runtime version, and current policy. Do not mutate yet.

## Stages
1. **Observe** — capture exact failure and runtime metadata.
2. **Measure baseline** — run guard inspect; classify state.
3. **Diagnose** — decide corrupt, incompatible, authoritative/unknown, or healthy-but-other-failure.
4. **Form hypothesis** — e.g. interrupted write, schema conflict, stale marker.
5. **Recover** — only rebuildable state may be quarantined and regenerated.
6. **Measure again** — inspect regenerated state and compare setup-attempt count.
7. **Verify** — independent verifier runs allowed + denied boundary probes.
8. **Complete** — store incident evidence and result.

## Responsible agent
Implementer performs diagnosis/recovery; `subagents/security-verifier.md` independently verifies.

## Tools
`scripts/sandbox_state_guard.py`, product-supported setup command, filesystem metadata/hash tools, boundary probe.

## Outputs
Incident record, quarantine artifact metadata, regenerated-state metadata, verification result.

## Checkpoints
- Before mutation: state classified as rebuildable.
- Before privileged setup: user approval if required.
- After rebuild: state valid/compatible.
- Before completion: deny-boundary test passes.

## Metrics
Recovery duration, setup retries, state integrity status, unsafe fallback count, boundary pass rate.

## Retry policy
At most one rebuild retry, and only after new evidence or a corrected setup condition. Never retry the identical failure indefinitely.

## Stop conditions
Verified recovery; unknown/authoritative state; repeated identical failure; boundary regression; or required human approval unavailable.

## Failure path
Preserve quarantine/evidence, leave sandbox fail-closed, report exact blocking signature and safe next action.

## Definition of Done
Evidence captured; state classification justified; no security downgrade; rebuild completed when safe; independent boundary verification passes; no unresolved blocker remains.
