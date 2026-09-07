# Third-Party Script Governance

## Purpose
Control performance, reliability, privacy, and operational risk introduced by analytics, advertising, experimentation, support, and embedded third-party scripts.

## When to use
Use before adding a vendor tag, when third-party CPU/network cost grows, or when external code causes regressions or incidents.

## Inputs
Third-party inventory, business owner, loading code, RUM attribution, network/CPU traces, consent requirements, vendor SLA.

## Context to inspect
Determine business purpose, execution timing, origin count, data access, consent gating, failure behavior, duplicate tags, and whether the vendor blocks critical rendering or interactions.

## Core knowledge
Third parties consume shared network/main-thread budgets and may change without application releases. Governance requires ownership, measurable budgets, isolation where possible, and removal criteria—not only technical loading tricks.

## Procedure
1. Inventory scripts by vendor and accountable internal owner.
2. Quantify transfer, CPU, long tasks, network origins, and user reach.
3. Verify business value and legal/consent requirements.
4. Remove duplicates and unused integrations.
5. Delay noncritical scripts until after critical content or explicit consent.
6. Limit synchronous APIs and DOM work in interaction-critical windows.
7. Use sandboxing/worker techniques only when compatibility and security are understood.
8. Add per-vendor performance budgets and RUM attribution.
9. Test vendor outage, timeout, and slow-response behavior.
10. Review periodically and remove integrations lacking sufficient value.

## Decision points
Load synchronously only when the user journey truly depends on it. Prefer server-side collection when it reduces client cost without creating privacy or data-quality problems. Reject vendors that cannot meet critical reliability/security constraints.

## Common failure patterns
Tags without owners; identical SDK loaded twice; consent tools themselves becoming critical-path bottlenecks; relying on `async` while initialization still monopolizes CPU; no monitoring for vendor-side changes.

## Verification
Confirm reduced third-party CPU/network contribution, unchanged required business events, proper consent behavior, and resilience to vendor degradation.

## Expected output
A third-party inventory, ownership model, budgets, loading policy, and removal/escalation criteria.

## Stop conditions
Escalate when removal affects contractual obligations, revenue-critical workflows, privacy requirements, or vendor behavior cannot be safely constrained.