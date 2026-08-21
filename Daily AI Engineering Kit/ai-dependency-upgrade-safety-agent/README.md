# AI Dependency Upgrade Safety Agent

Reusable package for AI-assisted dependency upgrades with bounded planning, compatibility checks, and verification.

## Problem
Dependency upgrades often introduce hidden breaking changes, security regressions, migration work, or runtime failures.

## Purpose
Provide a repeatable agent workflow that investigates, plans, executes, and verifies upgrades safely.

## Workflow
Trigger -> Inventory -> Risk analysis -> Plan -> Upgrade -> Validate -> Review -> Complete

## Safety
No production deployment, lockfile replacement, breaking API migration, or major infrastructure change without approval.

## Definition of Done
- Upgrade impact analyzed
- Changes verified
- Tests passed
- Risks documented
