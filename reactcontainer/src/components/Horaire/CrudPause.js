import React from 'react';

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
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import { format } from 'date-fns';
import { TextField } from '@mui/material';


import Checkbox from "@material-ui/core/Checkbox";
import AjouterPause from './AjouterPause';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import { MenuProps } from "../Rapports/utils";
import ListItemText from "@material-ui/core/ListItemText";

import ListItemIcon from "@material-ui/core/ListItemIcon";

import MenuItem from '@mui/material/MenuItem';

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
const CrudPause = () => {
    const token = localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null



    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
     
     var horaireedit=test['horaireedit']
     var horairedelete=test['horairedelete']
     
      
    }
   
 


    const url = process.env.React_App_URL;
    const { data: pauses = [], isloading, error } = useFetch(url + "pause/")
    const { data: horaires, isloading: lll, error: fev } = useFetch(url+"horaire/")
    const useStyle = makeStyles((theme) => ({
        root: {
          height: 240,
          flexGrow: 1,
          maxWidth: 400
        },
        imageemploye: {
          height: 80,
          width: 80
        }, formControl: {
    
          width: 200,
    
        }, icon: {
          marginRight: 10,
          marginLeft: 10,
          color: '#5ac2df'
    
    
    
    
    
    
          ,
    
        },
        dialog: {
    
          boxShadow: 'none',
        }, paper: {
          overflowX: "scroll",
          width: "250px"
        }
      }));
    const [open, setOpen] = useState(false);
    const [pauseiddelete, setpauseiddelete] = useState(null)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const classes = useStyle()
    const handleChangePlanifie = () => {
        setplanifie(!planifie)
    }

    const [nbfois, setNbfois] = useState('');

    const [quota, setquota] = useState('');
    const [planifie, setplanifie] = useState('');
    const [pauseid, setPauseId] = useState(null)
    const [dpause, setdpause] = useState(format(new Date(), 'HH:mm:ss'))
    const [fpause, setfpause] = useState(format(new Date(), 'HH:mm:ss'))
    const [dpauseaf, setdpauseaf] = useState(format(new Date(), 'HH:mm:ss'))
    const [fpauseaf, setfpauseaf] = useState(format(new Date(), 'HH:mm:ss'))
    const[idhoraire,setIdHoraire]=useState([])
    const[nom,setNom]=useState('')
    const[pausedejeuner,setPausedejeuner]=useState(false)
    const isAllSelected =horaires.length > 0 && idhoraire.length === horaires.length;
   
    const handleChangePausedejeuner = () => {
      setPausedejeuner(!pausedejeuner)
  }
    const handleChangehoraire = (event) => {
      const value = event.target.value;
      if (value[value.length - 1] === "all") {
          setIdHoraire(idhoraire.length === horaires.length ? [] : horaires.map(x=>x.id));
        return;
      }
    
      setIdHoraire(value);
    };

    function SelectPause(id) {
        fetch(url + "pause/" + id
            , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: token,
                }
            })


            .then((result) => {
                result.json().then((resp) => {

                    setNbfois(resp.nbfois);
                    setPauseId(resp.id)
                    setdpause(resp.dpause)
                    setfpause(resp.fpause)
                    setdpauseaf(new Date('2018-02-14T' + resp.dpause + '.000'))
                    setfpauseaf(new Date('2018-02-14T' + resp.fpause + '.000'))
                    setquota(resp.quota)
                    setplanifie(resp.planifie)
                    setIdHoraire(resp.idhoraire)
                    setNom(resp.nom)
                    setPausedejeuner(resp.pausedejeuner)
                   
                })
            }).catch((e) => {

                /**   if ( e.response.status=== 401) {
                       logoutfunction(e.response.status)
                     } */
            })





    }
    const DeletePause = (pauseid) => {
        fetch(url + 'pause/' + pauseid, {
            method: 'DELETE',
            headers: {

                'Content-Type': 'application/json',
                Authorization: token
            },
        }).then(() => {
            setOpen(false);
            window.location.reload(false);
        }
        )


    }

    const UpdatePause = () => {

        let pauseList = { nbfois, quota, dpause, fpause, planifie, idhoraire,nom,pausedejeuner}


        fetch(url + 'pause/' + pauseid, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify(pauseList)
        }).then(() => {

            alert('ii')

        }

        )
    }
    $(document).ready(function () {
      $('#pausetable').DataTable({
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

                            <div className="card-header border-0">

                                <AjouterPause />
                            </div>
                            <ScrollContainer>
                                <div className="table-responsive">
                                    {pauses.length == 0 ? "" :
                                        <table className="table table-bordered display" id="pausetable">
                                            <thead className="thead-light">
                                                <tr>
                                                <th scope="col">Nom</th>
                                                <th scope="col">Horaires</th>
                                                    <th scope="col">Début pause</th>
                                                    <th scope="col">Fin pause</th>
                                                    <th scope="col">Quota(minutes)</th>
                                                    <th scope="col">Nb fois</th>
                                                    <th scope="col">Planifié</th>
                                                    <th scope="col">Pause déjeuner</th>
                                                   
                                                    <th scope="col">Action</th>

                                                </tr>
                                            </thead>
                                            <tbody>

                                                {Object.values(pauses).map(({ horaire, dpause, fpause, quota, nbfois, planifie, id,nom,pausedejeuner }, i) =>


                                                    <tr key={id}>
  <td >{nom}</td>
  <td ><ul>{horaire.map(x=><li>{x.nom}</li>)}</ul></td>
                                                        <td >{dpause}</td>

                                                        <td >{fpause}</td>
                                                        <td >{quota}</td>

                                                        <td >{nbfois}</td>
                                                        <td >{planifie == true ? "oui" : "non"}</td>
                                                        <td >{pausedejeuner == true ? "oui" : "non"}</td>
                                                        <td>
                                                            <tr>

                                                               { horaireedit && <td>

                                                                    <a onClick={() => SelectPause(id)} data-toggle="modal" data-target="#modalpause" ><EditIcon
                                                                        className={classes.icon}
                                                                    /></a>
                                                                </td>}


                                                                {horairedelete &&  <td>
                                                                    <a onClick={() => { handleClickOpen(); setpauseiddelete(id); }}  ><DeleteIcon className={classes.icon} /></a>


                                                                </td>}
                                                                <td>             <a data-toggle="modal" data-target={`#modalemployes${id}`}  >
                                                                    <RemoveRedEyeIcon className={classes.icon} />

                                                                </a>

                                                                    <div className="modal fade" id={`modalemployes${id}`} role="dialog" aria-labelledby={`modalemployes${id}`} aria-hidden="true">
                                                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                                                            <div className="modal-content">
                                                                                <div className="modal-header">
                                                                                    <h5 className="modal-title" id="exampleModalLabel"></h5>
                                                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                                        <span aria-hidden="true">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="modal-body">

                                                                                    <div className=''>


                                                                                        <div className="table-responsive" style={{ boxShadow: "  0 0 8px 0px", borderRadius: "7px" }}>

                                                                                            <table className="table table-bordered display">
                                                                                                <thead className="thead-dark">
                                                                                                    <tr>

                                                                                                        <th scope="col" className='text-center'>Horaire </th>



                                                                                                    </tr>
                                                                                                </thead>


                                                                                                <tbody >




                                                                                                    {horaire.map(w =>
                                                                                                        <tr>       <td> {w.nom}
                                                                                                        </td>        </tr>)}





                                                                                                </tbody>


                                                                                            </table>

                                                                                        </div>

                                                                                    </div>


                                                                                </div>

                                                                            </div>
                                                                        </div>


                                                                    </div>
                                                                </td>

                                                            </tr>
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
                                                        {"supprimer une pause"}
                                                    </DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-description">
                                                            êtes-vous sûr de vouloir supprimer cette pause ?
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose}>non</Button>
                                                        <Button onClick={() => { DeletePause(pauseiddelete) }}>
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





                            <div className="modal fade" id="modalpause" role="dialog" aria-labelledby="modalpause" aria-hidden="true">
                                <div className="modal-dialog modal-lg" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Modifier Pause</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">



  
                                        <form>
  <div className="row">
  <div className='col-md-4'>
                                            <div className="form-group">
                                                <div className="input-group input-group-merge input-group-alternative">

                                                    <input className="form-control" placeholder="Nom de pause" value={nom} name="nbfois" onChange={(e) => setNom(e.target.value)} type="text" />
                                                </div>
                                            </div>
                                        </div>

<div className='col-md-4'>
<div className="form-group">
                  <div className="input-group input-group-merge input-group-alternative">
  
                    <input className="form-control" placeholder="Nombre de fois" value={nbfois} name="nbfois" onChange={(e) => setNbfois(e.target.value)} type="number" />
                  </div>
                </div>
</div>
<div className='col-md-4'>
<div className="form-group">
                  <div className="input-group input-group-merge input-group-alternative">
  
                    <input className="form-control" placeholder="Quota" value={quota} name="quota" onChange={(e) => setquota(e.target.value)} type="number" />
                  </div>
                </div>
</div>

  </div>




  
               



                <div className="row">
                            <div className="col-md-4 pt-2">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">
                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Début pause"
                                      ampm={false}
                                      format="HH:mm"
                                      value={dpauseaf}
                                      onChange={(h) => {
                                        setdpauseaf(h)
                                        setdpause(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params}  size="small" />}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 pt-2">
                              <div className="form-group">
                                <div className="input-group input-group-merge input-group-alternative">

                                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileTimePicker
                                      label="Fin pause"
                                      ampm={false}
                                      format="HH:mm"
                                      value={fpauseaf}
                                      onChange={(h) => {
                                        setfpauseaf(h)



                                        setfpause(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                      }}


                                      renderInput={(params) => <TextField {...params} size="small"/>}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-4 pt-2'>
<FormControlLabel control={<Checkbox />} label='planifié' value={planifie} onChange={handleChangePlanifie} checked={planifie ? true:false} />

</div>
               
                          </div>
<div className='row'>
<div className='col-md-4'>
                                            <FormControlLabel control={<Checkbox />} label='Pause déjeuner' value={pausedejeuner} onChange={handleChangePausedejeuner} checked={pausedejeuner ? true : false} />

                                        </div>
<div className='col-md-4'>
                          <FormControl className={classes.formControl}>
                   <InputLabel id="mutiple-select-label">Sélectionnez des horaires</InputLabel>
                   <Select
                     labelId="mutiple-select-label"
                     multiple
                     value={idhoraire}
                     onChange={handleChangehoraire}
                     renderValue={ (selected)=>selected.map(obj =>horaires.find(o => o.id=== obj).nom).join(", ")} 
                     MenuProps={MenuProps}
                   >
                     <MenuItem
                       value="all"
                       classes={{
                         root: isAllSelected ? classes.selectedAll : ""
                       }}
                     >
                       <ListItemIcon>
                         <Checkbox
                           classes={{ indeterminate: classes.indeterminateColor }}
                           checked={isAllSelected}
                           indeterminate={
                            idhoraire.length > 0 && idhoraire.length < horaires.length
                           }
                         />
                       </ListItemIcon>
                       <ListItemText
                         classes={{ primary: classes.selectAllText }}
                         primary="Select All"
                       />
                     </MenuItem>
                     {horaires.map((option) => (
                       <MenuItem key={option.id} value={option.id}>
                         <ListItemIcon>
                           <Checkbox checked={idhoraire.indexOf(option.id) > -1} />
                         </ListItemIcon>
                         <ListItemText primary={option.nom} />
                       </MenuItem>
                     ))}
                   </Select>
                   </FormControl>
                          </div>
</div>
  
  <div className="form-group pt-3"><button className="btn btn-primary" onClick={UpdatePause}>Valider</button></div>    </form>
  

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
export default CrudPause