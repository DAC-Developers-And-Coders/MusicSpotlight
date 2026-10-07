from scrapy import Spider
from curl_cffi import requests
from scrapy.http import HtmlResponse

from datetime import datetime, timezone
from musicrawling.items import TrackItem


class ChartSpider(Spider):
    name = "charts"
    allowed_domains = ["last.fm"]

    start_url = "https://www.last.fm/charts"

    async def start(self):
        response = requests.get(self.start_url, impersonate="chrome")

        scrapy_response = HtmlResponse(url=self.start_url, body=response.content, encoding="utf-8")

        for item in self.parse(scrapy_response):
            yield item

    def parse(self, response):
        yield from self.parse_top_tracks(response)

    def parse_top_tracks(self, response):
        top_tracks = response.xpath('//a[@id="top-tracks"]/parent::div[contains(@class, "charts-col")]')

        lines = top_tracks.css("tr.globalchart-item")

        print(f"Found {len(lines)} Top Tracks rows")

        scrap_time = datetime.now(timezone.utc)

        for line in lines:
            rank = line.css("td.globalchart-rank::text").get()
            name = line.css("td.globalchart-name a::text").get()
            artist = line.css("td.globalchart-track-artist-name a::text").get()
            cover = line.css("td.globalchart-image img::attr(src)").get()
            listeners = line.css("td.globalchart-listeners::text").get()
            url = line.css("td.globalchart-name a::attr(href)").get()

            yield TrackItem(rank=rank, name=name, artist=artist, cover=cover, listeners=listeners, url=response.urljoin(url), chart="top_tracks", time=scrap_time)