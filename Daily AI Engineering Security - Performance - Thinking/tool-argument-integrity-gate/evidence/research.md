# Research Evidence

## Topic
Tool Argument Integrity Gate

## Category
Security

## Problem
Tool-call harnesses can parse malformed model-emitted tool syntax into an apparently valid argument object while silently absorbing sibling parameter blocks into a preceding string field. If the missing parameters are optional or nullable, schema validation may still pass and the tool can execute with corrupted intent, causing persistent memory/data corruption or unintended side effects.

## Why it matters now
A fresh August 2026 Claude Code report measured a non-trivial rate of silent field loss on parameter-rich MCP calls and explicitly re-raised an older reproduced report that was never fixed. The current MCP specification treats tool arguments as structured input governed by JSON Schema, but schema validation alone cannot recover intent once a client-side parser has transformed malformed transport grammar into a different, superficially valid object.

## Affected users
MCP server authors, agent-harness developers, users of memory/persistence tools, coding/operations agents with multi-parameter tools, and teams relying on schema validation as the only pre-dispatch integrity boundary.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #84362, opened 2026-08-06 and updated 2026-08-20, reports permissive tag-grammar parsing that absorbs following parameter blocks into a previous string field when close tags are mismatched or mangled. The report measured about 6.2% calls landing successfully with silently absorbed parameters in one parameter-rich MCP workload, plus a larger refused-error arm.
2. Claude Code issue #44826 documents the same fundamental mechanism earlier in 2026 with detailed reproductions: subsequent structured fields arrived as `null` while literal `<parameter ...>` blocks appeared inside the preceding `content` string, and the call could still return success.
3. The Model Context Protocol tools specification requires tool definitions to include valid `inputSchema` and defines structured `arguments` for `tools/call`. This provides a schema boundary but does not itself guarantee that a client parser preserved the model's intended argument segmentation before constructing those arguments.

### Interpretation
The unresolved weakness is an integrity gap between model tool-call emission and schema-governed tool dispatch. A permissive parser can transform malformed structured syntax into valid-looking application data. Required-field validation catches some cases, but optional fields allow silent corruption to cross the boundary. Server-side side effects can then make the corruption durable.

### Proposed solution
Add a deterministic pre-dispatch integrity gate that checks the parsed argument object for residual tool-grammar fragments correlated with missing sibling schema fields, rejects ambiguous calls before side effects, records sanitized evidence, and requires re-composition of the tool call rather than heuristic recovery. Add readback verification for persistence tools so a successful write is not considered verified until critical fields round-trip correctly.

## Existing approaches
- Rely on client parser permissiveness and downstream JSON/schema validation.
- Make important parameters required where possible.
- Add prompt instructions asking the model to format tool calls correctly.
- Add server-specific defensive string checks.
- Detect errors only later through linting/readback of corrupted persistent records.

## Remaining limitations
- Required fields do not protect optional but semantically important fields.
- Prompt rules are probabilistic and do not enforce parser behavior.
- Generic XML/tag rejection produces false positives for tools that legitimately accept markup.
- Heuristically reconstructing swallowed parameters can create a second parser with different ambiguity.
- Post-write linting detects corruption after side effects and may not restore the original intended values.

## Root-cause analysis
1. Model-emitted tool syntax is treated as recoverable text instead of a strict structured boundary.
2. Parser recovery favors producing a call over refusing ambiguous syntax.
3. Schema validation checks the transformed argument object, not whether argument segmentation was preserved.
4. Optional/null fields let corrupted calls remain schema-valid.
5. Side-effecting tools do not always perform independent semantic/readback verification.
6. Telemetry often counts only hard parse failures, hiding green-but-corrupted calls.

## Improvement opportunity
A reusable gate can use tool schema knowledge to make detection precise: if a string field contains a parameter-grammar fragment naming another declared field that is absent or null, or contains an invocation terminator inconsistent with normal application data, block before dispatch. The gate can be provider-agnostic because it operates on the parsed call plus the declared tool schema.

## Goal
Convert ambiguous silent corruption into an explicit bounded failure before any tool side effect, while keeping false positives low for legitimate text/markup workloads.

## Metrics
- suspicious-residue detections per 1,000 tool calls
- confirmed silent-corruption escapes
- false-positive rate on legitimate markup fixtures
- re-composition success rate
- side effects executed before detection
- persistence readback mismatch rate
- tool success/regression rate

## Trigger
Every side-effecting or persistence tool call with multiple declared arguments; optionally all tool calls in high-assurance mode.

## Inputs
Tool name, parsed arguments, declared input schema, optional critical-field list, optional post-write readback result.

## Outputs
ALLOW/BLOCK decision, sanitized reason codes, missing-field list, residue field names, verification status.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/84362
- https://github.com/anthropics/claude-code/issues/44826
- https://modelcontextprotocol.io/specification/2026-07-28/server/tools

Research date: 2026-08-20, Vietnam time (UTC+7).