#!/usr/bin/env python3
import argparse, hashlib, json, pathlib, re, sys

EXTS={'.py','.cs','.ts','.tsx','.js','.jsx','.java','.kt'}
ASSERT_MARKERS=('assert','Assert.','Should(','ShouldBe','expect(','toBe(','toEqual(','AreEqual(','Equal(')
LITERAL_RE=re.compile(r"(?P<q>['\"])(?P<s>(?:\\.|(?!\1).)*)\1|\b-?\d+(?:\.\d+)?\b|\b(?:true|false|null|None)\b")
IDENT_RE=re.compile(r'\b[A-Za-z_][A-Za-z0-9_]*\b')

def stable_id(path,line,text):
    return hashlib.sha256(f'{path}:{line}:{text.strip()}'.encode()).hexdigest()[:16]

def scan_file(root,path):
    rel=path.relative_to(root).as_posix()
    try: lines=path.read_text(encoding='utf-8',errors='replace').splitlines()
    except OSError: return []
    out=[]
    for n,line in enumerate(lines,1):
        if not any(m in line for m in ASSERT_MARKERS): continue
        literals=[]
        for m in LITERAL_RE.finditer(line):
            literals.append(m.group(0))
        identifiers=sorted(set(IDENT_RE.findall(line)))
        out.append({'id':stable_id(rel,n,line),'file':rel,'line':n,'text':line.strip(),'literals':literals,'identifiers':identifiers})
    return out

p=argparse.ArgumentParser()
p.add_argument('--repo',default='.')
p.add_argument('--output',required=True)
p.add_argument('--include',action='append',default=[])
a=p.parse_args()
root=pathlib.Path(a.repo).resolve()
if not (root/'.git').exists():
    print('repo-must-be-git-worktree',file=sys.stderr); raise SystemExit(2)
files=[]
if a.include:
    for item in a.include:
        candidate=(root/item).resolve()
        if root not in candidate.parents and candidate!=root:
            print(f'path-outside-repo:{item}',file=sys.stderr); raise SystemExit(2)
        if candidate.is_file(): files.append(candidate)
        elif candidate.is_dir(): files.extend(x for x in candidate.rglob('*') if x.is_file() and x.suffix in EXTS)
else:
    for x in root.rglob('*'):
        if not x.is_file() or x.suffix not in EXTS: continue
        rel=x.relative_to(root).parts
        if any(d in {'.git','node_modules','bin','obj','dist','build','coverage'} for d in rel): continue
        low=x.name.lower()
        if any(k in low for k in ('test','spec')): files.append(x)
assertions=[]
for f in sorted(set(files)): assertions.extend(scan_file(root,f))
result={'version':'1.0.0','repo':str(root),'assertions':assertions,'count':len(assertions)}
pathlib.Path(a.output).write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps({'count':len(assertions),'output':a.output}))
