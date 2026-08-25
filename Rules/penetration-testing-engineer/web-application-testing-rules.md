# Web Application Testing Rules

## Purpose
Provide disciplined Senior-level testing of web application trust boundaries and server-side controls.

## Scope
Covers sessions, authorization, input handling, business logic, file handling, browser/server boundaries, and application workflows.

## MUST
- MUST map roles, trust boundaries, sensitive workflows, state transitions, and server-enforced controls before drawing security conclusions.
- MUST test authorization at object, function, and workflow boundaries using controlled identities.
- MUST validate input-handling findings with precise request/response evidence and realistic impact.
- MUST assess session lifecycle, CSRF-relevant state changes, upload/download controls, and sensitive data exposure where applicable.
- MUST preserve account and data isolation during tests.

## MUST NOT
- MUST NOT rely solely on browser-side controls or automated scanners to assess security.
- MUST NOT access unrelated real-user data beyond the minimum evidence explicitly permitted.
- MUST NOT perform bulk extraction to prove that one unauthorized record is accessible when lesser evidence suffices.

## SHOULD
- SHOULD prioritize business-logic abuse and authorization flaws that commodity scanners commonly miss.
- SHOULD test representative negative paths and boundary conditions.

## Exceptions
Testing requiring real-user data, disruptive workflow manipulation, or high-volume requests requires explicit approval and containment.

## Verification
Review test identities, workflow maps, raw HTTP evidence, authorization matrices, scanner configuration, manual test notes, and data-access logs. Confirm findings are reproducible and tied to server-side behavior.