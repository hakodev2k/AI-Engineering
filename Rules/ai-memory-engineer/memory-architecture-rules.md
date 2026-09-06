# Memory Architecture Rules

## Purpose
Define safe, maintainable boundaries between short-term context, episodic memory, semantic memory, profiles, and external knowledge.

## Scope
Memory components, ownership, read/write paths, lifecycle, and interfaces.

## MUST
- Each memory class MUST have explicit purpose, authority, retention, and access boundaries.
- Write paths MUST define who may create, update, merge, or delete memory.
- Retrieval paths MUST distinguish memory from authoritative system-of-record data.
- Cross-component dependencies MUST be documented and testable.

## MUST NOT
- MUST NOT treat all stored context as equally trustworthy.
- MUST NOT allow hidden memory coupling that changes agent behavior without traceability.
- MUST NOT use memory as an undocumented substitute for durable business state.

## SHOULD
- Prefer narrow memory responsibilities with stable interfaces.
- Keep memory architecture reversible as models and retrieval strategies evolve.

## Exceptions
Exceptions require documented trade-offs, affected consumers, risk, and approval.

## Verification
Review architecture diagrams, interfaces, data flows, integration tests, and ownership metadata.