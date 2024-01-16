import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '../../firebase.config'
import './AddMerchant.css';


const AddMerchant = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.uid : null; // Assurez-vous que l'UID est disponible

    const [availableSubCategories, setAvailableSubCategories] = useState([]);
    const [merchantData, setMerchantData] = useState({
        name: '',
        description: '',
        category: '',
        subCategory: '',
        email: '',
        phoneNumber: '',
        openingHours: '',
        pinCode: '',
        // Pour les images, vous pouvez stocker les URL ou les références des fichiers
        images: [],
        menuImages: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMerchantData({ ...merchantData, [name]: value });
    
        if (name === 'category') {
            switch (value) {
                case 'Food':
                    setAvailableSubCategories(['Japon', 'Snack', 'Moroccan']);
                    break;
                // Ajoutez d'autres cas pour d'autres catégories si nécessaire
                default:
                    setAvailableSubCategories([]);
            }
        }
    };
    

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files); // Convertir FileList en Array
        const imageUrls = [];
    
        for (const file of files) {
            const storageRef = ref(storage, `images/${file.name}`);
            try {
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                imageUrls.push(downloadURL);
                console.log(downloadURL);
            } catch (error) {
                console.error("Erreur lors du téléchargement de l'image :", error);
            }
        }
    
        setMerchantData(prevState => {
            return {
                ...prevState,
                [e.target.name]: imageUrls
            };
        });
    };
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Données du formulaire soumises :", merchantData);
        const newMerchantData = {
            ...merchantData,
            createdBy: userId, // UID de l'utilisateur
            createdAt: new Date() // Date de création
        };
        try {
            addDoc(collection(db, "merchants"), newMerchantData);
            alert("Commerçant ajouté avec succès !");

            // Autres actions après la soumission
        } catch (error) {
            console.error("Erreur lors de l'ajout du commerçant :", error);
            alert("Erreur lors de l'ajout du commerçant.");
        }
        console.log(merchantData);
    };

    return (
        <div>
            <h1>Ajouter un Commerçant</h1>
            <form className="form-container" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={merchantData.name}
                    onChange={handleInputChange}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={merchantData.description}
                    onChange={handleInputChange}
                />
                <select name="category" value={merchantData.category} onChange={handleInputChange}>
                <option value="">Choisir une catégorie</option>
                <option value="Food">Food</option>
                <option value="Loisirs">Loisirs</option>
                <option value="Détente">Détente</option>
                </select>
                <select name="subCategory" value={merchantData.subCategory} onChange={handleInputChange}>
                <option value="">Choisir une sous-catégorie</option>
                    {availableSubCategories.map(subCategory => (
                <option key={subCategory} value={subCategory}>{subCategory}</option>
                    ))}
                </select>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={merchantData.email}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Numéro de téléphone"
                    value={merchantData.phoneNumber}
                    onChange={handleInputChange}
                />
                <input
                    type="file"
                    name="images"
                    onChange={handleImageUpload}
                    multiple
                />
                <input
                    type="file"
                    name="menuImages"
                    onChange={handleImageUpload}
                    multiple
                />
                <input
                    type="text"
                    name="openingHours"
                    placeholder="Horaires d'ouverture"
                    value={merchantData.openingHours}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="pinCode"
                    placeholder="Code PIN du commerçant"
                    value={merchantData.pinCode}
                    onChange={handleInputChange}
                />
                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
};

export default AddMerchant;
