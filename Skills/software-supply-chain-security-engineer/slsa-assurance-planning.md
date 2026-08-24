# SLSA Assurance Planning

## Purpose
Use SLSA concepts to plan measurable improvements to source and build integrity without treating maturity labels as the objective.

## When to use
Use when establishing a supply-chain roadmap, assessing critical build systems, or responding to assurance requirements.

## Inputs
Current source/build architecture, provenance capabilities, builder isolation, release process, artifact criticality, and organizational constraints.

## Context to inspect
Inspect source controls, build service trust, provenance generation, build isolation, dependency handling, artifact verification, and administrative paths.

## Core knowledge
SLSA provides a framework for increasing confidence in artifact provenance and build integrity. Assurance must reflect actual enforced properties and evidence, not documentation claims.

## Procedure
1. Classify artifact criticality and threat exposure.
2. Document current source and build guarantees.
3. Map existing controls to relevant SLSA requirements.
4. Identify evidence supporting each claimed property.
5. Find the highest-risk gaps rather than chasing labels uniformly.
6. Design improvements in source protection, hosted/isolated builds, provenance, and verification.
7. Prioritize changes by risk reduction and feasibility.
8. Define acceptance tests for each improvement.
9. Implement incrementally and preserve developer usability.
10. Reassess after architecture or provider changes.

## Decision points
Not every artifact needs identical assurance. Apply stronger controls where compromise impact, distribution reach, or regulatory obligations justify them.

## Common failure patterns
Claiming a level from paperwork; generating provenance outside the trusted build; ignoring administrator compromise; applying expensive controls to low-risk artifacts while critical paths remain weak.

## Verification
Collect configuration and execution evidence, run negative tests, and independently validate claimed source/build properties.

## Expected output
A risk-prioritized assurance roadmap with evidence-backed target properties.

## Stop conditions
Escalate when requested assurance cannot be supported by the build architecture, evidence is unavailable, or compliance claims exceed verified controls.