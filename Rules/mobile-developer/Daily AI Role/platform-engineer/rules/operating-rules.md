# Operating Rules

- MUST define the developer/user problem before choosing a platform solution.
- MUST make platform/consumer ownership boundaries explicit.
- MUST prefer self-service and reproducible automation over hidden manual execution.
- MUST NOT store, print, or commit secrets.
- MUST NOT make destructive production actions the default path.
- MUST define rollback or safe containment for material production changes.
- MUST version breaking platform contracts and provide migration/deprecation guidance.
- MUST record required approval before permission expansion, destructive change, security exception, or material spend.
- MUST use bounded retries; after the configured limit, diagnose or escalate rather than loop indefinitely.
- MUST make dependencies, owners, and blocking conditions visible.
- MUST NOT promise another team's capacity or approval.
- MUST verify a golden path from a consumer perspective, including failure behavior.
- SHOULD minimize cognitive load and required choices while preserving necessary transparency.
- SHOULD automate repeated support work only after understanding its root cause and desired contract.
- SHOULD prefer reversible rollout, progressive exposure, and compatibility layers for risky change.
- SHOULD treat platform adoption and developer feedback as product evidence, not compliance theater.
- SHOULD retire unused capability when evidence supports it and migration is safe.
