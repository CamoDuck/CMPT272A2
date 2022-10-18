function handleFileSelect(event){
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
}

function handleFileLoad(event){
    let csv = event.target.result.replaceAll(" ", "").replaceAll("\r","").split("\n");
    if (csv.length < 2) {return; }

    document.querySelector("form").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
    
    calculate(csv);

    
}

function calculate(csv) {
    let pairs = [];

    for (let i = 1; i < csv.length; i++) {
        let pair = csv[i].split(",");
        pairs[i-1] = [pair[0], Number(pair[1])]; 
    }
    console.log(pairs);
    pairs.sort(compare);
    console.log(pairs);

    let avg = mean(pairs);
    let med = median(pairs);
    let high = highest(pairs);
    let low = lowest(pairs);
    
    document.getElementById("mean").innerHTML = `${avg.toFixed(2)}%`;
    document.getElementById("median").innerHTML = `${med.toFixed(2)}%`;
    document.getElementById("highest").innerHTML = `${high[0]} (${high[1]}%)`;
    document.getElementById("lowest").innerHTML = `${low[0]} (${low[1]}%)`;

    console.log(avg);
    console.log(med);
    console.log(high);
    console.log(low);
}

function compare(a,b) {
    return a[1] - b[1];
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

function highest(csv) {
    return csv[csv.length -1];
}

function lowest(csv) {
    return csv[0];
}

function init(){
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

}


console.log("start");
init();