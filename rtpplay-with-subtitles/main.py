import requests
import requests_cache
from requests_html import HTML
import microdata

from urllib.parse import urljoin
import datetime
import logging
import pprint


requests_cache.install_cache("rtpplay-cc_cache")

logging.basicConfig()
logging.getLogger().setLevel(logging.INFO)


def get_all_program_urls():
    all_program_urls = []

    page = 1
    while True:
        url = f"https://www.rtp.pt/play/bg_l_pg/?listtype=az&page={page}&type=all"

        logging.info(f"Fetching {url}")
        r = requests.get(url)
        r.raise_for_status()

        items = microdata.get_items(r.text)
        if len(items) == 0:
            break

        for item in items:
            assert item.itemtype[0] == microdata.URI("http://schema.org/VideoObject")
            program_url = urljoin("https://www.rtp.pt/", item.url.string)
            all_program_urls.append(program_url)

        page += 1

    return all_program_urls


def get_program_info(program_url):
    logging.info(f"Fetching {program_url}")
    r = requests.get(program_url)
    r.raise_for_status()

    html = HTML(html=r.text)
    title = html.find("h1")  # assume this is the title
    if not title:
        logging.warning(f"No title for {program_url}")
        return None

    program_info = {"url": program_url, "title": title[0].text}
    search_res = html.search("vtt: [['PT','{}','{}']]")
    if search_res:
        program_info["vtt_url"] = search_res[1]
    return program_info


all_program_urls = get_all_program_urls()
logging.info(f"Total programs found: {len(all_program_urls)}")


# Generate HTML output
print("<html>")
print('<head><meta charset="utf-8"><head>')
print("<body>")
print("<h1>RTP Play - Programs with Subtitles</h1>")
for program_url in all_program_urls:
    program_info = get_program_info(program_url)
    if program_info and program_info.get("vtt_url"):
        link_html = f'<a href="{program_info["url"]}">{program_info["title"]}</a>'
        print(f"<li>{link_html}</li>")
print("</body>")
print("<footer>")
print(
    f'<p>Generated {datetime.datetime.utcnow().isoformat()} by <a href="https://twitter.com/jrcplus">@jrcplus</a></p>'
)
print("</footer>")
print("</html>")
