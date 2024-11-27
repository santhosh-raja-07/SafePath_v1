const law = [];
fetch("/assets/data/law.json")
    .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.json();
    })
    .then(datas => {
        law.push(datas);
        displayLaws(law[0].laws);
    })
    .catch(err => {
        console.error(err);
        document.getElementById("result").innerHTML = "<p>Error loading laws data.</p>";
    });

function displayLaws(laws) {
    const mainDiv = document.getElementById("result");
    mainDiv.innerHTML = ""; 

    for (let i = 0; i < laws.length; i++) {
        let div1 = document.createElement("div");
        div1.innerHTML = `
            <h3>Name: ${laws[i].name} Year: ${laws[i].year}</h3>
            <h5>Description: ${laws[i].description}</h5>`;
        let sectionsDiv = document.createElement("div");

        for (let j = 0; j < laws[i].sections.length; j++) {
            let sectionDiv = document.createElement("div");
            sectionDiv.innerHTML = `
                <h4>Section: ${laws[i].sections[j].section}</h4>
                <h5>Description: ${laws[i].sections[j].description}</h5>`;
            sectionsDiv.appendChild(sectionDiv);
        }

        div1.classList.add("result");
        div1.appendChild(sectionsDiv);
        mainDiv.appendChild(div1);
    }
}




