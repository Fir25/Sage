

import { useReactToPrint } from "react-to-print";
import React, { useState , useRef} from 'react';

import useFetch from '../useFetch';

import { useMemo } from "react";

import { useEffect } from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollContainer from 'react-indiana-drag-scroll'

import $ from "jquery";
import { MultiSelect } from '../MultiSelect';


import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import { Alert } from "@mui/material";
import frdatatable from '../../frdatatable.json'
import { useSelector } from "react-redux";
export const ComponentMensuelleToPrint = React.forwardRef((props, ref) => {
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
  const users=[]

  const[uu,setU]=useState([])
const[alert,setAlert]=useState(false)

  const [activite, setActivite] = useState([])
  const activities = [
    { "label": "activité", "value": "1" },
    { "label": "Suspendu", "value": "0" }
  ]
  const [site, setSite] = useState([])
  const { data: sites = [], isloading, error } = useFetch(url+"ListSite_ForSelect/")
  const [iddepar, setIddepar] = useState([])
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
    
    }).catch((err)=>{
    /**  if ( err.response.status=== 401) {
        logoutfunction(err.response.status)
      } */
    })

  }, [activite, site,uu])

  const [selectedd, setSelectedd] = useState([]);
  const arr=[]
  $(document).ready(function () {
    
    $('#rapmen').DataTable({

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
  

    function SelectRapportMensuelle(date1,date2,e) {
  
      e.preventDefault();
      setAlert(false)
      if(loginemploye==false){ 
        arr.push(selectedd.map(x=>x.value))
            fetch(url+"RapportMensuelle/" + date1 + "/" + date2 + "/?id=" + arr , {method: 'GET', 
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
                /**  if ( err.response.status=== 401) {
                    logoutfunction(err.response.status)
                  } */
                 
                  setAlert(true)
                })
          })
      }else{
        fetch(url+"RapportMensuelle/" + date1 + "/" + date2 + "/?id=" +iduserinfo , {method: 'GET', 
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
          /**  if ( err.response.status=== 401) {
              logoutfunction(err.response.status)
            } */
        
            setAlert(true)
          })
    


      }
        
        }
         
    
        


 const { data: data, isloading: zzsx, error: esse } = useFetch(url+"Getarbobyids/?id="+iddep)
 const { data: dataadmin, isloading: aae, error: fv } = useFetch(url+"arbo/") 
 const[loginemploye,setloginemploye]=useState(false)
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
<h2 id="textcolor" >Importer  rapport mensuel</h2></div> 
          <form>





          {loginemploye ?
          <>
                    <div className="row pl-4 pr-4 pt-4">
            <div className="col-md-4">

              <div className="form-group">
                <label> Date début</label>
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
            <a className="btn btn-primary"  data-dismiss="modal" onClick={(e) => { SelectRapportMensuelle(date1, date2, e); handleToggle() }}>Importer</a></div> 
          </>
          
      : <>
   <div className="row pl-4 pr-4 pt-4">
            <div className="col-md-3">

              <div className="form-group">
                <label> Date début</label>
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
              <a className="btn btn-primary"  data-dismiss="modal" onClick={(e) => { SelectRapportMensuelle(date1, date2, e); handleToggle() }}>Importer</a></div>
          </>}
          <div style={{width:"50%"}} >
          {alert&&
     <Alert variant="filled" severity="error">
      Il faut sélectionner au moins un employé ,une date de début et une date de fin!</Alert>}</div>

        </form>
  

        <div>

    
      
              
    </div>
    </div>
{openn?
             <Backdrop  open={openn}>
               <CircularProgress color="primary" style={{position:"absolute",bottom:"50px"}} />
             </Backdrop>:
             dat.length==0?"":
                       <div className='card'>
       {/**     <div className='card-header' id="colorcardheader">
                  <h3 style={{color:"white"}}>Rapport mensuel de {date1} à {date2}</h3>
                  </div> */}
                <hr/> 
             <div className="table-responsive">
                   <ScrollContainer className="scroll-container">
             

              
             {Object.values(dat).map(({list,htheorique_total,heffective_total,htravail_direct,htravail_indirect,deficit_totale,earlysoriteTotal,retardminutestotale}, i)=>
 <>    
  <>    <table  id="rapmen">
          
               <thead className="thead-light">
                 <tr>
                   <th scope="col"></th>
                   <th scope="col">Employé</th>
                   <th title="Matricule" >Mat</th>
                   <th title="Debut  de mois" >Debut</th>
                   <th title="fin de mois" >Fin</th>
                   <th title='heures pratique'>Heff </th>
                   <th title='heures pratique direct'>p.direct </th>
                   <th title='heures pratique indirect'>p.indrect</th>
                   <th scope="col">théorique</th>
                   <th scope="col">retard</th>
               <th scope="col">SAH</th>
               <th scope="col">deficit</th>
               <th scope="col">Absence déficit</th>
               <th scope="col">Amplitude</th>
                 </tr>
               </thead>
            
               <>
               <tbody>
             
             
               {list.map(ab=>
           
     <tr key={ab.iduser}>
                <td></td>
                <td>{ab.user_name + " "+ab.last_name}</td>
                <td title="Matricule" >{ab.matricule}</td>
                <td title="Debut mois">{ab.debutmois}</td>
                <td title="fin de mois" >{ab.finmois}</td>
                <td title='heures pratique' >{ab.presencereele}</td>
              
                <td title='heures pratique direct'>{ab.heuredtravaildirect}</td>
                <td title='heures pratique indirect'>{ab.heuretravailindirect}</td>
                <td>{ab.presencenormal}</td>
                <td>{ab.retardEntree}</td>
                <td>{ab.heureavantsortie}</td>
                <td>{ab.deficit}</td>
                <td>{ab.absence_defi}</td>
                <td>{ab.amplitude}</td>
                </tr>
               )
     
             
               }
                  
                
              
              
           
           
            
         
              
               </tbody>  
       
               <tr className="table-danger">
                 <td >Somme</td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td>{heffective_total}</td>
                     <td>{htravail_direct}</td>
                     <td>{htravail_indirect}</td>
                     <td>{htheorique_total}</td>
                     <td>{retardminutestotale}</td>
                     <td>{earlysoriteTotal}</td>
                     <td>{deficit_totale}</td>
                
                     </tr>
                     </>  
                    </table></>  
             
             </> 
             )}
             
         
              </ScrollContainer>
           </div> </div> }  
{/**    {post? 
             <div className="table-responsive">
                   <ScrollContainer className="scroll-container">
             <table className="table align-items-center table-flush" id="absencestoexcel" ref={ref}>

              
             {Object.values(dat).map(({list,htheorique_total,heffective_total,htravail_direct,htravail_indirect,deficit_totale,earlysoriteTotal,retardminutestotale}, i)=>
             <>
               <thead className="thead-light">
                 <tr>
                   <th scope="col"></th>
                   <th scope="col">Employé</th>
                   <th title="Matricule" style={{minWidth:"5px",maxWidth:"60px"}}>Mat</th>
                   <th title="Debut  de mois" style={{minWidth:"5px",maxWidth:"80px"}}>Debut</th>
                   <th title="fin de mois" style={{minWidth:"5px",maxWidth:"80px"}}>Fin</th>
                   <th title='heures pratique' style={{minWidth:"5px",maxWidth:"40px"}}>pratique </th>
                   <th title='heures pratique direct' style={{minWidth:"5px",maxWidth:"40px"}}>p.direct </th>
                   <th title='heures pratique indirect' style={{minWidth:"5px",maxWidth:"40px"}}>p.indrect</th>
                   <th scope="col">théorique</th>
                   <th scope="col">retard</th>
               <th scope="col">H.avant sortie</th>
               <th scope="col">deficit</th>
               <th scope="col">Absence déficit</th>
                 </tr>
               </thead>
               <tbody>
             
             
               {list.filter((ab)=>{
                  const name=ab.user_name||''
                  const mat=ab.mat||''
  if (serarchItem==""){
   return ab
  }
  else if (name.toLowerCase().includes(serarchItem.toLowerCase()) || mat.toLowerCase().includes(serarchItem.toLowerCase())) {
 
    return ab
  }
}).map((ab,key)=>{
  return (
  <>  
     <tr key={ab.iduser}>
                <td></td>
                <td>{ab.user_name + " "+ab.last_name}</td>
                <td title="Matricule" style={{minWidth:"5px",maxWidth:"60px"}}>{ab.matricule}</td>
                <td title="Debut mois" style={{minWidth:"5px",maxWidth:"80px"}}>{ab.debutmois}</td>
                <td title="fin de mois" style={{minWidth:"5px",maxWidth:"80px"}}>{ab.finmois}</td>
                <td title='heures pratique' style={{minWidth:"5px",maxWidth:"40px"}}>{ab.presencereele}</td>
              
                <td title='heures pratique direct' style={{minWidth:"5px",maxWidth:"40px"}}>{ab.heuredtravaildirect}</td>
                <td title='heures pratique indirect' style={{minWidth:"5px",maxWidth:"40px"}}>{ab.heuretravailindirect}</td>
                <td>{ab.presencenormal}</td>
                <td>{ab.retardEntree}</td>
                <td>{ab.heureavantsortie}</td>
                <td>{ab.deficit}</td>
                <td>{ab.absence_defi}</td>
                </tr>
 </>
  )
})
       }   
             
             
                  
                
              
              
           
           
            
         
              
               </tbody>
               <tr className="table-danger">
                 <td >Somme</td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td>{heffective_total}</td>
                     <td>{htravail_direct}</td>
                     <td>{htravail_indirect}</td>
                     <td>{htheorique_total}</td>
                     <td>{retardminutestotale}</td>
                     <td>{earlysoriteTotal}</td>
                     <td>{deficit_totale}</td>
                
                     </tr>
               </>
                  )}
             
             </table>
             </ScrollContainer>
           </div> :<Backdrop  open={openn}>
        <CircularProgress color="inherit" />
      </Backdrop>} */}
 
    </div></div></div></div></div>
     );
  });


const RapportMensuelle = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
  

<div>

{/**<button className="btn" style={{width:"80px",marginLeft: '0.8rem',marginTop:"0.4rem",backgroundColor:'#5ac2df'}} onClick={handlePrint}>PDF</button>
 */}
<ComponentMensuelleToPrint ref={componentRef} />

</div>

  );
};
export default RapportMensuelle;