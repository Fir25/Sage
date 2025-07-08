import React, { useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';


function AddDepByChild(id){
    const url=process.env.React_App_URL;
    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
    const [nom, setNomm] = useState('');
    const {id:parent}=id;
    const [chef, setChef] = useState('')
    const [rh, setRH] = useState('')
    const [children, setchildren] = useState([])
    const[users,setUsers]=useState([])
    const [rh2,setRh2]=useState('')
    const [wfm,setWFM]=useState('')
    function fetchUsers(){
        fetch(url+"user/", {method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }}).then(res =>{
            if (!res.ok){
                throw Error("could not fetch the data for that resource")
            }
            return res.json();
        }).then(data =>{
            
           setUsers(data)
          
        }).catch((e) => {

  
        })
    }
  
      const useStyle = makeStyles({
          icon: {
         
            color: '#5ac2df'





,
            marginRight: 10,
            marginLeft: 10,
      
          }
        });
        const classes = useStyle()
      const handlesubmitt = (e) => {
          e.preventDefault()
         
          const departement = { nom, parent,children,chef,rh ,rh2,wfm}
     
        

          fetch(url+"arbo/",
              {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      Authorization:token
                  },
                  body: JSON.stringify(departement)
              }).then(() => {
  
                  // history.push('/Utilisateurs')
                 window.location.reload(false);
                
  
              }).catch((e) => {

                /**if ( e.response.status=== 401) {
                    logoutfunction(e.response.status)
                  } */
            })
      }
  
    return(
    <div>
         <a  data-toggle="modal" data-target={`#t${parent}`} onClick={fetchUsers}>
                <AddCircleIcon   className={classes.icon}/>
                </a>


                <div className="modal fade" id={`t${parent}`} role="dialog" aria-labelledby="ajouterdepartement" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="ajouterdepartement">Ajouter Département</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">



                                <form>


                                <div className="form-group">
                                        <div className="input-group input-group-merge input-group-alternative">

                                            <input className="form-control" placeholder=" " value={parent}  name="parent"  type="hidden" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="input-group input-group-merge input-group-alternative">

                                            <input className="form-control" placeholder="Nom de département " value={nom} name="nom_departement" onChange={(e) => setNomm(e.target.value)} type="text" />
                                        </div>
                                    </div>
{/**
                                    <div className='form-group'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Chef"
                                                value={chef}
                                                onChange={(e) => { setChef(e.target.value) }}
                                                helperText="Svp sélectionner un chef"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {users.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                           {option.user_name +"  "+ option.last_name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>
                                        </div> */}
                                        <div className='form-group'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Team leader"
                                                value={rh}
                                                onChange={(e) => { setRH(e.target.value) }}
                                                helperText="Svp sélectionner  Team leader"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {users.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.user_name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>
                                        </div>
                                        <div className='form-group'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Business Manager"
                                                value={rh2}
                                                onChange={(e) => { setRh2(e.target.value) }}
                                                helperText="Svp sélectionner Business Manager"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {users.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.user_name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>
                                        </div>
                                        <div className='form-group'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Direction des opérations"
                                                value={chef}
                                                onChange={(e) => { setChef(e.target.value) }}
                                                helperText="Svp sélectionner  Direction des opérations"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {users.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.user_name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>
                                        </div>
                                        <div className='form-group'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="wfm"
                                                value={wfm}
                                                onChange={(e) => { setWFM(e.target.value) }}
                                                helperText="Svp sélectionner  WFM"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {users.map((option) => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.user_name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>
                                        </div>
                             
                                    <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmitt} >Valider</button></div>
                                </form>

                            </div>
                            <div className="modal-footer">



                            </div>
                        </div>
                    </div>
                </div>
    </div>
    )
}
export default AddDepByChild;