

import useFetch from '../useFetch';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

import * as React from 'react';

import moment from "moment";
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AjouterUtilisateur from './AjouterUtilisateur';
import frdatatable from '../../frdatatable.json'
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutboundIcon from '@mui/icons-material/Outbound';

import { useMemo } from 'react';

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import { makeStyles } from "@material-ui/core/styles";

import axios from 'axios';

import Checkbox from "@material-ui/core/Checkbox";

import Mouchard from '../Mouchardd/Mouchard';

import ImportUser from './ImportUser';

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MenuProps } from "../Rapports/utils";
import ListItemText from "@material-ui/core/ListItemText";
import { useReactToPrint } from "react-to-print";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


import AjouterSolde from './AjouterSolde';
import ScrollContainer from 'react-indiana-drag-scroll'

import { useSelector } from 'react-redux';
import $ from "jquery";

import { useRef } from 'react';

function ListeUtilisateurs() {
const [ajoutcontrats,setajoutcontrat]=useState({'démarrageContrat':'','datefin':'','rappel1':'','rappel2':'','employe':'','typecontrat':''})
  const [contratsList, setContratsList] = useState([])
  const [contratss, setContratss] = useState([])
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const url = process.env.React_App_URL;

  const [treeData, setTreeData] = React.useState([]);
  const token = localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null


  const { data: sites, isloading: loz, error: errdv } = useFetch(url + "createlistsite/")

  const [openn, setOpenn] = useState(false)
  const [post, setPost] = useState(false)
  const [nomdep, setNomDep] = useState('')
  React.useEffect(() => {


    if (users.length == 0) {

      setOpenn(true)
      setPost(false)

    } else {
      setOpenn(false)
      setPost(true)
    }
  }
    , [openn, post])

  function getStatuses(arbor, dat) {

    var result = {}

    const iterate = (obj) => {
      if (!obj) {
        return;
      }
      Object.keys(obj).forEach(key => {
        var value = obj[key]
        if (typeof value === "object" && value !== null) {
          iterate(value)

          if (value.value == arbor.toString()) {
            setNomDep(value.label)
            obj[key].checked = true;
          } else {
            obj[key].checked = false;
            result[key] = value;
          }
        }
      })
    }

    iterate(dat)
    return result;
  }





  const [arborescence, setActualSelected] = React.useState([]);
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
   var view_historique_rh=test['view_historique_rh']
   var admin=test['admin']
   var modifier_employé = test['modifier_employé'] 
   var delete_employé = test['delete_employé'] 
    
  }

  //
  const { data: users = [], isloading:load, error:ee } = useFetch(url + "UsersOfChef/" + iduserinfo)
  function prepareDataForExport(users) {
    return users.map(user => {
      return {
        "Employé": `${user.last_name} ${user.user_name}`,
        "Matricule": user.matricule,  
        "activite": user.activite,      
        "email": user.email,
      
      
        "role": user.roles,
       
       
         "matriculecnss": user.matriculecnss,
        // "sex": user.sex,
        // "datedemarrage": user.datedemarrage,
        
       
        // "datedenaissance": user.datedenaissance,
        // "CIN": user.CIN,
        // "nbEnfants": user.nbEnfants,
        // "tel": user.tel,
      
        // "commentaire": user.commentaire,
        // "teletravail": user.teletravail,
        // "situation_sociale": user.situation_sociale,
        // "solde": user.solde, 
        // "matriculepaie":user.matriculepaie,
      };
    });
  }
  const [open, setOpen] = useState(false);
  const [openparti, setOpenparti] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenparti = () => {
    setOpenparti(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseparti = () => {
    setOpenparti(false);
  };

  const [sittee, setsitte] = useState('')

  const useStyle = makeStyles((theme) => ({
    root: {
      height: 240,
      flexGrow: 1,
      maxWidth: 400
    },
    imageemploye: {
      height: 80,
      width: 80
    }, formControl: {
      margin: theme.spacing(1),
      width: 200,

    }, icon: {
      marginRight: 10,
      marginLeft: 10,
      color: '#5ac2df'






      ,

    },
    dialog: {

      boxShadow: 'none',
    }, paper: {
      overflowX: "scroll",
      width: "250px"
    }
  }));
  const classes = useStyle()

  const { data: roles, isloading: hh, error: hr } = useFetch(url + "role/")

  const { data: plannings, isloading: lo, error: err } = useFetch(url + "planning/")
  const { data: TypesContrat = [], ll, oo } = useFetch(url + 'contrats/')

  const [r, setR] = useState('')
  const [motifparti, setMotifParti] = useState('')
  const [userId, setUserId] = useState(null)

  const [planningemp, setPlaningEmp] = useState([]);
  const[is_active,setIsActive]=useState(true)

  const [userIddelete, setUserIddelete] = useState(null)
  const [userIddeleteparti, setUserIddeleteparti] = useState(null)

  const [nomcontratt, setNomContratt] = useState('')
  // const [image, setImage] = useState()
  

  const [datauser, setDataUser] = useState({})
  const [datausermouchard, setDataUserMouchard] = useState({})
  function fetchDepartements(arbore) {

    axios.get(url + 'arbo/', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,

      },
    }).then(res => {

      getStatuses(arbore, res.data)
      setTreeData(res.data)
    }

    ).catch(err => {
      /* if ( err.response.status=== 401) {
       logoutfunction(err.response.status)
       }*/


    })

  }
  const [nomdepartements, setNomDepartements] = useState([])
  const [nomplannings, setNomPlanings] = useState([])
  function SelectUser(id) {
    setTreeData([])


    fetch(url + "GetUserById/" + id, {
      method: 'get',
      headers: {

        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then((result) => {
      result.json().then((resp) => {

        setUserId(resp.id)
console.log('planningemp',resp.planningemp,typeof(resp.planningemp))
        setDataUser(resp)
        setActualSelected(resp.arborescence)
        setPlaningEmp(resp.planningemp)

        setDataUserMouchard(resp)

        fetchDepartements(resp.arborescence)
        setNomDepartements(resp.nomdepartements)
        setNomPlanings(resp.nomplannings)
        setContratsList(resp.contrat)
        setContratss(resp.contrat)
       
      })



    }).catch((err) => {

    })

  }

  const isAllSelected = plannings.length > 0 && planningemp.length === plannings.length;
  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setPlaningEmp(planningemp.length === plannings.length ? [] : plannings.map(x => x.id));
      return;
    }

    setPlaningEmp(value);
  };

  const DeleteUser = (userId) => {
    fetch(url + 'userdelete/' + userId, {
      method: 'DELETE',
      headers: {

        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then(() => {
      setOpen(false);
      Mouchard("en cours ", "Employé Supprimé", userId, iduserinfo, "Suppression de l'employé")
      window.location.reload(false);
    }
    ).catch((err) => {

    })


  }
  const [selectdatedemmarge, setSelectedatedemaarge] = useState('')
  const PartiUser = (userId, motif) => {

    fetch(url + 'quitteremploye/' + userId + "/" + motif, {
      method: 'get',
      headers: {

        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then(() => {
      setOpenparti(false);

      Mouchard("du " + selectdatedemmarge, "au " + moment().format("DD-MM-YYYY hh:mm:ss"), userId, iduserinfo, "Parti employé")

      window.location.reload(false);
    }
    ).catch((err) => {

    })

  }
  const [nouveaudep, setNouveaudep] = useState('')
  const handleChangearbo = (selected, allchecked) => {
    let results = allchecked.map(({ value }) => parseInt(value));
    setNouveaudep(selected.nom)
    setActualSelected(results)
  }

const handleChangeDemarageContrat=(event)=>{
  console.log(contratss)
  setContratss({...contratss,démarrageContrat:event.target.value})
}
  const dropdown = useMemo(() => {
    return (

      <DropdownTreeSelect
        data={treeData}
        onChange={(selected, allchecked) => { handleChangearbo(selected, allchecked) }}
        texts={{ placeholder: "Département" }}
        className="mdl-demo"


      />
    )
  }, [treeData]);
  const UpdateUser = (event) => {
    event.preventDefault();
    if (arborescence.length > 1) {
      alert('Il faut sélectionnez un seule département!')
    } else {
      fetch(url + 'user/' + userId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          activite: datauser.activite,
          typepaie :datauser.typepaie,
          site: datauser.site,
          email: datauser.email,
          user_name: datauser.user_name,
          last_name: datauser.last_name,
          matricule: datauser.matricule,
          role: datauser.role,
          arborescence: arborescence,
          planningemp: planningemp,
          matriculecnss: datauser.matriculecnss,
          sex: datauser.sex,
          datedemarrage: datauser.datedemarrage,
          datefin: datauser.datefin,
          rappel1: datauser.rappel1,
          rappel2: datauser.rappel2,
          démarrageContrat: datauser.démarrageContrat,
          datedenaissance: datauser.datedenaissance,
          CIN: datauser.CIN,
          nbEnfants: datauser.nbEnfants,
          tel: datauser.tel,
          idcontrat: datauser.idcontrat,
          password: datauser.password,




          validite_preavis: datauser.validite_preavis,
          commentaire: datauser.commentaire,
          teletravail: datauser.teletravail,
          situation_sociale: datauser.situation_sociale,
          solde: datauser.solde,
          is_active: datauser.is_active,
          newpassword: datauser.newpassword,
          contrat:contratsList,
          ajoutcontrats:ajoutcontrats,
          matriculepaie:datauser.matriculepaie,
          global:datauser.globale,
          soldemaladie:datauser.soldemaladie
        })
      }).then((response) => {

        if (!response.ok) throw new Error(response.status);



        if (datausermouchard.activite.toString() != datauser.activite.toString()) {

          Mouchard(datausermouchard.activite.toString() == "true" ? "Statut " : "N'est pas Statut ", datauser.activite.toString() == "true" ? "Statut " : "N'est pas Statut ", userId,iduserinfo, "Modifier Statut ")
        }
        if (datausermouchard.last_name != datauser.last_name) {
          Mouchard(datausermouchard.last_name == "" ? "vide" : datausermouchard.last_name, datauser.last_name == "" ? "vide" : datauser.last_name, userId, iduserinfo, "Modifier prénom")
        }

        if (datauser.newpassword == datauser.password && datauser.newpassword != "") {
          Mouchard("-", "-", userId,iduserinfo, "Modifier le mot de passe")
        }
        if (datausermouchard.arborescence != arborescence) {

          Mouchard(datausermouchard.arborescence.length == 0 ? "vide" : nomdepartements, arborescence.length == 0 ? "vide" : nouveaudep, userId,iduserinfo, "Modifier département")
        }

        if (datausermouchard.planningemp != planningemp) {

          Mouchard(datausermouchard.planningemp.length == 0 ? "vide" : nomplannings, planningemp.length == 0 ? "vide" : "", userId, iduserinfo, "Modifier planning")
        }
        if (datausermouchard.teletravail != datauser.teletravail) {
          Mouchard(datausermouchard.teletravail == "" ? "vide" : datausermouchard.teletravail, datauser.teletravail == "" ? "vide" : datauser.teletravail, userId, iduserinfo, "Modifier :Télétravail")
        }

        if (datausermouchard.idcontrat != datauser.idcontrat) {
          Mouchard(datausermouchard.nomcontrat == "" ? "vide" : datausermouchard.nomcontrat, nomcontratt == "" ? "vide" : nomcontratt, userId,iduserinfo, "Modifier :Type de Contrat")
        }
        if (datauser.tel != datausermouchard.tel) {
          Mouchard(datausermouchard.tel == "" ? "vide" : datausermouchard.tel, datauser.tel == "" ? "vide" : datauser.tel, userId,iduserinfo, "Modifier :Numéro de téléphone")
        }
        //s
        /*  if (datausermouchard.nomplaning != datauser.nomplaning) {
            Mouchard(datausermouchard.nomplaning,nomplaning , userId, localStorage.getItem('id'), "Modifier :Nom Planing")
          }*/
        if (datauser.email != datausermouchard.email) {
          Mouchard(datausermouchard.email == "" ? "vide" : datausermouchard.email, datauser.email == "" ? "vide" : datauser.email, userId, iduserinfo, "Modifier : Email")
        }
        if (datauser.solde != datausermouchard.solde) {
          Mouchard(datausermouchard.solde == "" ? "vide" : datausermouchard.solde, datauser.solde == "" ? "vide" : datauser.solde, userId, iduserinfo, "Modifier :Solde")
        }
        //


        if (datauser.role != datausermouchard.role) {
          Mouchard(datausermouchard.roles == "" ? "vide" : datausermouchard.roles, r == "" ? "vide" : r, userId, iduserinfo, "Modifier :Nom de Role")
        }

        if (datauser.matriculecnss != datausermouchard.matriculecnss) {
          Mouchard(datausermouchard.matriculecnss == "" ? "vide" : datausermouchard.matriculecnss, datauser.matriculecnss == "" ? "vide" : datauser.matriculecnss, userId, iduserinfo, "Modifier Matricule CNSS")
        }//
        if (datauser.user_name != datausermouchard.user_name) {

          Mouchard(datausermouchard.user_name == "" ? "vide" : datausermouchard.user_name, datauser.user_name == "" ? "vide" : datauser.user_name, userId, iduserinfo, "Modifier Le nom de l'employé")
        }
        if (datauser.matricule != datausermouchard.matricule) {
          Mouchard(datausermouchard.matricule == "" ? "vide" : datausermouchard.matricule, datauser.matricule == "" ? "vide" : datauser.matricule, userId, iduserinfo, "Modifier La matricule")
        }
        if (datausermouchard.CIN != datauser.CIN) {
          Mouchard(datausermouchard.CIN == "" ? "vide" : datausermouchard.CIN == "" ? "vide" : datausermouchard.CIN, datauser.CIN, userId, iduserinfo, "Modifier La CIN")
        }
        if (datauser.nbEnfants != datausermouchard.nbEnfants) {
          Mouchard(datausermouchard.nbEnfants == "" ? "vide" : datausermouchard.nbEnfants, datauser.nbEnfants == "" ? "vide" : datauser.nbEnfants, userId, iduserinfo, "Modifier Le nombre d'enfants")
        }
        //
        if (datausermouchard.sex != datauser.sex) {
          Mouchard(datausermouchard.sex == "" ? "vide" : datausermouchard.sex, datauser.sex == "" ? "vide" : datauser.sex, userId, iduserinfo, "Modifier Le sexe")
        }
        //
        if (datausermouchard.situation_sociale != datauser.situation_sociale) {
          Mouchard(datausermouchard.situation_sociale == "" ? "vide" : datausermouchard.situation_sociale, datauser.situation_sociale == "" ? "vide" : datauser.situation_sociale, userId, iduserinfo, "Modifier La situation sociale")
        }
        //
        if (datauser.datedenaissance != datausermouchard.datedenaissance) {
          Mouchard(datausermouchard.datedenaissance == "" ? "vide" : datausermouchard.datedenaissance, datauser.datedenaissance == "" ? "vide" : datauser.datedenaissance, userId, iduserinfo, "Modifier La date de naissance")
        }

        if (datauser.datefin != datausermouchard.datefin) {
          Mouchard(datausermouchard.datefin == "" ? "vide" : datausermouchard.datefin, datauser.datefin == "" ? "vide" : datauser.datefin, userId, iduserinfo, "Modifier La date de fin de contrat")
        }
        //
        if (datauser.commentaire != datausermouchard.commentaire) {
          Mouchard(datausermouchard.commentaire == "" ? "vide" : datausermouchard.commentaire, datauser.commentaire == "" ? "vide" : datauser.commentaire, userId, iduserinfo, "Modifier La commentaire")
        }//
        if (datauser.datedemarrage != datausermouchard.datedemarrage) {
          Mouchard(datausermouchard.datedemarrage == null ? "vide" : datausermouchard.datedemarrage, datauser.datedemarrage == "" ? "vide" : datauser.datedemarrag, userId, iduserinfo, "Modifier La date de démarrage")
        }//
        if (datauser.rappel1 != datausermouchard.rappel1) {
          Mouchard(datausermouchard.rappel1 == null ? "vide" : datausermouchard.rappel1, datauser.rappel1 == "" ? "vide" : datauser.rappel1, userId, iduserinfo, "Modifier La date de rappel 1")
        }//
        if (datauser.rappel2 != datausermouchard.rappel2) {
          Mouchard(datausermouchard.rappel2 == null ? "vide" : datausermouchard.rappel2, datauser.rappel2 == "" ? "vide" : datauser.rappel2, userId, iduserinfo, "Modifier La date de rappel2")
        }//
        if (datauser.démarrageContrat != datausermouchard.démarrageContrat) {
          Mouchard(datausermouchard.démarrageContrat == null ? "vide" : datausermouchard.démarrageContrat, datauser.démarrageContrat == "" ? "vide" : datauser.démarrageContrat, userId, iduserinfo, "Modifier La date de démarrage contrat")
        }
        if (datauser.site != datausermouchard.site) {

          Mouchard(datausermouchard.nomsit == null ? "vide" : datausermouchard.nomsit, sittee == "" ? "vide" : sittee, userId, iduserinfo, "Modifier le site")

        }


      }).then((res) => {

        window.location.reload(false)




      }

      ).catch((e) => {
        alert('Error')
      })

    }
  }


  $(document).ready(function () {
    $('#example').DataTable({
   
      language: frdatatable,
      "dom": 'Blfrtip',
      buttons: [
        {
          extend: 'excel',
          className: 'btn btn-buttondatatable',
          exportOptions: {
           
          },
        },
        {
          extend: 'copy',
          className: 'btn btn-buttondatatable'
        },
        {
          extend: 'pdf',
          className: 'btn btn-buttondatatable'
        },
        {
          extend: 'csv',
          className: 'btn btn-buttondatatable'
        },
        {
          extend: 'print',
          className: 'btn btn-buttondatatable'
        }
      //   }, {
      //     extend: 'excelHtml5',
      //     exportOptions: {
      //         columns: ':visible, :hidden:not(.never)'
      //     }
      // }
//         },{
//           extend: 'excel',
//           className: 'btn btn-buttondatatable',
//           text: 'Export All',
//           exportOptions: {
//             modifier: {
//               selected: false
//             },
//             columns: [0
//               ,1
//              , 2
// ,3
//              , 4
//   ,5
           
           
//         ],
//             orthogonal: 'export', // use export data source
//             // use the prepareDataForExport function to export the data
//             customizeData: function (data) {
//               const users = data.body.map(row => {
//                 const user = {};
//                 for (let i = 0; i < row.length; i++) {
//                   user[data.header[i].text] = row[i];
//                 }
//                 return user;
//               });
//               return prepareDataForExport(users);
//             }
//           }
//         }


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
    {/**          <div className='card-header' id="colorcardheader">
                <h3 style={{ color: "white" }}>Employés </h3>
              </div> */}

              <div className="card-header border-0">
                <div className='row'>

                  <AjouterUtilisateur />
                  <ImportUser/>
                  {view_historique_rh== true || admin== true ? <AjouterSolde /> : ""}


                  <div  >

                  </div>
                </div>
              </div>
              <div >

              </div>
              <ScrollContainer className="scroll-container">
                {post ?

                  <div className="table-responsive" >


                    <table id="example" className="display">
                      <thead className="thead-light">
                        <tr>
                          <th className='text-center'>Employé</th>
                          <th className='text-center'>Matricule</th>
                          <th className='text-center'  >Role</th>
                         
                          <th className='text-center'>Statut </th>
                          <th className='text-center'>Département</th>
                          <th className='text-center' hidden   >Type de Paie</th>

                          <th className='text-center' hidden >email</th>
 <th className='text-center' hidden >sex</th>
 <th className='text-center' hidden > matriculecnss</th>
<th className='text-center' hidden > datedemarrage </th>
<th className='text-center' hidden > datedenaissance</th>
<th className='text-center' hidden > CIN</th>
<th className='text-center' hidden > nbEnfants</th>
<th className='text-center' hidden > tel</th>
<th className='text-center' hidden >commentaire</th>
<th className='text-center' hidden >solde</th>
<th className='text-center' hidden >situation_sociale</th>
 <th className='text-center' hidden >teletravail</th>
 <th className='text-center' hidden >motifparti</th>
 <th className='text-center' hidden >activite</th>

 <th className='text-center' hidden >nomplannings</th>
 <th className='text-center' hidden >matriculepaie</th>
 <th className='text-center' hidden >soldemaladie</th>
 <th className='text-center' hidden >contrat</th>
                          <th className='text-center' >Action</th>
                        </tr>
                      </thead>
                      <tbody>

                        {users.filter(x=>x.is_active==true).map(us =>

                          <>
                            <tr>
                              <td>{us.last_name}  {us.user_name}</td>
                               <td>{us.matricule}</td>
                              <td  >{us.role}</td>
                             
                              <td>{us.activite ? "en activité" : "suspendu"}</td>
                              <td>{us.Nomarbo}</td>
                              <td hidden>{ us.typepaie ? "Forfaitaire " : "Non Forfaitaire "}</td>

                              <td  hidden >{us.email}</td>
 <td  hidden >{us.sex}</td>
 <td  hidden >{us.matriculecnss}</td>
 <td  hidden >{us.datedemarrage }</td>
 <td  hidden >{us.datedenaissance}</td>
 <td  hidden >{us.CIN}</td>
 <td  hidden >{us.nbEnfants}</td>
 <td  hidden >{us.tel}</td>
 <td  hidden >{us.commentaire}</td>
 <td  hidden >{us.solde}</td>
 <td  hidden >{us.situation_sociale}</td>
 <td  hidden >{us.teletravail}</td>
 <td  hidden >{us.motifparti}</td>
 <td  hidden >{us.activite}</td>
 <td  hidden >{us.nomplannings}</td>
 <td  hidden >{us.matriculepaie}</td>
 <td  hidden >{us.soldemaladie}</td>
 <td  hidden >{us.contrat}</td>
                              <td>

                                <div className="row">
                                  {modifier_employé == true && <><div className="col-md-3">

                                    <a onClick={() => SelectUser(us.id)} data-toggle="modal" data-target="#getuserhistorique" ><EditIcon
                                      className={classes.icon}
                                    /></a>

                                  </div>
                                <div className="col-md-3">

                                    <a onClick={() => { handleClickOpenparti(); setUserIddeleteparti(us.id); setSelectedatedemaarge(us.datedemarrage) }}  ><OutboundIcon className={classes.icon} /></a>


                                  </div>
                                  <div className='col-md-3'>
                                    <a onClick={() => SelectUser(us.id)} data-toggle="modal" data-target="#imprimeruser" ><LocalPrintshopIcon
                                      className={classes.icon}
                                    /></a>
                                  </div>
                                  </>}
                                  { delete_employé == true &&
                                    <div className="col-md-3">
                                      <a onClick={() => { handleClickOpen(); setUserIddelete(us.id) }}  ><DeleteIcon className={classes.icon} /></a>
                                    </div>
}
                                  

                                </div>
                              </td>
                            </tr>

                          </>
                        )
                        }


                      </tbody>



                    </table>
                    <Dialog

                      BackdropProps={{ invisible: true }}
                      className={classes.dialog}
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"supprimer un employé"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          êtes-vous sûr de vouloir supprimer cet employé?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>non</Button>
                        <Button onClick={() => { DeleteUser(userIddelete) }}>
                          oui
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Dialog

                      BackdropProps={{ invisible: true }}
                      className={classes.dialog}
                      open={openparti}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"supprimer un employé"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          êtes-vous sûr de partir cet employé ?
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Motif"
                          type="text"
                          fullWidth
                          variant="standard"
                          value={motifparti}
                          onChange={(e) => { setMotifParti(e.target.value) }}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseparti}>non</Button>
                        <Button onClick={() => { PartiUser(userIddeleteparti, motifparti) }}>
                          oui
                        </Button>
                      </DialogActions>
                    </Dialog>

                  </div>


                  : (<>{users.length == 0 && load==true? <Backdrop open={openn}>
                    <CircularProgress style={{ top: '50%' }} color="black" />
                  </Backdrop> : setPost(true)}</>)


                }</ScrollContainer>
              <div >




                <div className="modal fade" id="getuserhistorique" role="dialog" aria-labelledby="ajouteruser" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modifier Utilisateur</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">



                        <form>


                          <div className="row">
                            <div className="col-md-4">
                              <div className='row'>
                                <div className='col-md-6'>
                                  <div className="form-group">

                                    <label >Nom</label>
                                    <input className="form-control" placeholder="Nom" value={datauser.user_name} name="user_name" onChange={(e) => { setDataUser({ ...datauser, user_name: e.target.value }) }} type="text" />


                                  </div></div>
                                <div className='col-md-6'>
                                  <div className="form-group">

                                    <label >Prénom</label>
                                    <input className="form-control" placeholder="Prénom" value={datauser.last_name} name="last_name" onChange={(e) => { setDataUser({ ...datauser, last_name: e.target.value }) }} type="text" />

                                  </div>
                                </div></div>
                            </div><div className="col-md-4">
                              <div className="form-group">

                                <label >Email</label>
                                <input className="form-control" placeholder="Email" name="email" value={datauser.email}
                                  onChange={(e) => { setDataUser({ ...datauser, email: e.target.value }) }} type="text" />
                              </div>

                            </div>
                            
                          </div>
                          <div className='row'>
                            <div className="col-md-4">
                              <div className="form-group">

                                <label >Matricule</label>
                                <input className="form-control" placeholder="matricule" value={datauser.matricule}
                                  onChange={(e) => { setDataUser({ ...datauser, matricule: e.target.value }) }} />



                              </div>
                            </div>
                            <div className="col-md-4">
                   <div className="form-group">
                   <label >Matricule Paie</label>
                       <input className="form-control" placeholder="matricule de paie" value={datauser.matriculepaie}
                         onChange={(e) => { setDataUser({ ...datauser, matriculepaie: e.target.value }) }} type="text" />


                     
                   </div>
                 </div>
                 <div className="col-md-4">
                   <div className="form-group">
                   <label >Globale</label>

                       <input className="form-control" placeholder="globale" value={datauser.globale}
                         onChange={(e) => { setDataUser({ ...datauser, globale: e.target.value }) }} type="text" />


                     
                   </div>
                 </div>
                          </div>
                          <div className="row">



                            <div className="col-md-4">
                              <div className="form-group">

                                <label >Matricule CNSS</label>
                                <input className="form-control" placeholder="matricule CNSS" value={datauser.matriculecnss}
                                  onChange={(e) => { setDataUser({ ...datauser, matriculecnss: e.target.value }) }} type="text" />



                              </div>
                            </div>

                            <div className='col-md-4'>
                              <div className="form-group">

                                <label >Numéro Télephone</label>
                                <input className="form-control" placeholder="N Télephone" value={datauser.tel} onChange={(e) => { setDataUser({ ...datauser, tel: e.target.value }) }} type="text" />



                              </div>

                            </div>
                            {view_historique_rh==true ? "" :
                            <>
                              <div className='col-md-4'>
                                <div className="form-group">

                                  <label >Solde</label>
                                  <input className="form-control" placeholder="Solde d congé" value={datauser.solde} onChange={(e) => { setDataUser({ ...datauser, solde: e.target.value }) }} type="number" />



                                </div>

                              </div>
                                                         <div className='col-md-4'>
                                                         <div className="form-group">
                         
                                                           <label >Solde maladie</label>
                                                           <input className="form-control" placeholder="Solde de maladie" value={datauser.soldemaladie} onChange={(e) => { setDataUser({ ...datauser, soldemaladie: e.target.value }) }} type="number" />
                         
                         
                         
                                                         </div>
                         
                                                       </div></>
                              
                              }

                          </div>


                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group">

                                <label >CIN</label>
                                <input className="form-control" placeholder="CIN" value={datauser.CIN} onChange={(e) => { setDataUser({ ...datauser, CIN: e.target.value }) }} type="text" />



                              </div>

                            </div>




                            <div className='col-md-4'>
                              <div className="form-group">

                                <label htmlFor='motdepasse'>Mot de Passe</label>

                                <input id="motdepasse" className="form-control" placeholder="Mot de passe" value={datauser.password} onChange={(e) => { setDataUser({ ...datauser, password: e.target.value }) }} type="password" />



                              </div>
                            </div>
                            <div className='col-md-4'>
                              <div className="form-group">
                                <label htmlFor='conf'>Confirmation</label>
                                <input id="conf" className="form-control" placeholder="Confirmation Mot de passe" value={datauser.newpassword} onChange={(e) => { setDataUser({ ...datauser, newpassword: e.target.value }) }} type="password" />



                              </div>


                            </div>

                          </div>
                          <div className='row'>
                            <div className="col-md-4">
                              <div className="form-group">

                                <label >Nb Enfants</label>
                                <input className="form-control" placeholder="Nombre d'enfants" value={datauser.nbEnfants} type="number" onChange={(e) => { setDataUser({ ...datauser, nbEnfants: e.target.value }) }} />



                              </div>

                            </div>
                            <div className='col-md-4'>
                              <div className="form-group">

                                <label htmlFor="Datededémarrage">Date De Recrutement</label>
                                <input className="form-control" id="Datededémarrage" value={datauser.datedemarrage} onChange={(e) => { setDataUser({ ...datauser, datedemarrage: e.target.value }) }} placeholder="Date de démarrage" type="date" />



                              </div>
                            </div>
                            <div className='col-md-4'>
                              <div className="form-group">

                                <label htmlFor="naissance">Date de Naissance</label>
                                <input className="form-control" id="naissance" placeholder="datedenaissance" value={datauser.datedenaissance} onChange={(e) => { setDataUser({ ...datauser, datedenaissance: e.target.value }) }} type="date"
                                />



                              </div>



                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4 col-sm-4">

                              <label >Département</label>
                              {dropdown}


                            </div>
                            <div className='col-md-4'>
                              <label >Role</label>
                              <TextField
                                id="outlined-select-currency"
                                select
                                label="role"
                                value={datauser.role || ""}
                                onChange={(e) => { setDataUser({ ...datauser, role: e.target.value }) }}
                                helperText="Svp sélectionnez un role"
                                margin='normal'
                                fullWidth
                              >
                                {roles.map((option) => (
                                  <MenuItem key={option.rolename} value={option.id} onClick={(e) => { setR(e.target.innerText) }} >
                                    {option.rolename}
                                  </MenuItem>
                                ))}
                              </TextField >

                            </div>
                            <div className='col-md-4'>
                              <label >Planning</label>
                              <FormControl className={classes.formControl}>
                                <InputLabel id="mutiple-select-label">Sélectionnez des planings</InputLabel>
                                <Select
                                  labelId="mutiple-select-label"
                                  multiple
                                  value={planningemp}


                                  onChange={handleChange}
                                  renderValue={(selected) => selected.map(obj => plannings.find(o => o.id === obj).title).join(", ")}
                                  MenuProps={{
                                    ...MenuProps,
                                    classes: {
                                      paper: classes.paper
                                    }
                                  }}
                                >
                                  <MenuItem
                                    value="all"
                                    classes={{
                                      root: isAllSelected ? classes.selectedAll : ""
                                    }}
                                  >
                                    <ListItemIcon>
                                      <Checkbox
                                        classes={{ indeterminate: classes.indeterminateColor }}
                                        checked={isAllSelected}
                                        indeterminate={
                                          planningemp.length > 0 && planningemp.length < plannings.length
                                        }
                                      />
                                    </ListItemIcon>
                                    <ListItemText
                                      classes={{ primary: classes.selectAllText }}
                                      primary="Select All"
                                    />
                                  </MenuItem>
                                  {plannings.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      <ListItemIcon>
                                        <Checkbox checked={planningemp.indexOf(option.id) > -1 || ""} />
                                      </ListItemIcon>
                                      <ListItemText primary={option.title + " " + option.start + " " + option.end} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>


                            </div>
                          </div>
                          <div className='row'>

                            <div className='col-md-4'>
                              <label >Sexe</label>
                              <div className="form-group">
                                <TextField
                                  id="outlined-select-currency"
                                  select
                                  label="Sexe"
                                  value={datauser.sex || ""}
                                  onChange={(e) => { setDataUser({ ...datauser, sex: e.target.value }) }}
                                  helperText="Svp sélectionnez sexe"
                                  margin='normal'
                                  fullWidth
                                >
                                  <MenuItem value={"femme"}>Femme</MenuItem>
                                  <MenuItem value={"homme"}>Homme</MenuItem>


                                </TextField>

                              </div>
                            </div>
                            <div className='col-md-4'>
                              <label >Situation Sociale</label>
                              <TextField
                                id="outlined-select-currency"
                                select
                                label="situation sociale"
                                value={datauser.situation_sociale || ""}
                                onChange={(e) => { setDataUser({ ...datauser, situation_sociale: e.target.value }) }}
                                helperText="Svp sélectionnez une situation sociale"
                                margin='normal'
                                fullWidth
                              >
                                <MenuItem value={"Marié(e)"}>Marié(e)</MenuItem>
                                <MenuItem value={"Divorcé(e)"}>Divorcé(e)</MenuItem>
                                <MenuItem value={"Célibatair(e)"}>Célibatair(e)</MenuItem>
                                <MenuItem value={"Veuf(ve)"}>Veuf(ve)</MenuItem>
                              </TextField>

                            </div>
                            <div className='col-md-4'>
                              <label >Statut </label>
                              <TextField
                                id="outlined-select-currency"
                                select
                                label="Statut "
                                value={datauser.activite || ""}
                                onChange={(e) =>  {setIsActive(e.target.value); setDataUser({ ...datauser, activite: e.target.value }) }}
                                helperText="Statut "
                                margin='normal'
                                fullWidth
                              >
                             <MenuItem value={"true"}>En Activité</MenuItem>
                                      <MenuItem value={"false"}>Suspendu</MenuItem>


                              </TextField>
                            </div>
                            <div className='col-md-4'>
                              <label >Type de paie  </label>
                              <TextField
                                id="outlined-select-currency"
                                select
                                label="Type de paie"
                                value={datauser.typepaie || ""}
                                onChange={(e) =>  { setDataUser({ ...datauser, activite: e.target.value }) }}
                                helperText="Type de paie "
                                margin='normal'
                                fullWidth
                              >
                             <MenuItem value={"true"}>Forfaitaire</MenuItem>
                                      <MenuItem value={"false"}>Non Forfaitaire</MenuItem>


                              </TextField>
                            </div>
                          </div>

                          <div className='row'>

                            <div className='col-md-4'>
                              <label >Téletravail</label>
                              <TextField
                                id="outlined-select-currency"
                                select
                                label="Téletravail"
                                value={datauser.teletravail || ""}
                                onChange={(e) => { setDataUser({ ...datauser, teletravail: e.target.value }) }}
                                helperText="Svp sélectionnez un choix"
                                margin='normal'
                                fullWidth
                              >
                                <MenuItem value={"Oui"}>Oui</MenuItem>
                                <MenuItem value={"Non"}>Non</MenuItem>


                              </TextField>

                            </div>


                            <div className='col-md-4'>
                              <label >Site</label>
                              <TextField
                                id="outlined-select-currency"
                                select
                                label="Site"
                                value={datauser.site || ""}
                                onChange={(e) => { setDataUser({ ...datauser, site: e.target.value }) }}
                                helperText="Svp sélectionnez un site"
                                margin='normal'
                                fullWidth
                              >
                                {sites.map((option) => (
                                  <MenuItem key={option.id} value={option.id} onClick={(e) => { setsitte(e.target.innerText) }}>
                                    {option.nomsite}
                                  </MenuItem>
                                ))}
                              </TextField >
                            </div>

                            {/**<div className='col-md-4'>
<FormControlLabel control={<Checkbox/>} label='Statut ' checked={Statut  ? true:false} value={Statut } onChange={handleOnChangeStatut }  />
</div>  */}
                          </div>
                          <div className='row'>
                            <div className='col-md'>
                              <label >Commentaire</label>
                              <textarea placeholder='commentaire' value={datauser.commentaire} onChange={(e) => { setDataUser({ ...datauser, commentaire: e.target.value }) }} rows="4" className="form-control"></textarea>
                            </div>
                          </div>
                          <div className='row'>
                            {/**  <div className='col-md-4 '>
                          
                              <img src={url+`media/${image}`} className={classes.icon} />
                              
  
                            </div> */}



                          </div>



                          {contratsList.map(contr =>

                            <>

                              <div className='row'>


                                <div className='col-md-4'>
                                  <label style={{marginBottom:"0px"}}>Type de Contrat</label>
                                  <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="TypeDeContrat"
                                    value={contr.typecontrat_id || ""}
                                    onChange={(e)=>setContratsList(
                                      contratsList.map((eachUser) =>
                                      contr.id === eachUser.id ? { ...eachUser, typecontrat_id: e.target.value } : eachUser,
                                      ),
                                    )}
                                    helperText="type de contrat"
                                    margin='normal'
                                    fullWidth
                                  >
                                    {TypesContrat.map((option) => (
                                      <MenuItem key={option.nom} value={option.id} onClick={(e) => { setNomContratt(e.target.innerText) }} >
                                        {option.contratname}
                                      </MenuItem>
                                    ))}

                                  </TextField>

                                </div>

                                <div className='col-md-4 '>
                                  <div className="form-group">

                                    <label htmlFor="démarragedecontrat" style={{marginBottom:"20px"}}>Démarrage De Contrat</label>
                                    <input className="form-control" id="démarragedecontrat" value={contr.démarrageContrat} onChange={(e)=>setContratsList(
    contratsList.map((eachUser) =>
    contr.id === eachUser.id ? { ...eachUser, démarrageContrat: e.target.value } : eachUser,
    ),
  )} type="date" />



                                  </div>
                                </div>
                                <div className='col-md-4 '>
                                  <div className="form-group">

                                    <label htmlFor="dateFin" style={{marginBottom:"20px"}}>Date Fin</label>
                                    <input className="form-control" id="dateFin" value={contr.datefin} onChange={(e)=>setContratsList(
    contratsList.map((eachUser) =>
    contr.id === eachUser.id ? { ...eachUser, datefin: e.target.value } : eachUser,
    ),
  )} type="date" />



                                  </div>
                                </div>

                              </div>
                              <div className='row'>
                                <div className='col-md-4'>
                                  <div className="form-group">

                                    <label htmlFor="rappel1" style={{marginBottom:"20px"}}>Date Rappel 1</label>
                                    <input className="form-control" id="rappel1" value={contr.rappel1} onChange={(e)=>setContratsList(
    contratsList.map((eachUser) =>
    contr.id === eachUser.id ? { ...eachUser, rappel1: e.target.value } : eachUser,
    ),
  )} type="date" />



                                  </div>
                                </div>

                                <div className='col-md-4 '>
                                  <div className="form-group">

                                    <label htmlFor="démarragedecontrat" style={{marginBottom:"20px"}}>Date Rappel 2</label>
                                    <input className="form-control" id="rappel2" value={contr.rappel2} onChange={(e)=>setContratsList(
    contratsList.map((eachUser) =>
    contr.id === eachUser.id ? { ...eachUser, rappel2: e.target.value } : eachUser,
    ),
  )} type="date" />



                                  </div>
                                </div>


                              </div>

                              <hr style={{color:' #333',height:'5px',  borderTop:'3px double #333' }}/>
                            </>


                          )}



<h2>Ajouter un  contrat</h2>

<div className='row'>


<div className='col-md-4'>
<label style={{marginBottom:"0px"}}>Type de Contrat</label>
  <TextField
    id="outlined-select-currency"
    select
    label="TypeDeContrat"
    value={ajoutcontrats.typecontrat || ""}
    onChange={(e)=>setajoutcontrat({...ajoutcontrats,typecontrat:e.target.value}    )}
    helperText="type de contrat"
    margin='normal'
    fullWidth
  >
    {TypesContrat.map((option) => (
      <MenuItem key={option.nom} value={option.id} onClick={(e) => { setNomContratt(e.target.innerText) }} >
        {option.contratname}
      </MenuItem>
    ))}

  </TextField>

</div>

<div className='col-md-4'>
  <div className="form-group">

    <label htmlFor="démarragedecontrat" style={{marginBottom:"20px"}}>Démarrage De Contrat</label>
    <input className="form-control" id="démarragedecontrat" value={ajoutcontrats.démarrageContrat} onChange={(e)=>setajoutcontrat({...ajoutcontrats,démarrageContrat:e.target.value}    )} type="date" />



  </div>
</div>
<div className='col-md-4 '>
  <div className="form-group">

    <label htmlFor="dateFin" style={{marginBottom:"20px"}}>Date Fin</label>
    <input className="form-control" id="dateFin" value={ajoutcontrats.datefin} onChange={(e)=>setajoutcontrat({...ajoutcontrats,datefin:e.target.value}    )} type="date" />



  </div>
</div>

</div>
<div className='row'>
<div className='col-md-4'>
  <div className="form-group">

    <label htmlFor="rappel1" style={{marginBottom:"20px"}}>Date Rappel 1</label>
    <input className="form-control" id="rappel1" value={ajoutcontrats.rappel1} onChange={(e)=>setajoutcontrat({...ajoutcontrats,rappel1:e.target.value}    )} type="date" />



  </div>
</div>

<div className='col-md-4 '>
  <div className="form-group">

    <label htmlFor="démarragedecontrat" style={{marginBottom:"20px"}}>Date Rappel 2</label>
    <input className="form-control" id="rappel2" value={ajoutcontrats.rappel2} onChange={(e)=>setajoutcontrat({...ajoutcontrats,rappel2:e.target.value}    )} type="date" />



  </div>
</div>


</div>












                          <div className="form-group"><button className="btn btn-primary" onClick={UpdateUser}>Valider</button></div>    </form>



                      </div>

                    </div>
                  </div>
                </div>
                <div className="modal fade" id="imprimeruser" role="dialog" aria-labelledby="imprimeruser" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Imprimer la fiche d'employé</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">



                        <div ref={componentRef}>
                          <div className='card-header text-center' style={{ backgroundColor: "#5ac2df" }}>
                            <h2 style={{ color: "white" }}> Fiche de l'employé</h2>
                          </div>

                          <div className='container align-items-center pt-2'>
                            <div className="container pt-4">

                              <h2>Informations personnelles sur l'employé(e)</h2>
                              <div class="row border border-dark" >
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Prénom : {datauser.user_name}</div>
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Nom :  {datauser.last_name}</div>

                              </div>

                              <div class="row border border-dark" id="heading">
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Sexe :  {datauser.sex}</div>
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Date de naissance :  {datauser.datedenaissance}</div>

                              </div>
                              <div class="row border border-dark" id="heading">
                                <div class="col-6 border border-dark" style={{ height: "50px" }} >situation sociale :  {datauser.situation_sociale}</div>
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>CIN :  {datauser.CIN}</div>

                              </div>
                              <div class="row border border-dark" id="heading">
                                <div class="col-6 border border-dark" style={{ height: "50px" }} >Nombre d'enfants:  {datauser.nbEnfants}</div>
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Email :          {datauser.email}</div>

                              </div>
                              <div class="row border border-dark" id="heading">
                                <div class="col-6 border border-dark" style={{ height: "50px" }} >Télephone: {datauser.tel}</div>


                              </div>





                            </div>
                            <div className="container pt-5">

                              <h2>Ressources humaines (RH)</h2>
                              <div className="row border border-dark" >
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Matricule : {datauser.matricule}</div>
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Matricule  CNSS :  {datauser.matriculecnss}</div>

                              </div>

                              <div className="row border border-dark" id="heading">
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Role :  {datauser.roles}</div>
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Téletravail :  {datauser.teletravail}</div>

                              </div>

                              <div className="row border border-dark" id="heading">
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Département :  {nomdepartements.map(x => <>{x} &nbsp;</>)}</div>
                                <div class="col-6 border border-dark" style={{ height: "50px" }}>Planning :  {nomplannings.map(x => <>{x} &nbsp;</>)}</div>

                              </div>

                              <div className="row border border-dark" id="heading">
                                <div className="col-6 border border-dark" style={{ height: "50px" }} >Type de contrat:  {datauser.nomcontrat}</div>
                                <div className="col-6 border border-dark" style={{ height: "50px" }} >Date de Recrutement:  {datauser.datedemarrage}</div>


                              </div>
                              <div className="row border border-dark" id="heading">
                                <div className="col-6 border border-dark" style={{ height: "50px" }}>Démarrage De Contrat :  {datauser.datedemarrage}</div>
                                <div className="col-6 border border-dark" style={{ height: "50px" }} >Date fin:  {datauser.datefin}</div>


                              </div>
                              <div className="row border border-dark" id="heading">
                                <div className="col-6 border border-dark" style={{ height: "50px" }}>Rappel 1 :  {datauser.rappel1}</div>
                                <div className="col-6 border border-dark" style={{ height: "50px" }} >Rappel 2:  {datauser.rappel2}</div>


                              </div>
                              <div className="row border border-dark" id="heading">
                                <div className="col-6 border border-dark" style={{ height: "50px" }}>Solde :  {datauser.solde}</div>
                                <div className="col-6 border border-dark" style={{ height: "50px" }} >Commentaire:  {datauser.commentaire}</div>


                              </div>


                            </div>

                            <div className="container pt-5">

                              <h2>Commentaires</h2>
                              <div className='row'>
                                <textarea placeholder='commentaire' className="form-control" rows="8" cols="6" ></textarea>
                              </div>
                            </div>
                          </div>








                        </div>


                        <div className="form-group pt-3"><button className="btn btn-primary" onClick={handlePrint}>Valider</button></div>



                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div></div></div>

    </div>
  )
}
export default ListeUtilisateurs;