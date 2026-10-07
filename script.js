const form = document.getElementById('form');
const input= document.getElementById('input');
const clear = document.getElementById('clear');
const statusE1 = document.getElementById('status');
const result = document.getElementById('result');
const placeholder = document.getElementById('placeholder');
const pokemonList = document.getElementById('pokemon-list');
const quickbuttons = document.querySelectorAll('.quicksearch');


form.addEventListener('submit', function(event) {
    event.preventDefault();
    var name =input.value.trim().toLowerCase();
    if(name!=""){
        fetchPokemon(name);
    }
});

clear.addEventListener('click', function(){
    input.value="";
    input.focus();
});

for(let i=0; i<quickbuttons.length; i++){
    quickbuttons[i].addEventListener('click',function(){
        const name = this.getAttribute('data-name');
        input.value=name;
        fetchPokemon(name)
    });
}

async function loadNames() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await response.json();

        for (let i = 0; i < data.results.length; i++) {
            const option = document.createElement('option');
            option.value = data.results[i].name;
            pokemonList.appendChild(option);
        }
    } catch (error) {
        console.log("Could not load the name list", error);
    }
}

loadNames();

async function fetchPokemon(name) {
    statusE1.textContent = "Looking up" + name + "...";
    statusE1.className= "status-message loading";
    statusE1.classList.remove("hidden");
    placeholder.style.display="none";
    result.innerHTML="";

    try{
        const response= await fetch("https://pokeapi.co/api/v2/pokemon/" +name);
        
        if(!response.ok) {
            throw new Error("No Pokemon named "+name+" was found.");
        }
        const data = await response.json();
        showCard(data);

        statusE1.textContent = "Loaded "+data.name+" sucessfully";
        statusE1.className = "success";
    }

    catch(error) {
    statusE1.textContent = error.message;
    statusE1.className = "error";
    result.appendChild(placeholder);
    placeholder.style.display = "block";
    }
}

function showCard(data){
    const name=data.name;
    const id = data.id;
    const image = data.sprites.other["official-artwork"].front_default || data.sprites.front_default;
    const type = data.types[0].type.name;
    const height = data.height / 10;
    const weight = data.weight / 10;
    const cry = data.cries.latest || data.cries.legacy;

    let abilities = "";
    for (let i = 0; i < data.abilities.length; i++) {
        abilities = abilities + data.abilities[i].ability.name;
        if (i < data.abilities.length - 1) {
            abilities = abilities + ", ";
        }
    }   

    let statsHTML = "";
    for(let i=0; i<data.stats.length; i++){
        const statName = data.stats[i].stat.name;
        const value = data.stats[i].base_stat;
        const percent = Math.min((value/150)*100,100);

        statsHTML = statsHTML + '<div class="stat-row">';
        statsHTML = statsHTML + '<span>' + statName + '</span>';
        statsHTML = statsHTML + '<span>' + value + '</span>';
        statsHTML = statsHTML + '<div class="stat-bar"><div class="stat-fill" style="width:' + percent + '%"></div></div>';
        statsHTML = statsHTML + '</div>'
    }

    let cardHTML = '<div class="pokemon-card">';

    cardHTML = cardHTML + '<div class="card-header">';
    cardHTML = cardHTML + '<span>' + type + ' TYPE</span>';
    cardHTML = cardHTML + '<span>#' + id + '</span>';
    cardHTML = cardHTML + '</div>';


    cardHTML = cardHTML + '<div class="card-main">';
    cardHTML = cardHTML + '<div class="card-info">';
    cardHTML = cardHTML + '<h2 class="card-name">' + name + '</h2>';
    cardHTML = cardHTML + '<span class="card-type-badge">' + type + '</span>';
    cardHTML = cardHTML + '<p class="card-details">Height: ' + height + 'm<br>weight: ' + weight + ' kg<br>Abilities: ' +abilities + '</p>';
    cardHTML = cardHTML + '</div>';
    cardHTML = cardHTML + '<div class="card-image">';
    cardHTML = cardHTML + '<img src="' + image + '" alt="' + name + '">';
    cardHTML = cardHTML + '</div>';
    cardHTML = cardHTML + '</div>';

    cardHTML = cardHTML + '<div class="card-stats">';
    cardHTML = cardHTML + '<h3>Base Stats</h3>';
    cardHTML = cardHTML + statsHTML;
    cardHTML = cardHTML + '</div>';

    cardHTML = cardHTML + '</div>';

    cardHTML = cardHTML + '<p class="card-details">Height: ' + height + ' m<br>Weight: ' + weight + ' kg<br>Abilities: ' + abilities + '</p>';

if (cry) {
    cardHTML = cardHTML + '<button type="button" id="cry-btn" class="cry-btn">Play the Sound</button>';
}

cardHTML = cardHTML + '</div>';

    result.innerHTML = cardHTML;

    const cryBtn = document.getElementById('cry-btn');
if (cryBtn) {
    cryBtn.addEventListener('click', function () {
        const audio = new Audio(cry);
        audio.volume = 0.5;
        audio.play();
    });
}

}