# Data Durability Rules

## Purpose
Protect stored data against device, node, zone, software, and operator failures.

## Scope
Replication, erasure coding, checksums, scrubbing, repair, and durability controls.

## MUST
- Durability targets MUST be explicit for each data class.
- Redundant copies or fragments MUST span the failure domains required by the durability target.
- Integrity verification and repair MUST be automated for systems that support them.
- Degraded redundancy MUST be observable and prioritized according to exposure.
- Durability claims MUST be supported by configuration inspection and failure testing where practical.

## MUST NOT
- MUST NOT count correlated copies in one failure domain as independent protection.
- MUST NOT disable checksums, scrubbing, or repair controls merely to improve short-term performance.
- MUST NOT declare data safe solely because replication reports healthy.

## SHOULD
- Measure repair time and unrecoverable-error exposure under realistic failure conditions.

## Exceptions
Any durability reduction requires explicit data-owner acceptance, bounded duration, mitigation, and restoration criteria.

## Verification
Review placement policies, integrity metrics, scrub results, degraded-object counts, repair tests, and fault-injection evidence.