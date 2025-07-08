
import React, { useState } from 'react'
import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';


import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@mui/material/Button';

import Mouchard from '../Mouchardd/Mouchard';

import ScrollContainer from 'react-indiana-drag-scroll';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import $ from "jquery";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import frdatatable from '../../frdatatable.json'

function PointageDirecteur(){
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
   var DRH=test['DRH']
   var rolename=test['rolename']
   var iddd = test['iddep'].join(",")
   var emaildrh=test['emaildrh']
   var admin=test['admin']
   var role=test['role']
  }
  var iddep=iddd==""? undefined:iddd
  const url=process.env.React_App_URL;
  $(document).ready(function () {
    $('#teteltravtable').DataTable({
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
      ,"bDestroy": true,
      order:[[2,'asc'],[3,'asc']]
    })

  });
  const [openvalid, setopenvalid] = useState(false);
  const[idcongev,setIdcongev]=useState('')
  const[selectedconge,setselected]=useState(null )

 const[iduserrv,setIdUserrv]=useState('')
 const[datedebutv,setDatedebutv]=useState('')
 const[datefinv,setDatefinv]=useState('')
 const[validationnv,setValidationv]=useState('')
 const[validationrhhv,setValidationRHv]=useState('')
const[idchefv,setIdchefv]=useState('')
const[idrhv,setIdrhv]=useState('')
const[emailemployev,setEmailemployev]=useState('')
const[emailchefv,setEmailchefv]=useState('')
const[user_namev,setUserNameV]=useState('')
const[last_namev,setLastNameV]=useState('')

const[emailrh,setEmailRH]=useState('')
const[idrh2,setIDRH2]=useState('')
const[emailrh2,setEMailRh2]=useState('')
const[validationrh2,setValidationRH2]=useState('')
  const handleClickOpenvalid = (id,iduser,datedebut,datefin,validationn,validationrhh,chefid,rhid,emailemp,emailche,user_name,last_name,emailrh,idrh2,emailrh2,validationrh2) => {
    setopenvalid(true);
    setIdcongev(id)
    setIdUserrv(iduser)
    setDatedebutv(datedebut)
    setDatefinv(datefin)
    setValidationv(validationn)
    setValidationRHv(validationrhh)
    setIdchefv(chefid)
    setIdrhv(rhid)
    setEmailchefv(emailche)
    setEmailemployev(emailemp)
    setUserNameV(user_name)
  setLastNameV(last_name)

  setEmailRH(emailrh)
  setIDRH2(idrh2)
  setEMailRh2(emailrh2)
  setValidationRH2(validationrh2)
  };
  const handleClosevalid = () => {
    setopenvalid(false);

  };

  ///Refus
  
  const [openrefus, setopenrefus] = useState(false);
 const[idcongerefus,setIdcongeRefus]=useState('')

 const[iduserr,setIdUserr]=useState('')
 const[datedebut,setDatedebut]=useState('')
 const[datefin,setDatefin]=useState('')
 const[validationn,setValidation]=useState('')
 const[validationrhh,setValidationRH]=useState('')
const[idchef,setIdchef]=useState('')
const[idrh,setIdrh]=useState('')
const[emailemploye,setEmailemploye]=useState('')
const[emailchef,setEmailchef]=useState('')
const[user_namef,setUserNameF]=useState('')
const[last_namef,setLastNameF]=useState('')

const[emailrhf,setEmailRHf]=useState('')
const[idrh2f,setIdRH2f]=useState('')
const[emailrh2f,setEmailRH2f]=useState('')
const[validationrh2f,setValidationRH2f]=useState('')
  const handleClickOpenrefus = (id,iduser,datedebut,datefin,validationn,validationrhh,chefid,rhid,emailemp,emailche,user_namef,last_namef,emailrhf,idrh2f,emailrh2f,validationrh2ff) => {
    setopenrefus(true);
    setIdcongeRefus(id)
    setIdUserr(iduser)
    setDatedebut(datedebut)
    setDatefin(datefin)
    setValidation(validationn)
    setValidationRH(validationrhh)
    setIdchef(chefid)
    setIdrh(rhid)
    setEmailchef(emailche)
    setEmailemploye(emailemp)
    setUserNameF(user_namef)
    setLastNameF(last_namef)

    setEmailRH2f(emailrh2f)
    setEmailRHf(emailrhf)
    setIdRH2f(idrh2f)
  setValidationRH2f(validationrh2ff)
  };
  const handleCloserefus = () => {
    setopenrefus(false);
  };


  //
  const [opensupprimer, setopensupprimer] = useState(false);
 const[idcongesupp,setIdcongeSupp]=useState('')

 const valider =(id)=>{
  fetch(url +"validation/"+ id +"/"+ iduserinfo, {
method: "POST",
headers: {
  "Content-Type": "application/json", // You can adjust the content type as needed
  Authorization:token
}})
.then((response) => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  window.location.reload(false);
  // You can handle the response here if needed
  return response.json(); // or response.text() or response.blob() depending on the response type

 
})
.then((data) => {
  // Handle the data received from the server
  console.log("Response Data:", data);

})
.catch((error) => {
  // Handle errors, such as network errors or a non-2xx HTTP response
  console.error("Error:", error);
});
}

const refus =(id)=>{
  fetch(url + "refusworkflow/"+ id ,{
method: "PUT",
headers: {
  "Content-Type": "application/json", // You can adjust the content type as needed
  Authorization:token
}})
.then((response) => {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  window.location.reload();
  // You can handle the response here if needed
  return response.json(); // or response.text() or response.blob() depending on the response type
})
.then((data) => {
  // Handle the data received from the server
  console.log("Response Data:", data);
})
.catch((error) => {
  // Handle errors, such as network errors or a non-2xx HTTP response
  console.error("Error:", error);
});
}
  const handleClickOpensupprimer = (ids) => {
    setopensupprimer(true);
setIdcongeSupp(ids)
  };
  const handleClosesupprimer = () => {
    setopensupprimer(false);
  };
  const ValiderConge =async (id,iduser,datedebut,datefin,validation,validationrh,validationrh2) => {
  

     
    
    
      fetch(url+'RetrieveUpdateConge/' + id+"/"+validation+"/"+validationrh+"/"+validationrh2, {
          method: 'get',
          headers: {
          
            Authorization:token
        },
       
      }).then(() => {
       Mouchard("encours","confirmé",iduser,iduserinfo,"Validation de t�l�travail de "+datedebut+"au"+datefin)
    
    
      window.location.reload(false)
    
    
      }
    
      )
    }
  

const onClickSupprimer = (idsu) => {
     
    
  return  SupprimerConge(idsu)
};

  
  const { data: Conges = [],isloading:ll,error:ee } = useFetch(url+"listvalidation/"+iduserinfo+"/motifpointage")
  
  const[id,setIdConge]=useState(null)
  const[idconge,setidConge]=useState(null)


  const[congeIddelete,setcongeIddelete]=useState(null)
  const [open, setOpen] = useState(false);
  const useStyle = makeStyles({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      visibility:'visible'
    },
    hidesubmit: {
          visibility:'hidden'
  }
  });
  
  const classes = useStyle()
  const[iduser,setIdUser]=useState('')
  const[ddebut,setddebut]=useState('')
  const[dfin,setdfin]=useState('')
  const SupprimerConge = (id) => {

    fetch(url+'SupressionConge/' + id, {
        method: 'DELETE',
        headers: {

            'Content-Type': 'application/json',
            Authorization:token
        },
    }).then(() => {
        setOpen(false);
        Mouchard("encours","supprim�",iduser,iduserinfo,"Suppression de t�l�travail de "+ddebut+"au "+dfin)
        window.location.reload(false);
    }
    ).catch((e) => {

     /** if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })


}

const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};


const RefuserConge = (id,iduser,datedebut,datefin,validation,validationrh,validationrh2) => {

    let List = { validation,validationrh,validationrh2 }
  
  
    fetch(url+'RefusConge/' + id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization:token
        },
        body: JSON.stringify(List)
    }).then(() => {
      Mouchard("encours","refus�",iduser,iduserinfo,"Refus de t�l�travail de " +datedebut+"au "+datefin)


   window.location.reload(false)
  
    }).catch((e) => {

     /** if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })
  }
  const sendMail = (email, objet, message) => {

    const data={email,objet,message}
        fetch(url+"SendMail",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body:JSON.stringify(data)
    
          }).then(() => {
    
    
          }).catch((e) => {
    
        /**    if ( e.response.status=== 401) {
                logoutfunction(e.response.status)
              } */
        })
      }
  
return (
  <div>
{/** c.validationrh=="refus�  par manager" && iduserinfo==c.idrh2 ? "": */}
<div className="container-fluid mt-5">
<div className="row">
  <div className="col">
  <div className="card shadow">


      <ScrollContainer className="scroll-container">
      { ll==true ?<Backdrop  open={true}>
  <CircularProgress  style={{top : '50%'}} color="black" />
  </Backdrop> :
<div className="table-responsive">


<table id="teteltravtable"  className="display">

<thead>
  <tr>
    <th>Id </th>
    <th>Employé</th>


{/**    <th>Chef</th>
    <th>Avis Chef</th> */}

<th>Statut</th>
    <th>Date</th>
    <th>Heure </th>


    <th>Motif</th>

    <th>Commentaire</th>
    <th className='text-center'>Action</th>

  </tr>
</thead>
<tbody>
{
 1==1?Conges.map(c =>

  <tr>
        <td>{c.id}</td>
        <td>{c.user_name}  {c.last_name}</td>
  
   
    <td>{  c.validation==4   ?"validé" : c.validation==5 ? "annulé": c.validation==2? "validé par valideur 2 ":c.validation==1? "validé par valideur 1 ":c.validation==3? "validé par valideur 3 " : c.validation==0? "en_attente": c.validation==6? "réfusé":"" }</td>

        <td>{c.date_autorisation}</td>
        <td>{c.heuredebut}</td>
  
        <td>{c.motif}</td>
  
        <td>{c.commentaire}</td>
        <td>
          <tr>
  
        
            <td>
            {c.validation !== "4" && c.validation !== "5" && c.validation !== "6" && (
            <a className='btn-sm btn-success' onClick={()=>{setopenvalid(true) ; setselected(c.id) }}>
          

          <ThumbUpIcon className={classes.icon}/>
          
          </a>)}
          
          <Dialog
  
          BackdropProps={{ invisible: true }}
          className={classes.dialog}
          open={openvalid}
          onClose={handleClosevalid}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
            {"Valider un Pointage"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            étes-vous sur de vouloir valider ce Pointage ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosevalid}>non</Button>
            <Button onClick={()=>{valider(selectedconge)}}>
              oui
            </Button>
          </DialogActions>
          </Dialog>
  
            </td>
  
  
            <td>
            {c.validation !== "4" && c.validation !== "5" && c.validation !== "6" && (
         <a className='btn-sm btn-danger' onClick={()=>{handleClickOpenrefus() ; setselected(c.id)}}>
            <ThumbDownIcon className={classes.icon}/>
          
         </a>)}

          <Dialog
      
          BackdropProps={{ invisible: true }}
          className={classes.dialog}
          open={openrefus}
          onClose={handleCloserefus}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
            {"Refuser un Pointage"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              étes-vous sur de vouloir refuser ce Pointage ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloserefus}>non</Button>
            <Button onClick={()=>{ refus(selectedconge)}}>
              oui
            </Button>
          </DialogActions>
          </Dialog>
  
  
            </td>
  
  
  
  <td>
  
  {/* {rolename=="RH" || DRH==true|| iddep!=undefined? "":
  <a className='btn-sm btn-info' onClick={()=>{handleClickOpensupprimer(c.idconge)}}>
          
  <DeleteIcon className={classes.icon}/>
  </a>
  } */}

  </td>
  
  
          </tr>
        </td>
      </tr>):
Conges.filter(x=>x.idrh2==iduserinfo).map(c =>

<tr>
      <td>{c.id}</td>
      <td>{c.user_name}  {c.last_name}</td>
   
{/**      <td>{c.nomchef}</td>
      <td>{c.validation}</td> */}
  <td>{c.nomrh}</td> 
  <td>{c.nomrh2}</td>
  <td>{  c.validationrh2==4 || c.validationrh==3  ?"refusé" : c.validationrh2==6 || c.validationrh==5? "annulé":c.validationrh2==2? "validé":c.validationrh==1?"1 ére validation ":"en_attente" }</td>

      <td>{c.datedebut}</td>
      <td>{c.datefin}</td>

      <td>{c.motif}</td>

      <td>{c.commentaire}</td>
      <td>
        <tr>

        {((c.validationrh != 0) && (c.rh_id==iduserinfo  ) )
||  ( (c.validationrh2 != 0 ) && (c.idrh2==iduserinfo   ))

||  ( (c.validationrh2 != 0 ) && (DRH==true ))
?"":<>
          <td>
    
          <a className='btn-sm btn-success' onClick={()=>{setopenvalid(true)}}>
        
        <ThumbUpIcon className={classes.icon}/>
        
        </a>
        
   
          </td>


          <td>
       
       <a className='btn-sm btn-danger' onClick={()=>{handleClickOpenrefus(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.user_name,c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2)}}>
          <ThumbDownIcon className={classes.icon}/>
        
       </a>

          </td>
</>}


<td>

{rolename=="RH" || DRH==true|| iddep!=undefined? "":
<a className='btn-sm btn-info' onClick={()=>{handleClickOpensupprimer(c.idconge)}}>
        
<DeleteIcon className={classes.icon}/>
</a>
}
    <Dialog

    BackdropProps={{ invisible: true }}
    className={classes.dialog}
    open={opensupprimer}
    onClose={handleClosesupprimer}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">
      {"Supprimer un t�l�travail"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        �tes-vous s�r de vouloir supprimer ce t�l�travail ?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClosesupprimer}>non</Button>
      <Button onClick={()=>{onClickSupprimer(idcongesupp)}}>
        oui
      </Button>
    </DialogActions>
    </Dialog>

</td>


        </tr>
      </td>
    </tr>)}
  </tbody>
  </table>


  
    </div>
  }
  </ScrollContainer>
</div>

</div> 
</div></div></div>
)
}
export default PointageDirecteur;