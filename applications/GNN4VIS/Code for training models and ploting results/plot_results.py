import pandas as pd
import seaborn as sns
import numpy as np
import glob
import matplotlib.pyplot as plt
import matplotlib
import os


# def plot_results(res_dfs):
#     current_dir = os.path.dirname(os.path.realpath(__file__))
#     matplotlib.rc('font', family='Times New Roman', size=14)
#     acc_keys = ["train_acc_list", "test_acc_list", "train_acc_top5_list", "test_acc_top5_list", "acc_ratio", "acc_ratio_top5"]
#     for acc_key in acc_keys:
#         figure, axis = plt.subplots(1, 1, figsize=(7, 4.3)) # figsize argument
#         default_palette = sns.color_palette(as_cmap=True)
#         for i, (key, df) in enumerate(res_dfs.items()):
#             color = default_palette[i]
#             sns.lineplot(data = df, x="ts", y=acc_key, 
#                         errorbar='sd', ax=axis, label=key, 
#                         color=color)
#         axis.set_xlabel("Epochs")
#         if "ratio" in acc_key:
#             axis.set_ylabel("Test/Train Accuracy Ratio")
#         else:
#             axis.set_ylabel("Accuracy")
#         legend = plt.legend(loc="lower right", ncol=3)
#         for line in legend.get_lines():
#             line.set_linewidth(3.0)
#         plt.savefig(f"{current_dir}/figures/{acc_key}.pdf", bbox_inches="tight")
#         plt.close()

import os
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns

def plot_results(res_dfs):
    current_dir = os.path.dirname(os.path.realpath(__file__))
    matplotlib.rc('font', family='Times New Roman', size=14)
    # acc_keys = ["train_acc_list", "test_acc_list", "train_acc_top5_list", "test_acc_top5_list", "acc_ratio", "acc_ratio_top5"]
    acc_keys = ["test_acc_list", "test_acc_top5_list"]
    
    for acc_key in acc_keys:
        figure, axis = plt.subplots(1, 1, figsize=(7, 4.3))
        default_palette = sns.color_palette(as_cmap=True)
        
        for i, (key, df) in enumerate(res_dfs.items()):
            color = default_palette[i]
            sns.lineplot(data=df, x="ts", y=acc_key, 
                         errorbar='sd', ax=axis, label=key, 
                         color=color)
            
            # Get the last non-NaN y-value
            last_y = df[acc_key].dropna().iloc[-1]
            last_x = df['ts'].max()
            
            # Add text label at the end of each line
            corr = {"Model 1": "Graph 1", "Model 2": "Graph 2", "Model 3": "Graph 3", "Model 4": "Graph 4", "Model5": "Img-Only", "Model 6": "Img+Graph 4"}
            axis.text(last_x + 1, last_y, corr[key], color=color, va='center', ha='left')
        
        # Extend x-axis slightly to accommodate labels
        x_max = axis.get_xlim()[1]
        axis.set_xlim(0, x_max + 40)
        
        axis.set_xlabel("Epochs")
        if "top5" in acc_key:
            axis.set_ylabel("Top-5 Test Accuracy")
        else:
            axis.set_ylabel("Top-1 Test Accuracy")
        
        # Remove the legend
        axis.legend().remove()
        
        plt.savefig(f"{current_dir}/figures/{acc_key}.pdf", bbox_inches="tight")
        plt.close()


def load_data():
    path = "outputs"
    datasets = ["graphData_v1", "graphData_v2", "graphData_v3", "graphData_v4", "graphData_img_only", "graphData_v4_wimg"]
    datasets_names = ["Model 1", "Model 2", "Model 3", "Model 4", "Model5", "Model 6"]
    current_dir = os.path.dirname(os.path.realpath(__file__))
    # orig_acc_keys = ["train_acc_list", "test_acc_list", "train_acc_top5_list", "test_acc_top5_list"]
    # acc_ratio_keys = ["acc_ratio", "acc_ratio_top5"]
    all_dfs = {}
    for i in range(len(datasets)):
        files = glob.glob(f"{current_dir}/{path}/{datasets[i]}/seed*/acc.npz")
        dfs = []
        for j, f in enumerate(files):
            data = dict(np.load(f))
            data["ts"] = np.arange(1, len(data["train_acc_list"])+1)
            data["acc_ratio"] = np.array(data["test_acc_list"])/np.array(data["train_acc_list"])
            data["acc_ratio_top5"] = np.array(data["test_acc_top5_list"])/np.array(data["train_acc_top5_list"])
            data = pd.DataFrame(data)
            data["id"] = j
            dfs.append(data)
        
        print(f"Dataset: {datasets[i]}")
        df = pd.concat(dfs, ignore_index=True)
        all_dfs[datasets_names[i]] = df
        
    return all_dfs


if __name__ == '__main__':
    # load data
    res_df = load_data()
    # plot data
    plot_results(res_df)