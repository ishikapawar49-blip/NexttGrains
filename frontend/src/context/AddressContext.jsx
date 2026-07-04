import { createContext, useContext, useState } from "react";
import axios from "axios";
import {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
} from "../services/addressApi";
const AddressContext = createContext();
export const AddressProvider = ({ children }) => {

    const [addresses, setAddresses] = useState([]);

    const [selectedAddress, setSelectedAddress] = useState(null);

    const [loading, setLoading] = useState(false);

    const loadAddresses = async () => {

    try {

        setLoading(true);

        const data = await getAddresses();
        console.log("API Response :", data);
        console.log(data);
     const addressList = data?.addresses || [];
setAddresses(addressList);
const defaultAddress = addressList.find(
    address => address.isDefault
);
        if (defaultAddress) {

            setSelectedAddress(defaultAddress);

        }

    }

    catch (error) {

        console.log(error);

    }

    finally {

        setLoading(false);

    }

};

const addAddress = async (address) => {

    try {

        setLoading(true);

        const data = await createAddress(address);

        await loadAddresses();

        return data;

    }

    catch (error) {

        console.log(error);

    }

    finally {

        setLoading(false);

    }

};

// edit and delete address functions
const editAddress = async (id, address) => {

    try {

        setLoading(true);

        const data = await updateAddress(id, address);

        await loadAddresses();

        return data;

    }

    catch (error) {

        console.log(error);

    }

    finally {

        setLoading(false);

    }

};

const removeAddress = async (id) => {

    try {

        setLoading(true);

        await deleteAddress(id);

        await loadAddresses();

    }

    catch (error) {

        console.log(error);

    }

    finally {

        setLoading(false);

    }

};

    return (

        <AddressContext.Provider
value={{
    addresses,
    setAddresses,
    selectedAddress,
    setSelectedAddress,
    loading,
    setLoading,
    loadAddresses,
    addAddress,
    updateAddress: editAddress,
    deleteAddress: removeAddress,
}}

        >

            {children}

        </AddressContext.Provider>

    );

};


export const useAddress = () => useContext(AddressContext);