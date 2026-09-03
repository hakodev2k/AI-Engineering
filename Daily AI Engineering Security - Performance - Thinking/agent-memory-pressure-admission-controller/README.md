# Agent Memory Pressure Admission Controller

## Topic
Prevent agent runtimes from spawning memory-heavy work when projected host headroom is unsafe.

## Category
Performance

## Problem
Agent systems may detect low memory yet still launch workers, or may create many heavy child processes without hard backpressure. The resulting page thrash, swap storms, UI hangs, process crashes, and host reboots destroy useful throughput.

## Evidence
See `evidence/research.md`. Fresh August 2026 reports include Claude Code #90208, where a low-memory guard logs as little as 36 MB free but still launches an approximately 300 MB worker, and OpenAI Codex #38877/#38720, which report severe process/resource amplification and host instability.

## Existing approach
OS OOM handling, swap/pagefile, fixed worker-count limits, cleanup of settled workers, soft low-memory warnings, and container memory limits.

## Existing limitations
These controls react after unsafe work is admitted or use proxies that do not reflect projected post-spawn memory. Fixed concurrency ignores worker-size variation; asynchronous cleanup may not finish before spawn; cross-platform `free` memory semantics differ.

## Proposed improvement
Make memory headroom a hard pre-spawn admission invariant. Estimate the child working set, preserve an explicit host reserve, block unsafe projected utilization, and only retry after awaited reclamation plus remeasurement.

## Architecture
```text
host measurements + worker estimate + policy
                  |
                  v
scripts/memory_admission_guard.py
             /          \
          ADMIT          BLOCK
            |              |
          spawn       queue/reclaim
            |              |
            +--> measure <--+
                    |
          independent verifier
```

## Actual package tree
```text
README.md
evidence/research.md
config/admission-policy.example.json
scripts/memory_admission_guard.py
tests/test_memory_admission_guard.py
skills/memory-pressure-baseline.md
rules/resource-admission.md
subagents/performance-verifier.md
workflows/measure-admit-verify.md
hooks/pre-spawn-memory-gate.md
```

## Installation
Python 3.10+; standard library only. Linux can auto-read `/proc/meminfo`. Other platforms should pass total and available bytes from a trusted platform-native measurement source.

## Configuration
Copy `config/admission-policy.example.json` and tune values from measured representative worker footprints. Do not lower reserves merely to admit more work.

## Usage
Linux current-host check:
```bash
python scripts/memory_admission_guard.py --policy config/admission-policy.example.json --json
```

Cross-platform explicit snapshot:
```bash
python scripts/memory_admission_guard.py --policy config/admission-policy.example.json --total-bytes 17179869184 --available-bytes 8589934592 --json
```

Tests:
```bash
python -m unittest tests/test_memory_admission_guard.py
```

## Workflow
Use `workflows/measure-admit-verify.md`: Measure baseline -> diagnose -> hypothesize thresholds -> gate spawn -> measure again -> bounded tuning -> independent verification.

## Metrics
- Available and projected post-spawn memory.
- Projected and observed memory utilization.
- Memory-pressure/swap/pagefile activity.
- Unsafe spawn attempts blocked.
- Worker crash/restart count.
- UI/host responsiveness.
- Task throughput and latency.
- False-block rate.

## Verification
The verifier must test both sides of the decision boundary: a known unsafe snapshot must BLOCK and a representative safe snapshot must ADMIT. Before/after host-pressure and throughput metrics are required before claiming performance improvement.

### Implemented
The package supplies a deterministic admission script, policy, rules, hook, tests, workflow, measurement skill, and independent verifier role.

### Measured
A host/runtime is measured only after representative worker footprint and pre/post-spawn resource metrics are collected.

### Verified
A deployment is verified only when independent review confirms unsafe spawns are blocked, safe work still runs, tests pass, and pressure/throughput regression evidence is acceptable.

## Safety
Do not perform stress-to-OOM tests on production or shared developer machines. Do not kill unrelated processes for headroom. Do not disable reserves or admission checks to hide inability to run the workload.

## Failure handling
Detection: BLOCK decision, memory-pressure threshold breach, unexpected post-spawn headroom, crash/restart, or throughput regression. Evidence: guard output plus platform metrics. Retry: await eligible reclamation and retry at most once by default; workflow tuning is limited to two iterations. Fallback: queue work, reduce concurrency/worker size, or move to a larger host. Escalation: runtime/performance owner. Stop condition: verified safe admission or explicit classification that the target host cannot safely run the workload.

## Definition of Done
Evidence documented; baseline captured; current limitations identified; worker estimate justified; hard admission implemented; tests pass; before/after metrics collected; unsafe fixture blocks; safe fixture admits; resource pressure does not regress; throughput impact is measured; independent verification complete; no blocking issue remains.

## Customization
Add platform-specific pressure signals, per-worker risk tiers, dynamic p95 footprint estimates, queue priority, cgroup/job-object limits, or PSI thresholds. Keep the final spawn decision deterministic, observable, bounded, and fail-safe when required measurements are invalid.
