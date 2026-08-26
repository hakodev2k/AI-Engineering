# Workflow: Research and Diagnose
**Trigger:** new MCP server or injection/control report.  
**Goal:** establish whether server metadata can influence privileged behavior.

## Inputs
Server metadata, prompt assembly, cache configuration, tool policy.

## Baseline
Capture current prompt assembly, cache scope, tool allowlist and approval behavior.

## Stages
1. Observe provenance.
2. Measure where instructions enter model context.
3. Diagnose boundary crossings.
4. Form one explicit hypothesis.
5. Run guard and adversarial fixtures.
6. If the hypothesis fails, revise at most twice.

## Responsible agent
Security reviewer for verification; implementation owner for fixes.

## Tools
Read-only inspection, deterministic guard, unit tests.

## Outputs
Facts, Evidence, Root cause, Decision, Verification status.

## Checkpoints
After baseline; after guard result; before privileged-tool test.

## Metrics
Trust-label coverage, forbidden cache events, approval coverage, attack-fixture block rate.

## Retry policy
Maximum 2 diagnostic revisions.

## Stop conditions
Confirmed secret exposure, production-write risk, missing provenance, or exhausted retries.

## Failure path
Disable affected server/tool binding and escalate.

## Verification
Independent reviewer reproduces the block.

## Definition of Done
Evidence recorded, root cause identified, deterministic control validated, no blocking violation remains.
