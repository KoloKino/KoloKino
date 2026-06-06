#!/usr/bin/env python3
"""
update_videos.py — Refresh the "Latest videos" grid in index.html from the
Kolo Kino YouTube RSS feed.

Usage:
    python update_videos.py            # refresh in place
    python update_videos.py --dry-run  # preview without writing

The script reads RSS, formats view counts (1.2M, 43K, etc.), and rewrites the
block between the markers VIDEOS-START and VIDEOS-END in index.html.
"""

import argparse
import re
import sys
import urllib.request
from html import escape
from pathlib import Path
from xml.etree import ElementTree as ET

CHANNEL_ID = "UCC-4I_cirpJnU6VA3bOcudQ"
RSS_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
HTML_FILE = Path(__file__).parent / "index.html"
NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
}
HOW_MANY = 12  # how many latest videos to display


def format_views(n: int) -> str:
    if n >= 1_000_000:
        v = n / 1_000_000
        return f"{v:.1f}M views" if v < 10 else f"{int(v)}M views"
    if n >= 1_000:
        v = n / 1_000
        return f"{v:.1f}K views" if v < 10 else f"{int(v)}K views"
    return f"{n} views"


def fetch_videos():
    req = urllib.request.Request(RSS_URL, headers={"User-Agent": "kolo-kino/1.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read()
    root = ET.fromstring(data)
    videos = []
    for entry in root.findall("atom:entry", NS):
        vid = entry.findtext("yt:videoId", "", NS)
        title = entry.findtext("atom:title", "", NS)
        group = entry.find("media:group", NS)
        views = 0
        if group is not None:
            community = group.find("media:community", NS)
            if community is not None:
                stats = community.find("media:statistics", NS)
                if stats is not None:
                    views = int(stats.attrib.get("views", "0"))
        videos.append({"id": vid, "title": title, "views": views})
    return videos[:HOW_MANY]


def build_block(videos):
    lines = ['<div class="videos-grid">', ""]
    for v in videos:
        title = escape(v["title"])
        vid = v["id"]
        views = format_views(v["views"])
        lines.append(
            f'      <a class="video-card" href="https://www.youtube.com/watch?v={vid}" target="_blank" rel="noopener">'
        )
        lines.append(
            f'        <div class="video-thumb"><img src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="" loading="lazy" /></div>'
        )
        lines.append('        <div class="video-meta">')
        lines.append(f"          <h3>{title}</h3>")
        lines.append(f'          <p class="video-views">{views}</p>')
        lines.append("        </div>")
        lines.append("      </a>")
        lines.append("")
    lines.append("    </div>")
    indented = "\n".join(("    " + ln) if ln else "" for ln in lines[:1])
    body = "\n".join(("    " + ln) if ln else "" for ln in lines)
    return body


def update_html(html: str, block: str) -> str:
    pattern = re.compile(
        r"(<!-- VIDEOS-START.*?-->)(.*?)(<!-- VIDEOS-END -->)",
        re.DOTALL,
    )
    if not pattern.search(html):
        raise SystemExit("ERROR: VIDEOS-START / VIDEOS-END markers not found in index.html")
    return pattern.sub(rf"\1\n{block}\n    \3", html)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="don't write, just print")
    args = ap.parse_args()

    videos = fetch_videos()
    if not videos:
        sys.exit("No videos found in RSS feed.")
    print(f"Fetched {len(videos)} videos. Latest: {videos[0]['title']}")

    block = build_block(videos)
    html = HTML_FILE.read_text(encoding="utf-8")
    new_html = update_html(html, block)

    if args.dry_run:
        print("---DRY RUN---")
        print(block)
        return

    HTML_FILE.write_text(new_html, encoding="utf-8")
    print(f"Updated {HTML_FILE} with {len(videos)} latest videos.")


if __name__ == "__main__":
    main()
