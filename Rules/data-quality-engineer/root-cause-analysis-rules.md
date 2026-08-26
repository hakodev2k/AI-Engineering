# Root Cause Analysis Rules
## Purpose
Resolve defects at their causal source rather than repeatedly treating symptoms.
## Scope
Investigation, evidence, hypotheses, causal boundaries, and corrective actions.
## MUST
- Investigations MUST preserve relevant evidence and distinguish observation from hypothesis.
- Root-cause claims MUST be supported by reproducible or corroborating evidence.
- Corrective actions MUST address the causal mechanism or explicitly state when only containment is achieved.
## MUST NOT
- MUST NOT alter broad production logic based on an untested hypothesis when safer validation is available.
- MUST NOT blame downstream consumers for upstream contract violations without evidence.
## SHOULD
- Investigations SHOULD narrow the first bad stage, record, deployment, or time window systematically.
## Exceptions
When root cause cannot be proven, document bounded causes, residual uncertainty, and monitoring.
## Verification
Review timelines, experiments, logs, lineage, diffs, reproduction steps, and recurrence-prevention tests.