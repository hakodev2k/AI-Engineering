# Technical Content Architecture

## Purpose
Design a coherent technical-content system that moves developers from discovery to successful production use without duplicating documentation.

## When to use
Use for editorial planning, content-library redesign, launches, or fragmented tutorials.

## Inputs
Personas, developer journey, docs IA, search queries, support themes, product roadmap, existing content inventory.

## Context to inspect
Identify canonical docs, quickstarts, samples, conceptual guides, troubleshooting, reference material, videos, and external community content.

## Core knowledge
Content types serve different intent: explanation builds mental models; tutorial teaches; how-to solves a task; reference answers precise questions. DevRel content should complement canonical docs and create reliable paths between them.

## Procedure
1. Map developer tasks by adoption stage.
2. Inventory content against those tasks.
3. Mark gaps, duplication, stale assets, and dead ends.
4. Assign each proposed asset a user intent and durable owner.
5. Define prerequisites and next-step links.
6. Prefer executable examples and reproducible evidence.
7. Establish versioning and freshness policy.
8. Add discoverability metadata and internal linking.
9. Measure task completion, search refinement, and downstream adoption.
10. Archive or redirect obsolete material.

## Decision points
Choose docs for canonical truth, blog/tutorial for narrative discovery, video for demonstrations, and sample repositories for executable depth. Do not duplicate reference material merely for traffic.

## Common failure patterns
Orphan tutorials, version drift, duplicated truth, missing prerequisites, marketing-first prose, screenshots that age quickly, and no maintenance owner.

## Verification
Walk representative developer journeys end to end. Run code examples, validate links/version claims, and verify each asset has an owner and freshness signal.

## Expected output
A content map, prioritized backlog, lifecycle rules, ownership model, and measurable journey improvements.

## Stop conditions
Stop when canonical product behavior is unknown, examples cannot be validated, or ownership for maintenance cannot be established.