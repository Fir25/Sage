import React from 'react';

import { useState } from 'react';
import logoutfunction from '../authentification/logoutfunction';
import useFetch from '../useFetch';
import { MultiSelect } from '../MultiSelect';
import axios from 'axios';
function ImporterPointeuse(){
    const url=process.env.React_App_URL;
    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
    const { data: userss = [], isloading, error } = useFetch(url+"user/")
    const [nom_pointeuse, setNomPointeuse] = useState('');
    const [adresse_ip, setAdresseIP] = useState('');
    const [port, setPort] = useState('');
    
  const [options,setoptions]=useState([])
    const [SIV, setSIV] = useState('');
  
    const handlesubmit = (e) =>{

      e.preventDefault()
      const pointeuse = {nom_pointeuse , adresse_ip ,SIV,port }
    
      fetch(url+"pointeuse/" , 
      {
        method : "POST" , 
        headers : {
         "Content-Type" : "application/json" ,
         Authorization: token,
        },
        body : JSON.stringify(pointeuse),
      
      }).then((response) =>{
        if(!response.ok) throw new Error(response.status);
        else window.location.reload(false)
  
    }).catch((e) => {

       /** if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
    })
    } 
    const submitEmails = (e) =>{

      e.preventDefault()

    
      fetch(url+"Emailscreate/" , 
      {
        method : "POST" , 
        headers : {
         "Content-Type" : "application/json" ,
         Authorization: token,
        },
        body : JSON.stringify(options),
      
      }).then((response) =>{
        if(!response.ok) throw new Error(response.status);
      else window.location.reload(false)
  
    }).catch((e) => {

       /** if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
    })
    } 
function getEmails(){
    axios.get(url+"GetEmails/", {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        
        },
      }).then( res =>{
       setoptions(res.data) 
      }
        
      ).catch( err =>{
       /* if ( err.response.status=== 401) {
        logoutfunction(err.response.status)
        }*/
        

      })
}
    return(
        <div>
               
            <div className="row">
       



 <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpointeuse">Ajouter Pointeuse</button>
 
 <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouteremails" onClick={getEmails}>Paramètres</button>
 <div className="modal fade" id="ajouteremails"  role="dialog" aria-labelledby="#ajouteremails" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Choisissez des personnes pour les informer du problème lié à la pointeuse.</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                 

                                <MultiSelect options={userss} value={options} onChange={setoptions}  />
                                <div className="text-center">
                <button type="button" className="btn btn-primary my-4" onClick={submitEmails}>Enregistrer</button>
            </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
<div className="modal fade" id="ajouterpointeuse" role="dialog" aria-labelledby="ajouterpointeuse" aria-hidden="true">
 

    <div className="modal-dialog modal- modal-dialog-centered modal-sm" role="document">
        <div className="modal-content">
        	
            <div className="modal-body p-0">

<div className="card bg-secondary border-0 mb-0">
    <div className="card-header bg-transparent pb-5">
        <div className="text-muted text-center mt-2 mb-3"><small>Pointeuse</small></div>
        
          
        
          
        
    </div>
    <div className="card-body px-lg-5 py-lg-5">
      
        <form role="form">
            <div className="form-group mb-3">
                <div className="input-group input-group-merge input-group-alternative">
                   
                    <input className="form-control" placeholder="Nom de Pointeuse" value={nom_pointeuse} name="nom_pointeuse"  onChange={(e) => setNomPointeuse(e.target.value)} type="text"/>
                </div>
            </div>
            <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative">
                   
                    <input className="form-control" placeholder="Adresse IP" type="text" value={adresse_ip} name="adresse_ip"  onChange={(e) => setAdresseIP(e.target.value)} />
                </div>
            </div>
            <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative">
                   
                    <input className="form-control" placeholder="Port" type="text" value={port} name="port"  onChange={(e) => setPort(e.target.value)}/>
                </div>
            </div>
            <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative">
                   
                    <input className="form-control" placeholder="Device ID" type="text" value={SIV} name="SIV"  onChange={(e) => setSIV(e.target.value)}/>
                </div>
            </div>
            
            <div className="custom-control custom-control-alternative custom-checkbox">
                <input className="custom-control-input" id=" customCheckLogin" type="checkbox"/>
                
            </div>
            <div className="text-center">
                <button type="button" className="btn btn-primary my-4" onClick={handlesubmit}>Enregistrer</button>
            </div>
        </form>
    </div>
  </div>
</div>
</div></div></div></div>


</div>


    )
}




export default ImporterPointeuse;