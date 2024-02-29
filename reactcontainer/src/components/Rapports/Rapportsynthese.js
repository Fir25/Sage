

import { useReactToPrint } from "react-to-print";
import React, { useState , useRef} from 'react';

import useFetch from '../useFetch';


import frdatatable from '../../frdatatable.json'

import { useMemo } from "react";


import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import { useEffect } from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import ScrollContainer from 'react-indiana-drag-scroll'




import $ from "jquery";
import { MultiSelect } from '../MultiSelect';

import { Alert } from "@mui/material";
import { useSelector } from "react-redux";
export const ComponentSyntheseToPrint = React.forwardRef((props, ref) => {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    var iddd= test['iddep'].length==0?undefined: JSON.parse(JSON.stringify(test['iddep'])).map(x=>
      x.iddep_rh1
      ).join("")+","+JSON.parse(JSON.stringify(test['iddep'])).map(x=>
        x.iddep_rh2
        ).join("")+","+JSON.parse(JSON.stringify(test['iddep'])).map(x=>
          x.iddep_chef
          ).join("")+","+JSON.parse(JSON.stringify(test['iddep'])).map(x=>
            x.iddep_wfm
            ).join("")
  
    var DRH=test['DRH']
    var admin=test['admin']

    
  }
  var iddep=iddd==""? undefined:iddd
  const url=process.env.React_App_URL;
  const [uss,setuss]=useState([])
  const users=[]
const[alert,setAlert]=useState(false)
  const[uu,setU]=useState([])


  const [activite, setActivite] = useState([])
  const activities = [
    { "label": "activité", "value": "1" },
    { "label": "Suspendu", "value": "0" }
  ]
  const [site, setSite] = useState([])
  const { data: sites = [], isloading, error } = useFetch(url+"ListSite_ForSelect/")

  const ac = []
  const si = []

  useEffect(() => {
    ac.push(activite.map(x => x.value))
    si.push(site.map(y => y.value))

    fetch(url+"userofdepartements/?id=" + uu+ "&idactivite=" + ac   , {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
      result.json().then((resp) => {
    
      resp.map(x=>users.push({"label":x.label,"value":x.value}))
      setuss(resp)
      })
    
    }).catch((err)=>{
    /**  if ( err.response.status=== 401) {
        logoutfunction(err.response.status)
      } */
    
    })

  }, [activite, site,uu])

  const [selectedd, setSelectedd] = useState([]);
  const arr=[]
  $(document).ready(function () {
   
    $('#rapsyn').DataTable({
      
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
    const[date1,setDate1]=useState('')
    const[date2,setDate2]=useState('')
    //const[serarchItem,setSearchItem]=useState('')
    const[dat,setData]=useState([])
   
    const [post,setPost]=useState(false)
  const[openn,setOpenn]=useState(false)
  const handleToggle = () => {
   setOpenn(true)
  };
    function SelectRaSynthese(date1,date2,e) {
      e.preventDefault();
      setAlert(false)
      arr.push(selectedd.map(x=>x.value))
      if(loginemploye==false){ 
            fetch(url+"rapportsynthese/" +date1+"/"+date2+"/?id="+arr , {method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: token,
            }}).then((result) => {
                result.json().then((resp) => {
                  setPost(true)
                setData(resp)
                setOpenn(false)
                })
                .catch(err => {
               /**   if ( err.response.status=== 401) {
                    logoutfunction(err.response.status)
                  } */
                  setAlert(true)
                })
          })
        
        
        
        }else{
          fetch(url+"rapportsynthese/" +date1+"/"+date2+"/?id="+iduserinfo , {method: 'GET', 
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
          }
          )
            .catch(err => {
          /**    if ( err.response.status=== 401) {
                logoutfunction(err.response.status)
              } */
              setAlert(true)
            })
    
        }}
         
    
      





 const { data: data, isloading: zzsx, error: esse } =  useFetch(url+"Getarbobyids/?id="+iddep)
 const { data: dataadmin, isloading: aae, error: fv } = useFetch(url+"arbo/")
 const[loginemploye,setloginemploye]=useState(false)
 useEffect(()=>{
 if(iddep!=undefined){
 
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
      
         <div className="container-fluid mt-5">
    <div className="row">
      <div className="col">
      <div className="card shadow">
    <div className="card">
<div className="card-header" id="colorcardheader">
<h2 id="textcolor" >Importer Rapport de Synthése</h2></div> 

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
            <a className="btn btn-primary"  data-dismiss="modal" onClick={(e) => { SelectRaSynthese(date1, date2, e); handleToggle() }}>Importer</a></div> 
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
          </div>

            <div className="row  pt-4 pl-4 pr-4">

              <div className='col-md-3'>
                <label>Employés</label>
                <MultiSelect options={uss} value={selectedd} onChange={setSelectedd} />
              </div>

            </div>

            <div className="form-group pt-4" style={{ marginLeft: "45%", marginRight: "55%" }}>
              <a className="btn btn-primary"  data-dismiss="modal" onClick={(e) => { SelectRaSynthese(date1, date2, e); handleToggle() }}>Importer</a></div>
          </>}
          <div style={{width:"50%"}} >
          {alert&&
     <Alert variant="filled" severity="error">
      Il faut sélectionner au moins un employé ,une date de début et une date de fin!</Alert>}</div>
        </form>
  
                               

        <div>

    
      
        

    </div>
    </div>

        <div className="table-responsive">
            <ScrollContainer className="scroll-container">
            {openn? 
        
         <Backdrop  open={openn}>
         <CircularProgress color="primary" style={{position:"absolute",bottom:"50px"}} />
       </Backdrop>:dat.length==0?"":
       <div className='card'>
 {/**      <div className='card-header' id="colorcardheader">
             <h3 style={{color:"white"}}>Rapport de synthése de {date1} à {date2}</h3>
             </div> */}
           <hr/>
       <div className="table-responsive" >
       
       <table  id="rapsyn" >
          <thead className="thead-light">
            <tr>
              
            <th title="employé">Employé</th>
                      <th title="Matricule" >Mat</th>
         
                      <th title='heures effectives' >Heff</th>
                    
                      <th title='Retard d entrée'>Retard</th>
                      <th title='Heures avant de sortie'>SAH</th>
              <th scope="col">Déficit</th>
              <th title='jours absence en déficit'>J.abs déficit</th>
              <th title='Jours de congés'>congé</th>
              <th title='Mission'>mission</th>
              <th title='autorisation'>auth</th>
             <th scope="col">absence</th>
             <th title='heures théorique '>théorique</th> 
             <th title='Amplitude'>Amplitude</th>
            </tr>
          </thead>
        
          <tbody>
          {dat.map(se=>
          
     <tr key={se.id}>
           <td>{se.user_name+" "+se.last_name}</td>
           <td >{se.matricule}</td>
    
           <td title='heures pratique'>{se.travail}</td>
           <td title='Retard d entrée'>{se.retard}</td>
           <td title='heures avant sortie'>{se.earlySortie}</td>
        <td>{se.deficit}</td>
        <td title='jours abscence en déficit'>{se.joursabsence}</td>
        <td title='Jours de congés' >{se.jourconges}</td>
        <td title='Mission' >{se.heuremission}</td>
        <td title='autorisation' >{se.heureauthorisation}</td>
      <td>{se.tempsabsence}</td>
      <td title='heures pratique'>{se.presencenormale}</td>
   <td  title='Amplitude'>{se.amplitude}</td>
      </tr>
 
)
       }   
          
    
         
          </tbody>
         
        </table></div></div>}
        </ScrollContainer>
      </div>
 
    </div></div></div></div>
     );
  });
  const RapportSynthese = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
  
    return (
      <div>
  
      
      <ComponentSyntheseToPrint ref={componentRef} />
   
     
       
      </div>
    );
  };
  export default  RapportSynthese;
  
  