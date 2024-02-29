import React, { useState } from 'react'
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Mouchard from "../Mouchardd/Mouchard"
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';

function Ajoutercongé() {
  const url=process.env.React_App_URL;
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    
  }
 

  const { data: motifs = [] } = useFetch(url+"motif/")
  const [motif_abs, setType] = useState('');
   const[testdemijournne,settestdemijournne]=useState('')
  const [datedebut, setDateDebut] = useState('');
  const [datefin, setdatefin] = useState('');
  const [contact, setContact] = useState('');
  const [adresse, setadress] = useState('');
  const [employes, setEmployes] = useState(iduserinfo);
  const [personneinterimaire,setPersonneinterimaire]=useState('')
  const[joursouvres,setJoursOuvres]=useState('')
  const[datetimereprise,setDateTimeReprise]=useState('')
  const[commentaire,setCommentaire]=useState('')
 const [matindebut,setMatinDebut]=useState('')
 const[matinfin,setMatinFin]=useState('')
  const [heure_debut, setHeureDebut] = useState('00:00:00.000000');
  const [heure_fin, setHeurefin] = useState('00:00:00.000000');
  const[nbjourretires,setnbjourretires]=useState('')
 const validation =0
 const validationrh =0
 const validationrh2=0
 const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null

const today=new Date()

const[parameters,setParameters]=useState([])
const [justifie,setJustifie]=useState('')
const[congemaladie,setCongeMaladie]=useState('')
const [difference,setDiff]=useState('')
const[soldenouveau,setSoldeNouveau]=useState('')
const[nouveausoldemaladie,setNouveausoldeMaladie]=useState('')
const calculateMaxDate = () => {
  if (datedebut && !isNaN(joursouvres)) {
    const startDate = new Date(datedebut);
    const maxDate = new Date(startDate);
    maxDate.setDate(startDate.getDate() + parseInt(joursouvres, 10));

    // Convert maxDate to a string in the format "YYYY-MM-DD"
    const maxDateStr =
      maxDate.getFullYear() +
      '-' +
      (maxDate.getMonth() < 9 ? '0' + (maxDate.getMonth() + 1) : maxDate.getMonth() + 1) +
      '-' +
      (maxDate.getDate() < 10 ? '0' + maxDate.getDate() : maxDate.getDate());

    return maxDateStr;
  }
  // If either datedebut is not set or numberToAdd is not a valid number, return an empty string
  return '';
};
function SearchpourDemandeConge(d1,d2,nbjoursret,just,nbjourouv,congemaladie,matindebut,matinfin){
 
  fetch(url+'SearchpourDemandeConge/'+ iduserinfo+"/"+nbjoursret+"/"+nbjourouv+"/"+just+"/"+d1+"/"+d2+"/"+congemaladie+"/"+matindebut+"/"+matinfin).then(res =>{
  

    if (!res.ok){
        throw Error("could not fetch the data for that resource")
    }
    return res.json();
}).then(data =>{
   
setDiff(data.difference)
setNouveausoldeMaladie(data.nouveausoldemaladie)
setSoldeNouveau(data.soldenouveau)
setParameters(data) ;
})
.catch(err =>{
 
})
}
const[checkalert,setCheckAlert]=useState(false)
const[alertcalculjours,setCheckAlertcalculjours]=useState(false)
const [alerterrorx,setAlertErrorx]=useState(false)
const [alerterror,setAlertError]=useState(false)
const[disabl,setDisable]=useState(false)
const[documentmaladie,setDocumentMaladie]=useState([])
const [alertsoldemaladie,setAlertsoldeMaladie]=useState(false)
const [alertsolde,setAlertSolde]=useState(false)
  const handlesubmit = (e) => {
    e.preventDefault()
    setCheckAlert(false)
    setCheckAlertcalculjours(false)
    setAlertsoldeMaladie(false)
    setAlertSolde(false)
    

const formData=new FormData()
const nbjours=parameters.nbjours
const nbjoursmaladiecoupe=parameters.nbjoursmaladiecoupe
const soldeb=  parameters.soldenouveau
if(documentmaladie.length!=0){
  formData.append('documentmaladie',documentmaladie,documentmaladie.name)
  console.log(documentmaladie)
}


formData.append('employes',iduserinfo)
formData.append('nbjoursmaladiecoupe',nbjoursmaladiecoupe)
formData.append('matindebut',matindebut)
formData.append('adresse',soldeb)

formData.append('matinfin',matinfin)
formData.append('nbjours',nbjours)
formData.append('motif_abs',motif_abs)
formData.append('datedebut',datedebut)
formData.append('datefin',datefin)
formData.append('contact',contact)

formData.append('validationrh',validationrh)
formData.append('validation',validation)
formData.append('validationrh2',validationrh2)
formData.append('datetimereprise',datetimereprise)
formData.append('personneinterimaire',personneinterimaire)
formData.append('commentaire',commentaire)
formData.append('heure_debut',heure_debut)
formData.append('heure_fin',heure_fin)

//const conge = {nbjoursmaladiecoupe,matindebut,matinfin,nbjours, motif_abs, datedebut, datefin, contact, adresse, employes, validation,datetimereprise,personneinterimaire,commentaire,heure_debut,heure_fin}
  

if ( motif_abs=="" ){
   setCheckAlert(true)
      
    }


    else{

      setDisable(true)
    fetch(url+"demendeconges/" + iduserinfo +"/"+"conge/"+datedebut+"/"+datefin+"/"+soldenouveau+"/"+nouveausoldemaladie,
      {
        method: "POST",
        headers: {
        
          Authorization:token
        },
        body: formData
      })
      .then((response) =>{
        if(!response.ok) throw new Error(response.status);
      else{     setDisable(false)
      
      
     window.location.reload(false);

    
    }
    })  .catch((e) => {
    
      if (e instanceof Error && e.message === '400') {
        setAlertErrorx(true);

        setTimeout(() => {
          setAlertErrorx(false);
        }, 2000); 
    
        
      } else {
  
        setAlertError(true);
       
      }
      setDisable(false);
      
    });
      
    
  }}

  return (
    <div>
    
        <div className="row">
        
                  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpointage">
                    Demander Un Congé
                  </button>


                  <div className="modal fade" id="ajouterpointage" role="dialog" aria-labelledby="ajouterpointage" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">       Créer une nouvelle demande </h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">



                          <form>
                            <div className='row'>
                         
                                <div className='col-md'>
                                    <TextField
                                      id="outlined-select-currency"
                                      select
                                      label="Motif"
                                      value={motif_abs}
                                      name="motif_abs"
                                      onChange={(e) => { setType(e.target.value) }}
                                      helperText="Choisir type d'absence"
                                      margin='normal'
                                      fullWidth
                                    >
                                      {motifs.filter(x=>x.motifConge==true || x.motifdemijournne ==true).map((option) => (
                                        <MenuItem key={option.id} value={option.id} onClick={()=>{setCongeMaladie(option.congemaladie);setJoursOuvres(option.nombrejours_ouvres)  ;settestdemijournne(option.motifdemijournne);setnbjourretires(option.nbjours_retire);setJustifie(option.justifie);{option.motifdemijournne==true?SearchpourDemandeConge(datedebut,datedebut,option.nbjours_retire,option.justifie,option.nombrejours_ouvres,option.congemaladie,matindebut,matinfin):SearchpourDemandeConge(datedebut,datefin,option.nbjours_retire,option.justifie,option.nombrejours_ouvres,option.congemaladie,matindebut,matinfin)}}}>
                                   
                                          {option.motif}
                                       
                                        </MenuItem>
                                      ))}

                                    </TextField>




                                  </div>
                            </div>

                                  
                                  {testdemijournne==false?<>
                                    <div className='row'>
                                  
                                  <div className='col-md-6 pb-1'>
                                    <div className="form-group">

                                      <label >Date début</label>
                                      <input className="form-control" placeholder="" min={today.getFullYear()+"-"+(today.getMonth()<10? "0"+today.getMonth():today.getMonth()) +"-20"} value={datedebut}  name="datedebut" onChange={(e) => {setDateDebut(e.target.value);SearchpourDemandeConge(e.target.value,datefin,nbjourretires,justifie,joursouvres,congemaladie,matindebut,matinfin)}} type="date"  />

                                    </div>

                                  </div>  
                                  <div className='col-md-6 pt-4' style={{marginTop:"7px"}}>
                                     <TextField
                                            id="outlined-select-currency"
                                            select
                                            label="Matin/Aprés midi"
                                            value={matindebut}
                                            onChange={(e) => {setMatinDebut(e.target.value);SearchpourDemandeConge(datedebut,datefin,nbjourretires,justifie,joursouvres,congemaladie,e.target.value,matinfin)}}
                                            helperText=""
                                            size="small"
                                            fullWidth
                                            name="matindebut"
                                        >
                                         
                                                <MenuItem key="8" value={true}>
                                               Matin
                                                </MenuItem>
                                                <MenuItem key="9" value={false}>
                                                Aprés midi
                                                </MenuItem>
                                             

                                     

                                        </TextField>
                                  </div>
                                  </div>
                                  
<div className='row'>
<div className='col-md-6'>
                                    <div className="form-group">
                                    <label for="datefin">Date fin(inclus)</label>

                                      <input id="datefin" name="datefin" className="form-control" placeholder="" value={datefin}  min={today.getFullYear()+"-"+(today.getMonth()<10? "0"+today.getMonth():today.getMonth()) +"-20"  && datedebut} ax={joursouvres == null  ? null : calculateMaxDate()}  onChange={(e) => {setdatefin(e.target.value);SearchpourDemandeConge(datedebut,e.target.value,nbjourretires,justifie,joursouvres,congemaladie,matindebut,matinfin)}} type="date" />

                                    </div>

                                  </div>
                                  
                                  <div className='col-md-6 pt-4' style={{marginTop:"7px"}}>
                                  <TextField
                                            id="outlined-select-currency"
                                            select
                                            label="Matin/Aprés midi"
                                            value={matinfin}
                                            name="matinfin"
                                            onChange={(e) => {setMatinFin(e.target.value);SearchpourDemandeConge(datedebut,datefin,nbjourretires,justifie,joursouvres,congemaladie,matindebut,e.target.value)}}
                                            helperText=""
                                            size="small"
                                            fullWidth
                                        >
                                         
                                                <MenuItem key="8" value={true}>
                                               Matin
                                                </MenuItem>
                                                <MenuItem key="9" value={false}>
                                                Aprés midi
                                                </MenuItem>
                                             

                                     

                                        </TextField>
                                  </div>
</div>
                                  </> 

                                  
                            :<div className='row'><div className='col-md-4'>
                            <div className="form-group">

<label for="datedebut">Date </label>
                              <input id="datedebut" name="datedebut" className="form-control" placeholder="" min={today.getFullYear()+"-"+(today.getMonth()<10? "0"+today.getMonth():today.getMonth() )+"-20"} value={datedebut} onChange={(e) => {setDateDebut(e.target.value);setdatefin(e.target.value);SearchpourDemandeConge(e.target.value,e.target.value,nbjourretires,justifie,joursouvres,congemaladie,matindebut,matinfin)}} type="date" />

                            </div>
                            </div>
                          </div>  }

                            {congemaladie==""?"":
                            
                            <div className='row'>
                              <div className='col-md-4'>
                                <div className="form-group">
                                <input type="file" id="documentmaladie" name="documentmaladie" onChange={(e)=>setDocumentMaladie(e.target.files[0])} />
                               </div></div>
                                </div>}






<div className='row'>




<div className="col-md-4">
                              <div className="form-group">
                                <label>Nb jours demandés</label>
                              <input value={parameters.difference} className="form-control"  disabled={true}  />
</div>
                                </div>   
                                <div className="col-md-4">
                            <div className="form-group">
                              <label>Solde</label>
<input value={parameters.solde} className="form-control"  disabled={true}  />
</div>
                              </div>
                       <div className="col-md-4">
                            <div className="form-group">
                              <label>Nouveau Solde</label>
<input value={parameters.soldenouveau} className="form-control"  disabled={true} />
</div>
                              </div>
                      

</div>

<div className='row'>


<div className="col-md-4">
                            <div className="form-group">
                              <label>maximum</label>
<input value={joursouvres== null ?  0 : joursouvres } className="form-control"  disabled={true} />
</div>
                              </div>

 
                            
                     
                      

</div>


                      <div className='row'>
                            <div className="col-md">
                            <textarea placeholder='Cause' name="commentaire" className="form-control" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="4" ></textarea>
</div>
                            </div>           
                          
              <br/>
                         

              


<br/>

                            <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} disabled={    (joursouvres != 0 && joursouvres != null &&  parameters.difference > joursouvres ) || parseInt(parameters.soldenouveau )<= 0 && parameters.nbjours !=0.0 ? true:false}>Valider</button></div>

                            {checkalert &&
                                      <Alert variant="filled" severity="error">
                                   motif  est vide ! 
                                    </Alert> }
                                    
                                  
                                    {alerterror &&
                                      <Alert variant="filled" severity="error">
                                Erreur!
                                    </Alert> }
                                    {alerterrorx &&
                                      <Alert variant="filled" severity="error">
                                Vous avez déja une demande en cours de validation ou validée pendant cette péridoe !
                                    </Alert> }
                                   
                                                      {alertsolde ||  parseInt(parameters.soldenouveau )< 0  &&   parameters.nbjours !=0.0 &&
                                      <Alert variant="filled" severity="error">
                                       Votre solde  est insuffisant !
                                          </Alert> 
                                    }
                                   
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
export default Ajoutercongé;