# Reputation Management Rules

## Purpose
Protect long-term domain and IP reputation through evidence-based traffic governance.

## Scope
Sender reputation, complaint rates, bounce patterns, engagement signals, blocklists, and receiver-specific telemetry.

## MUST
- Reputation decisions MUST use multiple signals and distinguish domain, IP, stream, provider, and recipient-domain effects.
- Sudden degradation MUST trigger investigation of recent traffic, audience, content, authentication, volume, and infrastructure changes.
- High-risk streams MUST have explicit thresholds and containment actions.
- Reputation recovery plans MUST remove the underlying cause before volume is restored.
- Claims of recovery MUST be supported by sustained receiver and delivery evidence.

## MUST NOT
- MUST NOT rotate domains or IPs to evade a reputation problem caused by unchanged behavior.
- MUST NOT optimize only for accepted SMTP responses while ignoring spam-folder placement and complaints.
- MUST NOT treat third-party reputation scores as authoritative without corroborating production evidence.

## SHOULD
- Maintain receiver-specific baselines and trend views.
- Prefer stable, consented traffic over short-term volume gains.

## Exceptions
Threshold exceptions require business context, quantified risk, monitoring, expiry, rollback criteria, and accountable approval.

## Verification
Review provider dashboards, complaint feeds, bounce classifications, inbox-placement evidence, authentication, blocklist data, traffic cohorts, and change history over a representative period.