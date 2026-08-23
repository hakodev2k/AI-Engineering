# Feature Flag and Rollout Rules

## Purpose
Make growth changes controllable, observable, and reversible.

## Scope
Feature flags, experiment allocation, staged rollout, targeting, and kill switches.

## MUST
- Define owner, targeting, default state, rollback condition, and removal plan for material flags.
- Validate allocation and mutual exclusion when concurrent experiments can interfere.
- Monitor technical and business guardrails during staged rollout.

## MUST NOT
- Use client-visible flags as authorization or security controls.
- Leave stale experiment branches indefinitely after a decision.

## SHOULD
- Start high-risk changes with limited exposure and expand only after evidence meets predefined gates.

## Exceptions
Low-risk cosmetic changes may use simplified rollout when no material behavior or measurement is affected.

## Verification
Inspect flag configuration, allocation logs, exposure events, monitoring, rollback tests, and stale-flag inventory.