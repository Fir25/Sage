
import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from "@material-ui/core/Checkbox";
import Mouchard from '../Mouchardd/Mouchard';
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import React, { useState,useRef, useMemo } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll'
import { useEffect } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useReactToPrint } from "react-to-print";
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import $ from "jquery";
import { MultiSelect } from '../MultiSelect';
import frdatatable from '../../frdatatable.json'

function AjouterAbsence() {
    //sélectionner les données d'utilisateur connecté à l'aide de redux
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      var iduserr=test['id']
      var absenceedit = test['absenceedit']
      var absencedelete = test['absencedelete']
    }
    const [employes, setEmployes] = useState([]); // Employés disponibles
const [selectedEmployes, setSelectedEmployes] = useState([]); 
    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
    const url=process.env.React_App_URL;//url from file .env
    // const { data: users = [] } = useFetch(url+"userselect/")//liste des utilisateurs
    const { data: motifs = []} = useFetch(url+"motif/")
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
    e.preventDefault();
    setAlert(false);

    // Vérifier qu'au moins un employé est sélectionné
    if (selectedEmployes.length === 0) {
        setAlert(true);
        return;
    }

    console.log("Employés sélectionnés:", selectedEmployes);

    // Extraire uniquement les IDs des employés
    const employesIds = selectedEmployes.map(e => e.value); 

    const absence = { 
        employes: employesIds,  // Envoyer uniquement les IDs
        raison, 
        datedebut, 
        datefin, 
        motif_abs, 
        justifie, 
        heure_debut, 
        heure_fin 
    };

    fetch(url + "Absencecreate/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token, // Sécurité
        },
        body: JSON.stringify(absence)
    })
    .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else window.location.reload(false);
        
        // Enregistrer dans Mouchard
        Mouchard("-", "ajouté", selectedEmployes.map(e => e.label).join(", "), iduserr, 
            `Ajout Absence du ${datedebut} au ${datefin}`);
    })
    .catch((e) => {
        setAlert(true);
        console.error("Erreur lors de l'ajout de l'absence :", e);
    });
};
    const[loginemploye,setloginemploye]=useState(false)
    const [activite, setActivite] = useState([])
    const activities = [
      { "label": "activité", "value": "1" },
      { "label": "Suspendu", "value": "0" }
    ]
    const [uss,setuss]=useState([])
   const [ligne, setLigne] = useState([]);
   const [superviseur, setSuperviseur] = useState([]);
  const [listeligne, setListeLigne] = useState([]);
  const { data: ligness = [], isloading: loadingLigne, error: errorLigne } = useFetch(url + "listligne");
  const { data: superviseurs = [], isloading: loadingSuperviseur, error: errorSuperviseur } = useFetch(url + "listsuperviseur");
  const users=[]
  const lg=[]
  const ac = []
  const si = []
  const sup = []
  const[uu,setU]=useState([])

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [site, setSite] = useState([])
  useEffect(() => {
    ac.push(activite.map(x => x.value))
    si.push(site.map(y => y.value))
    console.log(ligne)
    lg.push(ligne.map(l => l.value))
    sup.push(superviseur.map(s=>s.value))
    fetch(url+"userofdepartements/?id=" + uu+ "&idactivite=" + ac+"&idligne="+lg +"&idsuperviseur="+sup, {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}) .then((result) => result.json())
    .then((resp) => {
        const formattedEmployes = resp.map(x => ({ label: x.label, value: x.value }));
        setEmployes(formattedEmployes);
    })
    .catch(err => {
        console.error("Erreur lors de la récupération des employés", err);
    });
 
  }, [activite, site,ligne,uu,superviseur , treeData])
  const [optionrap,setoptionsrap]=useState([])
  
 
   
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    var iddd = test['iddep'].join(",")
  
    var DRH=test['DRH']
    var admin=test['admin']

    
  }
  var iddep=iddd==""? undefined:iddd
   const [selectedd, setSelectedd] = useState([]);
   const arr=[]
   const { data: data, isloading: zzsx, error: esse } =useFetch(url+"Getarbobyids/?id="+iddep)
   const { data: dataadmin, isloading: aae, error: fv } = useFetch(url+"arbo/")
   useEffect(()=>{
    if(iddep!=undefined){
    console.log(data)
      setTreeData(data)
      
    
    }else if (admin==true  || DRH==true){
     
      setTreeData(dataadmin)
     
    }else{
      setloginemploye(true)
      setTreeData([])   
    }
    
    
    },[treeData,data,dataadmin])
   const [treeData, setTreeData] = React.useState([]);
   const handleChange = (selected, allchecked) =>{
    let results = allchecked.map(({value})=>value);
  
    setU(results)
  }
  
   const dropdown = useMemo(()=>{
    return(
  
          <DropdownTreeSelect
                data={treeData}
                onChange={(selected, allchecked) =>{handleChange(selected, allchecked)}}
                texts={{ placeholder: "Département" }}
                className="mdl-demo" 
                
            />
            
     )}, [treeData]);

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
                                    <div className='col-md-9'>

<label>Département</label>

 
{dropdown}


</div>
</div>
<div className='row'>
<div className="col-md-9">
                <label>Statut </label>
               <MultiSelect options={activities} value={activite} onChange={setActivite} />


              </div>
              </div>
              <div className='row'>
              { <div className="col-md-9">
                <label>Ligne </label>
                <MultiSelect  options={ligness}  value={ligne}  onChange={setLigne}  />

              </div> }
              </div> 
              <div className='row'>
              { <div className="col-md-9">
                <label>Superviseur </label>
                <MultiSelect  options={superviseurs}  value={superviseur}  onChange={setSuperviseur}  />

              </div> }
              </div> 


     
              <div className='row'>
    <div className='col-md-9'>
        <label>Employés</label>
        <MultiSelect 
            options={employes} 
            value={selectedEmployes} 
            onChange={  setSelectedEmployes} 
        />   
    </div>
</div>
            <div className='row'>
                                        <div className='col-md-9'>
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