# Capability Preflight and Fallback Gate

**Category:** Thinking

## Problem
Agent plans can depend on a capability that appears available from ambient UI state, an installed plugin/skill, or configuration while the actual callable tool is missing, unhealthy, or semantically unsuitable. The failure arrives late, causing repeated retries, re-planning, unsupported conclusions, or fallback to a tool that loses critical semantics such as the authenticated browser session.

## Evidence
See `evidence/research.md`. Current evidence includes `openai/codex#39562`, `#39591`, and `#39136`, covering three distinct browser capability mismatches: tool exposure missing, runtime initialization crash, and trusted-path initialization failure.

## Existing approach
Agents commonly discover a tool only when reaching the dependent step, retry initialization, fall back to a similar tool, or ask the user for manual screenshots/actions after the automated path fails.

## Existing limitations
- Ambient/UI/plugin presence is weaker evidence than callability.
- Discovery may happen after the plan has already committed.
- Similar tools may not preserve authentication, permissions, DOM/screenshot access, or locality.
- Deterministic initialization regressions can trigger repeated useless attempts.
- Missing evidence is often represented as an implicit assumption rather than a tracked plan risk.

## Proposed improvement
Create an observable capability ledger and run a bounded preflight before every hard capability-dependent stage. Evidence is promoted through explicit levels: declared/ambient → discoverable → callable → healthy → semantically suitable. A fallback is accepted only if it preserves every required semantic property.

## Architecture
```text
capability-preflight-fallback-gate/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-task-capability-check.md
├── rules/
│   └── capability-evidence.md
├── scripts/
│   └── capability_check.py
├── skills/
│   └── capability-preflight.md
├── subagents/
│   └── capability-verifier.md
├── tests/
│   ├── fixtures.json
│   └── test_capability_check.py
└── workflows/
    └── preflight-and-fallback.md
```

## Installation
Python 3.10+ is sufficient for the deterministic reference checker/tests. Runtime integrations should use native tool discovery and harmless health probes, then feed observable evidence into the same contract.

## Configuration
For each hard capability define `required_semantics`. Example for an authenticated visual QA browser:
```json
{
  "capabilities": [{
    "name": "in-app-browser-control",
    "hard": true,
    "declared": true,
    "discoverable": true,
    "callable": true,
    "healthy": true,
    "required_semantics": ["authenticated-session", "dom-read", "screenshot"],
    "provided_semantics": ["authenticated-session", "dom-read", "screenshot"]
  }]
}
```

## Usage
Evaluate a captured capability ledger:
```bash
python scripts/capability_check.py evaluate --input runtime/capabilities.json
```
Exit code 3 means a hard capability is blocked; exit code 2 means invalid input.

Verify packaged scenarios:
```bash
python scripts/capability_check.py verify tests/fixtures.json
python -m unittest tests/test_capability_check.py
```

## Workflow
Use `workflows/preflight-and-fallback.md`: Observe requirements → baseline rework → classify evidence → harmless probe → evaluate semantics → verify fallback → revise plan → independent verification. Deterministic failures get one retry unless evidence changes.

## Metrics
- Hard capabilities preflighted before use: target **100%**.
- Late capability failures after plan commitment.
- Unsupported availability claims: target **0** in audited plans.
- Deterministic initialization retries without changed evidence: target **≤1**.
- Fallback semantic-equivalence violations: target **0**.
- Model/tool turns spent on rework after first capability failure.

## Verification
Fixtures cover ambient-but-missing capability, fully ready capability, a headless fallback that lacks authenticated-session semantics, an equivalent fallback, and optional-capability degradation. Target runtimes should add one harmless smoke probe for every hard capability and record the result in the ledger.

## Safety
Health probes must be non-destructive by default. The package never weakens permission/auth/session requirements to make a fallback pass. It separates capability facts from assumptions and never asks for hidden chain-of-thought.

## Failure handling
**Detection:** discovery miss, call failure, health-probe failure, missing semantic property, or repeated deterministic initialization error. **Evidence:** tool inventory + probe result + runtime/plugin version. **Retry:** one attempt unless evidence changes. **Fallback:** only a verified semantic superset/equivalent. **Escalation:** actionable user/platform handoff for missing tool exposure, broken runtime, permissions, or authentication. **Stop condition:** hard capability remains unverified or bounded retry is exhausted.

## Definition of Done
- **Implemented:** hard dependencies are represented in a capability ledger and a pre-task gate runs before dependent stages.
- **Measured:** late failures, retry/rework turns, and fallback violations are captured before/after adoption.
- **Verified:** every hard capability is ready or mapped to an equivalent verified fallback; no plan claims ambient/declared capability as callable evidence; retry loops are bounded; blocked capabilities produce a clear recovery path.

The package implementation/reference tests are complete, while production quality improvement is considered verified only after runtime-specific probes and before/after metrics are collected.

## Customization
Add task-specific semantic properties such as `authenticated-session`, `write-access`, `same-workspace`, `dom-read`, `screenshot`, `human-approval`, or `private-network`. Keep them observable and testable; do not use subjective labels such as “good enough” as a required semantic property.