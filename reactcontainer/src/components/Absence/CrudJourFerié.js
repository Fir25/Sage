import React, { useState } from 'react';
import AjouterjourFerié from './AjouterjourFerié';
import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';

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
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';
function CrudJourFerié(){
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    
    var absenceedit = test['absenceedit']
    var absencedelete = test['absencedelete']
  }
const[alert,setAlert]=useState(false)
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
    const { data: joursFeriés } = useFetch(url+"JourFerie/")
    const [nom, setNom] = useState('');
    const [etat_jour, setetatJour] = useState('');
    const [date, setDate] = useState('');
    const [datefin, setDatefin] = useState('');
    const[idjour,setjourId]=useState(null);
    const[jouriddelet,setJourIddelete]=useState(null)
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
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
      function SelectJour(id) {
        fetch(url+"JourFerie/" + id, {method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }}).then((result) => {
          result.json().then((resp) => {
       
           setNom(resp.nom);
           setetatJour(resp.etat_jour);
           setDate(resp.date);
           setDatefin(resp.datefin);
          setjourId(resp.id)
          })
        }).catch((e)=>{
          /**if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
        })
      }
      const DeletejourFerié = (id) => {
    
        fetch(url+'JourFerie/' + id, {
          method: 'DELETE',
          headers: {
    
            'Content-Type': 'application/json',
            Authorization:token
          },
        }).then(() => {
          setOpen(false);
          window.location.reload(false);
        }
        ).catch((e)=>{
        /**  if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
        })
    
    
      }
    
      const UpdateJourFerié = () => {
    
        let JourFeriéList = { nom,date,datefin,etat_jour }
    setAlert(false)
    
        fetch(url+'JourFerie/' + idjour, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization:token
          },
          body: JSON.stringify(JourFeriéList)
        }).then((response) =>{
      
          
          if(!response.ok){
           setAlert(true)
          }
        
      }).then(()=>{
       
      }).catch((e)=>{
      /**  if ( e.response.status=== 401) {
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

      <div className="card-header border-0">
      {absenceedit && 
            <AjouterjourFerié/>}
  </div>
  <ScrollContainer>
    {joursFeriés.length==0?""  :    <div className="table-responsive">   <table className="table table-bordered display" id="eee">
          <thead className="thead-light">
            <tr>
              
                    <th scope="col">Nom de jour ferié</th>
                    <th scope="col">Type</th>

                    <th scope="col">Date début</th>
                    <th scope="col">Date fin</th>
                   
                    <th scope="col">Action</th>

                  </tr>
                </thead>
                <tbody>

                  {joursFeriés.map(jour =>
                    <tr key={jour.id}>
                      <td>{jour.nom}</td>
                      <td> {jour.etat_jour}</td>
                      <td>{jour.date}</td>
                      <td>{jour.datefin}</td>
                    
                      
                        <td>
                     <div className="row">
                          <div className="col-md-6">

                            { absenceedit && <a onClick={() => SelectJour(jour.id)} data-toggle="modal" data-target="#jourupdate" ><EditIcon
                              className={classes.icon}
                            /></a>}
                          </div>
                          <div className="col-md-6">
                            { absencedelete && <a onClick={() => { handleClickOpen(); setJourIddelete(jour.id); }} ><DeleteIcon className={classes.icon} /></a>}


                          </div>
                        </div> </td>
                      
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
                      {"supprimer un jour ferié"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        êtes-vous sûr de vouloir supprimer ce jour ferié?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>non</Button>
                      <Button onClick={() => { DeletejourFerié(jouriddelet) }}>
                        oui
                      </Button>
                    </DialogActions>
                  </Dialog>  
                </tbody>
              </table> </div>}
 
              </ScrollContainer>

            </div>
            <div>

<div className="row">
  <div className="col-md-3">



    <div className="modal fade" id="jourupdate" role="dialog" aria-labelledby="jourupdate" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier Jour Ferié</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
          
          <form>

<div className='row'>
    <div className='col-md-6'>
        <div className="form-group">


            <input className="form-control" placeholder="nom jour Ferié" value={nom} name="nom" onChange={(e) => setNom(e.target.value)} type="text" />

        </div>

    </div>
    <div className='col-md-6'>
    <div className="form-group">


<input className="form-control" placeholder="nom jour Ferié" value={etat_jour} name="nom"  onChange={(e) => { setetatJour(e.target.value) }} type="text" />

</div>
     
    </div>
</div>




<div className='row'>
    <div className='col-md-6'>
        <div className="form-group">
        <label for="datedebut">Date début</label>
            <input className="form-control" value={date} onChange={(e) => setDate(e.target.value)} id="datedebut"  type="datetime"
            />
        </div>
    </div>
    <div className='col-md-6'>
        <div className="form-group">
        <label for="datefin">Date fin</label>

            <input id="datefin" className="form-control" placeholder="nombre de jours feriés" value={datefin} min={date} name="Datefin" onChange={(e) => setDatefin(e.target.value)} type="datetime" />

        </div>
    </div>
</div>



          
                <div className="form-group"><button className="btn btn-primary" onClick={UpdateJourFerié}>Valider</button></div>    
               
                <div  >
          {alert&&
     <Alert variant="filled" severity="error">
      Il faut Sélectionnez date début et date fin !</Alert>}</div>
                
                </form>

          </div>

        </div>
      </div>
    </div>
  </div>
</div>
</div>
            </div></div></div></div>)
}
export default CrudJourFerié;