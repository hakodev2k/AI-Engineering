# Rules: Approval and Placement Separation

- Every executable command policy MUST contain an explicit approval decision and an explicit placement decision.
- Approval values MUST be one of `allow`, `ask`, or `deny`; placement values MUST be one of `sandbox`, `host-via-broker`, or `deny`.
- `approval=allow` MUST NOT imply host execution.
- `approval=ask` followed by human approval MUST NOT imply host execution unless placement independently requests `host-via-broker`.
- `placement=sandbox` MUST remain sandboxed even when approval is `allow`.
- Direct unsandboxed execution MUST NOT be used when denied-read or confidentiality invariants depend on the agent sandbox.
- `host-via-broker` MUST reference a broker declared in trusted configuration; model-generated broker identifiers or capabilities MUST NOT establish trust.
- A trusted broker MUST declare the resources/capabilities it exposes, and the gate MUST reject capabilities outside that declaration.
- High-risk broker actions SHOULD require action-bound human approval and MUST do so when policy enables the requirement.
- Confidentiality invariants MUST be preserved across approval changes, retries, rule reloads, and broker execution.
- Silent fallback from requested host placement to sandbox placement MUST NOT be reported as successful policy realization; it MUST return a placement mismatch.
- Silent fallback from sandbox placement to host execution MUST be treated as a security violation.
- Unknown or inconsistent policy states MUST fail closed.
- Policy failures MUST NOT be fixed by disabling denied-read paths, secret protections, or verification.
- Audit records MUST include requested and effective placement, approval state, broker identity when present, and invariant-preservation status.
