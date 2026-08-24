# Campaign Analysis

## Purpose
Cluster related malicious activity into evidence-based campaigns and explain scope, evolution, objectives, and defensive implications.

## When to use
Use when multiple incidents, infrastructure sets, malware samples, or reports appear related.

## Inputs
Timelines, observables, TTPs, malware metadata, infrastructure, victimology, reporting, internal sightings.

## Context to inspect
Check temporal overlap, infrastructure reuse, code relationships, operational patterns, targeting, and contradictory evidence.

## Core knowledge
Campaign clustering is probabilistic. Shared public infrastructure or commodity malware alone rarely proves common operation.

## Procedure
1. Normalize all candidate events and entities.
2. Build timelines and relationship graphs.
3. Identify strong and weak linkage features.
4. Separate shared tooling from operator-specific behavior.
5. Test alternative cluster boundaries.
6. Describe campaign phases, targeting, and objectives.
7. Assign confidence to each relationship.
8. Derive detection, hunting, and exposure implications.
9. Update the cluster as new evidence arrives.

## Decision points
Split clusters when contradictions exceed linkage evidence; merge only when multiple independent dimensions align.

## Common failure patterns
Confirmation bias, actor-name anchoring, graph-density bias, ignoring time, and conflating commodity tooling with common control.

## Verification
Key relationships are reproducible from evidence and alternative hypotheses have been considered.

## Expected output
Campaign dossier with timeline, entities, relationships, confidence, targeting, and defensive actions.

## Stop conditions
Stop merging activity when evidence is insufficient or legal restrictions prevent necessary data correlation.