"use client"
import { useState, useRef, useEffect, useCallback} from "react";
import Form from "../form/Form";
import { delete_item } from "../../actions/actions";
import Swal, {SweetAlertResult} from "sweetalert2";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

import "./table.scss"

interface inventoryItem{
    id: string;
    itemName: string;
    category: string;
    quantity: number;
    price: number;
    supplier: string;
    dateAdded: Date;
    dateUpdated: Date;
};

const Table = ({inventoryData}: {inventoryData : inventoryItem[]}) => {
    
    interface Item {
        id : string,
        itemName: string;
        category: string;
        quantity: number;
        price: number;
        supplier: string;
        dateUpdated: Date;
    }
    const initialFormData:Item = {
        id: '',
        itemName: '',
        category: '',
        quantity: 0,
        price: 0,
        supplier: '',
        dateUpdated:new Date(),
    };
    const sectionRef = useRef<HTMLFormElement>(null);

    
    const [formData, setFormData] = useState(initialFormData);
    const [current_fun, setCurrent_fun] = useState(0);
    const [form_state, setFromState] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const pageSize = 8;
    
    const scrollToSection = useCallback(() => {
        if (form_state)
        {
            sectionRef?.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [form_state]);
    useEffect(()=>
    {
        scrollToSection();
    }, [form_state]);
    
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    });
    
    // Calculate the slice of employees to display based on current page and page size
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Filter employees based on the search query
    const filtered_items = inventoryData.filter((inv:Item) =>
    `${inv.itemName} ${inv.category}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const visible_Items = filtered_items.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filtered_items.length / pageSize);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        }
    };

    const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) =>
    {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'table' ? 'card' : 'table');
    };

    const handleEdit = (item:Item)=>
    {
        setCurrent_fun(2);
        setFromState(true)
        setFormData({
            ...item,
        })
    }

	const Add_item = ()=>{
		setCurrent_fun(1);
		setFormData(initialFormData);
		setFromState(()=> !form_state)
	}

    const Handle_delete = (id:string)=> {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result:SweetAlertResult) => {
            if (result.isConfirmed) {
                delete_item(id)
                Swal.fire({
                title: "Deleted!",
                text: "Your Item has been deleted.",
                icon: "success"
                });
            }
            });
    }
    return (
        <div className="container con-table">
            {
                form_state ? <Form 
                setFromState={setFromState}
                formData={formData}
                setFormData={setFormData}
                current_fun={current_fun}
                sectionRef={sectionRef}/> : ""
            }

            <div className="control-section">
                <div className="view-toggle right-content">
                    <button onClick={toggleViewMode}>
                    Switch to {viewMode === 'table' ? 'Card View' : 'Table View'}
                    </button>
                </div>

                <div className="view-toggle center-content">
                    <button onClick={Add_item}>
                    Adding new Item
                    </button>
                </div>

                <input
                    className="left-content"
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

			<table className={`striped-table ${viewMode != "table" ? "hide-part" : ""}`}>
				<thead>
					<tr>
						<th>No.</th>
						<th>Item Name</th>
						<th>Category</th>
						<th>Quantity</th>
						<th>Price</th>
						<th>Supplier</th>
						<th>Latest Update</th>
						<th colSpan={2} className="text-center">
							Actions
						</th>
					</tr>
				</thead>
				
				<tbody>
					{
							
					visible_Items.length > 0 ? (
					visible_Items.map((item:Item, i:number) => (
						<tr key={item.id}>
							<td>{startIndex + i + 1}</td>
							<td>{item.itemName}</td>
							<td>{item.category}</td>
							<td>{item.quantity}</td>
							<td>{formatter.format(item.price)}</td>
							<td>{item.supplier} </td>
					
							<td>{new Date(item.dateUpdated).toLocaleDateString()} </td>
							<td className="text-right">
								<button
								onClick={() => handleEdit(item)}
								className="button"
								>
								<CiEdit/>
								</button>
							</td>
							<td className="text-left">
								<button
								onClick={() => {Handle_delete(item.id)}}
								className="button"
								>
								<MdDelete/>
								</button>
							</td>
						</tr>
					))
					) : (
						<tr>
							<td colSpan={8} className="empty"> No Item</td>
						</tr>
						)
					}
				</tbody>

			</table>


            <div
                className={`grid-container ${viewMode == "table" ? "hide-part" : ""}
                ${(visible_Items.length > 0 && viewMode != "table") ? "" : (visible_Items.length == 0) ? "empty" : ""}`}>
                
                {visible_Items.length > 0 ? (
                    visible_Items.map((item:Item, i:number) => (
                        <div className="grid-item" key={i}>
                            <div className="holes">
                                <div className="hole"></div>
                                <div className="hole"></div>
                                <div className="hole"></div>
                            </div>
                            <div className="grid-info">
                                <div>Item Name:</div>
                                <div>{item.itemName}</div>
                            </div>

                            <div className="grid-info">
                                <div>Category:</div>
                                <div>{item.category}</div>
                            </div>

                            <div className="grid-info">
                                <div>Quantity:</div>
                                <div>{item.quantity}</div>
                            </div>

                            <div className="grid-info">
                                <div>Price:</div>
                                <div>{formatter.format(item.price)}</div>
                            </div>

                            <div className="grid-info">
                                <div>Supplier:</div>
                                <div>{item.supplier}</div>
                            </div>

                            <div className="control-bnts">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="button muted-button"
                                        >
                                        Edit
                                        </button>
                                    <button
                                        onClick={() => {Handle_delete(item.id)}}
                                        className="button muted-button"
                                        >
                                        Delete
                                        </button>
                            </div>
                        </div>
                    ))
                    ) : (
                        <div className="no-item">
                            <div className="holes">
                                <div className="hole"></div>
                                <div className="hole"></div>
                                <div className="hole"></div>
                            </div>
                            <p>No Item</p>
                        </div>
                    )}
            </div>
            
            
            


            {/* Pagination controls */}
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    <FaArrowLeft/>
                </button>
                <span>
                {currentPage} / {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages }>
                    <FaArrowRight/>
                </button>
            </div>
        </div>
    );
    };


export default Table;
