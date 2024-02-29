import React from 'react'
import useFetch from '../useFetch';
import { useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";

import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.html5';
import frdatatable from "../../frdatatable.json"
import $ from "jquery";
const ListMouchard = () => {
  const[openn,setOpenn]=useState(false)
  const [post,setPost]=useState(false)
  const url=process.env.React_App_URL;

  React.useEffect(()=>{

    
    if (mouchard.length==0){

    setOpenn(true)
  setPost(false)
  
    }else{
    setOpenn(false)
    setPost(true)}
  }
  ,[openn,post])
  $(document).ready(function () {
   
    $('#datatablemouch').DataTable({
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

    const { data: mouchard = [],isloading:ll,error:rr } = useFetch(url+"MouchardList/")
    return ( 
        <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">

      

              {post?
        <div className="table-responsive">
        <ScrollContainer className="scroll-container">
        <table className="table table-bordered display" id="datatablemouch">
          <thead className="thead-light">
            <tr>
              
             
              <th scope="col" >Date</th>
              <th scope="col" >personne qui a modifié</th>
              <th scope="col" >Employé</th>
              <th scope="col" >Mat employé</th>
              <th scope="col" >Champ</th>
              <th scope="col" >Ancienne</th>
              <th scope="col" >Nouvelle</th>
             
            </tr>
          </thead>
          <tbody>
        
 
            {mouchard.map(m =>
                    <tr key={m.id}>
                         <td>{m.datenow}</td>
                       {/**  <td>   {users.filter(x=>x.id==m.personne_name).map(x=><>{x.user_name}  {x.last_name}</>)}</td> */}
                  <td>{m.nomp}</td>
                   <td>{m.employe_name}</td>
                   <td>{m.matriculeemploye}</td>
                   <td>{m.objet}</td>
                      <td>{m.anciennevaluer}</td>
                   <td>{m.nouvellevaluer}</td>
                   
                  
                
                
                    </tr>
                  )}
        
             
         
          </tbody>
        </table>
        </ScrollContainer>
        </div> :( <>{mouchard.length==0 && ll==true ? <Backdrop  open={openn}>
  <CircularProgress  style={{top : '50%'}} color="black" />
  </Backdrop>:setPost(true)}</>)
  
  
  } 
        
        </div> 
        </div></div></div>
     );
}
 
export default ListMouchard;