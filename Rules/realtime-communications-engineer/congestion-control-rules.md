# Congestion Control Rules

## Purpose
Protect call quality and network fairness under constrained capacity.

## Scope
Bandwidth estimation, pacing, bitrate adaptation, loss, delay, and congestion feedback.

## MUST
- Send rate MUST respond to validated congestion signals within bounded time.
- Adaptation thresholds MUST be tested under loss, latency, reordering, and variable bandwidth.
- Recovery after congestion MUST be gradual enough to avoid repeated collapse.
- Transport feedback required by the selected algorithm MUST be negotiated and monitored.

## MUST NOT
- MUST NOT equate all packet loss with congestion without considering evidence.
- MUST NOT disable congestion control to reach synthetic throughput targets.
- MUST NOT tune production thresholds without controlled measurement.

## SHOULD
- Prefer algorithms with demonstrated stability across supported network classes.

## Exceptions
Fixed-rate media requires capacity guarantees, explicit risk acceptance, and overload behavior.

## Verification
Use network emulation, bandwidth traces, sender/receiver stats, queue-delay measurements, and regression benchmarks.