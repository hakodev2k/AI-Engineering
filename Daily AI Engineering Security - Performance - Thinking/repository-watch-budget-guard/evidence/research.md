# Research

## Topic
Repository Watch Budget Guard

## Category
Performance

## Problem
AI coding clients can recursively watch far more repository paths than needed, exhausting Linux inotify limits and degrading the whole desktop session.

## Why it matters now
On 2026-08-19, openai/codex#39473 reported 65,082 watches out of a 65,536 limit in Codex Desktop, including `.venv`, caches, and Git internals, plus 118 watcher starts in about 20 minutes. An independent open issue, #23574, measured roughly 1.15M watches in the VS Code extension host and desktop-wide `ENOSPC` failures.

## Affected users
Developers using AI coding agents on Linux, especially large repositories, generated trees, virtual environments, submodules, and multiple concurrent tasks.

## Current public evidence
### Observed evidence
- https://github.com/openai/codex/issues/39473 — standalone desktop, 65,082/65,536 watches; unnecessary `.venv`, `__pycache__`, `.git/objects`, submodule paths.
- https://github.com/openai/codex/issues/23574 — VS Code extension, ~1.15M extension-host watches; configured VS Code watcher exclusions were not sufficient.
- Linux/Git documentation notes that Linux fsmonitor uses inotify and that per-user watch limits can be exhausted: https://www.kernel.org/pub/software/scm/git/docs/git-fsmonitor--daemon.html
- Linux documents inotify as a shared per-user resource and exposes watch state through `/proc`: https://www.kernel.org/doc/html/latest/filesystems/inotify.html

## Existing approaches
Raise `fs.inotify.max_user_watches`, configure editor excludes, disable selected features, reload the client, or move large trees outside the real workspace.

## Remaining limitations
Raising the kernel limit masks unbounded allocation and increases memory consumption; editor excludes may not apply to agent-owned watchers; reloads are temporary; moving directories is intrusive. None establishes a per-agent budget or verifies watcher release.

## Root-cause analysis
1. Recursive watch scope includes dependency/cache/generated/Git-internal trees.
2. Multiple tasks may create overlapping watchers instead of sharing them.
3. Watch creation is not gated against current per-user headroom.
4. Lifecycle/release is difficult to verify from normal app telemetry.
5. Failures occur only near global exhaustion, after collateral damage begins.

## Improvement opportunity
Measure real inotify usage before watcher startup, enforce a configurable per-process/user budget, exclude low-value trees by default, reuse watchers by canonical repository root, and degrade to bounded polling when safe headroom is unavailable.

## Goal / Metrics / Trigger / Inputs / Outputs
Goal: prevent agent-owned watchers from exhausting shared system limits. Metrics: watch count, instances, percentage of limit, startup count, release delta, ENOSPC count, polling fallback rate. Trigger: repository watcher start or task attachment. Inputs: `/proc`, inotify sysctls, PID scope, repository roots. Outputs: budget decision, baseline/after metrics, BLOCK/FALLBACK/PASS status.