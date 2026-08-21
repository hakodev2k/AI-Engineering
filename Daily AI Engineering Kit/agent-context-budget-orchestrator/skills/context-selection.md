# Skill: Context Selection

## Purpose

Select the smallest set of repository and runtime evidence needed to answer the current engineering decision questions.

## When to use

Use at task start, after a major hypothesis change, after significant edits, and whenever the agent requests more context.

## Inputs

- task statement;
- current hypotheses/questions;
- repository structure;
- existing `context-ledger.json`, if any;
- changed files since the last checkpoint.

## Preconditions

- task goal is known;
- repository is accessible;
- no destructive action is required for exploration.

## Process

1. Rewrite the task into concrete decision questions.
2. Identify likely entry points using names, routes, handlers, commands, jobs, schemas, tests, logs, or symbols from the task.
3. For each candidate source, state why it may answer a decision question before reading it.
4. Read the narrowest useful range first rather than whole directories.
5. Trace callers/callees only while they materially affect a decision question.
6. Classify retained evidence:
   - `critical`: required to justify implementation or final claims;
   - `supporting`: useful but replaceable by summary;
   - `reference`: orientation only;
   - `discardable`: explored but no longer useful.
7. Record source path or stable identifier, purpose, summary, freshness marker, and reread condition in the ledger.
8. Prefer targeted expansion over broad loading when a gap remains.
9. Stop gathering context when every current decision question has enough evidence to act safely.

## Tools

May use repository search, file reads, code navigation, Git history, test output, logs, documentation, and read-only external tools approved for the task.

## Constraints

- Do not load an entire repository merely for orientation.
- Do not retain duplicate evidence under multiple ledger entries.
- Do not infer unseen file contents.
- Do not retain secrets or credentials in summaries.
- Exact contract/schema/security values remain exact when compression would change meaning.

## Expected output

An updated `context-ledger.json` with active evidence tied to explicit decision questions.

## Verification

Confirm that:

- every critical ledger item has a source identifier;
- every active item states why it is needed;
- no unresolved decision question is falsely marked answered;
- obsolete context is retired or marked stale.

## Failure handling

If search returns too much noise, retry with one narrower symbol or call-path constraint. Retry at most twice with different search strategies. If evidence remains unavailable, record the gap and stop the affected reasoning branch.

## Stop conditions

Stop selection when:

- all current decision questions are evidence-backed; or
- a required source is unavailable and further search cannot safely resolve it; or
- additional context would only duplicate existing evidence.
