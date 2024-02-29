import React from 'react';

import useFetch from '../useFetch';

import { useState } from 'react';

import { useSelector } from 'react-redux';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import { format } from 'date-fns';
import { TextField } from '@mui/material';
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from '@mui/material/MenuItem';

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MenuProps } from "../Rapports/utils";
import ListItemText from "@material-ui/core/ListItemText";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import { makeStyles } from "@material-ui/core/styles";
function AjouterPause() {
    const url = process.env.React_App_URL;
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
     
     var horaireedit=test['horaireedit']
     var horairedelete=test['horairedelete']
     
      
    }
    /** */
    const { data: horaires, isloading: lll, error: fev } = useFetch(url + "horaire/")



    /** */
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

    const [nbfois, setNbfois] = useState('');

    const [quota, setquota] = useState('');
    const [planifie, setplanifie] = useState(false);
const[pausedejeuner,setPausedejeuner]=useState(false)
    const [dpause, setdpause] = useState(format(new Date(), 'HH:mm:ss'))
    const [fpause, setfpause] = useState(format(new Date(), 'HH:mm:ss'))
    const [dpauseaf, setdpauseaf] = useState(format(new Date(), 'HH:mm:ss'))
    const [fpauseaf, setfpauseaf] = useState(format(new Date(), 'HH:mm:ss'))
const[nom,setNom]=useState('')
    const token = localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null

    const handleChangePlanifie = () => {
        setplanifie(!planifie)
    }
    const handleChangePausedejeuner = () => {
        setPausedejeuner(!pausedejeuner)
    }
    const handlesubmit = (e) => {
        e.preventDefault()



        const pauseList = { nbfois, quota, dpause, fpause, planifie, idhoraire,nom,pausedejeuner }

        fetch(url + "pause/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify(pauseList)
            }).then((data) => {

                window.location.reload(false);


            }).catch((e) => {

                /**   if ( e.response.status=== 401) {
                       logoutfunction(e.response.status)
                     } */
            })
    }
    const [idhoraire, setIdHoraire] = useState([])
    const isAllSelected = horaires.length > 0 && idhoraire.length === horaires.length;


    const handleChangehoraire = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setIdHoraire(idhoraire.length === horaires.length ? [] : horaires.map(x => x.id));
            return;
        }

        setIdHoraire(value);
    };


    return (
        <div>

            <div className="row">

           { horaireedit && <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpause">
                    Ajouter Pause
                </button>}



                <div className="modal fade" id="ajouterpause" role="dialog" aria-labelledby="ajouterpause" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Ajouter Pause</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">



                                <form>
                                    <div className="row">
                                    <div className='col-md-4'>
                                            <div className="form-group">
                                                <div className="input-group input-group-merge input-group-alternative">

                                                    <input className="form-control" placeholder="Nom de pause" value={nom} name="nbfois" onChange={(e) => setNom(e.target.value)} type="text" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="form-group">
                                                <div className="input-group input-group-merge input-group-alternative">

                                                    <input className="form-control" placeholder="Nombre de fois" value={nbfois} name="nbfois" onChange={(e) => setNbfois(e.target.value)} type="number" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-md-4'>
                                            <div className="form-group">
                                                <div className="input-group input-group-merge input-group-alternative">

                                                    <input className="form-control" placeholder="Quota" value={quota} name="quota" onChange={(e) => setquota(e.target.value)} type="number" />
                                                </div>
                                            </div>
                                        </div>
                 
                                    </div>









                                    <div className="row">
                           
                                        <div className="col-md-4  pt-2">
                                            <div className="form-group">
                                                <div className="input-group input-group-merge input-group-alternative">
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <MobileTimePicker
                                                            label="Début pause"
                                                            ampm={false}
                                                            format="HH:mm"
                                                            value={dpauseaf}
                                                            onChange={(h) => {
                                                                setdpauseaf(h)
                                                                setdpause(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                                            }}


                                                            renderInput={(params) => <TextField {...params} size="small" />}
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 pt-2">
                                            <div className="form-group">
                                                <div className="input-group input-group-merge input-group-alternative">

                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <MobileTimePicker
                                                            label="Fin pause"
                                                            ampm={false}
                                                            format="HH:mm"
                                                            value={fpauseaf}
                                                            onChange={(h) => {
                                                                setfpauseaf(h)



                                                                setfpause(h.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
                                                            }}


                                                            renderInput={(params) => <TextField {...params} size="small" />}
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-4 pt-2'>
                                            <FormControlLabel control={<Checkbox />} label='Planifié' value={planifie} onChange={handleChangePlanifie} checked={planifie ? true : false} />

                                        </div>

                                    </div>
                                    <div className='row'>
                                    <div className='col-md-4 pt-2'>
                                            <FormControlLabel control={<Checkbox />} label='Pause déjeuner' value={pausedejeuner} onChange={handleChangePausedejeuner} checked={pausedejeuner ? true : false} />

                                        </div>
                                        <div className='col-md-4 pt-2'>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel id="mutiple-select-label">Sélectionnez des horaires</InputLabel>
                                                <Select
                                                    labelId="mutiple-select-label"
                                                    multiple
                                                    value={idhoraire}
                                                    onChange={handleChangehoraire}
                                                    renderValue={(selected) => selected.map(obj => horaires.find(o => o.id === obj).nom).join(", ")}
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
                                                                    idhoraire.length > 0 && idhoraire.length < horaires.length
                                                                }
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            classes={{ primary: classes.selectAllText }}
                                                            primary="Select All"
                                                        />
                                                    </MenuItem>
                                                    {horaires.map((option) => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            <ListItemIcon>
                                                                <Checkbox checked={idhoraire.indexOf(option.id) > -1} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={option.nom} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div></div>

                                    <div className="form-group pt-3"><button className="btn btn-primary" onClick={handlesubmit}>Valider</button></div>    </form>


                            </div>

                        </div>
                    </div>


                </div>
            </div>
        </div>


    )

}
export default AjouterPause;