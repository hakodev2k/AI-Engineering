# Workflows

## Workflow A — Baseline → Budget → Verify
**Trigger:** new MCP integration or tool-schema growth.  
**Goal:** reduce idle schema context without breaking tool availability.  
**Inputs:** exported tools JSON, `config/budget.json`, representative task suite.  
**Baseline:** run `tool_schema_budget.py`; archive total/hot/per-tool metrics.  

### Stages
1. **Observe — Inventory Agent:** reconcile servers and tools; reject incomplete inventory.
2. **Baseline — Inventory Agent:** measure footprint and identify top contributors.
3. **Cause — Exposure Planner:** determine whether cost comes from too many hot tools, oversized descriptions/schemas, duplicate capabilities, or client preload behavior.
4. **Hypothesis — Exposure Planner:** propose one reversible policy change and expected token reduction.
5. **Implement — Implementation Agent:** apply only the approved cohort change.
6. **Measure — Implementation Agent:** rerun the gate against the baseline.
7. **Capability test — Verification Agent:** run fixed discovery/selection smoke tasks.
8. **Decision:** if both budget and capability thresholds pass, verify and finish; otherwise restore the last passing policy and re-evaluate.

**Checkpoint:** after stages 2, 4, and 7.  
**Metrics:** total tokens, hot tokens, reduction %, selection success, required-tool reachability.  
**Retry policy:** maximum 2 optimization iterations per change set.  
**Stop conditions:** two failed iterations, missing required tool, security boundary change, or unverifiable inventory.  
**Failure path:** rollback policy, retain evidence, escalate to human owner.  
**Definition of Done:** budget passes, task suite passes, verifier signs off, report is archived.

## Workflow B — Client/Provider Upgrade Preflight
**Trigger:** agent client, MCP runtime, provider, or model upgrade.  
**Goal:** catch deferred-loading regressions before broad rollout.  
**Inputs:** last known-good initial footprint, expected deferred tools, harmless smoke calls.  
**Stages:** launch clean session → capture initial tool-context metrics → verify critical deferred tools are discoverable → invoke one read-only smoke tool per critical server → compare with baseline → approve or block rollout.  
**Responsible:** Implementation Agent collects; Verification Agent approves.  
**Retry:** one clean-session retry to exclude transient startup noise.  
**Stop:** second failure blocks rollout. Never disable security checks to make the preflight pass.

## Workflow C — Oversized Tool Remediation
**Trigger:** one tool exceeds `warn_tool_tokens` or `max_tool_tokens`.  
**Goal:** reduce cost while preserving semantics.  
**Order of preference:** defer the tool → split unrelated capabilities → remove duplicated prose/examples → replace verbose repeated descriptions with concise unambiguous text → only then consider schema redesign.  
**Verification:** compare token count and run positive, negative, boundary, and ambiguous-selection cases.  
**Retry:** max 2 schema revisions.  
**Stop:** any correctness regression or safety loss; keep the larger schema and accept/raise budget via reviewed policy if necessary.