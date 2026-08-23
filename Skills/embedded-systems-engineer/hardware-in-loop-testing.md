# Hardware-in-the-Loop Testing

## Purpose
Verify firmware against real electrical and timing behavior using repeatable automated tests on representative hardware.

## When to use
Use for drivers, boot/update, communications, timing-sensitive behavior, hardware revisions, regression suites, and release qualification.

## Inputs
Hardware fixtures, firmware artifacts, test requirements, controllable power/I/O, measurement interfaces, logs, and CI/lab constraints.

## Context to inspect
Inspect board variants, flashing/reset control, stimulus generation, observable outputs, timing precision, fixture calibration, and test isolation.

## Core knowledge
HIL complements unit/integration tests by validating assumptions that mocks cannot: electrical behavior, peripherals, timing, reset, power, and silicon quirks. Tests must remain deterministic and diagnosable despite physical variability.

## Procedure
1. Prioritize risks that require real hardware evidence.
2. Define controllable stimuli and observable outcomes.
3. Automate flashing, reset, setup, and cleanup.
4. Capture firmware logs plus external measurements where relevant.
5. Make timeouts explicit and distinguish fixture from product failures.
6. Include reset, power-cycle, boundary, and fault scenarios.
7. Track board/fixture identity and calibration.
8. Run representative release tests repeatedly.

## Decision points
Keep pure logic in fast host tests; reserve HIL for hardware-dependent risk. Use expensive instrumentation only where pass/fail cannot be inferred reliably from digital interfaces.

## Common failure patterns
Manual-only setup, flaky timing sleeps, no fixture health check, shared dirty state, testing one golden board, and treating HIL as a substitute for lower-level tests.

## Verification
Demonstrate repeatability across multiple runs/boards, inject known failures to prove detection, and preserve artifacts sufficient for diagnosis.

## Expected output
An automated HIL suite with controlled setup, traceable hardware, deterministic assertions, and diagnostic artifacts.

## Stop conditions
Stop when fixture safety, calibration, board identity, or required physical controls cannot be established.