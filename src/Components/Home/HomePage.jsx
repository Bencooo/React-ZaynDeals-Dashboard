import React from 'react'
import { useState, useEffect } from 'react';
import './HomePage.css';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase.config'
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config'
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore"

export const HomePage = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [merchants, setMerchants] = useState([]);
    
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        const getUserDetails = async () => {
            if (user && user.uid) {
                const userDoc = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDoc);

                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            }
        };

        const getMerchants = async () => {
            if (user && user.uid) {
                const q = query(collection(db, "merchants"), where("createdBy", "==", user.uid));
                const querySnapshot = await getDocs(q);
                setMerchants(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        };
        

        getUserDetails();
        getMerchants();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate("/LoginSignup");                    
    };

    const handleDeleteMerchant = async (event, merchantId) => {
    event.stopPropagation(); // Cela empêchera l'événement de se propager plus loin
    try {
        const merchantRef = doc(db, "merchants", merchantId);
        await deleteDoc(merchantRef);
        setMerchants((prevMerchants) => prevMerchants.filter((merchant) => merchant.id !== merchantId));
        console.log(`Commerce avec l'ID ${merchantId} supprimé avec succès.`);
    } catch (error) {
        console.error("Erreur lors de la suppression du commerce :", error);
    }
};

    const handleAddMerchant = () => {
        navigate('/addMerchant');
    };

    const handleCardClick = (merchantId) => {
        navigate(`/merchant-details/${merchantId}`);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Bienvenue {userDetails?.firstName} dans votre espace</h1>
                <button onClick={handleLogout} className="logout-button">Déconnexion</button>
            </div>
            <div className="dashboard-content">
                <div className="merchants-header">
                    <h2>Mes commerces</h2>
                    <button onClick={handleAddMerchant} className="add-merchant-button">Ajouter un commerce</button>
                </div>




                <div className="merchants-list">
                    {merchants.map((merchant) => (
                        <div key={merchant.id} className="merchant-card" onClick={() => handleCardClick(merchant.id)}>
                            <h3>{merchant.name}</h3>
                            <p>{merchant.description}</p>
                            {/* Ici, vous pouvez ajouter d'autres détails sur le commerce */}
                            <div>
                                <button className="edit-button">Modifier</button>
                                <button onClick={(event) => handleDeleteMerchant(event, merchant.id)}>Supprimer</button>
                            </div>
                        </div>
                    ))}
                </div>                
            </div>
        </div>
    );
};

export default HomePage;

