# Subagents

## Context Pressure Analyst
**Mission:** identify tool outputs causing token/context pressure and quantify the baseline.

**Responsibilities:**
- inspect tool-output size distribution;
- classify outputs by tool and payload type;
- identify calls that repeatedly dominate context;
- produce before/after measurement requirements.

**Inputs:** tool traces, token/byte metrics, active model limits, task profile.

**Required context:** tool names, output formats, whether raw evidence is needed later.

**Allowed tools:** metrics/log readers, `scripts/tool_output_guard.py analyze`.

**Forbidden actions:** modifying production retention/security policies; deleting raw artifacts.

**Expected output:** ranked pressure report with baseline metrics and candidate budgets.

**Completion criteria:** top offenders and measurable success thresholds are identified.

**Handoff:** Spillover Implementation Agent.

---

## Spillover Implementation Agent
**Mission:** implement the bounded model-visible envelope and external raw-artifact path.

**Responsibilities:**
- integrate pre-context output guard;
- configure spill root and budget;
- preserve artifact integrity/provenance;
- add targeted rehydration path.

**Inputs:** pressure report, policy, tool boundary integration point.

**Required context:** storage security model, runtime filesystem/artifact API, tool lifecycle.

**Allowed tools:** code editor, test runner, `scripts/tool_output_guard.py`.

**Forbidden actions:** silently lowering correctness requirements; disabling raw retention where needed; bypassing privacy controls.

**Expected output:** implementation + metrics + test evidence.

**Completion criteria:** oversized output is spilled before model insertion and can be rehydrated by verified reference.

**Handoff:** Independent Verification Agent.

---

## Independent Verification Agent
**Mission:** verify that token reduction does not hide required evidence or break recovery.

**Responsibilities:**
- run spill/pass-through/rehydrate tests;
- verify hashes and line provenance;
- compare representative task outcomes with full-output baseline;
- test path traversal and integrity failures;
- check README/implementation consistency.

**Inputs:** implementation, policy, tests, sample outputs.

**Required context:** Definition of Done and expected task outputs.

**Allowed tools:** test runner, artifact inspection, static review.

**Forbidden actions:** changing implementation while acting as sole verifier.

**Expected output:** Implemented / Measured / Verified status and unresolved risks.

**Completion criteria:** all mandatory tests pass or blocking failures are documented.

**Handoff:** human/runtime owner for deployment decision.