"""Camoufox scraper: try to reach Google Images + Instagram for Gold Gym Proddatur
and extract any image URLs. Stealth Firefox bypasses basic bot detection.
"""
import sys, os, re, json, time, urllib.request
from camoufox.sync_api import Camoufox

OUT_DIR = r"C:\Users\chait\gold-gym-proddatur\assets\photos"
os.makedirs(OUT_DIR, exist_ok=True)

QUERIES = {
    "google_images": "https://www.google.com/search?tbm=isch&q=Gold+Gym+Proddatur+Andhra+Pradesh",
    "instagram_tag": "https://www.instagram.com/explore/tags/goldgymproddatur/",
    "instagram_loc": "https://www.instagram.com/explore/locations/?query=Gold%20Gym%20Proddatur",
}

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0")

def fetch_images(page, label):
    found = []
    try:
        # Google images: img tags with src/http
        srcs = page.eval_on_selector_all(
            "img",
            "els => els.map(e => e.src || e.dataset.src || e.getAttribute('src')).filter(Boolean)",
        )
        for s in srcs:
            if any(x in s for x in ("jpg", "jpeg", "png", "webp")) and "data:image" not in s:
                found.append(s)
    except Exception as e:
        print(f"  [{label}] img extract err: {e}")
    return found

def download(url, idx, label):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://www.google.com/"})
        data = urllib.request.urlopen(req, timeout=30).read()
        if len(data) < 2000:
            return None
        ext = "jpg"
        if url.lower().endswith(".png"): ext = "png"
        elif url.lower().endswith(".webp"): ext = "webp"
        path = os.path.join(OUT_DIR, f"{label}_{idx}.{ext}")
        with open(path, "wb") as f:
            f.write(data)
        return path
    except Exception as e:
        return f"ERR:{e}"

results = {}
with Camoufox(headless=True) as browser:
    page = browser.new_page()
    for label, url in QUERIES.items():
        print(f"\n=== {label}: {url} ===")
        try:
            page.goto(url, timeout=30000, wait_until="domcontentloaded")
            time.sleep(4)  # let JS render / lazy imgs load
            # scroll a bit to trigger lazy loading
            page.mouse.wheel(0, 1500)
            time.sleep(2)
            title = page.title()
            print(f"  title: {title[:80]}")
            imgs = fetch_images(page, label)
            print(f"  candidate imgs: {len(imgs)}")
            results[label] = imgs[:20]
            # try downloading first few
            saved = []
            for i, u in enumerate(imgs[:8]):
                p = download(u, i, label)
                if p and not str(p).startswith("ERR"):
                    saved.append(p)
                    print(f"  saved: {p} ({os.path.getsize(p)}b)")
            print(f"  downloaded: {len(saved)}")
        except Exception as e:
            print(f"  FAILED: {e}")
            results[label] = []

print("\n=== SUMMARY ===")
for k, v in results.items():
    print(f"{k}: {len(v)} candidate image URLs")
with open(os.path.join(OUT_DIR, "camoufox_results.json"), "w") as f:
    json.dump(results, f, indent=2)
print("Wrote camoufox_results.json")
