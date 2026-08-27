# Hardware-in-the-Loop Validation

## Purpose
Automate repeatable verification of firmware behavior that depends on physical interfaces and timing.

## When to use
Use for peripheral integration, release regression, power/reset behavior or multi-device scenarios.

## Inputs
Requirements, target hardware, controllable fixtures, measurement equipment and CI environment.

## Context to inspect
Fixture interfaces, flashing workflow, device identity, test isolation, calibration and result collection.

## Core knowledge
HIL tests must control initial state and distinguish product failures from fixture failures. Reproducibility is more valuable than raw test count.

## Procedure
1. Select behaviors that genuinely require hardware.
2. Define fixture capabilities and safe states.
3. Automate provisioning and build identity capture.
4. Establish deterministic setup/teardown.
5. Capture measurements and device diagnostics.
6. Detect fixture/infrastructure failures separately.
7. Repeat timing-sensitive cases.
8. Archive evidence for failures.

## Decision points
Keep logic tests on host; reserve HIL capacity for electrical, timing and integration behavior that simulation cannot credibly prove.

## Common failure patterns
Shared dirty state, ambiguous device identity, manual steps, fixture races, weak timeout handling and classifying infrastructure faults as firmware defects.

## Verification
Repeat suites across devices and runs, inject known failures and confirm correct attribution.

## Expected output
A reproducible HIL suite with traceable evidence.

## Stop conditions
Stop automated execution when fixture safety, calibration or device identity cannot be established.