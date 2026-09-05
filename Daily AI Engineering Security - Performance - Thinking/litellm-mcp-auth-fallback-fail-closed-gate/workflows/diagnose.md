# Workflow: Diagnose Auth Fallback

## Trigger
CVE applicability check, MCP auth anomaly, gateway upgrade, or pre-release review.

## Goal
Identify whether failed authentication can traverse to an accepted MCP identity/tool path.

## Inputs
Gateway version/build, config, route inventory, proxy topology, permissions.

## Baseline
Record current version, route exposure, auth modes, public exceptions, OAuth2 targets, and negative-test behavior.

## Stages
1. Observe current advisory and deployment facts.
2. Measure baseline negative-auth behavior.
3. Trace identity decision branches.
4. Map accepted identity to MCP server/tool authorization.
5. Form root-cause hypothesis.
6. Validate against source/config evidence.

## Responsible agent
Security investigator.

## Tools
Read-only inspection, safe HTTP tests, checker.

## Outputs
Baseline, facts/evidence, hypothesis, affected routes, remediation target.

## Checkpoints
Do not infer safety from version string alone when build provenance is uncertain.

## Metrics
Accepted malformed-token sessions; sensitive tools visible to invalid/anonymous identity; uncovered routes.

## Retry policy
Maximum 2 evidence-resolution attempts; one transient network retry per probe.

## Stop conditions
Confirmed bypass, destructive test requirement, or unresolved effective auth state after retry budget.

## Failure path
Keep route/deployment blocked and escalate with evidence.

## Verification
Root cause must explain both identity acceptance and downstream authorization behavior.

## Definition of Done
Specific failure path is evidenced or the deployment is shown non-applicable with reproducible evidence.