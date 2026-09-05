# Workflow: Research and Diagnose

## Trigger
New advisory, exposed MCP endpoint, transport change, or pre-release security review.

## Goal
Establish evidence and locate the exact trust-boundary failure before changing code.

## Inputs
Deployment/configuration, tool catalog, relevant advisories.

## Baseline
Capture listener scope, auth state, dangerous capabilities, direct-backend reachability, and current checker result.

## Stages
1. Observe current public/advisory signal and verify applicability.
2. Inventory effective listeners.
3. Trace request/auth path.
4. Classify capabilities and approvals.
5. Run deterministic checker.
6. Form root-cause hypothesis from evidence.
7. Validate hypothesis with configuration/source inspection.

## Responsible agent
Primary investigator; Security Reviewer remains independent.

## Tools
Read-only config/source inspection, listener tooling, `scripts/check_mcp_exposure.py`.

## Outputs
Baseline JSON, findings, evidence links, root-cause statement, remediation target.

## Checkpoints
Do not proceed to remediation if actual listener or auth state is unknown.

## Metrics
Count of public/wildcard endpoints, unauthenticated sensitive endpoints, bypass paths, policy violations.

## Retry policy
At most 2 attempts to resolve ambiguous runtime/config evidence.

## Stop conditions
Stop on confirmed dangerous unauthenticated exposure and escalate immediately; stop after 2 unresolved evidence attempts.

## Failure path
Preserve block status, gather logs/config snapshot, escalate to security owner.

## Verification
Root cause must explain observed exposure and checker finding.

## Definition of Done
Evidence is current, root cause is specific, baseline saved, and remediation can be mapped to an enforceable rule.