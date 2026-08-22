# Research — Agent Secret-Output Redaction Guard

## Problem
AI coding agents routinely execute shell commands and inspect configuration files. If a command prints environment variables, credentials, tokens, private keys, connection strings, or credential-bearing config values, the raw secret can enter tool output and then be persisted in the conversation/session transcript, telemetry, debugging logs, or downstream agent context.

## Category
**Security**

## Why it matters now
This is not theoretical. Recent public issue reports from two major coding-agent ecosystems describe live credentials appearing in stored agent output even when users expected safe handling.

## Current public signals

### Signal 1 — Claude Code: environment dump leaked live secrets
Anthropic Claude Code issue #80153, opened 2026-07-22, reports an autonomous Bash command containing a bare `env` call. The tool output exposed multiple live API tokens into the persisted session transcript, requiring credential rotation. The report explicitly calls out a broader command class: `env`, `printenv`, `set`, `export`, `declare -p`, `/proc/self/environ`, and direct variable echoing.

Source: https://github.com/anthropics/claude-code/issues/80153

### Signal 2 — Codex: config inspection printed live credentials despite redaction instructions
OpenAI Codex issue #34233, opened 2026-07-19, reports live credentials disclosed in stored conversation/tool output while inspecting local config files. The issue says a redaction expression missed credential-like assignments and that the leakage occurred despite explicit safe-secret handling instructions in `AGENTS.md`.

Source: https://github.com/openai/codex/issues/34233

### Signal 3 — Established log-masking practice requires masking before output
GitHub Actions documentation recommends masking sensitive values before they appear in logs using `::add-mask::VALUE`, and warns that masking must be registered before the value is emitted. This is relevant because agent transcripts are another durable logging surface: redaction after persistence is weaker than interception before storage/model reinjection.

Sources:
- https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
- https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets

## Observed evidence vs interpretation

### Observed evidence
- Live secrets have been reported in coding-agent tool output/transcripts.
- Prompt-level redaction instructions can fail because deterministic shell/config output bypasses intent-level wording.
- Environment-dumping commands represent a broad, mechanically detectable leak path.
- Established CI systems treat pre-output masking as a separate technical control rather than a prose instruction.

### Interpretation
Agent systems need a host-visible output-boundary control that does not depend on the model remembering every secret format or correctly writing every redaction command. The safest place to enforce this is between tool execution and transcript/model ingestion, with an additional preflight check for obviously dangerous secret-dumping commands.

### Proposed engineering solution
Introduce a reusable secret-output guard with three layers:
1. **Known-value masking** — discover only approved secret values from explicitly named environment variables and redact exact occurrences before output is stored or reinjected.
2. **Pattern detection** — identify common credential shapes and sensitive key/value assignments using deterministic patterns; redact by default and flag uncertain matches.
3. **Command preflight** — detect high-risk environment/credential-dumping command shapes before execution and require an allow decision or safer replacement.

The package intentionally does not dump the entire environment to build its secret dictionary. Hosts supply an allowlist of sensitive environment-variable names, keeping collection scoped.

## Existing approaches

### Prompt/rule instructions
Projects often tell the model not to display secrets or to redact values when reading configuration.

**Limitation:** Codex issue #34233 shows that instructions alone can fail when a redaction expression is incomplete or a tool emits raw data.

### Shell-level redaction pipelines
Users pipe output through `sed`, `grep -v`, custom regex, or wrappers.

**Limitation:** every command author must remember the wrapper and every credential format. Compound commands can accidentally emit data before filtering.

### Secret masking in CI/log systems
Systems such as GitHub Actions register known secret values and mask them from logs.

**Strength:** deterministic and independent of model behavior.

**Limitation for agents:** agent hosts may not expose equivalent masking at every tool-output boundary, and secrets may come from local developer environments rather than a centralized CI secret store.

### Secret scanners
Repository scanners detect committed credentials using patterns/entropy/provider validation.

**Limitation:** they primarily target files/history, not ephemeral stdout/stderr before it becomes a persisted agent transcript.

## Root-cause hypotheses
1. Tool stdout/stderr is trusted as ordinary context and persisted before a dedicated secret filter runs.
2. Model-written redaction commands are incomplete and format-specific.
3. Agents can execute broad enumeration commands that expose more environment state than the task requires.
4. Secret values originate from heterogeneous sources and are not centrally registered with the agent runtime.
5. Post-hoc cleanup occurs after the secret may already have reached storage, telemetry, sync, or additional model calls.

## Improvement target
A host integrating this package should be able to demonstrate:
- zero known registered secret values in persisted tool output;
- zero unredacted matches from the configured high-confidence credential patterns in regression fixtures;
- deterministic blocking or review of configured environment-dump command shapes;
- bounded false-positive rate measured on representative non-secret logs;
- no secret values written to guard logs, reports, or error messages;
- measurable coverage across stdout, stderr, hook output, and any tool-result serialization boundary.

## Threat model
### Assets
- API keys and bearer tokens
- cloud credentials
- GitHub/GitLab tokens
- private keys
- database connection strings/passwords
- VPN credentials
- session cookies or auth headers

### Adversaries/failure sources
- accidental model-generated commands
- indirect prompt injection requesting environment/config disclosure
- unsafe debugging commands
- incomplete redaction regex
- malicious repository content instructing the agent to print credentials

### Trust boundaries
- shell/process environment → tool runner
- tool stdout/stderr → host event stream
- host event stream → model context
- host event stream → persistent transcript/log/telemetry

## Non-goals
- replacing a full secret manager;
- rotating compromised secrets automatically;
- scanning entire disks or repositories;
- deciding whether a credential is valid by contacting external providers;
- weakening sandbox or permission controls.

## Sources
1. Anthropic Claude Code issue #80153 — https://github.com/anthropics/claude-code/issues/80153 — opened 2026-07-22.
2. OpenAI Codex issue #34233 — https://github.com/openai/codex/issues/34233 — opened 2026-07-19.
3. GitHub Actions workflow commands: masking values — https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands
4. GitHub Actions secrets guidance — https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
