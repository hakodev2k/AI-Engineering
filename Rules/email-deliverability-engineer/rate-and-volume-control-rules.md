# Rate and Volume Control Rules

## Purpose
Control sending pace so receiver limits, provider capacity, and reputation constraints are respected.

## Scope
Throttling, queueing, burst control, recipient-domain limits, backpressure, and volume changes.

## MUST
- Sending systems MUST support bounded rate control and backpressure for material streams.
- Receiver deferrals and policy responses MUST influence subsequent pacing when evidence shows rate sensitivity.
- Large volume changes MUST be reviewed against historical baselines, warmup state, audience quality, and capacity.
- Queue growth MUST be observable with age, stream, and recipient-domain dimensions.
- Critical mail MUST have defined capacity protections during bulk traffic spikes.

## MUST NOT
- MUST NOT respond to throttling by uncontrolled parallelism or provider hopping.
- MUST NOT allow queues to grow without expiry semantics for time-sensitive messages.
- MUST NOT claim a rate increase is safe without observing resulting delivery and reputation signals.

## SHOULD
- Adapt pacing by receiver where sustained evidence justifies it.
- Prefer smooth traffic over avoidable bursts.

## Exceptions
Emergency rate increases require business need, quantified risk, monitoring, stop conditions, rollback, and human approval.

## Verification
Inspect queue and throttle configuration, load tests, production rate charts, deferral responses, queue age, and receiver-specific outcomes before and after material changes.