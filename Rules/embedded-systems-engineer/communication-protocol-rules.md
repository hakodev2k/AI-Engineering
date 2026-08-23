# Communication Protocol Rules

## Purpose
Keep wired and wireless protocol handling interoperable, bounded, and resilient to malformed input.

## Scope
UART, SPI, I2C, CAN, USB, Ethernet, BLE, proprietary protocols, framing, and parsers.

## MUST
- Validate lengths, ranges, states, checksums/authentication, and framing before consuming untrusted messages.
- Define timeouts, retry limits, duplicate handling, and recovery behavior.
- Maintain backward compatibility or explicit version negotiation for deployed interfaces.

## MUST NOT
- Trust peer-provided lengths or offsets without bounds checks.
- Block indefinitely waiting for a peer or bus response.

## SHOULD
- Make parsers deterministic and fuzz-testable.

## Exceptions
Breaking protocol changes require migration analysis and approval from affected interface owners.

## Verification
Use conformance tests, malformed-input tests, fuzzing, bus captures, timeout/fault injection, and compatibility tests.