# Reliability Rules

## Purpose
Ensure AI infrastructure degrades predictably and recovers from common failures.

## Scope
Applies to compute, networking, storage, schedulers, serving, and control-plane dependencies.

## MUST
- Critical services MUST define availability objectives and known dependency failure modes.
- Redundancy MUST span meaningful failure domains where required by service objectives.
- Recovery behavior MUST be tested for node, rack or zone, storage, network, and control-plane failures as applicable.
- Reliability changes MUST include blast-radius and rollback analysis.

## MUST NOT
- MUST NOT treat redundancy within one failure domain as high availability.
- MUST NOT rely on undocumented operator intervention for expected failure recovery.
- MUST NOT reduce redundancy below approved service requirements without explicit risk acceptance.

## SHOULD
- Failure injection SHOULD validate important recovery assumptions.
- Reliability work SHOULD prioritize measured failure frequency and impact.

## Exceptions
Exceptions require SLO impact, risk evidence, expiry, and owner approval.

## Verification
Review SLOs, dependency maps, fault-domain placement, failure tests, incident history, and rollback procedures.