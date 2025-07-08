

import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';

import { useSelector } from 'react-redux';



import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AjouterSite from './AjouterSite';
import $ from "jquery";

import React, { useState } from 'react';

import frdatatable from '../../frdatatable.json'


function CrudSite() {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const url=process.env.React_App_URL;
    const { data: sites = [], isloading, error } = useFetch(url+"createlistsite/")
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      var sitesedit=test['Sitesedit']
     var sitesdelete=test['Sitesdelete']
    
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
      const [contratIddelete, setcontratIddelete] = useState('')
      const[id,SetId]=useState('')
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const classes = useStyle()
    
   
    
      const[nomsite,setNomSite]=useState('')
   
      function SelectContrat(id) {
        fetch(url+"updatedeletesite/" + id, {method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }}).then((result) => {
          result.json().then((resp) => {
       
            setNomSite(resp.nomsite);
            SetId(resp.id)
    
          })
        }).catch((err)=>{
        /**  if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
        })
    
    
    
    
    
      }
      const DeleteContrat = (contratId) => {
        fetch(url+'updatedeletesite/' + contratId, {
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
         /** if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
        })
    
    
      }
    
      const UpdateUser = () => {

        let site = {nomsite}
    
    
        fetch(url+'updatedeletesite/' + id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(site)
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
  $('#sitetable').DataTable({
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
      <h3 style={{color:"white"}}>Sites </h3>
      </div> */}
      <div className="card-header border-0">
        { sitesedit == true && 
 <AjouterSite/>
        }
          
      </div>
      {sites.length==0?""  :
      <div className="table-responsive">
   
             <table className="table table-bordered display" id="sitetable">
          <thead className="thead-light">
            <tr>
              
              <th scope="col">Nom de site</th>
        
              <th scope="col">Action</th>
            
            </tr>
          </thead>
          <tbody>
    
             
            {sites.map(s =>
                    <tr key={s.id}>
                      <td >{s.nomsite}</td>
                  
                      <td>
                <div className="row">

                          {sitesedit == true &&<div className="col-md-6">

                            <a onClick={() =>SelectContrat(s.id)} data-toggle="modal" data-target="#modalsite" ><EditIcon
                              className={classes.icon}
                            /></a>
                          </div>}
                        { sitesdelete == true && <div className="col-md-6">
                            <a onClick={() => { handleClickOpen(); setcontratIddelete(s.id); }}  ><DeleteIcon className={classes.icon} /></a>


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




<div className="modal fade" id="modalsite" role="dialog" aria-labelledby="modalsite" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Modifier le site</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">


   
            <form>


                  <div className="form-group">
                    

                      <input className="form-control" placeholder="Nom de site" value={nomsite} name="nom site" onChange={(e) => setNomSite(e.target.value)} type="text" />
                  
               
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
export default CrudSite;