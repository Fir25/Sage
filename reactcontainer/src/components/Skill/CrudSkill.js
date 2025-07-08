import useFetch from '../useFetch';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import AjoutSkill from './AjoutSkill';
import $ from "jquery";
import React, { useState, useEffect } from 'react';

import frdatatable from '../../frdatatable.json';

function CrudSkill() {
  const token = localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null;
  const url = process.env.React_App_URL;

  const { data: skills = [], isloading, error } = useFetch(url + "listskill/");
  const userinfo = useSelector(state => state.userinfo);
  const test = userinfo[0];

  let skillsedit = [];
  let skillsdelete = [];

  if (Object.keys(userinfo).length !== 0) {
    skillsedit = test['lignesedit'];
    skillsdelete = test['lignesdelete'];
  }

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
  const [skilldelete, setSkillDelete] = useState('');
  const [id, setId] = useState('');
  const [skillname, setSkillName] = useState('');

  const classes = useStyle();

  function selectSkill(id) {
    fetch(url + "updateskill/" + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      }
    }).then(res => res.json())
      .then(data => {
        setSkillName(data.skillname);
        setId(data.id);
      });
  }

  const deleteSkill = (id) => {
    fetch(url + 'SkillDelete/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }).then(() => {
      setOpen(false);
      window.location.reload();
    });
  };

  const updateSkill = () => {
    const skill = { skillname };

    fetch(url + 'updateskill/' + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(skill)
    }).then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    $('#skilltable').DataTable({
      language: frdatatable,
      dom: 'Blfrtip',
      buttons: [
        { extend: 'excel', className: 'btn btn-buttondatatable' },
        { extend: 'copy', className: 'btn btn-buttondatatable' },
        { extend: 'pdf', orientation: 'landscape', pageSize: 'LEGAL', className: 'btn btn-buttondatatable' },
        { extend: 'csv', className: 'btn btn-buttondatatable' },
        { extend: 'print', className: 'btn btn-buttondatatable' },
      ],
      destroy: true
    });
  }, [skills]);

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col">
          <div className="card shadow">
            <div className="card-header border-0">
              <AjoutSkill />
            </div>

            {skills.length === 0 ? "" :
              <div className="table-responsive">
                <table className="table table-bordered display" id="skilltable">
                  <thead className="thead-light">
                    <tr>
                      <th>Nom de la compétence</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map(s => (
                      <tr key={s.value}>
                        <td>{s.label}</td>
                        <td>
                          <div className="row">
                            <div className="col-md-6">
                              <a onClick={() => selectSkill(s.value)} data-toggle="modal" data-target="#modalskill">
                                <EditIcon className={classes.icon} />
                              </a>
                            </div>
                            <div className="col-md-6">
                              <a onClick={() => { setOpen(true); setSkillDelete(s.value); }}>
                                <DeleteIcon className={classes.icon} />
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }

            <Dialog open={open} onClose={() => setOpen(false)} className={classes.dialog}>
              <DialogTitle>{"Supprimer une compétence"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Êtes-vous sûr de vouloir supprimer cette compétence ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Non</Button>
                <Button onClick={() => deleteSkill(skilldelete)}>Oui</Button>
              </DialogActions>
            </Dialog>

            <div className="modal fade" id="modalskill" role="dialog" aria-labelledby="modalskill" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Modifier la compétence</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <input
                          className="form-control"
                          placeholder="Nom de la compétence"
                          value={skillname}
                          onChange={(e) => setSkillName(e.target.value)}
                          type="text"
                        />
                      </div>
                      <div className="form-group">
                        <button className="btn btn-primary" onClick={updateSkill}>Valider</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CrudSkill;
