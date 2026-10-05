from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor


class CrawlingSpider(CrawlSpider):
    name = 'crawler'
    allowed_domains = ['last.fm']
    start_urls = ['https://www.last.fm/tag/rock']

    custom_settings = {
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 3,
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        'CLOSESPIDER_PAGECOUNT': 10,
        'ITEM_PIPELINES': {
            'musicrawling.pipelines.MongoPipeline': 300,
        }
    }

    rules = (
        Rule(LinkExtractor(allow=r'/tag/'), callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        lines = response.css('tr[itemtype="http://schema.org/MusicRecording"]')

        if not lines:
            lines = response.css('tr.chartlist-row')

        for line in lines:
            music_name = line.css('td.chartlist-name a::text').get()
            music_artist = line.css('td.chartlist-artist a::text, td.chartlist-artist ::text').get()

            if music_name:
                yield {
                    'page_url': response.url,
                    'music_name': music_name.strip(),
                    'music_artist': music_artist.strip() if music_artist else None,
                }