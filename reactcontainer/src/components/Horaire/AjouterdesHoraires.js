import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { Component, useEffect } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import { format } from 'date-fns';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import NumberFormat from 'react-number-format';
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';

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
function AjouterdesHoraires() {

  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null

  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
   
   var horaireedit=test['horaireedit']
   var horairedelete=test['horairedelete']
   
    
  }


  const [time, settime] = useState({ debut: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), fin: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), debutentree: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), finentree: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), margeretard: '00', margedaprdant: '00', debutpause: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), finpause: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), debutsortie: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), finsortie: format(new Date('2018-02-14T00:00:00.000'), 'HH:mm'), nom: "", jourtravaille: '' ,pause: '00'});
  const [aff, setaff] = useState({ debutaf: new Date(), finaf: new Date(), debutentreeaf: new Date(), finentreeaf: new Date(), margeretardaf: new Date(), margedepartant: new Date(), debutpauseaf: new Date(), finpauseaf: new Date(), debutsortieaf: new Date(), finsortieaf: new Date(),pauseaf: new Date() });

const [alertc,setAlert]=useState(false)
const[alertverif,setAlertverif]=useState(false)
  const handlesubmit = (e) => {
    e.preventDefault()
    setAlert(false)
    setAlertverif(false)
if (time.debutentree!="00:00" && time.finentree!="00:00" && time.debutsortie!="00:00" && time.finsortie!="00:00"){
    fetch(url+"horaire/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:token
        },
        body: JSON.stringify(time)
      }).then(() => {
        window.location.reload(false);
        // history.push('/TableaudesHoraires')


      }).catch((e) => {
   

         /** if ( e.response.status=== 401) {
              logoutfunction(e.response.status)
            }
     */


      setAlert(true)

      })}else{
        setAlertverif(true)
       
      }


  }
  const handleChanges = (event) => {
    setChecked(!checked);
  };
  const [checked, setChecked] = React.useState(false);

  const [checkeddebut, setcheckeddebut] = React.useState(false);
  const handleChangesdebut = (event) => {
    setcheckeddebut(!checkeddebut);
  };

  return (

    <div >

      <div className="row">

       {horaireedit && <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
          Ajouter Un Horaire
        </button>} 


        <div className="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ajouter Un Horaire</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">




                <form role="form">
                  <div className='row'>
                    <div className='col-md-6 pt-4'>
                      <div className="form-group">


                        <input  className="form-control" placeholder="Nom d'horaire" value={time.nom} name="nom" onChange={(e) => settime({ ...time, nom: e.target.value })} type="text" />



                      </div>
                    </div>
                    <div className='col-md-6'>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Jour Travail"
                        value={time.jourtravaille}
                        onChange={(e) => settime({ ...time, jourtravaille: e.target.value })}
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
                              value={aff.margeretardaf}

                              onChange={(h) => {
                                setaff({ ...aff, margeretardaf: h })
                                settime({ ...time, margeretard: h.toLocaleTimeString([], { minute: '2-digit' }) })
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


                              value={aff.margedepartant}
                              onChange={(h) => {
                                setaff({ ...aff, margedepartant: h })
                                settime({ ...time, margedepartant: h.toLocaleTimeString([], { minute: '2-digit' }) })
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
                              label="debut"
                              ampm={false}
                              format="HH:mm"
                              value={aff.debutaf}
                              onChange={(h) => {
                                setaff({ ...aff, debutaf: h })
                                settime({ ...time, debut: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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
                              value={aff.finaf}
                              onChange={(h) => {
                                setaff({ ...aff, finaf: h })
                                settime({ ...time, fin: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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

                        <FormGroup style={{ marginLeft: 65 }} >
                          <FormControlLabel control={<Checkbox onChange={handleChangesdebut}
                          />} label="Début/Sortie" />
                        </FormGroup>

                      </div>
                    </div>
                  </div>
                  {checkeddebut &&
                    <>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <div className="input-group input-group-merge input-group-alternative">
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <MobileTimePicker
                                  label="Début Entrée"
                                  ampm={false}
                                  format="HH:mm"
                                  value={aff.debutentreeaf}
                                  onChange={(h) => {
                                    setaff({ ...aff, debutentreeaf: h })
                                    settime({ ...time, debutentree: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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
                                  value={aff.finentreeaf}
                                  onChange={(h) => {
                                    setaff({ ...aff, finentreeaf: h })
                                    settime({ ...time, finentree: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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
                                  value={aff.debutsortieaf}
                                  onChange={(h) => {
                                    setaff({ ...aff, debutsortieaf: h })
                                    settime({ ...time, debutsortie: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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
                                  value={aff.finsortieaf}
                                  onChange={(h) => {
                                    setaff({ ...aff, finsortieaf: h })
                                    settime({ ...time, finsortie: h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
                                  }}


                                  renderInput={(params) => <TextField {...params} />}
                                />
                              </LocalizationProvider>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>}
                  
                 


                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
                <button type="button" className="btn btn-primary" onClick={handlesubmit}>Ajouter</button>
                
              </div>
              <div  >
          {alertc&&
     <Alert variant="filled" severity="error">
     Erreur ! pas d ajout</Alert>}
     {alertverif
     
     && <Alert variant="filled" severity="error">il faut que debut entrée ,fin entrée ,debut sortie et fin sortie differents de zéro !</Alert>}
     </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
export default AjouterdesHoraires;