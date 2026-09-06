# Data Access and Context Readiness

## Purpose
Ensure an AI workflow can access the right business context with acceptable quality, provenance, permissions, freshness, and privacy controls.

## When to use
Use before pilots involving enterprise knowledge, retrieval, customer data, internal systems, or personalized assistance.

## Inputs
Data inventory, source systems, access model, data classification, freshness requirements, retrieval design, and user roles.

## Context to inspect
Inspect ownership, schemas, APIs, search indexes, permissions, retention rules, source quality, update frequency, duplicate records, and authoritative-source definitions.

## Core knowledge
AI quality is constrained by context quality. More data is not automatically better; stale, conflicting, over-permissive, or poorly scoped context can produce confident errors and data leakage.

## Procedure
1. Identify information required for each target task.
2. Map each information need to authoritative sources.
3. Verify ownership and lawful/approved access.
4. Assess completeness, freshness, consistency, and provenance.
5. Define user- and role-level authorization boundaries.
6. Determine retrieval or direct integration needs.
7. Define handling for conflicting or missing sources.
8. Specify context-size and freshness strategies.
9. Test representative and edge-case queries.
10. Document data gaps and fallback behavior.

## Decision points
Prefer authoritative, minimal context over broad data dumps. Use retrieval when relevant information is too large or dynamic for static prompts. Avoid indexing data whose access boundaries cannot be enforced.

## Common failure patterns
Assuming source availability, flattening permissions, using stale exports, mixing authoritative and informal content, and evaluating only well-documented cases.

## Verification
Confirm test users receive only permitted context, authoritative sources are traceable, freshness meets requirements, and missing data produces safe fallback behavior.

## Expected output
A context-readiness assessment with source map, quality findings, permissions, gaps, retrieval requirements, and mitigations.

## Stop conditions
Stop when ownership is unknown, required data access is unauthorized, or source quality cannot support the target decision.