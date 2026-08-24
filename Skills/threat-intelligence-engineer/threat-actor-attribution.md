# Threat Actor Attribution

## Purpose
Assess responsibility for malicious activity using calibrated confidence while avoiding unsupported certainty.

## When to use
Use when attribution materially affects defense, legal response, executive communication, or strategic risk.

## Inputs
TTPs, infrastructure, malware lineage, operational security patterns, targeting, language/time-zone clues, historical reporting.

## Context to inspect
Review alternative actors, false-flag possibilities, shared tooling, source provenance, geopolitical context, and previous attribution quality.

## Core knowledge
Attribution combines multiple weak and strong signals. Technical similarity does not equal identity; public naming conventions are inconsistent across vendors.

## Procedure
1. Define the attribution question and required resolution.
2. Separate observed facts from interpretations.
3. Compare evidence across behavior, infrastructure, tooling, victimology, and operational patterns.
4. Map vendor aliases cautiously.
5. Develop at least one competing hypothesis.
6. Seek disconfirming evidence.
7. Weight evidence by independence and manipulability.
8. Assign confidence and explain uncertainty.
9. State what new evidence would change the judgment.

## Decision points
Prefer cluster-level attribution when identity evidence is weak. Use government or vendor attribution as evidence, not automatic proof.

## Common failure patterns
Single-indicator attribution, circular sourcing, geopolitical storytelling, alias conflation, and certainty inflation.

## Verification
A peer can distinguish facts, assumptions, alternatives, and confidence drivers.

## Expected output
Attribution assessment with evidence matrix, alternatives, confidence, aliases, and intelligence gaps.

## Stop conditions
Stop short of named attribution when evidence does not meet the consequence-sensitive threshold or disclosure requires legal/executive approval.