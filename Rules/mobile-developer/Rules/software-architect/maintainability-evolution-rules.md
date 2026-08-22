# Maintainability and Evolution Rules

## Purpose
Keep systems understandable, changeable, and economical over long lifetimes.

## Scope
Applies to complexity, coupling, duplication, extension points, technical debt, and long-term evolution.

## MUST
- Structural complexity MUST be justified by concrete requirements or measured risk reduction.
- Known architectural debt with material impact MUST have ownership, consequence, and remediation or containment strategy.
- Extension mechanisms MUST protect stable boundaries rather than expose internals broadly.
- Repeated costly change patterns MUST trigger review of the affected design boundary.

## MUST NOT
- MUST NOT create abstraction layers without a clear volatility or boundary problem to solve.
- MUST NOT preserve accidental complexity solely because refactoring is inconvenient.
- MUST NOT duplicate architectural concepts across modules when divergence would create correctness risk.

## SHOULD
- Prefer explicit, boring, locally understandable structures over clever indirection.
- Prefer incremental refactoring backed by tests and measurable maintenance benefits.

## Exceptions
Temporary duplication may be preferable to premature coupling when future commonality is uncertain; document the rationale.

## Verification
Review change history, dependency graphs, complexity hotspots, defect patterns, architecture tests, and technical-debt records.