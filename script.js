let offset = 0;
let pokemonArray = [];
let setCounter = false;


document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        goBackToList();
    }
});


function showMoreBtn() {
    let showMoreBtn = document.getElementById('showMoreContainer');
    showMoreBtn.classList.remove('d-none');
    if (setCounter == false) {
        setCounter = true;
        setTimeout(function () { showMoreBtn.classList.add('d-none'); setCounter = false; }, 10000);
    }
}


function showStats() {
    document.getElementById('content-about').classList.add('d-none');
    document.getElementById('tab-about').classList.remove('d-border');
    document.getElementById('tab-about').style.opacity = 0.5;
    document.getElementById('content-stats').classList.remove('d-none');
    document.getElementById('tab-stats').classList.add('d-border');
    document.getElementById('tab-stats').style.opacity = 1;
}


function showAbout() {
    document.getElementById('content-about').classList.remove('d-none');
    document.getElementById('tab-about').classList.add('d-border');
    document.getElementById('tab-about').style.opacity = 1;
    document.getElementById('content-stats').classList.add('d-none');
    document.getElementById('tab-stats').classList.remove('d-border');
    document.getElementById('tab-stats').style.opacity = 0.5;
}


function goBackToList() {
    document.getElementById('pokeCard').classList.add('d-none');
    document.getElementById('showMoreContainer').style.opacity = 1;
}


async function loadNext10Pokemons() {
    let url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=10`;
    let response = await fetch(url);
    let next10Pokemons = await response.json();
    // console.log('loaded pokemon:', currentPokemon);
    for (let i = 0; i < next10Pokemons['results'].length; i++) {
        const newPokemon = await loadPokemonByUrl(next10Pokemons['results'][i]['url']);
        pokemonArray.push(newPokemon);
        const newPokemonColor = await loadPokemonByUrl(newPokemon['species']['url']);
        pokemonArray[offset + i]['types'].unshift({ color: `${newPokemonColor['color']['name']}` });
    }
    renderPreviewList(pokemonArray);
}


async function loadPokemonByUrl(url) {
    let response = await fetch(url);
    return await response.json();
}


function showMore() {
    offset += 10;
    loadNext10Pokemons();
}


function openPokeCard(id) {
    renderPokeCard(id);
    document.getElementById('showMoreContainer').style.opacity = 0;
    document.getElementById('pokeCard').classList.remove('d-none');
}


function renderPokeCard(i) {
    let currentPokemon = pokemonArray[i];

    document.getElementById('pokeCard').innerHTML = generatePokemonCardHTML(currentPokemon);
    renderContentAbout(currentPokemon);
    renderContentStats(currentPokemon);
    renderColor(currentPokemon);
}


function generatePokemonCardHTML(currentPokemon){
    return `
    <div id="pokedex">
        <div class="pokedexHeader">
            <div class="leftSideHeader">
                <span class="arrowBack" onclick="goBackToList()">&#8592;</span>
                <h1 id="pokemonName">${currentPokemon['name']}</h1>
                <div class="currentPokemonType" id="currentPokemon"></div>
            </div>
            <div class="rightSideHeader">
            <h3 class="pokemonId">#${currentPokemon['id']}</h3>
            </div>
        </div>
        <div class="image-container">
            <img class="pokemonImage" src="${currentPokemon['sprites']['other']['home']['front_default']}">
        </div>
        <div class="info-container">
            <div class="tab-pokeDetails">
                <div class="d-border" id="tab-about" onclick="showAbout()">About</div>
                <div id="tab-stats" onclick="showStats()">Base Stats</div>
            </div>
            <div id="content-about">
            </div>
            <div class="d-none" id="content-stats">
            </div>
            </div>
        </div>
    </div>
    `;
}


function renderContentAbout(currentPokemon) {
    let contentAbout = `
    <table>
        <tr>
            <td>Species</td>
            <td>${currentPokemon['species']['name']}</td>
        </tr>
        <tr>
            <td>Height</td>
            <td>${currentPokemon['height']}</td>
        </tr>
        <tr>
            <td>Weight</td>
            <td>${currentPokemon['weight']}</td>
        </tr>
        <tr>
            <td>Abbilities</td><td>`;

    for (let i = 0; i < currentPokemon['abilities'].length; i++) {
        contentAbout += `
        ${currentPokemon['abilities'][i]['ability']['name']}`;
    }
    contentAbout += `</td>
    </tr></table >`;
    document.getElementById('content-about').innerHTML = contentAbout;
}


function renderContentStats(currentPokemon) {
    let totalPoints = calcTotalPoints(currentPokemon);
    totalPointsPercent = totalPoints / 6;

    document.getElementById('content-stats').innerHTML = generateContentStatsHTML(currentPokemon, totalPoints, totalPointsPercent);
}


function generateContentStatsHTML(currentPokemon, totalPoints, totalPointsPercent){
    return `
    <table>
    <tr>
        <td>HP</td>
        <td>${currentPokemon['stats'][0]['base_stat']}</td>
        <td><div id="myProgress">
        <div id="myBar" style="width:${currentPokemon['stats'][0]['base_stat']}%"></div>
      </div></td>
    </tr>
    <tr>
        <td>Attack</td>
        <td>${currentPokemon['stats'][1]['base_stat']}</td>
        <td><div id="myProgress">
        <div id="myBar" style="width:${currentPokemon['stats'][1]['base_stat']}%"></div>
      </div></td>
    </tr>
    <tr>
        <td>Defense</td>
        <td>${currentPokemon['stats'][2]['base_stat']}</td>
        <td><div id="myProgress">
        <div id="myBar" style="width:${currentPokemon['stats'][2]['base_stat']}%"></div>
      </div></td>
    </tr>
    <tr>
        <td>Sp. Atk</td>
        <td>${currentPokemon['stats'][3]['base_stat']}</td>
        <td><div id="myProgress">
        <div id="myBar" style="width:${currentPokemon['stats'][3]['base_stat']}%"></div>
      </div></td>
    </tr>
    <tr>
        <td>Sp. Def</td>
        <td>${currentPokemon['stats'][4]['base_stat']}</td>
        <td><div id="myProgress">
        <div id="myBar" style="width:${currentPokemon['stats'][4]['base_stat']}%"></div>
      </div></td>
    </tr>
    <tr>
        <td>Speed</td>
        <td>${currentPokemon['stats'][5]['base_stat']}</td>
        <td><div id="myProgress">
        <div id="myBar" style="width:${currentPokemon['stats'][5]['base_stat']}%"></div>
      </div></td>
    </tr>
    <tr>
        <td>Total</td>
        <td>${totalPoints}</td>
        <td><div id="myProgress">
        <div id="myBar" style="width:${totalPointsPercent}%"></div>
      </div></td>
    </tr>
</table>`
}


function calcTotalPoints(currentPokemon) {
    let sumPoints = 0;

    for (let t = 0; t < 6; t++) {
        sumPoints += currentPokemon['stats'][t]['base_stat'];
    }
    return sumPoints;
}


function renderColor(currentPokemon) {
    for (let j = 1; j < currentPokemon['types'].length; j++) {
        const type = currentPokemon['types'][j];
        document.getElementById('currentPokemon').innerHTML += `
        <span> ${type['type']['name']}</span>
        `;
    }
    let pokeColor = currentPokemon['types'][0]['color'];
    document.getElementById("pokedex").style.backgroundColor = pokeColor;
}


function renderPreviewList(pokemonList) {
    for (let i = offset; i < pokemonList.length; i++) {
        const result = pokemonList[i];
        let pokeId = result['id'];

        document.getElementById('pokeList').innerHTML += `
            <div class="pokemonPreview" id="prev-${pokeId}" onclick="openPokeCard(${i})">
            <div class="previewDetails">
                <h1 id="pokemonName">${result['name']}</h1>
            
                <div class="pokemonType" id="${pokeId}"></div>
            </div>
            <img class="previewImage" id="image-${pokeId}">
            </div>
        </div> `;
        renderTypes(i, pokeId);
    }
}


function renderTypes(i, pokeId) {
    let pokeType = pokemonArray[i]['types'];

    for (let j = 1; j < pokeType.length; j++) {
        const type = pokeType[j];

        document.getElementById(pokeId).innerHTML += `
        <span> ${type['type']['name']}</span>
            `;
        document.getElementById(`image-${pokeId}`).src = `${pokemonArray[i]['sprites']['other']['home']['front_default']}`;
    }
    renderSpeciesColor(i, pokeId);
}


function renderSpeciesColor(i, pokeId) {
    let pokeColor = pokemonArray[i]['types'][0]['color'];
    document.getElementById(`prev-${pokeId}`).style.backgroundColor = pokeColor;
}   