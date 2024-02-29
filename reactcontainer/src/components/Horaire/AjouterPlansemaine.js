import React, { useState } from 'react';

import useFetch from '../useFetch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import logoutfunction from '../authentification/logoutfunction';
import { useSelector } from 'react-redux';
function AjouterPlansemaine() {
    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
    const url=process.env.React_App_URL;
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
     
     var horaireedit=test['horaireedit']
     var horairedelete=test['horairedelete']
     
      
    }
    const { data: Horraires = []} = useFetch(url+"horaire/")
    const [lundi, setLundi] = useState('');
    const [mardi, setMardi] = useState('');
    const [mercredi, setMercredi] = useState('');
    const [jeudi, setJeudi] = useState('');
    const [vendredi, setVendredi] = useState('');
    const [samedi, setSamedi] = useState('');
    const [dimanche, setDimanche] = useState('');
    const [nomsemaine,setPlansemaine]=useState('')
    const [motifplan,setMotifPlan]=useState('')
    const handlesubmit = (e) => {
        e.preventDefault()

        const jour = { lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche , nomsemaine,motifplan }

        fetch(url+"plansemaine/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:token
                },
                body: JSON.stringify(jour)
            }).then(() => {


                window.location.reload(false);

            }).catch((e) => {

            /**    if ( e.response.status=== 401) {
                    logoutfunction(e.response.status)
                  } */
            })
    }


    return (
        <div>

            <div className="row">

              { horaireedit && <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterplandesemaine">
                    Ajouter Plan de Semaine
                </button>

              }  


                <div className="modal fade" id="ajouterplandesemaine" role="dialog" aria-labelledby="ajouterplandesemaine" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ajouter Plan de Semaine</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">



                                <form>

                              <div className='row'>
                                  <div className='col-md-6'>
                                  <div className="form-group">
                                          

                                          <input className="form-control" placeholder="Nom de plan semaine" value={nomsemaine} name="nom" onChange={(e) => setPlansemaine(e.target.value)} type="text" />
                                   
                                  </div>
                                  </div>
                              
                    <div className='col-md-6'>
                      <TextField
                        id="outlined-select-currency"
                        select
                        label="Motif horaire"
                        value={motifplan}
                        onChange={(e) => setMotifPlan(e.target.value)}
                        helperText="sélectionner une motif"
                        margin='normal'
                        fullWidth
                      >

                        <MenuItem key="1" value="administratif">
                          Administratif
                        </MenuItem>
                        <MenuItem key="2" value="flexible">
                          Flexible
                        </MenuItem>
                        <MenuItem key="3" value="aménagés">
                          Aménagés
                        </MenuItem>

                      </TextField>

                  </div>
                              </div>

                                    <div className='row'>
                                        <div className="col-md-6">
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Lundi"
                                                value={lundi}
                                                onChange={(e) => { setLundi(e.target.value) }}
                                                helperText="sélectionner un horaire"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {Horraires.map((option) => (
                                                    <MenuItem key={option.nom} value={option.id}>
                                                        {option.nom}
                                                    </MenuItem>
                                                ))}
 <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                                            </TextField>
                                        </div>
                                        <div className="col-md-6">
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Mardi"
                                                value={mardi}
                                                onChange={(e) => { setMardi(e.target.value) }}
                                                helperText="sélectionner un horaire"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {Horraires.map((option) => (
                                                    <MenuItem key={option.nom} value={option.id}>
                                                        {option.nom}
                                                    </MenuItem>
                                                ))}
                                          <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                                            </TextField>
                                        </div>


                                    </div>

                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Mercredi"
                                                value={mercredi}
                                                onChange={(e) => { setMercredi(e.target.value) }}
                                                helperText="sélectionner un horaire"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {Horraires.map((option) => (
                                                    <MenuItem key={option.nom} value={option.id}>
                                                        {option.nom}
                                                    </MenuItem>
                                                ))}
 <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                                            </TextField>
                                        </div>
                                        <div className='col-md-6'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Jeudi"
                                                value={jeudi}
                                                onChange={(e) => { setJeudi(e.target.value) }}
                                                helperText="sélectionner un horaire"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {Horraires.map((option) => (
                                                    <MenuItem key={option.nom} value={option.id}>
                                                        {option.nom}
                                                    </MenuItem>
                                                ))}
 <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                                            </TextField>
                                        </div>
                                    </div>



                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Vendredi"
                                                value={vendredi}
                                                onChange={(e) => { setVendredi(e.target.value) }}
                                                helperText="sélectionner un horaire"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {Horraires.map((option) => (
                                                    <MenuItem key={option.nom} value={option.id}>
                                                        {option.nom}
                                                    </MenuItem>
                                                ))}
 <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                                            </TextField>
                                        </div>
                                        <div className='col-md-6'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Samedi"
                                                value={samedi}
                                                onChange={(e) => { setSamedi(e.target.value) }}
                                                helperText="sélectionner un horaire"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {Horraires.map((option) => (
                                                    <MenuItem key={option.nom} value={option.id}>
                                                        {option.nom}
                                                    </MenuItem>
                                                    
                                                ))}
 <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                                            </TextField>
                                        </div>
                                    </div>




                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <TextField
                                                id="outlined-select-currency"
                                                select
                                                label="Dimanche"
                                                value={dimanche}
                                                onChange={(e) => { setDimanche(e.target.value) }}
                                                helperText="sélectionner un horaire"
                                                margin='normal'
                                                fullWidth
                                            >
                                                {Horraires.map((option) => (
                                                    <MenuItem key={option.nom} value={option.id}>
                                                        {option.nom}
                                                    </MenuItem>
                                                ))}
 <MenuItem key="" value={null}>
                            ------
                          </MenuItem>
                                            </TextField>
                                        </div>
                                    </div>



                                    <div className="form-group"><button className="btn btn-primary" type="submit" onClick={handlesubmit} >Valider</button></div>    </form>

                            </div>
                            <div className="modal-footer">



                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}
export default AjouterPlansemaine;