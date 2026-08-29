# AI Incident Response Rules

## Purpose
Ensure AI-related incidents are contained, investigated, communicated, and remediated with sufficient evidence to prevent recurrence.

## Scope
Applies to harmful outputs, unsafe actions, privacy events, security compromise, unfair outcomes, control failures, model regressions, vendor incidents, and governance breaches.

## MUST
- AI systems with material risk MUST have incident severity criteria, reporting channels, ownership, escalation paths, and containment options before production use.
- Incident response MUST distinguish immediate containment from root-cause investigation and long-term corrective action.
- Evidence required for investigation MUST be preserved in accordance with privacy, security, and retention obligations.
- High-severity incidents MUST identify affected model versions, configurations, data paths, tools, providers, and control states where relevant.
- Corrective actions MUST have accountable owners, deadlines, verification criteria, and risk-based priority.
- Significant incidents MUST trigger reassessment of relevant risks, controls, evaluations, monitoring, and governance requirements.
- External notification obligations MUST be escalated to the authorized legal, privacy, security, compliance, or customer authority.

## MUST NOT
- MUST NOT silently suppress harmful behavior merely to reduce incident counts.
- MUST NOT declare root cause without evidence sufficient to distinguish contributing factors.
- MUST NOT restore a disabled high-risk capability before the relevant corrective controls are verified or explicitly risk-accepted.
- MUST NOT delete evidence to simplify remediation.

## SHOULD
- Response playbooks SHOULD include safe disablement, model rollback, provider failover, feature restriction, and user communication options where applicable.
- Post-incident reviews SHOULD focus on systemic improvements rather than individual blame.
- Near misses SHOULD be reviewed when they reveal credible high-severity failure paths.

## Exceptions
Exceptions to standard incident procedures MUST document urgency, missing step, risk, compensating action, and authorized approval. Legal notification deadlines and evidence-preservation duties cannot be waived by engineering convenience.

## Verification
Inspect incident tickets, timelines, logs, evidence retention, containment actions, root-cause analysis, corrective-action tracking, approval records, and follow-up test results. Confirm lessons learned changed controls where appropriate.