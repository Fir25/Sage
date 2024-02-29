import ApartmentIcon from '@mui/icons-material/Apartment';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import React, { useEffect, useState } from "react";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HomeIcon from '@mui/icons-material/Home';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import GroupsIcon from '@mui/icons-material/Groups';
import FeedIcon from '@mui/icons-material/Feed';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { makeStyles } from '@mui/styles';
import CrudCongé from './Responsable/CrudCongé'
import { Routes } from "react-router-dom";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CrudRoles from './Roles/CrudRoles';
import CrudPlaning from './Planning/CrudPlaning';
import CrudAbsence from './Absence/CrudAbsence'
import Rapportwfm from './wfmdashboard/wfmdashboard';
import Rapportoperation from './operationdashboard/operation';
import Rapportbusiness from './businessdashboard/business';
import Rapportlead from './teamdashboard/teamlead';
import CrudDepartement from './Départements/CrudDepartement';
import CrudPointages from './Pointeuses/CrudPointages';
import CrudContrats from './Contrats/CrudContrats'
import CrudJourFerié from './Absence/CrudJourFerié';
import CrudUserr from './Utilisateurs/CrudUserr';
import CrudPointeuse from './Pointeuses/CrudPointeuse';
import CrudHorraire from './Horaire/CrudHorraire';
import CrudPlansemaine from './Horaire/CrudPlansemaine';
import ListdemandeRh from './demanderh/cruddemanderh';
import CrudMotif from './Absence/CrudMotif';

import {
  Route,
  Link

} from "react-router-dom";

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Logout from './authentification/logout';
import ListeAutorisations from './Responsable/ListeAutorisations';
import Historique from './Historique/historique';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RapportPointage from './Rapports/RapportPointage';
import RappportJournalier from './Rapports/RapportJournalier';
import RapportSemaine from './Rapports/RapportSemaine';
import Rapportabsences from './Rapports/Rapportabsences';
import RapportSynthese from './Rapports/Rapportsynthese';
import Tableau from './Accueil/Tableau';
import EmployesPartis from './Utilisateurs/EmployesPartis';

import IndicateursAutomatique from './Responsable/IndicateursAutomatique';
import RapportMensuelle from './Rapports/RapportMensuelle';
import RapportAnnulle from './Rapports/RapportAnnuelle';

import Missions from './Responsable/Missions';
import ListMouchard from './Mouchardd/ListMouchard'

import EngineeringIcon from '@mui/icons-material/Engineering';
import CrudcongesEmploye from './Congés/CrudcongesEmploye';
import UpdatePassword from './Accueil/UpdatePassword';
import CrudTeletravail from './teletravail/crudteletravail';
import Teletravails from './Responsable/teletravails';
import Listautorisations from './Autorisations/Listautorisations';
import ListeMissions from './Missions/ListMissions';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import CrudSite from './Site/CrudSite';
import Crudequipe from './equipe/Crudequipe'
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Contratss from './Contrats';

import * as pdfMake from '../../node_modules/pdfmake/build/pdfmake.js';
import * as pdfFonts from '../../node_modules/pdfmake/build/vfs_fonts.js';

import JSZip from 'jszip';
import logoutfunction from './authentification/logoutfunction';

import { useSelector } from "react-redux";
import CrudCongédirecteur from './Directeur/CrudCongédirecteur';
import Demanderhdirecteur from './Directeur/demanderhdirecteur';
import Teletravailsdirecteur from './Directeur/Pointagedirecteur';
import ListeAutorisationsdirecteur from './Directeur/ListeAutorisationsdirecteur';
import RapportConges from './Rapports/RapportConges';
import CrudPause from './Horaire/CrudPause';


import PauseCircleIcon from '@mui/icons-material/PauseCircle';

import CrudAffectationPause from './AffectationPause/CrudAffectationPause';
import CrudCongéoperation from './directionopérations/CrudCongédoperation';
import Missionsoperation from './directionopérations/Missionsoperation';
import Teletravailsoperation from './directionopérations/teletravailsoperation';
import ListeAutorisationsoperation from './directionopérations/ListeAutorisationsoperation';
import ListeAutorisationswfm from './wfm/ListeAutorisationswfm';
import Teletravailswfm from './wfm/teletravailswfm';
import Missionswfm from './wfm/Missionswfm';
import CrudCongéWFM from './wfm/CrudCongéwfm';
import Crudworkflow from './workflow/crudworkflow';
import Organigramme from './Départements/organigramme';
import RapportPaie from './Rapports/rapportpaie';
import ListdemandePointage from './demandePointage/cruddemandepointage';
import PointageDirecteur from './Directeur/Pointagedirecteur';
window.JSZip = JSZip;

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const useStyle = makeStyles({
  iconSidebar: {
    marginRight: 10,
    marginLeft: 10,
    color: 'white'

,

  },
  iconlogin:{
    color:"#4682B4",

  }

});

function Sidebar() {
  
  const userinfo =useSelector(state => state.userinfo);

  useEffect(() => {
    const url=process.env.React_App_URL;

 setTimeout(() => {
      const token=localStorage.getItem('access_token')
      fetch(url+'token/verify/', {
        method: 'post',
        headers: {
    
          'Content-Type': 'application/json',
        
        },body: JSON.stringify({
          "token": token
      })
        
      }).then((response) => {
        if(response.status==500) {logoutfunction(response)}
      }).catch((err)=>{
      
        if(err.status==500) {logoutfunction(err)}
      })
    
    }, 10800100);
    
  }, []);

  const classes = useStyle()
  const test=userinfo[0]

 
  return (

    <div>

{Object.keys(userinfo).length !=0?   
<>
      <nav className="navbar navbar-vertical fixed-left navbar-expand-md navbar-light" id="sidenav-main"  >
        <div className="container-fluid">

          <button  className="navbar-toggler" type="button" data-toggle="collapse" data-target="#sidenav-collapse-main" aria-controls="sidenav-main" aria-expanded="false" aria-label="Toggle navigation">
          <TableRowsIcon />
          </button>

          <div >
            <img src="./activecontact.png" style={{ justifyContent: 'center', width: "110px", height: "80%" }} className="img-responsive logo"  alt="..." />
          </div>

          <ul className="nav align-items-center d-md-none">

            <li className="nav-item dropdown">
              <a className="nav-link" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <div className="media align-items-center">
                  <AccountCircleRoundedIcon    className={classes.iconlogin} />
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-right">
                <div className=" dropdown-header noti-title">
                  <h6 className="text-overflow m-0">Bienvenue</h6>
                </div>
                <div className="dropdown-item">
                  <i className="ni ni-single-02"></i>
                  <Link className="nav-link-text" to="/home" style={{color:"black"}} >Mon profile</Link>
                </div>

  
                <div  className="dropdown-item">
             
             <i className="ni ni-active-40"></i>
           
             <Link className="nav-link-text" data-toggle="modal" data-target={`#p${test['id']}`} to="/home/modiferPassword" style={{color:"black"}}>Modifier mon mot de passe</Link>
       
           </div>
                <div className="dropdown-divider"></div>
                <div  className="dropdown-item">
             
                  <i className="ni ni-user-run"></i>
                
                  <Link className="nav-link-text" to="/home/logout" style={{color:"black"}} >Déconnexion</Link>
            
                </div>

              </div>
            </li>
          </ul>

          <div className="collapse navbar-collapse" id="sidenav-collapse-main" >

            <div className="navbar-collapse-header d-md-none">
              <div className="row">
                <div className="col-6 collapse-brand">
                  <a >

                  </a>
                </div>
                <div className="col-6 collapse-close">
                  <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#sidenav-collapse-main" aria-controls="sidenav-main" aria-expanded="false" aria-label="Toggle sidenav">
                    <span></span>
                    <span></span>
                  </button>
                </div>
              </div>
            </div>

            <form className="mt-4 mb-3 d-md-none">
              <div className="input-group input-group-rounded input-group-merge">
                {/** <input type="search" className="form-control form-control-rounded form-control-prepended" placeholder="Search" aria-label="Search" />
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <span className="fa fa-search"></span>
                  </div>
                </div> */}
              </div>
            </form>

            <ul className="navbar-nav" >
           
            {test['accuiel'] == true? (      <li className="nav-item">
                
                <div className="nav-link">
                  <a >
                    <HomeIcon
                      className={classes.iconSidebar}
                    />
                  </a>
                  <Link className="nav-link-text" to="/home/" id="textsidebargras">Accueil</Link>

                </div>
              </li>):""}
             
             
    
              {test['viewdirecteur'] == true? (
              
              <li className="nav-item" id="textsidebargras">
                <div className="dropdown nav-link">
                  <a id="dropdownMenupdg" data-toggle="dropdown" href="" >
                    < ManageAccountsIcon
                      className={classes.iconSidebar}
                    />

                Supervision
                  </a>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenupdg">

                  <Link className="dropdown-item" to="/home/Rapportbusiness" >Tableau de supervision </Link>
                
                   
                    {test['view_employe_rh'] && (
                    <Link className="dropdown-item" to="/home/ListeCongesdirecteur" >Congés</Link>)}
                    {test['view_horaire_rh'] && (
                    <Link className='dropdown-item' to="/home/ListeAutorisationsdirecteur">Liste des autorisations</Link>)}
                    {test['view_contrat_rh'] &&  (
                    <Link className='dropdown-item' to="/home/Listdemanderhdirecteur">Liste de demande RH</Link>)}
                 
                    {test['view_dep_rh'] &&  (
                                       <Link  className="dropdown-item" to="/home/listdemandepointage">Liste de demande pointage</Link>
                                       )}
                   
                    <Link className='dropdown-item' to="/home/indicateurautomatiquedirecteur">Indicateurs Dynamique</Link>

                    {/* const [view_employe_rh,setViewdconge]=useState(false)
    const [view_dep_rh,setViewdpoin]=useState(false)
    const [view_contrat_rh,setViewdrh]=useState(false)
    const [view_horaire_rh,setdaut]=useState(false) */}
                  </div>
                </div>
              </li>) : ""}


              {test['wfm'] == true? (
              
              <li className="nav-item" id="textsidebargras">
                <div className="dropdown nav-link">
                  <a id="dropdownMenupdg" data-toggle="dropdown" href="" >
                    < ManageAccountsIcon
                      className={classes.iconSidebar}
                    />

                WFM
                  </a>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenupdg">
                  {test['view_horaire'] == true  && <>
                  <Link className="dropdown-item" to="/home/Horaire" > Liste des Horaires </Link>
                    <Link className="dropdown-item" to="/home/plansemaine" >  Plan de semaine </Link>
                    <Link className='dropdown-item' to="/home/pause"> Pause </Link>
                    </>}
                    {test['view_planing'] == true && 
                    <Link className='dropdown-item' to="/home/Planning">  Planning</Link>
              }

                  </div>
                </div>
              </li>) : ""}

              {test['view_rapports'] == true ? (
                    <li className="nav-item" id="textsidebargras">
                      <div className="dropdown nav-link">
                        <a id="dropdownMenuAbscence" data-toggle="dropdown" href="" >
                          <MenuBookIcon
                            className={classes.iconSidebar} />
                          Rapports
                        </a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuAbscence">

                          <Link className="dropdown-item" to="/home/rapportpointage">Rapport Pointages</Link>

                          <Link className="dropdown-item" to="/home/rapportjournalier">Rapport Journalier</Link>
                          <Link className="dropdown-item" to="/home/rapportvb"> Import VB</Link>
                          <Link className="dropdown-item" to="/home/rapportconges">Rapport Congés</Link>
                          <Link className="dropdown-item" to="/home/rapportsemaine">Rapport Semaine</Link>
                          <Link className="dropdown-item" to="/home/rapportabsence">Rapport d'absence</Link>

                          <Link className="dropdown-item" to="/home/rapportsynthese">Rapport Synthése</Link>
                          <Link className="dropdown-item" to="/home/rapportmois">rapport mensuel</Link>

                          <Link className="dropdown-item" to="/home/rapportparans">Rapport Annuel</Link>
                      
                        </div>
                      </div>
                    </li>
                  ) : ""}
              
              {/* {test['view_mission']== true?(              <li className="nav-item">
                    <div className="nav-link" >
                      <a target="_blank">
                        <EngineeringIcon
                          className={classes.iconSidebar}
                        />
                      </a>
                      <Link className="nav-link-text" to="/home/missions" id="textsidebargras">Missions</Link>

                    </div>
                  </li>):""} */}
                  {test['view_autorisation'] == true?(    <li className="nav-item">
                    <div className="nav-link" >
                      <a target="_blank">
                        <CoPresentIcon
                          className={classes.iconSidebar}
                        />
                      </a>
                      <Link className="nav-link-text" to="/home/autorisation" id="textsidebargras">Autorisation</Link>

                    </div>
                  </li>):""}
                  {test['view_demanderh'] == true?(    <li className="nav-item">
                    <div className="nav-link" >
                      <a target="_blank">
                        <CoPresentIcon
                          className={classes.iconSidebar}
                        />
                      </a>
                      <Link className="nav-link-text" to="/home/demanderh" id="textsidebargras" >Demande RH</Link>

                    </div>
                  </li>):""}
                  {test['view_mission'] == true?(    <li className="nav-item">
                    <div className="nav-link" >
                      <a target="_blank">
                        <FingerprintIcon
                          className={classes.iconSidebar}
                        />
                      </a>
                      <Link className="nav-link-text" to="/home/demandepointage" id="textsidebargras">Demande Pointage</Link>

                    </div>
                  </li>):""}
                  
              {test['view_departements'] == true || test['view_dep_rh']==true ? (<><li className="nav-item"  id="textsidebargras">
                <div className="nav-link">
                  <a >
                    <ApartmentIcon
                      className={classes.iconSidebar} />
                  </a>
                  <Link className="nav-link-text" to="/home/organigramme">Organigramme</Link>
                </div>

              </li>
            </>) : ""}

              {test['affectationopause'] == true?     
               <li className="nav-item">
                <div className="nav-link">
                  <a >
                    <PauseCircleIcon
                      className={classes.iconSidebar} />
                  </a>
                  <Link className="nav-link-text" to="/home/affectationopause" id="textsidebargras">Affectation pause</Link>
                </div>

              </li>
              :""}

   
              
      
{/**test */}
{/* {test['view_teletravail'] == true? (<li className="nav-item" id="textsidebargras">
                <div className="dropdown nav-link">
                  <a id="drop" data-toggle="dropdown" href="">
                  <HomeWorkIcon
                      className={classes.iconSidebar} />

Télétravail
                  </a>
                  <div className="dropdown-menu" aria-labelledby="drop">

    
                 

                 <Link  className="dropdown-item" to="/home/teletravail"  >Demander téletravail</Link>
               
          
                  
                        
                        
                          {test['viewlistTeletravail_drh'] == true ? (
              
              <Link  className="dropdown-item" to="/home/Listteletravails">Liste Télétravails</Link>
           ):""}
                  </div>
                </div>
              </li>) : ""}  */}
              {test['view_conge']== true? (<><li className="nav-item">
                    <div className="nav-link" >
                      <a target="_blank">
                        <DirectionsRunIcon
                          className={classes.iconSidebar}
                        />
                      </a>
                      <Link className="nav-link-text" to="/home/Demande" id="textsidebargras">Congés</Link>

                    </div>
                  </li>
                  {/* <li className="nav-item">
                  <div className="nav-link" >
                    <a target="_blank">
                      <DirectionsRunIcon
                        className={classes.iconSidebar}
                      />
                    </a>
                    <Link className="nav-link-text" to="/home/listeworkflow" id="textsidebargras">Workflow</Link>

                  </div>
                </li> */}
                </>) : ""}
              {/**test */}



         



 
                  

                </ul>


                <ul className="navbar-nav mb-md-3">
  {test['viewdirecteur'] == true || test['view_rapports'] == true ? (
    <li className="nav-item" id="textsidebargras">
      <div className="dropdown nav-link">
        <a
          className="dropdown-toggle"
          id="dropdownMenuZied"
          data-toggle="dropdown"
          href="#"
        >
          <GroupsIcon className={classes.iconSidebar} />
         
          Paramètres
        </a>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuZied">
          {/* New Menu Items */}

          {test['view_contrats'] == true  ? (
  <React.Fragment>
    
         
            <Link className="dropdown-item" to="/home/contrats">Types de Contrats</Link>
            
        
            <Link className="dropdown-item" to="/home/listcontrats">Contrats</Link>
         
       
  </React.Fragment>
) : null}

{test['view_employé'] == true ? (
  <React.Fragment>
   
          <Link className="dropdown-item" to="/home/Utilisateurs">Employés</Link>
          {/* <Link className="dropdown-item" to="/EmployeesPartis">Liste des employés partis</Link> */}
          <Link className="dropdown-item" to="/home/Roles">Roles</Link>
          <Link className="dropdown-item" to="/home/employespartis">Employés Partis</Link>
       
  </React.Fragment>
) : null}

{test['view_Sites'] == true ? (
  <React.Fragment>
   
        <Link className="dropdown-item" to="/home/site" >
          Sites
        </Link>
    
        <Link className="dropdown-item" to="/home/equipe" >
          Equipes
        </Link>
    
  </React.Fragment>
) : null}


          {test['view_horaire'] == true  && (
            <React.Fragment>
              <Link className="dropdown-item" to="/home/Horaire">
                Liste des Horaires
              </Link>
              <Link className="dropdown-item" to="/home/plansemaine">
                Plan de semaine
              </Link>
              <Link className="dropdown-item" to="/home/pause">
                Pause
              </Link>
            </React.Fragment>
          )}

          {test['view_planing'] == true  && (
            <Link className="dropdown-item" to="/home/Planning">
              Planning
            </Link>
          )}

          {test['view_absence'] == true  && (
            <React.Fragment>
              <Link className="dropdown-item" to="/home/Motif">
                Motif
              </Link>
              <Link className="dropdown-item" to="/home/Affecter">
                Affecter Absence
              </Link>
              <Link className="dropdown-item" to="/home/Jours">
                Jours fériés
              </Link>
            </React.Fragment>
          )}

         
  {test['view_departements'] == true ? (
  <React.Fragment>
   
        <Link className="dropdown-item" to="/home/Departements">
          Départements
        </Link>
    
  </React.Fragment>
) : null}
      
         
{test['view_pointeuse'] == true ? (
  <React.Fragment>
   
       
          <Link className="dropdown-item" to="/home/Pointeuses">Pointeuses</Link>
       
  </React.Fragment>
) : null}
{test['view_pointage'] == true ? (
  <React.Fragment>
   
       
   <Link className="dropdown-item" to="/home/Pointages">Pointages</Link>
       
  </React.Fragment>
) : null}

{test['view_historique'] == true  ? (
  <React.Fragment>
  
        <Link className="dropdown-item" to="/home/historique" >Historique</Link>
      
  </React.Fragment>
) : null}

{test['view_mouchard'] == true ? (
  <React.Fragment>
    

        <Link className="dropdown-item" to="/home/mouchard" >Mouchard</Link>
     
  </React.Fragment>
) : null} 

        </div>
      </div>
    </li>
  ) : null}
  
 
</ul>



                <ul className="navbar-nav mb-md-3">


                </ul>
                <ul className="navbar-nav">

                </ul>
              </div>
          </div>
      </nav>
      <div className="main-content">
        <nav className="navbar navbar-top  navbar-expand-md navbar-dark  " id="navbar-main">
          <div className="container-fluid">
    <div className='row'>
<div className='col-md-6' style={{ display: 'flex' , alignItems : 'center' , justifyContent : 'center'}} >


<div style={{ width:'200px',border:'1px solid #77b5fe',color:"#4682B4" ,borderRadius:"8px", backgroundColor:"white",boxShadow :"  0 0 8px 0px",fontStyle:"italic"}}>Bienvenue <br/> {test['user_name']}  {test['last_name']} 
          </div> 
        </div>
        <div className='col-md-6'  style={{ display: 'flex' , alignItems : 'center' , justifyContent : 'center'}}>
        <div style={{width:'200px',border:'1px solid #77b5fe',color:"#4682B4",borderRadius:"8px" , backgroundColor:"white",boxShadow :"  0 0 8px 0px",fontStyle:"italic"}}>  Matricule:&nbsp; {test['matricule']}</div>

        </div>
        </div> 

            {/* <a class="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block" href="../index.html">Tables</a> */}

            <form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
              <div className="form-group mb-0">
                {/** <div class="input-group input-group-alternative">
                <div class="input-group-prepend">
                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                  </div>
                  <input class="form-control" placeholder="Search" type="text" />
                </div> */}
              </div>
            </form>

            <ul className="navbar-nav align-items-center d-none d-md-flex">
              <li className="nav-item dropdown">
                <a className="nav-link pr-0" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <div className="media align-items-center">

                    <div className="media-body ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm  font-weight-bold">


                        <AccountCircleRoundedIcon className={classes.iconlogin} />

                      </span>
                    </div>
                  </div>
                </a>
                <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-right">
                  <div className=" dropdown-header noti-title">
                    <h6 className="text-overflow m-0">bienvenue!</h6>
                  </div>

                  <div className="dropdown-item">
                    <i className="ni ni-single-02"></i>
                    <Link className="nav-link-text" to="/home" style={{color:"black"}}>Mon profile</Link>
                  </div>
                  {/**  <a href="../examples/profile.html" class="dropdown-item">
                <i class="ni ni-settings-gear-65"></i>
                <span>Settings</span>
              </a> */}
  
  <div  className="dropdown-item">
             
             <i className="ni ni-active-40"></i>
           
             <Link className="nav-link-text" data-toggle="modal" data-target={`#p${test['id']}`} to="/home/modiferPassword" style={{color:"black"}} >Modifier mon mot de passe</Link>
       
           </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item">
               
                      <i className="ni ni-user-run"></i>
                 
                    <Link className="nav-link-text" to="/home/logout" style={{color:"black"}} >Déconnexion</Link>
                  </div>
                
                </div>
              </li>

            </ul>
          </div>
        </nav>
        <div className="header  pb-6 pt-8 pt-md-0 " style={{backgroundColor:"#FDFEFF"}}></div>
        <Routes>
          <Route path="Pointages" element={<CrudPointages />} />

          <Route path="contrats" element={<CrudContrats />} />
          <Route path="Utilisateurs" element={<CrudUserr />} />

          <Route path="Pointeuses" element={<CrudPointeuse />} />
          <Route path="Horaire" element={<CrudHorraire />} />
          <Route path="Motif" element={<CrudMotif />} />
          <Route path="Departements" element={<CrudDepartement />} />
          <Route path="organigramme" element={<Organigramme />} />

          <Route path="Roles" element={<CrudRoles />} />

          <Route path="plansemaine" element={<CrudPlansemaine />} />
          <Route path="Planning" element={<CrudPlaning />} />
          <Route path="Affecter" element={<CrudAbsence />} />
          <Route path="Jours" element={<CrudJourFerié />} />
          <Route path='Demande' element={<CrudcongesEmploye />} />
          <Route path='autorisation' element={<Listautorisations/>} />
          <Route path='demanderh' element={<ListdemandeRh/>} />

          <Route path='demandepointage' element={<ListdemandePointage/>} />
          {/* <Route path='missions' element={<ListeMissions/>} /> */}
          <Route path='listeConges' element={<CrudCongé />} />



          {/* <Route path="ListeMissions" element={<Missions />} /> */}
          <Route path='logout' element={<Logout />}></Route>
          <Route path='modiferPassword' element={<UpdatePassword />}></Route>
          <Route path="ListeAutorisations" element={<ListeAutorisations />}></Route>

          <Route path="historique" element={<Historique />}></Route>
          <Route path="rapportpointage" element={<RapportPointage />}></Route>
          
          <Route path="rapportconges" element={<RapportConges />}></Route>
          <Route path="rapportjournalier" element={<RappportJournalier />}></Route>
          <Route path="rapportvb" element={<RapportPaie />}></Route>

          <Route path="rapportsemaine" element={<RapportSemaine />}></Route>
          <Route path="rapportabsence" element={<Rapportabsences />}></Route>
          <Route path="rapportsynthese" element={<RapportSynthese />}></Route>
          <Route path="" element={<Tableau />}></Route>
          <Route path="employespartis" element={<EmployesPartis />}></Route>
          <Route path="indicateurautomatique" element={<IndicateursAutomatique />}></Route>
          <Route path="rapportmois" element={<RapportMensuelle />}></Route>
          <Route path="rapportparans" element={<RapportAnnulle />}></Route>
          <Route path="mouchard" element={<ListMouchard />}></Route>    
          <Route path="teletravail" element={<CrudTeletravail />}></Route>
          <Route path="Listteletravails" element={<Teletravails/>}></Route>
          <Route path="site" element={<CrudSite/>}></Route>
          <Route path="Equipe" element={<Crudequipe/>}></Route>
          
          <Route path="listcontrats" element={<Contratss/>}></Route>


          <Route path="ListeAutorisationsdirecteur" element={<ListeAutorisationsdirecteur />}></Route>
          <Route path="listdemandepointage" element={<PointageDirecteur/>}></Route>
          <Route path="Listdemanderhdirecteur" element={<Demanderhdirecteur />} />
          <Route path='listeCongesdirecteur' element={<CrudCongédirecteur />} />

          
           <Route path='Rapportwfm' element={<Rapportwfm />} />
           <Route path='Rapportoperation' element={<Rapportoperation />} />
           <Route path='Rapportbusiness' element={<Rapportbusiness />} />
           <Route path='Rapportlead' element={< Rapportlead  />} />
     

          <Route path="ListeAutorisationsdirectionoperations" element={<ListeAutorisationsoperation />}></Route>
          <Route path="Listteletravailsdirectionoperations" element={<Teletravailsoperation/>}></Route>
          {/* <Route path="ListeMissionsdirectionoperations" element={<Missionsoperation />} /> */}
          <Route path='listeCongesdirectionoperations' element={<CrudCongéoperation />} />


          <Route path="ListeAutorisationswfm" element={<ListeAutorisationswfm />}></Route>
          <Route path="Listteletravailswfm" element={<Teletravailswfm/>}></Route>
          {/* <Route path="ListeMissionswfm" element={<Missionswfm />} /> */}
          <Route path='listeCongeswfm' element={<CrudCongéWFM />} />
          <Route path='listeworkflow' element={<Crudworkflow />} />

          
          <Route path='pause' element={<CrudPause/>} />
          <Route path='affectationopause' element={<CrudAffectationPause/>} />
          
        </Routes>

      </div>
      </>
  :""}



    </div>
  )
}


export default Sidebar;