import React from "react"
import AffectationPause from "./Affectationpause";
import useFetch from "../useFetch";
import $ from "jquery"
import { useSelector } from "react-redux";
import frdatatable from '../../frdatatable.json'
const CrudAffectationPause =()=>{
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const url=process.env.React_App_URL;
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']

  
    
  }
  $(document).ready(function () {
    $('#pointagestable').DataTable({
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
     } )})
  const { data: pointages = [],isloading:ll,error:ee} = useFetch(url+"Pointagesofchefs/"+iduserinfo)
    return(
        <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">

      <div className="card-header border-0">
                <AffectationPause/>
                  </div>

                  <div className="table-responsive">
                    {ll==true?"":
        <table className="table table-bordered display" id="pointagestable">
          <thead className="thead-light">
            <tr>
                    <th scope="col">Date et heure de  pointage</th>
                    <th scope="col">Employé</th>
                 
                
                  
                  <th scope="col">état</th>
      

                  </tr>
                </thead>
                <tbody>

                  {pointages.map(pointage =>
                    <tr key={pointage.id}>
                      <td>{pointage.date_pointage}</td>
                      <td>{pointage.user_name + "  "+pointage.last_name}</td>
                 
                 
                     <td>{pointage.etat==0?"entrée":"sortie"}  {pointage.pausename}</td>

                    </tr>

                  )}
             
                </tbody>
              </table>}
            </div>

                  </div></div></div></div>
    )
}
export default CrudAffectationPause;