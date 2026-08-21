# Configuration Drift Safety Rules

## MUST
- Identify the target environment explicitly before evaluating drift.
- Compare the current snapshot with an approved baseline from the same application/environment scope.
- Run `scripts/config_drift_gate.py` before treating drift as safe.
- Treat exit code `0` as passed, `2` as blocked, `4` as approval required, and other non-zero codes as tool/configuration failure.
- Redact sensitive values in reports, approvals, logs, and agent outputs.
- Require explicit human approval before production configuration changes or baseline replacement.
- Re-run the gate after any material snapshot, baseline, or policy change.
- Preserve evidence linking a change to repository/deployment/change records.

## MUST NOT
- Read or persist plaintext secrets merely to compare environments.
- Replace the approved baseline to make unexpected drift disappear.
- Modify `config/policy.yaml` automatically to suppress a finding.
- Disable TLS, certificate validation, authentication checks, or equivalent security controls to unblock a deployment.
- Expand environment, cloud, secret-store, or deployment permissions automatically.
- Apply production configuration changes, feature-flag changes, or endpoint changes without explicit human approval.
- Claim configuration is verified because a diff was generated; the gate and independent verification are required.
- Treat missing keys as equivalent to null/empty values without evidence from the configuration system.

## SHOULD
- Keep baseline snapshots versioned with provenance.
- Prefer deterministic normalized JSON/YAML exports over screenshots or copied console text.
- Use stable placeholders such as `<managed-secret>` for sensitive-value presence.
- Investigate protected-key drift independently from bulk low-risk drift.
- Keep the implementing agent separate from the final verifier for production changes.
- Use platform-native policy and least-privilege controls as the final enforcement boundary.
