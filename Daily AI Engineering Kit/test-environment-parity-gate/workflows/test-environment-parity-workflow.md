# Workflow: Test Environment Parity Gate

## Trigger
Before using integration/E2E/performance test results as release evidence; after dependency/runtime/provider changes; after environment-specific defects; before high-risk agent completion.

## Flow
```text
Trigger
  ↓
Define target environment contract
  ↓
Start/resolve test environment
  ↓
Capture actual environment
  ↓
Run required tests
  ↓
Evaluate parity
  ↓
Critical gap? ── yes ──> remediate / broader real-provider verification
  ↓ no                         ↑ max 2 remediation cycles
Independent review when required
  ↓
Final gate
  ↓
verified / blocked
```

## Stages
1. **Contract — Environment Profiler:** produce target contract from authoritative repository/runtime evidence.
2. **Snapshot — deterministic capture:** run `python scripts/capture-environment.py --output artifacts/environment-snapshot.json --name ci-integration --source <job-id>` and enrich project-specific dimensions without secrets.
3. **Test execution — Test owner:** execute repository-required tests and preserve report/evidence reference.
4. **Parity evaluation — deterministic:** run `python scripts/evaluate-parity.py --contract environment-contract.json --snapshot artifacts/environment-snapshot.json --policy config/parity-policy.json --output artifacts/parity-evaluation.json`.
5. **Remediation — implementation owner:** follow `skills/remediate-parity-gaps.md`. Maximum **2** remediation cycles. A third unresolved cycle blocks.
6. **Independent review — Parity Reviewer:** mandatory for production-target or critical-gap policy trigger.
7. **Final gate:** run `python scripts/evaluate-parity-gate.py --evaluation artifacts/parity-evaluation.json --review artifacts/parity-review.json --implementation-owner implementation-agent --tests-status passed --output artifacts/parity-gate.json`.

## Checkpoints
- Contract and snapshot contain no raw secrets.
- Snapshot was captured from the environment that produced test evidence.
- Tests passing and parity passing are separate checks.
- Review fingerprints match current evaluation.

## Retry rules
- Transient environment/tool startup/read failure: max **1** retry, preserving first failure.
- Semantic mismatch, failed test, validation, permission, security or business-rule failure: **0** blind retries.
- Remediation/re-capture loop: max **2** cycles.

## Approval points
Stop for explicit human approval before production deployment, destructive SQL, schema/data deletion, force push, infrastructure/secret/production-config changes, breaking API changes, security weakening, irreversible migrations or large dependency upgrades.

## Failure paths
- Required target evidence unknown → block production-target verification.
- Required dimension missing → parity evaluator blocks.
- Test environment differs materially → remediate or add real-provider verification.
- Review stale after re-capture → invalidate and review again.
- Permission failure → stop without privilege escalation.

## Definition of Done
Current contract and snapshot exist; required tests passed; parity evaluation is acceptable; all critical gaps are resolved; required independent review is current; final gate returns `verified`; dangerous actions remain separately approved.
