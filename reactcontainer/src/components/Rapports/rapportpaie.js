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
  
      fetch(url+"rapportpaie/" + date1 + "/" + date2 + "/?id=" + arr , {method: 'GET', 
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
      
      fetch(url+"rapportpaie/" + date1 + "/" + date2 + "/?id=" + iduserinfo, {method: 'GET', 
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

  setTreeData(data)
  

}else if (admin==true || DRH==true){
 
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
<h2 id="textcolor" >Import VB </h2></div> 
              
          <form>

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
        <th> </th>
        <th> </th>
        <th> </th>
        <th> </th>
        <th> CL02</th>
        <th> CL22</th>
        <th> CL01</th>
        <th> HA11</th>
        <th> HA01</th>
        <th> COMPRIMOI</th>
        <th> CL50</th>
        <th> CL21</th>
        <th> CL05</th>
        <th> CL04</th>
        <th> CL03</th>
        <th> HS06</th>
        <th> HS09</th>
        <th> CL06</th>
        <th> CL27</th>
        <th> CL28</th>
        <th> CL13</th>
        <th> CL19</th>
        <th> CL31</th>
        <th> CL23</th>
        <th>CL07</th>
        <th>HA05</th>
        <th>CL55</th>
        <th>CL39</th>
        <th>CL44</th>		
        <th>HS12</th>	
        <th>HS11</th>
        </tr>
                    <tr>   
                    <th> Mat</th> 
                    <th> Activité</th>
                    <th title="employé" > Nom Prenom</th> 
                    <th title="typepaie" > Type de Paie </th> 
                       <th title='Planif mois '>    Planif mois </th> 
                       <th title='Planif agent '>   Planif agent</th> 
                       <th title='heures pratique brute'>Nombre d'heure</th>
                  <th title='autorisation'>  Nombre Heures d'absence</th>
                  <th title='Absence non justifié'>  Absence non justifié</th>
                  
                  <th title='Congé'>   CP</th>
                  <th title='objectif'> Prime sur objectif</th>
                  <th title='exceptionnelle'>  Prime exceptionnelle</th>
                  <th title='langue'>  Prime de langue</th>
                  <th title='Assiduité'>  Prime Assiduité</th>
                  <th title='HD'> Prime HD</th>
                  <th title='50%'>  Nbr d'heure de majoration 50%</th>
                  <th title='100%'>  Nbr d'heure de majoration 100%</th>
                  <th title='TR'>    TR</th>
                  <th title='congé spéciaux'>    congé spéciaux en jour</th>
                
                  <th title='SCRUM'>  Prime SCRUM</th>
                  <th title='avance'> Avance</th>
                  <th title='rappel'> Rappel</th>
                  <th title='Prime de formation'> Prime de formation </th>
                  <th title='Prime de mission'> Prime de mission</th>
                  <th title='Jours fériés'> Jours fériés</th>
                  <th title='MAP'> MAP</th>
                  <th title='Trop Perçu'> Trop Perçu</th>
                  <th title='Autres Déduction'> Autres Déduction</th>
                  <th title=' Avance sur Rappel'> Avance sur Rappel</th>       
                  <th title='  heure 25 '> heure 25</th>
                  <th title='  heure 50 '> heure 50</th>
                  <th title='  ppel'> </th>
                    </tr>
                  </thead>       
                  <tbody>
                    
                  {dat.map(jour=>
                    
  <>  
  <tr key={jour.id}>
                        
                        <td>{jour.matricule}</td>
                        <td>{jour.departement}</td>
                        <td>{jour.user_name +" "+jour.last_name}</td>   
                        <td>{jour.typepaie}</td>                  
                          <td >{jour.heuretheorique}</td>
                          
                     <td >{jour.plannifagent }</td>
                     <td >{ jour.ht }</td>
                 <td>{jour.heureabs }</td>  
                 <td></td>
                 <td>{jour.tempsconge}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td> {jour.restau}</td>
                <td></td>
                <td></td>
                <td></td>
              

                <td></td>
                <td></td>
               
                <td></td>
                <td>{jour.jrfr}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
               
                <td>{jour.heure25}</td>
                <td>{jour.heuresup50}</td>
                <td></td>
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
const RapportPaie = () => {
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
export default RapportPaie;

