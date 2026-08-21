# Integration Guide

## Goal
Insert one mandatory authorization boundary between every agent-visible tool adapter and every real effector. The boundary must be transport-agnostic: terminal, MCP, delegated subagent, browser automation, remote shell and deployment adapters all submit the same canonical operation shape.

## 1. Build the capability registry
List every adapter and map it to a stable capability vocabulary such as `filesystem.read`, `filesystem.delete_recursive`, `repository.write`, `remote.shell_destructive`, `production.deploy`, `identity.permission_grant` or `credential.rotate`. Avoid encoding transport in capability names.

Run:

```bash
python scripts/approval_boundary.py inventory --registry config/adapter-registry.example.json
```

Exit code 0 means every side-effecting adapter in the registry declares mediation. A non-zero exit code blocks onboarding.

## 2. Insert the boundary immediately before effectors
Adapters should construct a request containing actor, parent task, transport, display tool, capability, target and arguments. Call:

```bash
python scripts/approval_boundary.py decide --policy config/policy.json --request examples/request.example.json
```

Only `ALLOW` may reach the effector. `DENY` terminates the call. `REQUIRE_APPROVAL` enters the bounded approval flow.

Do not put the check only in terminal code. The check must sit at a shared host/harness layer or be called by every effector wrapper through a mandatory interface.

## 3. Handle MCP annotations safely
Use MCP annotations for UX and conservative classification only. They are hints and may come from an untrusted server. A server claiming `readOnlyHint: true` must never override a host policy that knows the capability can mutate state. Missing annotations should remain pessimistic.

## 4. Approval flow
Before waiting, confirm that the current execution mode has an answerable approval channel. Interactive UI, an approved guardian, and a configured non-interactive approval service are acceptable. A delegated subagent with no responder is not.

When the human approves, create a token:

```bash
python scripts/approval_boundary.py token --request examples/request.example.json --ttl 300
```

Attach that token to the unchanged request and run `decide` again. The token is rejected if actor, parent task, capability, target, arguments or expiry differ.

In production, replace the example development HMAC key in the reference script with a protected runtime secret or signed capability-token service. Never commit production signing material.

## 5. Adapter pattern
A minimal adapter should follow this order:

```text
model proposes call
  -> adapter normalizes request
  -> UAB decision
      -> DENY: return structured denial
      -> REQUIRE_APPROVAL: bounded approval flow -> UAB decision again
      -> ALLOW: audit pre-dispatch -> effector exactly once -> audit result
```

No alternate route may call the effector directly.

## 6. Delegated agents
Propagate parent task and actor/delegation identity into the child request. The child may propose operations but must not inherit an unbounded parent approval. If approval is required, the host must route the request to an actual responder or deny after the configured timeout.

## 7. Audit
Audit records should include timestamp, actor, parent task, transport, capability, target identifier, operation digest, decision, policy version and approval-token identifier. Do not log credentials or raw sensitive arguments; store hashes or redacted metadata.

## 8. CI verification
Run:

```bash
python -m unittest tests/test_approval_boundary.py
```

Add a contract case whenever an adapter is introduced. The highest-value regression assertion is route equivalence: the same destructive capability and arguments routed through terminal, MCP and delegated execution must all produce the same approval decision.

## 9. Migration sequence
1. Inventory without changing behavior.
2. Add UAB in observe-only mode only in a non-production test environment.
3. Compare UAB classifications to existing prompts/denials.
4. Fix capability mappings.
5. Enable fail-closed enforcement for high-risk routes first.
6. Expand to all side-effecting adapters.
7. Remove adapter-local authorization only after equivalent or stricter central coverage is verified.

## 10. Rollback
Rollback must never mean bypassing authorization. If the UAB service fails, disable affected mutable tools or restore the previous stricter adapter gate. Keep read-only tools only when their classification is independently trusted.
