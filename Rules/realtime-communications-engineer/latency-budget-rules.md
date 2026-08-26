# Latency Budget Rules

## Purpose
Control end-to-end delay that directly affects conversational quality.

## Scope
Capture, encode, network, queueing, jitter buffer, decode, render, signaling, and server processing.

## MUST
- End-to-end latency targets MUST be decomposed into measurable component budgets.
- Changes on critical media paths MUST quantify latency impact when material.
- Queue growth MUST be bounded to prevent latency from hiding congestion.
- Latency analysis MUST use tail distributions, not averages alone.

## MUST NOT
- MUST NOT optimize one stage by shifting unmeasured delay downstream.
- MUST NOT claim latency improvement without comparable before/after measurements.
- MUST NOT use production clock comparisons without accounting for clock synchronization.

## SHOULD
- Instrument one-way latency where trustworthy clocking is available; otherwise use validated proxies.

## Exceptions
Budget overruns require documented user impact, trade-off, and remediation owner.

## Verification
Use traces, synchronized measurements, RTP timing, controlled network tests, and percentile dashboards.