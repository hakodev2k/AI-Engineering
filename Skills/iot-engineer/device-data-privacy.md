# Device Data Privacy

## Purpose
Minimize and protect personal or sensitive data across device collection, transmission, cloud processing, support, and deletion.

## When to use
Use when sensors can observe people, locations, behavior, identifiers, audio/video, or sensitive environments.

## Inputs
Data inventory, purposes, retention, jurisdictions, consent/notice requirements, support workflows.

## Context to inspect
Sensors, local buffers, telemetry schemas, logs, cloud stores, analytics, exports, and diagnostic tooling.

## Core knowledge
IoT privacy starts at collection. Physical sensors can capture more than intended, and remote diagnostics can become a secondary data channel. Data minimization and lifecycle enforcement reduce both privacy and security risk.

## Procedure
1. Inventory collected and inferred data.
2. Map purpose and lawful/authorized use.
3. Remove unnecessary collection and precision.
4. Minimize transmission and retention.
5. Encrypt sensitive data and restrict access.
6. Define deletion, export, ownership-transfer, and factory-reset behavior.
7. Prevent sensitive values in logs.
8. Review diagnostics and analytics for secondary use.
9. Verify controls throughout the lifecycle.

## Decision points
Process locally when privacy benefit outweighs device cost; aggregate/anonymize only when re-identification risk is acceptably controlled.

## Common failure patterns
Collecting data “for later,” permanent identifiers, hidden diagnostic capture, incomplete deletion, and assuming encrypted data is automatically privacy-safe.

## Verification
Trace sample data end-to-end and test retention, deletion, access controls, reset, and ownership transfer.

## Expected output
A minimized, documented and testable data lifecycle.

## Stop conditions
Escalate when required collection lacks clear authorization or privacy ownership.