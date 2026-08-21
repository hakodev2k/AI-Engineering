# Test Flakiness Gate Rules

## MUST
- Preserve the first failing test output before any rerun.
- Treat a test as `flaky` only when the same test both passes and fails under materially equivalent inputs within the bounded probe.
- Keep the original failure visible even when a later rerun passes.
- Stop after `max_probe_runs` from `config/flake-gate.json`.
- Record each run's exit code, duration, command, and evidence path.
- Require explicit human approval before adding, widening, or extending any quarantine/skip/ignore mechanism.
- Distinguish product-code failures, test-infrastructure failures, and tool/environment failures.
- Re-run only the narrowest reproducible test target before escalating to a wider suite.

## MUST NOT
- Do not mark a failing test as flaky because a single rerun passes unless at least one pass and one failure are preserved as evidence.
- Do not delete, disable, skip, mute, quarantine, or weaken assertions automatically.
- Do not retry until green.
- Do not modify production code solely to make a suspected flaky test pass without an independently supported defect hypothesis.
- Do not hide failures from CI output or convert failures into success exit codes.
- Do not change test ordering, parallelism, timeouts, clocks, or random seeds without recording the change as an experiment.
- Do not access production systems or production data during probes.

## SHOULD
- Reproduce with a fixed seed and stable environment when supported.
- Capture timing, concurrency, network, filesystem, and shared-state evidence for nondeterministic failures.
- Prefer fixing the root cause over quarantine.
- Keep quarantine temporary, owner-assigned, and linked to evidence.
