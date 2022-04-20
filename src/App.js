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
  const [currentColumnToBeUpdated, setCurrentColumnToBeUpdated] = useState()
  const [currentRowToBeUpdated, setCurrentRowToBeUpdated] = useState()
  const [newPhotoToBeUpdated, setNewPhotoToBeUpdated] = useState()
  const [pictureChosen, setPictureChosen] = useState()
  const environment = process.env.ENVIRONMENT
  const dataBaseUrl = "https://phonebook-challenger.herokuapp.com/"
  console.log(process.env)
  
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
      alert("Please, fill all inputs")
    }
      
  
  }


  const deleteNewUser = e => {
    Axios.delete(dataBaseUrl, {
      data: {
        telefone: e.target.name
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

  const updateNewUser = e => {
    e.preventDefault()
    const event = e.target.updatedInput
    const updatedInputValue = event.value
    const axiosInfosSetup = {
      newValue: updatedInputValue,
      lineKey: currentRowToBeUpdated,
      lineChange: currentColumnToBeUpdated
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
    formData.append('lineKey', currentRowToBeUpdated)
    formData.append('lineChange', currentColumnToBeUpdated)
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
    setCurrentColumnToBeUpdated(field)
    setCurrentRowToBeUpdated (primaryKey)
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
		<div className = ' vh-100 container-fluid bg-dark'>
				<div className = 'row h-100'>
					<form className = 'py-5 bg-secondary col-3'>
						<h5>Create New User</h5>
						<div className = 'input-group my-3'>
							<input type="file" className="d-block form-control" id="inputGroupFile03" aria-describedby="inputGroupFileAddon03" aria-label="Upload"/>
						</div>
						<div className = 'input-group my-3'>
							<span className="d-block input-group-text" id="addon-wrapping">Name</span>
							<input type="text" className="form-control" placeholder="Name" aria-label="Username" aria-describedby="addon-wrapping"></input>
						</div>
						<div className = 'input-group my-3'>
							<span className="d-block input-group-text" id="addon-wrapping">Phone</span>
							<input type="text" className="form-control" placeholder="Phone" aria-label="Username" aria-describedby="addon-wrapping"></input>
						</div>
						<div className = 'input-group my-3'>
							<span className="d-block input-group-text" id="addon-wrapping">E-mail</span>
							<input type="text" className="form-control" placeholder="E-mail" aria-label="Username" aria-describedby="addon-wrapping"></input>
						</div>
						<button type="submit" class="btn btn-dark mb-3">Create New User</button>
					</form>
					<div className = 'h-100 text-white col-6 '>
						<div className = 'card-group'>
						{
							dataBaseRows && dataBaseRows.map(row => {
								return (
									 	<div className = 'm-3 card bg-secondary text-white' >
												<img 
												className="card-img-top"
												alt = 'profileImage' 
												src = {`data:image/png;base64,${row.foto}`}
												/*onDoubleClick = { () => {setKeysInState(row.telefone, "foto")} }*/
												/>
											<div className = 'card-body px-1 py-0 mt-1'>
												<h5 className = 'card-title m-0'>
													{row.nome}
												</h5>
											</div>
											
											<ul class="list-group list-group-flush">
													<li class="list-group-item list-group-item-secondary list-group-item-action">An item</li>
													<li class="list-group-item list-group-item-secondary list-group-item-action">A second item</li>

											</ul>							
                    							</div>
									
								)
							})
						}
            				</div>
            
					</div>			
				</div>
				
		</div>
    </> 
  )
}

export default App;
