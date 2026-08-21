# Severity, Evidence, and Decision Frameworks

This knowledge file provides portable defaults. Organizations should map the labels to their own incident policy rather than treating these examples as contractual severity definitions.

## 1. Severity framework

### SEV1 — Critical
Typical characteristics:
- Widespread or mission-critical outage.
- Severe security or data-integrity risk.
- Major revenue/business operations blocked.
- No practical workaround for a large affected population.
- Impact is expanding rapidly or recovery path is unknown.

Operational behavior:
- Dedicated Incident Commander.
- Immediate staffing/escalation.
- Frequent synchronization and stakeholder communication.
- Freeze nonessential changes that may increase uncertainty.

### SEV2 — Major
Typical characteristics:
- Material degradation or partial outage affecting an important user group or business flow.
- Workaround may exist but is costly, unreliable, or operationally difficult.
- Significant dependency or capacity problem with meaningful business impact.

Operational behavior:
- Coordinated response with explicit owners.
- Regular checkpoints and status updates.
- Escalate if scope or duration increases.

### SEV3 — Moderate
Typical characteristics:
- Limited scope or non-critical functionality degraded.
- Viable workaround exists.
- Impact is contained and unlikely to expand quickly.

Operational behavior:
- Named owner and tracked response.
- Incident-command structure may be lightweight.

### SEV4 — Minor
Typical characteristics:
- Low user impact, cosmetic or narrowly operational issue.
- Normal support/engineering process is sufficient.

### Severity principles
- Severity reflects impact and risk, not the seniority of the reporter or emotional urgency.
- Reassess severity when scope, security/data implications, recovery confidence, or business impact changes.
- When uncertainty could conceal catastrophic impact, temporarily choose the safer severity and gather evidence quickly.
- Do not lower severity merely because responders are busy or the incident has lasted a long time.

## 2. Facts, hypotheses, assumptions, and unknowns

### Fact
An observation supported by a traceable source and timestamp.
Example: `Checkout HTTP 5xx exceeded 18% between 10:04 and 10:12 UTC in region A according to dashboard X.`

### Hypothesis
A falsifiable explanation of observed behavior.
Example: `The database connection pool is exhausting after the 09:58 deployment.`

### Assumption
A working premise accepted temporarily to make progress.
Example: `Assume the dependency status page is accurate until direct health data is available.`

### Unknown
Information whose absence matters to a decision.
Example: `We do not yet know whether failed requests caused duplicate charges.`

Never promote a hypothesis to fact because it sounds plausible or correlates with a recent change.

## 3. Evidence hierarchy

Evidence value depends on the question, but a useful preference order is:
1. User-facing transaction/synthetic result directly representing the failing flow.
2. Service telemetry tied to affected requests: traces, error codes, latency, saturation.
3. Dependency telemetry and resource state.
4. Change/deployment/configuration records.
5. Reproducible diagnostic experiments.
6. Customer/support reports with timestamps and scope.
7. Human recollection or unsourced interpretation.

Use multiple independent signals for high-impact decisions when practical.

## 4. Correlation is not root cause

A change immediately before an incident is a high-value lead, not proof. Check:
- Does the failure occur only where the change was applied?
- Does rollback or controlled reversal improve the predicted signal?
- Is there a plausible mechanism connecting the change to symptoms?
- Are there contradictory examples?
- Did another dependency/environment change at the same time?

## 5. Hypothesis prioritization

Prefer hypotheses that combine:
- high potential impact relevance;
- strong evidence or temporal/mechanical plausibility;
- inexpensive and safe falsification;
- high information gain;
- actionable mitigation if confirmed.

Avoid spending the whole team on a difficult low-probability theory while simpler high-impact explanations remain untested.

## 6. Mitigation risk matrix

Evaluate every material mitigation on five axes:

| Axis | Lower risk | Higher risk |
|---|---|---|
| Reversibility | immediate rollback | irreversible/complex restoration |
| Blast radius | one tenant/instance | global/shared data/infrastructure |
| Confidence | direct evidence | weak correlation/speculation |
| Data/security | no persistent effect | mutation, loss, exposure, access-policy change |
| Observability | clear success signal | ambiguous or delayed signal |

Prefer lower-risk actions when expected impact reduction is similar.

## 7. Decision record minimum

For a meaningful decision record:
- Timestamp
- Decision owner
- Problem being decided
- Evidence available
- Options considered
- Chosen option and rationale
- Expected result
- Risks
- Required approval
- Success/rollback criteria
- Outcome when known

This prevents later reconstruction from memory.

## 8. Recovery evidence

Do not equate mitigation completion with recovery. Choose signals closest to actual harm:
- End-to-end user success rate
- Error rate by affected operation
- Latency percentiles
- Queue/backlog drain and age
- Resource saturation
- Data-integrity reconciliation
- Dependency health
- Synthetic transaction results
- Support/customer report trend

Use an observation window appropriate to traffic patterns and failure recurrence. A low-traffic service may require longer validation or an active synthetic test.

## 9. Prioritization under pressure

Use this order as a default:
1. Prevent irreversible harm: security, data loss/corruption, safety.
2. Reduce active user/business impact.
3. Unblock critical dependencies or responders.
4. Increase decision-quality evidence.
5. Restore redundancy/capacity and reduce recurrence risk during the incident.
6. Deep root-cause work that is not needed for mitigation.
7. Cleanup and long-term improvements after stabilization.

Tie-breakers favor reversible work, smaller blast radius, shorter feedback cycles, and higher confidence.

## 10. Escalation framework

Escalate when the current team lacks:
- authority to make a required decision;
- expertise in a critical failure domain;
- access/permission to gather evidence;
- enough capacity for parallel critical work;
- vendor support for a blocking dependency;
- legal/security/privacy/compliance authority;
- a safe mitigation path.

Escalation is a risk-control action, not a sign of response failure.

## 11. Communication confidence

Use language matching evidence:
- **Confirmed:** `We confirmed...`
- **High-confidence but not final:** `Evidence currently indicates...`
- **Investigating:** `We are investigating whether...`
- **Unknown:** `We have not yet determined...`

Avoid words such as `fixed`, `root cause`, or `fully recovered` until the relevant verification gate is satisfied.