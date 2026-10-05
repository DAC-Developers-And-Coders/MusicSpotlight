from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor

class CrawlingSpider(CrawlSpider):
    name = 'crawler'
    allow_domains = ['https://www.last.fm/home']
    start_urls = ['https://www.last.fm/music/']

    custom_settings = {
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 5,
        'RANDOMIZE_DOWNLOAD_DELAY': True
    }

    rules = (
        Rule(LinkExtractor(allow='tag')),
    )
