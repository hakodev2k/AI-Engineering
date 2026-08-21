#!/usr/bin/env bash
set -euo pipefail

MODE="${1:---preflight}"

if [[ "$MODE" != "--preflight" && "$MODE" != "--verify" ]]; then
  echo "Usage: $0 [--preflight|--verify]" >&2
  exit 64
fi

if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git is required." >&2
  exit 69
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: run from inside a git working tree." >&2
  exit 66
fi

if ! command -v dotnet >/dev/null 2>&1; then
  echo "ERROR: dotnet SDK is required." >&2
  exit 69
fi

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

echo "Repository: $ROOT"
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "Working tree changes:"
git status --short || true

echo "dotnet: $(dotnet --version)"

mapfile -t SOLUTIONS < <(find . -maxdepth 3 -type f -name '*.sln' -not -path './.git/*' | sort)
mapfile -t PROJECTS < <(find . -maxdepth 3 -type f -name '*.csproj' -not -path './.git/*' | sort)

if [[ ${#SOLUTIONS[@]} -eq 0 && ${#PROJECTS[@]} -eq 0 ]]; then
  echo "ERROR: no .sln or .csproj found within depth 3." >&2
  exit 65
fi

if [[ "$MODE" == "--preflight" ]]; then
  echo "Preflight passed. No repository changes were made."
  exit 0
fi

TARGET="${DOTNET_TARGET:-}"
if [[ -z "$TARGET" ]]; then
  if [[ ${#SOLUTIONS[@]} -eq 1 ]]; then
    TARGET="${SOLUTIONS[0]}"
  elif [[ ${#PROJECTS[@]} -eq 1 ]]; then
    TARGET="${PROJECTS[0]}"
  else
    echo "ERROR: multiple build targets found. Set DOTNET_TARGET to a .sln or .csproj path." >&2
    printf 'Solutions:\n'; printf '  %s\n' "${SOLUTIONS[@]:-}"
    printf 'Projects:\n'; printf '  %s\n' "${PROJECTS[@]:-}"
    exit 64
  fi
fi

if [[ ! -f "$TARGET" ]]; then
  echo "ERROR: DOTNET_TARGET does not exist: $TARGET" >&2
  exit 66
fi

echo "Target: $TARGET"

echo "== dotnet format check =="
dotnet format "$TARGET" --verify-no-changes --no-restore

echo "== dotnet build =="
dotnet build "$TARGET" --no-restore

echo "== dotnet test =="
if [[ -n "${DOTNET_TEST_FILTER:-}" ]]; then
  dotnet test "$TARGET" --no-build --filter "$DOTNET_TEST_FILTER"
else
  dotnet test "$TARGET" --no-build
fi

echo "== final diff =="
git diff --check
git diff --stat

echo "Verification commands passed. Query-specific performance verification is still required by the workflow."
