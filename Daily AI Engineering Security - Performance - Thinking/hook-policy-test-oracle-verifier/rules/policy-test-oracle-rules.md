# Policy Test Oracle Rules

- Every security hook test **MUST** declare an expected semantic outcome: `allow`, `deny`, or `ask`.
- A hook process exiting successfully **MUST NOT** by itself count as a passing security test.
- The verifier **MUST** interpret both exit status and structured hook output when deriving the observed decision.
- A high-risk capability **MUST** include at least one negative case expected to deny or require approval.
- Effective-runtime verification **MUST** be separate from isolated hook-unit verification.
- Missing runtime observations **MUST** fail verification for required cases.
- A runtime upgrade, permission-mode change, IDE/host change, or hook configuration change **MUST** invalidate prior runtime verification for affected cases.
- Tests **MUST NOT** execute destructive production actions merely to prove a deny; use harmless canaries or sandboxed substitutes.
- Untrusted hook executables **MUST NOT** be run by this verifier.
- Hook execution **MUST** use argument-vector invocation, never `shell=True` or string shell interpolation.
- Hook tests **MUST** use bounded timeouts. A timeout is a test failure, not an implicit allow/deny success.
- Security verification **MUST NOT** be weakened to improve pass rate or performance.
- Completion **MUST** distinguish Implemented, Measured, and Verified.
