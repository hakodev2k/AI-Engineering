# Release Readiness Assessment Skill

## Purpose
Determine whether a software release is ready.

## Trigger
A release candidate, milestone, or deployment request exists.

## Inputs
- Release scope
- Tickets
- Build artifacts
- Test results
- Environment status
- Risks

## Procedure
1. Validate inputs.
2. Separate facts, assumptions, and unknowns.
3. Check requirements coverage.
4. Review quality, security, operational risks.
5. Identify blockers.
6. Produce readiness decision.

## Decisions
- Ready: all mandatory checks pass.
- Conditional: known risks accepted by owner.
- Blocked: critical evidence missing.

## Verification
Evidence must include build status, tests, deployment information, and approvals.

## Failure handling
Do not bypass missing evidence. Escalate critical risks.
