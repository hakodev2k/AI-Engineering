# AI PR Review Gate Agent

Reusable AI engineering package for structured pull request review before merge.

## Runtime status

This is a **reference-only gate contract**. It has no executable script and requires no installation. The host must bind the workflow to its PR provider and supply immutable revision context plus repository-native checks.

## Problem
Prevent incomplete, unsafe, or low-quality changes from reaching review by enforcing evidence-based AI review stages.

## Purpose
Provide a repeatable workflow for AI agents to inspect diffs, validate requirements, detect risks, and produce actionable review findings.

## Workflow
Trigger -> Context -> Diff analysis -> Risk review -> Verification -> Human decision

Apply `rules/review-safety.md`, follow `skills/diff-risk-analysis.md` and `workflows/pull-request-review.md`, and use `subagents/verification-agent.md` for independent verification. Emit a result conforming to `schemas/review-result.json`.

## Verification

Validate the result JSON with a Draft 2020-12 JSON Schema validator, replay the workflow on synthetic passing and blocking changes, and verify that merge/approval remains a human decision. A schema-valid report without fresh diff and test evidence is not a pass.

## Safety
The agent can analyze and report. It must not merge, approve, push, change CI rules, or bypass branch protections.

## Done
- Review context collected
- Findings contain evidence
- Verification executed
- Blocking risks identified
