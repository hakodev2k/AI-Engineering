# On-call and Operational Ownership

## Purpose
Build sustainable team ownership of production services through clear support boundaries, runbooks, escalation, and learning from operational work.

## When to use
Use when establishing or improving service ownership, on-call rotations, support handoffs, or operational readiness.

## Inputs
Service inventory, SLOs, alerts, incidents, runbooks, ownership map, escalation paths.

## Context to inspect
Inspect paging volume, alert quality, support burden, dependency ownership, privileged access, recovery procedures, and knowledge concentration.

## Core knowledge
Operational ownership requires authority and tooling, not just responsibility. Paging should represent urgent actionable conditions. Repeated toil should feed engineering improvement.

## Procedure
1. Define service and dependency ownership.
2. Establish severity and escalation expectations.
3. Review alerts for actionability and user impact.
4. Create runbooks for common high-impact failures.
5. Ensure responders have safe diagnostic and mitigation access.
6. Exercise recovery procedures.
7. Track paging load and recurring toil.
8. Convert repeated incidents into engineering work.
9. Spread operational knowledge across the team.
10. Review sustainability regularly.

## Decision points
Page for urgent conditions requiring human action; ticket or dashboard non-urgent signals. Automate safe repetitive recovery when evidence supports it.

## Common failure patterns
Noisy paging, undocumented tribal knowledge, responsibility without access, heroic responders, and recurring manual fixes never prioritized.

## Verification
Representative responders can diagnose and mitigate common failures, paging is actionable, and ownership gaps are explicit.

## Expected output
A sustainable operational ownership model with alerts, runbooks, escalation, and improvement loop.

## Stop conditions
Escalate unsafe workload, missing critical access, or service ownership that cannot be assigned within the team.