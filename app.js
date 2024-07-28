const canvas=document.querySelector("canvas");

const ctxt=canvas.getContext("2d"); // returns a drawing context on the canvas

const toolBtns=document.querySelectorAll('.tool');

const colorBtns=document.querySelectorAll('.colors .option');

const colorPicker=document.querySelectorAll('.color-picker');

const fillColor=document.querySelector('#fill-color');

const sizeSlider=document.querySelector('#size-slider');

const clearCanvas=document.querySelector('.clear-btn');

const saveImage=document.querySelector('.save-btn');

// global variables with default values
let mouseX, mouseY; //variable for fetching width and height (for rectangle)
let snapshot;
let selectedTool="brush";
let selectedColor="#000000";
let brushWidth=5;
let isDrawing = false;

window.addEventListener("load",()=>{
    // setting canvas width/height
    // offsetWidth and offsetHeight returns viewable width/height of an element.
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    setCanvasBackground();
})


const setCanvasBackground = () =>{
    // setting whole canvas background to white, so that the downloaded img background will be white
    ctxt.fillStyle="#ffffff";
    ctxt.fillRect(0,0,canvas.width,canvas.height);
    ctxt.fillStyle = selectedColor // setting fillStyle back to the selectedColor, so that the brush, shapes has the selectedColor instead of white
}


const drawRectangle=(e)=>{
    // If fillColor isnt checked draw rectangle with only borders
if(!fillColor.checked){
    return ctxt.strokeRect(e.offsetX,e.offsetY,mouseX-e.offsetX,mouseY-e.offsetY); // It draws a rectangle with no fill. It takes x coordinates, y coordinates, width and height for rectangle
    // For width and height, will pass mouse down pointers
}

// If fillColor is checked draw a full coloured rectangle
ctxt.fillRect(e.offsetX,e.offsetY,mouseX-e.offsetX,mouseY-e.offsetY);
}

const drawCircle=(e)=>{
    ctxt.beginPath(); // creating new path to draw circle
// getting radius to the circle according to mouse pointer
    let radius=Math.sqrt(Math.pow((mouseX-e.offsetX),2)+Math.pow((mouseX-e.offsetX),2));
/*
The radius is the distance between the initial mouse position (mouseX, mouseY) and the current mouse position (e.offsetX, e.offsetY).
Distance Formula:
radius= //refer radiusFormula.png
This calculation ensures that the circle's radius dynamically adjusts as the mouse moves.

*/

        ctxt.arc(mouseX,mouseY,radius,0,2*Math.PI); //creating circle according to the mouse pointer
    //  context.arc(x, y, radius, startAngle, endAngle [, anticlockwise]);
// Draws an arc (which will be a full circle) with the center at (mouseX, mouseY), with the calculated radius.
// 0 and 2 * Math.PI specify the start and end angles of the arc, respectively, making a full circle (360 degrees).


    fillColor.checked ? ctxt.fill() : ctxt.stroke();// If fillColor is checked draw a full coloured circle otherwise circle with only borders.
}

const drawLine=(e)=>{
    ctxt.beginPath();

    ctxt.moveTo(mouseX,mouseY); //moveTo() method moves the path to the specified point

    ctxt.lineTo(e.offsetX,e.offsetY); 
    ctxt.stroke();

}

const drawTriangle=(e)=>{
    ctxt.beginPath();

    ctxt.moveTo(mouseX,mouseY); //moveTo() method moves the path to the specified point
    // here we are using it for moving triangle to the mouse pointer
    ctxt.lineTo(e.offsetX,e.offsetY);
    ctxt.lineTo(mouseX*2-e.offsetX,e.offsetY); // creates bottom line of the triangle
    ctxt.closePath(); //closing the path of the triangle so that the third line draws automatically
    ctxt.stroke();
    fillColor.checked ? ctxt.fill() : ctxt.stroke();
}

const drawing=(e)=>{
    if(!isDrawing)
    {
        return;
    }

    ctxt.putImageData(snapshot,0,0); // adding copied canvas data on to this canvas

    if(selectedTool == "brush" || selectedTool == "eraser"){

        ctxt.strokeStyle=selectedTool==="eraser" ? "#ffffff" : selectedColor;


        ctxt.lineTo(e.offsetX,e.offsetY); // Creating line according to the mouse pointer by passing 
        // The e.offsetX and e.offsetY properties refer to the x and y coordinates of a mouse event relative to the position of the canvas, respectively.
        ctxt.stroke(); // drawing or filling line with color
    }
    else if(selectedTool == "line"){
        drawLine(e);
    }
    else if(selectedTool == "rectangle"){
        drawRectangle(e);
    }
    else if(selectedTool == "circle"){
        drawCircle(e);
    }
    else if(selectedTool == "triangle"){
        drawTriangle(e);
    }
    else if(selectedTool == "eraser"){

    }
   
}

const startDrawing=(e)=>{
    isDrawing=true;
    mouseX = e.offsetX;
    mouseY = e.offsetY;

    ctxt.beginPath(); // creates a new path to drawpoint
    ctxt.lineWidth=brushWidth; //sets the line width
    ctxt.strokeStyle=selectedColor; //sets the color of the stroke
    ctxt.fillStyle=selectedColor; //sets the fill color of the stroke
    // copying canvas data & passing as snapshot value, this avoids dragging the image
    snapshot=ctxt.getImageData(0,0,canvas.width,canvas.height);
}

toolBtns.forEach(btn => {
    btn.addEventListener("click",()=>{
        // removing active class from the previous option and adding it to current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool=btn.id; //Now the selected tool will be the one on which the user clicks
    })
});

colorBtns.forEach(btn => {
    btn.addEventListener("click",()=>{
        // removing selected class from the previous color and adding it to currently clicked color
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");

        // passing button color to selectedColor value
        selectedColor=window.getComputedStyle(btn).getPropertyValue("background-color");
    })
});

colorPicker.forEach(picker => {
    picker.addEventListener("input", (e) => {
        selectedColor = e.target.value;
        document.querySelector(".colors .selected").classList.remove("selected");
        picker.parentElement.classList.add("selected");
    });
});


sizeSlider.addEventListener("change",()=>{
    brushWidth=sizeSlider.value;
}); //passing slider value as brush size

clearCanvas.addEventListener("click",()=>{
    ctxt.clearRect(0,0,canvas.width,canvas.height); 
    //clearRect method - clears the specified pixels within a rectangle

    setCanvasBackground();
});


saveImage.addEventListener("click",()=>{
    const link=document.createElement("a"); // creating <a> tag
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL()  // passing canvas data as link href value
    // .toDataURL() method returns a data URL of the image
    link.click();// clicking link to download image. Programmatically click the link to trigger the download
});

canvas.addEventListener("mousedown",startDrawing);

canvas.addEventListener("mousemove",drawing);

canvas.addEventListener("mouseup",()=>{
    isDrawing=false;
});

