import './App.css';
import Axios from "axios"
import React, { useState, useEffect, useRef } from "react"
import Alert from './components/Alert'
import Offcanvas from './components/Offcanvas'
import Card from './components/Card'
import Loading from './components/Loading'




function App() {
  
  const [dataBase, setDataBase] = useState()
  const [dataBaseRows, setDataBaseRows] = useState()
  const [dataBaseFields, setDataBaseFields] = useState()
  const [editMode, setEditMode] = useState()
  const [loadingImage, setLoadingImage] = useState()
  const [propertyToBeUpdated, setPropertyToBeUpdated] = useState("Property")
  const [propertyToBeUpdatedValue, setPropertyToBeUpdatedValue] = useState()
  const [cardId, setCardId] = useState()
  const [newPhotoToBeUpdated, setNewPhotoToBeUpdated] = useState()
  const [pictureChosen, setPictureChosen] = useState()
  const [allowForDeleteAlert, setAllowForDeleteAlert] = useState()
  const [fieldEmptyAlert, setFieldEmptyAlert] = useState()
  const [cardEmptyAlert, setCardEmptyAlert] = useState()
  const [widthValue, setWidthValue] = useState(window.innerWidth)
  
  const updateInput = useRef()
  const dataBaseUrl = "https://phonebook-challenger.herokuapp.com/"
  const quoteWarningFillInputs = "Fill in all entries"
  const quoteConfirmDelete = "Are you sure you want to delete this card ?!"
  
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
      setFieldEmptyAlert(true)
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
        setCardEmptyAlert(true)
      }  
  }

  const updateNewUser = () => {
    if (propertyToBeUpdated === 'foto') {
      updateNewPhoto(propertyToBeUpdatedValue)
    }
    else {
      const axiosInfosSetup = {
        newValue: propertyToBeUpdatedValue,
        lineKey: cardId,
        lineChange: propertyToBeUpdated
      }
      if (propertyToBeUpdatedValue && cardId && propertyToBeUpdated !== "Property") {
        Axios.put(dataBaseUrl, axiosInfosSetup)
          .then(setLoadingImage(!loadingImage))
          .then(res => setDataBase(res.data))
          .then(() => updateInput.current.value = '')
      }
      else {
        setFieldEmptyAlert(true)
      }
    }    
  }

  const updateNewPhoto = e => {
    e.preventDefault()
    const event = e.target
    if(newPhotoToBeUpdated) {
    const formData = new FormData(event)
    formData.append('lineKey', cardId)
    formData.append('lineChange', propertyToBeUpdated)
    console.log(formData.get('lineKey'))
    Axios.put(dataBaseUrl, formData)
      .then(setLoadingImage(!loadingImage))
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

  useEffect (() => {
    if(fieldEmptyAlert || cardEmptyAlert) {
      setTimeout(() => {
        setFieldEmptyAlert(false)
        setCardEmptyAlert(false)
      }, 10000)
    }
    
  },[allowForDeleteAlert, fieldEmptyAlert, cardEmptyAlert])

  return (
    <>
    {
    loadingImage && <Loading/>
    }
		<div className = {`container-fluid bg-dark text-white min-vh-100`}>
			<div className = {`row`}
			style = {{height: '5%'}}
			>
				{
					<Offcanvas
					createNewUser = {(data) => createNewUser(data)}
					allowForDeleteAlert = {allowForDeleteAlert}
					setAllowForDeleteAlert = {data => setAllowForDeleteAlert(data)}
					dataBaseRows = {dataBaseRows}
					propertyToBeUpdated = {propertyToBeUpdated}
					setPropertyToBeUpdated = {data => setPropertyToBeUpdated(data)}
					setPropertyToBeUpdatedValue = {data => setPropertyToBeUpdatedValue(data)}
					updateInput = {updateInput}
					updateNewUser = {updateNewUser}
          newPhotoToBeUpdated = {newPhotoToBeUpdated}
          setNewPhotoToBeUpdated = {data => setNewPhotoToBeUpdated(data)}
          pictureChosen = {pictureChosen}
          setPictureChosen = {data => setPictureChosen(data)}
          updateNewPhoto = {data => updateNewPhoto(data)}
					/>
				}
				{
					fieldEmptyAlert && 
					<Alert
					type = {"warning"}
          quote = {quoteWarningFillInputs}
          fieldEmptyAlert = {fieldEmptyAlert}
					setFieldEmptyAlert = {data => setFieldEmptyAlert(data)}
          allowForDeleteAlert = {allowForDeleteAlert}
          setAllowForDeleteAlert = {data => setAllowForDeleteAlert(data)}
					/>


				}
        {
          allowForDeleteAlert && 
          <Alert
          type = {`permissonDelete`}
          setCardId = {data => setCardId(data)}
          cardId = {cardId}
          deleteNewUser = {() => deleteNewUser()}
          setAllowForDeleteAlert = {data => setAllowForDeleteAlert(data)}
          setFieldEmptyAlert = {data => setFieldEmptyAlert(data)}
          />                                                                                                                                                                                                                                                                                                                                                                                              
        }
			</div>
			<div className = {`row g-3 row-cols-1 || row-cols-md-2 g-md-3 px-5 || row-cols-lg-3 || row-cols-xxl-4`}>
				{
					dataBaseRows && dataBaseRows.map(row => {
						return (
							<Card
							row = {row}
							cardId = {cardId}
							setCardId = {data => setCardId(data)}
							/>
						)
					})
				}	
			</div>
		</div>
    </> 
  )
}

export default App;
