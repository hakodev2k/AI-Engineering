# Overload and Backpressure Rules

## Purpose
Fail predictably under excess demand instead of exhausting shared resources.

## Scope
Admission control, concurrency limits, queues, rate limits, load shedding, and dependency protection.

## MUST
- Services MUST have bounded concurrency or equivalent resource protection for expensive work.
- Overload behavior MUST preserve capacity for recovery and critical traffic where applicable.
- Queues MUST be bounded and their rejection behavior defined.
- Clients MUST distinguish overload from permanent failures when retry policy depends on it.
- Load shedding MUST be observable.

## MUST NOT
- MUST NOT accept unbounded work into memory.
- MUST NOT respond to overload with synchronized immediate retries.
- MUST NOT protect one tier by shifting unlimited pressure to a dependency.

## SHOULD
- Prefer early admission rejection over late timeout after expensive work.
- Priority classes SHOULD be used only with explicit starvation safeguards.

## Exceptions
Burst buffering beyond steady-state capacity requires measured bounds and recovery analysis.

## Verification
Run saturation tests; inspect queue depth, rejection rates, latency collapse, retry amplification, and recovery time after load removal.