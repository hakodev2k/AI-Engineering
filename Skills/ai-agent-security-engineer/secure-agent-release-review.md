# Secure Agent Release Review

## Purpose
Perform a final Senior-level security review before releasing a new agent capability, model, prompt, tool, memory design, or orchestration change.

## When to use
Use before production rollout, privilege expansion, new external integration, major model migration, or significant workflow change.

## Inputs
Change set, threat model, architecture, tool list, identities, security tests, model/prompt versions, data flows, deployment plan, monitoring, and rollback plan.

## Preconditions
The feature must have defined acceptance criteria, owners, and a testable deployment artifact. Security review is not a substitute for incomplete requirements.

## Context to inspect
Diffs, configuration, prompts, tool schemas, authorization, credentials, memory, retrieval, browser/network access, sandboxing, logs, approvals, rate limits, model-provider settings, and downstream effects.

## Core knowledge
Agent releases can change effective behavior without traditional code changes. Model versions, system prompts, tool descriptions, retrieval sources, policies, and context assembly are security-relevant release artifacts and require versioning and regression testing.

## Procedure
1. Identify exactly what capability or authority changes.
2. Confirm the selected role/workflow threat model still matches the implementation.
3. Review new or expanded data access and tool permissions.
4. Confirm sensitive actions have deterministic authorization.
5. Check prompt-injection defenses and untrusted-content boundaries.
6. Confirm secrets remain outside model-readable context where possible.
7. Review sandbox, network egress, and external destination controls.
8. Validate memory scope, provenance, retention, and poisoning defenses.
9. Verify tool inputs and model outputs are validated.
10. Confirm approval gates bind to exact high-risk actions.
11. Run adversarial regression tests and normal acceptance tests.
12. Review audit logging, alerts, quotas, and incident-response readiness.
13. Confirm model, prompt, tool, policy, and configuration versions are traceable.
14. Define staged rollout, rollback triggers, and emergency disable controls.
15. Record residual risks and explicit acceptance owners before release.

## Decision points
Block release when a critical security boundary depends only on model compliance. Use staged rollout when behavioral uncertainty remains but deterministic containment is strong. Require additional approval for irreversible or regulated capabilities.

## Common failure patterns
Reviewing only source-code diffs, skipping tests after model changes, expanding scopes for convenience, missing rollback for prompt/config changes, and accepting undocumented residual risk.

## Verification
A release is implemented when controls exist; it is verified only when security and functional tests pass against the exact release artifact and rollback/disable paths are exercised or otherwise proven operational.

## Expected output
A release-security decision with evidence, unresolved risks, owners, rollout constraints, monitoring requirements, and rollback criteria.

## Stop conditions
Block and escalate if critical tests fail, authorization is model-controlled, required audit evidence is absent, rollback is impossible for a high-risk change, or residual critical risk lacks an accountable owner.