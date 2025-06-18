# plot a bined histogram of the number of main chart marks
import matplotlib.pyplot as plt
import numpy as np
import math
import json
import os

# import labelAnalysis.json under the same folder and read it as allStat
allStat = {}
current_dir = os.path.dirname(os.path.realpath(__file__))
with open(current_dir + '/labelAnalysis.json', 'r') as f:
    allStat = json.load(f)
print('Number of charts:', len(allStat))

# # plot the histogram of the number of main chart marks
# # calculate the number of charts whose number of main chart marks is larger than 1000
# num_mainChartMarks_larger_than_1000 = len([allStat[chartName]['num_mainChartMarks'] for chartName in allStat if allStat[chartName]['num_mainChartMarks'] > 500])
# print('Number of charts whose number of main chart marks is larger than 1000:', num_mainChartMarks_larger_than_1000)
# # calculate the maximum number of main chart marks
# max_mainChartMarks = max([allStat[chartName]['num_mainChartMarks'] for chartName in allStat])
# print('Maximum number of main chart marks:', max_mainChartMarks)
# num_mainChartMarks = [allStat[chartName]['num_mainChartMarks'] for chartName in allStat]
# # set size as 16:9
# plt.figure(figsize=(16, 9))
# plt.hist(num_mainChartMarks, bins=range(0, 1500, 15))
# # enlarge the font size of x and y axis labels and titles
# plt.xticks(fontsize=24)
# plt.yticks(fontsize=24)
# plt.xlabel('Number of Main Chart Marks', fontsize=30)
# plt.ylabel('Number of Charts', fontsize=30)
# # set y as log
# plt.yscale('log')
# # plt.title('Histogram of the Number of Main Chart Marks')
# plt.savefig('histOverNumOfMainChartMarks.pdf')
# plt.close()

# # plot the histogram of the number of all elements
# num_allElements = [allStat[chartName]['num_allElements'] for chartName in allStat]
# # calculate the number of charts whose number of all elements is larger than 1000
# num_allElements_larger_than_1000 = len([allStat[chartName]['num_allElements'] for chartName in allStat if allStat[chartName]['num_allElements'] > 1000])
# print('Number of charts whose number of all elements is larger than 1000:', num_allElements_larger_than_1000)
# plt.figure(figsize=(16, 9))
# plt.hist(num_allElements, bins=range(0, 2000, 20))
# plt.xticks(fontsize=24)
# plt.yticks(fontsize=24)
# plt.yscale('log')
# plt.xlabel('Number of All Graphical Primitives', fontsize=30)
# plt.ylabel('Number of Charts', fontsize=30)
# # plt.title('Histogram of the Number of All Graphical Primitives')
# plt.savefig('histOverNumOfAllElements.pdf')
# plt.close()

# # plot the histogram of the ratio of main over all
# ratio_main_over_all = [allStat[chartName]['ratio_main_over_all'] for chartName in allStat]
# # get the number of ratios that is smaller than or equal to 0.4
# num_ratios_smaller_than_04 = len([allStat[chartName]['ratio_main_over_all'] for chartName in allStat if allStat[chartName]['ratio_main_over_all'] >= 0.9])
# print('Number of charts whose ratio of main over all is smaller than or equal to 0.4:', num_ratios_smaller_than_04)
# plt.figure(figsize=(16, 9))
# plt.hist(ratio_main_over_all, bins=np.arange(0, 1.1, 0.1))
# plt.xticks(fontsize=24)
# plt.yticks(fontsize=24)
# plt.xlabel('Ratio of Main Chart Marks over All Graphical Primitives', fontsize=30)
# plt.ylabel('Number of Charts', fontsize=30)
# # plt.title('Histogram of the Ratio of Main over All')
# plt.savefig('histOverRatio.pdf')
# plt.close()

# # plot the histogram of the number of axes
# num_axes = [allStat[chartName]['num_axes'] for chartName in allStat]
# # print the number of charts whose number of axes is larger than 20
# num_axes_larger_than_20 = len([allStat[chartName]['num_axes'] for chartName in allStat if allStat[chartName]['num_axes'] > 20])
# # get the number of charts whose number of axes is no larger than 2
# num_axes_no_larger_than_2 = len([allStat[chartName]['num_axes'] for chartName in allStat if allStat[chartName]['num_axes'] <= 2])
# print('Number of charts whose number of axes is no larger than 2:', num_axes_no_larger_than_2)
# print('Number of charts whose number of axes is larger than 20:', num_axes_larger_than_20)
# plt.figure(figsize=(16, 9))
# plt.hist(num_axes, bins=range(0, 20, 1))
# plt.xticks(fontsize=24)
# plt.yticks(fontsize=24)
# plt.xticks(range(0, 20, 1))
# plt.xlabel('Number of Axes', fontsize=30)
# plt.ylabel('Number of Charts', fontsize=30)
# # set y as log
# plt.yscale('log')
# # plt.title('Histogram of the Number of Axes')
# plt.savefig('histOverAxes.pdf')
# plt.close()

# # Get the nested group depth data
# nestedGroupDepth = [allStat[chartName]['nestedGroupDepth'] for chartName in allStat]
# # Count the occurrence of each nested group depth
# depthCounts = [nestedGroupDepth.count(i) for i in range(1, 4)]
# # Set the x-axis labels
# xLabels = [str(i) for i in range(1, 4)]
# print(depthCounts)
# # Create the bar chart
# plt.figure(figsize=(8, 6))
# plt.bar(xLabels, depthCounts, align='center', edgecolor='black')
# plt.yscale('log')
# plt.xlabel('Nested Group Depth')
# plt.ylabel('Number of Charts')
# plt.title('Histogram of the Nested Group Depth')
# plt.tight_layout()
# plt.show()

# # # count unique_mainChartMarkTypes occurrence in all charts in the dataset and sort them by occurrence and plot the bar chart
# unique_mainChartMarkTypes = {}
# for chartName in allStat:
#     for markType in allStat[chartName]['unique_mainChartMarkTypes']:
#         if markType not in unique_mainChartMarkTypes:
#             unique_mainChartMarkTypes[markType] = 1
#         else:
#             unique_mainChartMarkTypes[markType] += 1
# # sort the unique_mainChartMarkTypes by occurrence
# unique_mainChartMarkTypes = dict(sorted(unique_mainChartMarkTypes.items(), key=lambda item: item[1], reverse=True))
# print(unique_mainChartMarkTypes)
# # plot the bar chart
# plt.figure(figsize=(16, 9))
# plt.bar(unique_mainChartMarkTypes.keys(), unique_mainChartMarkTypes.values())
# plt.xticks(fontsize=24)
# plt.yticks(fontsize=24)
# plt.xlabel('Main Chart Mark Types', fontsize=30)
# # rotate the x axis labels for better readability
# plt.xticks(rotation=45)
# plt.ylabel('Number of Charts', fontsize=30)
# # plt.title('Distribution of Main Chart Mark Types')
# # add space at the bottom to prevent the x-axis label from being cut off
# plt.subplots_adjust(bottom=0.15)
# plt.tight_layout()
# plt.savefig('main_chart_mark_types_distribution.pdf')
# plt.close()

# count unique_layoutTypes occurrence in all charts in the dataset and sort them by occurrence and plot the bar chart
unique_layoutTypes = {}
for chartName in allStat:
    for layoutType in allStat[chartName]['unique_layoutTypes']:
        if layoutType not in unique_layoutTypes:
            unique_layoutTypes[layoutType] = 1
        else:
            unique_layoutTypes[layoutType] += 1
# sort the unique_layoutTypes by occurrence
unique_layoutTypes = dict(sorted(unique_layoutTypes.items(), key=lambda item: item[1], reverse=True))
# remove both Encoded with Data and Layered keys from the dictionary
unique_layoutTypes.pop('Encoded with Data', None)
unique_layoutTypes.pop('Layered', None)
print(unique_layoutTypes)
# plot the bar chart
plt.figure(figsize=(16, 9))
plt.bar(unique_layoutTypes.keys(), unique_layoutTypes.values())
plt.xticks(fontsize=24)
plt.yticks(fontsize=24)
plt.xlabel('Layout Types', fontsize=30)
# rotate the x axis labels for better readability
plt.xticks(rotation=45)
plt.ylabel('Number of Charts', fontsize=30)
# plt.title('Distribution of Layout Types')
plt.tight_layout()
plt.savefig('layouts_distribution.pdf')
plt.close()

# # for each mark type, pass all charts and record the occurrence of each encoding channel, and then plot the bar chart for each chart type
# unique_encodingChannels = {}
# for chartName in allStat:
#     for markType in allStat[chartName]['unique_mainChartMarkTypes']:
#         if markType not in unique_encodingChannels:
#             unique_encodingChannels[markType] = {}
#         for encodingChannel in allStat[chartName]['unique_encodingChannels'][markType]:
#             if encodingChannel not in unique_encodingChannels[markType]:
#                 unique_encodingChannels[markType][encodingChannel] = 1
#             else:
#                 unique_encodingChannels[markType][encodingChannel] += 1

# # plot 10 sub figure for the 10 mark types, and place them into 2D
# num_subplots = len(unique_encodingChannels)
# num_rows = 3
# num_cols = 4

# fig, axs = plt.subplots(num_rows, num_cols, figsize=(32,32))
# # add a title for the whole figure
# # fig.suptitle('Distribution of Encoded Channels for Different Mark Types', fontsize=16)

# for i, markType in enumerate(unique_encodingChannels):
#     unique_encodingChannels[markType] = dict(sorted(unique_encodingChannels[markType].items(), key=lambda item: item[1], reverse=True))
#     row = i // num_cols
#     col = i % num_cols
#     axs[row, col].bar(unique_encodingChannels[markType].keys(), unique_encodingChannels[markType].values())
#     # Adjust x-axis label alignment and positioning
#     labels = axs[row, col].get_xticklabels()
#     axs[row, col].set_xticklabels(labels, rotation=-45, ha='left', rotation_mode='anchor', fontsize=24)
#     # set y-axis tick font size to be 24
#     axs[row, col].tick_params(axis='y', labelsize=24)
#     axs[row, col].set_ylabel('Number of Charts', fontsize=30)
#     axs[row, col].set_title(markType, fontsize=30)
    
#     # Adjust the bottom margin to prevent text overlap
#     plt.subplots_adjust(bottom=0.15)
    
#     # Increase vertical spacing between subplots
#     plt.subplots_adjust(hspace=0.8)

# # Remove any unused subplots
# for i in range(num_subplots, num_rows * num_cols):
#     row = i // num_cols
#     col = i % num_cols
#     fig.delaxes(axs[row, col])

# plt.tight_layout()
# plt.savefig('encodingInfo.pdf')
# plt.close()
