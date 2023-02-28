// select dom elements
let matchesContainer = document.querySelector(".all-matches");
let addMatch = document.querySelector(".lws-addMatch");
let resetBtn = document.querySelector(".lws-reset");

//actions constant / identifiers
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const RESET_MATCH = "RESET_MATCH";
const ADD_MATCH = "ADD_MATCH";
const DELETE_MATCH = "DELETE";

let initialState = [
    {
        match:"MATCH 1",
        score: 0,
        id: 1,
    },
];

function MatchesReducer(state = initialState, action){
    switch(action.type){
        case INCREMENT:{
            let updatedScore = state.map((match) => {
                if(match.id === +action.payload.id){
                    return {
                        ...match,
                        score: match.score + action.payload.score,
                    };
                }else{
                    return match;
                }
            });
            return updatedScore;
        }

        case DECREMENT:{
            let updatedScore = state.map((match) => {
                if(match.id === +action.payload.id){
                    return {
                        ...match,
                        score: Math.max(0,match.score - action.payload.score),
                    };
                }else{
                    return match;
                }
            });
            return updatedScore;
        }

        case ADD_MATCH:{
            let new_match = {
                match: "MATCH" + (state.length+1),
                score: 0,
                id: state.length+2,
            }
            return [...state,new_match]
        }


        case RESET_MATCH:{
            for(let i=0;i<state.length;i++){
                state[i].score = 0;
            }
            return state
        }


        case DELETE_MATCH:{
            return state.filter(obj => obj.id != +action.payload.id);
        }
        default:{
            return state;
        }

    }

}

const store = Redux.createStore(MatchesReducer);

const render = () => {
    matchesContainer.innerHTML = "";
    const state = store.getState();
    state.map((data) => {
        matchesContainer.innerHTML +=`
        <div class="match">
                    <div class="wrapper">
                        <button class="lws-delete" data-id=${data.id} onClick="handelDelete.call(this,event)">
                            <img data-id=${data.id} src="./image/delete.svg" alt="" />
                        </button>
                        <h3 class="lws-matchName">${data.match}</h3>
                    </div>
                    <div class="inc-dec">
                        <form class="incrementForm" data-id=${data.id} onSubmit="handelIncrement.call(this,event)">
                            <h4>Increment</h4>
                            <input
                                type="number"
                                name="increment"
                                class="lws-increment"
                            />
                        </form>
                        <form class="decrementForm" data-id=${data.id} onSubmit="handelDecrement.call(this,event)">
                            <h4>Decrement</h4>
                            <input
                                type="number"
                                name="decrement"
                                class="lws-decrement"
                            />
                        </form>
                    </div>
                    <div class="numbers">
                        <h2 class="lws-singleResult">${data.score}</h2>
                    </div>
                </div>
                `;
    });
};

render();
store.subscribe(render);

function handelIncrement(event){
    event.preventDefault();
    const incrementInput = this.elements["increment"];
    const incrementValue = incrementInput.value;
    const matchID = event.target.dataset.id;

    store.dispatch({
        type: INCREMENT,
        payload: {
            score: +incrementValue,
            id: matchID,
        },
    });

}



function handelDecrement(event){
    event.preventDefault();
    const decrementInput = this.elements["decrement"];
    const decrementValue = decrementInput.value;
    const matchID = event.target.dataset.id;

    store.dispatch({
        type: DECREMENT,
        payload: {
            score: +decrementValue,
            id: matchID,
        },
    });
}


function handelDelete(event){
    event.preventDefault();
    const matchID = event.target.dataset.id;

    store.dispatch({
        type: DELETE_MATCH,
        payload: {
            id: matchID,
        },
    });
}

addMatch.addEventListener("click",() => {
    store.dispatch({
        type: ADD_MATCH,
    });
})

resetBtn.addEventListener("click", () => {
    store.dispatch({
        type: RESET_MATCH,
    });
})


 