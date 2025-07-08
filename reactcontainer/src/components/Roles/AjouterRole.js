

import React, { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Checkbox from "@material-ui/core/Checkbox";

function AjouterRole() {
  const url=process.env.React_App_URL;
  const [viewlistcontrats_admin,setviewlistcontratsadmin]=useState(false)
    const [rh, setRH] = useState(false)
    const [DRH, setDRH] = useState(false)
    const [view_conge, setViewCongé] = useState(false)
    const [view_employé, setViewEmploye] = useState(false)
    const [modifier_employé, setViewEmployemod] = useState(false)
    const [delete_employé, setViewEmployedel] = useState(false)
    const [view_demanderh, setdemanderh] = useState(false)
    const [demanderhedit, setdemanderhedit] = useState(false)
    const [demanderhdelete, setdemanderhdelete] = useState(false)
    const [view_demandeaut, setdemandeaut] = useState(false)
    const [demandeautedit, setdemandeautedit] = useState(false)
    const [demandeautdelete, setdemandeautdelete] = useState(false)   
    const [selectall, setselectall] = useState(false)   
    const [view_departements, setViewDepartements] = useState(false)
    const [view_departements_edit, setViewDepartementsedit] = useState(false)
    const [view_departements_del, setViewDepartementsdel] = useState(false)
  
    
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
    const [view_employe_rh,setViewdconge]=useState(false)
    const [view_dep_rh,setViewdpoin]=useState(false)
    const [view_contrat_rh,setViewdrh]=useState(false)
    const [view_horaire_rh,setdaut]=useState(false)

    
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
    const handleOnChangeContrats = () => {
      setvieContrats(!view_contrats);
    };
    const handleOnChangeContratsedit = () => {
      seteditcontrat (!contratsedit);
    };
    const handleOnChangeContratsdelete = () => {
      setdeletecontrat(!contartdelete);
    };
    // const handleselectall = () => {
      
    //   setselectall((prevSelectAll) => !prevSelectAll);
    //   setViewCongé(!selectall);
    //   setViewEmploye(!selectall);
    //   setViewDepartements(!selectall);
    // };
    const handleselectall = () => {
      setselectall(!selectall);
    
      // Update each state variable individually based on the selectall value
      setviewlistcontratsadmin(!selectall);
      setRH(!selectall);
      setDRH(!selectall);
      setViewCongé(!selectall);
      setViewEmploye(!selectall);
      setViewEmployemod(!selectall);
      setViewEmployedel(!selectall);
      setdemanderh(!selectall);
      setdemanderhedit(!selectall);
      setdemanderhdelete(!selectall);
      setdemandeaut(!selectall);
      setdemandeautedit(!selectall);
      setdemandeautdelete(!selectall);
      setViewDepartements(!selectall);
      setViewDepartementsedit(!selectall);
      setViewDepartementsdel(!selectall);
      setViewEspacePdg(!selectall);
      setvieContrats(!selectall);
      seteditcontrat(!selectall);
      setdeletecontrat(!selectall);
      setViewPointeuses(!selectall);
      setpointeuseedit(!selectall);
      setdeletepointeuse(!selectall);
      setpointage(!selectall);
      setpointageedit(!selectall);
      setpointagedelete(!selectall);
      setViewAbsence(!selectall);
      setViewPlaning(!selectall);
      setViewHoraire(!selectall);
      setViewistorique(!selectall);
      setViewMouchard(!selectall);
      setViewRapports(!selectall);
      setViewTeletravail(!selectall);
      setViewAutorisation(!selectall);
      setViewMission(!selectall);
      setview_Sites(!selectall);
      setViewDirecteur(!selectall);
      setaffectationopause(!selectall);
      setaccuiel(!selectall);
      setDirectionoperations(!selectall);
      setwfm(!selectall);
      setabsenceedit(!selectall);
      setabsencedelete(!selectall);
      sethoraireedit(!selectall);
      sethorairedelete(!selectall);
      setsiteedit(!selectall);
      setsitedelete(!selectall);
      setplanningedit(!selectall);
      setplanningdelete(!selectall);
      setdaut(!selectall)
      setViewdconge(!selectall)
      setViewdrh(!selectall)
      setViewdpoin(!selectall)
  
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

  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const [rolename, setRoleName] = useState('');

  const handlesubmit = (e) => {
    e.preventDefault()
  

    let rolelis = {view_employe_rh , view_dep_rh ,view_contrat_rh ,view_horaire_rh ,  wfm, directionoperations, accuiel, affectationopause, viewdirecteur, viewlistcontrats_admin, DRH,   view_Sites,  view_autorisation, view_mission, rolename, view_absence, view_conge, view_contrats, view_departements, view_employé, view_espacepdg, view_horaire, view_planing, view_pointeuse, view_historique, view_rapports, view_mouchard, view_teletravail , modifier_employé    ,      delete_employé  ,     view_departements_edit  ,     view_departements_del ,       contratsedit,      contartdelete ,     pointeuseedit ,     pointeusedelete  ,   horaireedit ,      horairedelete  ,   absenceedit   ,     absencedelete ,    planningedit  ,    planningdelete  ,   Sitesedit ,   Sitesdelete  ,  pointageedit , pointagedelete , view_pointage , view_demandeaut , view_demanderh , demandeautedit , demandeautdelete , demanderhedit , demanderhdelete}

    fetch(url+"role/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(rolelis)
      }).then(() => {
        
      

        window.location.reload(false)

      }).catch((err) => {
          console.log(err)
      })
  }



  return (
    <div>

      <div className="row">

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterrole">
          Ajouter un role
        </button>


        <div className="modal fade" id="ajouterrole" role="dialog" aria-labelledby="#ajouterrole" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ajouter Role</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>

                  {/**      <TextField
                                            id="outlined-select-currency"
                                            select
                                            label="Role"
                                            value={rolename}
                                            onChange={(e) => setRoleName(e.target.value)}
                                            helperText=""
                                            margin='normal'
                                            fullWidth
                                        >
                                         
                                                <MenuItem key="10" value="Chef">
                                                Chef
                                                </MenuItem>
                                                <MenuItem key="11" value="Rh">
                                                  Rh
                                                </MenuItem>
                                                <MenuItem key="12" value="Employé">
                                                  Employé
                                                </MenuItem>
                                                <MenuItem key="13" value="Directeur">
                                                 Directeur
                                                </MenuItem>

                                     

                                        </TextField> */}
                  <div className="row">
                    <div className="col-md-6" style={{margin : 'auto'}}>

                      <input className="form-control" placeholder="role" value={rolename} name="role" onChange={(e) => setRoleName(e.target.value)} type="text" />
                    </div>
                    <div className="col-md-6">
                      <TextField
                        id="outlined-select-currency"
                        select
                        label="DRH"
                        value={DRH}
                        onChange={(e) => setDRH(e.target.value)}
                        helperText="DRH"
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
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_employé}  value={view_employé} onChange={handleChangeEmploye} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={modifier_employé}  value={modifier_employé} onChange={handleChangeEmployeedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={delete_employé}  value={delete_employé} onChange={handleChangeEmployedelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 > Departement :</h4>
                        </div>
               
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_departements}  value={view_departements} onChange={handleOnchangeDepartements} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={view_departements_edit} value={view_departements_edit} onChange={handleOnchangeDepartementschange} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={view_departements_del}  value={view_departements_del} onChange={handleOnchangeDepartementsdelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >contrats :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_contrats}  value={view_contrats} onChange={handleOnChangeContrats} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={contratsedit}   value={contratsedit} onChange={handlecontratedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression'  checked={contartdelete} value={contartdelete} onChange={handlecontratdelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >pointeuses :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_pointeuse}  value={view_pointeuse} onChange={handleChangepointeuse} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification '  checked={pointeuseedit}  value={pointeuseedit} onChange={setpointeusedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression'  checked={pointeusedelete}  value={pointeusedelete} onChange={setpointeusedelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >horaire :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage '  checked={view_horaire} value={view_horaire} onChange={handleOnChangeHoraire} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification '  checked={horaireedit}  value={horaireedit} onChange={handlehoraireedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression'   checked={horairedelete}  value={horairedelete} onChange={handlehorairedelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >planning :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_planing}   value={view_planing} onChange={handleOnChangePlaning} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={planningedit}  value={planningedit} onChange={handleplanningtedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression'  checked={planningdelete} value={planningdelete} onChange={handleplanningdelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >absence :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage '  checked={view_absence}  value={view_absence} onChange={handleOnChangeAbsence} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification '  checked={absenceedit}  value={absenceedit} onChange={handleabsenceedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression'  checked={absencedelete}  value={absencedelete} onChange={handleabsencedelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >site :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_Sites}  value={view_Sites} onChange={handleChangeSites} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={Sitesedit} value={Sitesedit} onChange={handlesiteedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={Sitesdelete} value={Sitesdelete} onChange={handlesitedelete} />
                      </div>
                      </div>
                      <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >pointage :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_pointage} value={view_pointage} onChange={handlechangepointage} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={pointageedit} value={pointageedit} onChange={handlepointageedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={pointagedelete} value={pointagedelete} onChange={handlepointagedelete} />
                      </div>
                      </div>
                      {/* <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >Demande RH  :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_demanderh}  value={view_demanderh} onChange={handledemanderh} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={demanderhedit}  value={demanderhedit} onChange={handledemanderhedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={demanderhdelete}  value={demanderhdelete} onChange={handledemanderhdelete} />
                      </div>
                      </div> */}
                      {/* <div className="row">
                      <div className="col-md-3" style={{margin : "auto"}}>
                      <h4 >Demande Autorisation  :</h4>
                        </div>
                       
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='affichage ' checked={view_demandeaut}  value={view_demandeaut} onChange={handledemandeaut} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='modification ' checked={demandeautedit}  value={demandeautedit} onChange={handledemandeautedit} />
                      </div>
                      <div className="col-md-3">
                        <FormControlLabel control={<Checkbox />} label='suppression' checked={demandeautdelete}  value={demandeautdelete} onChange={handledemandeautdelete} />
                      </div>
                      </div> */}
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Accueil' value={accuiel} checked={accuiel} onChange={handleChangeAccuiel} />
                      </div>
                     
                      
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Historique' checked={view_historique} value={view_historique} onChange={handleOnChangeHistorique} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='WFM' value={wfm} onChange={()=>setwfm(!wfm)} />

                      </div>

                
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Congés' checked={view_conge}  value={view_conge} onChange={handleOnChangeConge} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Autorisation ' checked={view_demandeaut}  value={view_demandeaut} onChange={handledemandeaut} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Demande RH  ' checked={view_demanderh}  value={view_demanderh} onChange={handledemanderh} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Demande Pointage'  checked={view_mission}  value={view_mission} onChange={handleOnChangemission} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Supervision' checked={viewdirecteur}  value={viewdirecteur} onChange={handleChangeViewDirecteur} />

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
                        <FormControlLabel control={<Checkbox />} label='Rapports'  checked={view_rapports}   value={view_rapports} onChange={handleOnChangeRapports} />
                      </div>
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Mouchard'  checked={view_mouchard}  value={view_mouchard} onChange={handleOnChangeMouchard} />
                      </div>
                      {/* <div className="row">
                        <FormControlLabel control={<Checkbox />} label=' Téletravail'  checked={view_teletravail}  value={view_teletravail} onChange={handleOnChangeTéletravail} />
                      </div> */}
                    
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='autorisation'  checked={view_autorisation}  value={view_autorisation} onChange={handleOnChangeautorisation} />
                      </div>
                     
                      <div className="row">
                        <FormControlLabel control={<Checkbox />} label='Affectation pause'  checked={affectationopause}   value={affectationopause} onChange={handleaffectationopause} />
                      </div>
                      
                      </div>
<div className="col-md-6">
  

   
             

          {/**            <div className="row">
                        <FormControlLabel control={<Checkbox />} label='view contrats_RH' value={viewlistcontrats_rh} onChange={handleViewlistcontratsRH} />

                      </div> */}
</div>

                     {/* <div >
                        <FormControlLabel control={<Checkbox />} label='view List Téletravail DRH' value={viewlistTeletravail_drh} onChange={handleviewlistTeletravail_drh} />

                      </div>  */}
                      
                    </div>

                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
                    <button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button>
                  </div>

                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>


  )

}



export default AjouterRole;

