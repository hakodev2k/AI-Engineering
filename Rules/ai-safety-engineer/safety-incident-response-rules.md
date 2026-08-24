# Safety Incident Response Rules

## Purpose
Contain AI safety incidents quickly while preserving evidence and accountability.

## Scope
Applies to harmful outputs, abuse, control bypasses, unsafe tool actions, data exposure, and systemic safety regressions.

## MUST
- Define severity levels, incident command, containment options, communication paths, and escalation criteria.
- Preserve relevant logs, model/config versions, prompts or safe representations, and timeline evidence.
- Prioritize containment of ongoing harm before optimization or blame analysis.
- Track corrective actions to verified closure and add regression protection where feasible.

## MUST NOT
- Delete or alter evidence needed for investigation except under approved privacy/legal requirements.
- Re-enable a disabled high-risk capability without evidence that the triggering failure is controlled.
- Declare resolution solely because reports stop arriving.

## SHOULD
- Run blameless post-incident reviews focused on systemic causes and control gaps.
- Exercise incident procedures before critical launches.

## Exceptions
Emergency actions may precede normal approval when necessary to stop imminent harm, but MUST be documented and reviewed afterward.

## Verification
Review incident records, timelines, containment evidence, approvals, corrective actions, regression tests, and post-incident findings.
