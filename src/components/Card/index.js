import './Card.module.css'

function Card({ row, cardId, setCardId }) {
    return (
      <div className = {`col`}>
          <div 
                          className = {`${row.telefone === cardId && 'border-danger'} card border-3 bg-secondary text-white px-0`}  
                          
                          onClick = {e => {
                          if(cardId === row.telefone) {
                              setCardId(undefined)
                              }
                          else {
                              setCardId(row.telefone)
                              }
                            }} 
                            name = {row.telefone}
                            style = {{cursor: 'pointer'}}
                            >
                            <img 
                            className="card-img-top"
                            alt = 'profileImage' 
                            src = {`data:image/png;base64,${row.foto}`}
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
}

export default Card