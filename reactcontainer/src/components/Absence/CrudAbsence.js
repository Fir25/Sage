import React, { useState } from 'react'
import AjouterAbsence from './AjouterAbsence'
import useFetch from '../useFetch'

import Autocomplete from '@mui/material/Autocomplete';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Mouchard from '../Mouchardd/Mouchard';
import { makeStyles } from '@mui/styles';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import $ from "jquery";
import ScrollContainer from 'react-indiana-drag-scroll';

import frdatatable from '../../frdatatable.json'
import { Alert } from '@mui/material';
import { useSelector } from "react-redux";
function CrudAbsence() {

  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserr=test['id']
    var absenceedit = test['absenceedit']
    var absencedelete = test['absencedelete']
  } 
  $(document).ready(function () {
    $('#absetable').DataTable({
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
  const[openn,setOpenn]=useState(false)
  const [post,setPost]=useState(false)
  React.useEffect(()=>{

    
    if (absences.length==0){
     
    setOpenn(true)
  setPost(false)
  
    }else{
    setOpenn(false)
    setPost(true)}
  }
  ,[openn,post])
  const { data: absences,isloading:ll,error:rr } = useFetch(url+"Absence/")
  const { data: users = []} = useFetch(url+"user/")
  const { data: motifs = []} = useFetch(url+"motif/")
  const [employes, setemployes] = useState('');
  const [raison, setRaison] = useState('');
  const [datedebut, setDateDebut] = useState('');
  const [datefin, setDatefin] = useState('');
  const [motif_abs, setMotifabsence] = useState('')
  const [absenceId, setabsenceId] = useState('')
  const [open, setOpen] = useState(false);
  const [absenceIddelete, setabsenceIddelete] = useState(null)
  const[justifie,setJustifie]=useState(false)
  const [heure_debut, setHeureDebut] = useState('');
  const [heure_fin, setHeurefin] = useState('');
  const[nomemploye,setNomemploye]=useState('')
  const[prenomemploye,setPrenomEmploye]=useState('')
  const[alert,setAlert]=useState(false)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeJustifie = () => {
    setJustifie(!justifie)
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

  function SelectAbsence(id) {
    fetch(url+"Absence/" + id, {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
      result.json().then((resp) => {

        setemployes(resp.employes);
        setRaison(resp.raison);

        setDateDebut(resp.datedebut)
        setDatefin(resp.datefin)
        setabsenceId(resp.id)
        setMotifabsence(resp.motif_abs)
        setJustifie(resp.justifie)
        setHeureDebut(resp.heure_debut)
        setHeurefin(resp.heure_fin)
        setNomemploye(resp.employee)
        setPrenomEmploye(resp.employeelastname)
     
      })
    }).catch((e)=>{
     /** if ( e.response.status=== 401) {
        logoutfunction(e.response.status)
      } */
    })
  }
  const DeleteAbsence = (id) => {

    fetch(url+'Absence/' + id, {
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
      /**if ( e.response.status=== 401) {
        logoutfunction(e.response.status)
      } */
    })


  }

  const UpdateAbsence = (e) => {
e.preventDefault()
setAlert(false)
    let absenceList = { raison, datedebut, datefin, motif_abs, employes,justifie ,heure_debut,heure_fin}


    fetch(url+'Absence/' + absenceId, {
      method: 'PUT',
      headers: {
 
        'Content-Type': 'application/json',
        Authorization:token
      },
      body: JSON.stringify(absenceList)
    }).then((response) =>{
      if(!response.ok){
       setAlert(true)
      }
    
  }).then((e) => {
   
    if(Object.keys(userinfo).length !=0){
      {userinfo.map(v=>
        Mouchard("-","modifié",employes,v.id,"Modifier Absence "+datedebut+"au"+datefin)
        )
      }  
   
     

    }
 window.location.reload(false)
  }).catch((e)=>{
   /** if ( e.response.status=== 401) {
      logoutfunction(e.response.status)
    } */
  })


  }

  return (
    <div>

      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">
     {/**       <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Absences</h3>
      </div> */}
              <div className="card-header border-0">
    
             <AjouterAbsence />
             
              </div>
              <ScrollContainer className="scroll-container">

{post  ?


Object.keys(userinfo).length !=0?
              <div className="table-responsive">
                <table className="table table-bordered display" id="absetable">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Nom d'Employé</th>
                      <th scope="col">Motif d'Absence</th>

                      <th scope="col">Date de début</th>
                      <th scope="col">Date de fin</th>
                      
                      <th scope="col">heure début</th>
                      <th scope="col">heure fin</th>
                      <th scope="col">Raison</th>
                      <th scope="col">Justifié</th>
                    
                {userinfo.map(v=>v.view_abscence_rh==true ?"":    <th scope="col">Action</th>)}  
                     
                    </tr>
                  </thead>
                  <tbody>

                    {absences.map(abse =>
                      <tr key={abse.id}>
                        <td>{abse.employee}</td>
                        <td> {abse.motif}</td>
                        <td>{abse.datedebut}</td>
                        <td>{abse.datefin}</td>
                        <td>{abse.heure_debut}</td>
                        <td>{abse.heure_fin}</td>
                        <td>{abse.raison}</td>
                        <td>{abse.justifie ? "oui" : "Non"}</td>

                 
                        {userinfo.map(v=>v.view_abscence_rh==true ?"":  <td> <div className="row"><div className="col-md-6">

{ absenceedit && <a onClick={() => SelectAbsence(abse.id)} data-toggle="modal" data-target="#absenceupdate" ><EditIcon
  className={classes.icon}
/></a>}
</div>
<div className="col-md-6">
{ absencedelete && <a onClick={() => { handleClickOpen(); setabsenceIddelete(abse.id); }} ><DeleteIcon className={classes.icon} /></a>}


</div>
</div></td>)} 
                         
                           
                         
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
                        {"supprimer une absence"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          êtes-vous sûr de vouloir supprimer cette absence?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>non</Button>
                        <Button onClick={() => { DeleteAbsence(absenceIddelete) }}>
                          oui
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </tbody>
                </table>
              </div>
:""
              :( <>{absences.length==0 && ll==true? <Backdrop  open={openn}>
  <CircularProgress  style={{top : '50%'}} color="black" />
  </Backdrop>:setPost(true)}</>)}</ScrollContainer>
            </div>
            <div className="container">

              <div className="row">
                <div className="col-md-3">



                  <div className="modal fade" id="absenceupdate" role="dialog" aria-labelledby="absenceupdate" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Modifier Absence</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <form>



                            <div className='row'>
                             

                              <div className='col-md-6 pt-3 '>
                                <label>Employé</label>
                                        <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.user_name +"  " +option.last_name || ""}

   renderInput={(params) => (
     <TextField {...params} label={nomemploye+" "+prenomemploye} variant="outlined" />
   )}
   onChange={(event, value) =>{if (value && value.id){setemployes(value.id)}}} 
    
 /> 
                                           

                                     

                              </div>
                              <div className='col-md-6'>
                              <label>Motif</label>
                                <TextField
                                  id="outlined-select-currency"
                                  select
                                  label="Motif"
                                  value={motif_abs}
                                  onChange={(e) => { setMotifabsence(e.target.value) }}
                                  helperText="Svp sélectionner une moti"
                                  margin='normal'
                                  fullWidth
                                >
                                  {motifs.filter(x=>x.motifConge==false && x.motifmission==false && x.motifdemijournne==false && x.motifteletravail==false).map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.motif}
                                    </MenuItem>
                                  ))}

                                </TextField>
                              </div>
                            </div>




                            <div className='row'>
                              <div className='col-md-6'>
                                <div className="form-group">
                                <label for="datedebut">Date début</label>
                                  <input className="form-control" value={datedebut} onChange={(e) => setDateDebut(e.target.value)} id="datedebut" placeholder="datedebut" type="date"
                                  />
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className="form-group">
                                <label for="datefin">Date fin</label>
                                  <input className="form-control" id="datefin" placeholder="datefin" type="date" value={datefin} onChange={(e) => setDatefin(e.target.value) } min={datedebut}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='row'>
                  <div className='col-md-6'>
                    <div className="form-group">

                    <label for="heuredebut">Heure début</label>
                      <input id="heuredebut" className="form-control" placeholder="" value={heure_debut} name="heure_debut" onChange={(e) => setHeureDebut(e.target.value)} type="time" />

                    </div>

                  </div>
                  <div className='col-md-6'>
                    <div className="form-group">

                    <label for="heurefin">Heure fin</label>

                      <input className="form-control" placeholder="" value={heure_fin} name="heure_fin" id="heurefin" onChange={(e) => setHeurefin(e.target.value)} type="time" />

                    </div>

                  </div>
                </div>
                            <div className='row'>
                              <div className='col-md-6'>
                                <textarea className='form-control' placeholder='Raison' rows="4" cols="40" value={raison} onChange={(e) => setRaison(e.target.value)}></textarea>
                              </div>
                              <div className='col-md-6'>

                                <FormControlLabel control={<Checkbox />}  checked={justifie ? true:false} label='Justifié' value={justifie} onChange={handleChangeJustifie} />

                              </div>
                            </div>





                            <br />


                            <div className="form-group"><button className="btn btn-primary" onClick={UpdateAbsence}>Valider</button></div> 
                            
                            <div  >
          {alert&&
     <Alert variant="filled" severity="error">
      Erreur!</Alert>}</div>
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
export default CrudAbsence;