from scrapy import Spider
from curl_cffi import requests
from scrapy.http import HtmlResponse

from datetime import datetime, timezone
from musicrawling.items import TrackItem, ArtistItem, AlbumItem


class TagSpider(Spider):
    name = "tags"
    allowed_domains = ["last.fm"]

    start_url = "https://www.last.fm/music"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.default_tag_url = "https://www.last.fm/tag/"

        self.initial_tags = []
        self.related_tags = []
        self.processed_tags = set()

    async def start(self):
        response = requests.get(self.start_url, impersonate="chrome")

        scrapy_response = HtmlResponse(url=self.start_url, body=response.content, encoding="utf-8")

        self.parse_main_tags(scrapy_response)

        for item in self.parse_initial_tags():
            yield item

        print(f"Initial tags: {len(self.initial_tags)}")
        print(f"Related tags: {len(self.related_tags)}")
        print(f"Processed tags: {len(self.processed_tags)}")

    def parse_main_tags(self, response):
        featured_tags = response.xpath('//div[@class="music-tags"]//h3[@class="music-featured-item-heading"]')
        more_tags = response.xpath('//div[@class="music-tags"]//ul[@class="music-more-tags"]//'
                                   'span[@class="music-more-tags-tag-link"]')

        main_tags = featured_tags + more_tags

        for tag in main_tags:
            tag_text = tag.css("::text").get().strip().lower()

            if tag_text not in self.initial_tags:
                self.initial_tags.append(tag_text)

        custom_tags = ['future funk', 'vocaloid', 'stoner metal', 'grunge', 'mpb', 'psychedelic rock']

        for tag in custom_tags:
            if tag not in self.initial_tags:
                self.initial_tags.append(tag)

    def parse_initial_tags(self):
        for tag in self.initial_tags:
            if tag in self.processed_tags:
                continue

            yield from self.process_tags(tag, True)

        for tag in self.related_tags:
            if tag in self.processed_tags:
                continue

            yield from self.process_tags(tag, False)

    def process_tags(self, tag, is_main):
        if tag not in self.processed_tags:
            self.processed_tags.add(tag)
        else:
            return

        response = requests.get(self.default_tag_url + tag, impersonate="chrome")
        scrapy_response = HtmlResponse(url=self.default_tag_url + tag, body=response.content,
                                       encoding="utf-8")

        yield from self.parse_tag_songs(scrapy_response, tag)

        if is_main:
            self.parse_related_main_tags(scrapy_response)

        response = requests.get(self.default_tag_url + tag + "/artists", impersonate="chrome")
        scrapy_response = HtmlResponse(url=self.default_tag_url + tag + "/artists",
                                       body=response.content, encoding="utf-8")

        yield from self.parse_tag_artists(scrapy_response, tag)

        response = requests.get(self.default_tag_url + tag + "/albums", impersonate="chrome")
        scrapy_response = HtmlResponse(url=self.default_tag_url + tag + "/albums",
                                       body=response.content, encoding="utf-8")

        yield from self.parse_tag_albums(scrapy_response, tag)

    def parse_related_main_tags(self, response):
        related_tags = response.xpath('//section[contains(@class, "grid-items-section") and contains(@class, "buffer-8")]'
                                      '/ol[contains(@class, "grid-items")]'
                                      '/li[contains(@class, "grid-items-item") and contains(@class, "js-focus-controls-container")]//'
                                      'div[contains(@class, "grid-items-item-details")]'
                                      '/p[contains(@class, "grid-items-item-main-text")]/a[contains(@class, "link-block-target")]')

        for tag in related_tags:
            tag_text = tag.css("::text").get().strip().lower()

            if tag_text not in self.related_tags:
                self.related_tags.append(tag_text)

    def parse_tag_songs(self, response, tag):
        top_tracks = response.xpath('//section[@id="top-tracks-section"]//table[contains(@class, chartlist)]'
                                    '//tr[contains(@class, "chartlist-row")]')

        scrap_time = datetime.now(timezone.utc)

        for line in top_tracks:
            rank = line.css("td.chartlist-index::text").get()
            name = line.css("td.chartlist-name a::text").get()
            artist = line.css("td.chartlist-artist a::text").get()
            url = line.css("td.chartlist-name a::attr(href)").get()
            artist_url = line.css("td.chartlist-artist a::attr(href)").get()

            yield TrackItem(rank=rank, name=name, artist=artist, url=response.urljoin(url),
                            chart="top_tracks", time=scrap_time, artist_url=response.urljoin(artist_url), tag=tag)

    def parse_tag_artists(self, response, tag):
        top_artists = response.xpath('//section[@class="grid-items-section"]//ol[@class="big-artist-list"]'
                                    '//li[@class="big-artist-list-wrap"]/div[contains(@class, "big-artist-list-item")]')

        scrap_time = datetime.now(timezone.utc)

        i = 0
        for line in top_artists:
            i += 1
            rank = i
            name = line.css("h3.big-artist-list-title a::text").get()
            image = line.css("span img::attr(src)").get()
            listeners = line.css("p.big-artist-list-listeners ::text").get()
            url = line.css("h3.big-artist-list-title a::attr(href)").get()

            yield ArtistItem(rank=rank, name=name, image=image, listeners=listeners,
                             url=response.urljoin(url), chart="top_artists", time=scrap_time, tag=tag)

    def parse_tag_albums(self, response, tag):
        top_albums = response.xpath('//section[@id="artist-albums-section"]//ol[contains(@class, resource-list--release-list)]'
                                    '//li[contains(@class, resource-list--release-list-item-wrap)]'
                                    '/div[contains(@class, resource-list--release-list-item)]')

        scrap_time = datetime.now(timezone.utc)

        i = 0
        for line in top_albums:
            i += 1
            rank = i
            name = line.css("h3.resource-list--release-list-item-name a::text").get()
            artist = line.css("p.resource-list--release-list-item-artist a::text").get()
            cover = line.css("div.media-item img::attr(src)").get()
            listeners = line.css("p.resource-list--release-list-item-aux-text ::text").get()
            if listeners:
                listeners = listeners.replace(" listeners", "").strip()
            url = line.css("h3.resource-list--release-list-item-name a::attr(href)").get()
            artist_url = line.css("p.resource-list--release-list-item-artist a::attr(href)").get()

            yield AlbumItem(rank=rank, name=name, artist=artist,cover=cover, listeners=listeners, url=response.urljoin(url),
                            chart="top_albums", time=scrap_time, artist_url=response.urljoin(artist_url), tag=tag)