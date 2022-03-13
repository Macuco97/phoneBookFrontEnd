import './App.css';
import Axios from "axios"
import { useState, useEffect } from "react"

function App() {
  const [database, setDatabase] = useState()
  const [visibilityForm, setVisibilityForm] = useState("invisible")
  const [buttonSimbol, setButtonSimbol] = useState("+")
  const databaseUrl = "https://phonebook-challenger.herokuapp.com/"

  const fetchDatabaseFromSql = url => {
  Axios.get(databaseUrl)
    .then(res => setDatabase(res.data))
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
    console.log(database.rows)
  }

  const createNewUser = e => {
    e.preventDefault()
    const event = e.target
    if(event.Foto.value && event.Nome.value && event.Telefone.value && event.Email.value){
        console.log(event.Foto.value)
        Axios.post(databaseUrl, {
          foto: event.Foto.value,
          nome: event.Nome.value,
          telefone: event.Telefone.value,
          email: event.Email.value
        })
          .then(res => setDatabase(res.data))
        setVisibilityForm('invisible')
        event.Foto.value = ""
        event.Nome.value = ""
        event.Telefone.value = ""
        event.Email.value = ""
     }
    else {
        alert("Por favor, preencha todos os campos!!!")
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
  

  useEffect (() => {
    fetchDatabaseFromSql(databaseUrl)
  },[])

  useEffect (()=> {
    console.log(database)
  }, [database])

  return (
    <div className="Container">
      <button className = 'openForm-button' onClick = {e => openForm(e)}>{buttonSimbol}</button>
      <form className = {`addNewUser-form-${visibilityForm}`} onSubmit = {e => createNewUser(e)}>
        <label>Foto</label><input name = "Foto"/>
        <label>Nome</label><input name = "Nome"/>
        <label>Telefone</label><input type = 'tel' name = "Telefone"/>
        <label>E-mail</label><input type = 'email' name = "Email"/>
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
                    console.log(othersLineContent === "foto")
                    if (othersLineContent === "foto") {
                      return <td className = {'phoneBook-table-othersField'}><img alt = "Foto do usuário" src = {othersLine[othersLineContent]} className = {'phoneBook-table-othersField-foto'}  onDoubleClick = {() => updateNewUser(othersLine, othersLineContent)}/></td>
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
