# Incident Root Cause Workflow

## Trigger
A production incident, elevated error rate, failed background job, unexplained timeout, cross-service exception chain, or user-impact report requires evidence-based root-cause analysis.

## Entry conditions
- Approximate incident time or correlation identifier is known.
- Read-only logs are available or can be exported safely.
- Production writes are not required.

## Inputs
Incident description, time range, known identifiers, log sources, repository, acceptance criteria.

## Stages
1. **Validate inputs** — Log Evidence Collector checks time range, sources, identifiers, and policy.
2. **Collect evidence** — run `scripts/correlate_logs.py` against exported JSONL/JSON logs.
3. **Checkpoint A** — schema-validate evidence; block if secret-like fields remain or sources are missing without disclosure.
4. **Form hypotheses** — Root Cause Analyst identifies candidate mechanisms from the first abnormal event.
5. **Repository trace** — inspect entry point, state changes, external dependencies, retries, timeouts, queue/database behavior, and nearby tests.
6. **Validate** — reproduce or deterministically test hypotheses in non-production.
7. **Correct** — if changes are authorized, implement the smallest safe fix and add a regression test.
8. **Checkpoint B** — run focused tests and relevant broader tests; preserve output.
9. **Independent verification** — Verification Agent inspects evidence, report, tests, and diff.
10. **Complete** — produce evidence JSON and root-cause report.

## Produced artifacts
- `artifacts/log-correlation-evidence.json`
- `artifacts/root-cause-report.md`

## Retry rules
- Log parsing/tool transient failure: maximum 2 retries; preserve failed input/output.
- Investigation-window expansion: maximum 2 expansions; record justification and prior boundaries.
- Candidate fix/test loop: maximum 2 corrective retries after preserving failures.
- Permission/environment failures are not retryable without changed conditions.

## Approval points
Stop before production deployment/configuration, schema/data changes, destructive operations, secret changes, infrastructure changes, security-control weakening, breaking contracts, or irreversible migrations.

## Failure paths
- Missing logs → status `blocked` or `inconclusive`, enumerate missing source/time range.
- Ambiguous correlation → status `inconclusive`; do not invent a causal chain.
- Failed candidate fix → preserve test output, revert/limit candidate changes if safe, escalate.
- Verification failure → task remains executed but not verified.

## Definition of Done
- Evidence artifact is schema-valid and redacted.
- First abnormal event/failure boundary is identified or explicitly inconclusive.
- Root-cause confidence is explicit.
- Causal claims reference evidence.
- Authorized code changes have regression coverage and passing relevant tests.
- Independent verification completed.
- Required approvals are documented before any dangerous next step.
- Remaining risks/missing evidence are recorded.
