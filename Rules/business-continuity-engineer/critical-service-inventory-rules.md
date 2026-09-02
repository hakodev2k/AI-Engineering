# Critical Service Inventory Rules

## Purpose
Maintain an authoritative inventory of services and capabilities that require continuity protection.

## Scope
Applies to business services, operational processes, technology services, facilities, suppliers, and supporting resources considered in continuity planning.

## MUST
- Every continuity-relevant service MUST have an accountable owner, criticality classification, recovery objectives, and documented supporting dependencies.
- Inventory entries MUST identify the business capability delivered, affected stakeholders, operating locations, and material regulatory obligations.
- New or materially changed critical services MUST be entered into the inventory before continuity assurance is considered complete.
- Inventory records MUST have a defined recertification cadence based on criticality.

## MUST NOT
- MUST NOT treat an undocumented service as implicitly non-critical.
- MUST NOT use stale ownership or recovery data for crisis decisions when known changes have occurred.

## SHOULD
- Use identifiers that correlate business services with technical service catalogs and supplier records.
- Automate reconciliation against authoritative asset and service sources where practical.

## Exceptions
Exceptions require a named owner, documented reason, temporary classification, risk acceptance, and expiry date.

## Verification
Compare the continuity inventory with service catalogs, architecture inventories, supplier registers, ownership records, and recent change data; sample critical entries for completeness and recency.
