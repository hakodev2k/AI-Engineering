# MCP Tool Scope Capability Firewall

**Category:** Security

## Problem
MCP tools may expose broad string parameters such as repository owner/name, branch, URL, or filesystem path. If an agent consumes untrusted content, prompt injection can steer those parameters outside the user's intended scope even though the underlying token technically has permission. Authentication alone therefore does not enforce task-level authorization.

## Evidence
Public MCP server issues #3751 and #3752 report this class for GitHub `push_files` and filesystem path tools. The current MCP authorization security guidance separately documents confused-deputy risks and the need for explicit authorization boundaries. See `evidence/research.md`.

## Existing approach
Rely on the connected credential, prompt instructions, filesystem roots, tool descriptions, human review, or service-side authorization.

## Existing limitations
A credential can validly access more resources than a particular task should touch. Prompt instructions are non-deterministic controls. Generic path validation may miss symlink/canonicalization issues, and repository/branch parameters can cross intended boundaries without being malformed.

## Proposed improvement
Place a deterministic policy firewall immediately before tool invocation. It evaluates normalized target attributes against an explicit capability envelope: allowed tools, repository/resource scopes, branches, path roots, URL hosts, operation class, and approval requirements. Deny is the default for unknown scope.

## Package tree
- `evidence/research.md` — current evidence and root cause
- `config/policy.json` — example least-privilege scope policy
- `skills/enforce-mcp-tool-scope.md` — reusable enforcement procedure
- `rules/mcp-scope-security-rules.md` — enforceable requirements
- `subagents/security-verifier.md` — independent security verifier
- `workflows/scope-and-verify.md` — bounded rollout workflow
- `hooks/pre-tool-invocation.md` — blocking hook contract
- `scripts/scope_firewall.py` — deterministic policy evaluator
- `tests/test_scope_firewall.py` — executable tests

## Installation
Python 3.10+; standard library only.

## Usage
```bash
python scripts/scope_firewall.py request.json --policy config/policy.json
python -m unittest tests/test_scope_firewall.py
```

## Request shape
`{"tool":"github.push_files","operation":"write","target":{"repo":"acme/app","branch":"feature/x"},"approval":false}`

## Workflow
Observe → inventory credentials and tools → measure current effective scope → define task capability envelope → run shadow evaluation → attack-test prompt-injected targets → enforce → independently verify.

## Metrics
- percent of tool calls with explicit scope decision
- denied out-of-scope attempts
- false deny rate on approved fixtures
- high-impact calls requiring approval
- policy coverage by tool
- security regression test pass rate

## Safety
The firewall only reduces effective authority; it never grants capabilities. Service-side auth, sandboxing, filesystem restrictions, idempotency, and human approval remain required where applicable.

## Failure handling
Invalid/unknown scope fails closed. A denied request may be retried once only after a new user-approved capability envelope or corrected normalized target. Repeated denial escalates; the agent must not broaden policy itself.

## Definition of Done
Implemented: firewall, policy, rules, hook, workflow and tests exist. Measured: current effective scope and denied attack fixtures are recorded. Verified: traversal, cross-repository, disallowed branch/host, and approval-required cases are blocked while approved fixtures pass, and an independent reviewer verifies no permission boundary was weakened.
