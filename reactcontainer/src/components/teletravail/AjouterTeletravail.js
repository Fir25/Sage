import React, { useState } from 'react'
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Mouchard from "../Mouchardd/Mouchard"

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Alert } from '@mui/material';

import { useSelector } from 'react-redux';

function AjouterTeletravail() {
 
  const url=process.env.React_App_URL;
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    var teletravail_aujourdhui=test['teletravail_aujourdhui']
    

    
  }
  const[alerterror,setAlertError]=useState(false)
  const { data: motifs = [] } = useFetch(url+"motif/")
  const [motif_abs, setType] = useState('');

  const [datedebut, setDateDebut] = useState('');
  const [datefin, setdatefin] = useState('');
  const [contact, setContact] = useState('');
  const [adresse, setadress] = useState('');
  const [employes, setEmployes] = useState(iduserinfo);
  const [personneinterimaire,setPersonneinterimaire]=useState('')
  const[joursouvres,setJoursOuvres]=useState('')
  const[datetimereprise,setDateTimeReprise]=useState(new Date())
  const[commentaire,setCommentaire]=useState('')
  const [heure_debut, setHeureDebut] = useState('00:00:00.000000');
  const [heure_fin, setHeurefin] = useState('00:00:00.000000');
 const validation =0;
 const validationrh = 0
 const validationrh2=0
 const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
const teletravail=true;
const[disabl,setDisable]=useState(false)
  const handlesubmit = (e) => {

    e.preventDefault()
    setAlertError(false)
    const conge = {validationrh2,validationrh,teletravail, motif_abs, datedebut, datefin, contact, adresse, employes, validation,datetimereprise,personneinterimaire,commentaire,heure_debut,heure_fin}
    setDisable(true)
    fetch(url+"demendeconges/" + iduserinfo+ "/"+"téletravail/"+datedebut+"/"+datefin+"/0"+"/0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(conge)
      })
      .then((response) =>{
        /*  if ( response.status===401) {
          logoutfunction(response.status)
        } */
  
        if(!response.ok) throw new Error(response.status);
      else{  setDisable(false)
         Mouchard("-","encours",employes,iduserinfo,"Demande  de téletravail de " +datedebut+"au "+datefin)
      window.location.reload(false);    }
    }).catch((e) => {

    setDisable(false)
     setAlertError(true)
    })
      
    
  }
  //const d=new Date()

  //const date_pointage=dateFormat(d.toLocaleDateString(),"yyyy-mm-dd hh:mm:ss")
  //si il'y a un téeltravail validé aujourd'hui le bouton pointage s'affiche
  const PointageTeletravail= (e) => {
    e.preventDefault()
 const employes=iduserinfo
    const pointage = {  employes }

    fetch(url+"createpointage/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(pointage)
      })
      .then((response) =>{
        if(!response.ok) throw new Error(response.status);
        else window.location.reload(false)
  
    })
      .then(() => {
        Mouchard("en cours","ajouté",employes,iduserinfo,"Ajouter un pointage(téletravail) ")
      


      }).catch((e) => {
        /**if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
       
      })
  }
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
    
        <div className="row">
        
                  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#tele">
                    Demander Un Téletravail
                  </button>
                  
                  {teletravail_aujourdhui ==true?  <button type="button" className="btn btn-primary" onClick={handleClickOpen}>
                    Pointage
                  </button>:""}
                

                  <div className="modal fade" id="tele" role="dialog" aria-labelledby="tele" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">    Demander Un Téletravail</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">



                          <form>
                         {/**   {checked ? "" : */}

                              <div className="row">
                                <div className="col-md-6">
                                  <div className="form-group">


                                    <input className="form-control" placeholder="Contact" value={contact} name="contact" onChange={(e) => setContact(e.target.value)} type="text" />

                                  </div>

                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">

                                    <input className="form-control" placeholder="Adresse" value={adresse} name="adresse" onChange={(e) => setadress(e.target.value)} type="text" />

                                  </div>


                                </div>
                                
                      



                                </div>
                               
                               
                            
                                
                                
                                <div className='row'>
                                  <div className='col-md-6'>
                                    <div className="form-group">

<label for='debut'> Date début</label>
                                      <input id="debut" className="form-control" placeholder=""  value={datedebut} name="date_debut" onChange={(e) => setDateDebut(e.target.value)} type="date" />

                                    </div>

                                  </div>
                                  <div className='col-md-6'>
                                    <div className="form-group">


                                    <label for='fin'> Date fin</label>
                                      <input id="fin" className="form-control" placeholder="" value={datefin} min={datedebut}  name="date_fin" onChange={(e) => setdatefin(e.target.value)} type="date" />

                                    </div>

                                  </div>
                            
                              
                                </div>
                              {/**  <div className='row'>
                                <div className='col-md-6'>
                    <div className="form-group">
<label for="heuredebut">Heure début</label>

                      <input id="heuredebut" className="form-control" placeholder="" value={heure_debut} name="heure_debut" onChange={(e) => setHeureDebut(e.target.value)} type="time" />

                    </div>

                  </div>
                  <div className='col-md-6'>
                    <div className="form-group">

                    <label for="heurefin">Heure fin</label>
                      <input id="heurefin" className="form-control" placeholder="" value={heure_fin} name="heure_fin" onChange={(e) => setHeurefin(e.target.value)} type="time" />

                    </div>

                  </div>
          
                           
                </div> */}
                <div className='row'>
               {/**     <div className='col-md-4'>
                               
                           <TextField
                            
                                           id="outlined-select-currency"
                                           select
                                           label="Personne intérimaire"
                                           required={true}
                                           value={personneinterimaire}
                                           onChange={(e) => { setPersonneinterimaire(e.target.value) }}
                                           helperText="Personne intérimaire"
                                           margin='normal'
                                           fullWidth
                                       >
                                           {users.map((option) => (
                                               <MenuItem key={option.id} value={option.id} required>
                                                   {option.user_name +" "+option.last_name}
                                               </MenuItem>
                                           ))}

                                       </TextField> 


                           
                           </div>*/}
                <div className='col-md-4'>
                                    <TextField
                                      id="outlined-select-currency"
                                      select
                                      label="Motif"
                                      value={motif_abs}
                                      onChange={(e) => { setType(e.target.value) }}
                                      helperText="Svp sélectionner une motif"
                                      margin='normal'
                                      fullWidth
                                    >
                                      {motifs.filter(x=>x.motifteletravail==true).map((option) => (
                                        <MenuItem key={option.id} value={option.id} onClick={()=>setJoursOuvres(option.nombrejours_ouvres)}>
                                   
                                          {option.motif}
                                       
                                        </MenuItem>
                                      ))}

                                    </TextField>




                                  </div>
                 {/**                 <div className='col-md-4'>
                                    <div className="form-group">

<label>Date et l'heure de reprise</label>
                                      <input className="form-control" placeholder="date et l'heure de reprise" value={datetimereprise} name="reprise" onChange={(e) => setDateTimeReprise(e.target.value)} type="datetime-local" />

                                    </div>

                                  </div> */}
                </div>
                       
                      
                                <div className='row'>
                                <div className="col-md">
                                <textarea placeholder='commentaire' className="form-control" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="4" ></textarea>
</div>
                                </div>

                           {/**} */} 


                       {/**     {checked ?  <div className='row'>
                              <div className='col-md-6'>
                                <div className="form-group">


                                  <input className="form-control" placeholder="" value={heure_debut} name="heure_debut" onChange={(e) => setHeureDebut(e.target.value)} type="time" />

                                </div>

                              </div>
                              <div className='col-md-6'>
                                <div className="form-group">


                                  <input className="form-control" placeholder="" value={heure_fin} name="heure_fin" onChange={(e) => setHeurefin(e.target.value)} type="time" />

                                </div>

                              </div>
                            </div> : ""} */}


<br/>

                            <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} disabled={disabl? true:false}>Valider</button></div>

                          {/**  <FormControlLabel control={<Checkbox onChange={handleChange}
                            />} label="demender une autorisation" />
 */}

 {alerterror && <div>
  <Alert variant="filled" severity="error">
  Il y a des informations manquantes!!</Alert>
  </div>}
                          </form>


                        </div>

                        <div className="modal-footer">



                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <Dialog

BackdropProps={{ invisible: true }}

open={open}
onClose={handleClose}
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
>
<DialogTitle id="alert-dialog-title">
  {"Pointage"}
</DialogTitle>
<DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir faire pointage  ?
  </DialogContentText>
</DialogContent>
<DialogActions>
  <Button onClick={handleClose}>non</Button>
  <Button onClick={PointageTeletravail }>
    oui
  </Button>
</DialogActions>
</Dialog>
              </div>

  )
}
export default AjouterTeletravail;

