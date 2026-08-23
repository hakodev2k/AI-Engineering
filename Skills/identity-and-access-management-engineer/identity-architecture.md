# Identity Architecture

## Purpose
Design identity boundaries, trust relationships, control planes, and lifecycle ownership for workforce, customer, workload, and machine identities.

## When to use
Use for new IAM platforms, major integrations, migrations, or architecture reviews.

## Inputs
Actors, systems, identity sources, authentication methods, authorization needs, trust domains, regulatory constraints, availability targets.

## Preconditions
Critical identity populations and business owners are identified.

## Context to inspect
Directories, IdPs, apps, APIs, service accounts, federation links, provisioning flows, privileged paths, logging, recovery procedures.

## Core knowledge
IAM architecture must separate identity proofing, authentication, authorization, provisioning, credential management, and audit. Trust should be explicit and minimized.

## Procedure
1. Classify identity populations and authoritative sources.
2. Map trust boundaries and relying parties.
3. Define authentication and federation patterns.
4. Define authorization policy ownership and enforcement points.
5. Design joiner/mover/leaver flows.
6. Define privileged and break-glass controls.
7. Set availability, recovery, and audit requirements.
8. Review data minimization and privacy.
9. Document dependencies and failure modes.
10. Validate with abuse and outage scenarios.

## Decision points
Centralize when consistency and governance dominate; decentralize enforcement when latency, autonomy, or domain ownership requires it.

## Common failure patterns
Multiple sources of truth, hidden trust, orphaned identities, shared admin accounts, implicit authorization, and unaudited emergency access.

## Verification
Trace representative identities end-to-end through authentication, authorization, lifecycle, logging, and recovery paths.

## Expected output
Architecture diagram, trust model, identity ownership map, control boundaries, risks, and decisions.

## Stop conditions
Escalate when authoritative ownership is undefined, legal constraints conflict, or required trust assumptions cannot be validated.