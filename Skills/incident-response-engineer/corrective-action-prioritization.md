# Corrective Action Prioritization

## Purpose
Turn incident findings into a small, prioritized set of engineering actions that materially reduce recurrence, blast radius, or recovery time.

## When to use
Use during and after post-incident review when remediation candidates exceed available capacity.

## Inputs
Causal factors, failure modes, recurrence likelihood, impact, engineering effort, existing controls, ownership, and strategic constraints.

## Context to inspect
Inspect prior incidents, risk register, roadmap, technical debt, control effectiveness, operational toil, and action-item history.

## Core knowledge
Not all remediation is equally valuable. Strong actions change system behavior, detection, containment, or recovery. Weak actions merely ask humans to remember more.

## Procedure
1. Map each proposed action to a specific causal or contributing factor.
2. Estimate the failure scenarios each action prevents or limits.
3. Evaluate risk reduction, implementation effort, operational cost, and time to benefit.
4. Prefer elimination and safe defaults over documentation-only controls.
5. Identify quick containment improvements separately from structural fixes.
6. Remove duplicate or cosmetic actions.
7. Assign an accountable owner.
8. Set measurable completion and effectiveness criteria.
9. Explicitly accept residual risk for deferred items.
10. Review effectiveness after implementation or the next relevant incident.

## Decision points
Prioritize high-severity recurring risks and controls that address multiple failure modes. Accept risk when mitigation cost is disproportionate and an authorized owner agrees.

## Common failure patterns
Prioritizing by implementation ease only, action-item overload, vague tasks like improve monitoring, no owner, and closing tasks without measuring effectiveness.

## Verification
Each retained action must have a causal link, owner, measurable outcome, and completion evidence.

## Expected output
A ranked corrective-action set with rationale, owner, risk reduction, verification, and residual risk.

## Stop conditions
Escalate when risk acceptance exceeds team authority or remediation conflicts with regulatory, contractual, or safety obligations.