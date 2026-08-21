# Hooks

## Pre-task inventory hook
**Trigger:** before enabling a new MCP server or changing tool exposure.  
**Action:** export current tool definitions and run the budget script.  
**Command:** `python scripts/tool_schema_budget.py tools.json --config config/budget.json --report current-report.json`  
**Expected:** exit 0 and a deterministic report.  
**Failure:** block rollout on exit 2/3; do not waive required-tool failures automatically.

## Pre-merge schema regression hook
**Trigger:** PR changes MCP tool definitions, descriptions, schemas, toolsets, or budget config.  
**Action:** compare new report with the checked-in/CI baseline.  
**Command:** `python scripts/tool_schema_budget.py tools.json --config config/budget.json --baseline baseline-report.json --report candidate-report.json`  
**Expected:** configured minimum reduction/budget rules pass.  
**Failure:** require an explicit reviewed budget-policy change or restore the schema/toolset.

## Client-upgrade preflight hook
**Trigger:** Claude Code/agent host/provider/model/MCP runtime version changes.  
**Action:** capture clean-session context diagnostics, verify deferred-tool discovery, and execute harmless smoke calls for critical servers.  
**Expected:** no material unexpected preload and 100% critical-tool reachability.  
**Failure:** retry once in a clean session; second failure blocks rollout and records client/runtime versions.

## Post-change capability hook
**Trigger:** after any optimization.  
**Action:** run representative tasks that require hot and deferred tools, including one ambiguous-selection case.  
**Expected:** required-tool selection success meets the project threshold and no disabled tool is unexpectedly required.  
**Failure:** rollback to last passing exposure policy.

## Final verification hook
**Trigger:** release/deployment gate.  
**Action:** independent verifier checks baseline, candidate report, policy diff, capability test result, and security boundary preservation.  
**Expected:** statuses are separately marked `Implemented`, `Measured`, and `Verified`.  
**Failure:** release remains blocked; no unlimited retries.