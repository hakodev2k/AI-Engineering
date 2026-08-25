#!/usr/bin/env python3
import argparse, hashlib, json, os, shutil, sys


def digest(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()


def check_helper(item, env=None):
    env=os.environ if env is None else env
    v=[]
    name=item.get("name")
    expected=item.get("expected_path")
    if not isinstance(name,str) or not name:
        return {"name":name,"status":"invalid","violations":["invalid_name"]}
    if not isinstance(expected,str) or not os.path.isabs(expected):
        return {"name":name,"status":"invalid","violations":["expected_path_must_be_absolute"]}
    expected=os.path.normpath(expected)
    exists=os.path.isfile(expected)
    if not exists:
        v.append("missing_helper")
        real=None
    else:
        real=os.path.realpath(expected)
        if os.path.normpath(real)!=expected:
            v.append("realpath_mismatch")
        if not os.access(expected,os.X_OK):
            v.append("not_executable")
    configured_hash=item.get("sha256")
    actual_hash=None
    if configured_hash is not None:
        if not isinstance(configured_hash,str) or len(configured_hash)!=64 or any(c not in "0123456789abcdefABCDEF" for c in configured_hash):
            v.append("invalid_sha256_policy")
        elif exists:
            actual_hash=digest(expected)
            if actual_hash.lower()!=configured_hash.lower():
                v.append("sha256_mismatch")
    resolved=None
    if item.get("check_path_shadowing",True):
        resolved=shutil.which(os.path.basename(expected), path=env.get("PATH",""))
        if resolved is None:
            v.append("basename_not_resolvable_in_path")
        elif os.path.realpath(resolved)!=os.path.realpath(expected):
            v.append("path_shadow_mismatch")
    return {"name":name,"expected_path":expected,"real_path":real,"path_resolved":resolved,"sha256":actual_hash,"status":"verified" if not v else "blocked","violations":v}


def load_policy(path):
    with open(path,encoding="utf-8") as f: data=json.load(f)
    if not isinstance(data,dict) or not isinstance(data.get("helpers"),list) or not data["helpers"]:
        raise ValueError("policy requires non-empty helpers array")
    return data


def main(argv=None):
    p=argparse.ArgumentParser()
    p.add_argument("--config",required=True)
    a=p.parse_args(argv)
    try:
        policy=load_policy(a.config)
        results=[check_helper(x) for x in policy["helpers"]]
    except (OSError,ValueError,json.JSONDecodeError) as e:
        print(str(e),file=sys.stderr); return 1
    print(json.dumps({"helpers":results},indent=2,sort_keys=True))
    return 2 if any(x["status"]!="verified" for x in results) else 0

if __name__=="__main__": raise SystemExit(main())
