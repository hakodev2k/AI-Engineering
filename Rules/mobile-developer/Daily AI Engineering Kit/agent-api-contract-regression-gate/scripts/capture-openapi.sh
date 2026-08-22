#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <source-file-or-http-url> <output-json>" >&2
}

if [[ $# -ne 2 ]]; then
  usage
  exit 64
fi

source_ref="$1"
output="$2"

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 is required" >&2
  exit 69
fi

mkdir -p "$(dirname "$output")"
tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

case "$source_ref" in
  http://*|https://*)
    if ! command -v curl >/dev/null 2>&1; then
      echo "error: curl is required for URL sources" >&2
      exit 69
    fi
    # Authentication, when required, should be supplied through externally
    # configured curl mechanisms; this script never persists credentials.
    curl --fail --silent --show-error --location \
      --connect-timeout 10 --max-time 60 \
      "$source_ref" -o "$tmp"
    ;;
  *)
    if [[ ! -f "$source_ref" ]]; then
      echo "error: source file not found: $source_ref" >&2
      exit 66
    fi
    cp "$source_ref" "$tmp"
    ;;
esac

python3 - "$tmp" "$output" <<'PY'
import json
import pathlib
import sys

src = pathlib.Path(sys.argv[1])
dst = pathlib.Path(sys.argv[2])
text = src.read_text(encoding="utf-8")

try:
    data = json.loads(text)
except json.JSONDecodeError:
    try:
        import yaml  # type: ignore
    except ImportError as exc:
        raise SystemExit("error: input is not JSON; install PyYAML for YAML OpenAPI input") from exc
    data = yaml.safe_load(text)

if not isinstance(data, dict):
    raise SystemExit("error: OpenAPI root must be an object")
if not isinstance(data.get("paths"), dict):
    raise SystemExit("error: OpenAPI document must contain an object-valued 'paths' field")
if not ("openapi" in data or "swagger" in data):
    raise SystemExit("error: document does not declare 'openapi' or 'swagger'")

dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")
PY

echo "captured: $output"
