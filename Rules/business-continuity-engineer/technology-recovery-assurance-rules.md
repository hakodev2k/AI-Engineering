# Technology Recovery Assurance Rules

## Purpose
Ensure technology recovery capabilities demonstrably support business continuity requirements.

## Scope
Applies to applications, infrastructure, platforms, networks, identity services, operational tooling, and technology recovery dependencies supporting critical business capabilities.

## MUST
- Critical technology services MUST map to the business capabilities and recovery objectives they support.
- Recovery procedures MUST define prerequisites, sequencing, dependencies, validation criteria, and accountable roles.
- Recovery capability MUST be supported by current test evidence at a frequency proportionate to criticality and change rate.
- Known gaps between required and demonstrated recovery capability MUST be recorded, owned, and escalated.
- Production-impacting recovery actions MUST follow authorized emergency or change procedures.

## MUST NOT
- MUST NOT treat backup existence, redundancy, or vendor claims alone as proof of recoverability.
- MUST NOT declare recovery complete before service integrity and critical business functionality have been validated.

## SHOULD
- Test recovery under degraded and dependency-failure conditions, not only ideal scenarios.
- Automate repeatable recovery validation where doing so does not increase uncontrolled risk.

## Exceptions
Unverified recovery capability requires documented risk, compensating controls, accountable approval, and a time-bound assurance plan.

## Verification
Review recovery runbooks, architecture, test results, observed recovery times, dependency validation, service acceptance evidence, and unresolved gaps.
