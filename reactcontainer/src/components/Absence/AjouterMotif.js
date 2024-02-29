import React from 'react';
import { useState } from 'react';

import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useSelector } from 'react-redux';
import Checkbox from "@material-ui/core/Checkbox";

 function AjouterMotif(){
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    
    var absenceedit = test['absenceedit']
    var absencedelete = test['absencedelete']
  }
 
    const [motif, setMotifName] = useState('');
 const[nombrejours_ouvres,setnombrejours_ouvres]=useState(null)
 const[motifConge,setmotifConge]=useState(false)
 const[motifmission,setmotifMission]=useState(false)
const[motifteletravail,setMotifTeletravail]=useState(false)
const[motifdemijournne,setmotifdemijournne]=useState(false)
const[motifautorisation,setautorisation]=useState(false)
const[motifdemanderh,setdemanderh]=useState(false)
const[motifpointage,setpointage ]=useState(false)
const[nbjours_retire,setnbjours_retire ]=useState(0)

const [justifie,setJustifie]=useState(false)
const[congemaladie,setCongeMaladie]=useState(false)
const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null

const url=process.env.React_App_URL;
const handleChangeJustifie=()=>{
  setJustifie(!justifie)
}
const handleChangeMaladie=()=>{
  setCongeMaladie(!congemaladie)
}
const handleChangeTeletravail=()=>{
  setMotifTeletravail(!motifteletravail)
}
const handleChangemotifdemijournne=()=>{
  setmotifdemijournne(!motifdemijournne)
}
 const handleChangeMotifMission = () => {
  setmotifMission(!motifmission)
 };
 const handleChangeMotifCongé = () => {
  setmotifConge(!motifConge)
 };
 const handleChangeautorisation=()=>{
  setautorisation(!motifautorisation )
}
const handleChangedemanderh=()=>{
  setdemanderh(!motifdemanderh )
}
const handleChangepointage=()=>{
  setpointage(!motifpointage)
}

    const handlesubmit = (e) =>{
      
      e.preventDefault()
      if (motifdemijournne==true){
    
      const motiff = {motif,nombrejours_ouvres,motifConge, motifmission,motifteletravail,motifautorisation, motifdemanderh,motifpointage,nbjours_retire,motifdemijournne,justifie,congemaladie}
    
      fetch(url+"motif/" , 
      {
        method : "POST" , 
        headers : {
         "Content-Type" : "application/json" ,
         Authorization: token,
        },
        body : JSON.stringify(motiff)
      }).then(() =>{
      
     window.location.reload(false);
      
  
    }).catch((e)=>{
    
     
    })
    }
  else{
    
    const motiff = {motif,nombrejours_ouvres,motifConge, motifmission,motifteletravail ,motifautorisation , motifdemanderh, motifpointage , nbjours_retire,motifdemijournne,justifie,congemaladie }
  
    fetch(url+"motif/" , 
    {
      method : "POST" , 
      headers : {
       "Content-Type" : "application/json" ,
       Authorization: token,
      },
      body : JSON.stringify(motiff)
    }).then(() =>{
    
  window.location.reload(false);
    

  }).catch((e)=>{

  })
  }
  
  }
return (
    <div>

    <div className="row">

    { absenceedit && <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajoutermotif">
Ajouter une motif
</button> }


<div className="modal fade" id="ajoutermotif"  role="dialog" aria-labelledby="#ajoutermotif" aria-hidden="true">
<div className="modal-dialog modal-dialog-centered" role="document">
<div className="modal-content">
<div className="modal-header">
  <h5 className="modal-title" id="exampleModalLabel">Ajouter une motif</h5>
  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<div className="modal-body">
<form>
<input className="form-control" placeholder="nom de motif" value={motif} name="motif"  onChange={(e) => setMotifName(e.target.value)} type="text"/>
<div className='row'>
  <div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} label='congé' value={motifConge} onChange={handleChangeMotifCongé} />
</div>

<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} label='mission' value={motifmission} onChange={handleChangeMotifMission} />
</div>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} label='téletravail' value={motifteletravail} onChange={handleChangeTeletravail} />

</div>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} label='Autorisation ' value={motifautorisation} onChange={handleChangeautorisation} />

</div>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} label='Demande RH ' value={motifdemanderh} onChange={handleChangedemanderh} />

</div>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} label='Pointage ' value={motifpointage} onChange={handleChangepointage} />

</div>
</div>
<div className='row pl-3'>

<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} label='demi journnée' value={motifdemijournne} onChange={handleChangemotifdemijournne} />
</div>

</div>
{ motifConge==true ?<><div className="form-group">
<label for="ouvres">Nombre de jours ouvrés</label>
  <input className="form-control" id="ouvres" placeholder="Nombre de jours ouvrés" type="number" step="1" value={nombrejours_ouvres} onChange={(e)=>{setnombrejours_ouvres(e.target.value)}} />
</div>
<div className="form-group">
<label for="ouvres">coefficient </label>
  <input className="form-control" id="ouvres" placeholder="Nombre de jours ouvrés" type="number" step="0.1" max ="1" value={nbjours_retire} onChange={(e)=>{setnbjours_retire(e.target.value)}} />
</div>

</>
:""}
{motifConge==true|| motifdemijournne==true || motifautorisation == true ?
<div className='row pl-3'>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} label='Payé' value={justifie} onChange={handleChangeJustifie} />
</div><div className='col-md-4'>


<FormControlLabel control={<Checkbox/>} label='Justifié' value={congemaladie} onChange={handleChangeMaladie} /></div></div>:""
}

<div className="modal-footer">
  <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
  <button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button>
</div>

</form>
</div>

</div>
</div>
</div>
</div>
</div>

)
 }
 export default AjouterMotif;