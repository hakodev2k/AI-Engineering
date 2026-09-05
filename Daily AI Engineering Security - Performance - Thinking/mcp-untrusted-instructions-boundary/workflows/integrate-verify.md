# Workflow: Integrate and Verify

## Trigger
Validated trust-boundary finding.

## Goal
Isolate untrusted MCP content and preserve external authorization without functional regression.

## Inputs
Baseline, trust map, remediation constraints, fixtures.

## Baseline
Pre-change hostile/benign fixture results and permission-invariant tests.

## Stages
1. Add provenance-preserving untrusted context path.
2. Add deterministic pre-ingestion hook.
3. Ensure tool permissions and approvals remain external to model text.
4. Run unit tests.
5. Replay benign and hostile fixtures.
6. Compare pre/post security metrics and functionality.
7. Security Verifier independently reproduces results.

## Responsible agent
Implementation Agent steps 1-6; Security Verifier step 7.

## Tools
Editor, tests, mock MCP server, inspection script.

## Outputs
Implementation diff, test evidence, before/after matrix, reviewer decision.

## Checkpoints
Any permission widening, approval bypass, lost provenance, or secret exposure blocks completion.

## Metrics
Host-policy mutations 0; unauthorized tool calls 0; hostile privileged insertions 0; benign fixture compatibility within agreed tolerance.

## Retry policy
Maximum 2 implementation cycles.

## Stop conditions
Stop after 2 failed cycles or immediately if a proposed fix requires weaker authorization.

## Failure path
Revert unsafe change, keep gate blocking, escalate.

## Verification
Independent reviewer verifies both injection resistance and normal benign-server behavior.

## Definition of Done
Implemented, measured, verified; no blocking security issue; authorization and approval boundaries preserved.