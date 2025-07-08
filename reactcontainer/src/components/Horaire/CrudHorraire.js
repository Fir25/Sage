import useFetch from '../useFetch';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import * as React from 'react';

import { makeStyles } from '@mui/styles';

import {  useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import { format } from 'date-fns';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import NumberFormat from 'react-number-format';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AjouterdesHoraires from './AjouterdesHoraires';
import ScrollContainer from 'react-indiana-drag-scroll'
import MenuItem from '@mui/material/MenuItem';

import { useSelector } from 'react-redux';


import $ from "jquery";
import { Alert } from '@mui/material';
import frdatatable from '../../frdatatable.json'

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString

    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
function CrudHorraire() {
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
   
   var horaireedit=test['horaireedit']
   var horairedelete=test['horairedelete']
   
    
  }
const[alertverif,setAlertverif]=useState(false)
  const { data: horaires = [] } = useFetch(url+"horaire/")

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



  const [horaireId, sethoraire] = useState(null)
  const [HoraireIddelete, setHoraireIddelete] = useState(null)
  //const [gettime, setgtime] = useState({debut : format(new Date(), 'HH:mm:ss'), fin : format(new Date(), 'HH:mm:ss') , debutentree :  format(new Date(), 'HH:mm:ss'), finentree :  format(new Date(), 'HH:mm:ss'), margeretard : format(new Date(), 'HH:mm:ss') ,margedepartant : format(new Date(), 'HH:mm:ss'), debutpause : format(new Date(), 'HH:mm:ss') , finpause :format(new Date(), 'HH:mm:ss') , debutsortie : format(new Date(), 'HH:mm:ss'), finsortie : format(new Date(), 'HH:mm') ,  nom :"aa",motif_horaire:null});

  const [debut, setdebut] = useState(format(new Date(), 'HH:mm:ss'))
  const [fin, setfin] = useState(format(new Date(), 'HH:mm:ss'))
  const [debutentree, setdebutentree] = useState(format(new Date(), 'HH:mm:ss'))
  const [finentree, setfinentree] = useState(format(new Date(), 'HH:mm:ss'))
  const [margeretard, setmargeretard] = useState(format(new Date(), 'mm'))
  const [pause, setpause] = useState(format(new Date(), 'mm'))
  const [margedepartant, setmargedepartant] = useState(format(new Date(), 'mm'))
  const [debutpause, setdebutpause] = useState(format(new Date(), 'HH:mm:ss'))
  const [finpause, setfinpause] = useState(format(new Date(), 'HH:mm:ss'))
  const [debutsortie, setdebutsortie] = useState(format(new Date(), 'HH:mm:ss'))
  const [finsortie, setfinsortie] = useState(format(new Date(), 'HH:mm:ss'))
  const [nom, setnom] = useState("")
  const [jourtravaille, setjour] = useState('')

  //const [aff, setaff] = useState({debutaf : new Date(), finaf :  new Date() , debutentreeaf :  new Date() , finentreeaf :  new Date() , margeretardaf : new Date() , margedepardantaf : new Date() , debutpauseaf : new Date(), finpauseaf : new Date(), debutsortieaf : new Date(), finsortieaf : new Date()});
  const [debutaf, setDebutaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [finaf, setfinaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [debutentreeaf, setEntreAf] = useState(format(new Date(), 'HH:mm:ss'))
  const [finentreeaf, setfinentreeaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [margeretaraf, setMargeretardAf] = useState(format(new Date(), 'mm'))
  const [pauseaf, setpauseaf] = useState(format(new Date(), 'mm'))
  const [margedepartantaf, setmargedepardantaf] = useState(format(new Date(), 'mm'))
  const [debutpauseaf, setdebutpauseaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [finpauseaf, setfinpauseaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [debutsortieaf, setdebutsortieaf] = useState(format(new Date(), 'HH:mm:ss'))
  const [finsortieaf, setfinsortieaf] = useState(format(new Date(), 'HH:mm:ss'))

  const [nomaf, setNom] = useState('aa')
  const [jourtravailleaf, setJourtravaille] = useState('')
  const [checked, setChecked] = React.useState(false);
  const handleChanges = (event) => {
    setChecked(!checked);
  };

  function SelectHoraire(id) {
    fetch(url+"horaire/" + id, {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
      result.json().then((resp) => {
        sethoraire(resp.id);
        setJourtravaille(resp.jourtravaille)
        setNom(resp.nom)

        setDebutaf(new Date('2018-02-14T' + resp.debut + '.000'))
        setfinaf(new Date('2019-01-01T' + resp.fin + '.000'))
        setEntreAf(new Date('2018-02-14T' + resp.debutentree + '.000'))
        setfinentreeaf(new Date('2018-02-14T' + resp.finentree + '.000'))

        setMargeretardAf(resp.margeretard)
        setmargedepardantaf(resp.margedepartant)
        setdebutpauseaf(new Date('2018-02-14T' + resp.debutpause + '.000'))
        setfinpauseaf(new Date('2018-02-14T' + resp.finpause + '.000'))

        setdebutsortieaf(new Date('2018-02-14T' + resp.debutsortie + '.000'))
        setfinsortieaf(new Date('2018-02-14T' + resp.finsortie + '.000'))
          setpauseaf(new Date('2018-02-14T00:' + resp.pause + ':00.000'))
        setnom(resp.nom)
        setdebut(resp.debut)
        setfin(resp.fin)
        setdebutentree(resp.debutentree)
        setfinentree(resp.finentree)
        setmargeretard(resp.margeretard)
        setmargedepartant(resp.margedepartant)
        setdebutpause(resp.debutpause)
        setfinpause(resp.finpause)
        setdebutsortie(resp.debutsortie)
        setfinsortie(resp.finsortie)
        setjour(resp.jourtravaille)
       
setpause(resp.pause)

      })
    }).catch((e) => {

     /** if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })
  }



  const DeleteHoraire = (horaireId) => {
    fetch(url+'horaire/' + horaireId, {
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

     /** if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })


  }
  const UpdateHoraire = () => {
if (debutentree!="00:00:00" && finentree!="00:00:00" && debutsortie!="00:00:00" && finsortie!="00:00:00") {
    const gettime = {pause, debut, fin, debutentree, finentree, margeretard, margedepartant, debutpause, finpause, debutsortie, finsortie, nom, jourtravaille }

    fetch(url+'horaire/' + horaireId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization:token
      },
      body: JSON.stringify(gettime)
    }).then(() => {



    }

    ).catch((e) => {

     /** if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })} else {
     setAlertverif(true)

    }
  }


  $(document).ready(function () {
    $('#horairetable').DataTable({
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
{/**            <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Horaires</h3>
      </div> */}
              <div className="card-header border-0">
              {horaireedit &&
                <AjouterdesHoraires />}
              </div>
              <div className="table-responsive">
              <ScrollContainer className="scroll-container">
         {horaires.length==0?"":       <table className="display" id="horairetable">
                  <thead className="thead-light">
                    <tr>

                      <th scope="col" >Nom</th>
             


                      <th  scope="col">debut </th>
                      <th  scope="col">fin </th>
                      <th style={{width:"10%"}} scope="col">d.Entrée</th>
                      <th  scope="col">f.Entrée</th>
                      <th  scope="col">m.retard </th>
                      <th  scope="col">m dep ant </th>
                      {/* <th style={{width:"2%"}} scope="col">Pause</th>
                      <th style={{width:"10%"}}  scope="col">d. pause </th>
                      <th style={{width:"10%"}} scope="col">f. pause </th> */}
                      <th  scope="col">d. sortie  </th>
                      <th  scope="col">f.sortie  </th>
                      <th  scope="col">Jr Trav</th>
                   
                      <th  scope="col">Action  </th>

                    </tr>
                  </thead>
                  <tbody>


                    {horaires.map(horaire =>
                      <tr key={horaire.id}>
                        <td>{horaire.nom}</td>
                

                        <td>{horaire.debut}</td>
                        <td>{horaire.fin}</td>
                        <td>{horaire.debutentree}</td>
                        <td>{horaire.finentree}</td>
                        <td>{horaire.margeretard}</td>
                        <td>{horaire.margedepartant}</td>
                        {/* <td>{horaire.pause}</td>
                        <td>{horaire.debutpause}</td>
                        <td>{horaire.finpause}</td> */}
                        <td>{horaire.debutsortie}</td>
                        <td>{horaire.finsortie}</td>

                        <td>{horaire.jourtravaille}</td>
                        <td>
                       
                           
                   
                         
                          {horaireedit      &&        <a onClick={() => SelectHoraire(horaire.id)} data-toggle="modal" data-target="#updateHoraire" ><EditIcon
                                className={classes.icon}
                              /></a>}
                              {horairedelete && <a onClick={() => { handleClickOpen(); setHoraireIddelete(horaire.id); }}  ><DeleteIcon className={classes.icon} /></a>}
                                                 

                      
                       
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
                        {"supprimer un horaire"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          êtes-vous sûr de vouloir supprimer cet Horaire ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>non</Button>
                        <Button onClick={() => { DeleteHoraire(HoraireIddelete) }}>
                          oui
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </tbody>
                </table>}
              </ScrollContainer>
              </div>
            </div></div>
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="modal fade" id="updateHoraire" role="dialog" aria-labelledby="updateHoraire" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modifier l'horaire</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">

                        <form>
                          <div className="row">

                            <div className="col-md-6  pt-4">
                              <div className="form-group">


                                <input className="form-control" placeholder="Nom d'horaire" value={nomaf} name="nom" onChange={(e) => { setnom(e.target.value); setNom(e.target.value) }} type="text" />
                              </div>
                            </div>

                            <div className='col-md-6'>
                            <TextField
                        id="outlined-select-currency"
                        select
                        label="Jour Travail"
                        value={jourtravailleaf}
                        onChange={(e) => { setJourtravaille(e.target.value); setjour(e.target.value) }} 
                        helperText=""
                        margin='normal'
                        fullWidth
                      >

                        <MenuItem key="1" value="1">
                        1
                        </MenuItem>
                        <MenuItem key="2" value="0.5">
                    0.5
                        </MenuItem>
                     

                      </TextField>

                           
                            </div>





                          </div>
         

                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">

                                <div className="input-group input-group-merge input-group-alternative">


                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker

                                      views={['minutes']}
                                      inputFormat="mm"

                                      label="Marge de retard(min)"
                                      ampm={false}
                                      value={margeretaraf}

                                      onChange={(h) => {
                                        setMargeretardAf(h)
                                        setmargeretard(h.toLocaleTimeString([], { minute: '2-digit' }))

                                      }}
                                      renderInput={props => <TextField {...props} />}
                                    />
                                  </LocalizationProvider>              </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">


                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Marge de Dp.anticipé(min)"
                                      ampm={false}
                                      format="HH:mm"
                                      openTo="minutes"
                                      views={['minutes']}
                                      inputFormat="mm"


                                      value={margedepartantaf}
                                      onChange={(h) => {
                                        setmargedepardantaf(h)

                                        setmargedepartant(h.toLocaleTimeString([], { minute: '2-digit' }))
                                      }}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          </div>



                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="debut"
                                      ampm={false}
                                      format="HH:mm"
                                      value={debutaf}
                                      onChange={(h) => {
                                        setDebutaf(h)

                                        setdebut(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="fin"
                                      ampm={false}
                                      format="HH:mm"
                                      value={finaf}
                                      onChange={(h) => {
                                        setfinaf(h)
                                        setfin(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Début Entrée"
                                      ampm={false}
                                      format="HH:mm"
                                      value={debutentreeaf}
                                      onChange={(h) => {
                                        setEntreAf(h)

                                        setdebutentree(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Fin Entrée "
                                      ampm={false}
                                      format="HH:mm"
                                      value={finentreeaf}
                                      onChange={(h) => {
                                        setfinentreeaf(h)


                                        setfinentree(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Début Sortie"
                                      ampm={false}
                                      format="HH:mm"
                                      value={debutsortieaf}
                                      onChange={(h) => {
                                        setdebutsortieaf(h)


                                        setdebutsortie(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Fin Sortie"
                                      ampm={false}
                                      format="HH:mm"
                                      value={finsortieaf}
                                      onChange={(h) => {
                                        setfinsortieaf(h)


                                        setfinsortie(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row" >
                            <div className="col-md-6" style={{ marginLeft: 120 }} >
                              <div className="form-group" >
                                <div className="input-group input-group-merge input-group-alternative"  >
                                  <FormGroup style={{ marginLeft: 65 }} >
                                    <FormControlLabel control={<Checkbox onChange={handleChanges}
                                    />} label="pause" />
                                  </FormGroup>
                                </div>
                              </div>
                            </div>
                          </div>
                          {checked && <> 
                          
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Début pause"
                                      ampm={false}
                                      format="HH:mm"
                                      value={debutpauseaf}
                                      onChange={(h) => {
                                        setdebutpauseaf(h)
                                        setdebutpause(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Fin pause"
                                      ampm={false}
                                      format="HH:mm"
                                      value={finpauseaf}
                                      onChange={(h) => {
                                        setfinpauseaf(h)



                                        setfinpause(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className='row'>
     <div className="col-md-6">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">


                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Pause"
                                      ampm={false}
                                      format="HH:mm"
                                      openTo="minutes"
                                      views={['minutes']}
                                      inputFormat="mm"


                                      value={pauseaf}
                                      onChange={(h) => {
                                        setpauseaf(h)

                                        setpause(h.toLocaleTimeString([], { minute: '2-digit' }))
                                      }}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>

                          </div></>
                          }
                          <div className="form-group"><button className="btn btn-primary" onClick={UpdateHoraire}>Valider</button></div>  
                          {alertverif
     
     && <Alert variant="filled" severity="error">il faut que debut entrée ,fin entrée ,debut sortie et fin sortie differents de zéro !</Alert>}
                          
                            </form>


                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div></div>
        

        </div>

  )
}
export default CrudHorraire;