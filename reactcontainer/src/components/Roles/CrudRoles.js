

import AjouterRole from "./AjouterRole";



import * as React from 'react';
import useFetch from "../useFetch";
import { makeStyles } from '@mui/styles';


import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import $ from "jquery";

import frdatatable from '../../frdatatable.json'
function CrudRoles() {
  const url = process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null

  const [viewlistcontrats_rh,setviewlistcontrat_rh]=useState(false)
  const [viewlistcontrats_admin,setviewlistcontratsadmin]=useState(false)
    const [rh, setRH] = useState(false)
    const [DRH, setDRH] = useState(false)
    const [view_conge, setViewCongé] = useState(false)
    const [view_employé, setViewEmploye] = useState(false)
    const [modifier_employé, setViewEmployemod] = useState(false)
    const [delete_employé, setViewEmployedel] = useState(false)
                  
    const [view_departements, setViewDepartements] = useState(false)
    const [view_departements_edit, setViewDepartementsedit] = useState(false)
    const [view_departements_del, setViewDepartementsdel] = useState(false)
    const [view_demanderh, setdemanderh] = useState(false)
    const [demanderhedit, setdemanderhedit] = useState(false)
    const [demanderhdelete, setdemanderhdelete] = useState(false)
    const [view_demandeaut, setdemandeaut] = useState(false)
    const [demandeautedit, setdemandeautedit] = useState(false)
    const [demandeautdelete, setdemandeautdelete] = useState(false)   
    const [selectall, setselectall] = useState(false)   
    const [view_employe_rh,setViewdconge]=useState(false)
    const [view_dep_rh,setViewdpoin]=useState(false)
    const [view_contrat_rh,setViewdrh]=useState(false)
    const [view_horaire_rh,setdaut]=useState(false)
    const [view_espacepdg, setViewEspacePdg] = useState(false)
    const [view_contrats, setvieContrats] = useState(false)
    const [contratsedit , seteditcontrat]= useState(false)
    const [contartdelete , setdeletecontrat]= useState(false)
  
    const [view_pointeuse, setViewPointeuses] = useState(false)
    const [pointeuseedit, setpointeuseedit] = useState(false)
    const [pointeusedelete, setdeletepointeuse] = useState(false)
  
    const [view_pointage, setpointage] = useState(false)
    const [pointageedit, setpointageedit] = useState(false)
    const [pointagedelete, setpointagedelete] = useState(false)
  
  
  
    const [view_absence, setViewAbsence] = useState(false)
    const [view_planing, setViewPlaning] = useState(false)
    const [view_horaire, setViewHoraire] = useState(false)
    const [view_historique, setViewistorique] = useState(false)
    const [view_mouchard, setViewMouchard] = useState(false)
    const [view_rapports, setViewRapports] = useState(false)
    const [view_teletravail, setViewTeletravail] = useState(false)
    const [view_autorisation, setViewAutorisation] = useState(false)
    const [view_mission, setViewMission] = useState(false)
  
  
  
    const [view_Sites, setview_Sites] = useState(false)
    const [viewdirecteur,setViewDirecteur]=useState(false)
    const[affectationopause,setaffectationopause]=useState(false)
    const[accuiel,setaccuiel]=useState(false)
    const[directionoperations,setDirectionoperations]=useState(false)
    const[wfm,setwfm]=useState(false)
    const handleChangeWFM=()=>{
      setwfm(!wfm)
    }
    const handleChangedirectionoperations=()=>{
      setDirectionoperations(!directionoperations)
    }
  
    const handleChangeAccuiel=()=>{
      setaccuiel(!accuiel)
    }
    const handleaffectationopause=()=>{
      setaffectationopause(!affectationopause)
    }
  
  
    const handleOnChangeautorisation = () => {
      setViewAutorisation(!view_autorisation)
    }
    const handleOnChangemission = () => {
      setViewMission(!view_mission)
    }
    const handleOnChangeAbsence = () => {
      setViewAbsence(!view_absence);
    };
    const handleOnChangeConge = () => {
      setViewCongé(!view_conge);
    };
    const handleChangeEmploye = () => {
      setViewEmploye(!view_employé);
    };
    const handleChangeEmployeedit = () => {
      setViewEmployemod (!modifier_employé);
    };
    const handleChangeEmployedelete = () => {
      setViewEmployedel(!delete_employé);
    };
  
  
  
    const handleOnChangeContrats = () => {
      setvieContrats(!view_contrats);
    };
    const handleOnChangeContratsedit = () => {
      seteditcontrat (!contratsedit);
    };
    const handleOnChangeContratsdelete = () => {
      setdeletecontrat(!contartdelete);
    };
  
  
  
    const handleChangepointeuse = () => {
      setViewPointeuses(!view_pointeuse);
    };
    const setpointeusedit = () => {
      setpointeuseedit (!pointeuseedit);
    };
    const setpointeusedelete = () => {
      setdeletepointeuse(!pointeusedelete);
    };
  
  
  
    const handlechangepointage = () => {
      setpointage(!view_pointage);
    };
    const handlepointageedit = () => {
      setpointageedit (!pointageedit);
    };
    const handlepointagedelete = () => {
      setpointagedelete(!pointagedelete);
    };
  
  
   
    const [absenceedit, setabsenceedit] = useState(false)
    const [absencedelete, setabsencedelete] = useState(false)
    const [horaireedit, sethoraireedit] = useState(false)
    const [horairedelete, sethorairedelete] = useState(false)
    const [Sitesedit, setsiteedit] = useState(false)
    const [Sitesdelete, setsitedelete] = useState(false)
  
    const [planningedit, setplanningedit] = useState(false)
    const [planningdelete, setplanningdelete] = useState(false)
  
  const handlehoraireedit=()=>{
      sethoraireedit(!horaireedit)
    }
  const handlehorairedelete=()=>{
    sethorairedelete(!horairedelete)
  } 
  
  
  
     const handleabsenceedit=()=>{
      setabsenceedit(!absenceedit)
    }
  const handleabsencedelete=()=>{
    setabsencedelete(!absencedelete)
  }
  
  
  
     const handlesiteedit=()=>{
      setsiteedit(!Sitesedit)
    }
  const handlesitedelete=()=>{
    setsitedelete(!Sitesdelete)
  }
  
  
  
     const handlecontratedit=()=>{
      seteditcontrat(!contratsedit)
    }
  const handlecontratdelete=()=>{
    setdeletecontrat(!contartdelete)
  }  
  
  
  
   const handleplanningtedit=()=>{
      setplanningedit(!planningedit)
    }
  const handleplanningdelete=()=>{
    setplanningdelete(!planningdelete)
  }
  
  
    const handleOnchangeDepartementschange = () => {
      setViewDepartementsedit(!view_departements_edit);
    };
    const handleOnchangeDepartementsdelete = () => {
      setViewDepartementsdel(!view_departements_del);
    };
    const handleOnchangeDepartements = () => {
      setViewDepartements(!view_departements);
    };
    const handleOnchangeEspacePdg = () => {
      setViewEspacePdg(!view_espacepdg);
    };
    const handleOnChangePlaning = () => {
      setViewPlaning(!view_planing);
    };
    const handleOnChangeHoraire = () => {
      setViewHoraire(!view_horaire);
    };
    const handleOnChangePointeuses = () => {
      setViewPointeuses(!view_pointeuse);
    };
    
    const handleOnChangeHistorique = () => {
      setViewistorique(!view_historique);
    };
    const handleOnChangeRapports = () => {
      setViewRapports(!view_rapports);
    };
    const handleOnChangeMouchard = () => {
      setViewMouchard(!view_mouchard);
    };
    const handleOnChangeTéletravail = () => {
      setViewTeletravail(!view_teletravail);
    };
    const handleChangeSites = () => {
      setview_Sites(!view_Sites)
    }
    const handleChangeViewDirecteur=()=>{
      setViewDirecteur(!viewdirecteur)
    }
    const handledemanderhdelete=()=>{
      setdemanderhdelete(!demanderhdelete)
    }
    const handledemanderhedit=()=>{
      setdemanderhedit(!demanderhedit)
    }
    const handledemanderh=()=>{
      setdemanderh(!view_demanderh)
    }
    
    const handledemandeautdelete=()=>{
      setdemandeautdelete(!demandeautdelete)
    }
    const handledemandeautedit=()=>{
      setdemandeautedit(!demandeautedit)
    }
    const handledemandeaut=()=>{
      setdemandeaut(!view_demandeaut)
    }
  const { data: roles = [], isloading, error } = useFetch(url + "role/")
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
  const [roleIddelete, setroleIddelete] = useState(null)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyle()


  const [rolename, setNomRole] = useState('');

  const [roleId, setRoleId] = useState(null)


  function SelectRole(id) {
    fetch(url + "role/" + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      }
    }).then((result) => {
      result.json().then((resp) => {
        setNomRole(resp.rolename);
        setRoleId(resp.id)
        setViewCongé(resp.view_conge)
        setViewEmploye(resp.view_employé)
        setViewDepartements(resp.view_departements)
        setViewEspacePdg(resp.view_espacepdg)
        setvieContrats(resp.view_contrats)
        setViewPointeuses(resp.view_pointeuse)
        setViewAbsence(resp.view_absence)
        setViewPlaning(resp.view_planing)
        setViewHoraire(resp.view_horaire)
        setViewRapports(resp.view_rapports)
        setViewMouchard(resp.view_mouchard)
        setViewistorique(resp.view_historique)
        setViewTeletravail(resp.view_teletravail)
        setViewEmployemod(resp.modifier_employé)
        setViewEmployedel(resp.delete_employé)
        setViewDepartementsedit(resp.view_departements_edit)
        setViewDepartementsdel(resp.view_departements_del)
        seteditcontrat(resp.contratsedit)
        setdeletecontrat(resp.contartdelete)
        setpointeuseedit(resp.pointeuseedit)
        setdeletepointeuse(resp.pointeusedelete)
        sethoraireedit(resp.horaireedit)
        sethorairedelete(resp.horairedelete)
        setabsenceedit(resp.absenceedit)
        setabsencedelete(resp.absencedelete)
        setplanningedit(resp.planningedit)
        setplanningdelete(resp.planningdelete)
        setsiteedit(resp.Sitesedit)
        setsitedelete(resp.Sitesdelete)
        setpointageedit(resp.pointageedit)
        setpointagedelete(resp.pointagedelete)
        setpointage(resp.view_pointage)
        setViewMission(resp.view_mission)
        setViewAutorisation(resp.view_autorisation)
        setRH(resp.rh)
        setview_Sites(resp.view_Sites)
        setViewDirecteur(resp.viewdirecteur)
        setaffectationopause(resp.affectationopause)
        setdemandeaut(resp.view_demandeaut)
        setdemanderh(resp.view_demanderh)
        setdemandeautedit(resp.demandeautedit)
        setdemanderhedit(resp.demanderhedit)
        setdemandeautdelete(resp.demandeautdelete)
        setdemanderhdelete(resp.demanderhdelete)
        setDRH(resp.DRH)

       
        setviewlistcontratsadmin(resp.viewlistcontrats_admin)
        setaccuiel(resp.accuiel)
        setDirectionoperations(resp.directionoperations)
        setwfm(resp.wfm)
       setViewdconge(resp.view_employe_rh)
        setViewdpoin(resp.view_dep_rh)
        setViewdrh(resp.view_contrat_rh)
        setdaut(resp.view_horaire_rh)
        
      })
    }).catch((err) => {

    })





  }
  const handleselectall= () => {
    setselectall(!selectall)
    if(selectall == false){
    setViewCongé(true)
    setViewEmploye(true)
    setViewDepartements(true)
    setViewEspacePdg(true)
    setvieContrats(true)
    setViewPointeuses(true)
    setViewAbsence(true)
    setViewPlaning(true)
    setViewHoraire(true)
    setViewRapports(true)
    setViewMouchard(true)
    setViewistorique(true)
    setViewTeletravail(true)
    setViewEmployemod(true)
    setViewEmployedel(true)
    setViewDepartementsedit(true)
    setViewDepartementsdel(true)
    seteditcontrat(true)
    setdeletecontrat(true)
    setpointeuseedit(true)
    setdeletepointeuse(true)
    sethoraireedit(true)
    sethorairedelete(true)
    setabsenceedit(true)
    setabsencedelete(true)
    setplanningedit(true)
    setplanningdelete(true)
    setsiteedit(true)
    setsitedelete(true)
    setpointageedit(true)
    setpointagedelete(true)
    setpointage(true)
    setViewMission(true)
    setViewAutorisation(true)
    setRH(true)
    setview_Sites(true)
    setViewDirecteur(true)
    setaffectationopause(true)
    setdemandeaut(true)
    setdemanderh(true)
    setdemandeautedit(true)
    setdemanderhedit(true)
    setdemandeautdelete(true)
    setdemanderhdelete(true)
   
    setviewlistcontratsadmin(true)
    setaccuiel(true)
    setDirectionoperations(true)
    setwfm(true)
    setViewdconge(true)
    setViewdpoin(true)
    setViewdrh(true)
    setdaut(true)
  
  
  }
    if(selectall == true){
      setViewCongé(false)
      setViewEmploye(false)
      setViewDepartements(false)
      setViewEspacePdg(false)
      setvieContrats(false)
      setViewPointeuses(false)
      setViewAbsence(false)
      setViewPlaning(false)
      setViewHoraire(false)
      setViewRapports(false)
      setViewMouchard(false)
      setViewistorique(false)
      setViewTeletravail(false)
      setViewEmployemod(false)
      setViewEmployedel(false)
      setViewDepartementsedit(false)
      setViewDepartementsdel(false)
      seteditcontrat(false)
      setdeletecontrat(false)
      setpointeuseedit(false)
      setdeletepointeuse(false)
      sethoraireedit(false)
      sethorairedelete(false)
      setabsenceedit(false)
      setabsencedelete(false)
      setplanningedit(false)
      setplanningdelete(false)
      setsiteedit(false)
      setsitedelete(false)
      setpointageedit(false)
      setpointagedelete(false)
      setpointage(false)
      setViewMission(false)
      setViewAutorisation(false)
      setRH(false)
      setview_Sites(false)
      setViewDirecteur(false)
      setaffectationopause(false)
      setdemandeaut(false)
      setdemanderh(false)
      setdemandeautedit(false)
      setdemanderhedit(false)
      setdemandeautdelete(false)
      setdemanderhdelete(false)
     
      setviewlistcontratsadmin(false)
      setaccuiel(false)
      setDirectionoperations(false)
      setwfm(false)
      setViewdconge(false)
      setViewdpoin(false)
      setViewdrh(false)
      setdaut(false)
    
    }
  }

  const DeleteRole = (roleId) => {
    fetch(url + 'role/' + roleId, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then(() => {
      setOpen(false);
      window.location.reload(false);
    }
    ).catch((err) => {

    })


  }

  const Updaterole = () => {
    
    let roleList = {view_employe_rh ,view_dep_rh ,view_contrat_rh,view_horaire_rh ,    wfm, directionoperations, accuiel, affectationopause, viewdirecteur, viewlistcontrats_admin, DRH,   view_Sites,  view_autorisation, view_mission, rolename, view_absence, view_conge, view_contrats, view_departements, view_employé, view_espacepdg, view_horaire, view_planing, view_pointeuse, view_historique, view_rapports, view_mouchard, view_teletravail , modifier_employé    ,      delete_employé  ,     view_departements_edit  ,     view_departements_del ,       contratsedit,      contartdelete ,     pointeuseedit ,     pointeusedelete  ,   horaireedit ,      horairedelete  ,   absenceedit   ,     absencedelete ,    planningedit  ,    planningdelete  ,   Sitesedit ,   Sitesdelete  ,  pointageedit , pointagedelete , view_pointage, view_demandeaut , view_demanderh , demandeautedit , demandeautdelete , demanderhedit , demanderhdelete}


    fetch(url + 'role/' + roleId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(roleList)
    }).then(() => {



    }

    ).catch((err) => {
      /**     if ( err.response.status=== 401) {
             logoutfunction(err.response.status)
           } */
    })
  }
  $(document).ready(function () {
    $('#roletable').DataTable({
      language: frdatatable,
      "dom": 'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          className: 'btn btn-buttondatatable'
        },
        {
          extend: 'copy',
          className: 'btn btn-buttondatatable'
        },
        {
          extend: 'pdf',
          orientation: 'landscape',
          pageSize: 'LEGAL',
          className: 'btn btn-buttondatatable'
        },
        {
          extend: 'csv',
          className: 'btn btn-buttondatatable'
        },
        {
          extend: 'print',
          className: 'btn btn-buttondatatable'
        },



      ]
      , "bDestroy": true
    })

  });
  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">

              {/**        <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Roles </h3>
      </div> */}
              <div className="card-header border-0">
                <AjouterRole />
              </div>
              <div className="table-responsive">
                {roles.length == 0 ? "" : <table className="table table-bordered display" id="roletable">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Role</th>



                      <th scope="col">Action</th>

                    </tr>
                  </thead>
                  <tbody>

                    {roles.map(role =>
                      <tr key={role.id}>
                        <td>{role.rolename}</td>


                        <td>
                          <tr>

                            <td>

                              <a onClick={() => SelectRole(role.id)} data-toggle="modal" data-target="#modalrole" ><EditIcon
                                className={classes.icon}
                              /></a>
                            </td>

                            <td>
                              <a onClick={() => { handleClickOpen(); setroleIddelete(role.id); }}  ><DeleteIcon className={classes.icon} /></a>


                            </td>



                            <td>
                              <div >
                                <a data-toggle="modal" data-target={`#a${role.id}`}><VisibilityIcon className={classes.icon} />

                                  <div className="modal fade" id={`a${role.id}`} role="dialog" aria-labelledby={`a${role.id}`} aria-hidden="true">
                                    <div className="modal-dialog modal-lg" role="document">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <h5 className="modal-title" id="exampleModalLabel">Permissions</h5>
                                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>
                                        <div className="modal-body">
                                          <div className="table-responsive">
                                            <table className="table table-bordered display">
                                              <thead className="thead-light">
                                                <tr>

                                                  <th scope="col"><h3>Vue</h3></th>
                                                  <th scope="col"><h3>Autorisation</h3></th>

                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr>
                                                  <td>Vue d'absences</td>
                                                  <td>{role.view_absence ? "oui" : "Non"}</td>

                                                </tr>
                                                <tr>
                                                  <td>Vue de congés</td>
                                                  <td>{role.view_conge ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td>Vue d'employés</td>
                                                  <td>{role.view_employé ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td>Vue de départements</td>
                                                  <td>{role.view_departements ? "oui" : "Non"}</td>
                                                </tr>
                                               
                                                <tr>
                                                  <td>supervision </td>
                                                  <td>{role.viewdirecteur ? "oui" : "Non"}</td>
                                                </tr>
                                               

                                                <tr>
                                                  <td>Vue type de contrats</td>
                                                  <td>{role.view_contrats ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td>Vue de pointeuse</td>
                                                  <td>{role.view_pointeuse ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td>Vue d'horaire</td>
                                                  <td>{role.view_horaire ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td>Vue d'absence</td>
                                                  <td>{role.view_absence ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td>Vue de planing</td>
                                                  <td>{role.view_planing ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td>Vue de Rapports</td>
                                                  <td>{role.view_rapports ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td>Vue de Mouchard</td>
                                                  <td>{role.view_mouchard ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td>Vue d'Historique</td>
                                                  <td>{role.view_historique ? "oui" : "Non"}</td>
                                                </tr>
                                               
                                                <tr>
                                                  <td>Demande pointage </td>
                                                  <td>{role.view_mission ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td> Autorisation</td>
                                                  <td>{role.view_autorisation ? "oui" : "Non"}</td>
                                                </tr>
                                                <tr>
                                                  <td>view_Sites</td>
                                                  <td>{role.view_Sites ? "oui" : "Non"}</td>
                                                </tr>
                                             
                                              
                                                <tr>
                                                  <td>view affectation pause</td>
                                                  <td>{role.affectationopause ? "oui" : "Non"}</td>
                                                </tr>
                                                {/* <tr>
                                                  <td>WFM</td>
                                                  <td>{role.wfm ? "oui" : "Non"}</td>
                                                </tr> */}


                                                {/**             <tr>
                                              <td>view list contrats_rh</td>
                                              <td>{role.viewlistcontrats_rh ? "oui" : "Non"}</td>
                                            </tr>          <tr>
                                              <td>view list contrats</td>
                                              <td>{role.viewlistcontrats_admin ? "oui" : "Non"}</td>
                                            </tr> */}
                                                {/**            <tr>
                                              <td>view list Téletravail DRH</td>
                                              <td>{role.viewlistTeletravail_drh ? "oui" : "Non"}</td>
                                            </tr> */}



                                              </tbody></table>


                                          </div>


                                        </div>
                                        <div className="modal-footer">



                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div> </td>
                          </tr>
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
                        {"supprimer un role"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          êtes-vous sûr de vouloir supprimer un role ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>non</Button>
                        <Button onClick={() => { DeleteRole(roleIddelete) }}>
                          oui
                        </Button>
                      </DialogActions>
                    </Dialog>



                  </tbody>
                </table>}

              </div>
            </div>
            <div>

              <div className="row">
                <div className="col-md-3">



                  <div className="modal fade" id="modalrole" role="dialog" aria-labelledby="modalrole" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Modifier Role</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">



                          <form>

                            <div className="row">
                              <div className="col-md-6">

                                <input className="form-control" placeholder="Ajouter un role" value={rolename} name="rolename" onChange={(e) => setNomRole(e.target.value)} type="text" />

                              </div>

                            </div>
                            <div className="row">
                              {/** <div className="col-md-6">
                                   <TextField
                                      id="outlined-select-currency"
                                      select
                                      label="RH"
                                      value={rh}
                                      onChange={(e) => setRH(e.target.value)}
                                      helperText="RH"
                                      margin='normal'
                                      fullWidth
                                    >
                                      <MenuItem value={"true"}>Oui</MenuItem>
                                      <MenuItem value={"false"}>Non</MenuItem>


                                    </TextField>   
                  </div> */}
                              <div className="col-md-6">
                                <TextField
                                  id="outlined-select-currency"
                                  select
                                  label="RH"
                                  value={DRH}
                                  onChange={(e) => setDRH(e.target.value)}
                                  helperText="RH"
                                  margin='normal'
                                  fullWidth
                                >
                                  <MenuItem value={"true"}>Oui</MenuItem>
                                  <MenuItem value={"false"}>Non</MenuItem>


                                </TextField>
                              </div>
                             
                            </div>

                            <div className="form-group">


                            <div className="row pl-3">
                            <div className="col-md-12">
                        <FormControlLabel control={<Checkbox />} checked={selectall ? true : false} label='selectionner tout ' value={selectall} onChange={handleselectall} />
                      </div>
                      <div className="col-md-12 ">
                     
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                  
                      
                      <h4 >Employé :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} checked={view_employé ? true : false} label='affichage ' value={view_employé} onChange={handleChangeEmploye} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} checked={modifier_employé ? true : false} label='modification ' value={modifier_employé} onChange={handleChangeEmployeedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={delete_employé ? true : false} value={delete_employé} onChange={handleChangeEmployedelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 > Departement :</h4>
                        </div>
               
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_departements ? true : false} value={view_departements} onChange={handleOnchangeDepartements} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification 'checked={view_departements_edit ? true : false}  value={view_departements_edit} onChange={handleOnchangeDepartementschange} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={view_departements_del ? true : false} value={view_departements_del} onChange={handleOnchangeDepartementsdelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >contrats :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_contrats ? true : false} value={view_contrats} onChange={handleOnChangeContrats} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={contratsedit ? true : false} value={contratsedit} onChange={handlecontratedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={contartdelete ? true : false} value={contartdelete} onChange={handlecontratdelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >pointeuses :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_pointeuse ? true : false} value={view_pointeuse} onChange={handleChangepointeuse} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={pointeuseedit ? true : false} value={pointeuseedit} onChange={setpointeusedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={pointeusedelete ? true : false} value={pointeusedelete} onChange={setpointeusedelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >horaire :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage 'checked={view_horaire ? true : false}  value={view_horaire} onChange={handleOnChangeHoraire} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={horaireedit ? true : false} value={horaireedit} onChange={handlehoraireedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={horairedelete ? true : false}  value={horairedelete} onChange={handlehorairedelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >planning :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_planing ? true : false} value={view_planing} onChange={handleOnChangePlaning} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={planningedit ? true : false} value={planningedit} onChange={handleplanningtedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={planningdelete ? true : false} value={planningdelete} onChange={handleplanningdelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >absence :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_absence ? true : false} value={view_absence} onChange={handleOnChangeAbsence} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={absenceedit ? true : false} value={absenceedit} onChange={handleabsenceedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={absencedelete ? true : false} value={absencedelete} onChange={handleabsencedelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >site :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_Sites ? true : false} value={view_Sites} onChange={handleChangeSites} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={Sitesedit ? true : false} value={Sitesedit} onChange={handlesiteedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={Sitesdelete ? true : false} value={Sitesdelete} onChange={handlesitedelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >pointage :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_pointage ? true : false} value={view_pointage} onChange={handlechangepointage} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={pointageedit ? true : false}  value={pointageedit} onChange={handlepointageedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={pointagedelete ? true : false}  value={pointagedelete} onChange={handlepointagedelete} />
                      </div>
                      </div>
                      {/* <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >Demande RH :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_demanderh ? true : false} value={view_demanderh} onChange={handledemanderh} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={demanderhedit ? true : false}  value={demanderhedit} onChange={handledemanderhedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={demanderhdelete ? true : false}  value={demanderhdelete} onChange={handledemanderhdelete} />
                      </div>
                      </div> */}
                      {/* <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >Demande Autorisation :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_demandeaut ? true : false} value={view_demandeaut} onChange={handledemandeaut} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={demandeautedit ? true : false}  value={demandeautedit} onChange={handledemandeautedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={demandeautdelete ? true : false}  value={demandeautdelete} onChange={handledemandeautdelete} />
                      </div>
                      </div> */}
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Accueil' checked={accuiel ? true : false} value={accuiel} onChange={handleChangeAccuiel} />
                      </div>
                     
                      
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='View Historique' checked={view_historique ? true : false}  value={view_historique} onChange={handleOnChangeHistorique} />
                      </div>
       {/**               <div className="row">
                        <FormControlLabel control={<Checkbox />} label='view contrats' value={viewlistcontrats_admin} onChange={handleViewListContratsAdmin} />

                      </div> */}

                  

                      {/* <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Team leader' checked={view_espacepdg ? true : false}  value={view_espacepdg} onChange={handleOnchangeEspacePdg} />
                      </div> */}
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Supervision ' checked={viewdirecteur ? true : false} value={viewdirecteur} onChange={handleChangeViewDirecteur} />

                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Supervision_Autorisation ' checked={view_horaire_rh}  value={view_horaire_rh} onChange={()=>setdaut(!view_horaire_rh)} />

                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Supervision_Congés' checked={view_employe_rh}  value={view_employe_rh} onChange={()=>setViewdconge(!view_employe_rh)} />

                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Supervision_Demande_RH ' checked={view_contrat_rh}  value={view_contrat_rh} onChange={()=>setViewdrh(!view_contrat_rh)} />

                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Supervision_Demande_Pointage ' checked={view_dep_rh}  value={view_dep_rh} onChange={()=>setViewdpoin(!view_dep_rh)} />

                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Direction des opérations' checked={directionoperations ? true : false}  value={directionoperations} onChange={handleChangedirectionoperations} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='WFM' checked={wfm ? true : false} value={wfm} onChange={handleChangeWFM} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label=' Rapports' checked={view_rapports ? true : false} value={view_rapports} onChange={handleOnChangeRapports} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label=' Mouchard' checked={view_mouchard ? true : false} value={view_mouchard} onChange={handleOnChangeMouchard} />
                      </div>
                      {/* <div className="row">
                        <FormControlLabel control={<Checkbox />} label=' Téletravail' checked={view_teletravail ? true : false} value={view_teletravail} onChange={handleOnChangeTéletravail} />
                      </div> */}
                     
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='autorisation' checked={view_autorisation ? true : false} value={view_autorisation} onChange={handleOnChangeautorisation} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label=' Congés' checked={view_conge ? true : false} value={view_conge} onChange={handleOnChangeConge} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Demande Pointage ' checked={view_mission ? true : false} value={view_mission} onChange={handleOnChangemission} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Demande RH  ' checked={view_demanderh? true : false}  value={view_demanderh} onChange={handledemanderh} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Affectation pause' checked={affectationopause ? true : false} value={affectationopause} onChange={handleaffectationopause} />
                      </div>
                      
                      </div>
                      </div>
                      </div>


                            <div className="form-group"><button className="btn btn-primary" onClick={Updaterole}>Valider</button></div>    </form>


                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div></div></div></div></div>
  )
}
export default CrudRoles;
/**
 */