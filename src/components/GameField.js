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
import { gameStates, members, deprecatedLetters } from '../constants';

class GameField extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addMapMarker = this.addMapMarker.bind(this);
        this.pickCity = this.pickCity.bind(this);
        this.state = {
            inputValue: '',
            inputValidationState: null,
            placemarks: []
        };
    }

    componentDidMount() {
        this.pickCity();
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
                    Текущая буква: {this.determineNextLetter(this.props.usedCities.length ? this.props.usedCities[0].city.name : 'сызрвеь').toUpperCase()}
                    <div className='pull-right'><Button onClick={() => this.props.endGame()} bsStyle='primary'>Закончить игру</Button></div>
                </PageHeader>
                <CitiesInput 
                    value={this.state.inputValue} 
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
