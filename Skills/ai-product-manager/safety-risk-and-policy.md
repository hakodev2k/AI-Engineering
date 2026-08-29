# Safety, Risk, and Policy

## Purpose
Translate AI safety, abuse, legal, and policy concerns into product requirements, controls, launch criteria, and operational ownership.

## When to use
Use for new AI capabilities, new user segments, tool access, sensitive domains, model changes, or incidents involving harmful behavior.

## Inputs
Use case, user population, model behavior, policy requirements, threat scenarios, legal constraints, safety evaluations, escalation owners.

## Context to inspect
Content policies, abuse reports, red-team findings, permission model, logging, moderation controls, human review, geographic constraints, and incident history.

## Core knowledge
Risk is a function of capability, exposure, user intent, consequence, detectability, and reversibility. Product controls should combine prevention, detection, limitation, and response.

## Procedure
1. Identify foreseeable misuse and accidental harm scenarios.
2. Classify severity and likelihood.
3. Map each material risk to preventive and detective controls.
4. Define prohibited, gated, and unrestricted behaviors.
5. Specify safety evals and release thresholds.
6. Add rate limits, approvals, monitoring, or restricted tools where needed.
7. Define incident escalation, user remediation, and evidence retention.
8. Reassess risk after major model or workflow changes.

## Decision points
Prefer hard application controls for non-negotiable restrictions. Use model moderation as one layer rather than the sole enforcement mechanism.

## Common failure patterns
Treating policy text as a control, ignoring misuse incentives, launching without incident ownership, and applying identical safeguards to low- and high-risk actions.

## Verification
Run safety and abuse tests, confirm controls trigger as designed, and verify escalation paths with responsible stakeholders.

## Expected output
A risk register, control plan, safety eval requirements, launch gates, and incident ownership model.

## Stop conditions
Stop and escalate when residual risk exceeds approved tolerance or applicable legal/policy requirements are unresolved.