import './App.css';
import Axios from "axios"
import React, { useState, useEffect, useRef } from "react"
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
  const [propertyToBeUpdated, setPropertyToBeUpdated] = useState("Choose Property")
  const [propertyToBeUpdatedValue, setPropertyToBeUpdatedvalue] = useState()
  const [cardId, setCardId] = useState()
  const [newPhotoToBeUpdated, setNewPhotoToBeUpdated] = useState()
  const [pictureChosen, setPictureChosen] = useState()
  const [allowForDeleteAlert, setAllowForDeleteAlert] = useState()
  const updateInput = useRef()
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
        element.value = ""
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
      if(cardId) {
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
      else{

      }
     
    
      
  }

  const updateNewUser = () => {
    const axiosInfosSetup = {
      newValue: propertyToBeUpdatedValue,
      lineKey: cardId,
      lineChange: propertyToBeUpdated
    }
    if (propertyToBeUpdatedValue && cardId && propertyToBeUpdated) {
      Axios.put(dataBaseUrl, axiosInfosSetup)
        .then(setLoadingImage(!loadingImage))
        .then(res => setDataBase(res.data))
        .then(() => updateInput.current.value = '')
    }
    else {
      alert('Please fill input with some information')
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

  return (
    <>
    <div className = 'container-fluid d-flex bg-dark'>
				<div className = 'row min-vh-100'>
          <div className = {`py-4 col-4 min-vh-100 bg-secondary `}> 
            <form onSubmit = {e => createNewUser(e)}>
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
                <input type="email" name = 'email' className="form-control" placeholder="E-mail" aria-label="Username" aria-describedby="addon-wrapping"></input>
              </div>
              <button type="submit" class="btn btn-dark mb-3">Create New User</button>
              <button type = 'button' class = 'btn btn-dark mb-3 mx-3' onClick = {() => setAllowForDeleteAlert(true)}>Delete Card</button>
            </form>
            <hr/>
            <div class="input-group mb-3">
              <button type="button" className = {`btn btn-outline-dark text-capitalize`}>{propertyToBeUpdated}</button>
              <button type="button" class="btn btn-outline-dark dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul class="dropdown-menu">
              {
               dataBaseRows &&
               Object.keys(dataBaseRows[0]).map(key => {
                 return (<li
                  className = {`text-capitalize ms-2`}
                  onClick = {() => setPropertyToBeUpdated(key)}
                  style = {{cursor: 'pointer'}}
                  >
                  {key}
                  </li>
                 )
               })
              }
              </ul>
              <input 
              type="text" 
              class="form-control"
              aria-label="Text input with segmented dropdown button"
              onChange = {e => setPropertyToBeUpdatedvalue(e.target.value)}
              ref = {updateInput}
              />
              <button
              className = {`btn btn-dark ms-1`}
              onClick = {() => updateNewUser()}
              >
                Update
              </button>
            </div>
          </div>
					<div className = 'text-white col-8'>
						<div className = 'row row-cols-2 mt-1 g-5'>
						{
							dataBaseRows && dataBaseRows.map(row => {
								return (
									 	<div class = 'col'>
                          <div 
                          className = {`${row.telefone === cardId ? 'border-danger' : 'border-secondary'} card border-3 bg-secondary text-white`} 
                          onClick = {e => {
                            if(cardId === row.telefone) {
                              setCardId(undefined)
                            }
                            else {
                              setCardId(row.telefone)
                            }
                          }} 
                          name = {row.telefone}
                          >
                          <img 
                          className="card-img-top"
                          alt = 'profileImage' 
                          src = {`data:image/png;base64,${row.foto}`}
                          style = {{height: "15vw"}}
                          />
                        <div className = 'card-body py-0 mt-1'>
                          <h5 className = 'card-title m-0'>
                            {row.nome}
                          </h5>
                        </div>
                        
                        <ul class="border-0 list-group list-group-flush">
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
       /*(loadingImage || allowForDeleteAlert ) &&
       <div 
       className = 'vh-100 container-fluid d-flex justify-content-center align-items-center fixed-top' 
       style = {{background: "black", opacity: "0.3", cursor: "not-allowed"}}
       >
       </div>*/
    }
    {
      /*loadingImage && 
      <div 
       className = 'vh-100 container-fluid d-flex justify-content-center align-items-center fixed-top' 
       >
         <div class="spinner-border border-5 text-primary" role="status" style = {{width: "10rem", height: "10rem"}}>
            <span class="visually-hidden">Loading...</span>
          </div>
       </div>*/
    }

    {
      allowForDeleteAlert && 
      <>
      <div class="m-1 alert alert-danger d-flex fixed-top p-2 align-self mx-3"  role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
      <div>
        <span>Area you sure wanna delete selected card ?!</span>
        <button 
        className = 'mx-3 btn btn-danger py-0'
        onClick = {() => {
          setAllowForDeleteAlert(false)
          setCardId(undefined)
          deleteNewUser()
        }}
        >Yes
        </button>
        <button 
        className = 'btn btn-danger py-0'
        onClick = {() => {
          setAllowForDeleteAlert(false)
          setCardId(undefined)
        }}
        >No
        </button>
        <button 
        type = 'button' 
        class = {`ms-3 btn btn-close justify-self-center align-self-end`} 
        aria-label = {`Close`} 
        style = {{position: "relative", right: "0"}}
        onClick = {() => setAllowForDeleteAlert(false)}
        />
      </div>
    </div>  
    </>
    }
    </> 
  )
}

export default App;
