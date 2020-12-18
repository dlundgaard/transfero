import React from "react";
import wordBank from "./wordBank";
import shuffleArray from "./utilities";

function TargetWord(props) {
    const spans = [];
    for (let i = 0; i < props.targetWord.length; i++) {
        let spanClass = "";
        if (props.playerInput.length > i) {
            if (props.playerInput.charAt(i) === props.targetWord.charAt(i)) {
                spanClass = "correctLetter";
            } else {
                spanClass = "incorrectLetter";
            }
        }
        spans.push(<span key={i} className={spanClass}>{props.targetWord.charAt(i)}</span>);
    }
    return (
        <div id="targetWord">{spans}</div>
    )
}

function WordCarousel(props) {
    const usedWords = wordBank.slice(Math.max(0, props.amountCompletedWords - 10), props.amountCompletedWords).map((item, index) => {
        return <div key={item} className="unfocusedWord">{item}</div>
    });
    usedWords.reverse();
    const upcomingWords = wordBank.slice(props.amountCompletedWords + 1, props.amountCompletedWords + 1 + 10).map((item, index) => {
        return <div key={item} className="unfocusedWord">{item}</div>
    });

    return (
        <div id="wordCarousel">
            <div id="usedWords" className="unfocusedWords">{usedWords}</div>
            <TargetWord targetWord={wordBank[props.amountCompletedWords]} playerInput={props.playerInput} />
            <div id="upcomingWords" className="unfocusedWords">{upcomingWords}</div>
        </div>
    );
}

function PlayerInput(props) {
    return (
        <div id="playerInput">{props.playerInput}<span id="cursor" className={!props.gameIsOver && document.hasFocus() ? "blinking" : ""}>|</span></div>
    );
}

function ResultReport(props) {
    return (
        <div id="results" style={{ maxHeight: props.gameIsOver ? 500 : 0 }}>
            <div className="resultsContainer">
                <h1>Result <span role="img" aria-label="result">📋</span></h1>
                <div className="flexContainer">
                    <div>
                        <div className="resultMetric"><span role="img" aria-label="lightning">⚡ </span>Score <span className="metricFigure">{props.result}</span> WPM</div>
                        {
                            (props.result > props.highscore)
                                ? <div className="resultMetric"><span role="img" aria-label="confetti">🎉 </span>New Highscore! <span className="previousHighscore">{props.highscore} [anonymous]</span></div>
                                : <div className="resultMetric"><span role="img" aria-label="trophy">🏆 </span>Highscore <span className="metricFigure">{props.highscore}</span> WPM [anonymous]
                                </div>
                        }
                    </div>
                    <div className="playAgain" >Press &lt;Enter&gt; to start a new game</div>
                </div>
            </div>
        </div>
    );
}

class Game extends React.Component {
    GAME_LENGTH_SECONDS = 30;
    initialState = {
        playerInput: "",
        amountCompletedWords: 0,
        gameUnderway: false,
        finishTime: null,
        secondsLeft: this.GAME_LENGTH_SECONDS,
    };

    constructor(props) {
        super(props);
        this.fetchHighscore();
        this.state = this.initialState;
        shuffleArray(wordBank);
    }

    validatePlayerInput() {
        const currentPlayerInput = this.state.playerInput;
        const targetWord = wordBank[this.state.amountCompletedWords];
        const validated = currentPlayerInput === targetWord;
        if (validated) {
            this.shiftToNextWord();
        }
        return validated;
    }

    setPlayerInput(value) {
        this.setState({ playerInput: value });
    }

    shiftToNextWord() {
        this.setState({
            playerInput: "",
            amountCompletedWords: this.state.amountCompletedWords + 1
        });
    }

    startTimer() {
        this.setState({
            gameUnderway: true,
            finishTime: new Date(Date.now() + this.GAME_LENGTH_SECONDS * 1000),
        });
        let gameTimer = setInterval(() => {
            this.setState({
                secondsLeft: Math.max(0, (this.state.finishTime - new Date(Date.now())) / 1000)
            });
            if (this.state.secondsLeft === 0) {
                clearInterval(gameTimer);
                this.highscore = Math.max(this.highscore, this.getResult());
                document.getElementById("results").scrollIntoView();
                this.postScore();
            }
        }, 50);
    }

    fetchHighscore() {
        fetch("/highscore", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        }).then(response => response.json())
            .then(response_body => this.highscore = response_body["score"])
            .catch(error => this.highscore = 0);
    }

    postScore() {
        fetch("/post", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                time_recorded: Date.now(),
                username: "anonymous",
                score: this.getResult()
            })
        });
    }

    getResult() {
        const allCompletedWords = wordBank.slice(0, this.state.amountCompletedWords);
        const amountCharactersTyped = allCompletedWords.reduce((a, b) => a + b.length, 0);
        const averageWordLength = amountCharactersTyped / this.state.amountCompletedWords;
        const amountStandardisedWordsCompleted = (averageWordLength / 5) * this.state.amountCompletedWords;
        const wordsPerMinute = Math.round((amountStandardisedWordsCompleted / (this.GAME_LENGTH_SECONDS / 60))) || 0;
        return wordsPerMinute;
    }

    restartGame() {
        shuffleArray(wordBank);
        this.setState(this.initialState);
    }

    handleKeyPress(event) {
        const currentPlayerInput = this.state.playerInput;
        let playerInputLength = currentPlayerInput.length;
        if (event.key === "Backspace") {
            event.preventDefault();
            event.stopPropagation();
        }
        if (this.state.secondsLeft === 0) {
            if (event.key === "Enter") {
                this.restartGame();
            } else {
                return;
            }
        }
        if (/^[a-zA-Z]$/.test(event.key) && playerInputLength < wordBank[this.state.amountCompletedWords].length) {
            if (!this.state.gameUnderway) {
                this.startTimer();
            }
            this.setPlayerInput(currentPlayerInput + event.key);
        } else if (event.key === "Backspace") {
            if (event.ctrlKey) {
                this.setPlayerInput("");
            } else {
                this.setPlayerInput(currentPlayerInput.slice(0, Math.max(0, playerInputLength - 1)));
            }
        } else if (event.key === " ") {
            event.preventDefault();
            this.validatePlayerInput();
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", (event) => this.handleKeyPress(event));
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", (event) => this.handleKeyPress(event));
    }

    render() {
        const secondsLeft = this.state.secondsLeft;
        const gameIsOver = secondsLeft === 0;
        const gameOpacity = gameIsOver ? 0.5 : 1;
        return (
            <div id="gameContainer">
                <div id="timeKeeper" style={{ opacity: gameOpacity }} >
                    <div id="clock"><span role="img" aria-label="clock">⏲️</span> <span id="timeLeft" className={(secondsLeft < 5 && secondsLeft > 0) ? "blinking" : ""}>{secondsLeft.toFixed(1)}</span></div>
                </div>
                <main style={{ opacity: gameOpacity }}>
                    <WordCarousel amountCompletedWords={this.state.amountCompletedWords} playerInput={this.state.playerInput} />
                    <PlayerInput playerInput={this.state.playerInput} gameIsOver={gameIsOver} />
                </main>
                <ResultReport result={this.getResult()} gameIsOver={gameIsOver} highscore={this.highscore} />
                <div id="completionBar" style={{ width: (this.GAME_LENGTH_SECONDS - secondsLeft) * 100 / this.GAME_LENGTH_SECONDS + "%" }}></div>
            </div>
        )
    }
}

export default Game;