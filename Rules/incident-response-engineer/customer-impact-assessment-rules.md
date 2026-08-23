# Customer Impact Assessment Rules

## Purpose
Keep response priorities grounded in real customer and business harm.

## Scope
Impact estimation, affected cohorts, critical journeys, contractual obligations, and support signals.

## MUST
- Identify which customer capabilities, regions, tenants, cohorts, or transactions are affected and estimate scope using evidence.
- Distinguish complete outage, partial degradation, incorrect results, delayed processing, and data-integrity impact.
- Reconcile telemetry with support, synthetic, transactional, or business evidence when signals disagree.
- Track material contractual, regulatory, financial, or safety implications with the appropriate owners.

## MUST NOT
- Use aggregate availability alone when it masks severe impact to a critical cohort.
- Assume lack of support tickets means lack of customer impact.

## SHOULD
- Quantify affected requests, users, transactions, duration, and unrecoverable outcomes where meaningful.

## Exceptions
Early estimates may be ranges with confidence levels until evidence improves.

## Verification
Compare impact statements with telemetry, transaction records, support reports, customer journeys, and business-owner validation.