"use client";
import { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import {new_item, update_item} from "../../actions/actions"
import Swal, { SweetAlertResult } from "sweetalert2";
import "./form.scss"

interface dt
{
    id : string,
    itemName: string;
    category: string;
    quantity: number;
    price: number;
    supplier: string;
    dateUpdated: Date;
}
interface FormProps {
    setFromState: (state: boolean) => void;
    formData: {
        id: string;
        itemName: string;
        category: string;
        quantity: number;
        price: number;
        supplier: string;
        dateUpdated: Date;
    };
    setFormData: React.Dispatch<React.SetStateAction<dt>>;
    current_fun: number;
    sectionRef: React.RefObject<HTMLFormElement>;
}

const Form: React.FC<FormProps> = ({ setFromState, formData, setFormData, current_fun, sectionRef }) => {
    useEffect(() => {
        if (sectionRef) {
            sectionRef?.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [sectionRef]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "quantity" || name === "price" ? parseFloat(value) : value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const dt = new FormData();
        dt.append('id', (formData.id).toString());
        dt.append('itemName', formData.itemName);
        dt.append('category', formData.category);
        dt.append('price', (formData.price).toString());
        dt.append('quantity', (formData.quantity).toString());
        dt.append('supplier', formData.supplier);
        if (current_fun === 1)
        {
            new_item(dt);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
            });
        }
        else if (current_fun == 2)
        {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, update it!"
                }).then((result:SweetAlertResult) => {
                if (result.isConfirmed) {
                    update_item(dt);
                    Swal.fire({
                    title: "Updated!",
                    text: "Your Item has been updated.",
                    icon: "success"
                    });
                }
                });
        }
        // Here you would usually call a function to save the data
        setFromState(false); // Close the form after submission
    };

    return (
        <>
            <div className="back" onClick={()=> setFromState(false)}>
            </div>
            <div className="form-container">
                <form ref={sectionRef} onSubmit={handleSubmit}>
                    <IoMdClose className="close_icon" onClick={()=> setFromState(false)}/>
                    <h2>{current_fun === 1 ? "Add New Item" : "Edit Item"}</h2>
                    <div className="form-group">
                        <label>Item Name:</label>
                        <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Quantity:</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Supplier:</label>
                        <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} required />
                    </div>
                    <button
                        type="submit"
                        className="button" >{current_fun == 1 ? "Add new Item": "Edit"}</button>
                </form>
            </div>
        </>
    );
};

export default Form;
