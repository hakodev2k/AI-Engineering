# Agent Memory Guardrails

## Purpose
Control durable agent memory writes, reads, and uses.

## When to use
Use for preferences, episodic facts, workflow state, shared memory.

## Inputs
Schemas, retention, identity, provenance, sensitivity, triggers, uses.

## Context to inspect
Inspect extraction, validation, namespaces, retrieval, deletion, user controls, privileged use.

## Core knowledge
Memory makes errors/attacks durable; require provenance, scope, sensitivity, correction, expiry. Memory is not authorization.

## Procedure
1. Define categories.
2. Require typed provenance/scope.
3. Validate sensitivity.
4. Reject secrets/untrusted instructions.
5. Namespace safely.
6. Apply retention/expiry.
7. Revalidate consequential use.
8. Support correction/deletion.
9. Detect suspicious writes.
10. Test poisoning/cross-user/stale state.

## Decision points
Confirm consequential facts; auto-store only low-risk correctable categories.

## Common failure patterns
Free-form blobs, no provenance, stored injection, cross-tenant retrieval, memory authorization, indefinite retention.

## Verification
Poisoning cannot create privileged durable instructions/disclosure.

## Expected output
Memory policy/schema/tests.

## Stop conditions
Disable durable writes without lifecycle controls.