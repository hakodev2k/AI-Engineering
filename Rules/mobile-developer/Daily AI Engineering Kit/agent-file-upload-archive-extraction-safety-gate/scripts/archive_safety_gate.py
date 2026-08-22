#!/usr/bin/env python3
import argparse, json, os, sys, zipfile, posixpath
from pathlib import PurePosixPath

DEFAULTS={"max_archive_bytes":104857600,"max_entry_count":1000,"max_total_uncompressed_bytes":536870912,"max_single_entry_bytes":104857600,"max_compression_ratio":100,"allow_symlinks":False,"allow_absolute_paths":False,"allow_parent_traversal":False,"require_unique_normalized_paths":True}

def load_policy(path):
    p=dict(DEFAULTS)
    if not path: return p
    try:
        import yaml
    except Exception:
        raise RuntimeError("PyYAML is required when --policy is used")
    with open(path,"r",encoding="utf-8") as f:
        raw=yaml.safe_load(f) or {}
    p.update(raw); return p

def norm(name):
    s=name.replace('\\','/')
    return posixpath.normpath(s)

def is_symlink(info):
    mode=(info.external_attr >> 16) & 0xFFFF
    return (mode & 0o170000) == 0o120000

def scan(path, policy):
    violations=[]; entries=[]; seen=set(); total=0
    if not os.path.isfile(path): return {"status":"error","archive":path,"entries":[],"violations":["archive-not-found"],"totals":{"entry_count":0,"uncompressed_bytes":0}}
    if os.path.getsize(path)>int(policy["max_archive_bytes"]): violations.append("archive-size-limit")
    try:
        z=zipfile.ZipFile(path)
    except Exception as e:
        return {"status":"error","archive":path,"entries":[],"violations":[f"invalid-zip:{e}"],"totals":{"entry_count":0,"uncompressed_bytes":0}}
    infos=z.infolist()
    if len(infos)>int(policy["max_entry_count"]): violations.append("entry-count-limit")
    for i in infos:
        reasons=[]; n=norm(i.filename); total += i.file_size
        if i.filename.startswith(('/', '\\')) or PurePosixPath(i.filename.replace('\\','/')).is_absolute(): reasons.append("absolute-path")
        parts=PurePosixPath(i.filename.replace('\\','/')).parts
        if '..' in parts: reasons.append("parent-traversal")
        if n.startswith('../') or n=='..': reasons.append("normalized-parent-traversal")
        if policy.get("require_unique_normalized_paths",True) and n in seen: reasons.append("duplicate-normalized-path")
        seen.add(n)
        if is_symlink(i) and not policy.get("allow_symlinks",False): reasons.append("symlink")
        if i.file_size>int(policy["max_single_entry_bytes"]): reasons.append("single-entry-size-limit")
        ratio=(i.file_size/max(i.compress_size,1)) if i.file_size else 0
        if ratio>float(policy["max_compression_ratio"]): reasons.append("compression-ratio-limit")
        entries.append({"path":i.filename,"size":i.file_size,"compressed_size":i.compress_size,"safe":not reasons,"reasons":reasons})
        violations.extend(f"{i.filename}:{r}" for r in reasons)
    if total>int(policy["max_total_uncompressed_bytes"]): violations.append("total-uncompressed-size-limit")
    z.close()
    return {"status":"block" if violations else "pass","archive":path,"entries":entries,"violations":violations,"totals":{"entry_count":len(infos),"uncompressed_bytes":total}}

def safe_extract(path,dest,result):
    if result["status"]!="pass": raise RuntimeError("refusing extraction: scan did not pass")
    root=os.path.abspath(dest); os.makedirs(root,exist_ok=True)
    with zipfile.ZipFile(path) as z:
        for i in z.infolist():
            target=os.path.abspath(os.path.join(root,*PurePosixPath(i.filename.replace('\\','/')).parts))
            if os.path.commonpath([root,target]) != root: raise RuntimeError(f"unsafe target: {i.filename}")
            if i.is_dir(): os.makedirs(target,exist_ok=True); continue
            os.makedirs(os.path.dirname(target),exist_ok=True)
            with z.open(i) as src, open(target,'wb') as dst:
                while True:
                    b=src.read(1024*1024)
                    if not b: break
                    dst.write(b)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("archive"); ap.add_argument("--policy"); ap.add_argument("--output"); ap.add_argument("--extract-to")
    a=ap.parse_args()
    try: p=load_policy(a.policy); r=scan(a.archive,p)
    except Exception as e: r={"status":"error","archive":a.archive,"entries":[],"violations":[str(e)],"totals":{"entry_count":0,"uncompressed_bytes":0}}
    text=json.dumps(r,indent=2)
    if a.output:
        with open(a.output,'w',encoding='utf-8') as f: f.write(text+'\n')
    else: print(text)
    if a.extract_to and r["status"]=="pass": safe_extract(a.archive,a.extract_to,r)
    return 0 if r["status"]=="pass" else (2 if r["status"]=="block" else 3)
if __name__=='__main__': sys.exit(main())
