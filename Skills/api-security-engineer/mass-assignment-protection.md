# Mass Assignment Protection

## Purpose
Prevent callers from setting privileged, server-owned, or workflow-controlled properties by submitting extra fields that are automatically bound to internal models.

## When to use
Use for create/update endpoints, PATCH operations, ORM-backed APIs, generic binders, GraphQL mutations, and APIs exposing broad domain objects.

## Inputs
Request models, domain/data models, binding configuration, writable-field rules, authorization policies, update semantics.

## Preconditions
Know which fields each caller may set directly and which fields must only be derived or changed by trusted server logic.

## Context to inspect
Model binding, serializers, reflection-based mappers, ORM tracking, patch libraries, generic update helpers, nested objects, and default values.

## Core knowledge
Input models should express permitted intent rather than mirror persistence entities. Authorization of an operation does not imply authorization to modify every field. Partial updates require explicit field-level policy.

## Procedure
1. Inventory externally writable models.
2. Classify fields as caller-writable, conditionally writable, or server-owned.
3. Create explicit input DTOs or allowlists.
4. Map permitted fields intentionally into domain objects.
5. Apply field-level authorization where caller permissions differ.
6. Reject or safely ignore unexpected properties according to contract policy.
7. Review nested object updates and patch paths.
8. Test privileged fields submitted by unprivileged callers.
9. Verify defaults and mapper behavior do not overwrite protected values.
10. Add regression tests for newly added domain properties.

## Decision points
Prefer explicit DTO mapping for high-risk domains. Generic patching may be acceptable when operations are constrained by an allowlist and field-level authorization. Reject unknown fields when silent ignoring could hide attacks or client defects.

## Common failure patterns
Binding directly to ORM entities, reflection-based copy-all helpers, wildcard patch paths, authorization only at endpoint level, and newly added entity properties becoming writable automatically.

## Verification
Submit protected fields through all supported update formats and confirm no unauthorized state change occurs. Review mapper configuration and persistence diffs.

## Expected output
Explicit writable-field boundaries, safe mapping, field-level tests, and regression protection.

## Stop conditions
Escalate when writable ownership is undefined, generic framework behavior cannot be constrained safely, or remediation changes public update semantics materially.