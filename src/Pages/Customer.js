import React from 'react'
import { useState, useEffect } from 'react'
import FormModal from '../components/FormModal'
import { Button } from 'react-bootstrap'

import axios from "axios";

const CreateForm = (props) => {
    
    const [ form, setForm ] = useState({
        name: "",
        address: "",
    })
    
    const [ errors, setErrors ] = useState({
        name: "",
        address: "",
        message:"",
    })

    const [ isSubmitting, setIsSubmitting ] = useState(false)
    
    // These methods will update the state properties.
    function updateForm(value) {
        // console.log(form)
        return setForm((prev) => {
            return { ...prev, ...value }
        })
    }
    
    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault()

        setIsSubmitting(true)
    
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newCustomer = { ...form }
        console.log("form create", newCustomer)

        await axios.post(`${process.env.REACT_APP_URL}customer`, {
            name: form.name,
            address: form.address,
        })
        .then( async ( response ) => {

            let json = response.data
            let status = json.status

            if(status == 200){

                alert("yey Success!")
                console.log("create response ", json)

                setForm({
                    name: "",
                    address: "",
                })
                props.handleClose()
                props.getCustomers()

            }else if(status == 400){

                let error = json.data

                console.log("error", error)

                alert("oh no! An error Occured.")
                console.log("Errors", errors )

                console.log("create response ", json)

                setErrors({ 
                    ...errors, 
                    name: error?.name !== undefined ? error?.name[0] : "",
                    address: error?.address !== undefined ? error?.address[0] : "",
                    message: json.message
                })

                console.log("Errors", errors )
                setIsSubmitting(false)
            }

        })
        .catch(error => {
            alert("Catch Error: " + error)
            setIsSubmitting(false)
        })
    
    }

    return (
        <>

            <div className='card p-3'>
                <form id="customer-form" onSubmit={onSubmit}>
                    <div class={ errors?.message != "" ? "alert alert-danger" : "d-none"} role="alert">
                        Error Message: { errors?.message }
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            className= { errors?.name == "" ? "form-control" : "form-control is-invalid"} 
                            id="name"
                            value={form.name}
                            autocomplete="off"
                            onChange={(e) => updateForm({ name: e.target.value })}
                        />
                        <div class="invalid-feedback">
                            { errors.name }
                        </div>
                    </div>
                    <div className="form-group mb-5">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            className= { errors?.address == "" ? "form-control" : "form-control is-invalid"} 
                            id="address"
                            value={form.address}
                            autocomplete="off"
                            onChange={(e) => updateForm({ address: e.target.value })}
                        />
                        <div class="invalid-feedback">
                            { errors.address }
                        </div>
                    </div>

                    <Button variant="outline-danger me-3" onClick={props.handleClose}>
                        Close
                    </Button>
                    
                    <Button 
                        variant="primary" 
                        type="submit"
                        form="customer-form"
                    >
                        { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Create Costumer"}
                    </Button>

                </form>
            </div>

        </>
    )
}


const UpdateForm = (props) => {
    
    const [form, setForm] = useState({
        name: "",
        address: "",
    })

    const [ formLoading, setFormLoading ] = useState(false)
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    
    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value }
        })
    }

    useEffect(() => {

        var id = props.id
        
        async function fetchData() {
            
            setFormLoading(true)

            const response = await axios.get(`${process.env.REACT_APP_URL}customer/${id}`)

            console.log(response)

        
            if (!response.status == 200) {
                const message = `An error has occurred: ${response.statusText}`
                window.alert(message)
                console.log(response)
                return
            }
        
            const customer = await response.data.data

            console.log("customer", customer)

            if (!customer) {
                window.alert(`Record with id ${id} not found`)
                return
            }

            console.log("Update form", customer)
        
            setForm(customer)
            setFormLoading(false)
            console.log("form", form)
        }
    
        fetchData()
        return

    }, [props.show])
    
    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault()

        setIsSubmitting(true)
    
        // When a post request is sent to the create url, we'll add a new record to the database.
        const updateCustomer = { ...form }

        await axios.put(`${process.env.REACT_APP_URL}customer/${props.id}`, {
            name: form.name,
            address: form.address,
        })
        .then( async ( response ) => {
        
            let json = response.data
            let status = json.status
            
            if(status == 200){
                
                // alert("yey Success!")
                // console.log("update response ", json)
                
                setForm({
                    name: "",
                    address: "",
                })

                props.handleClose()
                props.getCustomers()

            }else if(status == 400){

                let error = json.data

                console.log("error", error)

                alert("oh no! An error Occured.")
                console.log("Errors", error )

                console.log("update response ", json)
                
            }
        
        })
        .catch(error => {
            window.alert(error)
            return
        })
    }


    return (
        <>

            <div className='card p-3 placeholder-glow'>
                <div className='card-dialog'>
                    <form id="customer-form" onSubmit={onSubmit}>
                        <div className="form-group mb-3">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="name">Name</label>
                            <input
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="name"
                                value={form.name}
                                autocomplete="off"
                                onChange={(e) => updateForm({ name: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-5">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="address">Address</label>
                            <input
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="address"
                                value={form.address}
                                autocomplete="off"
                                onChange={(e) => updateForm({ address: e.target.value })}
                            />
                        </div>

                        <Button variant="outline-danger me-3" onClick={props.handleClose}>
                            Close
                        </Button>
                        <button 
                            className={ formLoading ? 'btn btn-primary text-primary placeholder col-4 disabled' : 'btn btn-primary ' }
                            type="submit"
                            form="customer-form"
                            disabled={ formLoading ? true : false }
                        >
                            { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Update Customer"}
                        </button>

                    </form>
                </div>
            </div>

        </>
    )
}


const DeleteConfirm = (props) => {

    const [ isSubmitting, setIsSubmitting ] = useState(false)

    async function deleteCustomer() {

        setIsSubmitting(true)

        const response = await axios.delete(`${process.env.REACT_APP_URL}customer/${props.id}`)
        console.log("responese", response)
        props.handleClose()
        props.getCustomers()

    }

    return (
        <>
        <div className='card'>

            <div className='card-header'>
                <b>Attention!</b>
            </div>

            <div className='card-body'>
            <h5 class="card-title">Confirm Delete?</h5>
            </div>

            <div className='card-footer'>
                <Button variant="outline-primary me-3" onClick={props.handleClose}>
                    Close
                </Button>
                <Button 
                    variant="danger" 
                    onClick={ ()=> deleteCustomer() }
                >
                    { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Delete Costumer"}
                </Button>
            </div>

        </div>

        </>
    )
}


export default function Customer() {

    const [ selectID, setID ] = useState("")

    // PAGINATION
    const [ limit, setLimit ] = useState(10)
    const [ numOfPages, setNumOfPages ] = useState(0)
    const [ numOfRecords, setNumOfRecords ] = useState(0)
    const [ page, setPage ] = useState(1)
    const [ query, setQuery] = useState("")

    // TABLE ARRAY
    const [ customers, setCustomers ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)

    // MODAL STATE AND CONTENT
    const [modalContent, setModalContent] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const handleClose = () => setShowModal(false)

    const handleShow = (content) => {
        setModalContent(content)
        setShowModal(true)
    }

    // These methods will update the state properties.
    async function searchTable(event) {

        let query = event.target.value
        let key = event.key

        if(key === "Backspace" && query == ""){
            setQuery(query)
        }

        if(
            key === "Enter" ||
            key === "Space"
        ) {

            setIsLoading(true)
            setQuery(query)
            setIsLoading(false)
            setPage(1)
            console.log(query)
        }
    }

    const selectLimit = (value) => {

        // Page number of row displayed
        setLimit(value)

        // switch to first page
        setPage(0)
    }

    async function getCustomers() {
        
        const response = await fetch(`${process.env.REACT_APP_URL}customer?limit=${limit}&page=${page}&query=${query}`)
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

        const result = await response.json()

        var customers = result.data.data
        var numOfPages = result.data.last_page
        var numOfRecords = result.data.total
        
        setCustomers(customers)
        setNumOfPages(numOfPages)
        setNumOfRecords(numOfRecords)

        console.log("result", result)

    }

    useEffect(() => {
        getCustomers()
    }, [limit, page, query])

    const dateFormat = (date) =>{

        return new Intl.DateTimeFormat('en-US').format(new Date(date))
    }

    
    return (
        <>
            <div class="container-fluid">
                <h3 class="text-dark my-4">Costumer's Record <span class="badge bg-secondary">{ numOfRecords }</span></h3>
                <div class="card shadow">

                    <div class="card-header py-3">
                        <button 
                            class="btn btn-primary btn-sm" 
                            type="button" 
                            onClick={
                                () => handleShow(
                                    <CreateForm 
                                        handleClose = { handleClose }
                                        getCustomers = { getCustomers }
                                    />
                                )
                            }
                        >New Customer</button>
                    </div>

                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 text-nowrap">
                                <div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
                                <label class="form-label">Show <span> </span>
                                    <select onChange={ (e) => {selectLimit(e.target.value)} } class="d-inline-block form-select form-select-sm">
                                        <option value="10" selected="">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </label>
                            </div>
                            </div>
                            <div class="col-md-6">
                                <div class="text-md-end dataTables_filter" id="dataTable_filter"><label class="form-label">
                                <input type="search" /* onChange={ (e) => searchTable(e.target.value) }  */ onKeyUp={ (e) => searchTable(e) } class="form-control form-control-sm" aria-controls="dataTable" placeholder="Search"/></label></div>
                            </div>
                        </div>
                        <div class="table-responsive table mt-2 " id="dataTable-1" role="grid" aria-describedby="dataTable_info">
                            <table class="table my-0 " id="dataTable" style={{width: "80vw"}}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Date Added</th>
                                        <th style={{minWidth: "200px", maxWidth: "200px"}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {   
                                        customers.map((customer, index) => {
                                            return (
                                                <tr key={customer.id}>
                                                    <th>{ index + 1 }</th>
                                                    <td><span className='d-inline-block text-truncate' style={{minWidth: "200px", maxWidth: "20vw"}}>{ customer.name }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{maxWidth: "20vw"}}>{ customer.address }</span></td>
                                                    <td>{ dateFormat(customer.created_at) }</td>

                                                    <td>
                                                        <button 
                                                            className="btn btn-warning btn-sm me-3" 
                                                            onClick={
                                                                () => handleShow(
                                                                    <UpdateForm 
                                                                        id = {customer.id}
                                                                        handleClose = { handleClose }
                                                                        getCustomers = { getCustomers }
                                                                    />
                                                                )
                                                            }
                                                        ><i class="fas fa-edit"></i> <span className='d-none d-md-inline d-lg-inline'>Edit</span> </button>

                                                        <button className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleShow(
                                                                <DeleteConfirm
                                                                    id = {customer.id}
                                                                    handleClose = { handleClose }
                                                                    getCustomers = { getCustomers }
                                                                />
                                                            )}
                                                        ><i class="fas fa-trash-alt"></i> <span className='d-none d-md-inline d-lg-inline'>Delete</span> </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                        <div class="row">
                            <div class="col">
                                <nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                    <ul class="pagination">
                                        <li class={ "page-item page-link " + ( page == 1 ? "disabled" : "") } onClick={() => setPage((prev) => prev - 1)} role='button'><span aria-hidden="true">«</span></li>

                                        {( () => {
                                            const arr = [];
                                            for (let i = 1; i <= numOfPages; i++) {

                                                if( i == page ){
                                                    arr.push(<li class="page-item page-link active" onClick={() => setPage(i)} role='button'>{ i }</li>)
                                                }else{
                                                    arr.push(<li class="page-item page-link " onClick={() => setPage(i)} role='button'>{ i }</li>)
                                                }

                                            }
                                            return arr;
                                        }) ()}

                                        <li class={ "page-item page-link " + ( page >= (numOfPages) ? "disabled" : "") } onClick={() => setPage((prev) => prev + 1)} role='button'><span aria-hidden="true">»</span></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <FormModal
                show = { showModal }
                handleShow = { handleShow }
                handleClose = { handleClose }
                form = { modalContent }
            />

        </>
    )
}
