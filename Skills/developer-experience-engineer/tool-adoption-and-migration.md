# Tool Adoption and Migration

## Purpose
Move developers from legacy workflows to improved tooling with measurable adoption and controlled operational risk.

## When to use
Use for replacing build tools, CI systems, developer portals, CLIs, templates, SDKs, or platform interfaces.

## Inputs
Current usage, target workflow, compatibility gaps, migration population, dependencies, deadlines, and support capacity.

## Context to inspect
Inspect user segments, blockers, hidden integrations, rollback needs, training burden, and reasons teams may legitimately remain on legacy paths.

## Core knowledge
Migration is a product and change-management problem. Reduce switching cost, preserve continuity, and use progressive adoption rather than assuming documentation creates change.

## Procedure
1. Inventory current users and dependencies.
2. Define target benefits and migration success criteria.
3. Identify compatibility and behavior gaps.
4. Build migration automation where repeatable.
5. Pilot with representative teams.
6. Provide side-by-side validation and rollback.
7. Track adoption and failure reasons.
8. Remove blockers in priority order.
9. Deprecate legacy paths only after readiness criteria are met.

## Decision points
Use compatibility layers for high-risk transitions but time-box them to avoid permanent dual systems.

## Common failure patterns
Mandated cutovers without evidence, underestimating hidden consumers, permanent dual support, migration scripts without rollback, and counting installation as adoption.

## Verification
Validate representative migrations, rollback, functional parity where required, and sustained use of the new workflow.

## Expected output
A staged migration plan, automation, compatibility strategy, adoption metrics, support plan, and retirement criteria.

## Stop conditions
Stop when critical consumers are unidentified, data loss is possible, or rollback cannot meet risk requirements.