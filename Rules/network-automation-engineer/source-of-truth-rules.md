# Source of Truth Rules

## Purpose
Ensure network automation changes are derived from authoritative, reviewable intent rather than ad-hoc device state.

## Scope
Applies to inventories, topology data, addressing, intended configuration, policy, and generated device artifacts.

## MUST
- Automation MUST identify the authoritative source for every managed attribute before rendering or changing configuration.
- Conflicting sources MUST fail closed or be resolved by an explicit precedence rule.
- Intended state MUST be versioned and reviewable before production execution.
- Generated configuration MUST be traceable to source data and the generator version.
- Changes to authoritative schemas MUST include compatibility and migration analysis.

## MUST NOT
- MUST NOT treat manually edited production state as authoritative merely because it is currently deployed.
- MUST NOT silently infer missing safety-critical values such as management addresses, routing identifiers, or security policy.
- MUST NOT allow multiple writable systems to own the same attribute without deterministic reconciliation.

## SHOULD
- Source data SHOULD use validated schemas and stable identifiers independent of display names.
- Drift between intended and observed state SHOULD be reported with ownership and severity.

## Exceptions
An exception requires documented reason, affected attributes, risk, reconciliation plan, verification evidence, and approval when production intent can change.

## Verification
Review schema validation, ownership metadata, version history, generated-artifact provenance, drift reports, and tests proving deterministic precedence and failure behavior.