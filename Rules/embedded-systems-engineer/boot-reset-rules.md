# Boot and Reset Rules

## Purpose
Ensure deterministic startup and safe recovery from every reset source.

## Scope
Bootloaders, reset handlers, startup sequencing, watchdog resets, brownouts, and persistent reset state.

## MUST
- Establish safe outputs before enabling dependent hardware.
- Detect and preserve diagnostically useful reset causes where supported.
- Define behavior for interrupted initialization and corrupted persistent state.

## MUST NOT
- Assume RAM, peripherals, or external devices are initialized after reset unless guaranteed.
- Enter an endless reboot loop without bounded recovery or diagnostic strategy.

## SHOULD
- Keep early boot minimal and observable enough to diagnose startup failures.

## Exceptions
Special boot paths require explicit entry conditions and validation.

## Verification
Exercise cold boot, warm reset, watchdog, brownout, interrupted boot, and invalid-state scenarios on target hardware.