# DNS Change Management Rules

## Purpose
Make production DNS changes controlled, reviewable, and reversible.

## Scope
Zone, resolver, authoritative, registrar, DNSSEC, and routing changes.

## MUST
- Production changes MUST define intent, affected names/zones, validation, blast radius, and rollback.
- High-risk changes MUST receive human approval before execution.
- Change sequencing MUST account for DNS caching and external control-plane delays.

## MUST NOT
- MUST NOT combine unrelated high-risk DNS changes when separation would improve rollback or diagnosis.
- MUST NOT declare success until authoritative and client-visible behavior is verified.

## SHOULD
- Changes SHOULD be automated from version-controlled desired state where practical.

## Exceptions
Emergency changes require incident authorization and retrospective reconciliation.

## Verification
Review diffs, approvals, pre/post queries, external checks, audit records, and rollback readiness.