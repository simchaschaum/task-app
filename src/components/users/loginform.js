import { render } from '@testing-library/react';
import React, { Component } from 'react'; 
import firebase, {tasksCollection, users} from '../../utils/firebase';

class LoginForm extends Component{

    state = {
        register: false,
        user: {
            username: "",
            password: ""
        }
    }

    handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState( prevState => ({
            user:{
                ...prevState.user,
                [name]:value    
            }
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {username} = this.state.user;
        const {password} = this.state.user;
        console.log("username = " + username);
        if(this.state.register){
            firebase
            .auth()
            .createUserWithEmailAndPassword(username,password)
            .then(response => {
                console.log("uid: " + response.user.uid)
                this.handleStoreUser(response);
                // response.user.sendEmailVerification(()=> console.log("Verification Email Sent"))
            } )
            .catch(error => console.log("error = " + error))
        } else {
            firebase
            .auth()
            .signInWithEmailAndPassword(username,password)
            .then(response => console.log(response))
            .catch(error => console.log("error = " + error))
        }
        
        this.setState( () => ({
            user:{
                username: "",
                password: ""
            }
        }))
    }

    logout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("signed out"))
            .catch(error => console.log(error))
    }

    getUserInfo = () => {
        let getUser = firebase.auth().currentUser;
        if(getUser){
            console.log("USER EMAIL:" + getUser.email)
        } else {
            console.log("NO USER")
        }
    }

    updateUserInfo = () => {
        let getUser = firebase.auth().currentUser;
        let credential = firebase.auth.EmailAuthProvider.credential(getUser.email, 'testing123')
        if(getUser){
            getUser.reauthenticateWithCredential(credential).then(res => {
                getUser.updateEmail(this.state.user.username).then( res => console.log(res));

            })
        }
           }
    
    handleGoogleSignIn = ()=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then( result => {
                this.handleStoreUser(result);
                console.log(result);
            } )
            .catch(error => console.log(error))
    }

    handleStoreUser = (data) => {
        users.doc(data.user.uid)
            .set({ 
                email: data.user.email
            })
            .then( response => console.log(response))
            .catch (error => console.log(error))
    }

    render(){

        return(
            <>
            <form className="form-container" onSubmit={(e) => this.handleSubmit(e)}>
                <div className="form-group row">
                    <input id="newTaskTitle" className="form-control" 
                        name="username" 
                        value={this.state.user.username} 
                        type="text" 
                        placeholder="Enter Username" 
                        onChange={(e) => this.handleChange(e)} 
                        required>
                    </input>
                </div>
                <div className="form-group row">
                    <input id="newTaskTitle" className="form-control" 
                        name="password" 
                        value={this.state.user.password} 
                        type="password" 
                        placeholder="Enter Username" 
                        onChange={(e) => this.handleChange(e)} 
                        required>
                    </input>
                </div>
                <div className="form-group row">
                    <input id="submit" className="form-control" 
                        type="submit" 
                        >
                    </input>
                </div>

            </form>
            
            <hr/>
            <button onClick={()=>this.logout()}>
                Log Out
            </button>
            <hr/>
            <button onClick={()=>this.getUserInfo()}>
                Get User Info
            </button>
            <button onClick={()=>this.updateUserInfo()}>
                Update User Info
            </button>
            <hr/>
            <button onClick={()=>this.handleGoogleSignIn()}>
                Sign in with Google
            </button>
            <button onClick={this.props.toggleSignIn}>
                Cancel
            </button>

             </>
        )
    }
}

export default LoginForm;