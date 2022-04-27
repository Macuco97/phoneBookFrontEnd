function Loading() {
    return (
        <>
            <div className = {`container-fluid vh-100 fixed-top`} style = {{opacity: "0.5", background: "black"}}/>
            <div className = {`container-fluid vh-100 fixed-top d-flex justify-content-center align-items-center`}>
                <div class="spinner-border text-primary border-5" role="status" style = {{width: "15rem", height: "15rem"}}>
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    )                                                                                     
}

export default Loading