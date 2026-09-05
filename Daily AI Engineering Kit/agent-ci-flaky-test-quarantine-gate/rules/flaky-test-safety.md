# Flaky Test Safety Rules

## MUST
- Preserve real execution evidence and exact test identity.
- Require both pass and fail observations before calling a test flaky.
- Run deterministic policy checks before quarantine.
- Give every quarantine an owner, issue, approver, reason, creation time, and expiry.
- Keep quarantine duration within configured maximum.
- Re-run host build/tests after fixes.
- Use independent verification before completion.

## MUST NOT
- Convert a deterministic regression into a flaky label to make CI green.
- Delete or silently skip a failing test to bypass the gate.
- Extend expired quarantine automatically.
- Fabricate duplicate observations or reruns.
- Use unlimited retries.
- Change production, secrets, infrastructure, destructive data, Git history, public API contracts, or security controls without explicit approval.

## SHOULD
- Prefer root-cause fixes over quarantine.
- Preserve quarantined test execution in a non-blocking lane when supported.
- Reproduce with deterministic seeds, clocks, and isolated resources.
- Keep quarantine scope to the minimum affected test identity.
