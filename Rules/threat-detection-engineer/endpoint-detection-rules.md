# Endpoint Detection Rules

## Purpose
Define reliable endpoint detections for malicious process, file, persistence, and execution behavior.

## Scope
Applies to workstation, server, container-host, and endpoint security telemetry.

## MUST
- Endpoint detections MUST use stable process, parent-child, signer, hash, path, user, and command-line fields where available.
- Suspicious execution detections MUST account for legitimate administrative tooling and documented automation.
- Persistence detections MUST distinguish creation, modification, and execution evidence.
- Critical endpoint detections MUST be validated across supported operating-system versions and sensor configurations.

## MUST NOT
- MUST NOT depend solely on process names when stronger identity attributes are available.
- MUST NOT globally suppress common administrative binaries without contextual conditions.
- MUST NOT assume sensor presence equals complete event coverage.

## SHOULD
- Detections SHOULD correlate execution with network, identity, and file events when it materially increases confidence.
- Rules SHOULD prefer behavior and lineage over fragile path-only matches.

## Exceptions
Exceptions require affected platform scope, risk, compensating telemetry, owner, and review date.

## Verification
Replay representative malicious and benign execution chains; inspect sensor health, field completeness, exclusions, and alert evidence.