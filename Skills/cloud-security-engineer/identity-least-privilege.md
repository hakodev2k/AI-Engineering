# Identity Least Privilege

## Purpose
Design and review cloud IAM so human and workload identities receive only necessary permissions for bounded time and scope.

## When to use
Use for role design, service identities, privilege reviews, cross-account access, or incident remediation.

## Inputs
Identity inventory, role bindings, permission policies, access logs, resource hierarchy, and job responsibilities.

## Context to inspect
Inspect effective permissions, inherited grants, group membership, federation, service accounts, break-glass paths, and recent access evidence.

## Core knowledge
Least privilege requires minimizing actions, resources, conditions, duration, and delegation. Effective access matters more than policy intent.

## Procedure
1. Identify required business actions.
2. Resolve effective permissions including inheritance.
3. Separate human and workload identities.
4. Remove wildcard and unused grants where evidence supports it.
5. Apply resource and condition constraints.
6. Prefer short-lived credentials and just-in-time elevation.
7. Separate administrative duties.
8. Add access logging and periodic review.
9. Test permitted and denied scenarios.

## Decision points
Use managed roles when they fit and remain narrow; create custom roles when managed roles materially overgrant. Use privileged access workflows for rare administrative actions.

## Common failure patterns
Permanent admin access, wildcard resources, shared accounts, unused service-account keys, hidden inherited grants, and permission reduction without testing.

## Verification
Prove required tasks still work, forbidden actions fail, effective-policy analysis matches intent, and audit logs identify the actor.

## Expected output
Reviewed IAM design, permission changes, test evidence, and residual exceptions.

## Stop conditions
Stop before removing access when ownership is unclear, emergency access would be lost, or production impact cannot be safely tested.