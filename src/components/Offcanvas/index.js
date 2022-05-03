function Offcanvas({ updateNewPhoto, setNewPhotoToBeUpdated, pictureChosen, setPictureChosen ,createNewUser, allowForDeleteAlert, setAllowForDeleteAlert, updateNewUser, dataBaseRows, setPropertyToBeUpdated, setPropertyToBeUpdatedValue, updateInput, propertyToBeUpdated}) {
    return (
        <>
            <button class="btn btn-primary d-flex bg-dark border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-menu-button" viewBox="0 0 16 16">
                <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h8A1.5 1.5 0 0 1 11 1.5v2A1.5 1.5 0 0 1 9.5 5h-8A1.5 1.5 0 0 1 0 3.5v-2zM1.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-8z"/>
                <path d="m7.823 2.823-.396-.396A.25.25 0 0 1 7.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2H1zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
            </svg>
            </button>
            <div class="offcanvas offcanvas-start bg-secondary" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Create New User</h5>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div class="offcanvas-body">
                    <form onSubmit = {e => createNewUser(e)}>
                        <div className = 'input-group my-3'>
                            <input type="file" name = 'foto' className="d-block form-control" id="inputGroupFile03" aria-describedby="inputGroupFileAddon03" aria-label="Upload"/>
                        </div>
                        <div className = 'input-group my-3'>
                            <span className="d-block input-group-text" id="addon-wrapping">Name</span>
                            <input type="text" name = 'nome' className="form-control" placeholder="Name" aria-label="Username" aria-describedby="addon-wrapping"></input>
                        </div>
                        <div className = 'input-group my-3'>
                            <span className="d-block input-group-text" id="addon-wrapping">Phone</span>
                            <input type="text" name = 'telefone' className="form-control" placeholder="Phone" aria-label="Username" aria-describedby="addon-wrapping"></input>
                        </div>
                        <div className = 'input-group my-3'>
                            <span className="d-block input-group-text" id="addon-wrapping">E-mail</span>
                            <input type="email" name = 'email' className="form-control" placeholder="E-mail" aria-label="Username" aria-describedby="addon-wrapping"></input>
                        </div>
                        <button type="submit" class="btn btn-dark mb-3">Create New User</button>
                        <button type = 'button' class = 'btn btn-dark mb-3 mx-3' onClick = {() => setAllowForDeleteAlert(true)}>Delete Card</button>
                        </form>
                        <hr/>
                        <h5 className = {`mb-5`}>Update Some User</h5>
                        <div class="input-group mb-3">
                            <button type="button" className = {`btn btn-outline-dark text-capitalize`} style = {{width: '6rem'}}>{propertyToBeUpdated}</button>
                            <button type="button" class="btn btn-outline-dark dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="visually-hidden">Toggle Dropdown</span>
                            </button>
                            <ul class="dropdown-menu">
                            {
                            dataBaseRows &&
                            Object.keys(dataBaseRows[0]).map(key => {
                            return (<li
                                className = {`text-capitalize ms-2`}
                                onClick = {() => setPropertyToBeUpdated(key)}
                                style = {{cursor: 'pointer'}}
                                >
                                {key}
                                </li>
                            )
                            })
                            }
                            </ul>    
                            {
                                propertyToBeUpdated === "foto" ?
                                <>
                                    <form id = 'updatedPhotoForm' onSubmit = { e => updateNewPhoto(e) }>
                                        <input
                                        name = 'photo'
                                        form = 'updatedPhotoForm'
                                        type = 'file'
                                        className = {`form-control`}
                                        aria-label="Text input with segmented dropdown button"
                                        onChange = {e => setNewPhotoToBeUpdated(e.target.value)}
                                        ref = {updateInput}
                                        />
                                    </form>
                                </>
                                :
                                <>
                                    <input 
                                    type="text" 
                                    class="form-control"
                                    aria-label="Text input with segmented dropdown button"
                                    onChange = {e => setPropertyToBeUpdatedValue(e.target.value)}
                                    ref = {updateInput}
                                    />
                                    <button
                                    className = {`btn btn-dark ms-1`}
                                    onClick = {() => updateNewUser()}
                                    type = 'button'
                                    >
                                    Update
                                    </button>
                                </>
                            }                        
                           
                        </div>
                       { 
                        propertyToBeUpdated === 'foto' && 
                        <button
                            className = {`btn btn-dark ms-1`}
                            form = 'updatedPhotoForm'
                            >
                            Update
                        </button>
                        }
                </div>
            </div>
        </>
    )                                                                             
}

export default Offcanvas