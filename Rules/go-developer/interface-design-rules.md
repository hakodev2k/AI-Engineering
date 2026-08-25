# Interface Design Rules

## Purpose
Use Go interfaces as narrow behavioral contracts rather than speculative abstraction.

## Scope
Interfaces, dependency inversion, mocks, adapters, and public contracts.

## MUST
- Interfaces MUST model behavior required by consumers.
- Consumer-owned interfaces MUST remain minimal enough to substitute safely.
- Implementations MUST satisfy documented semantic expectations, not only method signatures.
- Interface changes MUST assess downstream compatibility.

## MUST NOT
- MUST NOT introduce an interface solely because a concrete type exists.
- MUST NOT publish large interfaces that force unrelated capabilities on implementations.
- MUST NOT use mocks to conceal an unsuitable production boundary.

## SHOULD
- Define interfaces near consumers when that improves ownership.
- Prefer composition of small capabilities over monolithic contracts.

## Exceptions
Framework or generated contracts may require broader interfaces; record the constraint and test adapters explicitly.

## Verification
Review interface size and ownership, compile-time satisfaction assertions where useful, contract tests, and downstream API checks.