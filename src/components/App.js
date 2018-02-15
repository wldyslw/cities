import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Grid,
    Navbar,
    Nav,
    NavItem,
    Jumbotron,
    Button
} from 'react-bootstrap';
import GameField from './GameField';
import { getCities, changeGameStatus } from '../actions';
import { gameStates } from '../constants';
import './style';

class App extends Component {
    constructor(props) {
        super(props);
        this.props.getCities();
        this.renderGameField = this.renderGameField.bind(this);
    }

    renderGameField(status) {
        switch(status) {
        case gameStates.PENDING: return (
            <Jumbotron>
                <h1>Добро пожаловать в игру Города!</h1>
                <p>
                    В данной игре Вам предстоит сыграть против компьютера в соответствии с <a target='_blank' rel='noopener noreferrer' href='https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D1%80%D0%BE%D0%B4%D0%B0_(%D0%B8%D0%B3%D1%80%D0%B0)'>правилами</a>. Не ждите, что будет легко. Удачи!
                </p>
                <p>
                    <Button onClick={() => this.props.changeGameStatus(gameStates.RUNNING)} bsSize='large' bsStyle='primary'>Начать игру</Button>
                </p>
            </Jumbotron>
        );
        case gameStates.RUNNING: return (
            <GameField />
        );
        case gameStates.FINISHED: return (
            <p>You loose. again.</p>
        );
        }
    }

    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">Города</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem eventKey={1} href="https://github.com/wldyslw/cities">
                                GitHub
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Grid>
                    {this.renderGameField(this.props.gameStatus)}
                </Grid>
            </div>
        );
    }
}

export default connect(
    state => ({
        cities: state.game.cities,
        gameStatus: state.game.status
    }),
    dispatch => ({
        getCities: () => dispatch(getCities()),
        changeGameStatus: gameState => dispatch(changeGameStatus(gameState))
    })
)(App);
