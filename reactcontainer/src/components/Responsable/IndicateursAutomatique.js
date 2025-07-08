

import React, { useState } from 'react'
import useFetch from '../useFetch';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'react-chartjs-2'


import { useEffect } from 'react';


import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import { useMemo } from 'react';
import FormControlLabel from "@material-ui/core/FormControlLabel";


import Checkbox from "@material-ui/core/Checkbox";
import { MultiSelect } from '../MultiSelect';
import Indicateurs from './IndicateurAutomatiquedep';

import { useSelector } from 'react-redux';


ChartJS.register(
  BarElement, CategoryScale, LinearScale
)


const IndicateursAutomatique = () => {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const url=process.env.React_App_URL;
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iddd= test['iddep'].length==0?undefined: JSON.parse(JSON.stringify(test['iddep'])).map(x=>
      x.iddep_rh1
      ).join("")+","+JSON.parse(JSON.stringify(test['iddep'])).map(x=>
        x.iddep_rh2
        ).join("")+","+JSON.parse(JSON.stringify(test['iddep'])).map(x=>
          x.iddep_chef
          ).join("")+","+JSON.parse(JSON.stringify(test['iddep'])).map(x=>
            x.iddep_wfm
            ).join("")
   var admin=test['admin']
   var DRH=test['DRH']

    
  }
  var iddep=iddd==""? undefined:iddd
  const [uss,setuss]=useState([])
  const users=[]

  const[uu,setU]=useState([])


const arr=[]

  const [selectedd, setSelectedd] = useState([]);



  useEffect(() => {
 
    

  if(uu!=""){
    fetch(url+"Testuserofdepartements/?id="+ uu, {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then((result) => {
      /**if ( result.status===401) {
          logoutfunction(result.status)
        } */
   
      result.json().then((resp) => {
    
      resp.map(x=>users.push({"label":x.label,"value":x.value}))
      setuss(resp)
      })

    }).catch((e) => {

/**      if ( e.response.status=== 401) {
          logoutfunction(e.response.status)
        } */
  })
  }

  }, [uu])
  



  const { data: data } =  useFetch(url+"Getarbobyids/?id="+iddep)
  const { data: dataadmin, isloading: aae, error: fv } = useFetch(url+"arbo/")
  useEffect(()=>{
  if(iddep!=undefined){
 
    setTreeData(data)
    
  
  }else if (admin==true || DRH==true ){
  
    setTreeData(dataadmin)
   
  }else{
   
    setTreeData([])
  }
  
  
  },[treeData,data,dataadmin])
  const [treeData, setTreeData] = React.useState([]);






  const [char, setCharts] = useState([])

  const [show, setShow] = useState(false)
  const _onClick = async () => {
    arr.push(selectedd.map(x=>x.value))
    await fetch(url+`ChartParJournee/` + date1 + "/" + date2 + "/" + nbcc + "/" + nbaa + "/" + nbrr + "/" + nbabse + "/"+nbmis+ "/?id=" + arr, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',

Authorization:token
      }
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            setShow(true)
            setCharts(json)
          
          });
        }
      }).catch((e) => {

      /**  if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
    })
  };




  const dataa = {

    labels: char.map(x => x.name),
    datasets: [{
      label: "Indicateur",
      data: char.map(x => x.nombre),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  }

  var optionss = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    legend: {
      labels: {
        fontSize: 26

      }
    }
  }

  //jour

  const [nbaa, Setnombreauth] = useState(false)
  const[nbmis,setNombreMission]=useState(false)
  const [nbcc, Setnombrecongess] = useState(false)
  const [nbrr, Setnombreretard] = useState(false)

  const [nbabse, setNombreAbsenceJournee] = useState(false)
  const [date1, setDate] = useState('')
  const [date2, setDate2] = useState('')
  const handleOnChangeAuth = () => {
    Setnombreauth(!nbaa);
  };
  const handleOnChangeCongess = () => {
    Setnombrecongess(!nbcc);
  };

  const handleOnChangeretard = () => {
    Setnombreretard(!nbrr);
  };

  const handleOnChangeAbsenceJournne = () => {
    setNombreAbsenceJournee(!nbabse)
  }
const handleOnChangeMission=()=>{
  setNombreMission(!nbmis)
}
  



const handleChange = (selected, allchecked) =>{
  let results = allchecked.map(({value})=>value);
  
  setU(results)
}




 const dropdown = useMemo(()=>{
  return(

        <DropdownTreeSelect
              data={treeData}
              onChange={(selected, allchecked) =>{handleChange(selected, allchecked)}}
              texts={{ placeholder: "Département" }}
              className="mdl-demo" 
          />
   )}, [treeData]);

  return (

    <div>
      

      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">
{/**                          <div className='card-header' id="colorcardheader">
      <h3 style={{color:"white"}}>Indicateurs </h3>
      </div> */}
              <div className="card-header border-0">
                <div className="row">


                  <button data-toggle="modal" data-target="#ajouterindiateurjour" className="btn btn-primary">
                   Choisir Un Indicateur
                  </button>


               

                </div>
              </div>
              
              {show ?
                <div className="container">




                  <div className="card">


                    <Bar
                      data={dataa}
                      height={80}
                      options={optionss}
                      label={char.map(x => x.nombre)}

                    />

                  </div>
                </div> :
                null
              }
              <br/>
            <Indicateurs/> 
              <div >

                <div className="modal fade" id="ajouterindiateurjour"  role="dialog" aria-labelledby="ajouterindiateurjour" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Indicateur par journées </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                  
              

                            <form >
                              <div className='row'>

                                <div className='col-md-6'>
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="" value={date1} name="date" onChange={(e) => setDate(e.target.value)} type="date" />
                                    </div>
                                  </div>
                                </div>
                                <div className='col-md-6'>
                                  <div className="form-group">
                                    <div className="input-group input-group-merge input-group-alternative">

                                      <input className="form-control" placeholder="" value={date2} name="date" onChange={(e) => setDate2(e.target.value)} type="date" min={date1}/>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="form-check">
                                  <FormControlLabel control={<Checkbox />} label='nombre des autorisations' value={nbaa} onChange={handleOnChangeAuth} />

                                </div>
                              </div>
                              <div className="row">
                                <div className="form-check">
                                  <FormControlLabel control={<Checkbox />} label='nombre des congés' value={nbcc} onChange={handleOnChangeCongess} />
                                </div>
                              </div>

                         
                              <div className='row'>
                                <div className="form-check">
                                  <FormControlLabel control={<Checkbox />} label='nombre des retards' value={nbrr} onChange={handleOnChangeretard} />
                                </div>

                              </div>
                              <div className='row'>
                                <div className="form-check">
                                  <FormControlLabel control={<Checkbox />} label='nombre des absences' value={nbrr} onChange={handleOnChangeAbsenceJournne} />
                                </div>
                              </div>
                              <div className="row">
                                <div className="form-check">
                                  <FormControlLabel control={<Checkbox />} label='nombre  des missions' value={nbmis} onChange={handleOnChangeMission} />
                                </div>
                              </div>
                              <div className='row'>
                                <div className='col-md-6'>
                                {dropdown}
                                </div>
                                <div className='col-md-6'>
                                 <MultiSelect options={ uss} value={selectedd} onChange={setSelectedd} />
                                 </div>
                              
                              </div>

                     
                           
                             



                              <div className="form-group pt-3">
                                <button type="button" className="btn btn-primary" onClick={() => { _onClick() }}>Importer</button>

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
          </div>
        </div></div>
        
        
  </div>

  );
}


const Indi = ({ data, nba, nbc, nbauth }) => {
 

  return (
    <div>



      {data.map(tree =>
        <Tree node={tree} id={tree.id} nba={nba} nbc={nbc} nbauth={nbauth} />
      )}

    </div>
  );
}


const Tree = ({ node, id, nba, nbc, nbauth }) => {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const url=process.env.React_App_URL;
  const [active, setActive] = useState(false)
  const [charts, setCharts] = useState([])
 
  useEffect(() => {

    const SelectCharts = async () => {
      await fetch(url+"Chartdynamiquedep/" + id + "/" + nbc + "/" + nba + "/" + nbauth, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,

        }
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((json) => {

              setCharts(json)
            });
          }
        }).catch((error) => {
        });
    };
    SelectCharts(id)
  }, [])





 
  const data = {
    labels: charts.map(x => x.name),
    datasets: [{
      label: charts.map(x => x.number),
      data: charts.map(x => x.number),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  }
  var options = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    legend: {
      labels: {
        fontSize: 26
      }
    }
  }

  return (

    <div className="container">







      <div className="card">

        <div className="view overlay">
          <Bar
            data={data}
            height={80}
            options={options}
          /> <a>

          </a>
        </div>




        <div className="card-body">


          <h4 className="card-title">{node.nom}</h4>
          <button className="btn btn-danger" onClick={() => setActive(true)} data-toggle="modal" data-target={`#a${node.id}`}>Plus de détails  </button>
          <hr />



        </div>
      </div>





      <div className="modal fade" id={`a${node.id}`} role="dialog" aria-labelledby={`a${node.id}`} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel"></h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {active === true && <Indi data={node.children} nba={nba} nbc={nbc} nbauth={nbauth} />}
            </div></div></div>
      </div>




    </div>

  );
}

export default IndicateursAutomatique;