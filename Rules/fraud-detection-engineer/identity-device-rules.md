# Identity and Device Rules

## Purpose
Use identity and device evidence without over-trusting mutable identifiers or creating unsafe linkage.

## Scope
Account identity, device intelligence, session context, authentication signals, and entity linking.

## MUST
- Identity confidence MUST distinguish verified evidence from asserted or inferred attributes.
- Device identifiers MUST be treated as probabilistic or mutable unless their guarantees are proven.
- Entity linking MUST define collision, shared-device, household, and recycled-identifier risks.
- High-impact identity actions MUST require evidence proportionate to consequence.

## MUST NOT
- MUST NOT equate shared infrastructure or device reuse with fraud by itself.
- MUST NOT expose internal risk identifiers to untrusted clients when doing so aids evasion.

## SHOULD
- Linkage SHOULD combine independent evidence where practical.
- Identity signals SHOULD be reevaluated after account recovery or credential changes.

## Exceptions
Require documented threat model, privacy basis, and validation.

## Verification
Review linkage tests, collision rates, identity provenance, privacy controls, account-recovery scenarios, and false-positive investigations.