import React from 'react';
import AjouterContrat from './AjouterContrat';
import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';




import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import $ from "jquery";
import ScrollContainer from 'react-indiana-drag-scroll';

import frdatatable from '../../frdatatable.json'
import { useSelector } from 'react-redux';
function CrudContrats() {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null

  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
   
   var contratedit=test['"contratsedit"']
   var contratdelete=test['admin']
   
    
  }
  $(document).ready(function () {
    $('#eee').DataTable({
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

const url=process.env.React_App_URL;
    const { data: contrats = [], isloading, error } = useFetch(url+"contrats/")
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
      const [contratIddelete, setcontratIddelete] = useState(null)
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const classes = useStyle()
    
    
      const [contratname, setNomContrat] = useState('');
    
      const [contratId, setContratId] = useState(null)
      function SelectContrat(id) {
        fetch(url+"contrats/" + id
        , {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }})
        
        
        .then((result) => {
          result.json().then((resp) => {
   
            setNomContrat(resp.contratname);
            setContratId(resp.id)
    
          })
        }).catch((e) => {

       /**   if ( e.response.status=== 401) {
              logoutfunction(e.response.status)
            } */
      })
    
    
    
    
    
      }
      const DeleteContrat = (contratId) => {
        fetch(url+'contrats/' + contratId, {
          method: 'DELETE',
          headers: {
    
            'Content-Type': 'application/json',
            Authorization:token
          },
        }).then(() => {
          setOpen(false);
          window.location.reload(false);
        }
        )
    
    
      }
    
      const Updatecontrat = () => {
    
        let contratList = { contratname }
    
    
        fetch(url+'contrats/' + contratId, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization:token
          },
          body: JSON.stringify(contratList)
        }).then(() => {
    
    
    
        }
    
        )
      }
    return(
  
    <div>
          <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
     
      <div className="card-header border-0">
        <AjouterContrat />
      
      </div>
      <ScrollContainer>
      <div className="table-responsive">
      {contrats.length==0?"":      <table className="table table-bordered display" id="eee">
          <thead className="thead-light">
            <tr>
              
              <th scope="col">Contrat</th>
              <th scope="col">Action</th>
            
            </tr>
          </thead>
          <tbody>
    
             
          {contrats.map(contrat =>
  <tr key={contrat.id}>
    <td>{contrat.contratname}</td>
    <td>
      <div className="row">
       
          <div className="col-md-6">
            <a onClick={() => SelectContrat(contrat.id)} data-toggle="modal" data-target="#modalcontrat">
              <EditIcon className={classes.icon} />
            </a>
          </div>
        

        {contratdelete && (
          <div className="col-md-6">
            <a onClick={() => { handleClickOpen(); setcontratIddelete(contrat.id); }}>
              <DeleteIcon className={classes.icon} />
            </a>
          </div>
        )}
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
        </table>}
      </div>
      </ScrollContainer>
    </div> 
    <div className="container">





    <div className="modal fade" id="modalcontrat"  role="dialog" aria-labelledby="modalcontrat" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier Le Contrat</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">



            <form>



              <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative">

                  <input className="form-control" placeholder="Nom de Contrat" value={contratname} name="contratname" onChange={(e) => setNomContrat(e.target.value)} type="text" />
                </div>
              </div>



              <div className="form-group"><button className="btn btn-primary" onClick={Updatecontrat}>Valider</button></div>    </form>


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
export default CrudContrats;