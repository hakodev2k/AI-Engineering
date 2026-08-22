#!/usr/bin/env python3
import argparse, json, pathlib, re, sys

def main():
    p=argparse.ArgumentParser(description='Detect likely .NET streaming endpoints that do not propagate cancellation.')
    p.add_argument('root', nargs='?', default='.')
    p.add_argument('--json', action='store_true')
    a=p.parse_args(); root=pathlib.Path(a.root)
    if not root.exists(): print('root not found', file=sys.stderr); return 2
    findings=[]
    method=re.compile(r'(?P<sig>(?:public|private|protected|internal)[^{;\n]*(?:IAsyncEnumerable|Task|ValueTask)[^{;\n]*\([^)]*\))', re.M)
    stream=re.compile(r'(IAsyncEnumerable<|WriteAsync\(|FlushAsync\(|ReadAllAsync\(|SendAsync\()')
    for f in root.rglob('*.cs'):
        if any(x in f.parts for x in ('bin','obj','.git')): continue
        try: text=f.read_text(encoding='utf-8')
        except UnicodeDecodeError: continue
        for m in method.finditer(text):
            sig=m.group('sig')
            body=text[m.end():m.end()+5000]
            if stream.search(sig+body) and 'CancellationToken' not in sig:
                line=text.count('\n',0,m.start())+1
                findings.append({'file':str(f),'line':line,'kind':'missing-cancellation-parameter','signature':' '.join(sig.split())[:300]})
            elif stream.search(sig+body) and re.search(r'CancellationToken\.None|new\s+CancellationToken\s*\(\s*\)', body):
                line=text.count('\n',0,m.start())+1
                findings.append({'file':str(f),'line':line,'kind':'cancellation-not-propagated','signature':' '.join(sig.split())[:300]})
    if a.json: print(json.dumps({'findings':findings,'count':len(findings)},indent=2))
    else:
        for x in findings: print(f"{x['file']}:{x['line']}: {x['kind']}")
        print(f'findings={len(findings)}')
    return 1 if findings else 0

if __name__=='__main__': sys.exit(main())
