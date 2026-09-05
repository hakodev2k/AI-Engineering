# Workflow: Research, Quarantine, Verify

## Trigger
Any package introduction or upgrade for MCP/agent use.

## Goal
Prevent malicious package code from executing in a credentialed environment.

## Inputs
Package request, intended version/source, policy.

## Baseline
Record whether current process would install directly, what credentials are present, and existing advisory coverage.

## Context
Expected publisher, capabilities, deployment environment.

## Stages
1. Observe current advisory/public signals.
2. Resolve immutable artifact identity.
3. Collect metadata without execution.
4. Run scanner and form risk hypothesis.
5. Inspect flagged surfaces.
6. If eligible, sandbox install with restricted credentials/network.
7. Compare observed behavior with expected behavior.
8. Independent review for elevated risk.
9. Approve or block.

## Responsible agent
Supply-chain investigator; independent reviewer for step 8.

## Tools
Advisory sources, registry metadata, archive inspection, scanner, sandbox telemetry.

## Outputs
Decision, evidence, metrics, approval record.

## Checkpoints
No code execution before step 6. No production credentials in step 6.

## Metrics
Findings, advisory matches, suspicious execution surfaces, unexpected network/process/file activity.

## Retry policy
At most 2 metadata/inspection retries and 1 sandbox rerun for transient failure.

## Stop conditions
Malware match, unexpected credential access/exfiltration behavior, or unresolved provenance after retries.

## Failure path
Keep quarantined; preserve evidence; escalate to security owner.

## Verification
Known-malicious regression fixtures block and requested artifact's exact hash is the one reviewed.

## Definition of Done
Implemented, measured, independently verified where required, and no blocking issue remains.