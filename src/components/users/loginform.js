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
                this.props.getUser();
                // response.user.sendEmailVerification(()=> console.log("Verification Email Sent"))
            } )
            .catch(error => console.log("error = " + error))
        } else {
            firebase
            .auth()
            .signInWithEmailAndPassword(username,password)
            .then(response => {
                console.log(response);  // response.user.uid from here? 
                this.props.getUser();
            } )
            .catch(error => this.loginFailed())
        }
        this.setState( () => ({
            user:{
                username: "",
                password: ""
            }
        }))
        // this.props.toggleSignIn();
        this.props.getTasks();
    }

    loginFailed = () => {
        alert("Sorry! Username or password is incorrect  Please try again.")
    }

    logout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("signed out"))
            .catch(error => console.log(error));
        this.props.getUser();
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

    toggleSignIn = (e) => {
        e.preventDefault();
        this.props.toggleSignIn();
    }

    render(){
        var text = this.state.register ? "Register" : "Sign in"
        var altText = this.state.register ?
            <p>
                Already have an account?
                <a className="link" onClick={()=>this.setState({register:false})}> Sign in.</a> 
            </p>
                :   <p>
                        New User? Please 
                        <a className="link" onClick={()=>this.setState({register:true})}>  Register.</a> 
                    </p>
           
        return(
           <div className="d-flex justify-content-center">  
            <form className="form signInForm" onSubmit={(e) => this.handleSubmit(e)}>
                <h2>
                   Welcome! <br/> Please {text}.
                </h2>
                {altText}
                <hr/>
                <div className="form-group">
                    <button className="form-control btn btn-secondary" onClick={()=>this.handleGoogleSignIn()}>
                        {text} with your Google account
                    </button>
                </div>
                <hr/>
                <p id="or">-  or  -</p>
                <div className="form-group">
                    <input className="form-control" 
                        name="username" 
                        value={this.state.user.username} 
                        type="email" 
                        placeholder="Enter Email" 
                        onChange={(e) => this.handleChange(e)} 
                        required>
                    </input>
                </div>
                <div className="form-group">
                    <input className="form-control" 
                        name="password" 
                        value={this.state.user.password} 
                        type="password" 
                        placeholder="Enter Password" 
                        onChange={(e) => this.handleChange(e)} 
                        required>
                    </input>
                </div>
                <div className="form-group row">
                    <div className="col col-sm-8 col-lg-10"></div>
                    <button id="submit" className="form-control btn btn-secondary col col-sm-4 col-lg-2" type="submit"> 
                        Submit 
                    </button>
                </div>
                {/* Eventually get rid of the cancel button */}
                <button onClick={this.toggleSignIn}>
                Cancel
            </button>

                  
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

            </form>
             
      

                  
           </div>
        )
    }
}

export default LoginForm;