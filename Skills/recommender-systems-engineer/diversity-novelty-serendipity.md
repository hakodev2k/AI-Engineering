# Diversity, Novelty, and Serendipity

## Purpose
Prevent redundant recommendation lists and improve discovery without sacrificing core relevance.

## When to use
Use when lists are repetitive, over-concentrated, or discovery is a product objective.

## Inputs
Ranked candidates, item similarity/category metadata, relevance scores, exposure history, and diversity guardrails.

## Context to inspect
Within-list redundancy, creator/category concentration, repeat exposure, popularity bias, and user intent.

## Core knowledge
Diversity is contextual: excessive diversification can damage intent satisfaction. Re-ranking methods such as MMR, quotas, submodular objectives, and constrained optimization trade relevance for coverage deliberately.

## Procedure
1. Define the dimension of undesirable redundancy.
2. Measure baseline intra-list similarity and concentration.
3. Protect hard relevance/eligibility thresholds.
4. Prototype re-ranking with tunable diversity strength.
5. Evaluate relevance, coverage, novelty, and cohort effects.
6. Account for recent exposure and repeated items.
7. Experiment online with user-value guardrails.
8. Monitor long-term concentration and discovery outcomes.

## Decision points
Use quotas for interpretable hard representation constraints; MMR-like re-ranking for smooth relevance/diversity trade-offs; personalized diversity when intent breadth varies.

## Common failure patterns
Diversifying irrelevant dimensions, forcing novelty during narrow intent, category tokenism, ignoring repeated exposure, and measuring catalog coverage without user utility.

## Verification
Inspect list-level examples, diversity metrics, relevance retention, creator/item exposure distribution, and online engagement/retention.

## Expected output
A measured re-ranking policy with explicit relevance-diversity trade-offs.

## Stop conditions
Stop if diversification violates eligibility, materially harms critical intent, or the similarity taxonomy is unreliable.