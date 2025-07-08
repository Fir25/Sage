import React, { useState } from 'react';
import logoutfunction from '../authentification/logoutfunction';


function AjouterSite(){
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const url=process.env.React_App_URL;
   const[nomsite,setNomSite]=useState('')

    const handlesubmit = (e) =>{
      e.preventDefault()
   

      const site = {nomsite}
    
      fetch(url+"createlistsite/" , 
      {
        method : "POST" , 
        headers : {
         "Content-Type" : "application/json" ,
         Authorization: token,
        },
        body : JSON.stringify(site)
      }).then(() =>{
      
  
       window.location.reload();
  
    }).catch((err)=>{
    
    /**  if ( err.response.status=== 401) {
        logoutfunction(err.response.status)
      } */
    })
    } 

///

 
 

///
    return(
        <div>

      <div className="row">

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpointage">
          Ajouter Site
        </button>


        <div className="modal fade" id="ajouterpointage"  role="dialog" aria-labelledby="ajouterpointage" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ajouter un site</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

      


                <form>


                

                      <div className="form-group">
                    

                          <input className="form-control" placeholder="Nom de site" value={nomsite} name="nom" onChange={(e) => setNomSite(e.target.value)} type="text" />
                    
                      
        </div>
             
              
                  <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button></div>



                </form>
 

              </div>

              <div className="modal-footer">



              </div>

            </div>
          </div>
        </div>
      </div>


    </div>


    )
}




export default AjouterSite;