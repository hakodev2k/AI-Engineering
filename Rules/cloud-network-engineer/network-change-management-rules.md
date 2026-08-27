# Network Change Management Rules

## Purpose
Provide a controlled method for changing cloud network configuration.

## Scope
Applies to routing, firewall, DNS, load balancing, gateways, private connectivity, and shared network services.

## MUST
- Each production network change MUST state its intended outcome, affected paths, validation method, and rollback method.
- Changes with broad service impact MUST identify dependent teams and services before implementation.
- Change scope MUST remain limited to the approved objective.
- Pre-change evidence MUST capture the current working state for critical paths.
- Post-change verification MUST confirm intended connectivity and required isolation.

## MUST NOT
- MUST NOT combine unrelated network changes without a documented reason.
- MUST NOT continue when required rollback prerequisites are unavailable.
- MUST NOT treat a successful configuration API response as proof that traffic behaves correctly.

## SHOULD
- Prefer staged rollout for broad changes.
- Schedule high-impact changes when qualified operational coverage is available.

## Exceptions
Exceptions require documented urgency, alternative safeguards, risk acceptance, and approval.

## Verification
Review change records, configuration diffs, approvals, connectivity tests, telemetry, and rollback readiness.