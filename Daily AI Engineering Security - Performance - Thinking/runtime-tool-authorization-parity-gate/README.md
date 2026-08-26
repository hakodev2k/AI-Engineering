# Runtime Tool Authorization Parity Gate

**Category:** Security

## Problem
A request-scoped tool list can look restrictive to the model while the dispatcher still resolves and executes a broader globally registered tool. That creates authorization drift between advertised capability and runtime capability.

## Evidence
Spring's August 20, 2026 CVE-2026-59318 documents this exact class in Spring AI. OWASP and Microsoft guidance independently require per-tool runtime authorization, least privilege, and fail-closed execution controls. See `evidence/research.md`.

## Existing approach
Upgrade vulnerable frameworks, minimize tool registration, use per-request tool lists, approval prompts, and authorization middleware.

## Existing limitations
Visibility is not authorization; global resolver fallbacks and context drift can bypass request-scoped intent unless execution performs a deterministic check.

## Proposed improvement
Insert a pre-dispatch parity gate that requires the requested tool to belong to the exact request-scoped set, validates global policy and context binding, and requires configured approval for high-risk tools.

## Architecture
```text
runtime-tool-authorization-parity-gate/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-dispatch.md
├── rules/authorization-boundary.md
├── scripts/authorization_parity_gate.py
├── skills/runtime-authorization-analysis.md
├── subagents/security-verifier.md
├── tests/test_authorization_parity_gate.py
└── workflows/
    ├── diagnose-and-remediate.md
    └── regression-verification.md
```

## Installation
Python 3.10+; no third-party packages required.

## Configuration
Edit `config/policy.json` to define globally allowed tools, high-risk tools, and approval requirements. Keep request-scoped advertised tools in the runtime event rather than expanding the global policy dynamically.

## Usage
`python scripts/authorization_parity_gate.py --event event.json --policy config/policy.json`

Expected event fields: `request_id`, `advertised_tools`, `requested_tool`, `authorization_context_hash`, `dispatch_context_hash`; add `human_approved` when required.

## Workflow
Use `workflows/diagnose-and-remediate.md` for a discovered mismatch and `workflows/regression-verification.md` for every resolver/framework change. Integrate `hooks/pre-dispatch.md` immediately before tool invocation.

## Metrics
Unauthorized-dispatch rate; context-mismatch allow rate; high-risk approval coverage; parity-regression count.

## Verification
Run `python -m unittest tests/test_authorization_parity_gate.py`. Direct dispatcher tests are required; model behavior alone is not proof of authorization.

## Safety
The gate fails closed. Tests should use inert fixtures. Do not place secrets in events, policy files, logs, or tests. High-impact actions require explicit approval when configured.

## Failure handling
Detection: non-zero gate exit or regression-test failure. Evidence: request ID and reason codes. Retry policy: at most two diagnosis revisions; regression rerun at most once after correction. Fallback: disable affected resolver/tool binding. Escalation: security owner. Stop condition: any unresolved scope bypass or production-risk path.

## Definition of Done
**Implemented:** pre-dispatch gate is connected to the real dispatcher.  
**Measured:** all boundary fixtures have before/after decisions recorded.  
**Verified:** tests pass; independent reviewer reproduces hidden-tool denial; no secrets exposed; execution scope is equal to or narrower than advertised scope.

## Customization
Add identity, tenant, resource, parameter, and time-bound attributes to the policy decision without weakening the invariant that dispatch MUST remain inside the request-scoped tool set.
