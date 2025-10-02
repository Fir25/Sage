import React, { useState,useRef } from 'react';

import useFetch from '../useFetch';





import ScrollContainer from 'react-indiana-drag-scroll'

import { useEffect } from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useReactToPrint } from "react-to-print";

import { MultiSelect } from '../MultiSelect';
import { useMemo } from 'react';

import $ from "jquery";


import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import JSZip from 'jszip';
import { Alert } from '@mui/material';
import frdatatable from '../../frdatatable.json'
import { useSelector } from 'react-redux';
window.JSZip = JSZip;
export const ComponentPointageToPrint = React.forwardRef((props, ref) => {
  const[alert,setAlert]=useState(false)
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
     var iddd = test['iddep'].join(",")
  
    var DRH=test['DRH']
    var admin=test['admin']

    
  }
  var iddep=iddd==""? undefined:iddd
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
    
    $('#rappoin').DataTable({
      
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

  const [date1, setDate1] = useState('')
  const [date2, setDate2] = useState('')


  const [dat, setData] = useState([])
  const [post,setPost]=useState(false)
  const[openn,setOpenn]=useState(false)
  const[loginemploye,setloginemploye]=useState(false)
  const handleToggle = () => {
   setOpenn(true)
  };


  function SelectPointage(date1,date2,e) {
    e.preventDefault();
    setAlert(false)
   if(loginemploye==false){ 

    arr.push(selectedd.map(x=>x.value))
    fetch(url + "rapportpointage/" + date1 + "/" + date2 + "/", {
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
      setOpenn(false)

      })
      .catch(err => {
       /** if ( err.response.status=== 401) {
          logoutfunction(err.response.status)
        } */
        setAlert(true)
       
      })
})
    
    
   
  
  
  }else{
  
    fetch(url+"rapportpointage/"+date1+"/"+date2+"/?id="+ iduserinfo  , {method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
     /** if ( result.status===401) {
        logoutfunction(result.status)
      } */
      result.json().then((resp) => {
        setPost(true)
      setData(resp)
      setOpenn(false)
   
      })

    })
      .catch(err => {
        /**if ( err.response.status=== 401) {
          logoutfunction(err.response.status)
        } */
        setAlert(true)
       
      })

    
   
  }
    



}
 


 


 const { data: data, isloading: zzsx, error: esse } =  useFetch(url+"Getarbobyids/?id="+iddep)
 const { data: dataadmin, isloading: aae, error: fv } = useFetch(url+"arbo/")
useEffect(()=>{
if(iddep!=undefined){

  setTreeData(data)
  

}else if (admin==true  ||DRH==true){
 
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
<h2 id="textcolor" >Importer Rapport de pointage</h2></div> 
        
        
         <div></div>

          <form>





          {loginemploye ? 
          <>
                    <div className="row pl-4 pr-4 pt-4">
            <div className="col-md-4">

              <div className="form-group">
                <label>Date début</label>
                <div className="input-group input-group-merge input-group-alternative">

                  <input className="form-control" placeholder="" value={date1} name="date_pointage1" onChange={(e) => setDate1(e.target.value)} type="date" />
                </div>
              </div>
            </div>
            <div className="col-md-4">

              <div className="form-group">
                <label>Date fin</label>
                <div className="input-group input-group-merge input-group-alternative">

                  <input className="form-control" placeholder="" value={date2} name="date_pointage" onChange={(e) => setDate2(e.target.value)} type="date" min={date1} />
                </div>
              </div>
            </div>
          </div>
          <div className="form-group pt-4" style={{ marginLeft: "45%", marginRight: "55%" }}>
            <a className="btn btn-primary" data-dismiss="modal" onClick={(e) => { SelectPointage(date1, date2, e); handleToggle() }}>Importer</a></div> 
          </>
          
         : <>
 <div className="row pl-4 pr-4 pt-4">
            <div className="col-md-3">

              <div className="form-group">
                <label>Date début</label>
                <div className="input-group input-group-merge input-group-alternative">

                  <input className="form-control" placeholder="" value={date1} name="date_pointage1" onChange={(e) => setDate1(e.target.value)} type="date" />
                </div>
              </div>
            </div>
            <div className="col-md-3">

              <div className="form-group">
                <label>Date fin</label>
                <div className="input-group input-group-merge input-group-alternative">

                  <input className="form-control" placeholder="" value={date2} name="date_pointage" onChange={(e) => setDate2(e.target.value)} type="date" min={date1} />
                </div>
              </div>
            </div>
            <div className="col-md-3">
                <label>Statut </label>
                <MultiSelect options={activities} value={activite} onChange={setActivite} />


              </div>
              <div className='col-md-3'>
       
<label>Département</label>
       {dropdown}
       
       
       
       
                     </div>
              { <div className="col-md-3">
                <label>Ligne </label>
                <MultiSelect  options={ligness}  value={ligne}  onChange={setLigne}  />

              </div> }
              { <div className="col-md-3">
                <label>Superviseur </label>
                <MultiSelect  options={superviseurs}  value={superviseur}  onChange={setSuperviseur}  />

              </div> }
              

          </div>


            <div className="row  pt-4 pl-4 pr-4">

              <div className='col-md-3'>
                <label>Employés</label>
                <MultiSelect options={uss} value={selectedd} onChange={setSelectedd} />
              </div>

            </div>

            <div className="form-group pt-4" style={{ marginLeft: "45%", marginRight: "55%" }}>
              <a className="btn btn-primary"  data-dismiss="modal" onClick={(e) => { SelectPointage(date1, date2, e); handleToggle() }}>Importer</a></div>
          </>}

<div style={{width:"50%"}} >
          {alert&&
     <Alert variant="filled" severity="error">
      Il faut sélectionner au moins un employé ,une date de début et une date de fin!</Alert>}</div>
        </form>
 
        
 
 
                
              
                <div>



                </div>
              
                </div>
 
              {openn ? <Backdrop  open={openn} >
  <CircularProgress  color="primary" style={{position:"absolute",bottom:"50px"}} />
</Backdrop>: 

dat.length==0?"":
<div className="table-responsive">
                          <ScrollContainer className="scroll-container">

                         
                          <div className='card'>
                          {/**<div className='card-header' id="colorcardheader">
                                <h3 style={{color:"white"}}>Rapport de pointages de {date1} à {date2}</h3>
                                </div> */}
                              <hr/>
                          <div className="table-responsive" >
                          <table id="rappoin" className="display">
        <thead>
        <tr>
                   
                   <th>Nom et prénom</th>
                   <th>Matricule</th>
                   <th>Date Pointage</th>
                   <th>Heure Entrée</th>
                   <th>Heure Sortie</th>
                    <th>Nom de pointeuse</th> 
                    <th>Département</th>
                    <th>Ligne_de_production</th>
                    <th>Superviseur</th>
          
                 </tr>
        </thead>
    
      
 
 <tbody>
        {dat.map(pointage=>

        <tr>
                <td>{pointage.user_name + " "+pointage.last_name}</td>
                <td>{pointage.matricule}</td>
                <td>{pointage.date_pointage}</td>
                <td>{pointage.Entree}</td>
                <td>{pointage.Sortie}</td>
                <td>
    {pointage.nom_pointeuse_entree || ""} 
    {pointage.nom_pointeuse_sortie ? " / " + pointage.nom_pointeuse_sortie : ""}
  </td>
            <td>{pointage.departement_name}</td>
                <td>{pointage.ligne_de_production}</td>
                <td>{pointage.superviseur}</td>
           </tr>
   )}
         </tbody> 
        
    

    </table></div>
    

    </div>
      
       </ScrollContainer>
     </div> }
    
           
{/**                {post? 
             <div className="table-responsive">
                          <ScrollContainer className="scroll-container">
             <table className="table align-items-center table-flush" id="pointagetoexcel"  ref={ref} >
               <thead className="thead-light">
                 <tr>
                   
                   <th scope="col">Nom et prénom</th>
                   <th scope="col">Matricule</th>
                   <th scope="col">Date Pointage</th>
                   <th scope="col">Heure</th>
                   <th scope="col">Nom de pointeuse</th>
                   <th scope="col">Planning</th>
                 </tr>
               </thead>
               <tbody>
               {dat.filter((pointage)=>{
                  const name=pointage.user_name||''
                  const mat=pointage.mat||''
  if (serarchItem==""){
   return pointage
  }
  else if (name.toLowerCase().includes(serarchItem.toLowerCase()) || mat.toLowerCase().includes(serarchItem.toLowerCase())) {
 
    return pointage
  }
}).map((pointage,key)=>{
  return (
  <>  
    <tr key={pointage.id}>
                <td>{pointage.user_name + " "+pointage.last_name}</td>
                <td>{pointage.matricule}</td>
                <td>{pointage.date_pointage}</td>
                <td>{pointage.heure}</td>
                <td>{pointage.nom_pointeuse}</td>
                <td>{pointage.planning}</td>
           </tr>
 </>
  )
})
       }          </tbody>
       </table>
       </ScrollContainer>
     </div> :<Backdrop  open={openn}>
  <CircularProgress color="inherit" />
</Backdrop>} */}


          </div></div></div></div></div>
     );
    });
const RapportPointage = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
 
     
{/**      <button className="btn" style={{width:"80px",marginLeft: '0.8rem',marginTop:"0.4rem",width:"80px",marginLeft: '0.8rem',marginTop:"0.4rem",backgroundColor:'#5ac2df'}} onClick={handlePrint}>PDF</button>
 */}
    <ComponentPointageToPrint ref={componentRef} />
 
    </div>

  );
};
export default RapportPointage;