let planetContainer = document.querySelector("#planets");
let residentsTable = document.querySelector("#residents-table");
let page = 1;
let prevButton = document.querySelector(".previous");
let nextButton = document.querySelector(".next");
let modalResidents = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModal = document.querySelector(".close-modal");
const headerResidents = document.querySelector("#header-residents");
let username = document.getElementById("username")
// let userId = document.querySelector("#user-id").value
const votingStatistics = document.querySelector("#voting-statistics");
const tableStatistics = document.querySelector("#statistics")



function formatDataWater(data) {
    if (data !== "unknown") {
        return data + "%"
    } else {
        return data
    }
}

function formatDataPopulation(data) {
    if (data !== "unknown") {
        return new Intl.NumberFormat().format(data) + " people"
    } else {
        return data
    }
}


function formatDataDiameter(data) {
    if (data !== "unknown") {
        return new Intl.NumberFormat().format(data) + " km"
    }
    return data

}


function fetchPlanets(url) {
    fetch(url)
        .then((response) => response.json())
        .then((planets) => {
            let prevData = planets.previous
            let nextData = planets.next
            prevData !== null ? prevButton.removeAttribute("disabled") : prevButton.setAttribute("disabled", "disabled")
            nextData === null ? nextButton.setAttribute("disabled", "disabled") : nextButton.removeAttribute("disabled")
            displayPlanets(planets)
        })
}

function displayPlanets(data) {
    planetContainer.innerHTML = `
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Diameter</th>
                        <th>Climate</th>
                        <th>Terrain</th>
                        <th>Surface Water Percentage</th>
                        <th>Population</th>
                        <th>Residents</th>
                        <th>Vote</th>
                    </tr>
                </thead>
                `
    let tBody = document.createElement('tbody');
    tBody.setAttribute("id", "tbody");
    planetContainer.appendChild(tBody)
    data.results.forEach((detail, idx) => {
        document.querySelector("#tbody")
            .innerHTML += `<tr>
                               <td>${idx + 1}</td>
                               <td>${detail.name}</td>
                               <td>${formatDataDiameter(detail.diameter)}</td>
                               <td>${detail.climate}</td>
                               <td>${detail.terrain}</td>
                               <td>${formatDataWater(detail.surface_water)}</td>
                               <td>${formatDataPopulation(detail.population)}</td>
                               <td>${detail.residents.length === 0 ? `<button class="buttonResidents disabled" disabled>"No known residents"</button>` : `<button class="${detail.name.split(" ")[0]} buttonResidents ">${detail.residents.length} resident(s)</button>`}</td>
                               <td>${username ?`<button class="vote-planets" id="${detail.name}">Vote</button>`: `<small></small>`}</td>
                               </tr>`
    })
    // let voteButtons = document.querySelectorAll(".vote-planets");
    // voteButtons.forEach((butt, idx) => {
    //     butt.addEventListener('click', function (e){
    //         e.preventDefault()
    //         let planetId = e.target.id
    //         let planetName = e.target.id
    //         let newEntry = {
    //             'planet_id': planetId,
    //             'planet_name': planetName,
    //             'user_id': userId
    //         }
    //         fetch('/api/vote-planets', {
    //             method: 'POST',
    //             body: JSON.stringify(newEntry),
    //             headers: {
    //                 'Content-type': 'application/json'
    //             },
    //         })
    //             .then((response) => response)
    //
    //
    //     })
    // })
    let buttonResidents = document.querySelectorAll(".buttonResidents");
    buttonResidents.forEach((button, idx) => {
        button.addEventListener('click', function () {
            modalResidents.classList.toggle("hidden");
            overlay.classList.toggle("hidden")
            const linksResidents = data.results[idx].residents
            const thead = `
                        <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Height</th>
                                    <th>Mass</th>
                                    <th>Hair color</th>
                                    <th>Skin color</th>
                                    <th>Eye color</th>
                                    <th>Birth year</th>
                                    <th>Gender</th>
                                </tr>
                        </thead>`
            residentsTable.insertAdjacentHTML("beforeend", thead)
            linksResidents.forEach((link) => {
                link = link.replace("http", "https")
                fetch(link)
                    .then((response) => response.json())
                    .then((residents) => {
                        let tBodyResidents = document.createElement('tbody');
                        tBodyResidents.setAttribute("id", "tbodyResidents");
                        residentsTable.appendChild(tBodyResidents);
                        let tBodyR = document.querySelector("#tbodyResidents")
                        let html = `<tr>
                                        <td>${residents['name']}</td>
                                        <td>${residents['height']}</td>
                                        <td>${residents['mass']}</td>
                                        <td>${residents['hair_color']}</td>
                                        <td>${residents['skin_color']}</td>
                                        <td>${residents['eye_color']}</td>
                                        <td>${residents['birth_year']}</td>
                                        <td>${residents['gender']}</td>
                                    </tr>`
                        tBodyR.insertAdjacentHTML('beforeend', html)
                    })
            })
            let residentsHeader = `<h1 class="residents-title page-titles">Residents of ${button.classList[0]}</h1>`
            headerResidents.insertAdjacentHTML("beforeend", residentsHeader)

        })
    })
}


nextButton.addEventListener('click', function (e) {
    page = page + 1
    fetchPlanets(`https://swapi.dev/api/planets/?page=${page}`)

})

prevButton.addEventListener('click', function () {
    page = page - 1
    fetchPlanets(`https://swapi.dev/api/planets/?page=${page}`)
})

closeModal.addEventListener("click", function (e) {
    modalResidents.classList.add("hidden")
    overlay.classList.add("hidden")
    residentsTable.innerHTML = "";
    headerResidents.innerHTML = "";
    tableStatistics.innerHTML = "";


})

// votingStatistics.addEventListener('click', function (e){
//     e.preventDefault()
//     modalResidents.classList.toggle("hidden");
//     overlay.classList.toggle("hidden")
//     fetch('/api/get-planets-votes')
//         .then((response) => response.json())
//         .then((data) => {
//             const thead = `
//                         <thead>
//                                 <tr>
//                                     <th>Planet Name</th>
//                                     <th>Received Votes</th>
//                                 </tr>
//                         </thead>`
//             tableStatistics.insertAdjacentHTML('beforeend', thead)
//             let tBody = document.createElement("tbody");
//             tableStatistics.appendChild(tBody)
//             data.forEach((details) => {
//                 tBody.innerHTML += `<tr>
//                                         <td>${details.planet_name}</td>
//                                         <td>${details.recived_votes}</td>
//                                     </tr>`
//             })
//
//         })
// })


fetchPlanets(`https://swapi.dev/api/planets/?page=${page}`)