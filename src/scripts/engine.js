const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-img"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playersSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
      button: document.getElementById("next-duel"),
    } 
};

const playersSides = {
    player1: "player-cards",
    computer: "computer-cards"
};

const imagesPath = './src/assets/icons/';

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${imagesPath}dragon.png`,
        winsFor: [1],
        losesTo: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${imagesPath}magician.png`,
        winsFor: [2],
        losesTo: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${imagesPath}exodia.png`,
        winsFor: [0],
        losesTo: [1]
    }
];

async function playAudio(status){
    let audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
       audio.play(); 
    } catch (err) {
    
    }
    
};

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);

    return cardData[randomIndex].id;
};

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");   
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");
    
    if(fieldSide === playersSides.player1){ 
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;

};

async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    setTimeout(() => {
        return hiddenCardDetails();
    }, 1500);

    


    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
};

function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "CLICK";
    state.cardSprites.type.innerText = "ON BUTTON";
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
};

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.winsFor.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    }

    if(playerCard.losesTo.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
};

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    state.cardSprites.name.innerText = "SELECT";
    state.cardSprites.type.innerText = "ANOTHER CARD";

    init();
}

async function removeAllCardsImages(){
    let {computerBox, player1Box} = state.playersSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
};

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    };
};

async function drawSelectedCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Attribute : ${cardData[index].type}`;
};

function init(){
    const bgm = document.getElementById("bgm");
    bgm.play();
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5, playersSides.player1);
    drawCards(5, playersSides.computer);
}

init();