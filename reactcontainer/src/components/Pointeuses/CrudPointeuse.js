import React from 'react';
import ImporterPointeuse from './ImporterPoineteuse'
import useFetch from '../useFetch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import $ from "jquery";
import ScrollContainer from 'react-indiana-drag-scroll';
import { Alert } from '@mui/material';
import frdatatable from '../../frdatatable.json'
import { useSelector } from 'react-redux';
function CrudPointeuse() {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null

 const[alerterror,setAlertError]=useState(false)
  const url=process.env.React_App_URL;
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var pointeusesedit=test['pointeuseedit']
   var pointeusedelete=test['pointeusedelete']
  
  }
  const { data: pointeuses = [], loadin, err } = useFetch(url+"pointeuse/")
  const [nom_pointeuse, setNomPointeuse] = useState('')
  const [port, setPort] = useState('')
  const [SIV, setSIV] = useState('')
  const [adresse_ip, setAdresseIP] = useState('')
  const [pointeuseId, setPointeuseID] = useState(null)
  const [open, setOpen] = useState(false);
  const [pointeuseIddelete, setpointeuseIddelete] = useState(null)

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
  function SelectPointeuse(id) {
    fetch(url+"pointeuse/" + id, {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
      result.json().then((resp) => {

        setNomPointeuse(resp.nom_pointeuse);
        setPort(resp.port);
        setSIV(resp.SIV);
        setAdresseIP(resp.adresse_ip);
        setPointeuseID(resp.id);

      })
    }).catch((e) => {

      /**if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })
  }
  const DeletePointeuse = (pointeuseId) => {
    fetch(url+'pointeuse/' + pointeuseId, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then(() => {
      setOpen(false);
      window.location.reload(false);
    }
    ).catch((e) => {

   /**   if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })


  }

  const UpdatePointeuse = () => {

    let pointeuseList = { nom_pointeuse, port, adresse_ip, SIV }
    console.warn("item", pointeuseList)
    setAlertError(false)

    fetch(url+'pointeuse/' + pointeuseId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(pointeuseList)
    }).then((response) =>{
      if(!response.ok){
        setAlertError(true)
      }
      else{
        window.location.reload(false)
      }

  }).then((e)=>{
  
    }).catch((e) => {

  /**    if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })
  }
  $(document).ready(function () {
    $('#pointeusestable').DataTable({
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

  return (
    <div>
    <div className="container-fluid mt-5">
  <div className="row">
    <div className="col">
    <div className="card shadow">
{/**    <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Pointeuses</h3>
      </div> */}
<div className="card-header border-0">
  {
    pointeusesedit == true &&   <ImporterPointeuse />
  }
          
            </div>
            <ScrollContainer>
            <div className="table-responsive">


              {pointeuses.length==0  ?"":    <table className="table table-bordered display" id="pointeusestable">
          <thead className="thead-light">
            <tr>
                    <th scope="col">Nom de la Pointeuse</th>
                    <th scope="col">Adresse IP</th>
                    <th scope="col">Port</th>
                  
                    <th scope="col">Device ID</th>
                    <th scope="col">Action</th>

                  </tr>
                </thead>
                <tbody>

                  {pointeuses.map(pointeuse =>
                    <tr key={pointeuse.id}> 
                      <td>{pointeuse.nom_pointeuse}</td>
                      <td>{pointeuse.adresse_ip}</td>
                      <td>{pointeuse.port}</td>
                      <td>{pointeuse.SIV}</td>

                      <td>
                        <div className="row">
                         { pointeusesedit == true && <div className="col-md-6">

                            <a onClick={() => SelectPointeuse(pointeuse.id)} data-toggle="modal" data-target="#updatePointeuse" ><EditIcon
                              className={classes.icon}
                            /></a>
                          </div>}
                       {  pointeusedelete == true &&  <div className="col-md-6">
                            <a onClick={() => { handleClickOpen(); setpointeuseIddelete(pointeuse.id); }}  ><DeleteIcon className={classes.icon} /></a>


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
                      {"supprimer une pointeuse"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        êtes-vous sûr de vouloir supprimer cette pointeuse ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>non</Button>
                      <Button onClick={() => { DeletePointeuse(pointeuseIddelete) }}>
                        oui
                      </Button>
                    </DialogActions>
                  </Dialog>
                </tbody>
              </table>}
    
            </div>
            </ScrollContainer>
          </div>

          <div className="modal fade" id="updatePointeuse"  role="dialog" aria-labelledby="updatePointeuse" aria-hidden="true">


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

                            <input className="form-control" value={nom_pointeuse} placeholder="nom de pointeuse" name="nom_pointeuse" onChange={(e) => setNomPointeuse(e.target.value)} type="text" />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group input-group-merge input-group-alternative">

                            <input className="form-control" value={port} name="port" placeholder="port" onChange={(e) => setPort(e.target.value)} type="text" />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group input-group-merge input-group-alternative">

                            <input className="form-control" value={SIV} name="SIV" placeholder="Device ID" onChange={(e) => setSIV(e.target.value)} type="text" />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="input-group input-group-merge input-group-alternative">

                            <input className="form-control" value={adresse_ip} placeholder="Adresse IP" name="adresse_ip" onChange={(e) => setAdresseIP(e.target.value)} type="text" />
                          </div>
                        </div>
                        <div className="custom-control custom-control-alternative custom-checkbox">
                          <input className="custom-control-input" id=" customCheckLogin" type="checkbox" />

                        </div>
                        <div className="text-center">
                          <button type="button" className="btn btn-primary my-4" onClick={UpdatePointeuse}> Enregistrer</button>
                        </div>
                        {alerterror &&
                                      <Alert variant="filled" severity="error">
                           Il faut une adresse IP unique!
                                    </Alert> }
                      </form>
                    </div>
                  </div>
                </div>
              </div></div></div>
        </div></div>
    </div></div>
  )
}
export default CrudPointeuse;