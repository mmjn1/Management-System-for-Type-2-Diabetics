import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

//import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/glucocare/vendor/bootstrap/css/bootstrap.min.css";

import DoctorForm from "./DoctorForm";
import PatientForm from "./PatientForm";

const Register = () => {
  return (
    <main id="main">
      <div
        id="common"
        className="section-common"
        style={{ paddingTop: "200px" }}
      >
        <div className="container">
          <div className="row">
            <div className="container mt-5">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <Tabs
                    defaultActiveKey="doctor"
                    transition={false}
                    id="uncontrolled-tab-example"
                  >
                    <Tab eventKey="doctor" title="Doctor">
                      <DoctorForm />
                    </Tab>
                    <Tab eventKey="patient" title="Patient">
                      <PatientForm />
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
