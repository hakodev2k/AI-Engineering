# Data Subject Rights Engineering

## Purpose
Build reliable workflows for access, correction, deletion, restriction, objection, and portability requirements applicable to the product.

## When to use
Use when implementing or reviewing rights-request operations and self-service privacy controls.

## Inputs
Approved rights requirements, identity model, data map, request workflow, retention exceptions, and processor capabilities.

## Context to inspect
Inspect identity verification, linked accounts, derived data, archives, third parties, deadlines, and audit evidence.

## Core knowledge
Rights workflows combine identity assurance, data discovery, authorization, lifecycle operations, and safe disclosure. Over-verification can itself create privacy risk.

## Procedure
1. Define supported request types and scope.
2. Establish proportionate identity verification.
3. Resolve subject identifiers across systems.
4. Collect applicable data and exceptions.
5. Review disclosure for third-party information and secrets.
6. Execute requested actions idempotently.
7. Propagate to processors where required.
8. Record status and minimal evidence.
9. Test deadlines, retries, and partial failures.

## Decision points
Automate deterministic low-risk steps; require human review for ambiguous identity, exceptions, or disclosures.

## Common failure patterns
Searching only by email, exposing other users’ data, deleting records under hold, and missing downstream processors.

## Verification
Run synthetic requests end-to-end and reconcile results against the data inventory.

## Expected output
A secure, traceable rights-request workflow.

## Stop conditions
Escalate identity ambiguity, conflicting obligations, or potentially harmful disclosure.