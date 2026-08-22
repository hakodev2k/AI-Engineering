# Root Cause Investigation Rules
## Purpose
Ensure corrective actions address evidence-backed causes rather than symptoms.
## Scope
Escaped defects, intermittent failures, regressions, and quality incidents.
## MUST
- Preserve relevant logs, traces, requests, data state, timing, version, and environment evidence before destructive reproduction steps.
- Distinguish confirmed facts, hypotheses, contributing factors, and unknowns.
- Validate proposed root causes against observed evidence.
## MUST NOT
- Treat correlation or agent confidence as proof of causation.
- Make broad corrective changes without bounding the failure mechanism when risk is significant.
## SHOULD
- Identify prevention opportunities in requirements, design, tests, monitoring, or process.
## Exceptions
Urgent mitigation may precede full root-cause confirmation when impact demands it; investigation must continue afterward.
## Verification
Review incident evidence, hypothesis tests, corrective actions, and recurrence monitoring.