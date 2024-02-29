import useFetch from "./useFetch";
import React from "react";

import ScrollContainer from "react-indiana-drag-scroll";
import $ from "jquery"

import frdatatable from '../frdatatable.json'
import { useSelector } from "react-redux";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
const Contratss = () => {
  const url=process.env.React_App_URL;

  $(document).ready(function () {
   
    $('#contttadmin').DataTable({
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


const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      var viewlistcontrats_admin=test['viewlistcontrats_admin']
      var iddep=test['iddep']
      var role= test["role"]
      var viewlistcontrats_rh=test['viewlistcontrats_rh']
      var DRH=test["DRH"]
      var iduserinfo=test["id"]
    }
  const { data: Contrats = [] ,isloading:ll,error:ee} = useFetch(url+"AffichageContrats/" + iduserinfo)

  
    return ( 
        <div className="container-fluid mt-5">
            {ll==true ?<Backdrop  open={true}>
        <CircularProgress color="primary" style={{position:"absolute",bottom:"50px"}}  />
      </Backdrop>:   <div className="row">
          <div className="col">
          <div className="card shadow">
   
        <div className="table-responsive">


     
      
        <ScrollContainer>
     
   <div className="table-responsive">   <table className="table table-bordered display" id="contttrh">
          <thead className="thead-light">
            <tr>
              
              <th scope="col">Employé</th>
              <th scope="col">Date début de contrat</th>
              <th scope="col">Date fin de contrat</th>
              <th scope="col">Date de Recrutement</th>
              <th scope="col">Rappel 1</th>
              <th scope="col">Rappel 2</th>
              <th scope="col">Type contrat</th>
           
            
            </tr>
          </thead>
          <tbody>
    
             
            {Contrats.map(contrat =>
                    <tr key={contrat.id}>
                      <td >{contrat.user_name == null ? " " :contrat.user_name +" "+contrat.last_name == null ? " " :contrat.last_name}</td>
                      <td>
                   {contrat.démarrageContrat}
                      </td> 
                      <td>
                   {contrat.datefin}
                      </td> 
                      <td>
                   {contrat.daterecrutement}
                      </td> 
                      <td>
                   {contrat.rappel1}
                      </td> 
                      <td>
                   {contrat.rappel2}
                      </td> 
                      <td>{contrat.nomcontrat}</td>
              
                    </tr>
                  )}
    

             
         
          </tbody>
        </table></div>
      
      </ScrollContainer>
    
   
      
        
        </div> 
        </div></div></div>}</div>
     );
}
 
export default Contratss;