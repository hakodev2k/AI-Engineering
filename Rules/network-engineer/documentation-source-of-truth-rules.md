# Documentation and Source of Truth Rules

## Purpose
Keep network intent and operational state understandable without relying on individual memory.

## Scope
Diagrams, inventories, IPAM, circuit records, device ownership, dependencies, standards, and runbooks.

## MUST
- Maintain authoritative sources for addressing, inventory, ownership, topology, and critical dependencies.
- Update documentation as part of material network change completion.
- Record enough context for another qualified engineer to operate and recover critical services.
- Protect sensitive diagrams and configuration details according to information classification.

## MUST NOT
- Treat stale diagrams or undocumented tribal knowledge as authoritative production state.
- Store secrets in architecture diagrams or runbooks.

## SHOULD
- Generate documentation from authoritative configuration/inventory where practical.

## Exceptions
Emergency changes may defer documentation only with a tracked owner and deadline.

## Verification
Compare documentation against discovered topology, device inventory, IPAM, configuration, ownership records, and recent changes.