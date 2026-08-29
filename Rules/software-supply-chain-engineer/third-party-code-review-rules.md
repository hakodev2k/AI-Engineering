# Third-Party Code Review Rules

## Purpose
Apply risk-proportionate review to externally maintained code that becomes part of delivered software.

## Scope
Applies to vendored source, copied snippets, forks, patches, plugins, generated SDKs, and externally sourced build logic.

## MUST
- Material third-party code MUST have recorded origin, revision, purpose, maintenance status, and licensing information where applicable.
- High-risk or privileged third-party code MUST receive focused review for security-sensitive behavior and update risk.
- Forks MUST document divergence from upstream and an ownership plan for future maintenance.
- Imported code MUST be covered by applicable testing and vulnerability processes.

## MUST NOT
- MUST NOT treat copied source as inherently safer than a declared package dependency.
- MUST NOT import opaque third-party build or release logic into privileged workflows without review.

## SHOULD
- Projects SHOULD prefer maintained upstream components over permanent private forks when requirements allow.
- Large imports SHOULD preserve traceability to upstream history.

## Exceptions
Exceptions MUST record the source, unresolved review gap, risk, compensating controls, owner, and approval.

## Verification
Inspect vendored directories, forks, build plugins, import records, licenses, reviews, and test coverage. Confirm ownership and upstream traceability exist.