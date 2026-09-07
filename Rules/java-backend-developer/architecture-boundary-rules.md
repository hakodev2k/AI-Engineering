# Architecture Boundary Rules

## Purpose
Preserve cohesive modules, intentional dependency direction, and evolvable backend design.

## Scope
Applies to modules, packages, domain boundaries, services, adapters, and shared libraries.

## MUST
- Each significant module MUST have clear responsibilities and owned data/contracts.
- Dependency direction MUST prevent infrastructure details from unnecessarily controlling domain policy.
- Cross-boundary communication MUST use explicit contracts rather than shared mutable internals.
- Significant architecture changes MUST document constraints, alternatives, trade-offs, migration impact, and operational risk.
- Shared abstractions MUST represent stable common semantics, not merely duplicate code shape.

## MUST NOT
- MUST NOT introduce cyclic module dependencies.
- MUST NOT bypass established boundaries for short-term convenience without documenting and containing the debt.
- MUST NOT create distributed service boundaries solely to mirror code packages without operational justification.

## SHOULD
- Prefer the simplest architecture satisfying current reliability, scale, security, and organizational constraints.
- Enforce important boundaries with build/module or architecture tests where practical.

## Exceptions
Temporary boundary violations require owner, rationale, risk, cleanup condition, and review.

## Verification
Use dependency graphs, architecture tests, package/module review, ADRs, code review, and examination of data ownership and cross-boundary contracts.