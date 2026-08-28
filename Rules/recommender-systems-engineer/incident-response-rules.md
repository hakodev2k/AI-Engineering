# Incident Response Rules

## Purpose
Provide disciplined investigation and recovery when recommendation behavior causes quality, safety, reliability, privacy, or business-impacting incidents.

## Scope
Applies to model regressions, serving outages, bad data, unsafe recommendations, policy failures, experiment incidents, and widespread ranking anomalies.

## MUST
- Incidents MUST identify the affected traffic, model and configuration versions, first known bad time, current impact, and containment owner.
- Containment actions MUST prioritize user safety, policy compliance, and prevention of additional harmful exposure before optimization recovery.
- Investigations MUST use available logs, metrics, traces, experiment data, model lineage, and data-quality evidence rather than intuition alone.
- Material incidents MUST preserve relevant artifacts and timeline evidence for root-cause analysis.
- Recovery MUST verify that the triggering condition is removed or bounded and that critical guardrails are healthy before full traffic restoration.

## MUST NOT
- MUST NOT delete or rewrite evidence needed for investigation unless required by an authorized privacy or security process.
- MUST NOT restore a known-bad model or configuration merely because it improves a primary engagement metric.
- MUST NOT declare root cause solely from correlation without sufficient supporting evidence.

## SHOULD
- Incidents SHOULD distinguish triggering cause, contributing factors, detection gaps, and containment gaps.
- Corrective actions SHOULD include regression prevention and improved detection, not only immediate repair.

## Exceptions
Exceptions require documented operational necessity, evidence preserved where possible, residual risk, and incident-lead approval.

## Verification
Review incident timelines, version metadata, telemetry, containment records, root-cause evidence, recovery checks, and post-incident corrective actions.