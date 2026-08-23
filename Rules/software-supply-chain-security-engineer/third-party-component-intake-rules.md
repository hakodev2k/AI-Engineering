# Third-Party Component Intake Rules

## Purpose
Evaluate external software before it becomes a trusted part of the product or delivery system.

## Scope
Libraries, binaries, SDKs, plugins, vendor agents, installers, and externally supplied source code.

## MUST
- Third-party components MUST have a known source, maintainer or supplier, license posture, update channel, and security ownership.
- High-impact components MUST receive additional review for privilege, execution context, network access, update behavior, and compromise blast radius.
- Binary-only components MUST have provenance or authenticity evidence appropriate to risk.
- Intake decisions MUST be recorded for components that materially affect security or production operations.
- Components with unacceptable unresolved risk MUST be rejected or isolated.

## MUST NOT
- MUST NOT approve components solely because they are popular or supplied by a large vendor.
- MUST NOT execute downloaded binaries whose origin and integrity cannot be established.
- MUST NOT allow vendor auto-update mechanisms to bypass enterprise release controls without explicit review.

## SHOULD
- Intake SHOULD consider maintenance health, incident history, responsiveness, and ecosystem concentration risk.

## Exceptions
Exceptions require documented necessity, threat assessment, compensating controls, accountable approval, and expiry.

## Verification
Inspect intake records, supplier metadata, signatures or hashes, licenses, update settings, permissions, and risk decisions.