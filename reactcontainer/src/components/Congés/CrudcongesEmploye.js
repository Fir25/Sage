import React from 'react';

import useFetch from '../useFetch';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import ScrollContainer from 'react-indiana-drag-scroll'

import { useSelector } from 'react-redux';


import Ajoutercongé from './AjouterCongé';
import { useState } from 'react';
import Mouchard from '../Mouchardd/Mouchard';
function CrudcongesEmploye(){
  const url=process.env.React_App_URL;
  const formRef = React.useRef();


  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    
  }
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
const[congeannulle,setCongAnnulle]=useState('')
const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
const[remarqueemploye,setRemarqueEmploye]=useState('')  
    const { data: conges = [], isloading, error } = useFetch(url+"AffichageDemendesConges/"+iduserinfo)
    const AnnullerConge = (id) => {
const validationrh2=6
const validationrh=5
      let List = { remarqueemploye,validationrh,validationrh2}
  
  
      fetch(url+'AnnullerCongeEmploye/' + id, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization:token
        },
        body: JSON.stringify(List)
      }).then(() => {
      //  Mouchard("encours", "annulé", iduser,iduserinfo, "Annuller de congé de " + datedebut + "au " + datefin)
  
  
        window.location.reload(false)
  
      }).catch((e) => {
  
       /** if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
    })
    }

    return(
    <div>
          <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
  {/**        <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Demande de congés</h3>
      </div> */}
      <div className="card-header border-0">
  <Ajoutercongé/>
      </div>
      <div className="table-responsive">
      <ScrollContainer className="scroll-container">
        <table className="table table-bordered display">
        <thead className="thead-light">
    <tr>

     <th style={{width:"20%"}} scope="col">Employé</th>
    
      <th style={{width:"10%"}} scope="col">début</th>
      <th style={{width:"10%"}} scope="col">fin</th>
   

      <th style={{width:"20%"}} scope="col">Cause</th>
      <th style={{width:"10%"}} scope="col"> Nb jours demandés</th>
      <th style={{width:"10%"}} scope="col">Solde</th>

      <th style={{width:"5%"}} scope="col">Statut</th>
      <th style={{width:"5%"}} scope="col">Motif</th>
   <th scope="col">Action</th> 
    </tr>
  </thead>
  <tbody>

     
    {conges.map(conge =>
          <tr key={conge.idconge}>
              <td >{conge.user_name }{" "}{ conge.last_name == null ? "" : conge.last_name}</td>
             
           <td>{conge.datedebut}   {conge.matindebut==true? "Matin": "Aprés-midi"}</td>
           <td>{conge.datefin }  {conge.matinfin==true? "Matin": "Aprés-midi"} </td>
    

           <td>{conge.commentaire}</td>
           <td>{conge.nbjourscoupes == null ? "0" : conge.nbjourscoupes}</td>
           <td>{conge.adresse}</td>
           <td>{ conge.validation==6? "réfusé" : conge.validation==4   ?"validé" : conge.validation==5 ? "annulé": conge.validation==2? "validé par valideur 2":conge.validation==1? "validé par valideur 1 ":conge.validation==3? "validé par valideur 3 " : conge.validation==0? "en_attente":"" }</td>
      
           <td>{conge.motif}</td>
  { conge.validation==4 || conge.validation==3 || conge.validation==6 || conge.validation==5|| conge.validationrh2==2? "": <td>
                        
                        <a onClick={() => { handleClickOpen(); setCongAnnulle(conge.idconge); }} className="btn-sm btn-danger" >Annuller</a> 
                                          
                                           </td>
                  }
            </tr>
          )}
   
     
 <Dialog

BackdropProps={{ invisible: true }}

open={open}
onClose={handleClose}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">
  {"Annulation de congé"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir annuler cette demande de congé ?
  </DialogContentText>
  <form ref={formRef}>
  <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Remarque"
                          type="text"
                          fullWidth
                          variant="standard"
                          value={remarqueemploye}
                          onChange={(e) => { setRemarqueEmploye(e.target.value) }}
                          required
                        />
</form>
  
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>

  <Button onClick={()=>AnnullerConge(congeannulle) }>
    oui
  </Button>
</DialogActions>
</Dialog> 

  </tbody>
        </table>
        </ScrollContainer>
      </div>
  
    </div> 

          </div>
        </div>
        </div>
      </div> )
}
export default CrudcongesEmploye;