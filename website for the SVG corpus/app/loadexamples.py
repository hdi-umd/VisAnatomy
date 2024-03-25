from collections import defaultdict
from typing import List
import pandas as pd
import copy
import random

class Image:
    def __init__(self, filename:str, description:str, source:str, tags:list):
        self.filename = filename
        self.description = description
        self.source = source
        self.tag = tags
    def getFilename(self) -> str:
        return self.filename
    def getDescription(self) -> str:
        return self.description
    def getSource(self) -> str:
        return self.source
    def getMatchingTags(self, tags) -> str:
        return set(self.tag).intersection(set(tags))

class Examples:
    def __init__(self):
        self.tags = defaultdict(list)
        self.readTags()
    def readTags(self):
        self.df = pd.read_csv('app/examples_collection_output.csv')
        self.df = self.df.dropna()
        # I need some structure that stores a list of all tags and the example filenames, descriptions and source link for each file in that tag
        for index, row in self.df.iterrows():
            image = Image(row["Filename"], row["Description"], row["Link"], row["Tag"]) #might switch out description with Type
            # for tag in row["Tag"].split(","):
            self.tags[row["Tag"].strip().lower()].append(image)
        #just sanity checking.
        # for t in self.tags:
        #     print(t)

    def getImages(self, tag) -> list:
        examples = []
        examples_ids =set()
        for t in tag:
            for image in self.tags[t]:
                if image.filename in examples_ids:
                    continue
                else:
                    img = copy.deepcopy(image)
                    img = img.__dict__
                    # img["tag"] = list(image.getMatchingTags(tag))
                    img["tag"] = t
                    examples.append(img)
                    examples_ids.add(img["filename"])
        random.shuffle(examples)
        return examples

    def getAllImages(self) -> list:
        examples =[]
        examples_ids =set()
        for t in self.tags.keys():
            for image in self.tags[t]: 
                if image.filename in examples_ids:
                    continue
                else:
                    img = copy.deepcopy(image)
                    img = img.__dict__
                    img["tag"] = [] #why do I have this here?
                    examples.append(img)
                    examples_ids.add(img["filename"])
        
        random.shuffle(examples)
        return examples
   
    def getAllTags(self) -> list:
        return self.tags.keys()
    def getImage(self,filename):
        for t in self.tags.keys():
            for image in self.tags[t]: 
                if image.filename == filename:
                    return image
        return None
