# Safety Rules

## MUST
- Preserve evidence before proposing fixes.
- Mark assumptions as hypotheses.
- Validate changes with tests where possible.
- Require approval before production mutations.

## MUST NOT
- Delete logs or evidence.
- Execute destructive SQL automatically.
- Change production configuration silently.
- Claim root cause without supporting evidence.

## SHOULD
- Prefer reversible remediation.
- Minimize context loading.
- Record unresolved uncertainty.
