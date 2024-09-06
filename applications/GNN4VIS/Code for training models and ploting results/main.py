import datetime
import shutil
import sys
import os
from itertools import product
import numpy as np

import torch
import random
from torch_geometric.datasets import TUDataset
from torch_geometric.loader import DataLoader
from gcn import GCN
from gcnn import GCNN
from cnn import CNN


def train(input_type="svg"):
    model.train()

    for data in train_loader:  # Iterate in batches over the training dataset.
        # Perform a single forward pass.
        if input_type == "img":
            out = model(data.img)
        elif input_type == "svg_wimg":
            out = model(data.x, data.edge_index, data.batch, data.img)
        elif input_type == "svg":
            out = model(data.x, data.edge_index, data.batch)
        else:
            raise ValueError(f"Invalid input_type: {input_type}")
        loss = criterion(out, data.y)  # Compute the loss.
        loss.backward()  # Derive gradients.
        optimizer.step()  # Update parameters based on gradients.
        optimizer.zero_grad()  # Clear gradients.

def test(loader, topk=5, input_type="svg"):
    model.eval()

    correct = 0
    correct_topk = 0
    for data in loader:  # Iterate in batches over the training/test dataset.
        if input_type == "img":
            out = model(data.img)
        elif input_type == "svg_wimg":
            out = model(data.x, data.edge_index, data.batch, data.img)
        elif input_type == "svg":
            out = model(data.x, data.edge_index, data.batch)
        else:
            raise ValueError(f"Invalid input_type: {input_type}")
        pred = out.argmax(dim=1)  # Use the class with highest probability.
        correct += int((pred == data.y).sum())  # Check against ground-truth labels.

        _, indices = torch.topk(out, topk, dim=1)
        correct_topk += torch.sum(indices == data.y.view(-1, 1)).item()
    
    return correct / len(loader.dataset), correct_topk / len(loader.dataset)  # Derive ratio of correct predictions.


# get dataset
current_dir = os.path.dirname(os.path.realpath(__file__))

# datasets = ["graphData_v0", "graphData_v1", "graphData_v2", "graphData_v3"]
datasets = ["graphData_v1"]

seeds = [12345, 215, 114514, 520, 630] 
combinations = product(datasets, seeds)

input_type = "svg"
# input_type = "img"
# input_type = "svg_wimg"

for comb in combinations:
    data_name, seed = comb
    if not "img" in data_name:
        input_type = "svg"
    
    dataset = torch.load(f'{current_dir}/data/GNN Dataset/{data_name}.pt')
    torch.manual_seed(seed)

    # Define output folder
    date_time = datetime.datetime.now().strftime("%m-%d-%H-%M-%S")
    output_folder = f'outputs/{data_name}/seed{seed}_{date_time}'
    if input_type == "img":
        output_folder = f'outputs/{data_name}_img_only/seed{seed}_{date_time}'
    print(output_folder)
    os.makedirs(output_folder, exist_ok=True)

    # Copy the main Python script to the output folder
    shutil.copy(__file__, output_folder)

    # set up output file
    output_file = open(output_folder + '/output.txt', 'w')

    # split dataset
    train_dataset = [data for data in dataset if data.train]
    test_dataset = [data for data in dataset if not data.train]
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=64, shuffle=False)

    # create model
    if input_type == "img":
        model = CNN(hidden_channels=64, num_classes=40)
    elif input_type == "svg_wimg":
        model = GCNN(hidden_channels=64, num_node_features=dataset[0].x.shape[1], num_classes=40)
    elif input_type == "svg":
        model = GCN(hidden_channels=64, num_node_features=dataset[0].x.shape[1], num_classes=40)
    else:
        raise ValueError(f"Invalid input_type: {input_type}")

    if input_type == "img":
        lr = 0.001
    else:
        lr = 0.01
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    criterion = torch.nn.CrossEntropyLoss()

    # train model
    ep_num = 200
    train_acc_list = np.zeros(ep_num)
    test_acc_list = np.zeros(ep_num)
    train_acc_top5_list = np.zeros(ep_num)
    test_acc_top5_list = np.zeros(ep_num)
    for epoch in range(ep_num):
        train(input_type=input_type)
        train_acc, train_acc_topk = test(train_loader, input_type=input_type)
        test_acc, test_acc_topk = test(test_loader, input_type=input_type)
        print(f'Epoch: {epoch+1:03d}, Train Acc: {train_acc:.4f}, Test Acc: {test_acc:.4f}, Train Acc Top5: {train_acc_topk:.4f}, Test Acc Top5: {test_acc_topk:.4f}')
        output_file.write(f'Epoch: {epoch+1:03d}, Train Acc: {train_acc:.4f}, Test Acc: {test_acc:.4f}, Train Acc Top5: {train_acc_topk:.4f}, Test Acc Top5: {test_acc_topk:.4f}\n')
        
        train_acc_list[epoch] = train_acc
        test_acc_list[epoch] = test_acc
        train_acc_top5_list[epoch] = train_acc_topk
        test_acc_top5_list[epoch] = test_acc_topk
        
    output_file.close()

    np.savez(output_folder + '/acc.npz', train_acc_list=train_acc_list, test_acc_list=test_acc_list, train_acc_top5_list=train_acc_top5_list, test_acc_top5_list=test_acc_top5_list)