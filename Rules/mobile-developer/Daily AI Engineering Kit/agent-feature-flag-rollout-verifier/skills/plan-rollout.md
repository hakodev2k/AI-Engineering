# Skill: Plan a Feature-Flag Rollout

## Purpose
Turn a requested feature-flag release into a bounded, verifiable rollout plan.

## When to use
Use before changing flag state or exposure in any environment where the new behavior can affect users, data, security, performance, or external integrations.

## Inputs
- Flag key and provider.
- Target environment.
- Changed behavior and affected components.
- Candidate cohort/targeting attributes.
- Existing tests and observability.
- Requested rollout percentage or stages.

## Preconditions
- Repository and relevant implementation are accessible.
- Flag-off and flag-on code paths can be identified.
- Production-impacting actions are not performed without approval.

## Required context
- Flag definition/evaluation code.
- Entry points and downstream dependencies.
- Tests covering both branches.
- Dashboards/log queries or equivalent telemetry.
- Rollback mechanism.

## Allowed tools
Repository search/read, test runner, build/lint tools, local scripts, read-only observability queries, feature-flag provider read operations.

## Constraints
Follow `../rules/rollout-safety.md` and `../config/rollout-policy.yaml`.

## Process
1. Locate every evaluation of the flag key and identify all affected execution paths.
2. Classify risk as low, medium, or high using blast radius, data impact, security sensitivity, external contracts, and reversibility.
3. Identify flag-off baseline behavior and expected flag-on behavior.
4. Enumerate tests required for normal, negative, fallback, and rollback paths.
5. Define quantitative guardrails for correctness, error rate, latency, saturation, and business signals where applicable.
6. Select an initial cohort not exceeding policy limits.
7. Define rollout stages, observation window for each stage, and explicit expansion criteria.
8. Define rollback trigger and rollback action.
9. Produce a rollout contract conforming to `../schemas/rollout-contract.schema.json`.
10. Mark status `needs-approval` when any approval boundary applies; otherwise `ready` only after required checks pass.

## Expected output
A completed rollout contract plus evidence references for baseline, tests, telemetry, and rollback readiness.

## Verification
Run `python scripts/validate-rollout.py --contract <path> --policy config/rollout-policy.yaml` from the package root.

## Failure handling
- Missing evidence: status `blocked`; list missing artifacts.
- Tool failure: retry at most twice when transient and preserve error output.
- Ambiguous behavior: stop and require clarification in the contract's `open_questions` field.

## Stop conditions
Stop before any production enablement, exposure expansion above 25%, security-sensitive path, breaking contract, or irreversible data path until explicit approval exists.
