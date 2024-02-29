




import useFetch from '../useFetch';



import React ,{ useEffect, useMemo,useState  }from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollContainer from 'react-indiana-drag-scroll'


import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'

import $ from "jquery";
import { MultiSelect } from '../MultiSelect';

import frdatatable from '../../frdatatable.json'
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';
const RapportAnnulle = () => {
  const[alert,setAlert]=useState(false)
  const url=process.env.React_App_URL;
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
     var iddd = test['iddep'].join(",");

  
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

  const ac = []
  const si = []
  useEffect(() => {
    ac.push(activite.map(x => x.value))
    si.push(site.map(y => y.value))

    

    fetch(url+"userofdepartements/?id=" + uu+ "&idactivite=" + ac , {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
      result.json().then((resp) => {
    
      resp.map(x=>users.push({"label":x.label,"value":x.value}))
      setuss(resp)
      })
    
    })    .catch(err => {
 /**     if ( err.response.status=== 401) {
        logoutfunction(err.response.status)
      } */
     
    })

  }, [activite, site,uu])
  const [selectedd, setSelectedd] = useState([]);
  const arr=[]
  $(document).ready(function () {
   
    $('#rapannue').DataTable({
      
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
 
    const[dat,setData]=useState([])

    const [post,setPost]=useState(false)
  const[openn,setOpenn]=useState(false)
  const handleToggle = () => {
   setOpenn(true)
  };
    function SelectRaAnnuelle(date1,date2,e) {

      e.preventDefault();
      setAlert(false)
      arr.push(selectedd.map(x=>x.value))
    if(loginemploye==false){
      
      fetch(url+"RapportAnuellement/" +date1+"/"+date2+"/?id="+arr, {method: 'GET', 
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
   /**       if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
   setAlert(true)
        })
  })
    }else{
      
      fetch(url+"RapportAnuellement/" +date1+"/"+date2+"/?id="+iduserinfo, {method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      }}).then((result) => {

    /**   if ( result.status===401) {
          logoutfunction(result.status)
        } */
        result.json().then((resp) => {
          setPost(true)
        setData(resp)
        setOpenn(false)
   
        })
     
      
      })
        .catch(err => {
     /**     if ( err.response.status=== 401) {
            logoutfunction(err.response.status)
          } */
        setAlert(true)
        })

    }  
    
    }
         


const[loginemploye,setloginemploye]=useState(false)
 const { data: data, isloading: zzsx, error: esse } =useFetch(url+"Getarbobyids/?id="+iddep)
 const { data: dataadmin, isloading: aae, error: fv } = useFetch(url+"arbo/")
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
        <div>

        <div className="container-fluid mt-5">
      <div className="row">
        <div className="col">
        <div className="card shadow">
    <div className="card">
    <div className="card-header" id="colorcardheader">
<h2 id="textcolor" >Importer Rapport Annuel</h2></div> 
          <form>





          {loginemploye ?
          
          <>          <div className="row pl-4 pr-4 pt-4">
          <div className="col-md-4">
          <label>Date début</label>
            <div className="form-group">
              <div className="input-group input-group-merge input-group-alternative">

                <input className="form-control" placeholder="" value={date1} name="date_pointage1" onChange={(e) => setDate1(e.target.value)} type="date" />
              </div>
            </div>
          </div>
          <div className="col-md-4">

            <div className="form-group">
            <label>Date fin</label>
              <div className="input-group input-group-merge input-group-alternative">

                <input className="form-control" placeholder="" value={date2} name="date_pointage" onChange={(e) => setDate2(e.target.value)} type="date"  min={date1}/>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group pt-4" style={{ marginLeft: "45%", marginRight: "55%" }}>
            <a className="btn btn-primary"  data-dismiss="modal" onClick={(e) => { SelectRaAnnuelle(date1, date2, e); handleToggle() }}>Importer</a></div></>
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

                <input className="form-control" placeholder="" value={date2} name="date_pointage" onChange={(e) => setDate2(e.target.value)} type="date"  min={date1}/>
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
              <a className="btn btn-primary"  data-dismiss="modal" onClick={(e) => { SelectRaAnnuelle(date1, date2, e); handleToggle() }}>Importer</a></div>
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
      </Backdrop>: 
      dat.length==0?"":
      <div className='card'>

      

    <hr/>
<div className="table-responsive" >   <table  id="rapannue" >
          <thead className="thead-light">
            <tr>
              
              <th scope="col">Nom et prénom</th>
              <th scope="col">Debut d'année</th>
              <th scope="col">Fin d'année</th>
            
              <th scope="col">Heff</th>
              <th scope="col">Heures théoriques</th>
              <th scope="col">Retard d'entrée</th>
              <th scope="col">SAH</th>
              <th scope="col">déficit</th>
              <th scope="col">Amplitude</th>
  
            </tr>
          </thead>
         
          <tbody>
     
 
          {dat.map(se=>
           <tr key={se.id}>
           <td>{se.user_name +" "+se.last_name}</td>
           <td>{se.date1}</td>
        <td>{se.date2}</td>
      
        <td>{se.presencereel}</td>
        <td>{se.presencenormal}</td>
        <td>{se.retardEntree}</td>
        <td>{se.heureavantsortie}</td>
        <td>{se.deficit}</td>
        <td>{se.amplitude}</td>
     
       
       
      </tr>
          )}
       
    
         
          </tbody> 
        </table></div></div>
        
        
        }
        </ScrollContainer>
      </div>
  

    </div></div></div></div></div>
    )
} 
 
export default RapportAnnulle;