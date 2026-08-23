# Skill: Investigate Message Ordering

## Purpose
Prove where an order-sensitive message path loses sequence guarantees without guessing from symptoms.

## When to use
Use for stale state, state regression, impossible transitions, duplicate side effects, or logs showing sequence inversion in queue/event-driven systems.

## Inputs
Failure description, repository, message metadata/logs, transport configuration, and a reproducible workload when available.

## Preconditions and context
Read-only access is sufficient. Locate producer, transport configuration, consumer, retry/dead-letter behavior, and state mutation before editing code.

## Allowed tools
Repository search, tests, local scripts, read-only logs/metrics, transport documentation, and non-production replay fixtures.

## Constraints
Do not mutate production queues or data. Do not infer global ordering from partition ordering.

## Process
1. Write the business invariant that depends on ordering.
2. Identify the exact ordering scope and partition/aggregate key.
3. Trace where sequence is created and whether it is persisted atomically with the business event.
4. Record broker ordering guarantees and configuration as facts, not assumptions.
5. Trace consumer concurrency, prefetch/batching, retry, dead-letter, and redelivery paths.
6. Capture a minimal evidence JSON in the schema used by this package.
7. Run `python scripts/message_order_gate.py --evidence <file> --policy config/policy.json`.
8. Reproduce one inversion, gap, or duplicate independently where possible.
9. Rank hypotheses by direct evidence and identify the smallest boundary that can enforce the invariant.
10. Hand off facts, hypotheses, evidence paths, and risks to the repair skill.

## Expected output
A bounded root-cause statement, affected ordering scope, evidence artifact, and recommended repair boundary.

## Verification
Another engineer/agent can reproduce the finding from the preserved evidence and repository path.

## Failure handling
Retry transient tooling failures at most twice. If logs omit partition/sequence identity, stop classification and request instrumentation rather than claiming an ordering defect.

## Stop conditions
Stop on missing required evidence, permission barriers, or when investigation would require production mutation.
