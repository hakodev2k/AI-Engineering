# DNS Failure to Verification Workflow

## Trigger
Dependency failures that may involve DNS resolution, stale address reuse, resolver behavior, or failover recovery.

## Entry conditions
Known environment and at least one authoritative dependency hostname or configuration location.

## Stages
1. **Context — Network Investigator:** locate hostname/config source, recent relevant changes, sanitized error evidence.
2. **Preflight — Network Investigator:** run `python scripts/dns_gate.py --policy config/policy.json --output dns-evidence.json <hosts>`.
3. **Isolation — Network Investigator:** classify DNS, routing, TLS, application, or client-refresh layer. Record facts separately from hypotheses.
4. **Plan — workflow owner:** choose smallest evidence-backed correction. Any DNS/provider/network/production config mutation becomes `approval_required`.
5. **Execute — implementation owner:** change only repository code/config inside approved scope. Never mutate production automatically.
6. **Test — implementation owner:** run project tests plus `python -m unittest tests/test_dns_gate.py`.
7. **Failover verification — Verification Agent:** follow `skills/verify-failover.md` in an approved test environment.
8. **Final gate — Verification Agent:** verify evidence, diff, tests, policy, approval state, and remaining risks.

## Checkpoints
Context complete; deterministic preflight recorded; failure layer evidenced; plan bounded; tests pass; independent verification complete.

## Retry rules
DNS lookup/transient network diagnostics: at most `config/policy.json:max_retries` retries. Build/test failures: at most two fix-test cycles, each preserving prior output. Permission, policy, certificate, or business-rule failures are not automatically retryable.

## Failure paths
Transient failures preserve evidence then retry within budget. Validation failures return to planning. Permission/environment failures stop and escalate. Unexpected production target stops immediately.

## Approval points
DNS record/resolver changes, production network/firewall/load-balancer changes, certificate changes, production configuration, security weakening, destructive action.

## Definition of Done
Authoritative hosts identified; evidence artifact generated; failure layer proven; any code/config change is minimal and reviewed; deterministic tests pass; failover behavior verified where applicable; required approvals exist; no blocking risk remains.
