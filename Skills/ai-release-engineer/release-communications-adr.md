# Release Communications and Architecture Decisions

## Purpose
Communicate AI release intent, behavioral changes, constraints, trade-offs, and architecture decisions so engineering and operational stakeholders can reason about the release consistently.

## When to use
Use for model/provider migrations, major prompt behavior changes, retrieval redesigns, new agents/tools, architecture changes, deprecations, or releases with material residual risk.

## Inputs
Release scope, architecture context, evaluation evidence, risks, rollout plan, user impact, decision alternatives, operational requirements.

## Preconditions
The release owner understands the change well enough to distinguish confirmed facts from assumptions and unresolved risks.

## Context to inspect
Existing ADRs, service ownership, customer commitments, compatibility policy, incident history, monitoring plans, and release calendar.

## Core knowledge
AI releases often involve trade-offs among quality, latency, cost, safety, privacy, and vendor dependence. Decisions should capture why an alternative was chosen, not merely what was deployed, so later engineers can interpret regressions and migrations correctly.

## Procedure
1. Summarize the behavioral and architectural change.
2. State the business or technical problem being solved.
3. Document alternatives considered and evidence used.
4. Record major quality, safety, performance, cost, and operability trade-offs.
5. Identify affected consumers and operational teams.
6. State rollout phases, monitoring, and rollback expectations.
7. Separate known limitations from unresolved hypotheses.
8. Record durable architecture decisions in an ADR or equivalent record.
9. Publish concise release notes to relevant stakeholders.
10. Link the communication to the immutable release manifest and evaluation evidence.

## Decision points
Use an ADR when the decision changes long-lived architecture or constrains future choices. Use concise release notes for operational changes that do not require durable architectural rationale.

## Common failure patterns
Communicating only implementation details, omitting behavioral changes, hiding residual risks, failing to document rejected alternatives, and release notes that cannot be tied to deployed artifacts.

## Verification
Confirm stakeholders can identify what changed, why, how success is measured, how to detect regressions, and how to roll back from the published record.

## Expected output
Clear release communication plus durable decision documentation where warranted.

## Stop conditions
Stop publication and escalate when critical impact, ownership, or risk information is unresolved or materially misleading.