# Interface and Integration Requirements

## Purpose
Define business behavior and information exchanged across system boundaries without prematurely designing the technical implementation.

## When to use
Use for APIs, file transfers, events, third-party services, batch feeds, or cross-system workflows.

## Inputs
Process flows, source and target systems, business events, data requirements, SLAs, error scenarios, and ownership information.

## Preconditions
The business purpose of the integration and participating systems are known.

## Context to inspect
Trigger conditions, data ownership, frequency, volumes, sequencing, identity, errors, retries, reconciliation, and downstream dependencies.

## Core knowledge
Integration requirements must cover success, partial failure, duplication, timing, ownership, and reconciliation. They should separate business obligations from transport choices.

## Procedure
1. Define the business event or process need.
2. Identify producing and consuming parties.
3. Define data exchanged and business meaning.
4. Capture trigger, timing, frequency, and volume expectations.
5. Define validation and acceptance behavior.
6. Identify duplicate, delayed, missing, and out-of-order scenarios.
7. Define business-facing error and reconciliation needs.
8. Capture privacy, security, and audit requirements.
9. Map ownership and support responsibilities.
10. Validate end-to-end scenarios with all parties.

## Decision points
Use synchronous interaction when the business requires an immediate response; asynchronous exchange when decoupling, resilience, or delayed processing is acceptable.

## Common failure patterns
Documenting only field mappings, ignoring retries and duplicates, assuming network success, and leaving reconciliation undefined.

## Verification
Confirm normal and failure scenarios are traceable, each data element has agreed meaning, and operational ownership is explicit.

## Expected output
A reusable integration requirement specification covering behavior, data, timing, errors, controls, and ownership.

## Stop conditions
Stop when external-party obligations or authoritative data ownership remain unresolved.