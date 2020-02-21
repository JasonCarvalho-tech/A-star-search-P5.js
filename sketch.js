function removeFromArray(arr, elt) {
	for(var i = arr.length - 1; i >= 0; i--){ //you go through it backwards cause it might skip an element when you delete as the index cahnges
		if (arr[i] == elt) {
			arr.splice(i, 1);
		}
	}
}

function heuristic(a, b) {
	var d = dist(a.i, a.j, b.i, b.j);
	// var d = abs(a.i - b.i) + abs(a.j - b.j);
	return d;
}

var len;
var cols = 50;
var rows = 50;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path = [];
var noSolution = false;

function Spot(i, j) {
	//each spots co-ordinates
	this.i = i;
	this.j = j;

	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.neighbours = [];
	this.previous = undefined;
	this.wall = false;

	if (random(1) < 0.4) {
		this.wall = true;
	}

	this.show = function(col) {
		if (this.wall) {
			fill(200);
			noStroke();
			ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
		} else if (col) {
			fill(col);
			rect(this.i * w, this.j * h, w, h);
		}
	}

	this.addNeighbours = function(grid) {
		var i = this.i;
		var j = this.j;

		if (i < cols - 1) {
			this.neighbours.push(grid[i + 1][j]);
		}
		if (i > 0) {
			this.neighbours.push(grid[i - 1][j]);
		}
		
		if (j < cols - 1) {
			this.neighbours.push(grid[i][j + 1]);
		}
		if (j > 0){
			this.neighbours.push(grid[i][j - 1]);
		}

		if (i > 0 && j > 0) {
			this.neighbours.push(grid[i - 1][j - 1]);
		}
		if (i < cols - 1 && j > 0) {
			this.neighbours.push(grid[i + 1][j - 1]);
		}
		if (i > 0 && j < rows - 1) {
			this.neighbours.push(grid[i - 1][j + 1]);
		}
		if (i < cols - 1 && j < rows - 1) {
			this.neighbours.push(grid[i + 1][j + 1]);
		}
	}
}


function setup() {
	if (windowWidth > windowHeight) {
		len = windowHeight - 100; 
	} else {
		len = windowWidth - 20;
	}
	var canvas = createCanvas(len,len);
	canvas.parent('sketch-holder');
	w = width / cols;
	h = height / rows;

	//making a 2D array
	for (var i = 0; i<cols; i++) {
		grid[i] = new Array(rows);
	}

	for (var i = 0; i<cols; i++) {
		for (var j = 0; j<rows; j++) {
			grid[i][j] = new Spot(i, j);
		}
	}

	for (var i = 0; i<cols; i++) {
		for (var j = 0; j<rows; j++) {
			grid[i][j].addNeighbours(grid);
		}
	}

	start = grid[0][0];
	end = grid[cols - 1][rows - 1];
	start.wall = false;
	end.wall = false;

	openSet.push(start);
}


function draw() {
	if (openSet.length > 0) {

		// choosing the node
		var winner = 0;
		for (var i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[winner].f) {
				winner = i;
			}
		}
		var current = openSet[winner]
		
		if (current === end) {
			createDiv('<p id="result" style="color: #00ff00;">Solved :)<br> Click New to redo</p>').parent("out");
			noLoop();
			console.log("Done!!!");
		}

		removeFromArray(openSet, current)

		closedSet.push(current);

		var neighbours = current.neighbours;
		for(var i = 0; i<neighbours.length; i++) {
			var neighbour = neighbours[i];

			if (!closedSet.includes(neighbour) && !neighbour.wall) {
				var tempG = current.g + 1;

				var newPath = false
				if(openSet.includes(neighbour)) {
					if(tempG < neighbour.g){
						neighbour.g = tempG;
						newPath = true;
					}
				} else {
					neighbour.g = tempG;
					openSet.push(neighbour);
					newPath = true;
				}

				if (newPath == true) {
					neighbour.h = heuristic(neighbour, end);
					neighbour.f = neighbour.g + neighbour.h;
					neighbour.previous = current;
				}
			}

			neighbour.g = current.g + 1;
		}

	} else {
		noSolution = true;
		noLoop();
		createDiv('<p id="result" style="color: rgb(200,0,255);">No solution :( <br> Click New to redo</p>').parent("out");
		return;
		//no solution
	}

	background(0);

	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			grid[i][j].show();
		}
	}

	// for debugging
	//for (var i = 0; i < closedSet.length; i++) {
	//	closedSet[i].show(color( 255, 0, 0, 90));
	//}
//
	//for (var i = 0; i < openSet.length; i++) {
	//	openSet[i].show(color( 0, 255, 0, 90));
	//}

	path = [];
		var temp = current;
		path.push(temp);
		while(temp.previous) {
			path.push(temp.previous);
			temp = temp.previous;
	}


	//for (var i = 0; i < path.length; i++) {
	//	path[i].show(color(0, 0, 255));
	//}

	noFill();
	stroke(0,191,255);
	strokeWeight(w / 2);
	beginShape();
	for (var i = 0; i < path.length; i++) {
		vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
	}
	endShape();
}