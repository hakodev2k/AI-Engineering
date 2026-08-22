# Investigate Redirect Chain

## Purpose
Prove whether a privileged HTTP request can leak credentials while following redirects.

## When to use
Use after an unexpected 3xx response, credential exposure alert, SSRF finding, changed upstream endpoint, proxy change, or HTTP-client upgrade.

## Inputs
Entry URL, client implementation/configuration, sanitized request/response traces, expected destination hosts, and `config/policy.json`.

## Preconditions
Work from non-production evidence when possible. Secret values must already be redacted.

## Allowed tools
Repository search, test runner, HTTP traces from controlled environments, and `scripts/redirect_gate.py`.

## Constraints
Do not send live secrets to test endpoints. Do not probe private-network targets from production.

## Procedure
1. Locate the client construction and redirect configuration.
2. Identify where credentials/cookies are attached and whether attachment happens before or after redirect evaluation.
3. Capture a sanitized hop-by-hop chain including status and header names.
4. Compare each target host and scheme with its predecessor.
5. Run `python scripts/redirect_gate.py --input <chain.json> --policy config/policy.json --output redirect-gate-report.json`.
6. Trace any blocked hop back to the responsible client, handler, proxy, or middleware.
7. Classify statements as fact, hypothesis, decision, or open question.
8. Preserve the report and minimal reproduction.

## Expected output
A report containing finding code, severity, hop, evidence, affected client, and remediation target.

## Verification
A finding is confirmed only when source behavior or a controlled reproduction shows the sensitive header is forwarded or the unsafe destination is accepted.

## Failure handling
If traces are incomplete, stop at `unverified`; do not infer header forwarding. If tooling fails twice for the same environment reason, preserve stderr and escalate.

## Stop conditions
Stop before production probing, secret retrieval, allowlist expansion, or network-policy changes.
