# Task Procedure Rules
## Purpose
Make procedural documentation safe, executable, and independently verifiable.
## Scope
Tutorials, how-to guides, runbooks, setup, migration, and operational procedures.
## MUST
- State prerequisites, permissions, supported environment, starting state, ordered actions, expected results, and completion verification.
- Identify destructive, irreversible, billable, security-sensitive, or production-affecting steps before execution.
- Provide recovery or rollback guidance when a procedure can leave a harmful partial state.
- Test critical procedures from a clean or representative environment before release.
## MUST NOT
- Hide required setup in later steps.
- Instruct users to bypass security controls merely to make a procedure succeed.
## SHOULD
- Keep each step focused on one observable action and include troubleshooting at likely failure points.
## Exceptions
Conceptual walkthroughs may omit executable detail only when explicitly labeled non-production or illustrative.
## Verification
Execute the procedure, compare expected outcomes, validate rollback where feasible, and review permissions and safety warnings.