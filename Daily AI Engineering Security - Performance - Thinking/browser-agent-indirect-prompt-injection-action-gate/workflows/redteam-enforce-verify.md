# Workflow: Red-Team, Enforce, Verify

## Trigger
Browser/computer-use deployment, new authenticated capability, new indirect-prompt-injection evidence, new high-risk action, or policy regression.

## Goal
Block untrusted-content-driven sensitive actions with deterministic authorization while preserving benign utility.

## Inputs
User-intent fixtures, browser/tool inventory, policy config, trust provenance, sensitive-data classes, destination allowlist, adversarial corpus, benign controls.

## Baseline
Run isolated benign and adversarial fixtures using the current system. Record attack success, unauthorized side effects, benign completion, approval frequency, and policy-evaluation latency where available. Never use production credentials.

## Context
Apply `rules/browser-action-security-rules.md` and the threat-model skill.

## Stages
1. **Observe — Security Reviewer.** Map sources, credentials/authority, sensitive assets, and side-effect sinks.
2. **Measure baseline — Security Reviewer.** Execute controlled fixtures and capture redacted action traces.
3. **Diagnose — Security Reviewer.** Identify where untrusted content crosses into authority or sensitive-data handling.
4. **Form hypothesis — Security Reviewer.** State the deterministic decision that should break each attack path.
5. **Implement enforcement — Implementation owner.** Insert the pre-action policy gate before sensitive reads/side effects where technically possible.
6. **Measure again — Security Reviewer.** Re-run identical fixtures.
7. **Decision checkpoint.** If an attack still succeeds or benign regression exceeds policy, revise once. Maximum two policy/implementation attempts.
8. **Independent verification — Verification Agent.** Re-run tests, inspect logs, and confirm approval binding and fail-closed behavior.

## Tools
`browser_action_gate.py`, unit tests, isolated browser fixtures, red-team harness, log/trace inspection, secret scanning.

## Outputs
Threat model, baseline results, policy config, post-change results, residual-risk register, independent verdict.

## Checkpoints
- Production credentials are prohibited in adversarial tests.
- Policy decision occurs before action execution.
- Sensitive-data destinations are checked before egress.
- Dangerous/irreversible actions require human approval.

## Metrics
Attack success rate, unauthorized side-effect rate, sensitive-data exfiltration rate, benign success, false-block rate, approval rate, decision latency, secrets-in-logs count.

## Retry policy
Maximum two implementation/policy revisions. Each retry must identify the previous failing attack path or benign regression.

## Stop conditions
Success: all blocking tests pass and independent verification returns `VERIFIED`. Failure: any tested high-severity attack remains executable, secrets appear in logs, approval boundaries are bypassed, or two revisions fail.

## Failure path
Fail closed on affected high-risk actions, retain redacted evidence, restore last known-good policy if a regression was introduced, and escalate to a human security owner. Never disable authorization to preserve task completion.

## Definition of Done
Evidence and threat model documented; baseline measured; deterministic gate installed; tests pass; attack paths blocked; benign regression assessed; logs contain no secrets; approval boundaries preserved; independent verification complete.
