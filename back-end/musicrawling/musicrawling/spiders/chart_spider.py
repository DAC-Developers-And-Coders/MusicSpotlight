from scrapy import Spider
from curl_cffi import requests
from scrapy.http import HtmlResponse

from datetime import datetime, timezone
from musicrawling.items import TrackItem, ArtistItem, AlbumItem


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
        yield from self.parse_top_artists(response)
        yield from self.parse_top_releases(response)

    def parse_top_tracks(self, response):
        top_tracks = response.xpath('//a[@id="top-tracks"]/parent::div[contains(@class, "charts-col")]')

        tracks_lines = top_tracks.css("tr.globalchart-item")

        scrap_time = datetime.now(timezone.utc)

        for line in tracks_lines:
            rank = line.css("td.globalchart-rank::text").get()
            name = line.css("td.globalchart-name a::text").get()
            artist = line.css("td.globalchart-track-artist-name a::text").get()
            cover = line.css("td.globalchart-image img::attr(src)").get()
            url = line.css("td.globalchart-name a::attr(href)").get()
            artist_url = line.css("td.globalchart-track-artist-name a::attr(href)").get()

            yield TrackItem(rank=rank, name=name, artist=artist, cover=cover, url=response.urljoin(url),
                chart="top_tracks", time=scrap_time, artist_url=response.urljoin(artist_url))

    def parse_top_artists(self, response):
        top_artists = response.xpath('//a[@id="top-artists"]/parent::div[contains(@class, "charts-col")]')

        artists_lines = top_artists.css("tr.globalchart-item")

        scrap_time = datetime.now(timezone.utc)

        for line in artists_lines:
            rank = line.css("td.globalchart-rank::text").get()
            name = line.css("td.globalchart-name a::text").get()
            image = line.css("td.globalchart-image img::attr(src)").get()
            url = line.css("td.globalchart-name a::attr(href)").get()

            yield ArtistItem(rank=rank, name=name, image=image,
                            url=response.urljoin(url), chart="top_artists", time=scrap_time)

    def parse_top_releases(self, response):
        top_releases = response.xpath('//a[@id="top-releases"]/parent::div[contains(@class, "charts-col")]')

        releases_lines = top_releases.css("tr.globalchart-item")

        scrap_time = datetime.now(timezone.utc)

        for line in releases_lines:
            rank = line.css("td.globalchart-rank::text").get()
            name = line.css("td.globalchart-name a::text").get()
            artist = line.css("td.globalchart-track-artist-name a::text").get()
            cover = line.css("td.globalchart-image img::attr(src)").get()
            url = line.css("td.globalchart-name a::attr(href)").get()

            yield AlbumItem(rank=rank, name=name, artist=artist, cover=cover, url=response.urljoin(url),
                chart="new_releases", time=scrap_time)