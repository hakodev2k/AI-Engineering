# Lab Testing Rules

## Purpose
Make synthetic performance testing reproducible, comparable, and diagnostically useful.

## Scope
Applies to local profiling, CI tests, synthetic monitoring, browser automation, device emulation, and controlled benchmarks.

## MUST
- Fix or record browser version, device profile, network conditions, cache state, test route, and data state for comparisons.
- Run enough repetitions to detect noise and report representative statistics rather than cherry-picked runs.
- Separate cold-cache and warm-cache scenarios when both matter to users.
- Preserve traces or equivalent diagnostic artifacts for material regressions.

## MUST NOT
- Compare tests with materially different environments as if they were equivalent.
- Use a single run to substantiate a performance improvement.
- Tune the test harness to hide production-relevant work.

## SHOULD
- Automate stable critical-path scenarios in CI.
- Use real devices for risks that emulation cannot represent accurately.

## Exceptions
A non-standard test setup requires documented rationale, limitations, and review of whether conclusions remain valid.

## Verification
Review test configuration, run variance, browser traces, raw measurements, environment metadata, and CI history.