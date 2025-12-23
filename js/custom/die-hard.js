var canvas = document.getElementById("die-hard");
var article = document.getElementsByClassName('content')[0];
let bottle1 = document.getElementById("bottle1");
let bottle2 = document.getElementById("bottle2");

let run = 1;
var ringsA = 5;
var ringsB = 3;
var width = 40;
var sin = Math.sin, cos = Math.cos, pi = Math.PI;
var height = width * sin(pi/3);

var ctx = canvas.getContext("2d");
var w = canvas.width = article.offsetWidth;
var h = canvas.height = parseInt((ringsB+1 + (ringsA+1)/2) * height) + 10;

var center = {x: w/2, y: h/2};
var dy = [-1,1,0,-1,1,0];
var dx = [1,-1,-1,0,0,1];
var dir = 0;

var inner = width / 10;
var outer = inner * 2;
var totalWidth = (ringsA) * width * 0.75;
var totalHeight =  ((ringsB + ringsA/2))*height;
var cells = [];
var showStatus = true;

var cellStatus = {
	unmarked: 0,
	marked: 1,
	done: 2,
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
			ctx.arc(posx, posy, inner, 0, pi*2);
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
	let yoff = center.y - totalHeight/2 + 10;
  
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
  
	ctx.font = '17px ubuntu';
    ctx.fillStyle = "tomato";
	for(let c=0; c<cells.length; c++) {
		let columnOffset = height/2 * c;
		let x = c * width*0.75 + xoff; 
        let r = -1;
        let y = r * height + columnOffset + yoff;
        ctx.textAlign = 'center';
        ctx.fillText(c, x, y+10);
	}
       
	for(let r=0; r<cells[0].length; r++) {
        let c = -1;
        let columnOffset = height/2 * c;
		let x = c * width*0.75 + xoff; 
        let y = r * height + columnOffset + yoff;
        ctx.textAlign = 'right';
        ctx.save();
        ctx.translate(x+5, y+10);
        ctx.rotate(+pi/6);
        ctx.fillText(r, 0, 0);
        ctx.restore();
	}
    ctx.restore();
}

function drawCircle(c, r) {
	let xoff = center.x - (ringsA/2)*width*0.75;
	let yoff = center.y - totalHeight/2 + 10;
	let x = c * width * 0.75 + xoff;
	let y = r * height + (c * height * 0.5) + yoff;
	
	ctx.beginPath();
	ctx.arc(x, y, outer, 0, pi*2);
	ctx.stroke();
}

function getNextDir(r, c, prevDir) {
    let ty = r + dy[prevDir];
    let tx = c + dx[prevDir];
    if (ringsA == r && ringsB == c) return -1;
    if (cells[ty] && cells[ty][tx]) return prevDir;
    if (r*c) return (prevDir+2)%6;
    else if ((dir%2 == 0 && r*(c-1)<0) || (dir%2 && (r-1)*c<0)) return prevDir%2;
    else return (prevDir+4)%6;
    
}
 
var cellStack = [];
let brk = false;
function generateMaze() {
	if (cellStack.length == 0 || cells.length == 0) return;
	let coord = cellStack.pop();
	let cell = cells[coord.r][coord.c];
	if (!cell) return;
	cell.status = cellStatus.done;
	let options = [];
    
  
    let bottomA = parseInt(coord.r/ringsA*100+5)+"%";
    var styleA = document.getElementsByClassName('diehard-box')[0].style;
    styleA.setProperty('--bottomA', bottomA, "important");
  
    let bottomB = parseInt(coord.c/ringsB*100+5)+"%";
    var styleB = document.getElementsByClassName('diehard-box')[1].style;
    styleB.setProperty('--bottomB', bottomB, "important");
      
    let B = document.getElementsByClassName("diehard-gal");
    B[0].innerHTML = coord.r;
    B[1].innerHTML = coord.c;
  
    let nextDir = getNextDir(coord.r, coord.c, dir);
    brk = (dir != nextDir);
  
    if ((dir = nextDir) < 0){
		cells[coord.r][coord.c].status = cellStatus.done;
        //console.log('done');
    }
    else {
        let ty = coord.r + dy[dir];
        let tx = coord.c + dx[dir];
        cellStack.push({r: ty, c: tx});
    }
}

let curTimeOut;
var type = 0;
function loop(flag) {
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,w,h);
	if (cellStack.length == 0 || cells.length == 0) return;
  
	drawCircle(cellStack[cellStack.length-1].r, cellStack[cellStack.length-1].c);
    generateMaze();
	drawMap();
    if (!run) return;
	if (cellStack.length != 0) {
		curTimeOut = setTimeout(loop, (brk || flag) ? 1000 : 100);
    }
 	else if (!type) {
        type = !type;
 		curTimeOut = setTimeout(setup1, 1000);
    }
    else {
        type = !type;
 		curTimeOut = setTimeout(setup0, 1000);
    }
}

function setup0() {
	ctx.fillStyle = "tomato";
    dir = 0;
	cellStack.push({r:ringsA, c:0});
	fillCells();
	loop(1);
}

function setup1() {
	ctx.fillStyle = "tomato";
    dir = 1;
	cellStack.push({r:0, c:ringsB});
	fillCells();
	loop(1);
}

function init(jug1, jug2) {
    if (jug1 != -1) ringsA = parseInt(jug1);
    if (jug2 != -1) ringsB = parseInt(jug2);
    bottle1.style.height = 30 + ringsA*20 + "px";
    bottle2.style.height = 30 + ringsB*20 + "px";

    let B = document.getElementsByClassName("diehard-gal");
    B[0].innerHTML = ringsA;
    B[1].innerHTML = ringsB;
    
    if (run) {
        run = 0;
        clearInterval(curTimeOut);
        setTimeout(() => {
          h = canvas.height = parseInt((ringsB+1 + (ringsA+1)/2) * height) + 10;
          cellStack = [];
          cells = [];
          type = 0;
          run = 1;
          setup0();
        }, 100);
    }
}

init(-1, -1);


