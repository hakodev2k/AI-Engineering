# Cross-Surface Approval Policy Gate

**Category:** Security

## Problem
Equivalent high-impact actions may receive different approval treatment depending on whether they are reached through terminal commands, file tools, MCP wrappers, nested agents, or custom adapters.

## Evidence
See `evidence/research.md` for current public reports from Hermes Agent, Microsoft Agent Framework, and MCP security guidance.

## Existing approach and limitation
Per-tool approval logic is easy to implement but can drift across tool surfaces. Regex-based shell guards do not cover non-shell APIs, while nested-agent delegation can lose approval context.

## Proposed improvement
Normalize every requested effect to a capability and target, then enforce one pre-side-effect policy decision regardless of invocation route. Bind approvals to actor/session, capability, target, and argument hash. Unknown high-impact capabilities fail closed.

## Package tree
```text
cross-surface-approval-policy-gate/
├── README.md
├── evidence/research.md
├── config/policy.json
├── skills/map-and-enforce-capabilities.md
├── rules/capability-approval-rules.md
├── workflows/inventory-enforce-verify.md
├── hooks/pre-side-effect-policy-check.md
├── scripts/policy_gate.py
└── tests/test_policy_gate.py
```

## Installation
Python 3.10+ is sufficient for the gate. Tests require `pytest`.

```bash
python -m pip install pytest
```

## Configuration
Edit `config/policy.json` to match organization capability names. Keep unknown high-impact requests deny-by-default unless a reviewed equivalent policy replaces it.

## Usage
Create a request JSON containing `surface`, `capability`, `target`, `actor`, `impact`, `args`, optional delegation fields, and optional approval evidence.

```bash
python scripts/policy_gate.py request.json --policy config/policy.json --strict
```

Exit codes: `0` allow, `2` invalid input, `4` approval required, `5` deny.

## Workflow
Follow `workflows/inventory-enforce-verify.md`: inventory surfaces, capture baseline decisions, diagnose mismatches, integrate the central gate, and rerun equivalent non-destructive fixtures.

## Metrics
Uncovered high-impact surface count, cross-surface consistency rate, approval-bypass fixture pass rate, unknown-capability denial rate, and audit coverage for high-impact actions.

## Verification
Run:

```bash
pytest -q tests/test_policy_gate.py
```

Verification must include equivalent effect fixtures across at least two different surfaces and a changed-arguments approval invalidation fixture.

## Safety
The package is secure-by-default. It does not weaken approval for convenience or performance. Unknown high-impact capabilities deny, delegated actions require provenance by default, and argument changes require fresh approval.

## Failure handling
Invalid metadata fails closed. A bypass fixture blocks completion. One mapping/integration recovery attempt is allowed; unresolved gaps require security review and the affected capability should remain blocked.

## Definition of Done
- Current evidence documented.
- Tool surfaces inventoried.
- High-impact capabilities mapped.
- Central policy gate integrated before side effects.
- Approval binding verified.
- Delegation provenance verified.
- Cross-surface fixtures pass.
- Audit evidence exists for high-impact decisions.
- No blocking bypass remains.

## Customization
Add capability mappings for organization-specific tools and targets, but keep policy semantic rather than tool-name-only. Extend tests whenever a new tool surface exposes an existing effect.
