


import useFetch from '../useFetch';


import * as React from 'react';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import $ from "jquery";
import Mouchard from '../Mouchardd/Mouchard';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';

import frdatatable from '../../frdatatable.json'
function ImportUser() {
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
  const [alerterrordeja,setalerterrordeja]=useState(false)
  const [alerterrorx,setAlertErrorx]=useState(false)
  const [importSuccess,setimportSuccess]=useState(false)

  
  React.useEffect(()=>{

    
   
  }
  ,[openn,post])
 
  const { data: pointages = [],isloading:ll,error:ee} = useFetch(url+"PointagesEmploye/"+iduserinfo)

  const [date_pointage, setDatePointage] = useState('');
  const [employes, setemploye] = useState('');
  const [pointeuse, setPointeuse] = useState(null);
 
  
  const [pointageId, setPointageId] = useState(null)
  const [pointageIddelete, setPointageIddelete] = useState(null)
  const [file, setFichier] = useState(null)
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
 

  const ImpoterFichier=(e)=>{
    

   const formdata=new FormData()
   formdata.append("file",file)




    e.preventDefault()
    
    fetch(url+"ImportUserCSV/",
      {
        method: "POST",
        headers: {
      
          Authorization: token,
        },
        body: formdata
      }) .then((response) => {
         if (response.ok) {
            setimportSuccess(true)  
            setTimeout(() => {
                setimportSuccess(false);
              }, 3000);
              window.location.reload(false);

        }
        if (!response.ok) {
          // Handle HTTP error status
          if (response.status === 400) {
            setAlertErrorx(true);
           
            setTimeout(() => {
              setAlertErrorx(false);
            }, 3000);
          
          }
          else if  (response.status === 409) {
            setalerterrordeja(true);
           
            setTimeout(() => {
              setalerterrordeja(false);
            }, 3000);
          }
          
          else {
            // Handle other error statuses if needed
          }
          // Throw an error to trigger the catch block
          throw new Error(response.statusText);
        }
        // Process response data if needed
        return response.json(); // or response.text(), response.blob(), etc.
      })
      .then((data) => {
        
        })
      .catch((error) => {
        // Handle network errors or other issues
        console.error("Fetch error:", error);
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
  <>
                { pointageedit == true &&
                  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#Importercsv">
                    Importer Fichier CSV
                  </button>
                }
                <div className="modal fade" id="Importercsv"  role="dialog" aria-labelledby="Importercsv" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Importer les collaborateurs</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="form-group">
                            <input type="file" name="file" onChange={(event)=>{setFichier(event.target.files[0])}}/>
                          </div>
                          <div className="form-group">
                            <button className="btn btn-primary" type="submit" onClick={ImpoterFichier} disabled ={file == null ? true : false}>Valider</button>
                          </div>
                          {alerterrorx &&
                                      <Alert variant="filled" severity="error">
Les données du fichier ne sont pas valides. Avant d'effectuer l'importation, veuillez vérifier attentivement le contenu des colonnes.                                    </Alert> }
{alerterrordeja &&
                                      <Alert variant="filled" severity="warning">
Tous les utilisateurs du fichier existent déjà.                                    </Alert> }

{importSuccess && (
  <Alert variant="filled" severity="success">
    L'importation des données s'est déroulée avec succès.
  </Alert>
)}

                        </form>
                      </div>
                      <div className="modal-footer"></div>
                    </div>
                  </div>
                </div>
                </>
  );
  
             } export default ImportUser;
  