# Incident Timeline Rules

## Purpose
Maintain an evidence-based chronological record that supports coordination, audit, and learning.

## Scope
Detection, declarations, observations, decisions, actions, communications, approvals, and recovery milestones.

## MUST
- Record material events with timestamps, actor or source, action or observation, and outcome when known.
- Distinguish event occurrence time from discovery or documentation time when they differ.
- Preserve corrections rather than silently rewriting consequential historical entries.
- Include production changes, command transitions, severity changes, and customer-impact milestones.

## MUST NOT
- Backfill uncertain timestamps as exact facts.
- Include secrets or unnecessary personal data in the timeline.

## SHOULD
- Automate ingestion of reliable deployment, alert, and change events while preserving human context for decisions.

## Exceptions
During extreme response load, minimal notes may be expanded afterward, but reconstructed entries MUST be labeled as reconstructed where precision is uncertain.

## Verification
Compare timeline entries against telemetry timestamps, audit logs, deployments, communications, and change records.