# Dependency Graph Rules

## Purpose
Keep build dependencies explicit, minimal, acyclic, and explainable so changes do not create hidden coupling or unnecessary rebuilds.

## Scope
Applies to source targets, generated code, tests, tools, packaging targets, and cross-repository build relationships.

## MUST
- Every dependency MUST correspond to a real input or execution requirement.
- Dependency cycles MUST be rejected or removed through a reviewed design change.
- Interface dependencies MUST be distinguished from implementation-only dependencies when the build system supports that distinction.
- Changes that expand widely shared dependencies MUST assess rebuild cost and affected targets.
- Dependency resolution failures MUST identify the target chain responsible for the failure.

## MUST NOT
- MUST NOT add umbrella dependencies merely to conceal missing inputs.
- MUST NOT consume generated outputs without depending on the target that produces them.
- MUST NOT rely on repository processing order outside the declared dependency graph.

## SHOULD
- Dependency edges SHOULD be as narrow as practical and reflect ownership boundaries.
- Highly shared targets SHOULD receive stronger review because changes can invalidate large portions of the graph.

## Exceptions
An intentional broad dependency MUST document why narrower edges are impractical, expected rebuild impact, and how the cost will be monitored.

## Verification
Use graph inspection, cycle detection, affected-target analysis, and clean-build verification. Review changes in fan-in, fan-out, and critical-path length for significant dependency modifications.