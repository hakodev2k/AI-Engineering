# Rebinding Security Rules

- The system MUST model source and target execution environments explicitly before rebinding.
- The system MUST inventory cwd, workspace roots, writable roots, sandbox roots/policy, permission profile, shell/runtime metadata, host-skill paths, project binding, and structured rollout/world-state paths.
- The system MUST NOT execute a persisted thread when critical structured state contains mixed source/target runtime provenance.
- The system MUST use explicit path mappings; it MUST NOT infer arbitrary cross-filesystem mappings from string concatenation.
- The system MUST reject malformed conversions such as a mounted POSIX path being prefixed by an unrelated Windows drive.
- Writable/sandbox permissions MUST remain equal or narrower after automatic migration.
- Any permission expansion MUST require explicit human approval and a recorded rationale.
- Migration MUST be preceded by a recoverable backup or snapshot.
- Migration across multiple stores MUST be treated as one logical transaction: partial success MUST NOT be reported as complete.
- The system MUST validate destination path existence/ownership or classify why validation is intentionally deferred.
- The system MUST preserve conversation/history content unless a structured execution field specifically requires transformation.
- The system MUST NOT globally search-and-replace path-like text inside user/model prose.
- Post-migration verification MUST run independently from the component that applied mutations.
- A failed verification MUST block resume under the target runtime.
- Automatic retries MUST be bounded to two migration-plan revisions.
- Logs and reports MUST redact credentials and MUST NOT print secret-bearing environment variables.