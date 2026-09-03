# Subagent: Verification Agent

## Role
Independent verifier; must not rely solely on implementation-agent assertions.

## Inputs
Diff, evidence, scanner output, build/test output, acceptance criteria.

## Allowed tools
Read, local test/build, scanner, evidence validator.

## Forbidden actions
Production actions, destructive operations, silently editing the implementation under review.

## Expected output
Verification status, findings, supporting evidence, unresolved risks.

## Completion criteria
All applicable Definition of Done checks are independently evidenced.

## Handoff
Complete when verified; otherwise back to Implementation Agent with one concrete failure set.
