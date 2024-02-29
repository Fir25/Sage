
import React from 'react';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Mouchard from '../Mouchardd/Mouchard';
import useFetch from "../useFetch";
import { useMemo } from "react";
import DropdownTreeSelect from 'react-dropdown-tree-select';
import { Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from "axios"
import { useEffect } from 'react';

import { MultiSelect } from '../MultiSelect';
function ImporterPointage() {
  const url = process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null
  const [alert, setAlert] = useState(false)
  const userinfo = useSelector(state => state.userinfo);
  const test = userinfo[0]
  if (Object.keys(userinfo).length != 0) {
    var iduserinfo = test['id']
    var iddd=  test['iddep'].join(",")

  

    var admin = test['admin']
    var DRH = test['DRH']
  }
  const [selectedd, setSelectedd] = useState([]);

  const handleChange = (selected, allchecked) => {
    let results = allchecked.map(({ value }) => value);

    setU(results)
  }
  const [uu, setU] = useState([])
  const [uss, setuss] = useState([])
  const[alertvalid,setAlertvalid]=useState(false)
  var iddep = iddd == "" ? undefined : iddd

  const [activite, setActivite] = useState([])
  const activities = [
    { "label": "activité", "value": "1" },
    { "label": "Suspendu", "value": "0" }
  ]
  const { data: data, isloading: zzsx, error: esse } = useFetch(url + "Getarbobyids/?id=" + iddep)
  const { data: dataadmin, isloading: aae, error: fv } = useFetch(url + "arbo/")
  const [treeData, setTreeData] = React.useState([]);
  const[loginemploye,setloginemploye]=useState(false)
  useEffect(() => {
    if (iddep != undefined) {

      setTreeData(data)


    } else if (admin == true || DRH == true) {

      setTreeData(dataadmin)

    } else {
      setloginemploye(true)
      setTreeData([])
    }


  }, [treeData, data, dataadmin])
  const dropdown = useMemo(() => {
    return (

      <DropdownTreeSelect
        data={treeData}
        onChange={(selected, allchecked) => { handleChange(selected, allchecked) }}
        texts={{ placeholder: "Département" }}
        className="mdl-demo"
      />
    )
  }, [treeData]);
  //const { data: pointeuses, isloading, error } = useFetch(url+"pointeuse/")
  const { data: employees, isloading: zz, error: ee } = useFetch(url + "user/")

const[disablebut,setDisablebut]=useState(false)
  useEffect(() => {
    axios.get(url + "Pointageaujourdhui/" + iduserinfo, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,

      },
    }).then(res => {
      setData(res.data)

    }

    ).catch(err => {
      /* if ( err.response.status=== 401) {
       logoutfunction(err.response.status)
       }*/


    })
  }, [iduserinfo]

  )
  const [Pointageaujourdhui, setData] = useState([]);


  const [date_pointage, setDate] = useState('');


  const [pointeuse, setPointeuse] = useState(null);

  const [etat, setEtat] = useState(0)
  const users = []
  const ac = []
  useEffect(() => {
    ac.push(activite.map(x => x.value))


    fetch(url + "userofdepartements/?id=" + uu + "&idactivite=" + ac,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        }
      }).then((result) => {
        result.json().then((resp) => {

          resp.map(x => users.push({ "label": x.label, "value": x.value }))
          setuss(resp)
        }).catch((e) => {

          /**   if ( e.response.status=== 401) {
                 logoutfunction(e.response.status)
               } */
        })

      })

  }, [activite, uu])

  const em = []
  var [employes, setEmployes] = useState([iduserinfo])

  const handlesubmit = (etat, idpause) => {
    setAlertvalid(false)
    setDisablebut(true)
    const pointage = { employes, etat, idpause }
    fetch(url + "createpointage/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(pointage)
      })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else {
          axios.get(url + "Pointageaujourdhui/" + iduserinfo, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: token,

            },
          }).then(res => {
            setData(res.data)

          }

          ).catch(err => {

           

          })
        }

      })
      .then(() => {
        Mouchard("en cours", "ajouté", employes, iduserinfo, "Ajouter un pointage: " + date_pointage)
        setEmployes([iduserinfo])
        setSelectedd([])
        setAlertvalid(true)
        setDisablebut(false)
      }).catch((e) => {


        /**   if ( e.response.status=== 401) {
               logoutfunction(e.response.status)
           } */
           setAlertvalid(false)
           setDisablebut(false)
        setAlert(true)
      })


  }

  return (
    <div>

      <div className="row">

        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ajouterpointage">
          Pointeuse virtuelle
        </button>

  <div className="modal fade" id="ajouterpointage" role="dialog" aria-labelledby="ajouterpointage" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Ajouter Pointage</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                {Object.values(Pointageaujourdhui).map(({ pauses, sortie, sortiepause }, i) => (
    <>
      {sortie == 2 && (
        <>
          <button
            type="button"
            className="btn btn-info"
            onClick={() => {
              handlesubmit(0, null);
              window.location.reload();
            }}
            disabled={disablebut}
          >
            pt entrée
          </button>
        </>
      )}
      {sortie == 1 && (
        <>
          <button
            type="button"
            className="btn btn-info"
            onClick={() => {
              handlesubmit(1, null);
              window.location.reload();
            }}
            disabled={disablebut}
          >
            sortie
          </button>
        </>
      )}
      {sortiepause == 1 && (
        <>
          {pauses.length == 0 ? (
            ""
          ) : (
            <>
              <button
                type="button"
                className="btn btn-info"
                data-toggle="modal"
                data-target="#pointagefinpause"
              >
                fin pause
              </button>
              <div
                className="modal fade"
                id="pointagefinpause"
                role="dialog"
                aria-labelledby="#pointagefinpause"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Pauses
                      </h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {/* parcourir la liste des pauses /filter pour afficher seulement les pauses planifiés */}
                      {pauses
                        .filter((x) => x.planifie == true)
                        .map((p) => (
                          <>
                            <button
                              type="button"
                              className="btn btn-warning"
                              style={{ marginBottom : 10}}
                              onClick={() => {
                                handlesubmit(1, p.id);
                                window.location.reload();
                              }}
                              disabled={disablebut}
                            >
                              {p.nom}
                              <br />
                              {p.dpause}-{p.fpause}
                            </button>
                          </>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {sortiepause == 2 && (
        <>
          {pauses.length == 0 ? (
            ""
          ) : (
            <>
              <button
                type="button"
                className="btn btn-info"
                data-toggle="modal"
                data-target="#pointagedebutpause"
              >
                Début pause
              </button>
              <div
                className="modal fade"
                id="pointagedebutpause"
                role="dialog"
                aria-labelledby="#pointagedebutpause"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Pauses
                      </h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {pauses
                        .filter((x) => x.planifie == true)
                        .map((p) => (
                        <>
                        <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => {
                        handlesubmit(0, p.id);
                        window.location.reload();
                        }}
                        disabled={disablebut}
                        >
                        {p.nom}
                        <br />
                        {p.dpause}-{p.fpause}
                        </button>
                        </>
                        ))}
                        </div>
                        </div>
                        </div>
                        </div>
                        </>
                        )}
                        </>
                        )}
                        </>
                        ))}
<div className='row pt-2'>
{alertvalid && <Alert variant="filled" severity="success">Votre pointage est bien enregistré</Alert>}

</div>
                </form>
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
export default ImporterPointage;