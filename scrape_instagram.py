"""Scrape Instagram profile @gold_gym_proddatur grid images via Camoufox."""
import sys, os, json, time, urllib.request
from camoufox.sync_api import Camoufox

HANDLE = "gold_gym_proddatur"
URL = f"https://www.instagram.com/{HANDLE}/"
OUT_DIR = r"C:\Users\chait\gold-gym-proddatur\assets\photos"
os.makedirs(OUT_DIR, exist_ok=True)

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0"

with Camoufox(headless=True) as browser:
    page = browser.new_page()
    print("goto", URL)
    try:
        page.goto(URL, timeout=35000, wait_until="domcontentloaded")
    except Exception as e:
        print("goto err:", e)
    time.sleep(7)
    # scroll to load grid
    for _ in range(8):
        page.mouse.wheel(0, 1500)
        time.sleep(1.5)
    print("final url:", page.url)
    print("title:", page.title())
    # Instagram stores images in <img> with src + often in JSON. Grab high-res srcs.
    imgs = page.eval_on_selector_all(
        "article img, main img, img[src*='scontent']",
        """els => els.map(e => ({
            src: e.src||'',
            w: e.naturalWidth, h: e.naturalHeight,
            alt: (e.alt||'').slice(0,60)
        })).filter(x => x.src && x.src.startsWith('http') && x.w > 100)"""
    )
    print(f"--- found {len(imgs)} imgs ---")
    saved = []
    for i, im in enumerate(imgs[:12]):
        print(f"  [{i}] {im['w']}x{im['h']} {im['alt'][:40]} {im['src'][:70]}")
        try:
            req = urllib.request.Request(im["src"], headers={"User-Agent": UA, "Referer": "https://www.instagram.com/"})
            data = urllib.request.urlopen(req, timeout=30).read()
            if len(data) < 3000:
                continue
            ext = "jpg"
            if im["src"].lower().endswith(".png"): ext = "png"
            path = os.path.join(OUT_DIR, f"ig_{i}.{ext}")
            with open(path, "wb") as f:
                f.write(data)
            saved.append(path)
            print(f"    saved {os.path.getsize(path)}b -> {path}")
        except Exception as e:
            print(f"    dl err: {e}")
    print(f"=== saved {len(saved)} images ===")
    with open(os.path.join(OUT_DIR, "ig_dump.json"), "w") as f:
        json.dump({"url": page.url, "imgs": imgs}, f, indent=2)
