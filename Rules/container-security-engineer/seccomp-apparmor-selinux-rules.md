# Seccomp, AppArmor, and SELinux Rules

## Purpose
Reduce container attack surface by enforcing kernel and mandatory-access-control restrictions appropriate to the workload.

## Scope
Applies to seccomp profiles, AppArmor profiles, SELinux labels and policies, and equivalent host security mechanisms.

## MUST
- Production containers MUST use platform-default syscall filtering or a stronger approved profile unless a documented incompatibility exists.
- Custom security profiles MUST be version-controlled, reviewed, and tested with representative workload behavior.
- Profile relaxations MUST identify the specific syscall, path, label, or operation being permitted and why it is necessary.
- Mandatory-access-control configuration MUST preserve intended isolation across workloads and mounted resources.

## MUST NOT
- MUST NOT set seccomp to unconfined or disable mandatory-access controls merely to resolve unexplained runtime failures.
- MUST NOT broaden a profile globally when only one workload requires an exception.
- MUST NOT assume container image hardening replaces host-level confinement.

## SHOULD
- Generate or refine profiles from observed legitimate behavior, then validate negative cases.
- Keep profile ownership with the workload or platform team that can test changes.

## Exceptions
Exceptions require failure evidence, alternative analysis, minimized scope, compensating controls, and explicit approval.

## Verification
Inspect workload manifests, effective profiles, policy files, admission controls, denied-event logs, and security tests.