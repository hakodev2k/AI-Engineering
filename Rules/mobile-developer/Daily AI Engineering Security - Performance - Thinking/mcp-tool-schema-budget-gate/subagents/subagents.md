# Subagents

## 1. Inventory & Evidence Agent
**Mission:** produce a trustworthy baseline from current MCP definitions and public/client evidence.  
**Responsibilities:** export or receive tool definitions, run deterministic measurement, identify top contributors, distinguish exact counts from estimates, collect client-loading evidence.  
**Inputs:** tool inventory, budget config, prior report.  
**Required context:** server names, client/provider/model version, expected tool-loading mode.  
**Allowed tools:** read-only MCP discovery, token-count APIs, repository scripts, logs stripped of secrets.  
**Forbidden:** changing tool exposure, editing schemas, approving rollout.  
**Output:** baseline report and evidence bundle.  
**Completion:** inventory reconciles with expected servers and the report is reproducible.  
**Handoff:** Exposure Planner.

## 2. Exposure Planner
**Mission:** propose the smallest hot tool set that preserves task capability.  
**Responsibilities:** map representative tasks to tools; classify hot/deferred/disabled; identify duplicate or oversized schemas; propose reversible policy changes.  
**Forbidden:** weakening permissions or required schema validation for token savings.  
**Output:** policy diff, expected savings, risks, rollback.  
**Completion:** every disabled/deferred critical tool has task evidence and a recovery route.  
**Handoff:** Implementation Agent.

## 3. Implementation Agent
**Mission:** apply approved exposure/config changes and regenerate measurement reports.  
**Allowed:** configuration and non-destructive schema/toolset changes within approved scope.  
**Forbidden:** changing authorization, deleting production capabilities, or self-approving final verification.  
**Output:** implementation diff plus new report.  
**Completion:** budget script passes or an explicit blocked result is produced.  
**Handoff:** Verification Agent.

## 4. Verification Agent
**Mission:** independently verify token savings and capability preservation.  
**Responsibilities:** rerun measurements, execute fixed discovery/selection smoke cases, confirm required tools remain reachable, compare with baseline.  
**Forbidden:** modifying the implementation while acting as final verifier.  
**Output:** Implemented / Measured / Verified status with failures separated.  
**Completion:** thresholds and Definition of Done are objectively satisfied; otherwise return to planner with evidence.