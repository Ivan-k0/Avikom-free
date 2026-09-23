#!/usr/bin/env python3
"""
Syncs the STATIC (pre-JS) text of every [data-price*] element in every HTML
file to match prices.js — the same transformation prices.js itself performs
in the browser on DOMContentLoaded, run here at commit-time instead of at
page-load-time, so anything that reads raw HTML (search crawlers, AI agent
scanners, curl) sees the same numbers a real visitor's browser would render.

Runs automatically via .github/workflows/sync-prices.yml on every push that
touches prices.js. To run by hand: python3 scripts/sync-static-prices.py
(from anywhere — it locates the repo root from its own path).
"""
import re, glob, os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_prices():
    text = open(os.path.join(REPO, "prices.js"), encoding="utf-8").read()
    m = re.search(r"var PRICES\s*=\s*\{(.*?)\};", text, re.S)
    if not m:
        sys.exit("Could not find PRICES object in prices.js")
    body = m.group(1)
    prices = {}
    for km in re.finditer(r"(\w+)\s*:\s*(\d+)\s*,?", body):
        prices[km.group(1)] = int(km.group(2))
    return prices

PRICES = load_prices()

TAG = r"[a-z]+"

def unit_of(text):
    return " UAH/kg" if "UAH" in text else " грн/кг"

def repl_data_price(m):
    open_tag, key, content, close_tag = m.group(1), m.group(2), m.group(3), m.group(4)
    if key not in PRICES:
        return m.group(0)
    new_text = f"{PRICES[key]}{unit_of(content)}"
    return f"{open_tag}{new_text}{close_tag}"

def repl_data_price_range(m):
    open_tag, keys, content, close_tag = m.group(1), m.group(2), m.group(3), m.group(4)
    parts = [k.strip() for k in keys.split(",")]
    if len(parts) < 2 or parts[0] not in PRICES or parts[1] not in PRICES:
        return m.group(0)
    v1, v2 = PRICES[parts[0]], PRICES[parts[1]]
    mn, mx = min(v1, v2), max(v1, v2)
    new_text = f"{mn}–{mx}{unit_of(content)}"
    return f"{open_tag}{new_text}{close_tag}"

def repl_data_price_mix(m):
    open_tag, key, content, close_tag = m.group(1), m.group(2), m.group(3), m.group(4)
    if key not in PRICES:
        return m.group(0)
    new_text = f"-0.5% → {PRICES[key]}{unit_of(content)}"
    return f"{open_tag}{new_text}{close_tag}"

def repl_data_price_num(m):
    open_tag, key, content, close_tag = m.group(1), m.group(2), m.group(3), m.group(4)
    if key not in PRICES:
        return m.group(0)
    return f"{open_tag}{PRICES[key]}{close_tag}"

PATTERNS = [
    (re.compile(r'(<' + TAG + r'[^>]*\bdata-price="([\w]+)"[^>]*>)([^<]*)(</' + TAG + r'>)'), repl_data_price),
    (re.compile(r'(<' + TAG + r'[^>]*\bdata-price-range="([\w, ]+)"[^>]*>)([^<]*)(</' + TAG + r'>)'), repl_data_price_range),
    (re.compile(r'(<' + TAG + r'[^>]*\bdata-price-mix="([\w]+)"[^>]*>)([^<]*)(</' + TAG + r'>)'), repl_data_price_mix),
    (re.compile(r'(<' + TAG + r'[^>]*\bdata-price-num="([\w]+)"[^>]*>)([^<]*)(</' + TAG + r'>)'), repl_data_price_num),
]

total_files = 0
scanned = 0
for fp in glob.glob(os.path.join(REPO, "**/*.html"), recursive=True):
    text = open(fp, encoding="utf-8").read()
    new_text = text
    for pattern, repl in PATTERNS:
        new_text = pattern.sub(repl, new_text)
    scanned += 1
    if new_text != text:
        open(fp, "w", encoding="utf-8").write(new_text)
        total_files += 1
        print(f"synced: {os.path.relpath(fp, REPO)}")

print(f"\nDONE: {total_files} files updated (scanned {scanned} html files, {len(PRICES)} price keys)")
