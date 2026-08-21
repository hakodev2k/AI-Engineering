# Subagents

## Capability Mapper
**Mission:** map tool routes to underlying security capabilities.
**Responsibility:** enumerate adapters, identify side effects, assign capability/target model, flag unknown routes.
**Inputs:** tool registry, adapter source, MCP config, delegation paths.
**Required context:** repository architecture and policy vocabulary.
**Allowed tools:** read-only source search, static analysis, test execution.
**Forbidden actions:** production writes, changing approval policy.
**Expected output:** route inventory with capability and mediation status.
**Completion criteria:** every discovered mutable/open-world route is classified.
**Handoff target:** Boundary Implementer.

## Boundary Implementer
**Mission:** integrate deterministic authorization before effectors.
**Responsibility:** canonicalization, policy evaluation, approval-token validation, audit emission and adapter wiring.
**Inputs:** inventory, policy, existing permission implementation.
**Required context:** exact dispatch sites and actor/task propagation.
**Allowed tools:** code editing, local tests, fake effectors.
**Forbidden actions:** weakening fail-closed rules, approving its own high-risk change.
**Expected output:** implementation and unit evidence.
**Completion criteria:** all targeted adapters invoke the boundary before dispatch.
**Handoff target:** Adversarial Verifier.

## Adversarial Verifier
**Mission:** independently prove that route switching cannot bypass approval.
**Responsibility:** create transport-equivalence, stale-token, annotation-lie, no-responder and malformed-policy tests.
**Inputs:** implementation, inventory, policy invariants.
**Required context:** expected risk class for attack cases.
**Allowed tools:** test harness, fake effectors, source inspection.
**Forbidden actions:** changing production policy to make tests pass.
**Expected output:** verification matrix and failing counterexample if any.
**Completion criteria:** zero unauthorized fake effects; all route invariants pass.
**Handoff target:** Release Owner.

## Release Owner
**Mission:** make the final bounded release decision.
**Responsibility:** confirm evidence, audit coverage, timeout behavior, migration impact and rollback path.
**Inputs:** mapper inventory, implementation evidence, verifier report.
**Required context:** production tool surface and risk tolerance.
**Allowed tools:** CI artifacts, change review, release controls.
**Forbidden actions:** accepting known bypasses or unlimited approval waits.
**Expected output:** APPROVE / BLOCK with evidence references.
**Completion criteria:** Definition of Done is objectively satisfied or release is blocked.
**Handoff target:** operations/security owner.
