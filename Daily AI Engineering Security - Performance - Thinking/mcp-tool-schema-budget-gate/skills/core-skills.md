# Core Skills

## Skill 1 — Tool-schema footprint audit
**Purpose:** establish a measurable baseline before changing MCP exposure.  
**Trigger:** new MCP server, client upgrade, model/context-window change, or budget regression.  
**Inputs:** exported tool definitions, `config/budget.json`, optional prior report.  
**Preconditions:** tool inventory is complete; no secrets are embedded in fixtures.  
**Required context:** server identity, task classes that require each tool, current client loading mode.  
**Tools:** `scripts/tool_schema_budget.py`, provider token counter when available.

**Procedure**
1. Export `tools/list` definitions to JSON without credentials or runtime arguments.
2. Run the budget script and capture the report.
3. Sort by token cost and identify the top contributors by tool and server.
4. Separate facts from hypotheses: footprint is measured; usefulness must be validated by task tests.
5. Record baseline total/hot tokens and current exposure mode.

**Decisions:** exact tokenizer vs estimate; whether a tool is required, hot, deferred, or disabled.  
**Constraints:** never delete schema semantics purely to hit a number.  
**Expected output:** reproducible JSON report plus ranked contributors.  
**Metrics:** total tokens, hot tokens, max-tool tokens, server share.  
**Verification:** rerun on identical input; result must be deterministic.  
**Failure handling:** invalid inventory/config exits non-zero; fix input rather than bypassing the gate.  
**Stop:** baseline is captured and top contributors are known.

## Skill 2 — Budgeted exposure design
**Purpose:** reduce idle tool context while preserving task capability.  
**Trigger:** baseline exceeds policy or a server adds costly tools.  
**Inputs:** baseline report, task-to-tool mapping, policy.  
**Procedure:** mark always-needed tools `hot`; infrequent discoverable tools `deferred`; obsolete, duplicate, or unauthorized tools `disabled`; keep required tools explicit; rerun budget; then run selection tests. Change one exposure cohort at a time so regressions are attributable.  
**Decisions:** prefer deferred loading before trimming useful descriptions; split oversized servers into task-oriented toolsets when the client supports it.  
**Constraints:** authorization and security boundaries override token savings.  
**Expected output:** versioned policy with measurable reduction.  
**Metrics:** reduction %, hot-tool count, selection success, false-disable rate.  
**Verification:** fixed task suite still reaches required tools.  
**Failure handling:** restore last passing policy if selection quality falls below threshold.  
**Stop:** budget passes and capability regression tests pass.

## Skill 3 — Client regression preflight
**Purpose:** detect when a client upgrade silently changes deferred-loading behavior.  
**Trigger:** agent/client/provider upgrade or changed MCP configuration.  
**Inputs:** previous footprint, current context diagnostics, tool-search smoke tasks.  
**Procedure:** compare initial tool-context footprint; verify expected deferred tools are discoverable; execute one harmless smoke call per critical server; compare against baseline; fail rollout on unexpected preload or missing-tool behavior.  
**Expected output:** PASS/FAIL with observed footprint and discovery evidence.  
**Metrics:** startup tool tokens, discovered critical tools, smoke-call pass rate.  
**Verification:** an independent verifier reviews evidence; implementer is not sole approver.  
**Stop:** rollout is approved or blocked with a concrete regression reason.