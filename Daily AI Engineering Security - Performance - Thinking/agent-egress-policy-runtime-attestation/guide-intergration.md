# Integration Guide

## 1. Add the package
Copy this topic directory into the agent/orchestrator repository or reference it from a shared engineering package. Python 3.10+ is sufficient; the runtime script uses only the standard library.

## 2. Create an explicit policy
Copy `config/policy.example.json` to a deployment-specific path such as `config/policy.json`.

Define two sets:
- `allow`: endpoints the task requires and that must be reachable;
- `deny`: approved harmless control endpoints that must not be reachable under the intended restriction.

Keep probes small, credential-free, and representative. Prefer endpoints your organization owns for deny controls. Set short timeouts and a bounded `max_probes`.

## 3. Run inside the actual agent execution boundary
The important requirement is location: execute the attestor from the same sandbox/container/VM/process-network boundary used by shell and tool calls.

```bash
python scripts/egress_attest.py config/policy.json --output .agent/egress-attestation.json
```

Exit codes:
- `0`: observed reachability matches policy;
- `2`: policy mismatch;
- `3`: invalid policy;
- `4`: runtime/output failure.

An HTTP 4xx/5xx still proves network reachability. Redirects are intentionally not followed, because following them could probe an undeclared destination.

## 4. Bind attestation to runtime identity
The script hashes policy content, but the host must additionally bind the report to its runtime/session/container identity. Store this metadata beside the report, for example:

```json
{
  "runtime_id": "sandbox-123",
  "task_id": "task-456",
  "created_at": "2026-08-21T05:00:00+07:00",
  "attestation_report": ".agent/egress-attestation.json"
}
```

Never reuse verification when either policy SHA-256 or runtime identity changes.

## 5. Integrate lifecycle hooks
Use `hooks/hooks.md` to wire these events:
- pre-task network validation;
- policy-change invalidation;
- pre-sensitive-network-action freshness check;
- post-remediation verification;
- final security gate.

For systems without native hooks, run the command in a wrapper before invoking network-capable agent work.

## 6. Handle mismatches
### Over-permissive
A `deny` target is reachable. Stop sensitive automation. Check whether the active execution path bypasses the intended proxy/sandbox or whether a task retained stale policy. Do not widen or disable controls.

### Over-restrictive
An `allow` target is unreachable. Check runtime policy refresh, DNS, TLS, proxy routing, and transitive domains. Add a domain only after evidence shows it is legitimately required and approval exists.

### Indeterminate
Runtime identity, policy source, or probes cannot be trusted. Do not label the environment verified.

## 7. Verification workflow
After remediation, run the full matrix again. Do not test only the endpoint that originally failed. The independent verifier should check:
1. current policy hash;
2. correct runtime identity;
3. zero over-permissive results;
4. zero over-restrictive results;
5. no wildcard/bypass introduced;
6. remediation count within bounds.

## 8. CI example
A CI job can run the unit tests without external network dependencies:

```bash
python -m unittest tests/test_egress_attest.py -v
```

Runtime attestation itself should run only in the environment whose egress controls are being validated.

## 9. Customization
You may extend the manifest with organization metadata or freshness TTL, but preserve these invariants: explicit destinations, bounded probes, no credentials, no redirects, deny controls, policy hash, runtime binding, and no automatic permission expansion.
