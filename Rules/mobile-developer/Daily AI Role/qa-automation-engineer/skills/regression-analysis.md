# Skill: Regression Impact Analysis

## Purpose
Determine what existing behavior can be broken by a change and select the smallest evidence set that provides acceptable release confidence.

## Trigger
PR/change set, dependency upgrade, schema change, configuration change, hotfix, release candidate.

## Inputs
Diff, dependency graph, test inventory, production usage/critical paths, incidents, feature flags, deployment topology.

## Procedure
1. Identify changed files and semantic behavior changes.
2. Trace callers, consumers, shared libraries, schemas, configuration, and integration contracts.
3. Classify impact: direct, transitive, operational, compatibility, migration, security/permission.
4. Map impacted behavior to existing automated tests and reveal gaps.
5. Select focused tests first, then broader suites based on shared-surface risk.
6. Add targeted regression tests for defect fixes and uncovered high-risk behavior.
7. Record what was not tested and why.
8. Produce a release recommendation: pass, pass-with-known-risk, or block.

## Decision rules
Broaden the suite when a change touches shared infrastructure, serialization, auth, persistence conventions, feature flags, dependency versions, or runtime configuration.

## Evidence
Change-impact map, selected suites, execution results, uncovered risks, defect links, release recommendation.

## Stop conditions
A known critical regression, unverifiable destructive migration, or unresolved security-sensitive behavior blocks release recommendation.
