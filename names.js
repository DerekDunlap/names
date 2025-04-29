document.addEventListener("DOMContentLoaded", function(){
    const babySelect = document.getElementById("babyselect");
    const requestURL = "https://api.sheetbest.com/sheets/c1e0ead6-6df0-49f7-ace0-ec90562a8c3f"

    fetchBabyData(requestURL, populateNameDropdown)

    babySelect.addEventListener('change', function(){
        let nameChart = document.getElementById("nameChart");
        let yearLabel = document.getElementsByClassName("year-label");
        let babyNameMeaning = document.getElementById("meaning");

        if (nameChart){
            nameChart.remove();
            Array.from(yearLabel).forEach(year => {
                year.remove()
            });
            babyNameMeaning.innerHTML = "";
        }
        const selectedName = babySelect.value;
        if(selectedName){
            nameURL = `https://api.sheetbest.com/sheets/c1e0ead6-6df0-49f7-ace0-ec90562a8c3f/name/${selectedName}`
            fetchBabyData(nameURL, displayNameInfo);
        }
    });
});

function fetchBabyData(url, callback){
    var xhr;

    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.open("GET", url, true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            const contentType = xhr.getResponseHeader("Content-Type");
            if (contentType.includes('application/json')){
                response = JSON.parse(xhr.responseText);
            } else if (contentType.includes("application/xml") || contentType.includes("text/xml")){
                console.log(contentType)
                response = xhr.reponseXML;
            }
            
            callback(response);
        }
    };
    xhr.send();
};

function populateNameDropdown(data){
    const babySelect = document.getElementById("babyselect");
    if(Array.isArray(data)){
        data.map((item)=>{
            const option = document.createElement('option')
            option.text = item.name;
            babySelect.appendChild(option)
        });
    } else if (data instanceof XMLDocument){
        const names = data.getElementsByTagName("name")

        for (let i=0;i<names.length;i++){
            const option = doucment.createElement("option");
            option.text = names[i].textContent;
            babySelect.append(option);
        }

    }
    

}

function displayNameInfo(data){
    
    //function to display baby name meaning
    displayBabyNameMeaning(data);

    //function to display graphic
    displayBabyNameGraphic(data);
};

function displayBabyNameGraphic(data) {
    const graph = document.getElementById("graph");
    const nameChart = document.createElement('canvas');

    const years = [];
    const nameRanks = [];
    data.each(function (item) {
        years.push(item.year);
        nameRanks.push(item.rank);
    });

    graph.style.display = "flex";
    graph.style.justifyContent = "center";
    graph.style.alignItems = "center";
    graph.style.width = "670px";
    graph.style.height = "250px";

    nameChart.id = "nameChart";
    nameChart.width = 670;
    nameChart.height = 250;
    nameChart.style.position = "relative";

    
    graph.appendChild(nameChart);

    const ctx = nameChart.getContext("2d");

    const chartWidth = nameChart.width;
    const chartHeight = nameChart.height;
    const barWidth = chartWidth / nameRanks.length;
    const padding = 10;


    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(padding, chartHeight + padding);
    ctx.lineTo(chartWidth + 10, chartHeight + padding);

    nameRanks.forEach((rank, index) => {
        const barHeight = Math.floor((rank - 1000) + 1000);
        const x = padding + index * barWidth;
        const y = chartHeight - barHeight;

        ctx.fillStyle = "#F6CAC9";
        ctx.fillRect(x, y, barWidth - 10, barHeight);

        
        ctx.fillstyle = "black"
        ctx.textAlign = "center";
        ctx.font = "18px sans-serif"
        ctx.fillText(rank, x + barWidth / 2 - 5, y + 20); // Adjust rank label just below the bar
    });

    years.forEach((year, index) => {
        const yearElement = document.createElement('div');
        yearElement.className = "year-label";
        yearElement.style.position = "absolute";
        
        yearElement.style.left = `${padding + index * barWidth + barWidth / 2}px`;
        yearElement.style.top = `${-1.5}em`;
        yearElement.style.transform = "translateX(-50%)";
        yearElement.innerText = year;

        graph.appendChild(yearElement);
    });
}

function displayBabyNameMeaning(data) {
    const babyNameMeaning = document.getElementById("meaning");

    if (data.length > 0) {
        babyNameMeaning.innerHTML = data[0].meaning;
    } else {
        errorMessage = `No meaning found for ${data.name}`;
        errorReceived(errorMessage);
    }
}

function errorReceived(errorMessage){
    const errorContainer = document.getElementById("errors");
    errorContainer.innerHTML = errorMessage; 
}


