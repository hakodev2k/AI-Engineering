#!/usr/bin/env python3
"""Budget, spill, extract, rehydrate, and analyze large agent tool outputs.

Standard library only.
Exit codes: 0 success, 2 invalid input/policy, 3 integrity/security failure, 4 I/O failure.
"""
from __future__ import annotations
import argparse, hashlib, json, os, re, sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def read_json(path: str) -> dict[str, Any]:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            v = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        raise ValueError(f'cannot read JSON {path}: {e}') from e
    if not isinstance(v, dict):
        raise ValueError('JSON root must be object')
    return v


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def approx_tokens(text: str) -> int:
    return max(1, (len(text) + 3) // 4)


def safe_spill_root(policy: dict[str, Any]) -> Path:
    root = Path(str(policy.get('spill_directory', '.agent-tool-output-spill'))).resolve()
    root.mkdir(parents=True, exist_ok=True)
    return root


def numbered(lines: list[str], indexes: list[int]) -> list[dict[str, Any]]:
    return [{'line': i + 1, 'text': lines[i]} for i in indexes]


def extract_lines(text: str, policy: dict[str, Any]) -> tuple[list[dict[str, Any]], int]:
    lines = text.splitlines()
    n = len(lines)
    head = max(0, int(policy.get('head_lines', 40)))
    tail = max(0, int(policy.get('tail_lines', 40)))
    limit = max(0, int(policy.get('priority_match_limit', 120)))
    patterns = [str(x).lower() for x in policy.get('priority_patterns', [])]
    chosen: set[int] = set(range(min(head, n)))
    chosen.update(range(max(0, n - tail), n))
    matches = 0
    for i, line in enumerate(lines):
        if matches >= limit:
            break
        low = line.lower()
        if any(p in low for p in patterns):
            if i not in chosen:
                chosen.add(i)
                matches += 1
    ordered = sorted(chosen)
    return numbered(lines, ordered), max(0, n - len(ordered))


def make_event(tool: str, raw_b: int, visible_b: int, mode: str, artifact: str | None) -> dict[str, Any]:
    return {
        'ts': datetime.now(timezone.utc).isoformat(), 'tool': tool, 'mode': mode,
        'raw_bytes': raw_b, 'visible_bytes': visible_b,
        'reduction_ratio': round(1 - (visible_b / raw_b), 6) if raw_b else 0,
        'artifact': artifact,
    }


def cmd_guard(a: argparse.Namespace) -> int:
    policy = read_json(a.policy)
    try:
        raw = Path(a.input).read_bytes()
    except OSError as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr); return 4
    hard = int(policy.get('hard_raw_bytes_limit', 50 * 1024 * 1024))
    if len(raw) > hard:
        print(json.dumps({'error': 'raw output exceeds hard_raw_bytes_limit', 'raw_bytes': len(raw)}), file=sys.stderr); return 3
    try:
        text = raw.decode('utf-8')
    except UnicodeDecodeError:
        text = ''
    budget = int(policy.get('model_visible_token_budget', 6000))
    if text and approx_tokens(text) <= budget:
        envelope = {'mode': 'pass-through', 'tool': a.tool_name, 'spilled': False,
                    'raw_bytes': len(raw), 'raw_lines': len(text.splitlines()),
                    'approx_tokens': approx_tokens(text), 'content': text}
        out = json.dumps(envelope, ensure_ascii=False, indent=2)
        Path(a.output).write_text(out + '\n', encoding='utf-8')
        if a.events:
            with open(a.events, 'a', encoding='utf-8') as f: f.write(json.dumps(make_event(a.tool_name, len(raw), len(out.encode()), 'pass-through', None))+'\n')
        return 0
    root = safe_spill_root(policy)
    digest = sha256_bytes(raw)
    suffix = '.txt' if text else '.bin'
    artifact = root / f'{digest}{suffix}'
    try:
        if not artifact.exists():
            tmp = artifact.with_suffix(artifact.suffix + '.tmp')
            tmp.write_bytes(raw); os.replace(tmp, artifact)
    except OSError as e:
        print(json.dumps({'error': f'spill write failed: {e}'}), file=sys.stderr); return 4
    if sha256_bytes(artifact.read_bytes()) != digest:
        print(json.dumps({'error': 'artifact integrity verification failed'}), file=sys.stderr); return 3
    extracted, omitted = extract_lines(text, policy) if text else ([], 0)
    envelope = {
        'mode': 'spill', 'tool': a.tool_name, 'spilled': True,
        'raw_bytes': len(raw), 'raw_lines': len(text.splitlines()) if text else None,
        'raw_approx_tokens': approx_tokens(text) if text else None,
        'artifact': str(artifact), 'sha256': digest,
        'extracted_lines': extracted, 'omitted_lines': omitted,
        'notice': 'Full raw tool output is externalized. Extracted content is incomplete; rehydrate targeted ranges when needed.'
    }
    out = json.dumps(envelope, ensure_ascii=False, indent=2)
    # If envelope itself is too large, progressively reduce extracted evidence deterministically.
    while approx_tokens(out) > budget and len(envelope['extracted_lines']) > 10:
        envelope['extracted_lines'] = envelope['extracted_lines'][:len(envelope['extracted_lines']) // 2]
        envelope['omitted_lines'] = (envelope['raw_lines'] or 0) - len(envelope['extracted_lines'])
        out = json.dumps(envelope, ensure_ascii=False, indent=2)
    if approx_tokens(out) > budget:
        print(json.dumps({'error': 'cannot build model-visible envelope within token budget'}), file=sys.stderr); return 3
    Path(a.output).write_text(out + '\n', encoding='utf-8')
    if a.events:
        with open(a.events, 'a', encoding='utf-8') as f: f.write(json.dumps(make_event(a.tool_name, len(raw), len(out.encode()), 'spill', str(artifact)))+'\n')
    return 0


def ensure_under_root(path: Path, root: Path) -> bool:
    try:
        path.resolve().relative_to(root.resolve()); return True
    except ValueError:
        return False


def cmd_rehydrate(a: argparse.Namespace) -> int:
    policy = read_json(a.policy); root = safe_spill_root(policy); p = Path(a.artifact)
    if not ensure_under_root(p, root):
        print(json.dumps({'error': 'artifact path escapes spill root'}), file=sys.stderr); return 3
    try: raw = p.read_bytes()
    except OSError as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr); return 4
    actual = sha256_bytes(raw)
    if actual.lower() != a.sha256.lower():
        print(json.dumps({'error': 'sha256 mismatch', 'actual': actual}), file=sys.stderr); return 3
    try: text = raw.decode('utf-8')
    except UnicodeDecodeError:
        print(json.dumps({'error': 'artifact is not UTF-8 text; targeted text rehydrate unavailable'}), file=sys.stderr); return 2
    lines = text.splitlines(); max_lines = int(policy.get('rehydrate_max_lines', 500)); max_bytes = int(policy.get('rehydrate_max_bytes', 262144))
    selected: list[int] = []
    if a.search:
        needle = a.search.lower()
        for i, line in enumerate(lines):
            if needle in line.lower():
                for j in range(max(0, i-a.context), min(len(lines), i+a.context+1)): selected.append(j)
        selected = sorted(set(selected))[:max_lines]
    else:
        start = max(1, a.start_line or 1); end = min(len(lines), a.end_line or min(len(lines), start + max_lines - 1))
        if end < start: print(json.dumps({'error': 'end-line before start-line'}), file=sys.stderr); return 2
        selected = list(range(start-1, min(end, start-1+max_lines)))
    items = numbered(lines, selected); result = {'artifact': str(p), 'sha256': actual, 'lines': items, 'truncated_by_limit': False}
    encoded = json.dumps(result, ensure_ascii=False, indent=2).encode()
    while len(encoded) > max_bytes and result['lines']:
        result['lines'] = result['lines'][:max(1, len(result['lines'])//2)]; result['truncated_by_limit'] = True
        encoded = json.dumps(result, ensure_ascii=False, indent=2).encode()
    print(encoded.decode()); return 0


def cmd_analyze(a: argparse.Namespace) -> int:
    total = raw = visible = spills = passthrough = 0
    try:
        with open(a.events, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip(): continue
                e = json.loads(line); total += 1; raw += int(e.get('raw_bytes',0)); visible += int(e.get('visible_bytes',0))
                spills += e.get('mode') == 'spill'; passthrough += e.get('mode') == 'pass-through'
    except (OSError, json.JSONDecodeError) as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr); return 2
    print(json.dumps({'events': total, 'spills': spills, 'pass_through': passthrough, 'raw_bytes': raw, 'visible_bytes': visible,
                      'reduction_ratio': round(1-(visible/raw),6) if raw else 0}, indent=2)); return 0


def parser() -> argparse.ArgumentParser:
    p=argparse.ArgumentParser(); s=p.add_subparsers(dest='cmd', required=True)
    g=s.add_parser('guard'); g.add_argument('--input',required=True); g.add_argument('--tool-name',required=True); g.add_argument('--policy',required=True); g.add_argument('--output',required=True); g.add_argument('--events'); g.set_defaults(func=cmd_guard)
    r=s.add_parser('rehydrate'); r.add_argument('--artifact',required=True); r.add_argument('--sha256',required=True); r.add_argument('--policy',required=True); r.add_argument('--start-line',type=int); r.add_argument('--end-line',type=int); r.add_argument('--search'); r.add_argument('--context',type=int,default=2); r.set_defaults(func=cmd_rehydrate)
    n=s.add_parser('analyze'); n.add_argument('--events',required=True); n.set_defaults(func=cmd_analyze)
    return p


def main() -> int:
    try:
        a=parser().parse_args(); return int(a.func(a))
    except ValueError as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr); return 2
    except OSError as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr); return 4

if __name__=='__main__': raise SystemExit(main())
