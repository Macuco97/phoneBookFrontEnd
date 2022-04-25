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
  const [propertyToBeUpdated, setPropertyToBeUpdated] = useState("Property")
  const [propertyToBeUpdatedValue, setPropertyToBeUpdatedvalue] = useState()
  const [cardId, setCardId] = useState()
  const [newPhotoToBeUpdated, setNewPhotoToBeUpdated] = useState()
  const [pictureChosen, setPictureChosen] = useState()
  const [allowForDeleteAlert, setAllowForDeleteAlert] = useState()
  const [fieldEmptyAlert, setFieldEmptyAlert] = useState()
  const [cardEmptyAlert, setCardEmptyAlert] = useState()
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
    
    </> 
  )
}

export default App;
