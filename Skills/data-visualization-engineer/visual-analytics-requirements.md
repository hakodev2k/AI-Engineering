# Visual Analytics Requirements

## Purpose
Turn ambiguous stakeholder questions into measurable visualization requirements, decision tasks, and acceptance criteria.

## When to use
Use before building dashboards, reports, exploratory tools, or executive visualizations. Do not use as a substitute for domain-owner decisions.

## Inputs
Business question, audience, decisions, data sources, metric definitions, refresh needs, delivery constraints.

## Preconditions
Identify an accountable stakeholder and confirm access to representative data or metadata.

## Context to inspect
Review existing reports, semantic models, metric catalogs, user workflows, data latency, security classification, and known pain points.

## Core knowledge
A visualization is useful when it supports a decision, not merely when it displays available fields. Separate monitoring, diagnosis, exploration, explanation, and action. Define grain, filters, comparison baselines, freshness, uncertainty, and ownership explicitly.

## Procedure
1. Identify the audience and decision they need to make.
2. Convert broad questions into concrete analytical tasks.
3. Define metrics, dimensions, grain, time windows, and comparison baselines.
4. Record data freshness and completeness requirements.
5. Identify required segmentation, drill paths, filters, and exports.
6. Rank questions by decision value and frequency.
7. Define latency, accessibility, security, and device constraints.
8. Sketch the minimum information hierarchy without choosing decorative details.
9. Define acceptance criteria using observable user outcomes.
10. Validate definitions with domain and data owners before implementation.

## Decision points
Prefer a dashboard for repeated monitoring, an exploratory interface for open-ended analysis, and a narrative artifact for a bounded explanation. Reject metrics whose definitions or ownership cannot be established.

## Common failure patterns
Starting from available columns; mixing incompatible grains; undefined KPIs; excessive scope; treating stakeholder preferences as validated user needs; ignoring refresh latency or permissions.

## Verification
Trace every visual element to a stated analytical task. Confirm metric definitions against authoritative sources and walk representative users through decision scenarios.

## Expected output
A prioritized visualization brief with audience, decisions, metrics, dimensions, interactions, constraints, data dependencies, and acceptance criteria.

## Stop conditions
Escalate when critical metric definitions conflict, required data is unavailable, security policy blocks access, or no accountable decision owner can validate requirements.