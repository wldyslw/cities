import React, { Component } from 'react';
import {
    FormControl,
    FormGroup,
    Button,
    InputGroup
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { changeGameStatus } from '../actions';

class CitiesInput extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event);
    }

    handleSubmit(event) {
        if(event.key === 'Enter' && this.props.value !== '') this.props.onSubmit();
    }

    render() {
        return (
            <FormGroup validationState={this.props.validationState}  bsSize='large'>
                <InputGroup>
                    <InputGroup.Button>
                        <Button 
                            title='Голосовой ввод' 
                            bsSize='large' bsStyle='primary'
                            onClick={() => this.props.onRecord()}
                        >
                            <i className="fas fa-microphone"></i>
                        </Button>
                        <Button 
                            type='submit' 
                            title='Ввод' 
                            bsSize='large' 
                            bsStyle='primary'
                            onClick={() => this.props.onSubmit()}
                        >
                            <i className="fas fa-arrow-right"></i>
                        </Button>
                    </InputGroup.Button>
                    <FormControl 
                        value={this.props.value} onChange={this.handleChange} 
                        onKeyPress={this.handleSubmit} 
                        type='text' 
                        placeholder='Введите название города или используйте голосовой ввод'
                    />
                </InputGroup>
                <FormControl.Feedback />
            </FormGroup>
        );
    }
}

export default connect(
    state => state,
    dispatch => ({
        changeGameStatus: status => dispatch(changeGameStatus(status))
    })
)(CitiesInput);
