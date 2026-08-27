# Boot and Startup

## Purpose
Ensure deterministic initialization and safe recovery from reset.

## Scope
Reset handlers, bootloaders, startup code, initialization, and self-tests.

## MUST
- Boot MUST establish a known hardware and software state before dependent components execute.
- Reset cause MUST be captured when operationally useful before registers are cleared.
- Initialization dependencies MUST be ordered explicitly and failures MUST lead to defined behavior.
- Boot-critical data MUST be validated before use.
- Startup time requirements MUST be measured on production builds.

## MUST NOT
- Application code MUST NOT assume peripherals were initialized by an undocumented prior stage.
- Boot failures MUST NOT silently continue into unsafe application behavior.

## SHOULD
- Boot paths SHOULD remain minimal and observable.
- Recovery mode SHOULD be independent of nonessential application components.

## Exceptions
Exceptions require platform evidence and recovery analysis.

## Verification
Test cold boot, warm reset, watchdog reset, corrupted persistent state, interrupted initialization, and recovery entry.