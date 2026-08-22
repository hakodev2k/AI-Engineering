# Runtime Config Governance Rules

## MUST
- Treat repository/deployment intent and runtime observation as separate evidence sources.
- Record target application, environment, snapshot kind, producer, timestamp, and source metadata.
- Redact every `secret` value; persist only presence and optional safe fingerprints.
- Validate snapshots before comparison.
- Compare only snapshots for the same application/environment scope.
- Treat missing required keys, security-sensitive mismatches, and environment-binding mismatches as blocking unless policy defines an approval path.
- Preserve first-failure evidence when a collection/comparison retry occurs.
- Require independent review for high-severity drift.
- Require explicit human approval before production configuration changes, secret rotation, infrastructure changes, or weakening security controls.
- Distinguish `task executed` from `drift verified and resolved`.

## MUST NOT
- Store raw secret values in snapshots, reports, prompts, logs, examples, or review comments.
- Read production secrets merely to improve drift explainability.
- Mutate runtime configuration from the drift-detection workflow.
- Auto-copy values from one environment to another.
- Treat application health as proof that runtime configuration is correct.
- Suppress unexpected runtime keys without policy or evidence.
- Extend exception expiry automatically.
- Retry validation failures until they disappear.
- Increase tool permissions to unblock collection.
- Mark a remediation successful without a new post-change runtime snapshot.

## SHOULD
- Prefer source/fingerprint comparison to plaintext comparison for sensitive values.
- Keep snapshots small and limited to behaviorally relevant keys.
- Normalize booleans, numbers, URLs, lists, and nulls deterministically.
- Use short-lived, key-scoped drift exceptions.
- Recollect runtime evidence after any approved remediation.
- Integrate the gate before release, rollout continuation, and incident closure.