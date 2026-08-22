# UI and E2E Rules

## Purpose
Keep end-to-end automation focused on high-value user journeys and real integration risk.

## Scope
Applies to browser, desktop, and mobile end-to-end tests spanning multiple system components.

## MUST
- E2E tests MUST represent meaningful user or business outcomes, not duplicate every lower-level case.
- Critical journeys MUST verify final observable outcome, not only intermediate clicks or page transitions.
- Environment prerequisites and external dependencies MUST be explicit.
- Failures MUST capture sufficient UI and system evidence for diagnosis.

## MUST NOT
- MUST NOT use E2E automation as the default layer for logic that can be verified reliably at lower cost.
- MUST NOT make assertions solely on cosmetic details unless presentation is the requirement under test.
- MUST NOT continue interactions after a prerequisite state has failed and then report misleading downstream errors.

## SHOULD
- Keep critical-path E2E suites small enough for frequent execution.
- Prefer API or fixture setup when UI setup itself is not under test.

## Exceptions
Broader UI coverage is justified for high-risk integrations lacking lower-level observability; document cost and maintenance implications.

## Verification
Review journey mapping, execution duration, failure artifacts, duplicated lower-level coverage, and critical outcome assertions.