# Research — Agent Secret Output DLP Guard

## Problem
Coding agents routinely inspect local files, shell environment variables, CLI output, logs, and configuration. A single tool call can emit live credentials into model-visible context and persistent transcripts before prompt-level instructions can react. Once exposed, the secret may be copied into subsequent requests, summaries, logs, backups, screenshots, or artifacts.

## Category
Security

## Why it matters now
Recent 2026 reports across multiple coding-agent products show the same recurring failure mode: secret-bearing tool output reaches the transcript despite repository instructions that prohibit disclosure. This is a harness-boundary problem, not merely a prompting problem.

## Current public signals
1. **OpenAI Codex issue #34233** (opened 2026-07-19) reports repeated disclosure of live credentials from config files into stored conversation/tool output despite explicit `AGENTS.md` secret-handling instructions. The report calls out failed hand-written redaction and broad YAML reads, and proposes pre-display/model-visible redaction plus safe-field allowlists.
2. **Claude Code issue #80153** (opened 2026-07-22) reports an autonomous Bash command containing bare `env` that printed multiple live API tokens into the persisted transcript; the author notes the broader class includes `printenv`, `set`, `export`, `/proc/self/environ`, and accidental variable echoes.
3. **Claude Code issue #44868** (opened 2026-04-07) reports `.env`/`.dev.vars` contents being exposed via `grep -n` and Read even though project instructions explicitly prohibited secret output. The issue argues the agent notices the violation only after the secret is already stored.
4. **Claude Code issue #63593** (opened 2026-05-29) requests write-time redaction because tool stdout is persisted verbatim in JSONL transcripts, expanding the leak surface to backups, sync repositories, screen sharing, and later context reuse.
5. **Claude Code issue #29434** requests a mechanism to redact/remove secrets or PII from the context window, noting that blocking hooks cannot sanitize already-produced output.

## Existing approaches
- Repository instructions such as `AGENTS.md` / `CLAUDE.md` saying “never print secrets”.
- Ignore files such as `.gitignore` or tool-specific ignore features.
- Pre-tool permission prompts.
- Model-written regex redaction around individual shell commands.
- Post-hoc secret rotation after disclosure.
- Generic secret scanners run only on committed files.

## Observed limitations
- Prompt instructions are probabilistic and execute at the model layer, after lower-level tools may already have emitted the value.
- Ignore files do not protect environment variables, command stdout, generated logs, or alternate file-reading commands.
- Approval prompts often authorize a tool, not the exact bytes that will be returned.
- Hand-written command-specific regexes miss unknown secret formats and are easy to bypass accidentally.
- Git scanners operate too late for transcript/context leakage.
- Post-hoc rotation mitigates credential validity but not prior data exposure or compliance impact.

## Root-cause hypotheses
1. Raw tool output is treated as safe transport data and appended to transcript/context before DLP inspection.
2. Secret-handling policies exist only as natural-language instructions rather than host-side enforcement.
3. Known secret values already present in process environment are not registered with the redactor.
4. Detection relies only on token prefixes instead of combining known values, key-name context, pattern rules, entropy, and structured parsing.
5. There is no separation between raw execution output and sanitized model-visible output.
6. Audit storage may persist raw output even when the visible UI later masks it.

## Improvement target
Create a host-side Secret Output DLP Guard positioned between tool execution and every model/transcript/log sink. It should:
- register known sensitive environment-variable values without logging them;
- detect secrets using layered deterministic detectors;
- redact before model visibility and persistence;
- optionally block extremely sensitive outputs entirely;
- hash detections for correlation without storing plaintext;
- attach structured redaction metadata;
- apply stricter policies to known secret-bearing paths and commands;
- require explicit, scoped human approval for intentional raw-secret access;
- keep retries bounded and fail closed on scanner failure.

## Success metrics
- 100% of configured tool-output sinks route through the guard.
- 0 seeded plaintext secrets appear in sanitized transcript fixtures.
- 100% of known registered secret values are redacted in regression tests.
- False-positive rate is measured on benign fixtures and stays below the configured threshold.
- Scanner failures prevent raw output from reaching model/transcript sinks.
- Raw-secret override is one-shot, explicit, auditable, and disabled by default.

## Sources
- https://github.com/openai/codex/issues/34233
- https://github.com/anthropics/claude-code/issues/80153
- https://github.com/anthropics/claude-code/issues/44868
- https://github.com/anthropics/claude-code/issues/63593
- https://github.com/anthropics/claude-code/issues/29434

## Evidence / interpretation / solution boundary
**Observed evidence:** the cited reports document secrets entering persisted agent output/context through ordinary file and shell tooling.

**Interpretation:** natural-language instructions and command-local redaction are insufficient as the primary security boundary.

**Proposed engineering solution:** the DLP guard in this package is a reusable host-side design derived from those observations. It is not claimed to be an official implementation from OpenAI or Anthropic.