# Workflow: Diagnose and Verify Trusted Plugin Runtime

## Trigger
Privileged plugin install/update/launch, or trusted RPC/path validation failure.

## Goal
Restore valid plugin availability without weakening provenance, sandbox, or registration boundaries.

## Inputs
Plugin/service paths, package metadata, trust roots, child environment snapshot, optional native-host state.

## Baseline
Record current launch result, failure class, plugin/runtime versions, canonical paths, and effective trust roots before change.

## Context
The same logical trust configuration may differ between parent process and sandboxed/trusted service. Availability is not evidence of safety and failure is not evidence of malicious code.

## Stages
1. **Observe** — capture failure and immutable metadata.
2. **Measure baseline** — run `scripts/trusted_plugin_preflight.py` against current state.
3. **Diagnose** — classify provenance, version, path, propagation, or registration divergence.
4. **Form hypothesis** — identify the smallest repair that preserves trust boundaries.
5. **Repair externally** — human/runtime owner performs reinstall, re-registration, or configuration synchronization as appropriate.
6. **Measure again** — rerun preflight once after state change.
7. **Independent verification** — Security Verifier confirms all invariants.
8. **Complete** — permit privileged launch only on verified pass.

## Responsible agent
Runtime owner implements repairs; `subagents/security-verifier.md` independently verifies.

## Tools
Read-only file/hash/environment/registry inspection and deterministic preflight script.

## Outputs
Baseline report, diagnosis, post-repair report, verification result.

## Checkpoints
- Before any repair.
- After observable repair state change.
- Before privileged service execution.

## Metrics
Preflight failures by class, repair success rate, retries, unsafe workaround count, time-to-diagnosis.

## Retry policy
At most one automated recheck after a repair. A second failure stops the workflow and escalates.

## Stop conditions
Verified pass, unknown provenance, unreconciled parent/child trust state, or failed post-repair recheck.

## Failure path
Keep privileged launch blocked, preserve evidence, and escalate to package/runtime owner. Do not broaden trust automatically.

## Verification
Known-good path must pass; path escape, version mismatch, missing registration, or trust-root divergence must fail.

## Definition of Done
Evidence recorded; provenance confirmed; all required trust views agree; native-host state passes when applicable; independent verifier passes; no security control was weakened.