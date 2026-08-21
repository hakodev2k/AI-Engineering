# Workflow: PII Log Redaction Gate

## Trigger
Run when logging/telemetry code changes, when new diagnostics are generated, before sharing support bundles, or when CI finds sensitive data.

## Entry conditions
Repository is readable, policy exists, candidate files are known or can be generated locally, and no additional production access is required.

## Inputs
Changed files, generated logs/diagnostics, `config/redaction-policy.yaml`, test commands, and any approved scoped allowlist.

## Flow
Context -> Scan -> Investigate -> Plan -> Remediate -> Test -> Rescan -> Independent Verify -> Complete

## Stages
1. **Context** — Log Evidence Agent identifies logging entry points, trust boundaries, serializers, telemetry processors, and tests.
2. **Scan** — Execute deterministic scanner and save `pii-gate-report.json`.
3. **Investigate** — Map each blocking finding to source code; classify confirmed, false positive, or unresolved.
4. **Plan** — Prefer source removal/tokenization over downstream redaction. Record expected tests and diagnostic context to preserve.
5. **Remediate** — Implementation owner makes the smallest safe change. Production configuration changes are outside automatic scope.
6. **Test** — Run focused tests and generate representative logs.
7. **Rescan** — Re-run gate against outputs.
8. **Independent Verify** — Security Verifier reviews diff, policy, tests, and scanner result.
9. **Complete** — Mark verified only when Definition of Done is met.

## Produced artifacts
- `pii-gate-report.json`
- sanitized investigation findings
- remediation diff
- test output
- independent verification result

## Checkpoints
- Before remediation: evidence identifies the emitting path.
- After remediation: tests pass and diagnostics remain usable.
- Before completion: independent verifier confirms no policy bypass.

## Retry rules
- Scanner/tool transient failure: retry once with the same inputs and preserve stderr.
- Test infrastructure transient failure: retry once after confirming no code change.
- Validation or security finding: do not retry unchanged work; return to investigation/remediation.
- Second tool/environment failure: stop and escalate with evidence.

## Approval points
Explicit human approval is required before production telemetry/retention/routing changes, secret rotation, deleting evidence, weakening security controls, or uploading raw sensitive logs outside approved systems.

## Failure paths
- Unresolved high/critical finding -> `blocked`.
- Required production access unavailable -> `needs-approval` or `blocked`, never assumed safe.
- Scanner cannot execute -> `blocked`; tool failure is not a pass.
- Observability becomes insufficient -> revert remediation attempt and redesign.

## Stop conditions
No infinite loops. Maximum one identical transient retry per failed tool/test command. Stop on missing permission, unclear data handling authority, or dangerous action requiring approval.

## Definition of Done
- Candidate logging surfaces were identified.
- Blocking findings were removed or have explicit approved exceptions.
- No raw sensitive values exist in reports/handoffs.
- Focused tests pass.
- Representative generated logs pass the scanner.
- Policy was not weakened to obtain a pass.
- Independent verification is `verified`.
- Remaining risks are documented and non-blocking.
