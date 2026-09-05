# Workflow: Environment Configuration Parity

## Trigger
Configuration-consuming code, templates, deployment files, CI variables, or feature flags changed.

## Entry conditions
Repository is readable and environment metadata can be normalized without exposing secrets.

## Inputs
Task, repository, policy, environment manifests, build/test commands.

## Stages
1. **Pre-task validation** — Config Explorer confirms repository/config sources and baseline manifests.
2. **Discover** — map configuration consumers and environment declarations.
3. **Baseline gate** — run `scripts/config_parity_gate.py` and preserve report.
4. **Plan** — Remediation Planner defines smallest safe fix.
5. **Approval checkpoint** — stop before production config, secret, infrastructure, security, destructive, schema, or deployment actions.
6. **Implement** — implementation owner edits only approved repository sources/templates.
7. **Re-normalize** — regenerate candidate manifests from changed sources.
8. **Test** — run parity gate and host build/tests.
9. **Review** — inspect diff for unrelated config changes and secret leakage.
10. **Verify** — independent Verification Agent reviews evidence.
11. **Complete** — only when Definition of Done is met.

## Produced artifacts
Config inventory, normalized manifests, parity report, remediation plan, test output, approval evidence when applicable, verification status.

## Checkpoints
Baseline captured before edits; approval before dangerous actions; fresh candidate evidence after edits.

## Retry rules
Transient tool/read failure: max 2. Build/test/parity failure after implementation: max 2 remediation cycles. Permission/approval failure: no automatic retry.

## Failure paths
Invalid manifest -> fix normalization and rerun. Unknown critical environment -> stop. Secret exposure -> stop, remove exposure, escalate according to repository policy. Persistent parity failure -> preserve evidence and escalate.

## Stop conditions
Exceeded retries, missing approval, unknown production impact, secret-handling risk, or unresolved blocking drift.

## Definition of Done
All governed manifests exist; required keys/types/requiredness agree; equality policy passes; no committed secrets; host tests/build pass; independent status is `verified`; no blocking failure remains.
