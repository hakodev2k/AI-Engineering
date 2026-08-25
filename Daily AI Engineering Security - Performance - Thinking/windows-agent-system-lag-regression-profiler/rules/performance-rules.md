# Windows System-Lag Performance Rules

- A regression claim **MUST** include a baseline captured on the same machine and comparable workload state.
- The collector **MUST NOT** terminate, suspend, inject into, or modify target processes.
- A single Task Manager screenshot **MUST NOT** be treated as sufficient root-cause evidence.
- CPU, memory, I/O, handles, threads, and input-stall evidence **SHOULD** be considered separately.
- Correlation **MUST NOT** be promoted to subsystem causation without a discriminating A/B test or deeper trace.
- Feature-disable or app-exit A/B tests **MUST** preserve user data and **MUST NOT** weaken security controls.
- Performance improvement **MUST** be measured again using the same sampling interval and scenario duration.
- Retries **MUST** be bounded to three hypothesis tests and two implementation attempts.
- Diagnostic collection **MUST NOT** capture command lines, environment variables, file contents, or secrets by default.
