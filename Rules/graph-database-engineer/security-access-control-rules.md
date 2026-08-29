# Security and Access Control Rules

## Purpose
Protect graph data, administrative capabilities, and traversal-derived information.

## Scope
Authentication, authorization, roles, graph privileges, network access, administrative operations, and query surfaces.

## MUST
- Apply least privilege to users, services, automation, and administrators.
- Enforce authorization at a trustworthy boundary rather than relying on client-side filtering.
- Review whether traversals can infer or expose restricted relationships or properties.
- Require human approval for material privilege expansion or weakening of production controls.
- Audit privileged and security-relevant operations.

## MUST NOT
- Embed credentials in source, queries, notebooks, or configuration committed to version control.
- Grant broad graph-wide write or admin access merely to simplify integration.
- Disable authentication or authorization to diagnose production issues without approved emergency procedure.

## SHOULD
- Separate read, write, schema, import, and administrative privileges.
- Use short-lived credentials or managed identities where supported.

## Exceptions
Emergency access requires time bounds, explicit authorization, auditability, and post-event review.

## Verification
Inspect effective privileges, authentication configuration, network controls, audit records, negative authorization tests, and secret-scanning results. Test access through real traversal paths, not only direct entity lookups.