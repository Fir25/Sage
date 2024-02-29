import React, { useState } from 'react';
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from "@material-ui/core/Checkbox";
import Mouchard from '../Mouchardd/Mouchard';
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';
function AjouterAbsence() {
    //sélectionner les données d'utilisateur connecté à l'aide de redux
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      var iduserr=test['id']
      var absenceedit = test['absenceedit']
      var absencedelete = test['absencedelete']
    }
    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
    const url=process.env.React_App_URL;//url from file .env
    const { data: users = [] } = useFetch(url+"user/")//liste des utilisateurs
    const { data: motifs = []} = useFetch(url+"motif/")
    const [employes,setemployes] =useState('');
    const [raison, setRaison] = useState('');
    const [datedebut, setDateDebut] = useState('');
    const [datefin, setDatefin] = useState('');
    const [motif_abs, setMotifabsence] = useState('')
    const[justifie,setJustifie]=useState(false)
    const [heure_debut, setHeureDebut] = useState('');
    const [heure_fin, setHeurefin] = useState('');
    const[alert,setAlert]=useState(false)
    const handleChangeJustifie = () => {
       setJustifie(!justifie)//  justifie=true <=> justifie=false
      };
    const handlesubmit = (e) => {
        e.preventDefault()
setAlert(false)
        const absence = { employes, raison, datedebut, datefin, motif_abs,justifie,heure_debut,heure_fin }

        fetch(url+"Absence/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,//pour la sécurité
                },
                body: JSON.stringify(absence)
            }).then((response) =>{
                if(!response.ok) throw new Error(response.status);
                else window.location.reload(false)
                Mouchard("-","ajouté",employes,iduserr,"Ajout Absence  "+datedebut+"au"+datefin)//on enregistre les données dans mouchard aprés l'enregistrement d'abs
          
            }).catch((e) => {
  /**                       if ( e.response.status=== 401) {
                    logoutfunction(e.response.status)
                  } */
                  setAlert(true)
         
            })
    }


    return (
        <div>

            <div className="row">

               {absenceedit &&  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterabsence">
                    Ajouter Une Absence
                </button>}


                <div className="modal fade" id="ajouterabsence"role="dialog" aria-labelledby="ajouterabsence" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ajouter Une Absence</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">



                                <form>

                                    <div className='row'>
                                        <div className='col-md-6 pt-3 '>
                                        <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.user_name +"  " +option.last_name || ""}

   renderInput={(params) => (
     <TextField {...params} label="Employé" variant="outlined" />
   )}
   onChange={(event, value) =>{if (value && value.id){setemployes(value.id)}}} 

 /> 
                                           

                                        </div>
                                        <div className='col-md-6'>
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
                                                {motifs.filter(x=>x.motifConge==false && x.motifmission==false && x.motifdemijournne==false && x.motifteletravail==false ).map((option) => (
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
                                                <input id="datedebut" className="form-control" value={datedebut} onChange={(e)=>setDateDebut(e.target.value)} placeholder="datedebut" type="date"
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                        <div className="form-group">
                                        <label for="datefin">Date fin</label>
                                                <input className="form-control" id="datefin" placeholder="datefin" type="date" value={datefin} min={datedebut} onChange={(e)=>setDatefin(e.target.value) }
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

                      <input id="heurefin" className="form-control" placeholder="" value={heure_fin} name="heure_fin" onChange={(e) => setHeurefin(e.target.value)} type="time"  />

                    </div>

                  </div>
                </div>
                                    <div className='row'>
                                        
                                    <div className='col-md-6'>
                                              <textarea className='form-control' placeholder='Raison' rows="4" cols="40" value={raison} onChange={(e)=>setRaison(e.target.value)}></textarea>
                                    </div>
                                    
                                    <div className='col-md-6'>
                                
          <FormControlLabel control={<Checkbox/>} label='Justifié' value={justifie} onChange={handleChangeJustifie} />
        
                                    </div>
                                    </div>
                                    <br/>
                                    <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button></div>
                                    <div  >
          {alert&&
     <Alert variant="filled" severity="error">
      Il faut sélectionner au moins un employé ,une date de début et une date de fin!</Alert>}</div>
                                </form>

                            </div>
                            <div className="modal-footer">



                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}
export default AjouterAbsence;