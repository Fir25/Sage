import React from 'react';
import TimeCounter from "./timer"; 
import Totalheures from "./cumuletimer";
import useFetch from '../usefetch1';

import { makeStyles } from '@mui/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import $ from "jquery";
import ScrollContainer from 'react-indiana-drag-scroll';

import frdatatable from '../../frdatatable.json'
import { useSelector } from 'react-redux';
function Rapportbusiness() {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
 const url=process.env.React_App_URL;
  
 const userinfo =useSelector(state => state.userinfo);
 const test=userinfo[0]
 if(Object.keys(userinfo).length !=0){ 
  
  var contratedit=test['"contratsedit"']
  var contratdelete=test['admin']
  var userid=test['id']
  
   
 }
  const { data: wfm = [], isloading, error } = useFetch(url+"rapportwfm/"+userid)




   
    const useStyle = makeStyles({
        icon: {
          marginRight: 10,
          marginLeft: 10,
          color: '#5ac2df'

        },
        dialog: {
    
          boxShadow: 'none',
        }
      });
      const [open, setOpen] = useState(false);
      const [contratIddelete, setcontratIddelete] = useState(null)
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const classes = useStyle()
    
    
      const [contratname, setNomContrat] = useState('');
    
      const [contratId, setContratId] = useState(null)
      function SelectContrat(id) {
        fetch(url+"contrats/" + id
        , {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }})
        
        
        .then((result) => {
          result.json().then((resp) => {
   
            setNomContrat(resp.contratname);
            setContratId(resp.id)
    
          })
        }).catch((e) => {

       /**   if ( e.response.status=== 401) {
              logoutfunction(e.response.status)
            } */
      })
    
    
    
    
    
      }
      const DeleteContrat = (contratId) => {
        fetch(url+'contrats/' + contratId, {
          method: 'DELETE',
          headers: {
    
            'Content-Type': 'application/json',
            Authorization:token
          },
        }).then(() => {
          setOpen(false);
          window.location.reload(false);
        }
        )
    
    
      }
    
      const Updatecontrat = () => {
    
        let contratList = { contratname }
    
    
        fetch(url+'contrats/' + contratId, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization:token
          },
          body: JSON.stringify(contratList)
        }).then(() => {
    
    
    
        }
    
        )
      }
    return(
  
    <div>
          <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
          <div className="card shadow">
     
      <div className="card-header border-0">
       
      
      </div>
      <ScrollContainer>
      <div className="table-responsive">
      {isloading?<Backdrop  open={true}>
  <CircularProgress  style={{top : '50%'}} color="black" />
  </Backdrop> :      <table  className="table table-bordered display" >
          <thead className="thead-light">
          <tr>

<th style={{width:"20%"}} scope="col">Employe</th>
<th style={{width:"20%"}} scope="col">Matricule</th>
 <th style={{width:"10%"}} scope="col">Departement</th>
 <th style={{width:"10%"}} scope="col">Role</th>
 <th style={{width:"10%"}} scope="col">Etat</th>
<th style={{width:"10%"}} scope="col">Duree</th>
 <th style={{width:"10%"}} scope="col">Pause planifie </th>
<th style={{width:"10%"}} scope="col">Pause non planifie </th>
 <th style={{width:"10%"}} scope="col">Pause dej </th>
 <th style={{width:"10%"}} scope="col">Heure Logue </th>
{/*   
 <th style={{width:"5%"}} scope="col">Statut</th>
 <th style={{width:"5%"}} scope="col">Motif</th> */}

</tr>
          </thead>
          <tbody>

     
{wfm.map(wfm =>
      <tr key={wfm.user_id}>
          <td>{wfm.user_name +" "+wfm.user_last_name }</td>
         
      

     
       <td>{wfm.user_matricule}</td>
       <td>{wfm.arborescence_nom}</td>
       <td>{wfm.role_name}</td>
        <td>{wfm.etat}</td>
       <td>{ <TimeCounter  key={wfm.user_id} startTime={wfm.depuis} />}</td>
       <td>{wfm.pauses}</td>
       <td>{wfm.pausesnonpla}</td>
       
  
       <td>{wfm.pausesdej}</td>
  

<td>{wfm.totlog}</td>
       

        </tr>
      )}

 


</tbody>
        </table>}
      </div>
      </ScrollContainer>
    </div> 
    <div className="container">





    <div className="modal fade" id="modalcontrat"  role="dialog" aria-labelledby="modalcontrat" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modifier Le Contrat</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">



            <form>



              <div className="form-group">
                <div className="input-group input-group-merge input-group-alternative">

                  <input className="form-control" placeholder="Nom de Contrat" value={contratname} name="contratname" onChange={(e) => setNomContrat(e.target.value)} type="text" />
                </div>
              </div>



              <div className="form-group"><button className="btn btn-primary" onClick={Updatecontrat}>Valider</button></div>    </form>


          </div>

        </div>
      </div>
   

</div>
</div>
          </div>
        </div>
        </div>
      </div>
    )
}
export default Rapportbusiness;