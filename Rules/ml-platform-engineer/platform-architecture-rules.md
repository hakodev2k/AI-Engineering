# Platform Architecture

## Purpose
Keep ML platform boundaries evolvable, reliable, and independently operable.

## Scope
Shared training, evaluation, registry, serving, metadata, and orchestration capabilities.

## MUST
- Platform capabilities MUST have explicit ownership, contracts, dependencies, and failure boundaries.
- Architecture changes MUST document affected tenants, compatibility, operational risk, and rollback strategy.
- Control-plane and workload-plane responsibilities MUST be separated where failure or privilege domains differ.

## MUST NOT
- Shared infrastructure MUST NOT depend on undocumented application behavior.
- A convenience abstraction MUST NOT hide material cost, security, or reliability consequences.

## SHOULD
- Prefer composable primitives and stable interfaces over framework-specific coupling.
- Preserve escape hatches for justified specialized workloads.

## Exceptions
Exceptions require documented constraints, alternatives, risk, verification, and accountable approval.

## Verification
Review architecture diagrams, dependency graphs, ADRs, contract tests, failure tests, and rollback evidence.