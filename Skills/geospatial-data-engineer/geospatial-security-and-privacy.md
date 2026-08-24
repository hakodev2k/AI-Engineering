# Geospatial Security and Privacy

## Purpose
Protect location data, spatial services, and geospatial pipelines against unauthorized access, sensitive-location disclosure, abuse, and insecure data handling.

## When to use
Use when storing or serving precise coordinates, mobility data, sensitive facilities, user-linked locations, or externally accessible spatial APIs.

## Inputs
Data classifications, access model, threat model, retention requirements, API contracts, logging and sharing rules.

## Context to inspect
Inspect coordinate precision, identity linkage, authorization scope, public/private layers, exports, logs, caches, backups, and third-party processors.

## Core knowledge
Location can be sensitive even without obvious personal identifiers. Precision, temporal density, repeated trajectories, and auxiliary datasets can enable re-identification or reveal protected sites.

## Procedure
1. Classify datasets by sensitivity and re-identification risk.
2. Identify actors, abuse paths, and unauthorized spatial queries.
3. Enforce least-privilege access to raw and derived location data.
4. Reduce precision or aggregate outputs when full detail is unnecessary.
5. Bound spatial APIs against scraping and inference attacks.
6. Protect credentials and provider tokens outside code and logs.
7. Minimize sensitive coordinates in telemetry and error messages.
8. Define retention and deletion behavior for raw trajectories.
9. Review exports, caches, and backups for equivalent controls.
10. Test authorization across geography, tenant, and dataset boundaries.

## Decision points
Prefer aggregation, masking, or precision reduction when decision quality remains sufficient. Keep raw precision only for justified workflows with stricter controls.

## Common failure patterns
Public tile endpoints exposing restricted features, precise coordinates in logs, tenant filters applied after spatial queries, unrestricted bulk export, and assuming pseudonymous trajectories are anonymous.

## Verification
Perform access-control tests, data-flow review, sensitive-log inspection, abuse-rate tests, and export-policy checks.

## Expected output
A documented control set for location sensitivity, access, precision, retention, and API abuse resistance.

## Stop conditions
Stop when processing lacks a lawful/approved basis, access ownership is unclear, or required privacy controls cannot be enforced.