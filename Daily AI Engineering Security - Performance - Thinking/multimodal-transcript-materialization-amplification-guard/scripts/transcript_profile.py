#!/usr/bin/env python3
import argparse, hashlib, json, re, sys
from pathlib import Path

B64_RE = re.compile(r'^[A-Za-z0-9+/]+={0,2}$')

def walk_strings(obj):
    if isinstance(obj, dict):
        for v in obj.values(): yield from walk_strings(v)
    elif isinstance(obj, list):
        for v in obj: yield from walk_strings(v)
    elif isinstance(obj, str):
        yield obj

def likely_b64(s, min_chars):
    return len(s) >= min_chars and len(s) % 4 == 0 and bool(B64_RE.match(s))

def profile(path, min_digest_chars=4096):
    p=Path(path); total=p.stat().st_size
    largest=lines=image_lines=b64_chars=duplicate_chars=0; seen={}
    with p.open('rb') as fh:
        for raw in fh:
            lines += 1; largest=max(largest,len(raw))
            try: obj=json.loads(raw)
            except Exception as e: raise ValueError(f'invalid JSONL at line {lines}: {e}')
            found=False
            for s in walk_strings(obj):
                if likely_b64(s,min_digest_chars):
                    found=True; b64_chars += len(s)
                    d=hashlib.sha256(s.encode('ascii')).hexdigest()
                    if d in seen: duplicate_chars += len(s)
                    seen[d]=seen.get(d,0)+1
            image_lines += int(found)
    return {
        'transcript_bytes': total,
        'lines': lines,
        'largest_line_bytes': largest,
        'image_bearing_lines': image_lines,
        'base64_chars': b64_chars,
        'decoded_binary_bytes_estimate': int(b64_chars*0.75),
        'base64_ratio': (b64_chars/total) if total else 0.0,
        'duplicate_payload_ratio': (duplicate_chars/b64_chars) if b64_chars else 0.0,
        'unique_large_payloads': len(seen)
    }

def evaluate(prof,budget):
    projected=int(prof['transcript_bytes']*float(budget.get('materialization_multiplier',1.0)))
    prof['projected_materialization_bytes']=projected
    violations=[]
    checks=[('max_transcript_bytes',prof['transcript_bytes']),('max_largest_line_bytes',prof['largest_line_bytes']),('max_base64_ratio',prof['base64_ratio']),('max_duplicate_payload_ratio',prof['duplicate_payload_ratio']),('max_projected_materialization_bytes',projected)]
    for key,value in checks:
        if key in budget and value > budget[key]: violations.append({'budget':key,'value':value,'limit':budget[key]})
    return violations

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('transcript'); ap.add_argument('--budget'); args=ap.parse_args()
    try:
        budget=json.loads(Path(args.budget).read_text(encoding='utf-8')) if args.budget else {}
        prof=profile(args.transcript,int(budget.get('min_digest_chars',4096)))
        violations=evaluate(prof,budget) if budget else []
        print(json.dumps({'status':'BLOCK' if violations else 'PASS','profile':prof,'violations':violations},indent=2))
        return 2 if violations else 0
    except Exception as e:
        print(f'error: {e}',file=sys.stderr); return 1

if __name__=='__main__': raise SystemExit(main())