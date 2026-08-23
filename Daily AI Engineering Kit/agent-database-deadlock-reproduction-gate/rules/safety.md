# Deadlock Gate Rules

## MUST
- Preserve database deadlock evidence before editing code.
- Identify at least two participating transactions and their resource acquisition order before claiming root cause.
- Reproduce against non-production data before claiming a fix is verified.
- Bound reproduction attempts to three and fix attempts to two.
- Validate the final evidence contract with `scripts/validate-evidence.py`.
- Obtain explicit human approval before schema/index changes, production writes, production tracing that changes server state, isolation-level changes, or production configuration changes.
- Preserve business consistency and rollback behavior while changing lock behavior.

## MUST NOT
- Run destructive SQL or test harnesses against production.
- Treat `scripts/scan-lock-order.py` output as proof of a deadlock.
- Add unlimited deadlock retries, swallow deadlock exceptions, or increase timeouts as a substitute for root-cause correction.
- Force push, rewrite Git history, delete data, weaken security, or increase permissions to unblock investigation.
- Claim verification when the pre-fix deadlock was never reproduced or the post-fix test was not run.

## SHOULD
- Prefer consistent resource acquisition order and shorter transactions when supported by evidence.
- Keep external network calls outside database transactions where business semantics permit.
- Add a regression test that coordinates transactions deterministically rather than relying on random load.
- Record database engine/version because locking semantics differ across engines.
