# Configuration Drift Safety Rules

## MUST
- Identify both the expected configuration source and the observed configuration source before declaring drift.
- Preserve a machine-readable report for every comparison.
- Redact values whose key path matches secret patterns in `config/drift-policy.json`.
- Treat exit code `2` from `scripts/detect-config-drift.py` as detected drift, not a tool crash.
- Require independent verification before reporting remediation as complete.
- Stop for explicit human approval before production configuration, secret, infrastructure, deployment, breaking-contract, destructive, or irreversible changes.
- Record unresolved differences and the evidence used to classify them.

## MUST NOT
- Print, commit, or copy plaintext secret values into reports or agent messages.
- Treat an environment-specific difference as harmless without evidence that it is intentional.
- Edit production configuration merely to make the comparison pass.
- broaden permissions, fetch additional secrets, deploy, delete data, rewrite Git history, or weaken security controls to resolve drift.
- Claim clean status when the detector or verifier failed.

## SHOULD
- Compare normalized snapshots generated as close in time as practical.
- Prefer repository-owned expected configuration or an explicitly approved baseline.
- Minimize remediation to the smallest proven mismatch.
- Add a regression check when drift was caused by a repeatable configuration-generation defect.
