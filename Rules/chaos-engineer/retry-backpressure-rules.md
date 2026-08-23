# Retry and Backpressure Rules
## Purpose
Prevent fault handling from amplifying outages.
## Scope
Retries, queues, concurrency, rate limits, and load shedding.
## MUST
- Observe retry volume and downstream load during dependency faults.
- Validate bounded retries, timeouts, and backpressure for critical paths.
## MUST NOT
- Run experiments that knowingly create unbounded retry amplification.
- Interpret successful eventual completion as healthy behavior when queues or latency exceed limits.
## SHOULD
- Test recovery from accumulated backlog.
## Exceptions
Stress experiments may intentionally approach limits in isolated environments.
## Verification
Inspect retry counts, queue depth, throughput, saturation, and drain time.