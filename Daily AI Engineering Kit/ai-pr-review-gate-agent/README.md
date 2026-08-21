# AI PR Review Gate Agent

Reusable AI engineering package for structured pull request review before merge.

## Problem
Prevent incomplete, unsafe, or low-quality changes from reaching review by enforcing evidence-based AI review stages.

## Purpose
Provide a repeatable workflow for AI agents to inspect diffs, validate requirements, detect risks, and produce actionable review findings.

## Workflow
Trigger -> Context -> Diff analysis -> Risk review -> Verification -> Human decision

## Safety
The agent can analyze and report. It must not merge, approve, push, change CI rules, or bypass branch protections.

## Done
- Review context collected
- Findings contain evidence
- Verification executed
- Blocking risks identified
