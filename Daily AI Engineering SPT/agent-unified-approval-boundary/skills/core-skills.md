# Core Skills

## Skill 1 — Map capability paths
**Purpose:** find every adapter that can cause an external or mutable side effect.
**Trigger:** adding a tool, MCP server, subagent executor, remote shell, deployment action, filesystem writer, or approval feature.
**Inputs:** adapter registry, tool schemas, source paths, permission config, transport metadata.
**Preconditions:** repository can be inspected; execution paths are identifiable.
**Required context:** tool name, adapter, underlying effect, actor, target, trust source.
**Tools:** static search, call-graph inspection, `scripts/approval_boundary.py inventory`.
**Procedure:** enumerate adapters → classify underlying capability → identify direct dispatch sites → verify each site calls the UAB → record uncovered routes → block release while uncovered side-effecting routes remain.
**Decisions:** treat unknown capability as high risk; do not infer safety from tool name alone.
**Constraints:** no production calls during inventory.
**Expected output:** route-to-capability inventory with coverage status.
**Metrics:** side-effect adapter coverage; uncovered dispatch count.
**Verification:** contract test must fail when an adapter is registered without UAB mediation.
**Failure handling:** if a path cannot be classified, mark `unknown` and deny by default.
**Stop condition:** all discovered side-effecting paths are mediated or explicitly disabled.

## Skill 2 — Canonicalize and authorize operations
**Purpose:** make route-equivalent operations receive route-equivalent security decisions.
**Trigger:** immediately before dispatch of any mutable/open-world capability.
**Inputs:** actor, parent task, transport, tool, capability, target, arguments, annotations.
**Preconditions:** arguments are available before execution.
**Required context:** trusted policy, current approval token if any.
**Tools:** `scripts/approval_boundary.py decide`.
**Procedure:** normalize capability and target → canonicalize arguments → hash canonical arguments → classify risk → ignore untrusted optimistic annotations → evaluate policy → validate approval token binding/TTL → return ALLOW, DENY, or REQUIRE_APPROVAL.
**Decisions:** security policy outranks adapter defaults and model suggestions.
**Constraints:** no dispatch occurs before ALLOW.
**Expected output:** signed/structured decision record containing operation digest and reason.
**Metrics:** decision latency, route-equivalence rate, deny/request counts.
**Verification:** same canonical operation through terminal/MCP/delegated transports yields the same decision.
**Failure handling:** malformed input or policy error = DENY.
**Stop condition:** deterministic decision returned.

## Skill 3 — Issue bounded approvals
**Purpose:** obtain human consent without accidental broad reuse or indefinite waits.
**Trigger:** UAB returns REQUIRE_APPROVAL.
**Inputs:** canonical operation, risk, reason, actor, parent task.
**Preconditions:** an answerable approval channel is registered.
**Required context:** exact capability, target, effect summary and expiry.
**Tools:** host UI/guardian plus `scripts/approval_boundary.py token`.
**Procedure:** prove approval route is answerable → present exact operation → await at most configured timeout → on approve mint token bound to actor/task/capability/target/argument hash/expiry → re-run decision → dispatch once.
**Decisions:** absence of responder is not approval.
**Constraints:** no wildcard token for destructive capabilities; no unlimited waits.
**Expected output:** scoped token or terminal denial/timeout.
**Metrics:** approval latency, timeout rate, token-reuse rejection rate.
**Verification:** modified arguments invalidate prior approval.
**Failure handling:** timeout, channel loss, malformed response = DENY.
**Stop condition:** approved and validated, or denied/timed out.

## Skill 4 — Verify non-bypass
**Purpose:** prove policy cannot be avoided by switching route.
**Trigger:** CI, tool-registry change, permission-policy change, release candidate.
**Inputs:** adapter inventory and attack cases.
**Preconditions:** test harness uses fake effectors.
**Required context:** expected capability decisions.
**Tools:** `tests/test_approval_boundary.py`.
**Procedure:** replay identical destructive intent through each registered transport → assert all hit boundary → assert no fake effector executes before ALLOW → test missing annotations, false read-only annotations, delegated no-responder path, stale token and argument mutation → compare audit decisions.
**Decisions:** any bypass is release-blocking.
**Constraints:** tests must not perform real destructive operations.
**Expected output:** pass/fail evidence and coverage report.
**Metrics:** bypass count, mediated-route percentage, max approval wait.
**Verification:** independent verifier reviews test evidence.
**Failure handling:** preserve logs and block release.
**Stop condition:** zero bypasses and all invariants pass.
