# Pod Security Rules
## Purpose
Reduce workload escape, privilege escalation, and host compromise risk.
## Scope
Pod security context, capabilities, namespaces, host access, seccomp, and admission controls.
## MUST
- Run workloads as non-root where technically feasible and explicitly justify exceptions.
- Drop unnecessary Linux capabilities and use read-only root filesystems where compatible.
- Enforce appropriate Pod Security admission or equivalent policy for production namespaces.
- Treat hostNetwork, hostPID, hostIPC, privileged containers, and hostPath as high-risk capabilities requiring approval.
## MUST NOT
- Disable security controls merely to make a workload deploy.
- Grant privileged execution without documented need, scope, owner, and compensating controls.
## SHOULD
- Apply secure defaults through reusable platform policy.
## Exceptions
Exceptions require security review, least-privilege configuration, monitoring, and expiry/review date.
## Verification
Inspect rendered pod specs, admission policies, policy violations, and runtime security findings.