# Privacy by Design

## Purpose
Embed privacy controls into product and system design before implementation creates expensive or irreversible data risk.

## When to use
Use for new products, features, integrations, analytics, identity flows, or material changes involving personal data.

## Inputs
Requirements, architecture, data flows, user journeys, jurisdictions, retention needs, and security controls.

## Context to inspect
Inspect data categories, purposes, actors, trust boundaries, storage, transfers, defaults, user controls, and downstream processors.

## Core knowledge
Privacy engineering minimizes unnecessary collection, limits use to declared purposes, protects data throughout its lifecycle, and makes controls usable and verifiable. Legal interpretation belongs to qualified counsel; engineering must translate approved obligations into technical controls.

## Procedure
1. Define business purpose and affected users.
2. Inventory required personal data.
3. Challenge each collection and processing step for necessity.
4. Map data flows and trust boundaries.
5. Choose privacy-preserving defaults.
6. Define access, retention, deletion, transparency, and user-control requirements.
7. Identify high-risk processing and required review.
8. Convert decisions into testable engineering requirements.
9. Implement controls with observability and audit evidence.
10. Reassess after design changes.

## Decision points
Prefer collecting less data over protecting unnecessary data. Prefer local, aggregated, pseudonymous, or short-lived processing when it meets the purpose.

## Common failure patterns
Collecting data for hypothetical future use, hidden secondary purposes, permissive defaults, indefinite retention, and relying only on policy text.

## Verification
Trace each personal-data flow to a purpose, control, owner, retention rule, and test. Confirm defaults and user controls behave as designed.

## Expected output
A privacy-aware design with explicit data decisions and verifiable controls.

## Stop conditions
Escalate unresolved legal interpretation, high-risk processing, conflicting obligations, or missing ownership.