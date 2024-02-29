

import React, { useState } from 'react'
import useFetch from '../useFetch';

import { makeStyles } from '@mui/styles';


import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@mui/material/Button';

import Mouchard from '../Mouchardd/Mouchard';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import $ from "jquery";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import frdatatable from '../../frdatatable.json'
import { useSelector } from 'react-redux';
function Missionsoperation(){
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
   var DRH=test['DRH']
   var rolename=test['rolename']
   var iddd= test['iddep'].length==0?undefined: JSON.parse(JSON.stringify(test['iddep'])).map(x=>
    x.iddep_rh2
    ).join("")
   var emaildrh=test['emaildrh']
   var emailsDRHS=JSON.stringify(test['emailsDRHS'])
   var admin=test['admin']
   var role=test['role']
  }
  var iddep=iddd==""? undefined:iddd
    $(document).ready(function () {
    $('#misstable').DataTable({
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
      order:[[3,'asc'],[7,'asc']]
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
const[user_name,setUserName]=useState('')
const[last_name,setLastName]=useState('')

const[idrh2,setIdRh2]=useState('')
const[nomrh2,setNomRh2]=useState('')
const[emailrh2,setEmailRh2]=useState('')
const[emailrh,setEmailRh]=useState('')
const[validationrh2,setValidationRH2]=useState('')
  const handleClickOpenvalid = (id,iduser,datedebut,datefin,validationn,validationrhh,chefid,rhid,emailemp,emailche,user_name,last_name,idrh2,nomrh2,emailrh2,emailrh,validationrh2) => {
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
    setUserName(user_name)
    setLastName(last_name)
    setIdRh2(idrh2)
    setNomRh2(nomrh2)
    setEmailRh2(emailrh2)
    setEmailRh(emailrh)
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
const[user_namef,setUserNamef]=useState('')
const[last_namef,setLastNamef]=useState('')

const[idrh2f,setIdRh2f]=useState('')
const[nomrh2f,setNomRh2f]=useState('')
const[emailrh2f,setEmailRH2f]=useState('')
const[emailrhf,setEmailRhf]=useState('')
const[validationrh2f,setvalidationrh2f]=useState('')
  const handleClickOpenrefus = (id,iduser,datedebut,datefin,validationn,validationrhh,chefid,rhid,emailemp,emailche,user_namef,last_namef,idrh2f,nomrh2f,emailrh2f,emailrhf,validationrh2f) => {
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
    setUserNamef(user_namef)
    setLastNamef(last_namef)
    setIdRh2f(idrh2f)
    setNomRh2f(nomrh2f)
    setEmailRH2f(emailrh2f)
    setEmailRhf(emailrhf)
    setvalidationrh2f(validationrh2f)
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
       Mouchard("encours","confirmé",iduser,iduserinfo,"Validation de mission de "+datedebut+"au"+datefin)
    
    
      window.location.reload(false)
    
    
      }
    
      ).catch((e) => {

      /**  if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
    })
    }
    const onClick = (id,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,user_name,last_name,idrh2,emailrh2,nomrh2,emailrh,validationrh22) => {
       
      if(DRH==true ||   role=="admin"){

 if (  validationrh22 == 0 || validationrh22 == "" ||  validationrh22 == null  ||  validationrh22 == undefined){
   //  sendMail(emaildrh,"IPS Time:  Avis Favorable pour la demande du mission "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable !")
  // sendMail(emailchef,"IPS Time:  Avis Favorable  par rh pour la demande du mission "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable par rh!")

    //  sendMail(emailemploye,"IPS Time: Validation de mission par RH","Bonjour  "+user_name+"  "+last_name+",  Votre RH a validé le mission de votre demande du "+datedebut+" au "+datefin+"  L'avis de chef est importante pour la confirmation définitive!")
    sendMail(emailrh2,"IPS Time:  Avis défavorable  pour la demande de mission  "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable  !")

    const validationrh222=2
      if (validationn==''){
        const validation='en cours'
        return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh222)

      }
      else{
        const validation=validationn
        return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh222)

      }}      
          
          
          else{
            alert('Le mission est déja validé')
          }
          {/**        if (  validationrhh == 0 || validationrhh == "" ||  validationrhh == null  ||  validationrhh == undefined){
       //  sendMail(emaildrh,"IPS Time:  Avis Favorable pour la demande du mission "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable !")
      // sendMail(emailchef,"IPS Time:  Avis Favorable  par rh pour la demande du mission "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable par rh!")

        //  sendMail(emailemploye,"IPS Time: Validation de mission par RH","Bonjour  "+user_name+"  "+last_name+",  Votre RH a validé le mission de votre demande du "+datedebut+" au "+datefin+"  L'avis de chef est importante pour la confirmation définitive!")
        sendMail(emailrh2,"IPS Time:  Avis défavorable  pour la demande de mission  "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable !")

        const validationrh=1
          if (validationn==''){
            const validation='en cours'
            return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrh,validationrh22)

          }
          else{
            const validation=validationn
            return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrh,validationrh22)

          }}
    else */}
      }
    

      else if(iduserinfo==idrh2){
        if (validationrh22 == 0 || validationrh22 == "" ||  validationrh22 == null  ||  validationrh22 == undefined){
       
        sendMail(emailemploye,"IPS Time: avis favorable pour la demande du mission","Bonjour "+user_name+" "+last_name+",  Votre demande de mission de " + datedebut + " au " + datefin + " a été validé avec un avis favorable !")
        sendMail(emailchef,"IPS Time:  Avis Favorable  pour la demande du mission  "+user_name + "   " + last_name ," Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable  !")  
        sendMail(emailrh2,"IPS Time:  Avis Favorable pour la demande du mission "+user_name + "   " + last_name ," Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable !")
        sendMail(emailrh,"IPS Time:  Avis Favorable  pour la demande du mission  "+user_name + "   " + last_name ," Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable  !")  

        
        const validationrhh2=2
        if (validationn==''){
          const validation='en cours'
          return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrhh2)

        }
        else{
          const validation=validationn
          return      ValiderConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrhh2)

        }}else{
          alert('Le mission est déja validé')
        }
      }
      
      
      else{
        alert('L employé de cette mission a un manager')
      }

    
    };
    const onClickRefuser = (id,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,user_name,last_name,idrh2f,emailrh2f,nomrh2f,emailrhf,validationrh2f) => {

  

      if(DRH==true ||   role=="admin"){
   if (   validationrh2f == 0 || validationrh2f == "" ||  validationrh2f == null  ||  validationrh2f == undefined){
           // sendMail(emaildrh,"IPS Time:  Avis défavorable pour la demande du mission "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable !")
  
           // sendMail(emailemploye,"IPS Time: avis défavorable pour la demande du mission ","Bonjour  "+user_name+" "+last_name+", Votre RH a refusé le mission de votre demande du " + datedebut + " au " + datefin + ". L'avis de chef est importante pour la confirmation définitive!")
            //sendMail(emailchef,"IPS Time:  Avis défavorable par rh pour la demande du mission "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable par rh !")
            sendMail(emailrh2f,"IPS Time:  Avis défavorable  pour la demande de mission  "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable  !")

            const validationrh222=4
    
              if (validationn==''){
                const validation='en cours'
                return  RefuserConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh222)   
    
              }
              else{
                const validation=validationn
                return  RefuserConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrh222)   
    
              }
            
            }
          
          
          
          else{
            alert('le mission est déja validé')
          }
          {/**       if ( validationrhh == 0 || validationrhh == "" ||  validationrhh == null  ||  validationrhh == undefined){
        //  sendMail(emaildrh,"IPS Time:  Avis défavorable pour la demande du mission "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable !")

          //sendMail(emailemploye,"IPS Time: avis défavorable pour la demande du mission ","Bonjour  "+user_name+" "+last_name+", Votre RH a refusé le mission de votre demande du " + datedebut + " au " + datefin + ". L'avis de chef est importante pour la confirmation définitive!")
         // sendMail(emailchef,"IPS Time:  Avis défavorable par rh pour la demande du mission "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable par rh !")
         sendMail(emailrh2f,"IPS Time:  Avis défavorable  pour la demande de mission  "+user_name + "   " + last_name ,"Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable  !")

          const validationrh=3
  
            if (validationn==''){
              const validation='en cours'
              return  RefuserConge(id,iduserr,datedebut,datefin,validation,validationrh,validationrh2f)   
  
            }
            else{
              const validation=validationn
              return  RefuserConge(id,iduserr,datedebut,datefin,validation,validationrh,validationrh2f)   
  
            }
          
          } 
          
          else  */}
      }

  else if(idrh2f==iduserinfo){

    if ( validationrh2f == 0 || validationrh2f == "" ||  validationrh2f == null  ||  validationrh2f == undefined){
  sendMail(emailemploye,"IPS Time: Avis défavorable pour la demande de mission","Bonjour  "+user_name+"  "+last_name+",  Votre demande de mission du  " + datedebut + " au " + datefin + " a été refusé avec un avis défavorable ")
  sendMail(emailchef,"IPS Time:   Avis défavorable   pour la demande du mission  "+user_name + "   " + last_name ," Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable !")  
  sendMail(emailrh2f,"IPS Time:   Avis défavorable pour la demande du mission"+user_name + "   " + last_name ," Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable!")
  sendMail(emailrh,"IPS Time:   Avis défavorable   pour la demande du mission  "+user_name + "   " + last_name ," Bonjour, La demande de mission du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable  !")  

  
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
    alert('le mission est déja validé')
  }

} 
  else{
    alert('L employé de cette mission a un manager')
  }

};

const onClickSupprimer = (idsu) => {
     
    
  return  SupprimerConge(idsu)
};



  
  const { data: Conges = [],isloading:ll,error:ee } = useFetch(url+"TestMissionsList/"+iduserinfo+"/"+iddep)
  
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
        Mouchard("encours","supprimé",iduser,iduserinfo,"Suppression de mission de "+ddebut+"au "+dfin)
        window.location.reload(false);
    }
    ).catch((e) => {

    /**  if ( e.response.status=== 401) {
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
      Mouchard("encours","refusé",iduser,iduserinfo,"Refus de mission de " +datedebut+"au "+datefin)


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

  <div className="container-fluid mt-5">
<div className="row">
  <div className="col">
  <div className="card shadow">
{/**  <div className='card-header'id="colorcardheader">
      <h3 style={{color:"white"}}>Liste de missions</h3>
      </div> */}
<div className="table-responsive">

{Conges.length==0 && ll==true?  <Backdrop  open={true}>
  <CircularProgress  style={{top : '50%'}} color="black" />
  </Backdrop>:     

                  <table id="misstable" className="display" >

<thead>
  <tr>
    <th>Id </th>
    <th>Employé</th>
{/**    <th>Chef</th>
    <th>Avis Chef</th> */}
 <th>Manager 1</th>
    <th>Manager 2</th>

<th>Statut</th>
    <th>Solde</th>
    <th>début</th>
    <th>fin</th>


    <th>Nb jours demandés</th>



    <th className='text-center'>Action</th>
  </tr>
</thead>
<tbody>
  {
   role=="admin" || DRH==true?  
     Conges.filter(x=>(x.validationrh==1) ).map(c =>

    <tr>

 
<td>{c.idconge}</td>
      <td>{c.user_name}  {c.last_name}</td>
{/**      <td>{c.nomchef}</td>
      <td>{c.validation}</td> */}
  <td>{c.nomrh}</td>
      <td>{c.nomrh2}</td>
      <td>{  c.validationrh2==4 || c.validationrh==3  ?"refusé" : c.validationrh2==6 || c.validationrh==5? "annulé":c.validationrh2==2? "validé":c.validationrh==1?"1ére validation ":"en_attente" }</td>

      <td>{c.solde}</td>
      <td>{c.datedebut}  {c.heure_debut}</td>
      <td>{c.datefin}  {c.heure_fin}</td>
      <td>{c.nbjours}</td>
      <td>
        <tr>
        <td>      
          
            <a className="btn-sm btn-primary " data-toggle="modal" data-target={`#modalconge${c.idconge}`}  >
<RemoveRedEyeIcon className={classes.icon}/>

              </a>
              <div className="modal fade" id={`modalconge${c.idconge}`}  role="dialog" aria-labelledby={`modalconge${c.idconge}`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel"></h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">  
          
          <div className='container'>


      
           <table className=' border border-dark' >
            <tr>
              <th >Contact :</th>
              <td >{c.contact}</td>
            </tr>
            <tr>
              <th>Adresse :</th>
              <td>{c.adresse}</td>
            </tr>
            <tr>
              <th>Personne intérimaire :</th>
              <td>{c.personneinterimaire}</td>
            </tr>
            <tr>
              <th>Commentaire :</th>
              <td>{c.commentaire}</td>
            </tr>
            <tr>
              <th>Départ :</th>
              <td>{c.depart}</td>
            </tr>
            <tr>
              <th>Destination :</th>
              <td>{c.destination}</td>
            </tr>
            <tr>
              <th>Transport :</th>
              <td>{c.transport}</td>
            </tr>
            <tr>
<th>Avis Manager 1</th>
<td>{ c.validationrh==0 ? "en_attente" : c.validationrh==3  ?"1er refus" : c.validationrh==5? "1er annullation":c.validationrh==1? "1ére validation ":"" }</td>

</tr>
             
   <tr>
    <th>Avis Manager 2</th>

    <td>{ c.validationrh2==0  ? "en_attente" : c.validationrh2==4  ?"2éme refus" : c.validationrh2==6? "2éme annullation":c.validationrh2==2? "2éme validation":"" }</td>

       </tr>
       <tr>
               <th>1er Remarque :</th>
               <td>{c.remarquerh1}</td>
             </tr>  
             <tr>
               <th>2éme Remarque :</th>
               <td>{c.remarquerh2}</td>
             </tr>  

           </table>
        
           </div>


          </div>

        </div>
      </div>
   

</div></td>

{((c.validationrh != 0) && (c.rh_id==iduserinfo  ) )
||  ( (c.validationrh2 != 0 ) && (c.idrh2==iduserinfo   ))

||  ( (c.validationrh2 != 0 ) && (DRH==true ))
?"":<>
          <td>
         
        <a className='btn-sm btn-success' onClick={()=>{handleClickOpenvalid(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.user_name,c.last_name,c.idrh2,c.nomrh2,c.emailrh2,c.emailrh,c.validationrh2)}}>
        
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
          {"Valider un mission"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir valider ce mission ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosevalid}>non</Button>
          <Button onClick={()=>{onClick(idcongev,iduserrv,datedebutv,datefinv,validationnv,validationrhhv,idchefv,idrhv,emailemployev,emailchefv,user_name,last_name,idrh2,emailrh2,nomrh2,emailrh,validationrh2)}}>
            oui
          </Button>
        </DialogActions>
        </Dialog>
          </td>
          <td>
       <a className='btn-sm btn-danger' onClick={()=>{handleClickOpenrefus(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.user_name,c.last_name,c.idrh2,c.nomrh2,c.emailrh2,c.emailrh,c.validationrh2)}}>
     
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
          {"Refuser un mission"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir refuser cette mission ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloserefus}>non</Button>
          <Button onClick={()=>{onClickRefuser(idcongerefus,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,user_namef,last_namef,idrh2f,emailrh2f,nomrh2f,emailrhf,validationrh2f)}}>
            oui
          </Button>
        </DialogActions>
        </Dialog>
        
          </td>
          </>}



          
<td>
{rolename=="RH" || DRH==true || iddep!=undefined? "":
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
      {"Supprimer un mission"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        êtes-vous sûr de vouloir supprimer ce mission ?
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

 
<td>{c.idconge}</td>
      <td>{c.user_name}  {c.last_name}</td>
{/**      <td>{c.nomchef}</td>
      <td>{c.validation}</td> */}
  <td>{c.nomrh}</td>
      <td>{c.nomrh2}</td>
      <td>{  c.validationrh2==4 || c.validationrh==3  ?"refusé" : c.validationrh2==6 || c.validationrh==5? "annulé":c.validationrh2==2? "validé":c.validationrh==1?"1ére validation ":"en_attente" }</td>

      <td>{c.solde}</td>
      <td>{c.datedebut}  {c.heure_debut}</td>
      <td>{c.datefin}  {c.heure_fin}</td>
      <td>{c.nbjours}</td>
      <td>
        <tr>
        <td>      
          
            <a className="btn-sm btn-primary " data-toggle="modal" data-target={`#modalconge${c.idconge}`}  >
<RemoveRedEyeIcon className={classes.icon}/>

              </a>
              <div className="modal fade" id={`modalconge${c.idconge}`}  role="dialog" aria-labelledby={`modalconge${c.idconge}`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel"></h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">  
          
          <div className='container'>


      
           <table className=' border border-dark' >
            <tr>
              <th >Contact :</th>
              <td >{c.contact}</td>
            </tr>
            <tr>
              <th>Adresse :</th>
              <td>{c.adresse}</td>
            </tr>
            <tr>
              <th>Personne intérimaire :</th>
              <td>{c.personneinterimaire}</td>
            </tr>
            <tr>
              <th>Commentaire :</th>
              <td>{c.commentaire}</td>
            </tr>
            <tr>
              <th>Départ :</th>
              <td>{c.depart}</td>
            </tr>
            <tr>
              <th>Destination :</th>
              <td>{c.destination}</td>
            </tr>
            <tr>
              <th>Transport :</th>
              <td>{c.transport}</td>
            </tr>
            <tr>
<th>Avis Manager 1</th>
<td>{ c.validationrh==0 ? "en_attente" : c.validationrh==3  ?"1er refus" : c.validationrh==5? "1er annullation":c.validationrh==1? "1ére validation ":"" }</td>

</tr>
             
   <tr>
    <th>Avis Manager 2</th>

    <td>{ c.validationrh2==0  ? "en_attente" : c.validationrh2==4  ?"2éme refus" : c.validationrh2==6? "2éme annullation":c.validationrh2==2? "2éme validation":"" }</td>

       </tr>

           </table>
        
           </div>


          </div>

        </div>
      </div>
   

</div></td>

{((c.validationrh != 0) && (c.rh_id==iduserinfo  ) )
||  ( (c.validationrh2 != 0 ) && (c.idrh2==iduserinfo   ))

||  ( (c.validationrh2 != 0 ) && (DRH==true ))
?"":<>
          <td>
         
        <a className='btn-sm btn-success' onClick={()=>{handleClickOpenvalid(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.user_name,c.last_name,c.idrh2,c.nomrh2,c.emailrh2,c.emailrh,c.validationrh2)}}>
        
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
          {"Valider un mission"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir valider ce mission ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosevalid}>non</Button>
          <Button onClick={()=>{onClick(idcongev,iduserrv,datedebutv,datefinv,validationnv,validationrhhv,idchefv,idrhv,emailemployev,emailchefv,user_name,last_name,idrh2,emailrh2,nomrh2,emailrh,validationrh2)}}>
            oui
          </Button>
        </DialogActions>
        </Dialog>
          </td>
          <td>
       <a className='btn-sm btn-danger' onClick={()=>{handleClickOpenrefus(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.user_name,c.last_name,c.idrh2,c.nomrh2,c.emailrh2,c.emailrh,c.validationrh2)}}>
     
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
          {"Refuser un mission"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir refuser cette mission ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloserefus}>non</Button>
          <Button onClick={()=>{onClickRefuser(idcongerefus,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,user_namef,last_namef,idrh2f,emailrh2f,nomrh2f,emailrhf,validationrh2f)}}>
            oui
          </Button>
        </DialogActions>
        </Dialog>
        
          </td>
          </>}



          
<td>
{rolename=="RH" || DRH==true || iddep!=undefined? "":
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
      {"Supprimer un mission"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        êtes-vous sûr de vouloir supprimer ce mission ?
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

</table>}
     
  
    </div>

</div>

</div> 
</div></div></div>
)
}
export default Missionsoperation;