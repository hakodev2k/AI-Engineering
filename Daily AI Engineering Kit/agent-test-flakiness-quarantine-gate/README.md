# Agent Test Flakiness Quarantine Gate

A reusable AI-engineering kit that prevents coding agents and CI-diagnosis agents from turning nondeterministic test failures into false success by repeatedly rerunning until green. The kit preserves the first failure, performs a bounded flakiness probe, separates deterministic failures from true mixed pass/fail behavior, requires independent verification after fixes, and blocks automatic quarantine or assertion weakening.

## Problem

AI-assisted test-fix-retest loops often treat a later passing rerun as proof that an earlier failure is resolved. That is unsafe when tests are timing-sensitive, order-dependent, stateful, resource-sensitive, network-dependent, or otherwise nondeterministic. Repeated retries can hide regressions, produce misleading completion claims, and encourage agents to disable tests instead of finding root causes.

## Purpose

Use this package to turn an ambiguous failed-test rerun into a controlled workflow:

```text
first failure
    ↓
preserve evidence
    ↓
bounded narrow probe
    ↓
classify
 ┌──────────────┬────────────────────┬───────────────┐
 │ deterministic│       flaky        │ tool failure  │
 └──────┬───────┴─────────┬──────────┴──────┬────────┘
        ↓                 ↓                 ↓
 normal bug fix     root-cause work    repair environment
                         ↓
                   independent verify
                         ↓
                quarantine only if needed
                         ↓
                    human approval
```

## When to use

Use when a test fails unexpectedly; a second run disagrees with the first; CI and local results differ; a coding agent wants to rerun a failure; a release is blocked by suspected flaky tests; or a team is considering skip/ignore/quarantine as a short-term measure.

## When not to use

Do not use this as a substitute for debugging a consistently failing test, as a mechanism to make CI green, or for production probes. If the same test consistently fails, route to the normal bug-fix workflow. If probing requires production data or systems, stop and obtain a safer test environment.

## Architecture and responsibilities

`run_flake_probe.py` is the deterministic gate. It validates the command against a repository-configured allowlist, caps reruns, saves every run's stdout/stderr, emits a machine-readable result, and returns a blocking non-zero exit code for flaky, consistent-failure, or tool-failure classifications. The Flake Investigator owns diagnosis; the Verification Agent is deliberately separate from implementation and verifies a proposed fix. Quarantine is a human-approved decision rather than an agent fallback.

## Package tree

```text
agent-test-flakiness-quarantine-gate/
├── README.md
├── config/
│   └── flake-gate.json
├── hooks/
│   └── post-test-flake-gate.md
├── rules/
│   └── test-flakiness-rules.md
├── schemas/
│   └── flake-result.schema.json
├── scripts/
│   ├── run_flake_probe.py
│   └── verify_package.py
├── skills/
│   ├── quarantine-decision.md
│   └── triage-flaky-test.md
├── subagents/
│   ├── flake-investigator.md
│   └── verification-agent.md
├── templates/
│   └── flake-investigation-report.md
├── tests/
│   └── test_run_flake_probe.py
└── workflows/
    └── flaky-test-gate.md
```

## Installation

Copy this directory into the repository or agent-instruction location. Python 3.9+ is sufficient for the supplied scripts; the redirection/probe logic uses only the Python standard library. The repository must also have its normal test runner installed.

Run package self-check:

```bash
python scripts/verify_package.py
python -m unittest tests/test_run_flake_probe.py
```

## Configuration

Edit `config/flake-gate.json` minimally for the repository. `max_probe_runs` is the hard per-probe bound and defaults to 5. `allowed_test_commands` is a prefix allowlist; add only test-runner entry points that are safe for the repository. `evidence_directory` controls where probe artifacts are saved. `quarantine_requires_approval` should remain true. `block_on_new_flaky` and `block_on_consistent_failure` describe the expected CI/agent policy even when orchestration is implemented outside this portable core.

Do not put tokens, credentials, connection strings, or production endpoints in this configuration.

## Permissions

The agent needs read access to repository code and tests, write access only to the configured evidence directory and approved source/test changes, and permission to run the repository's non-production test commands. It does not need production access, secret-management permissions, deployment rights, Git history-rewrite rights, or infrastructure mutation permissions.

## Usage

First preserve the original failing output. Then identify the narrowest command that executes the same failing test. Example for .NET:

```bash
python scripts/run_flake_probe.py \
  --test-id "MyTests.Ordering_is_stable" \
  --command "dotnet test tests/MyTests/MyTests.csproj --filter FullyQualifiedName~Ordering_is_stable" \
  --config config/flake-gate.json
```

Example for pytest:

```bash
python scripts/run_flake_probe.py \
  --test-id "tests/test_orders.py::test_ordering_is_stable" \
  --command "pytest tests/test_orders.py::test_ordering_is_stable -q" \
  --config config/flake-gate.json
```

The probe writes per-run logs plus `runs.json` and `result.json` under `.ai/flake-gate/<safe-test-id>/` by default. Exit code 0 means every probe run passed. Exit code 2 means the probe produced `flaky`, `consistent-failure`, or `tool-failure` and automatic task completion must remain blocked. Exit code 3 indicates invalid configuration. Exit code 4 indicates an unsafe/disallowed command or invalid run count.

A passing bounded probe after a historical first failure is not proof that the failure never existed. Preserve the original failure and continue evidence-based verification.

## Workflow

Follow `workflows/flaky-test-gate.md`. The central sequence is capture → narrow target → bounded probe → classify → investigate → remediate → independent verify → complete. The default probe is at most five runs. Tool/environment repair permits one additional bounded probe. Nondeterminism investigation permits at most two controlled experiment rounds. A failed verification returns once to investigation; a second failed verification stops and escalates.

### Classification contract

Results conform to `schemas/flake-result.schema.json` and use only:

- `passed`: every bounded probe run passed.
- `consistent-failure`: probe runs failed without any passing run, excluding all-tool-error cases.
- `flaky`: at least one pass and at least one failure occurred under materially equivalent probe inputs.
- `tool-failure`: all probe runs were invalidated by tool/runtime timeout handling.
- `inconclusive`: reserved for orchestrators/investigators when evidence cannot safely support another status.

The core script intentionally does not call a test flaky merely because a rerun eventually passed without preserving contradictory evidence.

## Approval boundaries

Explicit human approval is mandatory before adding or widening quarantine/skip/ignore behavior; weakening or deleting assertions; changing CI semantics so failures no longer block; changing shared infrastructure or production configuration; globally increasing timeouts as a workaround; accessing production; destructive data changes; force-push/history rewrites; or other irreversible/security-weakening actions.

The workflow stops before an approval-required action. Lack of approval never turns a failed test into a successful task.

## Failure and recovery

For a deterministic test failure, preserve evidence and leave this workflow for ordinary defect investigation. For a tool/environment failure, preserve logs, repair the environmental cause, and permit one new bounded probe. For an inconclusive result, stop rather than consume more retries. If a hypothesis experiment does not improve evidence after two rounds, escalate with facts, hypotheses, and open questions. If independent verification fails twice, stop and report `not-verified` or `blocked`.

Evidence survives every failure path: first failure output, each run's stdout/stderr, exit code, duration, repository revision, controlled experiment notes, diff reviewed, verification commands, and any approval reference.

## Verification

A task is not complete merely because a test command eventually exits zero. Verification requires the appropriate evidence:

For a root-cause fix, the Verification Agent must inspect the diff, confirm assertions and blocking semantics remain intact, execute the previously flaky target using the configured bounded probe without mixed pass/fail results, and run relevant surrounding tests once. For quarantine, verification must confirm explicit approval, exact scope, owner/removal condition, and that unrelated failures still block.

The package itself is checked with:

```bash
python scripts/verify_package.py
python -m unittest tests/test_run_flake_probe.py
```

## Definition of Done

The first failure is preserved; classification is evidence-backed; retries stayed within configured bounds; facts and hypotheses are separated; any implementation is minimal and scoped; quarantine, if used, has explicit approval, owner, and removal condition; relevant tests have run; the Verification Agent reports `verified`; unresolved risk and open questions are documented; no failure has been hidden by retry, skip, ignore, assertion weakening, or altered CI success semantics.

## Customization

Extend `allowed_test_commands` for the repository's actual runners. Keep probe orchestration tool-neutral: Codex, Claude Code, Cursor, ChatGPT, GitHub Copilot, OpenCode, or another agent can all invoke the same script and consume the JSON result. If a platform supports lifecycle hooks, map its post-test-failure event to `hooks/post-test-flake-gate.md`; keep platform-specific adapters outside the core workflow unless they add concrete value.

For framework-specific diagnosis, add focused skills for known sources such as shared database fixtures, Playwright browser state, async timing, fixed ports, clock/timezone coupling, or random seed management without changing the classification contract or retry bounds.
