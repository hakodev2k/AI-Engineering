# User Acceptance Testing Rules

## Purpose
Ensure business acceptance validates real workflows and risks rather than duplicating technical testing.
## Scope
UAT planning, scenarios, participants, evidence, defects, and sign-off.
## MUST
- Select representative business scenarios, users, data, permissions, exceptions, and critical workflows.
- Define entry, exit, defect severity, and sign-off criteria before UAT begins.
- Record unresolved defects and obtain explicit risk acceptance before release when they remain open.
## MUST NOT
- Treat developer or QA execution as a substitute for business acceptance when UAT is required.
- Pressure participants to sign off known material failures.
## SHOULD
- Use production-like data patterns without exposing protected data.
## Exceptions
Low-risk changes may use delegated acceptance with documented authority.
## Verification
Inspect UAT plan, participant coverage, executed evidence, defect log, and sign-off records.