# Untrusted Model Sandbox Rules

## Purpose
Contain risk when inspecting or executing externally sourced or otherwise untrusted ML artifacts.

## Scope
Applies to downloaded checkpoints, model repositories, notebooks, converters, custom operators, and serialization formats capable of executing code.

## MUST
- Inspect untrusted model artifacts in isolated environments with minimal filesystem, network, credential, and cloud access.
- Treat executable serialization, custom code, plugins, and model-loading hooks as code execution risks.
- Scan artifacts and dependencies before introducing them into trusted build or training environments.
- Promote only reviewed, provenance-recorded artifacts through controlled registries.

## MUST NOT
- Load untrusted models on developer workstations or privileged production systems merely to inspect them.
- Mount credential stores, home directories, or production data into an untrusted-model sandbox without explicit necessity.
- Assume a model file is inert because its primary purpose is parameter storage.

## SHOULD
- Prefer non-executable formats and disposable sandbox environments.
- Disable outbound network access unless evaluation specifically requires it.

## Exceptions
Expanded sandbox capability requires documented need, bounded access, monitoring, and approval.

## Verification
Review sandbox policies, runtime privileges, network controls, artifact scans, loader behavior, and promotion evidence.