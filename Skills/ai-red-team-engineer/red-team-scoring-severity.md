# Red-Team Scoring and Severity

## Purpose
Convert adversarial test evidence into consistent severity, exploitability, and remediation priority decisions.

## When to use
Use when triaging findings, comparing releases, setting gates, or communicating AI security risk to engineering and product teams.

## Inputs
Reproduction evidence, affected users/assets, attack prerequisites, policy requirements, control layers, and business impact.

## Context to inspect
Determine reachability, required privileges, reproducibility, scale, reversibility, detectability, and whether impact crosses tenant or trust boundaries.

## Core knowledge
Raw refusal rates do not equal risk. Severity should combine consequence, exploitability, affected population, attacker effort, reliability, and control bypass. Safety-policy failures and security vulnerabilities may require different rubrics but consistent evidence standards.

## Procedure
1. Confirm the finding is reproducible.
2. Define the exact violated invariant.
3. Identify attacker prerequisites and reachable population.
4. Estimate maximum credible impact and blast radius.
5. Measure reliability across repeated attempts.
6. Account for existing preventive and detective controls.
7. Assign severity using a documented rubric.
8. Record uncertainty and assumptions.
9. Set remediation priority and retest requirements.

## Decision points
Escalate low-frequency failures when consequence is catastrophic or attacker amplification is easy. Downgrade only when controls demonstrably constrain real impact.

## Common failure patterns
Severity based on shocking output alone; ignoring prerequisites; conflating policy disagreement with exploitability; averaging away critical tail failures; inconsistent scoring across teams.

## Verification
Have a second reviewer independently score representative findings and reconcile material differences against the rubric.

## Expected output
A defensible severity decision with evidence, assumptions, confidence, and remediation priority.

## Stop conditions
Escalate when impact involves legal/privacy obligations, critical infrastructure, or unresolved policy ownership beyond the red-team mandate.