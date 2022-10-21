function handleFileSelect(event){
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
}

function handleFileLoad(event){
    csv = event.target.result.replaceAll(" ", "").replaceAll("\r","").split("\n");
    if (csv.length < 2) {return; }

    document.querySelector("form").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
    
    svg = document.querySelector("svg");
    vals = svg.getBoundingClientRect();

    svg.setAttribute("viewBox", `0 0 ${vals.width} ${vals.height}`);

    draw()
}

function draw() {
    let origin = makeAxis(vals);
    let pairs = calculate(csv); console.log(pairs);
    makeBars(vals, origin, pairs); 
}

function makeBars(svg, origin, pairs) {
    let rect = document.querySelectorAll("svg>rect");
    let txt1 = document.querySelectorAll("svg>text+text");
    let txt2 = document.querySelectorAll("svg>text.letter");
    let inputs = document.querySelectorAll("#bounds>form input");
    let xSize = svg.width - origin.x;
    let ySize = origin.y;
    let grades = calcGrades(pairs, inputs);

    for (let i=0; i < rect.length; i++) {
        let min = Number(inputs[i+1].value);
        let max = Number(inputs[i].value);
        let unit = xSize/100;
        let num = grades[i]/5;

        console.log(min, max, unit);

        rect[i].setAttribute("x", origin.x + min*unit);
        rect[i].setAttribute("y", ySize - ySize*num);
        rect[i].setAttribute("width", (max-min)*unit);
        rect[i].setAttribute("height", ySize*num);

        txt1[i].setAttribute("x", origin.x + (min+max)*unit/2)
        txt1[i].setAttribute("y", ySize*(0.99-num))
        txt1[i].innerHTML = grades[i];
        
        txt2[i].setAttribute("x", origin.x + (min+max)*unit/2)
        txt2[i].setAttribute("y", ySize*(0.99))
    }
}

function calcGrades(pairs, inputs) {
    let grades = [0,0,0,0,0,0,0,0,0,0,0];
    let i = 0;
    for (pair of pairs) {
        if (pair[1] < Number(inputs[i+1].value)) {
            i++;
        } 
        grades[i]++;
    }
    return grades;
}

function makeAxis(svg) {
    let lines = document.querySelectorAll("svg>line");
    let xAxis = lines[0];
    let yAxis = lines[1];
    const percent = 0;
    let margin = svg.height * percent;

    xAxis.setAttribute("x1", margin);
    xAxis.setAttribute("x2", svg.width);
    xAxis.setAttribute("y1", svg.height - margin);
    xAxis.setAttribute("y2", svg.height - margin);

    // yAxis.setAttribute("x1", margin);
    // yAxis.setAttribute("x2", margin);
    // yAxis.setAttribute("y1", 0);
    // yAxis.setAttribute("y2", svg.height - margin);

    return {x: margin, y: svg.height - margin};
}

function calculate(csv) {
    let pairs = [];

    for (let i = 1; i < csv.length; i++) {
        let pair = csv[i].split(",");
        pairs[i-1] = [pair[0], Number(pair[1])]; 
    }
    pairs.sort(compare);

    let avg = mean(pairs);
    let med = median(pairs);
    let high = highest(pairs);
    let low = lowest(pairs);
    
    document.getElementById("mean").innerHTML = `${avg.toFixed(2)}%`;
    document.getElementById("median").innerHTML = `${med.toFixed(2)}%`;
    document.getElementById("highest").innerHTML = `${high[0]} (${high[1]}%)`;
    document.getElementById("lowest").innerHTML = `${low[0]} (${low[1]}%)`;

    return pairs;
}

function compare(a,b) {
    return b[1] - a[1];
}

function mean(pairs) {
    let total = 0; 
    for (let i of pairs) {
        total += i[1];
    }
    return total/pairs.length;
}

function median(pairs) {
    len = pairs.length;
    if (len%2 === 1) {
        return pairs[Math.floor(len/2)][1];
    }
    return (pairs[len/2 - 1][1] + pairs[len/2][1])/2;
}

function lowest(csv) {
    return csv[csv.length -1];
}

function highest(csv) {
    return csv[0];
}

function init(){
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
    let inputs = document.querySelectorAll("#bounds>form input");
    for (i of inputs) {
        i.addEventListener('change', draw, false);
    }
}


console.log("start");
init();