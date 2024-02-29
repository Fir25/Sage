import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import logoutfunction from '../authentification/logoutfunction';
function AjouterContrat() {
    const url=process.env.React_App_URL;
    const [contratname, setContratName] = useState('');

    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
   
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
   
   var contratedit=test['"contratsedit"']
   var contratdelete=test['admin']
   
    
  }


    const handlesubmit = (e) => {
        e.preventDefault()
        const contrat = { contratname }

        fetch(url+"contrats/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:token
                },
                body: JSON.stringify(contrat)
            }).then((data) => {
            
            window.location.reload(false);
        
    
            }).catch((e) => {

             /**   if ( e.response.status=== 401) {
                    logoutfunction(e.response.status)
                  } */
            })
    }


    return (
        <div>

            <div className="row">

              {
                contratedit &&  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajoutercontrat">
                Ajouter Un Contrat
            </button>
              }  


                <div className="modal fade" id="ajoutercontrat"  role="dialog" aria-labelledby="#ajoutercontrat" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ajouter Un Contrat</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <input className="form-control" placeholder="Ajouter Un Contrat" value={contratname} name="contratname" onChange={(e) => setContratName(e.target.value)} type="text" />
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
                                        <button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button>
                                    </div>

                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>


    )

}
export default AjouterContrat;