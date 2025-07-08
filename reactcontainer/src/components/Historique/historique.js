import React from 'react'
import useFetch from '../useFetch';
import { useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import $ from "jquery";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Mouchard from '../Mouchardd/Mouchard';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from 'react-redux';
import frdatatable from '../../frdatatable.json'
const Historique = () => {
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    var admin=test['admin']
  
    
  }
  const useStyle = makeStyles({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      color: '#5ac2df'






      ,

    },
    dialog: {

      boxShadow: 'none',
    }
  });
  const classes = useStyle()
const[userId,setUserID]=useState('')
  const [historiqueIddelete, setHistoriqueIddelete] = useState(null)
  const[openn,setOpenn]=useState(false)
  const [post,setPost]=useState(false)

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
 
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(()=>{

    
    if (mouchard.length==0){
  
    setOpenn(true)
  setPost(false)
  
    }else{
    setOpenn(false)
    setPost(true)}
  }
  ,[openn,post])
  $(document).ready(function () {
   
    $('#datatable').DataTable({
      language:frdatatable,
      "dom": 'Blfrtip',
      buttons: [
        {extend:'excel',
      className:'btn btn-buttondatatable'},
      {extend:'copy',
      className:'btn btn-buttondatatable'},
      {extend:'pdf',
      orientation: 'landscape',
      pageSize: 'LEGAL',
      className:'btn btn-buttondatatable'},
      {extend:'csv',
      className:'btn btn-buttondatatable'},
      {extend:'print',
      className:'btn btn-buttondatatable'},      
      

       
      ]
      ,"bDestroy": true
     } )
  
});

    const { data: mouchard = [],isloading:ll,error:rr } = useFetch(url+"HistoriqueList/")
    const { data: users = [] } = useFetch(url+"user/")
    const  DeleteHistorique_solde = (id) => {
      fetch(url+'DeleteHistorique_solde/' + id, {
        method: 'DELETE',
        headers: {
  
          'Content-Type': 'application/json',
          Authorization:token
        },
      }).then(() => {
        setOpen(false);
        Mouchard("en cours ", "Historique solde supprimé", userId, iduserinfo, "Suppression d'historique solde pour employé")
       window.location.reload(false);
      }
      ).catch((e) => {

     /**   if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
    })
  
  
    }
    return (
      <div className="container-fluid mt-5">
      <div className="row">
        <div className="col">
        <div className="card shadow">

            <ScrollContainer className="scroll-container">
            {post?
      <div className="table-responsive">
   
      <table className="table table-bordered display" id="datatable">
        <thead className="thead-light">
          <tr>
            
           
            <th scope="col" style={{width:"20%"}}>Date</th>
            <th scope="col" style={{width:"10%"}}>personne qui a modifié</th>
            <th scope="col" style={{width:"10%"}} >Employé</th>
    
          
            <th scope="col" style={{width:"7%"}} >Anc.Solde</th>
            <th scope="col" style={{width:"7%"}}>Nou.Solde</th>
            <th scope="col" style={{width:"7%"}}>Solde</th>
            <th scope="col" style={{width:"7%"}}>Solde ajouté</th>

            <th scope="col" style={{width:"22%"}}>Commentaire</th>
            {admin==false && ll==true?"":           <th scope="col"  style={{width:"10%"}}>Action</th>}
          </tr>
        </thead>
        <tbody>
      

          {mouchard.map(m =>
                  <tr key={m.id}>
                       <td>{m.datenow}</td>
                      
                       <td>   {users.length!=0? users.filter(x=>x.id==m.idper_modifie).map(x=><>{x.user_name}  {x.last_name}</>):""}</td>
                      
                 <td>{m.employee}  {m.last_name}</td>
            
             
                    <td>{m.anciennevaluer}</td>
                 <td>{m.nouvellevaluer}</td>
                 <td>{m.soldeactuelle}</td>
                 <td>{m.valeursolde_ajoute}</td>
            
                 <td>{m.commentaire}</td>
                 { admin==false? "":  <td>
                 <a onClick={() => { handleClickOpen(); setHistoriqueIddelete(m.id);setUserID(m.employe) }}  ><DeleteIcon className={classes.icon} /></a>
                 </td>}
              
                  </tr>
                )}
      
           
       
        </tbody>
      </table>
      
      <Dialog

BackdropProps={{ invisible: true }}
className={classes.dialog}
open={open}
onClose={handleClose}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">
  {"Supprimer solde et décrémenter le nombre de solde ajouté"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir Supprimer solde et décrémenter le nombre de solde ajouté"?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>
  <Button onClick={() => { DeleteHistorique_solde(historiqueIddelete) }}>
    oui
  </Button>
</DialogActions>
</Dialog>
      
      </div> :( <>{mouchard.length==0 ? <Backdrop  open={openn}>
<CircularProgress  style={{top : '50%'}} color="black" />
</Backdrop>:setPost(true)}</>)


} 
</ScrollContainer>   
      </div> 




      </div></div></div>
   
      )
}
 
export default Historique;