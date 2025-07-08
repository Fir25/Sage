
import React, { useEffect, useState } from 'react'
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
import ScrollContainer from 'react-indiana-drag-scroll';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import { useSelector } from 'react-redux';

import frdatatable from '../../frdatatable.json'
import { TextField } from '@mui/material';
function CrudCongé() {
  const url=process.env.React_App_URL;
  const url2=process.env.React_App_URL2;
  const userinfo =useSelector(state => state.userinfo);//données d'utilisateur connecté à l'aide de redux
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
   var DRH=test['DRH']
   var rolename=test['rolename']
   var iddd= test['iddep'].length==0?undefined: JSON.parse(JSON.stringify(test['iddep'])).map(x=>
    x.iddep_rh1
    ).join("")//test['iddep'] retourne json of rh1,rh2 par ce que l'utilisateur peut etre un manager1 sur département et manager 2 sur un autre département 
    var emaildrh=test['emaildrh']


   var role=test['role']
  }

  var iddep=iddd==""? undefined:iddd
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  $(document).ready(function () {
    $('#congesTable').DataTable({
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
  const [idcongev, setIdcongev] = useState('')

  const [iduserrv, setIdUserrv] = useState('')
  const [datedebutv, setDatedebutv] = useState('')
  const [datefinv, setDatefinv] = useState('')
  const [validationnv, setValidationv] = useState('')
  const [validationrhhv, setValidationRHv] = useState('')
  const [idchefv, setIdchefv] = useState('')
  const [idrhv, setIdrhv] = useState('')
  const [emailemployev, setEmailemployev] = useState('')
  const [emailchefv, setEmailchefv] = useState('')
  const [user_name, setUserName] = useState('')
  const [last_name, setLastName] = useState('')

  const[emailrh,setEmailRh]=useState('')
  const[idrh2,setIdRH2]=useState('')
  const[emailrh2,setEmailRh2]=useState('')
  const[validationrh2,setValidationrh2]=useState('')
  const handleClickOpenvalid = (id, iduser, datedebut, datefin, validationn, validationrhh, chefid, rhid, emailemp, emailche, user_name, last_name,emailrh,idrh2,emailrh2,validationrh2) => {
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
    setEmailRh(emailrh)
    setIdRH2(idrh2)
    setEmailRh2(emailrh2)
    setValidationrh2(validationrh2)
  };

  const handleClosevalid = () => {
    setopenvalid(false);

  };



  const [openrefus, setopenrefus] = useState(false);
  const [idcongerefus, setIdcongeRefus] = useState('')

  const [iduserr, setIdUserr] = useState('')
  const [datedebut, setDatedebut] = useState('')
  const [datefin, setDatefin] = useState('')
  const [validationn, setValidation] = useState('')
  const [validationrhh, setValidationRH] = useState('')
  const [idchef, setIdchef] = useState('')
  const [idrh, setIdrh] = useState('')
  const [emailemploye, setEmailemploye] = useState('')
  const [emailchef, setEmailchef] = useState('')
  const [user_namef, setUserNamef] = useState('')
  const [last_namef, setLastNamef] = useState('')

  const[emailrhf,setEmailRhf]=useState('')
  const[idrh2f,setIdrh2f]=useState('')
  const[emailrh2f,setEmailRh2f]=useState('')
  const[validationrh2f,setValidationRH2f]=useState('')
  const[remarquerh1ref,setRemarqueRh1ref]=useState('')
  const[remarquerh2f,seRemarquerh2f]=useState('')
  const handleClickOpenrefus = (id, iduser, datedebut, datefin, validationn, validationrhh, chefid, rhid, emailemp, emailche, user_namef, last_namef,emailrhf,idrh2f,emailrh2f,validationrh2f,remarquerh11ff,remarquerh22f) => {
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
    setEmailRhf(emailrhf)
    setIdrh2f(idrh2f)
    setEmailRh2f(emailrh2f)
    setValidationRH2f(validationrh2f)
    setRemarqueRh1ref(remarquerh11ff)
    seRemarquerh2f(remarquerh22f)
  };
  const handleCloserefus = () => {
    setopenrefus(false);
  };

const formRef = React.useRef();
const formRefrefuser = React.useRef();
const [remarquerefuser,setRemarquerefuser]=useState('')
const [remarque,setRemarque]=useState('')
  const [openannuller, setopenannuller] = useState(false);
  const [idcongeannuller, setIdcongeannuller] = useState('')

  const [iduserrannuller, setIdUserrannuller] = useState('')
  const [datedebutannuller, setDatedebutannuller] = useState('')
  const [datefinannuller, setDatefinannuller] = useState('')
  const [validationnannuller, setValidationannuller] = useState('')
  const [validationrhhannuller, setValidationRHannuller] = useState('')
  const [idchefannuller, setIdchefannuller] = useState('')
  const [idrhannuller, setIdrhannuller] = useState('')
  const [emailemployeannuller, setEmailemployeannuller] = useState('')
  const [emailchefannuller, setEmailchefannuller] = useState('')
  const [user_namefannuller, setUserNamefannuller] = useState('')
  const [last_namefannuller, setLastNamefannuller] = useState('')

  const[emailrhfannuller,setEmailRhfannuller]=useState('')
  const[idrh2fannuller,setIdrh2fannuller]=useState('')
  const[emailrh2fannuller,setEmailRh2fannuller]=useState('')
  const[validationrh2annull,setvalidationrh2annuller]=useState('')
  const [remarquerh1annul,setRemarqueRH1Ann]=useState('')
  const [remarquerh2annul,setRemarqueRH2Ann]=useState('')
  const handleClickOpenAnnuller=(id, iduser, datedebut, datefin, validationn, validationrhh, chefid, rhid, emailemp, emailche, user_namef, last_namef,emailrhf,idrh2f,emailrh2f,validationrh2,remarquerh1,remarquerh2)=>{
    setopenannuller(true);
    setIdcongeannuller(id)
    setIdUserrannuller(iduser)
    setDatedebutannuller(datedebut)
    setDatefinannuller(datefin)
    setValidationannuller(validationn)
    setValidationRHannuller(validationrhh)
    setIdchefannuller(chefid)
    setIdrhannuller(rhid)
    setEmailchefannuller(emailche)
    setEmailemployeannuller(emailemp)
    setUserNamefannuller(user_namef)
    setLastNamefannuller(last_namef)
    setEmailRhfannuller(emailrhf)
    setIdrh2fannuller(idrh2f)
    setEmailRh2fannuller(emailrh2f)
    setvalidationrh2annuller(validationrh2)
    setRemarqueRH2Ann(remarquerh2)
    setRemarqueRH1Ann(remarquerh1)

  }
const handleCloseannuller=()=>{
 setopenannuller(false)
}


  //
  const [opensupprimer, setopensupprimer] = useState(false);
  const [idcongesupp, setIdcongeSupp] = useState('')
  const handleClickOpensupprimer = (ids) => {
    setopensupprimer(true);
    setIdcongeSupp(ids)
  };
  const handleClosesupprimer = () => {
    setopensupprimer(false);
  };
  const ValiderConge = async (id, iduser, datedebut, datefin, validation, validationrh,validationrh2) => {





    fetch(url+'RetrieveUpdateConge/' + id + "/" + validation + "/" + validationrh+"/"+validationrh2, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      }

    }).then(() => {
      Mouchard("encours", "confirmé", iduser, iduserinfo, "Validation de congé de " + datedebut + "au" + datefin)


    window.location.reload(false)


    }

    )
  }
  const onClick = (id, iduserr, datedebut, datefin, validationn, validationrhh, idchef, idrh, emailemploye, emailchef, user_name, last_name,emailrh,idrh2,emailrh2,validationrh22) => {

    if (DRH == true ||   role=="admin") {//si utilisateur connecté est un admin ou drh
 
      if ( validationrhh == 0 || validationrhh == "" ||  validationrhh == null  ||  validationrhh == undefined) {//si validation est en attente
       // sendMail(emaildrh,"IPS Time:  Avis Favorable pour la demande du congé "+user_name + "   " + last_name ,"Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé par avec un avis favorable !")
       // sendMail(emailemploye, "IPS Time: Avis Favorable pour la demande du congé", "Bonjour  " + user_name + "   " + last_name + ", Votre RH a validé le congé de votre demande du " + datedebut + " au " + datefin + "  L'avis de chef est importante pour la confirmation définitive!")
      //  sendMail(emailchef,"IPS Time:  Avis Favorable par rh pour la demande du congé  "+user_name + "   " + last_name ," Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable par  rh  !")  
      sendMail(emailrh2,"IPS Time:  Avis Favorable  pour la demande du congé "+user_name ,"Bonjour, La demande de congé du collaborateur "+user_name +"  du "+datedebut+" au "+datefin+"  est validé par avec un avis favorable !")

        const validationrh = 1//1er validation
        if (validationn == '') {
          const validation = 'en cours'
          return ValiderConge(id, iduserr, datedebut, datefin, validation, validationrh,validationrh22)

        }
        else {
          const validation = validationn
          return ValiderConge(id, iduserr, datedebut, datefin, validation, validationrh,validationrh22)

        }
      } 

      
      
      
      else {
        alert('Le congé est déja validé')
      }
    {/**  else    if (validationrh22 == 0 || validationrh22 == "" ||  validationrh22 == null  ||  validationrh22 == undefined ){
        sendMail(emaildrh,"IPS Time:  Avis Favorable pour la demande du congé "+user_name ,"Bonjour, La demande de congé du collaborateur "+user_name +"  du "+datedebut+" au "+datefin+"  est validé par avec un avis favorable !")
        sendMail(emailemploye, "IPS Time: Avis Favorable pour la demande du congé", "Bonjour  " + user_name  + ", Votre DRH a validé le congé de votre demande du " + datedebut + " au " + datefin + "  ")
        sendMail(emailchef,"IPS Time:  Avis Favorable  pour la demande du congé  "+user_name  ," Bonjour, La demande de congé du collaborateur "+user_name + "  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable !")  
        sendMail(emailrh2,"IPS Time:  Avis Favorable  pour la demande du congé "+user_name  ,"Bonjour, La demande de congé du collaborateur "+user_name +"  du "+datedebut+" au "+datefin+"  est validé par avec un avis favorable !")
        sendMail(emailrh,"IPS Time:  Avis Favorable pour la demande du congé "+user_name  ,"Bonjour, La demande de congé du collaborateur "+user_name +"  du "+datedebut+" au "+datefin+"  est validé par avec un avis favorable!")

        const validationrh22 = 2
        if (validationn == '') {
          const validation = 'en cours'
          return ValiderConge(id, iduserr, datedebut, datefin, validation, validationrhh,validationrh22)

        }
        else {
          const validation = validationn
          return ValiderConge(id, iduserr, datedebut, datefin, validation, validationrhh,validationrh22)

        }
      } */}
    }

    else if ((idrh==iduserinfo)) {//si utilisateur connecté est un manager1 
      //array1.find(element => element > 10);
   
      if (  validationrhh == 0 || validationrhh == "" ||  validationrhh == null  ||  validationrhh == undefined) {
       // sendMail(emailemploye, "IPS Time:Avis Favorable pour la demande du congé", "Bonjour " + user_name + "  " + last_name + ",  Votre manager a validé le congé de votre demande du " + datedebut + " au " + datefin + " .   L'avis de chef est importante pour la confirmation définitive!")
        //sendMail(emailchef,"IPS Time:  Avis Favorable par manager 1 pour la demande du congé  "+user_name + "   " + last_name ," Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable par manager 1  !")  
       // sendMail(emailrh,"IPS Time:  Avis Favorable pour la demande du congé "+user_name + "   " + last_name ," Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable !")
        sendMail(emailrh2,"IPS Time:  Avis Favorable  pour la demande du congé  "+user_name  ," Bonjour, La demande de congé du collaborateur "+user_name +"  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable   !")  

        const validationrh = 1
        if (validationn == '') {
          const validation = 'en cours'
          return ValiderConge(id, iduserr, datedebut, datefin, validation, validationrh,validationrh22)

        }
        else {
          const validation = validationn
          return ValiderConge(id, iduserr, datedebut, datefin, validation, validationrh,validationrh22)

        }
      } else {
        alert('Le congé est déja validé')
      }
    }

    
    //else if(localStorage)

    else{
      alert('vous êtes pas autorisé pour valider ce congé ! ')
    }


  };
  
  const onClickRefuser = (id, iduserr, datedebut, datefin, validationn, validationrhh, idchef, idrh, emailemploye, emailchef, user_name, last_name,emailrhf,idrh2f,emailrh2f,validationrh2f,remarquerh11ff,remaruquerh2ff) => {


    if (DRH==true ||   role=="admin") {

      if (        validationrhh == 0 || validationrhh == "" ||  validationrhh == null  ||  validationrhh == undefined) {
       // sendMail(emaildrh,"IPS Time:  Avis défavorable pour la demande du congé "+user_name + "   " + last_name ,"Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable !")
       // sendMail(emailemploye, "IPS Time: Avis défavorable pour la demande du congé", "Bonjour  " + user_name + " " + last_name + ",  Votre RH a refusé le congé de votre demande du " + datedebut + " au " + datefin + ".  L'avis de chef est importante pour la confirmation définitive!")
    
    
        //sendMail(emailchef,"IPS Time:  Avis défavorable par  rh pour la demande du congé "+user_name + "   " + last_name ,"Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable par  rh !")
        sendMail(emailrh2f,"IPS Time:  Avis défavorable  pour la demande du congé  "+user_name,"Bonjour, La demande du congé du collaborateur "+user_name +"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable   ! <br/>  Remarque de la décision de refus :"+remarquerefuser)

        const validationrh = 3//1er refus 

        if (validationn == '') {
          const validation = 'en cours'
          return RefuserConge(id, iduserr, datedebut, datefin, validation, validationrh,validationrh2f,remarquerefuser,remaruquerh2ff)

        }
        else {
          const validation = validationn
          return RefuserConge(id, iduserr, datedebut, datefin, validation, validationrh,validationrh2f,remarquerefuser,remaruquerh2ff)

        }

      } 

      
      
      
      else {
        alert('le congé est déja validé')//si le congé n'est pas en attente alors alert 
      }
      {/**      else if ( validationrh2f == 0 || validationrh2f == "" ||  validationrh2f == null  ||  validationrh2f == undefined) {
      //  sendMail(emaildrh,"IPS Time:  Avis défavorable pour la demande du congé "+user_name + "   " + last_name ,"Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable !")
       // sendMail(emailemploye, "IPS Time: Avis défavorable pour la demande du congé", "Bonjour  " + user_name + " " + last_name + ",  Votre RH a refusé le congé de votre demande du " + datedebut + " au " + datefin + ".  L'avis de chef est importante pour la confirmation définitive!")
     
     
      //  sendMail(emailchef,"IPS Time:  Avis défavorable par  DRH pour la demande du congé "+user_name + "   " + last_name ,"Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable par  DRH !")
        sendMail(emailrh2f,"IPS Time:  Avis défavorable  pour la demande du congé  "+user_name  ,"Bonjour, La demande du congé du collaborateur "+user_name +"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable  !  Remarque de la décision de refus :"+remarquerefuser)
       // sendMail(emailrhf,"IPS Time:  Avis défavorable par DRH pour la demande du congé  "+user_name + "   " + last_name ,"Bonjour, La demande du congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable par DRH !")

         const validationrh2ff = 4
 
         if (validationn == '') {
           const validation = 'en cours'
           return RefuserConge(id, iduserr, datedebut, datefin, validation, validationrhh,validationrh2ff,remarquerh11ff,remarquerefuser)
 
         }
         else {
           const validation = validationn
           return RefuserConge(id, iduserr, datedebut, datefin, validation, validationrhh,validationrh2ff,remarquerh11ff,remarquerefuser)
 
         }
 
       }  */}
    }


      else if ((idrh ==iduserinfo) ) {


      if (validationrhh == 0 || validationrhh == "" ||  validationrhh == null  ||  validationrhh == undefined ) {
      sendMail(emailemploye, "IPS Time: Avis défavorable pour la demande du congé", "Bonjour  " + user_name + ", Votre demande de  " + datedebut + " au " + datefin +"a été refusé par un avis défavorable  ! <br/>   Remarque de la décision de refus :"+remarquerefuser)
        //sendMail(emailchef,"IPS Time:   Avis défavorable par manager pour la demande du congé  "+user_name + "   " + last_name ," Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable par manager  !")  
      //  sendMail(emailrhf,"IPS Time:   Avis défavorable pour la demande du congé"+user_name + "   " + last_name ," Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable!")
        sendMail(emailrh2f,"IPS Time:   Avis défavorable  pour la demande du congé  "+user_name  ," Bonjour, La demande de congé du collaborateur "+user_name + "  du "+datedebut+" au "+datefin+"  est refusé avec un avis défavorable par manager  ! <br/>  Remarque de la décision de refus :"+remarquerefuser)  

        const validationrh =3

        if (validationn == '') {
          const validation = 'en cours'
          return RefuserConge(id, iduserr, datedebut, datefin, validation, validationrh,validationrh2f,remarquerefuser,remaruquerh2ff)

        }
        else {
          const validation = validationn
          return RefuserConge(id, iduserr, datedebut, datefin, validation, validationrh,validationrh2f,remarquerefuser,remaruquerh2ff)

        }

      } else {
        alert('le congé est déja validé')
      }

    }

    else{
      alert('vous êtes pas autorisé pour refuser ce congé ! ')
    }

  };

  const OnClickAnnuller = (id, iduserr, datedebut, datefin, validationn, validationrhh, idchef, idrh, emailemploye, emailchef, user_name, last_name,emailrhf,idrh2f,emailrh2f,validationrh2anuuler,remarquerh1,remarquerh2) => {


    if (DRH==true ||   role=="admin") {

      if (   validationrhh == 0 || validationrhh == "" ||  validationrhh == null  ||  validationrhh == undefined || validationrhh==1) {
       sendMail(emailrh2f,"IPS Time:  Avis défavorable  pour la demande du congé "+user_name  ,"Bonjour, La demande de congé du collaborateur "+user_name +"  du "+datedebut+" au "+datefin+"  est annulé avec un avis défavorable   ! <br/>   Remarque de la décision d'annulation :"+remarque)
       // sendMail(emailemploye, "IPS Time: Avis défavorable pour la demande du congé", "Bonjour  " + user_name + " " + last_name + ",  Votre RH a annulé le congé de votre demande du " + datedebut + " au " + datefin + ".  L'avis de chef est importante pour la confirmation définitive!")
    
    
       // sendMail(emailchef,"IPS Time:  Avis défavorable par  rh pour la demande du congé "+user_name + "   " + last_name ,"Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est annulé avec un avis défavorable par  rh !")

        const validationrh = 5

        if (validationn == '') {
          const validation = 'en cours'
          return AnnullerConge(id, iduserr, datedebut, datefin, validation,validationrh, validationrh2anuuler,remarque,remarquerh2)

        }
        else {
          const validation = validationn
          return AnnullerConge(id, iduserr, datedebut, datefin, validation,validationrh, validationrh2anuuler,remarque,remarquerh2)

        }

      }

      
      else {
        alert('le congé est déja validé')
      }
      {/**    else  if (     validationrh2anuuler == 0 || validationrh2anuuler == "" ||  validationrh2anuuler == null  ||  validationrh2anuuler == undefined || validationrh2anuuler==2) {
        sendMail(emailrh2f,"IPS Time:  Avis défavorable  pour la demande du congé "+user_name ,"Bonjour, La demande de congé du collaborateur "+user_name +"  du "+datedebut+" au "+datefin+"  est annulé avec un avis défavorable  !  Remarque de la décision d'annulation :"+remarque)
        // sendMail(emailemploye, "IPS Time: Avis défavorable pour la demande du congé", "Bonjour  " + user_name + " " + last_name + ",  Votre RH a annulé le congé de votre demande du " + datedebut + " au " + datefin + ".  L'avis de chef est importante pour la confirmation définitive!")
     
     
        // sendMail(emailchef,"IPS Time:  Avis défavorable par  rh pour la demande du congé "+user_name + "   " + last_name ,"Bonjour, La demande de congé du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+"  est annulé avec un avis défavorable par  rh !")
 
         const validationrh2f = 6
 
         if (validationn == '') {
           const validation = 'en cours'
           return AnnullerConge(id, iduserr, datedebut, datefin, validation,validationrhh, validationrh2f,remarquerh1,remarque)
 
         }
         else {
           const validation = validationn
           return AnnullerConge(id, iduserr, datedebut, datefin, validation,validationrhh, validationrh2f,remarquerh1,remarque)
 
         }
 
       } */}
    }


      else if ((idrh ==iduserinfo) ) {


      if ( validationrhh == 0 || validationrhh == "" ||  validationrhh == null  ||  validationrhh == undefined || validationrhh==1) {
        sendMail(emailemploye, "IPS Time: Avis défavorable pour la demande du congé", "Bonjour  " + user_name + ", Votre demande de congé du" + datedebut + " au " + datefin + " a été annulé avec un avis défavorable ! <br/>   Remarque de la décision d'annulation :"+remarque)
        sendMail(emailchef,"IPS Time:   Avis défavorable pour la demande du congé  "+user_name  ," Bonjour, La demande de congé du collaborateur "+user_name +"  du "+datedebut+" au "+datefin+"  a été annulé avec un avis défavorable ! <br/>   Remarque de la décision d'annulation :"+remarque)
        sendMail(emailrhf,"IPS Time:   Avis défavorable pour la demande du congé"+user_name  ," Bonjour, La demande de congé du collaborateur "+user_name + "  du "+datedebut+" au "+datefin+"  a été annulé avec un avis défavorable ! <br/>   Remarque de la décision d'annulation :"+remarque)
        sendMail(emailrh2f,"IPS Time:   Avis défavorable  pour la demande du congé  "+user_name ," Bonjour, La demande de congé du collaborateur "+user_name + "  du "+datedebut+" au "+datefin+" a été annulé avec un avis défavorable  ! <br/>   Remarque de la décision d'annulation :"+remarque) 

        const validationrh = 5

        if (validationn == '') {
          const validation = 'en cours'
          return AnnullerConge(id, iduserr, datedebut, datefin, validation, validationrh,validationrh2anuuler,remarque,remarquerh2)

        }
        else {
          const validation = validationn
          return AnnullerConge(id, iduserr, datedebut, datefin, validation, validationrh,validationrh2anuuler,remarque,remarquerh2)

        }

      } else {
        alert('le congé est déja validé')
      }

    }
 
  
    else{
      alert('vous êtes pas autorisé pour annuller ce congé ! ')
    }
  
  };

  const onClicksupprimer = (idsu) => {


    return SupprimerConge(idsu)
  };

 

  const { data: Conges = [],isloading:ll,error:eee } = useFetch(url + "TestConges/" + iduserinfo + "/" +  iddep)

  const [open, setOpen] = useState(false);
  const useStyle = makeStyles({
    icon: {
      marginRight: 10,
      marginLeft: 10,    
      visibility: 'visible'


    },
    hidesubmit: {
      visibility: 'hidden'
    }
  });

  const classes = useStyle()
  const [iduser, setIdUser] = useState('')
  const [ddebut, setddebut] = useState('')
  const [dfin, setdfin] = useState('')
  const SupprimerConge = (id) => {

    fetch(url+'SupressionConge/' + id, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json',
        Authorization:token
      },
    }).then(() => {
      setOpen(false);
      Mouchard("encours", "supprimé", iduser, iduserinfo, "Suppression de congé de " + ddebut + "au " + dfin)
      window.location.reload(false);
    }
    ).catch((e) => {

  /**    if ( e.response.status=== 401) {
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


  const RefuserConge = (id, iduser, datedebut, datefin, validation, validationrh,validationrh2,remarquerh1,remarquerh2) => {

    let List = { validation, validationrh,validationrh2,remarquerh1,remarquerh2 }


    fetch(url+'RefusConge/' + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization:token
      },
      body: JSON.stringify(List)
    }).then(() => {
      Mouchard("encours", "refusé", iduser,iduserinfo, "Refus de congé de " + datedebut + "au " + datefin)


      window.location.reload(false)

    }).catch((e) => {

     /** if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })
  }
  const AnnullerConge = (id, iduser, datedebut, datefin, validation, validationrh,validationrh2,remarquerh1,remarquerh2) => {

    let List = { validation, validationrh,validationrh2,remarquerh1,remarquerh2 }


    fetch(url+'RefusConge/' + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization:token
      },
      body: JSON.stringify(List)
    }).then(() => {
      Mouchard("encours", "annulé", iduser,iduserinfo, "Annuller de congé de " + datedebut + "au " + datefin)


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
              "Content-Type": "application/json",
              Authorization:token
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

              <ScrollContainer className="scroll-container">
              {Conges.length==0 && ll==true? 
  <Backdrop  open={true}>
  <CircularProgress  style={{top : '50%'}} color="black" />
  </Backdrop>
:
              <div className="table-responsive" id="exx">

               
                
                  
               
                  
                  <table id="congesTable" className="display">

<thead>
  <tr>
    <th>Id </th>
    <th>Employé</th>
{/**    <th>Chef</th>
    <th>Avis Chef</th> */}



    <th>Solde</th>
    <th>Solde maladie</th>
    <th>d.début</th>
    <th>d.fin</th>
    <th>Statut</th>
    <th> Motif</th>
    <th>Nb jours demandés</th>
 
    <th className='text-center'>Action</th>
  </tr>
</thead>
<tbody>

  {
  role=="admin" || DRH==true?  
  
  Conges.map(c =>
   


    <tr>
       <td>{c.idconge}</td>
      <td>{c.user_name}    {c.last_name}</td>
 {/**      <td>{c.nomchef}</td>
       <td>{c.validation}</td> */}
   
    
  
     
       <td>{c.solde}</td>
       <td>{c.soldemaladie}</td>
       <td>{c.datedebut}   {c.matindebut==true? "Matin": "Aprés-midi"}</td>
       <td>{c.datefin}   {c.matinfin==true? "Matin": "Aprés-midi"}</td>
       <td>{  c.validationrh2==4 || c.validationrh==3  ?"refusé" : c.validationrh2==6 || c.validationrh==5? "annulé":c.validationrh2==2? "validé":c.validationrh==1?"1ére validation ":"en_attente" }</td>

 <td>{c.motif}</td>
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
 {/**          <div className='container pt-3'>
 
             
           <div class="row border border-dark" >
             <div class="col-6 border border-dark" style={{height:"50%"}}>Contact : {c.contact}</div>
             <div class="col-6 border border-dark"  style={{height:"50%"}}>Adresse :  {c.adresse}</div>
          
         </div>
         <div class="row border border-dark" >
             <div class="col-6 border border-dark" style={{height:"50%"}}>Personne intérimaire: {c.personneinterimaire}</div>
             <div class="col-6 border border-dark"  style={{height:""}}>Commentaire:  {c.commentaire}</div>
          
         </div>
 
           </div> */}
 
       
            <table className=' border border-dark' >
 {/**            <tr>
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
             </tr> */}
             <tr>
               <th>Cause :</th>
               <td>{c.commentaire}</td>
             </tr>
             {c.documentmaladie==null || c.documentmaladie==""?"":
             <tr>
               <th>Document :</th>
               <td>  <a href={url2+'media/'+c.documentmaladie} style={{color:"#172b4d",textDecoration:"underline"}} target="_blank">Document</a></td>
             </tr>}
             <tr>
 <th>Manager 1</th>
 <td>{c.nomrh}</td>
     
 
 
             </tr>
             <tr>
               <th>Manager2</th>
               <td>{c.nomrh2}</td>
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
 
 
 
 
 {
 
 ((c.validationrh != 0) && (c.rh_id==iduserinfo  ) )
 ||  ( (c.validationrh2 != 0 ) && (c.idrh2==iduserinfo   ))
 ||  ( (c.validationrh != 0 ) && (DRH==true ))
 
 ?"":
 
 <> 
 
 <td>
          
          <a  className="btn-sm btn-success " onClick={() => { handleClickOpenvalid(c.idconge, c.iduser, c.datedebut, c.datefin, c.validation, c.validationrh, c.chef_id, c.rh_id, c.emailemploye, c.email_chef, c.user_name, c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2) }}>
 
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
    {"Valider un congé"}
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      êtes-vous sûr de vouloir valider ce congé ?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClosevalid}>non</Button>
 
   <Button  onClick={() => { onClick(idcongev, iduserrv, datedebutv, datefinv, validationnv, validationrhhv, idchefv, idrhv, emailemployev, emailchefv, user_name, last_name,emailrh,idrh2,emailrh2,validationrh2) }}>
      oui
    </Button>
 
  </DialogActions>
 </Dialog>
          
 </td>
 <td>
       
              <a className="btn-sm btn-danger " onClick={() => { handleClickOpenrefus(c.idconge, c.iduser, c.datedebut, c.datefin, c.validation, c.validationrh, c.chef_id, c.rh_id, c.emailemploye, c.email_chef, c.user_name, c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2) }}>
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
              {"Refuser un congé"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                êtes-vous sûr de vouloir refuser ce congé ?
              </DialogContentText>
              <form ref={formRefrefuser}>
  <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Remarque"
                          type="text"
                          fullWidth
                          variant="standard"
                          value={remarquerefuser}
                          onChange={(e) => { setRemarquerefuser(e.target.value) }}
                          required
                        />
</form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloserefus}>non</Button>
              <Button onClick={() => { onClickRefuser(idcongerefus, iduserr, datedebut, datefin, validationn, validationrhh, idchef, idrh, emailemploye, emailchef, user_namef, last_namef,emailrhf,idrh2f,emailrh2f,validationrh2f,remarquerh1ref,remarquerh2f) }}> 

 
                oui
              </Button>
            </DialogActions>
          </Dialog>
 
 </td>
 
 
      
 
      </>
 }

{c.validationrh==1 && c.validationrh != 3?
 <td>  <a className="btn-sm btn-warning" onClick={()=>handleClickOpenAnnuller(c.idconge, c.iduser, c.datedebut, c.datefin, c.validation, c.validationrh, c.chef_id, c.rh_id, c.emailemploye, c.email_chef, c.user_name, c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2,c.remarquerh1,c.remarquerh2)}><DoDisturbAltIcon className={classes.icon}  /></a>
      
      
      </td>:""}
   
 
 
 
 
 <td>
     {rolename=="RH" || DRH==true || iddep!=undefined? "":
     <a className="btn-sm btn-info" onClick={() => { handleClickOpensupprimer(c.idconge) }}>
 
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
       {"Supprimer un congé"}
     </DialogTitle>
     <DialogContent>
       <DialogContentText id="alert-dialog-description">
         êtes-vous sûr de vouloir supprimer ce congé ?
       </DialogContentText>
     </DialogContent>
     <DialogActions>
       <Button onClick={handleClosesupprimer}>non</Button>
       <Button onClick={() => { onClicksupprimer(idcongesupp) }}>
         oui
       </Button>
     </DialogActions>
   </Dialog>
 
       </td>
 
       </tr>
       </td>
 
 
     </tr>
     
     ):
  Conges.filter(x=>x.rh_id==iduserinfo).map(c =>
   


   <tr>
      <td>{c.idconge}</td>
     <td>{c.user_name}    {c.last_name}</td>
{/**      <td>{c.nomchef}</td>
      <td>{c.validation}</td> */}
  
   

      <td>{c.solde}</td>
      <td>{c.soldemaladie}</td>

      <td>{c.datedebut}   {c.matindebut==true? "Matin": "Aprés-midi"}</td>
      <td>{c.datefin}   {c.matinfin==true? "Matin": "Aprés-midi"}</td>
       
      <td>{  c.validationrh2==4 || c.validationrh==3  ?"refusé" : c.validationrh2==6 || c.validationrh==5? "annulé":c.validationrh2==2? "validé":c.validationrh==1?"1ére validation ":"en_attente" }</td>

<td>{c.motif}</td>
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
{/**          <div className='container pt-3'>

            
          <div class="row border border-dark" >
            <div class="col-6 border border-dark" style={{height:"50%"}}>Contact : {c.contact}</div>
            <div class="col-6 border border-dark"  style={{height:"50%"}}>Adresse :  {c.adresse}</div>
         
        </div>
        <div class="row border border-dark" >
            <div class="col-6 border border-dark" style={{height:"50%"}}>Personne intérimaire: {c.personneinterimaire}</div>
            <div class="col-6 border border-dark"  style={{height:""}}>Commentaire:  {c.commentaire}</div>
         
        </div>

          </div> */}

      
           <table className=' border border-dark' >
{/**            <tr>
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
            </tr> */}
            <tr>
              <th>Cause :</th>
              <td>{c.commentaire}</td>
            </tr>
            <tr>
              <th>Document :</th>
              <td>  <a href={url2+'media/'+c.documentmaladie} style={{color:"#172b4d",textDecoration:"underline"}} target="_blank">{c.documentmaladie==null?"":"Document"}</a></td>
            </tr>
            <tr>
<th>Manager 1</th>
<td>{c.nomrh}</td>
    


            </tr>
            <tr>
              <th>Manager2</th>
              <td>{c.nomrh2}</td>
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




{

((c.validationrh != 0) && (c.rh_id==iduserinfo  ) )
||  ( (c.validationrh2 != 0 ) && (c.idrh2==iduserinfo   ))
||  ( (c.validationrh != 0 ) && (DRH==true ))

?"":

<> 

<td>
         
         <a  className="btn-sm btn-success " onClick={() => { handleClickOpenvalid(c.idconge, c.iduser, c.datedebut, c.datefin, c.validation, c.validationrh, c.chef_id, c.rh_id, c.emailemploye, c.email_chef, c.user_name, c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2) }}>

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
   {"Valider un congé"}
 </DialogTitle>
 <DialogContent>
   <DialogContentText id="alert-dialog-description">
     êtes-vous sûr de vouloir valider ce congé ?
   </DialogContentText>
 </DialogContent>
 <DialogActions>
   <Button onClick={handleClosevalid}>non</Button>

  <Button  onClick={() => { onClick(idcongev, iduserrv, datedebutv, datefinv, validationnv, validationrhhv, idchefv, idrhv, emailemployev, emailchefv, user_name, last_name,emailrh,idrh2,emailrh2,validationrh2) }}>
     oui
   </Button>

 </DialogActions>
</Dialog>
         
</td>
<td>
      
             <a className="btn-sm btn-danger " onClick={() => { handleClickOpenrefus(c.idconge, c.iduser, c.datedebut, c.datefin, c.validation, c.validationrh, c.chef_id, c.rh_id, c.emailemploye, c.email_chef, c.user_name, c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2,c.remarquerh1,c.remarquerh2) }}>
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
             {"Refuser un congé"}
           </DialogTitle>
           <DialogContent>
             <DialogContentText id="alert-dialog-description">
               êtes-vous sûr de vouloir refuser ce congé ?
             </DialogContentText>
             <form ref={formRefrefuser}>
  <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Remarque"
                          type="text"
                          fullWidth
                          variant="standard"
                          value={remarquerefuser}
                          onChange={(e) => { setRemarquerefuser(e.target.value) }}
                          required
                        />
</form>
           </DialogContent>
           <DialogActions>
             <Button onClick={handleCloserefus}>non</Button>
             <Button onClick={() => { onClickRefuser(idcongerefus, iduserr, datedebut, datefin, validationn, validationrhh, idchef, idrh, emailemploye, emailchef, user_namef, last_namef,emailrhf,idrh2f,emailrh2f,validationrh2f,remarquerh1ref,remarquerh2f) }}>

               oui
             </Button>
           </DialogActions>
         </Dialog>

</td>


     

     </>
}
{c.validationrh==1 && c.validationrh != 3?<td>  <a className="btn-sm btn-warning" onClick={()=>handleClickOpenAnnuller(c.idconge, c.iduser, c.datedebut, c.datefin, c.validation, c.validationrh, c.chef_id, c.rh_id, c.emailemploye, c.email_chef, c.user_name, c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2,c.remarquerh1,c.remarquerh2)}><DoDisturbAltIcon className={classes.icon}  /></a>
     
     
     </td>:""}        






<td>
    {rolename=="RH" || DRH==true || iddep!=undefined? "":
    <a className="btn-sm btn-info" onClick={() => { handleClickOpensupprimer(c.idconge) }}>

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
      {"Supprimer un congé"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        êtes-vous sûr de vouloir supprimer ce congé ?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClosesupprimer}>non</Button>
      <Button onClick={() => { onClicksupprimer(idcongesupp) }}>
        oui
      </Button>
    </DialogActions>
  </Dialog>

      </td>

      </tr>
      </td>


    </tr>
    
    )
    
    
    
    
    }

</tbody>

</table>
 
<Dialog
 
 BackdropProps={{ invisible: true }}
 className={classes.dialog}
 open={openannuller}
 onClose={handleCloseannuller}
 aria-labelledby="alert-dialog-title"
 aria-describedby="alert-dialog-description"
 >
 <DialogTitle id="alert-dialog-title">
  {"Annuller un congé"}
 </DialogTitle>
 <DialogContent>
  <DialogContentText id="alert-dialog-description">
    êtes-vous sûr de vouloir annuller ce congé ?
  </DialogContentText>
  <form ref={formRef}>
  <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Remarque"
                          type="text"
                          fullWidth
                          variant="standard"
                          value={remarque}
                          onChange={(e) => { setRemarque(e.target.value) }}
                          required
                        />
</form>
 </DialogContent>
 <DialogActions>
  <Button onClick={handleCloseannuller}>non</Button>
  <Button onClick={() => {formRef.current.reportValidity()==true? OnClickAnnuller(idcongeannuller, iduserrannuller, datedebutannuller, datefinannuller, validationnannuller, validationrhhannuller, idchefannuller, idrhannuller, emailemployeannuller, emailchefannuller, user_namefannuller, last_namefannuller,emailrhfannuller,idrh2fannuller,emailrh2fannuller,validationrh2annull,remarquerh1annul,remarquerh2annul) :formRef.current.reportValidity()}}>
 
    oui
  </Button>
 </DialogActions>
 </Dialog>




              </div>
              }
</ScrollContainer>
            </div>
          </div></div></div></div>
  )
}
export default CrudCongé;