import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {

const [user, setUser] = useState({
  isSignedIn: false,
  name: '',
  email: '',
  pic: ''
})

const provider = new firebase.auth.GoogleAuthProvider();
const handleSignIn = () =>{
  firebase.auth().signInWithPopup(provider)
  .then(result =>{
    const {displayName, email, photoURL} = result.user;
    const signedInUser ={
      isSignedIn: true,
      name: displayName,
      email: email,
      pic: photoURL
    }
    setUser(signedInUser);
  })
  .catch(error =>{
    console.log(error);
    console.log(error.message);
  })
}

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res =>{
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          password: '',
          pic: ''
        }
        setUser(signOutUser)
      })
      .catch(err => {

      })
  }
  const handleChange = (event) => {
    let isFormValid = true;

    console.log(event.target.name, event.target.value);
    if (event.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === 'password') {
      const passValid = event.target.value.length>6;
      const passNumb = /\d{1}/.test(event.target.value);
      isFormValid = passValid && passNumb;
    }
    if(isFormValid){
      const newUser = {...user};
      newUser[event.target.name] = event.target.value;
      setUser(newUser);
    }
  }
  const handleSubmit = (event) => {
    if(user.name && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
    }
    event.preventDefault();
  }

  return (
    <div className="App">
      <h1>Hello World. Welcome here!</h1>
     { 
      user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button>:
      <button onClick={handleSignIn}>Sign In</button>
     }
      {
        user.isSignedIn && <div>
        <h2>Welcome! {user.name}</h2>
        <h4>{user.email}</h4>
        <img src={user.pic} alt="" srcset=""/>
        </div>
      }

      <h1>Our own Authentication system.</h1>
      <p>Email: <strong>{user.email}</strong></p>
      <p>Password: <strong>{user.password}</strong></p>
      <form onSubmit={handleSubmit}>
      <input type="text" name="email" onBlur={handleChange} placeholder="Enter your Email Address" required/>
      <br/>
      <input type="password" name="password" onBlur={handleChange} placeholder="Enter your password" required/>
      <br/>
      <input type="submit" value="submit"/>
      </form>
    </div>
  );
}

export default App;
