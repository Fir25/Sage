

import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';

import { useSelector } from 'react-redux';

import logoutfunction from '../authentification/logoutfunction';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AjoutSuperviseur from './AjoutSuperviseur';
import $ from "jquery";

import React, { useState } from 'react';

import frdatatable from '../../frdatatable.json'


function CrudSuperviseur() {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const url=process.env.React_App_URL;
    const { data: superviseurs = [], isloading, error } = useFetch(url+"listsuperviseur/")
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      var superviseursedit=test['superviseursedit']
     var superviseursdelete=test['superviseursdelete']
    
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
      const [contratIddelete, setcontratIddelete] = useState([])
      const[id,SetId]=useState('')
      
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const classes = useStyle()
    
   
    
      const[superviseurname,setNomsuperviseur]=useState('')
   
      function SelectContrat(id) {
        fetch(url+"updatedeletesuperviseur/" + id, {method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }}).then((result) => {
          result.json().then((resp) => {
       
            setNomsuperviseur(resp.superviseurname);
            SetId(resp.id)
    
          })
        }).catch((err)=>{
        /**  if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
        })
    
    
    
    
    
      }
      const DeleteContrat = (contratId) => {
        fetch(url+'SuperviseurDelete/' + contratId, {
          method: 'DELETE',
          headers: {
    
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }).then(() => {
          setOpen(false);
          window.location.reload(false);
        }
        ).catch((err)=>{
          if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } 
        })
    
    
      }
    
      const UpdateUser = () => {

        let superviseur = {superviseurname}
    
    
        fetch(url+'updatedeletesuperviseur/' + id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(superviseur)
        }).then(() => {
    
          
      
         
        
          
        }
    
        ).catch((err)=>{
      /**    if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
        })
      }
      
///

$(document).ready(function () {
  $('#superviseurtable').DataTable({
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
   } )})
    return(
  
    <div>
          <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
{/**          <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>superviseurs </h3>
      </div> */}
      <div className="card-header border-0">
      
 <AjoutSuperviseur/>
        
          
      </div>
      {superviseurs.length==0?""  :
      <div className="table-responsive">
   
             <table className="table table-bordered display" id="superviseurtable">
          <thead className="thead-light">
            <tr>
              
              <th scope="col">Nom de superviseur</th>
        
              <th scope="col">Action</th>
            
            </tr>
          </thead>
          <tbody>
    
             
            {superviseurs.map(s =>
                    <tr key={s.value}>
                      <td >{s.label}</td>
                  
                      <td>
                <div className="row">

                          {<div className="col-md-6">

                            <a onClick={() =>SelectContrat(s.value)} data-toggle="modal" data-target="#modalsuperviseur" ><EditIcon
                              className={classes.icon}
                            /></a>
                          </div>}
                        {  <div className="col-md-6">
                            <a onClick={() => { handleClickOpen(); setcontratIddelete(s.value); }}  ><DeleteIcon className={classes.icon} /></a>


                          </div>}
                        </div>
                      </td> 
                    </tr>
                  )}
  <Dialog

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
    êtes-vous sûr de vouloir supprimer un contrat ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>
  <Button onClick={() => { DeleteContrat(contratIddelete) }}>
    oui
  </Button>
</DialogActions>
</Dialog> 

             
         
          </tbody>
        </table>
        </div>
        }
   
   
      <div className="container">




<div className="modal fade" id="modalsuperviseur" role="dialog" aria-labelledby="modalsu perviseur" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Modifier le superviseur</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">


   
            <form>


                  <div className="form-group">
                    

                      <input className="form-control" placeholder="Nom de superviseur" value={superviseurname} name="nom superviseur" onChange={(e) => setNomsuperviseur(e.target.value)} type="text" />
                  
               
              </div>

           
        

      







              <div className="form-group"><button className="btn btn-primary" onClick={UpdateUser}>Valider</button></div>    </form>


      </div>

    </div>
  </div>
</div>
</div>
    </div> 

          </div>
        </div>
        </div>
      </div>
    )
}
export default CrudSuperviseur;