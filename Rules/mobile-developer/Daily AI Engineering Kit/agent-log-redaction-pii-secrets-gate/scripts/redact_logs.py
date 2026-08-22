#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path
try:
    import yaml
except ImportError:
    print(json.dumps({'status':'error','error':'PyYAML is required: pip install pyyaml'})); sys.exit(3)

PATTERNS={
 'email': r'(?<![\w.+-])[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?![\w.-])',
 'ipv4': r'(?<!\d)(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}(?!\d)',
 'jwt': r'\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b',
 'bearer_token': r'(?i)\bBearer\s+[A-Za-z0-9._~+/-]{12,}={0,2}',
 'api_key': r'(?i)\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|secret)\b\s*[:=]\s*["\']?[A-Za-z0-9._~+/-]{12,}["\']?',
 'connection_string': r'(?i)\b(?:Server|Data Source|Host)\s*=\s*[^;\r\n]+;(?:[^\r\n;]+;){1,12}',
 'credit_card': r'(?<!\d)(?:\d[ -]*?){13,19}(?!\d)',
 'private_key': r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'
}

def luhn_candidate(s):
    digits=''.join(c for c in s if c.isdigit())
    if not 13<=len(digits)<=19: return False
    total=0; parity=len(digits)%2
    for i,ch in enumerate(digits):
        n=int(ch)
        if i%2==parity:
            n*=2
            if n>9:n-=9
        total+=n
    return total%10==0

def main():
    p=argparse.ArgumentParser(description='Redact PII/secrets from text logs. Never sends data externally.')
    p.add_argument('--input',required=True); p.add_argument('--output',required=True); p.add_argument('--policy',required=True); p.add_argument('--report')
    a=p.parse_args()
    try:
        policy=yaml.safe_load(Path(a.policy).read_text(encoding='utf-8')) or {}
        raw=Path(a.input).read_bytes()
        if len(raw)>int(policy.get('max_input_bytes',10485760)):
            raise ValueError('input exceeds max_input_bytes')
        text=raw.decode('utf-8')
    except Exception as e:
        print(json.dumps({'status':'error','error':str(e)})); return 3
    allow=[re.compile(x,re.I|re.M) for x in policy.get('allowlist_patterns',[])]
    enabled=set(policy.get('scan_types',PATTERNS.keys()))
    regexes={k:re.compile(v,re.I|re.M) for k,v in PATTERNS.items() if k in enabled}
    for item in policy.get('custom_patterns',[]):
        if isinstance(item,dict) and item.get('name') and item.get('pattern'):
            regexes[item['name']]=re.compile(item['pattern'],re.I|re.M)
    findings=[]; replacement=policy.get('replacement','[REDACTED:{type}]')
    preserve_lines=bool(policy.get('preserve_line_count',True))
    def redact_one(kind,pattern,current):
        def repl(m):
            val=m.group(0)
            if kind=='credit_card' and not luhn_candidate(val): return val
            if any(x.fullmatch(val) for x in allow): return val
            findings.append({'type':kind,'start':m.start(),'length':len(val)})
            marker=replacement.replace('{type}',kind)
            if preserve_lines:
                marker += '\n' * val.count('\n')
            return marker
        return pattern.sub(repl,current)
    out=text
    for kind,rgx in regexes.items(): out=redact_one(kind,rgx,out)
    Path(a.output).write_text(out,encoding='utf-8')
    counts={}
    for f in findings: counts[f['type']]=counts.get(f['type'],0)+1
    blocked=any(t in set(policy.get('block_on_types',[])) for t in counts)
    result={'status':'blocked_sensitive_input' if blocked else 'sanitized','findings_count':len(findings),'counts':counts,'output':a.output,'raw_persisted':False}
    if a.report:
        limit=int(policy.get('report_sample_limit',20)); safe=dict(result); safe['samples']=findings[:limit]
        Path(a.report).write_text(json.dumps(safe,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(result,indent=2)); return 2 if blocked else 0
if __name__=='__main__': sys.exit(main())
