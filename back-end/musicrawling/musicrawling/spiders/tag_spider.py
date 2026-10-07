from curl_cffi import requests
from datetime import datetime, timezone
from musicrawling.items import TrackItem, ArtistItem
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor

class TagSpider(CrawlSpider):
    name = "tags"
    allowed_domains = ["last.fm"]
    start_urls = ["https://www.last.fm/music"]

    custom_settings = {
        'ROBOTSTXT_OBEY': False,
    }

    rules = (Rule(LinkExtractor(allow=r'/tag/'), callback='parse_item', follow=True))

    def parse_item(self, response):
        print("STATUS:", response.status_code)
        print("SIZE:", len(response.content))
        print("CHALLENGE:", "Client Challenge" in response.text)

        
        '''item['tag'] = response.url.split('/')[-1] if "tag" in response.url else None"'''