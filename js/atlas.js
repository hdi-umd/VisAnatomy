/* eslint-disable */
// version: 1.7.3
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3'), require('pixi.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3', 'pixi.js'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.atlas = {}, global.d3, global.PIXI));
}(this, (function (exports, d3, PIXI) { 'use strict';

	function _interopNamespace(e) {
		if (e && e.__esModule) return e;
		var n = Object.create(null);
		if (e) {
			Object.keys(e).forEach(function (k) {
				if (k !== 'default') {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () {
							return e[k];
						}
					});
				}
			});
		}
		n['default'] = e;
		return Object.freeze(n);
	}

	var d3__namespace = /*#__PURE__*/_interopNamespace(d3);
	var PIXI__namespace = /*#__PURE__*/_interopNamespace(PIXI);

	class Rectangle {

		constructor(left, top, width, height) {
			this.left = left;
			this.top = top;
			this.width = width;
			this.height = height;
		}

		toJSON() {
			let json = {};
			json.left = this.left;
			json.top = this.top;
			json.width = this.width;
			json.height = this.height;
			return json;
		}

		union(rect) {
			let left = Math.min(this.left, rect.left),
				top = Math.min(this.top, rect.top),
				right = Math.max(this.right, rect.right),
				btm = Math.max(this.bottom, rect.bottom);
			return new Rectangle(left, top, right - left, btm - top);
		}

		clone() {
			return new Rectangle(this.left, this.top, this.width, this.height);
		}

		get right() {
			return this.left + this.width;
		}

		get bottom() {
			return this.top + this.height;
		}

		get x() {
			return (this.left + this.right)/2;
		}

		get y() {
			return (this.top + this.bottom)/2;
		}

		get center() {
			return (this.left + this.right)/2;
		}

		get middle() {
			return (this.top + this.bottom)/2;
		}

		contains(x, y) {
			return this.left <= x && this.right >= x && this.top <= y && this.bottom >= y;
		}

		overlap(r) {
			return !(this.right < r.left || this.bottom < r.top || this.left > r.right || this.top > r.bottom);
		}

	}

	const nodeId = "id";

	const atlas_rowId = "atlas_rowId";

	const ScaleType = ["linear", "power", "log", "sqrt", "symlog", "identity", "time", "ordinal", "band", "point", "ordinalColor", "sequentialColor", "divergingColor"]; 

	const CurveMode = {
		Natural: "natural",
		Basis: "basis",
		BumpX: "bumpX",
		BumpY: "bumpY",
		Linear: "linear",
		Step: "step",
		CatmullRom: "CatmullRom",
		Cardinal: "cardinal"
	};

	const LayoutType = {
		Grid: "grid",
		Circular: "circular",
		Stack: "stack",
		Treemap: "treemap",
		Packing: "packing",
		Force: "force",
		TidyTree: "tidytree",
		Sugiyama: "sugiyama",
		Strata: "strata"
	};

	const Orientation = {
		Vertical: "vertical",
		Horizontal: "horizontal",
		Angular: "angular",
		Radial: "radial"
	};

	const Direction = {
		Up: "up",
		Down: "down",
		Left: "left",
		Right: "right",
		Inward: "inward",
		Outward: "outward",
		Clockwise: "clockwise",
		Anticlockwise: "anticlockwise"
	};

	const Alignment = {
		Top: "top",
		Left: "left",
		Bottom: "bottom",
		Right: "right",
		Center: "center",
		Middle: "middle"
	};

	const ConstraintType = {
		Align: "alignment",
		Distribute: "distribution", 
		Affix: "affixation"
	};

	// export const RotationDirection = {
	// 	Clockwise: "clockwise",
	// 	Anticlockwise: "anticlockwise"
	// }

	const ItemType = {
		Area: "area",
		Rect: "rect",
		Ellipse: "ellipse",
		Circle: "circle",
		Pie: "pie",
		Ring: "ring",
		Arc: "arc",
		Line: "line",
		Path: "path",
		Image: "image",
		PointText: "pointText",
		Collection: "collection",
		Group: "group",
		Scene: "scene",
		Axis: "axis",
		Glyph: "glyph",
		Legend: "legend",
		Polygon: "polygon",
		Gridlines: "gridlines",
		LinearGradient: "LinearGradient",
		Link: "link",
		DataTable: "datatable"
	};

	const DataType = {
		Boolean: "boolean", 
		Integer: "integer",
		Number: "number",
		Date: "date",
		String: "string"
	};

	const Aggregator = {
		Max: "max",
		Min: "min",
		Avg: "avg",
		Median: "median",
		Sum: "sum",
		Count: "count",
		Mean: "mean",
		Percentile25: "percentile 25",
		Percentile75: "percentile 75"
	};


	const Style2SVG = {
		"fillColor": "fill",
		"strokeColor": "stroke",
		"strokeWidth": "stroke-width",
		"fillOpacity": "fill-opacity",
		"strokeOpacity": "stroke-opacity",
		"strokeDash": "stroke-dasharray",
		"opacity": "opacity",
		"fontSize": "font-size",
		"fontFamily": "font-family",
		"fontWeight": "font-weight",
		"visibility": "visibility"
	};

	const Warnings = {
		INCORRECT_AXIS_INFO: "Cannot find relevant information to create an axis for ",
		INCORRECT_LEGEND_INFO: "Cannot find relevant information to create a legend for ",
		UNSUPPORTED_SCALE_TYPE_CHANGE: "Cannot change scale type to "
	};

	const Errors = {
		FIELD_NONEXISTENT : "Data field does not exist in the data table",
		INCOMPLETE_REPEAT_INFO : "Incomplete information to do repeat. You must specify an item, a categorical data field and a data table",
		REPEAT_BY_NONCAT: "Repeat only works on a string or date field",
		PARTITION_BY_NONCAT: "Divide only works on a string or date field",
		DENSIFY_BY_NONCAT: "Densify only works on a string or date field",
		INCOMPLETE_REPOPULATE_INFO : "Incomplete information to re-populate. You must specify an item, a categorical data field and a data table",
		REPOPULATE_BY_NONCAT: "Repopulate only works on a string or date field",
		REPOPULATE_DT_MISMATCH: "Cannot repopulate with a data table that is different from the item's parent's data table",
		COMPNT_NON_REPEATABLE: "Item not repeatable",
		REPEAT_NODE_LINK: "To repeat with a tree or a network, you need to provide two marks, one for node and one for link",
		INCOMPLETE_PARTITION_INFO : "Incomplete information to divide. You must specify an item, a categorical data field and a data table",
		COMPNT_NON_PARTITIONABLE: "Item cannot be divided",
		INCOMPLETE_DENSIFY_INFO : "Incomplete information to densify. You must specify an item, a categorical data field and a data table",
		COMPNT_NON_DENSIFIABLE: "Item cannot be densified",
		STRATIFY_WITHOUT_TREE: "Stratify only works on a tree dataset",
		STRATIFY_WRONG_ITEM: "Stratify only works on a circle or a rectangle",
		BIND_WITHOUT_DATASCOPE: "Item must be repeated or divided by data first before applyng binding",
		UNKNOWN_ALIGNMENT: "Unkown alignment",
		UNKNOWN_Orientation: "Unkown orientation",
		UNKNOWN_DIRECTION: "Unkown direction",
		UNKOWNN_SCALE_TYPE: "Unknown scale type",
		UNKNOWN_ANCHOR: "Unknown anchor",
		INCOMPLETE_BINDING_INFO: "Incomplete binding information. You must specify an item, a data field and a visual channel",
		MULTIPLE_VALUES_PER_FIELD: "Multiple distinct field values exist",
		DIFFERENT_SCALE_TYPE: "Cannot merge different types of scale",
		INSUFFICIENT_DATA_SCOPES: "Insufficient data to divide or densify a mark",
		INCORRECT_CONSTRAINT_INFO: "Constrain information is incorreclty passed",
		FEATURE_NOT_IMPLEMENTED: "This feature has not been implemented yet",
		LAYOUT_WITHOUT_TREE: "The layout can only be applied to a tree"
	};

	class Layout {

	    constructor(args){
	        this.group = undefined;
	    }

	    run(){}

	    clone(){}
	}

	class GridLayout extends Layout {

		constructor(args) {
			super();
			this.type = "grid";
			this._numCols = args["numCols"];
			this._numRows = args["numRows"];
			this._dir = ("dir" in args) ? args["dir"] : [GridLayout.direction.Left2Right, GridLayout.direction.Top2Bottom];
			// this._hDir = ("hDir" in args) ? args["hDir"] : GridLayout.direction.Left2Right;
			// this._vDir = ("vDir" in args) ? args["vDir"] : GridLayout.direction.Top2Bottom;
			this._rowGap = "rowGap" in args && args["rowGap"] !== undefined ? args["rowGap"] : 5;
			this._colGap = "colGap" in args && args["colGap"] !== undefined ? args["colGap"] : 5;
			this._cellHorzAlignment = "horzCellAlignment" in args && this._validateCellAlignment("h", args["horzCellAlignment"]) ? args["horzCellAlignment"] : Alignment.Left;
			this._cellVertAlignment = "vertCellAlignment" in args && this._validateCellAlignment("v", args["vertCellAlignment"]) ? args["vertCellAlignment"] : Alignment.Bottom;
		}

		_validateCellAlignment(orientation, v) {
			if (orientation === "h"  && [Alignment.Left, Alignment.Center, Alignment.Right].indexOf(v) >= 0){
				return true;
			} else if (orientation === "v" && [Alignment.Top, Alignment.Middle, Alignment.Bottom].indexOf(v) >= 0){
				return true;
			}
			console.warn("Invalid alignment:", v);
			return false;

		}

		toJSON() {
			let json = {args: {}};
			json.type = this.type;
			json.args.numCols = this._numCols;
			json.args.numRows = this._numRows;
			json.args.colGap = this._colGap;
			json.args.rowGap = this._rowGap;
			json.args.horzCellAlignment = this._cellHorzAlignment;
			json.args.vertCellAlignment = this._cellVertAlignment;
			json.left = this._left;
			json.top = this._top;
			json.args.dir = this._dir;
			return json;
		}

		clone() {
			return new GridLayout({
				numCols: this._numCols,
				numRows: this._numRows,
				// hDir: this._hDir,
				// vDir: this._vDir,
				dir: this._dir,
				colGap: this._colGap,
				rowGap: this._rowGap
			});
		}

		get cellBounds() {
			let numCols, group = this.group, colGap = this._colGap, rowGap = this._rowGap;
			if (this._numRows) {
				//numRows = this._numRows;
				numCols = Math.ceil(this.group.children.length/this._numRows);
			} else if (this._numCols) {
				numCols = this._numCols;
				//numRows = Math.ceil(this.group.children.length/this._numCols);
			}

			let bounds = group.children.map(d => d.bounds);
			if (this._left === undefined) {
				let lefts = bounds.map(d => d.left),
					tops = bounds.map(d => d.top);
				this._left = Math.min(...lefts);
				this._top = Math.min(...tops);
			}

			let wds = bounds.map(d => d.width),
				hts = bounds.map(d => d.height),
				cellWidth = Math.max(...wds), 
				cellHeight = Math.max(...hts);
			
			//TODO: cell size should be determined by the scale range extent if bound to data
			//analyze the group's children to see if 
			
			let xEncs = group.getInternalEncodings("x"),
				yEncs = group.getInternalEncodings("y"),
				wdEncs = group.getInternalEncodings("width"),
				htEncs = group.getInternalEncodings("height");

			let leftOffset = 0; //, topOffset = 0;
			if (xEncs.length > 0) {
				let xEnc = xEncs[xEncs.length -1];
				cellWidth = xEnc.scale.rangeExtent;
				leftOffset = xEnc.scale.range[0];
				if (xEnc.scale.type === "point") {
					//TODO: need to handle variable sizes
					cellWidth += xEnc.anyItem.bounds.width;
				}
			} else if (wdEncs.length > 0 && wdEncs[wdEncs.length -1]._rectNegativeValues) { //width encoding with negative values
				cellWidth = wdEncs[wdEncs.length -1].scale.rangeExtent;
				leftOffset = wdEncs[wdEncs.length -1].scale.range[0];
			}
			if (yEncs.length > 0) {
				let yEnc = yEncs[yEncs.length -1];
				cellHeight = yEnc.scale.rangeExtent;
				if (yEnc.scale.type === "point") {
					//TODO: need to handle variable sizes
					cellHeight += yEnc.anyItem.bounds.height;
				}
			} else if (htEncs.length > 0 &&  htEncs[htEncs.length -1]._rectNegativeValues) { //width encoding with negative values
				cellHeight = htEncs[htEncs.length -1].scale.rangeExtent;
			}

			switch (this._dir[0]) {
				case GridLayout.direction.Left2Right:
					switch (this._dir[1]) {
						case GridLayout.direction.Top2Bottom:
							return group.children.map((d, i) => new Rectangle(this._left + (cellWidth + colGap) * (i%numCols) + leftOffset, 
									this._top + (cellHeight + rowGap) * Math.floor(i/numCols), cellWidth, cellHeight));
						case GridLayout.direction.Bottom2Top: 
							return group.children.map((d, i) => new Rectangle(this._left + (cellWidth + colGap) * (i%numCols) + leftOffset, 
									this._top + (this.numRows - 1 - Math.floor(i/numCols)) * (cellHeight + rowGap), cellWidth, cellHeight));
					}
					break;	
				case GridLayout.direction.Right2Left:
					switch (this._dir[1]) {
						case GridLayout.direction.Top2Bottom:
							return group.children.map((d, i) => new Rectangle(leftOffset + this._left + (numCols - 1) * (cellWidth + colGap) - (cellWidth + colGap) * (i%numCols),
								this._top + (cellHeight + rowGap) * Math.floor(i/numCols), cellWidth, cellHeight));
						case GridLayout.direction.Bottom2Top: {
							return group.children.map((d, i) => new Rectangle(leftOffset + this._left + (numCols - 1 - i%numCols) * (cellWidth + colGap),
								this._top + (this.numRows - 1 - Math.floor(i/numCols)) * (cellHeight + rowGap), cellWidth, cellHeight));
						}
					}
					break;
				case GridLayout.direction.Top2Bottom:
					switch (this._dir[1]) {
						case GridLayout.direction.Left2Right:
							return group.children.map((d, i) => new Rectangle(leftOffset + this._left + (cellWidth + colGap) * Math.floor(i/this.numRows),
								this._top + (cellHeight + rowGap) * (i%this.numRows), cellWidth, cellHeight));
						case GridLayout.direction.Right2Left:
							return group.children.map((d, i) => new Rectangle(leftOffset + this._left + (cellWidth + colGap) * (this.numCols - 1) - (cellWidth + colGap) * Math.floor(i/this.numRows),
								this._top + (cellHeight + rowGap) * (i%this.numRows), cellWidth, cellHeight));
					}
					break;
				case GridLayout.direction.Bottom2Top:
					switch (this._dir[1]) {
						case GridLayout.direction.Left2Right:
							// this._top + (cellHeight + rowGap) * (this.numRows - 1) - (cellHeight + rowGap) * (i%this.numRows), cellWidth, cellHeight)));
							return group.children.map((d, i) => new Rectangle(leftOffset + this._left + (cellWidth + colGap) * Math.floor(i/this.numRows),
								this._top + (cellHeight + rowGap) * (this.numRows - 1) - (cellHeight + rowGap) * (i%this.numRows), cellWidth, cellHeight));
						case GridLayout.direction.Right2Left:
							return group.children.map((d, i) => new Rectangle(leftOffset + this._left +  (cellWidth + colGap) * (this.numCols - 1) - (cellWidth + colGap) * Math.floor(i/this.numRows),
								this._top + (cellHeight + rowGap) * (this.numRows - 1) - (cellHeight + rowGap) * (i%this.numRows), cellWidth, cellHeight));
					}
					break;
			}

			return [];

			// if (this._vDir == GridLayout.direction.Top2Bottom) {
			// 	if (this._hDir == GridLayout.direction.Left2Right) {
			// 		return group.children.map((d, i) => new Rectangle(this._left + (cellWidth + colGap) * (i%numCols) + leftOffset, 
			// 				this._top + (cellHeight + rowGap) * Math.floor(i/numCols), cellWidth, cellHeight));
			// 	} else { //right to left
			// 		return group.children.map((d, i) => new Rectangle(leftOffset + this._left + (numCols - 1) * (cellWidth + colGap) - (cellWidth + colGap) * (i%numCols),
			// 				this._top + (cellHeight + rowGap) * Math.floor(i/numCols), cellWidth, cellHeight));
			// 	}
			// } else {
			// 	let nr = Math.ceil(this.group.children.length/this._numCols);
			// 	if (this._hDir == GridLayout.direction.Left2Right) {
			// 		return group.children.map((d, i) => new Rectangle(this._left + (cellWidth + colGap) * (i%numCols) + leftOffset, 
			// 				this._top + (nr - 1 - Math.floor(i/numCols)) * (cellHeight + rowGap), cellWidth, cellHeight));
			// 	} else {
			// 		return group.children.map((d, i) => new Rectangle(leftOffset + this._left + (numCols - 1 - i%numCols) * (cellWidth + colGap),
			// 				this._top + (nr - 1 - Math.floor(i/numCols)) * (cellHeight + rowGap), cellWidth, cellHeight));
			// 	}
			// }
		}

		run() {
			if (this.group == undefined|| !this.group.children || this.group.children.length === 0)
				return;

			let cellBounds = this.cellBounds;

			let xEncs = this.group.getInternalEncodings("x"),
				yEncs = this.group.getInternalEncodings("y"),
				wdEncs = this.group.getInternalEncodings("width"),
				htEncs = this.group.getInternalEncodings("height");
			for (let i = 0; i < this.group.children.length; i++) {
				let c = this.group.children[i]; 
				let gridBound = cellBounds[i];

				let dx = gridBound.x - c.bounds.x,
					dy = gridBound.y - c.bounds.y;
				c._doTranslate(dx, dy);

				//alignment in cell if c's position is not bound to data
				let cdx = 0, cdy = 0;
				if (xEncs.length == 0) {
					switch(this._cellHorzAlignment) {
						case Alignment.Left:
							cdx = gridBound.left - c.bounds.left;
							break;
						case Alignment.Center:
							cdx = gridBound.x - c.bounds.x;
							break;
						case Alignment.Right:
							cdx = gridBound.right - c.bounds.right;
							break;
					} 
				}
				
				if (yEncs.length == 0) {
					switch(this._cellVertAlignment) {
						case Alignment.Top:
							cdy = gridBound.top - c.bounds.top;
							break;
						case Alignment.Middle:
							cdy = gridBound.y - c.bounds.y;
							break;
						case Alignment.Bottom:
							cdy = gridBound.bottom - c.bounds.bottom;
							break;
					}
				}
				
				c._doTranslate(cdx, cdy);
			}

			if (xEncs.length > 0) {
				//if childrens' position bound to data, compute position using the scale
				for (let enc of xEncs)
					enc._apply();
			} else if (wdEncs.length > 0) {
				let enc = wdEncs[wdEncs.length-1];
				if (enc._rectNegativeValues){
					enc._apply();
				}
			}

			if (yEncs.length > 0) {
				//yEncs[yEncs.length-1]._map();
				// yEncs[yEncs.length-1]._apply();
				for (let enc of yEncs)
					enc._apply();
			} else if (htEncs.length > 0) {
				let enc = htEncs[htEncs.length-1];
				if (enc._rectNegativeValues){
					enc._apply();
				}
			}

			this.group._updateBounds();
		}

		//TODO: add a corresponding scene level operation, automatically relayout
		set rowGap(g) {
			this._rowGap = g;
			this.run();
			this.group.getScene()._relayoutAncestors(this.group);
		}

		get rowGap() {
			return this._rowGap;
		}

		set colGap(g) {
			this._colGap = g;
			this.run();
			this.group.getScene()._relayoutAncestors(this.group);
		}

		get colGap() {
			return this._colGap;
		}

		set numCols(c) {
			this._numCols = c;
			this._numRows = Math.ceil(this.group.children.length/c);
			this.run();
			this.group.getScene()._relayoutAncestors(this.group);
		}

		get numCols() {
			if (this._numCols) {
				return this._numCols;
			} else if (this._numRows) {
				return Math.ceil(this.group.children.length/this._numRows);
			} else {
				return 0;
			}
		}

		set numRows(c) {
			this._numRows = c;
			this._numCols = Math.ceil(this.group.children.length/c);
			this.run();
			this.group.getScene()._relayoutAncestors(this.group);
		}


		get numRows() {
			if (this._numRows) {
				return this._numRows;
			} else if (this._numCols) {
				return Math.ceil(this.group.children.length/this._numCols);
			} else 
				return 0;
		}

		set vertCellAlignment(v) {
			if (v != Alignment.Top && v != Alignment.Bottom && v != Alignment.Middle) {
				throw Errors.UNKOWN_ALIGNMENT;
			}
			this._cellVertAlignment = v;
			this.run();
		}

		get vertCellAlignment() {
			return this._cellVertAlignment;
		}

		set horzCellAlignment(h) {
			if (h != Alignment.Left && h != Alignment.Center && h != Alignment.Right) {
				throw Errors.UNKOWN_ALIGNMENT;
			}
			this._cellHorzAlignment = h;
			this.run();
		}

		get horzCellAlignment() {
			return this._cellHorzAlignment;
		}
	}

	GridLayout.direction = {
		Left2Right: "l2r",
		Right2Left: "r2l",
		Top2Bottom: "t2b",
		Bottom2Top: "b2t"
	};

	class LinearGradient {
		
		constructor(args) {
			this._stops = [];
	        this.type = ItemType.LinearGradient;
	        this.id = this.type + ItemCounter[this.type]++;
	        this.x1 = ("x1" in args) ? args.x1 : 0;
	        this.x2 = ("x2" in args) ? args.x2 : 100;
	        this.y1 = ("y1" in args) ? args.y1 : 0;
	        this.y2 = ("y2" in args) ? args.y2 : 0;
		}
	    
	    toJSON() {
	        let json = {};
	        json.type = this.type;
	        json.id = this.id;
	        json.x1 = this.x1;
	        json.x2 = this.x2;
	        json.y1 = this.y1;
	        json.y2 = this.y2;
	        json.stops = this._stops;
	        return json;
	    }

	    addStop(offset, color, opacity) {
	        this._stops.push({offset: offset, color: color, opacity: opacity});
	    }

	    get stops() {
	        return this._stops;
	    }

	}

	// Based on item.Item.js, as part of Paper.js - The Swiss Army Knife of Vector Graphics Scripting.

	class Mark {

		constructor(args) {
			this._dataScope = undefined;
			this._id = undefined;

			this.attrs = {};
			this.styles = {};
			this.staticProperties = {};

			if (args !== undefined) {
				for (let s in Style2SVG) {
					if (s in args) {
						this.styles[s] = args[s];
					}
				}
			}
		}

		get id() {
			return this._id;
		}

		set id(id) {
			if (this.getScene()){
				delete this.getScene()._itemMap[this._id];
				this._id = id;
				this.getScene()._itemMap[id] = this;
			} else {
				this._id = id;
			}
		}

		//TODO: implement winding contribution, see paper.js PathItem.Boolean.js
		contains(px, py) {
			if (!this._bounds)
				return false;
			if (!this._bounds.contains(px, py))
				return false;
			switch (this.type) {
				case ItemType.Rect:
				case ItemType.PointText:
					return true;
				case ItemType.Circle: {
					let dist = Math.sqrt(Math.pow(px - this.x, 2) + Math.pow(py - this.y, 2));
					return dist <= this.radius + this.strokeWidth;
				}
				case ItemType.Path: {
					let ctx = CanvasProvider.getContext(),
						p = new Path2D(this.getSVGPathData());
					ctx.lineWidth = Math.max(this.strokeWidth, 2.5);
					ctx.stroke(p);
					if (this.closed) {
						return ctx.isPointInPath(p, px, py);
					} else {
						return ctx.isPointInStroke(p, px, py);
					}
				}
				case ItemType.Line: {
					let ctx = CanvasProvider.getContext(),
						p = new Path2D(this.getSVGPathData());
					ctx.lineWidth = Math.max(this.strokeWidth, 2.5);
					ctx.stroke(p);
					return ctx.isPointInStroke(p, px, py);
				}
				default: {
					let ctx = CanvasProvider.getContext(),
						p = new Path2D(this.getSVGPathData());
					return ctx.isPointInPath(p, px, py);
				}
			}
		}

		toJSON() {
			let json = {};
			json.type = this.type;
			json.id = this.id;
			if (this.classId)
				json.classId = this.classId;
			if (this._dataScope)
				json.dataScope = this._dataScope.toJSON();
			json.args = {};
			for (let s in this.attrs) {
				json.args[s] = this.attrs[s];
			}

			for (let s in this.styles) {
				if (s.indexOf("Color") > 0 && this.styles[s] instanceof LinearGradient) {
					json.args[s] = this.styles[s].toJSON();
				} else {
					json.args[s] = this.styles[s];
				}
			}
			return json;
		}

		getScene() {
			let p = this;
			while (p) {
				if (p.type == ItemType.Scene)
					return p;
				else
					p = p.parent;
			}
		}

		set dataScope(ds) {
			this._dataScope = ds;
		}

		get dataScope() {
			return this._dataScope;
		}

		duplicate() {
			let scene = this.getScene();
			let m = scene.mark(this.type);
			this.copyPropertiesTo(m);
			m.classId = this.classId;
			if (this._dataScope) {
				m._dataScope = this._dataScope.clone();
			}
			return m;
		}

		// eslint-disable-next-line no-unused-vars
		_doTranslate(dx, dy){
			//child classes have their own implementations
		}

		set visibility(v) {
			this.styles["visibility"] = v;
		}

		get visibility() {
			if (!this.styles["visibility"])
				return "visible";
			return this.styles["visibility"];
		}

		get opacity() {
			if (!("opacity" in this.styles))
				return 1;
			return this.styles["opacity"];
		}

		set opacity(c) {
			this.styles["opacity"] = c;
		}
	}

	// Based on util.Numerical.js, as part of Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
	// http://paperjs.org/
	// Copyright (c) 2011 - 2019, Juerg Lehni & Jonathan Puckey
	// http://scratchdisk.com/ & https://puckey.studio/
	//
	// Distributed under the MIT license. See LICENSE file for detail
	//
	// All rights reserved.

	/**
	* A very small absolute value used to check if a value is very close to
	* zero. The value should be large enough to offset any floating point
	* noise, but small enough to be meaningful in computation in a nominal
	* range (see MACHINE_EPSILON).
	*
	* http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
	* http://www.cs.berkeley.edu/~wkahan/Math128/Cubic.pdf
	*/
	const EPSILON = 1e-12;

	/**
	* The epsilon to be used when performing "trigonometric" checks, such
	* as examining cross products to check for collinearity.
	*/
	const TRIGONOMETRIC_EPSILON = 1e-8;

	/**
	* Checks if the value is 0, within a tolerance defined by
	* Numerical.EPSILON.
	*/
	function isZero(val) {
		return val >= -EPSILON && val <= EPSILON;
	}

	// Based on basic.Point.js, as part of Paper.js - The Swiss Army Knife of Vector Graphics Scripting.

	class Point {
		
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}

		transform(matrix) {
	        return matrix ? matrix._transformPoint(this) : this;
		}

		negate() {
	        return new Point(-this.x, -this.y);
	    }

		subtract(point) {
			return new Point(this.x - point.x, this.y - point.y);
		}

	    isZero() {
	    	return isZero(this.x) && isZero(this.y)
	    }

		/**
		* Checks if the vector represented by this point is collinear (parallel) to
		* another vector.
		*
		* @param {Point} point the vector to check against
		* @return {Boolean} {@true it is collinear}
		*/
	     isCollinear(point) {
	     	let x1 = this.x,
	     		y1 = this.y,
	     		x2 = point.x,
	     		y2 = point.y;
	     	return Math.abs(x1 * y2 - y1 * x2) <= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2)) 
	     		* /*#=*/TRIGONOMETRIC_EPSILON;
	    }

	}

	// Based on path.Segment.js, as part of Paper.js - The Swiss Army Knife of Vector Graphics Scripting.

	class Vertex {

		//handles are relative to the point
		constructor(point, parentMark, id) {
			this.type = "vertex";
			this._id = id;
			this.x = point.x;
			this.y = point.y;
			this.dataScope = undefined;
			this.parent = parentMark; 

			this.shape = undefined;
			this.width = 0;
			this.height = 0;
			this.radius = 0;
			this.fillColor = "#555";
			this.opacity = 1;
			this.strokeWidth = 0;
			this.strokeColor = "#aaa";
			this._polarAngle = undefined;
		}

		get id() {
			return this.parent.id + "_v_" + this._id;
		}

		toJSON() {
			let json = {};
			json.type = this.type;
			json.id = this._id;
			json.x = this.x;
			json.y = this.y;
			if (this.dataScope)
				json.dataScope = this.dataScope.toJSON();
			if (this._polarAngle !== undefined)
				json.polarAngle = this._polarAngle;
			json.shape = this.shape;
			json.width = this.width;
			json.height = this.height;
			json.radius = this.radius;
			json.fillColor = this.fillColor;
			json.opacity = this.opacity;
			json.strokeWidth = this.strokeWidth;
			json.strokeColor = this.strokeColor;
			return json;
		}

		static fromJSON(json, parent) {
			let v = new Vertex(json, parent, json.id);
			if (json.dataScope)
				v.dataScope = json.dataScope;
			if ("polarAngle" in json)
				v.polarAngle = json.polarAngle;
			v.shape = json.shape;
			v.width = json.width;
			v.height = json.height;
			v.radius = json.radius;
			v.fillColor = json.fillColor;
			v.opacity = json.opacity;
			v.strokeWidth = json.strokeWidth;
			v.strokeColor = json.strokeColor;
			return v;
		}

		_doTranslate(dx, dy) {
			this.x += dx;
			this.y += dy;
		}

		_clone(parent) {
			let v = new Vertex(new Point(this.x, this.y), parent, this._id);
			if (this.dataScope) {
				v.dataScope = this.dataScope.clone();
			}
			v.shape = this.shape;
			v.width = this.width;
			v.height = this.height;
			v.radius = this.radius;
			v.fillColor = this.fillColor;
			v.opacity = this.opacity;
			v.strokeWidth = this.strokeWidth;
			v.strokeColor = this.strokeColor;
			return v;
		}

		set polarAngle(a) {
			this._polarAngle = a;
		}

		get polarAngle() {
			return this._polarAngle;
		}
	}

	Vertex.styles = ["vxShape", "vxWidth", "vxHeight", "vxRadius", "vxFillColor", "vxStrokeColor", "vxStrokeWidth", "vxOpacity"];

	class Segment {
		
		constructor(v1, v2, parentMark, id) {
			this.type = "segment";
			this._id = id;
			this.vertex1 = v1;
			this.vertex2 = v2;

			this.dataScope = undefined;
			this.parent = parentMark;
		}

		get id() {
			return this.parent.id + "_s_" + this._id;
		}

		_doTranslate(dx, dy) {
			this.vertex1._doTranslate(dx, dy);
			this.vertex2._doTranslate(dx, dy);
		}

		get x() {
			return (this.vertex1.x + this.vertex2.x)/2;
		}

		get y() {
			return (this.vertex1.y + this.vertex2.y)/2;
		}
	}

	class Path extends Mark {
		
		constructor(args) {
			super(args);
			this.type = ItemType.Path;

			if (!("strokeColor" in this.styles))
				this.styles["strokeColor"] = "#ccc";
			if (!("strokeWidth" in this.styles))
				this.styles["strokeWidth"] = 1;
			if (!("strokeDash" in this.styles))
				this.styles["strokeDash"] = "none";

			this.vertices = [];
			this.vertexCounter = 0; //for assigning vertex ids
			this.segmentCounter = 0;
			this.segments = [];

			this.anchor = undefined;

			this.closed = false;

			this.curveMode = "linear";

			this._vxShape = undefined;
			this._vxWidth = 0;
			this._vxHeight = 0;
			this._vxRadius = 0;
			this._vxFillColor = "#555555";
			this._vxStrokeColor = "#aaaaaa";
			this._vxStrokeWidth = 0;
			this._vxOpacity = 1;

			if (args !== undefined) {
				for (let vs of Vertex.styles){
					if (vs in args)
						this["_" + vs] = args[vs];
				}

				if ("vertices" in args) {
					this._setVertices(args["vertices"]);
				}
			}
		}

		toJSON() {
			let json = super.toJSON();
			json.type = this.type;
			json.id = this.id;
			if (this.type === ItemType.Rect) {
				json.args.width = this.width;
				json.args.height = this.height;
				json.args.top = this.top;
				json.args.left = this.left;
			} else if (this.type === ItemType.Circle) {
				json.args.x = this.x;
				json.args.y = this.y;
				json.args.radius = this.radius;
			} else if (this.type === ItemType.Arc) {
				json.args.x = this._x;
				json.args.y = this._y;
				json.args.innerRadius = this._innerRadius;
				json.args.outerRadius = this._outerRadius;
				json.args.startAngle = this._startAngle;
				json.args.endAngle = this._endAngle;
			} else if (this.type === ItemType.Pie) {
				json.args.x = this._x;
				json.args.y = this._y;
				json.args.radius = this.radius;
				json.args.startAngle = this.startAngleDeg;
				json.args.endAngle = this.endAngleDeg;
			} else {
				json.vertices = [];
				for (let v of this.vertices)
					json.vertices.push(v.toJSON());
				if (this.type === ItemType.Polygon) {
					json.args.x = this._x;
					json.args.y = this._y;
					json.args.radius = this._radius;
				} else if (this.type === ItemType.Area) {
					json.args.baseline = this._baseline;
					json.args.orientation = this._orientation;
				}
			}
			json.vertexCounter = this.vertexCounter;
			json.segmentCounter = this.segmentCounter;
			//do not save segments, anchor and closed for now
			json.curveMode = this.curveMode;
			if (this._bounds)
				json.bounds = this._bounds.toJSON();
			
			for (let s of Vertex.styles) {
				json.args[s] = this[s];
			}
			return json;
		}

		_setVertices(vertices) {
			let vertex, point;
			this.vertices = [];
			this.segments = [];
			for (let i = 0; i < vertices.length; i++) {

				if (i == vertices.length - 1 && vertices[i][0] === vertices[0][0] && vertices[i][1] === vertices[0][1] && this.type === ItemType.Path) {
					continue;
				}

				point = new Point(vertices[i][0], vertices[i][1]);

				vertex = new Vertex(point, this, this.vertexCounter++);

				for (let vs of Vertex.styles){
					if (this[vs]){
						let temp = vs.replace("vx", "");
						vertex[temp[0].toLowerCase() + temp.slice(1)] = this[vs];
					}
				}

				this.vertices.push(vertex);
				if (i > 0)
					this.segments.push(new Segment(this.vertices[i-1], this.vertices[i], this, this.segmentCounter++));
			}
			//if the first vertex has the same position as the last, this path is closed
			let first = vertices[0], last = vertices[vertices.length - 1];
			if (first[0] === last[0] && first[1] === last[1]) {
				this.closed = true;
				if (!("fillColor" in this.styles))
					this.styles["fillColor"] = "#fff";
				this.segments.push(new Segment(this.vertices[this.vertices.length-1], this.vertices[0], this, this.segmentCounter++));
			}
		}

		copyPropertiesTo(target) {
			target.attrs = Object.assign({}, this.attrs);
			target.styles = Object.assign({}, this.styles);
			for (let vs of Vertex.styles){
				if (this["_"+vs])
					target["_"+vs] = this["_"+vs];
			}
			if (this._dataScope)
				target._dataScope = this._dataScope.clone();
			target.closed = this.closed;
			target.curveMode = this.curveMode;
			target.vertices = [];
			target.segments = [];
			for (let v of this.vertices) {
				target.vertices.push(v._clone(target));
			}
			target.segmentCounter = 0;
			for (let i = 1; i < target.vertices.length; i++) {
				target.segments.push(new Segment(target.vertices[i-1], target.vertices[i], target, target.segmentCounter++));
			}
			if (target.closed)
				target.segments.push(new Segment(target.vertices[target.vertices.length-1], target.vertices[0], target, target.segmentCounter++));
		}

		/*
		* returns the bounds without incorporating transformations involving rotation
		*/
		get bounds() {
			if (!this._bounds)
				this._updateBounds();
			return this._bounds;
		}

		get x() {
			return this.bounds.x;
		}

		get y() {
			return this.bounds.y;
		}

		get strokeColor() {
			return this.styles["strokeColor"];
		}

		set strokeColor(c) {
			this.styles["strokeColor"] = c;
		}

		get strokeWidth() {
			return this.styles["strokeWidth"];
		}

		set strokeWidth(c) {
			this.styles["strokeWidth"] = c;
		}

		get fillColor() {
			return this.styles["fillColor"];
		}

		set fillColor(c) {
			this.styles["fillColor"] = c;
		}

		get strokeDash() {
			return this.styles["strokeDash"];
		}

		set strokeDash(c) {
			this.styles["strokeDash"] = c;
		}

		_doTranslate(dx, dy) {
			for (let v of this.vertices) {
				v._doTranslate(dx, dy);
			}
			this._updateBounds();
		}

		//by default, with respect to the center of bounds
		resize(wd, ht, xRef, yRef) {
			let bounds = this.bounds, bWidth = bounds.width === 0 ? 1 : bounds.width, bHeight = bounds.height === 0 ? 1 : bounds.height;
			if (xRef === "right") {
				for (let v of this.vertices) {
					v.x = bounds.right - (wd/bWidth) * (bounds.right - v.x);
				}
			} else {
				for (let v of this.vertices) {
					v.x = bounds.left + (wd/bWidth) * (v.x - bounds.left);
				}
			}
			if (yRef === "top") {
				for (let v of this.vertices) {
					v.y = bounds.top + (ht/bHeight) * (v.y - bounds.top);
				}
			} else {
				for (let v of this.vertices) {
					v.y = bounds.bottom - (ht/bHeight) * (bounds.bottom - v.y);
				}
			}
			this._updateBounds();
		}

		_updateBounds() {		
			let vx = this.vertices.map(d => d.x),
				vy = this.vertices.map(d => d.y);

			let left = Math.min(...vx), top = Math.min(...vy), right = Math.max(...vx), btm = Math.max(...vy);
			this._bounds = new Rectangle(left, top, right - left, btm - top);
		}

		addVertex(x, y, i) {
			let vertex = new Vertex(new Point(x, y), this, this.vertexCounter++);
			this.vertices.splice(i, 0, vertex);
			//TODO: handle segments
		}

		sortVertices(channel, descending) {
			this.vertices.sort((a,b) => a[channel] - b[channel]);
			if (descending)
				this.vertices.reverse();
			for (let i = 0; i < this.segments.length; i++) {
				let segment = this.segments[i];
				segment.vertex1 = this.vertices[i];
				segment.vertex2 = this.vertices[(i+1)%this.vertices.length];
			}
		}

		sortVerticesByData(field, descending, order) {
			let f;
			if (order)
				f = (a, b) => order.indexOf(a.dataScope.getFieldValue(field)) - order.indexOf(b.dataScope.getFieldValue(field));
			else
				f = (a, b) =>  (a.dataScope.getFieldValue(field) < b.dataScope.getFieldValue(field) ? -1 : 1 );
			this.vertices.sort(f);
			if (descending)
				this.vertices.reverse();
			for (let i = 0; i < this.segments.length; i++) {
				let segment = this.segments[i];
				segment.vertex1 = this.vertices[i];
				segment.vertex2 = this.vertices[(i+1)%this.vertices.length];
			}
		}

		getSVGPathData() {
			let p = d3__namespace.path();
			let curve = this._getD3CurveFunction(this.curveMode)(p);
			curve.lineStart();
			for (let vertex of this.vertices) {
				curve.point(vertex.x, vertex.y);
			}
			if (this.closed)
				curve.point(this.vertices[0].x, this.vertices[0].y);
			curve.lineEnd();

			return p._;
		}
	 
		// toSVG() {

		// }

		// fromSVG() {

		// }

		get firstVertex() {
			return this.vertices[0];
		}

		get firstSegment() {
			return this.segments[0];
		}

		_getD3CurveFunction(v){
			switch(v) {
				case CurveMode.Natural:
					return d3__namespace.curveNatural;
				case CurveMode.Basis:
					return d3__namespace.curveBasis;
				case CurveMode.BumpX:
					return d3__namespace.curveBumpX;
				case CurveMode.BumpY:
					return d3__namespace.curveBumpY;
				case CurveMode.Linear:
					return d3__namespace.curveLinear;
				case CurveMode.Step:
					return d3__namespace.curveStep;
				case CurveMode.CatmullRom:
					return d3__namespace.curveCatmullRom;
				case CurveMode.Cardinal:
					return d3__namespace.curveCardinal;
				default:
					return d3__namespace.curveLinear;
			}
		}

		get vxShape(){
			return this._vxShape;
		}

		set vxShape(s){
			this._vxShape = s;
			for (let v of this.vertices)
				v.shape = s;
		}

		get vxWidth(){
			return this._vxWidth;
		}

		set vxWidth(s){
			this._vxWidth = s;
			for (let v of this.vertices)
				v.width = s;
		}

		get vxHeight(){
			return this._vxHeight;
		}

		set vxHeight(s){
			this._vxHeight = s;
			for (let v of this.vertices)
				v.height = s;
		}

		get vxRadius(){
			return this._vxRadius;
		}

		set vxRadius(s){
			this._vxRadius = s;
			for (let v of this.vertices)
				v.radius = s;
		}

		get vxFillColor(){
			return this._vxFillColor;
		}

		set vxFillColor(s){
			this._vxFillColor = s;
			for (let v of this.vertices)
				v.fillColor = s;
		}

		get vxStrokeColor(){
			return this._vxStrokeColor;
		}

		set vxStrokeColor(s){
			this._vxStrokeColor = s;
			for (let v of this.vertices)
				v.strokeColor = s;
		}

		get vxStrokeWidth(){
			return this._vxStrokeWidth;
		}

		set vxStrokeWidth(s){
			this._vxStrokeWidth = s;
			for (let v of this.vertices)
				v.strokeWidth = s;
		}

		get vxOpacity(){
			return this._vxOpacity;
		}

		set vxOpacity(s){
			this._vxOpacity = s;
			for (let v of this.vertices)
				v.opacity = s;
		}

	}

	function evaluatePredicate(itm, p) {
		if ("field" in p) {
			if (!itm.dataScope) return false;
			let f = p["field"];
			if ("value" in p) {
				return itm.dataScope.getFieldValue(f) === p["value"];
			} else if ("interval" in p) {
				let v = itm.dataScope.getFieldValue(f);
				return v >= p["interval"][0] && v <= p["interval"][1];
			} else if ("values" in p) {
				return p["values"].indexOf(itm.dataScope.getFieldValue(f)) >= 0;
			} else {
				return itm.dataScope.hasField(f);
			}
		} else if ("channel" in p) {
			let c = p["channel"];
			if ("value" in p) {
				return itm[c] === p["value"];
			} else if ("interval" in p) {
				return itm[c] >= p["interval"][0] && itm[c] <= p["interval"][1];
			} else if ("values" in p) {
				return p["values"].indexOf(itm[c]) >= 0;
			}
		} else if ("type" in p) {
			return itm.type === p["type"];
		} else if ("id" in p) {
			return itm.id === p["id"];
		} else if ("classId" in p) {
			return itm.classId === p["classId"];
		} else if ("fields" in p) {
			if (!itm.dataScope) return false;
			let f1 = p["fields"][0], f2 = p["fields"][1],
				v1 = itm.dataScope.getFieldValue(f1), v2 = itm.dataScope.getFieldValue(f2);
			switch (p["operator"]) {
				case "==":
					return v1 == v2;
				case ">":
					return v1 > v2;
				case ">=":
					return v1 >= v2;
				case "<":
					return v1 < v2;
				case "<=":
					return v1 <= v2;
			}
		}
		return false;
	}

	function findItems(container, predicates) {
		let result = [];
		_findItemsRecursive(container, predicates, result);
		return result;
	}

	function _findItemsRecursive(itm, predicates, result) {
		if (!itm) return;
		if (itm.type == "axis" || itm.type == "legend" || itm.type == "gridlines")	return;
		if (_matchCriteria(itm, predicates)) {
			result.push(itm);
		}
		
		if (itm.vertices){
			for (let i of itm.vertices.concat(itm.segments)) {
				if (_matchCriteria(i, predicates))
					result.push(i);
			}
		} else if (itm.children && itm.children.length > 0) {
			for (let c of itm.children)
				_findItemsRecursive(c, predicates, result);
		}
	}

	function _matchCriteria(cpnt, predicates) {
		for (let p of predicates) {
			if (!evaluatePredicate(cpnt, p))
				return false;
		}
		return true;
	}

	function getPeers(item, scene) {
		if (item.type == "vertex") {
			return _getPeerVertices(item, scene);
		} else if (item.type == "segment") {
			return _getPeerSegments(item, scene);
		} else {
			// return item.classId ? findItems(scene, d => d.classId == item.classId) : [];
			return item.classId ? findItems(scene, [{"classId": item.classId}]) : [];
		}
	}

	//returns an array of peer arrays, peers within each array have the same parent
	function getPeersGroupedByParent(item, scene) {
		let result = {}, peers = getPeers(item, scene);
		for (let p of peers) {
			let parent = p.parent.id;
			if (!(parent in result))
				result[parent] = [];
			result[parent].push(p);
		}
		return Object.keys(result).map(d => result[d]);
	}

	function _getPeerSegments(segment, container) {
		if (segment.dataScope) {
			let parent = segment.parent;
			if (!parent)	throw new Error("segment has no parent mark");
			let parentPeers = findItems(container, [{"classId": parent.classId}]);
			let results = [];
			for (let p of parentPeers) {
				results = results.concat(p.segments);
			}
			return results;
		} else {
			let parent = segment.parent;
			if (!parent)	throw new Error("segment has no parent mark");
			let index = parent.segments.indexOf(segment);
			let parentPeers = findItems(container, [{"classId": parent.classId}]);
			let results = [];
			for (let p of parentPeers) {
				results.push(p.segments[index]);
			}
			return results;
		}
	}

	function _getPeerVertices(vertex, container) {
		if (vertex.classId) ; else if (vertex.dataScope) {
			let parent = vertex.parent;
			if (!parent)	throw new Error("vertex has no parent mark");
			let parentPeers = findItems(container, [{"classId": parent.classId}]);
			let results = [];
			if (parent.type === ItemType.Area) {
				let idx = parent.vertices.indexOf(vertex), firstHalf = idx < parent.vertices.length/2;
				for (let p of parentPeers) {
					let vertices = firstHalf ? p.vertices.slice(0, p.vertices.length/2) : p.vertices.slice(p.vertices.length/2);
					results = results.concat(vertices.filter(d => d.dataScope));
				}
			} else {
				for (let p of parentPeers) {
					results = results.concat(p.vertices.filter(d => d.dataScope));
				}
			}
			return results;
		} else {
			let parent = vertex.parent;
			if (!parent)	throw new Error("vertex has no parent mark");
			let index = parent.vertices.indexOf(vertex);
			let parentPeers = findItems(container, [{"classId": parent.classId}]);
			let results = [];
			for (let p of parentPeers) {
				results.push(p.vertices[index]);
			}
			return results;
		}
	}

	function getClosestLayout(item, type) {
		let parent = item.parent;
		while (parent && parent.type != ItemType.Scene) {
			if (parent.layout) {
				if ( (!type) || (type && parent.layout.type === type))
					return parent.layout;
			}
			parent = parent.parent;
		}
		return undefined;
	}

	function getCellBoundsInLayout(item) {
		let itm = item, parent = item.parent;
		while (parent && parent.type != ItemType.Scene) {
			if (parent.layout){
				let idx = parent.children.findIndex(d => d == itm);
				return parent.layout.cellBounds[idx];
			}
			itm = itm.parent;
			parent = itm.parent;
		}
		return undefined;
	}

	function getCellBoundsInGridLayout(item) {
		let itm = item, parent = item.parent;
		while (parent && parent.type != ItemType.Scene) {
			if (parent.layout && parent.layout.type == LayoutType.Grid){
				let idx = parent.children.findIndex(d => d == itm);
				return parent.layout.cellBounds[idx];
			}
			itm = itm.parent;
			parent = itm.parent;
		}
		return undefined;
	}

	function getTopLevelLayout(item, type) {
		let parent = item.parent, layout = undefined;
		while (parent && parent.type !== ItemType.Scene) {
			if (parent.layout)
				if ( (!type) || (type && parent.layout.type === type))
					layout = parent.layout;
			parent = parent.parent;
		}
		return layout;
	}

	function getEncodingKey(item) {
		if (item.classId) {
			return item.classId;
		} else if (item.type == "vertex" && item.dataScope) { //vertex created from densify
			if (item.parent.type === ItemType.Area) {
				let firstHalf = item.parent.vertices.indexOf(item) < item.parent.vertices.length/2;
				return item.parent.classId + "_v_" + (firstHalf ? 0 : item.parent.vertices.length-1) ;
			} 
			else
				return item.parent.classId + "_v";
		} else if (item.type == "vertex") { //vertex with index
			return item.parent.classId + "_v_" + item.parent.vertices.indexOf(item);
		} else if (item.type == "segment" && item.dataScope) { //segment created from densify
			return item.parent.classId + "_s";
		} else if (item.type == "segment") { //segment with index
			return item.parent.classId + "_s_" + item.parent.segments.indexOf(item);
		} else {
			return null;
		}
	}

	function getParents(items) {
		let result = [];
		for (let p of items) {
			if (p.parent && result.indexOf(p.parent) < 0)
				result.push(p.parent);
		}
		return result;
	}

	function getAllChildren(cpnt) {
		let result = [];
		if (cpnt.children && cpnt.children.length > 0) {
			for (let c of cpnt.children) {
				result.push(c);
				result = result.concat(getAllChildren(c));
			}
		}
		return result;
	}

	function getLeafMarks(cpnt) {
		let result = [];
		if (isMark(cpnt)) {
			result.push(cpnt);
		} else if (cpnt.children && cpnt.children.length > 0 && !isGuide(cpnt)) {
			for (let c of cpnt.children) {
				result = result.concat(getLeafMarks(c));
			}
		} 
		return result;
	}

	function getLeafItems(cpnt) {
		let result = [];
		if (cpnt.children && cpnt.children.length > 0) {
			for (let c of cpnt.children) {
				result = result.concat(getLeafItems(c));
			}
		} else {
			result.push(cpnt);
		}
		return result;
	}

	function isGuide(item) {
		return item.type === ItemType.Axis || item.type === ItemType.Legend || item.type === ItemType.Gridlines;
	}

	function isMark(cmpnt) {
		return cmpnt instanceof Mark;
	}

	function isPath(cmpnt) {
		return cmpnt instanceof Path;
	}

	const ItemCounter = {
		"area" : 0,
		"rect" : 0,
		"circle": 0,
		"pie": 0,
		"line": 0,
		"path" : 0,
		"ring" : 0,
		"arc": 0,
		"image": 0,
		"pointText": 0,
		"collection": 0,
		"group": 0,
		"scene": 0,
		"axis": 0,
		"glyph": 0,
		"legend": 0,
		"polygon": 0,
		"gridlines": 0,
		"LinearGradient": 0,
		"link": 0,
		"scale": 0,
		"datatable": 0
	};

	function canAlign(items, direction, scene){
		if (direction == Alignment.Top || direction == Alignment.Bottom || direction == Alignment.Middle) {
			for (let item of items) {
				if (!canMoveVertically(item, scene))
					return false;
			}
			return true;
		}

		if (direction == Alignment.Left || direction == Alignment.Right || direction == Alignment.Center) {
			for (let item of items) {
				if (!canMoveHorizontally(item, scene))
					return false;
			}
			return true;
		}
	}

	function canMoveHorizontally(item, scene) {
		if (scene.getEncodingByItem(item, "x"))
			return false;
		if (item.parent && item.parent.layout) {
			let layout = item.parent.layout;
			if (layout.type == LayoutType.Grid && layout.numCols > 1) {
				return false;
			}
		}
		if (item.parent && item.parent.type != ItemType.Scene){
			return canMoveHorizontally(item.parent, scene);
		}
		return true;
	}

	function canMoveVertically(item, scene) {
		if (scene.getEncodingByItem(item, "y"))
			return false;
		if (item.parent && item.parent.layout) {
			let layout = item.parent.layout;
			if (layout.type == LayoutType.Grid && layout.numRows > 1) {
				return false;
			}
		}
		if (item.parent && item.parent.type != ItemType.Scene){
			return canMoveVertically(item.parent, scene);
		}
		return true;
	}

	var CanvasProvider = {
		canvas : undefined,

		getCanvas: function() {
			if (!window)
	            return null;
			if (this.canvas === undefined) {
				this.canvas = document.createElement('canvas');
			}
			return this.canvas;
		},

		getContext: function() {
	        var canvas = this.getCanvas();
	        return canvas ? canvas.getContext('2d') : null;
	    },
	};

	var SVGProvider = {
		svg: undefined,

		getSVG: function() {
			if (!window)
	            return null;
			if (this.svg === undefined) {
				this.svg = document.createElement('svg');
			}
			return this.svg;
		}
	};

	// export function getTextWidth(text, font) {
	// 	let context = CanvasProvider.getContext();
	// 	context.font = font;
	// 	let metrics = context.measureText(text);
	// 	return metrics.width;
	// }

	function getTextSize(text, font, fontSize) {
		let context = CanvasProvider.getContext();
		context.font = font;
		let metrics = context.measureText(text);
		if (metrics.fontBoundingBoxAscent)
			return {width: metrics.width, height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent};
		else if (metrics.actualBoundingBoxAscent)
			return {width: metrics.width, height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent};
		else
			return {width: metrics.width, height: fontSize};
	}

	function getTopLevelGroup(item) {
		let parent = item.parent;
		if (parent.type == ItemType.Scene)
			return item;
		else
			return getTopLevelGroup(parent);
	}

	function getTopLevelCollection(item) {
		let parent = item.parent;
		if (item.type == ItemType.Collection) {
			if (parent.type == ItemType.Collection) {
				return getTopLevelCollection(parent); 
			} else
				return item;
		} else if (parent.type != ItemType.Scene) {
			return getTopLevelCollection(parent); 
		} else {
			return undefined;
		}
	}

	function polar2Cartesian(cx, cy, r, deg){
		let x = r * Math.cos(degree2radian(deg)),
			y = r * Math.sin(degree2radian(deg));
		return [x + cx, cy - y];
	}

	function cartesian2Polar(x, y, cx, cy){
		let d = radian2degree(Math.atan2(cy - y, x - cx));
	    d = Math.round( d * 10 + Number.EPSILON ) / 10;
	    if (d < 0) d += 360;
	    let r = Math.sqrt(Math.pow(x-cx, 2) + Math.pow(y-cy, 2));
	    r = Math.round( r * 10 + Number.EPSILON ) / 10;
	    return [d, r];
	}

	function degree2radian(d){
		return d * Math.PI/180;
	}

	function radian2degree(r){
		return r * 180 / Math.PI;
	}

	function CheckAreaOrien(area){
		let VNum = area.vertices.length;
		for (let i = 0; i < area.vertices.length / 2; i++) {
			let Vid1 = i, Vid2 = VNum - i - 1;
			let peer1 = area.vertices[Vid1], peer2 = area.vertices[Vid2];
			if (peer1.x == peer2.x && peer1.y == peer2.y) {
				continue;
			} else {
				if (peer1.x == peer2.x) {
					return "horizontal";
				} else {
					return "vertical";
				}
			}
		}
	}

	/**
	* Same as group in graphical design tools 
	**/

	class Group {
		
		constructor() {
			this.children = [];
			this._dataScope = undefined;
			this._layout = undefined;
			this.type = ItemType.Group;
			this._id = this.type + ItemCounter[this.type]++;
		}

		get id() {
			return this._id;
		}

		set id(id) {
			if (this.type === ItemType.Scene || !this.getScene())
				this._id = id;
			else {
				delete this.getScene()._itemMap[this._id];
				this._id = id;
				this.getScene()._itemMap[id] = this;
			}
		}

		contains(x, y) {
			if (!this._bounds) {
				this._updateBounds();
			}
			return this._bounds.contains(x, y);
		}

		toJSON() {
			let json = {};
			json.type = this.type;
			json.id = this.id;
			if (this._dataScope)
				json.dataScope = this._dataScope.toJSON();
			if (this.classId)
				json.classId = this.classId;
			if (this._layout)
				json.layout = this._layout.toJSON();
			if (this._bounds)
				json.bounds = this._bounds.toJSON();
			json.children = [];
			if (this.children.length > 0 && this.type != ItemType.Axis) {
				for (let c of this.children) {
					json.children.push(c.toJSON());
				}
			}
			if (this.childrenOrder) {
				json.childrenOrder = this.childrenOrder;
			}
			return json;
		}

		addChild(c) {
			if (this.children.indexOf(c) >= 0) return;
			if (c.parent)
				c.parent.removeChild(c);
			this.children.push(c);
			c.parent = this;
		}

		addChildAt(c,index){
			if (c.parent)
				c.parent.removeChild(c);
			this.children.splice(index, 0, c);
			c.parent = this;
		}

		removeChild(c) {
			let idx = this.children.indexOf(c);
			if (idx >= 0) {
				this.children.splice(idx, 1);
				c.parent = null;
			}
		}

		removeChildAt(i) {
			this.children[i].parent = null;
			this.children.splice(i, 1);
		}

		removeAll() {
			for (let c of this.children)
				c.parent = null;
			this.children = [];
		}

		getScene() {
			let p = this;
			while (p) {
				if (p.type == ItemType.Scene)
					return p;
				else
					p = p.parent;
			}
		}

		get dataScope() {
			return this._dataScope;
		}

		set dataScope(ds) {
			this._dataScope = ds;
			if (ds === undefined) {
				for (let c of this.children) {
					c.dataScope = ds;
				}
			} else {
				for (let c of this.children) {
					if (c.dataScope)
						c.dataScope = c.dataScope.merge(ds);
					else
						c.dataScope = ds;
				}
			}
		}

		_doTranslate(dx, dy) {
			for (let child of this.children) {
				child._doTranslate(dx, dy);
			}
			this._updateBounds();
			if (this._layout) {
				if (this._layout._left !== undefined)
					this._layout._left += dx;
				if (this._layout._top !== undefined)
					this._layout._top += dy;
				if (this._layout.x !== undefined)
					this._layout.x += dx;
				if (this._layout.y !== undefined)
					this._layout.y += dy;
				//this._layout.run();
			}
			this._updateBounds();
		}

		getInternalEncodings(channel) {
			if (this.children.length == 0)
				return [];
			let item = this.children[0], scene = this.getScene();
			let encodingKeys = Object.keys(scene.encodings);
			let classIds = [];
			while(item) {
				if (item.classId && classIds.indexOf(item.classId) < 0)
					classIds.push(item.classId);
				if (item.children)
					item = item.children[0];
				else
					break;
			}
			let result = [];
			for (let k of encodingKeys) {
				let tokens = k.split("_");
				for (let classId of classIds) {
					if (tokens[0] == classId) {
						if (scene.encodings[k][channel])
							result.push(scene.encodings[k][channel]);
					}
				}
			}
			return result;
		}

		get firstChild() {
			return this.children[0];
		}

		get lastChild() {
			return this.children[this.children.length - 1];
		}

		set layout(l) {
			this._layout = l;
			if (l) {
				l.group = this;
				this._layout.run();
			} else {
				//check if there are position encodings and reapply them
				let xEncs = this.getInternalEncodings("x"),
					yEncs = this.getInternalEncodings("y");
				for (let e of xEncs) {
					e._map();
					e._apply();
				}
				for (let e of yEncs) {
					e._map();
					e._apply();
				}	
			}
		}

		get layout() {
			return this._layout;
		}

		get bounds() {
			if (!this._bounds) {
				this._updateBounds();
			}
			return this._bounds;
		}

		get x() {
			return this.bounds.x;
		}

		get y() {
			return this.bounds.y;
		}

		_updateBounds() {
			if (this.children.length > 0){
				this._bounds = this.children[0].bounds.clone();
				for (let i = 1; i < this.children.length; i++) {
					if (this.children[i].visibility == "hidden")
						continue;
					this._bounds = this._bounds.union(this.children[i].bounds);
				}
				if (this._layout && this._layout.type == "grid") {
					let cellBounds = this._layout.cellBounds;
					for (let i = 0; i < cellBounds.length; i++) {
						this._bounds = this._bounds.union(cellBounds[i]);
					}
				}
			} else {
				this._bounds = new Rectangle(0, 0, 0, 0);
			}
		}

		sortChildrenByData(field, reverse, order) {
			let type = this.children[0].dataScope.getFieldType(field);
			let f; 
			switch (type) {
				case DataType.Date:
					break;
				case DataType.Number:
				case DataType.Integer:
					f = (a, b) =>  a.dataScope.aggregateNumericalField(field) - b.dataScope.aggregateNumericalField(field);
					break;
				case DataType.String:
					if (order)
						f = (a, b) => order.indexOf(a.dataScope.getFieldValue(field)) - order.indexOf(b.dataScope.getFieldValue(field));
					else
						f = (a, b) =>  (a.dataScope.getFieldValue(field) < b.dataScope.getFieldValue(field) ? -1 : 1 );
					break;
			}
			this.children.sort(f);
			if (reverse)
				this.children.reverse();
			if (this.layout)
				this.layout.run();
			this.childrenOrder = {field: field, reverse: reverse, order: order};
		}

		sortChildren(channel, reverse){
			let f;
			switch (channel){
				case "x":
				case "y":
				case "width":
				case "height":
					f = (a, b) => a.bounds[channel] - b.bounds[channel];
					break;
				default:
					f = (a, b) => a[channel] - b[channel];
					break;
			}
			this.children.sort(f);
			if (reverse)
				this.children.reverse();
			if (this.layout)
				this.layout.run();
			this.childrenOrder = {channel: channel, reverse: reverse};
		}

		set visibility(v) {
			if (v == "hidden")
				this._visibility = v;
			else
				this._visibility = "visible";
			for (let c of this.children)
				c.visibility = v;
		}

		get visibility() {
			if (!this._visibility)
				return "visible";
			return this._visibility;
		}
	}

	function uniqueNumbers(numbers) {
		return [...new Set(numbers)];
	}

	function validateField(field, datatable) {
		if (datatable.hasField(field))
			return true;
		else if (datatable.tree && datatable.tree.nodeTable.hasField(field.split(".")[1]))
			return true;
		else
			throw new Error(Errors.FIELD_NONEXISTENT + ", field: " + field  + ", data table: " + datatable.name);
	}

	function normalizeAngle(a) {
		if (a < 0)
			return a + 360;
		else if (a > 360)
			return a - 360;
		else
			return a;
	}

	class DataScope {

		constructor(datatable) {
			this._field2value = {}; 
			this._dt = datatable;
			this._tuples = this._dt.data;
		}

		toJSON() {
			let json = {};
			json.dt = this._dt.id;
			json.f2v = Object.assign({}, this._field2value);
			return json;
		}

		isFullTable() {
			return Object.keys(this._field2value).length === 0;
		}

		isEmpty() {
			return this._tuples.length == 0;
		}

		get numTuples() {
			return this._tuples.length;
		}

		get fields() {
			return Object.keys(this._field2value);
		}

		get dataTable() {
			return this._dt;
		}

		get filters() {
			return this._field2value;
		}

		merge(ds) {
			let r = new DataScope(this._dt);
			for (let field in ds._field2value) {
				r = r.cross(field, ds._field2value[field]);
			}
			for (let field in this._field2value) {
				r = r.cross(field, this._field2value[field]);
			}
			return r;
		}

		cross(field, value) {
			let ds = this.clone();
			ds._field2value[field] = value;
			ds._updateTuples(field, value);
			return ds;
		}

		clone() {
			let ds = new DataScope(this._dt);
			ds._field2value = Object.assign({}, this._field2value);
			ds._tuples = this._tuples.map(d => d);
			return ds;
		}

		getFieldValue(field) {
			let values = this._tuples.map(d => d[field]);
			values = [...new Set(values)];
			if (values.length > 1); 
			return values[0];
		}

		getUniqueFieldValues(field) {
			let values = this._tuples.map(d => d[field]);
			return [...new Set(values)];
		}

		hasField(field) {
			return (field in this._field2value);
		}

		getFieldType(field) {
			return this._dt.getFieldType(field);
		}

		aggregateNumericalField(field, aggregator) {
			let values = this._tuples.map(d => d[field]);
			switch (aggregator) {
				case Aggregator.Max:
					return Math.max(...values);
				case Aggregator.Min:
					return Math.min(...values);
				case Aggregator.Avg:
				case Aggregator.Mean:
					return d3__namespace.mean(values);
				case Aggregator.Median:
					return d3__namespace.median(values);
				case Aggregator.Count:
					return values.length;
				case Aggregator.Percentile25:
					return d3__namespace.quantile(values, 0.25);
				case Aggregator.Percentile75:
					return d3__namespace.quantile(values, 0.75);
				case Aggregator.Sum:
				default:
					return d3__namespace.sum(values);
			}
		}

		_updateTuples(field, value) {
			this._tuples = this._tuples.filter(d => d[field] == value);
		}
	}

	function repeatItem(scene, compnt, field, datatable, callback) {
		let f = callback ? datatable.transformField(field, callback) : field;
		let type = datatable.getFieldType(f);

		if (type != DataType.String && type != DataType.Date && type != DataType.Integer) {
			throw new Error(Errors.REPEAT_BY_NONCAT + ": " + f + " is " + type);
		}

		if (!canRepeat(compnt)) {
			throw new Error(Errors.COMPNT_NON_REPEATABLE);
		}

		return _doRepeat(scene, compnt, f, datatable);
	}

	function _doRepeat(scene, compnt, field, datatable) {
		let ds = datatable.getFieldSummary(field).unique.map(d => compnt.dataScope ? compnt.dataScope.cross(field, d) : new DataScope(datatable).cross(field, d));
		ds = ds.filter(d => !d.isEmpty());
		let coll = scene.collection();
		coll.dataScope = compnt.dataScope ? compnt.dataScope.clone() :  new DataScope(datatable);

		//scene.addChild(coll);
		
		//do not initialize classId here, initialize in scene.mark/glyph/new Collection()
		// compnt.classId = compnt.id;
		coll.addChild(compnt);

		for (let i = 1; i < ds.length; i++) {
			let c = compnt.duplicate();
			coll.addChild(c);
		}

		coll.children.forEach((d, i) => d.dataScope = ds[i]);
		//TODO: turn the folllwing into getter and setter
		// if (!scene.cellAlign.hasOwnProperty(compnt.classId)) {
		// 	scene.cellAlign[compnt.classId] = {x: Alignment.Left, y: Alignment.Bottom};
		// }
		scene._reapplySizeBindings(compnt);
		return coll;
	}

	function repeatNodeLink(scene, node, link, data) {
		let nodeDS = data.nodeTable.getFieldSummary(nodeId).unique.map(d => node.dataScope ? node.dataScope.cross(nodeId, d) : new DataScope(data.nodeTable).cross(nodeId, d));
		let nodeColl = scene.collection(), id2node = {};
		nodeColl.dataScope = node.dataScope ? node.dataScope.clone() :  new DataScope(data.nodeTable);
		
		//do not initialize classId here, initialize in scene.mark/glyph/new Collection()
		// compnt.classId = compnt.id;
		nodeColl.addChild(node);
		for (let i = 1; i < nodeDS.length; i++) {
			let c = node.duplicate();
			nodeColl.addChild(c);
		}

		nodeColl.children.forEach((d, i) => {
			d.dataScope = nodeDS[i];
			id2node[d.dataScope.getFieldValue(nodeId)] = d;
		});

		let linkDS = data.linkTable.getFieldSummary(atlas_rowId).unique.map(d => link.dataScope ? link.dataScope.cross(atlas_rowId, d) : new DataScope(data.linkTable).cross(atlas_rowId, d));
		let linkColl = scene.collection();
		linkColl.dataScope = link.dataScope ? link.dataScope.clone() : new DataScope(data.linkTable);

		linkColl.addChild(link);
		for (let i = 1; i < linkDS.length; i++) {
			let c = link.duplicate();
			linkColl.addChild(c);
		}

		linkColl.children.forEach((d, i) => d.dataScope = linkDS[i]);
		let s = data.type === "tree" ? "parent" : "source", t = data.type === "tree" ? "child" : "target";
		for (let l of linkColl.children) {
			let sid = l.dataScope.getFieldValue(s),
				tid = l.dataScope.getFieldValue(t);
			l.source = id2node[sid];
			l.target = id2node[tid];
			l._updateBounds();
		}
		scene.addChild(linkColl);
		scene.addChild(nodeColl);
		
		return [nodeColl, linkColl];
	}

	class StackLayout extends Layout {

		constructor(args) {
			super(args);
			this.type = LayoutType.Stack;
			this._orientation = args.orientation;
			this._direction = args.direction;
			this._left = args.left;
			this._top = args.top;
			this._horzCellAlignment = "horzCellAlignment" in args && args["horzCellAlignment"] ? args.horzCellAlignment : Alignment.Left;
			this._vertCellAlignment = "vertCellAlignment" in args && args["vertCellAlignment"]  ? args.vertCellAlignment : Alignment.Bottom;
			this._gap = "gap" in args ? args.gap : 0;
		}

		toJSON() {
			let json = {args: {}};
			json.type = this.type;
			json.args.orientation = this._orientation;
			json.args.direction = this._direction;
			json.args.left = this._left;
			json.args.top = this._top;
			json.args.gap = this._gap;
			json.args.horzCellAlignment = this._horzCellAlignment;
			json.args.vertCellAlignment = this._vertCellAlignment;
			return json;
		}

		clone() {
			let s = new StackLayout({orientation: this._orientation, direction: this._direction, left: this._left, top: this._top});
			s._horzCellAlignment = this._horzCellAlignment;
			s._vertCellAlignment = this._vertCellAlignment;
			return s;
		}

		_stackAreasVert() {
			let areas = this.group.children, gb = this.group.bounds, 
				start = this._vertCellAlignment === Alignment.Top ? gb.top : gb.bottom,
				dir = this._vertCellAlignment === Alignment.Top ? 1 : -1;
			let vCnt = areas[0].vertices.length/2,
				cumuHts = new Array(vCnt).fill(0);
			for (let area of areas) {
				for (let i = 0; i < vCnt; i++) {
					let v1 = area.vertices[i],
						v2 = area.vertices[vCnt*2 - i - 1],
						ht = Math.abs(v1.y - v2.y);
					let y1 = start + cumuHts[i] * dir, y2 = start + (cumuHts[i] + ht) * dir;
					v1._doTranslate(0, y1 - v1.y);
					v2._doTranslate(0, y2 - v2.y);
					cumuHts[i] += ht;
				}
				area._updateBounds();
			}
			if (this.vertCellAlignment === Alignment.Middle) {
				for (let area of areas) {
					for (let i = 0; i < vCnt; i++) {
						let v1 = area.vertices[i],
							v2 = area.vertices[vCnt*2 - i - 1];
						let b = gb.middle + cumuHts[i]/2;
						v1._doTranslate(0, b - gb.bottom);
						v2._doTranslate(0, b - gb.bottom);
					}
					area._updateBounds();
				}
			}
			this.group._updateBounds();
		}

		_stackAreasHorz() {
			let areas = this.group.children, gb = this.group.bounds, 
				start = this._horzCellAlignment === Alignment.Right ? gb.right : gb.left,
				dir = this._horzCellAlignment === Alignment.Right ? -1 : 1;
			let vCnt = areas[0].vertices.length/2,
				cumuWds = new Array(vCnt).fill(0);
			for (let area of areas) {
				for (let i = 0; i < vCnt; i++) {
					let v1 = area.vertices[i],
						v2 = area.vertices[vCnt*2 - i - 1],
						wd = Math.abs(v1.x - v2.x);
					let y1 = start + cumuWds[i] * dir, y2 = start + (cumuWds[i] + wd) * dir;
					v1._doTranslate(0, y1 - v1.y);
					v2._doTranslate(0, y2 - v2.y);
					cumuWds[i] += wd;
				}
				area._updateBounds();
			}
			if (this._horzCellAlignment === Alignment.Center) {
				for (let area of areas) {
					for (let i = 0; i < vCnt; i++) {
						let v1 = area.vertices[i],
							v2 = area.vertices[vCnt*2 - i - 1];
						let l = gb.center - cumuWds[i]/2;
						v1._doTranslate(0, l - gb.left);
						v2._doTranslate(0, l - gb.left);
					}
					area._updateBounds();
				}
			}
			this.group._updateBounds();		
		}

		_stackAreas() {
			let area = this.group.children[0];
			if (area.orientation === Orientation.Horizontal) {
				this._stackAreasVert();
			} else {
				this._stackAreasHorz();
			}
		}

		_stackArcs() {
			let group = this.group;
			let startAngle = this.startAngle ? this.startAngle : 90,
				dir = this._direction ? this._direction : Direction.Clockwise;
			if (dir === Direction.Clockwise) {
				for (let c of group.children) {
					let temp = normalizeAngle(startAngle - c.angle);
					c.adjustAngle(temp, startAngle);
					startAngle = temp;
				}
			} else {
				for (let c of group.children) {
					let temp = normalizeAngle(startAngle + c.angle);
					c.adjustAngle(startAngle, temp);
					startAngle = temp;
				}
			}	
		}

		_stackRects() {
			let scene = this.group.getScene();
			let group = this.group, o = this._orientation;
			let bounds = group.children.map(d => d.bounds);
			let lefts = bounds.map(d => d.left),
				tops = bounds.map(d => d.top),
				wds = bounds.map(d => d.width),
				hts = bounds.map(d => d.height);
			let left = this._left == undefined ? Math.min(...lefts) : this._left,
				top = this._top == undefined ? Math.min(...tops) : this._top;

			let maxWd = Math.max(...wds), maxHt = Math.max(...hts);
			if (o == Orientation.Vertical) {
				let centerX = left + maxWd/2;
				for (let i = 0; i < group.children.length; i++) {
					let c = group.children[i]; 
					let dx = centerX - c.bounds.x,
						dy = top + c.bounds.height/2 - c.bounds.y;
					top += c.bounds.height + this._gap;
					c._doTranslate(dx, dy);
					//alignment
					let cdx = 0, cdy = 0;
					let xEnc = scene.getEncodingByItem(c, "x");
					if (!xEnc) {
						switch (this._horzCellAlignment) {
							case Alignment.Left:
								cdx = left - c.bounds.left;
								break;
							case Alignment.Center:
								cdx = left + maxWd/2 - c.bounds.x;
								break;
							case Alignment.Right:
								cdx = left + maxWd - c.bounds.right;
								break;
						}
					}
					c._doTranslate(cdx, cdy);
				}
			} else {
				let centerY = top + maxHt/2;
				for (let i = 0; i < group.children.length; i++) {
					let c = group.children[i]; 
					let dx = left + c.bounds.width/2 - c.bounds.x,
						dy = centerY - c.bounds.y;
					left += c.bounds.width + this._gap;
					c._doTranslate(dx, dy);

					//TODO: alignment
					let cdx = 0, cdy = 0;
					let yEnc = scene.getEncodingByItem(c, "y");
					if (!yEnc) {
						switch (this._vertCellAlignment) {
							case Alignment.Top:
								cdy = top - c.bounds.top;
								break;
							case Alignment.Middle:
								cdy = top + maxHt/2 - c.bounds.y;
								break;
							case Alignment.Bottom:
								cdy = top + maxHt - c.bounds.bottom;
								break;
						}
					}
					c._doTranslate(cdx, cdy);
				}
			}
			this.group._updateBounds();	
		}

		run() {
			if (this.group == undefined || !this.group.children || this.group.children.length === 0)
				return;
			if (this.group.children[0].type == "area") {
				this._stackAreas();
			} else if (this.group.children[0].type == ItemType.Arc || this.group.children[0].type == ItemType.Pie) {
				this._stackArcs();	
			} else {
				this._stackRects();	
			} 
		}

		set vertCellAlignment(v) {
			if (v != Alignment.Top && v != Alignment.Bottom && v != Alignment.Middle) {
				throw Errors.UNKOWN_ALIGNMENT;
			}
			this._vertCellAlignment = v;
			this.run();
		}

		get vertCellAlignment() {
			return this._vertCellAlignment;
		}

		set horzCellAlignment(h) {
			if (h != Alignment.Left && h != Alignment.Center && h != Alignment.Right) {
				throw Errors.UNKOWN_ALIGNMENT;
			}
			this._horzCellAlignment = h;
			this.run();
		}

		get horzCellAlignment() {
			return this._horzCellAlignment;
		}

		get cellBounds() {
			return this.group.children.map(d => d.bounds);
		}

		get orientation() {
			return this._orientation;
		}

		set orientation(o) {
			this._orientation = o;
			this.run();
		}
	}

	function divideItem(scene, compnt, orientation, field, datatable, callback) {
		let f = callback ? datatable.transformField(field, callback) : field;
		let type = datatable.getFieldType(f);

		if (type != DataType.String && type != DataType.Date) {
			throw new Error(Errors.PARTITION_BY_NONCAT + ": " + f + " is " + type);
		}

		if (!canDivide(compnt)) {
			throw new Error(Errors.COMPNT_NON_PARTITIONABLE);
		}

		switch (compnt.type) {
			case ItemType.Line:
				return _doLineDivide(scene, compnt, f, datatable);
			case ItemType.Circle:
				return _doCircleDivide(scene, compnt, orientation, f, datatable);
			case ItemType.Rect:
				return _doRectDivide(scene, compnt, orientation, f, datatable);
			case ItemType.Area:
				return _doAreaDivide(scene, compnt, orientation, f, datatable);
			case ItemType.Ring:
				return _doRingDivide(scene, compnt, orientation, f, datatable);
			case ItemType.Pie:
				return _doPieDivide(scene, compnt, orientation, f, datatable);
		}
		
	}

	function _doLineDivide(scene, compnt, field, datatable) {
		let peers = getPeers(compnt, scene);
		let toReturn;
		let ds = datatable.getFieldSummary(field).unique.map(d => new DataScope(datatable).cross(field, d));

		let line2Scopes = {}, max = 0;
		for (let p of peers) {
			let scopes = ds;
			if (p.dataScope) {
				scopes = ds.map(d => d.merge(p.dataScope));
				scopes = scopes.filter(d => !d.isEmpty());
			}
			if (scopes.length > max)
				max = scopes.length;
			line2Scopes[p.id] = scopes;
		}
		let collClassId;
		for (let p of peers) {
			let coll = scene.collection();
			if (collClassId == undefined)
				collClassId = coll.id;
			coll.classId = collClassId;
			coll.dataScope = p.dataScope;

			let parent = p.parent;
			//let index = parent.children.indexOf(p) - 1;
			parent.addChild(coll);

			let scopes = line2Scopes[p.id];
			let x1 = p.vertices[0].x, y1 = p.vertices[0].y, x2 = p.vertices[1].x, y2 = p.vertices[1].y;

			p.classId = compnt.id;
			p.vertices[0].x = x1;
			p.vertices[0].y = y1;
			p.vertices[1].x = x1 + (x2 - x1)/max;
			p.vertices[1].y = y1 + (y2 - y1)/max;
			p.dataScope = scopes[0];
			coll.addChild(p);
			
			for (let i = 1; i < scopes.length; i++) {
				let c = p.duplicate();
				c.vertices[0].x = x1 + (x2 - x1) * i /max;
				c.vertices[0].y = y1 + (y2 - y1) * i /max;
				c.vertices[1].x = x1 + (x2 - x1) * (i + 1)/max;
				c.vertices[1].y = y1 + (y2 - y1) * (i + 1)/max;
				c.dataScope = scopes[i];
				coll.addChild(c);
			}

			if (p == compnt)
				toReturn = coll;
		}

		return toReturn;
	}



	function _doRectDivide(scene, compnt, o, field, datatable) {
		let peers = getPeers(compnt, scene);
		let toReturn, orientation = o ? o : Orientation.Horizontal;
		if (orientation != Orientation.Horizontal && orientation != Orientation.Vertical)
			throw Errors.UNKNOWN_Orientation + ": " + orientation; 
		let ds = datatable.getFieldSummary(field).unique.map(d => new DataScope(datatable).cross(field, d));

		//datascopes
		let rect2Scopes = {}, max = 0;
		for (let p of peers) {
			let scopes = ds;
			if (p.dataScope) {
				scopes = ds.map(d => d.merge(p.dataScope));
				scopes = scopes.filter(d => !d.isEmpty());
			}
			if (scopes.length > max)
				max = scopes.length;
			rect2Scopes[p.id] = scopes;
		}

		let collClassId;
		for (let p of peers) {
			let coll = scene.collection();
			if (collClassId == undefined)
				collClassId = coll.id;
			coll.classId = collClassId;
			coll.dataScope = p.dataScope ? p.dataScope : new DataScope(datatable);

			let parent = p.parent;
			//let index = parent.children.indexOf(p) - 1;
			parent.addChild(coll);

			let scopes = rect2Scopes[p.id];
			let bounds = p.bounds, left = bounds.left, top = bounds.top;

			let wd = orientation == Orientation.Horizontal ? bounds.width/max : bounds.width,
				ht = orientation == Orientation.Horizontal ? bounds.height : bounds.height/max;
			p.classId = compnt.id;
			p.resize(wd, ht);
			p.dataScope = scopes[0];
			coll.addChild(p);
			
			for (let i = 1; i < scopes.length; i++) {
				let c = p.duplicate();
				c.resize(wd, ht);
				c.dataScope = scopes[i];
				coll.addChild(c);
			}

			coll.layout = new StackLayout({orientation: orientation, left: left, top: top});

			if (p == compnt)
				toReturn = coll;
		}

		scene._reapplySizeBindings(toReturn);

		//update axis item argument
		let axes = scene.getRelatedAxes(compnt);
		for (let a of axes) {
			if (a._item.classId === compnt.classId) {
				a._item = toReturn;
				a._items = getPeers(toReturn, scene);
			}
		}

		return toReturn;
	}

	function _doAreaDivide(scene, compnt, orientation, field, datatable) {
		let peers = getPeers(compnt, scene);
		// make sure the orientation is correct; in case that the boundary partitioning has already been performed if we initial an area mark other than a rect
		let p1 = peers[0];
		if ((p1.vertices.length == 4) && (orientation == Orientation.Horizontal) && (p1.vertices[0].x !== p1.vertices[1].x)) {
			for (let p of peers) {
				let temp = p.vertices[1];
				p.vertices[1] = p.vertices[3];
				p.vertices[3] = temp;
			}
		}
		let toReturn;
		let ds = datatable.getFieldSummary(field).unique.map(d => new DataScope(datatable).cross(field, d));
		let collClassId;
		for (let p of peers) {
			let coll = scene.collection();
			if (collClassId == undefined)
				collClassId = coll.id;
			coll.classId = collClassId;
			coll.dataScope = p.dataScope ? p.dataScope : new DataScope(datatable);

			let parent = p.parent;
			parent.addChild(coll);

			let left = p.left, top = p.top;

			let wd = orientation == Orientation.Horizontal ? p.width/ds.length : p.width,
			ht = orientation == Orientation.Horizontal ? p.height : p.height/ds.length;
			
			p.classId = compnt.id;
			p.resizeArea(wd, ht);
			coll.addChild(p);

			for (let i = 1; i < ds.length; i++) {
				let c = p.duplicate();
				c.resizeArea(wd, ht);
				coll.addChild(c);
			}

			for (let i = 0; i < coll.children.length; i++) {
				let child = coll.children[i];
				if (child.dataScope) {
					child.dataScope = child.dataScope.merge(ds[i]);
				} else {
					child.dataScope = ds[i];
				}
				// assigning datascope for boundary vertices
				for (let v of child.vertices){
					if (v.dataScope) {
						v.dataScope = child.dataScope.merge(v.dataScope);
					}
					else {
						v.dataScope = child.dataScope;
					}
				}
			}

			coll.layout = new StackLayout({orientation: orientation, left: left, top: top});

			if (p == compnt)
				toReturn = coll;
		}
		scene._reapplySizeBindings(toReturn);
		return toReturn;
	}

	function _doPieDivide(scene, compnt, o, field, datatable) {
		let toReturn, orientation = o ? o : Orientation.Radial;
		let peers = getPeers(compnt, scene);
		let collClassId;
		if (orientation == Orientation.Radial) {
			peers.forEach(p => {
				let pieDS = p.dataScope ? p.dataScope : new DataScope(datatable);
				let ds = datatable.getFieldSummary(field).unique.map(d => pieDS.cross(field, d));
				ds = ds.filter(d => !d.isEmpty()); 
				let numArcs = ds.length;
		
				// Define new collection and save parent
				let coll = scene.collection();
				coll.dataScope = pieDS;
				if (collClassId == undefined)
					collClassId = coll.id;
				coll.classId = collClassId;
				let parent = p.parent;
				// Create each arc
				for (let i = 0; i < numArcs; i++){
					let arc = scene.mark("arc", {
						innerRadius: i * p.outerRadius/numArcs,
						outerRadius: (i+1) * p.outerRadius/numArcs,
						x: p.x,
						y: p.y,
						startAngle: p.startAngle,
						endAngle: p.endAngle,
						strokeColor: p.strokeColor,
						fillColor: p.fillColor,
						strokeWidth: p.strokeWidth,
						opacity: p.opacity
					});

					// Add the datascope
					arc.dataScope = ds[i];
					arc.classId = compnt.id;
		
					// Add to collection
					coll.addChild(arc);
				}
		
				// Replace original circle w/ coll of pies
				parent.removeChild(p);
				parent.addChild(coll);
		
				// Return collection
				if (p == compnt)
					toReturn = coll;
			});
			return toReturn;
		} else {
			throw Errors.UNKNOWN_Orientation + ": " + orientation;
		}
	}

	function _doRingDivide(scene, compnt, o, field, datatable) {
		let toReturn, orientation = o ? o : Orientation.Angular;
		let peers = getPeers(compnt, scene);
		let collClassId;
		if (orientation == Orientation.Angular) {
			peers.forEach(p => {
				let ringDS = p.dataScope ? p.dataScope : new DataScope(datatable);
				let ds = datatable.getFieldSummary(field).unique.map(d => ringDS.cross(field, d));
				ds = ds.filter(d => !d.isEmpty()); 
				let numArcs = ds.length;
		
				// Define new collection and save parent
				let coll = scene.collection();
				coll.dataScope = ringDS;
				if (collClassId == undefined)
					collClassId = coll.id;
				coll.classId = collClassId;
				let parent = p.parent;
		
				let arcAng = 360 / numArcs;
		
				// Create each pie
				let start = 90;
				for (let i = 0; i < numArcs; i++){
					let arc = scene.mark("arc", {
						innerRadius: p.innerRadius,
						outerRadius: p.outerRadius,
						x: p.x,
						y: p.y,
						startAngle: normalizeAngle(start - arcAng * (i + 1)) ,
						endAngle: normalizeAngle(start - arcAng * i) ,
						strokeColor: p.strokeColor,
						fillColor: p.fillColor,
						strokeWidth: p.strokeWidth,
						opacity: p.opacity
					});

					// Add the datascope
					arc.dataScope = ds[i];
					arc.classId = compnt.id;
		
					// Add to collection
					coll.addChild(arc);
				}
				coll.layout = layout("stack", {direction: Direction.Clockwise});
				// Replace original circle w/ coll of pies
				parent.removeChild(p);
				parent.addChild(coll);
		
				// Return collection
				if (p == compnt)
					toReturn = coll;
			});
			return toReturn;
		} else {
			throw Errors.UNKNOWN_Orientation + ": " + orientation;
		}
	}


	function _doCircleDivide(scene, compnt, o, field, datatable) {
		let toReturn, orientation = o ? o : Orientation.Angular;

		// Perform on all repitions of cmpnt on canvas
		let peers = getPeers(compnt, scene);
		let collClassId;
		if (orientation == Orientation.Angular) {
			peers.forEach(p => {
				let circDS = p.dataScope ? p.dataScope : new DataScope(datatable);
				//console.info("Peer DS: ", circDS);
				let ds = datatable.getFieldSummary(field).unique.map(d => circDS.cross(field, d));
				ds = ds.filter(d => !d.isEmpty()); 
				let numPies = ds.length;
		
				// Define new collection and save parent
				let coll = scene.collection();
				coll.dataScope = circDS;
				if (collClassId == undefined)
					collClassId = coll.id;
				coll.classId = collClassId;
				let parent = p.parent;
		
				// Calculate angle of each pie
				let pieAng = 360 / numPies;
		
				// Create each pie
				let start = 90;
				for (let i = 0; i < numPies; i++){
					let pie = scene.mark("pie", {
						radius: p.radius,
						x: p.x,
						y: p.y,
						startAngle: normalizeAngle(start - pieAng * (i + 1)) ,
						endAngle: normalizeAngle(start - pieAng * i) ,
						strokeColor: p.strokeColor,
						fillColor: p.styles.fillColor 
					});

					// Add the datascope
					pie.dataScope = ds[i];
					pie.classId = compnt.id;
		
					// Add to collection
					coll.addChild(pie);
				}
		
				coll.layout = layout("stack", {direction: Direction.Clockwise});
				// Replace original circle w/ coll of pies
				parent.removeChild(p);
				parent.addChild(coll);
		
				// Return collection
				if (p == compnt)
					toReturn = coll;
			});
		} else if (orientation == Orientation.Radial) {//radial
			peers.forEach(p => {
				let circDS = p.dataScope ? p.dataScope : new DataScope(datatable);
				let ds = datatable.getFieldSummary(field).unique.map(d => circDS.cross(field, d));
				ds = ds.filter(d => !d.isEmpty()); 
				let numRings = ds.length;
		
				// Define new collection and save parent
				let coll = scene.collection();
				coll.dataScope = circDS;
				if (collClassId == undefined)
					collClassId = coll.id;
				coll.classId = collClassId;
				let parent = p.parent;
		
				// Calculate angle of each pie
				let thickness = p.radius / numRings;
		
				// Create each pie
				for (let i = 0; i < numRings; i++){
					let r = scene.mark("ring", {
						x: p.x,
						y: p.y,
						innerRadius: i * thickness,
						outerRadius: (i + 1) * thickness,
						strokeColor: p.strokeColor,
						fillColor: p.styles.fillColor 
					});
		
					// Add the datascope
					r.dataScope = ds[i];
					r.classId = compnt.id;
		
					// Add to collection
					coll.addChild(r);
				}
		
				// Replace original circle w/ coll of pies
				parent.removeChild(p);
				parent.addChild(coll);
		
				// Return collection
				if (p == compnt)
					toReturn = coll;
			});
		} else {
			throw Errors.UNKNOWN_Orientation + ": " + orientation;
		}

		return toReturn;
	}

	function densifyItem(scene, compnt, orientation, field, datatable, callback, startAngle, direction) {	
		let f = callback ? datatable.transformField(field, callback) : field;
		let type = datatable.getFieldType(f);

		if (type != DataType.String && type != DataType.Date && type != DataType.Number) {
			throw new Error(Errors.DENSIFY_BY_NONCAT + ": " + f + " is " + type);
		}

		if (!canDensify(compnt)) {
			throw new Error(Errors.COMPNT_NON_DENSIFIABLE);
		}

		switch (compnt.type) {
			case ItemType.Line:
				return _doLineDensify(scene, compnt, f, datatable);
			case ItemType.Circle:
				return _doCircleDensify(scene, compnt, f, datatable, startAngle, direction);
			case ItemType.Rect:
			case ItemType.Area:
				return _doAreaDensify(scene, compnt, orientation, f, datatable);
		}
		
	}

	function _doLineDensify(scene, compnt, field, datatable) {
		let peers = getPeers(compnt, scene);

		let toReturn;
		for (let p of peers) {
			let lineDS = p.dataScope ? p.dataScope : new DataScope(datatable);
			let ds = datatable.getFieldSummary(field).unique.map(d => lineDS.cross(field, d));
			ds = ds.filter(d => !d.isEmpty());

			let args = Object.assign({}, p.styles);
			for (let vs of Vertex.styles){
				if (p[vs])
					args[vs] = p[vs];
			}

			//compute vertices
			let x1 = p.vertices[0].x,
				y1 = p.vertices[0].y,
				x2 = p.vertices[1].x,
				y2 = p.vertices[1].y;

			let vertices = [], wd = x2 - x1, ht = y2 - y1;
			for (let i = 0; i < ds.length; i++){
				vertices.push([x1 + i * wd / (ds.length - 1), y1 + i * ht /(ds.length - 1)]);
			}
			args.vertices = vertices;
			let polyLine = scene.mark("path", args);
			polyLine.classId = compnt.id;
			polyLine.dataScope = lineDS;

			let parent = p.parent;
			parent.addChild(polyLine);
			parent.removeChild(p);

			for (let [i, v] of polyLine.vertices.entries()){
				if (v.dataScope)
					v.dataScope = v.dataScope.merge(ds[i]);
				else
					v.dataScope = ds[i];
			}

			if (p == compnt)
				toReturn = polyLine;
		}
		return toReturn;
	}

	function _doAreaDensify(scene, compnt, orientation, field, datatable) {
		let peers = getPeers(compnt, scene);
		let toReturn;
		
		for (let p of peers) {
			// How to handle missing elements across different partitions in area mark?
			let ft = datatable.getFieldType(field);
			let areaDS = p.dataScope ? p.dataScope : new DataScope(datatable);
			let ds = datatable.getFieldSummary(field).unique.map(d => areaDS.cross(field, d));
			ds = ft == DataType.Number? ds : ds.filter(d => !d.isEmpty());
			
			if (ft == DataType.Number || ft == DataType.Date) {
				// sorting ds
				ds.sort((a, b) => (a._field2value[field] > b._field2value[field]) ? 1 : -1);
			}
			let args = Object.assign({}, p.styles);
			//compute vertices
			let x1 = p.vertices[0].x,
				y1 = p.vertices[0].y,
				x2 = p.vertices[p.vertices.length - 2].x,
				y2 = p.vertices[p.vertices.length - 2].y;

			let vertices = [], wd = x2 - x1, ht = y2 - y1;
			for(let j = 0; j < ds.length; j++) {
				vertices.push(orientation == Orientation.Vertical ? [x2, y1 + (ds.length-1-j) * ht /(ds.length - 1)] : [x1 + j * wd / (ds.length - 1), y1]);
			}
			for(let j = 0; j < ds.length; j++) {
				vertices.push(orientation == Orientation.Vertical ? [x1, y1 + j * ht /(ds.length - 1)] : [x1 + (ds.length-1-j) * wd / (ds.length - 1), y2]);
			}
			args.vertices = vertices;
			let NewArea = scene.mark("area", args);
			// Very Important: keep new areas' classID consistent
			NewArea.classId = p.type == "area"? p.classId : "area" + p.classId.substring(9);
			NewArea.dataScope = areaDS;
			NewArea.orientation = orientation;
			NewArea.baseline = orientation === Orientation.Horizontal ? Alignment.Bottom : Alignment.Left;

			let parent = p.parent;
			parent.addChild(NewArea);
			parent.removeChild(p);

			for (let [i, v] of NewArea.vertices.entries()){
				// two boundary lines are encoded the same; possible to modify later according to the data encoding
				if (i>=ds.length) {
					v.dataScope = areaDS.merge(ds[ds.length*2-1-i]);
				}
				else {
					v.dataScope = areaDS.merge(ds[i]);
				}
			}
			if (p == compnt) {
				toReturn = NewArea;
				// targetArea = NewArea;
			}
		}
		return toReturn;
	}

	function _doCircleDensify(scene, compnt, field, datatable, startAngle, direction) {
		let toReturn;
		let peers = getPeers(compnt, scene);
		peers.forEach(p => {
			let circDS = p.dataScope ? p.dataScope : new DataScope(datatable);
			let ds = datatable.getFieldSummary(field).unique.map(d => circDS.cross(field, d));
			ds = ds.filter(d => !d.isEmpty()); 
			let numVertices = ds.length;
			if (numVertices < 3)
				throw Error(Errors.INSUFFICIENT_DATA_SCOPES);
			let k = 360/numVertices, vertices = [], angle = [];
			let dirSign = direction == "clockwise" ? -1 : 1;
			for (let i = 0; i < ds.length; i++){
				let a = startAngle + dirSign * i * k;
				angle[i] = a;
				let coords = polar2Cartesian(p.x, p.y, p.radius, angle[i]);
				vertices.push(coords);
			}
			let polygon = scene.mark("polygon", {x: p.x, y: p.y, radius: p.radius, vertices:vertices});
			polygon.dataScope = circDS;
			polygon.styles = Object.assign({}, p.styles);
			for (let vs of Vertex.styles){
				if (p[vs])
					polygon[vs] = p[vs];
			}

			let parent = p.parent;
			parent.addChild(polygon);
			parent.removeChild(p);

			for (let [i, v] of polygon.vertices.entries()){
				v.polarAngle = angle[i];
				if (v.dataScope)
					v.dataScope = v.dataScope.merge(ds[i]);
				else
					v.dataScope = ds[i];
			}

			if (p == compnt)
				toReturn = polygon;
		});
		return toReturn;
	}

	class RectPath extends Path {
		
		constructor(args) {
			super(args);
			
			this.type = ItemType.Rect;
			this.closed = true;

			//add last segment to close the path
			if (args && "vertices" in args)
				this.segments.push(new Segment(this.vertices[3], this.vertices[0], this, this.segmentCounter++));
		}

		get width() {
			return this.vertices[1].x - this.vertices[0].x;
		}

		get height() {
			return this.vertices[2].y - this.vertices[1].y;
		}

		set height(ht) {
			this.resize(this.width, ht);
		}

		set width(wd) {
			this.resize(wd, this.height);
		}

		get left() {
			return this.vertices[0].x;
		}

		get top() {
			return this.vertices[0].y;
		}

		get right() {
			return this.vertices[1].x;
		}

		get bottom() {
			return this.vertices[2].y;
		}

		get area() {
			return this.width * this.height;
		}

		//override path's resize method, by default, keep the left and top segments intact
		resize(wd, ht, xRef, yRef) {
			if (xRef === "right") {
				this.vertices[0].x = this.vertices[1].x - wd;
				this.vertices[3].x = this.vertices[0].x;
			} else {
				this.vertices[1].x = this.vertices[0].x + wd;
				this.vertices[2].x = this.vertices[1].x;
			}
			if (yRef === "top") {
				this.vertices[3].y = this.vertices[0].y + ht;
				this.vertices[2].y = this.vertices[3].y;
			} else {
				this.vertices[0].y = this.vertices[3].y - ht;
				this.vertices[1].y = this.vertices[0].y;
			}
			
			this._updateBounds();
		}

		get leftSegment() {
			return this.segments[3];
		}

		get rightSegment() {
			return this.segments[1];
		}

		get topSegment() {
			return this.segments[0];
		}

		get bottomSegment() {
			return this.segments[2];
		}
	}

	class CirclePath extends Path {
		
		constructor(args) {
			super(args);
			
			this.type = ItemType.Circle;
			this.closed = true;
			this.attrs["x"] = "x" in args ? args.x : 0;
			this.attrs["y"] = "y" in args ? args.y : 0;
			this.attrs["radius"] = "radius" in args ? args.radius : 100;
			// this.attrs["x"] = args.hasOwnProperty("x") ? args.x : 0;
			// this.attrs["y"] = args.hasOwnProperty("y") ? args.y : 0;
			// this.attrs["radius"] = args.hasOwnProperty("radius") ? args.radius : 100;
		}

		get radius() {
			return this.attrs["radius"];
		}

		get x() {
			return this.attrs["x"];
		}

		get y() {
			return this.attrs["y"]; //this.attrs["y"];
		}

		get area() {
			return Math.PI * Math.pow(this.radius, 2);
		}

		set x(v) {
			this.attrs["x"] = v;
			this._updateBounds();
		}

		set y(v) {
			this.attrs["y"] = v;
			this._updateBounds();
		}

		set radius(r) {
			this.attrs["radius"] = r;
			this._updateBounds();
		}

		// set width(w) {
		// 	this.attrs["radius"] = w/2;
		// 	this._updateBounds();
		// }

		// set height(h) {
		// 	this.attrs["radius"] = h/2;
		// 	this._updateBounds();
		// }

		resize(w, h, xRef, yRef) {
			let r = Math.min(w, h)/2, diff = r - this.attrs["radius"];
			this.attrs["radius"] = r;
			if (xRef == "right") {
				this.attrs["x"] -= diff;
			} else {
				this.attrs["x"] += diff;
			}
			if (yRef == "top") {
				this.attrs["y"] += diff;
			} else {
				this.attrs["y"] -= diff;
			}
			this._updateBounds();
		}

		_doTranslate(dx, dy) {
			this.attrs["x"] += dx;
			this.attrs["y"] += dy;
			this._updateBounds();
		}

		_updateBounds() {		
			this._bounds = new Rectangle(this.attrs["x"] - this.attrs["radius"], this.attrs["y"] - this.attrs["radius"], this.attrs["radius"] * 2, this.attrs["radius"] * 2);
		}

		copyPropertiesTo(target) {
			super.copyPropertiesTo(target);
			target.attrs["x"] = this.attrs["x"];
			target.attrs["y"] = this.attrs["y"];
			target.attrs["radius"] = this.attrs["radius"];
		}

		getSVGPathData() {
			return ["M", this.x, this.y, "m", -this.radius, ", 0 a", this.radius, ",", this.radius, "0 1,0", this.radius * 2, ",0 a", this.radius, ",", this.radius, "0 1,0", -(this.radius * 2), ",0"].join(" ");
		}

	}

	function bindToSize(encoding){

		encoding._query = function() {
			this.data = [];		
			let field = this.field, items = this.items, aggregator = this.aggregator;
			switch (this.datatable.getFieldType(field)) {
				case DataType.Boolean:
					break;

				case DataType.Date:
					this.data = items.map(d => d.dataScope.getFieldValue(field));
					break;

				case DataType.String:
					break;

				default: //integer or number
					this.data = items.map(d => d.dataScope.aggregateNumericalField(field, aggregator));	
					break;
			}
		};

		encoding._map = function() {
			let items = this.items, data = this.data, channel = this.channel, scale;
			
			scale = createScale(this.scaleType);

			if (this.data.find(d => d < 0) != undefined && (channel == "width" || channel == "height") && items[0].type.indexOf("rect") == 0) {
				this._rectNegativeValues = true;
				scale.domain = [Math.min(...data), Math.max(...data)];
				if (channel == "width") {
					// let left = Math.min(...(items.map(d => d.bounds.left))),
					// 	right = Math.max(...(items.map(d => d.bounds.right)));
					// scale._setRange([0, right - left]);

					//TODO: check if item width has already been encoded with a different field
					//the code below assumes width hasn't been bound to data
					scale._setRange([0, Math.max(...(items.map(d => d.width)))]);
				} else {
					// let top = Math.min(...(items.map(d => d.bounds.top))),
					// 	bottom = Math.max(...(items.map(d => d.bounds.bottom)));
					// scale._setRange([0, bottom - top]);

					//TODO: check if item height has already been encoded with a different field
					//the code below assumes height hasn't been bound to data
					scale._setRange([0, Math.max(...(items.map(d => d.height)))]);
				}
			} else {
				scale.domain = [0, Math.max(...data)];
				let min, max;
				if (channel == "radius" || channel == "outerRadius" || channel == "innerRadius") {
					min = 0;
					max = Math.max(...(items.map(d => d[channel])));
					if (max < 20)	max = 20;
				} else if (channel == "area") {
					min = 0;
					max = Math.max(...(items.map(d => d.bounds.width * d.bounds.height)));
					if (max < 400)	max = 400;
				} else if (channel == "fontSize") {
					min = 2;
					max = Math.max(...(items.map(d => parseFloat(d.styles.fontSize))));
				} else if (channel == "strokeWidth") {
					min = 1;
					max = Math.max(...(items.map(d => parseFloat(d.styles.strokeWidth))));
					if (max == min)
						max = min + 5;
				}  else {
					min = 0;
					max = Math.max(...(items.map(d => d.bounds[channel])));
				}
				if (this.rangeExtent)
					max = min + this.rangeExtent;
				if (this.range) {
					min = this.range[0];
					max = this.range[1];
				}
				scale._setRange([min, max]);
			}

			if (this.scale); else {
				this.scale = scale;
			}

			this.scale._addEncoding(this);
		};

		encoding._apply = function() {
			if (this.channel == "radius" || this.channel == "outerRadius" || this.channel == "innerRadius") {
				for (let i = 0; i < this.items.length; i++) {
					let peer = this.items[i];
					peer[this.channel] = this.scale.map(this.data[i]);
				}
				this.scene._relayoutAncestors(this.anyItem, this.items);
			} else if (this._rectNegativeValues){
				if (this.channel == "width") {
					let base = Math.min(...this.items.map(d => d.bounds.left));
					for (let i = 0; i < this.items.length; i++) {
						let offset, peer = this.items[i], left = peer.leftSegment.vertex1.x, right = peer.rightSegment.vertex1.x;
						if (peer.parent && peer.parent.type == ItemType.Collection) {
							offset = peer.parent.bounds.left;
						} else {
							offset = base;
						}
						peer.rightSegment._doTranslate(offset + this.scale.map(this.data[i]) - right, 0);
						peer.leftSegment._doTranslate(offset + this.scale.map(0) - left, 0);
						peer._updateBounds();
					}
				} else if (this.channel == "height") {
					let base = Math.min(...this.items.map(d => d.bounds.top)) + this.scale.rangeExtent;
					for (let i = 0; i < this.items.length; i++) {
						let offset, peer = this.items[i], top = peer.topSegment.vertex1.y, btm = peer.bottomSegment.vertex1.y;
						if (peer.parent && peer.parent.type === ItemType.Collection) {
							let pp = peer.parent.parent;
							if (pp.type === ItemType.Collection && pp.layout && pp.layout.type === LayoutType.Grid) {
								let idx = pp.children.indexOf(peer.parent);
								offset = pp.layout.cellBounds[idx].bottom;
							} else {
								offset = peer.parent.bounds.bottom;
							}
						} else {
							offset = base;
						}
						peer.topSegment._doTranslate(0, offset - this.scale.map(this.data[i]) - top);
						peer.bottomSegment._doTranslate(0, offset - this.scale.map(0) - btm);
						peer._updateBounds();
					}
				}
			} else if (this.channel == "area") {
				for (let i = 0; i < this.items.length; i++) {
					let peer = this.items[i], s = Math.sqrt(this.scale.map(this.data[i]));
					peer.resize(s, s);
				}
				this.scene._relayoutAncestors(this.anyItem, this.items);
			} else if (this.channel == "fontSize") {
				for (let i = 0; i < this.items.length; i++) {
					let peer = this.items[i], s = this.scale.map(this.data[i]);
					peer.styles.fontSize = s+ "px";
				}
				this.scene._relayoutAncestors(this.anyItem, this.items);
			} else if (this.channel == "strokeWidth") {
				for (let i = 0; i < this.items.length; i++) {
					let peer = this.items[i], s = this.scale.map(this.data[i]);
					peer.styles.strokeWidth = s;
				}
				this.scene._relayoutAncestors(this.anyItem, this.items);
			} else {
				let xRef = 'left', yRef = 'bottom';
				//if glyph item, check alignment
				if (this.anyItem.parent && this.anyItem.parent.type == ItemType.Glyph) {
					let children = this.anyItem.parent.children;
					if (uniqueNumbers(children.map(d=>d.bounds.right)).length == 1)
						xRef = 'right';
					if (uniqueNumbers(children.map(d=>d.bounds.top)).length == 1)
						yRef = 'top';
				}
				
				if (this.anyItem.type === ItemType.Collection && this.anyItem.layout && this.anyItem.layout[this.channel]) {
					//for cases like treemap barchart, where the collection size is bound to data before dividing
					for (let i = 0; i < this.items.length; i++) {
						let peer = this.items[i], s = this.scale.map(this.data[i]);
						peer.layout[this.channel] = s;
					}
				} else {
					for (let i = 0; i < this.items.length; i++) {
						let peer = this.items[i], s = this.scale.map(this.data[i]);
						let wd = this.channel == "width" ? s : peer.bounds.width,
							ht = this.channel == "height" ? s : peer.bounds.height;
						peer.resize(wd, ht, xRef, yRef);
					}
				}
				
				this.scene._relayoutAncestors(this.anyItem, this.items);
			}
		};

		encoding.run();
		return encoding;
	}

	function bindToPosition(encoding){

		encoding._query = function() {
			this.data = [];
			
			let field = this.field, items = this.items;
			let dataScopes = ((this.anyItem.type == "vertex" || this.anyItem.type == "segment") && !this.anyItem.dataScope) ? 
								items.map(d => d.parent.dataScope) : items.map(d => d.dataScope);

			switch (this.datatable.getFieldType(field)) {
				case DataType.Boolean:
					break;

				case DataType.Date:
					this.data = dataScopes.map(d => d.getFieldValue(field));
					break;

				case DataType.String:
					try {
						this.data = dataScopes.map(d => d.getFieldValue(field));
					} catch (error) {
						throw new Error("Cannot bind " + this.channel + " to " + field + " : " + error);
					}
					break;

				default: //integer or number
					this.data = dataScopes.map(d => d.aggregateNumericalField(field, this.aggregator));
					break;
			}
		};

		encoding._map = function() {
			let channel = this.channel, fieldType = this.datatable.getFieldType(this.field);

			//to be used for determining the range of scale 
			//TODO: need to update cellBounds dynamically for _map() and _apply()
			let extent;
			let layout = getClosestLayout(this.anyItem);
			if (layout && layout.type == LayoutType.Grid) {
				let cellBounds = layout.cellBounds;
				extent = channel == "x" ? cellBounds[0].width : cellBounds[0].height;
			} else {
				let pos = this.items.map(d => d[channel]);
				extent = Math.max(...pos) - Math.min(...pos);
				if (extent < 100) extent = 100;
				else if (extent > 500) extent = 500;
			}
			if (this.rangeExtent)
				extent = this.rangeExtent;

			let min, max, domain, range;
			switch (fieldType) {
				case DataType.Boolean:
					break;

				case DataType.Date:
					min = Math.min(...this.data); 
					max = Math.max(...this.data);
					domain = [min, max];
					if (this.scale) {
						let domainValues = domain.concat(this.scale.domain);
						domain = [Math.min(...domainValues), Math.max(...domainValues)];
						//extent = Math.abs(this.scale.map(domain[0]) - this.scale.map(domain[1]));
						range = this.scale.range;
					} else {
						this.scale = createScale("time");
						this.scale.isFlipped = this._flipScale;
						range = [0, extent];
					}
					break;

				case DataType.String:
					domain = Array.from(new Set(this.data));
					range = [0, extent];
					if (this.scale) {
						let od = this.scale.domain;
						//the following lines preserve the order of values in existing domain
						for (let d of domain) {
							if (od.indexOf(d) < 0)
								od.push(d);
						}
						domain = od;
						//domain = Array.from(new Set(domain.concat(this.scale.domain)));
						range = this.scale.range;
					} else {
						this.scale = createScale("point");
						this.scale.isFlipped = this._flipScale;
						range = [0, extent];
					}
					break;

				default: //integer or number
					min = Math.min(...this.data); 
					max = Math.max(...this.data);
					domain = [min, max];
					
					if (this.scale) {
						//where zero is included depends on the existing scale
						let domainValues = domain.concat(this.scale._scale.domain());
						domain = [Math.min(...domainValues), Math.max(...domainValues)]; //Scale.mergeDomain(domain, this.scale.domain);
						//extent = Math.abs(this.scale.map(domain[0]) - this.scale.map(domain[1]));

						range = this.scale.range;
					} else {
						this.scale = createScale(this.scaleType);
						this.scale.isFlipped = this._flipScale;
						this.scale.includeZero = this._includeZero;
						//domain = this._includeZero ? [0, max] : [min, max];
						range = [0, extent];
					}
					if (domain[0] == domain[1])
						domain[1] = domain[0] * 1.1;
					break;
			}

			this.scale._scale.domain(domain);
			this.scale._setRange(range);

			//TODO: need to adjust according to scale type
			this.scale._addEncoding(this);
		};

		encoding._apply = function() {
			let items = [], channel = this.channel;
			//if the scale is shared across multiple encodings, need to find the offset based on all items using this scale
			//use case: box plot, where lines, rect segments and line vertices share the same scale
			for (let enc of this.scale.encodings)
				items = items.concat(enc.items);
			if (channel == "x") {
				let layout = getClosestLayout(this.anyItem);
				if (layout && layout.type == LayoutType.Grid){
					//do not use scale.offset, use cell bounds
					for (let i = 0; i < this.items.length; i++) {
						let itm = this.items[i], itmCb = getCellBoundsInLayout(itm);
						let dx = itmCb.left + this.scale.map(this.data[i]) - itm[channel],
							dy = 0;
						itm._doTranslate(dx, dy);
						if (itm.type == "vertex" || itm.type == "segment")
							itm.parent._updateBounds();
					}
				} else if (this.anyItem.type == "vertex" || this.anyItem.type == "segment") {
					//TODO: right now using the leftmost mark peer as the baseline, which will not work for cases like bullet chart
					//need to check if marks are part of a glyph, and use the leftmose glyph peer.
					let marks = getParents(this.items);
					if (this.scale.offset === undefined)
						this.scale.offset = Math.min(...marks.map(d => d.bounds.left));
					for (let i = 0; i < this.items.length; i++) {
						let peer = this.items[i];
						let dx = this.scale.offset + this.scale.map(this.data[i]) - peer[channel],
							dy = 0;
						peer._doTranslate(dx, dy);
						peer.parent._updateBounds();
					}
				} else {
					if (this.scale.offset === undefined)
						this.scale.offset = Math.min(...items.map(d => d[channel]));
					for (let i = 0; i < this.items.length; i++) {
						let peer = this.items[i];
						let dx = this.scale.offset + this.scale.map(this.data[i]) - peer[channel],
							dy = 0;
						peer._doTranslate(dx, dy);
					}
				}
				
			} else {//channel y
				let layout = getClosestLayout(this.anyItem);
				if (layout && layout.type == LayoutType.Grid){
					let cellBounds = this.items.map(d => getCellBoundsInLayout(d));
					for (let i = 0; i < this.items.length; i++) {
						let itm = this.items[i];
						let dx = 0,
							dy = cellBounds[i].bottom - this.scale.map(this.data[i]) - itm[channel];
						itm._doTranslate(dx, dy);
						if (itm.type == "vertex" || itm.type == "segment")
							itm.parent._updateBounds();
					}
				} else if (this.anyItem.type == "vertex" || this.anyItem.type == "segment") {
					if (this.scale.offset === undefined)
						this.scale.offset = Math.min(...this.items.map(d => d.y));
					for (let i = 0; i < this.items.length; i++) {
						let peer = this.items[i];
						let dx = 0,
							dy = this.scale.offset + this.scale.rangeExtent - this.scale.map(this.data[i]) - peer[channel];
						peer._doTranslate(dx, dy);
						peer.parent._updateBounds();
					}
				} else {
					if (this.scale.offset === undefined)
						this.scale.offset = Math.min(...items.map(d => d.bounds.y));
					for (let i = 0; i < this.items.length; i++) {
						let peer = this.items[i];
						let dx = 0,
							dy = this.scale.offset + this.scale.rangeExtent - this.scale.map(this.data[i]) - peer[channel];
						peer._doTranslate(dx, dy);
					}
				}
			}
		};

		encoding.run();
		return encoding;
	}

	function bindToRadialDistance(encoding){

	    encoding._query = function() {
	        this.data = [];
			
			let field = this.field, items = this.items;
			let dataScopes = ((this.anyItem.type == "vertex" || this.anyItem.type == "segment") && !this.anyItem.dataScope) ? 
								items.map(d => d.parent.dataScope) : items.map(d => d.dataScope);

			switch (this.datatable.getFieldType(field)) {
				case DataType.Boolean:
					break;

				case DataType.Date:
					this.data = dataScopes.map(d => d.getFieldValue(field));
					break;

				case DataType.String:
					try {
						this.data = dataScopes.map(d => d.getFieldValue(field));
					} catch (error) {
						throw new Error("Cannot bind " + this.channel + " to " + field + " : " + error);
					}
					break;

				default: //integer or number
					this.data = dataScopes.map(d => d.aggregateNumericalField(field, this.aggregator));
					break;
			}
	    };


	    encoding._map = function() {
			let data = this.data;
			if (!this.scale){
				this.scale = createScale("linear");
				this.scale.domain = [0, Math.max(...data)];
				this.scale._setRange([0, this.anyItem.parent.radius]);
				
			}
			this.scale._addEncoding(this);
		};

	    encoding._apply = function() {
			for (let i = 0; i < this.items.length; i++) {
				let peer = this.items[i], rd = this.scale.map(this.data[i]);
	            let coords = polar2Cartesian(this.anyItem.parent.x, this.anyItem.parent.y, rd, peer.polarAngle);
	            peer.x = coords[0];
	            peer.y = coords[1];
			}

			//relayout if needed
			this.scene._relayoutAncestors(this.anyItem, this.items);
		};

	    encoding.run();
		return encoding;
	}

	function bindToColor(encoding){

		encoding._query = function() {
			this.data = [];
			
			let field = this.field, items = this.items;
			let dataScopes = ((this.anyItem.type == "vertex" || this.anyItem.type == "segment") && !this.anyItem.dataScope) ? 
								items.map(d => d.parent.dataScope) : items.map(d => d.dataScope);

			switch (this.datatable.getFieldType(field)) {
				case DataType.Boolean:
					this.data = [true, false];
					break;

				case DataType.Date:
					this.data = dataScopes.map(d => d.getFieldValue(field));
					break;

				case DataType.String:
					try {
						this.data = dataScopes.map(d => d.getFieldValue(field));
					} catch (error) {
						throw new Error("Cannot bind " + this.channel + " to " + field + " : " + error);
					}
					break;

				default: //integer or number
					this.data = dataScopes.map(d => d.aggregateNumericalField(field, this.aggregator));
					break;
			}
		};

		encoding._map = function() {
			switch (this.datatable.getFieldType(this.field)) {
				case DataType.Date:
					break;

				case DataType.Boolean:
					if (!this.scale) {
						this.scale = createScale("ordinalColor");
						this.scale.domain = this.data;
						if (this._mapping) {
							let range = this.scale.domain.map(d => d in this._mapping ? this._mapping[d] : "black");
							this.scale._scale.range(range);
						}
					} 
					break;
				case DataType.String:
					if (this.scale) {
						this.scale.domain = Array.from(new Set(this.scale.domain.concat(this.data)));
					} else {
						this.scale = createScale("ordinalColor", this._scheme ? this._scheme: "schemeCategory10");
						this.scale.domain = this.data;
						if (this._mapping) {
							let range = this.scale.domain.map(d => d in this._mapping ? this._mapping[d] : "black");
							this.scale._scale.range(range);
						}
					}
					break;

				default: //integer or number
					if (this.scale) {
						if (!this._mapping) {
							let values = this.scale.domain.concat(this.data);
							this.scale.domain = [Math.min(...values), Math.max(...values)];
						}
					} else {
						if (this._mapping) {
							this.scale = createScale("linear", this._mapping);
						} else {
							let min = Math.min(...this.data), max = Math.max(...this.data), 
								abs = Math.max(Math.abs(min), Math.abs(max)), scheme;
							if (min < 0 && max > 0) {
								scheme = "interpolatePuOr";
								min = -abs;
								max = abs;
								this.scale = createScale("divergingColor", this._scheme ? this._scheme: scheme);
							} else {
								scheme = "interpolateTurbo";
								this.scale = createScale("sequentialColor", this._scheme ? this._scheme: scheme);
							}
							this.scale.domain = [min, max];
						}
					}
					break;
			}
			this.scale._addEncoding(this);
		};

		encoding._apply = function() {
			for (let i = 0; i < this.items.length; i++) {
				let peer = this.items[i], value = this.scale.map(this.data[i]);
				if (peer.type == "vertex" || peer.type == "segment")
					peer[this.channel] = value;
				else
					peer.styles[this.channel] = value;
				if (peer.vertices && this.channel == "strokeColor") {
					peer.vertices.forEach(d => d.fillColor = value);
				}
			}
		};

		encoding.run();
		return encoding;
	}

	function bindToAngle(encoding){

		encoding._query = function() {
			this.data = [];
			this.id2data = {};

			let field = this.field, items = this.items;

			switch (this.datatable.getFieldType(field)) {
				case DataType.Boolean:
					break;

				case DataType.Date:
					this.data = items.map(d => d.dataScope.getFieldValue(field));
					break;

				case DataType.String:
					break;

				default: //integer or number
					this.data = items.map(d => d.dataScope.aggregateNumericalField(field, this.aggregator));
					break;
			}
			for (let i = 0; i < this.data.length; i++) {
				this.id2data[items[i].id] = this.data[i];
			}
		};

		encoding._map = function() {
			if (this.scale) ; else {
				this.scale = createScale("linear");
				this.scale.domain = this.datatable.tree ? [0, Math.max(...this.data)] : [0, this.data.reduce((a, d) => a + d, 0)];
				this.scale._setRange([0, 360]);
				this.scale._addEncoding(this);
			}
		};

		encoding._apply = function() {
			let peer;
			for (let i = 0; i < this.items.length; i++) {
				peer = this.items[i];
				if (peer.type === ItemType.Arc || peer.type === ItemType.Pie) {
					peer.adjustAngle(peer.startAngle, normalizeAngle(peer.startAngle + this.scale.map(this.data[i])));
				}
			}
			this.scene._relayoutAncestors(this.anyItem, this.items);
		};

		encoding.run();
		return encoding;
	}

	function bindToArea(encoding){

		encoding._query = function() {
			this.data = [];
	        // store area peers
	        this.areas = getPeers(this.items[0], this.scene);
	        let areaNum = this.areas.length;
			this.areaNum = areaNum;
	        // this.items are all the areas, we need to keep them for saving to json
			// here we populate the vertices to be used for binding
			this._vertices = [];
			this.indicator = [];
			for (let area of this.areas) {
				for (let i=0; i < area.vertices.length; i++) {
					this._vertices.push(area.vertices[i]);
					if (i < area.vertices.length / 2) {
						this.indicator.push(1);
					} else {
						this.indicator.push(0);
					}
				}
			}
			let field = this.field, items = this._vertices;
			let dataScopes = ((this.anyItem.type == "vertex" || this.anyItem.type == "segment") && !this.anyItem.dataScope) ? 
								items.map(d => d.parent.dataScope) : items.map(d => d.dataScope);
			switch (this.datatable.getFieldType(field)) {
				case DataType.Boolean:
					break;

				case DataType.Date:
					this.data = dataScopes.map(d => d.getFieldValue(field));
					break;

				case DataType.String:
					this.data = dataScopes.map((d, i) => this.indicator[i] == 0 ? 0 :  d.aggregateNumericalField(field, this.aggregator));
					break;

				default: //integer or number
					if (this.channel == "x" || this.channel == "y") {
						this.data = dataScopes.map(d => d._field2value[field]);
					} else {
						this.data = dataScopes.map((d, i) => this.indicator[i] == 0 ? 0 :  d.aggregateNumericalField(field, this.aggregator));
					}
					break;
			}
		};

		encoding._map = function() {
			let fieldType = this.datatable.getFieldType(this.field);

			let scale, min, max;
			switch (fieldType) {
				case DataType.Boolean:
					break;

				case DataType.Date:
					scale = createScale("time");
					min = Math.min(...this.data); 
					max = Math.max(...this.data);
					scale.domain = [min, max];
					break;

				case DataType.String:
					scale = createScale("linear");
					min = Math.min(...this.data); 
					max = Math.max(...this.data);
					scale.domain = (this._includeZero || min < 0)? [0, max] : [min, max];	
					break;

				default: //integer or number
					scale = createScale("linear");
					min = Math.min(...this.data); 
					max = Math.max(...this.data);
					//scale.domain = (this._includeZero || min < 0)? [0, max] : [min, max];
					scale.domain = (min < 0)? [0, max] : [min, max];
					break;
			}

			//to be used for determining the range of scale 
			//TODO: need to update cellBounds dynamically for _map() and _apply()
			let orientation = CheckAreaOrien(this.areas[0]);
			let extent;
			let layout = getClosestLayout(this.anyItem);
			if (layout) {
				let cellBounds = layout.cellBounds;
				if (this.channel == "width" || this.channel == "height") {
					extent = orientation == Orientation.Vertical ? cellBounds[0].width : cellBounds[0].height;
				} else {
					extent = orientation == Orientation.Vertical ? cellBounds[0].height : cellBounds[0].width;
				}
				// if (layout.type === LayoutType.Stack) {
				// 	if (orientation === Orientation.Horizontal && this.channel === "height")
				// 		extent /= this.areas.length;
				// 	else if (orientation === Orientation.Vertical && this.channel === "width")
				// 		extent /= this.areas.length;
				// }
			} else {
				if (this.channel == "width" || this.channel == "x") {
					let pos = this._vertices.map(d => d.x);
					extent = Math.max(...pos) - Math.min(...pos);
				} else {
					let pos = this._vertices.map(d => d.y);
					extent = Math.max(...pos) - Math.min(...pos);
				}
			}

			if (min < 0) {
				scale._scale.domain([min, max]);
				//TODO: need to adjust according to scale type
				scale._setRange([0, extent]);
			} else {
				scale._setRange([0, extent]);
			}

			if (this.scale) {
				this.scale._merge(scale);
			} else {
				this.scale = scale;
			}
			
			this.scale._addEncoding(this);
		};

		encoding._apply = function() {
			let items = [], channel = this.channel;
			for (let enc of this.scale.encodings)
				items = items.concat(enc.items);
			let ao = this.areas[0].orientation;
			if (channel === "width" || channel === "height") {
				let closestLayout = getClosestLayout(this.areas[0]);
				if (closestLayout) {
					let vidx = 0;
					for (let area of this.areas) {
						let cb = getCellBoundsInLayout(area),
							layout = getClosestLayout(area);
						for (let i = 0; i < area.vertices.length; i++) {
							let v = this._vertices[i + vidx],
								dx, dy;
							if (ao === Orientation.Horizontal) {
								dx = 0;
								if (layout.type === LayoutType.Stack) {
									dy = cb.bottom - this.scale.map(this.data[i + vidx]) - v.y;
								} else if (layout.type === LayoutType.Grid) {
									let baseline = area.baseline;
									switch (baseline) {
										case "top":
											dy = cb.top + this.scale.map(this.data[i + vidx]) - v.y;
											break;
										case "bottom":
											dy = cb.bottom - this.scale.map(this.data[i + vidx]) - v.y;
											break;
										case "middle": {
											let j = area.vertices.length - 1 - i,
												dist = Math.abs(this.scale.map(this.data[i + vidx]) - this.scale.map(this.data[j + vidx]));
											dy = this.indicator[i + vidx] ? cb.middle - dist/2 - v.y : cb.middle + dist/2 - v.y;
											break;
										}
									}
								} else {
									dy = 0;
								}
							} else {
								dy = 0;
								if (layout.type === LayoutType.Stack) {
									dx = cb.left + this.scale.map(this.data[i + vidx]) - v.x;
								} else if (layout.type === LayoutType.Grid) {
									let baseline = area.baseline;
									switch (baseline) {
										case "left":
											dx = cb.left + this.scale.map(this.data[i + vidx]) - v.x;
											break;
										case "right":
											dx = cb.right - this.scale.map(this.data[i + vidx]) - v.x;
											break;
										case "center": {
											let j = area.vertices.length - 1 - i,
												dist = Math.abs(this.scale.map(this.data[i + vidx]) - this.scale.map(this.data[j + vidx]));
											dx = this.indicator[i + vidx] ? cb.center - dist/2 - v.x : cb.center + dist/2 - v.x;
											break;
										}
									}
								} else {
									dx = 0;
								}
							}
							v._doTranslate(dx, dy);		
						}
						vidx += area.vertices.length;
					}
				} else {
					let baseline_check = this.areas[0].baseline == "center" || this.areas[0].baseline == "middle";
					let marks = getParents(this._vertices);
					let offset = ao == Orientation.Vertical ? this.areas[0].baseline !== Alignment.Right ? Math.min(...marks.map(d => d.bounds.left)) : Math.max(...marks.map(d => d.bounds.right)) : this.areas[0].baseline != Alignment.Top ? Math.max(...marks.map(d => d.bounds.bottom)) : Math.min(...marks.map(d => d.bounds.top));
					for (let i = 0; i < this._vertices.length; i++) {
						let peer = this._vertices[i];
						let dx = ao == Orientation.Vertical ? this.areas[0].baseline !== Alignment.Right ? offset + this.scale.map(this.data[i]) - peer.x : offset - this.scale.map(this.data[i]) - peer.x : 0,
							dy = ao == Orientation.Vertical ? 0 : this.areas[0].baseline != Alignment.Top ? offset - this.scale.map(this.data[i]) - peer.y : offset + this.scale.map(this.data[i]) - peer.y;
						peer._doTranslate(dx, dy);
					}
					if (baseline_check == true) {
						//TODO: handle cases where each area have different number of vertices
						let VNum = this._vertices.length / this.areaNum;
						let marks = getParents(this._vertices);
						let offset = ao == Orientation.Vertical ? Math.min(...marks.map(d => d.bounds.x)) : Math.max(...marks.map(d => d.bounds.y));
						for (let j = 0; j < this.areaNum; j++) {
							for (let i = 0; i < VNum / 2; i++) {
								let Vid1 = j * VNum + i, Vid2 = (j + 1) * VNum - i - 1;
								let peer1 = this._vertices[Vid1], peer2 = this._vertices[Vid2];
								let height = ao == Orientation.Vertical ? peer1.x-peer2.x : peer2.y-peer1.y;
								let dx1 =  ao == Orientation.Vertical ? offset + height / 2 - peer1.x : 0,
									dy1 =  ao == Orientation.Vertical ? 0 : offset + height / 2 - peer1.y;
								let dx2 =  ao == Orientation.Vertical ? offset - height / 2 - peer2.x : 0,
									dy2 =  ao == Orientation.Vertical ? 0 : offset - height / 2 - peer2.y;
								peer1._doTranslate(dx1, dy1);
								peer2._doTranslate(dx2, dy2);
							}
						}
					}
				}
			} else { //x or y
				let layout = getClosestLayout(this.anyItem);
				if (layout) {
					let marks = getParents(this._vertices);
					if (this.scale.offset === undefined)
						this.scale.offset = ao == Orientation.Horizontal ? Math.min(...marks.map(d => d.bounds.left)) : Math.max(...marks.map(d => d.bounds.top));
					for (let i = 0; i < this._vertices.length; i++) {
						let peer = this._vertices[i], perrCb = getCellBoundsInLayout(peer);
						let dx =  ao == Orientation.Vertical ? 0 : perrCb.left + this.scale.map(this.data[i]) - peer.x,
							dy =  ao == Orientation.Vertical ? perrCb.bottom - this.scale.map(this.data[i]) - peer.y : 0;
						peer._doTranslate(dx, dy);
					}
				} else {
					let marks = getParents(this._vertices);
					if (this.scale.offset === undefined)
						this.scale.offset = ao == Orientation.Horizontal ? Math.min(...marks.map(d => d.bounds.left)) : Math.max(...marks.map(d => d.bounds.top));
					for (let i = 0; i < this._vertices.length; i++) {
						let peer = this._vertices[i];
						let dx = ao == Orientation.Horizontal ? this.scale.offset + this.scale.map(this.data[i]) - peer.x : 0,
							dy = ao == Orientation.Horizontal ? 0 : this.scale.offset + this.scale.rangeExtent - this.scale.map(this.data[i]) - peer.y;
						peer._doTranslate(dx, dy);
					}	
				}
			}

			for (let area of this.areas) {
	            area._updateBounds();
	        }
			if (channel == "width" || channel == "height") {
				this.scene._relayoutAncestors(this.areas[0], this.areas);
			}
		};

		encoding.run();
		return encoding;
	}

	function bindToText(encoding){

		encoding._query = function() {
			this.data = [];
			
			let field, items = this.items, dt;
			if (this.field.startsWith("parent.") || this.field.startsWith("child.")) {
				dt = this.datatable.tree.nodeTable;
				field = this.field.split(".")[1];
				let s = this.field.split(".")[0];
				let nodeIds = items.map(d => d.dataScope).map(d => d.getFieldValue(s));
				if (dt.getFieldType(field) == DataType.Integer || dt.getFieldType(field) == DataType.Number)
					this.data = nodeIds.map(d => (new DataScope(dt)).cross(nodeId, d).aggregateNumericalField(field));
				else
					this.data = nodeIds.map(d => (new DataScope(dt)).cross(nodeId, d).getFieldValue(field));
			} else {
				dt = this.datatable;
				field = this.field;
				if (dt.getFieldType(field) == DataType.Integer || dt.getFieldType(field) == DataType.Number)
					this.data = items.map(d => d.dataScope.aggregateNumericalField(field, this.aggregator));
				else
					this.data = items.map(d => d.dataScope.getFieldValue(field));
			}
		};

		encoding._map = function() {
			if (this.scale) ; else {
				switch (this.datatable.getFieldType(this.field)) {
					case DataType.Boolean:
						break;

					case DataType.Date:
						break;

					case DataType.String:
					default: //integer or number
						this.scale = createScale("ordinal");
						this.scale.domain = [...new Set(this.data)];
	                    this.scale._scale.range(this.scale.domain.map(d => d + ""));
						break;
				}
			}
		};

		encoding._apply = function() {
			for (let i = 0; i < this.items.length; i++) {
				let peer = this.items[i], value = this.scale.map(this.data[i]);
				peer.text = value;
			}
		};

		encoding.run();
		return encoding;
	}

	class Encoding {

		constructor(items, scene, channel, field, args) {
			this.items = items;
			this.anyItem = this.items[0];
			this.scene = scene;
			this.channel = channel;
			this.field = field;
			this._aggregator = args.aggregator;
			this.datatable = args.datatable;
			this.scale = args.scale;
			//flipScale, scale type and includeZero will be ignored if reusing a scale
			//these should be considered properties of a scale, not encoding
			//same for scheme and mapping
			if (this.scale) {
				this._flipScale = this.scale.isFlipped;
				this.scaleType = this.scale.type;
				this._includeZero = this.scale.includeZero;
			} else {
				this._flipScale = args.flipScale;
				this.scaleType = args.scaleType;
				this._includeZero = args.includeZero;
			}
			this._mapping = args.mapping;
			this.rangeExtent = args.rangeExtent;
			this._scheme = args.scheme;
			this.range = args.range;

			if (this.channel == "angle") {
				this.startAngle = "startAngle" in args ? args.startAngle : 90;
				// this.angleDirection = "angleDirection" in args ? args.angleDirection : "clockwise";
			}

			//get the data needed for the mapping
			this._query = undefined;

			//construct/modify scales
			this._map = undefined;

			//apply mapping
			this._apply = undefined;
		}

		get id() {
			return ["enc", getEncodingKey(this.anyItem), this.channel, this.field].join("-");
		}

		set aggregator(a) {
			this._aggregator = a;
			this.scale = undefined;
			this.run();
		}

		get aggregator() {
			return this._aggregator;
		}

		toJSON() {
			let json = {};
			json.anyItem = this.anyItem.id;
			json.items = this.items.map(d => d.id);
			if (this.data)
				json.data = this.data;
			if (this._rectNegativeValues)
				json._rectNegativeValues = true;
			json.args = {};
			json.args.channel = this.channel;
			json.args.field = this.field;
			json.args.aggregator = this.aggregator;
			json.args.datatable = this.datatable.id;
			json.args.scale = this.scale.id;
			//json.args.includeZero = this._includeZero;
			//json.args.flip = this.flip;
			//json.args.mapping = this.mapping;
			json.args.rangeExtent = this.rangeExtent;
			//json.args.scheme = this.scheme;
			json.args.scaleType = this.scaleType;
			json.args.range = this.range;

			if (this.channel == "angle") {
				json.args.startAngle = this.startAngle;
				//json.args.angleDirection = this.angleDirection;
			}

			return json;
		}

		run() {
			this._query();
			this._map();
			this._apply();
		}

		get dataTable() {
			return this.datatable;
		}

		//optional itm specifies which scale range to get in the case of small multiples
		getScaleRange(itm) {
			let item = itm ? itm : this.anyItem;
			if (item.type == ItemType.Area) {
				let AreaOrientation = CheckAreaOrien(item);
				let layout = getClosestLayout(item);
				let alignment;
				if (layout) {
					if (AreaOrientation == Orientation.Vertical) {
						alignment = layout.horzCellAlignment === Alignment.Left;
					} else {
						alignment = layout.vertCellAlignment === Alignment.Bottom;
					}
					// alignment = AreaOrientation == Orientation.Vertical ? 
					// 				(layout.type == LayoutType.Stack ? 
					// 					layout._horzCellAlignment == Alignment.Left : layout._cellHorzAlignment == Alignment.Left) 
					// 				: (layout.type == LayoutType.Stack ? layout._vertCellAlignment == Alignment.Bottom : layout._cellVertAlignment == Alignment.Bottom)
				}
				else {
					alignment = AreaOrientation == Orientation.Vertical ? item.baseline == Alignment.Left : item.baseline == Alignment.Bottom;
				}
				// let DomainToBaseline = this.scale.domain[1] > this.scale.domain[0] ? "default" : "opposite"; // controlling the alignment for the axis and the chart
				let cb = getCellBoundsInGridLayout(item);
				if (cb) {
					switch (this.channel) {
						case "x":
							return [cb.left, cb.left + this.scale.rangeExtent];
						case "width":
							return alignment ? [cb.left, cb.left + this.scale.rangeExtent] : [cb.right, cb.right - this.scale.rangeExtent];
						case "y":
							return [cb.bottom, cb.bottom - this.scale.rangeExtent];
						case "height":
							return alignment ? [cb.bottom, cb.bottom - this.scale.rangeExtent] : [cb.top, cb.top + this.scale.rangeExtent];
					}
				} 
				if (AreaOrientation == Orientation.Horizontal){
					switch (this.channel) {
						case "width":
						case "height": {
							let vertices = getPeers(item.firstVertex, this.scene);
							let offset = alignment ? Math.max(...vertices.map(d => d["y"])) : Math.min(...vertices.map(d => d["y"]));
							return alignment ? [offset, offset - this.scale.rangeExtent] : [offset + this.scale.rangeExtent, offset];
						}
						case "x":
						case "y": {
							let vertices = getPeers(item.firstVertex, this.scene);
							let offset = Math.min(...vertices.map(d => d["x"]));
							return [offset, offset + this.scale.rangeExtent];
						}
					}
				} else if (AreaOrientation == Orientation.Vertical){
					switch (this.channel) {	
						case "x":
						case "y": {
							let vertices = getPeers(item.firstVertex, this.scene);
							let offset = Math.max(...vertices.map(d => d["y"]));
							return [offset, offset - this.scale.rangeExtent];
						}
						case "height":
						case "width": {
							let vertices = getPeers(item.firstVertex, this.scene);
							let offset = alignment ? Math.min(...vertices.map(d => d["x"])) : Math.max(...vertices.map(d => d["x"]));
							return alignment ? [offset, offset + this.scale.rangeExtent] : [offset - this.scale.rangeExtent, offset];
						}
					}
				}
			} else if (this.channel == "x") {
				let layout = getClosestLayout(item);
				if (layout && layout.type == LayoutType.Grid){
					let cellBounds = layout.cellBounds;
					let parentPeers = item.parent.parent.children;
					let idx = parentPeers.findIndex(d => item.parent == d || item.parent.parent == d );
					return [cellBounds[idx].left, cellBounds[idx].left + this.scale.rangeExtent];
				} else if (item.type == "vertex" || item.type == "segment") {
					let offset = this.scale.offset;
					return [offset, offset + this.scale.rangeExtent];
				} else {
					let offset = this.scale.offset;
					return [offset, offset + this.scale.rangeExtent];
				}
				
			} else if (this.channel == "y") {
				let layout = getClosestLayout(item);
				if (layout && layout.type == LayoutType.Grid){
					let cellBounds = layout.cellBounds;
					let parentPeers = item.parent.parent.children;
					let idx = parentPeers.findIndex(d => item.parent == d || item.parent.parent == d );
					return [cellBounds[idx].bottom, cellBounds[idx].bottom - this.scale.rangeExtent];
				} else if (item.type == "vertex" || item.type == "segment") {
					let offset = this.scale.offset;
					return [offset+ this.scale.rangeExtent, offset];
				} else {
					let offset = this.scale.offset;
					return [offset+ this.scale.rangeExtent, offset];
				}

			} else if (this.channel == "width") {
				let layout = getTopLevelLayout(item, "grid");
				if (layout) {
					let cellBounds = layout.cellBounds;
					let parentPeers = item.parent.parent.children;
					let idx = parentPeers.findIndex(d => item.parent == d || item.parent.parent == d );
					// return [cellBounds[idx].left, cellBounds[idx].left + this.scale.rangeExtent];
					return [cellBounds[idx].left, cellBounds[idx].right];
				} else {
					let items = getPeers(item, this.scene);
					let offset = Math.min(...items.map(d => d.bounds.left));
					return [offset, offset + this.scale.rangeExtent];
				}
			} else if (this.channel == "height") {
				let layout = getTopLevelLayout(item, "grid");
				if (layout) {
					let cellBounds = layout.cellBounds;
					let parentPeers = item.parent.parent.children;
					let idx = parentPeers.findIndex(d => item.parent === d || item.parent.parent === d );
					//return [cellBounds[idx].bottom, cellBounds[idx].bottom - this.scale.rangeExtent];
					//do not use rangeExtent because of possible stacking
					return [cellBounds[idx].bottom, cellBounds[idx].bottom - cellBounds[idx].height];
				} else {
					let items = getPeers(item, this.scene);
					//TODO: handle cases where items are aligned top
					let offset = Math.max(...items.map(d => d.bounds.bottom));
					return [offset, offset - this.scale.rangeExtent];
				}
			} else if (this.channel == "radialDistance") {
				let polygon = item.parent;
				return [polygon.x, polygon.x + this.scale.rangeExtent];
			} else {
				return this.scale.range;
			}
		}

	}

	function bin(table, fields, args) {
		//right now only handles one field
	    let f = fields[0];
	    //TODO: check that can perform kde on f
	    let gf = table.nonNumericFields;

	    //construct groups
	    let g = {};
	    for (let row of table.data){
	        let k = gf.map(d => String(row[d])).join("_");
	        if (!g.hasOwnProperty(k)){
	            g[k] = gf.map(d => row[d]);
	            g[k].push([]);
	        }  
	        g[k][g[k].length -1].push(row[f]);
	    }

	    let newData = [];
	    for (let k in g) {
	        let data = g[k].pop(), 
	            bin = d3__namespace.bin()(data);
	        for (let b of bin) {
	            let o = {};
	            g[k].forEach((d, i) => o[gf[i]] = d);
	            o["x0"] = b.x0;
	            o["x1"] = b.x1;
	            o[f+"_count"] = b.length;
	            newData.push(o);
	        }
	    }

	    let fTypes = {};
	    gf.forEach(d => fTypes[d] = table.getFieldType(d));
	    fTypes["x0"] = DataType.Number;
	    fTypes["x1"] = DataType.Number;
	    fTypes[f+"_count"] = DataType.Number;

	    let dt = new DataTable(newData, table.url, fTypes);
	    dt.sourceDataTable = table;
	    dt.transform = {"type": "bin", "args": fields};
	    return dt;
	}

	function kde(table, fields, args) {
		//right now only handles one field
	    let f = fields[0];
	    //TODO: check that can perform kde on f
	    let gf = table.nonNumericFields;

	    let g = {};
	    for (let row of table.data){
	        let k = gf.map(d => String(row[d])).join("_");
	        if (!(k in g)){
	            g[k] = gf.map(d => row[d]);
	            g[k].push([]);
	        }  
	        g[k][g[k].length -1].push(row[f]);
	    }
	    
	    let min = ("min" in args) ? args.min : table.getFieldSummary(f).min,
	        max = ("max" in args) ? args.max : table.getFieldSummary(f).max;
	    let v = min, thresholds = [];
	    while(v < max) {
	        thresholds.push(v);
	        v += args["interval"];
	    }
	    thresholds.push(v);

	    let newData = [];
	    for (let k in g) {
	        let data = g[k].pop(), 
	            density = _kde(_epanechnikov(args.bandwidth), thresholds, data);
	        for (let t of density) {
	            let o = {};
	            g[k].forEach((d, i) => o[gf[i]] = d);
	            o[f] = t[0];
	            o[f+"_density"] = t[1];
	            newData.push(o);
	        }
	    }

	    let fTypes = {};
	    gf.forEach(d => fTypes[d] = table.getFieldType(d));
	    fTypes[f] = DataType.Number;
	    fTypes[f+"_density"] = DataType.Number;

	    return new DataTable(newData, table.url, fTypes);
	}

	function _kde(kernel, thresholds, data) {
	    return thresholds.map(t => [t, d3__namespace.mean(data, d => kernel(t - d))]);
	}

	function _epanechnikov(bandwidth) {
	    return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
	}

	function sort$1(table, fields, args) {
	    table.data.sort((a,b) => compareRow(a,b, fields));
	    table.summarize();
	}

	function compareRow(row1, row2, fields, fieldTypes){
	    for (let f of fields){
	        if (row1[f] < row2[f])
	            return -1;
	        else if (row1[f] > row2[f])
	            return 1;
	    }
	    return 0;
	}

	function filter$1(table, predicates) {
	    let data = [];
	    for (let row of table.data){
	        let include = true;
	        for (let p of predicates){
	            if (!satisfy(row, p)){
	                include = false;
	                break;
	            }
	        }
	        if (include)
	            data.push(row);
	    }
	    let dt = new DataTable(data, table.url);
	    dt.sourceDataTable = table;
	    dt.transform = {"type": "filter", "args": predicates};
	    return dt;
	}

	function satisfy(row, p){
	    if ("field" in p) {
	        let f = p["field"];
	        if ("value" in p)
	            return row[f] == p["value"];
	        else if ("range" in p)
	            return row[f] >= p["range"][0] && row[f] <= p["range"][1];
	        else if ("values" in p)
	            return p["values"].indexOf(row[f]) >= 0;
	    } else if ("fields" in p) {
	        let f1 = p["fields"][0], f2 = p["fields"][1],
	            v1 = row[f1], v2 = row[f2];
	        switch (p["operator"]) {
				case "==":
					return v1 == v2;
				case ">":
					return v1 > v2;
				case ">=":
					return v1 >= v2;
				case "<":
					return v1 < v2;
				case "<=":
					return v1 <= v2;
			}
	        return false;
	    }
	}

	class DataTable {

		constructor(data, url, fTypes) {	
			this.url = url;	
			//this.name = _getFileName(url);
			this.id = ItemType.DataTable + ItemCounter[ItemType.DataTable]++;
			this.data = data;
			this.rawData = JSON.parse(JSON.stringify(data));
			//remember the original date values after parsing them
			this._dateMap = new Map();
			this._fields = Object.keys(this.data[0]);
			this._newField = 0;
			if (fTypes) {
				this._fieldTypes = fTypes;
			} else {
				this._fieldTypes = {};
				for (let f of this._fields) {
					this._fieldTypes[f] = _inferType(this.data.map(d => d[f]));
					if (f.toLowerCase() == "year" && this._fieldTypes[f] == DataType.Integer)
						this._fieldTypes[f] = DataType.Date;
				}
			}
			//fix null values, cast type and summarize
			this._validate(this.data, this._fieldTypes);

			this._fieldSummaries = {};
			for (let f of this._fields) {
				this._fieldSummaries[f] = _summarize(this.data.map(d => d[f]), this._fieldTypes[f]);
			}

			//add row id
			if (this._fields.indexOf(atlas_rowId) < 0) {
				this._addField(atlas_rowId, DataType.String, this.data.map((d, i) => "r" + i));
			}
		}

		get name () {
			if (this.url)
				return _getFileName(this.url);
			else
				return this.id;
		}

		//only tracking one transform away
		set sourceDataTable(dt) {
			this._sourceDataTable = dt;
		}

		get sourceDataTable() {
			return this._sourceDataTable;
		}

		getEncodableFields(channel) {
			switch(channel) {
				case "x":
				case "y":
				case "width":
				case "height":
				case "radius":
				case "fillColor":
				case "strokeColor":
					return this.numericFields.concat(this.nonNumericFields);
				case "area":
				case "strokeWidth":
				default:
					return this.numericFields;
				
			}
		}

		//transform from the source table to this table
		// set transform(t) {
		// 	this._transform = t;
		// }

		// get transform() {
		// 	return this._transform;
		// }

		toJSON(){
			let json = {};
			json.data = this.rawData;
			json.fieldTypes = this._fieldTypes;
			json.url = this.url;
			json.id = this.id;
			json.sourceDataTable = this._sourceDataTable;
			json.transform = this._transform;
			json.dateMap = {};
			return json;
		}

		transformField(f, callback, newf) {
			let values = this.data.map(d => callback(d[f]));
			let type = _inferType(values);
			let name = newf ? newf : Date.now() + "_field" + this._newField++;
			this._addField(name, type, values);
			return name;
		}

		setValueOrder(field, values) {
			this._fieldSummaries[field].unique = values;
		}

		_addField(name, type, values) {
			this.data.forEach( (d, i) => d[name] = values[i]);
			this._fieldTypes[name] = type;
			this._fields.push(name);
			this._fieldSummaries[name] = _summarize(values, type);
		}

		getFieldType(f) {
			return this._fieldTypes[f];
		}

		get fields() {
			return this._fields;
		}

		getFieldSummary(f) {
			return this._fieldSummaries[f];
		}

		getFieldValues(f) {
			return this.data.map(d => d[f]);
		}

		getUniqueFieldValues(f) {
			return this._fieldSummaries[f].unique;
		}

		getRowCount() {
			return this.data.length;
		}

		hasField(f) {
			return this._fields.indexOf(f) >= 0;
		}

		//date values are parsed and stored as number of milliseconds
		parseFieldAsDate(field, format) {
			//TODO: validate field and format
			let parse = d3__namespace.timeParse(format);
			for (let row of this.data) {
				let v = row[field];
				if (v == null || v == undefined) {
					v = "";
					row[field] = (new Date(1899, 11, 31)).getTime();
				} else {
					row[field] = parse(v).getTime();
				}
				this._dateMap.set(row[field], v);
			}
			this._fieldTypes[field] = DataType.Date;
			this._fieldSummaries[field] = _summarize(this.data.map(d => d[field]), DataType.Date);
		}

		//TODO: need to return the true raw value from the input file
		getRawValue(col, v) {
			if (this.getFieldType(col) === DataType.Date)
				return this._dateMap.get(v).toString();
			else
				return v;
		}

		static get RowID() {
			return atlas_rowId;
		}

		get nonNumericFields() {
			let r = [];
			for (let f in this._fieldTypes) {
				if (this._fieldTypes[f] != DataType.Number && this._fieldTypes[f] != DataType.Integer && f != DataTable.RowID) {
					r.push(f);
				}
			}
			return r;
		}

		get numericFields() {
			let r = [];
			for (let f in this._fieldTypes) {
				if ((this._fieldTypes[f] === DataType.Number || this._fieldTypes[f] === DataType.Integer) && f != DataTable.RowID) {
					r.push(f);
				}
			}
			return r;
		}

		getFieldsByType(t) {
			let r = [];
			for (let f in this._fieldTypes) {
				if ((this._fieldTypes[f] === t) && f != DataTable.RowID) {
					r.push(f);
				}
			}
			return r;
		}

		transform(type, fields, params) {
			let args = params ? params : {};
			switch (type) {
				case "kde":
					return kde(this, fields, args);
				case "bin":
					return bin(this, fields);
				case "sort":
					return sort$1(this, fields);
				case "filter":
					return filter$1(this, fields);
			}
		}

		summarize(){
			for (let f of this._fields) {
				this._fieldSummaries[f] = _summarize(this.data.map(d => d[f]), this._fieldTypes[f]);
			}
		}

		_validate(data, fieldTypes) {
			//date values are parsed and stored as number of milliseconds
			for (let row of data) {
				for (let f in fieldTypes) {
					let type = fieldTypes[f], v = row[f], realv = undefined;
					if (row[f] == null || row[f] == undefined) {
						switch (type) {
							case DataType.Boolean:
								realv = false;
								break;
							case DataType.Date:
								realv = (new Date(1899, 11, 31)).getTime();
								break;
							case DataType.String:
								realv = "";
								break;
							default:
								realv = 0;
								break;
						}
					} else {
						switch (type) {
							case DataType.Boolean:
								realv = v;
								break;
							case DataType.Date:
								if (Number.isInteger(v)){ //year
									realv = (new Date(v, 0)).getTime();
								} else {
									realv = (new Date(v+"")).getTime();
								}
								this._dateMap.set(realv, v);
								break;
							case DataType.String:
								realv = v.toString();
								break;
							default:
								realv = v;
								break;
						}
					}
					row[f] = realv;
				}
			}
		}
	}

	function _summarize(values, type) {
		var s = {};
		switch (type) {
			case DataType.Boolean:
				s.trueCount = values.filter(d => d).length;
				s.falseCount = values.filter(d => !d).length;
				break;
			case DataType.Date:
				s.min = d3__namespace.min(values);
				s.max = d3__namespace.max(values);
				s.extent = [s.min, s.max];
				s.unique = [...new Set(values)];
				break;
			case DataType.String:
				s.unique = [...new Set(values)];
				break;
			default:
				s.min = d3__namespace.min(values);
				s.max = d3__namespace.max(values);
				s.extent = [s.min, s.max];
				s.mean = d3__namespace.mean(values);
				s.median = d3__namespace.median(values);
				s.unique = [...new Set(values)];
				break;
		}
		return s;
	}

	var isValidType = {
		boolean: function(x) { return x==='true' || x==='false' || x === true || x === false || toString.call(x) == '[object Boolean]'; },
		integer: function(x) { return isValidType.number(x) && (x=+x) === ~~x; },
		number: function(x) { return !isNaN(+x) && toString.call(x) != '[object Date]'; },
		// date: function(x) { return !isNaN(Date.parse(x)); },
		date: function(x) { let d = new Date(x); return d != undefined && !isNaN(d) },
		string: function(x) {return true}
	};

	function _inferType(values) {
		var types = Object.values(DataType);
		for (let i = 0; i < values.length; i++) {
			let v = values[i];
			if (v == null)	continue;
			for (let j = 0; j < types.length; j++) {
				if (!isValidType[types[j]](v)) {
					types.splice(j, 1);
					j -= 1;
				}
			}
			if (types.length == 1)
				return types[0];
		}
		return types[0];
	}

	function _getFileName(url){
		var startIndex = (url.indexOf('\\') >= 0 ? url.lastIndexOf('\\') : url.lastIndexOf('/'));
		var filename = url.substring(startIndex);
		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
		}
		return filename;
	}

	class PointText extends Mark {

	    constructor(args) {
			super(args);
	        this.type = ItemType.PointText;
	        this.attrs["x"] = 0;
	        this.attrs["y"] = 0;
	        if (!("fontSize" in this.styles))
	            this.styles["fontSize"] = "12px";
	        if (!("fontFamily" in this.styles))
	            this.styles["fontFamily"] = "Arial, sans-serif";
	        if (!("fontWeight" in this.styles))
	            this.styles["fontWeight"] = "normal";
	        if (!("fillColor" in this.styles))
	            this.styles["fillColor"] = "black";

	        if (args !== undefined) {
	            if ("x" in args) {
	                this.attrs["x"] = args["x"];
	            }

	            if ("y" in args) {
	                this.attrs["y"] = args["y"];
	            }
	    
	            if ("text" in args) {
	                this.attrs["text"] = args["text"];
	            } else {
	                this.attrs["text"] = "";
	            }

	            if ("anchor" in args) {
	                this.attrs["anchor"] = args["anchor"];
	            } else {
	                this.attrs["anchor"] = ["center", "middle"];
	            }
	        }
	        this._updateBounds();
	    }

	    copyPropertiesTo(target) {
			target.styles = Object.assign({}, this.styles);
			if (this._dataScope)
				target._dataScope = this._dataScope.clone();
			target.x = this.attrs["x"];
	        target.y = this.attrs["y"];
			target.text = this.text;
			target.anchor = [this.anchor[0], this.anchor[1]];
		}

	    get bounds() {
			if (!this._bounds)
				this._updateBounds();
			return this._bounds;
		}

	    set text(text) {
	        this.attrs["text"] = text;
	        this._updateBounds();
	    }

	    get text() {
	        return this.attrs["text"];
	    }

	    _doTranslate(dx, dy) {
			this.attrs["x"] += dx;
	        this.attrs["y"] += dy;
			this._updateBounds();
		}

		_updateBounds() {
	        let size = getTextSize(this.attrs["text"], [this.fontWeight, this.styles["fontSize"], this.fontFamily].join(" "), parseFloat(this.fontSize));
	        let wd = size.width, ht = size.height;
	        let left;
	        switch (this.attrs["anchor"][0]){
	            case "left":
	                left = this.attrs["x"];
	                break;
	            case "right":
	                left = this.attrs["x"] - wd;
	                break;
	            case "center":
	                left = this.attrs["x"] - wd/2;
	                break;
	            default:
	                left = this.attrs["x"];
	                break;
	        }
	        let top;
	        switch (this.attrs["anchor"][1]){
	            case "top":
	                top = this.attrs["y"];
	                break;
	            case "bottom":
	                top = this.attrs["y"] - ht;
	                break;
	            case "middle":
	                top = this.attrs["y"] - ht/2;
	                break;
	        }
			this._bounds = new Rectangle(left, top, wd, ht);
		}

	    get center() {
	        return {x: this.bounds.left + this.bounds.width/2, y: this.bounds.top + this.bounds.height/2};
	    }

	    get x() {
	        return this.attrs["x"];
	    }

	    set x(v){
	        this.attrs["x"] = v;
	        this._updateBounds();
	    }

	    get y() {
	        return this.attrs["y"];
	    }

	    set y(v){
	        this.attrs["y"] = v;
	        this._updateBounds();
	    }

	    get anchor() {
	        return this.attrs["anchor"];
	    }

	    set anchor(a) {
	        this.attrs["anchor"] = a;
	        this._updateBounds();
	    }

	    //return integer
	    get fontSize() {
	        return parseFloat(this.styles["fontSize"]);
	    }

	    set fontSize(f) {
	        if (typeof f === "number")
	            this.styles["fontSize"] = f + "px";
	        else
	            this.styles["fontSize"] = f;
	        this._updateBounds();
	    }

	    get fontWeight() {
	        return this.styles["fontWeight"];
	    }

	    set fontWeight(w) {
	        this.styles["fontWeight"] = w;
	        this._updateBounds();
	    }

	    get fontFamily() {
	        return this.styles["fontFamily"];
	    }

	    set fontFamily(f) {
	        this.styles["fontFamily"] = f;
	        this._updateBounds();
	    }

	    get fillColor() {
			return this.styles["fillColor"];
		}

		set fillColor(c) {
			this.styles["fillColor"] = c;
		}
	}

	class Axis extends Group{

	    constructor(args){
	        super();
	        this.type = ItemType.Axis;
	        this.id = this.type + ItemCounter[this.type]++;

	        this._strokeColor = "strokeColor" in args ? args["strokeColor"] : "#555";
	        this._textColor = "textColor" in args ? args.textColor : "#555";
	        this._fontSize = "fontSize" in args? args.fontSize: "12px";

	        this._tickOffset = "tickOffset" in args ? args["tickOffset"] : 0;
	        this._tickSize = "tickSize" in args ? args["tickSize"] : 5;
	        this._tickAnchor = args.tickAnchor ? args.tickAnchor : "middle";

	        this._tickVisible = "tickVisible" in args ? args["tickVisible"] : true; // &&  !args["tickVisible"] ? "hidden" : "visible";
	        this._pathVisible = "pathVisible" in args ? args["pathVisible"] : true; // && !args["pathVisible"] ? "hidden" : "visible";

	        this._labelOffset = "labelOffset" in args ? args["labelOffset"] : 15;
	        this._labelFormat = "labelFormat" in args ? args["labelFormat"] : "";

	        this._titleOffset = "titleOffset" in args ? args["titleOffset"] : 40;
	        if ("titleAnchor" in args) {
	            this._titleAnchor = args.titleAnchor;
	        } else {
	            if (this.channel == "x" || this.channel == "width"){
	                this._titleAnchor = this._orientation == "top" ? ["center", "bottom"] : ["center", "top"];
	            } else {
	                this._titleAnchor = this._orientation == "left" ? ["right", "middle"] : ["left", "middle"];
	            }
	        }
	        this._rotateYTitle = "rotateTitle" in args && !args.rotateTitle ? false : true;
	        this._titlePosition = args.titlePosition;

	        if ("labelRotation" in args)
	            this._labelRotation = args.labelRotation;

	        //flip is useful when items are top aligned for example, and the axis needs to start from the top
	        //this is different from invert scale, and this is computed when positioning, not specified by users
	        //this._flip = "flip" in args ? args["flip"] : false;
	    }

	    toJSON() {
	        let json = {args: {}};
			json.type = this.type;
			json.id = this.id;
	        json.field = this._field;
	        json.channel = this._channel;
	        if (!("args" in json))
	            json.args = {};
	        json.args.orientation = this._orientation;
	        json.args.strokeColor = this._strokeColor;
	        json.args.textColor = this._textColor;
	        json.args.tickOffset = this._tickOffset;
	        json.args.tickSize = this._tickSize;
	        json.args.tickAnchor = this._tickAnchor;
	        json.args.tickVisible = this._tickVisible;
	        json.args.pathVisible = this._pathVisible;
	        json.args.labelOffset = this._labelOffset;
	        json.args.labelFormat = this._labelFormat;
	        if (this._labelRotation)
	            json.args.labelRotation = this._labelRotation;
	        json.args.showTitle = this._showTitle;
	        json.args.tickValues = this._tickValues;
	        json.args.titleAnchor = this._titleAnchor;
	        json.args.titleOffset = this._titleOffset;
	        json.args.titlePosition = this._titlePosition;
	        json.args.rotateTitle = this._rotateYTitle;
	        return json;
	    }

	    get field(){
	        return this._field;
	    }

	    get channel(){
	        return this._channel;
	    }

	    get orientation(){
	        return this._orientation;
	    }

	    set orientation(o){
	        this._orientation = o;
	        this.reposition();
	    }

	    get pathX(){
	        if (this.channel == "y" || this.channel == "height") {
	            if (this._position !== undefined)
	                return this._position;
	            if (this._path) { // encoding axis
	                return this._path.vertices[0].x;
	            } else if (this._rules && this._rules.firstChild) {
	                return this._rules.firstChild.vertices[0].x;
	            }
	        } 
	        return undefined;
	    }

	    set pathX(v){
	        if (this.channel == "y" || this.channel == "height")
	            this._posArg = v;
	        this.reposition();
	    }

	    get pathPosition() {
	        if (this.channel == "x" || this.channel == "width") {
	            return this.pathY;
	        } else
	            return this.pathX;
	    }

	    set pathPosition(v) {
	        if (this.channel == "x" || this.channel == "width") {
	            this.pathY = v;
	        } else if (this.channel == "y" || this.channel == "height") {
	            this.pathX = v;
	        }
	    }

	    get pathY(){
	        if (this.channel == "x" || this.channel == "width") {
	            if (this._position !== undefined)
	                return this._position;
	            if (this._path) {
	                return this._path.vertices[0].y;
	            } else if (this._rules && this._rules.firstChild) {
	                return this._rules.firstChild.vertices[0].y;
	            }
	        }
	        return undefined;
	    }

	    set pathY(v){
	        if (this.channel == "x" || this.channel == "width")
	            this._posArg = v;
	        this.reposition();
	    }

	    get tickOffset(){
	        return this._tickOffset;
	    }

	    set tickOffset(o){
	        this._tickOffset = o;
	        this._positionTicks();
	    }

	    get titleOffset(){
	        return this._titleOffset;
	    }

	    set titleOffset(o){
	        this._titleOffset = o;
	    }

	    get tickSize(){
	        return this._tickSize;
	    }

	    set tickSize(o){
	        this._tickSize = o;
	        this._positionTicks();
	    }

	    set tickValues(values){
	        this._tickValues = values;
	        this._generateTicks();
	        this._positionTicks();
	    }

	    get tickValues() {
	        return this._tickValues;
	    }

	    set labelValues(values){
	        this._labelValues = values;
	        this._generateLabels();
	        this._positionLabels();
	    }

	    get labelValues(){
	        return this._labelValues;
	    }

	    get tickAnchor(){
	        return this._tickAnchor;
	    }

	    set tickAnchor(o){
	        this._tickAnchor = o;
	    }

	    get tickVisible(){
	        return this._tickVisible;
	    }

	    set tickVisible(o){
	        this._tickVisible = o;
	        for (let l of this._ticks.children)
	            l.visibility = o ? "visible" : "hidden";
	    }

	    get pathVisible(){
	        return this._pathVisible;
	    }

	    set pathVisible(o){
	        this._pathVisible = o;
	        let p = [];
	        if (this._path)
	            p.push(this._path);
	        if (this._rules)
	            this._rules.children.forEach(c => p.push(c));
	        for (let l of p)
	            l.visibility = o ? "visible" : "hidden";
	    }

	    get labelOffset(){
	        return this._labelOffset;
	    }

	    set labelOffset(o){
	        this._labelOffset = o;
	        this._positionLabels();
	    }

	    get labelFormat(){
	        return this._labelFormat;
	    }

	    set labelFormat(o){
	        this._labelFormat = o;
	        this._generateLabels();
	        this._positionLabels();
	    }

	    get labelRotation(){
	        return this._labelRotation;
	    }

	    set labelRotation(o){
	        this._labelRotation = o;
	    }

	    get showTitle(){
	        return this._showTitle;
	    }

	    set showTitle(s){
	        this._showTitle = s;
	        if (!this._title) {
	            this._generateTitle();
	            this._positionTitle();
	        }
	        this._title.visibility = s ? "visible" : "hidden";
	    }

	    get titleAnchor(){
	        return this._titleAnchor;
	    }

	    set titleAnchor(a){
	        this._titleAnchor = a;
	    }

	    get titlePosition(){
	        return this._titlePosition;
	    }

	    set titlePosition(a){
	        this._titlePosition = a;
	    }

	    get rotateTitle(){
	        return this._rotateYTitle;
	    }

	    set rotateTitle(r){
	        this._rotateYTitle = r;
	    }

	    get title(){
	        return this._titleText;
	    }

	    set title(t){
	        this._titleText = t;
	    }

	    get includeZero() {
	        if (this.encoding)
	            return this.encoding.scale.includeZero;
	        else
	            return false;
	    }

	    set includeZero(b) {
	        if (this.encoding)
	            this.encoding.scale.includeZero = b;
	    }

	    _generatePath(){}

	    _generateTicks(){}

	    _generateLabels(){}

	    _generateTitle(){
	        this._title = new PointText({"text": this._titleText, fillColor: this._textColor, fontWeight: "bold"});
	        this._title.id = this.id + "-title";
	        this.addChild(this._title);
	    }

	    _positionPath(){}

	    _positionTicks(){}

	    _positionLabels(){}

	    _positionTitle(){}

	    // eslint-disable-next-line no-unused-vars
	    matches(item) {}

	    reposition() {
	        this._positionPath();
	        this._positionTicks();
	        this._positionLabels();
	        if (this._showTitle)
	            this._positionTitle();
	        if (this._channel === "radialDistance" && this._rotate){
	            this._rotate = [this._rotate[0], this._item.parent.x, this._item.parent.y];
	        }
	        this._updateBounds();
	    }
	}

	class EncodingAxis extends Axis {
	    
	    //glyph is optional
		constructor(encoding, item, args) {
	        super(args);
	        
	        this.encoding = encoding;
	        this._field = this.encoding.field;
	        this._channel = this.encoding.channel;
	        this._orientation = "orientation" in args ? args["orientation"] : 
	                                this._channel === "x" || this._channel == "width" ? "bottom" : "left";

	        this._posArg = this._channel == "x" || this._channel == "width"? args["pathY"] : args["pathX"];
	        this._position = this._posArg; 
	        this._titleText = "title" in args ? args["title"] : this.encoding.field;

	        this._item = item;

	        this._ticks = new Group();
	        this._ticks.id = this.id + "ticks";
	        this.addChild(this._ticks);
	        
	        this._labels = new Group();
	        this._labels.id = this.id + "labels";
	        this.addChild(this._labels);

	        if (this._channel === "radialDistance"){
	            //this._position = this._item.parent.y;
	            if("rotation" in args){
	                this._rotate = [-args["rotation"], this._item.parent.x, this._item.parent.y];
	            }
	        }

	        this._showTitle = "showTitle" in args ? args.showTitle : true;

	        this._determineAxisFlip();
	        this._generatePath();
	        this._positionPath();
	        if (this._showTitle) {
	            this._generateTitle();
	        }

	        //ticks and labels are created and positioned when the values are set in scene.axis()

	        if (this._showTitle) {
	            this._positionTitle();
	        }
	    }

	    autoUpdateTicks() {
	        let vals = this._inferTickValues();
	        this.tickValues = vals;
			this.labelValues = vals;
	    }

	    _inferTickValues() {
	        let enc = this.encoding, domain = enc.scale.domain, range = enc.scale.range;
			let minPxInterval;
			//let minTickIntervalPx = 40, minLabelIntervalPx = 80;
			switch (enc.scale.type) {
				case "linear":
				case "log": {
					//handle the case where the marks are stacked
					let r = Math.abs(range[0] - range[1]);
					if (enc.channel == "width" || enc.channel == "height") {
						let layout = getClosestLayout(enc.anyItem);
						if (layout && layout.type == LayoutType.Stack) {
							let c = layout.group, colls = getPeers(c, enc.scene);
							r = Math.max(...colls.map(d => d.bounds[enc.channel])) ;
							domain[1] = enc.scale.invert(r); // Math.ceil(enc.scale.invert(r)); do not ceil, it can amplify small difference in invert calculation due to imprecision/roundoff in bounding box calculation
						}
					} 
					minPxInterval = enc.channel == "width" || enc.channel == "x" ? 45 : 30;
					let n = Math.floor(r/minPxInterval); //, step = d3.tickStep(domain[0], domain[1], n);
					let ticks = d3__namespace.ticks(domain[0], domain[1], n);
					return ticks;
				}
				case "point": {
					minPxInterval = enc.channel == "width" || enc.channel == "x" ? 80 : 30;
					let domainValueIntervalPx = Math.floor(enc.scale.rangeExtent/domain.length);
					let m = Math.ceil(minPxInterval/domainValueIntervalPx);
					return enc.channel == "x" ? domain.filter((d, i) => i % m == 0) : domain;
				}
				case "time": {
					minPxInterval = enc.channel == "width" || enc.channel == "x" ? 80 : 30;
					let numIntervals = Math.floor((range[1] - range[0])/minPxInterval),
						timeInterval = Math.ceil( (domain[1] - domain[0])/numIntervals )/1000;

					let units = [1, 60, 3600, 86400, 2628003, 31536000],
						intervals = [d3__namespace.timeSeconds, d3__namespace.timeMinutes, d3__namespace.timeHours, d3__namespace.timeDays, d3__namespace.timeMonths, d3__namespace.timeYears];

					let tn, tInterval;
					for (let i = 0; i < units.length - 1; i++) {
						if (timeInterval >= units[i] && timeInterval < units[i+1]) {
							tn = Math.floor(timeInterval/units[i]);
							tInterval = intervals[i];
							return tInterval(domain[0], domain[1], tn);
						}
					} 
					if (timeInterval > units[units.length-1]) {
						tn = Math.floor(timeInterval/units[units.length-1]);
						tInterval = intervals[units.length-1];
						return tInterval(domain[0], domain[1], tn);
					}
					return [];
				}
				default:
					return [];
			}
	    }

	    _updateBounds() {
	        this._bounds = this._path.bounds;
	        if (this._ticks.children.length > 0)
	            this._bounds = this._bounds.union(this._ticks.bounds);
	        if (this._labels.children.length > 0)
	            this._bounds = this._bounds.union(this._labels.bounds);
	        if (this._title)
	            this._bounds = this._bounds.union(this._title.bounds);
	    }

	    toJSON() {
	        let json = super.toJSON();
	        json.args.item = this._item.id;
	        if (this.encoding.scale.type === "time") {
	            json.args.isDate = true;
	        }
	        if (this._rotate) {
	            json.args.rotation = this._rotate[0];
	        }
	        if (this._channel == "x" || this._channel == "width")
	            json.args.pathY = this._posArg;
	        else
	            json.args.pathX = this._posArg;
	        return json;
	    }
	    
	    get ticks() {
	        return this._ticks;
	    }

	    get labels() {
	        return this._labels;
	    }

	    get path() {
	        return this._path;
	    }

	    set strokeColor(c) {
	        this._strokeColor = c;
	        for (let t of this._ticks.children)
	            t.strokeColor = c;
	        this._path.strokeColor = c;
	    }

	    get strokeColor() {
	        return this._strokeColor;
	    }

	    set textColor(c) {
	        this._textColor = c;
	        for (let l of this._labels.children)
	            l.fillColor = c;
	        if (this._title)
	            this._title.fillColor = c;
	    }

	    get textColor() {
	        return this._textColor;
	    }

	    _generatePath(){
	        this._path = new Path({"strokeColor": this._strokeColor});
	        if (!this._pathVisible)
	            this._path.visibility = "hidden";
	        this._path.type = ItemType.Line;
	        this._path.id = this.id + "path";
	        this.addChild(this._path);
	    }

	    _generateTicks(){
	        this._ticks.removeAll();
	        for (let i = 0; i < this._tickValues.length; i++) {
	            let t = new Path({"strokeColor": this._strokeColor});
	            if (!this._tickVisible)
	                t.visibility = "hidden";
	            t.type = ItemType.Line;
	            t.id = this.id + "tick" + i;
	            this._ticks.addChild(t);
	        }
	    }

	    _generateLabels(){
	        this._labels.removeAll();
	        let formatter, fieldType = this.encoding.datatable.getFieldType(this.encoding.field);

	        switch (fieldType) {
	            case DataType.Date:
	                formatter = d3__namespace.timeFormat(this._labelFormat);
	                break;
	            case DataType.String:
	                formatter = function(d) {return d;};
	                break;
	            default:
	                formatter = d3__namespace.format(this._labelFormat);
	                break;
	        }

	        for (let [i, v] of this._labelValues.entries()) {
	            let t = new PointText({"text": formatter(v), fontSize: this._fontSize, fillColor: this._textColor});
	            t.id = this.id + "label" + i;
	            this._labels.addChild(t);
	        }
	    }

	    _positionPath(){
	        this._range = this.encoding.getScaleRange(this._item);
	        if (this._posArg === undefined)
	            this._position = this._computePosition();
	        else
	            this._position = this._posArg;

	        let vertices = [];
	        if (this._channel == "x" || this._channel == "radialDistance" || this._channel == "width") {
	            let tickX = this._ticks.children.map(d => d.vertices[0].x);
	            vertices.push([
	                Math.min(...tickX.concat(this._range)),
	                this._position
	            ]);
	            vertices.push([
	                Math.max(...tickX.concat(this._range)),
	                this._position
	            ]);
	        } else if (this._channel == "y" || this._channel == "height") {
	            let tickY = this._ticks.children.map(d => d.vertices[0].y);
	            vertices.push([
	                this._position,
	                Math.min(...tickY.concat(this._range))
	            ]);
	            vertices.push([
	                this._position,
	                Math.max(...tickY.concat(this._range))
	            ]);
	        }
	        this._path._setVertices(vertices);
	        this._path._updateBounds();

	        if (this._showTitle && this._title) {
	            this._positionTitle();
	        }

	        this._updateBounds();
	    }

	    _isAlignedLeft(layout) {
	        switch (layout.type) {
	            case LayoutType.Stack:
	            case LayoutType.Grid:
	                return layout.horzCellAlignment === Alignment.Left;
	            default:
	                return true;
	        }
	    }

	    _isAlignedBottom(layout) {
	        switch (layout.type) {
	            case LayoutType.Stack:
	            case LayoutType.Grid:
	                return layout.vertCellAlignment === Alignment.Bottom;
	            default:
	                return true;
	        }
	    }

	    _determineAxisFlip() {
	        if (this._channel == "x" || this._channel == "radialDistance" || this._channel == "width") {
	            if (this._channel == "width") {
	                let layout = getTopLevelCollection(this._item) ? getTopLevelCollection(this._item).layout : getClosestLayout(this._item);
	                if (layout) {
	                    //let alignment = layout.type == LayoutType.Stack ? layout._horzCellAlignment == Alignment.Left : layout._cellHorzAlignment == Alignment.Left;
	                    //this._flip = alignment? false : true;
	                    this._flip = !this._isAlignedLeft(layout);
	                }
	                else if (this._item.type == "area"){
	                    let alignment = this._item.baseline == Alignment.Left || this._item.baseline == Alignment.Center || this._item.baseline == Alignment.Middle || this._item.baseline == undefined;
	                    this._flip = alignment? false : true;
	                }
	            }
	        } else if (this._channel == "y" || this._channel == "height") {
	            if (this._channel == "height") {
	                let layout = getTopLevelCollection(this._item) ? getTopLevelCollection(this._item).layout : getClosestLayout(this._item);
	                //TODO: bug here, example: Mystique D3-12. http://bl.ocks.org/peterbsmyth/raw/005ed081c4b654ad04ce/?raw=true
	                if (layout) {
	                    this._flip = !this._isAlignedBottom(layout);
	                    //this._flip = layout.vertCellAlignment !== Alignment.Bottom;
	                } else if (this._item.type == "area") {
	                    let alignment = this._item.baseline == Alignment.Bottom || this._item.baseline == Alignment.Center || this._item.baseline == Alignment.Middle || this._item.baseline == undefined;
	                    this._flip = alignment? false : true;
	                }
	            }
	        }
	    }


	    _positionLabels(){
	        if (this._posArg === undefined)
	            this._position = this._computePosition();
	        else
	            this._position = this._posArg;
	        if (this._channel == "x" || this._channel == "radialDistance" || this._channel == "width") {
	            let offset = this._orientation == "bottom" ? this._tickSize : - this._tickSize ;
	            let anchor = this._orientation == "bottom" ? ["center", "top"] : ["center", "bottom"];
	            // if (this._item.type == "area" && this._channel == "width") {
	            //     let layout = getClosestLayout(this._item);
	            //     if (layout) {
	            //         //let alignment = layout.type == LayoutType.Stack ? layout._horzCellAlignment == Alignment.Left : layout._cellHorzAlignment == Alignment.Left;
	            //         this._flip = !this._isAlignedLeft(layout);
	            //     }
	            //     else {
	            //         let alignment = this._item.baseline == Alignment.Left || this._item.baseline == Alignment.Center || this._item.baseline == Alignment.Middle || this._item.baseline == undefined;
	            //         this._flip = alignment? false : true;
	            //     }
	            // }
	            if (this._flip) {
	                for (let [i, l] of this._labels.children.entries()) {
	                    l.x = this._range[1] - this.encoding.scale.map(this._labelValues[i]);
	                    l.y = this._position + offset;
	                    l.anchor = anchor;
	                    if (this._labelRotation){
	                        l._rotate = [this._labelRotation, l.x, l.y];
	                        l.anchor = ["right", anchor[1]];
	                    }
	                }
	            } else if (this.encoding.scale.isFlipped) {
	                for (let [i, l] of this._labels.children.entries()) {
	                    l.x = this._range[0] + this.encoding.scale.map(this._labelValues[i]);
	                    l.y = this._position + offset;
	                    l.anchor = anchor;
	                    if (this._labelRotation){
	                        l._rotate = [this._labelRotation, l.x, l.y];
	                        l.anchor = ["right", anchor[1]];
	                    }
	                }
	            }  else {
	                for (let [i, l] of this._labels.children.entries()) {
	                    l.x = this._range[0] + this.encoding.scale.map(this._labelValues[i]) - this.encoding.scale.range[0];
	                    l.y = this._position + offset;
	                    l.anchor = anchor;
	                    if (this._labelRotation){
	                        l._rotate = [this._labelRotation, l.x, l.y];
	                        l.anchor = ["right", anchor[1]];
	                    }
	                }
	            }
	        } else if (this._channel == "y" || this._channel == "height") {
	            let offset = this._orientation == "left" ? -this._tickSize : this._tickSize;
	            let anchor = this._orientation == "left" ? ["right", "middle"] : ["left", "middle"];
	            // if (this._item.type == "area" && this._channel == "height") {
	            //     let layout = getClosestLayout(this._item);
	            //     if (this._channel == "height" && layout) {
	            //         // let alignment = layout.type == LayoutType.Stack ? layout._vertCellAlignment == Alignment.Bottom : layout._cellVertAlignment == Alignment.Bottom;
	            //         // this._flip = alignment? false : true;
	            //         this._flip = !this._isAlignedBottom(layout);
	            //     }
	            //     else {
	            //         let alignment = this._item.baseline == Alignment.Bottom || this._item.baseline == Alignment.Center || this._item.baseline == Alignment.Middle || this._item.baseline == undefined;
	            //         this._flip = alignment? false : true;
	            //     }
	            // }
	            if (this._flip) {
	                for (let [i, l] of this._labels.children.entries()) {
	                    l.x = this._position + offset;
	                    l.y = this._range[1] + this.encoding.scale.map(this._labelValues[i]);
	                    l.anchor = anchor;
	                }
	            } else if (this.encoding.scale.isFlipped) {
	                for (let [i, l] of this._labels.children.entries()) {
	                    l.x = this._position + offset;
	                    l.y = this._range[1] - this.encoding.scale.map(this._labelValues[i]) + this.encoding.scale.range[1];
	                    l.anchor = anchor;
	                }
	            } else {
	                for (let [i, l] of this._labels.children.entries()) {
	                    l.x = this._position + offset;
	                    l.y = this._range[0] - this.encoding.scale.map(this._labelValues[i]) + this.encoding.scale.range[0];
	                    l.anchor = anchor;
	                }
	            }
	        } 
	        this._labels._updateBounds();
	        this._updateBounds();
	    }

	    _computePosition() {
	        let c;
	        if (this._item.type == ItemType.Area)
	            c = getCellBoundsInGridLayout(this._item);
	        if (c === undefined) {
	            let container = getTopLevelCollection(this._item);
	            if (container === undefined)
	                container = getTopLevelGroup(this._item);
	            c = container.bounds;
	        }
	        if (this._channel === "x" || this._channel === "width") {
	            return this._orientation == "top"  ? c.top - this._tickSize : c.bottom + this._tickSize;
	        } else if (this._channel === "y" || this._channel === "height") {
	            return this._orientation == "left"  ? c.left - this._tickSize : c.right + this._tickSize;
	        } else if (this._channel === "radialDistance"){
	            return this._item.parent.y;
	        }
	    }

	    _positionTicks() {
	        if (this._posArg === undefined)
	            this._position = this._computePosition();
	        else
	            this._position = this._posArg;
	        this._range = this.encoding.getScaleRange(this._item);
	        if (this._channel == "x" || this._channel == "radialDistance" || this._channel == "width") {
	            let offset = this._orientation == "bottom" ? this._tickSize : -this._tickSize;
	            // if (this._channel == "width") {
	            //     let layout = getClosestLayout(this._item);
	            //     if (layout) {
	            //         //let alignment = layout.type == LayoutType.Stack ? layout._horzCellAlignment == Alignment.Left : layout._cellHorzAlignment == Alignment.Left;
	            //         //this._flip = alignment? false : true;
	            //         this._flip = !this._isAlignedLeft;
	            //     }
	            //     else if (this._item.type == "area"){
	            //         let alignment = this._item.baseline == Alignment.Left || this._item.baseline == Alignment.Center || this._item.baseline == Alignment.Middle || this._item.baseline == undefined;
	            //         this._flip = alignment? false : true;
	            //     }
	            // }
	            if (this._flip) {
	                for (let [i, t] of this._ticks.children.entries()) {
	                    t._setVertices([
	                        [this._range[1] - this.encoding.scale.map(this._tickValues[i]), this._position],
	                        [this._range[1] - this.encoding.scale.map(this._tickValues[i]), this._position + offset]
	                    ]);
	                    t._updateBounds();
	                }
	            } else if (this.encoding.scale.isFlipped) {
	                for (let [i, t] of this._ticks.children.entries()) {
	                    t._setVertices([
	                        [this._range[0] + this.encoding.scale.map(this._tickValues[i]), this._position],
	                        [this._range[0] + this.encoding.scale.map(this._tickValues[i]), this._position + offset]
	                    ]);
	                    t._updateBounds();
	                }
	            } else {
	                for (let [i, t] of this._ticks.children.entries()) {
	                    t._setVertices([
	                        [this._range[0] + this.encoding.scale.map(this._tickValues[i]) - this.encoding.scale.range[0], this._position],
	                        [this._range[0] + this.encoding.scale.map(this._tickValues[i]) - this.encoding.scale.range[0], this._position + offset]
	                    ]);
	                    t._updateBounds();
	                }
	            }
	        } else if (this._channel == "y" || this._channel == "height") {
	            let offset = this._orientation == "left" ? -this._tickSize : this._tickSize;
	            // if (this._channel == "height") {
	            //     let layout = getClosestLayout(this._item);
	            //     //TODO: bug here, example: Mystique D3-12. http://bl.ocks.org/peterbsmyth/raw/005ed081c4b654ad04ce/?raw=true
	            //     if (layout) {
	            //         this._flip = !this._isAlignedBottom(layout);
	            //         //this._flip = layout.vertCellAlignment !== Alignment.Bottom;
	            //     } else if (this._item.type == "area") {
	            //         let alignment = this._item.baseline == Alignment.Bottom || this._item.baseline == Alignment.Center || this._item.baseline == Alignment.Middle || this._item.baseline == undefined;
	            //         this._flip = alignment? false : true;
	            //     }
	            // }
	            if (this._flip) {
	                for (let [i, t] of this._ticks.children.entries()) {
	                    t._setVertices([
	                        [this._position + offset, this._range[1] + this.encoding.scale.map(this._tickValues[i])],
	                        [this._position, this._range[1] + this.encoding.scale.map(this._tickValues[i])]
	                    ]);
	                    t._updateBounds();
	                }
	            } else if (this.encoding.scale.isFlipped) {
	                for (let [i, t] of this._ticks.children.entries()) {
	                    let y = this._range[1] - this.encoding.scale.map(this._tickValues[i]) + this.encoding.scale.range[1];
	                    //this._range[1] + this.encoding.scale.map(this._tickValues[i])
	                    t._setVertices([
	                        [this._position + offset, y],
	                        [this._position, y]
	                    ]);
	                    t._updateBounds();
	                }
	            } else {
	                for (let [i, t] of this._ticks.children.entries()) {
	                    t._setVertices([
	                        [this._position + offset, this._range[0] - this.encoding.scale.map(this._tickValues[i]) + this.encoding.scale.range[0]],
	                        [this._position, this._range[0] - this.encoding.scale.map(this._tickValues[i]) + this.encoding.scale.range[0]]
	                    ]);
	                    t._updateBounds();
	                }
	            }
	        }
	        this._positionPath();
	        this._ticks._updateBounds();
	        this._updateBounds();
	    }

	    _positionTitle(){
	        let pb = this._path.bounds;
	        this._title.achor = this._titleAnchor;
	        if (!this._titlePosition) {
	            if (this._channel == "x" || this._channel == "width") {
	                this._title.x = pb.x;
	                this._title.y = this._orientation == "top" ? pb.top - this._titleOffset : pb.bottom + this._titleOffset;
	            } else {
	                this._title.x = this._orientation == "left" ? pb.left - this._titleOffset : pb.right + this._titleOffset;
	                this._title.y = pb.y;
	                if (this._rotateYTitle)
	                    this._title._rotate = this._orientation == "left" ?  [-90, this._title.bounds.x, this._title.bounds.y] : [90, this._title.bounds.x, this._title.bounds.y];
	            }
	        } else {
	            this._title.x = this._titlePosition[0];
	            this._title.y = this._titlePosition[1];
	            if (this._channel == "y" || this._channel == "height") {
	                if (this._rotateYTitle)
	                    this._title._rotate = this._orientation == "left" ?  [-90, this._title.bounds.x, this._title.bounds.y] : [90, this._title.bounds.x, this._title.bounds.y];
	            }
	        }
	        this._title._updateBounds();
	        this._updateBounds();      
	    }

	    //item is a group or a mark or a vertex or segment
	    matches(item) {
	        let k = getEncodingKey(item).split("_")[0],
	            encodings = this.encoding.scale.encodings;
	        for (let enc of encodings) {
	            let classId = getEncodingKey(enc.anyItem).split("_")[0];
	            if (classId === k)
	                return true;
	        }
	        return false;
	    }

	    get isFlipped() {
	        if (this._flip)
	            return true;
	        if (this.encoding.scale.isFlipped)
	            return true;
	        return false;
	    }
	}

	class LayoutAxis extends Axis {
	    
	    constructor(items, layout, channel, field, args) {
	        super(args);
	        this._channel = channel;
	        this._orientation = "orientation" in args ? args["orientation"] : 
	                                this._channel === "x" || this._channel == "width" ? "bottom" : "left";
	        this._posArg = this._channel == "x" || this._channel == "width"? args["pathY"] : args["pathX"]; 

	        this._item = items[0];
	        this._items = items;
	        this._mlayout = layout;
	        this._field = field;
	        this._titleText = "title" in args ? args["title"] : this._field;
	        this._showTitle = "showTitle" in args ? args.showTitle : false;
	        
	        if ("labelRotation" in args)
	            this._labelRotation = args.labelRotation;

	        this._ticks = new Group();
	        this._ticks.id = this.id + "ticks";
	        this.addChild(this._ticks);

	        this._labels = new Group();
	        this._labels.id = this.id + "labels";
	        this.addChild(this._labels);

	        //there can be multiple rules if the layout has multiple rows or columns
	        this._rules = new Group();
	        this._rules.id = this.id + "paths";
	        this.addChild(this._rules);

	        this._generatePath();
	        this._generateTicks();
	        this._generateLabels();
	        if (this._showTitle) {
	            this._generateTitle();
	        }
	        this._positionPath();
	        this._positionTicks();
	        this._positionLabels();
	        if (this._showTitle) {
	            this._positionTitle();
	        }

	    }

	    toJSON() {
	        let json = super.toJSON();
	        json.args.item = this._item.id;
	        if (this._channel == "x" || this._channel == "width")
	            json.args.pathY = this._posArg;
	        else
	            json.args.pathX = this._posArg;
	        if (this.classId)
	            json.classId = this.classId;
	        return json;
	    }

	    set strokeColor(c) {
	        this._strokeColor = c;
	        for (let t of this._ticks.children)
	            t.strokeColor = c;
	        for (let t of this._rules.children)
	            t.strokeColor = c;
	    }

	    get strokeColor() {
	        return this._strokeColor;
	    }

	    set textColor(c) {
	        this._textColor = c;
	        for (let l of this._labels.children)
	            l.fillColor = c;
	        if (this._title)
	            this._title.fillColor = c;
	    }

	    get textColor() {
	        return this._textColor;
	    }

	    _updateBounds() {
	        this._bounds = this._rules.bounds.clone();
	        this._bounds = this._bounds.union(this._ticks.bounds);
	        this._bounds = this._bounds.union(this._labels.bounds);
	        if (this._showTitle)
	            this._bounds = this._bounds.union(this._title.bounds);
	    }

	    _generatePath(){
	        this._rules.removeAll();
	        if (this._mlayout.type == LayoutType.Grid) {
	            let num = this._channel == "x" ? this._mlayout.numRows : this._mlayout.numCols;
	            for (let i = 0; i < num; i++) {
	                let t = new Path({"strokeColor": this._strokeColor});
	                if (!this._pathVisible)
	                    t.visibility = "hidden";
	                t.type = ItemType.Line;
	                t.id = this.id + "rule" + i;
	                this._rules.addChild(t);
	            }
	        } else if (this._mlayout.type === LayoutType.Stack) {
	            let t = new Path({"strokeColor": this._strokeColor});
	            if (!this._pathVisible)
	                t.visibility = "hidden";
	            t.type = ItemType.Line;
	            t.id = this.id + "rule";
	            this._rules.addChild(t);
	        }
	    }

	    _generateTicks() {
	        this._ticks.removeAll();
	        for (let i = 0; i < this._mlayout.group.children.length; i++) {
	            let t = new Path({"strokeColor": this._strokeColor});
	            if (!this._tickVisible)
	                t.visibility = "hidden";
	            t.type = ItemType.Line;
	            t.id = this.id + "tick" + i;
	            this._ticks.addChild(t);
	        }
	    }

	    //TODO: improve efficiency by reusing components
	    _generateLabels() {
	        this._labels.removeAll();
	        let formatter, fieldType = this._item.dataScope.getFieldType(this._field);

	        switch (fieldType) {
	            case DataType.Date:
	                formatter = d3__namespace.timeFormat(this._labelFormat);
	                break;
	            case DataType.String:
	                formatter = function(d) {return d;};
	                break;
	            default:
	                formatter = d3__namespace.format(this._labelFormat);
	                break;
	        }
	  
	        let cb = this._mlayout.cellBounds;
	        for (let i = 0; i < cb.length; i++) {
	            let itm = this._mlayout.group.children[i];
	            let t = new PointText({fillColor: this._textColor, fontSize: this._fontSize, "text": formatter(itm.dataScope.getFieldValue(this._field))});
	            //let t = new PointText({fillColor: this._textColor, fontSize: this._fontSize, "text": formatter(this._items[i].dataScope.getFieldValue(this._field))});
	            t.id = this.id + "label" + i;
	            this._labels.addChild(t);
	        }
	    }

	    _positionPath(){
	        if (this._mlayout.type == LayoutType.Grid) {
	            let cb = this._mlayout.cellBounds;
	            let num = this._channel == "x" ? this._mlayout.numRows : this._mlayout.numCols;
	            if (this._channel == "x") {
	                let left = cb[0].left, numCols = this._mlayout.numCols;
	                for (let r = 0; r < num; r++){
	                    this._rules.children[r]._setVertices([
	                        [left, this._posArg ? cb[r * numCols][this._orientation] + this._posArg - cb[0][this._orientation] : cb[r * numCols][this._orientation] ],
	                        [left + cb[0].width * numCols + this._mlayout.colGap * (numCols - 1), this._posArg ? cb[r * numCols][this._orientation] + this._posArg - cb[0][this._orientation] : cb[r * numCols][this._orientation]]
	                    ]);
	                }
	            } else {
	                let top = cb[0].top, numRows = this._mlayout.numRows;
	                for (let c = 0; c < num; c++){
	                    // this._rules.children[c]._setVertices([
	                    //     [this._posArg ? cb[c * numRows][this._orientation] + this._posArg - cb[0][this._orientation] : cb[c * numRows][this._orientation], top ],
	                    //     [this._posArg ? cb[c * numRows][this._orientation] + this._posArg - cb[0][this._orientation] : cb[c * numRows][this._orientation], top + cb[0].height * numRows + this._mlayout.rowGap * (numRows - 1), ]
	                    // ]);
	                    this._rules.children[c]._setVertices([
	                        [this._posArg ? cb[c * numRows][this._orientation] + this._posArg - cb[0][this._orientation] : this._mlayout.group.bounds[this._orientation], top ],
	                        [this._posArg ? cb[c * numRows][this._orientation] + this._posArg - cb[0][this._orientation] : this._mlayout.group.bounds[this._orientation], top + cb[0].height * numRows + this._mlayout.rowGap * (numRows - 1)]
	                    ]);
	                }
	            }
	        } else if (this._mlayout.type === LayoutType.Stack) {
	            let b = this._mlayout.group.bounds;
	            if (this._channel == "x") {
	                this._rules.children[0]._setVertices([
	                    [b.left, this._posArg ? this._posArg : b[this._orientation] ],
	                    [b.right, this._posArg ? this._posArg : b[this._orientation]]
	                ]);              
	            } else {
	                this._rules.children[0]._setVertices([
	                    [this._posArg ? this._posArg : b[this._orientation], b.top ],
	                    [this._posArg ? this._posArg : b[this._orientation], b.bottom ]
	                ]);
	            }
	        }
	        this._rules.children.forEach(r => r._updateBounds());
	        this._rules._updateBounds();
	        this._updateBounds();
	    }

	    _positionTicks(){
	        let cb = this._mlayout.cellBounds;
	        if (this._channel == "x") {
	            let dir = this._orientation == "bottom" ? 1 : -1;
	            for (let [i, t] of this._ticks.children.entries()) {
	                let pos = this._posArg ? cb[i][this._orientation] + this._posArg - cb[0][this._orientation] + this._tickOffset * dir : 
	                            cb[i][this._orientation] + this._tickOffset * dir;
	                t._setVertices([
	                    [cb[i].x, pos],
	                    [cb[i].x, pos + dir * this._tickSize]
	                ]);
	                t._updateBounds();
	            }
	        } else if (this._channel == "y"){
	            let dir = this._orientation == "left" ? -1 : 1;
	            for (let [i, t] of this._ticks.children.entries()) {
	                // let xPos = this._posArg ? cb[i][this._orientation] + this._posArg - cb[0][this._orientation] + this._tickOffset * dir : 
	                //                 cb[i][this._orientation] + this._tickOffset * dir,
	                let xPos = this._posArg ? cb[i][this._orientation] + this._posArg - cb[0][this._orientation] + this._tickOffset * dir : 
	                                    this._mlayout.group.bounds[this._orientation] + this._tickOffset * dir,
	                    yPos = this._tickAnchor == "middle" ? cb[i].y : cb[i][this._tickAnchor];
	                t._setVertices([
	                    [xPos, yPos],
	                    [xPos + dir * this._tickSize, yPos]
	                ]);
	                t._updateBounds();
	            }
	        }
	        this._ticks._updateBounds();
	        this._updateBounds();
	    }

	    _positionLabels(){
	        let cb = this._mlayout.cellBounds;
	        if (this._channel == "x") {
	            let anchor = this._orientation == "bottom" ? ["center", "top"] : ["center", "bottom"],
	                offset = this._orientation == "bottom" ? this._labelOffset : -this._labelOffset;
	            for (let [i, l] of this._labels.children.entries()) {
	                l.x = cb[i].x;
	                l.y = this._posArg ? cb[i][this._orientation] + this._posArg - cb[0][this._orientation] + offset : 
	                                cb[i][this._orientation] + offset;
	                l.anchor = anchor;
	                if (this._labelRotation){
	                    l._rotate = [this._labelRotation, l.x, l.y];
	                    l.anchor = ["right", anchor[1]];
	                }
	                    
	            }
	        } else if (this._channel == "y"){
	            let anchor = this._orientation == "left" ? ["right", "middle"] : ["left", "middle"],
	                offset = this._orientation == "left" ? - this._labelOffset : this._labelOffset;
	            for (let [i, l] of this._labels.children.entries()) {
	                // l.x = this._posArg ? cb[i][this._orientation] + this._posArg - cb[0][this._orientation] + offset 
	                //             : cb[i][this._orientation] + offset;
	                l.x = this._posArg ? cb[i][this._orientation] + this._posArg - cb[0][this._orientation] + offset 
	                            : this._mlayout.group.bounds[this._orientation] + offset;
	                l.y = this._tickAnchor == "middle" ? cb[i].y : cb[i][this._tickAnchor];
	                l.anchor = anchor;
	                if (this._labelRotation) {
	                    l._rotate = [this._labelRotation, l.x, l.y];
	                }
	            }
	        }
	        this._labels._updateBounds();
	        this._updateBounds();
	    }

	    _positionTitle(){
	        let pb = this._rules.bounds;
	        this._title.achor = this._titleAnchor;
	        if (!this._titlePosition) {
	            if (this._channel == "x") {
	                this._title.x = pb.x;
	                this._titleOffset = this._labels.bounds.height + this._labelOffset + 15;
	                this._title.y = this._orientation == "top" ? pb.top - this._titleOffset : pb.bottom + this._titleOffset;
	            } else {
	                this._titleOffset = this._labels.bounds.width + this._labelOffset + 15;
	                this._title.x = this._orientation == "left" ? pb.left - this._titleOffset : pb.right + this._titleOffset;
	                this._title.y = pb.y;
	                if (this._rotateYTitle)
	                    this._title._rotate = this._orientation == "left" ?  [-90, this._title.bounds.x, this._title.bounds.y] : [90, this._title.bounds.x, this._title.bounds.y];
	            }
	        } else {
	            this._title.x = this._titlePosition[0];
	            this._title.y = this._titlePosition[1];
	            if (this._channel == "y" || this._channel == "height") {
	                if (this._rotateYTitle)
	                    this._title._rotate = this._orientation == "left" ?  [-90, this._title.bounds.x, this._title.bounds.y] : [90, this._title.bounds.x, this._title.bounds.y];
	            }
	        }   
	        this._title._updateBounds();
	        this._updateBounds();
	    }

	    matches(item) {
	        return getEncodingKey(this._item).split("_")[0] === getEncodingKey(item).split("_")[0];
	    }
	}

	class Legend extends Group {

	    constructor(encoding, args) {
	        super();
	        this.type = ItemType.Legend;
	        this.id = this.type + ItemCounter[this.type]++;
	        this.encoding = encoding;
	        this._textColor = ("textColor" in args) ? args["textColor"] : "#555";
	        this._strokeColor = ("strokeColor" in args) ? args["strokeColor"] : "#555";
	        this._fontSize = "fontSize" in args? args.fontSize: "12px";
	        this._x = ("x" in args) ? args["x"] : 0;
	        this._y = ("y" in args) ? args["y"] : 0;
	        this._showTitle = ("showTitle" in args) ? args["showTitle"] : true;
	        //for categorical legend
	        if (!("numCols" in args) && !("numRows" in args)) {
	            this._numCols = 1;
	        }
	        else {
	            this._numCols = args["numCols"];
	            this._numRows = args["numRows"];
	        }
	        this._orientation = ("orientation" in args) ? args["orientation"] : Orientation.Vertical;
	        this._initialize();
	    }

	    toJSON(){
	        let json = super.toJSON();
	        if (!("args" in json))
	            json.args = {};
	        json.args.textColor = this._textColor;
	        json.channel = this.encoding.channel;
	        json.field = this.encoding.field;
	        json.args.strokeColor = this._strokeColor;
	        json.args.x = this._x;
	        json.args.y = this._y;
	        json.args.orientation = this._orientation;
	        return json;
	    }

	    get field() {
	        return this.encoding.field;
	    }    

	    get channel() {
	        return this.encoding.channel;
	    }

	    get fieldType() {
	        return this.encoding.datatable.getFieldType(this.field);
	    }

	    _initialize() {
	        let scene = this.encoding.scene, f = this.encoding.field;
	        switch (this.encoding.datatable.getFieldType(f)) {
	            case DataType.String:
	                this._createCategoricalColorLegend(scene, f);
	                break;
	            case DataType.Number:
	            case DataType.Integer:
	                this._createNumericalColorLegend(scene, f);
	                break;
	        }
	    }

	    _createNumericalColorLegend(scene, f) {
	        let wd, ht;
	        if (this._orientation == Orientation.Vertical) {
	            wd = 15;
	            ht = 300;
	        } else {
	            wd = 300;
	            ht = 15;
	        }
	        let titleSize;
	        if (this._showTitle){
	            let title = scene.mark("text", {fillColor: this._textColor, "text": f, x: this._x + wd/2, y: this._y, "anchor": ["center", "middle"]});
	            this.addChild(title);
	            titleSize = 20;
	        } else {
	            titleSize = 0;
	        }
	        
	        let rect = scene.mark("rect", {"top": this._y + titleSize, "left": this._x, "width": wd, "height": ht, "strokeWidth": 0, opacity: this.encoding.anyItem.opacity});
	        let domain = [Math.min(...this.encoding.data), Math.max(...this.encoding.data)], mapping = this.encoding.scale.mapping;
	        let gradient;
	        let texts = [], ticks = [], offset = 5, tickSize = 5;
	        if (mapping) {
	            let values = Object.keys(mapping).map(d => parseFloat(d)).sort((a,b) => a - b);
	            if (this._orientation == Orientation.Vertical) {
	                gradient = new LinearGradient({x1: 0, y1: 100, x2: 0, y2: 0});
	                values.forEach(d => {
	                    let p = (d - domain[0])/(domain[1] - domain[0]);
	                    gradient.addStop(p*100, mapping[d], 1.0);
	                    let tk = scene.mark("line", {"x1": this._x + wd, "x2": this._x + wd + tickSize, "y1": this._y + ht - p * ht + titleSize, "y2": this._y + ht - p * ht+ titleSize, "strokeColor": this._strokeColor});
	                    ticks.push(tk);
	                    let t = scene.mark("text", {fillColor: this._textColor, "text": d.toFixed(0), x: this._x + wd + offset + tickSize, y: this._y + ht - p * ht + titleSize, "anchor": ["left", "middle"]});
	                    texts.push(t);
	                });
	            } else {
	                gradient = new LinearGradient({x1: 0, y1: 0, x2: 100, y2: 0});
	                values.forEach(d => {
	                    let p = (d - domain[0])/(domain[1] - domain[0]);
	                    gradient.addStop(p*100, mapping[d], 1.0);
	                    let tk = scene.mark("line", {"x1": this._x + p * wd, "x2": this._x + p * wd, "y1": this._y + 20 - tickSize + titleSize, "y2": this._y + ht + tickSize + titleSize, "strokeColor": this._strokeColor});
	                    ticks.push(tk);
	                    let t = scene.mark("text", {fillColor: this._textColor, "text": d.toFixed(0), x: this._x + p * wd, y: this._y + ht + offset + titleSize, "anchor": ["center", "top"]});
	                    texts.push(t);
	                });
	            }
	        } else {
	            let domain = this.encoding.scale.domain;
	            let stops = [];
	            for (let i = 0; i < 11; i++)
	                stops.push(domain[0] + (domain[1] - domain[0])*i/10);
	            if (this._orientation == Orientation.Vertical) {
	                gradient = new LinearGradient({x1: 0, y1: 100, x2: 0, y2: 0});
	                stops.forEach(d => {
	                    let p = (d - domain[0])/(domain[1] - domain[0]);
	                    gradient.addStop(p*100, this.encoding.scale.map(d), 1.0);
	                    let tk = scene.mark("line", {"x1": this._x + wd, "x2": this._x + wd + tickSize, "y1": this._y + ht - p * ht + titleSize, "y2": this._y + ht - p * ht + titleSize, "strokeColor": this._strokeColor});
	                    ticks.push(tk);
	                    let t = scene.mark("text", {fillColor: this._textColor, "text": d.toFixed(0), x: this._x + wd + offset + tickSize, y: this._y + ht - p * ht + titleSize, "anchor": ["left", "middle"]});
	                    texts.push(t);
	                });
	            } else {
	                gradient = new LinearGradient({x1: 0, y1: 0, x2: 100, y2: 0});
	                stops.forEach(d => {
	                    let p = (d - domain[0])/(domain[1] - domain[0]);
	                    gradient.addStop(p*100, this.encoding.scale.map(d), 1.0);
	                    let tk = scene.mark("line", {"x1": this._x + p * wd, "x2": this._x + p * wd, "y1": this._y + ht + titleSize, "y2": this._y + ht + tickSize + titleSize, "strokeColor": this._strokeColor});
	                    ticks.push(tk);
	                    let t = scene.mark("text", {fillColor: this._textColor, "text": d.toFixed(0), x: this._x + p * wd, y: this._y + ht + offset + titleSize, "anchor": ["center", "top"]});
	                    texts.push(t);
	                });
	            }
	        }
	        rect.styles.fillColor = gradient;

	        this.addChild(rect);
	        for (let t of texts)
	            this.addChild(t);
	        for (let tk of ticks)
	            this.addChild(tk);
	    }

	    get textColor() {
	        return this._textColor;
	    }

	    set textColor(c) {
	        this._textColor = c;
	        this.setTextColor(this);
	    }

	    setTextColor(itm) {
	        if (!itm.children || itm.children.length === 0) return;
	        for (let i of itm.children) {
	            if (i.type === ItemType.PointText)
	                i.fillColor = this._textColor;
	            else if (i.children && i.children.length > 0) {
	                this.setTextColor(i);
	            }
	        }
	    }

	    _createCategoricalColorLegend(scene, f) {
	        let titleSize = 0;
	        if (this._showTitle) {
	            this.addChild(new PointText({fillColor: this._textColor, "fontSize": this._fontSize, "text": f, x: this._x, y: this._y, "anchor": ["left", "top"]})); 
	            titleSize = parseFloat(this._fontSize) + 5;
	        }
	        let rect = scene.mark("rect", {"top": this._y + 2 + titleSize, "left": this._x, "width": 10, "height": 10, "strokeWidth": 0, opacity: this.encoding.anyItem.opacity});
	        let text = scene.mark("text", {fillColor: this._textColor, "fontSize": this._fontSize, x: this._x + 20, y: this._y + titleSize, "anchor": ["left", "top"]});
	        let glyph = scene.glyph(rect, text);
	        let scale = this.encoding.scale;
	        let dt = new DataTable(scale.domain.map(d => ({"category": d, "value": scale.map(d)})));
	        let coll = scene.repeat(glyph, dt);
	        scene.encode(text, {"channel": "text", "field": "category", "_remember": false});
	        scene.encode(rect, {"channel": "fillColor", "field": "category", "_remember": false, scale: scale});
	        coll.layout = layout("grid", {"numCols": this._numCols, "numRows": this._numRows});
	        this.addChild(coll);
	    }

	    pathHitTest(x, y) {
	        let items = getLeafItems(this);
	        for (let i = items.length - 1; i >= 0; i--) {
	            let c = items[i];
	            if (isPath(c) && c.contains(x, y))
	                return c;
	        }
	        return null;
	    }

	    //item is a group or a mark or a vertex or segment
	    matches(item) {
	        let k = getEncodingKey(item).split("_")[0],
	            encodings = this.encoding.scale.encodings;
	        for (let enc of encodings) {
	            let classId = getEncodingKey(enc.anyItem).split("_")[0];
	            if (classId === k)
	                return true;
	        }
	        return false;
	    }

	}

	class Glyph extends Group {
		
		constructor(args) {
			super();
			this.type = ItemType.Glyph;
			this._id = this.type + ItemCounter[this.type]++;
			if (args){
				for (let a of args){
					this.addChild(a);
				}
			}
		}

		duplicate() {
			let g = this.getScene().glyph();
			for (let c of this.children){
				g.addChild(c.duplicate());
			}

			g.classId = this.classId;
			if (this._dataScope) {
				g.dataScope = this._dataScope.clone();
			}
			return g;
		}
	}

	class AreaPath extends Path {
		
		constructor(args) {
			super(args);
			
			this.type = ItemType.Area;
			this.closed = true;
			this._orientation = ("orientation" in args) ? args.orientation : undefined;
			this._baseline = ("baseline" in args) ? args.baseline : undefined;

			//add last segment to close the path
			if (args && "vertices" in args)
				this.segments.push(new Segment(this.vertices[this.vertices.length-1], this.vertices[0], this, this.segmentCounter++));
		}

		get baseline() {
			return this._baseline;
		}

		set baseline(b) {
			this._baseline = b;
		}

		//this._orientation is set during densification
		get orientation() {
			return this._orientation;
		}

		set orientation(o) {
			this._orientation = o;
		}

		get firstVertexPair() {
			return [this.vertices[0], this.vertices[this.vertices.length-1]];
		}

		get width() {
			return this.vertices[this.vertices.length/2].x - this.vertices[0].x;
		}

		get height() {
			return this.vertices[this.vertices.length/2].y - this.vertices[0].y;
		}

		get left() {
			return this.vertices[0].x;
		}

		get top() {
			return this.vertices[0].y;
		}

		copyPropertiesTo(target) {
			super.copyPropertiesTo(target);
			target._baseline = this._baseline;
		}

		resizeArea(wd, ht) {
			let x1 = this.vertices[this.vertices.length/2].x,
				y1 = this.vertices[this.vertices.length/2].y,
				width = this.width,
				height = this.height;
			for (let v of this.vertices) {
				v.x = x1 + (wd/width) * (v.x - x1);
				v.y = y1 + (ht/height) * (v.y - y1);
			}
			this._updateBounds();
		}

		getSVGPathData() {
			return super.getSVGPathData() + " " + 'z';
		}
	}

	class RingPath extends Path {
		
		constructor(args) {
			super(args);
			this.type = ItemType.Ring;
			this.closed = true;
			this._x = ("x" in args) ? args.x : 0;
			this._y = ("y" in args) ? args.y : 0;
			this._innerRadius = ("innerRadius" in args) ? args.innerRadius : 100;
	        this._outerRadius = ("outerRadius" in args) ? args.outerRadius : 200;
		}

		get innerRadius() {
			return this._innerRadius;
		}

	    set innerRadius(r) {
			this._innerRadius = r;
		}

	    get outerRadius() {
			return this._outerRadius;
		}

	    set outerRadius(r) {
			this._outerRadius = r;
			this._updateBounds();
		}

		get x() {
			return this._x;
		}

		get y() {
			return this._y;
		}

		get center() {
			return new Point(this._x, this._y);
		}

		set x(v) {
			this._x = v;
			this._updateBounds();
		}

		set y(v) {
			this._y = v;
			this._updateBounds();
		}

		get thickness() {
	        return this._outerRadius - this._innerRadius;
	    }

		_doTranslate(dx, dy) {
			this._x += dx;
			this._y += dy;
			this._updateBounds();
		}

		_updateBounds() {		
			this._bounds = new Rectangle(this._x - this._outerRadius, this._y - this._outerRadius, this._outerRadius * 2, this._outerRadius * 2);
		}

		copyPropertiesTo(target) {
			super.copyPropertiesTo(target);
			target._x = this._x;
			target._y = this._y;
			target._innerRadius = this._innerRadius;
	        target._outerRadius = this._outerRadius;
		}

	    getSVGPathData() {
	        let cmds = [
	            "M " +  this._x + " " + this._y, // Move to center of ring
	            "m 0, -" + this._outerRadius, // Move to top of ring
	            "a " + this._outerRadius + "," + this._outerRadius + ", 0, 1, 0, 1, 0", // Draw outer arc, but don't close it
	            "Z", // default fill-rule:even-odd will help create the empty innards
	            "m 0 " + (this._outerRadius-this._innerRadius), // Move to top point of inner radius
	            "a " + this._innerRadius + ", " + this._innerRadius + ", 0, 1, 1, -1, 0", // Draw inner arc, but don't close it
	            "Z" // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke   
	        ];
	        return cmds.join(" ");
	    }

	}

	class PolygonPath extends Path {

	    constructor(args) {
	        super(args);
	        this.type = ItemType.Polygon;
	        this.closed = true;

	        if ("x" in args)
	            this._x = args.x;
	        if ("y" in args)
	            this._y = args.y;
	        if ("radius" in args)
	            this._radius = args.radius;
	    }        

	    get radius() {
			return this._radius;
		}

		get x() {
			return this._x;
		}

		get y() {
			return this._y;
		}

		get center() {
			return new Point(this._x, this._y);
		}

	    set x(v) {
			this._x = v;
			this._updateBounds();
		}

		set y(v) {
			this._y = v;
			this._updateBounds();
		}

		set radius(r) {
			this._radius = r;
			this._updateBounds();
		}

	    copyPropertiesTo(target) {
			super.copyPropertiesTo(target);
			target._x = this._x;
			target._y = this._y;
			target._radius = this._radius;
		}

	    _doTranslate(dx, dy) {
			this._x += dx;
			this._y += dy;
	        super._doTranslate(dx, dy);
		}

	}

	class AlignConstraint {

	    constructor(items, d) {
	        //TODO: check if d is a value in the Alignment (refer to const Alignment in Constants.js)
	        //if not, throw a new error (add an error type in Errors, also defined in Constants.js)

	        this.direction = d;
	        this.items = items;
	        this.type = ConstraintType.Align;
	        this.id = this.type + "_" + [...new Set(this.items.map(d => d.classId))].join("_");
	    }

	    apply() {
	        let baseline, dir = this.direction; 
	        if (this.direction == Alignment.Top || this.direction == Alignment.Left)
	            baseline = Math.min(...this.items.map(d => d.bounds[dir]));
	        else if ((this.direction == Alignment.Bottom || this.direction == Alignment.Right))
	            baseline = Math.max(...this.items.map(d => d.bounds[dir]));
	        else if (this.direction == Alignment.Center || this.direction == Alignment.Middle)
	            baseline = d3__namespace.mean(this.items.map(d => d.bounds[dir]));
	        
	        let delta = this.items.map(d => baseline - d.bounds[dir]),
	            axis = dir == Alignment.TOP || dir == Alignment.Middle || dir == Alignment.Bottom ? "y" : "x";
	        this.items.forEach((d,i) => {
	            if (d.parent && d.parent.layout && d.parent.layout.type == LayoutType.Stack){
	                let dx = axis == "x" ? delta[i] : 0,
	                    dy = axis == "y" ? delta[i] : 0;
	                d.parent._doTranslate(dx, dy);
	            } else {
	                let dx = axis == "x" ? delta[i] : 0,
	                    dy = axis == "y" ? delta[i] : 0;
	                d._doTranslate(dx, dy);
	            }
	        });
	        //TODO:  update bounds
	        let itms = {};
	        this.items.forEach(d => itms[d.classId] = d);
	        Object.values(itms).forEach(d => d.getScene()._updateAncestorBounds(d)); 
	    }

	    toJSON() {
	        let json = {};
	        json.items = this.items.map(d => d.id);
	        json.direction = this.direction;
	        json.type = this.type;
	        json.id = this.id;
	        return json;
	    }
	}

	class AffixConstraint {

	    constructor(item, baseItem, scene, channel, itemAnchor, baseAnchor, offset) {
	        this.item = item;
	        this.baseItem = baseItem;
	        this.scene = scene;
	        this.channel = channel;
	        this.itemAnchor = itemAnchor;
	        this.baseAnchor = baseAnchor;
	        this.offset = offset;
	        this.type = ConstraintType.Affix;
	        this.id = this.type + "_" + this.item.classId + "_" + this.baseItem.classId + "_" + channel;
	    }

	    apply() {
	        let items = getPeers(this.item, this.scene), baseItems = getPeers(this.baseItem, this.scene);
	        //console.log(items.map(d => d.text), baseItems.map(d => d.dataScope.getFieldValue("event_attribute")));
	        let ia = this.itemAnchor,
	            ba = this.baseAnchor;

	        let isText = this.item.type == ItemType.PointText ? true : false;
	        if (this.channel == "radialDistance") {
	            for (let i = 0; i < items.length; i++) {
	                let dist, base = baseItems[i], item = items[i];
	                if (base.type == ItemType.Arc || base.type == ItemType.Ring)
	                    dist = ba == "top" ? base.outerRadius + this.offset : ba == "bottom" ? base.innerRadius + this.offset : (base.outerRadius + base.innerRadius)/2 + this.offset;
	                else if (base.type == ItemType.Circle)
	                    dist = ba == "top" ? base.radius + this.offset : ba == "bottom" ? this.offset : base.radius/2 + this.offset;
	                item._doTranslate( base.x - item.x, base.y - dist - item.bounds[ia] );
	                if (item._rotate) {
	                    item._rotate = [item._rotate[0], base.x, base.y];
	                } else {
	                    item._rotate = [0, base.x, base.y];
	                }
	            }
	        } else if (this.channel == "angle") {
	            for (let i = 0; i < items.length; i++) {
	                let angle, base = baseItems[i], item = items[i];
	                if (base.type == ItemType.Arc) {
	                    angle = ba == "left" ? base.endAngle + this.offset : ba == "center" ?  base.startAngle + base.angle/2 + this.offset : base.startAngle + this.offset;
	                } else {
	                    angle = 90;
	                }
	                // switch (ba) {
	                //     case "left":
	                //         angle = base.endAngle ? base.endAngle + this.offset : 90;
	                //         break;
	                //     case "center":
	                //         angle = base.startAngle ? base.startAngle + base.angle/2 + this.offset : 90;
	                //         break;
	                //     case "right":
	                //         angle = base.startAngle ? base.startAngle + this.offset : 90;
	                //         break;
	                // }
	                if (item._rotate) {
	                    item._rotate[0] = 90 - angle;
	                } else {
	                    item._doTranslate( base.x - item.bounds[ia], base.y - items[i].y );
	                    item._rotate = [90 - angle, baseItems[i].x, baseItems[i].y];
	                }
	            }
	        } else {
	            let frac;
	            if (this.baseItem.type == ItemType.Link) {
	                switch(ba) {
	                    case "left":
	                    case "top":
	                        frac = 0;
	                        break;
	                    case "center":
	                    case "middle":
	                        frac = 0.5;
	                        break;
	                    case "right":
	                    case "bottom":
	                        frac = 1;
	                        break;
	                }
	            }
	            for (let i = 0; i < items.length; i++) {
	                let p = this.baseItem.type == ItemType.Link ? baseItems[i].getPointAt(frac)[this.channel] : baseItems[i].bounds[ba] + this.offset;
	                if (isText) {
	                    items[i].anchor[this.channel == "x" ? 0 : 1] = this.itemAnchor;
	                    items[i][this.channel] = p;
	                } else {
	                    if (this.channel == "x")
	                        items[i]._doTranslate(p - items[i].bounds[ia], 0);
	                    else
	                        items[i]._doTranslate(0, p - items[i].bounds[ia]);
	                }
	            }
	        }
	        
	        this.item.getScene()._updateAncestorBounds(this.item);
	        this.baseItem.getScene()._updateAncestorBounds(this.baseItem); 
	        
	        // if (isText) {
	        //     for (let i = 0; i < items.length; i++) {
	        //         items[i].anchor[this.channel == "x" ? 0 : 1] = this.itemAnchor;
	        //         let p = baseItems[i].bounds[ba] + this.offset;
	        //         items[i][this.channel] = p;
	        //     }
	        // } else {
	        //     for (let i = 0; i < items.length; i++) {
	        //         let d = baseItems[i].bounds[ba] + this.offset - items[i].bounds[ia];
	        //         if (this.channel == "x")
	        //             items[i]._doTranslate(d, 0);
	        //         else
	        //             items[i]._doTranslate(0, d);
	        //     }
	        // }
	    }

	    toJSON() {
	        let json = {};
	        json.item = this.item.id;
	        json.baseItem = this.baseItem.id;
	        json.channel = this.channel;
	        json.itemAnchor = this.itemAnchor;
	        json.baseAnchor = this.baseAnchor;
	        json.offset = this.offset;
	        json.type = "affixation";
	        json.id = this.id;
	        return json;
	    }
	}

	class Gridlines extends Group {

	    constructor(encoding, item, args) {
	        super();
	        this.type = ItemType.Gridlines;
	        this.id = this.type + ItemCounter[this.type]++;

	        this.encoding = encoding;
	        this.channel = this.encoding.channel;
	        this._item = item;

	        this._strokeColor = ("strokeColor" in args) ? args["strokeColor"] : "#ddd";
	        this._strokeWidth = ("strokeWidth" in args) ? args["strokeWidth"] : 1;
	        
	        if (this.channel == "radialDistance"){
	            if("angle" in args){
	                this._rotate = [-args["angle"], this.encoding.x, this.encoding.y];
	            }
	        }
	    }

	    toJSON(){
	        let json = {args: {}};
			json.type = this.type;
			json.id = this.id;
	        json.args.strokeColor = this._strokeColor;
	        json.args.strokeWidth = this._strokeWidth;
	        json.args.values = this._values;
	        if (this.encoding.scale.type === "time") {
	            json.args.isDate = true;
	        }
	        json.channel = this.encoding.channel;
	        json.field = this.encoding.field;
	        if (this._rotate)
	            json.args.angle = this._rotate[0];
	        return json;
	    }

	    get values() {
	        return this._values;
	    }

	    set values(values) {
	        this._values = values;
	        this.updateLines();
	        this.updateLinePositions();
	    }

	    get strokeColor() {
	        return this._strokeColor;
	    }

	    set strokeColor(c) {
	        this._strokeColor = c;
	        for (let p of this.children)
	            p.strokeColor = c;
	    }

	    get strokeWidth() {
	        return this._strokeWidth;
	    }

	    set strokeWidth(w) {
	        this._strokeWidth = w;
	        for (let p of this.children)
	            p.strokeWidth = w;
	    }

	    matches(item) {
	        let k = getEncodingKey(item).split("_")[0],
	            encodings = this.encoding.scale.encodings;
	        for (let enc of encodings) {
	            let classId = getEncodingKey(enc.anyItem).split("_")[0];
	            if (classId === k)
	                return true;
	        }
	        return false;
	    }

	    updateLinePositions() {
	        let container = getTopLevelCollection(this._item) ? getTopLevelCollection(this._item) : getTopLevelGroup(this._item);
	        if (this.channel == "x" || this.channel == "width") {
	            let bounds = container.bounds,
	                range = this.encoding.getScaleRange(this._item);
	            for (let [i, l] of this.children.entries()) {
	                let x = range[0] + this.encoding.scale.map(this._values[i]) - this.encoding.scale.range[0];
	                l._setVertices([[x, bounds.top], [x, bounds.bottom]]);
	            }
	        } else if (this.channel == "y" || this.channel == "height") {
	            let bounds = container.bounds,
	            range = this.encoding.getScaleRange(this._item);
	            if (this.encoding.flip) {
	                for (let [i, l] of this.children.entries()) {
	                    let y = range[1] - this.encoding.scale.map(this._values[i]) + this.encoding.scale.range[0];
	                    l._setVertices([[bounds.left, y], [bounds.right, y]]);
	                }
	            } else {
	                for (let [i, l] of this.children.entries()) {
	                    let y = range[0] - this.encoding.scale.map(this._values[i]) + this.encoding.scale.range[0];
	                    l._setVertices([[bounds.left, y], [bounds.right, y]]);
	                }
	            }
	        } else if (this.channel == "radialDistance") {
	            for (let [i, c] of this.children.entries()) {
	                c.x = this._item.parent.x;
	                c.y = this._item.parent.y;
	                c.radius = this.encoding.scale.map(this._values[i]);
	            }
	        }
	        for (let c of this.children)
	            c._updateBounds();
	        this._updateBounds();
	    }

	    updateLines() {
	        this.children = [];
	        if (this.channel == "x" || this.channel == "y" || this.channel == "width" || this.channel == "height") {
	            for (let i = 0; i < this._values.length; i++) {
	                let t = new Path ({"strokeColor": this._strokeColor, "fillColor": "none", "strokeWidth": this._strokeWidth});
	                t.type = ItemType.Line;
	                t.id = this.id + "line" + i;
	                this.addChild(t);
	            }
	        } else if (this.channel == "radialDistance") {
	            for (let i = 0; i < this._values.length; i++) {
	                let t = new CirclePath({"strokeColor": this._strokeColor, "fillColor": "none", "strokeWidth": this._strokeWidth});
	                t.type = ItemType.Circle;
	                t.id = this.id + "line" + i;
	                this.addChild(t);
	            }
	        }
	    }

	}

	class Collection extends Group{

		constructor() {
			super();
			this.type = ItemType.Collection;
			this._id = this.type + ItemCounter[this.type]++;
			this.classId = this.id;
		}

		duplicate() {
			let coll = this.getScene().collection();
			for (let i = 0; i < this.children.length; i++) {
				let c = this.children[i];
				coll.addChild(c.duplicate());
			}
			coll.classId = this.classId;
			this.parent.addChild(coll);
			if (this._layout) {
				let layout = this._layout.clone();
				coll.layout = layout;
			}
			return coll;
		}
		
	}

	class ArcPath extends Path {
		
		constructor(args) {
			super(args);
			
			this._type = ItemType.Arc;
			this.closed = true;
			this._x = "x" in args ? args.x : 0;
			this._y = "y" in args ? args.y : 0;
			this._innerRadius = "innerRadius" in args ? args.innerRadius : 100;
	        this._outerRadius = "outerRadius" in args ? args.outerRadius : 200;
	        this._startAngle = "startAngle" in args ? args.startAngle : 0;
	        this._endAngle = "endAngle" in args ? args.endAngle : 90;
	        this._sr = degree2radian(this._startAngle);
	        this._er = degree2radian(this._endAngle);

	        let isx = this._x + this._innerRadius * Math.cos(this._sr), isy = this._y - this._innerRadius * Math.sin(this._sr),
	            iex = this._x + this._innerRadius * Math.cos(this._er), iey = this._y - this._innerRadius * Math.sin(this._er),
	            osx = this._x + this._outerRadius * Math.cos(this._sr), osy = this._y - this._outerRadius * Math.sin(this._sr),
	            oex = this._x + this._outerRadius * Math.cos(this._er), oey = this._y - this._outerRadius * Math.sin(this._er);
	        this._setVertices([[isx, isy], [osx, osy], [oex, oey], [iex, iey]]);
		}

	    get type() {
	        return this._innerRadius === 0 ? ItemType.Pie : ItemType.Arc;
	    }

	    set type(t) {
	        this._type = t;
	    }

		get innerRadius() {
			return this._innerRadius;
		}

	    set innerRadius(r) {
			this._innerRadius = r;
	        this.vertices[0].x = this._x + this._innerRadius * Math.cos(this._sr);
	        this.vertices[0].y = this._y - this._innerRadius * Math.sin(this._sr);
	        this.vertices[3].x = this._x + this._innerRadius * Math.cos(this._er);
	        this.vertices[3].y = this._y - this._innerRadius * Math.sin(this._er);
	        this._updateBounds();
		}

	    get outerRadius() {
			return this._outerRadius;
		}

	    get thickness() {
	        return this._outerRadius - this._innerRadius;
	    }

	    set outerRadius(r) {
			this._outerRadius = r;
	        this.vertices[1].x = this._x + this._outerRadius * Math.cos(this._sr);
	        this.vertices[1].y = this._y - this._outerRadius * Math.sin(this._sr);
	        this.vertices[2].x = this._x + this._outerRadius * Math.cos(this._er);
	        this.vertices[2].y = this._y - this._outerRadius * Math.sin(this._er);
			this._updateBounds();
		}

		get x() {
			return this._x;
		}

		get y() {
			return this._y;
		}

		get center() {
			return new Point(this._x, this._y);
		}

		set x(v) {
			this._x = v;
	        this.vertices[0].x = this._x + this._innerRadius * Math.cos(this._sr);
	        this.vertices[1].x = this._x + this._outerRadius * Math.cos(this._sr);
	        this.vertices[2].x = this._x + this._outerRadius * Math.cos(this._er);
	        this.vertices[3].x = this._x + this._innerRadius * Math.cos(this._er);
			this._updateBounds();
		}

		set y(v) {
			this._y = v;
	        this.vertices[0].y = this._y - this._innerRadius * Math.sin(this._sr);
	        this.vertices[1].y = this._y - this._outerRadius * Math.sin(this._sr);
	        this.vertices[2].y = this._y - this._outerRadius * Math.sin(this._er);
	        this.vertices[3].y = this._y - this._innerRadius * Math.sin(this._er);
			this._updateBounds();
		}

		get startAngle() {
	        return this._startAngle;
	    }

	    get endAngle() {
	        return this._endAngle;
	    }

	    get angle() {
	        if (this._endAngle < this._startAngle) {
	            return this._endAngle + 360 - this._startAngle;
	        } else {
	            return this._endAngle - this._startAngle;
	        }
	    }

	    //if the sweep angle of this arc contains the arc argument
	    sweepOver(arc) {
	        let as = this.startAngle, ae = this.endAngle;
	        if (ae < as)    ae += 360;
	        let bs = arc.startAngle, be = arc.endAngle;
	        if (be < bs)    be += 360;
	        return bs >= as && bs <= ae && be >= as && be <= ae;
	    }

		_doTranslate(dx, dy) {
			this._x += dx;
			this._y += dy;
	        this.vertices[0].x = this._x + this._innerRadius * Math.cos(this._sr);
	        this.vertices[0].y = this._y - this._innerRadius * Math.sin(this._sr);
	        this.vertices[1].x = this._x + this._outerRadius * Math.cos(this._sr);
	        this.vertices[1].y = this._y - this._outerRadius * Math.sin(this._sr);
	        this.vertices[2].x = this._x + this._outerRadius * Math.cos(this._er);
	        this.vertices[2].y = this._y - this._outerRadius * Math.sin(this._er);
	        this.vertices[3].x = this._x + this._innerRadius * Math.cos(this._er);
	        this.vertices[3].y = this._y - this._innerRadius * Math.sin(this._er);
			this._updateBounds();
		}

		_updateBounds() {		
			this._bounds = new Rectangle(this._x - this._outerRadius, this._y - this._outerRadius, this._outerRadius * 2, this._outerRadius * 2);
		}

		copyPropertiesTo(target) {
			super.copyPropertiesTo(target);
			target._x = this._x;
			target._y = this._y;
			target._innerRadius = this._innerRadius;
	        target._outerRadius = this._outerRadius;
	        target._startAngle = this._startAngle;
	        target._endAngle = this._endAngle;
	        target._sr = this._sr;
	        target._er = this._er;
		}

	    getSVGPathData() {
	        let angle = this._endAngle < this._startAngle? this._endAngle + 360 - this._startAngle : this._endAngle - this._startAngle, 
	            largeArc = angle > 180 ? 1 : 0;
	        let cmds = [
	            "M " + this.vertices[0].x + ", " + this.vertices[0].y,
	            "L " + this.vertices[1].x + ", " + this.vertices[1].y,
	            "A " + [this._outerRadius, this._outerRadius, angle, largeArc, 0, this.vertices[2].x, this.vertices[2].y].join(" "),
	            "L " + this.vertices[3].x + ", " + this.vertices[3].y,
	            "A " + [this._innerRadius, this._innerRadius, angle, largeArc, 1, this.vertices[0].x, this.vertices[0].y].join(" ")
	        ];
	        return cmds.join(" ");
	    }

	    adjustAngle(startAngle, endAngle) {
	        this._startAngle = startAngle;
	        this._endAngle = endAngle;
	        this._sr = degree2radian(this._startAngle);
	        this._er = degree2radian(this._endAngle);

	        this.vertices[0].x = this._x + this._innerRadius * Math.cos(this._sr);
	        this.vertices[0].y = this._y - this._innerRadius * Math.sin(this._sr);
	        this.vertices[1].x = this._x + this._outerRadius * Math.cos(this._sr);
	        this.vertices[1].y = this._y - this._outerRadius * Math.sin(this._sr);
	        this.vertices[2].x = this._x + this._outerRadius * Math.cos(this._er);
	        this.vertices[2].y = this._y - this._outerRadius * Math.sin(this._er);
	        this.vertices[3].x = this._x + this._innerRadius * Math.cos(this._er);
	        this.vertices[3].y = this._y - this._innerRadius * Math.sin(this._er);
	    }
	}

	class Image extends Mark {

	    constructor(args) {
			super(args);
			this.type = ItemType.Image;
	        this._src = args.src;
	        this._x = "x" in args ? args.x : 0;
	        this._y = "y" in args ? args.y : 0;
	        this._width = "width" in args ? args.width : 100;
	        this._height = "height" in args ? args.height: 100;
	    }

	    toJSON() {
	        let json = super.toJSON();
	        json.src = this._src;
	        json.x = this._x;
	        json.y = this._y;
	        json.width = this._width;
	        json.height = this._height;
	        return json;
	    }


	    get src() {
	        return this._src;
	    }

	    set src(s) {
	        this._src = s;
	    }

	    get width() {
	        return this._width;
	    }

	    set width(w) {
	        this._width = w;
	        this._updateBounds();
	    }

	    get height() {
	        return this._height;
	    }

	    set height(h) {
	        this._height = h;
	        this._updateBounds();
	    }

	    get x() {
	        return this._x;
	    }

	    set x(v) {
	        this._x = v;
	        this._updateBounds();
	    }

	    get y() {
	        return this._y;
	    }

	    set y(v) {
	        this._y = v;
	        this._updateBounds();
	    }

	    get bounds() {
			if (!this._bounds)
				this._updateBounds();
			return this._bounds;
		}

	    _updateBounds() {		
			this._bounds = new Rectangle(this._x, this._y, this._width, this._height);
		}

	    copyPropertiesTo(target) {
			target.attrs = Object.assign({}, this.attrs);
			target.styles = Object.assign({}, this.styles);
			
			if (this._dataScope)
				target._dataScope = this._dataScope.clone();
			
	        target.x = this._x;
	        target.y = this._y;
	        target.width = this._width;
	        target.height = this._height;
	        target.src = this._src;
		}

	    _doTranslate(dx, dy) {
	        this._x += dx;
	        this._y += dy;
	        this._updateBounds();
	    }
	}

	class Link extends Path {

	    constructor(args) {
	        super(args);

	        this.type = ItemType.Link;
	        this.mode = "mode" in args ? args.mode : "linear";

	        this.source = undefined;
	        this.target = undefined;

	        this.sourceAnchor = "sourceAnchor" in args ? args.sourceAnchor : ["center", "middle"];
	        this.targetAnchor = "targetAnchor" in args ? args.targetAnchor : ["center", "middle"];
	        this.sourceOffset = "sourceOffset" in args ? args.sourceOffset : [0, 0];
	        this.targetOffset = "targetOffset" in args ? args.targetOffset : [0, 0];
	    }


	    //Implemented according to bezier curve implementation in d3
	    // https://github.com/d3/d3-shape/blob/main/src/link/index.js
	    radialvalue(x, y) {
	        let xBar = x- Math.PI / 2;
	        x = y * Math.cos(xBar);
	        y = y * Math.sin(x);
	        return [x, y];
	    }

	    bezierCurveHorizontal(x1, y1, x2, y2) {
	        return `M ${x1} ${y1} C ${(x1+x2)/2} ${y1} ${x1} ${y2} ${x2} ${y2}`
	    }

	    bezierCurveVertical(x1, y1, x2, y2) {
	        return `M ${x1} ${y1} C ${x1} ${(y1+y2)/2} ${x2} ${y1} ${x2} ${y2}`
	    }

	    bezierCurveRadial(x1, y1, x2, y2) {
	        let r0 = this.radialvalue(x1, y1),
	            r1 = this.radialvalue(x1, (y1 + y2) / 2),
	            r2 = this.radialvalue(x2, y1),
	            r3 = this.radialvalue(x2, y2);

	        return `M ${r0[0]} ${r0[1]} C ${r1[0]} ${r1[1]} ${r2[0]} ${r2[1]} ${r3[0]} ${r3[1]}`
	    }

	    _updateBounds() {
	        if (this.source != undefined && this.target != undefined){
	            let x1 = this.source.bounds[this.sourceAnchor[0]] + this.sourceOffset[0],
	                y1 = this.source.bounds[this.sourceAnchor[1]] + this.sourceOffset[1],
	                x2 = this.target.bounds[this.targetAnchor[0]] + this.targetOffset[0],
	                y2 = this.target.bounds[this.targetAnchor[1]] + this.targetOffset[1];
	            this._bounds = new Rectangle(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x1 - x2), Math.abs(y1 - y2));
	        } else {
	            this._bounds = new Rectangle(0,0,0,0);
	        }
	    }


	    getSVGPathData() {
	        if (this.source === undefined || this.target === undefined)
	            return "";
	        let x1 = this.source.bounds[this.sourceAnchor[0]] + this.sourceOffset[0],
	            y1 = this.source.bounds[this.sourceAnchor[1]] + this.sourceOffset[1],
	            x2 = this.target.bounds[this.targetAnchor[0]] + this.targetOffset[0],
	            y2 = this.target.bounds[this.targetAnchor[1]] + this.targetOffset[1];
	        switch (this.mode) {
	            case "curveHorizontal":
	                return this.bezierCurveHorizontal(x1, y1, x2, y2);
	            case "curveVertical":
	                return this.bezierCurveVertical(x1, y1, x2, y2);
	            case "linear":
	            default:
	                return `M ${x1} ${y1} L ${x2} ${y2}`;
	        }
	    }

	    copyPropertiesTo(target) {
	        super.copyPropertiesTo(target);
	        target.sourceAnchor = this.sourceAnchor.slice();
	        target.targetAnchor = this.targetAnchor.slice();
	        target.sourceOffset = this.sourceOffset.slice();
	        target.targetOffset = this.targetOffset.slice();
	        target.mode = this.mode;
	    }

	    getPointAt(frac) {
	        const svg = SVGProvider.getSVG();
	        let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	        path.setAttribute("d", this.getSVGPathData());
	        svg.appendChild(path);
	        let len = path.getTotalLength();
	        return path.getPointAtLength(len * frac);
	    }
	}

	function bindToLink(encoding){

	    encoding._query = function() {
	        let field = this.field, channel = this.channel, items = this.items;
			let dataScopes = items.map(d => d.dataScope);

	        // if (channel == "source" || channel == "target") {
	        //     //data are marks in the scene representing the nodes
	        //     let nodeIds = dataScopes.map(d => d.getFieldValue(field));
	        //     let scene = this.scene;
	        //     this.data = [];
	        //     for (let id of nodeIds) {
	        //         let r = scene.find([{field: nodeId, value: id}]);
	        //         //since we assign data scopes to collections when repeating, need to filter out collections
	        //         r = r.filter(d => d.type !== ItemType.Collection);
	        //         this.data.push(r[0]);
	        //     }
	        // } else 
	        if (channel == "strokeWidth") {
	            if (this.datatable.hasField(field)) {
	                this.data = dataScopes.map(d => d.getFieldValue(field));
	            } else if (field.startsWith("parent.") || field.startsWith("child.")) {
	                let dt = this.datatable.tree.nodeTable;
	                let s = field.split(".")[0], f = field.split(".")[1];
	                let nodeIds = dataScopes.map(d => d.getFieldValue(s));
	                this.data = nodeIds.map(d => (new DataScope(dt)).cross(nodeId, d).getFieldValue(f));
	            }
	        }
	    };

	    encoding._map = function() {
	        let channel = this.channel, items = this.items;
	        let scale;
	        if (channel == "strokeWidth") {
	            scale = createScale(this.scaleType);
	            scale.domain = [0, Math.max(...this.data)];
	            let min, max;
	            min = 1;
				max = Math.max(...(items.map(d => parseFloat(d.styles.strokeWidth))));
				if (max == min)
					max = min + 5;
	                if (this.rangeExtent)
					max = min + this.rangeExtent;
				if (this.range) {
					min = this.range[0];
					max = this.range[1];
				}
				scale._setRange([min, max]);

	            if (this.scale); else {
	                this.scale = scale;
	            }
	            this.scale._addEncoding(this);
	        }
	        
	    };

	    encoding._apply = function() {  
	        let channel = this.channel;
	        // if (channel == "source" || channel == "target") {
	        //     for (let i = 0; i < this.data.length; i++) {
	        //         this.items[i][this.channel] = this.data[i];
	        //         this.items[i]._updateBounds();
	        //     }
	        // } else 
	        if (channel == "strokeWidth") {
	            for (let i = 0; i < this.data.length; i++) {
	                this.items[i].styles.strokeWidth = this.scale.map(this.data[i]);
	            }
	        }
	    };

	    encoding.run();
		return encoding;
	}

	const SceneValidator = {

	    itemTranslated: function(item, dx, dy) {
	        let scene = item.getScene();
	        if (!isGuide(item))
				scene._reapplyConstraints(item);

	        let axes = scene.getRelatedAxes(item);
			axes.forEach(a => {
				if (a.encoding && a.encoding.scale.offset !== undefined)
					a.encoding.scale.offset += a.channel === "x" || a.channel === "width" ? dx : dy;
	            if (dy !== 0 && (a.channel === "x" || a.channel === "width") && a._posArg !== undefined) {
	                a._posArg = a._posArg + dy;
	            }
	            if (dx !== 0 && (a.channel === "y" || a.channel === "height") && a._posArg !== undefined) {
	                a._posArg = a._posArg + dx;
	            }
				a.reposition();
			});
			let gl = scene.getRelatedGridlines(item);
			gl.forEach(l => l.updateLinePositions());
	    },

	    layoutChanged: function(item, peers, reGenerateAxes) {
	        let scene = item.getScene();
	        scene._relayoutAncestors(item, peers);

	        let items = [item], c = item.firstChild;
	        while (c) {
	            items.push(c);
	            c = c.firstChild;
	        }
	        for (let i of items)
				i.getScene()._reapplyConstraints(i);

	        if (reGenerateAxes) {
	            scene.reCreateRelatedAxes(item);
	        } else {
	            let axes = scene.getRelatedAxes(item);
	            axes.forEach(a => a.reposition());
	        }

	        let gl = scene.getRelatedGridlines(item);
			gl.forEach(l => l.updateLinePositions());
	    },

	    scaleDomainSet: function(scale) {
	        for (let enc of scale.encodings) {
				enc._map();
				enc._apply();
			}

	        for (let enc of scale.encodings) {
				enc.scene._updateAncestorBounds(enc.item, enc.items);
			}
			//reapply constraints
			let items = scale.encodings.map( d => d.anyItem), classId2item = {};
			for (let item of items) {
				if (item.type === "vertex" || item.type === "segment")
					classId2item[item.parent.classId] = item.parent;
				else
					classId2item[item.classId] = item;
			}
			for (let i of Object.values(classId2item))
				i.getScene()._reapplyConstraints(i);

	        for (let enc of scale.encodings) {
	            let item = enc.anyItem;
	            let axes = enc.scene.getRelatedAxes(item);
	            for (let a of axes) {
	                if (a.encoding && a.encoding.scale === scale) {
	                    a.tickValues = enc.scene._inferTickValues(enc);
	                    a.labelValues = enc.scene._inferTickValues(enc);
	                    a._positionPath();
	                    if (a._showTitle)
	                        a._positionTitle();
	                    if (a._channel === "radialDistance" && a._rotate){
	                        a._rotate = [a._rotate[0], a._item.parent.x, a._item.parent.y];
	                    }
	                    a._updateBounds();
	                }
	            }
	            let gl = enc.scene.getRelatedGridlines(item);
	            gl.forEach(l => l.updateLinePositions());
	        }
	    },

	    scaleRangeSet: function(scale) {
	        for (let enc of scale.encodings) {
				//enc._map();
				enc._apply();
			}

	        for (let enc of scale.encodings) {
				enc.scene._updateAncestorBounds(enc.item, enc.items);
			}
			//reapply constraints
			let items = scale.encodings.map( d => d.anyItem), classId2item = {};
			for (let item of items) {
				if (item.type === "vertex" || item.type === "segment")
					classId2item[item.parent.classId] = item.parent;
				else
					classId2item[item.classId] = item;
			}
			for (let i of Object.values(classId2item))
				i.getScene()._reapplyConstraints(i);

	        for (let enc of scale.encodings) {
	            let item = enc.anyItem;
	            let axes = enc.scene.getRelatedAxes(item);
	            axes.forEach(a => a.reposition());
	            let gl = enc.scene.getRelatedGridlines(item);
	            gl.forEach(l => l.updateLinePositions());
	        }
	    },
	    
	    itemResized: function(item, peers) {
	        let scene = item.getScene();
	        scene._relayoutAncestors(item, peers);
			scene._reapplyConstraints(item);
	        let axes = scene.getRelatedAxes(item);
	        axes.forEach(a => a.reposition());
	        let gl = scene.getRelatedGridlines(item);
	        gl.forEach(l => l.updateLinePositions());
	    },

	    markDivided: function(path, collection) {
	        let scene = collection.getScene();
	        let e = scene.encodings[getEncodingKey(path)];
	        if (e) {
	            scene.encodings[getEncodingKey(collection)] = {};
	            for (let channel of ["x", "y"]) {
	                const enc = e[channel];
	                if (!enc)
	                    continue;
	                enc.anyItem = collection;
	                enc.items = getPeers(collection, scene);
	                scene.encodings[getEncodingKey(collection)][channel] = enc;
	                delete scene.encodings[getEncodingKey(path)][channel];
	            }
	            if (Object.keys(e) === 0)
	                delete scene.encodings[getEncodingKey(path)];
	        }
	        //TODO: update constraints
	    },

	    areaRebased: function(item) {
	        let scene = item.getScene();
	        let encodings = scene.encodings[getEncodingKey(item)];
	        for (let channel in encodings) {
	            encodings[channel]._apply();
	        }
	        let axes = scene.getRelatedAxes(item);
	        axes.forEach(a => a.reposition());
	        let gl = scene.getRelatedGridlines(item);
	        gl.forEach(l => l.updateLinePositions());
	    }
	};

	function repopulateItem(scene, compnt, field, datatable) {
	    let type = datatable.getFieldType(field);

		if (type != DataType.String && type != DataType.Date && type != DataType.Integer) {
			throw new Error(Errors.REPOPULATE_BY_NONCAT + ": " + field + " is " + type);
		}

	    if (compnt.parent && compnt.parent.dataScope && !compnt.parent.dataScope.isFullTable() && compnt.parent.dataScope.dataTable != datatable) {
	        throw new Error(Errors.REPOPULATE_DT_MISMATCH);
	    }

	    return _doRopulate(scene, compnt, field, datatable);
	}

	function _doRopulate(scene, item, field, datatable) {
	    
		//assuming parent is a collection
	    let peers = getPeers(item.parent, scene);
	    if (peers.length === 1) {
	        item.parent.dataScope = undefined;
	    }
	    for (let coll of peers) {
	        let ds = datatable.getFieldSummary(field).unique.map(d => coll.dataScope ? coll.dataScope.cross(field, d) : new DataScope(datatable).cross(field, d));
	        ds = ds.filter(d => !d.isEmpty());
	        const toAdd = ds.length - coll.children.length, toRemove = coll.children.length - ds.length;
	        for (let i = 0; i < toRemove; i++) {
	            coll.removeChildAt(coll.children.length - 1); 
	        }
	        const numPeers = coll.children.length;
	        for (let i = 0; i < toAdd; i++) {
	            let c = coll.children[Math.floor(Math.random()*numPeers)].duplicate();
	            coll.addChild(c);
	        }
	        coll.children.forEach((d, i) => d.dataScope = ds[i]);
	    }
	    scene._relayoutAncestors(item);
	    

	    //TODO: remove encodings;
	}

	/** 
	 * Binding data to thickness for arcs and rings
	*/

	function addToTree(node, arc) {
		let itm = node.item;
		if (arc.innerRadius === itm.outerRadius && itm.sweepOver(arc)) {
			node.children.push({item: arc, children: []});
			return;
		} else if (node.children && node.children.length > 0 && arc.innerRadius > itm.outerRadius && itm.sweepOver(arc)) {
			for (let c of node.children)
				addToTree(c, arc);
		}
	}

	function accumulateThickness(node, offset, data, scale) {
		let itm = node.item;
		itm.innerRadius = offset;
		itm.outerRadius = offset + scale.map(data[itm.id]);
		if (node.children && node.children.length > 0) {
			for (let c of node.children) {
				accumulateThickness(c, itm.outerRadius, data, scale);
			}
		}
	}

	function bindToThickness(encoding){

	    encoding._query = function() {
	        this.data = {};
			
			let field = this.field, items = this.items;
			let dataScopes = items.map(d => d.dataScope);

			switch (this.datatable.getFieldType(field)) {
				case DataType.Boolean:
					break;

				case DataType.Date:
					for (let i = 0; i < items.length; i++) {
						this.data[items[i].id] = dataScopes[i].getFieldValue(field);
					}
					//this.data = dataScopes.map(d => d.getFieldValue(field));
					break;

				case DataType.String:
					try {
						for (let i = 0; i < items.length; i++) {
							this.data[items[i].id] = dataScopes[i].getFieldValue(field);
						}
						//this.data = dataScopes.map(d => d.getFieldValue(field));
					} catch (error) {
						throw new Error("Cannot bind " + this.channel + " to " + field + " : " + error);
					}
					break;

				default: //integer or number
					for (let i = 0; i < items.length; i++) {
						this.data[items[i].id] = dataScopes[i].aggregateNumericalField(field, this.aggregator);
					}
					//this.data = dataScopes.map(d => d.aggregateNumericalField(field, this.aggregator));
					break;
			}
	    };

	    encoding._map = function() {
			let data = this.data;
			if (!this.scale){
				this.scale = createScale(this.scaleType);
				this.scale.domain = [0, Math.max(...Object.values(data))];
				let min = 1, max = this.rangeExtent ? min + this.rangeExtent : Math.max(...(this.items.map(d => d.outerRadius)));
				this.scale._setRange([min, max]);
			}
			this.scale._addEncoding(this);
		};

		

	    encoding._apply = function() {
			//sort items by centroid
			this.items.sort((a, b) => (a.innerRadius+a.outerRadius)/2 - (b.innerRadius+b.outerRadius)/2);
			let tree = {item: new ArcPath({outerRadius: 0, startAngle: 0, endAngle: 360}), children: []};
			for (let itm of this.items) {
				addToTree(tree, itm);
			}
			
			for (let node of tree.children)
				accumulateThickness(node, node.item.innerRadius, this.data, this.scale);

			// //relayout if needed
			// this.scene._relayoutAncestors(this.anyItem, this.items);
		};

	    encoding.run();
		return encoding;
	}

	const depth = "_depth";

	class Tree {

	    constructor(data, name) {
	        this._type = "tree";
	        let nodeArr = [];
	        let linkArr = [];

	        this._nodeHash = {};

	        this._traverse(data, nodeArr, linkArr);

	        this._nodeTable = new DataTable(nodeArr, "nodes");
	        this._linkTable = new DataTable(linkArr, "links");

	        this._nodeTable.tree = this;
	        this._linkTable.tree = this;
	        this._data = data;
	        this.aggregateFromLeaves("value", "average");
	    }

	    get type() {
	        return this._type;
	    }

	    _traverse(data, nodes, links, d = 0) {
	        let node = {};
	        if (!(nodeId in data))
	            data[nodeId] = "n" + nodes.length;
	        nodes.push(node);
	        data[depth] = d;
	    
	        for (let k in data) {
	            if (k == "children" && data[k] && data[k].length > 0) {
	                for (let c of data[k]) {
	                    let id = this._traverse(c, nodes, links, d + 1);
	                    links.push({
	                        parent: data[nodeId],
	                        child: id
	                    });
	                }
	            } else
	                node[k] = data[k];
	        }
	        this._nodeHash[node[nodeId]] = node;
	        return node[nodeId];
	    }

	    getParent(node) {
	        let id = node[nodeId];
	        let parentId;
	        let links = this._linkTable["data"];
	        let nodes = this._nodeTable["data"];

	        for (let i in links) {
	            if (links[i]["child"] == id) {
	                parentId = links[i]["parent"];
	                let index = nodes.findIndex(x => x[nodeId] == parentId);
	                return nodes[index];
	            }
	        }
	    }

	    getChildren(node) {
	        let id = node[nodeId];
	        let children = [];
	        let links = this._linkTable["data"];
	        let nodes = this._nodeTable["data"];
	        for (let i in links) {
	            if (links[i]["parent"] == id) {
	                let childId = links[i]["child"];
	                let index = nodes.findIndex(x => x[nodeId] == childId);
	                children.push(nodes[index]);
	            }
	        }
	        return children;
	    }

	    getNodeDataScope(node) {
	        let ds = new DataScope(this._nodeTable);
	        return ds.cross(atlas_rowId, node[atlas_rowId]);
	    }

	    getMaxDepth() {
	        return this._nodeTable["_fieldSummaries"][depth]["max"];
	    }

	    getRoot() {
	        let nodes = this._nodeTable["data"];
	        return nodes[0]; // Due to recursive appending of nodes, last one is root
	    }

	    get nodeTable() {
	        return this._nodeTable;
	    }

	    get linkTable() {
	        return this._linkTable;
	    }

	    getNode(id) {
	        return this._nodeTable["data"].filter(d => d[nodeId] == id)[0];
	    }

	    sumLeaves(root, attr) {
	        if (!root) return 0;
	        let id = root[nodeId];
	        let children = [];
	        children = this.getChildren(root);

	        if (children && children.length > 0) {
	            let sum = 0;
	            for (let child of children) {
	                sum += this.sumLeaves(child, attr);
	            }
	            this.getNode(id)["sum" + attr] = sum;

	        } else this.getNode(id)["sum" + attr] = root[attr];
	        return root["sum" + attr];

	    }

	    countLeaves(root, attr) {
	        if (!root) return 0;
	        let id = root[nodeId];
	        let children = [];
	        children = this.getChildren(root);
	        let count = 0;
	        if (children && children.length > 0) {
	            for (let child of children) {
	                count += this.countLeaves(child, attr);
	            }
	        } else {
	            count = 1;
	        }
	        this.getNode(id)["count" + attr] = count;
	        return root["count" + attr];

	    }

	    averageLeaves(root, attr) {
	        if (!root) return 0;
	        let id = root[nodeId];
	        let children = [];
	        children = this.getChildren(root);
	        let sum = 0;
	        if (children && children.length > 0) {
	            for (let child of children) {
	                sum += this.averageLeaves(child, attr);
	            }
	            sum /= children.length;
	            // this.getNode(id)["median" + attr]
	            this.getNode(id)["average" + attr] = sum;
	        } else this.getNode(id)["average" + attr] = root[attr];
	        return root["average" + attr];
	    }

	    medianLeaves(root, attr) {
	        if (!root) return 0;
	        let id = root[nodeId];
	        let children = [];
	        children = this.getChildren(root);
	        let medianArr = [];
	        if (children && children.length > 0) {
	            for (let child of children) {
	                medianArr.push(this.medianLeaves(child, attr));
	            }
	            medianArr.sort(function (a, b) {
	                return a - b;
	            });

	            let mid = Math.floor(medianArr.length / 2);

	            if (medianArr.length % 2)
	                this.getNode(id)["median" + attr] = medianArr[mid];
	            else
	                this.getNode(id)["median" + attr] = (medianArr[mid - 1] + medianArr[mid]) / 2.0;
	        } else this.getNode(id)["median" + attr] = root[attr];
	        return root["median" + attr];

	    }

	    maxLeaves(root, attr) {
	        if (!root) return 0;
	        let id = root[nodeId];
	        let children = [];
	        children = this.getChildren(root);
	        let Arr = [];
	        if (children && children.length > 0) {
	            for (let child of children) {
	                Arr.push(this.maxLeaves(child, attr));
	            }

	            this.getNode(id)["max" + attr] = Math.max(...Arr);
	        } else this.getNode(id)["max" + attr] = root[attr];

	        return root["max" + attr];
	    }

	    minLeaves(root, attr) {
	        if (!root) return 0;
	        let id = root[nodeId];
	        let children = [];
	        children = this.getChildren(root);
	        let Arr = [];
	        if (children && children.length > 0) {
	            for (let child of children) {
	                Arr.push(this.minLeaves(child, attr));
	            }

	            this.getNode(id)["min" + attr] = Math.min(...Arr);
	        } else this.getNode(id)["min" + attr] = root[attr];
	        return root["min" + attr];

	    }

	    aggregateFromLeaves(attr, aggregator) {
	        let root = this.getRoot();
	        switch (aggregator) {

	            case "sum":
	                this.sumLeaves(root, attr);
	                break;

	            case "count":
	                this.countLeaves(root, attr);
	                break;

	            case "average":
	                this.averageLeaves(root, attr);
	                break;

	            case "median":
	                this.medianLeaves(root, attr);
	                break;

	            case "max":
	                this.maxLeaves(root, attr);
	                break;

	            case "min":
	                this.minLeaves(root, attr);
	        }
	    }

	}

	function stratifyItem(scene, compnt, direction, size, tree) {
	    switch (compnt.type) {
			// case ItemType.Line:
			// 	return _doLineDivide(scene, compnt, f, datatable);
			case ItemType.Circle:
				return _doCircleStratify(scene, compnt, direction, size, tree);
			case ItemType.Rect:
				return _doRectStratify(scene, compnt, direction, size, tree);
			// case ItemType.Pie:
			// 	return _doPieDivide(scene, compnt, orientation, f, datatable);
		}
	}

	function _doCircleStratify(scene, compnt, dir, sz, tree) {
		let toReturn, direction = dir ? dir : Direction.Outward, size = sz ? sz : 50;
		if (direction !== Direction.Inward && direction !== Direction.Outward) {
			throw Errors.UNKNOWN_DIRECTION + " " + direction;
		}
		let peers = getPeers(compnt, scene);
		let collClassId;
		peers.forEach(p => {
			let coll = scene.collection();
			coll.dataScope = undefined;
			if (collClassId == undefined)
				collClassId = coll.id;
			coll.classId = collClassId;
			let parent = p.parent;
			_addArcStrata(p, compnt.id, direction, size, tree, tree.getRoot(), coll, scene, true);
			coll.layout = layout("strata", {direction: direction, rootMark: p});
			parent.addChild(coll);
			
			if (p === compnt)
				toReturn = coll;
		});
		return toReturn;
	}

	function _addArcStrata(compnt, classId, direction, size, tree, node, coll, scene, isRoot) {
		if (isRoot) {
			compnt.dataScope = tree.getNodeDataScope(node);
			// console.log(mark.dataScope);
			compnt.classId = classId;
			coll.addChild(compnt);
		}
		let children = tree.getChildren(node);
		if (children.length === 0) return;
		let start = compnt.type === ItemType.Circle || compnt.type === ItemType.Ring ? 90 : compnt.startAngle,
			extent = compnt.type === ItemType.Circle || compnt.type === ItemType.Ring ? 360 : compnt.angle,
			angle = extent/children.length;
		for (let i = 0; i < children.length; i++) {
			let ir = compnt.type === ItemType.Circle ? compnt.radius : compnt.outerRadius;
			let mark;
			if (angle === 360) {
				mark = scene.mark("ring", {
					innerRadius: ir,
					outerRadius: ir + size,
					x: compnt.x,
					y: compnt.y,
					strokeColor: compnt.strokeColor,
					fillColor: compnt.fillColor,
					strokeWidth: compnt.strokeWidth,
					opacity: compnt.opacity
				});
			} else {
				mark = scene.mark("arc", {
					innerRadius: ir,
					outerRadius: ir + size,
					x: compnt.x,
					y: compnt.y,
					startAngle: normalizeAngle(start + angle * i),
					endAngle: normalizeAngle(start + angle * (i+1)),
					strokeColor: compnt.strokeColor,
					fillColor: compnt.fillColor,
					strokeWidth: compnt.strokeWidth,
					opacity: compnt.opacity
				});
			}
			mark.dataScope = tree.getNodeDataScope(children[i]);
			// console.log(mark.dataScope);
			mark.classId = classId;
			coll.addChild(mark);
			_addArcStrata(mark, classId, direction, size, tree, children[i], coll, scene);
		}
	}

	function _doRectStratify(scene, compnt, dir, sz, tree) {
		let toReturn, direction = dir ? dir : Direction.Down, size = sz ? sz : 50;
		if ([Direction.Up, Direction.Down, Direction.Left, Direction.Right].indexOf(direction) < 0) {
			throw Errors.UNKNOWN_DIRECTION + " " + direction;
		}
		let peers = getPeers(compnt, scene);
		let collClassId;
		peers.forEach(p => {
			let coll = scene.collection();
			coll.dataScope = undefined;
			if (collClassId == undefined)
				collClassId = coll.id;
			coll.classId = collClassId;
			let parent = p.parent;
			_addRectStrata(p, compnt.id, direction, size, tree, tree.getRoot(), coll, scene, true);
			coll.layout = layout("strata", {direction: direction, rootMark: p});
			parent.addChild(coll);
			
			if (p === compnt)
				toReturn = coll;
		});
		return toReturn;
	}

	function _addRectStrata(compnt, classId, direction, size, tree, node, coll, scene, isRoot) {
		if (isRoot) {
			compnt.dataScope = tree.getNodeDataScope(node);
			compnt.classId = classId;
			coll.addChild(compnt);
		}
		let children = tree.getChildren(node);
		if (children.length === 0) return;
		let x, y, width;
		switch (direction) {
			case Direction.Up:
			case Direction.Down:
			case Direction.Left:
			case Direction.Right:
			default:
				x = compnt.left;
				y = compnt.bottom;
				width = compnt.width/children.length;
				break;
		}

		// let start = compnt.type === ItemType.Circle || compnt.type === ItemType.Ring ? 90 : compnt.startAngle,
		// 	extent = compnt.type === ItemType.Circle || compnt.type === ItemType.Ring ? 360 : compnt.angle,
		// 	angle = extent/children.length;
		for (let i = 0; i < children.length; i++) {
			let mark = scene.mark("rect", {
				left: x,
				top: y,
				width: width,
				height: size,
				strokeColor: compnt.strokeColor,
				fillColor: compnt.fillColor,
				strokeWidth: compnt.strokeWidth,
				opacity: compnt.opacity
			});
			x += width;
			mark.dataScope = tree.getNodeDataScope(children[i]);
			mark.classId = classId;
			coll.addChild(mark);
			_addRectStrata(mark, classId, direction, size, tree, children[i], coll, scene);
		}
	}

	class Interaction {

	    constructor(listener, eventType, selDef, targetDef) {
	        this._listener = listener;
	        this._eventType = eventType;
	        this._selDef = selDef;
	        this._targetDef = targetDef;
	    }

	    getCallbackFunction(scene, handler) {
	        let i = this;
	        return function(e){
	            e.stopPropagation();
	            let sel = handler._getSelection(e, i.selectionDef, i._listener, scene.getItem(d3__namespace.select(this).attr("id")));
	            let targets = getPeers(i.targetDef.item, scene);
	            let predicates;
	            if (i.selectionDef.remember) {
	                handler.addGlobalPredicate(scene, sel.predicate);
	                predicates = handler.getGlobalPredicates(scene);
	            } else {
	                predicates = handler.getGlobalPredicates(scene).concat([sel.predicate]);
	            }
	            for (let t of targets) {
	                let selected = true;
	                for (let p of predicates) {
	                    if (!evaluatePredicate(t, p)) {
	                        selected = false;
	                        break;
	                    }
	                }
	                for (let c in i.targetDef.effect) {
	                    if (!(c in t.staticProperties))
	                        t.staticProperties[c] = t[c];
	                    if (selected) {
	                        t[c] = i.targetDef.effect[c].selected;
	                    } else if ("unselected" in i.targetDef.effect[c]) {
	                        t[c] = i.targetDef.effect[c].unselected;
	                    } else if (c in t.staticProperties) {
	                        t[c] = t.staticProperties[c];
	                    }
	                }
	            }
	            // console.log(handler.getGlobalPredicates(scene));
	            handler._renderer.render(scene, {visualOnly: true});
	        }
	    }

	    getRestoreFunction(scene, handler, clearGlobalPredicates) {
	        let i = this;
	        return function(){
	            let targets = getPeers(i.targetDef.item, scene);
	            if (i.targetDef.effect) {
	                for (let t of targets) {
	                    for (let c in i.targetDef.effect)
	                        t[c] = t.staticProperties[c];
	                    //delete t.staticProperties[c];
	                }
	            } else {
	                for (let t of targets) {
	                    for (let c in t.staticProperties)
	                        t[c] = t.staticProperties[c];
	                    //t.staticProperties = {};
	                }
	            }

	            if (clearGlobalPredicates)
	                handler._globalPredicates = {};
	            
	            handler._renderer.render(scene, {visualOnly: true});
	        }
	    }

	    get listener() {
	        return this._listener;
	    }

	    get selectionDef() {
	        return this._selDef;
	    }

	    get targetDef() {
	        return this._targetDef;
	    }

	    get eventType() {
	        return this._eventType;
	    }
	}

	class Scene extends Group{

		constructor(args){
			super();
			if (args && args.fillColor) {
				this.fillColor = args.fillColor;
			}
			this.type = ItemType.Scene;
			this._id = this.type + ItemCounter[this.type]++;
			//this.cellAlign = {};
			this.encodings = {};
			this.constraints = {};
			this._itemMap = {};
			this._interactions = [];
		}

		clear() {
			this.removeAll();
			this.encodings = {};
			this.constraints = {};
			this._itemMap = {};
		}

		group(children) {
			let g = new Group();
			g.classId = g.id;
			this.addChild(g);
			if (children && children.length > 0)
				for (let c of children)
					g.addChild(c);
			this._itemMap[g.id] = g;
			return g;
		}

		mark(type, param) {
			let args = param === undefined ?  {} : param;
			let m = null;
			switch(type) {
				case ItemType.Rect: {
					if (!("top" in args))
						args.top = 0;
					if (!("left" in args))
						args.left = 0;
					if (!("width" in args))
						args.width = 100;
					if (!("height" in args))
						args.height = 100;
					let top = args["top"], left = args["left"], width = args["width"], height = args["height"];
					args.vertices = [[left, top], [left + width, top], [left + width, top + height], [left, top + height]];
					delete args["top"];
					delete args["left"];
					delete args["width"];
					delete args["height"];
					if (!("fillColor" in args)) {
						args.fillColor = "none";
					}
					m = new RectPath(args);
					break;
				}
				case ItemType.Area:
					if (args !== undefined && "x1" in args && "y1" in args  && "x2" in args && "y2" in args) {
						let x1 = args["x1"], y1 = args["y1"], x2 = args["x2"], y2 = args["y2"];
						// args.vertices contains all the vertices on two boundary lines
						args.vertices = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
						delete args["x1"];
						delete args["y1"];
						delete args["x2"];
						delete args["y2"];
					}
					m = new AreaPath(args);
					break;
				case ItemType.Line: {
					//it is possible to create a skeleton line without x1, y1, x2, y2 args, e.g. when duplicating
					if (args !== undefined && "x1" in args && "y1" in args  && "x2" in args && "y2" in args) {
						let x1 = args["x1"], y1 = args["y1"], x2 = args["x2"], y2 = args["y2"];
						args.vertices = [[x1, y1], [x2, y2]];
						//remove x1, y1, x2, y2 and compute these values at rendering time 
						//so that we don't have to keep track of them when the line is transformed
						delete args["x1"];
						delete args["y1"];
						delete args["x2"];
						delete args["y2"];
					}
					m = new Path(args);
					m.type = ItemType.Line;
					break;
				}
				case ItemType.Path:
					m = new Path(args);
					break;
				case ItemType.Circle: 
					m = new CirclePath(args);
					break;
				case ItemType.Ring:
					m = new RingPath(args);
					break;
				case ItemType.Arc:
					m = new ArcPath(args);
					break;
				case ItemType.Polygon:
					m = new PolygonPath(args);
					break;
				case ItemType.Pie:
					args.innerRadius = 0;
					if ("radius" in args) {
						args.outerRadius = args.radius;
					}
					m = new ArcPath(args);
					break;
				case "text":
				case ItemType.PointText:
					if (!("anchor" in args))
						args["anchor"] = ["center", "middle"];
					m = new PointText(args);
					break;
				case ItemType.Image:
					m = new Image(args);
					break;
				case ItemType.Link:
					m = new Link(args);
					break;
			}
			if (m !== null) {
				if ("id" in args)
					m.id = args.id;
				else
					m.id = m.type + ItemCounter[m.type]++;
				m.classId = m.id;
				this.addChild(m);
				this._itemMap[m.id] = m;
			}
			return m;
		}

		glyph(...args){
			let g = new Glyph(args);
			g.classId = g.id;
			this.addChild(g);
			this._itemMap[g.id] = g;
			return g;
		}

		collection() {
			let c = new Collection();
			this.addChild(c);
			this._itemMap[c.id] = c;
			return c;
		}

		attach(item, table) {
			item.dataScope = new DataScope(table);
		}

		repeat(item, data, param) {
			if (!item || data === undefined){
				throw Errors.INCOMPLETE_REPEAT_INFO;
			}

			if (data.nodeTable && data.linkTable) {
				if (!Array.isArray(item) || item.length !== 2)
					throw Errors.REPEAT_NODE_LINK;
				return repeatNodeLink(this, item[0], item[1], data);
			} else {
				let args = param ? param : {},
				field = args["field"] ? args["field"] : DataTable.RowID,
				callback = args["callback"];

				validateField(field, data);

				let collection = repeatItem(this, item, field, data, callback);
				if (args.layout)
					collection.layout = args.layout;
				return collection;
			}
		}

		repopulate(item, table, param) {
			if (!item || table === undefined){
				throw Errors.INCOMPLETE_REPEAT_INFO;
			}

			let args = param ? param : {},
				field = args["field"] ? args["field"] : DataTable.RowID;

			validateField(field, table);
			repopulateItem(this, item, field, table);
		}

		densify(item, table, param) {
			if (!item || table === undefined){
				throw Errors.INCOMPLETE_PARTITION_INFO;
			}

			let args = param ? param : {}, 
				orientation = args["orientation"],
				field = args["field"] ? args["field"] : DataTable.RowID,
				//following two are for circle densification
				startAngle = "startAngle" in args ? args["startAngle"] : 90,
				direction = 'direction' in args ? args["direction"] : "clockwise",
				callback = args["callback"];

			validateField(field, table);
					
			let collection = densifyItem(this, item, orientation, field, table, callback, startAngle, direction);
			return collection;
		}

		stratify(item, data, param) {
			if (!(data instanceof Tree)) {
				throw Errors.STRATIFY_WITHOUT_TREE;
			}

			if (item.type !== ItemType.Circle && item.type !== ItemType.Rect) {
				throw Errors.STRATIFY_WRONG_ITEM;
			}

			let args = param ? param : {},
				direction = args["direction"],
				size = args["size"];
			
			let collection = stratifyItem(this, item, direction, size, data);
			//SceneValidator.markDivided(item, collection);
			return collection;
		}

		divide(item, data, param) {
			if (!item || data == undefined){
				throw Errors.INCOMPLETE_PARTITION_INFO;
			}

			let args = param ? param : {},
				orientation = args["orientation"],
				field = args["field"] ? args["field"] : DataTable.RowID,
				callback = args["callback"];

			validateField(field, data);
					
			let collection = divideItem(this, item, orientation, field, data, callback);
			if (args.layout)
				collection.layout = args.layout;

			SceneValidator.markDivided(item, collection);
			return collection;
		}

		_validateEncodeArgs(item, args) {
			if (!item || !("channel" in args) || !("field" in args)) {
				throw Errors.INCOMPLETE_BINDING_INFO;
			}

			let field = args["field"];

			//check if can apply encoding
			if (item.type == "vertex" || item.type == "segment") {
				if (!item.parent.dataScope && !item.dataScope) {
					throw Errors.BIND_WITHOUT_DATASCOPE;
				}
			} else if (!item.dataScope) {
				throw Errors.BIND_WITHOUT_DATASCOPE;
			}
			

			let datatable = args.table ? args.table : item.dataScope ? item.dataScope._dt : item.parent.dataScope._dt;

			validateField(field, datatable);
			//todo: validate channel
		}

		encode(item, args) {
			this._validateEncodeArgs(item, args);
			let items;
			if (item.type == "vertex" && item.parent.type == ItemType.Area){
				let areas = getPeers(item.parent, this);
				items = [];
				let firstHalf = item.parent.vertices.indexOf(item) < item.parent.vertices.length/2;
				for (let area of areas){
					items = firstHalf ? items.concat(area.vertices.slice(0, area.vertices.length/2)) : items.concat(area.vertices.slice(area.vertices.length/2));
				}
			} else {
				items = getPeers(item, this);
			}
			return this._doEncode(items, args);
		}

		_doEncode(items, args) {
			let item = items[0],
				channel = args["channel"],
				field = args["field"];
			
			if (!("datatable" in args))
				args.datatable = item.dataScope ? item.dataScope.dataTable : item.parent.dataScope.dataTable;
			if (!("aggregator" in args))
				args.aggregator = "sum";
			if (!("flipScale" in args))
				args.flipScale = false;
			if (!("includeZero" in args))
				args.includeZero = false;
			if (!("scaleType" in args))
				args.scaleType = "linear";

			let encoding = new Encoding(items, this, channel, field, args);
			switch (channel) {
				case "width":
				case "height":
				case "radius":
				case "outerRadius":
				case "innerRadius":
				case "area":
				case "fontSize":
					if (item.type == ItemType.Area)
						bindToArea(encoding);
					else
						bindToSize(encoding);
					break;
				case "strokeWidth":
					if (item.type == ItemType.Link)
						bindToLink(encoding);
					else
						bindToSize(encoding);
					break;
				case "x":
				case "y":
					if (item.type == ItemType.Area)
						bindToArea(encoding);
					else
						bindToPosition(encoding);
					break;
				case "fillColor":
				case "strokeColor":
					bindToColor(encoding);
					break;
				case "angle":
					bindToAngle(encoding);
					break;
				case "text":
					bindToText(encoding);
					break;
				case "radialDistance":
					// encoding.x = item.parent.x;
					// encoding.y = item.parent.y;
					// encoding.radius = item.parent.radius;
					bindToRadialDistance(encoding);
					break;
				case "thickness":
					bindToThickness(encoding);
					break;
			}

			if (!("_remember" in args)  || args._remember == true)
				this._registerBinding(encoding);

			if (channel.indexOf("Color") < 0)
				this._updateAncestorBounds(item, encoding.items);

			return encoding;
		}

		encodeWithinCollection(item, args) {
			this._validateEncodeArgs(item, args);
			let peersByGroup = getPeersGroupedByParent(item, this);
			let encs = [];
			for (let g of peersByGroup) {
				let enc = this._doEncode(g, args);
				encs.push(enc);
			}
			return encs;
		}

		getPeers(item) {
			return getPeers(item, this);
		}

		find(predicates) {
			return findItems(this, predicates);
		}

		align(items, direction) {
			//TODO: check the existing constraints and encodings and see if there's any conflict
			//if so, do nothing and return false
			if (!canAlign(items, direction, this)) return false;
			let c = new AlignConstraint(items, direction);
			if (c.id in this.constraints){
				console.warn('constraint has been added');
				return false;
			}
			this.constraints[c.id] = c;
			c.apply();
			this._updateAncestorBounds(items[0]);
		}

		removeAllConstraints() {
			this.constraints = {};
		}

		// alignInCell(item, direction) {
		// 	//TODO replace grid.vertCellAlignment and grid.horzCellAlignment
		// }

		affix(item, baseItem, channel, param) {
			let args = param ? param : {},
				offset = "offset" in args ? args.offset : 0,
				itemAnchor = "itemAnchor" in args ? args.itemAnchor : (channel == "x" || channel == "angle") ? "center" : "middle",
				baseAnchor = "baseAnchor" in args ? args.baseAnchor : (channel == "x" || channel == "angle") ? "center" : "middle";
			let c = new AffixConstraint(item, baseItem, this, channel, itemAnchor, baseAnchor, offset);
			if (c.id in this.constraints);
			this.constraints[c.id] = c;
			c.apply();
		}

		//arguments include a channel (x, y, width, height for now)
		//optional arguments include orientation, x-coordinate, y-coordinate, tickFormat, strokeColor, 
		axis(channel, field, params) {
			//need to figure out if item has the corresponding encoding, or if item position is determined by layout
			let enc = this.getEncodingByField(field, channel), args = params ? params : {};
			if (enc) {
				if (enc.datatable.getFieldType(field) === DataType.Date && !("labelFormat" in args)) {
					args.labelFormat = "%m/%d/%y";
				}
				let axis = new EncodingAxis(enc, args.item? args.item : enc.anyItem, args);
				if ("tickValues" in args) {
					axis.tickValues = args["tickValues"];
					axis.labelValues = args["tickValues"];
				} else {
					axis.tickValues = this._inferTickValues(enc);
					axis.labelValues = this._inferTickValues(enc);
				}
				
				this.addChildAt(axis, 0);
				this._itemMap[axis.id] = axis;
				this._updateBounds();
				return axis;
			} 
			
			//TODO: find out item from the field
			let item = args.item? args.item : findItems(this, [{"field": field}])[0];
			if (item === undefined) {
				console.warn(Warnings.INCORRECT_AXIS_INFO + field);
			}

			let layout = getClosestLayout(item);

			if (layout && (channel == "x" || channel == "y")) {
				let group = layout.group,
					groups = getPeers(group, this);
				let axis, classId;
				//TODO: think about how to specify if mutliple axes need to be created properly
				// if (args.item)
				// 	groups = [args.item.parent];
				for (let c of groups) {
					let itm = findItems(c, [{"field": field}])[0];
					let items = getPeers(itm, c);
					if (itm.dataScope.dataTable.getFieldType(field) === DataType.Date && !("labelFormat" in args)) {
						args.labelFormat = "%m/%d/%y";
					}
					axis = new LayoutAxis(items, c.layout, channel, field, args);
					if (classId == undefined)
						classId = axis.id;
					axis.classId = classId;
					this.addChildAt(axis, 0);
					this._itemMap[axis.id] = axis;
					// break;
				}
				this._updateBounds();
				return axis;
			} else {
				console.warn(Warnings.INCORRECT_AXIS_INFO + field);
			}
		}

		getRelatedAxes(item) {
			let axes = [];
			if (isGuide(item))
				return axes;
			for (let c of this.children) {
				if (c.type !== ItemType.Axis) continue;
				if (c.matches(item)) {
					axes.push(c);
					continue;
				}
				//handle layout axis for small multiples
				let p = c._item, found = false;
				while (p.children && p.children.length > 0) {
					for (let ic of p.children) {
						if (ic.classId === item.classId) {
							found = true;
							axes.push(c);
							break;
						}
					}
					if (found) break;
					else p = p.children[0];
				}
				
				//handle axis if the updated item is a group/collection
				let allChildren = getAllChildren(item);
				let map = {};
				for (let i of allChildren) {
					if (i.classId in map) continue;
					map[i.classId] = i;
				}
				let toCheck = Object.values(map);
				for (let i of toCheck) {
					if (c.matches(i)) {
						axes.push(c);
						break;
					}
				}
				// while (p.children && p.children.length > 0) {
				// 	for (let ic of p.children) {
				// 		if (c.matches(ic)) {
				// 			found = true;
				// 			axes.push(c);
				// 			break;
				// 		}
				// 	}
				// 	if (found) break;
				// 	else p = p.children[0];
				// }
			}
			return axes;
		}

		removeItem(itm) {
			if (!isGuide(itm)) {
				let encodings = this.getRelatedEncodings(itm);
				for (let enc of encodings) {
					this.removeEncoding(enc);
				}
				//TODO: remove relevant graphical constraints
				let axes = this.getRelatedAxes(itm);
				for (let a of axes)
					this.removeItem(a);
				for (let g of this.getRelatedGridlines(itm))
					this.removeItem(g);
			}
			delete this._itemMap[itm.id];
			this.removeChild(itm);
			this._updateBounds();
		}

		//this is used to handle item deletion, assuming that item's parent is scene
		getRelatedEncodings(item) {
			let encodingKeys = [];
			let itm = item;
			while (itm) {
				encodingKeys.push(getEncodingKey(itm));
				if (itm.type == ItemType.Collection) {
					itm = itm.firstChild;
				} else if (itm.type == ItemType.Glyph) {
					for (let c of itm.children) {
						encodingKeys.push(getEncodingKey(c));
					}
					itm = undefined;
				} else {
					itm = undefined;
				}
			}
			let keys = Object.keys(this.encodings), encodings = [];
			for (let k of keys) {
				let itemKey = k.split("_")[0];
				if (encodingKeys.indexOf(itemKey) >= 0) {
					for (let channel in this.encodings[k])
						encodings.push(this.encodings[k][channel]);
				}
			}
			return encodings;
		}

		removeAllEncodings() {
			this.encodings = {};
			this.removeAllItemsByType(ItemType.Axis);
			this.removeAllItemsByType(ItemType.Legend);
			this.removeAllItemsByType(ItemType.Gridlines);
		}

		removeEncoding(enc) {
			let key = getEncodingKey(enc.anyItem);
			delete this.encodings[key][enc.channel];
			let toRemove = [];
			for (let c of this.children) {
				if (isGuide(c) && c.encoding && c.encoding === enc){
					toRemove.push(c);
				}
			}
			for (let a of toRemove) {
				this.removeItem(a);
			}
			this._updateBounds();
		}

		removeAllItemsByType(type) {
			let toRemove = [];
			for (let a of this.children) {
				if (a.type === type) {
					toRemove.push(a);
				}
			}
			for (let i of toRemove)
				this.removeItem(i);
			this._updateBounds();
		}

		reCreateRelatedAxes(item) {
			let axes = this.getRelatedAxes(item);
			axes.forEach(a => {
				let args = a.toJSON().args;
				if (args.item)
					args.item = this.getItem(args.item);
				delete args["tickValues"];
				delete args["labelValues"];
				this.removeItem(a);
				this.axis(a.channel, a.field, args);
			});
			this._updateBounds();
		}

		reCreateRelatedLegends(item) {
			let lgds = this.getRelatedLegends(item);
			lgds.forEach(a => {
				let args = a.toJSON().args;
				if (args.item)
					args.item = this.getItem(args.item);
				this.removeItem(a);
				this.legend(a.channel, a.field, args);
			});
			this._updateBounds();
		}

		legend(channel, field, param){
			let args = param ? param : {};
			let enc = this.getEncodingByField(field, channel);
			if (!enc)
				throw Errors.INCORRECT_LEGEND_INFO + field;
			
			if (!("x" in args))
				args["x"] = 100;
			if (!("y" in args))
				args["y"] = 100;
			let legend = new Legend(enc, args);
			this.addChild(legend);
			this._itemMap[legend.id] = legend;
			this._updateBounds();
			return legend;
		}

		gridlines(channel, field, params){
			let enc = this.getEncodingByField(field, channel), args = params ? params : {};
			if (!enc) return false;
			let gl = new Gridlines(enc, args.item ? args.item : enc.anyItem, args);
			
			if ("values" in args) {
				gl.values = args["values"];
			} else {
				gl.values = this._inferTickValues(enc);
			}
			
			this.addChildAt(gl, 0);
			this._itemMap[gl.id] = gl;
			this._updateBounds();
			return gl;
		}

		getRelatedLegends(item) {
			let lg = [];
			if (isGuide(item)) return lg;
			for (let c of this.children) {
				if (c.type !== ItemType.Legend) continue;
				if (c.matches(item)) {
					lg.push(c);
					continue;
				}
			}
			return lg;
		}

		getRelatedGridlines(item) {
			let gl = [];
			if (isGuide(item))
				return gl;
			for (let c of this.children) {
				if (c.type !== ItemType.Gridlines) continue;
				if (c.matches(item)) {
					gl.push(c);
					continue;
				}
				//handle layout axis for small multiples
				let p = c._item, found = false;
				while (p.children && p.children.length > 0) {
					for (let ic of p.children) {
						if (ic.classId === item.classId) {
							found = true;
							gl.push(c);
							break;
						}
					}
					if (found) break;
					else p = p.children[0];
				}

				//handle axis if the updated item is a group/collection
				let allChildren = getAllChildren(item);
				let map = {};
				for (let i of allChildren) {
					if (i.classId in map) continue;
					map[i.classId] = i;
				}
				let toCheck = Object.values(map);
				for (let i of toCheck) {
					if (c.matches(i)) {
						gl.push(c);
						break;
					}
				}
				// p = item, found = false;
				// while (p.children && p.children.length > 0) {
				// 	for (let ic of p.children) {
				// 		if (c.matches(ic)) {
				// 			found = true;
				// 			gl.push(c);
				// 			break;
				// 		}
				// 	}
				// 	if (found) break;
				// 	else p = p.children[0];
				// }
			}
			return gl;
		}

		_inferTickValues(enc) {
			let domain = enc.scale.domain, range = enc.scale.range;
			let minPxInterval;
			//let minTickIntervalPx = 40, minLabelIntervalPx = 80;
			switch (enc.scale.type) {
				case "linear":
				case "log": {
					//handle the case where the marks are stacked
					let r = Math.abs(range[0] - range[1]);
					if (enc.channel == "width" || enc.channel == "height") {
						let layout = getClosestLayout(enc.anyItem);
						if (layout && layout.type == LayoutType.Stack) {
							let c = layout.group, colls = getPeers(c, enc.scene);
							r = Math.max(...colls.map(d => d.bounds[enc.channel])) ;
							domain[1] = enc.scale.invert(r); // Math.ceil(enc.scale.invert(r)); do not ceil, it can amplify small difference in invert calculation due to imprecision/roundoff in bounding box calculation
						}
					}
					minPxInterval = enc.channel == "width" || enc.channel == "x" ? 45 : 30;
					let n = Math.floor(r/minPxInterval); //, step = d3.tickStep(domain[0], domain[1], n);
					let ticks = d3__namespace.ticks(domain[0], domain[1], n);
					return ticks;
				}
				case "point": {
					minPxInterval = enc.channel == "width" || enc.channel == "x" ? 80 : 30;
					let domainValueIntervalPx = Math.floor(enc.scale.rangeExtent/domain.length);
					let m = Math.ceil(minPxInterval/domainValueIntervalPx);
					return enc.channel == "x" ? domain.filter((d, i) => i % m == 0) : domain;
				}
				case "time": {
					minPxInterval = enc.channel == "width" || enc.channel == "x" ? 80 : 30;
					let numIntervals = Math.floor((range[1] - range[0])/minPxInterval),
						timeInterval = Math.ceil( (domain[1] - domain[0])/numIntervals )/1000;

					let units = [1, 60, 3600, 86400, 2628003, 31536000],
						intervals = [d3__namespace.timeSeconds, d3__namespace.timeMinutes, d3__namespace.timeHours, d3__namespace.timeDays, d3__namespace.timeMonths, d3__namespace.timeYears];

					let tn, tInterval;
					for (let i = 0; i < units.length - 1; i++) {
						if (timeInterval >= units[i] && timeInterval < units[i+1]) {
							tn = Math.floor(timeInterval/units[i]);
							tInterval = intervals[i];
							return tInterval(domain[0], domain[1], tn);
						}
					} 
					if (timeInterval > units[units.length-1]) {
						tn = Math.floor(timeInterval/units[units.length-1]);
						tInterval = intervals[units.length-1];
						return tInterval(domain[0], domain[1], tn);
					}
					return [];
				}
				default:
					return [];
			}
		}

		propagate(item, method, ...args){
			let peers = getPeers(item, this);
			for (let p of peers)
				p[method](...args);
		}

		classify(items, field, parent){
			let collections = {}, cid, oldParent = items[0].parent;
			for (let item of items) {
				let v = item.dataScope.getFieldValue(field);
				if (!(v in collections)) {
					collections[v] = [];
				}
				collections[v].push(item);
			}
			let results = [], tbl = items[0].dataScope._dt;
			for (let v in collections) {
				let coll = this.collection();
				parent.addChild(coll);
				if (cid === undefined)
					cid = coll.id;
				coll.classId = cid;
				coll.dataScope = new DataScope(tbl).cross(field, v);
				for (let c of collections[v]) {
					coll.addChild(c);
				}
				results.push(coll);
			}

			if (oldParent.children.length === 0) {
				oldParent.parent.removeChild(oldParent);
			}

			return results;
		}

		getEncodingByItem(item, channel) {
			let enc = this.encodings[getEncodingKey(item)];
			if (enc && enc[channel]) {
				return enc[channel];
			} else
				return null;
		}

		getEncodingByField(field, channel) {
			for (let itmKey in this.encodings) {
				let enc = this.encodings[itmKey];
				if (enc[channel] && enc[channel].field == field)
					return enc[channel];
			}
			return null;
		}

		//item can be a mark, a group, a vertex or a segment
		positionBound(item, channel) {
			let enc = this.getEncodingByItem(item, channel);
			if (enc)
				return enc;
			else if (isPath(item)) {
				for (let key in this.encodings) {
					let classId = key.split("_")[0];
					if (classId === item.classId && channel in this.encodings[key])
						return this.encodings[key][channel];
				}
			}
			else
				return null;
		}

		sizeBound(mark, channel) {
			let enc = this.getEncodingByItem(mark, channel);
			if (enc)
				return enc;
			if (isPath(mark)) {
				let dep = channel === "width" ? ["area"] : channel === "height" ? ["area"] : channel === "radius" ? ["area"] : ["width", "height"],
					dep2 = channel === "width" ? ["x"] : channel === "height" ? ["y"] : ["x", "y"];
				for (let key in this.encodings) {
					let classId = key.split("_")[0];
					if (key.indexOf("_") < 0) {
						for (let c of dep) {
							if (classId === mark.classId && c in this.encodings[key])
								return this.encodings[key][c];
						}
					} else {
						for (let c of dep2) {
							if (classId === mark.classId && c in this.encodings[key])
								return this.encodings[key][c];
						}
					}
				}
			}
			return null;
		}

		setProperties(item, args) {
			let result = {}, peers;
			for (let p in args)
				result[p] = true;

			if (Object.values(LayoutType).indexOf(item.type) > -1 && item.group) {
				peers = getPeers(item.group, this);
				for (let coll of peers) {
					for (let p in args) {
						coll.layout[p] = args[p];
					}
				}
			} else {
				peers = getPeers(item, this);
				if (item.type === "vertex") {
					//TODO: validate the property names in args
					for (let vertex of peers) {
						for (let p in args) {
							vertex[p] = args[p];
						}
					}
				} else if (item instanceof Mark) {
					for (let p in args) {
						//TODO: validate p is a legit property, check if p is bound by data
						if ((p === "x" || p === "y") && this.positionBound(item, p)) {
							result[p] = false;
							continue;
						}
						if ((p === "width" || p === "height" || p === "radius") && this.sizeBound(item, p)) {
							result[p] = false;
							continue;
						}
						if ((item.type === ItemType.Rect || item.type === ItemType.Line) && (p === "width" || p === "height")) {
							if (p === "width")
								peers.forEach(d => d.resize(args[p], d.bounds.height, args["xRef"]));
							else
								peers.forEach(d => d.resize(d.bounds.width, args[p], undefined, args["yRef"]));
						} else if (item.type == ItemType.Circle && p == "radius") {
							peers.forEach(d => d.resize(args[p]*2, args[p]*2, args["xRef"], args["yRef"]));
						} else {
							peers.forEach(d => d[p] = args[p]);
						}
					}
						
				} else if (item.type == "collection" || item.type == "group") {
					for (let c of peers) {
						for (let p in args) {
							c[p] = (p === "layout" && args[p] !== undefined) ? args[p].clone() : args[p];
						}
						//c._updateBounds();
					}
				}
			}

			let props = Object.keys(result).filter(d => result[d]);
			let sizeProps = ["width", "height", "fontSize", "area", "radius"];
			for (let s of sizeProps) {
				if (props.indexOf(s) >= 0 && isMark(item)) {
					SceneValidator.itemResized(item, peers);
					break;
				}
			}
			if (props.indexOf("baseline") >=0 && item.type === ItemType.Area)
				SceneValidator.areaRebased(item, peers);

			let layoutProps = ["layout", "rowGap", "colGap", "numRows", "numCols", "vertCellAlignment", "horzCellAlignment"];
			for (let l of layoutProps) {
				if (props.indexOf(l) >= 0) {
					let reGenerateAxes = (props.indexOf("numRows") >= 0 || props.indexOf("numCols") >= 0 || props.indexOf("layout") >= 0);
					SceneValidator.layoutChanged(peers[0], peers, reGenerateAxes);
					break;
				}
			}
			return result;
			//TODO: relayout if needed (typically Layout or setProperty should happen before encoding)
		}

		_canTranslate(item) {
			let r = {x: true, y: true};
			if (item.type == ItemType.Axis) {
				if (item.channel === "x" || item.channel === "width")
					r.x = false;
				else if (item.channel === "y" || item.channel === "height")
					r.y = false;
				return r;
			}
			if (item.parent.type === ItemType.Collection && item.parent.layout) {
				r.x = false;
				r.y = false;
			}
			if (this.positionBound(item, "x"))
				r.x = false;
			if (this.positionBound(item, "y"))
				r.y = false;
			//TODO: check constraints, handle vertices and
			return r;
		}

		//always check canTranslate before calling this method
		translate(item, dx, dy) {
			let ct = this._canTranslate(item);
			if (!ct.x && !ct.y) return ct;
			const adx = ct.x ? dx : 0, ady = ct.y ? dy : 0;
			item._doTranslate(adx, ady);
			this._updateAncestorBounds(item);
			SceneValidator.itemTranslated(item, adx, ady);
			return ct;
		}

		_updateAncestorBounds(cpnt, cpntPeers) {
			let peers = cpntPeers ? cpntPeers : getPeers(cpnt, this);
			let parents = getParents(peers);
			
			while (parents.length > 0) {
				for (let p of parents) { 
					if (p.children && p.children.length > 0) {
						p._updateBounds();
					} else if (p.vertices) {
						p._updateBounds();
					}
				}
				parents = getParents(parents);
			}
		}

		/**
		** should only be used in Scene methods
		**/

		_reapplyConstraints(item) {
			let itm = item, itms = [item];
			while (itm.children) {
				if (itm.type == ItemType.Collection) {
					itms.push(itm.firstChild);
				} else { //glyph or group
					itms = itms.concat(itm.children);
				}
				itm = itm.firstChild;
			}

			itm = item.parent;
			while (itm && itm.type !== ItemType.Scene) {
				itms.push(itm);
				itm = itm.parent;
			}

			const classIds = itms.map(d => d.classId);

			for (let c in this.constraints) {
				const cstr = this.constraints[c];
				switch (cstr.type) {
					case ConstraintType.Affix:
						if (classIds.indexOf(cstr.item.classId) >= 0 || classIds.indexOf(cstr.baseItem.classId) >= 0)
							cstr.apply();
						break;
					case ConstraintType.Align:
						for (let itm of cstr.items) {
							if (classIds.indexOf(itm.classId) >= 0) {
								cstr.apply();
								break;
							}
						}
						break;
				}
			}
		}

		_relayoutAncestors(cpnt, cpntPeers) {
			let peers = cpntPeers ? cpntPeers : getPeers(cpnt, this);
			let parents = getParents(peers);
			while (parents.length > 0) {
				for (let p of parents) {
					if (p.layout) {
						p.layout.run();
					} 
					if (p.children && p.children.length > 0) {
						p._updateBounds();
					}
					if (p.vertices) {
						p._updateBounds();
					}
				}
				parents = getParents(parents);
			}
		}

		_reapplySizeBindings(compnt){
			let sizeChannels = ["width", "height"];
			for (let classId in this.encodings) {
				if (compnt.classId != classId)	continue;
				let encodings = this.encodings[classId];
				//TODO: re-use bindSpec and adjust scale accordingly
				let peers = findItems(this, [{"classId": classId}]);
				for (let channel of sizeChannels) {
					let encoding = encodings[channel];
					if (!encoding) continue;
					encoding.run();
				}
				this._relayoutAncestors(peers[0], peers);
			}
		}

		_registerBinding(enc) {
			let encodings = this.encodings;
			let key = getEncodingKey(enc.anyItem);
			if (!(key in encodings))
				encodings[key] = {};
			encodings[key][enc.channel] = enc;
			return true;
		}

		toJSON() {
			let json = super.toJSON();
			if (this.fillColor)
				json.fillColor = this.fillColor;
			let scales = {};
			json.encodings = [];
			json.itemCounter = ItemCounter;
			for (let classId in this.encodings) {
				for (let channel in this.encodings[classId]) {
					let e = this.encodings[classId][channel];
					json.encodings.push(e.toJSON());
					if (e.scale && !(e.scale.id in scales)) {
						scales[e.scale.id] = e.scale.toJSON();
					}
				}
			}
			json.scales = scales;
			json.constraints = {};
			for (let c in this.constraints)
				json.constraints[c] = this.constraints[c].toJSON();
			json.tables = {};
			let tables = this.getDataTables();
			for (let t in tables) {
				json.tables[t] = tables[t].toJSON();
			}
			return json;
		}

		//get data tables used in this scene's encodings
		getDataTables() {
			let tables = {};
			for (let classId in this.encodings) {
				for (let channel in this.encodings[classId]) {
					let e = this.encodings[classId][channel];
					if (!(e.datatable.id in tables)) {
						tables[e.datatable.id] = e.datatable;
					}
				}
			}
			for (let c of this.children) {
				if (isGuide(c)) continue;
				if (c.dataScope) {
					tables[c.dataScope.dataTable.id] = c.dataScope.dataTable;
					break;
				} else if (c.children && c.children.length > 0) {
					let itm = c.firstChild;
					while(itm) {
						if (itm.dataScope) {
							tables[itm.dataScope.dataTable.id] = itm.dataScope.dataTable;
							break;
						} else if (itm.children && itm.children.length > 0) {
							itm = itm.firstChild;
						} else {
							itm = undefined;
						}
					}
				}
			}
			return tables;
		}

		//handles marks, groups, vertices and segments
		getItem(id) {
			let markId = id.split("_")[0];
			if (id.indexOf("_v_") > 0) {
				let idx = parseInt(id.split("_v_")[1]);
				return this._itemMap[markId].vertices.find(d => d._id === idx);
			} else if (id.indexOf("_s_") > 0) {
				let idx = parseInt(id.split("_s_")[1]);
				return this._itemMap[markId].segments.find(d => d._id === idx);
			} else {
				return this._itemMap[id];
			}
		}

		addInteraction(listener, eventType, selDef, targetDef) {
			let i = new Interaction(listener, eventType, selDef, targetDef);
			this._interactions.push(i);
		}
	}

	class SVGInteractionHandler {

	    constructor(svgRenderer) {
	        this._renderer = svgRenderer;
	        this._globalPredicates = {};
	    }

	    processInteraction(i, scene) {
	        let listener = i.listener;
	        if (isMark(listener)) {
	            let selector = listener.classId ? "." + listener.classId : "#" + listener.id;
	            switch (i.eventType) {
	                case "hover":
	                    d3__namespace.selectAll(selector).on("mouseover", i.getCallbackFunction(scene, this));
	                    d3__namespace.selectAll(selector).on("mouseleave", i.getRestoreFunction(scene, this));
	                    break;
	                case "click":
	                    d3__namespace.selectAll(selector).on("mousedown", i.getCallbackFunction(scene, this));
	                    break;
	            }
	        } else if (listener.type == ItemType.Scene) {
	            if (!i.targetDef || !i.targetDef.item) return;
	            if (!i.selectionDef.item) {
	                d3__namespace.select("#"+this._renderer._svgId).on("mousedown", i.getRestoreFunction(scene, this, true));
	            }
	        }
	    }

	    _getSelection(e, selDef, listener, item) {
	        let selection = {};
	        if (item) {
	            selection.item = item;
	        } else if (selDef.item) ;

	        let field = selDef.field ? selDef.field : atlas_rowId;
	        if (selection.item) {
	            selection.predicate = {"field": field, "value": selection.item.dataScope.getFieldValue(field)};
	        }
	        return selection;
	    }

	    addGlobalPredicate(scene, p) {
	        if (!(scene.id in this._globalPredicates)) {
	            this._globalPredicates[scene.id] = {};
	        }
	        this._globalPredicates[scene.id][p.field] = p;
	    }

	    getGlobalPredicates(scene) {
	        return (scene.id in this._globalPredicates) ? Object.values(this._globalPredicates[scene.id]) : [];
	    }
	}

	class SVGRenderer {

		constructor(svgId) {
			this._svgId = svgId;
			this._compMap = {};
			this._decoMap = {};
			this._interactionHandler = new SVGInteractionHandler(this);
		}

		render(scene, params) {
			let args = params ? params : {};
			for (let k in this._decoMap) {
				this._decoMap[k].remove();
				delete this._decoMap[k];
			}
			this._removed = {};
			for (let k in this._compMap) {
				this._removed[k] = 1;
			}
			this._renderItem(scene, args);
			for (let k in this._removed) {
				this._compMap[k].remove();
				delete this._compMap[k];
			}
			if (!("visualOnly" in args)) {
				for (let i of scene._interactions)
					this._interactionHandler.processInteraction(i, scene);
			}
		}

		clear() {
			let svg = document.getElementById(this._svgId);
	        while (svg.firstChild) {
				svg.firstChild.remove();
			}
			this._compMap = {};
			this._decoMap = {};
		}

		_renderItem(c, args) {
			let cid = c.id,
				parent = c.parent;
			
			let svgParent;
			if (parent && parent.id && parent.id in this._compMap) {
				svgParent = d3__namespace.select("#"+this._svgId).select("#"+parent.id);
			} else {
				svgParent = d3__namespace.select("#"+this._svgId);
			}

			if (!(cid in this._compMap)) {
				//TODO: what if the parent is not rendered? What if the hierarchy has changed?
				this._compMap[cid] = svgParent.append(this._getSVGElementType(c));
			} else {
				delete this._removed[cid];
			}

			if (c.type == ItemType.Gridlines) {
				this._compMap[cid].lower();
			}

			let el = this._compMap[cid];

			el.attr("id", cid);
			if (c.classId)
				el.attr("class", c.classId);

			if (c.type == ItemType.Scene) {
				d3__namespace.select("#"+this._svgId).style("background", c.fillColor ? c.fillColor : "#fff");
			}

			if (c.type == "vertex") {
				//TODO: render vertices
				return;
			}

			if (c.type == ItemType.Path || c.type == ItemType.Polygon || c.type == ItemType.Link) {
				el.attr("d", c.getSVGPathData());
				if (!c.closed)
					el.style("fill", "none");
				if (cid.indexOf("axis") == 0) {
					el.style("shape-rendering", "crispEdges");
				}
			} else if (c.type == ItemType.Line) {
				el.attr("x1", c.vertices[0].x);
				el.attr("y1", c.vertices[0].y);
				el.attr("x2", c.vertices[1].x);
				el.attr("y2", c.vertices[1].y);
				if (cid.indexOf("axis") == 0) {
					el.style("shape-rendering", "crispEdges");
				}
			} else if (c.type == ItemType.Circle) {
				el.attr("cx", c.x);
				el.attr("cy", c.y);
				el.attr("r", c.radius);
			} else if (c.type == ItemType.Rect) {
				//do not use c.left, c.top, c.width, c.height as the rectangle may be flipped
				//use c.bounds
				let b = c.bounds;
				el.attr("x", b.left).attr("y", b.top).attr("width", b.width).attr("height", b.height);
			} else if (c.type == ItemType.PointText) {
				el.attr("text-anchor", this._getTextAnchor(c.anchor[0])).attr("alignment-baseline", this._getTextAnchor(c.anchor[1]))
					.attr("dominant-baseline", this._getTextAnchor(c.anchor[1])).text(c.text)
					.attr("x", c.x).attr("y", c.y);
			} else if (c.type == ItemType.Pie) {
				// Render a sort of triangle before rendering the pie
				el.attr("d", c.getSVGPathData());

				if (!c.closed)
					el.style("fill", "none");
				if (cid.indexOf("axis") == 0) {
					el.style("shape-rendering", "crispEdges");
				}
			} else if (c.type == ItemType.Area) {
				el.attr("d", c.getSVGPathData());
				if (!c.closed)
					el.style("fill", "none");
				if (cid.indexOf("axis") == 0) {
					el.style("shape-rendering", "crispEdges");
				}
			} else if (c.type == ItemType.Ring || c.type == ItemType.Arc) {
				el.attr("d", c.getSVGPathData());
			} else if (c.type == ItemType.Image) {
				el.attr("href", c.src).attr("x", c.x).attr("y", c.y).attr("width", c.width).attr("height", c.height);
			}

			// for (let a in c.attrs) {
			// 	el.attr(Attr2SVG[a], c.attrs[a]);
			// }

			for (let s in c.styles) {
				if (c.styles[s] === undefined)
					continue;
				if (s.indexOf("Color") > 0 && c.styles[s].type == ItemType.LinearGradient) {
					if (d3__namespace.select("#"+this._svgId).select("defs").empty())
						d3__namespace.select("#"+this._svgId).append("defs");
					let defs = d3__namespace.select("defs"), gradient = c.styles[s];
					if (defs.select("#" + gradient.id).empty()) {
						let grad = defs.append("linearGradient").attr("id", gradient.id);
						grad.attr("x1", gradient.x1+"%").attr("x2", gradient.x2+"%").attr("y1", gradient.y1+"%").attr("y2", gradient.y2+"%");
						for (let stop of gradient.stops)
							grad.append("stop").attr("offset", stop.offset+"%").style("stop-color", stop.color).style("stop-opacity", stop.opacity);
					}
					el.style(Style2SVG[s], "url(#" + gradient.id + ")");
				} else {
					el.style(Style2SVG[s], c.styles[s]);
				}
					
			}

			if (c._rotate)
				el.attr("transform", "rotate(" + c._rotate.join(" ") + ")");

			// render vertices if shape is defined
			if (c.vertices) {
				// let shapes = c.vertices.map(d => d.shape).filter(d => d !== undefined);
				// if (shapes.length > 0) 
				this._renderVertices(c);
			}

			// render scene bound
			if (c.type == ItemType.Collection && args && args["collectionBounds"]) {
				let b = c.bounds;
				if (c.layout && c.layout.type == "grid") {
					this._renderLayout(c);
				} else {
					if (!(c.id in this._decoMap)) {
						this._decoMap[c.id] = d3__namespace.select("#"+this._svgId).append("rect").attr("class", "deco");
					}
					this._decoMap[c.id].attr("x", b.left).attr("y", b.top)
						.attr("width", b.width).attr("height", b.height).attr("fill", "none")
						.attr("stroke", "#1ecb40").attr("stroke-width", "2px")
						.attr("stroke-dasharray", "5,5");
				}
			}

			//render text/axis bound
			// if (c.type == ItemType.PointText || c.type == ItemType.Axis) {
			// 	let id = c.id + "-box";
			// 	let b = c.bounds;
			// 	if (!(id in this._decoMap)) {
			// 		this._decoMap[id] = d3.select("#"+this._svgId).append("rect");
			// 	}
			// 	this._decoMap[id].attr("x", b.left).attr("y", b.top)
			// 		.attr("width", b.width).attr("height", b.height).attr("fill", "none")
			// 		.attr("stroke", "#1ecb40").attr("stroke-width", "1px")
			// 		.attr("stroke-dasharray", "5,5");
			// }

			if (c.children) {
				for (let child of c.children) {
					this._renderItem(child, args);
				}
			}

		}

		_renderVertices(c) {
			let id = c.id+"-vertices";
			if (!(id in this._compMap)) {
				let parent = c.parent,
					pid = parent ? parent.id : this._svgId;
				this._compMap[id] = d3__namespace.select("#"+pid).append("g").attr("id", id);
			} else {
				delete this._removed[id];
			}

			let shapes = c.vertices.map(d => d.shape).filter(d => d !== undefined);
			if (shapes.length === 0) {
				this._compMap[id].style("visible", "hidden");
				return;
			} else {
				this._compMap[id].style("visible", "visible");
			}

			let vertices = c.vertices.filter(d => d.shape !== undefined);
			for (let v of vertices) {
				let vid = id+"-"+v.id;
				if (!(vid in this._compMap)) {
					this._compMap[vid] = d3__namespace.select("#"+id).append(v.shape).attr("id", vid);
				} else if (v.shape !== this._compMap[vid].node().tagName) {
					this._compMap[vid].remove();
					this._compMap[vid] = d3__namespace.select("#"+id).append(v.shape).attr("id", vid);
					delete this._removed[vid];
				} else {
					delete this._removed[vid];
				}
				if (v.shape == "rect") {
					d3__namespace.select("#"+vid).attr("x", v.x - v.width/2).attr("y", v.y - v.height/2)
						.attr("width", v.width).attr("height", v.height);
				} else if (v.shape == "circle") {
					d3__namespace.select("#"+vid).attr("cx", v.x).attr("cy", v.y).attr("r", v.radius);
				}
				d3__namespace.select("#"+vid).style("fill", v.fillColor).style("opacity", v.opacity)
					.style("stroke-width", v.strokeWidth).style("stroke", v.strokeColor);
			}
		}

		_renderLayout(c) {
			let gridId = c.id+"-grid";
			if (!(gridId in this._decoMap)) {
				this._decoMap[gridId] = d3__namespace.select("#"+this._svgId).append("g")
					.attr("id", gridId).attr("class", "deco");
			}
			let cellBounds = c.layout.cellBounds, rowGap = c.layout.rowGap;
			this._decoMap[gridId].selectAll("rect").remove();
			this._decoMap[gridId].selectAll("rect").data(cellBounds.slice(0, cellBounds.length -1))
				.enter().append("rect").attr("x", d => d.left).attr("y", d => d.bottom)
					.attr("width", d => d.width).attr("height", rowGap)
					.style("fill", "pink").style("opacity", 0.5)
					;
			let left = Math.min(...cellBounds.map(d => d.left)),
				top = Math.min(...cellBounds.map(d => d.top));
			this._decoMap[gridId].append("rect").attr("x", left).attr("y", top)
				.attr("width", c.bounds.width).attr("height", c.bounds.height)
				.attr("stroke", "blue").attr("stroke-width", "1px")
				.attr("stroke-dasharray", "5,5").attr("fill", "none");

		}

		_getTextAnchor(anchor) {
			switch(anchor) {
	            case "top":
	                return "text-before-edge";
	            case "bottom":
					return "text-after-edge";
				case "left":
					return "start";
				case "right":
					return "end";
				case "center":
					return "middle";
				case "middle":
					return "middle";
				default:
					return anchor;
	        }
		}

		_getSVGElementType(cpnt) {
			switch (cpnt.type) {
				case ItemType.Rect:
					return "rect";
				case ItemType.Collection:
				case ItemType.Group:
				case ItemType.Glyph:
				case ItemType.Scene:
				case ItemType.Axis:
				case ItemType.Legend:
				case ItemType.Gridlines:
					return "g";
				case ItemType.Area:
				case ItemType.Path:
				case ItemType.Polygon:
				case ItemType.Ring:
				case ItemType.Pie:
				case ItemType.Arc:
				case ItemType.Link:
					return "path";
				case ItemType.Circle:
					return "circle";
				case ItemType.Line:
					return "line";
				case ItemType.PointText:
					return "text";
				case "vertex":
					if (cpnt.shape == "circle")
						return "circle";
					else if (cpnt.shape == "rect")
						return "rect";
					else throw "argument exception";
				case "image":
					return "image";
			}
		}
	}

	class Scale {

		constructor(type, args) {
			this._type = type;
			//offset in terms of absolute coordinates on screen, this property is useful for reusing scales on items that are not in a layout
			this._offset = undefined;
			this.id = "scale" + ItemCounter["scale"]++;
			this._flipped = false;
			this._includeZero = false;
			switch (type) {
				case "linear":
					if (args) {
						//mapping
						let domain = Object.keys(args).map(d => parseFloat(d)).sort((a,b) => a - b),
							range = domain.map(d => args[d]);
						this._scale = d3__namespace.scaleLinear(domain, range);
						if ("clamp" in args)
							this._scale.clamp(args.clamp);
						this._mapping = args;
					} else {
						this._scale = d3__namespace.scaleLinear();
					}
					break;
				case "point":
					this._scale = d3__namespace.scalePoint();
					break;
				case "ordinal":
					this._scale = d3__namespace.scaleOrdinal();
					break;
				case "ordinalColor":
					this._scale = d3__namespace.scaleOrdinal(args && typeof(args) == "string"? d3__namespace[args] : d3__namespace.schemeCategory10);
					break;
				case "power":
					this._scale = d3__namespace.scalePow().exponent(2);
					break;
				case "sqrt":
					this._scale = d3__namespace.scalePow().exponent(0.5);
					break;
				case "log":
					this._scale = d3__namespace.scaleLog();
					break;
				case "identity":
				case "time":
					this._scale = d3__namespace.scaleTime();
					break;
				case "sequentialColor":
				case "divergingColor":
					if (args && typeof(args) == "string") {
						this._scale = d3__namespace.scaleSequential(d3__namespace[args]);
						this._scheme = args;
					}
					else
						this._scale = d3__namespace.scaleSequential();
					break;
			}
			this.encodings = [];
		}

		set scheme(s) {
			if (this._type.indexOf("Color") < 0 && this._type !== "linear") return;
			//TODO: need to verify the scheme is compatible with the data type and characteristics
			let scale = d3__namespace.scaleSequential(d3__namespace[s]), domain = this._scale.domain();
			if (Math.min(...domain) * Math.max(...domain) < 0) {
				let abs = Math.max(Math.abs(Math.min(...domain)), Math.abs(Math.max(...domain)));
				domain = [-abs, abs];
			} 
			scale.domain(domain);
			this._scheme = s;
			this._scale = scale;
			if (this._type === "linear") {
				this._type = this._scale.domain()[0] * this._scale.domain()[1] < 0 ? "divergingColor" : "sequentialColor";
				if (this._mapping)
					this._mapping = undefined;
			}
			for (let enc of this.encodings) {
				if (enc._mapping)
					enc._mapping = undefined;
				enc._scheme = s;
				enc._apply();
			}
		}

		get scheme() {
			return this._scheme;
		}

		get type() {
			return this._type;
		}

		set type(t) {
			let scale;
			switch (t) {
				case "linear":
					scale = d3__namespace.scaleLinear();
					break;
				case "power":
					scale = d3__namespace.scalePow().exponent(2);
					break;
				case "sqrt":
					scale = d3__namespace.scalePow().exponent(0.5);
					break;
				case "log":
					scale = d3__namespace.scaleLog();
					break;
			}
			if (scale) {
				this._type = t;
				scale.domain(this._scale.domain()).range(this._scale.range());
				this._scale = scale;
				for (let enc of this.encodings) {
					//enc._map();
					enc._apply();
				}
				for (let enc of this.encodings) {
					enc.scene._updateAncestorBounds(enc.item, enc.items);
				}
			} else {
				console.warn(Warnings.UNSUPPORTED_SCALE_TYPE_CHANGE + t);
			}
		}

		toJSON() {
			let json = {};
			json.type = this.type;
			json.id = this.id;
			json.offset = this._offset;
			json.domain = this._scale.domain();
			json.range = this.range;
			json.clamp = this.clamp;
			json.isFlipped = this.isFlipped;
			json.includeZero = this.includeZero;
			if (this._scheme)
				json.scheme = this._scheme;
			return json;
		}

		// static mergeDomain(d1, d2){
		// 	return [Math.min(d1[0], d2[0]), Math.max(d1[1], d2[1])];
		// }

		//the argument s will be discarded, this scale will kept being used
		//only internally used in encoding._map
		_merge(s) {
			if (this.type != s.type) {
				throw Errors.DIFFERENT_SCALE_TYPE;
			}
			//let scale;
			let newDomain, newRange;
			switch (this.type) {
				case "linear":
				case "time":
					newDomain = [Math.min(this.domain[0], s.domain[0]), Math.max(this.domain[1], s.domain[1])];
					newRange = [0, this.map(newDomain[1]) - this.map(newDomain[0])];
					break;
				case "point":
				case "ordinalColor":
					newDomain = [...new Set(this.domain.concat(s.domain))];
					//TODO: need to compute new range
					newRange = [];
					//scale = createScale("point");
					//scale.domain = [...new Set(this.domain.concat(s.domain))];
					break;
				default:
					console.log("TODO: merge scale type", this.type);
					break;
			}
			this._scale.domain(newDomain);
			this._scale.range(newRange);
		}

		get domain() {
			//TODO: this._scale.domain contains the true data domain values,
			//this getter returns a different domain depending on includeZero
			if (this._includeZero) {
				let d = this._scale.domain();
				return [0, d[1]];
			} else
				return this._scale.domain();
		}

		set domain(d) {
			this._scale.domain(d);
			for (let enc of this.encodings) {
				//enc._map();
				enc._apply();
			}
		}

		get range() {
			return this._scale.range();
		}

		//disable setting range directly because scale ranges are internally represented as [0, extent], 
		//to support this, the argument should be in real screen coordinates and need to do internal conversion
		set range(r) {
			//TODO: check r is a two-element array
			this._scale.range(r);
			for (let enc of this.encodings) {
				//enc._map();
				enc._apply();
			}

			for (let enc of this.encodings) {
				enc.scene._updateAncestorBounds(enc.item, enc.items);
			}
		}

		_setRange(r) {
			//TODO: check r is a two-element array
			this._scale.range(r);
			SceneValidator.scaleRangeSet(this);
		}

		get clamp() {
			if (this.type == "linear")
				return this._scale.clamp();
			else
				return false;
		}

		set clamp(c) {
			if (this.type == "linear")
				this._scale.clamp(c);
		}

		set rangeExtent(e) {
			//TODO: check e is a valid number
			let r = this._scale.range();
			this._setRange([r[0], r[0] + e]);
			// if (r[0] < r[1])
			// 	this._setRange([r[0], r[0] + e]);
			// else
			// 	this._setRange([r[1] + e, r[1]]);
		}

		get rangeExtent() {
			let r = this._scale.range();
			return Math.abs(r[1] - r[0]);
		}

		_addEncoding(b) {
			if (this.encodings.indexOf(b) < 0)
				this.encodings.push(b);
		}

		map(d) {
			let s = this._scale.copy();
			s.domain(this.domain);
			if (this._flipped) {
				s.range(this._scale.range().reverse());
				return s(d);
			}
			else
				return s(d);
		}

		//TODO: handle flip
		invert(r) {
			return this._scale.invert(r);
		}

		get offset() {
			return this._offset;
		}

		set offset(s) {
			this._offset = s;
			for (let enc of this.encodings) {
				enc._apply();
			}
		}

		get isFlipped() {
			return this._flipped;
		}

		set isFlipped(f) {
			this._flipped = f;
		}

		get includeZero() {
			return this._includeZero;
		}

		set includeZero(i) {
			this._includeZero = i;
			SceneValidator.scaleDomainSet(this);
		}

		get mapping() {
			return this._mapping;
		}

		getEncodedChannels() {
			let channels = {};
			for (let enc of this.encodings) {
				channels[enc.channel] = true;
			} 
			return Object.keys(channels);
		}
	}

	class PackingLayout extends Layout {

	    constructor(args) {
	        super(args);
			this.type = "packing";
	        this.x = "x" in args ?  args.x : 400;
	        this.y = "y" in args ? args.y : 400;
	        this.width = args.width;
	        this.height = args.height;
		}

	    toJSON() {
	        let json = {args: {}};
			json.type = this.type;
			json.args.x = this.x;
			json.args.y = this.y;
			json.args.width = this.width;
			json.args.height = this.height;
			return json;
	    }

	    clone() {
			return new PackingLayout({x: this.x, y: this.y, width: this.width, height: this.height});
		}

	    run() {
			if (this.group == undefined)
				return;
	        let nodes = this.group.children.map(d => ({"name": d.id, "radius": d.radius, "itm": d}));

	        let area = nodes.reduce((total, current) => total + Math.pow(current.radius, 2), 0),
	            s = Math.sqrt(area);
	        
	        if (this.width === undefined) {
	            this.width = s;
	        }

	        if (this.height === undefined) {
	            this.height = s;
	        }

	        let data = d3__namespace.hierarchy({name: "root", children: nodes}).sum(d => d.radius ? d.radius : 0).sort((a, b) => b.value - a.value);
	        d3__namespace.pack().size([this.width, this.height]).radius(d => d.value)(data);

	        for (let c of data.children) {
	            let itm = c.data.itm;
	            let dx = this.x - data.x + c.x - itm.x, dy = this.y - data.y + c.y - itm.y;
	            itm._doTranslate(dx, dy);
	        }
	        this.group._updateBounds();
	    }

	}

	class TreemapLayout extends Layout {

	    constructor(args) {
	        super(args);
	        this.type = "treemap";
	        this._width = args["width"];
	        this._height = args["height"];
	        this._top = args["top"];
	        this._left = args["left"];
	    }

	    toJSON() {
	        let json = {args: {}};
			json.type = this.type;
			json.args.left = this._left;
			json.args.top = this._top;
			json.args.width = this._width;
			json.args.height = this._height;
			return json;
	    }

	    clone() {
	        return new TreemapLayout({});
	    }

	    run() {
	        if (this.group == undefined || !this.group.children || this.group.children.length == 0)
				return;
	        let w = this._width ? this._width : this.group.bounds.width,
	            h = this._height ? this._height : this.group.bounds.height,
	            top = this._top === undefined ? this.group.bounds.top : this._top,
	            left = this._left === undefined ? this.group.bounds.left : this._left;
	        let hierarchy = d3__namespace.hierarchy((this.group)).sum(d => d.type == "rect" ? d.bounds.width * d.bounds.height : 0);
	        d3__namespace.treemap().size([w,h])(hierarchy);
	        this._apply(hierarchy, left, top);
	        this.group.getScene()._updateAncestorBounds(hierarchy.leaves()[0].data);
	    }

	    _apply(node, left, top) {
	        if (node.data.type == "collection" && node.children) {
	            for (let c of node.children)
	                this._apply(c, left, top);
	        } else if (node.data.type == "rect") {
	            node.data.resize(node.x1 - node.x0, node.y1 - node.y0);
	            node.data._doTranslate(node.x0 + left - node.data.bounds.left, node.y0 + top - node.data.bounds.top);
	        }
	    }

	    get width() {
	        return this._width;
	    }

	    set width(w) {
	        this._width = w;
	        this.run();
	    }

	    get height() {
	        return this._width;
	    }

	    set height(h) {
	        this._height = h;
	        this.run();
	    }

	    get top() {
	        return this._top;
	    }

	    set top(t) {
	        this._top = t;
	        this.run();
	    }

	    get left() {
	        return this._left;
	    }

	    set left(l) {
	        this._left = l;
	        this.run();
	    }
	}

	function merge$1(grouping, subgraphs) {
	    let newGrouping = [grouping[0]], newSG = [subgraphs[0]];
	    for (let i = 1; i < subgraphs.length; i++) {
	        let canMerge = false, sg1 = subgraphs[i];
	        for (let j = 0; j < newSG.length; j++) {
	            let sg2 = newSG[j];
	            let set = new Set(sg1);
	            sg2.forEach(d => set.add(d));
	            if (set.size < sg1.length + sg2.length) {
	                newSG[j] = [...set];
	                newGrouping[j] = newGrouping[j].concat(grouping[i]);
	                canMerge = true;
	                break;
	            }
	        }
	        if (!canMerge) {
	            newSG.push(sg1);
	            newGrouping.push(grouping[i]);
	        }
	    }
	    return {grouping: newGrouping, subgraphs: newSG};
	}

	function partition$1(graph) {
	    let nodes = graph.nodes, links = graph.links;
	    let grouping = links.map((d, i) => [i]), subgraphs = links.map((d) => [d.source, d.target]);
	    let newGrouping = merge$1(grouping, subgraphs);
	    while (newGrouping.grouping.length != grouping.length) {
	        grouping = newGrouping.grouping;
	        subgraphs = newGrouping.subgraphs;
	        newGrouping = merge$1(grouping, subgraphs);
	    }

	    let result = [];
	    for (let [i, g] of newGrouping.grouping.entries()) {
	        let data = {"nodes": [], "links": []};
	        data.links = g.map(d => links[d]);
	        const nids = newGrouping.subgraphs[i];
	        data.nodes = nodes.filter( d => nids.indexOf(d[nodeId]) >= 0 );
	        result.push(new Network(data));
	    }
	    return result;
	}

	class Network {

	    constructor(data, name) {
	        this._type = "network";
	        this._nodeTable = new DataTable(data["nodes"], "nodes");
	        this._linkTable = new DataTable(data["links"], "links");
	        this._nodeTable.graph = this;
	        this._linkTable.graph = this;
	        this._nodes = data["nodes"];
	        this._links = data["links"];
	        this._name = name;
	        this._nodeHash = {};
	        for (let n of data["nodes"]){
	            this._nodeHash[n[nodeId]] = n;
	        }
	    }

	    get type() {
	        return this._type;
	    }

	    get nodeTable() {
	        return this._nodeTable;
	    }

	    get linkTable() {
	        return this._linkTable;
	    }

	    get nodes() {
	        return this._nodes;
	    }

	    get links() {
	        return this._links;
	    }

	    getNode(id) {
	        return this._nodeHash[id];
	    } 

	    getSources(node) {
	        let id = node[nodeId];
	        let links = this._links["data"];
	        let nodes = this._nodes["data"];
	        let sources = [];
	        let sourceId;

	        for (let i in links) {
	            if (links[i]["target"] == id) {
	                sourceId = links[i]["source"]; // Get the index of source node
	                let index = nodes.findIndex(x => x[nodeId] === sourceId);
	                sources.push(nodes[index]);
	            }
	        }
	        return sources;
	    }

	    getTargets(node) {
	        let id = node[nodeId];
	        let links = this._links["data"];
	        let nodes = this._nodes["data"];
	        let targets = [];
	        let targetId;

	        for (let i in links) {
	            if (links[i]["source"] == id) {
	                targetId = links[i]["target"];
	                let index = nodes.findIndex(x => x[nodeId] === targetId);
	                targets.push(nodes[index]);
	            }
	        }
	        return targets;
	    }

	    transform(type, fields, params) {
			switch (type) {
				case "partition":
					return partition$1(this);
			}
		}

	    isLinear() {
	        let inDeg = {}, outDeg = {};
	        for (let l of this._links) {
	            if (!(l.source in outDeg))
	                outDeg[l.source] = 0;
	            if (!(l.target in inDeg))
	                inDeg[l.target] = 0;
	            outDeg[l.source]++;
	            inDeg[l.target]++;
	        }
	        for (let n in inDeg)
	            if (inDeg[n] > 1)
	                return false;
	        for (let n in outDeg)
	            if (outDeg[n] > 1)
	                return false;
	        return true;
	    }
	}

	class TidyTreeLayout extends Layout {

	    constructor(args) {
	        super(args);
	        this.type = LayoutType.TidyTree;
	        this._width = "width" in args ? args.width : 500;
	        this._height = "height" in args ? args.height : 500;
	        this._left = "left" in args ? args.left : 100;
	        this._top = "top" in args ? args.top : 100;
	        this._orientation = "orientation" in args ? args.orientation : Orientation.Horizontal;
	    }
	    
	    toJSON() {
	        let json = {args: {}};
			json.args.type = this.type;
			json.args.orientation = this._orientation;
			json.args.left = this._left;
			json.args.top = this._top;
			json.args.width = this._width;
			json.args.height = this._height;
			return json;
	    }

	    run() {
	        if (this.group == undefined)
				return;
	        let dt = this.group.children[0].dataScope._dt;
	        if (dt.tree) {
	            let hierarchy = d3__namespace.hierarchy(dt.tree._data);
	            let wd = Math.max(...this.group.children.map(d => d.bounds.width)), ht = Math.max(...this.group.children.map(d => d.bounds.height));
	            let size = this._orientation == Orientation.Horizontal ? [this._height, this._width] : [this._width, this._height];
	            let tree = d3__namespace.tree().nodeSize([wd, ht]).size(size)(hierarchy);
	            this._apply(tree, this.group);
	        } else {
	            throw Errors.LAYOUT_WITHOUT_TREE;
	        }
	    }

	    _apply(d3Tree, coll) {
	        let mark = coll.children.filter(d => d.dataScope.getFieldValue(nodeId) == d3Tree.data[nodeId])[0];

	        let x, y;
	        switch (this._orientation) {
	            case Orientation.Horizontal:
	                x = d3Tree.y + this._left;
	                y = d3Tree.x + this._top;
	                break;
	            case Orientation.Vertical:
	                x = d3Tree.x + this._left;
	                y = this._top + d3Tree.y;
	                break;
	        }

	        mark.x = x;
	        mark.y = y;
	        
	        if (d3Tree.children && d3Tree.children.length > 0) {
	            for (let c of d3Tree.children)
	                this._apply(c, coll);
	        }
	    }

	    get orientation() {
	        return this._orientation;
	    }

	    set orientation(o) {
	        this._orientation = o;
	        this.run();
	    }

	    get width() {
	        return this._width;
	    }

	    set width(w) {
	        this._width = w;
	        this.run();
	    }

	    get height() {
	        return this._width;
	    }

	    set height(h) {
	        this._height = h;
	        this.run();
	    }

	    get size() {
	        return [this._width, this._height];
	    }

	    set size(s) {
	        this._width = s[0];
	        this._height = s[1];
	        this.run();
	    }
	}

	class ForceLayout extends Layout {

	    constructor(args) {
	        super(args);
	        this.type = LayoutType.Force;
	        this._x = "x" in args ? args.x : 0;
	        this._y = "y" in args ? args.y : 0;
	        this._iterations = "iterations" in args ? args.iterations : 1;
	        this._repulsion = "repulsion" in args ? args.repulsion : 30;
	        this._attraction = "attraction" in args ? args.attraction : 1;
	        this._linkDistance = "linkDistance" in args ? args.linkDistance : 30;
	    }

	    toJSON() {
	        let json = {args: {}};
			json.type = this.type;
			json.args.x = this._x;
			json.args.y = this._y;
			json.args.iterations = this._iterations;
			return json;
	    }

	    run() {
	        if (this.group == undefined)
	            return;
	        let graph = this.group.children[0].dataScope._dt.graph;
	        
	        if (graph) {
	            let links = graph.links.map(d => ({ source: graph.getNode(d.source), target: graph.getNode(d.target) }));
	            let simulation = d3__namespace.forceSimulation(graph.nodes)
	                                .force("charge", d3__namespace.forceManyBody().strength(-this._repulsion))
	                                .force("link", d3__namespace.forceLink(links).id(d => d.id).distance(this._linkDistance))
	                                .force("x", d3__namespace.forceX())
	                                .force("y", d3__namespace.forceY())
	                                .force("center", d3__namespace.forceCenter(this._x, this._y).strength(this._attraction))
	                                ;
	            simulation.stop();
	            simulation.tick(this._iterations);
	            
	            for (let i = 0; i < this.group.children.length; i++) {
	                this.group.children[i].x = graph.nodes[i].x;
	                this.group.children[i].y = graph.nodes[i].y;
	            }
	        }
	    }
	}

	/**
	 * Generates an array of commands that would reconstruct a given scene
	 */
	class SpecGenerator {

	    constructor() {
	        this.axes = {};
	        this.guideCmds = [];
	        this.collectionCmds = [];
	        this.glyphCmds = [];
	        this.spec = [];
	    }

	    run(scene) {
	        for (let c of scene.children) {
	            switch (c.type) {
	                case ItemType.Axis: {
	                    let id = c.classId ? c.classId : c.id;
	                    this.axes[id] = c;
	                    break;
	                }
	                case ItemType.Gridlines:
	                case ItemType.Legend:{
	                    let json = c.toJSON();
	                    this.guideCmds.push({
	                        cmd: c.type,
	                        channel: json.channel,
	                        field: json.field,
	                        args: json.args
	                    });
	                    break;
	                }
	                case ItemType.Collection:
	                case ItemType.Group:
	                case ItemType.Glyph: {
	                    let struct = [];
	                    this._analyze(c, struct);
	                    // console.log("struct", c.type);
	                    // for (let s of struct)
	                    //     console.log(s);
	                    for (let i = struct.length - 1; i > 0; i--) {
	                        for (let f of struct[i].fields)
	                            struct[i - 1].fields.delete(f);
	                    }
	                    for (let [i, s] of struct.entries()) {
	                        if (s.item instanceof Mark) {
	                            let m = {
	                                cmd: "mark",
	                                type: s.item.type,
	                                output: s.item,
	                                args: s.item.toJSON().args
	                            };
	                            this._inferMarkArgs(m, scene);
	                            this.collectionCmds.push(m);
	                        } else if (s.item instanceof Glyph) {
	                            this.collectionCmds.push({
	                                cmd: "glyph",
	                                output: s.item,
	                                input: struct.slice(0, i).map(d => d.item),
	                                args: {}
	                            });
	                        } else if (s.item instanceof Collection) {
	                            let f = [...struct[i-1].fields][0];
	                            let o = {
	                                cmd: "join",
	                                input: struct[i-1].item,
	                                output: s.item,
	                                data: struct[i-1].item.dataScope.dataTable.id,
	                                args: {field: f}
	                            };
	                            if (f == atlas_rowId)
	                                delete o.field;
	                            this.collectionCmds.push(o);
	                        }

	                        if (s.item.dataScope && s.item.dataScope.fields.length == 0 && !s.item.parent.dataScope) {
	                            this.collectionCmds.push({
	                                cmd: "attach",
	                                input: s.item,
	                                data: s.item.dataScope.dataTable.id
	                            });
	                        }
	                    }
	                    break;
	                }
	                default:
	                    if (c instanceof Mark) {
	                        let m = {
	                            cmd: "mark",
	                            type: c.type,
	                            output: c,
	                            args: c.toJSON().args
	                        };
	                        this._inferMarkArgs(m, scene);
	                        this.glyphCmds.push(m);
	                    }
	                    break;
	            }
	        }

	        this._inferJoin();
	        this._inferArgs(scene);

	        for (let a in this.axes){
	            let json = this.axes[a].toJSON();
	            this.guideCmds.push({
	                cmd: json.type,
	                channel: json.channel,
	                field: json.field,
	                args: json.args
	            });
	        }

	        // console.log("collection commands");
	        // for (let c of this.collectionCmds)
	        //     console.log(c);
	        // console.log("glyphs", this.glyphCmds);
	        // console.log("guides", this.guideCmds);

	        this._generateFullSpec(scene);
	        return this.spec;
	    }

	    _inferJoin() {
	        for (let c of this.collectionCmds) {
	            if (c.cmd != "join") continue;
	            let itm = c.input, p = itm.parent;
	            switch (itm.type) {
	                case ItemType.Rect:
	                    if (p.layout && p.layout.type == LayoutType.Stack)
	                        c.cmd = "divide";
	                    else
	                        c.cmd = "repeat";
	                    break;                    
	                default:
	                    c.cmd = "repeat";
	                    break;
	            }
	        }
	    }

	    _inferArgs(scene) {
	        for (let c of this.collectionCmds) {
	            switch(c.cmd) {
	                case "mark":
	                    this._inferMarkArgs(c, scene);
	                    break;
	                case "divide":
	                    this._inferDivideArgs(c, scene);
	                    break;
	            }
	        }
	    }

	    _inferDivideArgs(c) {
	        c.args.orientation = c.output.layout.orientation;
	    }

	    _inferMarkArgs(c, scene) {
	        let itm = c.output, p = itm.parent;
	        let itmPeers = getPeers(itm, scene), parentPeers = getPeers(p, scene);
	        switch (itm.type) {
	            case ItemType.Rect:
	                if (p.layout && p.layout.type == LayoutType.Grid) {
	                    c.args.width = p.layout.cellBounds[0].width;
	                    c.args.height = p.layout.cellBounds[0].height;
	                } else if (p.layout && p.layout.type == LayoutType.Stack) {
	                    c.args.width = Math.max(...parentPeers.map(d => d.bounds.width));
	                    c.args.height = Math.max(...parentPeers.map(d => d.bounds.height));
	                } else {
	                    c.args.width = Math.max(...itmPeers.map(d => d.bounds.width));
	                    c.args.height = Math.max(...itmPeers.map(d => d.bounds.height));
	                }
	                c.args.left = Math.min(...itmPeers.map(d => d.bounds.left));
	                c.args.top = Math.min(...itmPeers.map(d => d.bounds.top));
	                break;
	            case ItemType.Line:
	                c.args.x1 = Math.min(...itmPeers.map(d => d.vertices[0].x));
	                c.args.y1 = Math.min(...itmPeers.map(d => d.vertices[0].y));
	                c.args.x2 = Math.min(...itmPeers.map(d => d.vertices[1].x));
	                c.args.y2 = Math.min(...itmPeers.map(d => d.vertices[1].y));
	                break;
	            case ItemType.Arc:
	                c.args.x = itm.x;
	                c.args.y = itm.y;
	                c.args.innerRadius = itm.innerRadius;
	                c.args.outerRadius = itm.outerRadius;
	                break;
	        }
	        for (let s in itm.styles) {
	            c.args[s] = itm.styles[s];
	        }
	    }

	    _analyze(itm, result) {
	        if (itm instanceof Glyph) {
	            for (let c of itm.children) 
	                this._analyze(c, result);    
	        } else if (itm instanceof Group) {
	            this._analyze(itm.firstChild, result);
	        }

	        let node = {type: itm.type, item: itm};
	        if (itm.dataScope)
	            node.fields = new Set(itm.dataScope.fields);
	        else
	            node.fields = new Set();
	        result.push(node);  
	    }

	    _generateFullSpec(scene) {
	        this.spec = [];
	        this.spec.push({
	            cmd: "scene",
	            args: {fillColor: scene.fillColor}
	        });

	        let tables = scene.getDataTables(); //, sourceTables = {};
	        let imports = {}, transforms = [];
	        for (let t in tables) {
	            let table = tables[t];
	            if (table.sourceDataTable) {
	                while (table.sourceDataTable) {
	                    transforms.push({
	                        cmd: "transform",
	                        type: table.transform.type,
	                        args: table.transform.args,
	                        input: table.sourceDataTable.id,
	                        output: table.id
	                    });
	                    table = table.sourceDataTable;
	                }
	            }
	            if (!(table.id in imports)) {
	                imports[table.id] = {
	                    cmd: "data",
	                    url: table.url,
	                    output: table.id
	                };
	            }
	        }

	        this.spec = this.spec.concat(Object.values(imports));
	        this.spec = this.spec.concat(transforms);

	        let sortChildren = [];

	        for (let c of this.collectionCmds) {  
	            let l;         
	            if (c.output && c.output.layout) {
	                l = {
	                    cmd: "layout",
	                    type: c.output.layout.type,
	                    input: c.output.id,
	                    args: c.output.layout.toJSON().args
	                };
	            }
	            this.spec.push(c);
	            if (c.output && c.output.childrenOrder) {
	                sortChildren.push({
	                    cmd: "sortChildren",
	                    args: c.output.childrenOrder,
	                    input: c.output.id
	                });
	            }
	            if (l)
	                this.spec.push(l);
	            
	            if (c.input && Array.isArray(c.input)) { //glyph
	                c.input = c.input.map(d => d.classId ? d.classId : d.id);
	            } else if (c.input)
	                c.input = c.input.classId ? c.input.classId : c.input.id;
	            if (c.output)
	                c.output = c.output.classId ? c.output.classId : c.output.id;
	        }

	        let scales = {}, encodings = [];
	        for (let classId in scene.encodings) {
	            for (let channel in scene.encodings[classId]) {
	                let enc = scene.encodings[classId][channel];
	                if (enc.scale && !(enc.scale.id in scales)) {
						scales[enc.scale.id] = enc.scale.toJSON();
					}
	                let args = enc.toJSON().args;
	                args.field = enc.field;
	                args.channel = enc.channel;
	                delete args.datatable;
	                encodings.push({
	                    cmd: "encode",
	                    input: getEncodingKey(enc.anyItem),
	                    scale: enc.scale.id,
	                    args: args
	                });
	            }
	        }

	        for (let s in scales) {
	            let o = scales[s];
	            o.cmd = "scale";
	            this.spec.push(o);
	        }

	        this.spec = this.spec.concat(encodings);
	        this.spec = this.spec.concat(sortChildren);

	        for (let c in scene.constraints) {
	            let constr = scene.constraints[c];
	            let o = {
	                cmd: "constraint",
	                type: constr.type,
	                args: {}
	            };
	            switch (constr.type) {
	                case ConstraintType.Affix:
	                    o.item = constr.item.classId ? constr.item.classId : constr.item.id;
	                    o.baseItem = constr.baseItem.classId ? constr.baseItem.classId : constr.baseItem.id;
	                    o.channel = constr.channel;
	                    o.args.itemAnchor = constr.itemAnchor;
	                    o.args.baseAnchor = constr.baseAnchor;
	                    o.args.offset = constr.offset;
	                    break;
	                case ConstraintType.Align:
	                    //TODO: need to actually do more to infer what items are being aligned
	                    o.items = constr.items.map(d => d.classId ? d.classId : d.id);
	                    o.anchor = constr.anchor;
	                    break;
	            }
	            this.spec.push(o);
	        }

	        for (let c of this.guideCmds) {
	            this.spec.push(c);
	        }

	        for (let c of this.glyphCmds) {
	            if (c.output)
	                c.output = c.output.classId ? c.output.classId : c.output.id;
	            this.spec.push(c);
	        }
	    }
	}

	class SceneLoader {

	    constructor() {
	        this.axes = {};
	        this.legends = [];
	        this.gridlines = [];
	        this.scales = {};
	        this.tables = {};
	    }

	    load(json) {
	        //console.log("saved", json);
	        let sceneArgs = {};
	        if (json.fillColor)
	            sceneArgs.fillColor = json.fillColor;
	        if (json.itemCounter) {
	            for (let t in json.itemCounter)
	                ItemCounter[t] = json.itemCounter[t];
	        }
	        let scn = scene(sceneArgs);
	        scn.id = json.id;
	        scn.type = json.type;
	        if (json.bounds)
	            scn._bounds = new Rectangle(json.bounds.left, json.bounds.top, json.bounds.width, json.bounds.height);

	        if (json.tables) {
	            for (let t in json.tables) {
	                this.tables[t] = new DataTable(json.tables[t].data, json.tables[t].url, json.tables[t].fieldTypes);
	                this.tables[t].id = json.tables[t].id;
	            }
	        }

	        for (let c of json.children) {
	            this._processItem(scn, c, scn);
	        }

	        if (json.scales) {
	            for (let s in json.scales)
	                this._loadScale(json.scales[s], scn);
	        }

	        if (json.encodings) {
	            for (let e of json.encodings) {
	                this._loadEncoding(e, scn);
	            }
	        }

	        if (json.constraints) {
	            for (let c in json.constraints)
	                this._loadConstraint(json.constraints[c], scn);
	        }

	        for (let a in this.axes) {
	            this._createGuide(scn, this.axes[a]);
	        }

	        for (let l of this.legends) {
	            this._createGuide(scn, l);
	        }

	        for (let l of this.gridlines) {
	            this._createGuide(scn, l);
	        }

	        //console.log("loaded", scn);
	        return scn;
	    }

	    _loadScale(s) {
	        let scale;
	        if (s.type === "sequentialColor" && s.scheme) {
	            scale = createScale(s.type, s.scheme);
	        } else {
	            scale = createScale(s.type);
	            scale.range = s.range;
	        }
	        scale.domain = s.type == "time" ? s.domain.map(d => new Date(d)) : s.domain;
	        scale.id = s.id;
	        if ("offset" in s)
	            scale.offset = s.offset;
	        scale.isFlipped = s.isFlipped;
	        scale.clamp = s.clamp;
	        if ("includeZero" in s)
	            scale.includeZero = s.includeZero;
	        this.scales[scale.id] = scale;
	        //console.log(scale.domain, scale.range);
	    }

	    _loadEncoding(enc, scene) {
	        if (enc.args.datatable)
	            enc.args.datatable = this.tables[enc.args.datatable];
	        if (enc.args.scale) {
	            enc.args.scale = this.scales[enc.args.scale];
	        }
	        //let item = scene.getItem(enc.anyItem);
	        let items = enc.items.map(d => scene.getItem(d));
	        scene._doEncode(items, enc.args);
	    }

	    _createGuide(scene, guide) {
	        switch (guide.type) {
	            case ItemType.Axis:
	                if (guide.args.item) {
	                    guide.args.item = scene.getItem(guide.args.item);
	                }
	                scene.axis(guide.channel, guide.field, guide.args);
	                break;
	            case ItemType.Legend:
	                scene.legend(guide.channel, guide.field, guide.args);
	                break;
	            case ItemType.Gridlines:
	                scene.gridlines(guide.channel, guide.field, guide.args);
	                break;
	        }
	    }

	    _processItem(parent, itm, scene) {
	        switch (itm.type) {
	            case ItemType.Axis: {
	                let id = itm.classId ? itm.classId : itm.id;
	                if (itm.args.tickValues && itm.args.isDate) {
	                    itm.args.tickValues = itm.args.tickValues.map(d => new Date(d));
	                }
	                this.axes[id] = itm;
	                break;
	            }
	            case ItemType.Gridlines:
	                if (itm.args.values && itm.args.isDate) {
	                    itm.args.values = itm.args.values.map(d => new Date(d));
	                }
	                this.gridlines.push(itm);
	                break;
	            case ItemType.Legend:
	                this.legends.push(itm);
	                break;
	            case ItemType.Collection: {
	                let coll = scene.collection();
	                parent.addChild(coll);
	                this._loadGroup(coll, itm, scene);
	                break;
	            }
	            case ItemType.Group: {
	                let g = scene.group();
	                parent.addChild(g);
	                this._loadGroup(g, itm, scene);
	                break;
	            }
	            case ItemType.Glyph: {
	                let glyph = scene.glyph();
	                parent.addChild(glyph);
	                this._loadGroup(glyph, itm, scene);
	                break;
	            }
	            default:
	                this._loadMark(parent, itm, scene);
	                break;
	        }
	    }

	    _loadConstraint(c, scene) {
	        switch (c.type) {
	            case "affixation": {
	                let item = scene.getItem(c.item), baseItem = scene.getItem(c.baseItem);
	                let cstr = new AffixConstraint(item, baseItem, scene, c.channel, c.itemAnchor, c.baseAnchor, c.offset);
	                cstr.id = c.id;
	                scene.constraints[c.id] = cstr;
	                cstr.apply();
	                return cstr;
	            }
	            case "alignment": {
	                let items = c.items.map(d => scene.getItem(d));
	                let cstr = new AlignConstraint(items, c.direction);
	                cstr.id = c.id;
	                scene.constraints[c.id] = cstr;
	                cstr.apply();
	                return cstr;
	            }
	        }
	    }

	    _loadDataScope(ds) {
	        let scope = new DataScope(this.tables[ds.dt]);
	        for (let f in ds.f2v) {
	            scope._field2value[f] = ds.f2v[f];
	            scope._updateTuples(f, ds.f2v[f]);
	        }
	        return scope;
	    }

	    _loadGroup(coll, itm, scene) {
	        coll.id = itm.id;
	        if (itm.classId)
	            coll.classId = itm.classId;
	        if (itm.dataScope)
	            coll.dataScope = this._loadDataScope(itm.dataScope);
	        if (itm.children) {
	            for (let c of itm.children) {
	                this._processItem(coll, c, scene);
	            }
	        }
	        if (itm.layout) {
	            let l = this._loadLayout(itm.layout);
	            l.group = coll;
	            coll._layout = l;
	        }
	        if (itm.bounds)
	            coll._bounds = new Rectangle(itm.bounds.left, itm.bounds.top, itm.bounds.width, itm.bounds.height);
	    }

	    _loadMark(parent, itm, scene) {
	        if (itm.args.fillColor && itm.args.fillColor.type === "LinearGradient") {
	            let g = itm.args.fillColor;
	            itm.args.fillColor = linearGradient(g);
	            itm.args.fillColor.id = g.id;
	            itm.args.fillColor._stops = g.stops;
	        }
	        if ("id" in itm)
	            itm.args.id = itm.id;
	        let mark = scene.mark(itm.type, itm.args);
	        if (itm.classId)
	            mark.classId = itm.classId;
	        if (itm.dataScope)
	            mark.dataScope = this._loadDataScope(itm.dataScope);
	        if (itm.vertices) {
	            const vertices = [];
	            for (let d of itm.vertices) {
	                const v = Vertex.fromJSON(d, mark);
	                if (v.dataScope)
	                    v.dataScope = this._loadDataScope(v.dataScope);
	                vertices.push(v);
	            }
	            mark.vertices = vertices;
	            //TODO: modify instead of replace segments
	            mark.segments = [];
	            for (let i = 1; i < mark.vertices.length; i++)
	                mark.segments.push(new Segment(mark.vertices[i-1], mark.vertices[i], mark, mark.segmentCounter++));
	        }
	        if (itm.bounds)
	            mark._bounds = new Rectangle(itm.bounds.left, itm.bounds.top, itm.bounds.width, itm.bounds.height);
	        if (isPath(mark)) {
	            mark.vertexCounter = itm.vertexCounter;
	            mark.segmentCounter = itm.segmentCounter;
	            mark.curveMode = itm.curveMode;
	        } else if (itm.type === ItemType.Image) {
	            mark.src = itm.src;
	            mark.width = itm.width;
	            mark.height = itm.height;
	            mark.x = itm.x;
	            mark.y = itm.y;
	        }
	        parent.addChild(mark);
	    }

	    _loadLayout(l) {
	        let lo = layout(l.type, l.args);
	        switch (l.type) {
	            case LayoutType.Grid:
	                lo._left = l.left;
	                lo._top = l.top;
	                break;
	        }
	        return lo;
	    }

	}

	class SpecExecutor {

	    constructor() {
	        
	    }

	    async run(spec) {
	        let scn;
	        let itmHash = {}, dataHash = {}, scales = {};
	        let data;
	        // console.log("spec");
	        for (let c of spec) {
	            //console.log(c);
	            switch (c.cmd) {
	                case "scene":
	                    scn = scene(c.args);
	                    break;
	                case "data":
	                    data = await csv(c.url);
	                    dataHash[c.output] = data;
	                    break;
	                case "transform":
	                    dataHash[c.output] = dataHash[c.input].transform(c.type, c.args);
	                    break;
	                case "mark":
	                    itmHash[c.output] = scn.mark(c.type, c.args);
	                    break;
	                case "glyph":
	                    itmHash[c.output] = scn.glyph(...c.input.map(d => itmHash[d]));
	                    break;
	                case "attach":
	                    scn.attach(itmHash[c.input], dataHash[c.data]);
	                    break;
	                case "repeat": {
	                    let coll = scn.repeat(itmHash[c.input], dataHash[c.data], c.args);
	                    itmHash[c.output] = coll;
	                    break;
	                }
	                case "divide": {
	                    let coll = scn.divide(itmHash[c.input], dataHash[c.data], c.args);
	                    itmHash[c.output] = coll;
	                    break;
	                }
	                case "layout":
	                    itmHash[c.input].layout = layout(c.type, c.args);
	                    break;
	                case "sortChildren":
	                    if ("field" in c.args)
	                        itmHash[c.input].sortChildrenByData(c.args.field, c.args.reverse, c.args.order);
	                    else if ("channel" in c.args)
	                        itmHash[c.input].sortChildren(c.args.channel, c.args.reverse);
	                    break;
	                case "scale": {
	                    let scale = createScale(c.type);
	                    scale.id = c.id;
	                    scale.domain = c.type == "time" ? c.domain.map(d => new Date(d)) : c.domain;
	                    scale.range = c.range;
	                    scale.clamp = c.clamp;
	                    scale.isFlipped = c.isFlipped;
	                    if ("offset" in c)
	                        scale.offset = c.offset;
	                    scales[scale.id] = scale;
	                    break;
	                }
	                case "encode":
	                    let itm, encKey = c.input;
	                    if (encKey.indexOf("_v_") > 0) {
	                        let idx = parseInt(encKey.split("_v_")[1]);
	                        itm = itmHash[encKey.split("_v_")[0]].vertices[idx];
	                    } else if (encKey.indexOf("_v") > 0) ; else if (encKey.indexOf("_s_") > 0) {
	                        let idx = parseInt(encKey.split("_s_")[1]);
	                        itm = itmHash[encKey.split("_s_")[0]].segments[idx];
	                    } else if (encKey.indexOf("_s") > 0) ; else {
	                        itm = itmHash[c.input];
	                    }
	                    if(c.scale && scales[c.scale])
	                        c.args.scale = scales[c.scale];
	                    scn.encode(itm, c.args);
	                    break;
	                case "constraint":
	                    switch (c.type) {
	                        case ConstraintType.Affix:
	                            scn.affix(itmHash[c.item], itmHash[c.baseItem], c.channel, c.args);
	                            break;
	                    }
	                    break;
	                case "axis":
	                    scn.axis(c.channel, c.field, c.args);
	                    break;
	                case "legend":
	                    scn.legend(c.channel, c.field, c.args);
	                    break;
	                case "gridlines":
	                    scn.gridlines(c.channel, c.field, c.args);
	            }
	        }
	        return scn;
	    }
	}

	let DEG2RAD = Math.PI / 180;
	class WebGLRenderer {

		constructor(canvasId) {
			this._canvasId = canvasId;
			this._doesCollectionHaveBounds = false;
			this._app = new PIXI__namespace.Application({
				antialias: true,    // default: false
				width: 1600,
				height: 1000,
				view: document.getElementById(this._canvasId)
			});
			this._app.renderer.autoResize = true;
		}

		/**
		 * @param {Scene} scene 
		 * @param {string} id 
		 * @param {*} args 
		 */
	    render(scene, params) {
			let args = params ? params : {};
			this._app.renderer.backgroundColor = toHexColor(scene.fillColor ? scene.fillColor : "#fff");
			this._doesCollectionHaveBounds = !!args.collectionBounds;
			this._app.stage.removeChildren();
			this._app.renderer.clear();
			let final = this._renderItem(scene);
			this._app.stage.addChild(final);
		}

		_renderItem(item) {
			switch (item.type) {
				case ItemType.Ellipse:
				case ItemType.LinearGradient:
					throwError("mark", item, Errors.FEATURE_NOT_IMPLEMENTED);
					break;

				case ItemType.Circle:
					return this._renderCircle(item);

				case ItemType.Pie:
					return this._renderArc(item);

				case ItemType.Area:
					return this._renderArea(item);

				case ItemType.Polygon:
					return this._renderPolygon(item);

				case ItemType.Axis:
					return this._renderAxis(item);

				case ItemType.Collection:
					return this._renderCollection(item);

				case ItemType.Glyph:
				case ItemType.Group:
				case ItemType.Gridlines:
				case ItemType.Legend: 
				case ItemType.Scene:
					return this._renderGroup(item);

				case ItemType.Path:
					return this._renderPath(item);
					
				case ItemType.Line:
					return this._renderLinearPath(item);

				case ItemType.Rect:
					return this._renderRectangle(item);

				case ItemType.PointText:
					return this._renderText(item);

				case ItemType.Arc:
					return this._renderArc(item);

				case ItemType.Image:
					return this._renderImage(item);

				case ItemType.Link:
					return this._renderLink(item);

				case ItemType.Ring:
					return this._renderRing(item);

				default:
					console.log(item.type);
					throw new Error(`Expect: itemType, Actual: ${item}\nWait that's illegal`)
			}
		}

		/**
		 * @param {RectPath} rect 
		 * @returns {PIXI.Rectangle}
		 */
		_renderRectangle(rect) {
			let rectangle = new PIXI.Graphics();
			decorate(rectangle, rect.styles);
			rectangle.lineStyle(
				rect.styles["strokeWidth"],
				toHexColor(rect.styles["strokeColor"])
			);
			beginGradientOrColorFill(rect.styles, rectangle, rect.height);
			rectangle.drawRect(0, 0, rect.width, rect.height);
			rectangle.x = rect.left;
			rectangle.y = rect.top;
			rectangle.endFill();
			return rectangle;
		}

		/**
		 * @param {PointText} pointText
		 * @returns {PIXI.Text}
		 */
		_renderText(pointText) {
			let style = new PIXI.TextStyle({
				fontSize: pointText.styles["fontSize"],
				fontFamily: pointText.styles["fontFamily"],
				fontWeight: styleFontWeight2PixiFontWeight(pointText.styles["fontWeight"]),
				fill: toHexColor(pointText.styles["fillColor"]),
			});
			let pixiText = new PIXI__namespace.Text(pointText.text, style);
			let container = new PIXI.Container();
			decorate(pixiText, pointText.styles);

			pixiText.x = pointText.x;
			pixiText.y = pointText.y;

			pixiText.anchor.set(... styleAnchor2PixiAnchor(pointText.anchor));
			container.addChild(pixiText);

			let pivot = rotation2PixiPivot(pointText._rotate);
			container.pivot.set(pivot[0], pivot[1]);
			container.angle = rotation2PixiAngle(pointText._rotate);
			container.position.set(pivot[0], pivot[1]);

			return container;
		} 

		/**
		 * @param {Group} group
		 * @returns {Container}
		 */
		_renderGroup(group) {
			let container = new PIXI.Container();
			for (const item of group.children) {
				let t = this._renderItem(item);
				if (t == undefined) throw new Error();
				container.addChild(t);
			}

			return container;
		}

		/**
		 * 
		 * @param {Group} axis 
		 * @returns 
		 */
		_renderAxis(axis) {
			let container = this._renderGroup(axis);
			let pivot = rotation2PixiPivot(axis._rotate);
			container.pivot.set(pivot[0], pivot[1]);
			container.angle = rotation2PixiAngle(axis._rotate);
			container.position.set(pivot[0], pivot[1]);
			return container;
		}

		/**
		 * @param {Collection} collection 
		 * @returns {Container}
		 */
		_renderCollection(collection) {
			let container = new PIXI.Container();
			let group = this._renderGroup(collection);
			container.addChild(group);

			// ------------------ Render Bounds -----------------------------------

			if (!this._doesCollectionHaveBounds) return container;

			let contour = new PIXI.Graphics();
			// short for leading dash relative start position
			let leadDashRelStrtPos = 0;
			let bounds = collection.bounds;
			let l = bounds.left;
			let r = bounds.right;
			let t = bounds.top;
			let b = bounds.bottom;
			let style = { 
				strokeWidth: 1,
				color: 0x1ecb40,
				dashLength: 5,
				dashSpacing: 5
			};

			leadDashRelStrtPos = drawDash(l, r,  t, leadDashRelStrtPos, style, contour);
			leadDashRelStrtPos = drawDash(t, b, -r, leadDashRelStrtPos, style, contour);
			leadDashRelStrtPos = drawDash(r, l,  b, leadDashRelStrtPos, style, contour);
								drawDash(b, t, -l, leadDashRelStrtPos, style, contour);

			container.addChild(contour);
			return container;

			// ------------------ End ---------------------------------------------

			/**
			 * @param {Graphics} graphics 
			 * @param {Number} leadDashRelStrtPos the projected start position of a leading dash. 
			 * for example, if a dash is broken by the end of last edge, 
			 * the leading dash of next edge is incomplete and thus, the projected start point would be beyond 
			 * the start point. Therefore, it is marked with a negative value, RELATIVE to the starting point
			 *        V the starting point of this dash is thus -1
			 * |---- -|--- ----
			 * @param {Number} dimensionalConstrain it can be x or y, depends on which dimension remains unchanged
			 * positive values indicate an horizontal edge
			 * negative values indicate a vertical edge
			 * @returns {Number} leading dash start position for next edge
			 */
			function drawDash(start, end, dimensionalConstrain, leadDashRelStrtPos, style, graphics) {
				// if the dash line is going left -> right, then direction = +1. v.v.
				let dir = start <= end ? 1 : -1;

				// if the dash is a remain of last cut-off dash, it actually starts at the starting point
				// otherwise just use the start position
				// note here next.point is a reference, 
				// it is a hack so that changes to next.point can be reflected to p as well
				let next = leadDashRelStrtPos >= 0 ?
						{point: start + leadDashRelStrtPos * dir} :
						{point: start};

				// p stands for pointer. It's used as an abstraction 
				// so that this function can be applied to both horizontal and vertical scenarios
				let p = dimensionalConstrain > 0 ? 
						[next, { point: dimensionalConstrain }] :
						[{ point: -dimensionalConstrain }, next];

				graphics.lineStyle({
					width: style.strokeWidth,
					color: style.color
				});
				// move to the actual start
				graphics.moveTo(p[0].point, p[1].point);
				// set the next point to the end of first dash (regardless of whether it's complete)
				next.point = leadDashRelStrtPos * dir + start + style.dashLength * dir;
				graphics.lineTo(p[0].point, p[1].point);

				let isDrawing = false;
				// move next point to (the start position)of the second dash
				next.point += style.dashLength * dir;
				// if the next point is with the range from start to end
				while (next.point * dir <= end * dir) {
					if (isDrawing) {
						graphics.lineTo(p[0].point, p[1].point);
						isDrawing = false;
						next.point += style.dashSpacing * dir;
					} else {
						graphics.moveTo(p[0].point, p[1].point);
						isDrawing  = true;
						next.point += style.dashLength * dir;
					}
				}

				// finish the last dash
				// if it's still drawing, cut it off (and continue it in the next edge)
				if (isDrawing) {
					// handle the horizontal and vertical cases
					if (dimensionalConstrain > 0) graphics.lineTo(end, dimensionalConstrain);
					else graphics.lineTo(-dimensionalConstrain, end);
					return (end - next.point) * dir;
				// otherwise it's fine, let the math handle it automagically
				} else {
					return (next.point - end) * dir;
				}
			}
		}

		/**
		 * @param {AreaPath} areaPath 
		 */
		_renderArea(areaPath) {
			switch (areaPath.curveMode) {
				case "linear":
					return this._renderPolygon(areaPath);

				case "basis":
					return this._renderBezierArea(areaPath);
			
				default:
					return throwError("areaPath", areaPath, Errors.FEATURE_NOT_IMPLEMENTED);
			}
		}

		_renderBezierArea(areaPath) {
			let area = new PIXI.Graphics();
			decorate(area, areaPath.styles);
			area.lineStyle({
				width: areaPath.styles["strokeWidth"],
				color: toHexColor(areaPath.styles["strokeColor"])
			});
			let pathData = areaPath.getSVGPathData();
			let pathJSON = parseDPath(pathData);

			beginGradientOrColorFill(areaPath.styles, area, areaPath.bounds.height);
			drawOnGraphicsFromJSONData(area, pathJSON);
			area.endFill();

			return area;
		}

		/**
		 * @param {PolygonPath} polygonPath 
		 */
		_renderPolygon(polygonPath) {
			let container = new PIXI__namespace.Container();

			// ------------------ Contour -----------------------------------------

			let contour = this._renderLinearPath(polygonPath);
			contour.getChildAt(0).lineTo(
				polygonPath.vertices[0].x, 
				polygonPath.vertices[0].y
			);

			// ------------------ Fill --------------------------------------------

			let polygonFill = new PIXI__namespace.Graphics();
			decorate(polygonFill, polygonPath.styles);
			let path = [];
			for (const vertex of polygonPath.vertices) {
				path.push(vertex.x - polygonPath.bounds.left); 
				path.push(vertex.y - polygonPath.bounds.top);
			}
			//polygonFill.beginFill(toHexColor(polygonPath.styles["fillColor"]));
			beginGradientOrColorFill(polygonPath.styles, polygonFill, polygonPath.bounds.height);
			polygonFill.drawPolygon(path);
			polygonFill.x += polygonPath.bounds.left;
			polygonFill.y += polygonPath.bounds.top;
			polygonFill.endFill();

			// ------------------ Finalize ----------------------------------------
			
			container.addChild(polygonFill);
			container.addChild(contour);
			return container;
		}

		/**
		 * @param {Path} path 
		 * @returns {Container}
		 */
		_renderPath(path) {

			switch (path.curveMode) {
				case "linear":
					return this._renderLinearPath(path);

				case "bumpX":
				case "natural":
					return this._renderBezierPath(path);
			
				default:
					throwError("path", path, Errors.FEATURE_NOT_IMPLEMENTED);
					break;
			}

			// ------------------ End ---------------------------------------------

		}

		/**
		 * 
		 * @param {Path} path 
		 * @returns 
		 */
		_renderLinearPath(path) {
			let container = new PIXI.Container();
			let line = new PIXI.Graphics();
			let isContinuous = path.styles["strokeDash"] == "none";
			decorate(line, path.styles);
			let vertex0 = path.vertices[0];
			line.lineStyle({
				width: path.styles["strokeWidth"],
				color: toHexColor(path.styles["strokeColor"])
			});

			line.moveTo(vertex0.x, vertex0.y);
			if (isContinuous) {
				for (let i = 1; i < path.vertices.length; i++) {
					const vertex = path.vertices[i];
					line.lineTo(vertex.x, vertex.y);
				}
			} else {
				drawDashLine(path.vertices, path.styles["strokeDash"], line);
			}
			
			container.addChild(line);

			// ------------------ Render vertices ---------------------------------

			for (let i = 0; i < path.vertices.length; i++) {
				let vertex = path.vertices[i];
				let renderedVertex = this._renderVertex(vertex);
				if (renderedVertex != null) container.addChild(renderedVertex);
			}

			return container;
		}

		/**
		 * @param {Path} path 
		 */
		_renderBezierPath(path) {
			let container = new PIXI.Container();
			let graphics = new PIXI.Graphics();
			decorate(graphics, path.styles);
			graphics.lineStyle({
				width: path.styles["strokeWidth"],
				color: toHexColor(path.styles["strokeColor"])
			});
			let pathData = path.getSVGPathData();
			let pathJSON = parseDPath(pathData);
			drawOnGraphicsFromJSONData(graphics, pathJSON);
			container.addChild(graphics);

			// ------------------ Render vertices ---------------------------------

			for (let i = 0; i < path.vertices.length; i++) {
				let vertex = path.vertices[i];
				let renderedVertex = this._renderVertex(vertex);
				if (renderedVertex != null) container.addChild(renderedVertex);
			}

			return container;
		}

		/**
		 * NULLABLE!!!
		 * @param {Vertex} vertex 
		 * @returns {Container} null if vertex shape is undefined
		 */
		_renderVertex(vertex) {
			switch (vertex.shape) {
				case "rect":
					return renderRectVertex(vertex);

				case "circle":
					return renderCircleVertex(vertex);

				case undefined:
					return null;

				default:
					throwError("vertex shape", vertex.shape, Errors.FEATURE_NOT_IMPLEMENTED);
			}

			function renderRectVertex(vertex) {
				let rectVertex = new PIXI__namespace.Graphics();
				rectVertex.lineStyle({
					width: vertex.strokeWidth,
					color: toHexColor(vertex.strokeColor)
				});
				rectVertex.beginFill(toHexColor(vertex.fillColor));
				rectVertex.drawRect(
					vertex.x - vertex.width / 2,
					vertex.y - vertex.height / 2,
					vertex.width,
					vertex.height);
				rectVertex.endFill();

				return rectVertex;
			}

			function renderCircleVertex(vertex) {
				let circle = new PIXI__namespace.Graphics();
				circle.lineStyle({
					width: vertex.strokeWidth,
					color: toHexColor(vertex.strokeColor)
				});
				circle.beginFill(toHexColor(vertex.fillColor));
				circle.drawCircle(vertex.x, vertex.y, vertex.radius);
				circle.endFill();

				return circle;
			}
		}

		/**
		 * @param {CirclePath} circPath
		 * @returns {PIXI.Rectangle}
		 */
		_renderCircle(circPath) {
			let circle = new PIXI.Graphics();
			decorate(circle, circPath.styles);
			circle.lineStyle(
				circPath.styles["strokeWidth"],
				toHexColor(circPath.styles["strokeColor"])
			);
			beginGradientOrColorFill(circPath.styles, circle, circPath.height);
			circle.drawCircle(
				circPath.x, 
				circPath.y,
				circPath.radius
			);
			circle.endFill();
			return circle;
		}

		/**
		 * @param {RingPath} ringPath
		 * @returns {PIXI.Rectangle}
		 */
		_renderRing(ringPath) {
			let ring = new PIXI.Graphics();
			//decorate(ring, ringPath.styles);
			ring.lineStyle(
				(ringPath.outerRadius - ringPath.innerRadius),
				toHexColor(ringPath.styles["fillColor"])
			);
			//beginGradientOrColorFill(ringPath.styles, ring, ringPath.height);
			ring.drawCircle(
				ringPath.x, 
				ringPath.y,
				(ringPath.innerRadius + ringPath.outerRadius)/2
			);
			ring.endFill();
			return ring;
		}

		// /**
		//  * @param {PiePath} piePath 
		//  */
		// _renderPiePath(piePath) {
		// 	let arc = new PIXI.Graphics();
		// 	arc.lineStyle({
		// 		color: toHexColor(piePath.styles["strokeColor"]),
		// 		width: piePath.styles["strokeWidth"]
		// 	})
		// 	arc.beginFill(toHexColor(piePath.styles["fillColor"]))
		// 	arc.moveTo(piePath.x, piePath.y);
		// 	arc.arc(
		// 		piePath.x, 
		// 		piePath.y, 
		// 		piePath.radius, 
		// 		-piePath.endAngleRad,
		// 		-piePath.startAngleRad,
		// 	);
			
		// 	arc.lineTo(piePath.x, piePath.y);
		// 	arc.endFill();

		// 	return arc;
		// }

		/**
		 * @param {ArcPath} arcPath 
		 */
		_renderArc(arcPath) {
			let arc = new PIXI.Graphics();
			arc.lineStyle({
				color: toHexColor(arcPath.styles["strokeColor"]),
				width: arcPath.styles["strokeWidth"]
			});
			arc.beginFill(toHexColor(arcPath.styles["fillColor"]));
			//arc.moveTo(arcPath.x, arcPath.y);
			arc.arc(
				arcPath.x, 
				arcPath.y, 
				arcPath.outerRadius,
				-arcPath.endAngle * DEG2RAD,
				-arcPath.startAngle * DEG2RAD,
			);

			arc.arc(
				arcPath.x, 
				arcPath.y, 
				arcPath.innerRadius,
				-arcPath.startAngle * DEG2RAD,
				-arcPath.endAngle * DEG2RAD,
				true
			);

			//arc.lineTo(arcPath.x, arcPath.y);
			arc.endFill();

			return arc;
		}

		/**
		 * @param {Image} image 
		 */
		_renderImage(image) {
			let sprite = PIXI__namespace.Sprite.from(image.src);
			sprite.x = image.x;
			sprite.y = image.y;
			sprite.width = image.width;
			sprite.height = image.height;

			return sprite;
		}

		/**
		 * @param {Link} link 
		 */
		_renderLink(link) {
			switch (link.curveMode) {
				case "linear":
					return renderLinearLink(link);
			
				default:
					throwError("link", link.curveMode, "unexpected curvemode");
			}

			/**
			 * @param {Link} link 
			 */
			function renderLinearLink(link) {
				let graphics = new PIXI.Graphics();
				decorate(graphics, link.styles);
				graphics.lineStyle({
					color: toHexColor(link.styles["strokeColor"]),
					width: link.styles["strokeWidth"]
				});
				drawOnGraphicsFromJSONData(graphics, parseDPath(link.getSVGPathData()));

				return graphics;
			}
		}
	}

	/**
	 * Set visibility and alpha
	 * @param {DisplayObject} displayObject 
	 * @param {*} styles 
	 */
	function decorate(displayObject, styles) {
		displayObject.visible = styleVisiblity2PixiVisible(styles["visibility"]);
		displayObject.alpha = styleOpacity2PixiAlpha(styles["opacity"]);
	}

	function styleFontWeight2PixiFontWeight(fontWeight) {
		switch (fontWeight) {
			case "regular":
			case "normal":
				return "normal";

			case "bold":
				return "bold";

			default:
				console.log(fontWeight);
				throwError("font weight", fontWeight, Errors.FEATURE_NOT_IMPLEMENTED);
		}
	}

	function styleAnchor2PixiAnchor(anchor) {
		let horizontal, vertical;

		switch (anchor[0]) {
			case "left":
				horizontal = 0.0;
				break;

			case "center":
				horizontal = 0.5;
				break;

			case "right":
				horizontal = 1.0;
				break;

			default:
				throwError("x anchor", anchor[0], Errors.UNKNOWN_ANCHOR);
		}

		switch (anchor[1]) {
			// TODO: hanging is actually not quite the same as top
			case "hanging":
			case "top":
				vertical = 0.0;
				break;
			// TODO: central is not quite the same as middle
			case "central":
			case "middle":
				vertical = 0.5;
				break;
			case "bottom":
				vertical = 1.0;
				break;
			default:
				throwError("y anchor", anchor[1], Errors.UNKNOWN_ANCHOR);
		}

		return [horizontal, vertical];
	}

	/**
	 * @param {string} cssColor 
	 * @returns {number}
	 */
	function toHexColor(cssColor) {
		let d3Color = d3__namespace.color(cssColor);
		if (d3Color == null) {
			return null;
		} else {
			let hexString = d3Color.formatHex();
			return PIXI__namespace.utils.string2hex(hexString);
		}
	}

	function styleVisiblity2PixiVisible(visibility) {
		switch (visibility) {
			case "hidden":
				return false;
			case null:
			case undefined:
			case "visible":
			default:
				return true;		
		}
	}

	function rotation2PixiAngle(rotation) {
		if (rotation === undefined || typeof rotation[0] != "number") {
			return 0
		} else {
			return rotation[0];
		}
	}

	function rotation2PixiPivot(rotation) {
		if (rotation === undefined || typeof rotation[0] != "number") {
			return [0, 0];
		} else {
			return rotation.slice(1);
		}
	}

	function styleOpacity2PixiAlpha(opacity) {
		switch (opacity) {
			case undefined:
			case null:
				return 1;
		
			default:
				return opacity;
		}
	}

	function throwError(name, value, err) {
		console.log(value);
		throw new Error(`${err}. Source: ${name}, Actual: `);
	}

	/**
	 * Can fill graphic with color or linear gradient accordingly. 
	 * Can also handle transparency
	 * @param {Graphics} graphics 
	 */
	function beginGradientOrColorFill(styles, graphics, height) {
		let fillColor = styles["fillColor"];

		// if no fill color
		if (fillColor == "none") return;

		let hexColor = toHexColor(fillColor);
		// if valid color
		if (hexColor != null) {
			graphics.beginFill(hexColor);
		// then it must be texture
		} else {
			graphics.beginTextureFill({
				color: 0xffffff,
				texture: createLinearGradientTexture(height, fillColor.stops, fillColor.y1 > fillColor.y2)
			});
		}
	}

	function createLinearGradientTexture(height, stops, isReversed) {

		const canvas = document.createElement("canvas");
		canvas.height = height;
		canvas.width = 1;
	    const ctx = canvas.getContext("2d");

	    const grd = ctx.createLinearGradient(0, 0, 0, height);
		for (let i = 0; i < stops.length; i++) {
			if (isReversed) {
				grd.addColorStop(1 - stops[i].offset / 100, stops[i].color);
			} else {
				grd.addColorStop(stops[i].offset / 100, stops[i].color);
			}
		}

	    ctx.fillStyle = grd;
	    ctx.fillRect(0, 0, 1, height);

		return PIXI__namespace.Texture.from(canvas);
	}

	/**
	 * @param {Graphics} graphics
	 * @param {Array} json
	 */
	function drawOnGraphicsFromJSONData(graphics, json) {

		// Draw a closed shape accordingly
		let last = json.pop();
		let callBack = () => {};
		if (last.code.toUpperCase() == "Z") {
			callBack = () => graphics.lineTo(json[0].end.x, json[0].end.y);
		} else {
			json.push(last);
		}

		// Actual drawing
		for (const data of json) {
			draw(data, graphics);
		}

		callBack();
	}

	/**
	 * @param {Graphics} graphics 
	 * @returns {Graphics}
	 */
	function draw(data, graphics) {
		switch (data.code.toUpperCase()) {
			case "M":
				graphics.moveTo(data.end.x, data.end.y);
				break;

			case "L":
				graphics.lineTo(data.end.x, data.end.y);
				break;

			case "Q":
				graphics.bezierCurveTo(
					data.cp1.x, 
					data.cp1.y, 
					data.cp1.x, 
					data.cp1.y, 
					data.end.x, 
					data.end.y
				);
				break;

			case "C":
				graphics.bezierCurveTo(
					data.cp1.x, 
					data.cp1.y, 
					data.cp2.x, 
					data.cp2.y, 
					data.end.x, 
					data.end.y
				);
				break;

			case "Z":
				throw new Error("Unexpected \"z\" marker. There's something wrong, I can feel it");

			default:
				return throwError("data", data, Errors.FEATURE_NOT_IMPLEMENTED);
		}
	}

	// Adapted from https://codepen.io/unrealnl/pen/aYaxBW
	function drawDashLine(vertices, strokeDash, graphics) {
		let i;
		let p1;
		let p2;
		let dashLeft = 0;
		let gapLeft = 0;
		let dashAndGap = strokeDash.split(" ");
		let dash = Number(dashAndGap[0]);
		let gap = Number(dashAndGap[1]);

		for (i = 0; i < vertices.length; i++) {
			p1 = vertices[i];
			if (i == vertices.length - 1) break;
			else p2 = vertices[i + 1];

			let dx = p2.x - p1.x;
			let dy = p2.y - p1.y;
			let len = Math.sqrt(dx * dx + dy * dy);
			let normal = { x: dx / len, y: dy / len };
			let progressOnLine = 0;
			graphics.moveTo(p1.x + gapLeft * normal.x, p1.y + gapLeft * normal.y);

			while (progressOnLine <= len) {
				progressOnLine += gapLeft;
				if (dashLeft > 0) progressOnLine += dashLeft;
				else progressOnLine += dash;
				if (progressOnLine > len) {
					dashLeft = progressOnLine - len;
					progressOnLine = len;
				} else {
					dashLeft = 0;
				}
				graphics.lineTo(p1.x + progressOnLine * normal.x, p1.y + progressOnLine * normal.y);
				progressOnLine += gap;
				if (progressOnLine > len && dashLeft == 0) {
					gapLeft = progressOnLine - len;
				} else {
					gapLeft = 0;
					graphics.moveTo(p1.x + progressOnLine * normal.x, p1.y + progressOnLine * normal.y);
				}
			}
		}
	}

	// Adapted from d-path-parser under MIT license
	// GitHub Repository: https://github.com/MaxArt2501/d-path-parser
	function parseDPath(d) {
	    let re = {
	        command: /\s*([achlmqstvz])/gi,
	        number: /\s*([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/gi,
	        comma: /\s*(?:(,)|\s)/g,
	        flag: /\s*([01])/g
	    };
	    let matchers = {
	        "number": function(must) {
	            return +get("number", must);
	        },
	        "coordinate pair": function(must) {
	            let x = get("number", must);
	            if (x === null && !must) return null;
	            get("comma");
	            let y = get("number", true);
	            return { x: +x, y: +y };
	        },
	        "arc definition": function(must) {
	            let radii = matchers["coordinate pair"](must);
	            if (!radii && !must) return null;
	            get("comma");
	            let rotation = +get("number", true);
	            get("comma", true);
	            let large = !!+get("flag", true);
	            get("comma");
	            let clockwise = !!+get("flag", true);
	            get("comma");
	            let end = matchers["coordinate pair"](true);
	            return {
	                radii: radii,
	                rotation: rotation,
	                large: large,
	                clockwise: clockwise,
	                end: end
	            };
	        }
	    };
	    let index = 0;
	    let commands = [];

	    while (index < d.length) {
	        let cmd = get("command");
	        let upcmd = cmd.toUpperCase();
	        let relative = cmd !== upcmd;
	        let sequence;
	        switch (upcmd) {
	            case "M":
	                sequence = getSequence("coordinate pair").map(function(coords, i) {
	                    if (i === 1) cmd = relative ? "l" : "L";
	                    return makeCommand({ end: coords }, cmd, relative);
	                }); 
	                break;
	            case "L":
	            case "T":
	                sequence = getSequence("coordinate pair").map(function(coords) {
	                    return makeCommand({ end: coords }, cmd, relative);
	                });
	                break;
	            case "C":
	                sequence = getSequence("coordinate pair");
	                if (sequence.length % 3)
	                    throw Error("Expected coordinate pair triplet at position " + index);

	                sequence = sequence.reduce(function(seq, coords, i) {
	                    let rest = i % 3;
	                    if (!rest) {
	                        seq.push(makeCommand({ cp1: coords }, cmd, relative));
	                    } else {
	                        let last = seq[seq.length - 1];
	                        last[rest === 1 ? "cp2" : "end"] = coords;
	                    }
	                    return seq;
	                }, []);

	                break;
	            case "Q":
	            case "S":
	                sequence = getSequence("coordinate pair");
	                if (sequence.length & 1)
	                    throw Error("Expected coordinate pair couple at position " + index);

	                sequence = sequence.reduce(function(seq, coords, i) {
	                    let odd = i & 1;
	                    if (!odd) {
	                        seq.push(makeCommand({ cp: coords }, cmd, relative));
	                    } else {
	                        let last = seq[seq.length - 1];
	                        last.end = coords;
	                    }
	                    return seq;
	                }, []);

	                break;
	            case "H":
	            case "V":
	                sequence = getSequence("number").map(function(value) {
	                    return makeCommand({ value: value }, cmd, relative);
	                });
	                break;
	            case "A":
	                sequence = getSequence("arc definition").map(makeCommand, cmd, relative);
	                break;
	            case "Z":
	                sequence = [ { code: "Z" } ];
	                break;
	        }
	        commands.push.apply(commands, sequence);
	    }

	    return commands;

	    function makeCommand(obj, cmd, relative) {
	        obj.code = cmd;
	        obj.relative = relative;

	        return obj;
	    }
	    function get(what, must) {
	        re[what].lastIndex = index;
	        let res = re[what].exec(d);
	        if (!res || res.index !== index) {
	            if (!must) return null;
	            throw Error("Expected " + what + " at position " + index);
	        }

	        index = re[what].lastIndex;

	        return res[1];
	    }

	    function getSequence(what) {
	        let sequence = [];
	        let matched;
	        let must = true;
	        while ((matched = matchers[what](must)) !== null) {
	            sequence.push(matched);
	            must = !!get("comma");
	        }

	        return sequence;
	    }
	}

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}

	var _listCacheClear = listCacheClear;

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	var eq_1 = eq;

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq_1(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	var _assocIndexOf = assocIndexOf;

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	var _listCacheDelete = listCacheDelete;

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	var _listCacheGet = listCacheGet;

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return _assocIndexOf(this.__data__, key) > -1;
	}

	var _listCacheHas = listCacheHas;

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	var _listCacheSet = listCacheSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = _listCacheClear;
	ListCache.prototype['delete'] = _listCacheDelete;
	ListCache.prototype.get = _listCacheGet;
	ListCache.prototype.has = _listCacheHas;
	ListCache.prototype.set = _listCacheSet;

	var _ListCache = ListCache;

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new _ListCache;
	  this.size = 0;
	}

	var _stackClear = stackClear;

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  var data = this.__data__,
	      result = data['delete'](key);

	  this.size = data.size;
	  return result;
	}

	var _stackDelete = stackDelete;

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	var _stackGet = stackGet;

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	var _stackHas = stackHas;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	var _freeGlobal = freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = _freeGlobal || freeSelf || Function('return this')();

	var _root = root;

	/** Built-in value references. */
	var Symbol = _root.Symbol;

	var _Symbol = Symbol;

	/** Used for built-in method references. */
	var objectProto$i = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$f = objectProto$i.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$i.toString;

	/** Built-in value references. */
	var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty$f.call(value, symToStringTag$1),
	      tag = value[symToStringTag$1];

	  try {
	    value[symToStringTag$1] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString$1.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag$1] = tag;
	    } else {
	      delete value[symToStringTag$1];
	    }
	  }
	  return result;
	}

	var _getRawTag = getRawTag;

	/** Used for built-in method references. */
	var objectProto$h = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto$h.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}

	var _objectToString = objectToString;

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? _getRawTag(value)
	    : _objectToString(value);
	}

	var _baseGetTag = baseGetTag;

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var isObject_1 = isObject;

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag$2 = '[object Function]',
	    genTag$1 = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject_1(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = _baseGetTag(value);
	  return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
	}

	var isFunction_1 = isFunction;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = _root['__core-js_shared__'];

	var _coreJsData = coreJsData;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	var _isMasked = isMasked;

	/** Used for built-in method references. */
	var funcProto$2 = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$2 = funcProto$2.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString$2.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	var _toSource = toSource;

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto$1 = Function.prototype,
	    objectProto$g = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$1 = funcProto$1.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$e = objectProto$g.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString$1.call(hasOwnProperty$e).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject_1(value) || _isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(_toSource(value));
	}

	var _baseIsNative = baseIsNative;

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	var _getValue = getValue;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = _getValue(object, key);
	  return _baseIsNative(value) ? value : undefined;
	}

	var _getNative = getNative;

	/* Built-in method references that are verified to be native. */
	var Map$1 = _getNative(_root, 'Map');

	var _Map = Map$1;

	/* Built-in method references that are verified to be native. */
	var nativeCreate = _getNative(Object, 'create');

	var _nativeCreate = nativeCreate;

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
	  this.size = 0;
	}

	var _hashClear = hashClear;

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _hashDelete = hashDelete;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto$f = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$d = objectProto$f.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (_nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED$2 ? undefined : result;
	  }
	  return hasOwnProperty$d.call(data, key) ? data[key] : undefined;
	}

	var _hashGet = hashGet;

	/** Used for built-in method references. */
	var objectProto$e = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$c = objectProto$e.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$c.call(data, key);
	}

	var _hashHas = hashHas;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
	  return this;
	}

	var _hashSet = hashSet;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = _hashClear;
	Hash.prototype['delete'] = _hashDelete;
	Hash.prototype.get = _hashGet;
	Hash.prototype.has = _hashHas;
	Hash.prototype.set = _hashSet;

	var _Hash = Hash;

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new _Hash,
	    'map': new (_Map || _ListCache),
	    'string': new _Hash
	  };
	}

	var _mapCacheClear = mapCacheClear;

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	var _isKeyable = isKeyable;

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return _isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	var _getMapData = getMapData;

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = _getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _mapCacheDelete = mapCacheDelete;

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return _getMapData(this, key).get(key);
	}

	var _mapCacheGet = mapCacheGet;

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return _getMapData(this, key).has(key);
	}

	var _mapCacheHas = mapCacheHas;

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = _getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	var _mapCacheSet = mapCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = _mapCacheClear;
	MapCache.prototype['delete'] = _mapCacheDelete;
	MapCache.prototype.get = _mapCacheGet;
	MapCache.prototype.has = _mapCacheHas;
	MapCache.prototype.set = _mapCacheSet;

	var _MapCache = MapCache;

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE$1 = 200;

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var data = this.__data__;
	  if (data instanceof _ListCache) {
	    var pairs = data.__data__;
	    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE$1 - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new _MapCache(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}

	var _stackSet = stackSet;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new _ListCache(entries);
	  this.size = data.size;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = _stackClear;
	Stack.prototype['delete'] = _stackDelete;
	Stack.prototype.get = _stackGet;
	Stack.prototype.has = _stackHas;
	Stack.prototype.set = _stackSet;

	var _Stack = Stack;

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	var _arrayEach = arrayEach;

	var defineProperty = (function() {
	  try {
	    var func = _getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	var _defineProperty = defineProperty;

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && _defineProperty) {
	    _defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}

	var _baseAssignValue = baseAssignValue;

	/** Used for built-in method references. */
	var objectProto$d = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$b = objectProto$d.hasOwnProperty;

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty$b.call(object, key) && eq_1(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    _baseAssignValue(object, key, value);
	  }
	}

	var _assignValue = assignValue;

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      _baseAssignValue(object, key, newValue);
	    } else {
	      _assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}

	var _copyObject = copyObject;

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	var _baseTimes = baseTimes;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike;

	/** `Object#toString` result references. */
	var argsTag$3 = '[object Arguments]';

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike_1(value) && _baseGetTag(value) == argsTag$3;
	}

	var _baseIsArguments = baseIsArguments;

	/** Used for built-in method references. */
	var objectProto$c = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$a = objectProto$c.hasOwnProperty;

	/** Built-in value references. */
	var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
	  return isObjectLike_1(value) && hasOwnProperty$a.call(value, 'callee') &&
	    !propertyIsEnumerable$1.call(value, 'callee');
	};

	var isArguments_1 = isArguments;

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	var isArray_1 = isArray;

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	var stubFalse_1 = stubFalse;

	var isBuffer_1 = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? _root.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse_1;

	module.exports = isBuffer;
	});

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER$1 = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  var type = typeof value;
	  length = length == null ? MAX_SAFE_INTEGER$1 : length;

	  return !!length &&
	    (type == 'number' ||
	      (type != 'symbol' && reIsUint.test(value))) &&
	        (value > -1 && value % 1 == 0 && value < length);
	}

	var _isIndex = isIndex;

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	var isLength_1 = isLength;

	/** `Object#toString` result references. */
	var argsTag$2 = '[object Arguments]',
	    arrayTag$2 = '[object Array]',
	    boolTag$3 = '[object Boolean]',
	    dateTag$3 = '[object Date]',
	    errorTag$2 = '[object Error]',
	    funcTag$1 = '[object Function]',
	    mapTag$7 = '[object Map]',
	    numberTag$3 = '[object Number]',
	    objectTag$4 = '[object Object]',
	    regexpTag$3 = '[object RegExp]',
	    setTag$7 = '[object Set]',
	    stringTag$4 = '[object String]',
	    weakMapTag$2 = '[object WeakMap]';

	var arrayBufferTag$3 = '[object ArrayBuffer]',
	    dataViewTag$4 = '[object DataView]',
	    float32Tag$2 = '[object Float32Array]',
	    float64Tag$2 = '[object Float64Array]',
	    int8Tag$2 = '[object Int8Array]',
	    int16Tag$2 = '[object Int16Array]',
	    int32Tag$2 = '[object Int32Array]',
	    uint8Tag$2 = '[object Uint8Array]',
	    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
	    uint16Tag$2 = '[object Uint16Array]',
	    uint32Tag$2 = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] =
	typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] =
	typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] =
	typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] =
	typedArrayTags[uint32Tag$2] = true;
	typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] =
	typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] =
	typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] =
	typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] =
	typedArrayTags[mapTag$7] = typedArrayTags[numberTag$3] =
	typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$3] =
	typedArrayTags[setTag$7] = typedArrayTags[stringTag$4] =
	typedArrayTags[weakMapTag$2] = false;

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike_1(value) &&
	    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
	}

	var _baseIsTypedArray = baseIsTypedArray;

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	var _baseUnary = baseUnary;

	var _nodeUtil = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && _freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    // Use `util.types` for Node.js 10+.
	    var types = freeModule && freeModule.require && freeModule.require('util').types;

	    if (types) {
	      return types;
	    }

	    // Legacy `process.binding('util')` for Node.js < 10.
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;
	});

	/* Node.js helper references. */
	var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

	var isTypedArray_1 = isTypedArray;

	/** Used for built-in method references. */
	var objectProto$b = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray_1(value),
	      isArg = !isArr && isArguments_1(value),
	      isBuff = !isArr && !isArg && isBuffer_1(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? _baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty$9.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           _isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _arrayLikeKeys = arrayLikeKeys;

	/** Used for built-in method references. */
	var objectProto$a = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$a;

	  return value === proto;
	}

	var _isPrototype = isPrototype;

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	var _overArg = overArg;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = _overArg(Object.keys, Object);

	var _nativeKeys = nativeKeys;

	/** Used for built-in method references. */
	var objectProto$9 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$8 = objectProto$9.hasOwnProperty;

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!_isPrototype(object)) {
	    return _nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty$8.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeys = baseKeys;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength_1(value.length) && !isFunction_1(value);
	}

	var isArrayLike_1 = isArrayLike;

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
	}

	var keys_1 = keys;

	/**
	 * The base implementation of `_.assign` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return object && _copyObject(source, keys_1(source), object);
	}

	var _baseAssign = baseAssign;

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _nativeKeysIn = nativeKeysIn;

	/** Used for built-in method references. */
	var objectProto$8 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject_1(object)) {
	    return _nativeKeysIn(object);
	  }
	  var isProto = _isPrototype(object),
	      result = [];

	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty$7.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeysIn = baseKeysIn;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
	}

	var keysIn_1 = keysIn;

	/**
	 * The base implementation of `_.assignIn` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssignIn(object, source) {
	  return object && _copyObject(source, keysIn_1(source), object);
	}

	var _baseAssignIn = baseAssignIn;

	var _cloneBuffer = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? _root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	  buffer.copy(result);
	  return result;
	}

	module.exports = cloneBuffer;
	});

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	var _copyArray = copyArray;

	/**
	 * A specialized version of `_.filter` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function arrayFilter(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      resIndex = 0,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[resIndex++] = value;
	    }
	  }
	  return result;
	}

	var _arrayFilter = arrayFilter;

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */
	function stubArray() {
	  return [];
	}

	var stubArray_1 = stubArray;

	/** Used for built-in method references. */
	var objectProto$7 = Object.prototype;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
	  if (object == null) {
	    return [];
	  }
	  object = Object(object);
	  return _arrayFilter(nativeGetSymbols$1(object), function(symbol) {
	    return propertyIsEnumerable.call(object, symbol);
	  });
	};

	var _getSymbols = getSymbols;

	/**
	 * Copies own symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbols(source, object) {
	  return _copyObject(source, _getSymbols(source), object);
	}

	var _copySymbols = copySymbols;

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	var _arrayPush = arrayPush;

	/** Built-in value references. */
	var getPrototype = _overArg(Object.getPrototypeOf, Object);

	var _getPrototype = getPrototype;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own and inherited enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbolsIn = !nativeGetSymbols ? stubArray_1 : function(object) {
	  var result = [];
	  while (object) {
	    _arrayPush(result, _getSymbols(object));
	    object = _getPrototype(object);
	  }
	  return result;
	};

	var _getSymbolsIn = getSymbolsIn;

	/**
	 * Copies own and inherited symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbolsIn(source, object) {
	  return _copyObject(source, _getSymbolsIn(source), object);
	}

	var _copySymbolsIn = copySymbolsIn;

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
	}

	var _baseGetAllKeys = baseGetAllKeys;

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return _baseGetAllKeys(object, keys_1, _getSymbols);
	}

	var _getAllKeys = getAllKeys;

	/**
	 * Creates an array of own and inherited enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeysIn(object) {
	  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
	}

	var _getAllKeysIn = getAllKeysIn;

	/* Built-in method references that are verified to be native. */
	var DataView = _getNative(_root, 'DataView');

	var _DataView = DataView;

	/* Built-in method references that are verified to be native. */
	var Promise$1 = _getNative(_root, 'Promise');

	var _Promise = Promise$1;

	/* Built-in method references that are verified to be native. */
	var Set$1 = _getNative(_root, 'Set');

	var _Set = Set$1;

	/* Built-in method references that are verified to be native. */
	var WeakMap = _getNative(_root, 'WeakMap');

	var _WeakMap = WeakMap;

	/** `Object#toString` result references. */
	var mapTag$6 = '[object Map]',
	    objectTag$3 = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag$6 = '[object Set]',
	    weakMapTag$1 = '[object WeakMap]';

	var dataViewTag$3 = '[object DataView]';

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = _toSource(_DataView),
	    mapCtorString = _toSource(_Map),
	    promiseCtorString = _toSource(_Promise),
	    setCtorString = _toSource(_Set),
	    weakMapCtorString = _toSource(_WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = _baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$3) ||
	    (_Map && getTag(new _Map) != mapTag$6) ||
	    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
	    (_Set && getTag(new _Set) != setTag$6) ||
	    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
	  getTag = function(value) {
	    var result = _baseGetTag(value),
	        Ctor = result == objectTag$3 ? value.constructor : undefined,
	        ctorString = Ctor ? _toSource(Ctor) : '';

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag$3;
	        case mapCtorString: return mapTag$6;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag$6;
	        case weakMapCtorString: return weakMapTag$1;
	      }
	    }
	    return result;
	  };
	}

	var _getTag = getTag;

	/** Used for built-in method references. */
	var objectProto$6 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$6 = objectProto$6.hasOwnProperty;

	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray(array) {
	  var length = array.length,
	      result = new array.constructor(length);

	  // Add properties assigned by `RegExp#exec`.
	  if (length && typeof array[0] == 'string' && hasOwnProperty$6.call(array, 'index')) {
	    result.index = array.index;
	    result.input = array.input;
	  }
	  return result;
	}

	var _initCloneArray = initCloneArray;

	/** Built-in value references. */
	var Uint8Array = _root.Uint8Array;

	var _Uint8Array = Uint8Array;

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
	  return result;
	}

	var _cloneArrayBuffer = cloneArrayBuffer;

	/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */
	function cloneDataView(dataView, isDeep) {
	  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}

	var _cloneDataView = cloneDataView;

	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;

	/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */
	function cloneRegExp(regexp) {
	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	  result.lastIndex = regexp.lastIndex;
	  return result;
	}

	var _cloneRegExp = cloneRegExp;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto$2 = _Symbol ? _Symbol.prototype : undefined,
	    symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;

	/**
	 * Creates a clone of the `symbol` object.
	 *
	 * @private
	 * @param {Object} symbol The symbol object to clone.
	 * @returns {Object} Returns the cloned symbol object.
	 */
	function cloneSymbol(symbol) {
	  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
	}

	var _cloneSymbol = cloneSymbol;

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	var _cloneTypedArray = cloneTypedArray;

	/** `Object#toString` result references. */
	var boolTag$2 = '[object Boolean]',
	    dateTag$2 = '[object Date]',
	    mapTag$5 = '[object Map]',
	    numberTag$2 = '[object Number]',
	    regexpTag$2 = '[object RegExp]',
	    setTag$5 = '[object Set]',
	    stringTag$3 = '[object String]',
	    symbolTag$3 = '[object Symbol]';

	var arrayBufferTag$2 = '[object ArrayBuffer]',
	    dataViewTag$2 = '[object DataView]',
	    float32Tag$1 = '[object Float32Array]',
	    float64Tag$1 = '[object Float64Array]',
	    int8Tag$1 = '[object Int8Array]',
	    int16Tag$1 = '[object Int16Array]',
	    int32Tag$1 = '[object Int32Array]',
	    uint8Tag$1 = '[object Uint8Array]',
	    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
	    uint16Tag$1 = '[object Uint16Array]',
	    uint32Tag$1 = '[object Uint32Array]';

	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag(object, tag, isDeep) {
	  var Ctor = object.constructor;
	  switch (tag) {
	    case arrayBufferTag$2:
	      return _cloneArrayBuffer(object);

	    case boolTag$2:
	    case dateTag$2:
	      return new Ctor(+object);

	    case dataViewTag$2:
	      return _cloneDataView(object, isDeep);

	    case float32Tag$1: case float64Tag$1:
	    case int8Tag$1: case int16Tag$1: case int32Tag$1:
	    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
	      return _cloneTypedArray(object, isDeep);

	    case mapTag$5:
	      return new Ctor;

	    case numberTag$2:
	    case stringTag$3:
	      return new Ctor(object);

	    case regexpTag$2:
	      return _cloneRegExp(object);

	    case setTag$5:
	      return new Ctor;

	    case symbolTag$3:
	      return _cloneSymbol(object);
	  }
	}

	var _initCloneByTag = initCloneByTag;

	/** Built-in value references. */
	var objectCreate = Object.create;

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject_1(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());

	var _baseCreate = baseCreate;

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !_isPrototype(object))
	    ? _baseCreate(_getPrototype(object))
	    : {};
	}

	var _initCloneObject = initCloneObject;

	/** `Object#toString` result references. */
	var mapTag$4 = '[object Map]';

	/**
	 * The base implementation of `_.isMap` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
	 */
	function baseIsMap(value) {
	  return isObjectLike_1(value) && _getTag(value) == mapTag$4;
	}

	var _baseIsMap = baseIsMap;

	/* Node.js helper references. */
	var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

	/**
	 * Checks if `value` is classified as a `Map` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
	 * @example
	 *
	 * _.isMap(new Map);
	 * // => true
	 *
	 * _.isMap(new WeakMap);
	 * // => false
	 */
	var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

	var isMap_1 = isMap;

	/** `Object#toString` result references. */
	var setTag$4 = '[object Set]';

	/**
	 * The base implementation of `_.isSet` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
	 */
	function baseIsSet(value) {
	  return isObjectLike_1(value) && _getTag(value) == setTag$4;
	}

	var _baseIsSet = baseIsSet;

	/* Node.js helper references. */
	var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

	/**
	 * Checks if `value` is classified as a `Set` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
	 * @example
	 *
	 * _.isSet(new Set);
	 * // => true
	 *
	 * _.isSet(new WeakSet);
	 * // => false
	 */
	var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

	var isSet_1 = isSet;

	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG$1 = 1,
	    CLONE_FLAT_FLAG = 2,
	    CLONE_SYMBOLS_FLAG$2 = 4;

	/** `Object#toString` result references. */
	var argsTag$1 = '[object Arguments]',
	    arrayTag$1 = '[object Array]',
	    boolTag$1 = '[object Boolean]',
	    dateTag$1 = '[object Date]',
	    errorTag$1 = '[object Error]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    mapTag$3 = '[object Map]',
	    numberTag$1 = '[object Number]',
	    objectTag$2 = '[object Object]',
	    regexpTag$1 = '[object RegExp]',
	    setTag$3 = '[object Set]',
	    stringTag$2 = '[object String]',
	    symbolTag$2 = '[object Symbol]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag$1 = '[object ArrayBuffer]',
	    dataViewTag$1 = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] =
	cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] =
	cloneableTags[boolTag$1] = cloneableTags[dateTag$1] =
	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
	cloneableTags[int32Tag] = cloneableTags[mapTag$3] =
	cloneableTags[numberTag$1] = cloneableTags[objectTag$2] =
	cloneableTags[regexpTag$1] = cloneableTags[setTag$3] =
	cloneableTags[stringTag$2] = cloneableTags[symbolTag$2] =
	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag$1] = cloneableTags[funcTag] =
	cloneableTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	 * traversed objects.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} bitmask The bitmask flags.
	 *  1 - Deep clone
	 *  2 - Flatten inherited properties
	 *  4 - Clone symbols
	 * @param {Function} [customizer] The function to customize cloning.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The parent object of `value`.
	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone(value, bitmask, customizer, key, object, stack) {
	  var result,
	      isDeep = bitmask & CLONE_DEEP_FLAG$1,
	      isFlat = bitmask & CLONE_FLAT_FLAG,
	      isFull = bitmask & CLONE_SYMBOLS_FLAG$2;

	  if (customizer) {
	    result = object ? customizer(value, key, object, stack) : customizer(value);
	  }
	  if (result !== undefined) {
	    return result;
	  }
	  if (!isObject_1(value)) {
	    return value;
	  }
	  var isArr = isArray_1(value);
	  if (isArr) {
	    result = _initCloneArray(value);
	    if (!isDeep) {
	      return _copyArray(value, result);
	    }
	  } else {
	    var tag = _getTag(value),
	        isFunc = tag == funcTag || tag == genTag;

	    if (isBuffer_1(value)) {
	      return _cloneBuffer(value, isDeep);
	    }
	    if (tag == objectTag$2 || tag == argsTag$1 || (isFunc && !object)) {
	      result = (isFlat || isFunc) ? {} : _initCloneObject(value);
	      if (!isDeep) {
	        return isFlat
	          ? _copySymbolsIn(value, _baseAssignIn(result, value))
	          : _copySymbols(value, _baseAssign(result, value));
	      }
	    } else {
	      if (!cloneableTags[tag]) {
	        return object ? value : {};
	      }
	      result = _initCloneByTag(value, tag, isDeep);
	    }
	  }
	  // Check for circular references and return its corresponding clone.
	  stack || (stack = new _Stack);
	  var stacked = stack.get(value);
	  if (stacked) {
	    return stacked;
	  }
	  stack.set(value, result);

	  if (isSet_1(value)) {
	    value.forEach(function(subValue) {
	      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
	    });
	  } else if (isMap_1(value)) {
	    value.forEach(function(subValue, key) {
	      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
	    });
	  }

	  var keysFunc = isFull
	    ? (isFlat ? _getAllKeysIn : _getAllKeys)
	    : (isFlat ? keysIn_1 : keys_1);

	  var props = isArr ? undefined : keysFunc(value);
	  _arrayEach(props || value, function(subValue, key) {
	    if (props) {
	      key = subValue;
	      subValue = value[key];
	    }
	    // Recursively populate clone (susceptible to call stack limits).
	    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
	  });
	  return result;
	}

	var _baseClone = baseClone;

	/** Used to compose bitmasks for cloning. */
	var CLONE_SYMBOLS_FLAG$1 = 4;

	/**
	 * Creates a shallow clone of `value`.
	 *
	 * **Note:** This method is loosely based on the
	 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
	 * and supports cloning arrays, array buffers, booleans, date objects, maps,
	 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
	 * arrays. The own enumerable properties of `arguments` objects are cloned
	 * as plain objects. An empty object is returned for uncloneable values such
	 * as error objects, functions, DOM nodes, and WeakMaps.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to clone.
	 * @returns {*} Returns the cloned value.
	 * @see _.cloneDeep
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var shallow = _.clone(objects);
	 * console.log(shallow[0] === objects[0]);
	 * // => true
	 */
	function clone(value) {
	  return _baseClone(value, CLONE_SYMBOLS_FLAG$1);
	}

	var clone_1 = clone;

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	var constant_1 = constant;

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	var _createBaseFor = createBaseFor;

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = _createBaseFor();

	var _baseFor = baseFor;

	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && _baseFor(object, iteratee, keys_1);
	}

	var _baseForOwn = baseForOwn;

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    if (collection == null) {
	      return collection;
	    }
	    if (!isArrayLike_1(collection)) {
	      return eachFunc(collection, iteratee);
	    }
	    var length = collection.length,
	        index = fromRight ? length : -1,
	        iterable = Object(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	var _createBaseEach = createBaseEach;

	/**
	 * The base implementation of `_.forEach` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 */
	var baseEach = _createBaseEach(_baseForOwn);

	var _baseEach = baseEach;

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	var identity_1 = identity;

	/**
	 * Casts `value` to `identity` if it's not a function.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Function} Returns cast function.
	 */
	function castFunction(value) {
	  return typeof value == 'function' ? value : identity_1;
	}

	var _castFunction = castFunction;

	/**
	 * Iterates over elements of `collection` and invokes `iteratee` for each element.
	 * The iteratee is invoked with three arguments: (value, index|key, collection).
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * **Note:** As with other "Collections" methods, objects with a "length"
	 * property are iterated like arrays. To avoid this behavior use `_.forIn`
	 * or `_.forOwn` for object iteration.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @alias each
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 * @see _.forEachRight
	 * @example
	 *
	 * _.forEach([1, 2], function(value) {
	 *   console.log(value);
	 * });
	 * // => Logs `1` then `2`.
	 *
	 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
	 *   console.log(key);
	 * });
	 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
	 */
	function forEach(collection, iteratee) {
	  var func = isArray_1(collection) ? _arrayEach : _baseEach;
	  return func(collection, _castFunction(iteratee));
	}

	var forEach_1 = forEach;

	var each = forEach_1;

	/**
	 * The base implementation of `_.filter` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function baseFilter(collection, predicate) {
	  var result = [];
	  _baseEach(collection, function(value, index, collection) {
	    if (predicate(value, index, collection)) {
	      result.push(value);
	    }
	  });
	  return result;
	}

	var _baseFilter = baseFilter;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}

	var _setCacheAdd = setCacheAdd;

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	var _setCacheHas = setCacheHas;

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values == null ? 0 : values.length;

	  this.__data__ = new _MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
	SetCache.prototype.has = _setCacheHas;

	var _SetCache = SetCache;

	/**
	 * A specialized version of `_.some` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	var _arraySome = arraySome;

	/**
	 * Checks if a `cache` value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function cacheHas(cache, key) {
	  return cache.has(key);
	}

	var _cacheHas = cacheHas;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$5 = 1,
	    COMPARE_UNORDERED_FLAG$3 = 2;

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Check that cyclic values are equal.
	  var arrStacked = stack.get(array);
	  var othStacked = stack.get(other);
	  if (arrStacked && othStacked) {
	    return arrStacked == other && othStacked == array;
	  }
	  var index = -1,
	      result = true,
	      seen = (bitmask & COMPARE_UNORDERED_FLAG$3) ? new _SetCache : undefined;

	  stack.set(array, other);
	  stack.set(other, array);

	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, arrValue, index, other, array, stack)
	        : customizer(arrValue, othValue, index, array, other, stack);
	    }
	    if (compared !== undefined) {
	      if (compared) {
	        continue;
	      }
	      result = false;
	      break;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (seen) {
	      if (!_arraySome(other, function(othValue, othIndex) {
	            if (!_cacheHas(seen, othIndex) &&
	                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
	              return seen.push(othIndex);
	            }
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(
	          arrValue === othValue ||
	            equalFunc(arrValue, othValue, bitmask, customizer, stack)
	        )) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  stack['delete'](other);
	  return result;
	}

	var _equalArrays = equalArrays;

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);

	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}

	var _mapToArray = mapToArray;

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	var _setToArray = setToArray;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$4 = 1,
	    COMPARE_UNORDERED_FLAG$2 = 2;

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    mapTag$2 = '[object Map]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    setTag$2 = '[object Set]',
	    stringTag$1 = '[object String]',
	    symbolTag$1 = '[object Symbol]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]';

	/** Used to convert symbols to primitives and strings. */
	var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
	    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
	  switch (tag) {
	    case dataViewTag:
	      if ((object.byteLength != other.byteLength) ||
	          (object.byteOffset != other.byteOffset)) {
	        return false;
	      }
	      object = object.buffer;
	      other = other.buffer;

	    case arrayBufferTag:
	      if ((object.byteLength != other.byteLength) ||
	          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
	        return false;
	      }
	      return true;

	    case boolTag:
	    case dateTag:
	    case numberTag:
	      // Coerce booleans to `1` or `0` and dates to milliseconds.
	      // Invalid dates are coerced to `NaN`.
	      return eq_1(+object, +other);

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case regexpTag:
	    case stringTag$1:
	      // Coerce regexes to strings and treat strings, primitives and objects,
	      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
	      // for more details.
	      return object == (other + '');

	    case mapTag$2:
	      var convert = _mapToArray;

	    case setTag$2:
	      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
	      convert || (convert = _setToArray);

	      if (object.size != other.size && !isPartial) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      bitmask |= COMPARE_UNORDERED_FLAG$2;

	      // Recursively compare objects (susceptible to call stack limits).
	      stack.set(object, other);
	      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
	      stack['delete'](object);
	      return result;

	    case symbolTag$1:
	      if (symbolValueOf) {
	        return symbolValueOf.call(object) == symbolValueOf.call(other);
	      }
	  }
	  return false;
	}

	var _equalByTag = equalByTag;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$3 = 1;

	/** Used for built-in method references. */
	var objectProto$5 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$5 = objectProto$5.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
	      objProps = _getAllKeys(object),
	      objLength = objProps.length,
	      othProps = _getAllKeys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : hasOwnProperty$5.call(other, key))) {
	      return false;
	    }
	  }
	  // Check that cyclic values are equal.
	  var objStacked = stack.get(object);
	  var othStacked = stack.get(other);
	  if (objStacked && othStacked) {
	    return objStacked == other && othStacked == object;
	  }
	  var result = true;
	  stack.set(object, other);
	  stack.set(other, object);

	  var skipCtor = isPartial;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, objValue, key, other, object, stack)
	        : customizer(objValue, othValue, key, object, other, stack);
	    }
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(compared === undefined
	          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
	          : compared
	        )) {
	      result = false;
	      break;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (result && !skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      result = false;
	    }
	  }
	  stack['delete'](object);
	  stack['delete'](other);
	  return result;
	}

	var _equalObjects = equalObjects;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$2 = 1;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag$1 = '[object Object]';

	/** Used for built-in method references. */
	var objectProto$4 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
	  var objIsArr = isArray_1(object),
	      othIsArr = isArray_1(other),
	      objTag = objIsArr ? arrayTag : _getTag(object),
	      othTag = othIsArr ? arrayTag : _getTag(other);

	  objTag = objTag == argsTag ? objectTag$1 : objTag;
	  othTag = othTag == argsTag ? objectTag$1 : othTag;

	  var objIsObj = objTag == objectTag$1,
	      othIsObj = othTag == objectTag$1,
	      isSameTag = objTag == othTag;

	  if (isSameTag && isBuffer_1(object)) {
	    if (!isBuffer_1(other)) {
	      return false;
	    }
	    objIsArr = true;
	    objIsObj = false;
	  }
	  if (isSameTag && !objIsObj) {
	    stack || (stack = new _Stack);
	    return (objIsArr || isTypedArray_1(object))
	      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
	      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	  }
	  if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
	    var objIsWrapped = objIsObj && hasOwnProperty$4.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty$4.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      var objUnwrapped = objIsWrapped ? object.value() : object,
	          othUnwrapped = othIsWrapped ? other.value() : other;

	      stack || (stack = new _Stack);
	      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new _Stack);
	  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
	}

	var _baseIsEqualDeep = baseIsEqualDeep;

	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {boolean} bitmask The bitmask flags.
	 *  1 - Unordered comparison
	 *  2 - Partial comparison
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, bitmask, customizer, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
	    return value !== value && other !== other;
	  }
	  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
	}

	var _baseIsEqual = baseIsEqual;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG$1 = 1,
	    COMPARE_UNORDERED_FLAG$1 = 2;

	/**
	 * The base implementation of `_.isMatch` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Object} source The object of property values to match.
	 * @param {Array} matchData The property names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, source, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;

	  if (object == null) {
	    return !length;
	  }
	  object = Object(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];

	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var stack = new _Stack;
	      if (customizer) {
	        var result = customizer(objValue, srcValue, key, object, source, stack);
	      }
	      if (!(result === undefined
	            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack)
	            : result
	          )) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	var _baseIsMatch = baseIsMatch;

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject_1(value);
	}

	var _isStrictComparable = isStrictComparable;

	/**
	 * Gets the property names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = keys_1(object),
	      length = result.length;

	  while (length--) {
	    var key = result[length],
	        value = object[key];

	    result[length] = [key, value, _isStrictComparable(value)];
	  }
	  return result;
	}

	var _getMatchData = getMatchData;

	/**
	 * A specialized version of `matchesProperty` for source values suitable
	 * for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function matchesStrictComparable(key, srcValue) {
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    return object[key] === srcValue &&
	      (srcValue !== undefined || (key in Object(object)));
	  };
	}

	var _matchesStrictComparable = matchesStrictComparable;

	/**
	 * The base implementation of `_.matches` which doesn't clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatches(source) {
	  var matchData = _getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
	  }
	  return function(object) {
	    return object === source || _baseIsMatch(object, source, matchData);
	  };
	}

	var _baseMatches = baseMatches;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
	}

	var isSymbol_1 = isSymbol;

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray_1(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol_1(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	var _isKey = isKey;

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result) || cache;
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || _MapCache);
	  return memoized;
	}

	// Expose `MapCache`.
	memoize.Cache = _MapCache;

	var memoize_1 = memoize;

	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;

	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped(func) {
	  var result = memoize_1(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });

	  var cache = result.cache;
	  return result;
	}

	var _memoizeCapped = memoizeCapped;

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = _memoizeCapped(function(string) {
	  var result = [];
	  if (string.charCodeAt(0) === 46 /* . */) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, subString) {
	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	var _stringToPath = stringToPath;

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	var _arrayMap = arrayMap;

	/** Used as references for various `Number` constants. */
	var INFINITY$3 = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = _Symbol ? _Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray_1(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return _arrayMap(value, baseToString) + '';
	  }
	  if (isSymbol_1(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY$3) ? '-0' : result;
	}

	var _baseToString = baseToString;

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString$1(value) {
	  return value == null ? '' : _baseToString(value);
	}

	var toString_1 = toString$1;

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value, object) {
	  if (isArray_1(value)) {
	    return value;
	  }
	  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
	}

	var _castPath = castPath;

	/** Used as references for various `Number` constants. */
	var INFINITY$2 = 1 / 0;

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol_1(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
	}

	var _toKey = toKey;

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = _castPath(path, object);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[_toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	var _baseGet = baseGet;

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is returned in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : _baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}

	var get_1 = get;

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHasIn(object, key) {
	  return object != null && key in Object(object);
	}

	var _baseHasIn = baseHasIn;

	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath(object, path, hasFunc) {
	  path = _castPath(path, object);

	  var index = -1,
	      length = path.length,
	      result = false;

	  while (++index < length) {
	    var key = _toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result || ++index != length) {
	    return result;
	  }
	  length = object == null ? 0 : object.length;
	  return !!length && isLength_1(length) && _isIndex(key, length) &&
	    (isArray_1(object) || isArguments_1(object));
	}

	var _hasPath = hasPath;

	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn(object, path) {
	  return object != null && _hasPath(object, path, _baseHasIn);
	}

	var hasIn_1 = hasIn;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1,
	    COMPARE_UNORDERED_FLAG = 2;

	/**
	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  if (_isKey(path) && _isStrictComparable(srcValue)) {
	    return _matchesStrictComparable(_toKey(path), srcValue);
	  }
	  return function(object) {
	    var objValue = get_1(object, path);
	    return (objValue === undefined && objValue === srcValue)
	      ? hasIn_1(object, path)
	      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
	  };
	}

	var _baseMatchesProperty = baseMatchesProperty;

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	var _baseProperty = baseProperty;

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function basePropertyDeep(path) {
	  return function(object) {
	    return _baseGet(object, path);
	  };
	}

	var _basePropertyDeep = basePropertyDeep;

	/**
	 * Creates a function that returns the value at `path` of a given object.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': 2 } },
	 *   { 'a': { 'b': 1 } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b'));
	 * // => [2, 1]
	 *
	 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
	 * // => [1, 2]
	 */
	function property(path) {
	  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
	}

	var property_1 = property;

	/**
	 * The base implementation of `_.iteratee`.
	 *
	 * @private
	 * @param {*} [value=_.identity] The value to convert to an iteratee.
	 * @returns {Function} Returns the iteratee.
	 */
	function baseIteratee(value) {
	  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
	  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
	  if (typeof value == 'function') {
	    return value;
	  }
	  if (value == null) {
	    return identity_1;
	  }
	  if (typeof value == 'object') {
	    return isArray_1(value)
	      ? _baseMatchesProperty(value[0], value[1])
	      : _baseMatches(value);
	  }
	  return property_1(value);
	}

	var _baseIteratee = baseIteratee;

	/**
	 * Iterates over elements of `collection`, returning an array of all elements
	 * `predicate` returns truthy for. The predicate is invoked with three
	 * arguments: (value, index|key, collection).
	 *
	 * **Note:** Unlike `_.remove`, this method returns a new array.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 * @see _.reject
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney', 'age': 36, 'active': true },
	 *   { 'user': 'fred',   'age': 40, 'active': false }
	 * ];
	 *
	 * _.filter(users, function(o) { return !o.active; });
	 * // => objects for ['fred']
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.filter(users, { 'age': 36, 'active': true });
	 * // => objects for ['barney']
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.filter(users, ['active', false]);
	 * // => objects for ['fred']
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.filter(users, 'active');
	 * // => objects for ['barney']
	 *
	 * // Combining several predicates using `_.overEvery` or `_.overSome`.
	 * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
	 * // => objects for ['fred', 'barney']
	 */
	function filter(collection, predicate) {
	  var func = isArray_1(collection) ? _arrayFilter : _baseFilter;
	  return func(collection, _baseIteratee(predicate));
	}

	var filter_1 = filter;

	/** Used for built-in method references. */
	var objectProto$3 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

	/**
	 * The base implementation of `_.has` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHas(object, key) {
	  return object != null && hasOwnProperty$3.call(object, key);
	}

	var _baseHas = baseHas;

	/**
	 * Checks if `path` is a direct property of `object`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = { 'a': { 'b': 2 } };
	 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.has(object, 'a');
	 * // => true
	 *
	 * _.has(object, 'a.b');
	 * // => true
	 *
	 * _.has(object, ['a', 'b']);
	 * // => true
	 *
	 * _.has(other, 'a');
	 * // => false
	 */
	function has(object, path) {
	  return object != null && _hasPath(object, path, _baseHas);
	}

	var has_1 = has;

	/** `Object#toString` result references. */
	var mapTag$1 = '[object Map]',
	    setTag$1 = '[object Set]';

	/** Used for built-in method references. */
	var objectProto$2 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

	/**
	 * Checks if `value` is an empty object, collection, map, or set.
	 *
	 * Objects are considered empty if they have no own enumerable string keyed
	 * properties.
	 *
	 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
	 * jQuery-like collections are considered empty if they have a `length` of `0`.
	 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	 * @example
	 *
	 * _.isEmpty(null);
	 * // => true
	 *
	 * _.isEmpty(true);
	 * // => true
	 *
	 * _.isEmpty(1);
	 * // => true
	 *
	 * _.isEmpty([1, 2, 3]);
	 * // => false
	 *
	 * _.isEmpty({ 'a': 1 });
	 * // => false
	 */
	function isEmpty(value) {
	  if (value == null) {
	    return true;
	  }
	  if (isArrayLike_1(value) &&
	      (isArray_1(value) || typeof value == 'string' || typeof value.splice == 'function' ||
	        isBuffer_1(value) || isTypedArray_1(value) || isArguments_1(value))) {
	    return !value.length;
	  }
	  var tag = _getTag(value);
	  if (tag == mapTag$1 || tag == setTag$1) {
	    return !value.size;
	  }
	  if (_isPrototype(value)) {
	    return !_baseKeys(value).length;
	  }
	  for (var key in value) {
	    if (hasOwnProperty$2.call(value, key)) {
	      return false;
	    }
	  }
	  return true;
	}

	var isEmpty_1 = isEmpty;

	/**
	 * Checks if `value` is `undefined`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	 * @example
	 *
	 * _.isUndefined(void 0);
	 * // => true
	 *
	 * _.isUndefined(null);
	 * // => false
	 */
	function isUndefined(value) {
	  return value === undefined;
	}

	var isUndefined_1 = isUndefined;

	/**
	 * The base implementation of `_.map` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function baseMap(collection, iteratee) {
	  var index = -1,
	      result = isArrayLike_1(collection) ? Array(collection.length) : [];

	  _baseEach(collection, function(value, key, collection) {
	    result[++index] = iteratee(value, key, collection);
	  });
	  return result;
	}

	var _baseMap = baseMap;

	/**
	 * Creates an array of values by running each element in `collection` thru
	 * `iteratee`. The iteratee is invoked with three arguments:
	 * (value, index|key, collection).
	 *
	 * Many lodash methods are guarded to work as iteratees for methods like
	 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
	 *
	 * The guarded methods are:
	 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
	 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
	 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
	 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 * @example
	 *
	 * function square(n) {
	 *   return n * n;
	 * }
	 *
	 * _.map([4, 8], square);
	 * // => [16, 64]
	 *
	 * _.map({ 'a': 4, 'b': 8 }, square);
	 * // => [16, 64] (iteration order is not guaranteed)
	 *
	 * var users = [
	 *   { 'user': 'barney' },
	 *   { 'user': 'fred' }
	 * ];
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.map(users, 'user');
	 * // => ['barney', 'fred']
	 */
	function map(collection, iteratee) {
	  var func = isArray_1(collection) ? _arrayMap : _baseMap;
	  return func(collection, _baseIteratee(iteratee));
	}

	var map_1 = map;

	/**
	 * A specialized version of `_.reduce` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initAccum] Specify using the first element of `array` as
	 *  the initial value.
	 * @returns {*} Returns the accumulated value.
	 */
	function arrayReduce(array, iteratee, accumulator, initAccum) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  if (initAccum && length) {
	    accumulator = array[++index];
	  }
	  while (++index < length) {
	    accumulator = iteratee(accumulator, array[index], index, array);
	  }
	  return accumulator;
	}

	var _arrayReduce = arrayReduce;

	/**
	 * The base implementation of `_.reduce` and `_.reduceRight`, without support
	 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} accumulator The initial value.
	 * @param {boolean} initAccum Specify using the first or last element of
	 *  `collection` as the initial value.
	 * @param {Function} eachFunc The function to iterate over `collection`.
	 * @returns {*} Returns the accumulated value.
	 */
	function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
	  eachFunc(collection, function(value, index, collection) {
	    accumulator = initAccum
	      ? (initAccum = false, value)
	      : iteratee(accumulator, value, index, collection);
	  });
	  return accumulator;
	}

	var _baseReduce = baseReduce;

	/**
	 * Reduces `collection` to a value which is the accumulated result of running
	 * each element in `collection` thru `iteratee`, where each successive
	 * invocation is supplied the return value of the previous. If `accumulator`
	 * is not given, the first element of `collection` is used as the initial
	 * value. The iteratee is invoked with four arguments:
	 * (accumulator, value, index|key, collection).
	 *
	 * Many lodash methods are guarded to work as iteratees for methods like
	 * `_.reduce`, `_.reduceRight`, and `_.transform`.
	 *
	 * The guarded methods are:
	 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
	 * and `sortBy`
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @returns {*} Returns the accumulated value.
	 * @see _.reduceRight
	 * @example
	 *
	 * _.reduce([1, 2], function(sum, n) {
	 *   return sum + n;
	 * }, 0);
	 * // => 3
	 *
	 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	 *   (result[value] || (result[value] = [])).push(key);
	 *   return result;
	 * }, {});
	 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
	 */
	function reduce(collection, iteratee, accumulator) {
	  var func = isArray_1(collection) ? _arrayReduce : _baseReduce,
	      initAccum = arguments.length < 3;

	  return func(collection, _baseIteratee(iteratee), accumulator, initAccum, _baseEach);
	}

	var reduce_1 = reduce;

	/** `Object#toString` result references. */
	var stringTag = '[object String]';

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray_1(value) && isObjectLike_1(value) && _baseGetTag(value) == stringTag);
	}

	var isString_1 = isString;

	/**
	 * Gets the size of an ASCII `string`.
	 *
	 * @private
	 * @param {string} string The string inspect.
	 * @returns {number} Returns the string size.
	 */
	var asciiSize = _baseProperty('length');

	var _asciiSize = asciiSize;

	/** Used to compose unicode character classes. */
	var rsAstralRange$1 = '\\ud800-\\udfff',
	    rsComboMarksRange$1 = '\\u0300-\\u036f',
	    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
	    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
	    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
	    rsVarRange$1 = '\\ufe0e\\ufe0f';

	/** Used to compose unicode capture groups. */
	var rsZWJ$1 = '\\u200d';

	/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
	var reHasUnicode = RegExp('[' + rsZWJ$1 + rsAstralRange$1  + rsComboRange$1 + rsVarRange$1 + ']');

	/**
	 * Checks if `string` contains Unicode symbols.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
	 */
	function hasUnicode(string) {
	  return reHasUnicode.test(string);
	}

	var _hasUnicode = hasUnicode;

	/** Used to compose unicode character classes. */
	var rsAstralRange = '\\ud800-\\udfff',
	    rsComboMarksRange = '\\u0300-\\u036f',
	    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
	    rsComboSymbolsRange = '\\u20d0-\\u20ff',
	    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
	    rsVarRange = '\\ufe0e\\ufe0f';

	/** Used to compose unicode capture groups. */
	var rsAstral = '[' + rsAstralRange + ']',
	    rsCombo = '[' + rsComboRange + ']',
	    rsFitz = '\\ud83c[\\udffb-\\udfff]',
	    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
	    rsNonAstral = '[^' + rsAstralRange + ']',
	    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
	    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
	    rsZWJ = '\\u200d';

	/** Used to compose unicode regexes. */
	var reOptMod = rsModifier + '?',
	    rsOptVar = '[' + rsVarRange + ']?',
	    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
	    rsSeq = rsOptVar + reOptMod + rsOptJoin,
	    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

	/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

	/**
	 * Gets the size of a Unicode `string`.
	 *
	 * @private
	 * @param {string} string The string inspect.
	 * @returns {number} Returns the string size.
	 */
	function unicodeSize(string) {
	  var result = reUnicode.lastIndex = 0;
	  while (reUnicode.test(string)) {
	    ++result;
	  }
	  return result;
	}

	var _unicodeSize = unicodeSize;

	/**
	 * Gets the number of symbols in `string`.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {number} Returns the string size.
	 */
	function stringSize(string) {
	  return _hasUnicode(string)
	    ? _unicodeSize(string)
	    : _asciiSize(string);
	}

	var _stringSize = stringSize;

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    setTag = '[object Set]';

	/**
	 * Gets the size of `collection` by returning its length for array-like
	 * values or the number of own enumerable string keyed properties for objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to inspect.
	 * @returns {number} Returns the collection size.
	 * @example
	 *
	 * _.size([1, 2, 3]);
	 * // => 3
	 *
	 * _.size({ 'a': 1, 'b': 2 });
	 * // => 2
	 *
	 * _.size('pebbles');
	 * // => 7
	 */
	function size(collection) {
	  if (collection == null) {
	    return 0;
	  }
	  if (isArrayLike_1(collection)) {
	    return isString_1(collection) ? _stringSize(collection) : collection.length;
	  }
	  var tag = _getTag(collection);
	  if (tag == mapTag || tag == setTag) {
	    return collection.size;
	  }
	  return _baseKeys(collection).length;
	}

	var size_1 = size;

	/**
	 * An alternative to `_.reduce`; this method transforms `object` to a new
	 * `accumulator` object which is the result of running each of its own
	 * enumerable string keyed properties thru `iteratee`, with each invocation
	 * potentially mutating the `accumulator` object. If `accumulator` is not
	 * provided, a new object with the same `[[Prototype]]` will be used. The
	 * iteratee is invoked with four arguments: (accumulator, value, key, object).
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.3.0
	 * @category Object
	 * @param {Object} object The object to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @param {*} [accumulator] The custom accumulator value.
	 * @returns {*} Returns the accumulated value.
	 * @example
	 *
	 * _.transform([2, 3, 4], function(result, n) {
	 *   result.push(n *= n);
	 *   return n % 2 == 0;
	 * }, []);
	 * // => [4, 9]
	 *
	 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	 *   (result[value] || (result[value] = [])).push(key);
	 * }, {});
	 * // => { '1': ['a', 'c'], '2': ['b'] }
	 */
	function transform(object, iteratee, accumulator) {
	  var isArr = isArray_1(object),
	      isArrLike = isArr || isBuffer_1(object) || isTypedArray_1(object);

	  iteratee = _baseIteratee(iteratee);
	  if (accumulator == null) {
	    var Ctor = object && object.constructor;
	    if (isArrLike) {
	      accumulator = isArr ? new Ctor : [];
	    }
	    else if (isObject_1(object)) {
	      accumulator = isFunction_1(Ctor) ? _baseCreate(_getPrototype(object)) : {};
	    }
	    else {
	      accumulator = {};
	    }
	  }
	  (isArrLike ? _arrayEach : _baseForOwn)(object, function(value, index, object) {
	    return iteratee(accumulator, value, index, object);
	  });
	  return accumulator;
	}

	var transform_1 = transform;

	/** Built-in value references. */
	var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
	  return isArray_1(value) || isArguments_1(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}

	var _isFlattenable = isFlattenable;

	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;

	  predicate || (predicate = _isFlattenable);
	  result || (result = []);

	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, depth - 1, predicate, isStrict, result);
	      } else {
	        _arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}

	var _baseFlatten = baseFlatten;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	var _apply = apply;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax$2 = Math.max;

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax$2(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax$2(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return _apply(func, this, otherArgs);
	  };
	}

	var _overRest = overRest;

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
	  return _defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant_1(string),
	    'writable': true
	  });
	};

	var _baseSetToString = baseSetToString;

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;

	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);

	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}

	var _shortOut = shortOut;

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = _shortOut(_baseSetToString);

	var _setToString = setToString;

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return _setToString(_overRest(func, start, identity_1), func + '');
	}

	var _baseRest = baseRest;

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	var _baseFindIndex = baseFindIndex;

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
	  return value !== value;
	}

	var _baseIsNaN = baseIsNaN;

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function strictIndexOf(array, value, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	var _strictIndexOf = strictIndexOf;

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  return value === value
	    ? _strictIndexOf(array, value, fromIndex)
	    : _baseFindIndex(array, _baseIsNaN, fromIndex);
	}

	var _baseIndexOf = baseIndexOf;

	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
	  var length = array == null ? 0 : array.length;
	  return !!length && _baseIndexOf(array, value, 0) > -1;
	}

	var _arrayIncludes = arrayIncludes;

	/**
	 * This function is like `arrayIncludes` except that it accepts a comparator.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @param {Function} comparator The comparator invoked per element.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludesWith(array, value, comparator) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (comparator(value, array[index])) {
	      return true;
	    }
	  }
	  return false;
	}

	var _arrayIncludesWith = arrayIncludesWith;

	/**
	 * This method returns `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.3.0
	 * @category Util
	 * @example
	 *
	 * _.times(2, _.noop);
	 * // => [undefined, undefined]
	 */
	function noop() {
	  // No operation performed.
	}

	var noop_1 = noop;

	/** Used as references for various `Number` constants. */
	var INFINITY$1 = 1 / 0;

	/**
	 * Creates a set object of `values`.
	 *
	 * @private
	 * @param {Array} values The values to add to the set.
	 * @returns {Object} Returns the new set.
	 */
	var createSet = !(_Set && (1 / _setToArray(new _Set([,-0]))[1]) == INFINITY$1) ? noop_1 : function(values) {
	  return new _Set(values);
	};

	var _createSet = createSet;

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns the new duplicate free array.
	 */
	function baseUniq(array, iteratee, comparator) {
	  var index = -1,
	      includes = _arrayIncludes,
	      length = array.length,
	      isCommon = true,
	      result = [],
	      seen = result;

	  if (comparator) {
	    isCommon = false;
	    includes = _arrayIncludesWith;
	  }
	  else if (length >= LARGE_ARRAY_SIZE) {
	    var set = iteratee ? null : _createSet(array);
	    if (set) {
	      return _setToArray(set);
	    }
	    isCommon = false;
	    includes = _cacheHas;
	    seen = new _SetCache;
	  }
	  else {
	    seen = iteratee ? [] : result;
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index],
	        computed = iteratee ? iteratee(value) : value;

	    value = (comparator || value !== 0) ? value : 0;
	    if (isCommon && computed === computed) {
	      var seenIndex = seen.length;
	      while (seenIndex--) {
	        if (seen[seenIndex] === computed) {
	          continue outer;
	        }
	      }
	      if (iteratee) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	    else if (!includes(seen, computed, comparator)) {
	      if (seen !== result) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	  }
	  return result;
	}

	var _baseUniq = baseUniq;

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike_1(value) && isArrayLike_1(value);
	}

	var isArrayLikeObject_1 = isArrayLikeObject;

	/**
	 * Creates an array of unique values, in order, from all given arrays using
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {...Array} [arrays] The arrays to inspect.
	 * @returns {Array} Returns the new array of combined values.
	 * @example
	 *
	 * _.union([2], [1, 2]);
	 * // => [2, 1]
	 */
	var union = _baseRest(function(arrays) {
	  return _baseUniq(_baseFlatten(arrays, 1, isArrayLikeObject_1, true));
	});

	var union_1 = union;

	/**
	 * The base implementation of `_.values` and `_.valuesIn` which creates an
	 * array of `object` property values corresponding to the property names
	 * of `props`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} props The property names to get values for.
	 * @returns {Object} Returns the array of property values.
	 */
	function baseValues(object, props) {
	  return _arrayMap(props, function(key) {
	    return object[key];
	  });
	}

	var _baseValues = baseValues;

	/**
	 * Creates an array of the own enumerable string keyed property values of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property values.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.values(new Foo);
	 * // => [1, 2] (iteration order is not guaranteed)
	 *
	 * _.values('hi');
	 * // => ['h', 'i']
	 */
	function values(object) {
	  return object == null ? [] : _baseValues(object, keys_1(object));
	}

	var values_1 = values;

	/* global window */

	var lodash$1;

	if (typeof commonjsRequire === "function") {
	  try {
	    lodash$1 = {
	      clone: clone_1,
	      constant: constant_1,
	      each: each,
	      filter: filter_1,
	      has:  has_1,
	      isArray: isArray_1,
	      isEmpty: isEmpty_1,
	      isFunction: isFunction_1,
	      isUndefined: isUndefined_1,
	      keys: keys_1,
	      map: map_1,
	      reduce: reduce_1,
	      size: size_1,
	      transform: transform_1,
	      union: union_1,
	      values: values_1
	    };
	  } catch (e) {
	    // continue regardless of error
	  }
	}

	if (!lodash$1) {
	  lodash$1 = window._;
	}

	var lodash_1$1 = lodash$1;

	var graph = Graph$8;

	var DEFAULT_EDGE_NAME = "\x00";
	var GRAPH_NODE = "\x00";
	var EDGE_KEY_DELIM = "\x01";

	// Implementation notes:
	//
	//  * Node id query functions should return string ids for the nodes
	//  * Edge id query functions should return an "edgeObj", edge object, that is
	//    composed of enough information to uniquely identify an edge: {v, w, name}.
	//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
	//    reference edges. This is because we need a performant way to look these
	//    edges up and, object properties, which have string keys, are the closest
	//    we're going to get to a performant hashtable in JavaScript.

	function Graph$8(opts) {
	  this._isDirected = lodash_1$1.has(opts, "directed") ? opts.directed : true;
	  this._isMultigraph = lodash_1$1.has(opts, "multigraph") ? opts.multigraph : false;
	  this._isCompound = lodash_1$1.has(opts, "compound") ? opts.compound : false;

	  // Label for the graph itself
	  this._label = undefined;

	  // Defaults to be set when creating a new node
	  this._defaultNodeLabelFn = lodash_1$1.constant(undefined);

	  // Defaults to be set when creating a new edge
	  this._defaultEdgeLabelFn = lodash_1$1.constant(undefined);

	  // v -> label
	  this._nodes = {};

	  if (this._isCompound) {
	    // v -> parent
	    this._parent = {};

	    // v -> children
	    this._children = {};
	    this._children[GRAPH_NODE] = {};
	  }

	  // v -> edgeObj
	  this._in = {};

	  // u -> v -> Number
	  this._preds = {};

	  // v -> edgeObj
	  this._out = {};

	  // v -> w -> Number
	  this._sucs = {};

	  // e -> edgeObj
	  this._edgeObjs = {};

	  // e -> label
	  this._edgeLabels = {};
	}

	/* Number of nodes in the graph. Should only be changed by the implementation. */
	Graph$8.prototype._nodeCount = 0;

	/* Number of edges in the graph. Should only be changed by the implementation. */
	Graph$8.prototype._edgeCount = 0;


	/* === Graph functions ========= */

	Graph$8.prototype.isDirected = function() {
	  return this._isDirected;
	};

	Graph$8.prototype.isMultigraph = function() {
	  return this._isMultigraph;
	};

	Graph$8.prototype.isCompound = function() {
	  return this._isCompound;
	};

	Graph$8.prototype.setGraph = function(label) {
	  this._label = label;
	  return this;
	};

	Graph$8.prototype.graph = function() {
	  return this._label;
	};


	/* === Node functions ========== */

	Graph$8.prototype.setDefaultNodeLabel = function(newDefault) {
	  if (!lodash_1$1.isFunction(newDefault)) {
	    newDefault = lodash_1$1.constant(newDefault);
	  }
	  this._defaultNodeLabelFn = newDefault;
	  return this;
	};

	Graph$8.prototype.nodeCount = function() {
	  return this._nodeCount;
	};

	Graph$8.prototype.nodes = function() {
	  return lodash_1$1.keys(this._nodes);
	};

	Graph$8.prototype.sources = function() {
	  var self = this;
	  return lodash_1$1.filter(this.nodes(), function(v) {
	    return lodash_1$1.isEmpty(self._in[v]);
	  });
	};

	Graph$8.prototype.sinks = function() {
	  var self = this;
	  return lodash_1$1.filter(this.nodes(), function(v) {
	    return lodash_1$1.isEmpty(self._out[v]);
	  });
	};

	Graph$8.prototype.setNodes = function(vs, value) {
	  var args = arguments;
	  var self = this;
	  lodash_1$1.each(vs, function(v) {
	    if (args.length > 1) {
	      self.setNode(v, value);
	    } else {
	      self.setNode(v);
	    }
	  });
	  return this;
	};

	Graph$8.prototype.setNode = function(v, value) {
	  if (lodash_1$1.has(this._nodes, v)) {
	    if (arguments.length > 1) {
	      this._nodes[v] = value;
	    }
	    return this;
	  }

	  this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
	  if (this._isCompound) {
	    this._parent[v] = GRAPH_NODE;
	    this._children[v] = {};
	    this._children[GRAPH_NODE][v] = true;
	  }
	  this._in[v] = {};
	  this._preds[v] = {};
	  this._out[v] = {};
	  this._sucs[v] = {};
	  ++this._nodeCount;
	  return this;
	};

	Graph$8.prototype.node = function(v) {
	  return this._nodes[v];
	};

	Graph$8.prototype.hasNode = function(v) {
	  return lodash_1$1.has(this._nodes, v);
	};

	Graph$8.prototype.removeNode =  function(v) {
	  var self = this;
	  if (lodash_1$1.has(this._nodes, v)) {
	    var removeEdge = function(e) { self.removeEdge(self._edgeObjs[e]); };
	    delete this._nodes[v];
	    if (this._isCompound) {
	      this._removeFromParentsChildList(v);
	      delete this._parent[v];
	      lodash_1$1.each(this.children(v), function(child) {
	        self.setParent(child);
	      });
	      delete this._children[v];
	    }
	    lodash_1$1.each(lodash_1$1.keys(this._in[v]), removeEdge);
	    delete this._in[v];
	    delete this._preds[v];
	    lodash_1$1.each(lodash_1$1.keys(this._out[v]), removeEdge);
	    delete this._out[v];
	    delete this._sucs[v];
	    --this._nodeCount;
	  }
	  return this;
	};

	Graph$8.prototype.setParent = function(v, parent) {
	  if (!this._isCompound) {
	    throw new Error("Cannot set parent in a non-compound graph");
	  }

	  if (lodash_1$1.isUndefined(parent)) {
	    parent = GRAPH_NODE;
	  } else {
	    // Coerce parent to string
	    parent += "";
	    for (var ancestor = parent;
	      !lodash_1$1.isUndefined(ancestor);
	      ancestor = this.parent(ancestor)) {
	      if (ancestor === v) {
	        throw new Error("Setting " + parent+ " as parent of " + v +
	                        " would create a cycle");
	      }
	    }

	    this.setNode(parent);
	  }

	  this.setNode(v);
	  this._removeFromParentsChildList(v);
	  this._parent[v] = parent;
	  this._children[parent][v] = true;
	  return this;
	};

	Graph$8.prototype._removeFromParentsChildList = function(v) {
	  delete this._children[this._parent[v]][v];
	};

	Graph$8.prototype.parent = function(v) {
	  if (this._isCompound) {
	    var parent = this._parent[v];
	    if (parent !== GRAPH_NODE) {
	      return parent;
	    }
	  }
	};

	Graph$8.prototype.children = function(v) {
	  if (lodash_1$1.isUndefined(v)) {
	    v = GRAPH_NODE;
	  }

	  if (this._isCompound) {
	    var children = this._children[v];
	    if (children) {
	      return lodash_1$1.keys(children);
	    }
	  } else if (v === GRAPH_NODE) {
	    return this.nodes();
	  } else if (this.hasNode(v)) {
	    return [];
	  }
	};

	Graph$8.prototype.predecessors = function(v) {
	  var predsV = this._preds[v];
	  if (predsV) {
	    return lodash_1$1.keys(predsV);
	  }
	};

	Graph$8.prototype.successors = function(v) {
	  var sucsV = this._sucs[v];
	  if (sucsV) {
	    return lodash_1$1.keys(sucsV);
	  }
	};

	Graph$8.prototype.neighbors = function(v) {
	  var preds = this.predecessors(v);
	  if (preds) {
	    return lodash_1$1.union(preds, this.successors(v));
	  }
	};

	Graph$8.prototype.isLeaf = function (v) {
	  var neighbors;
	  if (this.isDirected()) {
	    neighbors = this.successors(v);
	  } else {
	    neighbors = this.neighbors(v);
	  }
	  return neighbors.length === 0;
	};

	Graph$8.prototype.filterNodes = function(filter) {
	  var copy = new this.constructor({
	    directed: this._isDirected,
	    multigraph: this._isMultigraph,
	    compound: this._isCompound
	  });

	  copy.setGraph(this.graph());

	  var self = this;
	  lodash_1$1.each(this._nodes, function(value, v) {
	    if (filter(v)) {
	      copy.setNode(v, value);
	    }
	  });

	  lodash_1$1.each(this._edgeObjs, function(e) {
	    if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
	      copy.setEdge(e, self.edge(e));
	    }
	  });

	  var parents = {};
	  function findParent(v) {
	    var parent = self.parent(v);
	    if (parent === undefined || copy.hasNode(parent)) {
	      parents[v] = parent;
	      return parent;
	    } else if (parent in parents) {
	      return parents[parent];
	    } else {
	      return findParent(parent);
	    }
	  }

	  if (this._isCompound) {
	    lodash_1$1.each(copy.nodes(), function(v) {
	      copy.setParent(v, findParent(v));
	    });
	  }

	  return copy;
	};

	/* === Edge functions ========== */

	Graph$8.prototype.setDefaultEdgeLabel = function(newDefault) {
	  if (!lodash_1$1.isFunction(newDefault)) {
	    newDefault = lodash_1$1.constant(newDefault);
	  }
	  this._defaultEdgeLabelFn = newDefault;
	  return this;
	};

	Graph$8.prototype.edgeCount = function() {
	  return this._edgeCount;
	};

	Graph$8.prototype.edges = function() {
	  return lodash_1$1.values(this._edgeObjs);
	};

	Graph$8.prototype.setPath = function(vs, value) {
	  var self = this;
	  var args = arguments;
	  lodash_1$1.reduce(vs, function(v, w) {
	    if (args.length > 1) {
	      self.setEdge(v, w, value);
	    } else {
	      self.setEdge(v, w);
	    }
	    return w;
	  });
	  return this;
	};

	/*
	 * setEdge(v, w, [value, [name]])
	 * setEdge({ v, w, [name] }, [value])
	 */
	Graph$8.prototype.setEdge = function() {
	  var v, w, name, value;
	  var valueSpecified = false;
	  var arg0 = arguments[0];

	  if (typeof arg0 === "object" && arg0 !== null && "v" in arg0) {
	    v = arg0.v;
	    w = arg0.w;
	    name = arg0.name;
	    if (arguments.length === 2) {
	      value = arguments[1];
	      valueSpecified = true;
	    }
	  } else {
	    v = arg0;
	    w = arguments[1];
	    name = arguments[3];
	    if (arguments.length > 2) {
	      value = arguments[2];
	      valueSpecified = true;
	    }
	  }

	  v = "" + v;
	  w = "" + w;
	  if (!lodash_1$1.isUndefined(name)) {
	    name = "" + name;
	  }

	  var e = edgeArgsToId(this._isDirected, v, w, name);
	  if (lodash_1$1.has(this._edgeLabels, e)) {
	    if (valueSpecified) {
	      this._edgeLabels[e] = value;
	    }
	    return this;
	  }

	  if (!lodash_1$1.isUndefined(name) && !this._isMultigraph) {
	    throw new Error("Cannot set a named edge when isMultigraph = false");
	  }

	  // It didn't exist, so we need to create it.
	  // First ensure the nodes exist.
	  this.setNode(v);
	  this.setNode(w);

	  this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);

	  var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
	  // Ensure we add undirected edges in a consistent way.
	  v = edgeObj.v;
	  w = edgeObj.w;

	  Object.freeze(edgeObj);
	  this._edgeObjs[e] = edgeObj;
	  incrementOrInitEntry(this._preds[w], v);
	  incrementOrInitEntry(this._sucs[v], w);
	  this._in[w][e] = edgeObj;
	  this._out[v][e] = edgeObj;
	  this._edgeCount++;
	  return this;
	};

	Graph$8.prototype.edge = function(v, w, name) {
	  var e = (arguments.length === 1
	    ? edgeObjToId(this._isDirected, arguments[0])
	    : edgeArgsToId(this._isDirected, v, w, name));
	  return this._edgeLabels[e];
	};

	Graph$8.prototype.hasEdge = function(v, w, name) {
	  var e = (arguments.length === 1
	    ? edgeObjToId(this._isDirected, arguments[0])
	    : edgeArgsToId(this._isDirected, v, w, name));
	  return lodash_1$1.has(this._edgeLabels, e);
	};

	Graph$8.prototype.removeEdge = function(v, w, name) {
	  var e = (arguments.length === 1
	    ? edgeObjToId(this._isDirected, arguments[0])
	    : edgeArgsToId(this._isDirected, v, w, name));
	  var edge = this._edgeObjs[e];
	  if (edge) {
	    v = edge.v;
	    w = edge.w;
	    delete this._edgeLabels[e];
	    delete this._edgeObjs[e];
	    decrementOrRemoveEntry(this._preds[w], v);
	    decrementOrRemoveEntry(this._sucs[v], w);
	    delete this._in[w][e];
	    delete this._out[v][e];
	    this._edgeCount--;
	  }
	  return this;
	};

	Graph$8.prototype.inEdges = function(v, u) {
	  var inV = this._in[v];
	  if (inV) {
	    var edges = lodash_1$1.values(inV);
	    if (!u) {
	      return edges;
	    }
	    return lodash_1$1.filter(edges, function(edge) { return edge.v === u; });
	  }
	};

	Graph$8.prototype.outEdges = function(v, w) {
	  var outV = this._out[v];
	  if (outV) {
	    var edges = lodash_1$1.values(outV);
	    if (!w) {
	      return edges;
	    }
	    return lodash_1$1.filter(edges, function(edge) { return edge.w === w; });
	  }
	};

	Graph$8.prototype.nodeEdges = function(v, w) {
	  var inEdges = this.inEdges(v, w);
	  if (inEdges) {
	    return inEdges.concat(this.outEdges(v, w));
	  }
	};

	function incrementOrInitEntry(map, k) {
	  if (map[k]) {
	    map[k]++;
	  } else {
	    map[k] = 1;
	  }
	}

	function decrementOrRemoveEntry(map, k) {
	  if (!--map[k]) { delete map[k]; }
	}

	function edgeArgsToId(isDirected, v_, w_, name) {
	  var v = "" + v_;
	  var w = "" + w_;
	  if (!isDirected && v > w) {
	    var tmp = v;
	    v = w;
	    w = tmp;
	  }
	  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM +
	             (lodash_1$1.isUndefined(name) ? DEFAULT_EDGE_NAME : name);
	}

	function edgeArgsToObj(isDirected, v_, w_, name) {
	  var v = "" + v_;
	  var w = "" + w_;
	  if (!isDirected && v > w) {
	    var tmp = v;
	    v = w;
	    w = tmp;
	  }
	  var edgeObj =  { v: v, w: w };
	  if (name) {
	    edgeObj.name = name;
	  }
	  return edgeObj;
	}

	function edgeObjToId(isDirected, edgeObj) {
	  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
	}

	var version$1 = '2.1.8';

	// Includes only the "core" of graphlib
	var lib = {
	  Graph: graph,
	  version: version$1
	};

	var json = {
	  write: write,
	  read: read
	};

	function write(g) {
	  var json = {
	    options: {
	      directed: g.isDirected(),
	      multigraph: g.isMultigraph(),
	      compound: g.isCompound()
	    },
	    nodes: writeNodes(g),
	    edges: writeEdges(g)
	  };
	  if (!lodash_1$1.isUndefined(g.graph())) {
	    json.value = lodash_1$1.clone(g.graph());
	  }
	  return json;
	}

	function writeNodes(g) {
	  return lodash_1$1.map(g.nodes(), function(v) {
	    var nodeValue = g.node(v);
	    var parent = g.parent(v);
	    var node = { v: v };
	    if (!lodash_1$1.isUndefined(nodeValue)) {
	      node.value = nodeValue;
	    }
	    if (!lodash_1$1.isUndefined(parent)) {
	      node.parent = parent;
	    }
	    return node;
	  });
	}

	function writeEdges(g) {
	  return lodash_1$1.map(g.edges(), function(e) {
	    var edgeValue = g.edge(e);
	    var edge = { v: e.v, w: e.w };
	    if (!lodash_1$1.isUndefined(e.name)) {
	      edge.name = e.name;
	    }
	    if (!lodash_1$1.isUndefined(edgeValue)) {
	      edge.value = edgeValue;
	    }
	    return edge;
	  });
	}

	function read(json) {
	  var g = new graph(json.options).setGraph(json.value);
	  lodash_1$1.each(json.nodes, function(entry) {
	    g.setNode(entry.v, entry.value);
	    if (entry.parent) {
	      g.setParent(entry.v, entry.parent);
	    }
	  });
	  lodash_1$1.each(json.edges, function(entry) {
	    g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
	  });
	  return g;
	}
	json.write;
	json.read;

	var components_1 = components;

	function components(g) {
	  var visited = {};
	  var cmpts = [];
	  var cmpt;

	  function dfs(v) {
	    if (lodash_1$1.has(visited, v)) return;
	    visited[v] = true;
	    cmpt.push(v);
	    lodash_1$1.each(g.successors(v), dfs);
	    lodash_1$1.each(g.predecessors(v), dfs);
	  }

	  lodash_1$1.each(g.nodes(), function(v) {
	    cmpt = [];
	    dfs(v);
	    if (cmpt.length) {
	      cmpts.push(cmpt);
	    }
	  });

	  return cmpts;
	}

	var priorityQueue = PriorityQueue;

	/**
	 * A min-priority queue data structure. This algorithm is derived from Cormen,
	 * et al., "Introduction to Algorithms". The basic idea of a min-priority
	 * queue is that you can efficiently (in O(1) time) get the smallest key in
	 * the queue. Adding and removing elements takes O(log n) time. A key can
	 * have its priority decreased in O(log n) time.
	 */
	function PriorityQueue() {
	  this._arr = [];
	  this._keyIndices = {};
	}

	/**
	 * Returns the number of elements in the queue. Takes `O(1)` time.
	 */
	PriorityQueue.prototype.size = function() {
	  return this._arr.length;
	};

	/**
	 * Returns the keys that are in the queue. Takes `O(n)` time.
	 */
	PriorityQueue.prototype.keys = function() {
	  return this._arr.map(function(x) { return x.key; });
	};

	/**
	 * Returns `true` if **key** is in the queue and `false` if not.
	 */
	PriorityQueue.prototype.has = function(key) {
	  return lodash_1$1.has(this._keyIndices, key);
	};

	/**
	 * Returns the priority for **key**. If **key** is not present in the queue
	 * then this function returns `undefined`. Takes `O(1)` time.
	 *
	 * @param {Object} key
	 */
	PriorityQueue.prototype.priority = function(key) {
	  var index = this._keyIndices[key];
	  if (index !== undefined) {
	    return this._arr[index].priority;
	  }
	};

	/**
	 * Returns the key for the minimum element in this queue. If the queue is
	 * empty this function throws an Error. Takes `O(1)` time.
	 */
	PriorityQueue.prototype.min = function() {
	  if (this.size() === 0) {
	    throw new Error("Queue underflow");
	  }
	  return this._arr[0].key;
	};

	/**
	 * Inserts a new key into the priority queue. If the key already exists in
	 * the queue this function returns `false`; otherwise it will return `true`.
	 * Takes `O(n)` time.
	 *
	 * @param {Object} key the key to add
	 * @param {Number} priority the initial priority for the key
	 */
	PriorityQueue.prototype.add = function(key, priority) {
	  var keyIndices = this._keyIndices;
	  key = String(key);
	  if (!lodash_1$1.has(keyIndices, key)) {
	    var arr = this._arr;
	    var index = arr.length;
	    keyIndices[key] = index;
	    arr.push({key: key, priority: priority});
	    this._decrease(index);
	    return true;
	  }
	  return false;
	};

	/**
	 * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
	 */
	PriorityQueue.prototype.removeMin = function() {
	  this._swap(0, this._arr.length - 1);
	  var min = this._arr.pop();
	  delete this._keyIndices[min.key];
	  this._heapify(0);
	  return min.key;
	};

	/**
	 * Decreases the priority for **key** to **priority**. If the new priority is
	 * greater than the previous priority, this function will throw an Error.
	 *
	 * @param {Object} key the key for which to raise priority
	 * @param {Number} priority the new priority for the key
	 */
	PriorityQueue.prototype.decrease = function(key, priority) {
	  var index = this._keyIndices[key];
	  if (priority > this._arr[index].priority) {
	    throw new Error("New priority is greater than current priority. " +
	        "Key: " + key + " Old: " + this._arr[index].priority + " New: " + priority);
	  }
	  this._arr[index].priority = priority;
	  this._decrease(index);
	};

	PriorityQueue.prototype._heapify = function(i) {
	  var arr = this._arr;
	  var l = 2 * i;
	  var r = l + 1;
	  var largest = i;
	  if (l < arr.length) {
	    largest = arr[l].priority < arr[largest].priority ? l : largest;
	    if (r < arr.length) {
	      largest = arr[r].priority < arr[largest].priority ? r : largest;
	    }
	    if (largest !== i) {
	      this._swap(i, largest);
	      this._heapify(largest);
	    }
	  }
	};

	PriorityQueue.prototype._decrease = function(index) {
	  var arr = this._arr;
	  var priority = arr[index].priority;
	  var parent;
	  while (index !== 0) {
	    parent = index >> 1;
	    if (arr[parent].priority < priority) {
	      break;
	    }
	    this._swap(index, parent);
	    index = parent;
	  }
	};

	PriorityQueue.prototype._swap = function(i, j) {
	  var arr = this._arr;
	  var keyIndices = this._keyIndices;
	  var origArrI = arr[i];
	  var origArrJ = arr[j];
	  arr[i] = origArrJ;
	  arr[j] = origArrI;
	  keyIndices[origArrJ.key] = i;
	  keyIndices[origArrI.key] = j;
	};

	var dijkstra_1 = dijkstra;

	var DEFAULT_WEIGHT_FUNC$1 = lodash_1$1.constant(1);

	function dijkstra(g, source, weightFn, edgeFn) {
	  return runDijkstra(g, String(source),
	    weightFn || DEFAULT_WEIGHT_FUNC$1,
	    edgeFn || function(v) { return g.outEdges(v); });
	}

	function runDijkstra(g, source, weightFn, edgeFn) {
	  var results = {};
	  var pq = new priorityQueue();
	  var v, vEntry;

	  var updateNeighbors = function(edge) {
	    var w = edge.v !== v ? edge.v : edge.w;
	    var wEntry = results[w];
	    var weight = weightFn(edge);
	    var distance = vEntry.distance + weight;

	    if (weight < 0) {
	      throw new Error("dijkstra does not allow negative edge weights. " +
	                      "Bad edge: " + edge + " Weight: " + weight);
	    }

	    if (distance < wEntry.distance) {
	      wEntry.distance = distance;
	      wEntry.predecessor = v;
	      pq.decrease(w, distance);
	    }
	  };

	  g.nodes().forEach(function(v) {
	    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
	    results[v] = { distance: distance };
	    pq.add(v, distance);
	  });

	  while (pq.size() > 0) {
	    v = pq.removeMin();
	    vEntry = results[v];
	    if (vEntry.distance === Number.POSITIVE_INFINITY) {
	      break;
	    }

	    edgeFn(v).forEach(updateNeighbors);
	  }

	  return results;
	}

	var dijkstraAll_1 = dijkstraAll;

	function dijkstraAll(g, weightFunc, edgeFunc) {
	  return lodash_1$1.transform(g.nodes(), function(acc, v) {
	    acc[v] = dijkstra_1(g, v, weightFunc, edgeFunc);
	  }, {});
	}

	var tarjan_1 = tarjan;

	function tarjan(g) {
	  var index = 0;
	  var stack = [];
	  var visited = {}; // node id -> { onStack, lowlink, index }
	  var results = [];

	  function dfs(v) {
	    var entry = visited[v] = {
	      onStack: true,
	      lowlink: index,
	      index: index++
	    };
	    stack.push(v);

	    g.successors(v).forEach(function(w) {
	      if (!lodash_1$1.has(visited, w)) {
	        dfs(w);
	        entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
	      } else if (visited[w].onStack) {
	        entry.lowlink = Math.min(entry.lowlink, visited[w].index);
	      }
	    });

	    if (entry.lowlink === entry.index) {
	      var cmpt = [];
	      var w;
	      do {
	        w = stack.pop();
	        visited[w].onStack = false;
	        cmpt.push(w);
	      } while (v !== w);
	      results.push(cmpt);
	    }
	  }

	  g.nodes().forEach(function(v) {
	    if (!lodash_1$1.has(visited, v)) {
	      dfs(v);
	    }
	  });

	  return results;
	}

	var findCycles_1 = findCycles;

	function findCycles(g) {
	  return lodash_1$1.filter(tarjan_1(g), function(cmpt) {
	    return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]));
	  });
	}

	var floydWarshall_1 = floydWarshall;

	var DEFAULT_WEIGHT_FUNC = lodash_1$1.constant(1);

	function floydWarshall(g, weightFn, edgeFn) {
	  return runFloydWarshall(g,
	    weightFn || DEFAULT_WEIGHT_FUNC,
	    edgeFn || function(v) { return g.outEdges(v); });
	}

	function runFloydWarshall(g, weightFn, edgeFn) {
	  var results = {};
	  var nodes = g.nodes();

	  nodes.forEach(function(v) {
	    results[v] = {};
	    results[v][v] = { distance: 0 };
	    nodes.forEach(function(w) {
	      if (v !== w) {
	        results[v][w] = { distance: Number.POSITIVE_INFINITY };
	      }
	    });
	    edgeFn(v).forEach(function(edge) {
	      var w = edge.v === v ? edge.w : edge.v;
	      var d = weightFn(edge);
	      results[v][w] = { distance: d, predecessor: v };
	    });
	  });

	  nodes.forEach(function(k) {
	    var rowK = results[k];
	    nodes.forEach(function(i) {
	      var rowI = results[i];
	      nodes.forEach(function(j) {
	        var ik = rowI[k];
	        var kj = rowK[j];
	        var ij = rowI[j];
	        var altDistance = ik.distance + kj.distance;
	        if (altDistance < ij.distance) {
	          ij.distance = altDistance;
	          ij.predecessor = kj.predecessor;
	        }
	      });
	    });
	  });

	  return results;
	}

	var topsort_1 = topsort;
	topsort.CycleException = CycleException;

	function topsort(g) {
	  var visited = {};
	  var stack = {};
	  var results = [];

	  function visit(node) {
	    if (lodash_1$1.has(stack, node)) {
	      throw new CycleException();
	    }

	    if (!lodash_1$1.has(visited, node)) {
	      stack[node] = true;
	      visited[node] = true;
	      lodash_1$1.each(g.predecessors(node), visit);
	      delete stack[node];
	      results.push(node);
	    }
	  }

	  lodash_1$1.each(g.sinks(), visit);

	  if (lodash_1$1.size(visited) !== g.nodeCount()) {
	    throw new CycleException();
	  }

	  return results;
	}

	function CycleException() {}
	CycleException.prototype = new Error(); // must be an instance of Error to pass testing

	var isAcyclic_1 = isAcyclic;

	function isAcyclic(g) {
	  try {
	    topsort_1(g);
	  } catch (e) {
	    if (e instanceof topsort_1.CycleException) {
	      return false;
	    }
	    throw e;
	  }
	  return true;
	}

	var dfs_1 = dfs$1;

	/*
	 * A helper that preforms a pre- or post-order traversal on the input graph
	 * and returns the nodes in the order they were visited. If the graph is
	 * undirected then this algorithm will navigate using neighbors. If the graph
	 * is directed then this algorithm will navigate using successors.
	 *
	 * Order must be one of "pre" or "post".
	 */
	function dfs$1(g, vs, order) {
	  if (!lodash_1$1.isArray(vs)) {
	    vs = [vs];
	  }

	  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

	  var acc = [];
	  var visited = {};
	  lodash_1$1.each(vs, function(v) {
	    if (!g.hasNode(v)) {
	      throw new Error("Graph does not have node: " + v);
	    }

	    doDfs(g, v, order === "post", visited, navigation, acc);
	  });
	  return acc;
	}

	function doDfs(g, v, postorder, visited, navigation, acc) {
	  if (!lodash_1$1.has(visited, v)) {
	    visited[v] = true;

	    if (!postorder) { acc.push(v); }
	    lodash_1$1.each(navigation(v), function(w) {
	      doDfs(g, w, postorder, visited, navigation, acc);
	    });
	    if (postorder) { acc.push(v); }
	  }
	}

	var postorder_1 = postorder$2;

	function postorder$2(g, vs) {
	  return dfs_1(g, vs, "post");
	}

	var preorder_1 = preorder$1;

	function preorder$1(g, vs) {
	  return dfs_1(g, vs, "pre");
	}

	var prim_1 = prim;

	function prim(g, weightFunc) {
	  var result = new graph();
	  var parents = {};
	  var pq = new priorityQueue();
	  var v;

	  function updateNeighbors(edge) {
	    var w = edge.v === v ? edge.w : edge.v;
	    var pri = pq.priority(w);
	    if (pri !== undefined) {
	      var edgeWeight = weightFunc(edge);
	      if (edgeWeight < pri) {
	        parents[w] = v;
	        pq.decrease(w, edgeWeight);
	      }
	    }
	  }

	  if (g.nodeCount() === 0) {
	    return result;
	  }

	  lodash_1$1.each(g.nodes(), function(v) {
	    pq.add(v, Number.POSITIVE_INFINITY);
	    result.setNode(v);
	  });

	  // Start from an arbitrary node
	  pq.decrease(g.nodes()[0], 0);

	  var init = false;
	  while (pq.size() > 0) {
	    v = pq.removeMin();
	    if (lodash_1$1.has(parents, v)) {
	      result.setEdge(v, parents[v]);
	    } else if (init) {
	      throw new Error("Input graph is not connected: " + g);
	    } else {
	      init = true;
	    }

	    g.nodeEdges(v).forEach(updateNeighbors);
	  }

	  return result;
	}

	var alg = {
	  components: components_1,
	  dijkstra: dijkstra_1,
	  dijkstraAll: dijkstraAll_1,
	  findCycles: findCycles_1,
	  floydWarshall: floydWarshall_1,
	  isAcyclic: isAcyclic_1,
	  postorder: postorder_1,
	  preorder: preorder_1,
	  prim: prim_1,
	  tarjan: tarjan_1,
	  topsort: topsort_1
	};
	alg.components;
	alg.dijkstra;
	alg.dijkstraAll;
	alg.findCycles;
	alg.floydWarshall;
	alg.isAcyclic;
	alg.postorder;
	alg.preorder;
	alg.prim;
	alg.tarjan;
	alg.topsort;

	/**
	 * Copyright (c) 2014, Chris Pettitt
	 * All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are met:
	 *
	 * 1. Redistributions of source code must retain the above copyright notice, this
	 * list of conditions and the following disclaimer.
	 *
	 * 2. Redistributions in binary form must reproduce the above copyright notice,
	 * this list of conditions and the following disclaimer in the documentation
	 * and/or other materials provided with the distribution.
	 *
	 * 3. Neither the name of the copyright holder nor the names of its contributors
	 * may be used to endorse or promote products derived from this software without
	 * specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
	 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
	 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
	 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
	 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
	 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */



	var graphlib$1 = {
	  Graph: lib.Graph,
	  json: json,
	  alg: alg,
	  version: lib.version
	};
	graphlib$1.Graph;
	graphlib$1.json;
	graphlib$1.alg;
	graphlib$1.version;

	/* global window */

	var graphlib;

	if (typeof commonjsRequire === "function") {
	  try {
	    graphlib = graphlib$1;
	  } catch (e) {
	    // continue regardless of error
	  }
	}

	if (!graphlib) {
	  graphlib = window.graphlib;
	}

	var graphlib_1 = graphlib;

	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1,
	    CLONE_SYMBOLS_FLAG = 4;

	/**
	 * This method is like `_.clone` except that it recursively clones `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.0.0
	 * @category Lang
	 * @param {*} value The value to recursively clone.
	 * @returns {*} Returns the deep cloned value.
	 * @see _.clone
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var deep = _.cloneDeep(objects);
	 * console.log(deep[0] === objects[0]);
	 * // => false
	 */
	function cloneDeep(value) {
	  return _baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
	}

	var cloneDeep_1 = cloneDeep;

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject_1(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike_1(object) && _isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq_1(object[index], value);
	  }
	  return false;
	}

	var _isIterateeCall = isIterateeCall;

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

	/**
	 * Assigns own and inherited enumerable string keyed properties of source
	 * objects to the destination object for all destination properties that
	 * resolve to `undefined`. Source objects are applied from left to right.
	 * Once a property is set, additional values of the same property are ignored.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @see _.defaultsDeep
	 * @example
	 *
	 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	 * // => { 'a': 1, 'b': 2 }
	 */
	var defaults = _baseRest(function(object, sources) {
	  object = Object(object);

	  var index = -1;
	  var length = sources.length;
	  var guard = length > 2 ? sources[2] : undefined;

	  if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
	    length = 1;
	  }

	  while (++index < length) {
	    var source = sources[index];
	    var props = keysIn_1(source);
	    var propsIndex = -1;
	    var propsLength = props.length;

	    while (++propsIndex < propsLength) {
	      var key = props[propsIndex];
	      var value = object[key];

	      if (value === undefined ||
	          (eq_1(value, objectProto$1[key]) && !hasOwnProperty$1.call(object, key))) {
	        object[key] = source[key];
	      }
	    }
	  }

	  return object;
	});

	var defaults_1 = defaults;

	/**
	 * Creates a `_.find` or `_.findLast` function.
	 *
	 * @private
	 * @param {Function} findIndexFunc The function to find the collection index.
	 * @returns {Function} Returns the new find function.
	 */
	function createFind(findIndexFunc) {
	  return function(collection, predicate, fromIndex) {
	    var iterable = Object(collection);
	    if (!isArrayLike_1(collection)) {
	      var iteratee = _baseIteratee(predicate);
	      collection = keys_1(collection);
	      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
	    }
	    var index = findIndexFunc(collection, predicate, fromIndex);
	    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
	  };
	}

	var _createFind = createFind;

	/** Used to match a single whitespace character. */
	var reWhitespace = /\s/;

	/**
	 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
	 * character of `string`.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {number} Returns the index of the last non-whitespace character.
	 */
	function trimmedEndIndex(string) {
	  var index = string.length;

	  while (index-- && reWhitespace.test(string.charAt(index))) {}
	  return index;
	}

	var _trimmedEndIndex = trimmedEndIndex;

	/** Used to match leading whitespace. */
	var reTrimStart = /^\s+/;

	/**
	 * The base implementation of `_.trim`.
	 *
	 * @private
	 * @param {string} string The string to trim.
	 * @returns {string} Returns the trimmed string.
	 */
	function baseTrim(string) {
	  return string
	    ? string.slice(0, _trimmedEndIndex(string) + 1).replace(reTrimStart, '')
	    : string;
	}

	var _baseTrim = baseTrim;

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol_1(value)) {
	    return NAN;
	  }
	  if (isObject_1(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject_1(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = _baseTrim(value);
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	var toNumber_1 = toNumber;

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_INTEGER = 1.7976931348623157e+308;

	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber_1(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = (value < 0 ? -1 : 1);
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}

	var toFinite_1 = toFinite;

	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite_1(value),
	      remainder = result % 1;

	  return result === result ? (remainder ? result - remainder : result) : 0;
	}

	var toInteger_1 = toInteger;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax$1 = Math.max;

	/**
	 * This method is like `_.find` except that it returns the index of the first
	 * element `predicate` returns truthy for instead of the element itself.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.1.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @param {number} [fromIndex=0] The index to search from.
	 * @returns {number} Returns the index of the found element, else `-1`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'active': false },
	 *   { 'user': 'fred',    'active': false },
	 *   { 'user': 'pebbles', 'active': true }
	 * ];
	 *
	 * _.findIndex(users, function(o) { return o.user == 'barney'; });
	 * // => 0
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.findIndex(users, { 'user': 'fred', 'active': false });
	 * // => 1
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.findIndex(users, ['active', false]);
	 * // => 0
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.findIndex(users, 'active');
	 * // => 2
	 */
	function findIndex(array, predicate, fromIndex) {
	  var length = array == null ? 0 : array.length;
	  if (!length) {
	    return -1;
	  }
	  var index = fromIndex == null ? 0 : toInteger_1(fromIndex);
	  if (index < 0) {
	    index = nativeMax$1(length + index, 0);
	  }
	  return _baseFindIndex(array, _baseIteratee(predicate), index);
	}

	var findIndex_1 = findIndex;

	/**
	 * Iterates over elements of `collection`, returning the first element
	 * `predicate` returns truthy for. The predicate is invoked with three
	 * arguments: (value, index|key, collection).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to inspect.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @param {number} [fromIndex=0] The index to search from.
	 * @returns {*} Returns the matched element, else `undefined`.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'barney',  'age': 36, 'active': true },
	 *   { 'user': 'fred',    'age': 40, 'active': false },
	 *   { 'user': 'pebbles', 'age': 1,  'active': true }
	 * ];
	 *
	 * _.find(users, function(o) { return o.age < 40; });
	 * // => object for 'barney'
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.find(users, { 'age': 1, 'active': true });
	 * // => object for 'pebbles'
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.find(users, ['active', false]);
	 * // => object for 'fred'
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.find(users, 'active');
	 * // => object for 'barney'
	 */
	var find = _createFind(findIndex_1);

	var find_1 = find;

	/**
	 * Flattens `array` a single level deep.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to flatten.
	 * @returns {Array} Returns the new flattened array.
	 * @example
	 *
	 * _.flatten([1, [2, [3, [4]], 5]]);
	 * // => [1, 2, [3, [4]], 5]
	 */
	function flatten(array) {
	  var length = array == null ? 0 : array.length;
	  return length ? _baseFlatten(array, 1) : [];
	}

	var flatten_1 = flatten;

	/**
	 * Iterates over own and inherited enumerable string keyed properties of an
	 * object and invokes `iteratee` for each property. The iteratee is invoked
	 * with three arguments: (value, key, object). Iteratee functions may exit
	 * iteration early by explicitly returning `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.3.0
	 * @category Object
	 * @param {Object} object The object to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 * @see _.forInRight
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.forIn(new Foo, function(value, key) {
	 *   console.log(key);
	 * });
	 * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
	 */
	function forIn(object, iteratee) {
	  return object == null
	    ? object
	    : _baseFor(object, _castFunction(iteratee), keysIn_1);
	}

	var forIn_1 = forIn;

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
	  var length = array == null ? 0 : array.length;
	  return length ? array[length - 1] : undefined;
	}

	var last_1 = last;

	/**
	 * Creates an object with the same keys as `object` and values generated
	 * by running each own enumerable string keyed property of `object` thru
	 * `iteratee`. The iteratee is invoked with three arguments:
	 * (value, key, object).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Object
	 * @param {Object} object The object to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Object} Returns the new mapped object.
	 * @see _.mapKeys
	 * @example
	 *
	 * var users = {
	 *   'fred':    { 'user': 'fred',    'age': 40 },
	 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
	 * };
	 *
	 * _.mapValues(users, function(o) { return o.age; });
	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.mapValues(users, 'age');
	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	 */
	function mapValues(object, iteratee) {
	  var result = {};
	  iteratee = _baseIteratee(iteratee);

	  _baseForOwn(object, function(value, key, object) {
	    _baseAssignValue(result, key, iteratee(value, key, object));
	  });
	  return result;
	}

	var mapValues_1 = mapValues;

	/**
	 * The base implementation of methods like `_.max` and `_.min` which accepts a
	 * `comparator` to determine the extremum value.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The iteratee invoked per iteration.
	 * @param {Function} comparator The comparator used to compare values.
	 * @returns {*} Returns the extremum value.
	 */
	function baseExtremum(array, iteratee, comparator) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    var value = array[index],
	        current = iteratee(value);

	    if (current != null && (computed === undefined
	          ? (current === current && !isSymbol_1(current))
	          : comparator(current, computed)
	        )) {
	      var computed = current,
	          result = value;
	    }
	  }
	  return result;
	}

	var _baseExtremum = baseExtremum;

	/**
	 * The base implementation of `_.gt` which doesn't coerce arguments.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if `value` is greater than `other`,
	 *  else `false`.
	 */
	function baseGt(value, other) {
	  return value > other;
	}

	var _baseGt = baseGt;

	/**
	 * Computes the maximum value of `array`. If `array` is empty or falsey,
	 * `undefined` is returned.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Math
	 * @param {Array} array The array to iterate over.
	 * @returns {*} Returns the maximum value.
	 * @example
	 *
	 * _.max([4, 2, 8, 6]);
	 * // => 8
	 *
	 * _.max([]);
	 * // => undefined
	 */
	function max(array) {
	  return (array && array.length)
	    ? _baseExtremum(array, identity_1, _baseGt)
	    : undefined;
	}

	var max_1 = max;

	/**
	 * This function is like `assignValue` except that it doesn't assign
	 * `undefined` values.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignMergeValue(object, key, value) {
	  if ((value !== undefined && !eq_1(object[key], value)) ||
	      (value === undefined && !(key in object))) {
	    _baseAssignValue(object, key, value);
	  }
	}

	var _assignMergeValue = assignMergeValue;

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = _getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}

	var isPlainObject_1 = isPlainObject;

	/**
	 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function safeGet(object, key) {
	  if (key === 'constructor' && typeof object[key] === 'function') {
	    return;
	  }

	  if (key == '__proto__') {
	    return;
	  }

	  return object[key];
	}

	var _safeGet = safeGet;

	/**
	 * Converts `value` to a plain object flattening inherited enumerable string
	 * keyed properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return _copyObject(value, keysIn_1(value));
	}

	var toPlainObject_1 = toPlainObject;

	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	  var objValue = _safeGet(object, key),
	      srcValue = _safeGet(source, key),
	      stacked = stack.get(srcValue);

	  if (stacked) {
	    _assignMergeValue(object, key, stacked);
	    return;
	  }
	  var newValue = customizer
	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	    : undefined;

	  var isCommon = newValue === undefined;

	  if (isCommon) {
	    var isArr = isArray_1(srcValue),
	        isBuff = !isArr && isBuffer_1(srcValue),
	        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

	    newValue = srcValue;
	    if (isArr || isBuff || isTyped) {
	      if (isArray_1(objValue)) {
	        newValue = objValue;
	      }
	      else if (isArrayLikeObject_1(objValue)) {
	        newValue = _copyArray(objValue);
	      }
	      else if (isBuff) {
	        isCommon = false;
	        newValue = _cloneBuffer(srcValue, true);
	      }
	      else if (isTyped) {
	        isCommon = false;
	        newValue = _cloneTypedArray(srcValue, true);
	      }
	      else {
	        newValue = [];
	      }
	    }
	    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
	      newValue = objValue;
	      if (isArguments_1(objValue)) {
	        newValue = toPlainObject_1(objValue);
	      }
	      else if (!isObject_1(objValue) || isFunction_1(objValue)) {
	        newValue = _initCloneObject(srcValue);
	      }
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    stack.set(srcValue, newValue);
	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	    stack['delete'](srcValue);
	  }
	  _assignMergeValue(object, key, newValue);
	}

	var _baseMergeDeep = baseMergeDeep;

	/**
	 * The base implementation of `_.merge` without support for multiple sources.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMerge(object, source, srcIndex, customizer, stack) {
	  if (object === source) {
	    return;
	  }
	  _baseFor(source, function(srcValue, key) {
	    stack || (stack = new _Stack);
	    if (isObject_1(srcValue)) {
	      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	    }
	    else {
	      var newValue = customizer
	        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
	        : undefined;

	      if (newValue === undefined) {
	        newValue = srcValue;
	      }
	      _assignMergeValue(object, key, newValue);
	    }
	  }, keysIn_1);
	}

	var _baseMerge = baseMerge;

	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return _baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;

	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;

	    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}

	var _createAssigner = createAssigner;

	/**
	 * This method is like `_.assign` except that it recursively merges own and
	 * inherited enumerable string keyed properties of source objects into the
	 * destination object. Source properties that resolve to `undefined` are
	 * skipped if a destination value exists. Array and plain object properties
	 * are merged recursively. Other objects and value types are overridden by
	 * assignment. Source objects are applied from left to right. Subsequent
	 * sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.5.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var object = {
	 *   'a': [{ 'b': 2 }, { 'd': 4 }]
	 * };
	 *
	 * var other = {
	 *   'a': [{ 'c': 3 }, { 'e': 5 }]
	 * };
	 *
	 * _.merge(object, other);
	 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
	 */
	var merge = _createAssigner(function(object, source, srcIndex) {
	  _baseMerge(object, source, srcIndex);
	});

	var merge_1 = merge;

	/**
	 * The base implementation of `_.lt` which doesn't coerce arguments.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if `value` is less than `other`,
	 *  else `false`.
	 */
	function baseLt(value, other) {
	  return value < other;
	}

	var _baseLt = baseLt;

	/**
	 * Computes the minimum value of `array`. If `array` is empty or falsey,
	 * `undefined` is returned.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Math
	 * @param {Array} array The array to iterate over.
	 * @returns {*} Returns the minimum value.
	 * @example
	 *
	 * _.min([4, 2, 8, 6]);
	 * // => 2
	 *
	 * _.min([]);
	 * // => undefined
	 */
	function min(array) {
	  return (array && array.length)
	    ? _baseExtremum(array, identity_1, _baseLt)
	    : undefined;
	}

	var min_1 = min;

	/**
	 * This method is like `_.min` except that it accepts `iteratee` which is
	 * invoked for each element in `array` to generate the criterion by which
	 * the value is ranked. The iteratee is invoked with one argument: (value).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Math
	 * @param {Array} array The array to iterate over.
	 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
	 * @returns {*} Returns the minimum value.
	 * @example
	 *
	 * var objects = [{ 'n': 1 }, { 'n': 2 }];
	 *
	 * _.minBy(objects, function(o) { return o.n; });
	 * // => { 'n': 1 }
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.minBy(objects, 'n');
	 * // => { 'n': 1 }
	 */
	function minBy(array, iteratee) {
	  return (array && array.length)
	    ? _baseExtremum(array, _baseIteratee(iteratee), _baseLt)
	    : undefined;
	}

	var minBy_1 = minBy;

	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => Logs the number of milliseconds it took for the deferred invocation.
	 */
	var now = function() {
	  return _root.Date.now();
	};

	var now_1 = now;

	/**
	 * The base implementation of `_.set`.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {Array|string} path The path of the property to set.
	 * @param {*} value The value to set.
	 * @param {Function} [customizer] The function to customize path creation.
	 * @returns {Object} Returns `object`.
	 */
	function baseSet(object, path, value, customizer) {
	  if (!isObject_1(object)) {
	    return object;
	  }
	  path = _castPath(path, object);

	  var index = -1,
	      length = path.length,
	      lastIndex = length - 1,
	      nested = object;

	  while (nested != null && ++index < length) {
	    var key = _toKey(path[index]),
	        newValue = value;

	    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
	      return object;
	    }

	    if (index != lastIndex) {
	      var objValue = nested[key];
	      newValue = customizer ? customizer(objValue, key, nested) : undefined;
	      if (newValue === undefined) {
	        newValue = isObject_1(objValue)
	          ? objValue
	          : (_isIndex(path[index + 1]) ? [] : {});
	      }
	    }
	    _assignValue(nested, key, newValue);
	    nested = nested[key];
	  }
	  return object;
	}

	var _baseSet = baseSet;

	/**
	 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} paths The property paths to pick.
	 * @param {Function} predicate The function invoked per property.
	 * @returns {Object} Returns the new object.
	 */
	function basePickBy(object, paths, predicate) {
	  var index = -1,
	      length = paths.length,
	      result = {};

	  while (++index < length) {
	    var path = paths[index],
	        value = _baseGet(object, path);

	    if (predicate(value, path)) {
	      _baseSet(result, _castPath(path, object), value);
	    }
	  }
	  return result;
	}

	var _basePickBy = basePickBy;

	/**
	 * The base implementation of `_.pick` without support for individual
	 * property identifiers.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} paths The property paths to pick.
	 * @returns {Object} Returns the new object.
	 */
	function basePick(object, paths) {
	  return _basePickBy(object, paths, function(value, path) {
	    return hasIn_1(object, path);
	  });
	}

	var _basePick = basePick;

	/**
	 * A specialized version of `baseRest` which flattens the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @returns {Function} Returns the new function.
	 */
	function flatRest(func) {
	  return _setToString(_overRest(func, undefined, flatten_1), func + '');
	}

	var _flatRest = flatRest;

	/**
	 * Creates an object composed of the picked `object` properties.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The source object.
	 * @param {...(string|string[])} [paths] The property paths to pick.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.pick(object, ['a', 'c']);
	 * // => { 'a': 1, 'c': 3 }
	 */
	var pick = _flatRest(function(object, paths) {
	  return object == null ? {} : _basePick(object, paths);
	});

	var pick_1 = pick;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeCeil = Math.ceil,
	    nativeMax = Math.max;

	/**
	 * The base implementation of `_.range` and `_.rangeRight` which doesn't
	 * coerce arguments.
	 *
	 * @private
	 * @param {number} start The start of the range.
	 * @param {number} end The end of the range.
	 * @param {number} step The value to increment or decrement by.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Array} Returns the range of numbers.
	 */
	function baseRange(start, end, step, fromRight) {
	  var index = -1,
	      length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
	      result = Array(length);

	  while (length--) {
	    result[fromRight ? length : ++index] = start;
	    start += step;
	  }
	  return result;
	}

	var _baseRange = baseRange;

	/**
	 * Creates a `_.range` or `_.rangeRight` function.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new range function.
	 */
	function createRange(fromRight) {
	  return function(start, end, step) {
	    if (step && typeof step != 'number' && _isIterateeCall(start, end, step)) {
	      end = step = undefined;
	    }
	    // Ensure the sign of `-0` is preserved.
	    start = toFinite_1(start);
	    if (end === undefined) {
	      end = start;
	      start = 0;
	    } else {
	      end = toFinite_1(end);
	    }
	    step = step === undefined ? (start < end ? 1 : -1) : toFinite_1(step);
	    return _baseRange(start, end, step, fromRight);
	  };
	}

	var _createRange = createRange;

	/**
	 * Creates an array of numbers (positive and/or negative) progressing from
	 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
	 * `start` is specified without an `end` or `step`. If `end` is not specified,
	 * it's set to `start` with `start` then set to `0`.
	 *
	 * **Note:** JavaScript follows the IEEE-754 standard for resolving
	 * floating-point values which can produce unexpected results.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {number} [start=0] The start of the range.
	 * @param {number} end The end of the range.
	 * @param {number} [step=1] The value to increment or decrement by.
	 * @returns {Array} Returns the range of numbers.
	 * @see _.inRange, _.rangeRight
	 * @example
	 *
	 * _.range(4);
	 * // => [0, 1, 2, 3]
	 *
	 * _.range(-4);
	 * // => [0, -1, -2, -3]
	 *
	 * _.range(1, 5);
	 * // => [1, 2, 3, 4]
	 *
	 * _.range(0, 20, 5);
	 * // => [0, 5, 10, 15]
	 *
	 * _.range(0, -4, -1);
	 * // => [0, -1, -2, -3]
	 *
	 * _.range(1, 4, 0);
	 * // => [1, 1, 1]
	 *
	 * _.range(0);
	 * // => []
	 */
	var range = _createRange();

	var range_1 = range;

	/**
	 * The base implementation of `_.sortBy` which uses `comparer` to define the
	 * sort order of `array` and replaces criteria objects with their corresponding
	 * values.
	 *
	 * @private
	 * @param {Array} array The array to sort.
	 * @param {Function} comparer The function to define sort order.
	 * @returns {Array} Returns `array`.
	 */
	function baseSortBy(array, comparer) {
	  var length = array.length;

	  array.sort(comparer);
	  while (length--) {
	    array[length] = array[length].value;
	  }
	  return array;
	}

	var _baseSortBy = baseSortBy;

	/**
	 * Compares values to sort them in ascending order.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {number} Returns the sort order indicator for `value`.
	 */
	function compareAscending(value, other) {
	  if (value !== other) {
	    var valIsDefined = value !== undefined,
	        valIsNull = value === null,
	        valIsReflexive = value === value,
	        valIsSymbol = isSymbol_1(value);

	    var othIsDefined = other !== undefined,
	        othIsNull = other === null,
	        othIsReflexive = other === other,
	        othIsSymbol = isSymbol_1(other);

	    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
	        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
	        (valIsNull && othIsDefined && othIsReflexive) ||
	        (!valIsDefined && othIsReflexive) ||
	        !valIsReflexive) {
	      return 1;
	    }
	    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
	        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
	        (othIsNull && valIsDefined && valIsReflexive) ||
	        (!othIsDefined && valIsReflexive) ||
	        !othIsReflexive) {
	      return -1;
	    }
	  }
	  return 0;
	}

	var _compareAscending = compareAscending;

	/**
	 * Used by `_.orderBy` to compare multiple properties of a value to another
	 * and stable sort them.
	 *
	 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
	 * specify an order of "desc" for descending or "asc" for ascending sort order
	 * of corresponding values.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {boolean[]|string[]} orders The order to sort by for each property.
	 * @returns {number} Returns the sort order indicator for `object`.
	 */
	function compareMultiple(object, other, orders) {
	  var index = -1,
	      objCriteria = object.criteria,
	      othCriteria = other.criteria,
	      length = objCriteria.length,
	      ordersLength = orders.length;

	  while (++index < length) {
	    var result = _compareAscending(objCriteria[index], othCriteria[index]);
	    if (result) {
	      if (index >= ordersLength) {
	        return result;
	      }
	      var order = orders[index];
	      return result * (order == 'desc' ? -1 : 1);
	    }
	  }
	  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
	  // that causes it, under certain circumstances, to provide the same value for
	  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
	  // for more details.
	  //
	  // This also ensures a stable sort in V8 and other engines.
	  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
	  return object.index - other.index;
	}

	var _compareMultiple = compareMultiple;

	/**
	 * The base implementation of `_.orderBy` without param guards.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
	 * @param {string[]} orders The sort orders of `iteratees`.
	 * @returns {Array} Returns the new sorted array.
	 */
	function baseOrderBy(collection, iteratees, orders) {
	  if (iteratees.length) {
	    iteratees = _arrayMap(iteratees, function(iteratee) {
	      if (isArray_1(iteratee)) {
	        return function(value) {
	          return _baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
	        }
	      }
	      return iteratee;
	    });
	  } else {
	    iteratees = [identity_1];
	  }

	  var index = -1;
	  iteratees = _arrayMap(iteratees, _baseUnary(_baseIteratee));

	  var result = _baseMap(collection, function(value, key, collection) {
	    var criteria = _arrayMap(iteratees, function(iteratee) {
	      return iteratee(value);
	    });
	    return { 'criteria': criteria, 'index': ++index, 'value': value };
	  });

	  return _baseSortBy(result, function(object, other) {
	    return _compareMultiple(object, other, orders);
	  });
	}

	var _baseOrderBy = baseOrderBy;

	/**
	 * Creates an array of elements, sorted in ascending order by the results of
	 * running each element in a collection thru each iteratee. This method
	 * performs a stable sort, that is, it preserves the original sort order of
	 * equal elements. The iteratees are invoked with one argument: (value).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {...(Function|Function[])} [iteratees=[_.identity]]
	 *  The iteratees to sort by.
	 * @returns {Array} Returns the new sorted array.
	 * @example
	 *
	 * var users = [
	 *   { 'user': 'fred',   'age': 48 },
	 *   { 'user': 'barney', 'age': 36 },
	 *   { 'user': 'fred',   'age': 30 },
	 *   { 'user': 'barney', 'age': 34 }
	 * ];
	 *
	 * _.sortBy(users, [function(o) { return o.user; }]);
	 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
	 *
	 * _.sortBy(users, ['user', 'age']);
	 * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
	 */
	var sortBy = _baseRest(function(collection, iteratees) {
	  if (collection == null) {
	    return [];
	  }
	  var length = iteratees.length;
	  if (length > 1 && _isIterateeCall(collection, iteratees[0], iteratees[1])) {
	    iteratees = [];
	  } else if (length > 2 && _isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
	    iteratees = [iteratees[0]];
	  }
	  return _baseOrderBy(collection, _baseFlatten(iteratees, 1), []);
	});

	var sortBy_1 = sortBy;

	/** Used to generate unique IDs. */
	var idCounter = 0;

	/**
	 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {string} [prefix=''] The value to prefix the ID with.
	 * @returns {string} Returns the unique ID.
	 * @example
	 *
	 * _.uniqueId('contact_');
	 * // => 'contact_104'
	 *
	 * _.uniqueId();
	 * // => '105'
	 */
	function uniqueId(prefix) {
	  var id = ++idCounter;
	  return toString_1(prefix) + id;
	}

	var uniqueId_1 = uniqueId;

	/**
	 * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
	 *
	 * @private
	 * @param {Array} props The property identifiers.
	 * @param {Array} values The property values.
	 * @param {Function} assignFunc The function to assign values.
	 * @returns {Object} Returns the new object.
	 */
	function baseZipObject(props, values, assignFunc) {
	  var index = -1,
	      length = props.length,
	      valsLength = values.length,
	      result = {};

	  while (++index < length) {
	    var value = index < valsLength ? values[index] : undefined;
	    assignFunc(result, props[index], value);
	  }
	  return result;
	}

	var _baseZipObject = baseZipObject;

	/**
	 * This method is like `_.fromPairs` except that it accepts two arrays,
	 * one of property identifiers and one of corresponding values.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.4.0
	 * @category Array
	 * @param {Array} [props=[]] The property identifiers.
	 * @param {Array} [values=[]] The property values.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * _.zipObject(['a', 'b'], [1, 2]);
	 * // => { 'a': 1, 'b': 2 }
	 */
	function zipObject(props, values) {
	  return _baseZipObject(props || [], values || [], _assignValue);
	}

	var zipObject_1 = zipObject;

	/* global window */

	var lodash;

	if (typeof commonjsRequire === "function") {
	  try {
	    lodash = {
	      cloneDeep: cloneDeep_1,
	      constant: constant_1,
	      defaults: defaults_1,
	      each: each,
	      filter: filter_1,
	      find: find_1,
	      flatten: flatten_1,
	      forEach: forEach_1,
	      forIn: forIn_1,
	      has:  has_1,
	      isUndefined: isUndefined_1,
	      last: last_1,
	      map: map_1,
	      mapValues: mapValues_1,
	      max: max_1,
	      merge: merge_1,
	      min: min_1,
	      minBy: minBy_1,
	      now: now_1,
	      pick: pick_1,
	      range: range_1,
	      reduce: reduce_1,
	      sortBy: sortBy_1,
	      uniqueId: uniqueId_1,
	      values: values_1,
	      zipObject: zipObject_1,
	    };
	  } catch (e) {
	    // continue regardless of error
	  }
	}

	if (!lodash) {
	  lodash = window._;
	}

	var lodash_1 = lodash;

	/*
	 * Simple doubly linked list implementation derived from Cormen, et al.,
	 * "Introduction to Algorithms".
	 */

	var list = List;

	function List() {
	  var sentinel = {};
	  sentinel._next = sentinel._prev = sentinel;
	  this._sentinel = sentinel;
	}

	List.prototype.dequeue = function() {
	  var sentinel = this._sentinel;
	  var entry = sentinel._prev;
	  if (entry !== sentinel) {
	    unlink(entry);
	    return entry;
	  }
	};

	List.prototype.enqueue = function(entry) {
	  var sentinel = this._sentinel;
	  if (entry._prev && entry._next) {
	    unlink(entry);
	  }
	  entry._next = sentinel._next;
	  sentinel._next._prev = entry;
	  sentinel._next = entry;
	  entry._prev = sentinel;
	};

	List.prototype.toString = function() {
	  var strs = [];
	  var sentinel = this._sentinel;
	  var curr = sentinel._prev;
	  while (curr !== sentinel) {
	    strs.push(JSON.stringify(curr, filterOutLinks));
	    curr = curr._prev;
	  }
	  return "[" + strs.join(", ") + "]";
	};

	function unlink(entry) {
	  entry._prev._next = entry._next;
	  entry._next._prev = entry._prev;
	  delete entry._next;
	  delete entry._prev;
	}

	function filterOutLinks(k, v) {
	  if (k !== "_next" && k !== "_prev") {
	    return v;
	  }
	}

	var Graph$7 = graphlib_1.Graph;


	/*
	 * A greedy heuristic for finding a feedback arc set for a graph. A feedback
	 * arc set is a set of edges that can be removed to make a graph acyclic.
	 * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
	 * effective heuristic for the feedback arc set problem." This implementation
	 * adjusts that from the paper to allow for weighted edges.
	 */
	var greedyFas = greedyFAS;

	var DEFAULT_WEIGHT_FN = lodash_1.constant(1);

	function greedyFAS(g, weightFn) {
	  if (g.nodeCount() <= 1) {
	    return [];
	  }
	  var state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
	  var results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);

	  // Expand multi-edges
	  return lodash_1.flatten(lodash_1.map(results, function(e) {
	    return g.outEdges(e.v, e.w);
	  }), true);
	}

	function doGreedyFAS(g, buckets, zeroIdx) {
	  var results = [];
	  var sources = buckets[buckets.length - 1];
	  var sinks = buckets[0];

	  var entry;
	  while (g.nodeCount()) {
	    while ((entry = sinks.dequeue()))   { removeNode(g, buckets, zeroIdx, entry); }
	    while ((entry = sources.dequeue())) { removeNode(g, buckets, zeroIdx, entry); }
	    if (g.nodeCount()) {
	      for (var i = buckets.length - 2; i > 0; --i) {
	        entry = buckets[i].dequeue();
	        if (entry) {
	          results = results.concat(removeNode(g, buckets, zeroIdx, entry, true));
	          break;
	        }
	      }
	    }
	  }

	  return results;
	}

	function removeNode(g, buckets, zeroIdx, entry, collectPredecessors) {
	  var results = collectPredecessors ? [] : undefined;

	  lodash_1.forEach(g.inEdges(entry.v), function(edge) {
	    var weight = g.edge(edge);
	    var uEntry = g.node(edge.v);

	    if (collectPredecessors) {
	      results.push({ v: edge.v, w: edge.w });
	    }

	    uEntry.out -= weight;
	    assignBucket(buckets, zeroIdx, uEntry);
	  });

	  lodash_1.forEach(g.outEdges(entry.v), function(edge) {
	    var weight = g.edge(edge);
	    var w = edge.w;
	    var wEntry = g.node(w);
	    wEntry["in"] -= weight;
	    assignBucket(buckets, zeroIdx, wEntry);
	  });

	  g.removeNode(entry.v);

	  return results;
	}

	function buildState(g, weightFn) {
	  var fasGraph = new Graph$7();
	  var maxIn = 0;
	  var maxOut = 0;

	  lodash_1.forEach(g.nodes(), function(v) {
	    fasGraph.setNode(v, { v: v, "in": 0, out: 0 });
	  });

	  // Aggregate weights on nodes, but also sum the weights across multi-edges
	  // into a single edge for the fasGraph.
	  lodash_1.forEach(g.edges(), function(e) {
	    var prevWeight = fasGraph.edge(e.v, e.w) || 0;
	    var weight = weightFn(e);
	    var edgeWeight = prevWeight + weight;
	    fasGraph.setEdge(e.v, e.w, edgeWeight);
	    maxOut = Math.max(maxOut, fasGraph.node(e.v).out += weight);
	    maxIn  = Math.max(maxIn,  fasGraph.node(e.w)["in"]  += weight);
	  });

	  var buckets = lodash_1.range(maxOut + maxIn + 3).map(function() { return new list(); });
	  var zeroIdx = maxIn + 1;

	  lodash_1.forEach(fasGraph.nodes(), function(v) {
	    assignBucket(buckets, zeroIdx, fasGraph.node(v));
	  });

	  return { graph: fasGraph, buckets: buckets, zeroIdx: zeroIdx };
	}

	function assignBucket(buckets, zeroIdx, entry) {
	  if (!entry.out) {
	    buckets[0].enqueue(entry);
	  } else if (!entry["in"]) {
	    buckets[buckets.length - 1].enqueue(entry);
	  } else {
	    buckets[entry.out - entry["in"] + zeroIdx].enqueue(entry);
	  }
	}

	var acyclic = {
	  run: run$2,
	  undo: undo$2
	};

	function run$2(g) {
	  var fas = (g.graph().acyclicer === "greedy"
	    ? greedyFas(g, weightFn(g))
	    : dfsFAS(g));
	  lodash_1.forEach(fas, function(e) {
	    var label = g.edge(e);
	    g.removeEdge(e);
	    label.forwardName = e.name;
	    label.reversed = true;
	    g.setEdge(e.w, e.v, label, lodash_1.uniqueId("rev"));
	  });

	  function weightFn(g) {
	    return function(e) {
	      return g.edge(e).weight;
	    };
	  }
	}

	function dfsFAS(g) {
	  var fas = [];
	  var stack = {};
	  var visited = {};

	  function dfs(v) {
	    if (lodash_1.has(visited, v)) {
	      return;
	    }
	    visited[v] = true;
	    stack[v] = true;
	    lodash_1.forEach(g.outEdges(v), function(e) {
	      if (lodash_1.has(stack, e.w)) {
	        fas.push(e);
	      } else {
	        dfs(e.w);
	      }
	    });
	    delete stack[v];
	  }

	  lodash_1.forEach(g.nodes(), dfs);
	  return fas;
	}

	function undo$2(g) {
	  lodash_1.forEach(g.edges(), function(e) {
	    var label = g.edge(e);
	    if (label.reversed) {
	      g.removeEdge(e);

	      var forwardName = label.forwardName;
	      delete label.reversed;
	      delete label.forwardName;
	      g.setEdge(e.w, e.v, label, forwardName);
	    }
	  });
	}

	var Graph$6 = graphlib_1.Graph;

	var util$2 = {
	  addDummyNode: addDummyNode,
	  simplify: simplify$1,
	  asNonCompoundGraph: asNonCompoundGraph,
	  successorWeights: successorWeights,
	  predecessorWeights: predecessorWeights,
	  intersectRect: intersectRect,
	  buildLayerMatrix: buildLayerMatrix,
	  normalizeRanks: normalizeRanks$1,
	  removeEmptyRanks: removeEmptyRanks$1,
	  addBorderNode: addBorderNode$1,
	  maxRank: maxRank,
	  partition: partition,
	  time: time,
	  notime: notime
	};

	/*
	 * Adds a dummy node to the graph and return v.
	 */
	function addDummyNode(g, type, attrs, name) {
	  var v;
	  do {
	    v = lodash_1.uniqueId(name);
	  } while (g.hasNode(v));

	  attrs.dummy = type;
	  g.setNode(v, attrs);
	  return v;
	}

	/*
	 * Returns a new graph with only simple edges. Handles aggregation of data
	 * associated with multi-edges.
	 */
	function simplify$1(g) {
	  var simplified = new Graph$6().setGraph(g.graph());
	  lodash_1.forEach(g.nodes(), function(v) { simplified.setNode(v, g.node(v)); });
	  lodash_1.forEach(g.edges(), function(e) {
	    var simpleLabel = simplified.edge(e.v, e.w) || { weight: 0, minlen: 1 };
	    var label = g.edge(e);
	    simplified.setEdge(e.v, e.w, {
	      weight: simpleLabel.weight + label.weight,
	      minlen: Math.max(simpleLabel.minlen, label.minlen)
	    });
	  });
	  return simplified;
	}

	function asNonCompoundGraph(g) {
	  var simplified = new Graph$6({ multigraph: g.isMultigraph() }).setGraph(g.graph());
	  lodash_1.forEach(g.nodes(), function(v) {
	    if (!g.children(v).length) {
	      simplified.setNode(v, g.node(v));
	    }
	  });
	  lodash_1.forEach(g.edges(), function(e) {
	    simplified.setEdge(e, g.edge(e));
	  });
	  return simplified;
	}

	function successorWeights(g) {
	  var weightMap = lodash_1.map(g.nodes(), function(v) {
	    var sucs = {};
	    lodash_1.forEach(g.outEdges(v), function(e) {
	      sucs[e.w] = (sucs[e.w] || 0) + g.edge(e).weight;
	    });
	    return sucs;
	  });
	  return lodash_1.zipObject(g.nodes(), weightMap);
	}

	function predecessorWeights(g) {
	  var weightMap = lodash_1.map(g.nodes(), function(v) {
	    var preds = {};
	    lodash_1.forEach(g.inEdges(v), function(e) {
	      preds[e.v] = (preds[e.v] || 0) + g.edge(e).weight;
	    });
	    return preds;
	  });
	  return lodash_1.zipObject(g.nodes(), weightMap);
	}

	/*
	 * Finds where a line starting at point ({x, y}) would intersect a rectangle
	 * ({x, y, width, height}) if it were pointing at the rectangle's center.
	 */
	function intersectRect(rect, point) {
	  var x = rect.x;
	  var y = rect.y;

	  // Rectangle intersection algorithm from:
	  // http://math.stackexchange.com/questions/108113/find-edge-between-two-boxes
	  var dx = point.x - x;
	  var dy = point.y - y;
	  var w = rect.width / 2;
	  var h = rect.height / 2;

	  if (!dx && !dy) {
	    throw new Error("Not possible to find intersection inside of the rectangle");
	  }

	  var sx, sy;
	  if (Math.abs(dy) * w > Math.abs(dx) * h) {
	    // Intersection is top or bottom of rect.
	    if (dy < 0) {
	      h = -h;
	    }
	    sx = h * dx / dy;
	    sy = h;
	  } else {
	    // Intersection is left or right of rect.
	    if (dx < 0) {
	      w = -w;
	    }
	    sx = w;
	    sy = w * dy / dx;
	  }

	  return { x: x + sx, y: y + sy };
	}

	/*
	 * Given a DAG with each node assigned "rank" and "order" properties, this
	 * function will produce a matrix with the ids of each node.
	 */
	function buildLayerMatrix(g) {
	  var layering = lodash_1.map(lodash_1.range(maxRank(g) + 1), function() { return []; });
	  lodash_1.forEach(g.nodes(), function(v) {
	    var node = g.node(v);
	    var rank = node.rank;
	    if (!lodash_1.isUndefined(rank)) {
	      layering[rank][node.order] = v;
	    }
	  });
	  return layering;
	}

	/*
	 * Adjusts the ranks for all nodes in the graph such that all nodes v have
	 * rank(v) >= 0 and at least one node w has rank(w) = 0.
	 */
	function normalizeRanks$1(g) {
	  var min = lodash_1.min(lodash_1.map(g.nodes(), function(v) { return g.node(v).rank; }));
	  lodash_1.forEach(g.nodes(), function(v) {
	    var node = g.node(v);
	    if (lodash_1.has(node, "rank")) {
	      node.rank -= min;
	    }
	  });
	}

	function removeEmptyRanks$1(g) {
	  // Ranks may not start at 0, so we need to offset them
	  var offset = lodash_1.min(lodash_1.map(g.nodes(), function(v) { return g.node(v).rank; }));

	  var layers = [];
	  lodash_1.forEach(g.nodes(), function(v) {
	    var rank = g.node(v).rank - offset;
	    if (!layers[rank]) {
	      layers[rank] = [];
	    }
	    layers[rank].push(v);
	  });

	  var delta = 0;
	  var nodeRankFactor = g.graph().nodeRankFactor;
	  lodash_1.forEach(layers, function(vs, i) {
	    if (lodash_1.isUndefined(vs) && i % nodeRankFactor !== 0) {
	      --delta;
	    } else if (delta) {
	      lodash_1.forEach(vs, function(v) { g.node(v).rank += delta; });
	    }
	  });
	}

	function addBorderNode$1(g, prefix, rank, order) {
	  var node = {
	    width: 0,
	    height: 0
	  };
	  if (arguments.length >= 4) {
	    node.rank = rank;
	    node.order = order;
	  }
	  return addDummyNode(g, "border", node, prefix);
	}

	function maxRank(g) {
	  return lodash_1.max(lodash_1.map(g.nodes(), function(v) {
	    var rank = g.node(v).rank;
	    if (!lodash_1.isUndefined(rank)) {
	      return rank;
	    }
	  }));
	}

	/*
	 * Partition a collection into two groups: `lhs` and `rhs`. If the supplied
	 * function returns true for an entry it goes into `lhs`. Otherwise it goes
	 * into `rhs.
	 */
	function partition(collection, fn) {
	  var result = { lhs: [], rhs: [] };
	  lodash_1.forEach(collection, function(value) {
	    if (fn(value)) {
	      result.lhs.push(value);
	    } else {
	      result.rhs.push(value);
	    }
	  });
	  return result;
	}

	/*
	 * Returns a new function that wraps `fn` with a timer. The wrapper logs the
	 * time it takes to execute the function.
	 */
	function time(name, fn) {
	  var start = lodash_1.now();
	  try {
	    return fn();
	  } finally {
	    console.log(name + " time: " + (lodash_1.now() - start) + "ms");
	  }
	}

	function notime(name, fn) {
	  return fn();
	}

	var normalize = {
	  run: run$1,
	  undo: undo$1
	};

	/*
	 * Breaks any long edges in the graph into short segments that span 1 layer
	 * each. This operation is undoable with the denormalize function.
	 *
	 * Pre-conditions:
	 *
	 *    1. The input graph is a DAG.
	 *    2. Each node in the graph has a "rank" property.
	 *
	 * Post-condition:
	 *
	 *    1. All edges in the graph have a length of 1.
	 *    2. Dummy nodes are added where edges have been split into segments.
	 *    3. The graph is augmented with a "dummyChains" attribute which contains
	 *       the first dummy in each chain of dummy nodes produced.
	 */
	function run$1(g) {
	  g.graph().dummyChains = [];
	  lodash_1.forEach(g.edges(), function(edge) { normalizeEdge(g, edge); });
	}

	function normalizeEdge(g, e) {
	  var v = e.v;
	  var vRank = g.node(v).rank;
	  var w = e.w;
	  var wRank = g.node(w).rank;
	  var name = e.name;
	  var edgeLabel = g.edge(e);
	  var labelRank = edgeLabel.labelRank;

	  if (wRank === vRank + 1) return;

	  g.removeEdge(e);

	  var dummy, attrs, i;
	  for (i = 0, ++vRank; vRank < wRank; ++i, ++vRank) {
	    edgeLabel.points = [];
	    attrs = {
	      width: 0, height: 0,
	      edgeLabel: edgeLabel, edgeObj: e,
	      rank: vRank
	    };
	    dummy = util$2.addDummyNode(g, "edge", attrs, "_d");
	    if (vRank === labelRank) {
	      attrs.width = edgeLabel.width;
	      attrs.height = edgeLabel.height;
	      attrs.dummy = "edge-label";
	      attrs.labelpos = edgeLabel.labelpos;
	    }
	    g.setEdge(v, dummy, { weight: edgeLabel.weight }, name);
	    if (i === 0) {
	      g.graph().dummyChains.push(dummy);
	    }
	    v = dummy;
	  }

	  g.setEdge(v, w, { weight: edgeLabel.weight }, name);
	}

	function undo$1(g) {
	  lodash_1.forEach(g.graph().dummyChains, function(v) {
	    var node = g.node(v);
	    var origLabel = node.edgeLabel;
	    var w;
	    g.setEdge(node.edgeObj, origLabel);
	    while (node.dummy) {
	      w = g.successors(v)[0];
	      g.removeNode(v);
	      origLabel.points.push({ x: node.x, y: node.y });
	      if (node.dummy === "edge-label") {
	        origLabel.x = node.x;
	        origLabel.y = node.y;
	        origLabel.width = node.width;
	        origLabel.height = node.height;
	      }
	      v = w;
	      node = g.node(v);
	    }
	  });
	}

	var util$1 = {
	  longestPath: longestPath$1,
	  slack: slack$2
	};

	/*
	 * Initializes ranks for the input graph using the longest path algorithm. This
	 * algorithm scales well and is fast in practice, it yields rather poor
	 * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
	 * ranks wide and leaving edges longer than necessary. However, due to its
	 * speed, this algorithm is good for getting an initial ranking that can be fed
	 * into other algorithms.
	 *
	 * This algorithm does not normalize layers because it will be used by other
	 * algorithms in most cases. If using this algorithm directly, be sure to
	 * run normalize at the end.
	 *
	 * Pre-conditions:
	 *
	 *    1. Input graph is a DAG.
	 *    2. Input graph node labels can be assigned properties.
	 *
	 * Post-conditions:
	 *
	 *    1. Each node will be assign an (unnormalized) "rank" property.
	 */
	function longestPath$1(g) {
	  var visited = {};

	  function dfs(v) {
	    var label = g.node(v);
	    if (lodash_1.has(visited, v)) {
	      return label.rank;
	    }
	    visited[v] = true;

	    var rank = lodash_1.min(lodash_1.map(g.outEdges(v), function(e) {
	      return dfs(e.w) - g.edge(e).minlen;
	    }));

	    if (rank === Number.POSITIVE_INFINITY || // return value of _.map([]) for Lodash 3
	        rank === undefined || // return value of _.map([]) for Lodash 4
	        rank === null) { // return value of _.map([null])
	      rank = 0;
	    }

	    return (label.rank = rank);
	  }

	  lodash_1.forEach(g.sources(), dfs);
	}

	/*
	 * Returns the amount of slack for the given edge. The slack is defined as the
	 * difference between the length of the edge and its minimum length.
	 */
	function slack$2(g, e) {
	  return g.node(e.w).rank - g.node(e.v).rank - g.edge(e).minlen;
	}

	var Graph$5 = graphlib_1.Graph;
	var slack$1 = util$1.slack;

	var feasibleTree_1 = feasibleTree;

	/*
	 * Constructs a spanning tree with tight edges and adjusted the input node's
	 * ranks to achieve this. A tight edge is one that is has a length that matches
	 * its "minlen" attribute.
	 *
	 * The basic structure for this function is derived from Gansner, et al., "A
	 * Technique for Drawing Directed Graphs."
	 *
	 * Pre-conditions:
	 *
	 *    1. Graph must be a DAG.
	 *    2. Graph must be connected.
	 *    3. Graph must have at least one node.
	 *    5. Graph nodes must have been previously assigned a "rank" property that
	 *       respects the "minlen" property of incident edges.
	 *    6. Graph edges must have a "minlen" property.
	 *
	 * Post-conditions:
	 *
	 *    - Graph nodes will have their rank adjusted to ensure that all edges are
	 *      tight.
	 *
	 * Returns a tree (undirected graph) that is constructed using only "tight"
	 * edges.
	 */
	function feasibleTree(g) {
	  var t = new Graph$5({ directed: false });

	  // Choose arbitrary node from which to start our tree
	  var start = g.nodes()[0];
	  var size = g.nodeCount();
	  t.setNode(start, {});

	  var edge, delta;
	  while (tightTree(t, g) < size) {
	    edge = findMinSlackEdge(t, g);
	    delta = t.hasNode(edge.v) ? slack$1(g, edge) : -slack$1(g, edge);
	    shiftRanks(t, g, delta);
	  }

	  return t;
	}

	/*
	 * Finds a maximal tree of tight edges and returns the number of nodes in the
	 * tree.
	 */
	function tightTree(t, g) {
	  function dfs(v) {
	    lodash_1.forEach(g.nodeEdges(v), function(e) {
	      var edgeV = e.v,
	        w = (v === edgeV) ? e.w : edgeV;
	      if (!t.hasNode(w) && !slack$1(g, e)) {
	        t.setNode(w, {});
	        t.setEdge(v, w, {});
	        dfs(w);
	      }
	    });
	  }

	  lodash_1.forEach(t.nodes(), dfs);
	  return t.nodeCount();
	}

	/*
	 * Finds the edge with the smallest slack that is incident on tree and returns
	 * it.
	 */
	function findMinSlackEdge(t, g) {
	  return lodash_1.minBy(g.edges(), function(e) {
	    if (t.hasNode(e.v) !== t.hasNode(e.w)) {
	      return slack$1(g, e);
	    }
	  });
	}

	function shiftRanks(t, g, delta) {
	  lodash_1.forEach(t.nodes(), function(v) {
	    g.node(v).rank += delta;
	  });
	}

	var slack = util$1.slack;
	var initRank = util$1.longestPath;
	var preorder = graphlib_1.alg.preorder;
	var postorder$1 = graphlib_1.alg.postorder;
	var simplify = util$2.simplify;

	var networkSimplex_1 = networkSimplex;

	// Expose some internals for testing purposes
	networkSimplex.initLowLimValues = initLowLimValues;
	networkSimplex.initCutValues = initCutValues;
	networkSimplex.calcCutValue = calcCutValue;
	networkSimplex.leaveEdge = leaveEdge;
	networkSimplex.enterEdge = enterEdge;
	networkSimplex.exchangeEdges = exchangeEdges;

	/*
	 * The network simplex algorithm assigns ranks to each node in the input graph
	 * and iteratively improves the ranking to reduce the length of edges.
	 *
	 * Preconditions:
	 *
	 *    1. The input graph must be a DAG.
	 *    2. All nodes in the graph must have an object value.
	 *    3. All edges in the graph must have "minlen" and "weight" attributes.
	 *
	 * Postconditions:
	 *
	 *    1. All nodes in the graph will have an assigned "rank" attribute that has
	 *       been optimized by the network simplex algorithm. Ranks start at 0.
	 *
	 *
	 * A rough sketch of the algorithm is as follows:
	 *
	 *    1. Assign initial ranks to each node. We use the longest path algorithm,
	 *       which assigns ranks to the lowest position possible. In general this
	 *       leads to very wide bottom ranks and unnecessarily long edges.
	 *    2. Construct a feasible tight tree. A tight tree is one such that all
	 *       edges in the tree have no slack (difference between length of edge
	 *       and minlen for the edge). This by itself greatly improves the assigned
	 *       rankings by shorting edges.
	 *    3. Iteratively find edges that have negative cut values. Generally a
	 *       negative cut value indicates that the edge could be removed and a new
	 *       tree edge could be added to produce a more compact graph.
	 *
	 * Much of the algorithms here are derived from Gansner, et al., "A Technique
	 * for Drawing Directed Graphs." The structure of the file roughly follows the
	 * structure of the overall algorithm.
	 */
	function networkSimplex(g) {
	  g = simplify(g);
	  initRank(g);
	  var t = feasibleTree_1(g);
	  initLowLimValues(t);
	  initCutValues(t, g);

	  var e, f;
	  while ((e = leaveEdge(t))) {
	    f = enterEdge(t, g, e);
	    exchangeEdges(t, g, e, f);
	  }
	}

	/*
	 * Initializes cut values for all edges in the tree.
	 */
	function initCutValues(t, g) {
	  var vs = postorder$1(t, t.nodes());
	  vs = vs.slice(0, vs.length - 1);
	  lodash_1.forEach(vs, function(v) {
	    assignCutValue(t, g, v);
	  });
	}

	function assignCutValue(t, g, child) {
	  var childLab = t.node(child);
	  var parent = childLab.parent;
	  t.edge(child, parent).cutvalue = calcCutValue(t, g, child);
	}

	/*
	 * Given the tight tree, its graph, and a child in the graph calculate and
	 * return the cut value for the edge between the child and its parent.
	 */
	function calcCutValue(t, g, child) {
	  var childLab = t.node(child);
	  var parent = childLab.parent;
	  // True if the child is on the tail end of the edge in the directed graph
	  var childIsTail = true;
	  // The graph's view of the tree edge we're inspecting
	  var graphEdge = g.edge(child, parent);
	  // The accumulated cut value for the edge between this node and its parent
	  var cutValue = 0;

	  if (!graphEdge) {
	    childIsTail = false;
	    graphEdge = g.edge(parent, child);
	  }

	  cutValue = graphEdge.weight;

	  lodash_1.forEach(g.nodeEdges(child), function(e) {
	    var isOutEdge = e.v === child,
	      other = isOutEdge ? e.w : e.v;

	    if (other !== parent) {
	      var pointsToHead = isOutEdge === childIsTail,
	        otherWeight = g.edge(e).weight;

	      cutValue += pointsToHead ? otherWeight : -otherWeight;
	      if (isTreeEdge(t, child, other)) {
	        var otherCutValue = t.edge(child, other).cutvalue;
	        cutValue += pointsToHead ? -otherCutValue : otherCutValue;
	      }
	    }
	  });

	  return cutValue;
	}

	function initLowLimValues(tree, root) {
	  if (arguments.length < 2) {
	    root = tree.nodes()[0];
	  }
	  dfsAssignLowLim(tree, {}, 1, root);
	}

	function dfsAssignLowLim(tree, visited, nextLim, v, parent) {
	  var low = nextLim;
	  var label = tree.node(v);

	  visited[v] = true;
	  lodash_1.forEach(tree.neighbors(v), function(w) {
	    if (!lodash_1.has(visited, w)) {
	      nextLim = dfsAssignLowLim(tree, visited, nextLim, w, v);
	    }
	  });

	  label.low = low;
	  label.lim = nextLim++;
	  if (parent) {
	    label.parent = parent;
	  } else {
	    // TODO should be able to remove this when we incrementally update low lim
	    delete label.parent;
	  }

	  return nextLim;
	}

	function leaveEdge(tree) {
	  return lodash_1.find(tree.edges(), function(e) {
	    return tree.edge(e).cutvalue < 0;
	  });
	}

	function enterEdge(t, g, edge) {
	  var v = edge.v;
	  var w = edge.w;

	  // For the rest of this function we assume that v is the tail and w is the
	  // head, so if we don't have this edge in the graph we should flip it to
	  // match the correct orientation.
	  if (!g.hasEdge(v, w)) {
	    v = edge.w;
	    w = edge.v;
	  }

	  var vLabel = t.node(v);
	  var wLabel = t.node(w);
	  var tailLabel = vLabel;
	  var flip = false;

	  // If the root is in the tail of the edge then we need to flip the logic that
	  // checks for the head and tail nodes in the candidates function below.
	  if (vLabel.lim > wLabel.lim) {
	    tailLabel = wLabel;
	    flip = true;
	  }

	  var candidates = lodash_1.filter(g.edges(), function(edge) {
	    return flip === isDescendant(t, t.node(edge.v), tailLabel) &&
	           flip !== isDescendant(t, t.node(edge.w), tailLabel);
	  });

	  return lodash_1.minBy(candidates, function(edge) { return slack(g, edge); });
	}

	function exchangeEdges(t, g, e, f) {
	  var v = e.v;
	  var w = e.w;
	  t.removeEdge(v, w);
	  t.setEdge(f.v, f.w, {});
	  initLowLimValues(t);
	  initCutValues(t, g);
	  updateRanks(t, g);
	}

	function updateRanks(t, g) {
	  var root = lodash_1.find(t.nodes(), function(v) { return !g.node(v).parent; });
	  var vs = preorder(t, root);
	  vs = vs.slice(1);
	  lodash_1.forEach(vs, function(v) {
	    var parent = t.node(v).parent,
	      edge = g.edge(v, parent),
	      flipped = false;

	    if (!edge) {
	      edge = g.edge(parent, v);
	      flipped = true;
	    }

	    g.node(v).rank = g.node(parent).rank + (flipped ? edge.minlen : -edge.minlen);
	  });
	}

	/*
	 * Returns true if the edge is in the tree.
	 */
	function isTreeEdge(tree, u, v) {
	  return tree.hasEdge(u, v);
	}

	/*
	 * Returns true if the specified node is descendant of the root node per the
	 * assigned low and lim attributes in the tree.
	 */
	function isDescendant(tree, vLabel, rootLabel) {
	  return rootLabel.low <= vLabel.lim && vLabel.lim <= rootLabel.lim;
	}

	var longestPath = util$1.longestPath;



	var rank_1 = rank;

	/*
	 * Assigns a rank to each node in the input graph that respects the "minlen"
	 * constraint specified on edges between nodes.
	 *
	 * This basic structure is derived from Gansner, et al., "A Technique for
	 * Drawing Directed Graphs."
	 *
	 * Pre-conditions:
	 *
	 *    1. Graph must be a connected DAG
	 *    2. Graph nodes must be objects
	 *    3. Graph edges must have "weight" and "minlen" attributes
	 *
	 * Post-conditions:
	 *
	 *    1. Graph nodes will have a "rank" attribute based on the results of the
	 *       algorithm. Ranks can start at any index (including negative), we'll
	 *       fix them up later.
	 */
	function rank(g) {
	  switch(g.graph().ranker) {
	  case "network-simplex": networkSimplexRanker(g); break;
	  case "tight-tree": tightTreeRanker(g); break;
	  case "longest-path": longestPathRanker(g); break;
	  default: networkSimplexRanker(g);
	  }
	}

	// A fast and simple ranker, but results are far from optimal.
	var longestPathRanker = longestPath;

	function tightTreeRanker(g) {
	  longestPath(g);
	  feasibleTree_1(g);
	}

	function networkSimplexRanker(g) {
	  networkSimplex_1(g);
	}

	var parentDummyChains_1 = parentDummyChains;

	function parentDummyChains(g) {
	  var postorderNums = postorder(g);

	  lodash_1.forEach(g.graph().dummyChains, function(v) {
	    var node = g.node(v);
	    var edgeObj = node.edgeObj;
	    var pathData = findPath(g, postorderNums, edgeObj.v, edgeObj.w);
	    var path = pathData.path;
	    var lca = pathData.lca;
	    var pathIdx = 0;
	    var pathV = path[pathIdx];
	    var ascending = true;

	    while (v !== edgeObj.w) {
	      node = g.node(v);

	      if (ascending) {
	        while ((pathV = path[pathIdx]) !== lca &&
	               g.node(pathV).maxRank < node.rank) {
	          pathIdx++;
	        }

	        if (pathV === lca) {
	          ascending = false;
	        }
	      }

	      if (!ascending) {
	        while (pathIdx < path.length - 1 &&
	               g.node(pathV = path[pathIdx + 1]).minRank <= node.rank) {
	          pathIdx++;
	        }
	        pathV = path[pathIdx];
	      }

	      g.setParent(v, pathV);
	      v = g.successors(v)[0];
	    }
	  });
	}

	// Find a path from v to w through the lowest common ancestor (LCA). Return the
	// full path and the LCA.
	function findPath(g, postorderNums, v, w) {
	  var vPath = [];
	  var wPath = [];
	  var low = Math.min(postorderNums[v].low, postorderNums[w].low);
	  var lim = Math.max(postorderNums[v].lim, postorderNums[w].lim);
	  var parent;
	  var lca;

	  // Traverse up from v to find the LCA
	  parent = v;
	  do {
	    parent = g.parent(parent);
	    vPath.push(parent);
	  } while (parent &&
	           (postorderNums[parent].low > low || lim > postorderNums[parent].lim));
	  lca = parent;

	  // Traverse from w to LCA
	  parent = w;
	  while ((parent = g.parent(parent)) !== lca) {
	    wPath.push(parent);
	  }

	  return { path: vPath.concat(wPath.reverse()), lca: lca };
	}

	function postorder(g) {
	  var result = {};
	  var lim = 0;

	  function dfs(v) {
	    var low = lim;
	    lodash_1.forEach(g.children(v), dfs);
	    result[v] = { low: low, lim: lim++ };
	  }
	  lodash_1.forEach(g.children(), dfs);

	  return result;
	}

	var nestingGraph = {
	  run: run,
	  cleanup: cleanup
	};

	/*
	 * A nesting graph creates dummy nodes for the tops and bottoms of subgraphs,
	 * adds appropriate edges to ensure that all cluster nodes are placed between
	 * these boundries, and ensures that the graph is connected.
	 *
	 * In addition we ensure, through the use of the minlen property, that nodes
	 * and subgraph border nodes to not end up on the same rank.
	 *
	 * Preconditions:
	 *
	 *    1. Input graph is a DAG
	 *    2. Nodes in the input graph has a minlen attribute
	 *
	 * Postconditions:
	 *
	 *    1. Input graph is connected.
	 *    2. Dummy nodes are added for the tops and bottoms of subgraphs.
	 *    3. The minlen attribute for nodes is adjusted to ensure nodes do not
	 *       get placed on the same rank as subgraph border nodes.
	 *
	 * The nesting graph idea comes from Sander, "Layout of Compound Directed
	 * Graphs."
	 */
	function run(g) {
	  var root = util$2.addDummyNode(g, "root", {}, "_root");
	  var depths = treeDepths(g);
	  var height = lodash_1.max(lodash_1.values(depths)) - 1; // Note: depths is an Object not an array
	  var nodeSep = 2 * height + 1;

	  g.graph().nestingRoot = root;

	  // Multiply minlen by nodeSep to align nodes on non-border ranks.
	  lodash_1.forEach(g.edges(), function(e) { g.edge(e).minlen *= nodeSep; });

	  // Calculate a weight that is sufficient to keep subgraphs vertically compact
	  var weight = sumWeights(g) + 1;

	  // Create border nodes and link them up
	  lodash_1.forEach(g.children(), function(child) {
	    dfs(g, root, nodeSep, weight, height, depths, child);
	  });

	  // Save the multiplier for node layers for later removal of empty border
	  // layers.
	  g.graph().nodeRankFactor = nodeSep;
	}

	function dfs(g, root, nodeSep, weight, height, depths, v) {
	  var children = g.children(v);
	  if (!children.length) {
	    if (v !== root) {
	      g.setEdge(root, v, { weight: 0, minlen: nodeSep });
	    }
	    return;
	  }

	  var top = util$2.addBorderNode(g, "_bt");
	  var bottom = util$2.addBorderNode(g, "_bb");
	  var label = g.node(v);

	  g.setParent(top, v);
	  label.borderTop = top;
	  g.setParent(bottom, v);
	  label.borderBottom = bottom;

	  lodash_1.forEach(children, function(child) {
	    dfs(g, root, nodeSep, weight, height, depths, child);

	    var childNode = g.node(child);
	    var childTop = childNode.borderTop ? childNode.borderTop : child;
	    var childBottom = childNode.borderBottom ? childNode.borderBottom : child;
	    var thisWeight = childNode.borderTop ? weight : 2 * weight;
	    var minlen = childTop !== childBottom ? 1 : height - depths[v] + 1;

	    g.setEdge(top, childTop, {
	      weight: thisWeight,
	      minlen: minlen,
	      nestingEdge: true
	    });

	    g.setEdge(childBottom, bottom, {
	      weight: thisWeight,
	      minlen: minlen,
	      nestingEdge: true
	    });
	  });

	  if (!g.parent(v)) {
	    g.setEdge(root, top, { weight: 0, minlen: height + depths[v] });
	  }
	}

	function treeDepths(g) {
	  var depths = {};
	  function dfs(v, depth) {
	    var children = g.children(v);
	    if (children && children.length) {
	      lodash_1.forEach(children, function(child) {
	        dfs(child, depth + 1);
	      });
	    }
	    depths[v] = depth;
	  }
	  lodash_1.forEach(g.children(), function(v) { dfs(v, 1); });
	  return depths;
	}

	function sumWeights(g) {
	  return lodash_1.reduce(g.edges(), function(acc, e) {
	    return acc + g.edge(e).weight;
	  }, 0);
	}

	function cleanup(g) {
	  var graphLabel = g.graph();
	  g.removeNode(graphLabel.nestingRoot);
	  delete graphLabel.nestingRoot;
	  lodash_1.forEach(g.edges(), function(e) {
	    var edge = g.edge(e);
	    if (edge.nestingEdge) {
	      g.removeEdge(e);
	    }
	  });
	}

	var addBorderSegments_1 = addBorderSegments;

	function addBorderSegments(g) {
	  function dfs(v) {
	    var children = g.children(v);
	    var node = g.node(v);
	    if (children.length) {
	      lodash_1.forEach(children, dfs);
	    }

	    if (lodash_1.has(node, "minRank")) {
	      node.borderLeft = [];
	      node.borderRight = [];
	      for (var rank = node.minRank, maxRank = node.maxRank + 1;
	        rank < maxRank;
	        ++rank) {
	        addBorderNode(g, "borderLeft", "_bl", v, node, rank);
	        addBorderNode(g, "borderRight", "_br", v, node, rank);
	      }
	    }
	  }

	  lodash_1.forEach(g.children(), dfs);
	}

	function addBorderNode(g, prop, prefix, sg, sgNode, rank) {
	  var label = { width: 0, height: 0, rank: rank, borderType: prop };
	  var prev = sgNode[prop][rank - 1];
	  var curr = util$2.addDummyNode(g, "border", label, prefix);
	  sgNode[prop][rank] = curr;
	  g.setParent(curr, sg);
	  if (prev) {
	    g.setEdge(prev, curr, { weight: 1 });
	  }
	}

	var coordinateSystem = {
	  adjust: adjust,
	  undo: undo
	};

	function adjust(g) {
	  var rankDir = g.graph().rankdir.toLowerCase();
	  if (rankDir === "lr" || rankDir === "rl") {
	    swapWidthHeight(g);
	  }
	}

	function undo(g) {
	  var rankDir = g.graph().rankdir.toLowerCase();
	  if (rankDir === "bt" || rankDir === "rl") {
	    reverseY(g);
	  }

	  if (rankDir === "lr" || rankDir === "rl") {
	    swapXY(g);
	    swapWidthHeight(g);
	  }
	}

	function swapWidthHeight(g) {
	  lodash_1.forEach(g.nodes(), function(v) { swapWidthHeightOne(g.node(v)); });
	  lodash_1.forEach(g.edges(), function(e) { swapWidthHeightOne(g.edge(e)); });
	}

	function swapWidthHeightOne(attrs) {
	  var w = attrs.width;
	  attrs.width = attrs.height;
	  attrs.height = w;
	}

	function reverseY(g) {
	  lodash_1.forEach(g.nodes(), function(v) { reverseYOne(g.node(v)); });

	  lodash_1.forEach(g.edges(), function(e) {
	    var edge = g.edge(e);
	    lodash_1.forEach(edge.points, reverseYOne);
	    if (lodash_1.has(edge, "y")) {
	      reverseYOne(edge);
	    }
	  });
	}

	function reverseYOne(attrs) {
	  attrs.y = -attrs.y;
	}

	function swapXY(g) {
	  lodash_1.forEach(g.nodes(), function(v) { swapXYOne(g.node(v)); });

	  lodash_1.forEach(g.edges(), function(e) {
	    var edge = g.edge(e);
	    lodash_1.forEach(edge.points, swapXYOne);
	    if (lodash_1.has(edge, "x")) {
	      swapXYOne(edge);
	    }
	  });
	}

	function swapXYOne(attrs) {
	  var x = attrs.x;
	  attrs.x = attrs.y;
	  attrs.y = x;
	}

	var initOrder_1 = initOrder;

	/*
	 * Assigns an initial order value for each node by performing a DFS search
	 * starting from nodes in the first rank. Nodes are assigned an order in their
	 * rank as they are first visited.
	 *
	 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
	 * Graphs."
	 *
	 * Returns a layering matrix with an array per layer and each layer sorted by
	 * the order of its nodes.
	 */
	function initOrder(g) {
	  var visited = {};
	  var simpleNodes = lodash_1.filter(g.nodes(), function(v) {
	    return !g.children(v).length;
	  });
	  var maxRank = lodash_1.max(lodash_1.map(simpleNodes, function(v) { return g.node(v).rank; }));
	  var layers = lodash_1.map(lodash_1.range(maxRank + 1), function() { return []; });

	  function dfs(v) {
	    if (lodash_1.has(visited, v)) return;
	    visited[v] = true;
	    var node = g.node(v);
	    layers[node.rank].push(v);
	    lodash_1.forEach(g.successors(v), dfs);
	  }

	  var orderedVs = lodash_1.sortBy(simpleNodes, function(v) { return g.node(v).rank; });
	  lodash_1.forEach(orderedVs, dfs);

	  return layers;
	}

	var crossCount_1 = crossCount;

	/*
	 * A function that takes a layering (an array of layers, each with an array of
	 * ordererd nodes) and a graph and returns a weighted crossing count.
	 *
	 * Pre-conditions:
	 *
	 *    1. Input graph must be simple (not a multigraph), directed, and include
	 *       only simple edges.
	 *    2. Edges in the input graph must have assigned weights.
	 *
	 * Post-conditions:
	 *
	 *    1. The graph and layering matrix are left unchanged.
	 *
	 * This algorithm is derived from Barth, et al., "Bilayer Cross Counting."
	 */
	function crossCount(g, layering) {
	  var cc = 0;
	  for (var i = 1; i < layering.length; ++i) {
	    cc += twoLayerCrossCount(g, layering[i-1], layering[i]);
	  }
	  return cc;
	}

	function twoLayerCrossCount(g, northLayer, southLayer) {
	  // Sort all of the edges between the north and south layers by their position
	  // in the north layer and then the south. Map these edges to the position of
	  // their head in the south layer.
	  var southPos = lodash_1.zipObject(southLayer,
	    lodash_1.map(southLayer, function (v, i) { return i; }));
	  var southEntries = lodash_1.flatten(lodash_1.map(northLayer, function(v) {
	    return lodash_1.sortBy(lodash_1.map(g.outEdges(v), function(e) {
	      return { pos: southPos[e.w], weight: g.edge(e).weight };
	    }), "pos");
	  }), true);

	  // Build the accumulator tree
	  var firstIndex = 1;
	  while (firstIndex < southLayer.length) firstIndex <<= 1;
	  var treeSize = 2 * firstIndex - 1;
	  firstIndex -= 1;
	  var tree = lodash_1.map(new Array(treeSize), function() { return 0; });

	  // Calculate the weighted crossings
	  var cc = 0;
	  lodash_1.forEach(southEntries.forEach(function(entry) {
	    var index = entry.pos + firstIndex;
	    tree[index] += entry.weight;
	    var weightSum = 0;
	    while (index > 0) {
	      if (index % 2) {
	        weightSum += tree[index + 1];
	      }
	      index = (index - 1) >> 1;
	      tree[index] += entry.weight;
	    }
	    cc += entry.weight * weightSum;
	  }));

	  return cc;
	}

	var barycenter_1 = barycenter;

	function barycenter(g, movable) {
	  return lodash_1.map(movable, function(v) {
	    var inV = g.inEdges(v);
	    if (!inV.length) {
	      return { v: v };
	    } else {
	      var result = lodash_1.reduce(inV, function(acc, e) {
	        var edge = g.edge(e),
	          nodeU = g.node(e.v);
	        return {
	          sum: acc.sum + (edge.weight * nodeU.order),
	          weight: acc.weight + edge.weight
	        };
	      }, { sum: 0, weight: 0 });

	      return {
	        v: v,
	        barycenter: result.sum / result.weight,
	        weight: result.weight
	      };
	    }
	  });
	}

	var resolveConflicts_1 = resolveConflicts;

	/*
	 * Given a list of entries of the form {v, barycenter, weight} and a
	 * constraint graph this function will resolve any conflicts between the
	 * constraint graph and the barycenters for the entries. If the barycenters for
	 * an entry would violate a constraint in the constraint graph then we coalesce
	 * the nodes in the conflict into a new node that respects the contraint and
	 * aggregates barycenter and weight information.
	 *
	 * This implementation is based on the description in Forster, "A Fast and
	 * Simple Hueristic for Constrained Two-Level Crossing Reduction," thought it
	 * differs in some specific details.
	 *
	 * Pre-conditions:
	 *
	 *    1. Each entry has the form {v, barycenter, weight}, or if the node has
	 *       no barycenter, then {v}.
	 *
	 * Returns:
	 *
	 *    A new list of entries of the form {vs, i, barycenter, weight}. The list
	 *    `vs` may either be a singleton or it may be an aggregation of nodes
	 *    ordered such that they do not violate constraints from the constraint
	 *    graph. The property `i` is the lowest original index of any of the
	 *    elements in `vs`.
	 */
	function resolveConflicts(entries, cg) {
	  var mappedEntries = {};
	  lodash_1.forEach(entries, function(entry, i) {
	    var tmp = mappedEntries[entry.v] = {
	      indegree: 0,
	      "in": [],
	      out: [],
	      vs: [entry.v],
	      i: i
	    };
	    if (!lodash_1.isUndefined(entry.barycenter)) {
	      tmp.barycenter = entry.barycenter;
	      tmp.weight = entry.weight;
	    }
	  });

	  lodash_1.forEach(cg.edges(), function(e) {
	    var entryV = mappedEntries[e.v];
	    var entryW = mappedEntries[e.w];
	    if (!lodash_1.isUndefined(entryV) && !lodash_1.isUndefined(entryW)) {
	      entryW.indegree++;
	      entryV.out.push(mappedEntries[e.w]);
	    }
	  });

	  var sourceSet = lodash_1.filter(mappedEntries, function(entry) {
	    return !entry.indegree;
	  });

	  return doResolveConflicts(sourceSet);
	}

	function doResolveConflicts(sourceSet) {
	  var entries = [];

	  function handleIn(vEntry) {
	    return function(uEntry) {
	      if (uEntry.merged) {
	        return;
	      }
	      if (lodash_1.isUndefined(uEntry.barycenter) ||
	          lodash_1.isUndefined(vEntry.barycenter) ||
	          uEntry.barycenter >= vEntry.barycenter) {
	        mergeEntries(vEntry, uEntry);
	      }
	    };
	  }

	  function handleOut(vEntry) {
	    return function(wEntry) {
	      wEntry["in"].push(vEntry);
	      if (--wEntry.indegree === 0) {
	        sourceSet.push(wEntry);
	      }
	    };
	  }

	  while (sourceSet.length) {
	    var entry = sourceSet.pop();
	    entries.push(entry);
	    lodash_1.forEach(entry["in"].reverse(), handleIn(entry));
	    lodash_1.forEach(entry.out, handleOut(entry));
	  }

	  return lodash_1.map(lodash_1.filter(entries, function(entry) { return !entry.merged; }),
	    function(entry) {
	      return lodash_1.pick(entry, ["vs", "i", "barycenter", "weight"]);
	    });

	}

	function mergeEntries(target, source) {
	  var sum = 0;
	  var weight = 0;

	  if (target.weight) {
	    sum += target.barycenter * target.weight;
	    weight += target.weight;
	  }

	  if (source.weight) {
	    sum += source.barycenter * source.weight;
	    weight += source.weight;
	  }

	  target.vs = source.vs.concat(target.vs);
	  target.barycenter = sum / weight;
	  target.weight = weight;
	  target.i = Math.min(source.i, target.i);
	  source.merged = true;
	}

	var sort_1 = sort;

	function sort(entries, biasRight) {
	  var parts = util$2.partition(entries, function(entry) {
	    return lodash_1.has(entry, "barycenter");
	  });
	  var sortable = parts.lhs,
	    unsortable = lodash_1.sortBy(parts.rhs, function(entry) { return -entry.i; }),
	    vs = [],
	    sum = 0,
	    weight = 0,
	    vsIndex = 0;

	  sortable.sort(compareWithBias(!!biasRight));

	  vsIndex = consumeUnsortable(vs, unsortable, vsIndex);

	  lodash_1.forEach(sortable, function (entry) {
	    vsIndex += entry.vs.length;
	    vs.push(entry.vs);
	    sum += entry.barycenter * entry.weight;
	    weight += entry.weight;
	    vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
	  });

	  var result = { vs: lodash_1.flatten(vs, true) };
	  if (weight) {
	    result.barycenter = sum / weight;
	    result.weight = weight;
	  }
	  return result;
	}

	function consumeUnsortable(vs, unsortable, index) {
	  var last;
	  while (unsortable.length && (last = lodash_1.last(unsortable)).i <= index) {
	    unsortable.pop();
	    vs.push(last.vs);
	    index++;
	  }
	  return index;
	}

	function compareWithBias(bias) {
	  return function(entryV, entryW) {
	    if (entryV.barycenter < entryW.barycenter) {
	      return -1;
	    } else if (entryV.barycenter > entryW.barycenter) {
	      return 1;
	    }

	    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
	  };
	}

	var sortSubgraph_1 = sortSubgraph;

	function sortSubgraph(g, v, cg, biasRight) {
	  var movable = g.children(v);
	  var node = g.node(v);
	  var bl = node ? node.borderLeft : undefined;
	  var br = node ? node.borderRight: undefined;
	  var subgraphs = {};

	  if (bl) {
	    movable = lodash_1.filter(movable, function(w) {
	      return w !== bl && w !== br;
	    });
	  }

	  var barycenters = barycenter_1(g, movable);
	  lodash_1.forEach(barycenters, function(entry) {
	    if (g.children(entry.v).length) {
	      var subgraphResult = sortSubgraph(g, entry.v, cg, biasRight);
	      subgraphs[entry.v] = subgraphResult;
	      if (lodash_1.has(subgraphResult, "barycenter")) {
	        mergeBarycenters(entry, subgraphResult);
	      }
	    }
	  });

	  var entries = resolveConflicts_1(barycenters, cg);
	  expandSubgraphs(entries, subgraphs);

	  var result = sort_1(entries, biasRight);

	  if (bl) {
	    result.vs = lodash_1.flatten([bl, result.vs, br], true);
	    if (g.predecessors(bl).length) {
	      var blPred = g.node(g.predecessors(bl)[0]),
	        brPred = g.node(g.predecessors(br)[0]);
	      if (!lodash_1.has(result, "barycenter")) {
	        result.barycenter = 0;
	        result.weight = 0;
	      }
	      result.barycenter = (result.barycenter * result.weight +
	                           blPred.order + brPred.order) / (result.weight + 2);
	      result.weight += 2;
	    }
	  }

	  return result;
	}

	function expandSubgraphs(entries, subgraphs) {
	  lodash_1.forEach(entries, function(entry) {
	    entry.vs = lodash_1.flatten(entry.vs.map(function(v) {
	      if (subgraphs[v]) {
	        return subgraphs[v].vs;
	      }
	      return v;
	    }), true);
	  });
	}

	function mergeBarycenters(target, other) {
	  if (!lodash_1.isUndefined(target.barycenter)) {
	    target.barycenter = (target.barycenter * target.weight +
	                         other.barycenter * other.weight) /
	                        (target.weight + other.weight);
	    target.weight += other.weight;
	  } else {
	    target.barycenter = other.barycenter;
	    target.weight = other.weight;
	  }
	}

	var Graph$4 = graphlib_1.Graph;

	var buildLayerGraph_1 = buildLayerGraph;

	/*
	 * Constructs a graph that can be used to sort a layer of nodes. The graph will
	 * contain all base and subgraph nodes from the request layer in their original
	 * hierarchy and any edges that are incident on these nodes and are of the type
	 * requested by the "relationship" parameter.
	 *
	 * Nodes from the requested rank that do not have parents are assigned a root
	 * node in the output graph, which is set in the root graph attribute. This
	 * makes it easy to walk the hierarchy of movable nodes during ordering.
	 *
	 * Pre-conditions:
	 *
	 *    1. Input graph is a DAG
	 *    2. Base nodes in the input graph have a rank attribute
	 *    3. Subgraph nodes in the input graph has minRank and maxRank attributes
	 *    4. Edges have an assigned weight
	 *
	 * Post-conditions:
	 *
	 *    1. Output graph has all nodes in the movable rank with preserved
	 *       hierarchy.
	 *    2. Root nodes in the movable layer are made children of the node
	 *       indicated by the root attribute of the graph.
	 *    3. Non-movable nodes incident on movable nodes, selected by the
	 *       relationship parameter, are included in the graph (without hierarchy).
	 *    4. Edges incident on movable nodes, selected by the relationship
	 *       parameter, are added to the output graph.
	 *    5. The weights for copied edges are aggregated as need, since the output
	 *       graph is not a multi-graph.
	 */
	function buildLayerGraph(g, rank, relationship) {
	  var root = createRootNode(g),
	    result = new Graph$4({ compound: true }).setGraph({ root: root })
	      .setDefaultNodeLabel(function(v) { return g.node(v); });

	  lodash_1.forEach(g.nodes(), function(v) {
	    var node = g.node(v),
	      parent = g.parent(v);

	    if (node.rank === rank || node.minRank <= rank && rank <= node.maxRank) {
	      result.setNode(v);
	      result.setParent(v, parent || root);

	      // This assumes we have only short edges!
	      lodash_1.forEach(g[relationship](v), function(e) {
	        var u = e.v === v ? e.w : e.v,
	          edge = result.edge(u, v),
	          weight = !lodash_1.isUndefined(edge) ? edge.weight : 0;
	        result.setEdge(u, v, { weight: g.edge(e).weight + weight });
	      });

	      if (lodash_1.has(node, "minRank")) {
	        result.setNode(v, {
	          borderLeft: node.borderLeft[rank],
	          borderRight: node.borderRight[rank]
	        });
	      }
	    }
	  });

	  return result;
	}

	function createRootNode(g) {
	  var v;
	  while (g.hasNode((v = lodash_1.uniqueId("_root"))));
	  return v;
	}

	var addSubgraphConstraints_1 = addSubgraphConstraints;

	function addSubgraphConstraints(g, cg, vs) {
	  var prev = {},
	    rootPrev;

	  lodash_1.forEach(vs, function(v) {
	    var child = g.parent(v),
	      parent,
	      prevChild;
	    while (child) {
	      parent = g.parent(child);
	      if (parent) {
	        prevChild = prev[parent];
	        prev[parent] = child;
	      } else {
	        prevChild = rootPrev;
	        rootPrev = child;
	      }
	      if (prevChild && prevChild !== child) {
	        cg.setEdge(prevChild, child);
	        return;
	      }
	      child = parent;
	    }
	  });

	  /*
	  function dfs(v) {
	    var children = v ? g.children(v) : g.children();
	    if (children.length) {
	      var min = Number.POSITIVE_INFINITY,
	          subgraphs = [];
	      _.each(children, function(child) {
	        var childMin = dfs(child);
	        if (g.children(child).length) {
	          subgraphs.push({ v: child, order: childMin });
	        }
	        min = Math.min(min, childMin);
	      });
	      _.reduce(_.sortBy(subgraphs, "order"), function(prev, curr) {
	        cg.setEdge(prev.v, curr.v);
	        return curr;
	      });
	      return min;
	    }
	    return g.node(v).order;
	  }
	  dfs(undefined);
	  */
	}

	var Graph$3 = graphlib_1.Graph;


	var order_1 = order;

	/*
	 * Applies heuristics to minimize edge crossings in the graph and sets the best
	 * order solution as an order attribute on each node.
	 *
	 * Pre-conditions:
	 *
	 *    1. Graph must be DAG
	 *    2. Graph nodes must be objects with a "rank" attribute
	 *    3. Graph edges must have the "weight" attribute
	 *
	 * Post-conditions:
	 *
	 *    1. Graph nodes will have an "order" attribute based on the results of the
	 *       algorithm.
	 */
	function order(g) {
	  var maxRank = util$2.maxRank(g),
	    downLayerGraphs = buildLayerGraphs(g, lodash_1.range(1, maxRank + 1), "inEdges"),
	    upLayerGraphs = buildLayerGraphs(g, lodash_1.range(maxRank - 1, -1, -1), "outEdges");

	  var layering = initOrder_1(g);
	  assignOrder(g, layering);

	  var bestCC = Number.POSITIVE_INFINITY,
	    best;

	  for (var i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
	    sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);

	    layering = util$2.buildLayerMatrix(g);
	    var cc = crossCount_1(g, layering);
	    if (cc < bestCC) {
	      lastBest = 0;
	      best = lodash_1.cloneDeep(layering);
	      bestCC = cc;
	    }
	  }

	  assignOrder(g, best);
	}

	function buildLayerGraphs(g, ranks, relationship) {
	  return lodash_1.map(ranks, function(rank) {
	    return buildLayerGraph_1(g, rank, relationship);
	  });
	}

	function sweepLayerGraphs(layerGraphs, biasRight) {
	  var cg = new Graph$3();
	  lodash_1.forEach(layerGraphs, function(lg) {
	    var root = lg.graph().root;
	    var sorted = sortSubgraph_1(lg, root, cg, biasRight);
	    lodash_1.forEach(sorted.vs, function(v, i) {
	      lg.node(v).order = i;
	    });
	    addSubgraphConstraints_1(lg, cg, sorted.vs);
	  });
	}

	function assignOrder(g, layering) {
	  lodash_1.forEach(layering, function(layer) {
	    lodash_1.forEach(layer, function(v, i) {
	      g.node(v).order = i;
	    });
	  });
	}

	var Graph$2 = graphlib_1.Graph;


	/*
	 * This module provides coordinate assignment based on Brandes and Köpf, "Fast
	 * and Simple Horizontal Coordinate Assignment."
	 */

	var bk = {
	  positionX: positionX$1,
	  findType1Conflicts: findType1Conflicts,
	  findType2Conflicts: findType2Conflicts,
	  addConflict: addConflict,
	  hasConflict: hasConflict,
	  verticalAlignment: verticalAlignment,
	  horizontalCompaction: horizontalCompaction,
	  alignCoordinates: alignCoordinates,
	  findSmallestWidthAlignment: findSmallestWidthAlignment,
	  balance: balance
	};

	/*
	 * Marks all edges in the graph with a type-1 conflict with the "type1Conflict"
	 * property. A type-1 conflict is one where a non-inner segment crosses an
	 * inner segment. An inner segment is an edge with both incident nodes marked
	 * with the "dummy" property.
	 *
	 * This algorithm scans layer by layer, starting with the second, for type-1
	 * conflicts between the current layer and the previous layer. For each layer
	 * it scans the nodes from left to right until it reaches one that is incident
	 * on an inner segment. It then scans predecessors to determine if they have
	 * edges that cross that inner segment. At the end a final scan is done for all
	 * nodes on the current rank to see if they cross the last visited inner
	 * segment.
	 *
	 * This algorithm (safely) assumes that a dummy node will only be incident on a
	 * single node in the layers being scanned.
	 */
	function findType1Conflicts(g, layering) {
	  var conflicts = {};

	  function visitLayer(prevLayer, layer) {
	    var
	      // last visited node in the previous layer that is incident on an inner
	      // segment.
	      k0 = 0,
	      // Tracks the last node in this layer scanned for crossings with a type-1
	      // segment.
	      scanPos = 0,
	      prevLayerLength = prevLayer.length,
	      lastNode = lodash_1.last(layer);

	    lodash_1.forEach(layer, function(v, i) {
	      var w = findOtherInnerSegmentNode(g, v),
	        k1 = w ? g.node(w).order : prevLayerLength;

	      if (w || v === lastNode) {
	        lodash_1.forEach(layer.slice(scanPos, i +1), function(scanNode) {
	          lodash_1.forEach(g.predecessors(scanNode), function(u) {
	            var uLabel = g.node(u),
	              uPos = uLabel.order;
	            if ((uPos < k0 || k1 < uPos) &&
	                !(uLabel.dummy && g.node(scanNode).dummy)) {
	              addConflict(conflicts, u, scanNode);
	            }
	          });
	        });
	        scanPos = i + 1;
	        k0 = k1;
	      }
	    });

	    return layer;
	  }

	  lodash_1.reduce(layering, visitLayer);
	  return conflicts;
	}

	function findType2Conflicts(g, layering) {
	  var conflicts = {};

	  function scan(south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
	    var v;
	    lodash_1.forEach(lodash_1.range(southPos, southEnd), function(i) {
	      v = south[i];
	      if (g.node(v).dummy) {
	        lodash_1.forEach(g.predecessors(v), function(u) {
	          var uNode = g.node(u);
	          if (uNode.dummy &&
	              (uNode.order < prevNorthBorder || uNode.order > nextNorthBorder)) {
	            addConflict(conflicts, u, v);
	          }
	        });
	      }
	    });
	  }


	  function visitLayer(north, south) {
	    var prevNorthPos = -1,
	      nextNorthPos,
	      southPos = 0;

	    lodash_1.forEach(south, function(v, southLookahead) {
	      if (g.node(v).dummy === "border") {
	        var predecessors = g.predecessors(v);
	        if (predecessors.length) {
	          nextNorthPos = g.node(predecessors[0]).order;
	          scan(south, southPos, southLookahead, prevNorthPos, nextNorthPos);
	          southPos = southLookahead;
	          prevNorthPos = nextNorthPos;
	        }
	      }
	      scan(south, southPos, south.length, nextNorthPos, north.length);
	    });

	    return south;
	  }

	  lodash_1.reduce(layering, visitLayer);
	  return conflicts;
	}

	function findOtherInnerSegmentNode(g, v) {
	  if (g.node(v).dummy) {
	    return lodash_1.find(g.predecessors(v), function(u) {
	      return g.node(u).dummy;
	    });
	  }
	}

	function addConflict(conflicts, v, w) {
	  if (v > w) {
	    var tmp = v;
	    v = w;
	    w = tmp;
	  }

	  var conflictsV = conflicts[v];
	  if (!conflictsV) {
	    conflicts[v] = conflictsV = {};
	  }
	  conflictsV[w] = true;
	}

	function hasConflict(conflicts, v, w) {
	  if (v > w) {
	    var tmp = v;
	    v = w;
	    w = tmp;
	  }
	  return lodash_1.has(conflicts[v], w);
	}

	/*
	 * Try to align nodes into vertical "blocks" where possible. This algorithm
	 * attempts to align a node with one of its median neighbors. If the edge
	 * connecting a neighbor is a type-1 conflict then we ignore that possibility.
	 * If a previous node has already formed a block with a node after the node
	 * we're trying to form a block with, we also ignore that possibility - our
	 * blocks would be split in that scenario.
	 */
	function verticalAlignment(g, layering, conflicts, neighborFn) {
	  var root = {},
	    align = {},
	    pos = {};

	  // We cache the position here based on the layering because the graph and
	  // layering may be out of sync. The layering matrix is manipulated to
	  // generate different extreme alignments.
	  lodash_1.forEach(layering, function(layer) {
	    lodash_1.forEach(layer, function(v, order) {
	      root[v] = v;
	      align[v] = v;
	      pos[v] = order;
	    });
	  });

	  lodash_1.forEach(layering, function(layer) {
	    var prevIdx = -1;
	    lodash_1.forEach(layer, function(v) {
	      var ws = neighborFn(v);
	      if (ws.length) {
	        ws = lodash_1.sortBy(ws, function(w) { return pos[w]; });
	        var mp = (ws.length - 1) / 2;
	        for (var i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
	          var w = ws[i];
	          if (align[v] === v &&
	              prevIdx < pos[w] &&
	              !hasConflict(conflicts, v, w)) {
	            align[w] = v;
	            align[v] = root[v] = root[w];
	            prevIdx = pos[w];
	          }
	        }
	      }
	    });
	  });

	  return { root: root, align: align };
	}

	function horizontalCompaction(g, layering, root, align, reverseSep) {
	  // This portion of the algorithm differs from BK due to a number of problems.
	  // Instead of their algorithm we construct a new block graph and do two
	  // sweeps. The first sweep places blocks with the smallest possible
	  // coordinates. The second sweep removes unused space by moving blocks to the
	  // greatest coordinates without violating separation.
	  var xs = {},
	    blockG = buildBlockGraph(g, layering, root, reverseSep),
	    borderType = reverseSep ? "borderLeft" : "borderRight";

	  function iterate(setXsFunc, nextNodesFunc) {
	    var stack = blockG.nodes();
	    var elem = stack.pop();
	    var visited = {};
	    while (elem) {
	      if (visited[elem]) {
	        setXsFunc(elem);
	      } else {
	        visited[elem] = true;
	        stack.push(elem);
	        stack = stack.concat(nextNodesFunc(elem));
	      }

	      elem = stack.pop();
	    }
	  }

	  // First pass, assign smallest coordinates
	  function pass1(elem) {
	    xs[elem] = blockG.inEdges(elem).reduce(function(acc, e) {
	      return Math.max(acc, xs[e.v] + blockG.edge(e));
	    }, 0);
	  }

	  // Second pass, assign greatest coordinates
	  function pass2(elem) {
	    var min = blockG.outEdges(elem).reduce(function(acc, e) {
	      return Math.min(acc, xs[e.w] - blockG.edge(e));
	    }, Number.POSITIVE_INFINITY);

	    var node = g.node(elem);
	    if (min !== Number.POSITIVE_INFINITY && node.borderType !== borderType) {
	      xs[elem] = Math.max(xs[elem], min);
	    }
	  }

	  iterate(pass1, blockG.predecessors.bind(blockG));
	  iterate(pass2, blockG.successors.bind(blockG));

	  // Assign x coordinates to all nodes
	  lodash_1.forEach(align, function(v) {
	    xs[v] = xs[root[v]];
	  });

	  return xs;
	}


	function buildBlockGraph(g, layering, root, reverseSep) {
	  var blockGraph = new Graph$2(),
	    graphLabel = g.graph(),
	    sepFn = sep(graphLabel.nodesep, graphLabel.edgesep, reverseSep);

	  lodash_1.forEach(layering, function(layer) {
	    var u;
	    lodash_1.forEach(layer, function(v) {
	      var vRoot = root[v];
	      blockGraph.setNode(vRoot);
	      if (u) {
	        var uRoot = root[u],
	          prevMax = blockGraph.edge(uRoot, vRoot);
	        blockGraph.setEdge(uRoot, vRoot, Math.max(sepFn(g, v, u), prevMax || 0));
	      }
	      u = v;
	    });
	  });

	  return blockGraph;
	}

	/*
	 * Returns the alignment that has the smallest width of the given alignments.
	 */
	function findSmallestWidthAlignment(g, xss) {
	  return lodash_1.minBy(lodash_1.values(xss), function (xs) {
	    var max = Number.NEGATIVE_INFINITY;
	    var min = Number.POSITIVE_INFINITY;

	    lodash_1.forIn(xs, function (x, v) {
	      var halfWidth = width(g, v) / 2;

	      max = Math.max(x + halfWidth, max);
	      min = Math.min(x - halfWidth, min);
	    });

	    return max - min;
	  });
	}

	/*
	 * Align the coordinates of each of the layout alignments such that
	 * left-biased alignments have their minimum coordinate at the same point as
	 * the minimum coordinate of the smallest width alignment and right-biased
	 * alignments have their maximum coordinate at the same point as the maximum
	 * coordinate of the smallest width alignment.
	 */
	function alignCoordinates(xss, alignTo) {
	  var alignToVals = lodash_1.values(alignTo),
	    alignToMin = lodash_1.min(alignToVals),
	    alignToMax = lodash_1.max(alignToVals);

	  lodash_1.forEach(["u", "d"], function(vert) {
	    lodash_1.forEach(["l", "r"], function(horiz) {
	      var alignment = vert + horiz,
	        xs = xss[alignment],
	        delta;
	      if (xs === alignTo) return;

	      var xsVals = lodash_1.values(xs);
	      delta = horiz === "l" ? alignToMin - lodash_1.min(xsVals) : alignToMax - lodash_1.max(xsVals);

	      if (delta) {
	        xss[alignment] = lodash_1.mapValues(xs, function(x) { return x + delta; });
	      }
	    });
	  });
	}

	function balance(xss, align) {
	  return lodash_1.mapValues(xss.ul, function(ignore, v) {
	    if (align) {
	      return xss[align.toLowerCase()][v];
	    } else {
	      var xs = lodash_1.sortBy(lodash_1.map(xss, v));
	      return (xs[1] + xs[2]) / 2;
	    }
	  });
	}

	function positionX$1(g) {
	  var layering = util$2.buildLayerMatrix(g);
	  var conflicts = lodash_1.merge(
	    findType1Conflicts(g, layering),
	    findType2Conflicts(g, layering));

	  var xss = {};
	  var adjustedLayering;
	  lodash_1.forEach(["u", "d"], function(vert) {
	    adjustedLayering = vert === "u" ? layering : lodash_1.values(layering).reverse();
	    lodash_1.forEach(["l", "r"], function(horiz) {
	      if (horiz === "r") {
	        adjustedLayering = lodash_1.map(adjustedLayering, function(inner) {
	          return lodash_1.values(inner).reverse();
	        });
	      }

	      var neighborFn = (vert === "u" ? g.predecessors : g.successors).bind(g);
	      var align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
	      var xs = horizontalCompaction(g, adjustedLayering,
	        align.root, align.align, horiz === "r");
	      if (horiz === "r") {
	        xs = lodash_1.mapValues(xs, function(x) { return -x; });
	      }
	      xss[vert + horiz] = xs;
	    });
	  });

	  var smallestWidth = findSmallestWidthAlignment(g, xss);
	  alignCoordinates(xss, smallestWidth);
	  return balance(xss, g.graph().align);
	}

	function sep(nodeSep, edgeSep, reverseSep) {
	  return function(g, v, w) {
	    var vLabel = g.node(v);
	    var wLabel = g.node(w);
	    var sum = 0;
	    var delta;

	    sum += vLabel.width / 2;
	    if (lodash_1.has(vLabel, "labelpos")) {
	      switch (vLabel.labelpos.toLowerCase()) {
	      case "l": delta = -vLabel.width / 2; break;
	      case "r": delta = vLabel.width / 2; break;
	      }
	    }
	    if (delta) {
	      sum += reverseSep ? delta : -delta;
	    }
	    delta = 0;

	    sum += (vLabel.dummy ? edgeSep : nodeSep) / 2;
	    sum += (wLabel.dummy ? edgeSep : nodeSep) / 2;

	    sum += wLabel.width / 2;
	    if (lodash_1.has(wLabel, "labelpos")) {
	      switch (wLabel.labelpos.toLowerCase()) {
	      case "l": delta = wLabel.width / 2; break;
	      case "r": delta = -wLabel.width / 2; break;
	      }
	    }
	    if (delta) {
	      sum += reverseSep ? delta : -delta;
	    }
	    delta = 0;

	    return sum;
	  };
	}

	function width(g, v) {
	  return g.node(v).width;
	}

	var positionX = bk.positionX;

	var position_1 = position;

	function position(g) {
	  g = util$2.asNonCompoundGraph(g);

	  positionY(g);
	  lodash_1.forEach(positionX(g), function(x, v) {
	    g.node(v).x = x;
	  });
	}

	function positionY(g) {
	  var layering = util$2.buildLayerMatrix(g);
	  var rankSep = g.graph().ranksep;
	  var prevY = 0;
	  lodash_1.forEach(layering, function(layer) {
	    var maxHeight = lodash_1.max(lodash_1.map(layer, function(v) { return g.node(v).height; }));
	    lodash_1.forEach(layer, function(v) {
	      g.node(v).y = prevY + maxHeight / 2;
	    });
	    prevY += maxHeight + rankSep;
	  });
	}

	var normalizeRanks = util$2.normalizeRanks;

	var removeEmptyRanks = util$2.removeEmptyRanks;





	var util = util$2;
	var Graph$1 = graphlib_1.Graph;

	var layout_1 = layout$1;

	function layout$1(g, opts) {
	  var time = opts && opts.debugTiming ? util.time : util.notime;
	  time("layout", function() {
	    var layoutGraph = 
	      time("  buildLayoutGraph", function() { return buildLayoutGraph(g); });
	    time("  runLayout",        function() { runLayout(layoutGraph, time); });
	    time("  updateInputGraph", function() { updateInputGraph(g, layoutGraph); });
	  });
	}

	function runLayout(g, time) {
	  time("    makeSpaceForEdgeLabels", function() { makeSpaceForEdgeLabels(g); });
	  time("    removeSelfEdges",        function() { removeSelfEdges(g); });
	  time("    acyclic",                function() { acyclic.run(g); });
	  time("    nestingGraph.run",       function() { nestingGraph.run(g); });
	  time("    rank",                   function() { rank_1(util.asNonCompoundGraph(g)); });
	  time("    injectEdgeLabelProxies", function() { injectEdgeLabelProxies(g); });
	  time("    removeEmptyRanks",       function() { removeEmptyRanks(g); });
	  time("    nestingGraph.cleanup",   function() { nestingGraph.cleanup(g); });
	  time("    normalizeRanks",         function() { normalizeRanks(g); });
	  time("    assignRankMinMax",       function() { assignRankMinMax(g); });
	  time("    removeEdgeLabelProxies", function() { removeEdgeLabelProxies(g); });
	  time("    normalize.run",          function() { normalize.run(g); });
	  time("    parentDummyChains",      function() { parentDummyChains_1(g); });
	  time("    addBorderSegments",      function() { addBorderSegments_1(g); });
	  time("    order",                  function() { order_1(g); });
	  time("    insertSelfEdges",        function() { insertSelfEdges(g); });
	  time("    adjustCoordinateSystem", function() { coordinateSystem.adjust(g); });
	  time("    position",               function() { position_1(g); });
	  time("    positionSelfEdges",      function() { positionSelfEdges(g); });
	  time("    removeBorderNodes",      function() { removeBorderNodes(g); });
	  time("    normalize.undo",         function() { normalize.undo(g); });
	  time("    fixupEdgeLabelCoords",   function() { fixupEdgeLabelCoords(g); });
	  time("    undoCoordinateSystem",   function() { coordinateSystem.undo(g); });
	  time("    translateGraph",         function() { translateGraph(g); });
	  time("    assignNodeIntersects",   function() { assignNodeIntersects(g); });
	  time("    reversePoints",          function() { reversePointsForReversedEdges(g); });
	  time("    acyclic.undo",           function() { acyclic.undo(g); });
	}

	/*
	 * Copies final layout information from the layout graph back to the input
	 * graph. This process only copies whitelisted attributes from the layout graph
	 * to the input graph, so it serves as a good place to determine what
	 * attributes can influence layout.
	 */
	function updateInputGraph(inputGraph, layoutGraph) {
	  lodash_1.forEach(inputGraph.nodes(), function(v) {
	    var inputLabel = inputGraph.node(v);
	    var layoutLabel = layoutGraph.node(v);

	    if (inputLabel) {
	      inputLabel.x = layoutLabel.x;
	      inputLabel.y = layoutLabel.y;

	      if (layoutGraph.children(v).length) {
	        inputLabel.width = layoutLabel.width;
	        inputLabel.height = layoutLabel.height;
	      }
	    }
	  });

	  lodash_1.forEach(inputGraph.edges(), function(e) {
	    var inputLabel = inputGraph.edge(e);
	    var layoutLabel = layoutGraph.edge(e);

	    inputLabel.points = layoutLabel.points;
	    if (lodash_1.has(layoutLabel, "x")) {
	      inputLabel.x = layoutLabel.x;
	      inputLabel.y = layoutLabel.y;
	    }
	  });

	  inputGraph.graph().width = layoutGraph.graph().width;
	  inputGraph.graph().height = layoutGraph.graph().height;
	}

	var graphNumAttrs = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"];
	var graphDefaults = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" };
	var graphAttrs = ["acyclicer", "ranker", "rankdir", "align"];
	var nodeNumAttrs = ["width", "height"];
	var nodeDefaults = { width: 0, height: 0 };
	var edgeNumAttrs = ["minlen", "weight", "width", "height", "labeloffset"];
	var edgeDefaults = {
	  minlen: 1, weight: 1, width: 0, height: 0,
	  labeloffset: 10, labelpos: "r"
	};
	var edgeAttrs = ["labelpos"];

	/*
	 * Constructs a new graph from the input graph, which can be used for layout.
	 * This process copies only whitelisted attributes from the input graph to the
	 * layout graph. Thus this function serves as a good place to determine what
	 * attributes can influence layout.
	 */
	function buildLayoutGraph(inputGraph) {
	  var g = new Graph$1({ multigraph: true, compound: true });
	  var graph = canonicalize(inputGraph.graph());

	  g.setGraph(lodash_1.merge({},
	    graphDefaults,
	    selectNumberAttrs(graph, graphNumAttrs),
	    lodash_1.pick(graph, graphAttrs)));

	  lodash_1.forEach(inputGraph.nodes(), function(v) {
	    var node = canonicalize(inputGraph.node(v));
	    g.setNode(v, lodash_1.defaults(selectNumberAttrs(node, nodeNumAttrs), nodeDefaults));
	    g.setParent(v, inputGraph.parent(v));
	  });

	  lodash_1.forEach(inputGraph.edges(), function(e) {
	    var edge = canonicalize(inputGraph.edge(e));
	    g.setEdge(e, lodash_1.merge({},
	      edgeDefaults,
	      selectNumberAttrs(edge, edgeNumAttrs),
	      lodash_1.pick(edge, edgeAttrs)));
	  });

	  return g;
	}

	/*
	 * This idea comes from the Gansner paper: to account for edge labels in our
	 * layout we split each rank in half by doubling minlen and halving ranksep.
	 * Then we can place labels at these mid-points between nodes.
	 *
	 * We also add some minimal padding to the width to push the label for the edge
	 * away from the edge itself a bit.
	 */
	function makeSpaceForEdgeLabels(g) {
	  var graph = g.graph();
	  graph.ranksep /= 2;
	  lodash_1.forEach(g.edges(), function(e) {
	    var edge = g.edge(e);
	    edge.minlen *= 2;
	    if (edge.labelpos.toLowerCase() !== "c") {
	      if (graph.rankdir === "TB" || graph.rankdir === "BT") {
	        edge.width += edge.labeloffset;
	      } else {
	        edge.height += edge.labeloffset;
	      }
	    }
	  });
	}

	/*
	 * Creates temporary dummy nodes that capture the rank in which each edge's
	 * label is going to, if it has one of non-zero width and height. We do this
	 * so that we can safely remove empty ranks while preserving balance for the
	 * label's position.
	 */
	function injectEdgeLabelProxies(g) {
	  lodash_1.forEach(g.edges(), function(e) {
	    var edge = g.edge(e);
	    if (edge.width && edge.height) {
	      var v = g.node(e.v);
	      var w = g.node(e.w);
	      var label = { rank: (w.rank - v.rank) / 2 + v.rank, e: e };
	      util.addDummyNode(g, "edge-proxy", label, "_ep");
	    }
	  });
	}

	function assignRankMinMax(g) {
	  var maxRank = 0;
	  lodash_1.forEach(g.nodes(), function(v) {
	    var node = g.node(v);
	    if (node.borderTop) {
	      node.minRank = g.node(node.borderTop).rank;
	      node.maxRank = g.node(node.borderBottom).rank;
	      maxRank = lodash_1.max(maxRank, node.maxRank);
	    }
	  });
	  g.graph().maxRank = maxRank;
	}

	function removeEdgeLabelProxies(g) {
	  lodash_1.forEach(g.nodes(), function(v) {
	    var node = g.node(v);
	    if (node.dummy === "edge-proxy") {
	      g.edge(node.e).labelRank = node.rank;
	      g.removeNode(v);
	    }
	  });
	}

	function translateGraph(g) {
	  var minX = Number.POSITIVE_INFINITY;
	  var maxX = 0;
	  var minY = Number.POSITIVE_INFINITY;
	  var maxY = 0;
	  var graphLabel = g.graph();
	  var marginX = graphLabel.marginx || 0;
	  var marginY = graphLabel.marginy || 0;

	  function getExtremes(attrs) {
	    var x = attrs.x;
	    var y = attrs.y;
	    var w = attrs.width;
	    var h = attrs.height;
	    minX = Math.min(minX, x - w / 2);
	    maxX = Math.max(maxX, x + w / 2);
	    minY = Math.min(minY, y - h / 2);
	    maxY = Math.max(maxY, y + h / 2);
	  }

	  lodash_1.forEach(g.nodes(), function(v) { getExtremes(g.node(v)); });
	  lodash_1.forEach(g.edges(), function(e) {
	    var edge = g.edge(e);
	    if (lodash_1.has(edge, "x")) {
	      getExtremes(edge);
	    }
	  });

	  minX -= marginX;
	  minY -= marginY;

	  lodash_1.forEach(g.nodes(), function(v) {
	    var node = g.node(v);
	    node.x -= minX;
	    node.y -= minY;
	  });

	  lodash_1.forEach(g.edges(), function(e) {
	    var edge = g.edge(e);
	    lodash_1.forEach(edge.points, function(p) {
	      p.x -= minX;
	      p.y -= minY;
	    });
	    if (lodash_1.has(edge, "x")) { edge.x -= minX; }
	    if (lodash_1.has(edge, "y")) { edge.y -= minY; }
	  });

	  graphLabel.width = maxX - minX + marginX;
	  graphLabel.height = maxY - minY + marginY;
	}

	function assignNodeIntersects(g) {
	  lodash_1.forEach(g.edges(), function(e) {
	    var edge = g.edge(e);
	    var nodeV = g.node(e.v);
	    var nodeW = g.node(e.w);
	    var p1, p2;
	    if (!edge.points) {
	      edge.points = [];
	      p1 = nodeW;
	      p2 = nodeV;
	    } else {
	      p1 = edge.points[0];
	      p2 = edge.points[edge.points.length - 1];
	    }
	    edge.points.unshift(util.intersectRect(nodeV, p1));
	    edge.points.push(util.intersectRect(nodeW, p2));
	  });
	}

	function fixupEdgeLabelCoords(g) {
	  lodash_1.forEach(g.edges(), function(e) {
	    var edge = g.edge(e);
	    if (lodash_1.has(edge, "x")) {
	      if (edge.labelpos === "l" || edge.labelpos === "r") {
	        edge.width -= edge.labeloffset;
	      }
	      switch (edge.labelpos) {
	      case "l": edge.x -= edge.width / 2 + edge.labeloffset; break;
	      case "r": edge.x += edge.width / 2 + edge.labeloffset; break;
	      }
	    }
	  });
	}

	function reversePointsForReversedEdges(g) {
	  lodash_1.forEach(g.edges(), function(e) {
	    var edge = g.edge(e);
	    if (edge.reversed) {
	      edge.points.reverse();
	    }
	  });
	}

	function removeBorderNodes(g) {
	  lodash_1.forEach(g.nodes(), function(v) {
	    if (g.children(v).length) {
	      var node = g.node(v);
	      var t = g.node(node.borderTop);
	      var b = g.node(node.borderBottom);
	      var l = g.node(lodash_1.last(node.borderLeft));
	      var r = g.node(lodash_1.last(node.borderRight));

	      node.width = Math.abs(r.x - l.x);
	      node.height = Math.abs(b.y - t.y);
	      node.x = l.x + node.width / 2;
	      node.y = t.y + node.height / 2;
	    }
	  });

	  lodash_1.forEach(g.nodes(), function(v) {
	    if (g.node(v).dummy === "border") {
	      g.removeNode(v);
	    }
	  });
	}

	function removeSelfEdges(g) {
	  lodash_1.forEach(g.edges(), function(e) {
	    if (e.v === e.w) {
	      var node = g.node(e.v);
	      if (!node.selfEdges) {
	        node.selfEdges = [];
	      }
	      node.selfEdges.push({ e: e, label: g.edge(e) });
	      g.removeEdge(e);
	    }
	  });
	}

	function insertSelfEdges(g) {
	  var layers = util.buildLayerMatrix(g);
	  lodash_1.forEach(layers, function(layer) {
	    var orderShift = 0;
	    lodash_1.forEach(layer, function(v, i) {
	      var node = g.node(v);
	      node.order = i + orderShift;
	      lodash_1.forEach(node.selfEdges, function(selfEdge) {
	        util.addDummyNode(g, "selfedge", {
	          width: selfEdge.label.width,
	          height: selfEdge.label.height,
	          rank: node.rank,
	          order: i + (++orderShift),
	          e: selfEdge.e,
	          label: selfEdge.label
	        }, "_se");
	      });
	      delete node.selfEdges;
	    });
	  });
	}

	function positionSelfEdges(g) {
	  lodash_1.forEach(g.nodes(), function(v) {
	    var node = g.node(v);
	    if (node.dummy === "selfedge") {
	      var selfNode = g.node(node.e.v);
	      var x = selfNode.x + selfNode.width / 2;
	      var y = selfNode.y;
	      var dx = node.x - x;
	      var dy = selfNode.height / 2;
	      g.setEdge(node.e, node.label);
	      g.removeNode(v);
	      node.label.points = [
	        { x: x + 2 * dx / 3, y: y - dy },
	        { x: x + 5 * dx / 6, y: y - dy },
	        { x: x +     dx    , y: y },
	        { x: x + 5 * dx / 6, y: y + dy },
	        { x: x + 2 * dx / 3, y: y + dy }
	      ];
	      node.label.x = node.x;
	      node.label.y = node.y;
	    }
	  });
	}

	function selectNumberAttrs(obj, attrs) {
	  return lodash_1.mapValues(lodash_1.pick(obj, attrs), Number);
	}

	function canonicalize(attrs) {
	  var newAttrs = {};
	  lodash_1.forEach(attrs, function(v, k) {
	    newAttrs[k.toLowerCase()] = v;
	  });
	  return newAttrs;
	}

	var Graph = graphlib_1.Graph;

	var debug = {
	  debugOrdering: debugOrdering
	};

	/* istanbul ignore next */
	function debugOrdering(g) {
	  var layerMatrix = util$2.buildLayerMatrix(g);

	  var h = new Graph({ compound: true, multigraph: true }).setGraph({});

	  lodash_1.forEach(g.nodes(), function(v) {
	    h.setNode(v, { label: v });
	    h.setParent(v, "layer" + g.node(v).rank);
	  });

	  lodash_1.forEach(g.edges(), function(e) {
	    h.setEdge(e.v, e.w, {}, e.name);
	  });

	  lodash_1.forEach(layerMatrix, function(layer, i) {
	    var layerV = "layer" + i;
	    h.setNode(layerV, { rank: "same" });
	    lodash_1.reduce(layer, function(u, v) {
	      h.setEdge(u, v, { style: "invis" });
	      return v;
	    });
	  });

	  return h;
	}

	var version = "0.8.5";

	/*
	Copyright (c) 2012-2014 Chris Pettitt

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	*/

	var dagre = {
	  graphlib: graphlib_1,

	  layout: layout_1,
	  debug: debug,
	  util: {
	    time: util$2.time,
	    notime: util$2.notime
	  },
	  version: version
	};
	var dagre_1 = dagre.graphlib;
	var dagre_2 = dagre.layout;

	// import { dagStratify, decrossOpt, sugiyama } from "d3-dag";

	class SugiyamaLayout extends Layout {

	    constructor(args) {
	        super(args);
	        this.type = LayoutType.Sugiyama;
	        this._width = "width" in args ? args["width"] : 500;
	        this._height = "height" in args ? args["height"] : 300;
	        this._top = "top" in args ? args["top"] : 0;
	        this._left = "left" in args ? args["left"] : 0;
	    }

	    toJSON() {
	        let json = {args: {}};
			json.type = this.type;
			return json;
	    }

	    run() {
	        let graph = this.group.children[0].dataScope._dt.graph;
	        if (!graph) return;
	        
	        var g = new dagre_1.Graph();
	        g.setGraph({edgesep: 50});
	        g.setDefaultEdgeLabel(function() { return {}; });

	        //in case the node ids in the input graph file are integers
	        let nodeIdHash = new Map();
	        for (let n of this.group.children) {
	            let id = n.dataScope.getFieldValue(nodeId);
	            nodeIdHash.set(id, id + "");
	            g.setNode(id, {label: n.text ? n.text : "", width: n.bounds.width, height: n.bounds.height});
	        }
	        for (let l of graph.links) {
	            g.setEdge(l.source, l.target);
	        }
	        dagre_2(g);

	        const nid2pos = {};
	        let t = Math.min(...g.nodes().map(d => g.node(d).y)), l = Math.min(...g.nodes().map(d => g.node(d).x));
	        let dx = this._left - l, dy = this._top - t;
	        for (const id of g.nodes()) {
	            nid2pos[id] = {x: g.node(id).x + dx, y: g.node(id).y + dy};
	        }

	        for (let node of this.group.children) {
	            let nid = node.dataScope.getFieldValue(nodeId);
	            node.x = nid2pos[nodeIdHash.get(nid)].x;
	            node.y = nid2pos[nodeIdHash.get(nid)].y;
	        }
	    }
	}

	class StrataLayout extends Layout {

	    constructor(args) {
			super(args);
			this.type = LayoutType.Strata;
			this._direction = args.direction;
			this._rootMark = args.rootMark;
			this._gap = "gap" in args ? args.gap : 0;
		}

	    toJSON() {

	    }

	    clone() {

	    }

	    run() {
	        if (this.group == undefined || !this.group.children || this.group.children.length === 0)
				return;
	        
	        let tree = this.group.firstChild.dataScope.dataTable.tree;
	        if (!tree) return;

	        let nodeId2mark = {};
			for (let item of this.group.children) {
				nodeId2mark[item.dataScope.getFieldValue(nodeId)] = item;
			}

	        if (this._rootMark.type === ItemType.Rect) {
	            this._layoutRects(tree.getRoot(), tree, nodeId2mark);
	        } else if (this._rootMark.type === ItemType.Circle) {
	            this._layoutArcs(tree.getRoot(), tree, nodeId2mark);
	        }
	    }

	    _layoutArcs(node, tree, node2mark) {
			let childrenNodes = tree.getChildren(node);
			if (childrenNodes.length === 0) return;
			let parentMark = node2mark[node[nodeId]];
			let startAngle = parentMark.type == ItemType.Arc || parentMark.type == ItemType.Pie ? parentMark.startAngle : 90;
			for (let i = 0; i < childrenNodes.length; i++) {
				let cn = childrenNodes[i],
					mark = node2mark[cn[nodeId]];
				if (mark.type === ItemType.Arc) {
	                let temp = normalizeAngle(startAngle + mark.angle);
	                // console.log(mark.dataScope.getFieldValue("event_attribute"), mark.startAngle, mark.endAngle, mark.angle);
					
					mark.adjustAngle(startAngle, temp);
					startAngle = temp; 
				}
				this._layoutArcs(cn, tree, node2mark);
			}
	        //console.log("-------------");
		}

	    _layoutRects(node, tree, node2mark) {
	        let childrenNodes = tree.getChildren(node);
			if (childrenNodes.length === 0) return;
			let parentMark = node2mark[node[nodeId]];
	        let x, y;
	        switch (this._direction) {
	            case Direction.Down:
	            default:
	                x = parentMark.left;
	                y = parentMark.bottom;
	                break;
	        }
			for (let i = 0; i < childrenNodes.length; i++) {
				let cn = childrenNodes[i],
					mark = node2mark[cn[nodeId]];
				
	            mark._doTranslate(x - mark.left , y - mark.top);
	            x += mark.width; 
	            this._layoutRects(cn, tree, node2mark);
			}
	    }
	}

	var pixiRenderers = {};

	function scene(args) {
		return new Scene(args);
	}

	function renderer(type, id) {
		switch (type) {
			case "svg":
				return new SVGRenderer(id);
			case "webgl":
				if (!(id in pixiRenderers))
					pixiRenderers[id] = new WebGLRenderer(id);
				return pixiRenderers[id];
			// case "three":
			// 	return new WebGLRenderer2(id);
		}
	}

	function createScale(type, args) {
		if (ScaleType.indexOf(type) < 0) {
			throw new Error(Errors.UNKOWNN_SCALE_TYPE + ": " + type);
		}
		return new Scale(type, args);
	}

	function layout(type, params) {
		let args = params ? params : {};
		switch (type.toLowerCase()) {
			case "grid":
				return new GridLayout(args);
			// case "circular":
			// 	return new CircularLayout(args);
			case "packing":
				return new PackingLayout(args);
			case "treemap":
				return new TreemapLayout(args);
			case "stack":
				return new StackLayout(args);
			case "tidytree":
				return new TidyTreeLayout(args);
			case "force":
				return new ForceLayout(args);
			case "sugiyama":
				return new SugiyamaLayout(args);
			case "strata":
				return new StrataLayout(args);
		}
	}

	function linearGradient(params) {
		let args = params ? params: {};
		return new LinearGradient(args);
	}

	function sceneLoader() {
		return new SceneLoader();
	}

	function specGenerator() {
		return new SpecGenerator();
	}

	function specExecutor() {
		return new SpecExecutor();
	}

	function makeRequest(method, url){
		return new Promise(function(resolve, reject){
			let xhr = new XMLHttpRequest();
			xhr.open(method, url);
			xhr.onload = function() {
				if (this.status >= 200 && this.status < 300) {
					resolve(xhr.response);
				} else {
					reject({
						status: this.status,
						statusText: xhr.statusText
					});
				}
			};
			xhr.onerror = function() {
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			};
			xhr.send();
		});
	}


	async function csv(url) {
		let data = await makeRequest("GET", url);
		let parsed = d3__namespace.csvParse(data.trim(), d3__namespace.autoType);
		return new DataTable(parsed, url);
	}

	async function csvFromFile(data) {
		let parsed = d3__namespace.csvParse(data.trim(), d3__namespace.autoType);
		return new DataTable(parsed, "");
	}

	function csvFromString(data, name) {
		let parsed = d3__namespace.csvParse(data.trim(), d3__namespace.autoType);
		return new DataTable(parsed, name);
	}

	async function treejson(url) {
		let data = await makeRequest("GET", url);
		return new Tree(JSON.parse(data), url);
	}

	async function graphjson(url) {
		let data = await makeRequest("GET", url);
		return new Network(JSON.parse(data), url);
	}

	function csvSync(url, callback) {
		let async = callback? true : false;
		var request = new XMLHttpRequest();
		request.open('GET', url, async);
		request.send();
		if (!async && validResponse(request)) {
			let data = d3__namespace.csvParse(request.responseText.trim(), d3__namespace.autoType);
			return new DataTable(data, url);
		}
	}

	function validResponse(request) {
		var type = request.responseType;
		return type && type !== 'text' ?
			request.response : // null on error
			request.responseText; // '' on error
	}

	function cartesianToPolar(x, y, cx, cy){
		return cartesian2Polar(x, y, cx, cy);
	}

	function polarToCartesian(cx, cy, r, deg){
		return polar2Cartesian(cx, cy, r, deg);
	}

	function inMarkRectHitTest(item, rect, tolerance) {
		let t = tolerance ? tolerance : 2;
		if (isMark(item)) {
			let list = [];
			for (let v of item.vertices) {
				let wd = Math.max(t, v.width, v.radius * 2), ht = Math.max(t, v.height, v.radius * 2);
				list.push({i: v, b: new Rectangle(v.x - wd/2, v.y - ht/2, wd, ht)});
			}
			if (item.type === ItemType.Rect) {
				for (let s of item.segments) {
					let tk = Math.max(item.strokeWidth, t), orientation = s.vertex1.x === s.vertex2.x ? "v" : "h";
					if (orientation === "v")
						list.push({i: s, b: new Rectangle(s.vertex1.x - tk/2, Math.min(s.vertex1.y, s.vertex2.y) - tk/2, tk, Math.abs(s.vertex1.y - s.vertex2.y))});
					else 
						list.push({i: s, b: new Rectangle(Math.min(s.vertex1.x, s.vertex2.x) - tk/2, s.vertex1.y - tk/2,  Math.abs(s.vertex1.x - s.vertex2.x), tk)});
				}
			}

			for (let l of list) {
				if (l.b.overlap(rect))
					return l.i;
			}
			return null;
		} else if (!isGuide(item) && item.children && item.children.length > 0) {
			for (let c of item.children) {
				if (c.bounds.overlap(rect)) {
					let r = inMarkRectHitTest(c, rect, t);
					if (r) return r;
				}
			}
			return null;
		}
		return null;
	}

	function inMarkHitTest(item, x, y, tolerance) {
		// let itm = item, found = false, t = tolerance ? tolerance : 2;
		// while (itm.children && itm.children.length > 0) {
		// 	for (let c of itm.children) {
		// 		if (c.contains(x, y) && !isGuide(c)) {
		// 			itm = c;
		// 			found = true;
		// 			break;
		// 		}
		// 	}
		// 	if (found) {
		// 		found = false;
		// 	} else {
		// 		break;
		// 	}
		// }
		// if (!isMark(itm)) return null;
		let leafMarks = getLeafMarks(item);
		let itm, t = tolerance ? tolerance : 2;
		let ctx = CanvasProvider.getContext();
			
		for (let m of leafMarks) {
			if (!(m instanceof Path)) continue;
			let p = new Path2D(m.getSVGPathData());
			ctx.lineWidth = Math.max(m.strokeWidth, t * 2);
			ctx.stroke(p);
			if (ctx.isPointInStroke(p, x, y)) {
				itm = m;
				break;
			}
		}

		if (!itm) return null;
		
		let list = [];
		for (let v of itm.vertices) {
			let wd = Math.max(t, v.width, v.radius * 2), ht = Math.max(t, v.height, v.radius * 2);
			list.push({i: v, b: new Rectangle(v.x - wd/2, v.y - ht/2, wd, ht)});
		}
		for (let l of list) {
			if (l.b.contains(x, y))
				return l.i;
		}

		if (itm.segments && itm.segments.length > 0) {
			for (let s of itm.segments) {
				let p = new Path2D();
				p.moveTo(s.vertex1.x, s.vertex1.y);
				p.lineTo(s.vertex2.x, s.vertex2.y);
				ctx.lineWidth = Math.max(itm.strokeWidth, t);
				ctx.stroke(p);
				if (ctx.isPointInStroke(p, x, y))
					return s;
			}
		}
		// if (itm.type === ItemType.Rect) {
		// 	for (let s of itm.segments) {
		// 		let tk = Math.max(itm.strokeWidth, t), orientation = s.vertex1.x === s.vertex2.x ? "v" : "h";
		// 		if (orientation === "v")
		// 			list.push({i: s, b: new Rectangle(s.vertex1.x - tk/2, Math.min(s.vertex1.y, s.vertex2.y) - tk/2, tk, Math.abs(s.vertex1.y - s.vertex2.y))});
		// 		else 
		// 			list.push({i: s, b: new Rectangle(Math.min(s.vertex1.x, s.vertex2.x) - tk/2, s.vertex1.y - tk/2,  Math.abs(s.vertex1.x - s.vertex2.x), tk)});
		// 	}
		// }

		
		return null;
	}
	 
	function rectHitTest(item, rect) {
		let result = [];
		if (!item.children || item.children.length == 0) {
			return item.bounds.overlap(rect) && item.type !== ItemType.Scene ? [item] : [];
		}
		for (let i = item.children.length - 1; i >= 0; i--) {
			let c = item.children[i];
			if (c.bounds.overlap(rect))
				result.push(c);
		}
		return result;
	}

	function hitTest(item, x, y) {
		if (!item.children || item.children.length == 0) {
			return item.contains(x, y) && item.type !== ItemType.Scene ? item : null
		}
		for (let i = item.children.length - 1; i >= 0; i--) {
			let c = item.children[i];
			if (c.contains(x, y))
				return c;
		}
		return null;
	}

	function hitTestAll(item, x, y) {
		let items = getLeafItems(item);
		for (let i = items.length - 1; i >= 0; i--) {
			let c = items[i];
			if (c.contains(x, y))
				return c;
		}
		return null;
	}

	function canRepeat(compnt) {
		if ((isMark(compnt) || compnt.type == ItemType.Glyph) && !compnt.dataScope) {
			return true;
		} else if (compnt.type == ItemType.Collection) {
			//TODO: check if repeatable
			return true;
		}
		return false;
	}

	function canDivide(compnt) {
		if ([ItemType.Line, ItemType.Circle, ItemType.Rect, ItemType.Area, ItemType.Ring, ItemType.Pie].indexOf(compnt.type) < 0) {
			return false;
		} 
		if (!compnt.dataScope) {
			return true;
		} else {
			let peers = getPeers(compnt, compnt.getScene());
			for (let p of peers) {
				if (p.dataScope.numTuples > 1)
					return true;
			}
			return false;
		}
	}

	function canDensify(compnt) {
		if ([ItemType.Line, ItemType.Circle, ItemType.Rect, ItemType.Area].indexOf(compnt.type) < 0) {
			return false;
		} 
		if (!compnt.dataScope) {
			return true;
		}
		else {
			let peers = getPeers(compnt, compnt.getScene());
			for (let p of peers) {
				if (p.dataScope.numTuples > 1)
					return true;
			}
			return false;
		}
	}

	function getPeersInScene(item) {
		if (item.type == "vertex" || item.type == "segment") {
			return getPeers(item, item.parent.getScene());
		} else {
			return getPeers(item, item.getScene());
		}
	}

	exports.canDensify = canDensify;
	exports.canDivide = canDivide;
	exports.canRepeat = canRepeat;
	exports.cartesianToPolar = cartesianToPolar;
	exports.createScale = createScale;
	exports.csv = csv;
	exports.csvFromFile = csvFromFile;
	exports.csvFromString = csvFromString;
	exports.csvSync = csvSync;
	exports.getPeersInScene = getPeersInScene;
	exports.graphjson = graphjson;
	exports.hitTest = hitTest;
	exports.hitTestAll = hitTestAll;
	exports.inMarkHitTest = inMarkHitTest;
	exports.inMarkRectHitTest = inMarkRectHitTest;
	exports.layout = layout;
	exports.linearGradient = linearGradient;
	exports.polarToCartesian = polarToCartesian;
	exports.rectHitTest = rectHitTest;
	exports.renderer = renderer;
	exports.scene = scene;
	exports.sceneLoader = sceneLoader;
	exports.specExecutor = specExecutor;
	exports.specGenerator = specGenerator;
	exports.treejson = treejson;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
