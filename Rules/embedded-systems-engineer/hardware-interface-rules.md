# Hardware Interface Rules

## Purpose
Prevent electrical and protocol assumptions from becoming firmware defects or hardware damage.

## Scope
GPIO, buses, peripherals, sensors, actuators, clocks, interrupts, and board interfaces.

## MUST
- Verify voltage levels, timing, polarity, pin multiplexing, reset state, and protocol constraints against authoritative hardware documentation.
- Define ownership and initialization order for every shared peripheral.
- Handle peripheral timeout and fault states explicitly.

## MUST NOT
- Drive a pin or peripheral before its safe electrical state is established.
- Assume undocumented power-on defaults or timing behavior.

## SHOULD
- Encapsulate device-specific behavior behind testable hardware-abstraction boundaries.

## Exceptions
Deviations require documented hardware evidence, risk assessment, and reviewer approval.

## Verification
Review schematics and datasheets; use logic-analyzer/oscilloscope traces and hardware-in-loop tests where practical.