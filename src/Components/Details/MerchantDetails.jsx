import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import './MerchantDetails.css';

const MerchantDetails = () => {
    const { merchantId } = useParams();
    //const user = JSON.parse(localStorage.getItem('user'));
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMerchant = async () => {
            if (merchantId) {
                const merchantRef = doc(db, "merchants", merchantId);
                const docSnap = await getDoc(merchantRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const createdAt = data.createdAt.toDate().toLocaleDateString();
                    setMerchant({ id: docSnap.id, ...data, createdAt });
                } else {
                    console.log("Aucun commerçant trouvé avec cet ID");
                }
                setLoading(false);
            }
        };

        fetchMerchant();
    }, [merchantId]);

    if (loading) {
        return <p>Chargement en cours...</p>;
    }

    if (!merchant) {
        return <p>Aucun commerçant trouvé</p>;
    }

    return (
        <div className="merchant-details">
            <div className="details-container">
                <h1>{merchant.name}</h1>
                <p>{merchant.description}</p>
                <div className="details-info">
                <div className="info">
                                <h3>Catégorie :</h3>
                                <p>{merchant.category}</p>
                            </div>
                            <div className="info">
                                <h3>Sous-catégorie :</h3>
                                <p>{merchant.subCategory}</p>
                            </div>
                            <div className="info">
                                <h3>Adresse Email :</h3>
                                <p>{merchant.email}</p>
                            </div>
                            {merchant.images && (
                            <div className="merchant-image-container">
                                <img src={merchant.images} alt={merchant.name} className="merchant-image" />
                            </div>
                            )}
                            <div className="info">
                                <h3>Code PIN du commerce :</h3>
                                <p>{merchant.pinCode}</p>
                            </div>
                            <div className="info">
                                <h3>Heures d'ouverture :</h3>
                                <p>{merchant.openingHours}</p>
                            </div>
                            <div className="info">
                                <h3>Date de création :</h3>
                                <p>{merchant.createdAt}</p>
                            </div>
                </div>
            </div>
        </div>
    );
};

export default MerchantDetails;
