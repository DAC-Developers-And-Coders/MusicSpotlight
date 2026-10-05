from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor

class CrawlingSpider(CrawlSpider):
    name = 'crawler'
    allow_domains = ['https://www.last.fm/home']
    start_urls = ['https://www.last.fm/music/']

    custom_settings = {
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 5,
        'CLOSESPIDER_PAGECOUNT': 10,
        'DEPTH_LIMIT': 1,
    }

    rules = (
        Rule(LinkExtractor(allow='tag')),
    )
