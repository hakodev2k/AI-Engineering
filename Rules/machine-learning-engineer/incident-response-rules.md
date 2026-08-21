# ML Incident Response Rules
## Purpose
Contain and learn from production model failures.
## Scope
Quality regressions, unsafe predictions, data corruption, drift, outages, and security incidents involving ML systems.
## MUST
- Prioritize containment and user impact over preserving a failing model version.
- Record affected model, data window, cohorts, symptoms, timeline, mitigations, and evidence.
- Preserve relevant artifacts and telemetry for root-cause analysis.
- Add regression protection for confirmed failure mechanisms where practical.
## MUST NOT
- Retrain or redeploy speculatively as a substitute for investigation when evidence can be collected.
- Delete evidence needed for incident analysis.
## SHOULD
- Provide safe fallback or disablement for high-impact ML decisions.
## Exceptions
Immediate containment may precede full diagnosis but requires documented follow-up.
## Verification
Review incident records, telemetry, root cause, corrective actions, and regression tests.