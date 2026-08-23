# Unit Economics Rules

## Purpose
Relate technology spend to business value and workload output instead of optimizing absolute cost blindly.

## Scope
Cost per customer, transaction, request, tenant, order, model inference, data unit, or other business-relevant unit.

## MUST
- Define each unit metric with numerator, denominator, scope, time basis, exclusions, and data owner.
- Validate that the denominator represents meaningful delivered value or workload output.
- Analyze unit-cost changes together with volume, quality, reliability, and product outcomes.
- Preserve metric definitions across reporting periods or explicitly version changes.

## MUST NOT
- Claim efficiency from falling total cost when demand or delivered value also fell without examining unit economics.
- Compare unit costs built from incompatible scopes or accounting treatments.
- Optimize a unit metric in ways that knowingly degrade required reliability, security, or customer outcomes.

## SHOULD
- Segment unit economics where workload classes have materially different cost behavior.

## Exceptions
Proxy units may be used during early maturity if limitations and migration to stronger measures are documented.

## Verification
Trace metric inputs to billing and operational systems, recompute samples, and review definition/version history and outcome correlations.