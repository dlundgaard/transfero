import React from "react";
import Game from "./Game";

function HelpModal(props) {
    return (
        <div id="modal" onClick={() => props.toggleCallback()} style={{ display: props.enabled ? "block" : "none" }}>
            <div className="modalContent">
                <h1>How To Play <span role="img" aria-label="controller">🎮</span></h1>
                <br />
                <h2>Objective <span role="img" aria-label="target">🎯</span></h2>
                <p>The goal is to (correctly) type in as many words as possible in the allowed timeframe. The clock starts running as soon as you begin typing a word. <br />The words encountered are randomly chosen from a list of the 1000 most common US-English words.
        </p>
                <h2>Scoring <span role="img" aria-label="score">💯</span></h2>
                <p>For the purposes of calculating WPM (Words Per Minute), a word is standardised to 5 letters/characters. Thus, a word of 10 letters will count as 2 words towards the scoring, reducing the impact of a bad seed of words on the score.</p>
                <h2>Key Bindings <span role="img" aria-label="keyboard">⌨️</span></h2>
                <table id="keyBindingsTable">
                    <tbody>
                        <tr>
                            <td>&lt;Space&gt;</td>
                            <td></td>
                            <td>Check typed word and advance to next word if validated</td>
                        </tr>
                        <tr>
                            <td>&lt;Backspace&gt;</td>
                            <td></td>
                            <td>Delete last letter</td>
                        </tr>
                        <tr>
                            <td>&lt;Ctrl+Backspace&gt;</td>
                            <td></td>
                            <td>Delete whole word</td>
                        </tr>
                        <tr>
                            <td>&lt;Enter&gt;</td>
                            <td></td>
                            <td>(after game) Start new game</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <br />
                <div style={{ textAlign: "center" }}>
                    <button className="button whiteOnBlack" onClick={() => props.toggleCallback()}>Close</button>
                </div>
            </div>
        </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modalEnabled: false };
    }

    toggleModal() {
        this.setState({ modalEnabled: !this.state.modalEnabled });
    }

    render() {
        return (
            <div id="content">
                <HelpModal enabled={this.state.modalEnabled} toggleCallback={() => this.toggleModal()} />
                <nav id="navbar">
                    <div className="navigationItem">Transfero</div>
                    <div className="navigationItem navigationButton" onClick={() => this.toggleModal()}>How To Play</div>
                </nav>
                <Game />
            </div>
        );
    }
}

export default App;