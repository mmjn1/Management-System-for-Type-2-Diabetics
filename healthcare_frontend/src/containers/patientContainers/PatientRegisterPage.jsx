import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, unstable_usePrompt as usePrompt, useHistory } from "react-router-dom";

import { selectIsAuthenticated, registerUserPatient } from "../../features/user";

import AccountForm from "../../components/userRegisterForm/AccountForm";
import ProfileForm from "../../components/userRegisterForm/ProfileForm";
import DiabetesInfoForm from "../../components/userRegisterForm/DiabetesInfoForm";

import { Image } from "@themesberg/react-bootstrap";

import BackgroundImage from "../../assets/img/diabetes.png"

import VerifyEmailMessagePage from "../EmailVerificationPage";

import destructureJSONIntoOnlyKeysAndValues from "../../Utils";

const PatientRegisterPage = () => {

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const navigate = useNavigate();
    const location = useLocation();
    const history = location.state?.history || "/";


    if (isAuthenticated) {
        // redirect to dashboard and also replace current page url 
        console.log("history", history);
        navigate(history, { replace: true });
    }


    const dispatch = useDispatch();

    const { registered, loading } = useSelector(state => state.user);


    // calulate the height of the navbar and deduct it from the height of the page to make the page height 100vh (prevent overflow)
    const [navbarHeight, setNavbarHeight] = useState(0);
    const heightValue = `calc(100vh - ${navbarHeight}px)`;

    const [currentSubmitCount, setSubmitCount] = useState(0);

    const [data, setData] = useState(() => {

        const storedData = localStorage.getItem("formData");

        if (storedData) {
            return JSON.parse(storedData);
        }

        return {
            email: "",
            password: "",
            re_password: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            mobile_number: "",
            type_of_diabetes: "",
            date_of_diagnoses: "",
            current_diabetes_mediciation: "",
            blood_sugar_level: "",
            medical_history: "",
            dietary_habits: "",
            physical_activity_level: "",
            smoking_habits: "",
            alcohol_consumption: "",
            date_last_HbA1c_test_and_result: "",
        };
    });

    const [currentStep, setCurrentStep] = useState(0);

    const [errors, setErrors] = useState({});
    const [currentStepWithErrors, setCurrentStepWithErrors] = useState(-1);


    const handleFormError = (errors) => {

        console.log("errors", errors);

        const fieldWithError = Object.keys(errors)[0];

        let stepWithError = -1;

        switch (fieldWithError) {
            case "email":
            case "password":
            case "re_password":
                stepWithError = 0;
                break;

            case "first_name":
            case "middle_name":
            case "last_name":
            case "mobile_number":
                stepWithError = 1;
                break;

            case "medical_history":
            case "dietary_habits":
            case "smoking_habits":
            case "alcohol_consumption":
            case "date_last_HbA1c_test_and_result":
                stepWithError = 2;
                break;

            default:
                stepWithError = -1;
                break;
        }
        if (stepWithError >= 0) {
            console.log("step with error", stepWithError);
            setCurrentStepWithErrors(stepWithError);
            // set the current step to the step with error
            setCurrentStep(stepWithError);
        }
    };


    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        console.log("current step count (useEffect at 298)", currentSubmitCount);
        if ((currentSubmitCount > 0) && (localStorage.getItem("submitCount") == null)) {

            console.log("currrent status localStorage.getItem('submitCount') 151", localStorage.getItem("submitCount"));
            console.log("current step count (useEffect at 151)", ((currentSubmitCount > 0) && (localStorage.getItem("submitCount") == null)));
            console.log("adding the submit count to localStorage");

            // Store form data in localStorage
            localStorage.setItem("submitCount", currentSubmitCount);
        }
    }, [currentSubmitCount]);



    useEffect(() => {

        // Retrieve form data from localStorage and set it in state
        const formData = localStorage.getItem("formData");
        if (formData) {
            const data = JSON.parse(formData);
            setData({ ...data })

            localStorage.removeItem("formData");
        }

        if (data == null) {
            console.log("data is null");
            return;
        } else {
            console.log("data is not null", data);
        }


        // If the register is successful, redirect to the verify email page
        if (registered) {
            setCurrentStep(3);
        }

        // get the current submit count from localStorage
        if (localStorage.getItem("submitCount")) {
            const storedSubmitCount = localStorage.getItem("submitCount");
            console.log("Getting the submit count from localStorage", JSON.parse(storedSubmitCount));
            setSubmitCount(JSON.parse(storedSubmitCount));
            // now clear the submit count from localStorage
            localStorage.removeItem("submitCount");
        }

    }, []);




    useEffect(() => {
        // Check if there are any errors in localStorage and set them in state 
        const storedErrors = localStorage.getItem("formErrors");
        if (storedErrors) {
            // debugger;
            const localStoredErrors = JSON.parse(storedErrors);
            // log the error as well 
            setErrors({ ...localStoredErrors });
            console.log("Getting the errors from localStorage", JSON.parse(storedErrors));
            // console.log("Errors exist, cannot proceed", errors);
            handleFormError(localStoredErrors);
            // update the isSubmitting state to false
            setIsSubmitting(false);

            // remove it from localStorage
            localStorage.removeItem("formErrors");

        }

        // check if the data is there in localStorage
        const storedData = localStorage.getItem("formData");
        if (storedData) {
            const localStoredData = JSON.parse(storedData);
            // log the error as well
            setData({ ...localStoredData });
            // remove it from localStorage
            localStorage.removeItem("formData");
        }

    }, []);



    useEffect(() => {

        // check the if there is chnage in errors
        if (Object.keys(errors).length > 0) {
            console.log("Errors exist, cannot proceed", errors);
            // window.location.reload();

        }
    }, [errors]);


    // useEffect(() => {
    //     const navbarElement = document.querySelector('.navbar'); // Replace with the actual classname of your navbar
    //     const navbarComputedStyle = getComputedStyle(navbarElement);
    //     const navbarHeight = parseInt(navbarComputedStyle.height, 10);
    //     setNavbarHeight(navbarHeight);
    //     console.log("navbarHeight", navbarHeight);
    // }, [navbarHeight]);

    useEffect(() => {
        // Wait for the DOM to be fully loaded
        window.addEventListener('load', () => {
            const navbarElement = document.querySelector('.navbar'); // Make sure this matches the navbar's class
            if (navbarElement) {
                const navbarComputedStyle = getComputedStyle(navbarElement);
                const navbarHeight = parseInt(navbarComputedStyle.height, 10);
                setNavbarHeight(navbarHeight);
            } else {
                console.log("Navbar element not found");
            }
        });
    }, []); // Removed navbarHeight from the dependency array


    const handleNextStep = (newData, final = false) => {
        setData((prev) => ({ ...prev, ...newData }));
        console.log("current step count (useEffect at 204)", currentStep);
        console.log("Final step", final);

        setIsSubmitting(false);

        // Store form data in localStorage
        localStorage.setItem("formData", JSON.stringify({ ...data, ...newData }));


        // Check if there are any errors
        if (Object.keys(errors).length > 0) {
            console.log("Errors exist, cannot proceed", errors);
            // return the current step
            // handleFormError(errors);
            return;
        }

        if (final) {
            setIsSubmitting(true);
            setSubmitCount(1);

            return;
        }
        setCurrentStep((prev) => prev + 1);
    };

    const handlePrevStep = (newData) => {
        setData((prev) => ({ ...prev, ...newData }));
        localStorage.setItem("formData", JSON.stringify({ ...data, ...newData }));


        console.log("current step count (useEffect at 204)", currentStep);


        // Check if there are any errors
        if (Object.keys(errors).length > 0) {
            // console.log("Errors exist, cannot proceed");
            return;
        }

        if (isSubmitting) {
            setIsSubmitting(false);
        }

        setCurrentStep((prev) => prev - 1);
    };

    useEffect(() => {
        if (isSubmitting) {
            // set the register type to student
            dispatch(registerUserPatient(data))
                .then((res) => {
                    console.log("res", res);

                    // € if res is fulfilled then set isSubmitting to false

                    if (res.meta.requestStatus === "fulfilled") {
                        console.log("res fulfilled");
                        // on success, set the current step to 3. No. 3 is the success page (VerifyEmailMessagePage)
                        setCurrentStep(3);
                        // update the isSubmitting state to false
                        setIsSubmitting(false);

                        // delete the form data from localStorage
                        localStorage.removeItem("formData");

                        // delete the form errors from localStorage
                        localStorage.removeItem("formErrors");

                        // delete the submit count from localStorage
                        localStorage.removeItem("submitCount");

                        console.log("data still exist in the state", data);
                        console.log("data still exist in the localStorage", localStorage.getItem("formData"));
                    }


                    if (res.meta.requestStatus === "rejected") {
                        console.log("res rejected");
                        throw res;
                    }
                })
                .catch((err) => {
                    const incomingErrors = err.payload;
                    console.log("incoming errors", incomingErrors);

                    // const fieldWithErrorList = {};

                    // for (const [key, value] of Object.entries(incomingErrors)) {
                    //     if (Array.isArray(value)) {
                    //         // if it's not an object, then the key is the field name
                    //         // e.g. {email: ["email already exists"]}
                    //         fieldWithErrorList[key] = value;
                    //         console.log("array", key, value);
                    //     } else if (typeof value === 'object') {
                    //         for (const [k, v] of Object.entries(value)) {
                    //             if (Array.isArray(v)) {
                    //                 console.log("array 2", k, v);
                    //                 // if nested object, then the key is the parent key 
                    //                 // e.g. {profile: {first_name: ["first name is required"]}
                    //                 // we only interested in the value of the nested object
                    //                 // in this case, the value is the array of errors with the field name
                    //                 // e.g. {first_name: ["first name is required"]}
                    //                 fieldWithErrorList[k] = v;
                    //                 console.log("array 3", key, value);
                    //                 console.log("array 4", k, v);
                    //                 break;
                    //             }
                    //         }
                    //     }
                    // }
                    const fieldWithErrorList = destructureJSONIntoOnlyKeysAndValues(incomingErrors);
                    // setErrors(err.payload);

                    // setErrors(fieldWithErrorList);
                    setErrors(fieldWithErrorList);

                    // store th error in Redux store 
                    // dispatch(setStateErrors(fieldWithErrorList));

                    // store the error in localStorage
                    localStorage.setItem("formErrors", JSON.stringify(fieldWithErrorList));

                    // store the data in localStorage
                    localStorage.setItem("formData", JSON.stringify(data));

                    // update the isSubmitting state to false
                    setIsSubmitting(false);
                    // update the current step to the step with error
                    handleFormError(fieldWithErrorList);
                    // console.log("handleFormError is called before me");
                    // reload the webpage to show the errors
                    window.location.reload();
                    // console.log("data still exist in the state", data);

                });

        }
        else {
            console.log("isSubmitting is false");
        }

    }, [isSubmitting]);




    
    const isDoctorRegister = false; // differentiates between doctor and patient registration

    const steps = [
        <AccountForm
            next={handleNextStep}
            data={data}
            error={errors}
            isSubmitting={isSubmitting}
            currentFormSubmitCount={currentSubmitCount}
            setErrors={setErrors}
            errorInStep={currentStepWithErrors}
            setCurrentStepWithErrors={setCurrentStepWithErrors}
            isDoctorRegister={isDoctorRegister}
        />,
        <ProfileForm
            next={handleNextStep}
            prev={handlePrevStep}
            data={data}
            error={errors}
            isSubmitting={isSubmitting}
            currentFormSubmitCount={currentSubmitCount}
            setErrors={setErrors}
            errorInStep={currentStepWithErrors}
            setCurrentStepWithErrors={setCurrentStepWithErrors}
            isDoctorRegister={isDoctorRegister}
        />,

        // this is last step of the form which is showing to user
        <DiabetesInfoForm
            prev={handlePrevStep}
            next={handleNextStep}
            data={data}
            error={errors}
            isSubmitting={isSubmitting}
            currentFormSubmitCount={currentSubmitCount}

            setErrors={setErrors}
            errorInStep={currentStepWithErrors}
            setErrorInStep={setCurrentStepWithErrors}
            loading={loading}
        />,

        // the step only shows when the user creates an account successfully
        <VerifyEmailMessagePage
            data={data}
        />,

    ];

    return (
        // <Layout title="Student Registration | Placement Assistance" content="Student Register page">

        <div className={
            "position-relative  "
            +
            (currentStep > 0 && currentStep <= 2 ? " h-100" : " ")

        }
            style={{ height: (currentStep === 0 ? `${heightValue}` : " ") }}>

            <div className="d-flex flex-row h-100">
                {/* col-md-5 flex-3 */}
                <div className={`${currentStep > 0 && currentStep <= 2 ? ' d-none d-md-0 ' : 'col-lg-6 col-xl-6 col-xxl-6  col-md-3 flex-3 col-sm-2 col-lg-6 d-md-block d-none d-lg-block d-sm-block d-xl-block d-xl-block '}`}>

                    {/* <div className={`${currentStep > 0 ? "col-md-1" : "col-md-5 flex-3"}`} > */}
                    <div style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }} className="d-flex flex-column justify-content-evenly h-100 container">
                    </div>
                    {/* <Image src={BackgroundImage} alt="Placement Assistance logo" height={heightValue} layout="responsive" style={{ objectFit: "cover", objectPosition: "center" }} /> */}
                </div>
                {/* <div className="col-md-7"> */}
                <div className={` bg-white mt-5 ${currentStep > 0 && currentStep <= 2 ? 'col-md-12 col-12 bg-white' : 'flex-fill col-md-7 col-lg-6 col-xl-6 col-xxl-6 flex-fill bg-white col-12'}`} >

                    {/* <div className={`${currentStep > 0 ? "col-md-9" : "col-md-5 flex-3"}`} > */}
                    <div className="text-center d-flex flex-column justify-content-evenly h-100 container ">
                        <div className="header lead">
                            <h1 className="fs-4 fw-bold">
                                {registered ? "Account Created" : "Create Your Patient Account"} </h1>
                            <span className="text-muted fs-6">

                                {registered ? "Your account has been created successfully" : "Please fill the form to create your patient profile"}
                            </span>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="card border-0 text-start">
                                        <div className="card-body ">
                                            {/* {steps[currentStep]} */}
                                            {/* // show the error message if there is an error in the current step */}
                                            {/* <div className="text-danger">
                                                {currentStepWithErrors === currentStep && errors && Object.keys(errors).length > 0 && (
                                                    <div className="text-danger">

                                                        {Object.keys(errors).map((key, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    {errors[key]}
                                                                </div>
                                                            )
                                                        }
                                                        )}
                                                    </div>
                                                )}
                                            </div> */}

                                            {currentStepWithErrors >= 0
                                                ? steps[currentStepWithErrors]
                                                : steps[currentStep]}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        // </Layout>
    );
};


export default PatientRegisterPage;