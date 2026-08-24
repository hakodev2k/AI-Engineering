# Skill: Control-Plane Attestation

## Purpose
Detect unreviewed mutations to files that govern agent permissions, sandboxing, hooks, MCP, network, approvals, or execution policy before privileged actions occur.

## Trigger
Session start; resume after pause; branch/worktree change; configuration reload; before any privileged or unsandboxed tool action.

## Inputs
Workspace root, `config/policy.json`, trusted baseline-state path.

## Preconditions
Baseline creation occurs in a trusted human-controlled context. Baseline storage is not writable by the governed agent where the host can enforce that boundary.

## Required context
Exact runtime/workspace root and identity of the security-policy files in force.

## Allowed tools
Read-only filesystem metadata/content hashing; deterministic Python script in this package.

## Constraints
MUST NOT execute project code. MUST NOT auto-approve drift. MUST NOT overwrite the baseline during verification. MUST treat symlinked protected files as file content at the resolved target but report the lexical path.

## Procedure
1. Inventory files that actually govern security behavior.
2. Mark invariant files `required: true`; leave optional integration files false.
3. From a trusted shell, run `policy_attest.py --record`.
4. Before privileged actions, run verification without `--record`.
5. If any protected file has changed, appeared/disappeared contrary to baseline/required state, block the action.
6. Capture the JSON report as evidence.
7. A human reviews the change and explicitly re-records only after approval.

## Decision points
- Missing optional file with no baseline entry: acceptable.
- Missing required file: block.
- Previously baselined file missing: block.
- New optional protected file appearing after baseline: block until reviewed.
- Hash mismatch: block.

## Expected output
Machine-readable status with path, baseline hash, current hash, and reason.

## Metrics
Protected-action coverage, drift detection count, false positives, unauthorized mutation caught before action.

## Verification
Run unit tests and perform one controlled mutation after baseline; verification MUST exit 2.

## Failure handling
Malformed config/baseline exits 3. Baseline-write failure exits 4. Do not downgrade to warning for privileged operations.

## Stop conditions
Stop once all protected files match baseline, or stop the privileged workflow and escalate after one failed refresh/recheck.