# Workflow: Research and Diagnose

## Trigger
New MCP metadata path, injection report, SDK/spec change, or security review.

## Goal
Establish the real trust boundary and root cause before proposing a fix.

## Inputs
Current client/server behavior, public evidence, prompt assembly path, authorization policy.

## Baseline
Capture exact server text, provenance, destination context class, available tools, approval state, and whether hostile text alters behavior in a safe test harness.

## Stages
1. Observe public/current signal and validate applicability.
2. Inventory MCP server-authored fields.
3. Trace each field into model context.
4. Record facts, assumptions, evidence, and hypotheses.
5. Run deterministic instruction inspection.
6. Test permission invariants with mocks.
7. Validate root cause in source/configuration.

## Responsible agent
Security investigator; Security Verifier remains independent.

## Tools
Read-only source/config inspection, safe MCP fixture, script, tests.

## Outputs
Baseline, trust map, evidence ledger, root-cause statement, remediation constraints.

## Checkpoints
Do not implement until provenance and effective authorization are known.

## Metrics
Privileged insertions, hostile fixture acceptance, permission changes, approval bypasses.

## Retry policy
Maximum 2 diagnostic retries for ambiguous evidence.

## Stop conditions
Confirmed escalation/secret exposure; or unresolved trust boundary after 2 attempts.

## Failure path
Preserve blocking status and escalate with collected evidence.

## Verification
Root cause must explain both text ingestion and the resulting privilege path.

## Definition of Done
Evidence is current, root cause specific, baseline reproducible, and remediation maps to enforceable rules.