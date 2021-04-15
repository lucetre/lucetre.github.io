var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;
var center = {x: w/2, y: h/2};
var sin = Math.sin, cos = Math.cos, pi = Math.PI;
var dy = [-1,1,0,-1,1,0];
var dx = [1,-1,-1,0,0,1];
var dir = 0;

var ringsA = 6;
var ringsB = 4;
var width = 50;
var height = width * sin(pi/3);
var totalWidth = (ringsA) * width * 0.75;
var totalHeight = (ringsB + ringsA/2) * height * 1.5;
var cells = [];
var showStatus = true;

var cellStatus = {
	unmarked: 0,
	marked: 1,
	done: 2,
}

canvas.onclick = () => {
	showStatus = !showStatus;
}
document.getElementById("autoRestart")

class Cell {
	constructor(sides) {
		this.sides = sides;
		this.status = cellStatus.unmarked;
	}
	drawHex(posx, posy) {
		if (showStatus && this.status != cellStatus.unmarked) {
			if (this.status == cellStatus.marked) {
				ctx.fillStyle = "tomato";
			} else if (this.status == cellStatus.done) {
				ctx.fillStyle = "royalblue";
			}
			ctx.beginPath();
			ctx.arc(posx, posy, 4, 0, pi*2);
			ctx.fill();
		}
		ctx.beginPath();
		ctx.moveTo(posx + width/2 * cos(0), posy + width/2 * sin(0));
		for (let a=0; a<6; a++) {
			let x = posx + width/2 * cos((a+1)*pi/3);
			let y = posy + width/2 * sin((a+1)*pi/3);
			if (this.sides[a])
				ctx.lineTo(x, y);
			else
				ctx.moveTo(x, y);
		}
		ctx.stroke();
	}
}

function fillCells() {
	cells = [];
	for(let c=0; c<=ringsA; c++) {
		let row = [];
		for(let r=0; r<=ringsB; r++) {
            let sides = [1,1,1,1,1,1];
			row.push(new Cell(sides));
		}
		cells.push(row);
	}
}
function drawMap() {
	let xoff = center.x - (ringsA/2)*width*0.75;
	let yoff = center.y - (ringsB/2)*height*1.5;
	
	for(let c=0; c<cells.length; c++) {
		let columnOffset = height/2 * c;
		let x = c * width*0.75 + xoff;
		for(let r=0; r<cells[c].length; r++) {
			if(cells[c][r]) {
				let y = r * height + columnOffset + yoff;
				cells[c][r].drawHex(x, y);
			}
		}
	}
}

function drawCircle(c, r) {
	let xoff = center.x - (ringsA/2)*width*0.75;
	let yoff = center.y - (ringsB/2)*height*1.5;
	let x = c * width * 0.75 + xoff;
	let y = r * height + (c * height * 0.5) + yoff;
	
	ctx.beginPath();
	ctx.arc(x, y, 6, 0, pi*2);
	ctx.stroke();
}

function getNextDir(r, c, prevDir) {
    let ty = r + dy[prevDir];
    let tx = c + dx[prevDir];
    if (ringsA == r && ringsB == c) return -1;
    if (cells[ty] && cells[ty][tx]) return prevDir;
    console.log(r,c);
    if (r*c) return (prevDir+2)%6;
    else if ((dir%2 == 0 && r*(c-1)<0) || (dir%2 && (r-1)*c<0)) return prevDir%2;
    else return (prevDir+4)%6;
    
}
 
var cellStack = [];
function generateMaze() {
	if (cellStack.length == 0) return;
	let coord = cellStack.pop();
	let cell = cells[coord.r][coord.c];
	if (!cell) return;
	cell.status = cellStatus.done;
	let options = [];
    
    dir = getNextDir(coord.r, coord.c, dir);
    if (dir < 0){
		cells[coord.r][coord.c].status = cellStatus.done;
        console.log('done');
    }
    else {
        let ty = coord.r + dy[dir];
        let tx = coord.c + dx[dir];
        cellStack.push({r: ty, c: tx});
    }
}

var type = 0;
function loop(timestamp) {
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,w,h);
	drawCircle(cellStack[cellStack.length-1].r, cellStack[cellStack.length-1].c);
	generateMaze();
	drawMap();
	if (cellStack.length != 0) {
		setTimeout(loop, 50);
// 		window.requestAnimationFrame(loop);
    }
 	else if (!type) {
        type = !type;
 		setTimeout(setup1, 2000);
    }
    else {
        type = !type;
 		setTimeout(setup0, 2000);
    }
}

function setup0() {
	ctx.fillStyle = "tomato";
    dir = 0;
	cellStack.push({r:ringsA, c:(0)});
	fillCells();
	loop();
}

function setup1() {
	ctx.fillStyle = "tomato";
    dir = 1;
	cellStack.push({r:0, c:ringsB});
	fillCells();
	loop();
}

setup0();


