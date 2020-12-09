import { render } from '@testing-library/react';
import React, { Component } from 'react'; 
import firebase, {tasksCollection, users} from '../../utils/firebase';

class LoginForm extends Component{

    state = {
        register: false,
        user: {
            username: "",
            password: ""
        },
        resetFormDisp: false
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
                // response.user.sendEmailVerification(()=>console.log('verification mail sent'))
                // this.handleStoreUser(response);
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
                this.setState({loginFailed: false})
            } )
            .catch(() => this.loginFailed())
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
        // this.setState({loginFailed: true})
        alert("Sorry! No username and password.  Please try again or reset your password.")
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
    
    handleGoogleSignIn = (e)=>{
        e.preventDefault();
        console.log("initiating google sign in");
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then( result => {
                // this.handleStoreUser(result);
                console.log(result);
                this.props.getUser();
                this.props.getTasks();
            } )
            .catch(error => console.log(error));
        this.setState( () => ({
            user:{
                username: "",
                password: ""
            }
        }));
    }

    // handleStoreUser = (data) => {
    //     users.doc(data.user.uid)
    //         .set({ 
    //             email: data.user.email
    //         })
    //         .then( response => console.log(response))
    //         .catch (error => console.log(error))
    // }

    toggleSignIn = (e) => {
        e.preventDefault();
        this.props.toggleSignIn();
    }

    resetPassword = () => {
        this.setState({resetFormDisp: this.state.resetFormDisp ? false : true})
    }

    handleResetSubmit = (e) => {
        e.preventDefault();
        firebase
            .auth()
            .sendPasswordResetEmail(this.state.user.username)
            .then((result)=>{
                console.log("Email Sent" + result);
                alert("Check your email for the link to reset your password.");
                this.setState({resetFormDisp: false})
            })
            .catch(error => console.log(error));
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
        var loginFailedText = this.state.loginFailed ? 
            <p id="loginFailedText">
                "Sorry! Wrong username or password. Please try again"
            </p>
            : null;

        var formDisp = this.state.resetFormDisp ? 'none' : 'block';
        var altFormDisp = this.state.resetFormDisp ? 'block' : 'none';
        
        return(
           <div className="d-flex justify-content-center">  
           {/* Form to reset password: */}
            <form style={{display: altFormDisp}} className="form signInForm" onSubmit={(e)=>this.handleResetSubmit(e)}>
                <h4>
                    Password Reset
                </h4>
                <hr></hr>
                <p>
                    Enter your email address.  A link to reset your password will be mailed to you.
                </p>
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
                <div className="row">
                    <div className="col col-sm-8 col-lg-10"></div>
                    <button className="form-control btn btn-secondary col col-sm-4 col-lg-2 submit" type="submit"> 
                    Send Email
                </button>
                </div>
                <p>
                    Remember your password? <a className="link" onClick={this.resetPassword}>Sign in</a>.
                </p>

            </form>

            {/* Form to sign in or register: */}
            <form style={{display: formDisp}} className="form signInForm" onSubmit={(e) => this.handleSubmit(e)}>
                <h2>
                   Welcome! <br/> Please {text}.
                </h2>
                {altText}
                <hr/>
                <div className="form-group">
                    <button className="form-control btn btn-secondary" onClick={(e)=>this.handleGoogleSignIn(e)}>
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
                    <button className="form-control btn btn-secondary col col-sm-4 col-lg-2 submit" type="submit"> 
                        Submit 
                    </button>
                </div>
                <p>
                    Forgot password? <a className="link" onClick={this.resetPassword}>Reset Password</a>.
                </p>
                {/* <button onClick={this.toggleSignIn}>
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
            </button> */}

            </form>
             
      

                  
           </div>
        )
    }
}

export default LoginForm;