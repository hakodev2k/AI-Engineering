# Knowledge: Mobile Quality and Distribution

## Quality dimensions
Correctness, crash/hang stability, responsiveness, memory, network efficiency, battery impact, accessibility, privacy/security, compatibility, observability and recoverability.

## Device strategy
Use risk-based coverage: one low-resource device, a common mid-tier device, current flagship/emulator, supported OS boundaries, relevant form factors, and platform-specific paths. Critical defects reported on a specific environment require that environment or the nearest controlled equivalent.

## Release realities
Distributed mobile clients cannot be instantly recalled. Backend/API compatibility must account for older installed versions. Persisted-data migrations and remote-config changes may outlive a release. Store review can delay emergency delivery. Prefer backward compatibility, staged rollout, remotely controllable risky features, and measurable stop thresholds.

## Telemetry
Capture privacy-safe crash/hang signals, app/build version, platform/OS, critical-flow outcomes, network/sync failures, migration failures and performance budgets. Avoid secrets, raw tokens and unnecessary PII.

## Evidence standard
A completed change states what was tested, where, with what build, what result was observed, what telemetry changed, what risk remains, and how rollout/recovery is controlled.