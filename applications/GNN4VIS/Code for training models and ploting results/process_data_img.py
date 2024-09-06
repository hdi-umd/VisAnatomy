import glob
import json
import re
import os
import torch
import torch.nn as nn
from torch_geometric.data import Data
from torch_geometric.utils import to_undirected
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image


# Define transforms for preprocessing the images
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Resize images to match ResNet input size
    transforms.ToTensor(),           # Convert images to PyTorch tensors
    transforms.Normalize(            # Normalize the images
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

resnet = models.resnet50(pretrained=True)
# Remove the fully connected layer
modules = list(resnet.children())[:-1]
resnet = nn.Sequential(*modules)

# get the current directory
current_dir = os.path.dirname(os.path.realpath(__file__))

data_dir = current_dir + "/data/GNN Dataset/graphData_v4"
json_files = sorted(glob.glob(f'{data_dir}/*.json'))
img_dir = current_dir + "/data/GNN Dataset/examples_png"

data_list = []
for json_file in json_files:
    with open(json_file) as file:
        raw_data = json.load(file)
        
    print(f'Processing {json_file}')
    fname = os.path.basename(json_file).split('.')[0]
    img_path = os.path.join(img_dir, f'{fname}.png')
    img = transform(Image.open(img_path).convert("RGB")).unsqueeze(0)
    img_feature = resnet(img)
    img_feature = img_feature.view(img_feature.size(0), -1)

    # create Data object
    data = Data()

    data.y = torch.tensor([raw_data["label"]])
    data.train = torch.tensor(raw_data["splition"]=="training", dtype=torch.bool)

    data.img = img
    data.img_feature = img_feature

    data_list.append(data)

# save processed data
torch.save(data_list, f'{data_dir}_img.pt')