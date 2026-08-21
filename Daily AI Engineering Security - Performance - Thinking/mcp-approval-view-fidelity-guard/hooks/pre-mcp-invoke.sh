#!/usr/bin/env sh
set -eu
# Invocation-time TOCTOU hook. Re-read/export the current descriptor before calling this hook.
# Usage: pre-mcp-invoke.sh current-descriptor.json approval.json server-id
DESCRIPTOR=${1:?current descriptor required}
APPROVAL=${2:?approval record required}
SERVER=${3:?server identity required}
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
python3 "$ROOT/scripts/mcp_descriptor_guard.py" verify "$DESCRIPTOR" "$APPROVAL" --server "$SERVER"
