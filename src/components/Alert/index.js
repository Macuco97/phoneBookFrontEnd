function Alert({ quote, type, setCardId, cardId, deleteNewUser, setFieldEmptyAlert, allowForDeleteAlert, setAllowForDeleteAlert }) {
	return (
        
        <div className = {`fixed-top justify-content-center d-flex`} style = {{zIndex: '1050'}}>
            {
            type === "warning" &&
            <div class="m-1 alert alert-warning  p-2  mx-3 d-flex" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                <path 
                d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                />
                </svg>
                <span 
                className = 'flex-grow-1'
                >{quote}
                </span>
                <button 
                type = 'button' 
                class = {`ms-3 btn btn-close align-self-center`} 
                aria-label = {`Close`} 
                style = {{position: "relative", right: "0"}}
                onClick = {() => setFieldEmptyAlert(false)}
                />
             </div>
            }
            {
                type === 'permissonDelete' &&
                <div class="m-1 alert alert-danger d-flex fixed-top p-2 align-self mx-3"  role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <div>
                  <span>Area you sure wanna delete selected card ?!</span>
                  <button 
                  className = 'mx-3 btn btn-danger py-0'
                  onClick = {() => {
                    if(cardId) {
                      setAllowForDeleteAlert(false)
                      setCardId(undefined)
                      deleteNewUser()
                    }
                    else {
                      setFieldEmptyAlert(true)
                      setAllowForDeleteAlert(false)
                    }
                    
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
            }
        </div>
           
	)
}

export default Alert