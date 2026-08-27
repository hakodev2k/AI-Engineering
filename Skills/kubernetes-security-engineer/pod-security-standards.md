# Pod Security Standards

## Purpose
Apply Kubernetes Pod Security Standards to reduce workload escape and host-compromise risk.

## When to use
Use when defining namespace policy, onboarding workloads, reviewing manifests, or migrating from permissive pod settings.

## Inputs
Workload manifests, namespace labels/policies, runtime requirements, exception inventory, and platform constraints.

## Preconditions
Establish workload owners and test environments. Understand which workloads legitimately require elevated privileges.

## Context to inspect
Inspect privileged mode, capabilities, host namespaces, hostPath, runAs settings, seccomp, privilege escalation, volume types, sysctls, and Windows/Linux differences.

## Core knowledge
Baseline blocks common privilege risks; Restricted provides stronger hardening but may require workload changes. Enforcement should be paired with warn/audit modes during migration.

## Procedure
1. Inventory namespace and workload security contexts.
2. Classify workloads against Baseline and Restricted.
3. Identify violations and business justification.
4. Remove unnecessary privilege and capabilities.
5. Configure non-root execution and seccomp where supported.
6. Introduce warn/audit policy.
7. Remediate violations.
8. Enable enforcement at the strongest practical level.
9. Track narrow, time-bound exceptions.

## Decision points
Choose Restricted by default for ordinary applications; use Baseline only where justified. Isolate workloads needing host access rather than weakening policy cluster-wide.

## Common failure patterns
Global exemptions; enforcing without compatibility testing; assuming non-root UID alone prevents privilege escalation; leaving capabilities implicit.

## Verification
Confirm policy rejects known-invalid manifests and approved workloads deploy successfully. Audit namespaces for drift.

## Expected output
Enforced namespace policy, hardened workload settings, documented exceptions, and validation evidence.

## Stop conditions
Escalate when a workload requires host-level privilege with unclear isolation or ownership.