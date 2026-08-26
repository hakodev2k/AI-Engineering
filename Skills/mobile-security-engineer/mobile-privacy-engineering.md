# Mobile Privacy Engineering

## Purpose
Minimize collection, exposure, retention, and unintended sharing of personal or sensitive data in mobile applications.

## When to use
Use for analytics, identifiers, location, contacts, health data, advertising, telemetry, permissions, or new data flows.

## Inputs
Data inventory, purposes, retention policy, consent requirements, SDK inventory, platform privacy declarations.

## Preconditions
Identify data subjects, purposes, sensitivity, and authoritative privacy requirements.

## Context to inspect
Collection points, local storage, network payloads, logs, analytics, crash reports, SDKs, permissions, backups, and deletion flows.

## Core knowledge
Apply data minimization, purpose limitation, least privilege, bounded retention, and privacy-safe defaults. Security controls do not replace lawful-purpose and transparency requirements.

## Procedure
1. Inventory personal data and derived identifiers.
2. Map each field to purpose and recipient.
3. Remove unnecessary collection.
4. Minimize precision and retention.
5. Review permissions and consent UX.
6. Constrain SDK sharing.
7. Protect telemetry and logs.
8. Implement deletion/account lifecycle requirements.
9. Verify platform privacy declarations match runtime behavior.

## Decision points
Prefer on-device processing when it materially reduces disclosure and meets product needs. Avoid stable identifiers when ephemeral or scoped identifiers suffice.

## Common failure patterns
Collecting data “just in case,” sensitive logs, excessive location precision, undeclared SDK collection, incomplete deletion, and production analytics in test assumptions.

## Verification
Compare observed runtime traffic/storage with documented data inventory and privacy declarations.

## Expected output
A minimized, documented data flow with verified retention, sharing, and deletion behavior.

## Stop conditions
Escalate when lawful basis, consent, retention, or regulated-data obligations require privacy/legal determination.