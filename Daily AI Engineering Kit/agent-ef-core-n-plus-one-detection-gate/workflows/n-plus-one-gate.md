# Workflow: EF Core N+1 Detection Gate

## Trigger
A slow endpoint/job, query-count regression, or code review indicates repeated EF Core access per item.

## Entry conditions
A reproducible path or correlated command log exists. Repository source is readable. Production access is read-only unless separately approved.

## Inputs
Scenario, representative input, EF command log, repository source, `config/policy.yaml`.

## Stages
1. **Context** — Query Investigator locates entry point, data access, mappings, and tests.
2. **Detect** — Run `scripts/detect_n_plus_one.py`; save structured result.
3. **Prove** — Investigator maps suspect SQL to the per-item call site and checks growth versus input size.
4. **Plan** — Select smallest remediation from projection, targeted include, batching, or moved materialization.
5. **Approval checkpoint** — Stop if plan requires schema/index changes, production config/query changes, breaking contracts, or global lazy-loading changes.
6. **Implement** — Apply one focused change and tests.
7. **Test** — Build and run affected unit/integration tests.
8. **Recapture** — Produce after-log using the same scenario.
9. **Verify** — Verification Agent reruns detector and inspects semantic/diff risks.
10. **Complete** — Record evidence and unresolved risks.

## Produced artifacts
Detector JSON, investigation finding, before/after logs, test/build output, verification status.

## Checkpoints
Detection must precede remediation. Functional tests must pass before performance verification. Independent verification is required for completion.

## Retry rules
Maximum two implementation retries. Retryable: localized build/test failures caused by the attempted fix, incomplete local log capture, transient test infrastructure failure. Preserve previous code diff, logs, and outputs. After two failed remediation attempts, stop and escalate.

## Failure paths
- Missing correlation or incomplete logs: `blocked`, request better evidence.
- Detector finds no suspect: `rejected` unless code evidence proves detector limitations.
- Functional regression: fail and revert/adjust within retry budget.
- Permission/tool failure: preserve evidence and stop; never elevate permissions silently.

## Definition of Done
Confirmed root cause, focused remediation exists, relevant tests/build pass, after-log no longer contains original suspect group, semantic boundaries remain intact, independent verifier returns `verified`, and any approval-required action has explicit approval.
