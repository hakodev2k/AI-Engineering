# Module Design

## Purpose
Keep Terraform modules cohesive, reusable, testable, and safe to evolve.

## Scope
Root modules, reusable modules, inputs, outputs, composition, and module contracts.

## MUST
- Each reusable module MUST have a clear responsibility and documented contract.
- Inputs MUST express required constraints through types, validation, and safe defaults where appropriate.
- Outputs MUST expose only information consumers need.
- Breaking module changes MUST be identified, versioned, and accompanied by a migration strategy.
- Root modules MUST compose infrastructure rather than hide environment-specific behavior inside reusable modules.

## MUST NOT
- Modules MUST NOT depend on undocumented ambient state or hidden provider assumptions.
- A module MUST NOT bundle unrelated resources solely to reduce file count.
- Sensitive values MUST NOT be exposed through outputs without a justified consumer requirement.

## SHOULD
- Modules SHOULD prefer composition over deeply nested abstraction.
- Interfaces SHOULD remain smaller and more stable than implementation details.

## Exceptions
A broader module requires documented cohesion rationale, ownership, alternatives considered, and verification that lifecycle coupling is intentional.

## Verification
Review module dependency graphs, input/output schemas, examples, validation blocks, version history, plans from representative consumers, and migration tests.