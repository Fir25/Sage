

import ImporterPointage from './ImporterPointage'

import useFetch from '../useFetch';


import * as React from 'react';

import { makeStyles } from '@mui/styles';



import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import $ from "jquery";
import Mouchard from '../Mouchardd/Mouchard';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useSelector } from 'react-redux';
import frdatatable from '../../frdatatable.json'
function CrudPointages() {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const url=process.env.React_App_URL;
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
    var pointageedit=test['pointageedit']
    var pointagedelete=test['pointagedelete']
  
    
  }
  const[openn,setOpenn]=useState(false)
  const [post,setPost]=useState(false)
  React.useEffect(()=>{

    
    if (pointages.length==0){
  
    setOpenn(true)
  setPost(false)
  
    }else{
    setOpenn(false)
    setPost(true)}
  }
  ,[openn,post])
  const { data: pointeuses} = useFetch(url+"pointeuse/")
  const { data: employees } = useFetch(url+"user/")
  const { data: pointages = [],isloading:ll,error:ee} = useFetch(url+"PointagesEmploye/"+iduserinfo)

  const [date_pointage, setDatePointage] = useState('');
  const [employes, setemploye] = useState('');
  const [pointeuse, setPointeuse] = useState(null);
 
  
  const [pointageId, setPointageId] = useState(null)
  const [pointageIddelete, setPointageIddelete] = useState(null)
  const [file, setFichier] = useState()
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const useStyle = makeStyles({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      color: '#5ac2df'






,

    },
    dialog: {

      boxShadow: 'none',
    }
  });
  const[dapointage,setdapointage]=useState('')
  const classes = useStyle()
 
  function SelectPointage(id) {
    fetch(url+"pointage/" + id, {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
      result.json().then((resp) => {









        setDatePointage(resp.date_pointage);
        setemploye(resp.employes);

        setPointeuse(resp.pointeuse);
        setPointageId(resp.id)
      
      setdapointage(resp.date_pointage)
      })
    }).catch((e) => {

/**      if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })





  }
  const ImpoterFichier=(e)=>{
    

   const formdata=new FormData()
   formdata.append("file",file)




    e.preventDefault()
    
    fetch(url+"ImportPointageCSV/",
      {
        method: "POST",
        headers: {
      
          Authorization: token,
        },
        body: formdata
      }).then((data) => {
       window.location.reload(false)
  }).catch((e) => {


})

  }
  const DeletePointage = (id) => {
    fetch(url+'deletpointage/' + id, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then(() => {
      setOpen(false);
      Mouchard("en cours","supprimé",employ,iduserinfo,"Supprimer un pointage")
      window.location.reload(false);
    }
    ).catch((e) => {

  
  })


  }
  const UpdatePointage = () => {

    let pointageList = { date_pointage, employes, pointeuse }
    console.warn("item", pointageList)

    fetch(url+'updatepointage/' + pointageId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(pointageList)
    }).then((response) =>{
      if(!response.ok) throw new Error(response.status);
      else window.location.reload(false)

  }).then(() => {

      if(date_pointage!=dapointage){
        Mouchard(dapointage,date_pointage,employes,iduserinfo,"Modifier : date et heure de pointage")
        }

    }

    ).catch((e) => {

   
  })
  }

const[employ,setEmploId]=useState('')

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

  return (
    <div>
    <div className="container-fluid mt-5">
  <div className="row">
    <div className="col">
      
    <div className="card shadow">
{/**    <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Pointages</h3>
      </div> */}
      
    <div className='row' style={{marginLeft:"10px",marginTop:"4px"}}>
   { pointageedit == true &&
    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#Importercsv">
       Importer Fichier CSV
        </button>
   } 
        <div className="modal fade" id="Importercsv"  role="dialog" aria-labelledby="Importercsv" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Importer les Pointages</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">



                <form>
                <div className="form-group">
                <input type="file"  name="myImage" onChange={(event)=>{setFichier(event.target.files[0])}}/>

                  </div>

                  <div className="form-group">
                    
                    
                    <button className="btn btn-primary" type="submit" onClick={ImpoterFichier} >Valider</button>
                    
                    </div>



                </form>
               

              </div>

              <div className="modal-footer">



              </div>

            </div>
          </div>
      
    </div>
      </div>
<div className="card-header border-0">

            {pointageedit == true && <ImporterPointage /> }
       
            </div>
            <ScrollContainer>
          {post?   
            <div className="table-responsive">
        <table className="table table-bordered display" id="pointagestable">
          <thead className="thead-light">
            <tr>
                    <th scope="col">Date et heure de  pointage</th>
                    <th scope="col">Employe</th>
                 
                
                
                  
                  <th scope="col">état</th>
                {/**    <th scope="col">Action</th> */}

                  </tr>
                </thead>
                <tbody>

                  {pointages.map(pointage =>
                    <tr key={pointage.id}>
                      <td>{pointage.date_pointage}</td>
                      <td>{pointage.employe + "  "+pointage.last_name}</td>
                 
                 
                      <td>{pointage.etat==0?"entrée":"sortie"}  {pointage.pause}</td>
     {/**                 <td>
                        <div className="row">
                          <div className="col-md-6">

                            <a onClick={() => SelectPointage(pointage.id)} data-toggle="modal" data-target="#pointageupdate" ><EditIcon
                              className={classes.icon}
                            /></a>
                          </div>
                          <div className="col-md-6">
                            <a onClick={() => { handleClickOpen(); setPointageIddelete(pointage.id); setEmploId(pointage.employe)}}  ><DeleteIcon className={classes.icon} /></a>


                          </div>
                        </div>
                      </td> */}
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
                      {"supprimer un pointage"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        êtes-vous sûr de vouloir supprimer ce pointage ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>non</Button>
                      <Button onClick={() => { DeletePointage(pointageIddelete) }}>
                        oui
                      </Button>
                    </DialogActions>
                  </Dialog>
                </tbody>
              </table>
            </div>
 :( <>{pointages.length==0 && ll==true ? <Backdrop  open={openn}>
  <CircularProgress  style={{top : '50%'}} color="black" />
  </Backdrop>:setPost(true)}</>)
  
  
  }</ScrollContainer>  
          </div>

          <div className="container">

            <div className="row">
              <div className="col-md-3">



                <div className="modal fade" id="pointageupdate"  role="dialog" aria-labelledby="pointageupdate" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="pointageupdate">Modifier Pointage</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">



                        <form>

                        <div className="row">


<div className="col-md-6">

                          <div className="form-group">
                            <div className="input-group input-group-merge input-group-alternative">

                              <input className="form-control" placeholder="Nom et Prénom Utilisateur" value={date_pointage} name="date" onChange={(e) => setDatePointage(e.target.value)} type="datetime-local" />
                            </div>
                          </div>
                          </div>
                         
                    </div>
                          <div className="row">


                            <div className="col-md-6">


                            

                              <TextField
                              id="outlined-select-currency"
                              select
                              label=""
                              value={pointeuse}
                                onChange={(e) => { setPointeuse(e.target.value) }}
                              helperText="Please select pointeuse"
                              margin='normal'
                              fullWidth
                            >
                              {pointeuses.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                {option.nom_pointeuse}
                                </MenuItem>
                              ))}

                            </TextField>
                            </div>
                        
                          </div>
                          <div className="row">
                          <div className="col-md-6">
                            <TextField
                              id="outlined-select-currency"
                              select
                              label="employé"
                              value={employes}
                              onChange={(e) => { setemploye(e.target.value) }}
                              helperText="Please select employé"
                              margin='normal'
                              fullWidth
                            >
                              {employees.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.user_name +"  "+option.last_name}
                                </MenuItem>
                              ))}

                            </TextField>
                          </div>
</div>

                          <div className="form-group"><button className="btn btn-primary" onClick={UpdatePointage}>Valider</button></div>    </form>


                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div></div></div></div>)

}
export default CrudPointages;