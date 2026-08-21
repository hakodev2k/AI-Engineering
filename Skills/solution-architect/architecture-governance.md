# Architecture Governance

## Purpose
Create lightweight governance that keeps systems aligned with critical principles and risk controls without turning architecture into a delivery bottleneck.

## When to use
Use across multiple teams, platforms, regulated environments, or organizations with repeated architecture divergence.

## Inputs
Architecture principles, standards, risk model, team topology, platform capabilities, recurring issues.

## Preconditions
Governance objectives and decision authority are explicit.

## Context to inspect
Existing review boards, ADR practices, golden paths, CI policies, security standards, exception processes, delivery lead time.

## Core knowledge
Good governance automates objective rules and reserves human review for high-impact trade-offs. Standards should explain intent and provide exception paths.

## Procedure
1. Identify risks governance must control.
2. Define a small set of architecture principles.
3. Separate mandatory controls from recommendations.
4. Automate checks in templates, CI, policy-as-code, or platform defaults where practical.
5. Define review thresholds by risk/impact.
6. Establish ADR and exception processes.
7. Assign owners and expiration for exceptions.
8. Measure governance lead time and recurring violations.
9. Improve platform/golden paths where teams repeatedly struggle.
10. Retire rules that no longer provide value.

## Decision points
Use centralized review for irreversible/high-risk decisions; delegate routine decisions to teams within guardrails.

## Common failure patterns
Approval theater, massive standards documents, undocumented exceptions, governance without automation, architecture teams becoming gatekeepers.

## Verification
Teams can explain rules, reviews focus on material risks, and delivery metrics do not show unnecessary governance delay.

## Expected output
Principles, guardrails, review thresholds, automated controls, and exception model.

## Stop conditions
Stop when governance authority or accountability is undefined.