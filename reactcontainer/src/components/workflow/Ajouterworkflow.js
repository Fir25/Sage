import React, { useState ,useEffect } from 'react'
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Mouchard from "../Mouchardd/Mouchard"
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'react-redux';
import { MultiSelect } from '../MultiSelect';


import Multiselect from 'react-multiselect-checkbox';

import { Alert } from '@mui/material';









import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'







import { useMemo } from 'react';

function Ajouterworkflow() {
  const url=process.env.React_App_URL;
  
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    
  }
  const [arborescence, setActualSelected] = React.useState([]);


  const [selectedd, setSelectedd] = useState([])

  const [treeData, setTreeData] = React.useState([]);

  useEffect(()=>{
    setTreeData(data)
  })
  const handleChangearbo = (selected, allchecked) =>{
    let results = allchecked.map(({value})=>parseInt(value));
   
    setActualSelected(results)
  }
  
  
  
  
   const dropdown = useMemo(()=>{
    return(
  
          <DropdownTreeSelect
                data={treeData}
                onChange={(selected, allchecked) =>{handleChangearbo(selected, allchecked)}}
                texts={{ placeholder: "Département" }}
                className="mdl-demo" 
                mode="radioSelect"
            />
     )}, [treeData]);
  const [valideur1,setvaliduer1] =useState('');
  const [valideur2,setvalideur2] =useState('');
  const [valideur3,setvalideur3] =useState('');
  const [valideur4,setvalideur4] =useState('');

  const { data: motifs = [] } = useFetch(url+"motif/")
  const dev = motifs.map(element => ({
    value: element.id, // Replace 'id' with 'value'
    label: element.motif, // Replace 'motif' with 'label'
  }));  const { data: users = [] } = useFetch(url+"userselect/")
  const { data: data, isloading: zzsx, error: esse } = useFetch(url+"arbo/")


  const [motif_abs, setType] = useState([]);
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
const handleMotifChange = (selected) => {
  setType(selected);
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

formData.append('employes',iduserinfo)
formData.append('nbjoursmaladiecoupe',nbjoursmaladiecoupe)
formData.append('matindebut',matindebut)
formData.append('matinfin',matinfin)
formData.append('nbjours',nbjours)
formData.append('motif_abs',motif_abs)
formData.append('datedebut',datedebut)
formData.append('datefin',datefin)
formData.append('contact',contact)
formData.append('adresse',adresse)
formData.append('validationrh',validationrh)
formData.append('validation',validation)
formData.append('validationrh2',validationrh2)
formData.append('datetimereprise',datetimereprise)
formData.append('personneinterimaire',personneinterimaire)
formData.append('commentaire',commentaire)
formData.append('heure_debut',heure_debut)
formData.append('heure_fin',heure_fin)

//const conge = {nbjoursmaladiecoupe,matindebut,matinfin,nbjours, motif_abs, datedebut, datefin, contact, adresse, employes, validation,datetimereprise,personneinterimaire,commentaire,heure_debut,heure_fin}
  

if ( selectedd.length==0 ){
   setCheckAlert(true)
      
    }

    else{

      setDisable(true)
    fetch(url+"demendeconges/" + iduserinfo +"/"+"congé/"+datedebut+"/"+datefin+"/"+soldenouveau+"/"+nouveausoldemaladie,
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
         Mouchard("-","encours",employes,iduserinfo,"Demande  de congé de " +datedebut+"au "+datefin)
      
     window.location.reload(false);

    
    }
    }).catch((e) => {
    /**  if ( e.response.status=== 401) {
        logoutfunction(e.response.status)
      } */
      setAlertError(true)
     
      setDisable(false)
    })
      
    
  }}

  return (
    <div>
    
        <div className="row">
        
                  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpointage">
                    Ajouter un workflow
                  </button>


                  <div className="modal fade" id="ajouterpointage" role="dialog" aria-labelledby="ajouterpointage" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">       Créer un workflow </h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">



                          <form>
                            <div className='row'>
                          
                            <div className="col-md">
     
   
                            <label >Motifs</label>
              <MultiSelect options={dev} value={selectedd} onChange={setSelectedd} />  
    </div>
                                 
                                  <div className='col-md-12 pt-3 '>
                                        <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.label +"  " }

   renderInput={(params) => (
     <TextField {...params} label="Valideur 1" variant="outlined" />
   )}
   onChange={(event, value) =>{if (value && value.value){setvaliduer1(value.value)}}} 

 /> 
                                           

                                        </div>
                                        <div className='col-md-12 pt-3 '>
                                        <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.label +"  "}

   renderInput={(params) => (
     <TextField {...params} label="Valideur 2" variant="outlined" />
   )}
   onChange={(event, value) =>{if (value && value.value){setvalideur2(value.value)}}} 

 /> 
                                           

                                        </div>
                                        <div className='col-md-12 pt-3 '>
                                        <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.label +"  " }

   renderInput={(params) => (
     <TextField {...params} label="Valideur 3" variant="outlined" />
   )}
   onChange={(event, value) =>{if (value && value.value){setvalideur3(value.value)}}} 

 /> 
                                           

                                        </div>
                                        <div className='col-md-12 pt-3 '>
                                        <Autocomplete
   
   options={users}
   getOptionLabel={(option) => option.label +"  "}

   renderInput={(params) => (
     <TextField {...params} label="Valideur 4" variant="outlined" />
   )}
   onChange={(event, value) =>{if (value && value.value){setvalideur4(value.value)}}} 

 /> 
                                           

                                        </div>
                                        <div className="col-md-12 pt-3">
                 {dropdown}
                
                 </div>
                            </div>
                         
              <br/>
                         

              


<br/>

                            <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} disabled={disabl? true:false}>Valider</button></div>

                            {checkalert &&
                                      <Alert variant="filled" severity="error">
                                   motif  est vide ! 
                                    </Alert> }
                                    
                                  
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

              </div>

  )
}
export default Ajouterworkflow;