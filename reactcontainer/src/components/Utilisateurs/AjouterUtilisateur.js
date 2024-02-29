

import React, { useEffect, useState } from 'react';

import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";

import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'


import { Alert } from '@mui/material';





import { useMemo } from 'react';

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MenuProps } from "../Rapports/utils";
import ListItemText from "@material-ui/core/ListItemText";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import Mouchard from '../Mouchardd/Mouchard';








import { useSelector } from 'react-redux';

const AjouterUtilisateur = () => {
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
   
    

    
  }

  const { data: roles, isloading, error } = useFetch(url+"role/")
  
  const { data: plannings, isloading: lo, error: err } = useFetch(url+"planning/")

  const { data: TypesContrat = [], ll, oo } = useFetch(url+'contrats/')
  const[activite,setActivite]=useState(true)
   const[typepaie,settypepaie]=useState(true)
  const[site,setSite]=useState('')
  const { data:sites, isloading: loz, error: errdv } = useFetch(url+"createlistsite/")
  const [user_name, setUser] = useState('');
  const [last_name, setlast_name] = useState('');
  const [matricule, setMatricule] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  const [sex, setSexe] = useState('');
  const [planningemp, setPlaningEmp] = useState([]);
  const [matriculecnss, setMatriculeCNSS] = useState('')

  const [datedemarrage, setDateDémarrage] = useState(null);
  const [datefin, setDatefin] = useState(null);
  const [rappel1, setRappel1] = useState(null);
  const [rappel2, setRappel2] = useState(null);
  const [démarrageContrat, setDémarrageContrat] = useState(null);
  const [datedenaissance, setdateDeNaissance] = useState(null);
  const [CIN, setCIN] = useState('');
  const [nbEnfants, setNbenfants] = useState(null);
  const [tel, setTel] = useState('');
  const [idcontrat, setIdContrat] = useState('');
  const [password, setPassword] = useState('');
  const [commentaire, setCommentaire] = useState('');
 
  const [teletravail, setTeltravail] = useState('');
  const [situation_sociale, setSituationSociale] = useState('');
  const[solde,setSolde]=useState(null)
  const[matriculepaie,setmatriculepaie]=useState('')
  const[globale,setglobale]=useState('0')
  const[soldemaladie,setSoldeMaladie]=useState('0')
  
  //const[image,setImage]=useState(null)

  //to preview image
/**  const [preview, setPreview] = useState()
  useEffect(() => {
    if (!image) {
        setPreview(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)

  
    return () => URL.revokeObjectURL(objectUrl)
}, [image]) */
//
  const { data: data, isloading: zzsx, error: esse } = useFetch(url+"arbo/")

const[checkalert,setCheckAlert]=useState(false)
const useStyles = makeStyles((theme)=>({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400
  },
  imageemploye:{
    height:80,
    width:80
  },  formControl: {
    margin: theme.spacing(1),
    width: 200
  },
}));

//form data pour insérer image
/*
  const handlesubmit = (e) => {
    console.log(image)
   const formdata=new FormData()
   formdata.append("email",email)
   formdata.append("user_name",user_name)
   formdata.append("matricule",matricule)
   formdata.append("role",role)
   formdata.append("arborescence",arborescence)
   formdata.append("planningemp",planningemp)
   formdata.append("matriculecnss",matriculecnss)
   formdata.append("sex",sex)
   formdata.append("datedemarrage",datedemarrage)
   formdata.append("datefin",datefin)
   formdata.append("rappel1",rappel1)
   formdata.append("rappel2",rappel2)
   formdata.append("démarrageContrat",démarrageContrat)
   formdata.append("datedenaissance",datedenaissance)
   formdata.append("CIN",CIN)
   formdata.append("nbEnfants",nbEnfants)
   formdata.append("tel",tel)
   formdata.append("idcontrat",idcontrat)
   formdata.append("password",password)
   formdata.append("commentaire",commentaire)
   formdata.append("teletravail",teletravail)
   formdata.append("situation_sociale",situation_sociale)
   formdata.append("solde",solde)
  
   formdata.append("is_active",true)
 //formdata.append("Statut ",Statut )
 if (image === null) {
} else {
  formdata.append("image",image)
}
console.log(typeof image)
    e.preventDefault()
    
    fetch(url+"create/",
      {
        method: "POST",
    
        body: formdata
      }).then((data) => {
  console.log(JSON.stringify(data))

data.json().then(user =>{
  Historique(user.id,user.arborescence)
//window.location.reload(false);
   
})  }).catch(e => {
alert("Il faut ajouter un email,département,Nom et Prénom et un mot de passe")
      console.log('err')
      })
 }
  
   */
const[is_active,setIsActive]=useState(true)
const[alertdep,setAlertDep]=useState(false)
 const handlesubmit = (event) => {
  

  event.preventDefault();
   const userList = {soldemaladie,matriculepaie,globale, email,user_name,last_name, matricule, role, arborescence, planningemp, matriculecnss, sex, datedemarrage, datefin, rappel1, rappel2, démarrageContrat, datedenaissance, CIN, nbEnfants, tel, idcontrat, password, commentaire,  teletravail, situation_sociale, solde, is_active,activite,site , typepaie}
    console.warn("item", userList)
    if(arborescence.length>1){
     setAlertDep(true)
    }else{
    fetch(url+'create/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(userList)
    }).then((response) =>{

      if(!response.ok) throw new Error(response.status);
else{
  response.json().then(user =>{
    Mouchard('-',user_name,user.id,iduserinfo,"Nouveau employé a été ajouté")
   window.location.reload(false)
  
  })
}

  }).catch((err)=>{
setCheckAlert(true)
 
     
    })

  }}
  /*
  const Historique = (id,dep) => {
    const hist={id,dep}
       
        fetch(url+'Historique/'+id +'/'+dep , {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(hist)
        }).then(() => {
    
     
            
            
      
        }
    
        )
      }*/
  
  const classes = useStyles();
  ///select département and insert it 

  const [arborescence, setActualSelected] = React.useState([]);



  const [treeData, setTreeData] = React.useState([]);

  useEffect(()=>{
    setTreeData(data)
  })
  const handleChangearbo = (selected, allchecked) =>{
    let results = allchecked.map(({value})=>parseInt(value));
   
    setActualSelected(results)
  }
  
  
  
  
   const dropdown = useMemo(()=>{
    return(
  
          <DropdownTreeSelect
                data={treeData}
                onChange={(selected, allchecked) =>{handleChangearbo(selected, allchecked)}}
                texts={{ placeholder: "Département" }}
                className="mdl-demo" 
            />
     )}, [treeData]);
 //dfs_filter



/** const[Statut ,setStatut ]=useState(false)
  const handleOnChangeStatut  = () => {
    setStatut (!Statut );
  };  
 */
  const isAllSelected =plannings.length > 0 && planningemp.length === plannings.length;
      
        const handleChange = (event) => {
          const value = event.target.value;
          if (value[value.length - 1] === "all") {
            setPlaningEmp(planningemp.length === plannings.length ? [] : plannings.map(x=>x.id));
            return;
          }
        
        setPlaningEmp(value);
        };
        
 
  return (
    <div>

      <div>
    
 
 
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouteruser">
          Ajouter Un Employé
        </button>
      
        <div className="modal fade" id="ajouteruser" role="dialog" aria-labelledby="ajouteruser" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ajouter Un Employé</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
         

          <form >
               

               <div className="row">
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="Nom" value={user_name} name="user_name" onChange={(e) => setUser(e.target.value)} type="text"  />
                     
                     </div>
                   </div>
             </div>
                 
                   <div className='col-md-4'> 
                    <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="Prénom" value={last_name} name="last_name" onChange={(e) => setlast_name(e.target.value)} type="text"  />
                     
                     </div></div>
             
                 </div>
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">
                       
                       <input className="form-control" placeholder="Email" name="email" value={email}
                         onChange={(e) => setEmail(e.target.value)} type="text"  id="email"/>
                     </div>
                   </div>
                 </div>
          
               </div>
<div className='row'>
          <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="matricule" value={matricule}
                         onChange={(e) => setMatricule(e.target.value)} type="text" />


                     </div>
                   </div>
                 </div>
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="matricule de paie" value={matriculepaie}
                         onChange={(e) => setmatriculepaie(e.target.value)} type="text" />


                     </div>
                   </div>
                 </div>
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="globale" value={globale}
                         onChange={(e) => setglobale(e.target.value)} type="text" />


                     </div>
                   </div>
                 </div>


</div>
         


               <div className="row">
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="CIN" value={CIN} onChange={(e) => setCIN(e.target.value)} type="text" />


                     </div>
                   </div>

                 </div>
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />


                     </div>
                   </div>

                 </div>
                 <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="Nombre d'enfants" value={nbEnfants}  type="number" onChange={(e) => setNbenfants(e.target.value)} />


                     </div>
                   </div>

                 </div>

               </div>
               <div className="row">
                 <div className='col-md-4'>
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="N Télephone" value={tel} onChange={(e) => setTel(e.target.value)} type="text" />


                     </div>
                   </div>

                 </div>
                 <div className='col-md-4'>
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="Solde d congé" type="number" step="0.5" value={solde} onChange={(e)=>{setSolde(e.target.value)}} />


                     </div>
                   </div>

                 </div>
                 <div className='col-md-4'>
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="Solde de maladie" type="number" step="0.5" value={soldemaladie} onChange={(e)=>{setSoldeMaladie(e.target.value)}} />


                     </div>
                   </div>

                 </div>
                 

               </div>
               <div className='row'>
               <div className="col-md-4">
                   <div className="form-group">
                     <div className="input-group input-group-merge input-group-alternative">

                       <input className="form-control" placeholder="matricule CNSS" value={matriculecnss}
                         onChange={(e) => setMatriculeCNSS(e.target.value)} type="text" />


                     </div>
                   </div>
                 </div>
               </div>
               <div className='row'>                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="naissance">Date de naissance</label>
                     <input className="form-control" id="naissance" placeholder="datedenaissance" value={datedenaissance} onChange={(e) => setdateDeNaissance(e.target.value)} type="date"
                     />



                   </div>



                 </div>
                 
                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="Datededémarrage">Date De Recrutement</label>
                     <input className="form-control" id="Datededémarrage" value={datedemarrage} onChange={(e) => setDateDémarrage(e.target.value)} placeholder="Date de démarrage" type="date" />



                   </div>
                 </div>
                 <div className='col-md-4'>

<FormControl className={classes.formControl}>
                   <InputLabel id="mutiple-select-label">Sélectionnez des planings</InputLabel>
                   <Select
                     labelId="mutiple-select-label"
                     multiple
                     value={planningemp}
                     onChange={handleChange}
                     renderValue={ (selected)=>selected.map(obj =>plannings.find(o => o.id=== obj).title).join(", ")} 
                     MenuProps={MenuProps}
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
                           <Checkbox checked={planningemp.indexOf(option.id) > -1} />
                         </ListItemIcon>
                         <ListItemText primary={option.title} />
                       </MenuItem>
                     ))}
                   </Select>
                   </FormControl>


</div>
                 </div>
               <div className="row">
                 <div className="col-md-4 pt-3">
                 {dropdown}
                
                 </div>
              
                 <div className='col-md-4'>
                   <TextField
                     id="outlined-select-currency"
                     select
                     label="role"
                     value={role}
                     onChange={(e) => { setRole(e.target.value) }}
                     helperText="Svp sélectionnez un role"
                     margin='normal'
                     fullWidth
                   >
                     {roles.map((option) => (
                       <MenuItem key={option.id} value={option.id}>
                         {option.rolename}
                       </MenuItem>
                     ))}
                   </TextField >

                 </div>
                 <div className='col-md-4'>
                   <TextField
                     id="outlined-select-currency"
                     select
                     label="TypeDeContrat"
                     value={idcontrat}
                     onChange={(e) => setIdContrat(e.target.value)}
                     helperText="Svp sélectionnez un type de contrat"
                     margin='normal'
                     fullWidth
                   >
                     {TypesContrat.map((option) => (
                       <MenuItem key={option.id} value={option.id}>
                         {option.contratname}
                       </MenuItem>
                     ))}

                   </TextField>

                 </div>
               </div>
               <div className='row'>
                <div className='col-md-4'>
                                   <TextField
                                      id="outlined-select-currency"
                                      select
                                      label="Statut "
                                      value={activite}
                                      onChange={(e) => {setIsActive(e.target.value);setActivite(e.target.value)}}


                                      helperText="Statut "
                                      margin='normal'
                                      fullWidth
                                    >
                                      <MenuItem value={"true"}>En Activité</MenuItem>
                                      <MenuItem value={"false"}>Suspendu</MenuItem>


                                    </TextField>   
                </div>
                <div className='col-md-4'>
                                   <TextField
                                      id="outlined-select-currency"
                                      select
                                      label="Paie "
                                      value={typepaie}
                                      onChange={(e) => {settypepaie(e.target.value)}}


                                      helperText="Paie "
                                      margin='normal'
                                      fullWidth
                                    >
                                      <MenuItem value={"true"}>Forfaitaire</MenuItem>
                                      <MenuItem value={"false"}>Agent </MenuItem>


                                    </TextField>   
                </div>
                <div className='col-md-4'>
                <TextField
                     id="outlined-select-currency"
                     select
                     label="Site"
                     value={site}
                     onChange={(e) => { setSite(e.target.value) }}
                     helperText="Svp sélectionnez un site"
                     margin='normal'
                     fullWidth
                   >
                     {sites.map((option) => (
                       <MenuItem key={option.id} value={option.id}>
                         {option.nomsite}
                       </MenuItem>
                     ))}
                   </TextField >
                </div>
                <div className='col-md-4'>
                   <TextField
                     id="outlined-select-currency"
                     select
                     label="Téletravail"
                     value={teletravail}
                     onChange={(e) => setTeltravail(e.target.value)}
                     helperText="Svp sélectionnez un choix"
                     margin='normal'
                     fullWidth
                   >
                     <MenuItem value={"Oui"} key="7">Oui</MenuItem>
                     <MenuItem value={"Non"} key="8">Non</MenuItem>


                   </TextField>

                 </div>
               </div>
               <div className='row'>

                 <div className='col-md-4'>
                   <div className="form-group">
                     <TextField
                       id="outlined-select-currency"
                       select
                       label="Sexe"
                       value={sex}
                       onChange={(e) => setSexe(e.target.value)}
                       helperText="Svp sélectionnez sexe"
                       margin='normal'
                       fullWidth
                     >
                       <MenuItem value={"femme"} key="1">Femme</MenuItem>
                       <MenuItem value={"homme"} key="2">Homme</MenuItem>


                     </TextField>

                   </div>
                 </div>
                 <div className='col-md-4'>
                   <TextField
                     id="outlined-select-currency"
                     select
                     label="situation sociale"
                     value={situation_sociale}
                     onChange={(e) => setSituationSociale(e.target.value)}
                     helperText="Svp sélectionnez une situation sociale"
                     margin='normal'
                     fullWidth
                   >
                     <MenuItem value={"Marié(e)"} key="3">Marié(e)</MenuItem>
                     <MenuItem value={"Divorcé(e)"} key="4">Divorcé(e)</MenuItem>
                     <MenuItem value={"Célibatair(e)"} key="5">Célibatair(e)</MenuItem>
                     <MenuItem value={"Veuf(ve)"} key="6">Veuf(ve)</MenuItem>
                   </TextField>

                 </div>
                

               </div>


               <div className='row'>
                 <div className='col-md'>
                   <textarea placeholder='commentaire' className="form-control" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows="4" ></textarea>
                 </div>
               </div>
               <div className='row'>
            {/**     <div className='col-md-4  pt-2'>
               

                 <input type="file"  name="myImage" onChange={(event)=>{setImage(event.target.files[0])}}/>
                 {image &&  <img src={preview} className={classes.imageemploye} /> }
                 </div> */}


               
                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="démarragedecontrat">Démarrage De Contrat</label>
                     <input className="form-control" id="démarragedecontrat" value={démarrageContrat} onChange={(e) => setDémarrageContrat(e.target.value)} type="date" />



                   </div>
                 </div>
                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="dateFin">Fin De Contrat</label>
                     <input className="form-control" id="dateFin" value={datefin} onChange={(e) => setDatefin(e.target.value)} type="date" />



                   </div>
                 </div>


                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="rappel1">Date Rappel 1</label>
                     <input className="form-control" id="rappel1" value={rappel1} onChange={(e) => setRappel1(e.target.value)} type="date" />



                   </div>
                 </div>

               </div>
               <div className='row'>


                 <div className='col-md-4'>
                   <div className="form-group">

                     <label htmlFor="démarragedecontrat">Date Rappel 2</label>
                     <input className="form-control" id="rappel2" value={rappel2} onChange={(e) => setRappel2(e.target.value)} type="date" />



                   </div>
                 </div>


               </div>
         




               <div className="form-group"><button className="btn btn-primary" onClick={handlesubmit} >Valider</button> </div>


{alertdep &&   <Alert variant="filled" severity="error">Il faut sélectionnez un seule département!</Alert>}
{checkalert &&<Alert variant="filled" severity="error">il faut ajouter un email unique! un mot de passe et un Nom non vides</Alert>}
             </form>


       

              </div>

              <div className="modal-footer">



              </div>

            </div>
          </div>
        </div>
     
      
      </div >


    </div >
  )
}
export default AjouterUtilisateur;