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


import Ajoutercongé from './Ajouterworkflow';
import { useState } from 'react';
import Mouchard from '../Mouchardd/Mouchard';
import Ajouterworkflow from './Ajouterworkflow';
function Crudworkflow(){
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
    const { data: workflows = [], isloading, error } = useFetch(url+"workflow/")
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
  <Ajouterworkflow/>
      </div>
      <div className="table-responsive">
      <ScrollContainer className="scroll-container">
        <table className="table table-bordered display">
        <thead className="thead-light">
    <tr>

     <th style={{width:"20%"}} scope="col">nom</th>
    
      <th style={{width:"10%"}} scope="col">motif</th>
      <th style={{width:"10%"}} scope="col">departement</th>
      <th style={{width:"10%"}} scope="col">validuer 1 </th>  
      <th style={{width:"20%"}} scope="col">valideur 2 </th>
      <th style={{width:"10%"}} scope="col"> valideur 3 </th>
      <th style={{width:"10%"}} scope="col">valideur 4 </th>
     
      
  
     
      
    </tr>
  </thead>
  <tbody>

     
    {workflows.map(conge =>
          <tr key={conge.id}>
              <td>{conge.nom }</td>
             
           <td>{conge.motif}</td>
           <td>{conge.dddddd}</td>
           <td>{conge.valideur_11} </td>
    
           {/**<td>{conge.contact}</td>
           
           <td>{conge.adresse}</td>
                <td>{conge.validation}</td>
          */}
       
      
      {/**     <td>{conge.personneinterimaire}</td> */}
           <td>{conge.valideur_21}</td>
           <td>{conge.valideur_31}</td>
           <td>{conge.valideur_41}</td>
        
      
          
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

  <Button onClick={() => {formRef.current.reportValidity()==true?AnnullerConge(congeannulle):formRef.current.reportValidity() }}>
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
export default Crudworkflow;