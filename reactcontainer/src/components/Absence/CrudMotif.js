import useFetch from '../useFetch';

import AjouterMotif from './AjouterMotif';
import * as React from 'react';

import { makeStyles } from '@mui/styles';



import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";

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
function CrudMotif() {
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    
    var absenceedit = test['absenceedit']
    var absencedelete = test['absencedelete']
  }
 
  
 
  
  $(document).ready(function () {
    $('#motiftable').DataTable({
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
  const[motifmission,setmotifMission]=useState(false)
const[motifteletravail,setMotifTeletravail]=useState(false)
const[motifautorisation,setmotifaut]=useState(false)
const[motifdemanderh,setmotifrh]=useState(false)
const[nbjours_retire,setnbjours_retire]=useState('')
const[motifdemijournne,setmotifdemijournne]=useState(false)
const [justifie,setJustifie]=useState(false)

const[congemaladie,setCongeMaladie]=useState('')

const handleChangeMaladie=()=>{
  setCongeMaladie(!congemaladie)
}
const handleChangeJustifie=()=>{
  setJustifie(!justifie)
}
const handleChangemotifdemijournne=()=>{
  setmotifdemijournne(!motifdemijournne)
}
  const handleChangeMotifMission = () => {
   setmotifMission(!motifmission)
  };
  
  const handleChangeMotifAutorisation = () => {
    setmotifaut(!motifautorisation)
   };
   const handleChangeMotifRH = () => {
    setmotifrh(!motifdemanderh)
   };
   const handleChangePointage=()=>{
    setpointage(!motifpointage)
  }
  const { data: motifs = [] } = useFetch(url+"motif/")

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
  const [motifIddelete, setmotifIddelete] = useState(null)
  const [motif, setNomMotif] = useState('')
  const [motifId, setMotifId] = useState(null)
  const[nombrejours_ouvres,setnombrejours_ouvres]=useState(null)
  const[motifConge,setmotifConge]=useState(false)
  const[motifpointage,setpointage]=useState(false)

  const handleChangeMotifCongé = () => {
    setmotifConge(!motifConge)
   };
   const handlechangeMotifTéletravail=()=>{
    setMotifTeletravail(!motifteletravail)
   }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyle()



  function SelectMotif(id) {
    fetch(url+"motif/" + id, {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
      result.json().then((resp) => {
        setNomMotif(resp.motif);
        setMotifId(resp.id)
setmotifConge(resp.motifConge)
setmotifMission(resp.motifmission)
setMotifTeletravail(resp.motifteletravail)
setnbjours_retire(resp.nbjours_retire)
setmotifdemijournne(resp.motifdemijournne)
setnombrejours_ouvres(resp.nombrejours_ouvres)
setJustifie(resp.justifie)
setCongeMaladie(resp.congemaladie)
setmotifaut(resp.motifautorisation)
setmotifrh(resp.motifdemanderh)
setpointage(resp.motifpointage)
      })
    }).catch((e)=>{
     /** if ( e.response.status=== 401) {
        logoutfunction(e.response.status)
      } */
    })





  }
  const DeleteMotif = (motifId) => {
    fetch(url+'motif/' + motifId, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json',
        Authorization:token
      },
    }).then(() => {
      setOpen(false);
      window.location.reload(false);
    }
    ).catch((e)=>{
     /** if ( e.response.status=== 401) {
        logoutfunction(e.response.status)
      } */
    })


  }

  const Updatemotif = () => {
    if (motifdemijournne==true){
      const nbjours_retire=0.5;
    let motifList = { motif,nombrejours_ouvres,motifConge,motifmission,motifteletravail,nbjours_retire ,motifdemijournne,justifie,congemaladie , motifautorisation , motifdemanderh , motifpointage}


    fetch(url+'motif/' + motifId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization:token
      },
      body: JSON.stringify(motifList)
    }).then(() => {



    }

    ).catch((e)=>{
      /**if ( e.response.status=== 401) {
        logoutfunction(e.response.status)
      } */
    })
  
  
  }else{
      const nbjours_retire=1;
      let motifList = { motif,nombrejours_ouvres,motifConge,motifmission,motifteletravail,nbjours_retire ,motifdemijournne,justifie,congemaladie , motifautorisation , motifdemanderh}
  
  
      fetch(url+'motif/' + motifId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization:token
        },
        body: JSON.stringify(motifList)
      }).then(() => {
  
  
  
      }
  
      ).catch((e)=>{
       /** if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
      })
    }
  }
  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">
{/**            <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Motifs</h3>
      </div> */}
              <div className="card-header border-0">
              {absenceedit && 
                <AjouterMotif />}
              </div>
              <ScrollContainer>
          { motifs.length==0 ?  
       "":   <div className="table-responsive">
       <table className="table table-bordered display" id="motiftable">
         <thead className="thead-light">
           <tr>

             <th scope="col">Motifs</th>
             <th scope="col">type de Motif</th>
             <th scope="col">Maximum</th>
             <th scope="col">Payé</th>
             <th scope="col">Justifié</th>
            
             <th scope="col">Demande RH </th>
             <th scope="col">Autorisation </th>

              <th scope="col">Action</th>

           </tr>
         </thead>
         <tbody>


           {motifs.map(mot =>
             <tr key={mot.id}>
               <td>{mot.motif}</td>
        
                 <td>{mot.motifConge ? "congé" : mot.motifmission ? "mission" : mot.motifteletravail? "téletravail ":mot.motifdemijournne?"demi-journée":"Absence"}</td>

            
               <td>
                 {mot.nombrejours_ouvres ==null ? "0" : mot.nombrejours_ouvres }

               </td>
                   
               <td>
               {mot.justifie==true ? "oui" : "Non"}
           

               </td>
               <td>
               {mot.congemaladie==true ? "oui" : "Non"}
           

               </td>
               <td>
               {mot.motifdemanderh==true ? "oui" : "Non"}
           

               </td>
               <td>
           
               {mot.motifautorisation==true ? "oui" : "Non"}

               </td>
               <td>
                 <div className="row">

                   <div className="col-md-6">

                   { absenceedit &&  <a onClick={() => SelectMotif(mot.id)} data-toggle="modal" data-target="#modalmotif" ><EditIcon
                       className={classes.icon}
                     /></a> }
                   </div>
                   <div className="col-md-6">
                    { absencedelete && <a onClick={() => { handleClickOpen(); setmotifIddelete(mot.id); }}  ><DeleteIcon className={classes.icon} /></a>}


                   </div>
                 </div>
               </td>
             </tr>
           )}

           <Dialog

             BackdropProps={{ invisible: true }}
             className={classes.dialog}
             open={open}
             onClose={handleClose}
             aria-labelledby="alert-dialog-title"
             aria-describedby="alert-dialog-description"
           >
             <DialogTitle id="alert-dialog-title">
               {"supprimer un motif"}
             </DialogTitle>
             <DialogContent>
               <DialogContentText id="alert-dialog-description">
                 êtes-vous sûr de vouloir supprimer un motif ?
               </DialogContentText>
             </DialogContent>
             <DialogActions>
               <Button onClick={handleClose}>non</Button>
               <Button onClick={() => { DeleteMotif(motifIddelete) }}>
                 oui
               </Button>
             </DialogActions>
           </Dialog>




         </tbody>
       </table>
     </div>}</ScrollContainer>
          
            
            </div>
            <div className="container">

              <div className="row">
                <div className="col-md-3">



                  <div className="modal fade" id="modalmotif" role="dialog" aria-labelledby="modalmotif" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Modifier un motif</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">



                          <form>



                            <div className="form-group">
                              <div className="input-group input-group-merge input-group-alternative">

                                <input className="form-control" placeholder="Nom de motif" value={motif} name="rolename" onChange={(e) => setNomMotif(e.target.value)} type="text" />
                              </div>
                            </div>
                            <div className='row '>
  <div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} checked={motifConge ? true:false}  label='congé' value={motifConge} onChange={handleChangeMotifCongé} />
</div>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} checked={motifautorisation ? true:false}  label='Autorisation' value={motifautorisation} onChange={handleChangeMotifAutorisation} />
</div>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} checked={motifdemanderh ? true:false}  label='Demande RH ' value={motifdemanderh} onChange={handleChangeMotifRH} />
</div>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} checked={motifpointage ? true:false}  label=' Pointage ' value={motifpointage} onChange={handleChangePointage} />
</div>
<div className='col-md-4'>
  
<FormControlLabel control={<Checkbox/>} checked={motifmission ? true:false} label='mission' value={motifmission} onChange={handleChangeMotifMission}  />
</div>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} checked={motifteletravail ? true:false} label='téletravail' value={motifteletravail} onChange={handlechangeMotifTéletravail}  />
</div>
</div>
<div className='row pl-3'>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} checked={motifdemijournne ? true:false} label='demi journée' value={motifdemijournne} onChange={handleChangemotifdemijournne}  />

</div>
  </div>
  {motifConge==true ?
<div className="form-group">
  <label for="ouvres">Maximum</label>
<input className="form-control" id="ouvres" placeholder="Maximum" type="number" step="1" value={nombrejours_ouvres} onChange={(e)=>{setnombrejours_ouvres(e.target.value)}} />
</div>

:""}
{motifConge==true|| motifdemijournne==true?


<div className='row pl-3'>
<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} checked={justifie ? true:false} label='Payé' value={justifie} onChange={handleChangeJustifie} />
</div><div className='col-md-4'>


<FormControlLabel control={<Checkbox/>} label='Justifié' checked={congemaladie ? true:false}  value={congemaladie} onChange={handleChangeMaladie} /></div></div>



:""
}
  


                            <div className="form-group"><button className="btn btn-primary" onClick={Updatemotif}>Valider</button></div>    </form>


                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>



          </div></div></div></div>
  )



}


export default CrudMotif;