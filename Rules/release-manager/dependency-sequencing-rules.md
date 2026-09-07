# Dependency Sequencing Rules

## Purpose
Prevent release failures caused by incorrect ordering, hidden dependencies, incompatible versions, or unavailable external prerequisites.

## Scope
Applies to inter-service, infrastructure, data, configuration, client, vendor, and organizational dependencies involved in a release.

## MUST
- Material dependencies MUST identify producer, consumer, compatible versions, required state, owner, and sequencing constraint.
- Deployment order MUST preserve compatibility throughout intermediate states, not only after the final step.
- Cross-team prerequisites MUST have explicit confirmation before dependent execution begins.
- Contract, schema, and protocol changes MUST use a compatibility strategy when independently deployed components can coexist.
- A failed prerequisite MUST halt or re-plan dependent steps unless a validated fallback exists.

## MUST NOT
- Hidden ordering assumptions MUST NOT be left solely in operator knowledge or chat history.
- A dependency MUST NOT be considered ready merely because its change was merged.
- Simultaneous deployment MUST NOT be used to mask incompatible intermediate states without proven orchestration and recovery behavior.

## SHOULD
- Sequences SHOULD reduce coupling through backward-compatible expansion, staged activation, or independent toggles.
- Critical external dependencies SHOULD have contingency paths when feasible.

## Exceptions
Any deliberate sequencing deviation requires dependency-owner agreement, documented compatibility evidence, risk analysis, fallback steps, and appropriate approval.

## Verification
Review dependency maps, version/contract compatibility tests, prerequisite confirmations, deployment ordering, failure branches, and rollback interactions. Where possible, exercise the sequence in a representative environment.