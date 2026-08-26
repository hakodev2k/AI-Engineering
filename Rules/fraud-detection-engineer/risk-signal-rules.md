# Risk Signal Rules

## Purpose
Ensure fraud signals are trustworthy, interpretable, governed, and safe to use in decisions.

## Scope
Behavioral, identity, device, transaction, network, and third-party signals.

## MUST
- Production signals MUST define meaning, source, freshness, owner, and failure behavior.
- Transformations MUST be reproducible and versioned when decision reproducibility depends on them.
- Missing, delayed, malformed, or contradictory signals MUST have explicit handling.
- Sensitive signals MUST be authorized, necessary, and appropriately protected.

## MUST NOT
- MUST NOT treat missing values as inherently risky without validated evidence.
- MUST NOT use undocumented proxies for prohibited attributes.
- MUST NOT silently change production signal semantics.

## SHOULD
- Signals SHOULD expose quality and freshness metadata.
- Correlated signals SHOULD be assessed for shared failure modes.

## Exceptions
Require rationale, evidence, risk, alternatives, validation, and approval where material.

## Verification
Inspect contracts, lineage, quality dashboards, schema history, privacy controls, and decision traces.