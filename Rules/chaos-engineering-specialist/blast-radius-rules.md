# Blast Radius Rules

## Purpose
Limit the maximum credible harm of chaos experiments while preserving useful failure evidence.

## Scope
Applies to experiment targeting, fault scope, tenant or user exposure, dependency selection, and progressive expansion.

## MUST
- Every experiment MUST define the smallest initial blast radius capable of testing the hypothesis.
- Expansion MUST be progressive and gated by measured system health.
- Target selection MUST account for shared dependencies, correlated failure domains, and hidden fan-out.
- Production blast radius MUST be explicitly approved by an authorized human before execution.

## MUST NOT
- An experiment MUST NOT start at fleet-wide, region-wide, or all-tenant scope when a narrower scope can validate the hypothesis.
- Shared infrastructure MUST NOT be targeted without identifying downstream consumers.
- Blast radius MUST NOT be inferred only from the directly targeted resource.

## SHOULD
- Canary cohorts and isolated failure domains SHOULD be used first.
- High-risk experiments SHOULD have an independent observer able to stop execution.

## Exceptions
A wider initial scope requires documented necessity, impact analysis, rollback or stop mechanisms, evidence that narrower tests are insufficient, and explicit approval.

## Verification
Inspect target selectors, dependency maps, affected-user estimates, progressive gates, approval evidence, and recorded health signals during expansion.