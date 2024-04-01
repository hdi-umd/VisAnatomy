# plot a bined histogram of the number of main chart marks
import matplotlib.pyplot as plt
import numpy as np
import math

# import labelAnalysis.json and read it as allStat
allStat = {
    "AreaChart1": {
        "num_allElements": 71,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.014084507042253521,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "AreaChart10": {
        "num_allElements": 70,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.014285714285714285,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "AreaChart11": {
        "num_allElements": 51,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.0784313725490196,
        "unique_mainChartMarkTypes": [
            "Area",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "AreaChart2": {
        "num_allElements": 55,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.01818181818181818,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "AreaChart3": {
        "num_allElements": 55,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.03636363636363636,
        "unique_mainChartMarkTypes": [
            "Area",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "AreaChart4": {
        "num_allElements": 65,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.015384615384615385,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "AreaChart5": {
        "num_allElements": 56,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.017857142857142856,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "AreaChart6": {
        "num_allElements": 33,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.030303030303030304,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "AreaChart7": {
        "num_allElements": 40,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.025,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "AreaChart8": {
        "num_allElements": 31,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.03225806451612903,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "AreaChart9": {
        "num_allElements": 30,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.03333333333333333,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "BarChart1": {
        "num_allElements": 30,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.16666666666666666,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "width"
            ]
        }
    },
    "BarChart10": {
        "num_allElements": 134,
        "num_mainChartMarks": 49,
        "ratio_main_over_all": 0.3656716417910448,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "BarChart2": {
        "num_allElements": 58,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.1724137931034483,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "width"
            ]
        }
    },
    "BarChart3": {
        "num_allElements": 35,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.2571428571428571,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height"
            ]
        }
    },
    "BarChart4": {
        "num_allElements": 394,
        "num_mainChartMarks": 33,
        "ratio_main_over_all": 0.08375634517766498,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height"
            ]
        }
    },
    "BarChart5": {
        "num_allElements": 276,
        "num_mainChartMarks": 52,
        "ratio_main_over_all": 0.18840579710144928,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "BarChart6": {
        "num_allElements": 157,
        "num_mainChartMarks": 15,
        "ratio_main_over_all": 0.09554140127388536,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "BarChart7": {
        "num_allElements": 34,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.29411764705882354,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "width"
            ]
        }
    },
    "BarChart8": {
        "num_allElements": 88,
        "num_mainChartMarks": 20,
        "ratio_main_over_all": 0.22727272727272727,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "width"
            ]
        }
    },
    "BarChart9": {
        "num_allElements": 106,
        "num_mainChartMarks": 26,
        "ratio_main_over_all": 0.24528301886792453,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height"
            ]
        }
    },
    "BarChartInRadialLayout1": {
        "num_allElements": 537,
        "num_mainChartMarks": 472,
        "ratio_main_over_all": 0.8789571694599627,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "BarChartInRadialLayout10": {
        "num_allElements": 38,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.2631578947368421,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "BarChartInRadialLayout2": {
        "num_allElements": 483,
        "num_mainChartMarks": 357,
        "ratio_main_over_all": 0.7391304347826086,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "BarChartInRadialLayout3": {
        "num_allElements": 177,
        "num_mainChartMarks": 51,
        "ratio_main_over_all": 0.288135593220339,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height"
            ]
        }
    },
    "BarChartInRadialLayout4": {
        "num_allElements": 705,
        "num_mainChartMarks": 51,
        "ratio_main_over_all": 0.07234042553191489,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "thickness"
            ]
        }
    },
    "BarChartInRadialLayout5": {
        "num_allElements": 1181,
        "num_mainChartMarks": 49,
        "ratio_main_over_all": 0.04149026248941575,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "BarChartInRadialLayout6": {
        "num_allElements": 161,
        "num_mainChartMarks": 102,
        "ratio_main_over_all": 0.6335403726708074,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "thickness",
                "fill"
            ]
        }
    },
    "BarChartInRadialLayout7": {
        "num_allElements": 349,
        "num_mainChartMarks": 252,
        "ratio_main_over_all": 0.7220630372492837,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "BarChartInRadialLayout8": {
        "num_allElements": 48,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.20833333333333334,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Radial"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height"
            ]
        }
    },
    "BarChartInRadialLayout9": {
        "num_allElements": 597,
        "num_mainChartMarks": 21,
        "ratio_main_over_all": 0.035175879396984924,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Radial"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "thickness",
                "fill",
                "outerRadius"
            ]
        }
    },
    "BoxAndWhisker1": {
        "num_allElements": 103,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.038834951456310676,
        "unique_mainChartMarkTypes": [
            "Path"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Path": [
                "vertices"
            ]
        }
    },
    "BoxAndWhisker10": {
        "num_allElements": 183,
        "num_mainChartMarks": 50,
        "ratio_main_over_all": 0.273224043715847,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1",
                "y"
            ]
        }
    },
    "BoxAndWhisker11": {
        "num_allElements": 135,
        "num_mainChartMarks": 97,
        "ratio_main_over_all": 0.7185185185185186,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Circle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Rectangle": [
                "top",
                "bottom"
            ],
            "Circle": [
                "y",
                "x"
            ],
            "Straight Line": [
                "y2",
                "y1",
                "y"
            ]
        }
    },
    "BoxAndWhisker2": {
        "num_allElements": 59,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.23728813559322035,
        "unique_mainChartMarkTypes": [
            "Path"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Path": [
                "vertices",
                "fill"
            ]
        }
    },
    "BoxAndWhisker3": {
        "num_allElements": 33,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.2727272727272727,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Straight Line": [
                "x1",
                "x2",
                "x"
            ],
            "Circle": [
                "x"
            ]
        }
    },
    "BoxAndWhisker4": {
        "num_allElements": 99,
        "num_mainChartMarks": 19,
        "ratio_main_over_all": 0.1919191919191919,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line",
            "Polygon",
            "Path"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1",
                "y"
            ],
            "Polygon": [
                "y"
            ],
            "Path": []
        }
    },
    "BoxAndWhisker5": {
        "num_allElements": 61,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.22950819672131148,
        "unique_mainChartMarkTypes": [
            "Path"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Path": [
                "vertices",
                "fill"
            ]
        }
    },
    "BoxAndWhisker6": {
        "num_allElements": 701,
        "num_mainChartMarks": 49,
        "ratio_main_over_all": 0.06990014265335236,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1",
                "y"
            ]
        }
    },
    "BoxAndWhisker7": {
        "num_allElements": 1125,
        "num_mainChartMarks": 1031,
        "ratio_main_over_all": 0.9164444444444444,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Rectangle": [
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1",
                "y"
            ],
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "BoxAndWhisker8": {
        "num_allElements": 512,
        "num_mainChartMarks": 475,
        "ratio_main_over_all": 0.927734375,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Rectangle": [
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1",
                "y"
            ],
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "BoxAndWhisker9": {
        "num_allElements": 42,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.2857142857142857,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1",
                "y"
            ]
        }
    },
    "BubbleChart1": {
        "num_allElements": 779,
        "num_mainChartMarks": 702,
        "ratio_main_over_all": 0.9011553273427471,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "fill",
                "x"
            ]
        }
    },
    "BubbleChart10": {
        "num_allElements": 759,
        "num_mainChartMarks": 686,
        "ratio_main_over_all": 0.9038208168642952,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "fill",
                "x"
            ]
        }
    },
    "BubbleChart11": {
        "num_allElements": 87,
        "num_mainChartMarks": 18,
        "ratio_main_over_all": 0.20689655172413793,
        "unique_mainChartMarkTypes": [
            "Text",
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Text": [
                "y",
                "text",
                "x"
            ],
            "Circle": [
                "radius",
                "y",
                "x"
            ]
        }
    },
    "BubbleChart12": {
        "num_allElements": 282,
        "num_mainChartMarks": 169,
        "ratio_main_over_all": 0.599290780141844,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "fill",
                "x"
            ]
        }
    },
    "BubbleChart2": {
        "num_allElements": 431,
        "num_mainChartMarks": 109,
        "ratio_main_over_all": 0.2529002320185615,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "fill",
                "x"
            ]
        }
    },
    "BubbleChart3": {
        "num_allElements": 140,
        "num_mainChartMarks": 84,
        "ratio_main_over_all": 0.6,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "fill",
                "x"
            ]
        }
    },
    "BubbleChart4": {
        "num_allElements": 110,
        "num_mainChartMarks": 29,
        "ratio_main_over_all": 0.2636363636363636,
        "unique_mainChartMarkTypes": [
            "Text",
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Text": [
                "y",
                "text",
                "x"
            ],
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "BubbleChart5": {
        "num_allElements": 203,
        "num_mainChartMarks": 147,
        "ratio_main_over_all": 0.7241379310344828,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "fill",
                "x"
            ]
        }
    },
    "BubbleChart6": {
        "num_allElements": 1691,
        "num_mainChartMarks": 1626,
        "ratio_main_over_all": 0.9615612063867534,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "fill",
                "x"
            ]
        }
    },
    "BubbleChart7": {
        "num_allElements": 204,
        "num_mainChartMarks": 49,
        "ratio_main_over_all": 0.24019607843137256,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "fill",
                "x"
            ]
        }
    },
    "BubbleChart8": {
        "num_allElements": 460,
        "num_mainChartMarks": 392,
        "ratio_main_over_all": 0.8521739130434782,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "x"
            ]
        }
    },
    "BubbleChart9": {
        "num_allElements": 369,
        "num_mainChartMarks": 187,
        "ratio_main_over_all": 0.5067750677506775,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "x"
            ]
        }
    },
    "BulletChart1": {
        "num_allElements": 69,
        "num_mainChartMarks": 19,
        "ratio_main_over_all": 0.2753623188405797,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "width"
            ],
            "Straight Line": [
                "x"
            ]
        }
    },
    "BulletChart10": {
        "num_allElements": 35,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.14285714285714285,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "width",
                "x"
            ]
        }
    },
    "BulletChart2": {
        "num_allElements": 56,
        "num_mainChartMarks": 24,
        "ratio_main_over_all": 0.42857142857142855,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height"
            ],
            "Straight Line": [
                "y"
            ]
        }
    },
    "BulletChart3": {
        "num_allElements": 12,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "width"
            ],
            "Straight Line": [
                "x"
            ]
        }
    },
    "BulletChart4": {
        "num_allElements": 45,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.1111111111111111,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "y",
                "top"
            ]
        }
    },
    "BulletChart5": {
        "num_allElements": 113,
        "num_mainChartMarks": 25,
        "ratio_main_over_all": 0.22123893805309736,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 5,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "x",
                "width",
                "left"
            ]
        }
    },
    "BulletChart6": {
        "num_allElements": 100,
        "num_mainChartMarks": 25,
        "ratio_main_over_all": 0.25,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 5,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "width",
                "x"
            ]
        }
    },
    "BulletChart7": {
        "num_allElements": 20,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.25,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "width",
                "left"
            ],
            "Straight Line": [
                "x"
            ]
        }
    },
    "BulletChart8": {
        "num_allElements": 75,
        "num_mainChartMarks": 24,
        "ratio_main_over_all": 0.32,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "y",
                "bottom"
            ]
        }
    },
    "BulletChart9": {
        "num_allElements": 114,
        "num_mainChartMarks": 16,
        "ratio_main_over_all": 0.14035087719298245,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 3,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "width",
                "left"
            ],
            "Circle": [
                "x"
            ]
        }
    },
    "BumpChart1": {
        "num_allElements": 233,
        "num_mainChartMarks": 170,
        "ratio_main_over_all": 0.7296137339055794,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Layered",
            "Encoded with Data"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "BumpChart10": {
        "num_allElements": 392,
        "num_mainChartMarks": 203,
        "ratio_main_over_all": 0.5178571428571429,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "BumpChart11": {
        "num_allElements": 612,
        "num_mainChartMarks": 26,
        "ratio_main_over_all": 0.042483660130718956,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "fill",
                "bottom-vertices-y"
            ]
        }
    },
    "BumpChart2": {
        "num_allElements": 102,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.09803921568627451,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "BumpChart3": {
        "num_allElements": 22,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.13636363636363635,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "fill",
                "bottom-vertices-y"
            ]
        }
    },
    "BumpChart4": {
        "num_allElements": 457,
        "num_mainChartMarks": 369,
        "ratio_main_over_all": 0.8074398249452954,
        "unique_mainChartMarkTypes": [
            "Text",
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 3,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Text": [
                "y",
                "text",
                "x"
            ],
            "Straight Line": [
                "y1",
                "y2",
                "x1",
                "color",
                "x2"
            ],
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "BumpChart5": {
        "num_allElements": 307,
        "num_mainChartMarks": 135,
        "ratio_main_over_all": 0.43973941368078173,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Layered",
            "Encoded with Data"
        ],
        "num_axes": 3,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "BumpChart6": {
        "num_allElements": 47,
        "num_mainChartMarks": 17,
        "ratio_main_over_all": 0.3617021276595745,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "BumpChart7": {
        "num_allElements": 388,
        "num_mainChartMarks": 210,
        "ratio_main_over_all": 0.5412371134020618,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Layered",
            "Encoded with Data"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "BumpChart8": {
        "num_allElements": 53,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.1509433962264151,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "fill",
                "bottom-vertices-y"
            ]
        }
    },
    "BumpChart9": {
        "num_allElements": 147,
        "num_mainChartMarks": 72,
        "ratio_main_over_all": 0.4897959183673469,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Layered",
            "Encoded with Data"
        ],
        "num_axes": 3,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "strokeColor",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "Calendar1": {
        "num_allElements": 6431,
        "num_mainChartMarks": 5105,
        "ratio_main_over_all": 0.7938112268698492,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Calendar10": {
        "num_allElements": 459,
        "num_mainChartMarks": 365,
        "ratio_main_over_all": 0.7952069716775599,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Text": [
                "y",
                "color",
                "x"
            ]
        }
    },
    "Calendar2": {
        "num_allElements": 249,
        "num_mainChartMarks": 130,
        "ratio_main_over_all": 0.5220883534136547,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Calendar3": {
        "num_allElements": 1497,
        "num_mainChartMarks": 1461,
        "ratio_main_over_all": 0.9759519038076152,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 5,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Calendar4": {
        "num_allElements": 1589,
        "num_mainChartMarks": 1473,
        "ratio_main_over_all": 0.9269981120201385,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 18,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Calendar5": {
        "num_allElements": 1949,
        "num_mainChartMarks": 1806,
        "ratio_main_over_all": 0.926629040533607,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 6,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Calendar6": {
        "num_allElements": 297,
        "num_mainChartMarks": 217,
        "ratio_main_over_all": 0.7306397306397306,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 7,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Calendar7": {
        "num_allElements": 1961,
        "num_mainChartMarks": 1827,
        "ratio_main_over_all": 0.9316675165731769,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 11,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Calendar8": {
        "num_allElements": 2751,
        "num_mainChartMarks": 2191,
        "ratio_main_over_all": 0.7964376590330788,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 12,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Calendar9": {
        "num_allElements": 61,
        "num_mainChartMarks": 60,
        "ratio_main_over_all": 0.9836065573770492,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Text"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill"
            ],
            "Text": [
                "text"
            ]
        }
    },
    "CandlestickChart1": {
        "num_allElements": 120,
        "num_mainChartMarks": 120,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1"
            ]
        }
    },
    "CandlestickChart10": {
        "num_allElements": 170,
        "num_mainChartMarks": 48,
        "ratio_main_over_all": 0.2823529411764706,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1"
            ]
        }
    },
    "CandlestickChart2": {
        "num_allElements": 126,
        "num_mainChartMarks": 74,
        "ratio_main_over_all": 0.5873015873015873,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1"
            ]
        }
    },
    "CandlestickChart3": {
        "num_allElements": 272,
        "num_mainChartMarks": 179,
        "ratio_main_over_all": 0.6580882352941176,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1",
                "color"
            ]
        }
    },
    "CandlestickChart4": {
        "num_allElements": 80,
        "num_mainChartMarks": 46,
        "ratio_main_over_all": 0.575,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1"
            ]
        }
    },
    "CandlestickChart5": {
        "num_allElements": 349,
        "num_mainChartMarks": 60,
        "ratio_main_over_all": 0.17191977077363896,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Circle",
            "Path"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Circle": [
                "fill",
                "y"
            ],
            "Path": [
                "vertices",
                "color"
            ]
        }
    },
    "CandlestickChart6": {
        "num_allElements": 76,
        "num_mainChartMarks": 42,
        "ratio_main_over_all": 0.5526315789473685,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1",
                "color"
            ]
        }
    },
    "CandlestickChart7": {
        "num_allElements": 454,
        "num_mainChartMarks": 425,
        "ratio_main_over_all": 0.9361233480176211,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1"
            ]
        }
    },
    "CandlestickChart8": {
        "num_allElements": 289,
        "num_mainChartMarks": 240,
        "ratio_main_over_all": 0.8304498269896193,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1"
            ]
        }
    },
    "CandlestickChart9": {
        "num_allElements": 123,
        "num_mainChartMarks": 60,
        "ratio_main_over_all": 0.4878048780487805,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1"
            ]
        }
    },
    "CirclePacking1": {
        "num_allElements": 300,
        "num_mainChartMarks": 150,
        "ratio_main_over_all": 0.5,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "CirclePacking10": {
        "num_allElements": 52,
        "num_mainChartMarks": 24,
        "ratio_main_over_all": 0.46153846153846156,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "CirclePacking2": {
        "num_allElements": 558,
        "num_mainChartMarks": 110,
        "ratio_main_over_all": 0.1971326164874552,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "CirclePacking3": {
        "num_allElements": 160,
        "num_mainChartMarks": 80,
        "ratio_main_over_all": 0.5,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "CirclePacking4": {
        "num_allElements": 145,
        "num_mainChartMarks": 70,
        "ratio_main_over_all": 0.4827586206896552,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "CirclePacking5": {
        "num_allElements": 254,
        "num_mainChartMarks": 252,
        "ratio_main_over_all": 0.9921259842519685,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Nested"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "CirclePacking6": {
        "num_allElements": 158,
        "num_mainChartMarks": 111,
        "ratio_main_over_all": 0.7025316455696202,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Nested"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "CirclePacking7": {
        "num_allElements": 1058,
        "num_mainChartMarks": 250,
        "ratio_main_over_all": 0.23629489603024575,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Nested"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "CirclePacking8": {
        "num_allElements": 1249,
        "num_mainChartMarks": 219,
        "ratio_main_over_all": 0.1753402722177742,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "CirclePacking9": {
        "num_allElements": 61,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.16393442622950818,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Nested"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "ConnectedDotPlot1": {
        "num_allElements": 62,
        "num_mainChartMarks": 30,
        "ratio_main_over_all": 0.4838709677419355,
        "unique_mainChartMarkTypes": [
            "Path",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Path": [
                "left",
                "right"
            ],
            "Circle": [
                "fill",
                "x"
            ]
        }
    },
    "ConnectedDotPlot10": {
        "num_allElements": 134,
        "num_mainChartMarks": 68,
        "ratio_main_over_all": 0.5074626865671642,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "x1",
                "x2"
            ],
            "Circle": [
                "fill",
                "x"
            ]
        }
    },
    "ConnectedDotPlot2": {
        "num_allElements": 74,
        "num_mainChartMarks": 35,
        "ratio_main_over_all": 0.47297297297297297,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "y2",
                "y1"
            ],
            "Circle": [
                "fill",
                "y"
            ]
        }
    },
    "ConnectedDotPlot3": {
        "num_allElements": 100,
        "num_mainChartMarks": 60,
        "ratio_main_over_all": 0.6,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "color",
                "x1",
                "x2"
            ],
            "Circle": [
                "fill",
                "x"
            ]
        }
    },
    "ConnectedDotPlot4": {
        "num_allElements": 48,
        "num_mainChartMarks": 15,
        "ratio_main_over_all": 0.3125,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "x1",
                "x2"
            ],
            "Circle": [
                "fill",
                "x"
            ]
        }
    },
    "ConnectedDotPlot5": {
        "num_allElements": 631,
        "num_mainChartMarks": 520,
        "ratio_main_over_all": 0.8240887480190174,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "x1",
                "x2"
            ],
            "Circle": [
                "fill",
                "x"
            ]
        }
    },
    "ConnectedDotPlot6": {
        "num_allElements": 371,
        "num_mainChartMarks": 154,
        "ratio_main_over_all": 0.41509433962264153,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "x1",
                "x2"
            ],
            "Circle": [
                "fill",
                "x"
            ]
        }
    },
    "ConnectedDotPlot7": {
        "num_allElements": 337,
        "num_mainChartMarks": 24,
        "ratio_main_over_all": 0.0712166172106825,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "x1",
                "x2"
            ],
            "Circle": [
                "fill",
                "x"
            ]
        }
    },
    "ConnectedDotPlot8": {
        "num_allElements": 112,
        "num_mainChartMarks": 64,
        "ratio_main_over_all": 0.5714285714285714,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "x2"
            ],
            "Circle": [
                "fill",
                "x"
            ]
        }
    },
    "ConnectedDotPlot9": {
        "num_allElements": 73,
        "num_mainChartMarks": 27,
        "ratio_main_over_all": 0.3698630136986301,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Straight Line": [
                "color",
                "x1",
                "x2"
            ],
            "Circle": [
                "fill",
                "x"
            ]
        }
    },
    "ConnectedScatterPlot1": {
        "num_allElements": 255,
        "num_mainChartMarks": 101,
        "ratio_main_over_all": 0.396078431372549,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "y2",
                "y1",
                "x1",
                "x2"
            ],
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "ConnectedScatterPlot10": {
        "num_allElements": 112,
        "num_mainChartMarks": 63,
        "ratio_main_over_all": 0.5625,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ConnectedScatterPlot2": {
        "num_allElements": 129,
        "num_mainChartMarks": 56,
        "ratio_main_over_all": 0.43410852713178294,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ConnectedScatterPlot3": {
        "num_allElements": 249,
        "num_mainChartMarks": 56,
        "ratio_main_over_all": 0.2248995983935743,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ConnectedScatterPlot4": {
        "num_allElements": 103,
        "num_mainChartMarks": 56,
        "ratio_main_over_all": 0.5436893203883495,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ConnectedScatterPlot5": {
        "num_allElements": 335,
        "num_mainChartMarks": 18,
        "ratio_main_over_all": 0.05373134328358209,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 3,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ConnectedScatterPlot6": {
        "num_allElements": 82,
        "num_mainChartMarks": 33,
        "ratio_main_over_all": 0.4024390243902439,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Layered",
            "Encoded with Data"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ConnectedScatterPlot7": {
        "num_allElements": 243,
        "num_mainChartMarks": 41,
        "ratio_main_over_all": 0.16872427983539096,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "y2",
                "y1",
                "x1",
                "x2"
            ],
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "ConnectedScatterPlot8": {
        "num_allElements": 59,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.1694915254237288,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ConnectedScatterPlot9": {
        "num_allElements": 187,
        "num_mainChartMarks": 126,
        "ratio_main_over_all": 0.6737967914438503,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 3,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "DensityPlot1": {
        "num_allElements": 355,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.016901408450704224,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "stroke color",
                "bottom-vertices-x"
            ]
        }
    },
    "DensityPlot10": {
        "num_allElements": 168,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.017857142857142856,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "DensityPlot11": {
        "num_allElements": 59,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.03389830508474576,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "DensityPlot2": {
        "num_allElements": 27,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.07407407407407407,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "DensityPlot3": {
        "num_allElements": 47,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.02127659574468085,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "DensityPlot4": {
        "num_allElements": 25,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.08,
        "unique_mainChartMarkTypes": [
            "Area",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "DensityPlot5": {
        "num_allElements": 28,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.03571428571428571,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "DensityPlot6": {
        "num_allElements": 42,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.023809523809523808,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "DensityPlot7": {
        "num_allElements": 62,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.1935483870967742,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "DensityPlot8": {
        "num_allElements": 70,
        "num_mainChartMarks": 17,
        "ratio_main_over_all": 0.24285714285714285,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "DensityPlot9": {
        "num_allElements": 226,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.05309734513274336,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "DivergingStackedBarChart1": {
        "num_allElements": 122,
        "num_mainChartMarks": 54,
        "ratio_main_over_all": 0.4426229508196721,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "DivergingStackedBarChart10": {
        "num_allElements": 60,
        "num_mainChartMarks": 38,
        "ratio_main_over_all": 0.6333333333333333,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "DivergingStackedBarChart11": {
        "num_allElements": 129,
        "num_mainChartMarks": 24,
        "ratio_main_over_all": 0.18604651162790697,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "DivergingStackedBarChart12": {
        "num_allElements": 840,
        "num_mainChartMarks": 16,
        "ratio_main_over_all": 0.01904761904761905,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "DivergingStackedBarChart2": {
        "num_allElements": 47,
        "num_mainChartMarks": 16,
        "ratio_main_over_all": 0.3404255319148936,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "DivergingStackedBarChart3": {
        "num_allElements": 82,
        "num_mainChartMarks": 38,
        "ratio_main_over_all": 0.4634146341463415,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "DivergingStackedBarChart4": {
        "num_allElements": 50,
        "num_mainChartMarks": 16,
        "ratio_main_over_all": 0.32,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "DivergingStackedBarChart5": {
        "num_allElements": 108,
        "num_mainChartMarks": 40,
        "ratio_main_over_all": 0.37037037037037035,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "DivergingStackedBarChart6": {
        "num_allElements": 783,
        "num_mainChartMarks": 228,
        "ratio_main_over_all": 0.29118773946360155,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "DivergingStackedBarChart7": {
        "num_allElements": 176,
        "num_mainChartMarks": 44,
        "ratio_main_over_all": 0.25,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "DivergingStackedBarChart8": {
        "num_allElements": 1264,
        "num_mainChartMarks": 252,
        "ratio_main_over_all": 0.19936708860759494,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "DivergingStackedBarChart9": {
        "num_allElements": 115,
        "num_mainChartMarks": 42,
        "ratio_main_over_all": 0.3652173913043478,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 3,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "DonutChart1": {
        "num_allElements": 31,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.1935483870967742,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "DonutChart10": {
        "num_allElements": 7,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.8571428571428571,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "DonutChart11": {
        "num_allElements": 26,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.19230769230769232,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "DonutChart12": {
        "num_allElements": 10,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.4,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "DonutChart3": {
        "num_allElements": 20,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.5,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "DonutChart4": {
        "num_allElements": 88,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.045454545454545456,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "DonutChart5": {
        "num_allElements": 24,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.20833333333333334,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "DonutChart6": {
        "num_allElements": 14,
        "num_mainChartMarks": 7,
        "ratio_main_over_all": 0.5,
        "unique_mainChartMarkTypes": [
            "Pie",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ],
            "Circle": []
        }
    },
    "DonutChart7": {
        "num_allElements": 16,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.25,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "DonutChart8": {
        "num_allElements": 29,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.1724137931034483,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "DonutChart9": {
        "num_allElements": 23,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.21739130434782608,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "DotPlot1": {
        "num_allElements": 36,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.25,
        "unique_mainChartMarkTypes": [
            "Path"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Encoded with Data"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Path": [
                "fill",
                "shape",
                "y",
                "x"
            ]
        }
    },
    "DotPlot10": {
        "num_allElements": 165,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.6060606060606061,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "DotPlot2": {
        "num_allElements": 82,
        "num_mainChartMarks": 42,
        "ratio_main_over_all": 0.5121951219512195,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Encoded with Data"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "DotPlot3": {
        "num_allElements": 81,
        "num_mainChartMarks": 32,
        "ratio_main_over_all": 0.3950617283950617,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Encoded with Data"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "DotPlot4": {
        "num_allElements": 49,
        "num_mainChartMarks": 20,
        "ratio_main_over_all": 0.40816326530612246,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Encoded with Data"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "DotPlot5": {
        "num_allElements": 129,
        "num_mainChartMarks": 66,
        "ratio_main_over_all": 0.5116279069767442,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": []
        }
    },
    "DotPlot6": {
        "num_allElements": 26,
        "num_mainChartMarks": 17,
        "ratio_main_over_all": 0.6538461538461539,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": []
        }
    },
    "DotPlot7": {
        "num_allElements": 525,
        "num_mainChartMarks": 468,
        "ratio_main_over_all": 0.8914285714285715,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "DotPlot8": {
        "num_allElements": 162,
        "num_mainChartMarks": 127,
        "ratio_main_over_all": 0.7839506172839507,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "DotPlot9": {
        "num_allElements": 63,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.15873015873015872,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "GanttChart1": {
        "num_allElements": 40,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.075,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "right",
                "y",
                "left"
            ]
        }
    },
    "GanttChart10": {
        "num_allElements": 77,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.1038961038961039,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "right",
                "fill",
                "y",
                "left"
            ]
        }
    },
    "GanttChart2": {
        "num_allElements": 48,
        "num_mainChartMarks": 11,
        "ratio_main_over_all": 0.22916666666666666,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "y",
                "left",
                "x",
                "fill",
                "right"
            ]
        }
    },
    "GanttChart3": {
        "num_allElements": 44,
        "num_mainChartMarks": 7,
        "ratio_main_over_all": 0.1590909090909091,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "right",
                "fill",
                "y",
                "left"
            ]
        }
    },
    "GanttChart4": {
        "num_allElements": 42,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.19047619047619047,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "right",
                "y",
                "left"
            ]
        }
    },
    "GanttChart5": {
        "num_allElements": 299,
        "num_mainChartMarks": 51,
        "ratio_main_over_all": 0.1705685618729097,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "right",
                "fill",
                "y",
                "left"
            ]
        }
    },
    "GanttChart6": {
        "num_allElements": 68,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.08823529411764706,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "right",
                "fill",
                "y",
                "left"
            ]
        }
    },
    "GanttChart7": {
        "num_allElements": 138,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.07246376811594203,
        "unique_mainChartMarkTypes": [
            "Path"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Path": [
                "fill",
                "y",
                "left",
                "right"
            ]
        }
    },
    "GanttChart8": {
        "num_allElements": 161,
        "num_mainChartMarks": 40,
        "ratio_main_over_all": 0.2484472049689441,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "right",
                "fill",
                "y",
                "left"
            ]
        }
    },
    "GanttChart9": {
        "num_allElements": 238,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.037815126050420166,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "right",
                "fill",
                "y",
                "left"
            ]
        }
    },
    "GeoHeatmap1": {
        "num_allElements": 2005,
        "num_mainChartMarks": 2005,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "geoPolygon"
        ],
        "unique_layoutTypes": [
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "geoPolygon": [
                "fill"
            ]
        }
    },
    "GeoHeatmap10": {
        "num_allElements": 51,
        "num_mainChartMarks": 51,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "geoPolygon"
        ],
        "unique_layoutTypes": [
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "geoPolygon": [
                "fill"
            ]
        }
    },
    "GeoHeatmap2": {
        "num_allElements": 3169,
        "num_mainChartMarks": 3143,
        "ratio_main_over_all": 0.991795519091196,
        "unique_mainChartMarkTypes": [
            "geoPolygon"
        ],
        "unique_layoutTypes": [
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "geoPolygon": [
                "fill"
            ]
        }
    },
    "GeoHeatmap3": {
        "num_allElements": 52,
        "num_mainChartMarks": 51,
        "ratio_main_over_all": 0.9807692307692307,
        "unique_mainChartMarkTypes": [
            "Circle",
            "geoPolygon"
        ],
        "unique_layoutTypes": [
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [],
            "geoPolygon": [
                "fill"
            ]
        }
    },
    "GeoHeatmap4": {
        "num_allElements": 763,
        "num_mainChartMarks": 649,
        "ratio_main_over_all": 0.8505897771952818,
        "unique_mainChartMarkTypes": [
            "geoPolygon"
        ],
        "unique_layoutTypes": [
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "geoPolygon": [
                "fill"
            ]
        }
    },
    "GeoHeatmap5": {
        "num_allElements": 3618,
        "num_mainChartMarks": 3607,
        "ratio_main_over_all": 0.9969596462133775,
        "unique_mainChartMarkTypes": [
            "geoPolygon"
        ],
        "unique_layoutTypes": [
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "geoPolygon": [
                "fill"
            ]
        }
    },
    "GeoHeatmap6": {
        "num_allElements": 196,
        "num_mainChartMarks": 156,
        "ratio_main_over_all": 0.7959183673469388,
        "unique_mainChartMarkTypes": [
            "geoPolygon"
        ],
        "unique_layoutTypes": [
            "Grid",
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "geoPolygon": [
                "fill"
            ]
        }
    },
    "GeoHeatmap7": {
        "num_allElements": 3146,
        "num_mainChartMarks": 3142,
        "ratio_main_over_all": 0.9987285441830897,
        "unique_mainChartMarkTypes": [
            "geoPolygon"
        ],
        "unique_layoutTypes": [
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "geoPolygon": [
                "fill"
            ]
        }
    },
    "GeoHeatmap8": {
        "num_allElements": 245,
        "num_mainChartMarks": 240,
        "ratio_main_over_all": 0.9795918367346939,
        "unique_mainChartMarkTypes": [
            "geoPolygon"
        ],
        "unique_layoutTypes": [
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "geoPolygon": [
                "fill"
            ]
        }
    },
    "GeoHeatmap9": {
        "num_allElements": 388,
        "num_mainChartMarks": 342,
        "ratio_main_over_all": 0.8814432989690721,
        "unique_mainChartMarkTypes": [
            "geoPolygon"
        ],
        "unique_layoutTypes": [
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "geoPolygon": [
                "fill"
            ]
        }
    },
    "GroupedBarChart1": {
        "num_allElements": 89,
        "num_mainChartMarks": 16,
        "ratio_main_over_all": 0.1797752808988764,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height"
            ]
        }
    },
    "GroupedBarChart10": {
        "num_allElements": 95,
        "num_mainChartMarks": 36,
        "ratio_main_over_all": 0.37894736842105264,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "GroupedBarChart2": {
        "num_allElements": 77,
        "num_mainChartMarks": 16,
        "ratio_main_over_all": 0.2077922077922078,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "width"
            ]
        }
    },
    "GroupedBarChart3": {
        "num_allElements": 49,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.24489795918367346,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "GroupedBarChart4": {
        "num_allElements": 506,
        "num_mainChartMarks": 244,
        "ratio_main_over_all": 0.48221343873517786,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "GroupedBarChart5": {
        "num_allElements": 44,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.22727272727272727,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "GroupedBarChart6": {
        "num_allElements": 66,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.21212121212121213,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "GroupedBarChart7": {
        "num_allElements": 40,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.3,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "GroupedBarChart8": {
        "num_allElements": 42,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.2857142857142857,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "GroupedBarChart9": {
        "num_allElements": 98,
        "num_mainChartMarks": 20,
        "ratio_main_over_all": 0.20408163265306123,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "Heatmap1": {
        "num_allElements": 4454,
        "num_mainChartMarks": 4335,
        "ratio_main_over_all": 0.9732824427480916,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap10": {
        "num_allElements": 225,
        "num_mainChartMarks": 72,
        "ratio_main_over_all": 0.32,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 3,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap11": {
        "num_allElements": 275,
        "num_mainChartMarks": 180,
        "ratio_main_over_all": 0.6545454545454545,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap12": {
        "num_allElements": 267,
        "num_mainChartMarks": 180,
        "ratio_main_over_all": 0.6741573033707865,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap13": {
        "num_allElements": 213,
        "num_mainChartMarks": 132,
        "ratio_main_over_all": 0.6197183098591549,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap2": {
        "num_allElements": 8861,
        "num_mainChartMarks": 8759,
        "ratio_main_over_all": 0.988488883873152,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap3": {
        "num_allElements": 5151,
        "num_mainChartMarks": 4771,
        "ratio_main_over_all": 0.926227916909338,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap4": {
        "num_allElements": 600,
        "num_mainChartMarks": 600,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "Polygon"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polygon": [
                "fill"
            ]
        }
    },
    "Heatmap5": {
        "num_allElements": 1348,
        "num_mainChartMarks": 1196,
        "ratio_main_over_all": 0.887240356083086,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap6": {
        "num_allElements": 991,
        "num_mainChartMarks": 928,
        "ratio_main_over_all": 0.9364278506559032,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap7": {
        "num_allElements": 1614,
        "num_mainChartMarks": 1440,
        "ratio_main_over_all": 0.8921933085501859,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap8": {
        "num_allElements": 142,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.704225352112676,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Heatmap9": {
        "num_allElements": 168,
        "num_mainChartMarks": 144,
        "ratio_main_over_all": 0.8571428571428571,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "KagiChart1": {
        "num_allElements": 80,
        "num_mainChartMarks": 30,
        "ratio_main_over_all": 0.375,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "KagiChart10": {
        "num_allElements": 44,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.2727272727272727,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "KagiChart2": {
        "num_allElements": 19,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.10526315789473684,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "KagiChart3": {
        "num_allElements": 54,
        "num_mainChartMarks": 23,
        "ratio_main_over_all": 0.42592592592592593,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "KagiChart4": {
        "num_allElements": 96,
        "num_mainChartMarks": 18,
        "ratio_main_over_all": 0.1875,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "vertices",
                "strokeColor",
                "vertices-x",
                "color",
                "vertices-y"
            ]
        }
    },
    "KagiChart5": {
        "num_allElements": 86,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.09302325581395349,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "KagiChart6": {
        "num_allElements": 200,
        "num_mainChartMarks": 102,
        "ratio_main_over_all": 0.51,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "KagiChart7": {
        "num_allElements": 78,
        "num_mainChartMarks": 54,
        "ratio_main_over_all": 0.6923076923076923,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "KagiChart8": {
        "num_allElements": 124,
        "num_mainChartMarks": 60,
        "ratio_main_over_all": 0.4838709677419355,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "KagiChart9": {
        "num_allElements": 78,
        "num_mainChartMarks": 54,
        "ratio_main_over_all": 0.6923076923076923,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph1": {
        "num_allElements": 35,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.02857142857142857,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph10": {
        "num_allElements": 61,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.13114754098360656,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph11": {
        "num_allElements": 55,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.05454545454545454,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph12": {
        "num_allElements": 69,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.028985507246376812,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph13": {
        "num_allElements": 64,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.15625,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph14": {
        "num_allElements": 65,
        "num_mainChartMarks": 25,
        "ratio_main_over_all": 0.38461538461538464,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph15": {
        "num_allElements": 22,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.045454545454545456,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph16": {
        "num_allElements": 22,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.045454545454545456,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph17": {
        "num_allElements": 117,
        "num_mainChartMarks": 64,
        "ratio_main_over_all": 0.5470085470085471,
        "unique_mainChartMarkTypes": [
            "Path",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Path": [
                "fill",
                "shape",
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph18": {
        "num_allElements": 123,
        "num_mainChartMarks": 52,
        "ratio_main_over_all": 0.42276422764227645,
        "unique_mainChartMarkTypes": [
            "Path",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Path": [
                "fill",
                "shape",
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph19": {
        "num_allElements": 109,
        "num_mainChartMarks": 62,
        "ratio_main_over_all": 0.5688073394495413,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph2": {
        "num_allElements": 113,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.017699115044247787,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph20": {
        "num_allElements": 185,
        "num_mainChartMarks": 36,
        "ratio_main_over_all": 0.1945945945945946,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polygon",
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 4,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ],
            "Polygon": [
                "fill",
                "y",
                "x"
            ],
            "Polyline": [
                "strokeDash",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph21": {
        "num_allElements": 62,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.22580645161290322,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph3": {
        "num_allElements": 66,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.045454545454545456,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph4": {
        "num_allElements": 76,
        "num_mainChartMarks": 11,
        "ratio_main_over_all": 0.14473684210526316,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph5": {
        "num_allElements": 51,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.1568627450980392,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph6": {
        "num_allElements": 129,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.046511627906976744,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph7": {
        "num_allElements": 48,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.20833333333333334,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph8": {
        "num_allElements": 48,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.020833333333333332,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "LineGraph9": {
        "num_allElements": 31,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.06451612903225806,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "MarimekkoChart1": {
        "num_allElements": 53,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.16981132075471697,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart10": {
        "num_allElements": 252,
        "num_mainChartMarks": 34,
        "ratio_main_over_all": 0.1349206349206349,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart11": {
        "num_allElements": 54,
        "num_mainChartMarks": 15,
        "ratio_main_over_all": 0.2777777777777778,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 3,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart12": {
        "num_allElements": 176,
        "num_mainChartMarks": 25,
        "ratio_main_over_all": 0.14204545454545456,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart13": {
        "num_allElements": 43,
        "num_mainChartMarks": 28,
        "ratio_main_over_all": 0.6511627906976745,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart2": {
        "num_allElements": 57,
        "num_mainChartMarks": 24,
        "ratio_main_over_all": 0.42105263157894735,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart3": {
        "num_allElements": 44,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.18181818181818182,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart4": {
        "num_allElements": 62,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.14516129032258066,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart5": {
        "num_allElements": 90,
        "num_mainChartMarks": 27,
        "ratio_main_over_all": 0.3,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart6": {
        "num_allElements": 96,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.125,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 3,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart7": {
        "num_allElements": 28,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.32142857142857145,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart8": {
        "num_allElements": 168,
        "num_mainChartMarks": 40,
        "ratio_main_over_all": 0.23809523809523808,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MarimekkoChart9": {
        "num_allElements": 60,
        "num_mainChartMarks": 16,
        "ratio_main_over_all": 0.26666666666666666,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "MatrixDiagram1": {
        "num_allElements": 6083,
        "num_mainChartMarks": 5929,
        "ratio_main_over_all": 0.9746835443037974,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "MatrixDiagram10": {
        "num_allElements": 26375,
        "num_mainChartMarks": 26059,
        "ratio_main_over_all": 0.9880189573459716,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "MatrixDiagram2": {
        "num_allElements": 488,
        "num_mainChartMarks": 390,
        "ratio_main_over_all": 0.7991803278688525,
        "unique_mainChartMarkTypes": [
            "Text",
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Text": [
                "y",
                "text",
                "x"
            ],
            "Circle": [
                "radius",
                "y",
                "x"
            ]
        }
    },
    "MatrixDiagram3": {
        "num_allElements": 369,
        "num_mainChartMarks": 25,
        "ratio_main_over_all": 0.06775067750677506,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "MatrixDiagram4": {
        "num_allElements": 1358,
        "num_mainChartMarks": 361,
        "ratio_main_over_all": 0.2658321060382916,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "radius",
                "y",
                "fill",
                "x"
            ]
        }
    },
    "MatrixDiagram5": {
        "num_allElements": 6560,
        "num_mainChartMarks": 6400,
        "ratio_main_over_all": 0.975609756097561,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "MatrixDiagram6": {
        "num_allElements": 268,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.373134328358209,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "MatrixDiagram7": {
        "num_allElements": 270,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.37037037037037035,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "MatrixDiagram8": {
        "num_allElements": 490,
        "num_mainChartMarks": 200,
        "ratio_main_over_all": 0.40816326530612246,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Circle",
            "Polygon"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "shape",
                "x"
            ],
            "Circle": [
                "shape"
            ],
            "Polygon": [
                "y",
                "shape",
                "x"
            ]
        }
    },
    "MatrixDiagram9": {
        "num_allElements": 206,
        "num_mainChartMarks": 36,
        "ratio_main_over_all": 0.17475728155339806,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "ParallelCoordinatesPlot1": {
        "num_allElements": 482,
        "num_mainChartMarks": 406,
        "ratio_main_over_all": 0.8423236514522822,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 4,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-y"
            ]
        }
    },
    "ParallelCoordinatesPlot10": {
        "num_allElements": 891,
        "num_mainChartMarks": 255,
        "ratio_main_over_all": 0.28619528619528617,
        "unique_mainChartMarkTypes": [
            "Straight Line"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Straight Line": [
                "y2",
                "y1",
                "color"
            ]
        }
    },
    "ParallelCoordinatesPlot2": {
        "num_allElements": 169,
        "num_mainChartMarks": 32,
        "ratio_main_over_all": 0.1893491124260355,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ParallelCoordinatesPlot3": {
        "num_allElements": 301,
        "num_mainChartMarks": 129,
        "ratio_main_over_all": 0.42857142857142855,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ParallelCoordinatesPlot4": {
        "num_allElements": 2134,
        "num_mainChartMarks": 406,
        "ratio_main_over_all": 0.190253045923149,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 4,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ParallelCoordinatesPlot5": {
        "num_allElements": 2318,
        "num_mainChartMarks": 2254,
        "ratio_main_over_all": 0.9723899913718723,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 7,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ParallelCoordinatesPlot6": {
        "num_allElements": 102,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.0196078431372549,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ParallelCoordinatesPlot7": {
        "num_allElements": 60,
        "num_mainChartMarks": 29,
        "ratio_main_over_all": 0.48333333333333334,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ParallelCoordinatesPlot8": {
        "num_allElements": 141,
        "num_mainChartMarks": 54,
        "ratio_main_over_all": 0.3829787234042553,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 4,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ParallelCoordinatesPlot9": {
        "num_allElements": 1977,
        "num_mainChartMarks": 1968,
        "ratio_main_over_all": 0.9954476479514416,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "PieChart1": {
        "num_allElements": 21,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.19047619047619047,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart10": {
        "num_allElements": 14,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.35714285714285715,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart11": {
        "num_allElements": 25,
        "num_mainChartMarks": 7,
        "ratio_main_over_all": 0.28,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart12": {
        "num_allElements": 16,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.25,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart13": {
        "num_allElements": 16,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.25,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart14": {
        "num_allElements": 60,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.08333333333333333,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart2": {
        "num_allElements": 28,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.21428571428571427,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart3": {
        "num_allElements": 36,
        "num_mainChartMarks": 7,
        "ratio_main_over_all": 0.19444444444444445,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart4": {
        "num_allElements": 37,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.32432432432432434,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart5": {
        "num_allElements": 578,
        "num_mainChartMarks": 108,
        "ratio_main_over_all": 0.18685121107266436,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart6": {
        "num_allElements": 13,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.46153846153846156,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart7": {
        "num_allElements": 158,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.08860759493670886,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart8": {
        "num_allElements": 17,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.23529411764705882,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PieChart9": {
        "num_allElements": 27,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.2222222222222222,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "PolarAreaChart1": {
        "num_allElements": 256,
        "num_mainChartMarks": 112,
        "ratio_main_over_all": 0.4375,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "thickness",
                "fill"
            ]
        }
    },
    "PolarAreaChart10": {
        "num_allElements": 91,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.10989010989010989,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "fill",
                "outerRadius"
            ]
        }
    },
    "PolarAreaChart2": {
        "num_allElements": 186,
        "num_mainChartMarks": 112,
        "ratio_main_over_all": 0.6021505376344086,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "thickness",
                "fill"
            ]
        }
    },
    "PolarAreaChart3": {
        "num_allElements": 55,
        "num_mainChartMarks": 21,
        "ratio_main_over_all": 0.38181818181818183,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "thickness",
                "fill"
            ]
        }
    },
    "PolarAreaChart4": {
        "num_allElements": 104,
        "num_mainChartMarks": 34,
        "ratio_main_over_all": 0.3269230769230769,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Radial",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Pie": [
                "fill",
                "outerRadius"
            ]
        }
    },
    "PolarAreaChart5": {
        "num_allElements": 13,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.46153846153846156,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "outerRadius"
            ]
        }
    },
    "PolarAreaChart6": {
        "num_allElements": 20,
        "num_mainChartMarks": 7,
        "ratio_main_over_all": 0.35,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "angle",
                "fill",
                "outerRadius"
            ]
        }
    },
    "PolarAreaChart7": {
        "num_allElements": 60,
        "num_mainChartMarks": 20,
        "ratio_main_over_all": 0.3333333333333333,
        "unique_mainChartMarkTypes": [
            "Pie"
        ],
        "unique_layoutTypes": [
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Pie": [
                "fill",
                "outerRadius"
            ]
        }
    },
    "PolarAreaChart8": {
        "num_allElements": 66,
        "num_mainChartMarks": 46,
        "ratio_main_over_all": 0.696969696969697,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "fill",
                "opacity"
            ]
        }
    },
    "PolarAreaChart9": {
        "num_allElements": 43,
        "num_mainChartMarks": 36,
        "ratio_main_over_all": 0.8372093023255814,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "thickness",
                "fill"
            ]
        }
    },
    "RadarChart1": {
        "num_allElements": 91,
        "num_mainChartMarks": 30,
        "ratio_main_over_all": 0.32967032967032966,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line"
        ],
        "unique_layoutTypes": [
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "polarAngle",
                "fill",
                "polarRadius"
            ],
            "Straight Line": [
                "y1",
                "y2",
                "x1",
                "color",
                "x2"
            ]
        }
    },
    "RadarChart10": {
        "num_allElements": 87,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.011494252873563218,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "vertices-polarAngle",
                "vertices-polarRadius"
            ]
        }
    },
    "RadarChart2": {
        "num_allElements": 18,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.16666666666666666,
        "unique_mainChartMarkTypes": [
            "Polygon"
        ],
        "unique_layoutTypes": [],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polygon": [
                "vertices",
                "fill"
            ]
        }
    },
    "RadarChart3": {
        "num_allElements": 151,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.6622516556291391,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polygon"
        ],
        "unique_layoutTypes": [
            "Layered",
            "Encoded with Data"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "polarAngle",
                "fill",
                "polarRadius"
            ],
            "Polygon": [
                "vertices-polarAngle",
                "fill",
                "strokeColor",
                "vertices-polarRadius"
            ]
        }
    },
    "RadarChart4": {
        "num_allElements": 27,
        "num_mainChartMarks": 7,
        "ratio_main_over_all": 0.25925925925925924,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polygon"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "polarAngle",
                "polarRadius"
            ],
            "Polygon": [
                "vertices-polarAngle",
                "vertices-polarRadius"
            ]
        }
    },
    "RadarChart5": {
        "num_allElements": 77,
        "num_mainChartMarks": 28,
        "ratio_main_over_all": 0.36363636363636365,
        "unique_mainChartMarkTypes": [
            "Pie",
            "Polygon",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Pie": [
                "fill",
                "outerRadius"
            ],
            "Polygon": [
                "vertices-polarAngle",
                "vertices-polarRadius"
            ],
            "Circle": [
                "polarAngle",
                "polarRadius"
            ]
        }
    },
    "RadarChart6": {
        "num_allElements": 35,
        "num_mainChartMarks": 7,
        "ratio_main_over_all": 0.2,
        "unique_mainChartMarkTypes": [
            "Polygon"
        ],
        "unique_layoutTypes": [],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Polygon": [
                "vertices-polarAngle",
                "fill",
                "strokeColor",
                "vertices-polarRadius"
            ]
        }
    },
    "RadarChart7": {
        "num_allElements": 37,
        "num_mainChartMarks": 16,
        "ratio_main_over_all": 0.43243243243243246,
        "unique_mainChartMarkTypes": [
            "Text",
            "Polygon"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Text": [
                "polarAngle",
                "polarRadius",
                "text"
            ],
            "Polygon": [
                "vertices-polarAngle",
                "fill",
                "strokeColor",
                "vertices-polarRadius"
            ]
        }
    },
    "RadarChart8": {
        "num_allElements": 125,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.112,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Polygon"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "polarAngle",
                "polarRadius"
            ],
            "Polygon": [
                "vertices-polarAngle",
                "vertices-polarRadius"
            ]
        }
    },
    "RadarChart9": {
        "num_allElements": 67,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.1791044776119403,
        "unique_mainChartMarkTypes": [
            "Pie",
            "Polygon",
            "Polyline",
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Pie": [
                "startAngle",
                "fill",
                "endAngle"
            ],
            "Polygon": [
                "vertices-polarAngle",
                "vertices",
                "vertices-polarRadius"
            ],
            "Polyline": [
                "vertices-polarAngle",
                "vertices-polarRadius"
            ],
            "Circle": [
                "polarAngle",
                "polarRadius",
                "y",
                "x"
            ]
        }
    },
    "RadialBarChart1": {
        "num_allElements": 25,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.32,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Arc"
        ],
        "unique_layoutTypes": [
            "Radial",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "polarRadius"
            ],
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "RadialBarChart10": {
        "num_allElements": 35,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.2857142857142857,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Radial",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "RadialBarChart2": {
        "num_allElements": 13,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.23076923076923078,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "RadialBarChart3": {
        "num_allElements": 9,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.6666666666666666,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Radial",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "RadialBarChart4": {
        "num_allElements": 50,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.2,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Arc"
        ],
        "unique_layoutTypes": [
            "Radial",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [],
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "RadialBarChart5": {
        "num_allElements": 94,
        "num_mainChartMarks": 15,
        "ratio_main_over_all": 0.1595744680851064,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "RadialBarChart6": {
        "num_allElements": 38,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.10526315789473684,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Radial"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "angle"
            ]
        }
    },
    "RadialBarChart7": {
        "num_allElements": 31,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.25806451612903225,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "RadialBarChart8": {
        "num_allElements": 15,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.5333333333333333,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Arc"
        ],
        "unique_layoutTypes": [
            "Radial",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [],
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "RadialBarChart9": {
        "num_allElements": 13,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.6153846153846154,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Radial",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "RangeChart1": {
        "num_allElements": 435,
        "num_mainChartMarks": 365,
        "ratio_main_over_all": 0.8390804597701149,
        "unique_mainChartMarkTypes": [
            "Straight Line"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Straight Line": [
                "y2",
                "y1",
                "color",
                "x"
            ]
        }
    },
    "RangeChart10": {
        "num_allElements": 138,
        "num_mainChartMarks": 95,
        "ratio_main_over_all": 0.6884057971014492,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Circle",
            "Area",
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Encoded with Data"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "y",
                "x"
            ],
            "Circle": [
                "y",
                "x"
            ],
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "bottom-vertices-y"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "RangeChart11": {
        "num_allElements": 51,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.0392156862745098,
        "unique_mainChartMarkTypes": [
            "Area",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "bottom-vertices-y"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "RangeChart2": {
        "num_allElements": 83,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.12048192771084337,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "top",
                "bottom"
            ]
        }
    },
    "RangeChart3": {
        "num_allElements": 72,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.013888888888888888,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "bottom-vertices-y"
            ]
        }
    },
    "RangeChart4": {
        "num_allElements": 1031,
        "num_mainChartMarks": 1004,
        "ratio_main_over_all": 0.973811833171678,
        "unique_mainChartMarkTypes": [
            "Straight Line"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "y2",
                "y1",
                "color",
                "x"
            ]
        }
    },
    "RangeChart5": {
        "num_allElements": 78,
        "num_mainChartMarks": 1,
        "ratio_main_over_all": 0.01282051282051282,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "bottom-vertices-y"
            ]
        }
    },
    "RangeChart6": {
        "num_allElements": 86,
        "num_mainChartMarks": 24,
        "ratio_main_over_all": 0.27906976744186046,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "RangeChart7": {
        "num_allElements": 45,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.06666666666666667,
        "unique_mainChartMarkTypes": [
            "Area",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "bottom-vertices-y"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "RangeChart8": {
        "num_allElements": 125,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.024,
        "unique_mainChartMarkTypes": [
            "Area",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "bottom-vertices-y"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "RangeChart9": {
        "num_allElements": 29,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.1724137931034483,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "right",
                "left"
            ]
        }
    },
    "Scatterplot1": {
        "num_allElements": 105,
        "num_mainChartMarks": 44,
        "ratio_main_over_all": 0.41904761904761906,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "Scatterplot10": {
        "num_allElements": 535,
        "num_mainChartMarks": 500,
        "ratio_main_over_all": 0.9345794392523364,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Scatterplot11": {
        "num_allElements": 4081,
        "num_mainChartMarks": 3644,
        "ratio_main_over_all": 0.8929184023523646,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 18,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Scatterplot12": {
        "num_allElements": 5756,
        "num_mainChartMarks": 5472,
        "ratio_main_over_all": 0.9506601806810285,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 8,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Scatterplot13": {
        "num_allElements": 148,
        "num_mainChartMarks": 89,
        "ratio_main_over_all": 0.6013513513513513,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Scatterplot14": {
        "num_allElements": 146,
        "num_mainChartMarks": 91,
        "ratio_main_over_all": 0.6232876712328768,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Scatterplot2": {
        "num_allElements": 94,
        "num_mainChartMarks": 55,
        "ratio_main_over_all": 0.5851063829787234,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "Scatterplot3": {
        "num_allElements": 724,
        "num_mainChartMarks": 581,
        "ratio_main_over_all": 0.8024861878453039,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Scatterplot4": {
        "num_allElements": 28,
        "num_mainChartMarks": 11,
        "ratio_main_over_all": 0.39285714285714285,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "Scatterplot5": {
        "num_allElements": 5738,
        "num_mainChartMarks": 5697,
        "ratio_main_over_all": 0.9928546531892646,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Scatterplot6": {
        "num_allElements": 355,
        "num_mainChartMarks": 151,
        "ratio_main_over_all": 0.4253521126760563,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "Scatterplot7": {
        "num_allElements": 287,
        "num_mainChartMarks": 192,
        "ratio_main_over_all": 0.6689895470383276,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "Scatterplot8": {
        "num_allElements": 2399,
        "num_mainChartMarks": 2346,
        "ratio_main_over_all": 0.9779074614422676,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "Scatterplot9": {
        "num_allElements": 191,
        "num_mainChartMarks": 110,
        "ratio_main_over_all": 0.5759162303664922,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "y",
                "x"
            ]
        }
    },
    "SpiralPlot1": {
        "num_allElements": 246,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.056910569105691054,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Spiral"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "SpiralPlot10": {
        "num_allElements": 5984,
        "num_mainChartMarks": 1994,
        "ratio_main_over_all": 0.33322192513368987,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Spiral"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "SpiralPlot2": {
        "num_allElements": 14249,
        "num_mainChartMarks": 14186,
        "ratio_main_over_all": 0.9955786370973402,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Spiral"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "fill"
            ]
        }
    },
    "SpiralPlot3": {
        "num_allElements": 755,
        "num_mainChartMarks": 377,
        "ratio_main_over_all": 0.49933774834437084,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Spiral"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "fill"
            ]
        }
    },
    "SpiralPlot4": {
        "num_allElements": 150,
        "num_mainChartMarks": 117,
        "ratio_main_over_all": 0.78,
        "unique_mainChartMarkTypes": [
            "Arc"
        ],
        "unique_layoutTypes": [
            "Spiral"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Arc": [
                "fill"
            ]
        }
    },
    "SpiralPlot5": {
        "num_allElements": 2037,
        "num_mainChartMarks": 2000,
        "ratio_main_over_all": 0.9818360333824251,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Spiral"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "SpiralPlot6": {
        "num_allElements": 1124,
        "num_mainChartMarks": 366,
        "ratio_main_over_all": 0.32562277580071175,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Spiral"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "SpiralPlot7": {
        "num_allElements": 3899,
        "num_mainChartMarks": 3898,
        "ratio_main_over_all": 0.9997435239805078,
        "unique_mainChartMarkTypes": [
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Spiral"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Polyline": [
                "color",
                "length"
            ]
        }
    },
    "SpiralPlot8": {
        "num_allElements": 6602,
        "num_mainChartMarks": 2198,
        "ratio_main_over_all": 0.33292941532868825,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Spiral"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height"
            ]
        }
    },
    "SpiralPlot9": {
        "num_allElements": 7811,
        "num_mainChartMarks": 2603,
        "ratio_main_over_all": 0.3332479836128537,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Spiral"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "StackedAreaChart1": {
        "num_allElements": 60,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.08333333333333333,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StackedAreaChart10": {
        "num_allElements": 30,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.06666666666666667,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StackedAreaChart11": {
        "num_allElements": 111,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.08108108108108109,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StackedAreaChart12": {
        "num_allElements": 74,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.08108108108108109,
        "unique_mainChartMarkTypes": [
            "Area",
            "Polyline"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ],
            "Polyline": [
                "strokeColor",
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "StackedAreaChart2": {
        "num_allElements": 69,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.08695652173913043,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StackedAreaChart3": {
        "num_allElements": 69,
        "num_mainChartMarks": 46,
        "ratio_main_over_all": 0.6666666666666666,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StackedAreaChart4": {
        "num_allElements": 80,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.0375,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StackedAreaChart5": {
        "num_allElements": 52,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.17307692307692307,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StackedAreaChart6": {
        "num_allElements": 59,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.1694915254237288,
        "unique_mainChartMarkTypes": [
            "Area",
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "StackedAreaChart7": {
        "num_allElements": 60,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.05,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "x list",
                "fill",
                "bottom-vertices-y"
            ]
        }
    },
    "StackedAreaChart8": {
        "num_allElements": 6,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StackedAreaChart9": {
        "num_allElements": 56,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.25,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StackedBarChart1": {
        "num_allElements": 662,
        "num_mainChartMarks": 468,
        "ratio_main_over_all": 0.7069486404833837,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "StackedBarChart10": {
        "num_allElements": 598,
        "num_mainChartMarks": 468,
        "ratio_main_over_all": 0.782608695652174,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "StackedBarChart11": {
        "num_allElements": 106,
        "num_mainChartMarks": 24,
        "ratio_main_over_all": 0.22641509433962265,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "StackedBarChart12": {
        "num_allElements": 126,
        "num_mainChartMarks": 35,
        "ratio_main_over_all": 0.2777777777777778,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "StackedBarChart2": {
        "num_allElements": 644,
        "num_mainChartMarks": 468,
        "ratio_main_over_all": 0.7267080745341615,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "StackedBarChart3": {
        "num_allElements": 115,
        "num_mainChartMarks": 28,
        "ratio_main_over_all": 0.24347826086956523,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "StackedBarChart4": {
        "num_allElements": 138,
        "num_mainChartMarks": 54,
        "ratio_main_over_all": 0.391304347826087,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "StackedBarChart5": {
        "num_allElements": 83,
        "num_mainChartMarks": 38,
        "ratio_main_over_all": 0.4578313253012048,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "StackedBarChart6": {
        "num_allElements": 108,
        "num_mainChartMarks": 60,
        "ratio_main_over_all": 0.5555555555555556,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "StackedBarChart7": {
        "num_allElements": 102,
        "num_mainChartMarks": 54,
        "ratio_main_over_all": 0.5294117647058824,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "StackedBarChart8": {
        "num_allElements": 121,
        "num_mainChartMarks": 38,
        "ratio_main_over_all": 0.3140495867768595,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "StackedBarChart9": {
        "num_allElements": 132,
        "num_mainChartMarks": 60,
        "ratio_main_over_all": 0.45454545454545453,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "StreamGraph1": {
        "num_allElements": 167,
        "num_mainChartMarks": 25,
        "ratio_main_over_all": 0.1497005988023952,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StreamGraph10": {
        "num_allElements": 669,
        "num_mainChartMarks": 600,
        "ratio_main_over_all": 0.8968609865470852,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Circle",
            "Area",
            "Polygon"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [],
            "Circle": [
                "fill",
                "y",
                "shape",
                "x"
            ],
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ],
            "Polygon": []
        }
    },
    "StreamGraph2": {
        "num_allElements": 76,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.11842105263157894,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "top-vertices-y",
                "fill"
            ]
        }
    },
    "StreamGraph3": {
        "num_allElements": 78,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.0641025641025641,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StreamGraph4": {
        "num_allElements": 50,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.16,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StreamGraph5": {
        "num_allElements": 87,
        "num_mainChartMarks": 7,
        "ratio_main_over_all": 0.08045977011494253,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "top-vertices-y",
                "top-vertices-x",
                "bottom-vertices-x",
                "fill",
                "bottom-vertices-y"
            ]
        }
    },
    "StreamGraph6": {
        "num_allElements": 21,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.47619047619047616,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StreamGraph7": {
        "num_allElements": 50,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.18,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StreamGraph8": {
        "num_allElements": 151,
        "num_mainChartMarks": 50,
        "ratio_main_over_all": 0.33112582781456956,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "StreamGraph9": {
        "num_allElements": 389,
        "num_mainChartMarks": 70,
        "ratio_main_over_all": 0.17994858611825193,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "Treemap1": {
        "num_allElements": 1029,
        "num_mainChartMarks": 220,
        "ratio_main_over_all": 0.21379980563654033,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap10": {
        "num_allElements": 286,
        "num_mainChartMarks": 30,
        "ratio_main_over_all": 0.1048951048951049,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap11": {
        "num_allElements": 47,
        "num_mainChartMarks": 36,
        "ratio_main_over_all": 0.7659574468085106,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap12": {
        "num_allElements": 809,
        "num_mainChartMarks": 67,
        "ratio_main_over_all": 0.08281829419035847,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap13": {
        "num_allElements": 48,
        "num_mainChartMarks": 10,
        "ratio_main_over_all": 0.20833333333333334,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap2": {
        "num_allElements": 171,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.03508771929824561,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap3": {
        "num_allElements": 233,
        "num_mainChartMarks": 25,
        "ratio_main_over_all": 0.1072961373390558,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Nested"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap4": {
        "num_allElements": 148,
        "num_mainChartMarks": 28,
        "ratio_main_over_all": 0.1891891891891892,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap5": {
        "num_allElements": 60,
        "num_mainChartMarks": 15,
        "ratio_main_over_all": 0.25,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap6": {
        "num_allElements": 742,
        "num_mainChartMarks": 67,
        "ratio_main_over_all": 0.09029649595687332,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap7": {
        "num_allElements": 726,
        "num_mainChartMarks": 457,
        "ratio_main_over_all": 0.6294765840220385,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap8": {
        "num_allElements": 128,
        "num_mainChartMarks": 22,
        "ratio_main_over_all": 0.171875,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "Treemap9": {
        "num_allElements": 18,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.4444444444444444,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Nested"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "ViolinPlot1": {
        "num_allElements": 28,
        "num_mainChartMarks": 4,
        "ratio_main_over_all": 0.14285714285714285,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line",
            "Area",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1"
            ],
            "Area": [
                "left-vertices-y",
                "width",
                "right-vertices-y"
            ],
            "Circle": [
                "y"
            ]
        }
    },
    "ViolinPlot10": {
        "num_allElements": 35,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.08571428571428572,
        "unique_mainChartMarkTypes": [
            "Path",
            "Straight Line",
            "Area"
        ],
        "unique_layoutTypes": [
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Path": [
                "vertices"
            ],
            "Straight Line": [
                "x"
            ],
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "ViolinPlot11": {
        "num_allElements": 230,
        "num_mainChartMarks": 183,
        "ratio_main_over_all": 0.7956521739130434,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Circle",
            "Straight Line",
            "Area"
        ],
        "unique_layoutTypes": [
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "top",
                "bottom"
            ],
            "Circle": [
                "y",
                "x"
            ],
            "Straight Line": [
                "y2",
                "y1",
                "y"
            ],
            "Area": [
                "left-vertices-y",
                "width",
                "right-vertices-y"
            ]
        }
    },
    "ViolinPlot12": {
        "num_allElements": 519,
        "num_mainChartMarks": 480,
        "ratio_main_over_all": 0.9248554913294798,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Area"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y",
                "x"
            ],
            "Area": [
                "height",
                "top-vertices-x",
                "bottom-vertices-x"
            ]
        }
    },
    "ViolinPlot13": {
        "num_allElements": 135,
        "num_mainChartMarks": 2,
        "ratio_main_over_all": 0.014814814814814815,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "left-vertices-x",
                "fill",
                "width",
                "right-vertices-y"
            ]
        }
    },
    "ViolinPlot2": {
        "num_allElements": 111,
        "num_mainChartMarks": 60,
        "ratio_main_over_all": 0.5405405405405406,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Straight Line",
            "Area",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "top",
                "bottom"
            ],
            "Straight Line": [
                "y2",
                "y1"
            ],
            "Area": [
                "left-vertices-y",
                "fill",
                "width",
                "right-vertices-y"
            ],
            "Circle": [
                "y"
            ]
        }
    },
    "ViolinPlot3": {
        "num_allElements": 155,
        "num_mainChartMarks": 45,
        "ratio_main_over_all": 0.2903225806451613,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Area",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Straight Line": [
                "y2",
                "y1",
                "y"
            ],
            "Area": [
                "left-vertices-y",
                "fill",
                "width",
                "right-vertices-y"
            ],
            "Circle": [
                "fill",
                "y"
            ]
        }
    },
    "ViolinPlot4": {
        "num_allElements": 44,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.2727272727272727,
        "unique_mainChartMarkTypes": [
            "Path",
            "Straight Line",
            "Area",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Path": [
                "vertices"
            ],
            "Straight Line": [
                "y"
            ],
            "Area": [
                "left-vertices-y",
                "width",
                "right-vertices-y"
            ],
            "Circle": [
                "y"
            ]
        }
    },
    "ViolinPlot5": {
        "num_allElements": 31,
        "num_mainChartMarks": 3,
        "ratio_main_over_all": 0.0967741935483871,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "left-vertices-y",
                "width",
                "right-vertices-y"
            ]
        }
    },
    "ViolinPlot6": {
        "num_allElements": 51,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.17647058823529413,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Area"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "x1",
                "x2",
                "x"
            ],
            "Area": [
                "height",
                "top-vertices-x",
                "fill",
                "bottom-vertices-x"
            ]
        }
    },
    "ViolinPlot7": {
        "num_allElements": 43,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.11627906976744186,
        "unique_mainChartMarkTypes": [
            "Area"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Area": [
                "left-vertices-y",
                "fill",
                "width",
                "right-vertices-y"
            ]
        }
    },
    "ViolinPlot8": {
        "num_allElements": 754,
        "num_mainChartMarks": 35,
        "ratio_main_over_all": 0.046419098143236075,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Area",
            "Polyline"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "y"
            ],
            "Area": [
                "left-vertices-y",
                "width",
                "right-vertices-y"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ]
        }
    },
    "ViolinPlot9": {
        "num_allElements": 91,
        "num_mainChartMarks": 46,
        "ratio_main_over_all": 0.5054945054945055,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Area",
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Straight Line": [
                "y"
            ],
            "Area": [
                "left-vertices-y",
                "fill",
                "width",
                "right-vertices-y"
            ],
            "Circle": [
                "y",
                "x"
            ]
        }
    },
    "WaffleChart1": {
        "num_allElements": 113,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.8849557522123894,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill"
            ]
        }
    },
    "WaffleChart10": {
        "num_allElements": 52,
        "num_mainChartMarks": 50,
        "ratio_main_over_all": 0.9615384615384616,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill"
            ]
        }
    },
    "WaffleChart11": {
        "num_allElements": 79,
        "num_mainChartMarks": 50,
        "ratio_main_over_all": 0.6329113924050633,
        "unique_mainChartMarkTypes": [
            "Path"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Path": [
                "fill",
                "shape"
            ]
        }
    },
    "WaffleChart12": {
        "num_allElements": 169,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.591715976331361,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill"
            ]
        }
    },
    "WaffleChart13": {
        "num_allElements": 169,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.591715976331361,
        "unique_mainChartMarkTypes": [
            "Path"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Path": [
                "fill"
            ]
        }
    },
    "WaffleChart14": {
        "num_allElements": 1159,
        "num_mainChartMarks": 700,
        "ratio_main_over_all": 0.6039689387402933,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill"
            ]
        }
    },
    "WaffleChart2": {
        "num_allElements": 210,
        "num_mainChartMarks": 192,
        "ratio_main_over_all": 0.9142857142857143,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill"
            ]
        }
    },
    "WaffleChart3": {
        "num_allElements": 113,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.8849557522123894,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill"
            ]
        }
    },
    "WaffleChart4": {
        "num_allElements": 443,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.22573363431151242,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill"
            ]
        }
    },
    "WaffleChart5": {
        "num_allElements": 147,
        "num_mainChartMarks": 97,
        "ratio_main_over_all": 0.6598639455782312,
        "unique_mainChartMarkTypes": [
            "Path"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Path": [
                "fill",
                "shape"
            ]
        }
    },
    "WaffleChart6": {
        "num_allElements": 416,
        "num_mainChartMarks": 400,
        "ratio_main_over_all": 0.9615384615384616,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill"
            ]
        }
    },
    "WaffleChart7": {
        "num_allElements": 74,
        "num_mainChartMarks": 50,
        "ratio_main_over_all": 0.6756756756756757,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill"
            ]
        }
    },
    "WaffleChart8": {
        "num_allElements": 115,
        "num_mainChartMarks": 95,
        "ratio_main_over_all": 0.8260869565217391,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill"
            ]
        }
    },
    "WaffleChart9": {
        "num_allElements": 144,
        "num_mainChartMarks": 100,
        "ratio_main_over_all": 0.6944444444444444,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill"
            ]
        }
    },
    "WaterfallChart1": {
        "num_allElements": 96,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.14583333333333334,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart10": {
        "num_allElements": 98,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.14285714285714285,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart11": {
        "num_allElements": 77,
        "num_mainChartMarks": 7,
        "ratio_main_over_all": 0.09090909090909091,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart12": {
        "num_allElements": 257,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.0311284046692607,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart13": {
        "num_allElements": 80,
        "num_mainChartMarks": 8,
        "ratio_main_over_all": 0.1,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart2": {
        "num_allElements": 41,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.21951219512195122,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart3": {
        "num_allElements": 87,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.16091954022988506,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart4": {
        "num_allElements": 173,
        "num_mainChartMarks": 42,
        "ratio_main_over_all": 0.24277456647398843,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart5": {
        "num_allElements": 75,
        "num_mainChartMarks": 7,
        "ratio_main_over_all": 0.09333333333333334,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart6": {
        "num_allElements": 85,
        "num_mainChartMarks": 14,
        "ratio_main_over_all": 0.16470588235294117,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart7": {
        "num_allElements": 59,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.2033898305084746,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart8": {
        "num_allElements": 28,
        "num_mainChartMarks": 5,
        "ratio_main_over_all": 0.17857142857142858,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WaterfallChart9": {
        "num_allElements": 51,
        "num_mainChartMarks": 6,
        "ratio_main_over_all": 0.11764705882352941,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "top",
                "bottom"
            ]
        }
    },
    "WordCloud1": {
        "num_allElements": 250,
        "num_mainChartMarks": 250,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Text": [
                "fontSize"
            ]
        }
    },
    "WordCloud10": {
        "num_allElements": 411,
        "num_mainChartMarks": 411,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Text": [
                "color",
                "fontSize"
            ]
        }
    },
    "WordCloud2": {
        "num_allElements": 520,
        "num_mainChartMarks": 520,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Text": [
                "color",
                "fontSize"
            ]
        }
    },
    "WordCloud3": {
        "num_allElements": 195,
        "num_mainChartMarks": 128,
        "ratio_main_over_all": 0.6564102564102564,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Text": [
                "color",
                "fontSize"
            ]
        }
    },
    "WordCloud4": {
        "num_allElements": 218,
        "num_mainChartMarks": 200,
        "ratio_main_over_all": 0.9174311926605505,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Text": [
                "fontSize"
            ]
        }
    },
    "WordCloud5": {
        "num_allElements": 114,
        "num_mainChartMarks": 101,
        "ratio_main_over_all": 0.8859649122807017,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Text": [
                "color",
                "fontSize"
            ]
        }
    },
    "WordCloud6": {
        "num_allElements": 149,
        "num_mainChartMarks": 129,
        "ratio_main_over_all": 0.8657718120805369,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Text": [
                "color",
                "fontSize"
            ]
        }
    },
    "WordCloud7": {
        "num_allElements": 12,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Text": [
                "fontSize"
            ]
        }
    },
    "WordCloud8": {
        "num_allElements": 12,
        "num_mainChartMarks": 9,
        "ratio_main_over_all": 0.75,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Text": [
                "fontSize"
            ]
        }
    },
    "WordCloud9": {
        "num_allElements": 75,
        "num_mainChartMarks": 75,
        "ratio_main_over_all": 1.0,
        "unique_mainChartMarkTypes": [
            "Text"
        ],
        "unique_layoutTypes": [
            "Packing"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Text": [
                "color",
                "fontSize"
            ]
        }
    },
    "_bespoke1": {
        "num_allElements": 459,
        "num_mainChartMarks": 408,
        "ratio_main_over_all": 0.8888888888888888,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "geoCoordinates"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "_bespoke10": {
        "num_allElements": 326,
        "num_mainChartMarks": 253,
        "ratio_main_over_all": 0.7760736196319018,
        "unique_mainChartMarkTypes": [
            "Path",
            "Pie"
        ],
        "unique_layoutTypes": [
            "geoCoordinates",
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Path": [
                "fill"
            ],
            "Pie": [
                "angle",
                "fill"
            ]
        }
    },
    "_bespoke11": {
        "num_allElements": 136,
        "num_mainChartMarks": 20,
        "ratio_main_over_all": 0.14705882352941177,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "_bespoke12": {
        "num_allElements": 82,
        "num_mainChartMarks": 22,
        "ratio_main_over_all": 0.2682926829268293,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "_bespoke13": {
        "num_allElements": 108,
        "num_mainChartMarks": 48,
        "ratio_main_over_all": 0.4444444444444444,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "_bespoke14": {
        "num_allElements": 138,
        "num_mainChartMarks": 20,
        "ratio_main_over_all": 0.14492753623188406,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "_bespoke15": {
        "num_allElements": 176,
        "num_mainChartMarks": 73,
        "ratio_main_over_all": 0.4147727272727273,
        "unique_mainChartMarkTypes": [
            "Straight Line",
            "Circle",
            "Rectangle",
            "Polyline",
            "Path"
        ],
        "unique_layoutTypes": [
            "Grid"
        ],
        "num_axes": 3,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Straight Line": [
                "y2",
                "y1",
                "x"
            ],
            "Circle": [
                "fill",
                "y",
                "x"
            ],
            "Rectangle": [
                "height"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ],
            "Path": [
                "bottom",
                "top",
                "x"
            ]
        }
    },
    "_bespoke16": {
        "num_allElements": 75,
        "num_mainChartMarks": 24,
        "ratio_main_over_all": 0.32,
        "unique_mainChartMarkTypes": [
            "Rectangle",
            "Circle",
            "Polyline",
            "Arc"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ],
            "Circle": [
                "y",
                "x"
            ],
            "Polyline": [
                "vertices-x",
                "vertices-y"
            ],
            "Arc": [
                "angle",
                "fill"
            ]
        }
    },
    "_bespoke17": {
        "num_allElements": 62,
        "num_mainChartMarks": 12,
        "ratio_main_over_all": 0.1935483870967742,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 3,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "_bespoke18": {
        "num_allElements": 322,
        "num_mainChartMarks": 173,
        "ratio_main_over_all": 0.5372670807453416,
        "unique_mainChartMarkTypes": [
            "Circle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ]
        }
    },
    "_bespoke2": {
        "num_allElements": 1562,
        "num_mainChartMarks": 1506,
        "ratio_main_over_all": 0.9641485275288092,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Packing"
        ],
        "num_axes": 3,
        "nestedGroupDepth": 4,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "area"
            ]
        }
    },
    "_bespoke3": {
        "num_allElements": 88,
        "num_mainChartMarks": 20,
        "ratio_main_over_all": 0.22727272727272727,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 3,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "_bespoke4": {
        "num_allElements": 119,
        "num_mainChartMarks": 106,
        "ratio_main_over_all": 0.8907563025210085,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": []
        }
    },
    "_bespoke5": {
        "num_allElements": 81,
        "num_mainChartMarks": 51,
        "ratio_main_over_all": 0.6296296296296297,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "_bespoke6": {
        "num_allElements": 83,
        "num_mainChartMarks": 16,
        "ratio_main_over_all": 0.1927710843373494,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Glyph"
        ],
        "num_axes": 1,
        "nestedGroupDepth": 2,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill"
            ]
        }
    },
    "_bespoke7": {
        "num_allElements": 108,
        "num_mainChartMarks": 24,
        "ratio_main_over_all": 0.2222222222222222,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Grid",
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Rectangle": [
                "fill",
                "width"
            ]
        }
    },
    "_bespoke8": {
        "num_allElements": 129,
        "num_mainChartMarks": 18,
        "ratio_main_over_all": 0.13953488372093023,
        "unique_mainChartMarkTypes": [
            "Rectangle"
        ],
        "unique_layoutTypes": [
            "Stack"
        ],
        "num_axes": 2,
        "nestedGroupDepth": 1,
        "unique_encodingChannels": {
            "Rectangle": [
                "height",
                "fill",
                "width"
            ]
        }
    },
    "_bespoke9": {
        "num_allElements": 310,
        "num_mainChartMarks": 244,
        "ratio_main_over_all": 0.7870967741935484,
        "unique_mainChartMarkTypes": [
            "Circle",
            "Arc"
        ],
        "unique_layoutTypes": [
            "Stack",
            "Radial"
        ],
        "num_axes": 0,
        "nestedGroupDepth": 3,
        "unique_encodingChannels": {
            "Circle": [
                "fill",
                "radius"
            ],
            "Arc": [
                "angle",
                "fill"
            ]
        }
    }
}

# # plot the histogram of the number of main chart marks
# num_mainChartMarks = [allStat[chartName]['num_mainChartMarks'] for chartName in allStat]
# plt.hist(num_mainChartMarks, bins=range(0, 500, 10), edgecolor='black')
# # print the number of charts whose number of main chart marks is larger than 500 in the chart as an annotation
# plt.xlabel('Number of Main Chart Marks')
# plt.ylabel('Number of Charts')
# plt.title('Histogram of the Number of Main Chart Marks')
# plt.show()

# # plot the histogram of the number of all elements
# num_allElements = [allStat[chartName]['num_allElements'] for chartName in allStat]
# plt.hist(num_allElements, bins=range(0, 2000, 50), edgecolor='black')
# # print the number of charts whose number of all elements is larger than 2000 in the chart as an annotation
# plt.xlabel('Number of All Graphical Primitives')
# plt.ylabel('Number of Charts')
# plt.title('Histogram of the Number of All Graphical Primitives')
# plt.show()

# # plot the histogram of the ratio of main over all
# ratio_main_over_all = [allStat[chartName]['ratio_main_over_all'] for chartName in allStat]
# plt.hist(ratio_main_over_all, bins=np.arange(0, 1.1, 0.1), edgecolor='black')
# # print the number of charts whose ratio of main over all is larger than 1 in the chart as an annotation
# plt.xlabel('Ratio of Main Chart Marks over All Marks')
# plt.ylabel('Number of Charts')
# plt.title('Histogram of the Ratio of Main over All')
# plt.show()

# # plot the histogram of the number of axes
# num_axes = [allStat[chartName]['num_axes'] for chartName in allStat]
# # plot the numbers of axes above each bar in the chart
# plt.hist(num_axes, bins=range(0, 20, 1), edgecolor='black')
# # print the number of charts whose number of axes is larger than 4 in the chart as an annotation
# plt.xlabel('Number of Axes')
# plt.ylabel('Number of Charts')
# # set y as log
# plt.yscale('log')
# plt.title('Histogram of the Number of Axes')
# plt.show()

# Get the nested group depth data
nestedGroupDepth = [allStat[chartName]['nestedGroupDepth'] for chartName in allStat]
# Count the occurrence of each nested group depth
depthCounts = [nestedGroupDepth.count(i) for i in range(1, 5)]
# Set the x-axis labels
xLabels = [str(i) for i in range(1, 5)]
# Create the bar chart
plt.figure(figsize=(8, 6))
plt.bar(xLabels, depthCounts, align='center', edgecolor='black')
# Print the number of charts whose nested group depth is larger than 4 as an annotation
plt.xlabel('Nested Group Depth')
plt.ylabel('Number of Charts')
plt.title('Histogram of the Nested Group Depth')
plt.tight_layout()
plt.show()

# # count unique_mainChartMarkTypes occurrence in all charts in the dataset and sort them by occurrence and plot the bar chart
# unique_mainChartMarkTypes = {}
# for chartName in allStat:
#     for markType in allStat[chartName]['unique_mainChartMarkTypes']:
#         if markType not in unique_mainChartMarkTypes:
#             unique_mainChartMarkTypes[markType] = 1
#         else:
#             unique_mainChartMarkTypes[markType] += 1
# # sort the unique_mainChartMarkTypes by occurrence
# unique_mainChartMarkTypes = dict(sorted(unique_mainChartMarkTypes.items(), key=lambda item: item[1], reverse=True))
# # plot the bar chart
# plt.bar(unique_mainChartMarkTypes.keys(), unique_mainChartMarkTypes.values())
# plt.xlabel('Main Chart Mark Types')
# # rotate the x axis labels for better readability
# plt.xticks(rotation=45)
# plt.ylabel('Number of Charts')
# plt.title('Distribution of Main Chart Mark Types')
# # add space at the bottom to prevent the x-axis label from being cut off
# plt.subplots_adjust(bottom=0.15)
# plt.show()

# # count unique_layoutTypes occurrence in all charts in the dataset and sort them by occurrence and plot the bar chart
# unique_layoutTypes = {}
# for chartName in allStat:
#     for layoutType in allStat[chartName]['unique_layoutTypes']:
#         if layoutType not in unique_layoutTypes:
#             unique_layoutTypes[layoutType] = 1
#         else:
#             unique_layoutTypes[layoutType] += 1
# # sort the unique_layoutTypes by occurrence
# unique_layoutTypes = dict(sorted(unique_layoutTypes.items(), key=lambda item: item[1], reverse=True))
# # plot the bar chart
# plt.bar(unique_layoutTypes.keys(), unique_layoutTypes.values())
# plt.xlabel('Layout Types')
# # rotate the x axis labels for better readability
# plt.xticks(rotation=45)
# plt.ylabel('Number of Charts')
# plt.title('Distribution of Layout Types')
# plt.subplots_adjust(bottom=0.15)
# plt.show()

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

# fig, axs = plt.subplots(num_rows, num_cols, figsize=(12, 12))
# # add a title for the whole figure
# fig.suptitle('Distribution of Encoded Channels for Different Mark Types', fontsize=16)

# for i, markType in enumerate(unique_encodingChannels):
#     unique_encodingChannels[markType] = dict(sorted(unique_encodingChannels[markType].items(), key=lambda item: item[1], reverse=True))
#     row = i // num_cols
#     col = i % num_cols
#     axs[row, col].bar(unique_encodingChannels[markType].keys(), unique_encodingChannels[markType].values())
#     # Adjust x-axis label alignment and positioning
#     labels = axs[row, col].get_xticklabels()
#     axs[row, col].set_xticklabels(labels, rotation=-45, ha='left', rotation_mode='anchor', fontsize=8)
#     axs[row, col].set_ylabel('Number of Charts')
#     axs[row, col].set_title(markType)
    
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
# plt.show()
