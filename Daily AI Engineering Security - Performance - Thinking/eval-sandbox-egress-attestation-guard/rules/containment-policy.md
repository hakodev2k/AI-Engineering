# Containment Policy

- An evaluation runner **MUST** fail closed when effective egress state cannot be attested.
- A declared sandbox or `internet=false` flag **MUST NOT** be accepted as proof of containment.
- Every observed destination **MUST** be classified as approved internal, approved proxy, loopback/link-local, or forbidden external.
- Unclassified destinations **MUST** be treated as forbidden.
- Proxy and package-cache endpoints **MUST** be modeled as trust-boundary crossings and explicitly allowlisted.
- Raw cloud credentials, production credentials and unrelated user tokens **MUST NOT** be mounted into an untrusted evaluation sandbox.
- Policy changes, proxy changes, DNS changes, credential mounts, sandbox restarts and network-namespace changes **MUST** invalidate prior attestation.
- High-risk evaluation phases **MUST** require a fresh attestation artifact.
- The implementation **MUST NOT** probe arbitrary public systems to test containment; validation uses supplied telemetry or operator-approved canary endpoints.
- An egress-policy failure **MUST** block execution rather than silently downgrade the evaluation.
- Incident evidence **SHOULD** preserve timestamps, destination, transport, decision and policy version without recording secrets.
- Dangerous or irreversible remediation **MUST** require explicit human approval.
