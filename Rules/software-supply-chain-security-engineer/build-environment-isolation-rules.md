# Build Environment Isolation Rules

## Purpose
Limit cross-build contamination, persistence, and credential theft in build infrastructure.

## Scope
Hosted runners, self-hosted runners, build agents, containers, virtual machines, caches, and network access.

## MUST
- Privileged release builds MUST execute in environments isolated from untrusted workloads.
- Build environments MUST be reset, recreated, or otherwise proven clean between trust domains.
- Network access from build jobs MUST be limited to required destinations where practical.
- Persistent caches MUST exclude secrets and be keyed to prevent unsafe cross-project reuse.
- Administrative access to build infrastructure MUST be restricted and auditable.

## MUST NOT
- MUST NOT run untrusted pull-request code on persistent privileged runners with reusable credentials.
- MUST NOT assume process-level isolation is sufficient when workloads can access shared host state.
- MUST NOT retain sensitive workspace data longer than operationally required.

## SHOULD
- Ephemeral build workers SHOULD be the default for high-value release pipelines.
- Egress policy SHOULD constrain package and artifact retrieval to approved endpoints.

## Exceptions
Exceptions require documented isolation limitations, threat assessment, compensating controls, monitoring, and expiry.

## Verification
Inspect runner lifecycle, network policy, cache design, host permissions, workspace cleanup, credential access, and job-placement rules.