var proj = d3.geo.mercator();
var path = d3.geo.path().projection(proj);

var map = d3.select("#map")
    .append("svg:svg")
    .attr("width", 400)
    .attr("height", 500)
    .call(initialize);

var ireland = map.append("svg:g")
  .attr("id", "ireland")
  .attr("class", "Blues");

//testing tooltip
var tooltip = d3.select("#map").append("div")
      .attr("class", "tooltip");
 
myFormat = d3.format(',');

//load the geoJSON file for drawing the map	
 d3.json("./data/ireland.json", function (json) {
  ireland.selectAll("path")
      .data(json.features)
      .enter().append("path")
      .attr("d", path);          
});
 
// load the data      
d3.json("./data/counties.json", function(json) {   //this works
    data = json.reduce(function(result, county) {
        result[county.id] = county;
        return result;
    }, {}); 

    
    ireland.selectAll("path")      
        .attr("class", quantize)  
        .attr("d", path)
     
			
		.on("mouseover", function(d){return tooltip.style("visibility", "visible")
													.html('<b>'+data[d.id].id+'</b><br>Total tax & penalties<br> per 1,000 population<br>for 2012 was <b>&euro;'+
													myFormat(d3.round(data[d.id].amtPerPop))+'</b><br><hr><i>Total value for county<br> was <b>&euro;'+myFormat(d3.round(data[d.id].amount))+'</b></i>');})
		.on("mousemove", function(){return tooltip.style("top", (event.pageY-50)+"px").style("left",(event.pageX-315)+"px");})
		.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
		
	
});
	
function quantize(d) {
  return "q" + Math.min(8, ~~(data[d.id].amtPerPop * 9 / 55000)) + "-9"; 
  
}                                                                      

//setup scale & position of map	
  function initialize() {
  proj.scale(27000);
  proj.translate([799, 5010]);
}