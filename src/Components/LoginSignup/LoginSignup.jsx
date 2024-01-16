import React, { useState } from 'react';
import './LoginSignup.css';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import user_icon from '../Assets/user.png';
import email_icon from '../Assets/mail.png';
import password_icon from '../Assets/padlock.png';

export const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const auth = getAuth();
    const db = getFirestore();

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Connexion réussie
                const user = userCredential.user;
                localStorage.setItem('token', user.accessToken);
                localStorage.setItem('user', JSON.stringify(user));
                console.log(localStorage);
                navigate("/");
                // Vous pouvez rediriger l'utilisateur ou afficher un message de succès ici
            })
            .catch((error) => {
                // Gestion des erreurs ici, par exemple afficher un message d'erreur
            });
    };

    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Successful registration
                const user = userCredential.user;
                localStorage.setItem('token', user.accessToken);
                localStorage.setItem('user', JSON.stringify(user));
                navigate("/");
                // Save additional information in Firestore
                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, {
                    firstName,
                    lastName,
                    email,
                    creationDate: new Date()
                });

                // Redirect or success message
            })
            .catch((error) => {
                // Error handling
            });
    }; 

    const handleSubmit = () => {
        if (action === "Login") {
            handleLogin();
        } else {
            handleSignup();
        }
    };

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                {action === "Login" ? null : (
                    <div className='input'>
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                )}
                {action === "Login" ? null : (
                    <div className='input'>
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder='Last Name' onChange={(e) => setLastName(e.target.value)} />
                    </div>
                )}
                <div className='input'>
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='input'>
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            {action === "Sign Up" ? null : (
                <div className="forgot-password">Lost Password? <span>Click Here!</span></div>
            )}
            <div className='submit-container'>
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={handleSubmit}>
                    {action === "Login" ? "Login" : "Sign Up"}
                </div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction(action === "Login" ? "Sign Up" : "Login")}>
                    {action === "Login" ? "Sign Up" : "Login"}
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
