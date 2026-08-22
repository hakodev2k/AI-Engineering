# Documentation and Knowledge Sharing

## Purpose
Create durable technical knowledge that reduces dependency on individuals and accelerates safe engineering decisions.

## When to use
Use for architecture, operations, onboarding, complex workflows, recurring questions, and significant changes.

## Inputs
System behavior, decisions, runbooks, diagrams, code, operational procedures, audience needs.

## Context to inspect
Inspect existing documentation, code truth, ownership, stale areas, incident gaps, and where engineers repeatedly need verbal explanation.

## Core knowledge
Documentation should support a real task or decision and have an owner. Prefer concise material close to the source of truth; generated detail is useful only when kept synchronized.

## Procedure
1. Identify the reader and task the document must support.
2. Link to authoritative sources instead of duplicating volatile detail.
3. Document boundaries, contracts, decisions, and operational procedures that code cannot explain alone.
4. Use diagrams when relationships matter.
5. Include assumptions and failure/recovery behavior.
6. Assign ownership and review triggers.
7. Validate instructions by having another engineer use them.
8. Integrate updates into change workflows.
9. Archive obsolete material visibly.
10. Teach critical knowledge through reviews, demos, or pairing in addition to documents.

## Decision points
Document stable concepts deeply; link to generated/runtime sources for frequently changing facts. Use runbooks for action, ADRs for decisions, and diagrams for structure.

## Common failure patterns
Documentation dumps, duplicated configuration, stale wiki pages, no audience, and knowledge sharing dependent on one expert.

## Verification
A target engineer can complete the intended task or understand the decision without private context.

## Expected output
Maintainable task-oriented documentation with clear ownership and freshness triggers.

## Stop conditions
Stop documenting guessed behavior; verify against code, telemetry, or responsible owners first.