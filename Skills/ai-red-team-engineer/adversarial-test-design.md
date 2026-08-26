# Adversarial Test Design

## Purpose
Design high-value AI red-team cases that explore realistic attacker strategies instead of accumulating shallow prompt variants.

## When to use
Use when planning a red-team campaign, converting threat models into tests, or expanding coverage after incidents.

## Inputs
Threat model, policies, system capabilities, attacker personas, architecture, historical failures, and evaluation budget.

## Context to inspect
Review existing tests, known blind spots, system changes, telemetry, user workflows, and control boundaries.

## Core knowledge
Strong adversarial suites vary attack objective, delivery channel, attacker knowledge, interaction length, modality, privilege, and composition. Coverage should include benign controls and held-out cases.

## Procedure
1. Define security objectives and unacceptable outcomes.
2. Enumerate attacker personas and capabilities.
3. Map each high-risk threat to observable success criteria.
4. Design orthogonal attack families.
5. Include single-turn, multi-turn, indirect, and chained variants where relevant.
6. Add benign near-neighbor controls to measure overblocking.
7. Separate development cases from held-out validation cases.
8. Prioritize by risk and expected information gain.
9. Version tests and preserve reproducibility metadata.

## Decision points
Favor fewer deep scenarios over many paraphrases when budget is constrained. Automate stable deterministic cases; retain expert manual exploration for novel attack surfaces.

## Common failure patterns
Benchmark chasing; no attacker model; ambiguous pass/fail criteria; test leakage; only English prompts; no benign controls; counting prompts instead of attack families.

## Verification
Review coverage against the threat model and demonstrate that each critical threat has at least one realistic test plus a defined evidence standard.

## Expected output
A prioritized, versioned adversarial test plan suitable for manual and automated execution.

## Stop conditions
Escalate when test objectives conflict with policy, safe simulation is impossible, or critical system behavior cannot be observed.