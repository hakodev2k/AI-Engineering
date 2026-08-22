# Vendor and Build-vs-Buy Evaluation

## Purpose
Evaluate external technology and build alternatives with disciplined attention to capability fit, integration, security, reliability, cost, and exit risk.

## When to use
Use when adopting SaaS, infrastructure, developer tooling, data platforms, AI services, or other capabilities that could be built internally or purchased.

## Inputs
Requirements, non-functional needs, security constraints, integration architecture, pricing, vendor documentation, support terms, roadmap, and internal capability.

## Context to inspect
Inspect actual differentiating requirements, existing contracts, data flows, compliance needs, operational ownership, migration effort, and dependency criticality.

## Core knowledge
Buying transfers some implementation work but creates dependency management. Building creates control but also permanent ownership. Proofs of concept should test the riskiest assumptions, not merely happy paths.

## Procedure
1. Define required outcomes and non-negotiable constraints.
2. Identify build, buy, open-source, and hybrid alternatives.
3. Compare functional fit and integration complexity.
4. Evaluate security, privacy, data ownership, and compliance.
5. Evaluate availability, support, quotas, roadmap, and vendor concentration risk.
6. Model total cost including implementation and exit.
7. Test critical assumptions with a bounded evaluation.
8. Define operational ownership and failure behavior.
9. Negotiate contractual or technical protections for material risks.
10. Record the decision and an exit or replacement strategy.

## Decision points
Prefer buy for commodity capabilities when vendor risk is acceptable; prefer build when the capability is strategically differentiating or vendor constraints create unacceptable exposure.

## Common failure patterns
Feature-checklist selection, ignoring migration and exit, POCs that avoid scale or failure cases, unreviewed data handling, and assuming vendor support replaces internal ownership.

## Verification
Verify critical requirements were tested, security and legal reviews are complete where required, total cost is understood, and an accountable owner accepts operational dependency.

## Expected output
A build-versus-buy recommendation with evidence, trade-offs, risk controls, and exit considerations.

## Stop conditions
Escalate when vendor terms, security posture, data handling, or financial commitment requires specialist or executive approval.