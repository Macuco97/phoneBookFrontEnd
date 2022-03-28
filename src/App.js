import './App.css';
import Axios from "axios"
import React, { useState, useEffect } from "react"
import addItemIcon from "./addItemIcon.png"



function App() {
  const [dataBase, setDataBase] = useState()
  const [dataBaseRows, setDataBaseRows] = useState()
  const [dataBaseFields, setDataBaseFields] = useState()
  const [visibilityForm, setVisibilityForm] = useState("invisible")
  const [editMode, setEditMode] = useState('NormalMode')
  const dataBaseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://phonebook-challenger.herokuapp.com/"
  let row 
  let rowKeys 
  let field
  
  const fetchDataBaseFromSql = url => {
  Axios.get(dataBaseUrl)
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
      console.log(formData.get("nome"))
      Axios.post(dataBaseUrl, formData)
        .then(res => setDataBase(res.data))
        .catch(err => console.log(err))
    }
    else {
      alert("Please, fill all")
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
      .then(res => setDataBase(res.data))
  }

  const updateNewUser = (lineKey, lineChange) => {
    console.log(lineKey, lineChange)
    const newValue = prompt("Escolha o novo valor:")
    Axios.put(dataBaseUrl, {
      newValue: newValue,
      lineKey: lineKey.telefone,
      lineChange: lineChange
    })
      .then(res => setDataBase(res.data))
  }

  const extentionJpegChecker = e => {
    let extention = e.target.value.split(".")
    extention = extention[extention.length - 1]
    if (extention !== "jpeg") {
      e.target.value = ""
      alert("Please, import a file that has the extension jpeg")
    }
  }

  const changeEditMode = () => {
    if(editMode === "NormalMode") {
      setEditMode("AddUserMode")
    }
    else {
      setEditMode("NormalMode")
    }
  }


  useEffect (() => {
    fetchDataBaseFromSql(dataBaseUrl)
  }, [])

  useEffect (() => {
    if(dataBase) {
      setDataBaseFields(dataBase.fields)
      setDataBaseRows(dataBase.rows)
    }
  },[dataBase])

  useEffect (() => {
    console.log(editMode)
  },[editMode])

  

  return (
    <div className = 'container'>
      <form className = {`addNewUserForm${editMode}`} onSubmit = {e => createNewUser(e)}>
        <input className = 'uploadFotoInput' name = 'foto' id = 'foto' type = 'file'></input>
        <input name = 'nome'/>
        <input name = 'telefone'/>
        <input name = 'email'/>
        <button>Create</button>
      </form>
      <div className = 'header'>
        <img className = "addItemIcon" src = {addItemIcon} alt = 'Icon Add User' onClick = {e => {changeEditMode()}}/>
        <h3 className = 'title'>Phonebook</h3>
      </div>
      <div className = 'body'>
        {
        dataBaseRows && dataBaseRows.map( row => {
          rowKeys = Object.keys(row)
          return (
            <div className = 'bodyField'>
              <div className = 'profileField'>
                {
                  <img className = 'profileImage' alt = 'profileImage' src = {`data:image/png;base64,${row.foto}`}/>
                }
              </div>
              <ul className = 'infoField'>
                {
                  rowKeys.map( key => {
                    field = row[key]
                    if(key != "foto") {
                      return (
                        <li>{field}</li>
                      )
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
