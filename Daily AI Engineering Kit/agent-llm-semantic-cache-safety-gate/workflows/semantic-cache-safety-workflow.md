# Workflow: Semantic Cache Safety Gate

## Trigger
Adding/changing semantic caching, changing LLM behavior-affecting context, or investigating an unsafe/stale cache hit.

## Entry conditions
Repository and representative synthetic requests are available; production mutation is unnecessary.

## Inputs
Acceptance criteria, LLM path, authorization/tenant model, system/model/tool/schema versions, cache policy, tests.

## Stages
1. **Context — Cache Explorer:** trace request → policy → cache → LLM → response. Produce evidence and isolation dimensions.
2. **Plan — Cache Implementer:** map each dimension to exact partition, bypass, TTL, or invalidation; define tests before edits.
3. **Approval checkpoint:** stop for any proposal that weakens tenant/auth isolation, caches side effects/sensitive data, or materially broadens production eligibility.
4. **Execute — Cache Implementer:** make the smallest safe change and preserve fail-closed behavior.
5. **Test — Cache Implementer:** run existing relevant tests plus `python tests/run_tests.py` and `python scripts/verify_package.py` where the kit is installed.
6. **Independent review — Cache Verifier:** inspect diff and create adversarial near-match cases.
7. **Verify — Cache Verifier:** confirm hit/miss/bypass evidence and Definition of Done.

## Checkpoints
Context complete before edits; approval before dangerous broadening; tests before verifier handoff; verifier independent of implementation conclusion.

## Retry rules
Transient tool/process failure: maximum 2 retries with command/error evidence preserved. Test or validation failure: maximum 1 remediation cycle, then rerun full relevant verification. Authorization/policy violation: no retry; stop and escalate.

## Failure paths
Missing context → `blocked`; unsafe candidate hit → `rejected`; repeated environment/tool failure → `blocked`; failed tests after remediation → `rejected`.

## Produced artifacts
Implementation diff, updated tests/policy as needed, cache decision evidence, verification result and residual-risk notes.

## Definition of Done
Required context is evidenced; all cacheable paths are read-only and allowlisted; isolation dimensions match policy; sensitive/mutation/tool requests bypass; adversarial tests pass; existing relevant tests pass; package verification passes; approvals are recorded where required; no blocking risk remains.
