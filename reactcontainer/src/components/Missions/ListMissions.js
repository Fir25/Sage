import React from 'react';

import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';


import ScrollContainer from 'react-indiana-drag-scroll'

import { useState } from 'react';



import AjouterMission from './AjouterMission';
import { useSelector } from 'react-redux';
function ListeMissions(){
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
   
  
    
  }
  const useStyle = makeStyles({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      color: '#5ac2df'








    },
    dialog: {

      boxShadow: 'none',
    }
  });
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyle()

  const url=process.env.React_App_URL;
    const { data: conges = [], isloading, error } = useFetch(url+"AffichageDemendesConges/"+iduserinfo)
    return(
    <div>
          <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
   {/**       <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Demande de missions</h3>
      </div> */}
      <div className="card-header border-0">
<AjouterMission/>
      </div>
      <div className="table-responsive">
      <ScrollContainer className="scroll-container">
        <table className="table table-bordered display">
        <thead className="thead-light">
    <tr>

     <th style={{width:"10%"}} scope="col">Employé</th>

      <th style={{width:"10%"}} scope="col">début</th>
      <th style={{width:"10%"}} scope="col">fin</th>
      <th style={{width:"10%"}} scope="col">Motif</th>
      <th style={{width:"10%"}} scope="col">Contact</th>
      <th style={{width:"10%"}} scope="col">Adresse</th>
      
  
      <th style={{width:"10%"}} scope="col">état</th>
      <th style={{width:"5%"}} scope="col">Solde</th>
     
      <th style={{width:"10%"}} scope="col">Heure debut</th>
      <th style={{width:"10%"}} scope="col">Heure fin</th>
      <th style={{width:"10%"}} scope="col">Départ</th>
      <th style={{width:"10%"}} scope="col">Destination</th>
      <th style={{width:"10%"}} scope="col">Transport</th>
      <th style={{width:"10%"}} scope="col">Commentaire</th>

      
    {/**  <th scope="col">Action</th> */}
    </tr>
  </thead>
  <tbody>

     
    {conges.filter(x=> x.mission==true).map(conge =>
          <tr key={conge.idconge}>
              <td>{conge.user_name}</td>
     
           <td>{conge.datedebut}</td>
           <td>{conge.datefin}</td>
           <td>{conge.motif}</td>
           <td>{conge.contact}</td>
           
           <td>{conge.adresse}</td>
         
       
           <td>{conge.validation}</td>
           <td>{conge.solde}</td>
           <td>{conge.heure_debut}</td>
           <td>{conge.heure_fin}</td>
 

           <td>{conge.depart}</td>
           
           <td>{conge.destination}</td>
           <td>{conge.transport}</td>
           <td>{conge.commentaire}</td>
         {/**  <td>
                        
           <a onClick={() => { handleClickOpen(); setcongeIddelete(conge.idconge); }}  ><DeleteIcon className={classes.icon} /></a>

                         
                          </td> */}
            </tr>
          )}
   
     
 
 {/**  <Dialog

BackdropProps={{ invisible: true }}
className={classes.dialog}
open={open}
onClose={handleClose}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">
  {"supprimer un contrat"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir supprimer cette demande de congé ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>
  <Button onClick={() => { DeleteCongé(congeIddelete) }}>
    oui
  </Button>
</DialogActions>
</Dialog>
 */}
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
export default ListeMissions;