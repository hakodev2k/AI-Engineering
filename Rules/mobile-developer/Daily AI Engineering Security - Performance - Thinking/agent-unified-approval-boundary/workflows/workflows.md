# Workflows

## Workflow A — Boundary rollout
**Trigger:** existing agent has more than one execution transport or is adding MCP/subagents.
**Goal:** centralize authorization without weakening current restrictions.
**Inputs:** tool registry, adapters, policy, test suite.
**Baseline:** count side-effecting adapters, approval prompts, bypassable routes, approval hangs and audit coverage.
**Context:** actor identity, parent task, capability vocabulary, target semantics.
**Stages:**
1. **Observe** — Capability Mapper inventories every dispatch path.
2. **Classify** — map route-specific tools to canonical capabilities.
3. **Hypothesize** — identify routes that currently bypass or cannot answer approvals.
4. **Implement** — Boundary Implementer inserts UAB immediately before effectors.
5. **Exercise** — run fake-effect route-equivalence tests.
6. **Measure** — compare mediation coverage, unauthorized effects and approval latency.
7. **Verify** — Adversarial Verifier independently attacks boundary.
8. **Release** — Release Owner approves only with all invariants passing.
**Responsible agents:** Mapper → Implementer → Verifier → Release Owner.
**Tools:** source search, `scripts/approval_boundary.py`, unit/contract tests.
**Outputs:** inventory, implementation, test report, release decision.
**Checkpoints:** after inventory; before wiring real effectors; after adversarial tests.
**Metrics:** mediated routes %, bypass count, unanswered approval count, p95 approval latency.
**Retry policy:** maximum 2 implementation/test cycles per failing invariant.
**Stop conditions:** zero bypasses and 100% side-effect route mediation, or BLOCK after two failed repair cycles.
**Failure path:** disable affected adapter or restore previous stricter policy; never fail open.
**Verification:** independent transport-equivalence and token-binding tests.
**Definition of Done:** all side-effect adapters mediated, no unauthorized fake effects, bounded approvals, audit coverage complete.

## Workflow B — Runtime authorization
**Trigger:** any tool call capable of mutable or external effect.
**Goal:** ensure operation is authorized regardless of transport.
**Inputs:** actor, parent task, transport, capability, target, arguments, annotations, optional approval token.
**Baseline:** none; this is the mandatory runtime path.
**Stages:** canonicalize → hash arguments → classify risk → evaluate deterministic policy → validate token or request approval → re-evaluate → audit → dispatch once.
**Responsible agent:** host/harness, not the model.
**Tools:** UAB script/library plus configured approval channel.
**Outputs:** ALLOW/DENY/REQUIRE_APPROVAL and audit event.
**Checkpoints:** pre-approval and immediately pre-dispatch.
**Metrics:** decision latency, request frequency, timeout frequency.
**Retry policy:** at most 1 approval-channel retry; no automatic retry of denied destructive operation.
**Stop conditions:** ALLOW then exactly one dispatch, or DENY/TIMEOUT.
**Failure path:** fail closed and return structured reason.
**Verification:** operation digest logged and matches approved token.
**Definition of Done:** no effector invocation occurred before an ALLOW decision.

## Workflow C — New adapter onboarding
**Trigger:** new MCP server, shell wrapper, code executor, browser writer, deployment/identity connector, subagent executor.
**Goal:** prevent new bypass routes.
**Inputs:** adapter definition, capabilities, target model, trust level.
**Stages:** register → classify → add mediation assertion → add route-equivalence case → run suite → verifier review.
**Responsible agents:** Mapper + Verifier.
**Outputs:** registration record and CI evidence.
**Retry policy:** maximum 2 fixes.
**Stop condition:** adapter has explicit mediation and tests, otherwise adapter remains disabled.
**Failure path:** quarantine/unregister adapter.
**Verification:** CI fails if fake effector is reachable without UAB.
**Definition of Done:** onboarding test proves expected decisions for allow, deny, approval and timeout cases.
