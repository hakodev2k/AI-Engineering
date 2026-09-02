# Continuity Change Impact Rules

## Purpose
Prevent business and technical changes from silently invalidating continuity capability.

## Scope
Applies to material changes in products, processes, technology, data, suppliers, facilities, workforce models, and organizational ownership.

## MUST
- Material changes affecting critical capabilities MUST assess continuity impact before implementation or within an explicitly approved emergency process.
- The assessment MUST consider recovery objectives, dependencies, recovery procedures, capacity, staffing, supplier obligations, and exercise evidence.
- Changes that invalidate an approved continuity assumption MUST update the relevant plan, dependency map, or risk record.
- High-risk changes that materially reduce continuity capability MUST require accountable human approval and a defined restoration or mitigation plan.

## MUST NOT
- MUST NOT approve a change as continuity-neutral without evaluating affected critical services and dependencies.
- MUST NOT defer known continuity remediation indefinitely after a production or operating-model change.

## SHOULD
- Integrate continuity impact questions into architecture, procurement, release, and organizational change processes.
- Prioritize re-testing when changes affect previously demonstrated recovery paths.

## Exceptions
Emergency changes may use expedited assessment, but impact, authority, compensating controls, and retrospective verification MUST be documented.

## Verification
Inspect change records, architecture reviews, continuity assessments, updated plans, risk acceptances, and post-change recovery evidence.
