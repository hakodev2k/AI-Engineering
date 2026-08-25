# Kubernetes Security Hardening

## Purpose
Reduce cluster and workload attack surface using layered preventive controls.
## When to use
Cluster baselines, security reviews, new workloads, or remediation.
## Inputs
Threat model, compliance requirements, manifests, RBAC, runtime and node configuration.
## Context to inspect
Pod Security Admission, securityContext, capabilities, seccomp, host access, image provenance, RBAC, admission policies, secrets.
## Core knowledge
Defense in depth combines identity, least privilege, workload isolation, supply-chain controls, network segmentation, node hardening, and auditability.
## Procedure
1. Define trust boundaries. 2. Inventory privileged capabilities. 3. Enforce non-root and least Linux capabilities. 4. Apply seccomp and filesystem restrictions where compatible. 5. Remove host namespaces/paths unless required. 6. Review RBAC and service accounts. 7. Enforce image/admission policy. 8. Segment networks. 9. Test workload compatibility and audit violations.
## Decision points
Exceptions require explicit threat justification and compensating controls; prefer policy-as-code over manual review for repeatable invariants.
## Common failure patterns
Privileged containers by default, wildcard RBAC, automounted tokens, mutable image tags, secrets in manifests, and controls deployed without compatibility tests.
## Verification
Run policy checks, negative tests, RBAC authorization tests, image verification, and audit-log review.
## Expected output
A hardened baseline, documented exceptions, and verification evidence.
## Stop conditions
Escalate privileged exceptions, production-breaking controls, or unresolved compliance interpretation.