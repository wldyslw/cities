import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    PageHeader,
    Button,
    Row,
    Col,
    Panel
} from 'react-bootstrap';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import CitiesInput from './CitiesInput';
import { changeGameStatus, proposeCity } from '../actions';
import { gameStates, members, deprecatedLetters, SR, Console } from '../constants';

class GameField extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addMapMarker = this.addMapMarker.bind(this);
        this.pickCity = this.pickCity.bind(this);
        this.initSR.bind(this)();
        this.state = {
            inputValue: '',
            inputValidationState: null,
            placemarks: [],
            recognizing: false
        };
    }

    componentDidMount() {
        this.pickCity();
    }

    initSR() {
        // const cities = Object.keys(this.props.cities)
        //     .reduce((accum, key) => [...accum, ...this.props.cities[key]], []);
        // const grammar = '#JSGF V1.0; grammar cities; public <city> = ' + cities.join(' | ') + ' ;';
        // const speechRecognitionList = new SR.SpeechGrammarList();
        // speechRecognitionList.addFromString(grammar, 1);
        this.recognition = new SR.SpeechRecognition();
        // this.recognition.grammars = speechRecognitionList;
        this.recognition.lang = 'ru-RU';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.onstart = () => this.setState({
            recognizing: true
        });
        this.recognition.onresult = event => {
            this.setState({
                inputValue: event.results[event.results.length - 1][0].transcript,
                inputValidationState: null
            });
            setTimeout(() => this.handleSubmit(), 800);
        };
        this.recognition.onspeechend = this.recognition.onend = () => {
            this.recognition.stop();
            this.setState({
                recognizing: false
            });
            Console.log('ended');
        };
        this.recognition.onnomatch = () => Console.log('No match');
        this.recognition.onerror = error => Console.error('An error occured: ', error.value);
    }

    handleChange(event) {
        this.setState({
            inputValidationState: event.target.value == '' ? null : this.state.inputValidationState,
            inputValue: event.target.value
        });
    }

    determineNextLetter(city) {
        return city.charAt(city.length - 1 - !!deprecatedLetters.filter(e => city.endsWith(e)).length);
    }

    addMapMarker(name, lat, lng) {
        this.setState(prevState => ({
            placemarks: [ 
                <Placemark 
                    key={name} 
                    geometry={{'coordinates': [lat, lng]}} 
                    properties={{'hintContent': name}}
                />,
                ...prevState.placemarks
            ]
        }));
    }

    getRandomCity(cities) {
        const alphabet = Object.keys(cities).filter(e => !deprecatedLetters.includes(e));
        const citiesByLetter = cities[alphabet[Math.floor(Math.random() * alphabet.length)]];
        return citiesByLetter[Math.floor(Math.random() * citiesByLetter.length)];
    }

    pickCity(lastCity = this.getRandomCity(this.props.cities)) {
        const citiesByLetter =  this.props.cities[this.determineNextLetter(lastCity.name)];
        const city = citiesByLetter[Math.floor(Math.random() * citiesByLetter.length)];
        this.props.proposeCity(
            city,
            members.computer
        );
        this.addMapMarker(city.name, city.lat, city.lng);
    }

    handleSubmit() {
        const value = this.state.inputValue.trim();
        if(value == '') return;
        const foundCategory = this.props.cities[value.charAt(0).toLowerCase()];
        const foundCity = foundCategory !== undefined
            ? foundCategory.find(city => value.toLowerCase() == city.name.toLowerCase())
            : undefined;
        const isApplicable = city => (
            city !== undefined && 
            !this.props.usedCities.map(e => e.city.name).includes(city.name) &&
            city.name.charAt(0).toLowerCase() == this.determineNextLetter(this.props.usedCities[0].city.name).toLowerCase()
        );
        this.setState({
            inputValidationState: isApplicable(foundCity) ? null : 'error',
            inputValue: isApplicable(foundCity) ? '' : this.state.inputValue
        });
        if(isApplicable(foundCity)) {
            this.addMapMarker(foundCity.name, foundCity.lat, foundCity.lng);
            this.props.proposeCity(foundCity, members.player);
            this.pickCity(foundCity);
        }
    }

    render() {
        return (
            <div>
                <PageHeader>
                    Следующая буква: {this.determineNextLetter(this.props.usedCities.length ? this.props.usedCities[0].city.name : 'минск').toUpperCase()}
                    <small>{this.state.recognizing ? ' Говорите...' : ''}</small>
                    <div className='pull-right'><Button onClick={() => this.props.endGame()} bsStyle='primary'>Закончить игру</Button></div>
                </PageHeader>
                <CitiesInput 
                    value={this.state.inputValue} 
                    onRecord={() => this.state.recognizing ? this.recognition.stop() : this.recognition.start()}
                    onSubmit={this.handleSubmit} 
                    validationState={this.state.inputValidationState} 
                    onChange={this.handleChange}
                />
                <Row>
                    <Col xs={12} md={6}>
                        <YMaps className='ymap'>
                            <Map state={{center: [0,0], zoom: 1}} width='100%' height={400}>
                                {this.state.placemarks.map(e => e)}
                            </Map>
                        </YMaps>
                    </Col>
                    <Col xs={12} md={6}>
                        <h3>Последние названные города:</h3>
                        {this.props.usedCities.map((e, i) => {
                            if(i < 5) return (
                                <Panel 
                                    key={e.city.name} 
                                    bsStyle={e.member.name == members.player.name ? 'primary' : 'danger'}
                                >
                                    <Panel.Body><strong>{e.member.ally}: </strong>{e.city.name}</Panel.Body>
                                </Panel>
                            );
                        })}
                    </Col>
                </Row>
            </div>
        );
    }
} 

export default connect(
    state => ({
        cities: state.game.cities,
        usedCities: state.game.usedCitiesStack
    }),
    dispatch => ({
        endGame: () => dispatch(changeGameStatus(gameStates.FINISHED)),
        proposeCity: (city, member) => dispatch(proposeCity(city, member))
    })
)(GameField);
