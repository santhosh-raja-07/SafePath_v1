const law = [];
fetch("/assets/data/law.json")
    .then((res) => {
        if (!res.ok) {
            throw new Error("Failed to fetch laws data.");
        }
        return res.json();
    })
    .then((data) => {
        law.push(data);
        displayLaws(law[0]?.laws || []);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
        document.getElementById("result").innerHTML = `
            <div class="result">
                <h3>Error</h3>
                <p>Could not load laws data. Please try again later.</p>
            </div>`;
    });

function displayLaws(laws) {
    const mainDiv = document.getElementById("result");
    mainDiv.innerHTML = ""; // Clear previous content

    if (!laws.length) {
        mainDiv.innerHTML = `
            <div class="result">
                <h3>No Laws Found</h3>
                <p>There are currently no laws to display.</p>
            </div>`;
        return;
    }

    laws.forEach((lawItem) => {
        const lawDiv = document.createElement("div");
        lawDiv.classList.add("result");

        lawDiv.innerHTML = `
            <h3>${lawItem.name} (Year: ${lawItem.year})</h3>
            <h5>${lawItem.description}</h5>`;

        const sectionsDiv = document.createElement("div");

        lawItem.sections.forEach((section) => {
            const sectionDiv = document.createElement("div");
            sectionDiv.innerHTML = `
                <h4>Section: ${section.section}</h4>
                <p>${section.description}</p>`;
            sectionsDiv.appendChild(sectionDiv);
        });

        lawDiv.appendChild(sectionsDiv);
        mainDiv.appendChild(lawDiv);
    });
}
