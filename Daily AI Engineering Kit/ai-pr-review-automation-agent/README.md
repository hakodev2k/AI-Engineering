# AI PR Review Automation Agent

Reusable AI engineering kit for bounded pull request reviews.

## Runtime status

This directory is a **concept/reference package** containing only this document. It has no scripts, rules, workflow adapter, tests, or installation step. Do not advertise it as an enforced PR gate until those host-specific pieces exist.

Purpose: combine AI analysis with deterministic validation to reduce review effort while preserving human approval.

## Purpose

Describe the minimum bounded stages and safety constraints for a future host-specific PR review automation.

## Usage
Trigger on pull request creation or update.

Stages: context collection -> planning -> specialized review -> verification -> report.

Minimum host integration inputs are the immutable base/head revisions, complete diff, repository instructions, acceptance criteria, changed-file ownership, and build/test evidence. The output should separate blocking findings, advisory findings, verification performed, checks not run, and residual risk.

## Verification

Rehearse on known-good and intentionally defective synthetic changes. Confirm that evidence locations resolve to the reviewed revision, deterministic failures remain blocking, duplicate findings are consolidated, and the automation cannot merge or approve. Until that replay passes, treat this package as guidance only.

## Safety
Never merge, deploy, change secrets, or modify production configuration automatically.
