import React, { useState } from 'react';
import useFetch from '../useFetch';
import AjouterPlansemaine from './AjouterPlansemaine';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { makeStyles } from '@mui/styles';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import $ from "jquery";
import { useSelector } from 'react-redux';
import frdatatable from '../../frdatatable.json'
function CrudPlansemaine() {
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
   
   var horaireedit=test['horaireedit']
   var horairedelete=test['horairedelete']
   
    
  }
  const { data: planssemaines = []} = useFetch(url+"plansemaine/")
  const { data: Horraires = []} = useFetch(url+"horaire/")
  const [open, setOpen] = useState(false);
  const [plansemaineIddelete, setplansemaineIddelete] = useState(null)
  const [lundi, setLundii] = useState('');
  const [mardi, setMardii] = useState('');
  const [mercredi, setMercredii] = useState('');
  const [jeudi, setJeudii] = useState('');
  const [vendredi, setVendredii] = useState('');
  const [samedi, setSamedii] = useState('');
  const [dimanche, setDimanchee] = useState('');
  const [plansemaineId, setPlanSemaineId] = useState(null)
  const [nomsemaine, setPlansemaine] = useState('')
  const[motifplan,setMotifPlan]=useState('')
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //
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
  function SelectPlanSemaine(id) {
    fetch(url+"plansemaine/" + id, {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
      result.json().then((resp) => {

        setLundii(resp.lundi);
        setMardii(resp.mardi);

        setMercredii(resp.mercredi)
        setJeudii(resp.jeudi)
        setVendredii(resp.vendredi)
        setSamedii(resp.samedi)
        setDimanchee(resp.dimanche)
        setPlanSemaineId(resp.id)
        setPlansemaine(resp.nomsemaine)
        setMotifPlan(resp.motifplan)

      })
    }).catch((e) => {

/**      if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })
  }
  const DeletePlanSemaine = (id) => {

    fetch(url+'plansemaine/' + id, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json',
        Authorization:token
      },
    }).then(() => {
      setOpen(false);
      window.location.reload(false);
    }
    ).catch((e) => {

/**      if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })


  }

  const UpdatePlanSemaine = () => {

    let jourList = { lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche, nomsemaine,motifplan }


    fetch(url+'plansemaine/' + plansemaineId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization:token
      },
      body: JSON.stringify(jourList)
    }).then(() => {


window.location.reload(false)
    }

    ).catch((e) => {

     /** if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })


  }
  $(document).ready(function () {
    $('#plansemainee').DataTable({
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
  
  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">

              <div className="card-header border-0">
                <AjouterPlansemaine />
              </div>
              <div className="table-responsive">

{planssemaines.length==0?"":     <table className="table table-bordered display" id="plansemainee">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nom</th>
                      <th scope="col">Lundi</th>
                      <th scope="col">Mardi</th>
                      <th scope="col">Mercredi</th>
                      <th scope="col">Jeudi</th>
                      <th scope="col">Vendredi</th>
                      <th scope="col">Samedi</th>
                      <th scope="col">Dimanche</th>
                      <th scope='col'>Motif </th>
                      <th scope="col">action</th>


                    </tr>
                  </thead>
                  <tbody>

                    {planssemaines.map(plansemaine =>
                      <tr key={plansemaine.id}>
                        <td>{plansemaine.nomsemaine}</td>
                        <td>{plansemaine.lu}</td>
                        <td> {plansemaine.ma}</td>
                        <td>{plansemaine.me}</td>
                        <td>{plansemaine.je}</td>
                        <td>{plansemaine.ve}</td>
                        <td>{plansemaine.sa}</td>
                        <td>{plansemaine.di}</td>
                        <td>{plansemaine.motifplan}</td>

                        <td>
                          <div className="row">
                            <div className="col-md-3">
                              {horaireedit && <a onClick={() => SelectPlanSemaine(plansemaine.id)} data-toggle="modal" data-target="#plansemaine" ><EditIcon
                                className={classes.icon}
                              /></a>}
                            </div>
                            <div className="col-md-3">
                              {horairedelete && <a onClick={() => { handleClickOpen(); setplansemaineIddelete(plansemaine.id); }}  ><DeleteIcon className={classes.icon} /></a>}
                            </div>
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
                        {"supprimer un plan de semaine"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          êtes-vous sûr de vouloir supprimer un plan de semaine ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>non</Button>
                        <Button onClick={() => { DeletePlanSemaine(plansemaineIddelete) }}>
                          oui
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </tbody>
                </table>}
           
              </div>
            </div>
            <div className="container">





              <div className="modal fade" id="plansemaine" role="dialog" aria-labelledby="plansemaine" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">Modifier le  Plan de Semaine</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">



                      <form>


                        <div className='row'>
                          <div className='col-md-6'>
                            <div className="form-group">


                              <input className="form-control" placeholder="Nom de plan semaine" value={nomsemaine} name="nom" onChange={(e) => setPlansemaine(e.target.value)} type="text" />

                            </div>
                          </div>
                         
                          <div className='col-md-6'>
                      <TextField
                        id="outlined-select-currency"
                        select
                        label="Motif horaire"
                        value={motifplan}
                        onChange={(e) => setMotifPlan(e.target.value)}
                        helperText="sélectionner une motif"
                        margin='normal'
                        fullWidth
                      >

                        <MenuItem key="1" value="administratif">
                          Administratif
                        </MenuItem>
                        <MenuItem key="2" value="flexible">
                          Flexible
                        </MenuItem>
                        <MenuItem key="3" value="aménagés">
                          Aménagés
                        </MenuItem>

                      </TextField>

              
                          </div>
                        </div>



                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Lundi"
                          value={lundi}
                          onChange={(e) => { setLundii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
                          <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>




                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Mardi"
                          value={mardi}
                          onChange={(e) => { setMardii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
                          <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Mercredi"
                          value={mercredi}
                          onChange={(e) => { setMercredii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
  <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Jeudi"
                          value={jeudi}
                          onChange={(e) => { setJeudii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
  <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Vendredi"
                          value={vendredi}
                          onChange={(e) => { setVendredii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
  <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Samedi"
                          value={samedi}
                          onChange={(e) => { setSamedii(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
  <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>
                        <TextField
                          id="outlined-select-currency"
                          select
                          label="Dimanche"
                          value={dimanche}
                          onChange={(e) => { setDimanchee(e.target.value) }}
                          helperText="sélectionner un horaire"
                          margin='normal'
                          fullWidth
                        >
                          {Horraires.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.nom}
                            </MenuItem>
                          ))}
  <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                        </TextField>


                        <div className="form-group"><button className="btn btn-primary" type="submit" onClick={UpdatePlanSemaine} >Valider</button></div>    </form>

                    </div>
                    <div className="modal-footer">



                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div></div></div>
  )
}
export default CrudPlansemaine;