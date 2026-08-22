# Workflow: Admission and Reconnect Verification

## Trigger
New MCP server admission, reconnect, `tools/list` refresh, server upgrade, or pre-call verification for a high-impact tool.

## Goal
Ensure approval remains bound to the exact reviewed tool metadata and prevent silent execution after metadata drift.

## Inputs
Server identity, current manifest, approved snapshot, policy, optional signature evidence.

## Baseline
Record current behavior: whether reconnect/tool refresh can change descriptions/schemas/annotations without forcing review.

## Stages
1. **Observe** — capture server identity and current discovery response.
2. **Measure baseline** — test known drift fixtures against the current host.
3. **Diagnose** — identify which metadata currently influences model/tool policy without durable approval binding.
4. **Pin** — canonicalize and store the reviewed snapshot using `manifest_guard.py pin`.
5. **Verify on refresh** — compare discovery metadata against the approved snapshot.
6. **Drift path** — block changed tools, produce field-level diff, request explicit re-review.
7. **Re-approval** — after human approval only, replace the snapshot with the reviewed version.
8. **Independent verification** — security verifier runs mutation and canonicalization fixtures.

## Responsible agent
Host/integration owner implements; MCP Drift Security Verifier independently verifies.

## Tools
MCP discovery, `scripts/manifest_guard.py`, approval/audit mechanism, existing sandbox/authorization controls.

## Outputs
Pinned snapshot, digest, structured drift decision, approval evidence, verification report.

## Checkpoints
Server identity validated; snapshot exists; all security fields covered; drift blocks execution; key ordering does not false-positive; runtime controls remain enabled.

## Retry policy
At most one retry for transient discovery/read failure. Drift itself is not retryable; it requires review. Identity mismatch is deny-only.

## Stop conditions
Invalid identity, invalid snapshot, detected drift pending approval, failed verification, or any weakening of runtime controls.

## Failure path
Fail closed for the affected changed tool. Preserve the last approved snapshot and audit evidence. Escalate to security owner when identity/integrity cannot be established.

## Definition of Done
Implemented, measured against baseline, independently verified, all mutation fixtures detected, no silent execution after drift, and no security boundary weakened.
