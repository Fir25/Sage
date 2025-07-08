import React, { useState,useRef, useMemo } from 'react';

import useFetch from '../useFetch';



import ScrollContainer from 'react-indiana-drag-scroll'

import { useEffect } from 'react';


import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useReactToPrint } from "react-to-print";



import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import $ from "jquery";
import { MultiSelect } from '../MultiSelect';
import { Alert } from '@mui/material';
import frdatatable from '../../frdatatable.json'
import { useSelector } from 'react-redux';

export const ComponentJournalierToPrint = React.forwardRef((props, ref) => {
  const[alert,setAlert]=useState(false)
  const url=process.env.React_App_URL;
  const [isValid, setIsValid] = useState('');
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    var iddd = test['iddep'].join(",")
  
    var DRH=test['DRH']
    var admin=test['admin']

    
  }
  var iddep=iddd==""? undefined:iddd
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const [uss,setuss]=useState([])
   const [ligne, setLigne] = useState([]);
   const [superviseur, setSuperviseur] = useState([]);
  const [listeligne, setListeLigne] = useState([]);
  const { data: ligness = [], isloading: loadingLigne, error: errorLigne } = useFetch(url + "listligne");
  const { data: superviseurs = [], isloading: loadingSuperviseur, error: errorSuperviseur } = useFetch(url + "listsuperviseur");
//  useEffect(() => {
  
//     setListeLigne(lignes.map(l => ({ label: l.nom, value: l.id }))); // Adapter selon ton API
 
//  }, [lignes]);
  const users=[]
  const lg=[]
  const ac = []
  const si = []
  const sup = []
  const[uu,setU]=useState([])

  const [selectedDepartments, setSelectedDepartments] = useState([]);

  // Lorsque les départements sont sélectionnés, nous les mettons à jour dans l'état
  const handleDepartmentChange = (selectedValues) => {
    setSelectedDepartments(selectedValues);  // Cela met à jour la sélection multiple des départements
  };
  
  const [activite, setActivite] = useState([])
  const activities = [
    { "label": "activité", "value": "1" },
    { "label": "Suspendu", "value": "0" }
  ]
  
  const [site, setSite] = useState([])
  const { data: sites = [], isloading, error } = useFetch(url+"ListSite_ForSelect/")
 const optionsRapport=[
  { "label": " matricule", "value": "matricule" },
  { "label": "user_name", "value": "user_name" },
  { "label": "last_name", "value": "last_name" },
  { "label": "date_pointage", "value": "date_pointage" },
  { "label": "nomhoraire", "value": "nomhoraire" },
  { "label": "debuthoraire", "value": "debuthoraire" },
  { "label": "finhoraire", "value": "finhoraire" },
  { "label": "Entree", "value": "Entree" },
  { "label": "Sortie", "value": "Sortie" },
  { "label": "refpointeuse", "value": "refpointeuse" },
  { "label": "efpointeuse", "value": "efpointeuse" },
  { "label": "jour_travaille", "value": "jour_travaille" },
  { "label": "jour_nrmlmn_travaille", "value": "jour_nrmlmn_travaille" },
  { "label": "retard", "value": "retard" },
  { "label": "depart_anticipe", "value": "depart_anticipe" },
  { "label": "Absent", "value": "Absent" },
  { "label": "heuresup", "value": "heuresup" },
  { "label": "heuresupvalide", "value": "heuresupvalide" },
  { "label": "presenceplann", "value": "presenceplann" },
  { "label": "motif", "value": "motif" },
  { "label": "departement_name", "value": "departement_name" },
  { "label": "presencenormal", "value": "presencenormal" },
  { "label": "ligne_de_production", "value": "ligne_de_production" },
  { "label": "superviseur", "value": "superviseur" },

    // {"label":"Matricule","value":"Matricule"},
    // {"label":"Autorisation","value":"Autorisation"},
    // {"label":"Nom Employé","value":"Nom Employé"},
    // {"label":"Date","value":"Date"},
    // {"label":"Déficit","value":"Déficit"},
    // {"label":"h.Travail","value":"h.Travail"},
    // {"label":"h.Théorique","value":"h.Théorique"},
    // {"label":"Pointages","value":"Pointages"},
    // {"label":"Retard d'entrée","value":"Retard d'entrée"},
    // {"label":"Retard de midi","value":"Retard de midi"},
    // {"label":"Départ anticipé","value":"Départ anticipé"},

    // {"label":"Mission","value":"Mission"},
    // {"label":"Congé","value":"Congé"},
    // {"label":"Motif","value":"Motif"},
    
    // {"label":"Travail brute","value":"Travail brute"},
    // {"label":"Département","value":"Département"},
    // {"label": "Horaire", "value": "Horaire"},
    // {"label": "Réf pointeuse", "value": "Réf pointeuse"}
  ];

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
    }}).then((result) => {
     
/** if ( result.status===401) {
        logoutfunction(result.status)
      } */
      result.json().then((resp) => {
    
      resp.map(x=>users.push({"label":x.label,"value":x.value}))
      setuss(resp)
      })
    
    })        .catch(err => {
     /** if ( err.response.status=== 401) {
        logoutfunction(err.response.status)
      } */
     
    })

  }, [activite, site,ligne,superviseur ,uu])


  
  const [optionrap,setoptionsrap]=useState([])
 

  

  const [selectedd, setSelectedd] = useState([]);
  const arr=[]
  $(document).ready(function () {
     
    $('#rapjour').DataTable({
      
      language:frdatatable,
      "dom": 'Blfrtip',
      buttons: [
        {extend:'excel',
      className:'btn btn-buttondatatable'},
      {extend:'copy',
      className:'btn btn-buttondatatable'},
      {extend: 'pdf',
      orientation: 'landscape',
      pageSize: 'LEGAL',
      className:'btn btn-buttondatatable',
     },
      {extend:'csv',
      className:'btn btn-buttondatatable'},
      {extend:'print',
      className:'btn btn-buttondatatable'},      
      

       
      ]
      ,"bDestroy": true
     } )
  
});
 
 // const[serarchItem,setSearchItem]=useState('')
 
  const [date1, setDate1] = useState('')
  const [date2, setDate2] = useState('')
  

  const [dat, setData] = useState([])
  const [post,setPost]=useState(false)
  const[openn,setOpenn]=useState(false)
  const[loginemploye,setloginemploye]=useState(false)
  const handleToggle = () => {
   setOpenn(true)
   
  };

  const [optionnss,setOptionsss]=useState([])
  function SelectJournalier(e) {

    e.preventDefault();
    setAlert(false)

    setIsValid(optionrap.length==0 ? 'false' : 'true');
    if(loginemploye==false){ 
      
      arr.push(selectedd.map(x=>x.value))
  
      fetch(url + "rapportjour/" + date1 + "/" + date2 + "/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ ids: arr }), // Envoie les IDs dans le body
      }).then((result) => {
        result.json().then((resp) => {
  
          setPost(true)
          setData(resp)
          setOptionsss(optionrap)
          setOpenn(false)
    
    
        } )
          .catch(err => {
    
    /**        if ( err.response.status=== 401) {
              logoutfunction(err.response.status)
            } */
          setAlert(true)
          })
      })
     
    
    
    }
    else{
      
      fetch(url+"rapportjour/" + date1 + "/" + date2 + "/?id=" + iduserinfo, {method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      }}).then((result) => {
        result.json().then((resp) => {
  
          setPost(true)
          setData(resp)
          setOptionsss(optionrap)
          setOpenn(false)
  
        })
          .catch(err => {
   
           /** if ( err.response.status=== 401) {
              logoutfunction(err.response.status)
            } */
            setAlert(true)
           
          })
      })
    
    }
      
  

  }
 
 //departements tree

 
 

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

<div className="container-fluid mt-5">
    <div className="row">
      <div className="col">
      <div className="card shadow">
    <div className="card">

    <div className="card-header" id="colorcardheader">
<h2 id="textcolor" >Importer Rapport Journalier</h2></div>                        
          <form>
          {loginemploye ? 
          <>          <div className="row pl-4 pr-4 pt-4">
          <div className="col-md-4 ">

            <div className="form-group">
            <label>Date début </label>

              <div className="input-group input-group-merge input-group-alternative">

                <input className="form-control" placeholder="" value={date1} name="date_pointage1" onChange={(e) => setDate1(e.target.value)} type="date" />
              </div>
            </div>
          </div>
          <div className="col-md-4 ">

            <div className="form-group">
            <label> Date fin</label>
              <div className="input-group input-group-merge input-group-alternative">

                <input className="form-control" placeholder="" value={date2} name="date_pointage" onChange={(e) => setDate2(e.target.value)} type="date" min={date1} />
              </div>
            </div>
          </div>
          <div className='col-md-4'>
        

            <label>Options</label>
              <MultiSelect options={optionsRapport} value={optionrap} onChange={setoptionsrap} />

              {isValid=='false' ? <h5 style={{color:'red'}}>Vous devez choisir une valeur</h5>:""}
            </div>
          </div>
          <div className="form-group pt-4" style={{ marginLeft: "45%", marginRight: "55%" }}>
            <a className="btn btn-primary" data-dismiss="modal" onClick={(e) => { SelectJournalier( e); handleToggle() }} disabled={!isValid}>Importer</a></div> 
          
          </>
          
     
            
            
            : <>

<div className="row pl-4 pr-4 pt-4">
          <div className="col-md-3">

            <div className="form-group">
            <label>Date début </label>
              <div className="input-group input-group-merge input-group-alternative">

                <input className="form-control" placeholder="" value={date1} name="date_pointage1" onChange={(e) => setDate1(e.target.value)} type="date" />
              </div>
            </div>
          </div>
          <div className="col-md-3">

            <div className="form-group">
              <label> Date fin</label>
              <div className="input-group input-group-merge input-group-alternative">

                <input className="form-control" placeholder="" value={date2} name="date_pointage" onChange={(e) => setDate2(e.target.value)} type="date" min={date1} />
              </div>
            </div>
          </div>
          <div className='col-md-3'>
        

            <label>Options</label>
              <MultiSelect options={optionsRapport} value={optionrap} onChange={setoptionsrap} />

              {isValid=='false' ? <h5 style={{color:'red'}}>Vous devez choisir une valeur</h5>:""}
            </div>
            <div className='col-md-3'>

     <label>Département</label>
    
      
{dropdown}


  </div>
           

          </div>

            <div className='row pl-4 pr-4'>



            <div className="col-md-3">
                <label>Statut </label>
               <MultiSelect options={activities} value={activite} onChange={setActivite} />


              </div>
              { <div className="col-md-3">
                <label>Ligne </label>
                <MultiSelect  options={ligness}  value={ligne}  onChange={setLigne}  />

              </div> }
              { <div className="col-md-3">
                <label>Superviseur </label>
                <MultiSelect  options={superviseurs}  value={superviseur}  onChange={setSuperviseur}  />

              </div> }



     


              <div className='col-md-3'>
                <label>Employés</label>
       

              <MultiSelect options={uss} value={selectedd} onChange={setSelectedd} />   
              </div>
            

            </div>
        
  
 

            <div className="form-group pt-4" style={{ marginLeft: "45%", marginRight: "55%" }}>
              <a className="btn btn-primary"  data-dismiss="modal" onClick={(e) => { SelectJournalier( e); handleToggle() }} disabled={!isValid}>Importer</a></div>
          </>}
          <div style={{width:"50%"}} >
          {alert&&
     <Alert variant="filled" severity="error">
      Il faut sélectionner au moins un employé ,une date de début et une date de fin!</Alert>}</div>
        </form>
   
                  <div >

             
                  </div>
            <div>     


            </div>
               
              
             
              
                </div>
         
    
                </div></div></div></div>
        
             
     <br/><br/>
     <div className="container-fluid mt-5">
   
    <div className="row">
      <div className="col">
      <div className="card shadow">
      {openn?  
      <Backdrop  open={openn}>
<CircularProgress color="primary" style={{position:"absolute",bottom:"50px"}}  />
</Backdrop>:
dat.length==0?"":
<div className='card'>

   
    <hr/>
<div className="table-responsive" >
              <ScrollContainer className="scroll-container">
              <div style={{ overflowX: "auto" }}>
              <table  id="rapjour" ref={ref}  >
                  <thead className="thead-light">
                  <tr>
  {/* Matricule */}
  {optionnss.find(e => e.value.toString() === "matricule") ? <th>Mat</th> : <th></th>}
  {/* Prénom */}
  {optionnss.find(e => e.value.toString() === "user_name") ? <th title="Prénom">Prénom</th> : <th></th>}
  {/* Nom */}
  {optionnss.find(e => e.value.toString() === "last_name") ? <th title="Nom">Nom</th> : <th></th>}
  {/* Date de Pointage */}
  {optionnss.find(e => e.value.toString() === "date_pointage") ? <th title="Date de Pointage">Date</th> : <th></th>}
  {/* Horaire */}
  {optionnss.find(e => e.value.toString() === "nomhoraire") ? <th title="Horaire">Horaire</th> : <th></th>}
  {/* Début Horaire */}
  {optionnss.find(e => e.value.toString() === "debuthoraire") ? <th>Début Horaire</th> : <th></th>}
  {/* Fin Horaire */}
  {optionnss.find(e => e.value.toString() === "finhoraire") ? <th title="Fin Horaire">Fin Horaire</th> : <th></th>}
  {/* Heure d'Entrée */}
  {optionnss.find(e => e.value.toString() === "Entree") ? <th title="Entrée">Entrée</th> : <th></th>}
  {/* Heure de Sortie */}
  {optionnss.find(e => e.value.toString() === "Sortie") ? <th title="Sortie">Sortie</th> : <th></th>}
  {/* Référence Pointeuse */}
  {optionnss.find(e => e.value.toString() === "refpointeuse","efpointeuse" ) ? <th title="Réf Pointeuse">Réf Pointeuse</th> : <th></th>}
  {/* Jour Travaillé */}
  {/* {optionnss.find(e => e.value.toString() === "jour_travaille") ? <th title="Jour Travaillé">Jour Travaillé</th> : <th></th>}
  {optionnss.find(e => e.value.toString() === "jour_nrmlmn_travaille") ? <th title="Jour Normalement Travaillé">Jour Normalement Travaillé</th> : <th></th>} */}
  {/* Retard */}
  {optionnss.find(e => e.value.toString() === "retard") ? <th title="Retard">Retard</th> : <th></th>}
  {/* Départ Anticipé */}
  {optionnss.find(e => e.value.toString() === "Départ anticipé") ? <th title="Départ Anticipé">Départ Anticipé</th> : <th></th>}
  {/* Absentéisme */}
  {optionnss.find(e => e.value.toString() === "Absent") ? <th title="Absent">Absent</th> : <th></th>}
  {/* Heures Supplémentaires */}
  {optionnss.find(e => e.value.toString() === "heuresup") ? <th title="Heures Supplémentaires">Heures Supplémentaires</th> : <th></th>}
  {}
  {optionnss.find(e => e.value.toString() === "heuresupvalide") ? <th title="Heures Supplémentaires Validés">Heures Supplémentaires Validés</th> : <th></th>}
  {/* Présence Planifiée */}
  {optionnss.find(e => e.value.toString() === "presenceplann") ? <th title="Présence Planifiée">Présence Planifiée</th> : <th></th>}
  {/* Motif */}
  {optionnss.find(e => e.value.toString() === "motif") ? <th title="Motif">Motif</th> : <th></th>}
  {/* Département */}
  {optionnss.find(e => e.value.toString() === "departement_name") ? <th title="Département">Département</th> : <th></th>}
  {optionnss.find(e => e.value.toString() === "ligne_de_production") ? <th title="ligne_de_production">Ligne</th> : <th></th>}
  {optionnss.find(e => e.value.toString() === "superviseur") ? <th title="superviseur">Superviseur</th> : <th></th>}
  {/* Présence Normale */}
  {optionnss.find(e => e.value.toString() === "presencenormal") ? <th title="Présence Normale">Présence Normale</th> : <th></th>}
</tr>
                  </thead>       
                  <tbody>
                    
                  {dat.map(jour=>
                    
  <>  
 
  <tr key={jour.id}>
      {/* Matricule */}
    {optionnss.find(e => e.value.toString() === "matricule") ? <td>{jour.matricule}</td> : <td></td>}
    {/* Prénom */}
    {optionnss.find(e => e.value.toString() === "user_name") ? <td>{jour.user_name}</td> : <td></td>}
    {/* Nom */}
    {optionnss.find(e => e.value.toString() === "last_name") ? <td>{jour.last_name}</td> : <td></td>}
    {/* Date de Pointage */}
    {optionnss.find(e => e.value.toString() === "date_pointage") ? <td>{jour.date_pointage}</td> : <td></td>}
    {/* Horaire */}
    {optionnss.find(e => e.value.toString() === "nomhoraire") ? <td>{jour.nomhoraire}</td> : <td></td>}
    {/* Début Horaire */}
    {optionnss.find(e => e.value.toString() === "debuthoraire") ? <td>{jour.debuthoraire}</td> : <td></td>}
    {/* Fin Horaire */}
    {optionnss.find(e => e.value.toString() === "finhoraire") ? <td>{jour.finhoraire}</td> : <td></td>}
    {/* Heure d'Entrée */}
    {optionnss.find(e => e.value.toString() === "Entree") ? <td>{jour.Entree}</td> : <td></td>}
    {/* Heure de Sortie */}
    {optionnss.find(e => e.value.toString() === "Sortie") ? <td>{jour.Sortie}</td> : <td></td>}
    {/* Référence Pointeuse */}
    {optionnss.find(e => e.value.toString() === "refpointeuse","efpointeuse") ? <td>{jour.refpointeuse || ""} 
    {jour. efpointeuse ? " / " + jour. efpointeuse  : ""}</td> : <td></td>}
    {/* Jour Travaillé */}
    {/* {optionnss.find(e => e.value.toString() === "jour_travaille") ? <td>{jour.jour_travaille}</td> : <td></td>}
    {optionnss.find(e => e.value.toString() === " jour_nrmlmn_travaille") ? <td>{jour. jour_nrmlmn_travaille}</td> : <td></td>} */}
    {/* Retard */}
    {optionnss.find(e => e.value.toString() === "retard") ? <td>{jour.retard}</td> : <td></td>}
    {/* Départ Anticipé */}
    {optionnss.find(e => e.value.toString() === "Départ anticipé") ? <td>{jour.depart_anticipe}</td> : <td></td>}
    {/* Absentéisme */}
    {optionnss.find(e => e.value.toString() === "Absent") ? <td>{jour.Absent}</td> : <td></td>}
    {/* Heures Supplémentaires */}
    {optionnss.find(e => e.value.toString() === "heuresup") ? <td>{jour.heuresup}</td> : <td></td>}
    {optionnss.find(e => e.value.toString() === "heuresupvalide") ? <td>{jour.heuresupvalide}</td> : <td></td>}
    {/* Présence Planifiée */}
    {optionnss.find(e => e.value.toString() === "presenceplann") ? <td>{jour.presenceplann}</td> : <td></td>}
    {/* Motif */}
    {optionnss.find(e => e.value.toString() === "motif") ? <td>{jour.motif}</td> : <td></td>}
    {/* Département */}
    {optionnss.find(e => e.value.toString() === "departement_name") ? <td>{jour.departement_name}</td> : <td></td>}
    {optionnss.find(e => e.value.toString() === "ligne_de_production") ? <td>{jour.ligne_de_production}</td> : <td></td>}
    {optionnss.find(e => e.value.toString() === "superviseur") ? <td>{jour.superviseur}</td> : <td></td>}
    {/* Présence Normale */}
    {optionnss.find(e => e.value.toString() === "presencenormal") ? <td>{jour.presencenormal}</td> : <td></td>}
  </tr>

 </>
  )
}
       
              


                  </tbody>
           
     
                 
                </table>
      </div>
                </ScrollContainer>
              </div>  

</div>

 }

</div></div></div></div>
 </div> 
     );
    });
const RappportJournalier = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
            

{/**      <button className='btn'  style={{width:"80px",marginLeft: '0.8rem',marginTop:"0.4rem",backgroundColor:'#5ac2df'}} onClick={handlePrint}>PDF</button>
 */}
    <ComponentJournalierToPrint ref={componentRef} />
 
    </div>
  
  );
};
export default RappportJournalier;

