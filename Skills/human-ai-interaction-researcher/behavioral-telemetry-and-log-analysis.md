# Behavioral Telemetry and Log Analysis

## Purpose
Use product and AI interaction logs to identify behavioral patterns, failure sequences, verification behavior, and research opportunities while respecting the limits of observational data.

## When to use
Use for deployed systems with interaction telemetry, especially when scale, longitudinal behavior, or rare events matter.

## Inputs
Event schema, interaction logs, model metadata, user segmentation, research questions, privacy constraints, and release history.

## Context to inspect
Inspect event definitions, missingness, sampling, retention, model versions, experiments, feature flags, identity semantics, bot/internal traffic, and instrumentation changes.

## Core knowledge
Logs show recorded behavior, not intent. Event instrumentation can create measurement artifacts. Human-AI analysis often requires sequence-level context: prompts, revisions, tool actions, verification, corrections, and outcomes.

## Procedure
1. Translate the research question into observable events and sequences.
2. Audit whether instrumentation actually captures those constructs.
3. Define units such as user, session, task, conversation, or agent run.
4. Filter test traffic and document exclusions.
5. Align analysis with model and product versions.
6. Build funnels or sequences around meaningful task states rather than arbitrary clicks.
7. Identify abandonment, retries, corrections, verification, overrides, and escalation.
8. Segment by task, expertise proxies, product state, and risk-relevant context where defensible.
9. Inspect rare high-impact failure sequences separately from averages.
10. Generate qualitative follow-up questions for ambiguous patterns.
11. Report observational limitations and competing explanations.

## Decision points
Use aggregate metrics for stable high-volume patterns; sequence analysis for multi-turn behavior; sampled session review for interpretation; experiments when causal attribution is necessary.

## Common failure patterns
Treating events as ground truth, ignoring instrumentation changes, inferring intent from clicks, mixing model versions, optimizing engagement rather than user outcomes, and exposing sensitive prompt content unnecessarily.

## Verification
Reconcile selected metrics against raw sampled sessions and known product behavior. Confirm definitions with engineering or analytics owners.

## Expected output
A reproducible behavioral analysis with metric definitions, sequences, segments, anomalies, limitations, and prioritized follow-up research.

## Stop conditions
Stop when telemetry lacks required consent or privacy basis, event definitions are unreliable, or system-version mixing makes conclusions uninterpretable.