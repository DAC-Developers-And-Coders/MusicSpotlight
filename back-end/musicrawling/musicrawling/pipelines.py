from itemadapter import ItemAdapter
from scrapy.exceptions import DropItem
import pymongo
from musicrawling.items import TrackItem, ArtistItem, AlbumItem

class ValidationPipeline:
    def process_item(self, item, spider):
        if isinstance(item, (TrackItem, AlbumItem)):
            fields_to_search = ['rank', 'name', 'artist', 'url', 'chart', 'time']
        elif isinstance(item, ArtistItem):
            fields_to_search = ['rank', 'name', 'url', 'chart', 'time']
        else:
            raise DropItem("Item is not of type TrackItem, AlbumItem, or ArtistItem")

        fields_missing = self.get_missing_fields(item, fields_to_search)

        if fields_missing:
            raise DropItem(f"Missing required field(s): {fields_missing}")

        return item

    @staticmethod
    def get_missing_fields(item, fields):
        return [field for field in fields if not item.get(field)]

class DuplicatesPipeline:
    def __init__(self):
        self.items_seen = set()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        key = (adapter['url'], adapter['chart'], adapter.get('tag'))

        if key in self.items_seen:
            raise DropItem(f"Item already seen: {key}")
        else:
            self.items_seen.add(key)
            return item

class NormalizePipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        adapter['rank'] = int(adapter['rank'])
        adapter['name'] = adapter['name'].strip()

        if adapter.get('artist'):
            adapter['artist'] = adapter['artist'].strip()

        if adapter.get('cover'):
            adapter['cover'] = adapter['cover'].strip()

        if adapter.get('image'):
            adapter['image'] = adapter['image'].strip()

        if adapter.get('listeners'):
            adapter['listeners'] = int(adapter['listeners'].replace(',','').replace('.','').strip())

        adapter['chart'] = adapter['chart'].strip()
        adapter['url'] = adapter['url'].strip()

        if adapter.get('tag'):
            adapter['tag'] = adapter['tag'].strip()

        if adapter.get('artist_url'):
            adapter['artist_url'] = adapter['artist_url'].strip()

        return item

'''class MongoPipeline:
    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI', 'mongodb://localhost:27017'),
            mongo_db=crawler.settings.get('MONGO_DATABASE', 'musicrawling')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        self.db['music'].insert_one(dict(item))
        return item'''