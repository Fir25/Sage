import React, { useState } from 'react'
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Mouchard from '../Mouchardd/Mouchard'
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';
function AjouterMission() {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null

  const url=process.env.React_App_URL;
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
   
  
    
  }
  const { data: motifs = [] } = useFetch(url+"motif/")
  const [motif_abs, setType] = useState('');

  const [datedebut, setDateDebut] = useState(null);
  const [datefin, setdatefin] = useState(null);

  const [contact, setContact] = useState('');
  const [adresse, setadress] = useState('');
  const [employes, setEmployes] = useState(iduserinfo);
  const [heure_debut, setHeureDebut] = useState('');
  const [heure_fin, setHeurefin] = useState('');
  const validation=0
  const validationrh = 0
  const validationrh2=0
  const [date_autorisation, setDateAutorisation] = useState(null)
  const [mission, setMission] = useState(false)
 const[personneinterimaire,setpersonneinterimaire]=useState('')
 const[datetimereprise,setDateTimeReprise]=useState('')
 const[commentaire,setCommentaire]=useState('')
 const[destination,setDestination]=useState('')
 const[villedepart,setVilleDepart]=useState('')
 const[transport,setTransport]=useState('')
const[alerterror,setAlertError]=useState(false)
 const today=new Date()
 const[disabl,setDisable]=useState(false)
  const handlesubmit = (e) => {
    e.preventDefault()
   
const mission=true
    const conge = {validationrh2, validationrh,motif_abs, contact, adresse, employes, validation, heure_debut, heure_fin,personneinterimaire,datetimereprise,commentaire,datedebut,datefin,destination,villedepart,transport,mission }
    setDisable(true)
    fetch(url+"demendeconges/" + iduserinfo + "/"+"mission/"+datedebut+"/"+datefin+"/0"+"/0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:token
          
        },
        body: JSON.stringify(conge)
      })
      .then((response) =>{
        
         
        if(!response.ok) throw new Error(response.status);
      else{
        setDisable(false)
       Mouchard("-","encours",employes,iduserinfo,"Demande  d'une mission de "+datedebut+"à"+datefin +"de "+heure_debut+"au "+heure_fin)
       
      window.location.reload(false);
      }
    }).catch((e) => {
 

/**        if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
          setDisable(false)
          setAlertError(true)
     
    })
  }

  return (
    <div className='row' >

      <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterautor">
        Demander Une mission
      </button>


      <div className="modal fade" id="ajouterautor" role="dialog" aria-labelledby="ajouterautor" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Demander Une mission</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">



              <form>


                <><div className="row">
                  <div className="col-md-6">
                    <div className="form-group">


                      <input className="form-control" placeholder="Contact" value={contact} name="contact" onChange={(e) => setContact(e.target.value)} type="text" />

                    </div>

                  </div>
                  <div className="col-md-6">
                    <div className="form-group">

                      <input className="form-control" placeholder="Adresse" value={adresse} name="adresse" onChange={(e) => setadress(e.target.value)} type="text" />

                    </div>


                  </div></div>
                  
                  
                  <div className='row'>
{/**                  <div className='col-md-6'>
                                          <TextField
                                            id="outlined-select-currency"
                                            select
                                            label="Mission ou authorisation"
                                            value={mission}
                                            onChange={(e) => { setMission(e.target.value) }}
                                            helperText=""
                                            margin='normal'
                                            fullWidth
                                        >
                                         
                                                <MenuItem key="" value="True">
                                                  Mission
                                                </MenuItem>
                                                <MenuItem key="" value="False">
                                                Authorisation
                                                </MenuItem>
                                     

                                        </TextField>
                  
                    </div> */}
       
                    <div className='col-md-6'>
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
                      {motifs.filter(x=> x.motifmission==true).map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.motif}
                        </MenuItem>
                      ))}

                    </TextField>




                  </div>
   
              
                
                 
     {/**               <div className='col-md-6'>
                                    <div className="form-group">

<label>Date et l'heure de reprise</label>
                                      <input className="form-control" placeholder="date et l'heure de reprise" value={datetimereprise} name="reprise" onChange={(e) => setDateTimeReprise(e.target.value)} type="datetime-local" />

                                    </div>

                                  </div> */}
                    </div>
              </>

       <div className='row'>
                                  <div className='col-md-6'>
                                    <div className="form-group">

                                      <label for="datedebut">Date début</label>
                                      <input id="datedebut" className="form-control" placeholder="" value={datedebut}  min={today.getFullYear()+"-"+(today.getMonth()<10? "0"+today.getMonth():today.getMonth()) +"-20"} name="date_debut" onChange={(e) => setDateDebut(e.target.value)} type="date" />

                                    </div>

                                  </div>
                                  <div className='col-md-6'>
                                    <div className="form-group">
                                    <label for="datefin">Date fin</label>

                                      <input id="datefin" className="form-control" placeholder="" value={datefin}  min={today.getFullYear()+"-"+(today.getMonth()<10? "0"+today.getMonth():today.getMonth()) +"-20"  && datedebut}  name="date_fin" onChange={(e) => setdatefin(e.target.value)} type="date" />

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
                      <input id="heurefin" className="form-control" placeholder="" value={heure_fin}  name="heure_fin" onChange={(e) => setHeurefin(e.target.value)} type="time" />

                    </div>

                  </div>
                </div>


          
                                  <div className='row'>
                                   <div className="col-md-6">
                    <div className="form-group">


                      <input className="form-control" placeholder="Destination" value={destination} name="destination" onChange={(e) => setDestination(e.target.value)} type="text" />

                    </div>

                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">


                      <input className="form-control" placeholder="Ville de départ" value={villedepart} name="Ville de départ" onChange={(e) => setVilleDepart(e.target.value)} type="text" />

                    </div>

                  </div>
                  </div>
                  <div className='row'>
                  <div className="col-md-6">
                    <div className="form-group">


                      <input className="form-control" placeholder="Moyenne de transport" value={transport} name="tra" onChange={(e) => setTransport(e.target.value)} type="text" />

                    </div>

                  </div>
                  </div>
                                  <div className='row'>
                                  <div className="col-md">
                                  <textarea placeholder='commentaire' className="form-control" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="4" ></textarea>
</div>
                                  </div>

                                  <br/>
                <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} disabled={disabl? true:false}>Valider</button></div>
                {alerterror &&
                                      <Alert variant="filled" severity="error">
                             Erreur!
                                    </Alert> }

              </form>


            </div>

            <div className="modal-footer">



            </div>

          </div>
        </div>
      </div>
    </div>



  )
}
export default AjouterMission;