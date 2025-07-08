import React,{useState} from "react";
import useFetch from "../useFetch";
import { makeStyles } from '@mui/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Mouchard from '../Mouchardd/Mouchard';
import ScrollContainer from "react-indiana-drag-scroll";
import $ from "jquery";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import frdatatable from '../../frdatatable.json'
import { useSelector } from "react-redux";
const ListeAutorisationsdirecteur = () => {
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null


  
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
   var DRH=test['DRH']
   var rolename=test['rolename']
   var iddd = test['iddep'].join(",")
 
   var role=test['role']
  }
  var iddep=iddd==""? undefined:iddd
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
 const[date_autorisation,setDateAutorisation]=useState('')
const [user_namev,setUserNameV]=useState('')
const [lastnamev,setLastNameV]=useState('')
const[emailrh,setEmailRH]=useState('')
const[idrh2,setIdRH2]=useState('')
const[emailrh2,setEmailRH2]=useState('')
const[validationrh2,setValidationRH2]=useState('')
  const handleClickOpenvalid = (id,iduser,datedebut,datefin,validationn,validationrhh,chefid,rhid,emailemp,emailche,date_autorisation,user_name,last_name,emailrh,idrh2,emailrh2,validationrh2) => {
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
    setDateAutorisation(date_autorisation)
    setUserNameV(user_name)
    setLastNameV(last_name)
    setEmailRH(emailrh)
    setEmailRH2(emailrh2)
    setIdRH2(idrh2)
    setValidationRH2(validationrh2)
  };
  const handleClosevalid = () => {
    setopenvalid(false);

  };

  const [openrefus, setopenrefus] = useState(false);
  const[idcongerefus,setIdcongeRefus]=useState('');
  const[iduserr,setIdUserr]=useState('')
  const[datedebut,setDatedebut]=useState('')
  const[datefin,setDatefin]=useState('')
  const[validationn,setValidation]=useState('')
  const[validationrhh,setValidationRH]=useState('')
 const[idchef,setIdchef]=useState('')
 const[idrh,setIdrh]=useState('')
 const[emailemploye,setEmailemploye]=useState('')
 const[emailchef,setEmailchef]=useState('')
 const[date_autorisationf,setDateAutorisationf]=useState('')
 const[user_namef,setUserNameF]=useState('')
 const[last_namef,setLastNamef]=useState('')

 const[emailrhf,setEmailRHf]=useState('')
 const[idrh2f,setIdRH2f]=useState('')
 const[emailrh2f,setEmailRH2f]=useState('')
 const[validationrh2f,setValidationRH2f]=useState('')
  const handleClickOpenrefus = (id,iduser,datedebut,datefin,validationn,validationrhh,chefid,rhid,emailemp,emailche,date_autorisationf,user_name,last_name,emailrhf,idrh2f,emailrh2f,validationrh2f) => {
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
    setDateAutorisationf(date_autorisationf)
    setUserNameF(user_name)
    setLastNamef(last_name)
   
    setEmailRHf(emailrhf)
    setEmailRH2f(emailrh2f)
    setIdRH2f(idrh2f)
    setValidationRH2f(validationrh2f)

  };
  const handleCloserefus = () => {
    setopenrefus(false);
  };

  const [opensupprimer, setopensupprimer] = useState(false);
  const[idcongesupp,setIdcongeSupp]=useState('')
  const handleClickOpensupprimer = (ids) => {
    setopensupprimer(true);
    setIdcongeSupp(ids)
  };
  const handleClosesupprimer = () => {
    setopensupprimer(false);
  };
   
    const { data: Conges = [],isloading:ll,error:ee } = useFetch(url+ "listvalidation/" + iduserinfo + "/motifautorisation")
    const[selectedaut,setselectedaut]=useState(null)
    const [open, setOpen] = useState(false);
    const useStyle = makeStyles({
      icon: {
        marginRight: 10,
        marginLeft: 10,
      







  
  
      }
    });
    const classes = useStyle()
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
     // sendMail(emailchef,"IPS Time:  Avis Favorable  pour la demande d'autorisation   "+user_namev  ," Bonjour, La demande de congé du collaborateur "+user_name + "  du "+datedebut+" au "+datefin+"  est validé avec un avis favorable !")  

  
     
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
      fetch(url + "refusworkflow/"+ id , {
    method: "PUT",
    headers: {
      "Content-Type": "application/json", // You can adjust the content type as needed
      Authorization:token
  }})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // You can handle the response here if needed
      window.location.reload(false);

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
    const SupprimerConge = (id) => {
      fetch(url+'SupressionConge/' + id, {
          method: 'DELETE',
          headers: {
  
              'Content-Type': 'application/json',
              Authorization:token
          },
      }).then(() => {
          setOpen(false);
          Mouchard("encours","supprimé",iduser,iduserinfo,"Suppression d'autorisation de "+ddebut+"au "+dfin)
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
  
  const ValiderConge =(id,iduser,heuredebut,heurefin,validation,validationrh,validationrh2) => {
  
 
     
    
    
      fetch(url+'RetrieveUpdateConge/' + id+"/"+validation+"/"+validationrh+"/"+validationrh2, {
          method: 'get',
          headers: {
          
            Authorization:token
        },
       
       
      }).then(() => {
        Mouchard("encours","confirmé",iduser,iduserinfo,"Validation d'autorisation de "+heuredebut+"au"+heurefin)

      window.location.reload(false)
    
    
      }
    
      ).catch((e) => {

      /**  if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
    })
    }
  const RefuserConge = (id,iduser,heuredebut,heurefin,validation,validationrh,validationrh2) => {

      let List = {validation,validationrh,validationrh2 }
    
    
      fetch(url+'RefusConge/' + id, {
          method: 'PUT',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization:token
          },
          body: JSON.stringify(List)
      }).then(() => {
        Mouchard("encours","refusé",iduser,iduserinfo,"Refus d'autorisation de " +heuredebut+"au "+heurefin)
       window.location.reload(false)
    
      }
    
      ).catch((e) => {

       /** if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
    })
    }
    const[iduser,setIdUser]=useState('')
    const[ddebut,setddebut]=useState('')
    const[dfin,setdfin]=useState('')
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
    const onClick = (id,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,date_autorisation,user_name,last_name,emailrh,idrh2,emailrh2,validationrh2) => {
            
      if(DRH==true ||   role=="admin"){
    if (  validationrh2 == 0 || validationrh2 == "" ||  validationrh2 == null  ||  validationrh2 == undefined){

      // sendMail(emaildrh,"IPS Time:  Avis favorable pour la demande d'autorisation "+user_name + "   " + last_name ,"Bonjour, La demande d'autorisation du collaborateur "+user_name + "   " + last_name+" de  date "+date_autorisation+"  est validé avec un avis favorable !")

        //  sendMail(emailemploye,"IPS Time:  Avis Favorable pour la demande d autorisation","Bonjour , Votre RH a validé l'autorisation de date "+date_autorisation+" de votre demande  L'avis de chef est importante pour la confirmation définitive")
     //    sendMail(emailchef,"IPS Time:  Avis favorable par rh pour la demande d'autorisation  "+user_name + "   " + last_name ,"Bonjour, La demande d'autorisation du collaborateur "+user_name + "   " + last_name+" de date "+date_autorisation+"  est validé avec un avis favorable par rh !")
     sendMail(emailrh2,"IPS Time:  Avis Favorable  pour la demande d'autorisation "+user_name + "   " + last_name ,"Bonjour, La demande d'autorisation du collaborateur "+user_name + "   " + last_name+"  du "+date_autorisation+" au "+date_autorisation+"  est validé par avec un avis favorable !")

          const validationrh22=2
          if (validationn==''){
            const validation='en cours'
            return    ValiderConge(id,iduserr,date_autorisation,date_autorisation,validation,validationrhh,validationrh22)

          }
          else{
            const validation=validationn
            return    ValiderConge(id,iduserr,date_autorisation,date_autorisation,validation,validationrhh,validationrh22)

          }
     } 
     
     else {
      alert('autorisation est déja validé')
    }
{/**     if (    validationrhh == 0 || validationrhh == "" ||  validationrhh == null  ||  validationrhh == undefined){

      // sendMail(emaildrh,"IPS Time:  Avis favorable pour la demande d'autorisation "+user_name + "   " + last_name ,"Bonjour, La demande d'autorisation du collaborateur "+user_name + "   " + last_name+" de  date "+date_autorisation+"  est validé avec un avis favorable !")

        //  sendMail(emailemploye,"IPS Time:  Avis Favorable pour la demande d autorisation","Bonjour , Votre RH a validé l'autorisation de date "+date_autorisation+" de votre demande  L'avis de chef est importante pour la confirmation définitive")
     //    sendMail(emailchef,"IPS Time:  Avis favorable par rh pour la demande d'autorisation  "+user_name + "   " + last_name ,"Bonjour, La demande d'autorisation du collaborateur "+user_name + "   " + last_name+" de date "+date_autorisation+"  est validé avec un avis favorable par rh !")
     sendMail(emailrh2,"IPS Time:  Avis Favorable pour la demande d'autorisation "+user_name + "   " + last_name ,"Bonjour, La demande d'autorisation du collaborateur "+user_name + "   " + last_name+"  du "+date_autorisation+" au "+date_autorisation+"  est validé par avec un avis favorable!")

          const validationrh=1
          if (validationn==''){
            const validation='en cours'
            return    ValiderConge(id,iduserr,date_autorisation,date_autorisation,validation,validationrh,validationrh2)

          }
          else{
            const validation=validationn
            return    ValiderConge(id,iduserr,date_autorisation,date_autorisation,validation,validationrh,validationrh2)

          }
     } 
    else  */}

    }
    


      else if(idrh2==iduserinfo){
        if (  validationrh2 == 0 || validationrh2 == "" ||  validationrh2 == null  ||  validationrh2 == undefined){
        sendMail(emailemploye,"IPS Time:  Avis Favorable pour la demande d autorisation","Bonjour ,Votre congé  de date "+date_autorisation+" a été validé  avec un avis favorable ")
        sendMail(emailchef,"IPS Time:  Avis Favorable  pour la demande du d'autorisation  "+user_name + "   " + last_name ," Bonjour, La demande d'autorisation  du collaborateur "+user_name + "   " + last_name+"  de date "+date_autorisation+"   a été validé avec un avis favorable  !")  
        sendMail(emailrh2,"IPS Time:  Avis Favorable pour la demande d'autorisation  "+user_name + "   " + last_name ," Bonjour, La demande d'autorisation  du collaborateur "+user_name + "   " + last_name+"  de date "+date_autorisation+"   a été  validé avec un avis favorable !")
        sendMail(emailrh,"IPS Time:  Avis Favorable  pour la demande d'autorisation  "+user_name + "   " + last_name ," Bonjour, La demande d'autorisation  du collaborateur "+user_name + "   " + last_name+"  de date "+date_autorisation+"   a été  validé avec un avis favorable !")

        const validationrhh2=2
        if (validationn==''){
          const validation='en cours'
          return    ValiderConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrhh2)

        }
        else{
          const validation=validationn
          return    ValiderConge(id,iduserr,datedebut,datefin,validation,validationrhh,validationrhh2)

        }
      }else {
        alert('autorisation est déja validé')
      }
      }
      else{
        alert('L employé de cette autorisation a un manager')
      }
  
   
    };
    const onClickRefuser = (id,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,date_autorisationf,user_name,last_name,emailrh,idrh2,emailrh2,validationrh2f) => {
         
      if(DRH==true ||   role=="admin"){

         if (   validationrh2f == 0 || validationrh2f == "" ||  validationrh2f == null  ||  validationrh2f == undefined){
          // sendMail(emaildrh,"IPS Time:  Avis défavorable pour la demande du d'autorisation "+user_name + "   " + last_name ,"Bonjour, La demande d'autorisation du collaborateur "+user_name + "   " + last_name+"  de date "+date_autorisation+"  est refusé avec un avis défavorable !")
  
           // sendMail(emailemploye,"IPS Time: Avis défavorable pour la demande d'autorisation","Bonjour ,  Votre RH a refusé l' autorisation de date "+date_autorisationf+" de votre demande!   L'avis de chef est importante pour la confirmation définitive!  ")
         //  sendMail(emailchef,"IPS Time:  Avis défavorable par rh pour la demande d'autorisation "+user_name + "   " + last_name ,"Bonjour,  La demande d'autorisation du collaborateur "+user_name + "   " + last_name+"  de date "+date_autorisationf+"  est refusé avec un avis défavorable par rh !")
         sendMail(emailrh2f,"IPS Time:  Avis défavorable  pour la demande d'autorisation    "+user_name + "   " + last_name ,"Bonjour, La demande d'autorisation  du collaborateur "+user_name + "   " + last_name+"  du "+datedebut+" au "+datefin+" a été refusé avec un avis défavorable  !")
  
            const validationrh22f=4
            if (validationn==''){
              const validation='en cours'
              return    RefuserConge(id,iduserr,date_autorisationf,date_autorisationf,validation,validationrhh,validationrh22f)
  
            }
            else{
              const validation=validationn
              return    RefuserConge(id,iduserr,date_autorisationf,date_autorisationf,validation,validationrhh,validationrh22f)
  
            }
          
          } 
        
        
        else{
          alert('l autorisation est déja validé')
        }
    
      }


        else if(idrh2==iduserinfo){

          if (  validationrh2f == 0 || validationrh2f == "" ||  validationrh2f == null  ||  validationrh2f == undefined){
          sendMail(emailemploye,"IPS Time: Avis défavorable pour la demande d'autorisation","Bonjour ,    Votre demande d' autorisation  de date "+date_autorisationf+" a été  refusé avec un avis défavorable !  ")
          sendMail(emailchef,"IPS Time:  Avis défavorable pour la demande du d'autorisation  "+user_name + "   " + last_name ," Bonjour, La demande d'autorisation  du collaborateur "+user_name + "   " + last_name+"  de date "+date_autorisationf+"  est réfusé avec un avis défavorable   !")  
          sendMail(emailrh2,"IPS Time:  Avis défavorable pour la demande d'autorisation  "+user_name + "   " + last_name ," Bonjour, La demande d'autorisation  du collaborateur "+user_name + "   " + last_name+"  de date "+date_autorisationf+"  est réfusé avec un avis défavorable !")
          sendMail(emailrh,"IPS Time:  Avis défavorable  pour la demande d'autorisation  "+user_name + "   " + last_name ," Bonjour, La demande d'autorisation  du collaborateur "+user_name + "   " + last_name+"  de date "+date_autorisationf+"  est réfusé avec un avis défavorable  !")
  
       
          const validationrh2ff=4
          if (validationn==''){
            const validation='en cours'
            return    RefuserConge(id,iduserr,date_autorisationf,date_autorisationf,validation,validationrhh,validationrh2ff)

          }
          else{
            const validation=validationn
            return    RefuserConge(id,iduserr,date_autorisationf,date_autorisationf,validation,validationrhh,validationrh2ff)

          }
        }else{
          alert('l autorisation est déja validé')
        }
       
        }
        
        else{
          alert('L employé de cette autorisation a un chef/RH ')
        }
  
       
    };
    const onClickSupprimer = (ids) => {
      
  
      
      return  SupprimerConge(ids)
    };
    $(document).ready(function () {
      $('#autotable').DataTable({
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
        order:[[3,'asc'],[6,'asc']]
      })
  
    });

    return (  
        <div>
  <div className="container-fluid mt-5">
<div className="row">
  <div className="col">
  <div className="card shadow">

      <ScrollContainer className="scroll-container">
      { ll==true ?
    
    <Backdrop  open={true}>
  <CircularProgress  style={{top : '50%'}} color="black" />
  </Backdrop>
    : 
              <div className="table-responsive" id="ex">

                  <table id="autotable" className="display" >

<thead>
  <tr>
  <th>Id </th>
    <th>Employé</th>
{/**    <th>Chef</th>
    <th>Avis Chef</th> */}

<th>Statut</th>
    <th>date_autorisation</th>
    <th>Heure début</th>
    <th>Heure fin</th>

    <th className='text-center'>Action</th>
  </tr>
</thead>
<tbody>

  {
  1==1?  
   
   Conges.map(c =>

    <tr>
      <td>{c.id}</td>
      <td>{c.user_name}  {c.last_name}</td>
{/**      <td>{c.nomchef}</td>
      <td>{c.validation}</td> */}

<td>{  c.validation==4   ?"validé" : c.validation==5 ? "annulé": c.validation==2? "validé par valideur 2 ":c.validation==1? "validé par valideur 1 ":c.validation==3? "validé par valideur 3 " : c.validation==0? "en_attente": c.validation==6? "réfusé":"" }</td>

      <td>{c.date_autorisation}</td>
      
      <td>{c.heuredebut}</td>
      <td>{c.heurefin}</td>
      <td>
        <tr>
        <td>      
          
            {/* <a className="btn-sm btn-primary " data-toggle="modal" data-target={`#modalconge${c.idconge}`}  >
<RemoveRedEyeIcon className={classes.icon}/>

              </a> */}
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
{1==2
?"":
<>
          <td>
  
          {c.validation !== "4" && c.validation !== "5" && c.validation !== "6" && (
  <a className="btn-sm btn-success" onClick={() => {setopenvalid(true) ; setselectedaut(c.id) ; console.log(c.id)}}>
    <ThumbUpIcon className={classes.icon} />
  </a>
)}
        
        <Dialog

        BackdropProps={{ invisible: true }}
        className={classes.dialog}
        open={openvalid}
        onClose={handleClosevalid}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Valider une autorisation "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Voulez-vous vraiment valider  cette autorisation ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosevalid}>non</Button>
          <Button onClick={()=>{valider(selectedaut) }}>
            oui
          </Button>
        </DialogActions>
        </Dialog>
          </td>



          <td>
          {c.validation !== "4" && c.validation !== "5" && c.validation !== "6" && (
          <a className="btn-sm btn-danger" onClick={()=>{ setopenrefus(true) ; setselectedaut(c.id)}}>
       <ThumbDownIcon className={classes.icon}/>
        
        </a> 
          )}
        <Dialog
    
        BackdropProps={{ invisible: true }}
        className={classes.dialog}
        open={openrefus}
        onClose={handleCloserefus}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"Refuser une autorisation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Voulez-vous vraiment refuser  cette autorisation ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloserefus}>non</Button>
          <Button onClick={()=>{refus(selectedaut) ; handleCloserefus()}}>
            oui
          </Button>
        </DialogActions>
        </Dialog>
          </td>
          </>}


<td>
{/* {rolename=="RH" || DRH == true || iddep!=undefined? "":
<a className="btn-sm btn-info" onClick={()=>{handleClickOpensupprimer(c.idconge)}}>
        
<DeleteIcon className={classes.icon}/>
    </a>} */}
    
    <Dialog

    BackdropProps={{ invisible: true }}
    className={classes.dialog}
    open={opensupprimer}
    onClose={handleClosesupprimer}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">
      {"Supprimer une autorisation"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        êtes-vous sûr de vouloir supprimer cette autorisation ?
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

     
      <td>{c.date_autorisation}</td>
      
      <td>{c.heure_debut}</td>
      <td>{c.heure_fin}</td>
      <td>
        <tr>
        <td>    
              {/* <a className="btn-sm btn-primary " data-toggle="modal" data-target={`#modalconge${c.idconge}`}  >
<RemoveRedEyeIcon className={classes.icon}/>

              </a> */}
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
?"":
<>
          <td>
  
       <a className="btn-sm btn-success" onClick={()=>{handleClickOpenvalid(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.date_autorisation,c.user_name,c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2,c.validationrh2)}}>
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
          {"Valider une autorisation "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir valider cette autorisation ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosevalid}>non</Button>
          <Button onClick={()=>{onClick(idcongev,iduserrv,datedebutv,datefinv,validationnv,validationrhhv,idchefv,idrhv,emailemployev,emailchefv,date_autorisation,user_namev,lastnamev,emailrh,idrh2,emailrh2,validationrh2)}}>
            oui
          </Button>
        </DialogActions>
        </Dialog>
          </td>



          <td>
     
          <a className="btn-sm btn-danger" onClick={()=>{handleClickOpenrefus(c.idconge,c.iduser,c.datedebut,c.datefin,c.validation,c.validationrh,c.chef_id,c.rh_id,c.emailemploye,c.email_chef,c.date_autorisation,c.user_name,c.last_name,c.emailrh,c.idrh2,c.emailrh2,c.validationrh2)}}>
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
          {"Refuser une autorisation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            êtes-vous sûr de vouloir refuser cette autorisation ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloserefus}>non</Button>
          <Button onClick={()=>{onClickRefuser(idcongerefus,iduserr,datedebut,datefin,validationn,validationrhh,idchef,idrh,emailemploye,emailchef,date_autorisationf,user_namef,last_namef,emailrhf,idrh2f,emailrh2f,validationrh2f)}}>
            oui
          </Button>
        </DialogActions>
        </Dialog>
          </td>
          </>}


<td>
{rolename=="RH" || DRH == true || iddep!=undefined? "":
<a className="btn-sm btn-info" onClick={()=>{handleClickOpensupprimer(c.idconge)}}>
        
<DeleteIcon className={classes.icon}/>
    </a>}
    
    <Dialog

    BackdropProps={{ invisible: true }}
    className={classes.dialog}
    open={opensupprimer}
    onClose={handleClosesupprimer}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">
      {"Supprimer une autorisation"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        êtes-vous sûr de vouloir supprimer cette autorisation ?
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
         
 
    </div>}</ScrollContainer>


</div> 
</div></div></div></div>
    );
}
 
export default ListeAutorisationsdirecteur;