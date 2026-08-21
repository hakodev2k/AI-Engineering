#!/usr/bin/env python3
import argparse, datetime as dt, json, os, re, sys, urllib.parse, urllib.request
from pathlib import Path

EXIT_ALLOW=0; EXIT_REVIEW=2; EXIT_DENY=3; EXIT_ERROR=4

def load_json(path):
    with open(path, encoding='utf-8') as f: return json.load(f)

def now_utc(): return dt.datetime.now(dt.timezone.utc)
def parse_time(v):
    if not v: return None
    return dt.datetime.fromisoformat(v.replace('Z','+00:00'))

def request_json(url, timeout, max_bytes):
    req=urllib.request.Request(url, headers={'User-Agent':'agent-dependency-provenance-install-guard/1.0'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data=r.read(max_bytes+1)
        if len(data)>max_bytes: raise ValueError('registry response exceeds configured limit')
        return json.loads(data.decode('utf-8'))

def normalize(ecosystem, spec):
    spec=spec.strip()
    if ecosystem=='npm':
        if spec.startswith(('git+','http://','https://','file:','.','/')): return {'source':'non-registry','raw':spec}
        if spec.startswith('@'):
            m=re.match(r'^(@[^/]+/[^@]+)(?:@(.+))?$', spec)
        else:
            m=re.match(r'^([^@]+)(?:@(.+))?$', spec)
        if not m: raise ValueError('invalid npm spec')
        return {'source':'registry','name':m.group(1).lower(),'version':m.group(2)}
    if ecosystem=='pypi':
        if '://' in spec or spec.startswith(('.', '/', 'git+')): return {'source':'non-registry','raw':spec}
        m=re.match(r'^([A-Za-z0-9_.-]+)(?:==([^\s;]+))?$', spec)
        if not m: raise ValueError('PyPI specs must be name or exact name==version')
        return {'source':'registry','name':re.sub(r'[-_.]+','-',m.group(1)).lower(),'version':m.group(2)}
    raise ValueError('unsupported ecosystem')

def age_hours(t): return (now_utc()-t).total_seconds()/3600 if t else None

def inspect_npm(name, version, p):
    meta=request_json('https://registry.npmjs.org/'+urllib.parse.quote(name, safe='@/'),p['network_timeout_seconds'],p['max_registry_response_bytes'])
    ver=version or meta.get('dist-tags',{}).get('latest')
    if not ver or ver not in meta.get('versions',{}): raise LookupError('requested npm version does not exist')
    v=meta['versions'][ver]; published=parse_time(meta.get('time',{}).get(ver))
    repo=v.get('repository') or meta.get('repository')
    deprecated=bool(v.get('deprecated'))
    return {'name':name,'version':ver,'published_at':published.isoformat() if published else None,'age_hours':age_hours(published),'repository':repo,'deprecated':deprecated,'integrity':v.get('dist',{}).get('integrity')}

def inspect_pypi(name, version, p):
    meta=request_json('https://pypi.org/pypi/'+urllib.parse.quote(name)+'/json',p['network_timeout_seconds'],p['max_registry_response_bytes'])
    ver=version or meta.get('info',{}).get('version')
    files=meta.get('releases',{}).get(ver)
    if not files: raise LookupError('requested PyPI version does not exist')
    times=[parse_time(x.get('upload_time_iso_8601')) for x in files if x.get('upload_time_iso_8601')]
    published=min(times) if times else None
    yanked=bool(files) and all(bool(x.get('yanked')) for x in files)
    urls=meta.get('info',{}).get('project_urls') or {}
    repo=next((v for k,v in urls.items() if k.lower() in ('source','repository','github','code')),None)
    hashes=[x.get('digests',{}).get('sha256') for x in files if x.get('digests',{}).get('sha256')]
    return {'name':name,'version':ver,'published_at':published.isoformat() if published else None,'age_hours':age_hours(published),'repository':repo,'yanked':yanked,'sha256':hashes}

def decide(ecosystem, spec, p, human_approved=False):
    n=normalize(ecosystem,spec)
    ev={'ecosystem':ecosystem,'requested':spec,'checked_at':now_utc().isoformat()}
    if n['source']!='registry':
        ev['reason']='non-registry source'; ev['decision']='deny'; return ev
    name=n['name']; ver=n.get('version'); ev.update({'name':name,'requested_version':ver})
    if name in p['blocked_packages'].get(ecosystem,[]): ev.update(decision='deny',reason='explicit blocklist'); return ev
    if p['require_exact_version'] and not ver and name not in p['approved_packages'].get(ecosystem,[]): ev.update(decision='review',reason='exact version required'); return ev
    try: details=inspect_npm(name,ver,p) if ecosystem=='npm' else inspect_pypi(name,ver,p)
    except urllib.error.HTTPError as e:
        ev.update(decision='deny' if e.code==404 else 'error',reason=f'registry HTTP {e.code}'); return ev
    except LookupError as e: ev.update(decision='deny',reason=str(e)); return ev
    except Exception as e: ev.update(decision='error',reason=f'lookup failed: {type(e).__name__}: {e}'); return ev
    ev['details']=details
    approved=name in p['approved_packages'].get(ecosystem,[])
    if ecosystem=='npm' and p['block_deprecated_npm'] and details.get('deprecated'): ev.update(decision='deny',reason='npm version is deprecated'); return ev
    if ecosystem=='pypi' and p['block_yanked_pypi'] and details.get('yanked'): ev.update(decision='deny',reason='all files for PyPI version are yanked'); return ev
    if not approved and p['require_repository_url_for_unapproved'] and not details.get('repository'): ev.update(decision='review',reason='no repository/source URL'); return ev
    age=details.get('age_hours')
    if not approved and age is not None and age < p['minimum_package_age_hours'] and p['require_human_approval_for_fresh_packages'] and not human_approved:
        ev.update(decision='review',reason=f'package version age {age:.1f}h is below cooldown'); return ev
    ev.update(decision='allow',reason='policy checks passed'); return ev

def audit(ev,p):
    path=Path(p['audit_log']); path.parent.mkdir(parents=True,exist_ok=True)
    with path.open('a',encoding='utf-8') as f: f.write(json.dumps(ev,sort_keys=True)+'\n')

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--policy',default='config/policy.json'); ap.add_argument('--ecosystem',choices=['npm','pypi'],required=True); ap.add_argument('--spec',required=True); ap.add_argument('--human-approved',action='store_true'); ap.add_argument('--no-audit',action='store_true')
    a=ap.parse_args(); p=load_json(a.policy); ev=decide(a.ecosystem,a.spec,p,a.human_approved)
    if not a.no_audit: audit(ev,p)
    print(json.dumps(ev,indent=2,sort_keys=True))
    return {'allow':EXIT_ALLOW,'review':EXIT_REVIEW,'deny':EXIT_DENY}.get(ev['decision'],EXIT_ERROR)
if __name__=='__main__': sys.exit(main())
