import './App.css';
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
  const [createNewUserFormStatus, setCreateNewUserFormStatus] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  const [currentColumnToBeUpdated, setCurrentColumnToBeUpdated] = useState()
  const [currentRowToBeUpdated, setCurrentRowToBeUpdated] = useState()
  const [newPhotoToBeUpdated, setNewPhotoToBeUpdated] = useState()
  const [test, settest] = useState()
  const dataBaseUrl = process.env.NODE_ENV == 'development' ?  "http://192.168.1.7:3001" : "https://phonebook-challenger.herokuapp.com/"
  console.log(process.env.NODE_ENV)


  let row 
  let rowKeys 
  let field
  let primaryKey
  
  const pathToFileName = path => {
    const pathArray = path.split("\\")
    const pathArrayLastPosition = pathArray.length - 1
    const file = pathArray[pathArrayLastPosition] 
    return file
  }
  
  const fetchDataBaseFromSql = url => {
  Axios.get(dataBaseUrl)
    .then(setLoadingImage(!loadingImage))
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
      setCreateNewUserFormStatus(!createNewUserFormStatus)
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
      .then(res => setDataBase(res.data))
      .catch(err => console.log(err))
      
  }

  const updateNewUser = e => {
    e.preventDefault()
    const event = e.target.toBeUpdatedInput
    const toBeUpdatedInputValue = event.value
    const axiosInfosSetup = {
      newValue: toBeUpdatedInputValue,
      lineKey: currentRowToBeUpdated,
      lineChange: currentColumnToBeUpdated
    }

    if (toBeUpdatedInputValue) {
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

  const extentionJpegChecker = e => {
    let extention = e.target.value.split(".")
    extention = extention[extention.length - 1]
    if (extention !== "jpeg") {
      e.target.value = ""
      alert("Please, import a file that has the extension jpeg")
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
  },[dataBaseRows])

  

  return (
    <div className = 'container'>

      {
      createNewUserFormStatus &&
      <form className = 'addNewUserForm' onSubmit = {e => createNewUser(e)}>
        <input className = 'uploadFotoInput' name = 'foto' id = 'foto' type = 'file'></input>
        <input 
          placeholder='Type your name here'
          name = 'nome'
        />
        <input 
          placeholder = 'Type your name phone here'
          name = 'telefone'
          />
        <input 
          placeholder = 'Type your email here'
          name = 'email'
          />
        <button>Create</button>
      </form>
      }
      <div className = 'header'>
        <img className = 'addNewUserIco' src = {addItemIcon} alt = 'Icon Add User' onClick = {e => setCreateNewUserFormStatus(!createNewUserFormStatus)}/>
        {loadingImage ? <img className = 'loadingIco' src = {loadingIco} alt = 'Loading Ico'/> : null}
        <h3 className = 'title'>Phonebook</h3>
      </div>
      <div className = 'body'>
        {
        dataBaseRows && dataBaseRows.map( row => {
          rowKeys = Object.keys(row)
          return (
            <div className = 'bodyField'>
              <div className = 'profileField'>
                <button name = {row.telefone} onClick = {e => deleteNewUser(e)}>X</button>
                {
                  (currentColumnToBeUpdated === "foto" && currentRowToBeUpdated === row.telefone) ?
                  <form className = 'toBeUpdatedPhotoForm' onSubmit = {e => updateNewPhoto(e)}>
                    <label for = 'toBeUpdatedPhotoInput' className = 'toBeUpdatedPhotoLabel'>                    
                      <div className = {newPhotoToBeUpdated && 'toBeUpdatedPhotoDiv'}>
                        {
                          newPhotoToBeUpdated ?
                          newPhotoToBeUpdated
                          :
                          "Click here for Upload a New Photo"
                        }
                      </div>
                      <button className = 'toBeUpdatedPhotoButton'><div>Send</div></button>
                    </label>
                    <input onChange = {e => setNewPhotoToBeUpdated(pathToFileName(e.target.value))} name = 'photo' id = 'toBeUpdatedPhotoInput' className = 'toBeUpdatedPhotoInput' type = 'file'/>
                    
                  </form>
                  :
                  <img 
                    className = 'profileImage' 
                    alt = 'profileImage' 
                    src = {`data:image/png;base64,${row.foto}`}
                    onDoubleClick = { () => {setKeysInState(row.telefone, "foto")} }
                  />
                }
              </div>
              <ul className = 'infoField'>
                {
                  rowKeys.map( key => {
                    field = row[key]
                    primaryKey = row.telefone
                    if(key != "foto") {
                      if(currentColumnToBeUpdated === key && currentRowToBeUpdated === row.telefone) {
                        return (
                          <form onSubmit = {e => updateNewUser(e)}>
                            <input name = 'toBeUpdatedInput' className = 'fieldToBeUpdatedInput'/>
                            <button className ='submitButton'><img  className = 'submitIco' alt = 'submitIco' src = {submitIco} /></button>
                            <img className = 'xIco' alt = 'submitIco' src = {xIco} onClick = {e => {setKeysInState("", "")}} />
                          </form>
                        )
                      }
                      else {
                        return (
                          <li key = {key}>{field}<img onDoubleClick = {e => setKeysInState(row.telefone, key)} className = 'editIco' alt = 'Edit Ico' src = {editIco}/></li>
                        )
                      }
                      
                    }
                  } )
                }
                
              </ul> 
             
                
            </div>
          )
        } )
        }
      </div>
          
    </div>
  )
}

export default App;
