import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Form} from "react-bootstrap";
import {Formik, Field} from "formik";
import {post} from "../../../utils/axios";
import {useNavigate} from "react-router-dom";
import * as yup from "yup";
import {requestLogin} from "../../../features/api/loginslice";


const schema = yup.object({
  email: yup.string().email("Invalid Email").required("Email Required"),
  password: yup.string().required("Password required"),
});

const Login = () => {
  const dispatch = useDispatch();

  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (values) => {
      dispatch(requestLogin(values));
      // if (email && password) {
      //     setError("");
      //     post("/login/", {email: email, password: password})
      //         .then((res) => {
      //             localStorage.setItem("token", res.accessToken);
      //
      //             navigate("/");
      //         })
      //         .catch((err) => {
      //             alert(err);
      //         });
      // } else {
      //     setError("Please enter both username and password.");
      // }
  };

  const commonStyle = {
      paddingTop: "200px",
  };

  return (<main id="main">
      <div id="common" className="section-common" style={commonStyle}>
          <div className="container">
              <div className="row">
                  <div className="container mt-5">
                      <div className="row justify-content-center">
                          <div className="col-md-6">
                              <div className="card">
                                  <div className="card-body">
                                      <h2 className="card-title text-center mb-4">Login</h2>
                                      <Formik
                                          validationSchema={schema}
                                          onSubmit={handleLogin}
                                          initialValues={{
                                              email: email, password: password
                                          }}
                                      >
                                          {({
                                                handleSubmit, handleChange, values, errors,
                                            }) => (<Form noValidate onSubmit={handleSubmit}>
                                              <div className="mb-3">
                                                  <label htmlFor="username" className="form-label">
                                                      Email:
                                                  </label>
                                                  <Form.Control
                                                      type="email"
                                                      className="form-control"
                                                      id="email"
                                                      value={values.email}
                                                      required
                                                      name='email'
                                                      onChange={handleChange}
                                                      isInvalid={!!errors.email}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                      {errors.email}
                                                  </Form.Control.Feedback>
                                              </div>
                                              <div className="mb-3">
                                                  <label htmlFor="password" className="form-label">
                                                      Password:
                                                  </label>
                                                  <Form.Control
                                                      type="password"
                                                      className="form-control"
                                                      id="password"
                                                      name='password'
                                                      value={values.password}
                                                      onChange={handleChange}
                                                      required
                                                      isInvalid={!!errors.password}
                                                  />
                                                  <Form.Control.Feedback type="invalid">
                                                      {errors.password}
                                                  </Form.Control.Feedback>
                                              </div>


                                              <div className="text-center">
                                                  <button type="submit" className="btn btn-primary">
                                                      Login
                                                  </button>
                                                  <div className="mt-3 mb-1">
                                                      <h6><a href='register'>Create new account</a></h6>
                                                  </div>
                                                  <div className="mt-3 mb-1">
                                                      <h6><a href='forgotPassword'> Forgot Password?</a></h6>
                                                  </div>

                                              </div>
                                          </Form>)}
                                      </Formik>

                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </main>);
};

export default Login;