var choice = [1];
var prev = 1;
var n = Math.round(1.5 + Math.random()*4);
for (var i = 1; i < n; i++) {
    var newChoice = prev + Math.round(0.5 + Math.random()*4);
    prev = newChoice;
    choice.push(newChoice);
}

// var choice = [1, 2];
// var n = 2;

var m = Math.round(15.5 + Math.random()*5);

var nim = new Array(m+1).fill(false);
for (var i = 1; i <= m; i++) {
    var flag = false;
    for (var j = 0; j < n; j++) {
        var index = i - choice[j];
        if (index >= 0) {
            flag |= !nim[index];
        }
    }
    nim[i] = flag;
}
// console.log(nim);

class NimModel {
  constructor(numHeaps, minHeapSize, maxHeapSize) {
    this.numHeaps = numHeaps;
    this.minHeapSize = minHeapSize;
    this.maxHeapSize = maxHeapSize;
    this.currentPlayer = 0;
    this.makeHeaps(this.numHeaps, this.maxHeapSize);
    this.isActive = true;
  }

  makeHeaps(numHeaps, minHeapSize, maxHeapSize) {
    this.heaps = new Array();
    for (var i = 0; i < this.numHeaps; ++i) {
      this.heaps.push(new Array());
      var heapSize = m;
      for (var j = 0; j < heapSize; ++j) {
      	this.heaps[i].push(j);
      }
    }
  }
  
  reset() {
    this.currentPlayer = 0;
    this.makeHeaps(this.numHeaps, this.minHeapSize, this.maxHeapSize);
    this.isActive = true;
  }
  
  move(selection) {
  	if (this.isActive && selection) {
      var range = selection.x[1] - selection.x[0];
      if (choice.indexOf(range) == -1) {
          return {status: 'error', message: 'invalid selection!', left: this.heaps[0].length};
      }
  	  this.heaps[0].splice(selection.x[0], range);    	
      this.isActive = !this.heaps.every(function(heap) {
                         return heap.length === 0;
                       });
      if (this.isActive) {
        ++this.currentPlayer; this.currentPlayer %= 2;
        return {status: 'next_move', state: this.currentPlayer, left: this.heaps[0].length}
      }
    } else if (this.isActive) {
      return {status: 'error', message: 'empty selection!', left: this.heaps[0].length};
    } 
    if (!this.isActive) {
      return {status: 'game_over', state: this.currentPlayer, left: this.heaps[0].length};
    }
  }
}

class NimView {
  constructor(mountNode, width, height) {	
    this.mountNode = d3.select(mountNode).append('svg');
    this.width = width; this.height = height;
    this.currentSelection = null;
    this.mountNode
    .attr('width', '100%')
    .attr('height', this.height)
    var element = d3.select('svg').node();
    this.width = element.getBoundingClientRect().width;
    this.x = d3.scaleBand().padding(0.15).range([0, this.width]);
    this.y = d3.scaleBand().range([0, this.height]);
  }
  
  initialize(nimModel) {
    var self = this;
    this.nimModel = nimModel;
  	this.mountNode.selectAll('*').remove();
    // data-driven domains
    var maxHeapSize = d3.max(this.nimModel.heaps, function(heap) { return d3.max(heap); }) + 1;
    var xDomain = new Array();
    for (var i = 0; i < maxHeapSize; ++i) xDomain.push(i);
    this.x.domain(xDomain);
    
    var yDomain = new Array();
    for (var i = 0; i < this.nimModel.numHeaps; ++i) yDomain.push(i);
    this.y.domain(yDomain);

    var x = this.x;
    var y = this.y;
    var heaps = this.nimModel.heaps;
    var heapGroups = new Array();
    var heapBrushes = new Array();
    var brushIsActive = false;
    
    this.mountNode.selectAll('g.heap')
    .data(yDomain).enter()
    .append('g').attr('class', 'heap')
    .attr('width', this.width)
    .attr('height', this.y.bandwidth())
    .attr('transform', function(d) {
      return 'translate(0,' + y(d) + ')';
    }).each(function(d, i) {
      heapGroups.push(d3.select(this));
      var heapBrush = d3.brushX()
                      .extent([[0, 0], [self.width, y.bandwidth()]])
                      .on('end', function(d) {
                        if (brushIsActive || nimModel.currentPlayer) return;
                        brushIsActive = true;
                        for (var i = 0; i < heapGroups.length; ++i) {
                          if (i != d) {                            
                            heapBrushes[i].move(heapGroups[i], null);
                          }
                        }
                        if (d3.event.selection) {
                          var l = -1, r = -1;
                          for (var i = 0; i < heaps[d].length; ++i) {
          	                if (l == -1 && x(i) >= d3.event.selection[0]) l = i;
                            if (l != -1 && x(i) + x.bandwidth() <= d3.event.selection[1]) r = i + 1;
                          }
                          // selected range is [l,r)
                          if (l != -1 && r != -1 && l < r) {
          	                heapBrushes[d].move(heapGroups[d], [x(l) - x.padding()*x.step(), x(r-1) + x.bandwidth() + x.padding()*x.step()]);
                            self.currentSelection = {x: [l, r], y: d};
                          } else {
          	                heapBrushes[d].move(heapGroups[d], null);
                            self.currentSelection = null;
                          }
                        } else {
                          self.currentSelection = null;
                        }
                        brushIsActive = false;
                        if (self.currentSelection) {
                            var range = self.currentSelection.x[1] - self.currentSelection.x[0];
                            var button = d3.select('button.nim').text('Take ' + range);
                            if (range === 0 || choice.indexOf(range) === -1)
                                button.attr('disabled', true);
                            else button.attr('disabled', null);
                        }
                        else {
                            d3.select('button.nim').text('Take').attr('disabled', true);
                        }
                      });
      heapBrushes.push(heapBrush);
    });
    this.heapGroups = heapGroups;
    this.heapBrushes = heapBrushes;
  }
  
  render() {
  	var x = this.x;
    var y = this.y;
    var data = new Array();
 	for (var i = 0; i < y.domain().length; ++i) {
      var matchSelection = this.heapGroups[i].selectAll('rect.match')
                           .data(this.nimModel.heaps[i], function(d) { return d; });
      // match selection exit
      matchSelection.exit().style('opacity', 1)
      .transition().duration(500)
      .style('opacity', 0)
      .remove();
      // update
      matchSelection
      .transition().duration(500)
      .attr('x', function(d, idx) { return x(idx); })  
      
      // enter
      matchSelection
      .enter()
      .append('rect')
      .attr('x', function(d, idx) { return x(idx); })
      .attr('y', 5)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth()-10)
      .attr('class', 'match')

      .style('opacity', 0)
      .transition().duration(500)
      .style('opacity', 1);
      this.heapGroups[i].call(this.heapBrushes[i]);
    }
  }
  
  clearSelection() {
  	for (var i = 0; i < this.y.domain().length; ++i) {
      this.heapBrushes[i].move(this.heapGroups[i], null);
    }
    this.currentSelection = null;
  }
}

class NimController {
  constructor(nimModel, nimView, mountNode, width, height) {
    this.mountNode = d3.select(mountNode)
                     .append('div')
                     .attr('id', 'nim-controller')
                     .style('display', 'inline-block')
                     .style('width', '100%')
                     .style('height', 'auto');
    
    var controls = this.mountNode.append('div').style('text-align', 'center');
    var msg = nimModel.currentPlayer ? "Computer's turn!" : "Your turn!";
    
    var status = controls.append("h3")
                 .attr("id", "status")
                 .html(""+ m +" stones left, "+msg);
    
    function computerTurn() {
      ++nimView.currentPlayer; nimView.currentPlayer %= 2;
      setTimeout(() => {
          var length = nimModel.heaps[0].length;
          var initial = Math.floor(Math.random()*n);
          var range = choice[initial];
          if (length < choice[initial])
              range = choice[0]
          for (var i = 0; i < n; i++)
              if (length >= choice[i] && nim[length - choice[i]] == false)
                  range = choice[i];
          d3.select('button.nim').text('Take '+range).attr('disabled', true);
          var l = Math.floor(Math.random()*(length-range));
          var x = nimView.x;
          var r = l + range;
          nimView.currentSelection = {x: [l, l+range], y: 0};
          nimView.heapBrushes[0].move(nimView.heapGroups[0], [x(l) - x.padding()*x.step(), x(r-1) + x.bandwidth() + x.padding()*x.step()]);

          setTimeout(() => {
              var moveStatus = nimModel.move(nimView.currentSelection);
            
              if (moveStatus.status === 'game_over') {
                status.classed('success', true);
                status.html("Computer won!");
                nimView.clearSelection();
                nimView.render();

                d3.select('button.nim').text('Play again').attr('disabled', null)
                .on('click', function() {
                  nimModel.reset();
                  nimView.initialize(nimModel);
                  nimView.render();
                  d3.select('button.nim').text('Take').attr('disabled', true)
                  .on('click', onClick);
                  status.html(""+ m +" stones left, Your turn!");
                  status.classed("success", false);
                });
              }
              else {
                status.html(""+ moveStatus.left +" stones left, Your turn!");
                nimView.clearSelection();
                nimView.render();
                d3.select('button.nim').text('Take').attr('disabled', true)
                .on('click', onClick);
              }
          }, 1500);
      }, 1000);
    }
      
    function onClick() {
      d3.select('button.nim').text('Take').attr('disabled', true);
   	  var moveStatus = nimModel.move(nimView.currentSelection);
      nimView.clearSelection();
      nimView.render();
      if (moveStatus.status === 'error') {
        status.classed('error', true);
        if (moveStatus.state) status.html(""+ moveStatus.left +" stones left, Computer's turn!");//+ moveStatus.message);
        else status.html(""+ moveStatus.left +" stones left, Your turn!");//+ moveStatus.message);
      } else {
      	status.classed('error', false);
      } 
      if (moveStatus.status === 'next_move') {
          if (moveStatus.state) { 
              status.html(""+ moveStatus.left +" stones left, Computer's turn!");
              computerTurn();
          }
          else status.html(""+ moveStatus.left +" stones left, Your turn!");
      }
      if (moveStatus.status === 'game_over') {
        status.classed('success', true);
          
        if (moveStatus.state) status.html("No stones left, Computer won!");
        else status.html("No stones left, You won!");
          
        d3.select(this).text('Play again').attr('disabled', null)
        .on('click', function() {
          nimModel.reset();
          nimView.initialize(nimModel);
          nimView.render();
          d3.select(this).text('Take').attr('disabled', true)
          .on('click', onClick);
          status.html(""+ m +" stones left, Your turn!");
          status.classed("success", false);
        });
      }
    }
    var w= d3.select('svg').node().getBoundingClientRect().width;
    controls.append("button").classed('button is-primary nim', true)
    .text("Take")
    .attr("width", w)
    .attr('disabled', true)
    .on('click', onClick);
    controls.append('br');
  }
}

var nimModel = new NimModel(1, 22, 28);
var nimView = new NimView(document.getElementById('canvas_nim'), 700, 30);
nimView.initialize(nimModel);
nimView.render();
var nimController = new NimController(nimModel, nimView, 
                                      document.getElementById('canvas_nim'), 700, 100);


// Create data
var num = choice.length;
var myColor = d3.scaleOrdinal().domain(choice).range(d3.schemeSet3);
var svg = d3.select("#legend").append("svg")
    .attr("width", '100%')
    .attr("height", 40)

    /* Define the data for the circles */
    var elem = svg.selectAll("g")
        .data(choice)

    /*Create and place the "blocks" containing the circle and the text */  
    var elemEnter = elem.enter()
        .append("g")
        .attr("transform", function(d, i){
            var center = svg.node().getBoundingClientRect().width / 2;
            var pos = center + (i - (n-1)/2.0) * 40
            return "translate("+pos+",20)"
        })

    /*Create the circle for each block */
    var circle = elemEnter.append("circle")
        .attr("r", function(d){return 17} )
//         .attr("stroke", "black")
        .attr("fill", function(d){return myColor(d+3) })

    /* Create the text for each block */
    elemEnter.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", 15)
        .attr("font-weight", 'bolder')
        .attr("dy", 6)
        .text(function(d){return d})