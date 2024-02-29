import React from "react"
import { useState } from "react";


import TextField from '@mui/material/TextField';

import useFetch from "../useFetch";
import Autocomplete from '@mui/material/Autocomplete';
import HistoriqueFunction from "../Historique/HistoriqueFunction";
import { useSelector } from "react-redux";
const AjouterSolde = () => {


    const url=process.env.React_App_URL;
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      var iduserinfo=test['id']
     
      
  
      
    }
    const [sol, setSolde] = useState('')
    const [employes, setEmployes] = useState('');
const [commentaire,setCommentaire]=useState('')
const[soldeactuelle,setSoldeActuelle]=useState('')
    const { data: employees, isloading: zz, error: ee } = useFetch(url+"user/")
   
   
 const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  
    const UpdateSolde= (e) =>{
        const data={employes,sol}
        e.preventDefault()
      

   
        fetch(url+'updateSoldeUser' , {
          method : "PUT" , 
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
          }
         ,body:JSON.stringify(data)
        }).then(r=>
            { return r.json();}
            )
        
        .then((res) =>{
            if (soldeactuelle=="" || soldeactuelle==null ){
        
                HistoriqueFunction(0,sol,employes,iduserinfo,sol,commentaire)
         }else{
       
            console.log('aaa',sol)
            const  solde=Number(sol)+soldeactuelle
             HistoriqueFunction(soldeactuelle,solde,employes,iduserinfo,sol,commentaire)
         }
         window.location.reload(false)

      }).catch((err)=>{
      
        
      })

      } 

    return (
        <>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajoutersolde">
                Ajouter Solde
            </button>


            <div className="modal fade" id="ajoutersolde" role="dialog" aria-labelledby="#ajoutersolde" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Ajouter solde</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                <input className="form-control" placeholder="Solde de congé" value={sol} onChange={(e) => setSolde(e.target.value)} type="number" />

                                </div>
                                <div className="form-group">

                                <Autocomplete

options={employees}
getOptionLabel={(option) => option.user_name + "  " + option.last_name || ""}

renderInput={(params) => (
    <TextField {...params} label="employe" variant="outlined" />
)}
onChange={(event, value) => {if (value && value.id ){setEmployes(value.id)}if(value && value.solde ){setSoldeActuelle(value.solde)}}}

/>

                                </div>
                                <div className='form-group'>
                         
                            <textarea placeholder='commentaire' className="form-control" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="4" ></textarea>

                            </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
                                    <button className="btn btn-primary" onClick={UpdateSolde} >Valider</button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default AjouterSolde;