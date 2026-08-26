# DNS Incident Response Rules

## Purpose
Restore DNS service safely while preserving diagnostic evidence.

## Scope
Resolution outages, hijacks, poisoning indicators, DNSSEC failures, delegation defects, and control-plane incidents.

## MUST
- Incidents MUST establish scope using authoritative data, resolver observations, change history, and network evidence.
- Mitigation MUST prioritize service restoration without destroying evidence needed for root-cause analysis.
- Security-significant DNS changes during an incident MUST use explicit authorization.

## MUST NOT
- MUST NOT flush caches, disable validation, or rewrite zones broadly without understanding likely blast radius.
- MUST NOT treat one resolver's answer as definitive evidence of global state.

## SHOULD
- Root cause SHOULD be identified or bounded by evidence before broad permanent corrective action.

## Exceptions
Immediate containment may precede full diagnosis when impact is severe; actions and rationale must be recorded.

## Verification
Review incident timeline, queries from multiple vantage points, logs, packet evidence, changes, and recovery tests.