# Quality Risk Communication

## Purpose
Communicate quality evidence and uncertainty so product and engineering leaders can make informed release and remediation decisions.

## When to use
Use for release decisions, unresolved defects, incident follow-up, risk acceptance, and stakeholder reporting.

## Inputs
Test evidence, defects, telemetry, risk assessment, mitigations, deadlines, rollback options.

## Context to inspect
Understand decision owner, business objective, affected users, uncertainty, alternatives, and time sensitivity.

## Core knowledge
Communicate risk as evidence, impact, likelihood, uncertainty, and options. Avoid binary quality verdicts when evidence is incomplete. Separate facts from assumptions.

## Procedure
1. State the decision that needs to be made.
2. Summarize verified evidence.
3. Describe affected behavior and plausible impact.
4. Quantify likelihood or uncertainty where possible.
5. Explain what was not tested or cannot be known.
6. Present mitigation and rollback options.
7. Recommend an action proportional to risk.
8. Record the authorized decision and residual risk.
9. Update stakeholders when evidence materially changes.

## Decision points
Use concise executive summaries for decision makers and attach technical evidence for implementers.

## Common failure patterns
Saying QA approved, overstating certainty, dumping test cases without implications, hiding untested scope, and accepting risk without an owner.

## Verification
Confirm the decision owner can explain the key risk, evidence, uncertainty, and mitigation after reading the communication.

## Expected output
A clear evidence-based quality risk statement and recorded decision.

## Stop conditions
Escalate when risk acceptance authority is unclear or critical evidence is contradictory.