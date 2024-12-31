

const bar = document.getElementById("barChart");
console.log(typeof Chart)
const barChart = new Chart(bar, {
    type: "pie",
    data: {
        labels: ["All Issues", "Solved Issues", "Unsolved Issues", "In Progress"],
        datasets: [{
            data: [50, 30, 20, 30],
            backgroundColor: [
                'rgba(128, 0, 0, 0.8)',   // Dark Red for "All Issues"
                'rgba(0, 128, 0, 0.8)',  // Dark Green for "Solved Issues"
                'rgba(128, 128, 0, 0.8)', // Dark Yellow/Olive for "Unsolved Issues"
                'rgba(0, 0, 128, 0.8)'  //Dark Blue for "In Progress"
            ],
            borderColor: [
                'rgba(128, 0, 0, 1)',  // Matching Dark Red for "All Issues"
                'rgba(0, 128, 0, 1)',  // Matching Dark Green for "Solved Issues"
                'rgba(128, 128, 0, 1)', // Matching Dark Yellow/Olive for "Unsolved Issues"
                'rgba(0, 0, 128, 1)'   // Matching Dark Blue for "In Progress"
            ],
            borderWidth: 1
        }]
    },
    options :{
        plugins: {
            legend: {
                display: false 
            },
            title: {
                display: true, 
                text: "Users All Issues", 
                font: {
                    size: 18 
                }
            }
        }
    }
});
