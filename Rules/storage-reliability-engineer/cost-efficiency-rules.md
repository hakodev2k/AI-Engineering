# Cost Efficiency Rules

## Purpose
Reduce storage cost without trading away required reliability, recoverability, or performance.

## Scope
Applies to storage tiering, replication overhead, reserved capacity, lifecycle policy, data movement, and service selection.

## MUST
- Compare cost changes against durability, recovery, performance, and operational objectives.
- Quantify material savings using measured usage and realistic access patterns.
- Include migration, retrieval, egress, rebuild, and operational costs in major decisions.

## MUST NOT
- Reduce redundancy, backup protection, or recovery headroom solely to meet a cost target without approved risk acceptance.
- Claim savings without a defined baseline and observation period.
- Move critical data to cheaper tiers without validating retrieval and recovery behavior.

## SHOULD
- Remove orphaned or duplicate data only through approved lifecycle processes.
- Prefer optimizations that are reversible and measurable.

## Exceptions
Intentional reliability trade-offs require documented business context, quantified risk, compensating controls, and approval.

## Verification
Review cost baselines, capacity data, architecture decisions, retrieval tests, savings evidence, and reliability indicators.