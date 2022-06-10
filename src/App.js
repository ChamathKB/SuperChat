import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase, { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore'; 

firebase.initializeApp({
  apiKey: "AIzaSyCX5m1k_eWy8WZzdhr6fz5CyWBCzXBRzSY",
  authDomain: "superchatapp-669ed.firebaseapp.com",
  projectId: "superchatapp-669ed",
  storageBucket: "superchatapp-669ed.appspot.com",
  messagingSenderId: "343088230223",
  appId: "1:343088230223:web:8be141d718856ab63f1f3a",
  measurementId: "G-FKRT01TKCW"
})

const auth = firebase.auth();
const firestore = firebase.firestore()

function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        
      </header>
      <section>
        { user ? <Chatroom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithGoogle(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderby('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue ] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
  }
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
   <div className={'message ${messageClass}'}>
    <img src={photoURL} />
    <p>{text}</p>
   </div>
  )
}

return (<>
<main>
  <div>
  { messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
  </div>

  <form>
    <input/>
    <button type='Submit'>Submit</button>
  </form>  
</main>
</>)
export default App;
