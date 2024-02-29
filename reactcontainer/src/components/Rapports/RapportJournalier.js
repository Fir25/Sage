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
  const users=[]

  const[uu,setU]=useState([])


  
  const [activite, setActivite] = useState([])
  const activities = [
    { "label": "activité", "value": "1" },
    { "label": "Suspendu", "value": "0" }
  ]
  
  const [site, setSite] = useState([])
  const { data: sites = [], isloading, error } = useFetch(url+"ListSite_ForSelect/")
 const optionsRapport=[
 
    {"label":"Matricule","value":"Matricule"},
    {"label":"Autorisation","value":"Autorisation"},
    {"label":"Nom Employé","value":"Nom Employé"},
    {"label":"Date","value":"Date"},
    {"label":"Déficit","value":"Déficit"},
    {"label":"h.Travail","value":"h.Travail"},
    {"label":"h.Théorique","value":"h.Théorique"},
    {"label":"Pointages","value":"Pointages"},
    {"label":"Retard d'entrée","value":"Retard d'entrée"},
    {"label":"Retard de midi","value":"Retard de midi"},
    {"label":"Départ anticipé","value":"Départ anticipé"},

    {"label":"Mission","value":"Mission"},
    {"label":"Congé","value":"Congé"},
    {"label":"Motif","value":"Motif"},
    
    {"label":"Travail brute","value":"Travail brute"},
  ]

  useEffect(() => {
    ac.push(activite.map(x => x.value))
    si.push(site.map(y => y.value))

    fetch(url+"userofdepartements/?id=" + uu+ "&idactivite=" + ac , {method: 'GET', 
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

  }, [activite, site,uu])


  
  const [optionrap,setoptionsrap]=useState([])
 

  
  const ac = []
  const si = []

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
  
      fetch(url+"rapportjour/" + date1 + "/" + date2 + "/?id=" + arr , {method: 'GET', 
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
           
              <table  id="rapjour" ref={ref}  >
                  <thead className="thead-light">
                    <tr>
      
                      { optionnss.find(e=>e.value.toString()=="Nom Employé" ) ?   <th title="employé" > Emp</th> : <th></th>}
                    { optionnss.find(e=>e.value.toString()=="Matricule" ) ?<th> Mat</th> :<th></th>   }    
                  { optionnss.find(e=>e.value.toString()=="Date" ) ?    <th title="Date">  date</th>:<th></th> }
                     { optionnss.find(e=>e.value.toString()=="Déficit" ) ?      <th title='déficit'>Déficit</th>:<th></th> }
                     { optionnss.find(e=>e.value.toString()=="h.Travail" ) ?  <th title='heures pratique'>   Heff</th>:<th></th> }
                      { optionnss.find(e=>e.value.toString()=="Travail brute" ) ?<th title='heures pratique brute'> travail brute</th>:<th></th> }
                     
                    { optionnss.find(e=>e.value.toString()=="h.Théorique" ) ?   <th title='heures théorique '>     théorique </th> :<th></th> }
                     { optionnss.find(e=>e.value.toString()=="Pointages" ) ? <th > Pointages </th>   :<th></th> }
                 
                     { optionnss.find(e=>e.value.toString()=="Retard d'entrée" ) ?    <th title='Retard d entrée'>  Ret.Entrée</th>:<th></th> }
                   { optionnss.find(e=>e.value.toString()=="Retard de midi" )    ?  <th title='Retard midi'> Ret.Midi</th>:<th></th> }
                     { optionnss.find(e=>e.value.toString()=="Départ anticipé" )    ?<th title='Heures avant de sortie'>   SAH</th>:<th></th> }
                  { optionnss.find(e=>e.value.toString()=="Autorisation" )    ?   <th title='autorisation'>  Aut</th>:<th></th> }
                    
                 
           
                          
                   { optionnss.find(e=>e.value.toString()=="Mission" )    ?   <th title='Mission'>  Miss</th>:<th></th> }
                     { optionnss.find(e=>e.value.toString()=="Congé" )    ?<th title='Congé'>   congé</th>:<th></th> }
                     { optionnss.find(e=>e.value.toString()=="Motif" )    ?    <th title='Motif'>Motif</th>:<th></th> }
                   
                    </tr>
                  </thead>       
                  <tbody>
                    
                  {dat.map(jour=>
                    
  <>  
  <tr key={jour.id}>
                        { optionnss.find(e=>e.value.toString()=="Nom Employé" ) ?         <td>{jour.user_name +" "+jour.last_name}</td>:<td></td>}
                        { optionnss.find(e=>e.value.toString()=="Matricule" ) ?       <td>{jour.matricule}</td>:<td></td>}
                        { optionnss.find(e=>e.value.toString()=="Date" ) ?      <td>{jour.date_pointage}</td>:<td></td>}
                        { optionnss.find(e=>e.value.toString()=="Déficit" ) ?   (jour.deficit=="00:00"?<td> 0</td>:   <td>{ jour.deficit }</td>):<td></td>}
                   
                        { optionnss.find(e=>e.value.toString()=="h.Travail" ) ?    <td title='heures pratique'>{ jour.heuretravail }</td>:<td></td>}
                        { optionnss.find(e=>e.value.toString()=="Travail brute" ) ?  <td title='heures de travail brute'>{jour.heuretravailbrute}</td>:<td></td>}
                           
                        { optionnss.find(e=>e.value.toString()=="h.Théorique" ) ?    <td title='heures théorique '>{jour.presencenormal }</td>:<td></td>}
                      
               

               { optionnss.find(e=>e.value.toString()=="Pointages" ) ?       <td >{jour.pointages}</td>:<td></td>}
        
               { optionnss.find(e=>e.value.toString()=="Retard d'entrée" ) ?     <td title='Retard d entrée'>{jour.lateEntree}</td>:<td></td>}
                      
               { optionnss.find(e=>e.value.toString()=="Retard de midi" )    ?     <td title='Retard midi'>{jour.retardmidi}</td>:<td></td>}
               { optionnss.find(e=>e.value.toString()=="Départ anticipé" )    ?     <td title='heures avant sortie'>{ jour.earlySortie }</td>:<td></td>}
               { optionnss.find(e=>e.value.toString()=="Autorisation" )    ?    <td title='autorisation'>{jour.heureauthorisation }</td>:<td></td>}
                   
          

               { optionnss.find(e=>e.value.toString()=="Mission" )    ? <td title='Mission'>{ jour.tempsMission }</td>:<td></td>}

               { optionnss.find(e=>e.value.toString()=="Congé" )    ?     <td title='Congé'>{jour.tempsconge}</td>:<td></td>}
               { optionnss.find(e=>e.value.toString()=="Motif" )    ? <td title='Motif'>{jour.motif}</td>:<td></td>}
                      </tr>

 </>
  )
}
       
              


                  </tbody>
           
     
                 
                </table>
      
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

