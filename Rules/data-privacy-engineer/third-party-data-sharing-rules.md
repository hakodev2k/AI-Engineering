# Third-Party Data Sharing Rules

## Purpose
Control disclosure of personal data to external processors, vendors, partners, and APIs.

## Scope
Applies to outbound integrations, SaaS services, subprocessors, data exports, support providers, and partner feeds.

## MUST
- Each external data flow MUST document recipient, data categories, purpose, transfer mechanism, retention expectations, and security/privacy controls.
- Shared datasets MUST be minimized to the fields and records required for the approved purpose.
- Technical controls MUST enforce contractual or policy restrictions where feasible.
- Vendor or endpoint changes that materially alter processing MUST trigger privacy review.
- Data-sharing failures and unauthorized disclosures MUST be auditable.

## MUST NOT
- Personal data MUST NOT be sent to a new third party merely because an SDK or API makes the transfer easy.
- Test integrations MUST NOT use production personal data unless explicitly approved and protected.
- External recipients MUST NOT receive broader access than their documented processing purpose requires.

## SHOULD
- Stable abstraction boundaries SHOULD make third-party replacement and data-flow inspection practical.
- High-risk processors SHOULD have periodic control and configuration reviews.

## Exceptions
Exceptions require documented necessity, data scope, risk assessment, compensating controls, and accountable approval.

## Verification
Review integration code, network destinations, vendor configuration, contracts or approved records, payload samples, access controls, and data-flow inventories.