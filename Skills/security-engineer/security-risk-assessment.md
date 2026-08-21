# Security Risk Assessment

## Purpose
Evaluate security risk consistently by combining threat likelihood, exploitability, asset importance, exposure, existing controls, and business impact.

## When to use
Use when prioritizing findings, assessing architecture changes, reviewing exceptions, or deciding remediation urgency.

## Inputs
Threats, vulnerabilities, asset inventory, data classification, exposure, controls, incident history, business criticality, remediation options.

## Context to inspect
Reachable attack paths, identities, public exposure, compensating controls, dependencies, recovery capability, and operational constraints.

## Core knowledge
Risk is contextual. Scanner severity or generic scores are inputs, not final decisions. A strong assessment distinguishes inherent risk from residual risk and makes uncertainty visible.

## Procedure
1. Define the affected asset and security objective.
2. Describe the threat scenario and prerequisite conditions.
3. Evaluate exposure and exploitability using current evidence.
4. Estimate confidentiality, integrity, availability, and business impact.
5. Identify existing preventive, detective, and recovery controls.
6. Rate inherent and residual risk using the organization’s model.
7. Compare remediation options, cost, and implementation risk.
8. Assign treatment: mitigate, avoid, transfer, or accept.
9. Record assumptions, uncertainty, owner, and review date.
10. Reassess after material control or environment changes.

## Decision points
Escalate uncertain but potentially catastrophic risks rather than lowering them because evidence is incomplete. Accept risk only through accountable authority.

## Common failure patterns
CVSS-only prioritization, ignoring business context, undocumented assumptions, permanent exceptions, inconsistent scoring, and treating unlikely events as impossible.

## Verification
Another reviewer can reproduce the assessment from the evidence and rationale, treatment actions have owners, and accepted risks have expiry/review dates.

## Expected output
A transparent risk assessment with scenario, evidence, controls, residual risk, treatment decision, and ownership.

## Stop conditions
Escalate when business impact, asset ownership, or risk-acceptance authority cannot be established.