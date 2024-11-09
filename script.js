//STEP:1 Acquiring DOM elements and setting initial value

const listOfAllDice=document.querySelectorAll(".die");
const scoreInputs=document.querySelectorAll("#score-options input");
const scoreSpans=document.querySelectorAll("#score-options span");
const roundElement=document.getElementById("current-round");
const rollsElement=document.getElementById("current-round-rolls");
const totalScoreElement=document.getElementById("total-score");
const scoreHistory=document.getElementById("score-history");
const rollDiceBtn=document.getElementById("roll-dice-btn");
const keepScoreBtn=document.getElementById("keep-score-btn");
const rulesBtn=document.getElementById("rules-btn");
const rulesContainer=document.querySelector(".rules-container")

let diceValuesArr=[];
let rolls=0;
let score=0;
let round=1;

//STEP:2 Using click method to toggle between show rules and hide rules

let isModalShowing=false;

rulesBtn.addEventListener("click",()=>{
    isModalShowing=!isModalShowing;
    if(isModalShowing){
        rulesContainer.style.display="block";
        rulesBtn.textContent="Hide rules"
    }
    else{
        rulesContainer.style.display="none"
        rulesBtn.textContent="Show rules"
    }
})


//STEP:3 Generating five random die numbers when 'rollDiceBtn' is clicked
//STEP:4 Maximum nuber of 3 times that player can roll a dice in one round

const rollDice=()=>{

    diceValuesArr=[]
    for(let i=0;i<5;i++){
        const random=Math.floor(Math.random()*6)+1;
        diceValuesArr.push(random);
    }
    listOfAllDice.forEach((die,index)=>{
        die.textContent=diceValuesArr[index];
    })
}

//STEP:5 Updating rolls count
const updateStats=()=>{
rollsElement.textContent=rolls;
roundElement.textContent=round;
}

rollDiceBtn.addEventListener("click",()=>{
    if(rolls>=3){
        alert("Please Select A Score. You have already rolled dice 3 times!!!")
        return;
    }
    else{
        rolls++;
        resetRadioOptions();
        rollDice();
        updateStats();
        getHighestDuplicates(diceValuesArr);
        detectFullHouse(diceValuesArr);
        checkForStraights(diceValuesArr);
    }
})

//STEP:6 Updated the span element to be visible to see the score for individual text content

const updateRadioOption=(index,score)=>{
    scoreInputs[index].disabled=false;
    scoreInputs[index].value=score;
    scoreSpans[index].textContent=`, score = ${score}`;
}

//STEP:7 Setting the correct score to correct span
const THREE_OF_A_KIND_INDEX = 0;
const FOUR_OF_A_KIND_INDEX = 1;
const FULL_HOUSE_INDEX=2;
const SMALL_STRAIGHT_INDEX=3;
const LARGE_STRAIGHT_INDEX=4;
const FINAL_OPTION_INDEX = 5;

const getHighestDuplicates=(diceValuesArr)=>{
const count={};
diceValuesArr.forEach((num)=>{
count[num]=(count[num] || 0)+1;
});
let highestCount=0;
Object.values(count).forEach(num=>{
    if(num >= 3 &&num>highestCount){
        highestCount = num;
    }
    if(num>=4&&count>highestCount){
        highestCount=num;
    }
});
const totalScore = diceValuesArr.reduce((acc, num) => acc + num, 0);
 if (highestCount >= 4) { 
    updateRadioOption(FOUR_OF_A_KIND_INDEX, `${totalScore}`);
    updateRadioOption(THREE_OF_A_KIND_INDEX, `${totalScore}`);
  } 
  else if (highestCount >= 3) { 
    updateRadioOption(THREE_OF_A_KIND_INDEX, `${totalScore}`);
 } 
    updateRadioOption(FINAL_OPTION_INDEX, 0);
}

//STEP:8 Resetting the input and span values after dice roll in every round

const resetRadioOptions=()=>{
    scoreInputs.forEach((input)=>{
input.disabled=true;
input.checked=false;
    })
    scoreSpans.forEach((span)=>{
span.textContent="";
    })
}

//STEP:9 Updated score is displayed
const updateScore=(selectedValue, achieved)=> {
    const scoreToAdd=parseInt(selectedValue,10);
    score+=scoreToAdd;

    totalScoreElement.textContent=score;
scoreHistory.innerHTML+=`<li>${achieved} : ${scoreToAdd}</li>`
}

//STEP:10 Keeping the current score value and saving it for next round

keepScoreBtn.addEventListener("click",()=>{
    let selectedValue;
    let achieved;

for(const input of scoreInputs){
    if(input.checked){
selectedValue=input.value;
achieved=input.id;
break;
}
}
if(selectedValue){
    rolls=0;
    round++;
    updateStats();
    resetRadioOptions();;
    updateScore(selectedValue,achieved);

    if(round>6){
        setTimeout(()=>{
            alert(`Game Over! Your total score is ${score}`)
            resetGame();
        },500)
    }
}
else{
    alert("Please select a score option before proceeding to the next round.")
}
})

//STEP:11 Resetting the game after round 6

const resetGame=()=>{
    diceValuesArr=[0,0,0,0,0]
listOfAllDice.forEach((dice,index)=>{
dice.textContent=diceValuesArr[index];
});
score=0;
rolls=0;
round=1;
totalScoreElement.textContent=score;
roundElement.textContent = round;
rollsElement.textContent = rolls;
scoreHistory.innerHTML="";
resetRadioOptions();
};

//STEP:12 Detecting a full house card with 3 of a kind and has a pair of cards also

const detectFullHouse=(arr)=>{
const counts={};
for (const num of arr){
counts[num] = counts[num]?counts[num]+1:1;
}

const hasThreeOfAKind=Object.values(counts).includes(3);
const hasPair=Object.values(counts).includes(2);

if(hasThreeOfAKind&&hasPair===true){
    updateRadioOption(FULL_HOUSE_INDEX,25)
};
updateRadioOption(FINAL_OPTION_INDEX,0);
};

//STEP:13 This code here is to check for straights

const checkForStraights=(arr)=>{
const sortedNumbersArr=arr.sort((a,b)=>a-b);
const uniqueNumbersArr=[...new Set(sortedNumbersArr)];
const uniqueNumbersStr=uniqueNumbersArr.join("");
const smallStraightsArr=["1234","2345","3456"];
const largeStraightsArr=["12345","23456"];

if(largeStraightsArr.includes(uniqueNumbersStr)){
    updateRadioOption(LARGE_STRAIGHT_INDEX,40);
}

updateRadioOption(FINAL_OPTION_INDEX,0);

smallStraightsArr.forEach((straight)=>{
    if(uniqueNumbersStr.includes(straight)){
        updateRadioOption(SMALL_STRAIGHT_INDEX,30);
    }
})
}