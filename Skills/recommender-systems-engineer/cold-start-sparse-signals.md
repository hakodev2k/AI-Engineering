# Cold Start and Sparse Signals

## Purpose
Provide useful recommendations for new users, new items, and sparse cohorts before collaborative evidence matures.

## When to use
Use when onboarding, catalog growth, market expansion, or sparsity causes weak personalization.

## Inputs
Available metadata, contextual signals, onboarding inputs, popularity priors, exploration budget, and cold-start metrics.

## Context to inspect
Share of cold entities, metadata quality, time-to-first-interaction, item lifecycle, privacy constraints, and fallback behavior.

## Core knowledge
Cold start is an information problem. Content representations, contextual priors, popularity, explicit preference collection, and controlled exploration can reduce uncertainty.

## Procedure
1. Define cold-user and cold-item thresholds.
2. Measure baseline quality and coverage separately for each case.
3. Build safe popularity/contextual fallbacks.
4. Add content/metadata representations for new items.
5. Collect lightweight explicit preferences only when user value justifies friction.
6. Explore uncertain candidates within guardrails.
7. Transition smoothly to behavioral personalization as evidence accumulates.
8. Monitor time-to-personalization and cohort retention.

## Decision points
Prefer zero-friction contextual priors when onboarding friction is costly; explicit onboarding when preference space is stable and high-value.

## Common failure patterns
Blank feeds, global popularity for every cohort, permanent cold-start labels, overlong onboarding, and no exploration for new inventory.

## Verification
Evaluate first-session utility, new-item exposure, coverage, transition behavior, and guardrails by cold-start cohort.

## Expected output
A layered fallback and transition strategy with measurable cold-start quality.

## Stop conditions
Stop if metadata or onboarding collection violates privacy/consent requirements or exploration lacks safety controls.