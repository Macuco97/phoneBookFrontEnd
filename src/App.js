import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Axios from "axios"
import React, { useState, useEffect } from "react"
import addItemIcon from "./addItemIcon.png"
import loadingIco from './loading.gif'
import submitIco from './submitIco.png'
import xIco from './xIco.png'
import editIco from './editIco.png'



function App() {

  
  
  
  const [dataBase, setDataBase] = useState()
  const [dataBaseRows, setDataBaseRows] = useState()
  const [dataBaseFields, setDataBaseFields] = useState()
  const [editMode, setEditMode] = useState()
  const [loadingImage, setLoadingImage] = useState()
  const [propertyToBeUpdated, setPropertyToBeUpdated] = useState()
  const [cardId, setCardId] = useState()
  const [newPhotoToBeUpdated, setNewPhotoToBeUpdated] = useState()
  const [pictureChosen, setPictureChosen] = useState()
  const dataBaseUrl = "http://localhost:3001"
  
  const pathToFileName = path => {
    const pathArray = path.split("\\")
    const pathArrayLastPosition = pathArray.length - 1
    const file = pathArray[pathArrayLastPosition] 
    return file
  }
  
  const fetchDataBaseFromSql = url => {
  Axios.get(dataBaseUrl)
    .then(setLoadingImage(!loadingImage))
    .then(setEditMode(!editMode))
    .then(res => setDataBase(res.data))
    .catch(err => console.log(err))
  }

  const createNewUser = e => {
    e.preventDefault()
    const event = e.target
    const formData = new FormData(event)
    const elementsInputValue = []
    let element
    Object.keys(event).forEach( key => {
      element = event[key]
      if (element.tagName === "INPUT") {
        elementsInputValue.push(element.value)
      }
    })
    if(elementsInputValue.indexOf("") === -1) {
      Axios.post(dataBaseUrl, formData)
        .then(setLoadingImage(!loadingImage))
        .then(res => setDataBase(res.data))
        .catch(err => console.log(err))
    }
    else {
      alert("PLEASE, FILL ALL INPUTS")
    }
      
  
  }


  const deleteNewUser = () => {
    const allow = confirm("Are you sure to execute this action?")
    if(allow) {
      Axios.delete(dataBaseUrl, {
        data: {
          telefone: cardId
        },
        headers: {
          "Authorization" : "***"
        }
  
      })
        .then(setLoadingImage(!loadingImage))
        .then(setEditMode(!editMode))
        .then(res => setDataBase(res.data))
        .catch(err => console.log(err))
    }
      
  }

  const updateNewUser = e => {
    e.preventDefault()
    const event = e.target.updatedInput
    const updatedInputValue = event.value
    const axiosInfosSetup = {
      newValue: updatedInputValue,
      lineKey: cardId,
      lineChange: propertyToBeUpdated
    }

    if (updatedInputValue) {
      Axios.put(dataBaseUrl, axiosInfosSetup)
        .then(setLoadingImage(!loadingImage))
        .then(res => setDataBase(res.data))
        .then(setKeysInState("", ""))
    }
    else {
      alert('Please fill input with some information')
      setKeysInState("", "")
    }
  }

  const updateNewPhoto = e => {
    e.preventDefault()
    const event = e.target
    const input = e.target.photo
    const photoPath = input.value
    if(photoPath) {
    const formData = new FormData(event)
    formData.append('lineKey', cardId)
    formData.append('lineChange', propertyToBeUpdated)
    Axios.put(dataBaseUrl, formData)
      .then(setEditMode(!editMode))
      .then(res => setDataBase(res.data))
      .then(() => setKeysInState("", ""))
      .catch(err => console.log(err))
    }
    else{
      alert ('Please, choose some photo')
      setKeysInState("", "")
    }
    
  }

 
  const setKeysInState = (primaryKey, field) => {
    setPropertyToBeUpdated(field)
    setCardId (primaryKey)
  }

  
  useEffect (() => {
    fetchDataBaseFromSql(dataBaseUrl)
  }, [])

  useEffect (() => {
    if(dataBase) {
      setDataBaseFields(dataBase.fields)
      setDataBaseRows([...dataBase.rows])
    }
  },[dataBase])


  useEffect (() => {
    setLoadingImage(!loadingImage)
    setEditMode(!editMode)
  },[dataBaseRows])

  useEffect(() => {
    console.log('editMode', editMode)
    setPictureChosen(undefined)
  },[editMode])

  useEffect (() => {
    console.log('loadingImage', loadingImage)
  }, [loadingImage])

  

  return (
    <>
		<div className = 'container-fluid bg-dark'>
				<div className = 'row min-vh-100'>
					<form className = 'py-5 bg-secondary col-3' onSubmit = {e => createNewUser(e)}>
						<h5>Create New User</h5>
						<div className = 'input-group my-3'>
							<input type="file" name = 'foto' className="d-block form-control" id="inputGroupFile03" aria-describedby="inputGroupFileAddon03" aria-label="Upload"/>
						</div>
						<div className = 'input-group my-3'>
							<span className="d-block input-group-text" id="addon-wrapping">Name</span>
							<input type="text" name = 'nome' className="form-control" placeholder="Name" aria-label="Username" aria-describedby="addon-wrapping"></input>
						</div>
						<div className = 'input-group my-3'>
							<span className="d-block input-group-text" id="addon-wrapping">Phone</span>
							<input type="text" name = 'telefone' className="form-control" placeholder="Phone" aria-label="Username" aria-describedby="addon-wrapping"></input>
						</div>
						<div className = 'input-group my-3'>
							<span className="d-block input-group-text" id="addon-wrapping">E-mail</span>
							<input type="text" name = 'email' className="form-control" placeholder="E-mail" aria-label="Username" aria-describedby="addon-wrapping"></input>
						</div>
						<button type="submit" class="btn btn-dark mb-3">Create New User</button>
            <button type = 'button' class = 'btn btn-dark mb-3 mx-3' onClick = {() => deleteNewUser()}>Delete Card</button>
					</form>
					<div className = 'text-white col-7'>
						<div className = 'row row-cols-2 mt-1 g-5'>
						{
							dataBaseRows && dataBaseRows.map(row => {
								return (
									 	<div class = 'col'>
                          <div onClick = {e => setCardId(row.telefone)} className = {`${row.telefone === cardId && 'border-5 border-danger'} card bg-secondary text-white`} name = {row.telefone}>
                          <img 
                          className="card-img-top"
                          alt = 'profileImage' 
                          src = {`data:image/png;base64,${row.foto}`}
                          />
                        <div className = 'card-body  py-0 mt-1'>
                          <h5 className = 'card-title m-0'>
                            {row.nome}
                          </h5>
                        </div>
                        
                        <ul class="list-group list-group-flush">
                          {
                            Object.keys(row).map(key => {
                              const value = row[key]
                              if(key != 'foto' && key != 'nome') {
                                return (
                                <li class="list-group-item list-group-item-secondary"><strong className = 'text-capitalize'>{key}: </strong>{value}</li>
                                )
                              }
                            })
                          }
                        </ul>							
                        </div>
                    </div>
                    
									
								)
							})
						}
            </div>
            
					</div>			
				</div>
				
		</div>
    {
      loadingImage && 
      <div className = 'vh-100 container-fluid d-flex justify-content-center align-items-center fixed-top' style = {{background: "black", opacity: "0.3"}}>
      <div class="spinner-border text-primary" role="status" style = {{width: "10rem", height: "10rem"}}>
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    }
    </> 
  )
}

export default App;
