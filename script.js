const form = document.getElementById('form');
const input= document.getElementById('input');
const clear = document.getElementById('clear');
const search = document.getElementById('search');
const status = document.getElementById('status');
const result = document.getElementById('result');
const placeholder = document.getElementById('placeholder');
const quickbuttons = document.querySelectorAll('.quicksearch');


form.addEventListener('submit', function(event) {
    var name =input.value.trim().toLocaleLowerCase();
    if(name!=""){
        fetchPokemon(name);
    }
}
);

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

async function fetchPokemon(name) {
    status.textContent = "Looking up" + name + "...";
    status.className= "status-message loading";
    status.classList.remove("hidden");
    placeholder.style.display="none";
    result.innerHTML="";
    try{
        var responce= await fetch("https://pokeapi.co/api/v2/pokemon/" +name);
        thrpugh nerw Error("No Pokemon named"+name+)
    }

    var data =await Response.json();
    showCard(data);

}

catch(error) {
    status.textcontent= error.message;
    statusbar.classname = "status-message error";
    result.appendChild(placeholder);
    placeholder.style.display="block";
}

function showCard(data){
    var name=data.name;
    var id = data.id;
    var image = data.sprites.other["official-artwork"].front_default;
    var type = data.types[0].type.name;
    var height = data.height / 10;
    var weight = data.weight / 10;

        var abilities = "";
    for (var i = 0; i < data.abilities.length; i++) {
        abilities = abilities + data.abilities[i].ability.name;
        if (i < data.abilities.length - 1) {
            abilities = abilities + ", ";
        }
}

    var cardHTML = "";
    cardHTML = cardHTML + '<div class="pokemon-card">';


    cardHTML = cardHTML + '<div class="card-header">';
    cardHTML = cardHTML + '<span>' + type + ' TYPE</span>';
    cardHTML = cardHTML + '<span>#' + id + '</span>';
    cardHTML = cardHTML + '</div>';


    cardHTML = cardHTML + '<div class="card-main">';
    cardHTML = cardHTML + '<div class="card-info">';
    cardHTML = cardHTML + '<h2 class="card-name">' + name + '</h2>';
    cardHTML = cardHTML + '<span class="card-type-badge">' + type + '</span>';
    cardHTML = cardHTML + '</div>';
    cardHTML = cardHTML + '<div class="card-image">';
    cardHTML = cardHTML + '<img src="' + image + '" alt="' + name + '">';
    cardHTML = cardHTML + '</div>';
    cardHTML = cardHTML + '</div>';

    cardHTML = cardHTML + '<div class="card-stats">';
    cardHTML = cardHTML + '<h3>Base Stats</h3>';
    cardHTML = cardHTML + statsHTML;
    cardHTML = cardHTML + '</div>';

    result.innerHTML = cardHTML;
}