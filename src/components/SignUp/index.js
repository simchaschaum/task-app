import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 

import * as ROUTES from '.../.../constants/routes';

const SignUpPage = () => (
    <div>
        <h1>Sign Up</h1>
        <SignUpForm />
    </div>
);

const INTIAL_STATE = {
    username: "",
    email: "", 
    passwordOne: "",
    passwordTwo: "",
    error: null
}

class SignUpForm extends Component {
    constructor(props){
        super(props);

        this.state = { ...INTIAL_STATE}
    }

    onSubmit = (event) => {

    };
    onChange = (event) => {

    };

        render(){
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error
        } = this.state;

        const isInvalid = passwordOne !== passwordTwo || passwordOne == "" || email == "" || username == ""; 
        return(
            <form onSubmit="onSubmit">
                <input name="username" value="username" onChange={this.onChange} type="text" placeholder="Full Name"></input>
                <input name="email" value="email" onChange={this.onChange} type="text" placeholder="Email Address"></input>
                <input name="passwordOne" value="passwordOne" onChange={this.onChange} type="text" placeholder="Password"></input>
                <input name="passwordTwo" value="passwordTwo" onChange={this.onChange} type="text" placeholder="Confirm Password"></input>
                <button type="submit" disabled={isInvalid}>Sign Up</button>
                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

export default SignUpPage;
export {SignUpForm, SignUpLink}; 