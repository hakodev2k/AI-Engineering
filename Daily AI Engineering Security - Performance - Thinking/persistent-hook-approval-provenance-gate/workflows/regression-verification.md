# Workflow — Regression Verification
## Trigger
Any change to hook loading, session resume/fork, trust UX or agent-host server tools.
## Goal
Prove trust does not regress across execution paths.
## Inputs
Policy, fixtures and changed source.
## Baseline
One valid human-approved fixture plus exploit fixtures for agent PTY approval, changed hash, untrusted cwd and server-tool initiation.
## Stages
1. Run unit suite.
2. Exercise every lifecycle event represented in policy.
3. Confirm changed hash fails until re-approved.
4. Confirm agent-controlled input can never satisfy persistent trust.
5. Confirm authoritative cwd is validated at dispatch time.
## Metrics
Fixture pass rate, execution-path coverage, false allow count.
## Retry policy
One fix/re-run cycle.
## Stop conditions
Any false allow blocks release.
## Failure path
Revert or disable the affected hook path.
## Verification
Security Reviewer separate from implementer signs off.
## Definition of Done
Zero false allows and all valid cases still work.
