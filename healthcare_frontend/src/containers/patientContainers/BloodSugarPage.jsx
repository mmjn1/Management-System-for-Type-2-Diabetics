import React, {useEffect, useState} from 'react';
import "../../sass/PatientDashboard.scss";
import {Doughnut} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import {useDispatch, useSelector} from "react-redux";
import {userDetails} from "../../features/api/Userdetails";


const BloodSugarPage = () => {
    const dispatch = useDispatch()
    const details = useSelector((state) => state.userDetails)
    useEffect(() => {
        dispatch(userDetails())
    }, []);
    useEffect(() => {
        if (details.status === 'succeeded') {
            const centerTextPlugin = {
                id: 'centerText',
                afterDraw: (chart) => {
                    const ctx = chart.ctx;
                    const width = chart.width;
                    const height = chart.height;
                    ctx.restore();
                    let fontSize = (height / 100).toFixed(2);
                    ctx.font = `${fontSize}em sans-serif`;
                    ctx.textBaseline = 'middle';

                    const text = details.data.information.blood_sugar_level, 
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = height / 2;

                    ctx.fillText(text, textX, textY);
                    ctx.save();
                }
            };


            Chart.register(centerTextPlugin);
        }

    }, [details.status]);
    const data = {
        datasets: [
            {
                data: [100],
                backgroundColor: ['#1BC5BD'],
                hoverBackgroundColor: ['#C9f7f5'],
                borderRadius: 20, 

            },
        ],
        labels: ['Level'],
    };

    const options = {
        cutout: '80%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            }
        },
    };
    return (
        <div className="home container">
            <div className="homeContainer">
                <div className="content">
                    {details.status === 'succeeded' ?
                        <div className='row'>
                            <div className="col-lg-6">
                                {/*begin::Mixed Widget 14*/}
                                <div className="card card-custom card-stretch gutter-b">
                                    {/*begin::Header*/}
                                    <div className="card-header border-0 pt-5">
                                        <h3 className="card-title font-weight-bolder">Blood Sugar</h3>
                                        <div className="card-toolbar">

                                        </div>
                                    </div>
                                   
                                    <div className="card-body d-flex flex-column">
                                        <div className="flex-grow-1">
                                            <div style={{
                                                height: '250px',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center', // Center horizontally
                                                alignItems: 'center', // Center vertically
                                                position: 'relative',
                                            }}>
                                                <Doughnut redraw={true}
                                                          data={data} options={options}/>
                                            </div>
                                            {/*<div id="kt_mixed_widget_14_chart" style={{height: '200px'}}/>*/}
                                        </div>
                                        <div className="pt-5">
                                            <p className="text-center font-weight-normal font-size-lg pb-7">Targeted:<b>
                                                {details.data.information.target_blood_sugar_level}
                                            </b> mg/dL</p>
                                            <a href="#"
                                               className="btn btn-success btn-shadow-hover font-weight-bolder w-100 py-3">{details.data.information.type_of_diabetes}</a>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                        </div> : 'loading'}

                </div>
            </div>
        </div>
    );
}

export default BloodSugarPage;
