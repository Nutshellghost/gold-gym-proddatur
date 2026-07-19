"""Open a share.google link via Camoufox, dump page text + any image URLs."""
import sys, os, json, time
from camoufox.sync_api import Camoufox

URL = sys.argv[1] if len(sys.argv) > 1 else "https://share.google/sCSHgtdr9MA0thorF"
OUT = r"C:\Users\chait\gold-gym-proddatur\assets\photos\share_link_dump.json"

with Camoufox(headless=True) as browser:
    page = browser.new_page()
    print(f"goto {URL}")
    try:
        page.goto(URL, timeout=35000, wait_until="domcontentloaded")
    except Exception as e:
        print("goto err:", e)
    time.sleep(6)
    # follow any redirect by reading current url
    print("final url:", page.url)
    print("title:", page.title())
    # scroll to trigger lazy media
    for _ in range(5):
        page.mouse.wheel(0, 1200)
        time.sleep(1.2)
    text = page.inner_text("body")[:1500] if page.query_selector("body") else ""
    imgs = page.eval_on_selector_all(
        "img",
        "els => els.map(e => ({src: e.src||'', ds: e.dataset.src||'', w: e.naturalWidth, h: e.naturalHeight})).filter(x=>x.src && x.src.startsWith('http'))",
    )
    print("--- BODY TEXT (first 1500) ---")
    print(text)
    print("--- IMAGES ---")
    for im in imgs:
        print(im)
    with open(OUT, "w") as f:
        json.dump({"url": page.url, "title": page.title(), "text": text, "imgs": imgs}, f, indent=2)
    print("wrote", OUT)
