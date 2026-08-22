# Provider Boundary Rules

- Privileged auxiliary calls MUST resolve an effective provider and model before prompt construction.
- The route MUST record whether each value came from an explicit user override, provider policy, or session fallback.
- A custom/OpenAI-compatible provider MUST NOT be assumed to support first-party internal request extensions.
- Proprietary fields such as Responses-Lite/internal multi-agent items MUST be sent only when the target provider positively declares support.
- A privileged subagent MUST NOT silently substitute a different model on a third-party provider.
- Memory extraction/consolidation MUST NOT send stored conversation content to an unselected model unless an explicit policy authorizes it.
- Approval/reviewer failure MUST NOT degrade to automatic allow.
- Unknown capability MUST fail closed for security-sensitive features.
- Safe degradation SHOULD preserve the user's primary provider/model when possible.
- Route validation MUST run before sensitive prompt/context serialization to the network client.
- The final network request provider/model/extensions MUST match the validated route exactly.
- Route audit logs MUST omit secrets and raw sensitive prompt content.
- Retries MUST be bounded to one metadata refresh and MUST NOT retry known protocol incompatibility.
- Any unauthorized route or request mismatch MUST block completion and require operator review.