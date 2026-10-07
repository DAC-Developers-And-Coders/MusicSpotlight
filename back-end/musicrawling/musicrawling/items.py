# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field


class TrackItem(Item):
    rank = Field()
    name = Field()
    artist = Field()
    cover = Field()
    url = Field()
    chart = Field()
    time = Field()
    tag = Field()

class ArtistItem(Item):
    rank = Field()
    name = Field()
    image = Field()
    listeners = Field()
    url = Field()
    chart = Field()
    time = Field()
    tag = Field()