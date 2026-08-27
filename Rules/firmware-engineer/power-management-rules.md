# Power Management

## Purpose
Make energy behavior predictable without compromising correctness or recoverability.

## Scope
Sleep states, clocks, wake sources, peripherals, batteries, and power transitions.

## MUST
- Entry and exit from low-power states MUST define peripheral, clock, memory, and wake-source behavior.
- Wake events MUST be validated and cleared without losing legitimate events.
- Power-state transitions MUST preserve required persistent and volatile state.
- Energy claims MUST be based on measurements using representative duty cycles.

## MUST NOT
- Low-power transitions MUST NOT occur while hardware transactions require clocks or power unless safely quiesced.
- Unused wake sources MUST NOT remain enabled without justification.

## SHOULD
- Drivers SHOULD expose explicit suspend/resume semantics when peripheral state is not retained.
- Power measurements SHOULD include worst-case temperature and radio/peripheral activity where relevant.

## Exceptions
Exceptions require documented energy/correctness trade-offs and verification.

## Verification
Measure current profiles, exercise all wake sources, and test repeated transitions and brownout-adjacent conditions.