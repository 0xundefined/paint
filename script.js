var canvasFront = document.getElementById('front-canvas'),
	canvasBack = document.getElementById('back-canvas'),
	ctx = []
		
var canvasArr = [],
	canvasArrThumbNails = [],
	ctxThumbNails = [],
	hr = [],
	painInTheArse = document.getElementById('layerThumbNails'),
	yesOrNo,
	newLayer = document.getElementById('new-layer'),
	removeLayer = document.getElementById('remove-layer'),
	layerSelect = 0
	redRange = document.getElementById('red')
	greenRange = document.getElementById('green')
	blueRange = document.getElementById('blue')
	
var comp = document.getElementById('compCan'),
	ctxComp = comp.getContext('2d'),
	saveBtn = document.getElementById('saveButton')
	
var canvasPosition

var mouseX, mouseY, mouseXDown, mouseYDown, cX, cY, selecting = null, selecting2 = null, selectDrop = 0,
	cursorImg = document.getElementById("cursor")
	
var tools = [], toolsOpt = []

tools.pencil = document.getElementById('pencil')
tools.eraser = document.getElementById('eraser')
tools.hand = document.getElementById('hand')
tools.paint = document.getElementById('paintBucket')
tools.eyeDrop = document.getElementById('eyeDropper')
tools.drawShapes = document.getElementById('shapes')
tools.drawText = document.getElementById('textTool')
tools.sprayPaint = document.getElementById('sprayCan')

toolsOpt.pencil = document.getElementById('pencilOpt')
toolsOpt.eraser = document.getElementById('eraserOpt')
toolsOpt.hand = document.getElementById('handOpt')
toolsOpt.paint = document.getElementById('paintBucketOpt')
toolsOpt.eyeDrop = document.getElementById('eyeDropperOpt')
toolsOpt.drawShapes = document.getElementById('shapesOpt')
toolsOpt.drawText = document.getElementById('textToolOpt')
toolsOpt.sprayPaint = document.getElementById('sprayCanOpt')
toolsOpt.color = document.getElementById('colorChoice')
toolsOpt.size = document.getElementById('brushSize')
toolsOpt.colorPreview = document.getElementById('colorPreview')

var toolSize = document.getElementById('sizeRange'),
	activeColor;

toolSize.oninput = function() {
	canvasFront.onmouseover()
	document.styleSheets[0].addRule('#size::-webkit-slider-thumb',
		'height: ' + Math.floor(toolSize.value/20 + 10) + 'px; width:'
	  + Math.floor(toolSize.value/20 + 10) + 'px; margin-top: -'
	  + Math.floor(toolSize.value/40 + 5) + 'px'); 
		document.styleSheets[0].insertRule('#size::-webkit-slider-thumb {height: ' 
		+ Math.floor(toolSize.value/20 + 10) + 'px; width:' 
		+ Math.floor(toolSize.value/20 + 10) + 'px; margin-top: -'+
		Math.floor(toolSize.value/40 + 5) + 'px }');
	document.getElementById('sizeDisplay').innerHTML = toolSize.value
	
}

window.onload = function() {
	hr[0] = document.getElementById('10')
	canvasPosition = canvasBack.getBoundingClientRect()
	newLayer.onclick()
	penclick()
	redRange.value = '0';
	blueRange.value = '0'
	greenRange.value = '0'
	canvasFront.onmouseover()
	tools.pencil.onmousedown()
	update2()
	setTimeout(closeLogo, 1600);
}

function closeLogo() {
	$("#logo").fadeOut(300);
}

window.onresize = function() {
	canvasPosition = canvasBack.getBoundingClientRect()
}

window.onmousemove = function(e) {
	$("#cursor").css({"left":e.clientX - 1 - cursorImg.width/2,"top":e.clientY - 1 - cursorImg.height/2})
	
	selecting = selecting2
	
	if (selecting!=null){
		for (var item in hr){
			if (hr[item]){
				if (e.clientY > (item*95 + 120) & e.clientY < (item*95 + 215)){
					clear2()
					hr[item].style.borderColor = "#DBDBDB"
					if (zInds.indexOf(selecting) < item)
						selectDrop = item-1
					else
						selectDrop = item;
	}}}}
}

function clear2() {
		for (var item in hr) 
			hr[item].style.borderColor = "transparent"
	}
	
window.onmouseup = function(e) {
	if (selecting!=null)
		reLayerSomething()
	selecting = null; selecting2 = null;
	clear2()
}

canvasFront.onmousemove = function(e) {
	mouseX = e.clientX - canvasPosition.left
	mouseY = e.clientY - canvasPosition.top
}

document.onkeydown = checkKey

function checkKey(e){
	e = e || window.event
	
	if (e.keyCode == 221){ //[	--decreases brush size
		if (toolSize.value < 250){
			toolSize.value = parseInt(toolSize.value, 10) + 1
			toolSize.oninput()
			canvasFront.onmousemove(e)
			canvasFront.onmouseover()
			$("#cursor").css({"left":mouseX - 1 - cursorImg.width/2,"top":mouseY - 1 - cursorImg.height/2})
			}
	}
	if (e.keyCode == 219){ //]    --increases brush size
		if (toolSize.value > 0){
			toolSize.value -= 1
			toolSize.oninput();
			canvasFront.onmousemove(e)
			canvasFront.onmouseover()
			$("#cursor").css({"left":mouseX - 1 - cursorImg.width/2,"top":mouseY - 1 - cursorImg.height/2})
			}
	}
	if (e.keyCode == 80){ //p   --selects the pencil tool 
		processing = false
		tools.pencil.onclick()
		canvasFront.onmouseover() //working on hotkeys
		tools.pencil.onmousedown()
	}
	if (e.keyCode == 69){ //e     --selects the eraser tool 
		processing = false
		tools.eraser.onclick()
		canvasFront.onmouseover()
		tools.eraser.onmousedown()
	}

	if(e.keyCode == 83) { //s  --selects the spray can
		processing=false
		tools.sprayPaint.onclick()
		cavasFront.onmouseover()
		tools.eraser.onmousedown()
	}

	if (e.keyCode == 38){ //up arrow   --changes the selected layer
		if (layerSelect+1 > 1){
			layerSelect = layerSelect-1
			deselect()
			canvasArrThumbNails[layerSelect].style.border = "thin solid blue"
		}
	}
	if (e.keyCode == 40){ //down arrow    --changes the selected layer
		if (layerSelect+1 < canvasArr.length){
			layerSelect = layerSelect+1
			deselect()
			canvasArrThumbNails[layerSelect].style.border = "thin solid blue"
		}
	}
	if (e.keyCode == 46){ //delete    --take a guess what this does
		removeLayer.onclick()
	}
}

addAllHandlers(tools, "tool-active")

	function addAllHandlers(arr, className){
		for (var item in arr) {
			arr[item].onmousedown = addHandler(arr[item], arr, className)
		}
	}

	function addHandler(element, arr, className) {
		return function() {
			removeAllClasses(arr)
			element.setAttribute("class", className)
		}
	}

	function removeAllClasses(arr) {
		for (var item in arr) {
			arr[item].removeAttribute("class")
		}
	}

saveBtn.onclick = function() {
		alert("Saving a file requires a server host (Sean's code)")

	}

document.getElementById("openButton").onclick = function() { alert("Opening a file requires a server host (Sean's code)") }

document.getElementById('clearButton').onclick = function() {
	var abc = canvasArr.length
	document.getElementById('RUSure').style.display = "block"
	
	if (yesOrNo){
		for (var i=0;i<abc;i++)
			removeLayer.onclick()
		
		newLayer.onclick()
		
		yesOrNo = false
		document.getElementById('RUSure').style.display = "none"
	}
}


newLayer.onclick = function () {
	if (canvasArr.length < 5){
		canvasArr.push("layer" + canvasArr.length)
		canvasArrThumbNails.push("layer" + canvasArrThumbNails.length)
		selectorRefresh()
		
		canvasArr[layerSelect] = document.createElement("canvas")
		canvasArr[layerSelect].style.position = "absolute"
		canvasArr[layerSelect].style.boxSixing= "border-box"
		canvasArr[layerSelect].width = 500
		canvasArr[layerSelect].height = 500
		canvasArr[layerSelect].style.background = "none"
		canvasArr[layerSelect].style.zIndex = canvasArr.length+1
		document.getElementById('insert').appendChild(canvasArr[layerSelect])

		canvasArrThumbNails[layerSelect] = document.createElement("canvas")
		canvasArrThumbNails[layerSelect].className = "thumbNail"
		canvasArrThumbNails[layerSelect].setAttribute("title", "Use Up and Down arrows to select")
		painInTheArse.appendChild(canvasArrThumbNails[layerSelect])
		
		hr[layerSelect+1] = document.createElement("HR")
		hr[layerSelect+1].style.width = "80%" //adding drag menun select thingy
		hr[layerSelect+1].style.borderColor = "transparent"
		hr[layerSelect+1].style.marginTop = "1px"
		// hr[layerSelect].style.display = "none"
		painInTheArse.appendChild(hr[layerSelect+1])
		
		canvasFront.style.zIndex = canvasArr.length+2
		
		ctx[layerSelect] = canvasArr[layerSelect].getContext('2d')
		ctxThumbNails[layerSelect] = canvasArrThumbNails[layerSelect].getContext('2d')
		ctxThumbNails[layerSelect].scale(0.6,0.3)
		deselect()
		canvasArrThumbNails[layerSelect].style.border = "thin solid blue"
		
		canvasArrThumbNails[layerSelect].ind = layerSelect
		
		canvasArrThumbNails[layerSelect].onmousedown = function(){
			var rect = canvasArrThumbNails[layerSelect].getBoundingClientRect()
			deselect()
			layerSelect = this.ind
			this.style.border = "thin solid blue"
			selecting2 = this.ind
		}
		
		zInds = move(zInds, zInds[layerSelect], layerSelect)
		
		document.getElementById('noLayers').style.display = "none"
	}
}

removeLayer.onclick = function() {
	if (canvasArr){
		document.getElementById('insert').removeChild(canvasArr[layerSelect])
		ctx.splice(layerSelect, 1)
		canvasArr.splice(layerSelect, 1)
		canvasFront.style.zIndex = canvasArr.length+3
		
		document.getElementById('layerThumbNails').removeChild(canvasArrThumbNails[layerSelect])
		document.getElementById('layerThumbNails').removeChild(hr[zInds[layerSelect]])
		hr.splice(zInds[layerSelect], 1)
		ctxThumbNails.splice(layerSelect, 1)
		canvasArrThumbNails.splice(layerSelect, 1)
		
		canvasArrThumbNails = cleanArray(canvasArrThumbNails)
		canvasArr = cleanArray(canvasArr)
		ctx = cleanArray(ctx)
		ctxThumbNails = cleanArray(ctxThumbNails)
		hr = cleanArray(hr)
		
		for (var i = 0; i < canvasArrThumbNails.length; i++){
			canvasArrThumbNails[i].ind = i
			canvasArr[i].style.zIndex = i+3
		}
		deselect()
		
		zInds = move(zInds, zInds[layerSelect], 4)
		selectorRefresh()
		
		if (layerSelect > -1)
			canvasArrThumbNails[layerSelect].style.border = "thin solid blue"
		
		if (canvasArr.length < 1)
			document.getElementById('noLayers').style.display = "block"
			
		alert("Remove layer function can break the canvas arrays and layer select functions")
	}
}

function selectorRefresh() {
	layerSelect = canvasArr.length-1
};

function cleanArray(actual){
	var newArray = []
	for (var i = 0; i < actual.length; i++){
		if (actual[i]!=null){
			newArray.push(actual[i])
		}
	}
	return newArray;
};

function deselect(){
	for (var item in canvasArrThumbNails){
		canvasArrThumbNails[item].style.border = "none"
	}
};

function move(arr, itemToMove, moveToIndex) {  /*this function is my favourite function I've ever written. It moves an
												item in an array. Seemingly easy, definitely not.*/
	var placeHolder = arr[itemToMove]
	arr[itemToMove] = null

	if (itemToMove > moveToIndex)
		arr.splice(moveToIndex, 0, placeHolder)
	else if (moveToIndex > itemToMove){
		arr = cleanArray(arr)
		arr.splice(moveToIndex, 0, placeHolder)}
	else
		arr[itemToMove] = placeHolder
	
	arr = cleanArray(arr)
	return arr
}

var zInds = [0, 1, 2, 3, 4] //01423

function reLayerSomething() { 

	zInds = move(zInds, zInds.indexOf(selecting), selectDrop)
	
	for (var item in hr)
		painInTheArse.removeChild(hr[item])
	for (var item in canvasArrThumbNails)
		painInTheArse.removeChild(canvasArrThumbNails[item])
	
	var asd;
	// alert(zInds)
	
	for (var item in canvasArrThumbNails){
		painInTheArse.appendChild(hr[item])
		painInTheArse.appendChild(canvasArrThumbNails[zInds[item]]) //param 1 is not in node
		asd = item
	}
	asd++
	painInTheArse.appendChild(hr[asd])
	
	asd = 0
	
	for (var item in canvasArr){
		canvasArr[item].style.zIndex = zInds.indexOf(parseInt(item))+3
		asd++
	}
	canvasFront.style.zIndex = asd + 10
	
}

var processing = false
var operations = []

canvasFront.onmouseover = function(){
	cursorImg.style.display = "block"
	
	if (tools.eraser.active || tools.pencil.active){
		cursorImg.height = toolSize.value * 2
		cursorImg.width = toolSize.value * 2
		cursorImg.src = "images/tools/null.png"
		cursorImg.style.border = "thin solid black"
		cursorImg.style.borderRadius = "50%"
	}
	else if (tools.hand.active){
		cursorImg.src = "images/tools/move.png"
		clear1()
	}
	else if (tools.paint.active){
		cursorImg.src = "images/tools/paintBucket.png"
		clear1()
	}
	else if (tools.eyeDrop.active){
		cursorImg.src = "images/tools/eyeDropper.png"
		clear1()
	}
	else if (tools.drawShapes.active){
		cursorImg.src = "images/tools/shapes.png"
		clear1()
	}
	else if (tools.drawText.active){
		cursorImg.src = "images/tools/text.png"
		clear1()
	}
	else if (tools.sprayPaint.active){
		cursorImg.src = "images/tools/sprayCan.png"
		clear1()
	}
	else { this.style.cursor = "auto" }
}

function clear1() {
	cursorImg.style.border = "none"
	cursorImg.height = 32
	cursorImg.width = 32
}

operations['mousedown'] = function() {
	processing = true
	mouseXDown = mouseX
	mouseYDown = mouseY
	if (canvasArr.length > 0){
		ctx[layerSelect].beginPath()
		cX = canvasArr[layerSelect].offsetLeft
		cY = canvasArr[layerSelect].offsetTop
	}
};

operations['mouseup'] = function() {
	processing = false
		
	thumbNailUpdate()
};
operations['mouseout'] = function(){
	processing = false
	
	thumbNailUpdate()
	cursorImg.style.display = "none"
};

canvasFront.addEventListener("mousedown", function() {operations["mousedown"]()})

canvasFront.addEventListener("mouseup", function() {operations["mouseup"]()})

canvasFront.addEventListener("mouseout", function() {operations["mouseout"]()})


penclick = function() {
	canvasFront.addEventListener("mousemove", function() {operations["mousemove"]()})
	tools.pencil.active = true
	toolsOpt.pencil.style.display = "block"
	toolsOpt.color.style.display = "block"
	toolsOpt.colorPreview.style.display = "block"
	toolsOpt.size.style.display = "block"
	operations['mousemove'] = function() {
		if (processing){
			fillCircle(mouseX - cX, mouseY - cY, toolSize.value)
		}
	}
}

tools.sprayPaint.onclick = function() {
	deselectTool()
	canvasFront.addEventListener("mousemove", function() {operations["mousemove"]()})
	tools.sprayPaint.active = true
	toolsOpt.sprayPaint.style.display = "block"
	toolsOpt.colorPreview.style.display = "block"
	toolsOpt.color.style.display = "block"
	toolsOpt.size.style.display = "block"
	operations['mousemove'] = function() {
		if(processing) {
			sprayFill(mouseX - cX, mouseY - cY, toolSize.value)
		}
	}
	alert("Tool currently out of order")
}


tools.pencil.onclick = function() {
	deselectTool()
	penclick();
}

tools.eraser.onclick = function() {
	deselectTool()
	canvasFront.addEventListener("mousemove", function() {operations["mousemove"]()})
	tools.eraser.active = true
	toolsOpt.eraser.style.display = "block"
	toolsOpt.color.style.display = "none"
	toolsOpt.colorPreview.style.display = "none"
	toolsOpt.size.style.display = "block"
	operations['mousemove'] = function() {
		if (processing){
			clearCircle(mouseX - cX, mouseY - cY, toolSize.value)
		}
	}
}

tools.hand.onclick = function() {
	deselectTool()
	canvasFront.addEventListener("mousemove", function() {operations["mousemove"]()})
	tools.hand.active = true
	toolsOpt.hand.style.display = "block"
	operations['mousemove'] = function() {
		moveCanvas()
	}
	alert("Use move tool at your own risk")
}

tools.paint.onclick = function() {
	deselectTool()
	canvasFront.addEventListener("mousemove", function() {operations["mousemove"]()})
	tools.paint.active = true
	toolsOpt.paint.style.display = "block"
	toolsOpt.color.style.display = "block"
	toolsOpt.colorPreview.style.display = "block"
	toolsOpt.size.style.display = "block"
	operations['mousemove'] = function() {                 
	}
	alert("Tool currently out of order")
}

tools.eyeDrop.onclick = function() {
	deselectTool()
	canvasFront.addEventListener("mousemove", function() {operations["mousemove"]()})
	tools.eyeDrop.active = true
	toolsOpt.eyeDrop.style.display = "block"
	toolsOpt.color.style.display = "block"
	operations['mousemove'] = function() {                  
	}
	alert("Tool currently out of order")
}

tools.drawShapes.onclick = function() {
	deselectTool()
	canvasFront.addEventListener("mousemove", function() {operations["mousemove"]()})
	tools.drawShapes.active = true
	toolsOpt.drawShapes.style.display = "block"
	toolsOpt.color.style.display = "block"
	toolsOpt.size.style.display = "block"
	toolsOpt.colorPreview.style.display = "block"
	operations['mousemove'] = function() {                  
	}
	alert("Tool currently out of order")
}

tools.drawText.onclick = function() {
	deselectTool()
	canvasFront.addEventListener("mousemove", function() {operations["mousemove"]()})
	tools.drawText.active = true
	toolsOpt.drawText.style.display = "block"
	toolsOpt.color.style.display = "block"
	toolsOpt.size.style.display = "block"
	toolsOpt.colorPreview.style.display = "block"
	operations['mousemove'] = function() {                
	}
	alert("Tool currently out of order")
}

function deselectTool() {
	for (var item in tools){
		tools[item].active = false
	}
	for (var item in toolsOpt){
		toolsOpt[item].style.display = "none"
	}
}

function thumbNailUpdate(){
	if (canvasArr.length > 0){
		ctxThumbNails[layerSelect].clearRect(0,0,500,500)
		ctxThumbNails[layerSelect].drawImage(canvasArr[layerSelect],0,0)
	}
}

function fillCircle(x, y, radius) {
	if (canvasArr.length > 0){
		ctx[layerSelect].fillStyle = activeColor
		ctx[layerSelect].beginPath()
		ctx[layerSelect].arc(x, y, radius, 0, 2*Math.PI, false)
		ctx[layerSelect].fill()
	}
}

function moveCanvas() {
	if (canvasArr.length > 0){
		if (processing){
			canvasArr[layerSelect].style.left = mouseX + cX - mouseXDown + "px"
			canvasArr[layerSelect].style.top = mouseY + cY - mouseYDown + "px"
		}
	}
}

function clearCircle(x, y, radius) {
	if (canvasArr.length > 0){
		ctx[layerSelect].save()
		ctx[layerSelect].globalCompositeOperation = 'destination-out'
		ctx[layerSelect].beginPath()
		ctx[layerSelect].arc(x, y, radius, 0, 2*Math.PI, false)
		ctx[layerSelect].fill()
		ctx[layerSelect].restore()
	}
}

var re = 0, gr = 0, bl = 0

document.getElementById('red').oninput = function(e){
	re = e.target.value
	update2()
}
document.getElementById('green').oninput = function(e){
	gr = e.target.value
	update2()
}
document.getElementById('blue').oninput = function(e){
	bl = e.target.value
	update2()
}

  var bluefill = document.getElementById("bluefill")
  var greenfill = document.getElementById("greenfill")
  var redfill = document.getElementById("redfill")	

function update2() {
	activeColor = 'rgb(' + re + ',' + gr + ',' + bl + ')'
	document.getElementById('colorPreview').style.background = activeColor
	document.getElementById('colorPreview').style.color = activeColor

		/* try {
			document.styleSheets[0].addRule('#red::-moz-range-track ','background: -moz-linear-gradient(to right, rgb(0, ' + gr + ',' + bl + '), rgb(255, ' + gr + ',' + bl + '))')
			document.styleSheets[0].addRule('#green::-moz-range-track ','background: -moz-linear-gradient(to right, rgb(' + re + ', 0, ' + bl + '), rgb(' + re + ', 255, ' + bl + '))')
			document.styleSheets[0].addRule('#blue::-moz-range-track ','background: -moz-linear-gradient(to right, rgb(' + re + ',' + gr + ', 0), rgb(' + re + ',' + gr + ', 255))')
		} catch(err) {
			document.styleSheets[0].insertRule('#red::-moz-range-track  { background: -moz-linear-gradient(to right, rgb(0, ' + gr + ',' + bl + '), rgb(255, ' + gr + ',' + bl + '); }', 0)
			document.styleSheets[0].insertRule('#green::-moz-range-track  { background: -moz-linear-gradient(to right, rgb(' + re + ', 0, ' + bl + '), rgb(' + re + ', 255, ' + bl + '); }', 0)
			document.styleSheets[0].insertRule('#blue::-moz-range-track  { background: -moz-linear-gradient(to right, rgb(' + re + ',' + gr + ', 0), rgb(' + re + ',' + gr + ', 255); }', 0)		
		} */

		bluefill.style.background = 'linear-gradient(to right, rgb(' + re + ',' + gr + ', 0), rgb(' + re + ',' + gr + ', 255))'
		redfill.style.background = 'linear-gradient(to right, rgb(0,' + gr + ', '+ bl +'), rgb(255,' + gr + ', '+ bl +'))'
		greenfill.style.background = 'linear-gradient(to right, rgb(' + re + ', 0, '+ bl +'), rgb(' + re + ', 255, '+ bl +'))'

}


var density = 0.001
var radius = getSplatterSize()
function sprayFill() {
setInterval(magicSpray(), 10)
}


function magicSpray() {
		if (canvasArr.length > 0){
		ctx[layerSelect].fillStyle = activeColor
		ctx[layerSelect].beginPath()

		for(i=0; i < density; i++) {
		var offset = getRandomOffset()
		var splatRadius = getSplatterSize();
		var sX = (mouseX - cX) + offset.x,
			sY = (mouseY-cY) + offset.y

		ctx[layerSelect].arc(sX, sY, splatRadius, 0, 2*Math.PI, false)
		ctx[layerSelect].fill()
		}
	}
}

function getSplatterSize() {
	var max = toolSize.value / 4,
	min = 1;
	var final = Math.floor(Math.random() * (max - min + 1)) + min;

	return final
}

        function getRandomOffset() {
            var randomAngle = Math.random() * 360;
            var randomRadius = Math.random() * radius;

            return {
                x: Math.cos(randomAngle) * randomRadius,
                y: Math.sin(randomAngle) * randomRadius
            };
        }

