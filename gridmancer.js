// Some quick hacked-together code for solving the gridmancer coding
// challenge at http://codecombat.com/play/level/gridmancer.
var tileSize = 4;

var makeGrid = function() {
	var grid = [],
		navGrid = this.getNavGrid().grid,
		height = ~~(navGrid.length / tileSize),
		width = ~~(navGrid[0].length / tileSize);
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			grid[y] = grid[y] || [];
			grid[y].push(!!navGrid[y*tileSize][x*tileSize].length);
		}
	}
	return grid;
};
makeGrid = makeGrid.bind(this);

var drawGrid = function(grid) {
	grid.rectangles.forEach(drawRectangle);
};
drawGrid = drawGrid.bind(this);

var drawRectangle = function(rect) {
	this.addRect(
		(rect.x * tileSize) + ((rect.width * tileSize) / 2),
		(rect.y * tileSize) + ((rect.height * tileSize) / 2),
		(rect.width * tileSize),
		(rect.height * tileSize));
	this.wait();
};
drawRectangle = drawRectangle.bind(this);

var fillGrid = function(grid) {
	grid.rectangles = [];
	for (var y = 0; y < grid.length; y++) {
		for (var x = 0; x < grid[0].length; x++) {
			if (!grid[y][x]) {
				this.growRectangle(x, y, grid);
			}
		}
	}
};
fillGrid = fillGrid.bind(this);

this.growRectangle = function(x, y, grid) {
	var rect = {
		x: x,
		y: y,
		width: 0,
		height: 0
	}, x2, y2, heightFound, widthFound, toggle;
	while (!(heightFound && widthFound)) {
		if (toggle) {
			rect.width++;
			x2 = rect.x + rect.width - 1;
			for (y2 = rect.y; y2 < rect.y+rect.height; y2++) {
				if (x2 >= grid[0].length || grid[y2][x2]) {
					rect.width--;
					widthFound = true;
					break;
				}
			}
		} else {
			rect.height++;
			y2 = rect.y + rect.height - 1;
			for (x2 = rect.x; x2 < rect.x+rect.width; x2++) {
				if (y2 >= grid.length || grid[y2][x2]) {
					rect.height--;
					heightFound = true;
					break;
				}
			}
		}
		toggle = !toggle;
	}
	for (var y3 = rect.y; y3 < rect.y + rect.height; y3++) {
		for (var x3 = rect.x; x3 < rect.x + rect.width; x3++) {
			grid[y3][x3] = true;
		}
	}
	grid.rectangles.push(rect);
};

var grid = makeGrid();
fillGrid(grid);
drawGrid(grid);
this.say("Delicious. Did it in "+this.spawnedRectangles.length+" rectangles");
