# Background Execution Rules
## Purpose
Keep background work compliant with platform limits, battery constraints, and correctness requirements.
## Scope
Schedulers, background fetch, jobs, services, uploads, downloads, and deferred work.
## MUST
- Background tasks MUST be restartable or resumable when the platform can terminate them.
- Scheduling MUST respect platform quotas and declared execution modes.
- Critical deferred operations MUST persist intent before relying on background execution.
## MUST NOT
- Background execution MUST NOT be assumed to run at an exact time unless the platform guarantees it.
- Polling MUST NOT be used when a lower-cost event or push mechanism satisfies the requirement.
## SHOULD
- Work SHOULD be batched and constrained by network/power conditions when latency allows.
## Exceptions
User-visible foreground services or equivalent mechanisms may run longer when platform policy and product need justify them.
## Verification
Test termination, reboot, low-power mode, denied background privileges, scheduling delay, and duplicate execution.