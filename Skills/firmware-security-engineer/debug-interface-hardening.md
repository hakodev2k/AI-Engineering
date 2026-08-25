# Debug Interface Hardening

## Purpose
Control JTAG, SWD, UART boot consoles, test modes, and vendor debug facilities so field devices do not expose privileged memory, code execution, or security-state modification.

## When to use
Use before production release, during board bring-up security review, when defining RMA access, or after discovering an exposed service/debug port.

## Inputs
Board schematics, MCU/SoC debug architecture, lifecycle controls, boot straps, test pads, console configuration, manufacturing requirements, RMA workflow, and threat model.

## Preconditions
Identify legitimate manufacturing and service dependencies before disabling interfaces. Understand irreversible lock mechanisms.

## Context to inspect
Physical headers/pads, pin multiplexing, boot straps, ROM download modes, debug authentication, memory access, console shells, test commands, fuse settings, lifecycle transitions, and reset behavior.

## Core knowledge
Removing a connector does not disable a debug interface. Security should be enforced in silicon/lifecycle policy, with authenticated temporary unlock only where business requirements demand it. Debug state must not weaken secure boot, key storage, or rollback controls.

## Procedure
1. Inventory every documented and discovered debug/test path.
2. Determine capabilities available before and after secure boot.
3. Classify required access by manufacturing, development, field, and RMA lifecycle.
4. Disable unnecessary production interfaces in hardware/security configuration.
5. For required service access, implement strong challenge-response authorization with scoped, time-bounded privileges where supported.
6. Prevent debug unlock from exposing non-exportable keys.
7. Remove privileged production console commands and unauthenticated shells.
8. Harden boot straps and ROM download modes against unintended entry.
9. Validate reset/power-cycle behavior and lifecycle persistence.
10. Document controlled RMA transition and post-service sanitization.
11. Test direct attachment, malformed unlock attempts, replay, voltage/reset perturbation within authorized lab scope, and production configuration drift.

## Decision points
Permanent disable offers the smallest attack surface but may harm diagnostics. Authenticated debug is appropriate when silicon support is trustworthy and operational key management exists. RMA-only destructive unlock can protect customer secrets while allowing hardware diagnosis.

## Common failure patterns
Unpopulated JTAG pads assumed safe; debug disabled only by firmware; universal unlock passwords; production shell left on UART; RMA mode bypassing secure boot; keys readable after unlock; lifecycle fuse settings not verified after manufacturing.

## Verification
Probe physical interfaces on production-equivalent boards, verify locked memory/register behavior, test authorization and replay resistance, confirm secure boot/key protections remain active, and compare programmed lifecycle state with release policy.

## Expected output
Debug-interface inventory, production configuration, authorized-service design, test evidence, and RMA procedure.

## Stop conditions
Stop before irreversible lock if manufacturing/RMA requirements are unresolved or if disabling debug could prevent recovery from an unvalidated production image.