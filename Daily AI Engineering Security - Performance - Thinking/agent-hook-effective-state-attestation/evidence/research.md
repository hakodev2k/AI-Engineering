# Research — Agent Hook Effective-State Attestation

## Problem
AI coding-agent hook systems can drift between **declared configuration** and **effective runtime behavior**. A hook expected to be disabled may still execute, while a hook expected to enforce security policy may silently disappear. Because hooks frequently implement approval gates, audit logging, repository protections, validation, and post-write controls, this state drift becomes a security boundary failure rather than a mere configuration bug.

## Category
**Security**

## Why it matters now
Recent Claude Code reports expose both directions of the same trust problem:

1. **Unexpected hook execution:** a disabled plugin continued to execute a `PostToolUse` hook on every Edit/Write while the hooks UI showed no such active hook.
2. **Missing expected enforcement:** enterprise `managed-settings.d` hooks were silently dropped when server-managed settings were present, disabling `PreToolUse` gating and audit logging while the on-disk MDM policy still appeared deployed.

These failures show that checking settings files alone is insufficient. Security-sensitive agent sessions need an independent attestation of the hooks that are actually active.

## Current public signals

### Signal 1 — disabled plugin hook still executes
Anthropic Claude Code issue #85893, opened 2026-08-11, reports that setting a plugin to `false` removed its skills and agents but did not unregister its `PostToolUse` hook. The hook kept running after Edit/Write actions and the `/hooks` UI did not list it. The issue is labeled `area:security`, `area:hooks`, and `area:plugins`.

Source: https://github.com/anthropics/claude-code/issues/85893

### Signal 2 — managed hook silently disappears
Anthropic Claude Code issue #86293, opened 2026-08-13, reports that hooks delivered via enterprise `managed-settings.d` run when remote managed settings return 404, but are silently omitted when an organization has server-managed settings. The report specifically notes that `PreToolUse` enforcement and audit logging stop together, with no warning and no modification to the local policy file.

Source: https://github.com/anthropics/claude-code/issues/86293

### Signal 3 — hooks can be security controls, not convenience callbacks
Claude Code documentation describes hooks as user-defined commands that execute at lifecycle events such as before/after tool calls. Enterprise settings can distribute centrally controlled behavior. This makes hook provenance, enablement, and runtime presence relevant to security assurance.

Source: https://docs.anthropic.com/en/docs/claude-code/hooks

## Observed evidence, interpretation, proposed solution

### Observed evidence
- A hook can execute while user-visible hook state says it is absent.
- A managed hook can be present on disk but absent at runtime.
- Configuration-source precedence can alter effective hooks without an explicit error.
- Hook failures can remove both an enforcement action and its audit trail.

### Interpretation
The effective hook graph must be treated like an executable security policy. Configuration files, plugin enablement flags, MDM inventory, and UI listings are evidence sources, but none should be assumed authoritative by themselves. The host needs a session-start reconciliation step that compares:

`expected hooks` ↔ `reported/observed runtime hooks`

and blocks high-risk workflows when required hooks are missing or forbidden hooks are unexpectedly active.

### Proposed engineering solution
Create a reusable attestation layer with:

1. **Expected-state manifest** — explicitly list required, optional, and forbidden hooks with event, matcher, command fingerprint, source, and criticality.
2. **Runtime snapshot** — capture the host's effective hook listing or normalized debug/event data without executing arbitrary hook code.
3. **Deterministic reconciliation** — compare expected vs runtime by stable identity/fingerprint.
4. **Critical fail-closed gate** — stop protected operations if a required security hook is missing or a forbidden hook is active.
5. **Canary verification** — optionally trigger a harmless test event in an isolated temp workspace and verify an expected marker from selected hooks.
6. **Audit artifact** — emit a redacted attestation report with status `implemented`, `measured`, and `verified` kept distinct.

## Existing approaches and limitations

### 1. Trust the settings file
Teams inspect `.claude/settings.json`, managed settings, plugin enablement flags, or deployment inventory.

**Limitation:** issue #86293 shows a file can be deployed and unchanged while its hooks are not loaded. Declared state is not effective state.

### 2. Trust the `/hooks` UI or runtime listing
Users inspect a built-in listing of hooks.

**Limitation:** issue #85893 reports a hook executing while absent from `/hooks`. A listing may be incomplete during bugs or lifecycle mismatches.

### 3. Trust plugin enabled/disabled state
Teams assume a disabled plugin contributes nothing.

**Limitation:** issue #85893 demonstrates inconsistent disable semantics across skills/agents/hooks.

### 4. Rely on hook logs
A hook writes audit logs that prove it ran.

**Limitation:** if the hook itself is silently not loaded, the audit log disappears too. Absence of logs is ambiguous unless a watchdog detects it.

### 5. Manual smoke test
An engineer performs a tool action and sees whether a hook reacts.

**Limitation:** manual, non-repeatable, potentially destructive, and difficult to automate across many event/matcher combinations.

## Root-cause hypotheses
1. Multiple settings sources are merged or substituted inconsistently.
2. Plugin installation state and plugin enabled state are cached through different registries.
3. UI/reporting state is derived from a different registry than execution state.
4. Runtime hook registration occurs before/after settings resolution in ways that create stale registrations.
5. Enterprise sources may replace rather than merge with local managed sources.
6. Security observability is coupled to the same hook mechanism it is trying to observe.

## Threat model

### Assets
- approval boundaries before shell/network/write actions;
- audit trail of agent operations;
- repository integrity;
- secrets and production credentials indirectly protected by policy hooks;
- enterprise compliance controls.

### Adversaries and failure sources
- buggy settings merge or runtime cache;
- malicious or compromised plugin remaining active after disablement;
- user switching organization/profile causing policy-source drift;
- indirect prompt injection exploiting the absence of an expected pre-tool gate;
- stale session state after configuration changes.

### Trust boundaries
- configuration sources → resolved policy;
- resolved policy → hook registry;
- hook registry → execution engine;
- execution engine → UI/debug listing;
- enforcement hook → external audit sink.

## Improvement target
A protected agent session should meet all of these measurable conditions:

- 100% of `critical=true` required hooks are present in the runtime snapshot before protected tools are enabled.
- 0 forbidden hooks are active.
- Hook identity comparison is deterministic and independent of model reasoning.
- Optional canary verification succeeds for all selected critical hooks without modifying the real repository.
- Missing or extra critical hooks produce a non-zero exit code and fail closed.
- Attestation reports contain no secrets or arbitrary hook stdout.
- Configuration changes invalidate the previous attestation and require re-check.

## Verification model

### Implemented
The manifest, reconciliation script, hooks, and workflows are installed.

### Measured
A runtime snapshot has been collected and reconciled against the expected manifest.

### Verified
All critical required hooks match, forbidden hooks are absent, and any configured canary checks pass in an isolated workspace.

## Non-goals
- fixing Claude Code internals;
- executing unknown third-party hooks to discover what they do;
- treating every optional hook mismatch as a hard failure;
- replacing OS sandboxing, permissions, secret management, or code review;
- trusting an LLM to decide whether two hook commands are equivalent.

## Sources
1. Anthropic Claude Code issue #85893 — https://github.com/anthropics/claude-code/issues/85893 — opened 2026-08-11.
2. Anthropic Claude Code issue #86293 — https://github.com/anthropics/claude-code/issues/86293 — opened 2026-08-13.
3. Claude Code hooks documentation — https://docs.anthropic.com/en/docs/claude-code/hooks
