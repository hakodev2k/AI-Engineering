# Workflow: Configuration Drift Response

## Trigger
Suspected environment mismatch, post-deployment validation failure, incident evidence pointing to configuration, or scheduled/manual parity check.

## Entry conditions and inputs
Expected JSON source, authorized actual JSON snapshot, environment/application identity, `config/drift-policy.json`, repository context, and acceptance criteria.

## Flow
`Trigger → validate scope → detect → verify report → classify → plan → approval gate → remediate → test/recollect → detect again → independent verify → complete`

## Stages
1. **Validate context — Configuration Investigator.** Confirm provenance, scope, JSON validity, and read permissions. Produce context notes.
2. **Detect — Configuration Investigator.** Run `scripts/detect-config-drift.py`; preserve report and exit code.
3. **Verify report — Configuration Investigator.** Run `scripts/verify-drift-report.py`; block on redaction/schema failure.
4. **Classify — Configuration Investigator.** Mark differences intentional, suspicious, or unresolved with evidence.
5. **Plan — Configuration Remediator.** Trace generation path, decide which side is stale, propose smallest change and rollback.
6. **Approval checkpoint.** If the plan touches any `approval_required_for` category, status becomes `needs-approval`; stop until explicit approval exists.
7. **Execute — Configuration Remediator.** Apply only approved/minimal change; run relevant build/tests.
8. **Recollect and compare — Configuration Remediator.** Collect the actual snapshot using the original method and rerun detector/verifier.
9. **Independent verification — Independent Verifier.** Inspect reports, tests/build, diff/change receipt, approvals, and unintended changes.
10. **Complete.** Produce verified status and remaining risks.

## Retry and recovery
- Snapshot/tool transient failure: maximum 2 retries; preserve stderr, command, timestamp, and partial artifacts.
- Invalid JSON/validation failure: no blind retry; correct the input or stop.
- Permission failure: no retry with elevated privilege; escalate immediately.
- Remediation verification failure: maximum 1 evidence-based replan/remediation retry. Preserve pre/post reports and test output. A second failure stops and escalates.
- Business-rule/source-of-truth ambiguity: stop; human decision required.

## Failure paths
Tool/input error → `blocked`; approval requirement → `needs-approval`; confirmed remaining drift after retry → `blocked`; clean verified comparison → `clean`/complete.

## Definition of Done
- Same-scope expected and actual sources are identified.
- Drift report is machine-readable and verified with secrets redacted.
- Every detected difference is resolved, intentionally accepted with evidence, or explicitly documented as non-blocking.
- Required tests/builds pass.
- Post-remediation detector exits `0` when convergence is required.
- Independent verifier confirms no unintended changes.
- Required approvals exist before dangerous actions.
- No blocking failure remains and remaining risks are recorded.
