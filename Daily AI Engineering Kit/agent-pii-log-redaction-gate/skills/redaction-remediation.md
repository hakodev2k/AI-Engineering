# Skill: Redaction Remediation

## Purpose
Implement the smallest safe change that prevents sensitive fields from entering logs while retaining diagnostic value.

## Inputs
Confirmed findings, source logging code, logging conventions, tests, and redaction policy.

## Preconditions
The sensitive field and emitting path are evidenced, not guessed.

## Procedure
1. Map each finding to the exact logging/serialization path.
2. Rank remediation options: remove field; replace with stable non-reversible identifier; structured allowlist; type-aware masking; last-resort output redaction.
3. Choose the narrowest option that preserves troubleshooting capability.
4. Add or update tests covering both sensitive and benign values.
5. Generate representative logs locally.
6. Run `pii_log_gate.py` against those logs.
7. Confirm unrelated fields and correlation IDs remain usable.
8. Review the final diff for accidental logging expansion.

## Required behavior
Never log credentials, bearer tokens, connection-string secrets, complete payment-card values, or raw authentication artifacts. Do not convert a secret into a merely obscured reversible form.

## Expected output
Remediation summary with affected logger, chosen strategy, tests, scanner result, and residual risk.

## Verification
All tests pass, scanner passes, and a separate verifier confirms that no high/critical finding was suppressed through an unjustified allowlist.

## Failure handling
If remediation breaks observability or produces uncertain masking, revert the attempted change, preserve evidence, and escalate rather than weakening policy.

## Stop conditions
Stop before changing production log sinks, retention, telemetry routing, secret stores, or security controls without approval.
