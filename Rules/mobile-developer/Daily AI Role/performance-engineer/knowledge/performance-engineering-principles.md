# Performance Engineering Principles

- Optimize the user-critical path, not arbitrary hot code.
- Throughput, latency, concurrency, saturation, and errors are coupled; inspect them together.
- Tail latency matters for distributed systems because fan-out amplifies slow components.
- Saturation often causes non-linear degradation; find the knee before production reaches it.
- Queueing can hide overload temporarily while making latency explode.
- Caches change workload shape; benchmark warm and cold behavior when both matter.
- Allocation and GC can be latency mechanisms even when CPU appears acceptable.
- Database and downstream latency must be decomposed from application time.
- A faster microbenchmark does not guarantee a faster user journey.
- Reproducibility and controlled comparison are more valuable than one impressive number.
- Negative results prevent repeated waste and should be preserved.