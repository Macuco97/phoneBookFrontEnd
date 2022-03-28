import './App.css';
import Axios from "axios"
import React, { useState, useEffect } from "react"
import addItemIcon from "./addItemIcon.png"



function App() {
  const [dataBase, setDataBase] = useState()
  const [dataBaseRows, setDataBaseRows] = useState()
  const [dataBaseFields, setDataBaseFields] = useState()
  const [visibilityForm, setVisibilityForm] = useState("invisible")
  const [buttonSimbol, setButtonSimbol] = useState("+")
  const dataBaseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://phonebook-challenger.herokuapp.com/"
  let row 
  let rowKeys 
  let field
  
  const fetchDataBaseFromSql = url => {
  Axios.get(dataBaseUrl)
    .then(res => setDataBase(res.data))
    .catch(err => console.log(err))
  }

  

  const openForm = e => {
    e.preventDefault()
    if (visibilityForm === "invisible") {
      setVisibilityForm("visible")
      setButtonSimbol("x")
    }
    else {
      setVisibilityForm("invisible")
      setButtonSimbol("+")
    }
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


  useEffect (() => {
    fetchDataBaseFromSql(dataBaseUrl)
  }, [])

  useEffect (() => {
    if(dataBase) {
      setDataBaseFields(dataBase.fields)
      setDataBaseRows(dataBase.rows)
    }
  },[dataBase])

  

  return (
    <div className = 'container'>
      <div className = 'header'>
        <img className = "addItemIcon" src = {addItemIcon} alt = 'Icon Add User'/>
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
                <img alt = 'profileImage' src = {'data:image/png;base64,', row.foto}/>
              }
              </div>
            </div>
          )
        } )
        }
      </div>
          
    </div>
  )
}

export default App;
