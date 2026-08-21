# Engineering Rules

## MUST
1. **MUST authorize canonical filesystem identity, not lexical path alone.**
2. **MUST resolve the nearest existing ancestor** for write targets that do not yet exist.
3. **MUST reject canonical targets outside configured writable roots** unless an explicit human-approved exception exists.
4. **MUST treat runtime-managed, credential, configuration, and other protected roots as non-writable by agents.**
5. **MUST revalidate parent and target identity immediately before mutation.**
6. **MUST treat any identity drift between preflight and commit as a new operation requiring new authorization.**
7. **MUST record lexical path, canonical path, operation, matched root, symlink transitions, decision, and reason.**
8. **MUST scan new workspaces/worktrees for escaping aliases before enabling autonomous writes.**
9. **MUST fail closed when canonicalization or metadata inspection required for safety cannot be completed.**
10. **MUST keep incident evidence before repairing suspected runtime corruption.**
11. **MUST require independent verification before resuming after a protected-root mutation incident.**
12. **MUST use bounded retries.** Maximum automatic re-preflight attempts after benign race: 1.

## MUST NOT
1. **MUST NOT use `startswith()`/string-prefix checks as the sole root-boundary test.**
2. **MUST NOT consider `..` removal or path normalization equivalent to canonicalization.**
3. **MUST NOT assume a path that was safe at task start remains safe later.**
4. **MUST NOT globally disable symlink protection to fix a legitimate symlinked workspace.**
5. **MUST NOT follow repository-controlled symlinks into protected roots for write operations.**
6. **MUST NOT allow a shell redirection, patch helper, temp-file rename, or Git helper to bypass the same path gate used by direct file tools.**
7. **MUST NOT execute a runtime wrapper suspected of self-recursion or tampering during investigation.**
8. **MUST NOT auto-repair a protected runtime from untrusted workspace content.**
9. **MUST NOT ignore broken symlinks on mutation paths when policy requires their rejection.**
10. **MUST NOT downgrade a deny to allow because a model claims the path is safe.**

## SHOULD
1. **SHOULD prefer descriptor-relative/no-follow primitives** (`openat`/`O_NOFOLLOW` or platform equivalent) for high-risk writes when the host implementation supports them.
2. **SHOULD isolate managed agent runtimes from ordinary same-user writable workspace namespaces.**
3. **SHOULD verify protected runtime artifacts against trusted manifests/hashes after suspicious events.**
4. **SHOULD support explicitly configured symlinked workspace roots** by validating both lexical alias and canonical root.
5. **SHOULD surface path-denial details to developers without exposing secrets.**
6. **SHOULD regression-test Git worktree, `.git` indirection, absolute/relative symlinks, parent swaps, broken links, and temporary wrapper aliases.**
7. **SHOULD measure guard overhead and false-positive rate** so safety controls remain usable.

## Observable enforcement
| Rule | Observable check |
|---|---|
| Canonical boundary | Decision record contains lexical + canonical path |
| Root containment | `matched_root` is non-null for every allowed write |
| Protected paths | Protected-root fixtures exit non-zero |
| TOCTOU protection | Parent-swap fixture fails commit-check |
| Bounded retries | Retry counter <= 1 |
| Incident recovery | Resume requires verifier status `verified` |
