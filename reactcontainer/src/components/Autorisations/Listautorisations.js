import React from 'react';

import useFetch from '../useFetch';
import { useSelector } from 'react-redux';


import ScrollContainer from 'react-indiana-drag-scroll'




import AjouterUneautorisation from './AjouterUneautorisation';

function Listautorisations(){
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    
  }
  const url=process.env.React_App_URL;
    const { data: conges = [], isloading, error } = useFetch(url+"AffichageDemendesAut/"+iduserinfo)
    return(
    <div>
          <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
   
      <div className="card-header border-0">
<AjouterUneautorisation/>
      </div>
      <div className="table-responsive">
      <ScrollContainer className="scroll-container">


        <table className="table table-bordered display">
        <thead className="thead-light">
    <tr>

     <th style={{width:"10%"}} scope="col">Employé</th>
       
   
     <th  style={{width:"10%"}} scope="col">Date autorisation</th>
      
      <th style={{width:"10%"}} scope="col">état</th>

     
      <th style={{width:"10%"}} scope="col">Heure debut</th>
      <th style={{width:"10%"}} scope="col">Heure fin</th>
   
      <th style={{width:"10%"}} scope="col">Commentaire</th>
      <th style={{width:"10%"}} scope="col">Motif</th>
    {/**  <th scope="col">Action</th> */}
    </tr>
  </thead>
  <tbody>

     
    {conges.map(conge =>
          <tr key={conge.idconge}>
              <td>{conge.user_name}</td>
       
       
              <td>{conge.date_autorisation}</td>
   
         
       
              <td>{  conge.validation==4   ?"validé" : conge.validation==5 ? "annulé": conge.validation==2? "validé par valideur 2 ":conge.validation==1? "validé par valideur 1 ":conge.validation==3? "validé par valideur 3 " : conge.validation==0? "en_attente": conge.validation==6? "réfusé":"" }</td>

           <td>{conge.heure_debut}</td>
           <td>{conge.heure_fin}</td>
           <td>{conge.commentaire}</td>
          
           <td>{conge.motif}</td>
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
export default Listautorisations;