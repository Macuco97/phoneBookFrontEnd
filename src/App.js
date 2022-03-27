import './App.css';
import Axios from "axios"
import React, { useState, useEffect } from "react"


function App() {
  const [database, setDatabase] = useState()
  const [visibilityForm, setVisibilityForm] = useState("invisible")
  const [buttonSimbol, setButtonSimbol] = useState("+")
  const databaseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://phonebook-challenger.herokuapp.com/"

  const fetchDatabaseFromSql = url => {
  Axios.get(databaseUrl)
    .then(res => setDatabase(res.data))
    .catch(err => console.log(err))
  }

  useEffect (() => {
    fetchDatabaseFromSql(databaseUrl)
  }, [''])

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
      Axios.post(databaseUrl, formData)
    }
    else {
      alert("Please, fill all")
    }
      
  
  }

  const deleteNewUser = e => {
    Axios.delete(databaseUrl, {
      data: {
        telefone: e.target.name
      },
      headers: {
        "Authorization" : "***"
      }

    })
      .then(res => setDatabase(res.data))
  }

  const updateNewUser = (lineKey, lineChange) => {
    console.log(lineKey, lineChange)
    const newValue = prompt("Escolha o novo valor:")
    Axios.put(databaseUrl, {
      newValue: newValue,
      lineKey: lineKey.telefone,
      lineChange: lineChange
    })
      .then(res => setDatabase(res.data))
  }

  const extentionJpegChecker = e => {
    let extention = e.target.value.split(".")
    extention = extention[extention.length - 1]
    if (extention !== "jpeg") {
      e.target.value = ""
      alert("Please, import a file that has the extension jpeg")
    }
  }

  function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
       arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
 }

  

  return (
    <div className="Container">
      <button className = 'openForm-button' onClick = {e => openForm(e)}>{buttonSimbol}</button>
      <form className = {`addNewUser-form-${visibilityForm}`} onSubmit = {e => createNewUser(e)}>
        <label 
          className = "uploadLabel">Foto 
                                    <input 
                                      name = "foto"
                                      accept = "image/*"  
                                      type = "file" 
                                      className = "uploadInput" 
                                      onChange = {e => extentionJpegChecker(e)} />
        </label>
        <label>Nome</label><input name = "nome"/>
        <label>Telefone</label><input type = 'tel' name = "telefone"/>
        <label>E-mail</label><input type = 'email' name = "email"/>
        <button className = 'addNewUser-button'>Criar novo usuário</button>
      </form>
      <table className = {`phoneBook-table-${visibilityForm}`}>
        <tr className = "phoneBook-table-firstLine">
          { 
            database && database.fields.map(firstLineName => {
              return <th>{firstLineName.name}</th>
            }) 
          }
          <th></th>
        </tr>
        {
          database && database.rows.map(othersLine => {
            return (
              <tr className = {'phoneBook-table-othersLine'}>
                {
                  Object.keys(othersLine).map(othersLineContent => {
                    if (othersLineContent === "foto") {
                      const sourcerImage = `data:image/png;base64,${othersLine[othersLineContent]}`
                      return <td className = {'phoneBook-table-othersField'} onClick = {e => console.log(sourcerImage)} onDoubleClick = {() => updateNewUser(othersLine, othersLineContent)}><img alt = "Foto do usuário" src = {sourcerImage}  className = {'phoneBook-table-othersField-foto'} /></td>
                    }
                    else {
                      return <td className = {'phoneBook-table-othersField'}  onDoubleClick = {() => updateNewUser(othersLine, othersLineContent)}>{othersLine[othersLineContent]}</td> 
                    }
                    
                  })
                }
                <button className = {'phoneBook-table-delete-button'} name = {othersLine.telefone} onClick = {e => deleteNewUser(e)}>X</button>
              </tr>
            )
          })
        }
      </table>
      
    </div>
  )
}

export default App;
