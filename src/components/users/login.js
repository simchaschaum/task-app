import { render } from '@testing-library/react';
import React, { Component } from 'react'; 
import firebase, {tasksCollection, users} from '../../utils/firebase';
import LoginForm from './loginform';


class Login extends Component{

    render(){
        return(
            <LoginForm />
        )
    }
}

export default Login;