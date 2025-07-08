
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

function Teletravailsoperation(){
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
   var DRH=test['DRH']
   var rolename=test['rolename']
   var iddd=test['iddep'].length==0?undefined: JSON.parse(JSON.stringify(test['iddep'])).map(x=>
    x.iddep_rh2
    ).join("")
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
       Mouchard("encours","confirmé",iduser,iduserinfo,"Validation de télétravail de "+datedebut+"au"+datefin)
    
    
      window.location.reload(false)
    
    
      }
    
      )
    }
    const onClick = (id,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,user_name,last_name,emailrh,idrh2,emailrh2,validationrh2) => {
       
      if(DRH==true ||   role=="admin"){

{/**        if (   validationrhh == 0 || validationrhh == "" ||  validationrhh == null  ||  validationrhh == undefined){
       //  sendMail(emaildrh,"IPS Time:  Avis Favorable pour la demande de téletravail "+user_name + "   " + last_name ,"Bonjour, La demande de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable  !")

         // sendMail(emailemploye,"IPS Time: Avis favorable pour la demande du téletravail du "+datedebut+" au "+datefin," Bonjour "+user_name+"&nbsp;"+last_name+"  La demande de téletravail du  "+datedebut+" au "+datefin+"   a été validé avec un avis favorable !")
         sendMail(emailrh2,"IPS Time:  Avis Favorable  pour la demande du téletravail "+user_name + "   " + last_name ,"Bonjour, La demande de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé par avec un avis favorable !")

          const validationrh=1
          if (validationn==''){
            const validation='en cours'
            return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrh,validationrh2)

          }
          else{
            const validation=validationn
            return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrh,validationrh2)

          }
        } */}
          if ( validationrh2 == 0 || validationrh2 == "" ||  validationrh2 == null  ||  validationrh2 == undefined){
           // sendMail(emaildrh,"IPS Time:  Avis Favorable pour la demande du téletravail "+user_name + "   " + last_name ,"Bonjour, La demande de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé par avec un avis favorable !")
            sendMail(emailemploye, "IPS Time: Avis Favorable pour la demande du téletravail", "Bonjour  " + user_name + "   " + last_name + ", Votre demande de téletravail du " + datedebut + " au " + datefin + "   a été validé avec un avis favorable!")
            sendMail(emailchef,"IPS Time:  Avis Favorable  pour la demande du téletravail  "+user_name + "   " + last_name ," Bonjour, La demande de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  a été validé avec un avis favorable   !")  
            sendMail(emailrh2,"IPS Time:  Avis Favorable  pour la demande du téletravail "+user_name + "   " + last_name ,"Bonjour, La demande de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  a été validé par avec un avis favorable !")
            sendMail(emailrh,"IPS Time:  Avis Favorable  pour la demande du téletravail "+user_name + "   " + last_name ,"Bonjour, La demande de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+" a été validé par avec un avis favorable !")
    
             const validationrh22=2
             if (validationn==''){
               const validation='en cours'
               return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh22)
   
             }
             else{
               const validation=validationn
               return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh22)
   
             }}
          
          
          else{
            alert('Le télétravail est déja validé')
          }
      }
    

      else if(idrh2==iduserinfo){

        if (   validationrh2 == 0 || validationrh2 == "" ||  validationrh2 == null  ||  validationrh2 == undefined){
       
          sendMail(emailemploye,"IPS Time:  Avis favorable pour la demande de téletravail","Bonjour , Votre demande de téletravail du "+datedebut+" au "+datefin+" a été validé par un avis favorable ")
          sendMail(emailchef,"IPS Time:  Avis Favorable  pour la demande  de téletravail  "+user_name + "   " + last_name ," Bonjour, La demande  de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable  !")  
          sendMail(emailrh2,"IPS Time:  Avis Favorable pour la demande  de téletravail "+user_name + "   " + last_name ," Bonjour, La demande  de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable  !")
          sendMail(emailrh,"IPS Time:  Avis Favorable  pour la demande  de téletravail  "+user_name + "   " + last_name ," Bonjour, La demande  de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable   !")  

          const validationrh22=2
        if (validationn==''){
          const validation='en cours'
          return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh22)

        }
        else{
          const validation=validationn
          return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh22)

        }}else{
          alert('Le télétravail est déja validé')
        }
      }
      else{
        alert('L employé de ce télétravail a un chef/RH')
      }

    
    };

    const onClickRefuser = (id,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,user_name,last_name,emailrhf,idrh2f,emailrh2f,validationrh2f) => {

  
      if(DRH==true ||   role=="admin"){
 if(   validationrh2f == 0 || validationrh2f == "" ||  validationrh2f == null  ||  validationrh2f == undefined){
        sendMail(emaildrh,"IPS Time:  Avis défavorable pour la demande de téletravail "+user_name + "   " + last_name ,"Bonjour, La demande de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable !")

        sendMail(emailemploye,"IPS Time:  Avis défavorable pour la demande de téletravail","Bonjour , Votre demande de téletravail du "+datedebut+" au "+datefin+" a été refusé par un avis défavorable  !")
          sendMail(emailchef,"IPS Time:  Avis défavorable  pour la demande de téletravail "+user_name + "   " + last_name ,"Bonjour, La demande de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable !")
        sendMail(emailrh2f,"IPS Time:  Avis défavorable  pour la demande du téletravail  "+user_name + "   " + last_name ,"Bonjour, La demande de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable !")
        sendMail(emailrhf,"IPS Time:  Avis défavorable  pour la demande du téletravail  "+user_name + "   " + last_name ,"Bonjour, La demande de téletravail du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable !")

          const validationrh2ff=4

          if (validationn==''){
            const validation='en cours'
            return  RefuserConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh2ff)   

          }
          else{
            const validation=validationn
            return  RefuserConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh2ff)   

          }


        }
        
        
        else{
          alert('le télétravail est déja validé')
        }
      }


  else if(idrh2f==iduserinfo){

    if ( validationrh2f == 0 || validationrh2f == "" ||  validationrh2f == null  ||  validationrh2f == undefined){
      sendMail(emailemploye,"IPS Time:  Avis défavorable pour la demande de téletravail","Bonjour , Votre demande de téletravail du "+datedebut+" au "+datefin+" a été refusé par un avis défavorable !")
      sendMail(emailchef,"IPS Time:   Avis défavorable  pour la demande du téletravail  "+user_name + "   " + last_name ," Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable   !")  
      sendMail(emailrh2f,"IPS Time:   Avis défavorable pour la demande du téletravail"+user_name + "   " + last_name ," Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable!")
      sendMail(emailrhf,"IPS Time:   Avis défavorable  pour la demande du téletravail  "+user_name + "   " + last_name ," Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable  !")  

  
      const validationrh2ff=4

    if (validationn==''){
      const validation='en cours'
      return  RefuserConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh2ff)   

    }
    else{
      const validation=validationn
      return  RefuserConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh2ff)   

    }
  
  }else{
    alert('le télétravail est déja validé')
  }

} 
  else{
    alert('L employé de ce téletravail a un chef/RH')
  }

};

const onClickSupprimer = (idsu) => {
     
    
  return  SupprimerConge(idsu)
};

  
  const { data: Conges = [],isloading:ll,error:ee } = useFetch(url+"TeletravailList_bychefRH/"+iduserinfo+"/"+iddep)
  
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
        Mouchard("encours","supprimé",iduser,iduserinfo,"Suppression de télétravail de "+ddebut+"au "+dfin)
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
      Mouchard("encours","refusé",iduser,iduserinfo,"Refus de télétravail de " +datedebut+"au "+datefin)


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
{/** c.validationrh=="refusé  par manager" && iduserinfo==c.idrh2 ? "": */}
<div className="container-fluid mt-5">
<div className="row">
  <div className="col">
  <div className="card shadow">


      <ScrollContainer className="scroll-container">
      {Conges.length==0 && ll==true?<Backdrop  open={true}>
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
 <th>Manager 1</th>
  <th>Manager 2</th>
<th>Statut</th>
    <th>d.début</th>
    <th>d.fin</th>


    <th>Motif</th>

    <th>Commentaire</th>
    <th className='text-center'>Action</th>

  </tr>
</thead>
<tbody>
{
 role=="admin" || DRH==true?Conges.filter(x=>(x.validationrh==1) ).map(c =>

  <tr>
        <td>{c.id}</td>
        <td>{c.user_name}  {c.last_name}</td>
     
  {/**      <td>{c.nomchef}</td>
        <td>{c.validation}</td> */}
    <td>{c.nomrh}</td> 
    <td>{c.nomrh2}</td>
    <td>{  c.validationrh2==4 || c.validationrh==3  ?"refusé" : c.validationrh2==6 || c.validationrh==5? "annulé":c.validationrh2==2? "validé":c.validationrh==1?"1ére validation ":"en_attente" }</td>

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
      
            <a className='btn-sm btn-success' onClick={()=>{handleClickOpenvalid(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.user_name,c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2)}}>
          
          <ThumbUpIcon className={classes.icon}/>
          
          </a>
          
          <Dialog
  
          BackdropProps={{ invisible: true }}
          className={classes.dialog}
          open={openvalid}
          onClose={handleClosevalid}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
            {"Valider un télétravail"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              êtes-vous sûr de vouloir valider ce télétravail ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosevalid}>non</Button>
            <Button onClick={()=>{onClick(idcongev,iduserrv,datedebutv,datefinv,validationnv,validationrhhv,idchefv,idrhv,emailemployev,emailchefv,user_namev,last_namev,emailrh,idrh2,emailrh2,validationrh2)}}>
              oui
            </Button>
          </DialogActions>
          </Dialog>
  
            </td>
  
  
            <td>
         
         <a className='btn-sm btn-danger' onClick={()=>{handleClickOpenrefus(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.user_name,c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2)}}>
            <ThumbDownIcon className={classes.icon}/>
          
         </a>
        
   
          
         
          
          <Dialog
      
          BackdropProps={{ invisible: true }}
          className={classes.dialog}
          open={openrefus}
          onClose={handleCloserefus}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">
            {"Refuser un télétravail"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              êtes-vous sûr de vouloir refuser ce télétravail ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloserefus}>non</Button>
            <Button onClick={()=>{onClickRefuser(idcongerefus,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,user_namef,last_namef,emailrhf,idrh2f,emailrh2f,validationrh2f)}}>
              oui
            </Button>
          </DialogActions>
          </Dialog>
  
  
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
        {"Supprimer un télétravail"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          êtes-vous sûr de vouloir supprimer ce télétravail ?
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
      </tr>):
Conges.filter(x=>x.idrh2==iduserinfo).map(c =>

<tr>
      <td>{c.id}</td>
      <td>{c.user_name}  {c.last_name}</td>
   
{/**      <td>{c.nomchef}</td>
      <td>{c.validation}</td> */}
  <td>{c.nomrh}</td> 
  <td>{c.nomrh2}</td>
  <td>{  c.validationrh2==4 || c.validationrh==3  ?"refusé" : c.validationrh2==6 || c.validationrh==5? "annulé":c.validationrh2==2? "validé":c.validationrh==1?"1ére validation ":"en_attente" }</td>

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
    
          <a className='btn-sm btn-success' onClick={()=>{handleClickOpenvalid(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.user_name,c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2)}}>
        
        <ThumbUpIcon className={classes.icon}/>
        
        </a>
        
        <Dialog

        BackdropProps={{ invisible: true }}
        className={classes.dialog}
        open={openvalid}
        onClose={handleClosevalid}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Valider un télétravail"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir valider ce télétravail ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosevalid}>non</Button>
          <Button onClick={()=>{onClick(idcongev,iduserrv,datedebutv,datefinv,validationnv,validationrhhv,idchefv,idrhv,emailemployev,emailchefv,user_namev,last_namev,emailrh,idrh2,emailrh2,validationrh2)}}>
            oui
          </Button>
        </DialogActions>
        </Dialog>

          </td>


          <td>
       
       <a className='btn-sm btn-danger' onClick={()=>{handleClickOpenrefus(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.user_name,c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2)}}>
          <ThumbDownIcon className={classes.icon}/>
        
       </a>
      
 
        
       
        
        <Dialog
    
        BackdropProps={{ invisible: true }}
        className={classes.dialog}
        open={openrefus}
        onClose={handleCloserefus}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Refuser un télétravail"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir refuser ce télétravail ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloserefus}>non</Button>
          <Button onClick={()=>{onClickRefuser(idcongerefus,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,user_namef,last_namef,emailrhf,idrh2f,emailrh2f,validationrh2f)}}>
            oui
          </Button>
        </DialogActions>
        </Dialog>


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
      {"Supprimer un télétravail"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        êtes-vous sûr de vouloir supprimer ce télétravail ?
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
export default Teletravailsoperation;