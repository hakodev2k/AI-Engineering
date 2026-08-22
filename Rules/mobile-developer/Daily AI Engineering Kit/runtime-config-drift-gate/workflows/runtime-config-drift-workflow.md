# Workflow: Runtime Config Drift Gate

## Trigger
- Before release or rollout continuation.
- After configuration or secret metadata changes.
- During incident investigation where configuration drift is suspected.
- Before closing a configuration-related incident.

## Entry conditions
- Target application and environment are known.
- Read-only access to expected sources and runtime metadata is available.
- Policy is present.

## Inputs
- Application/environment identifiers.
- Expected configuration sources.
- Runtime export or adapter output.
- Optional approved exceptions.

## Stages

### 1. Scope and source inventory
Owner: Expected Config Analyst.

Identify configuration sources, precedence, key classifications, runtime collection method, and freshness requirement.

Checkpoint: no unresolved source precedence for required keys.

### 2. Expected baseline
Owner: Expected Config Analyst.

Build `expected.json` and validate it.

Produced artifact: expected snapshot.

Failure path: source ambiguity or secret exposure -> `blocked`.

### 3. Runtime snapshot
Owner: runtime collector or tool adapter; reviewer consumes the result.

Collect read-only metadata. Raw secrets must not enter the snapshot. For secret keys use presence and optional externally derived fingerprint.

Produced artifact: `runtime.json`.

Retry: one retry only for transient collection/API failure. Preserve first error.

### 4. Snapshot validation
Owner: deterministic scripts.

Run validator on both snapshots.

Checkpoint: application/environment match and snapshot freshness is within policy.

Failure path: validation/freshness mismatch -> `blocked`.

### 5. Drift comparison
Owner: deterministic comparator.

Produce `drift-report.json` with per-key classification/severity.

### 6. Independent review
Owner: Runtime Drift Reviewer.

Review blocking findings, exception scope/expiry, and whether evidence supports the classification.

Checkpoint: high-severity review cannot be performed solely by the expected-baseline producer.

### 7. Final gate
Owner: deterministic gate.

Outcomes:
- `pass`: no blocking unapproved drift.
- `human-approval-required`: drift is remediable but action touches production config/secrets/infrastructure or an exception requires approval.
- `block`: invalid evidence, critical mismatch, stale snapshots, missing required key, invalid exception, or unresolved security-sensitive drift.

### 8. Optional remediation
Owner: human-approved implementation workflow outside this detector.

No remediation command belongs to this package. Any production configuration or secret modification requires explicit approval.

### 9. Post-remediation verification
Collect a new runtime snapshot; do not reuse the pre-change snapshot. Re-run validation, comparison, review, and gate.

## Retry rules
- Runtime read/API transient failure: maximum 1 retry.
- Deterministic script/tool transient failure: maximum 1 retry.
- Validation failure, real drift, permission failure, or policy violation: no blind retry.
- Repeated transient failure: stop and preserve evidence.

## Approval points
Explicit human approval is required before production config changes, secret rotation, infrastructure changes, security weakening, or accepting a critical drift exception.

## Stop conditions
- `pass`, or
- `block`, or
- `human-approval-required` awaiting an external human decision.

## Definition of Done
- Expected and runtime snapshots validate.
- Secrets remain redacted.
- Environment/application scopes match.
- Drift report exists.
- Required independent review is complete.
- Final deterministic gate passes.
- If remediation occurred, a fresh post-change snapshot proves the result.
- No blocking drift remains.