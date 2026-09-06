# Documentation Information Architecture

## Purpose
Structure AI platform documentation so developers can quickly discover concepts, complete tasks, troubleshoot failures, and understand production constraints.

## When to use
Use when creating or reorganizing developer documentation, adding major capabilities, or addressing repeated support questions caused by discoverability problems.

## Inputs
Developer personas, product surface, API reference, SDKs, examples, support data, search analytics, terminology, and release lifecycle.

## Context to inspect
Inspect navigation, search terms, page analytics, broken journeys, duplicated content, conceptual prerequisites, API references, tutorials, how-to guides, troubleshooting pages, and release notes.

## Core knowledge
Documentation serves different intents: learning concepts, completing a task, looking up exact syntax, and diagnosing a problem. Mixing these intents produces long pages that satisfy none. AI systems also require clear explanations of probabilistic behavior, model differences, limits, cost, latency, and safety boundaries.

## Procedure
1. Identify developer personas and their top tasks.
2. Inventory existing content by topic and intent.
3. Separate tutorials, how-to guides, conceptual explanations, references, and troubleshooting.
4. Design navigation around developer journeys rather than org structure.
5. Establish canonical terminology and cross-link related concepts.
6. Surface prerequisites, costs, limits, and permissions early.
7. Create progressive paths from first success to production readiness.
8. Add task-oriented troubleshooting entry points.
9. Ensure code samples are tested and version-aware.
10. Define ownership and freshness signals.
11. Test findability with representative users and search queries.
12. Remove or redirect obsolete duplicate content.

## Decision points
Prefer a new page when content serves a distinct user intent; extend an existing page when the topic and task remain coherent. Keep reference exhaustive and procedural guides selective.

## Common failure patterns
Organizing by internal team, burying prerequisites, duplicated contradictory pages, stale snippets, unexplained model names, tutorials that skip failure handling, and references that omit defaults or limits.

## Verification
Run findability tests, validate links and samples, compare search-success metrics, confirm ownership, and verify that common support questions have direct authoritative destinations.

## Expected output
A documentation map with content types, navigation, canonical pages, redirects, ownership, and validation evidence.

## Stop conditions
Escalate when product behavior is undocumented or unstable, terminology ownership is unresolved, or no authoritative source exists for safety, billing, or compatibility claims.