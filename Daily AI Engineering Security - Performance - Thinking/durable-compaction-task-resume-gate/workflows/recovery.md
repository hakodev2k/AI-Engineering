# Workflow: Compaction Continuity Recovery

## Trigger
Missing/invalid checkpoint, lost handle, no-progress after resume, or suspicious success immediately after compaction.

## Goal
Recover only from durable evidence and stop safely when recovery is impossible.

## Inputs
Last valid checkpoint, transcript fragments, task registry, tool/subagent registry, logs.

## Baseline
Last verified progress marker and acceptance-criteria state.

## Stages
1. Detect failure and freeze terminal success.
2. Gather durable facts from checkpoint/registries.
3. Reconstruct missing non-secret fields.
4. Validate reconstructed checkpoint.
5. Attempt resume once.
6. If no progress, change recovery source/strategy once and retry.
7. Verify or terminate BLOCKED.

## Responsible agent
Recovery agent; independent Continuity Verifier approves recovered completion.

## Outputs
Recovery evidence, reconstructed checkpoint, resume result, terminal status.

## Metrics
Recovery attempts, recovered fields, resumed progress, added tool calls/time.

## Retry policy
Maximum 2 attempts total.

## Stop conditions
Two failures, conflicting evidence, unavailable required handle with no safe substitute, or missing approval.

## Failure path
BLOCKED + escalation; retain evidence.

## Verification
Recovered task must meet the same acceptance criteria as an uncompacted run.

## Definition of Done
Either verified continuation/completion or explicit blocked terminal state.