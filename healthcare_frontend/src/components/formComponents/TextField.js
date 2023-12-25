import React, { useMemo, useState, useEffect, useRef } from "react";

import PropTypes from 'prop-types';


import { ErrorMessage, useField, useFormikContext } from "formik";

import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from "primereact/inputtextarea";
import { Tooltip } from 'primereact/tooltip';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from 'primereact/dropdown';

import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';


import 'react-phone-number-input/style.css'

import { Calendar } from 'primereact/calendar';
import { classNames } from "primereact/utils";



import PhoneInput from 'react-phone-number-input';
// import FileUploaderCustomComponent from "./FileUploaderCustomComponent";


export const TextField = ({
    label,
    currentSubmitCount,
    submitCount,

    showTooltip,
    tooltipText,
    tooltipPosition,
    tooltipTarget,


    ...props
}
) => {


    const { setFieldError } = useFormikContext();


    const [field, meta] = useField(props);

    const backendError = props.error ? props.error[0] : '';

    const frontendError = meta.error ? meta.error : '';


    const error = frontendError || backendError;

    const showError = (currentSubmitCount > 0 && error);


    const [phoneNumber, setPhoneNumber] = useState('');

    const handlePhoneNumberChange = (value) => {
        props.onChange(value);
        setPhoneNumber(value);
    };

    // console.log('props', error);
    // console.log('meta', meta);
    // console.log('backendError', backendError);
    // console.log('frontendError', frontendError);

    // console.log("((error && meta.touched) || showError)", ((error && meta.touched) || showError));




    return (
        <div className={
            "mb-3 "
            + (props.className ? ' ' + props.className + ' ' : '')
        }>

            {
                showTooltip && (

                    <Tooltip
                        target={`.${tooltipTarget}`}
                        position={tooltipPosition}
                    >
                        {tooltipText}
                    </Tooltip>
                )
            }
            {
                label && (
                    <label htmlFor={field.name} className="form-label">
                        {label}

                        {
                            (props.required && props.showLabelRequired) === false ? null :
                                <span className="text-danger"> *</span>
                        }

                        {/* 
                    )
                } */}
                    </label>
                )
            }

            {/* 
            // show normal input field if type is not textarea 
            * Normal input field
            */}
            {
                // show if the type is not textarea
                props.type !== 'textarea' &&
                props.type !== 'phone_number' &&
                props.type !== 'date' &&
                !props.IsCurrency &&
                !props.IsDropDownWithTextArea &&
                props.type !== 'file' &&

                (
                    <input
                        className={
                            `form-control ${field.name}  
                            ${((error && meta.touched) || showError) ? "is-invalid" : ""}  
                             ${(props.inputCustomClass) ? props.inputCustomClass : ""}`
                        }
                        {...field}
                        {...props}
                        autoComplete="off"
                        placeholder={
                            (props.placeholder) ?
                                props.placeholder :
                                `Enter ${label}`
                        }
                        maxLength={props.maxLength}
                        style={
                            {
                                fontSize: "1rem",
                                padding: "0.75rem 0.75rem",

                            }
                        }
                        min={props.min}
                        max={props.max}
                    />
                )
            }

            {/* 
            // show if the type is textarea 
            * Text area input field
            */}
            {
                // multi-line text field
                props.type === 'textarea' &&
                (
                    <InputTextarea
                        className={
                            `form-control 
                            ${((error && meta.touched) || showError) ? "is-invalid " : ""}
                            ${(props.inputCustomClass) ? props.inputCustomClass : ""}`
                        }
                        autoResize={true}
                        placeholder={`Enter ${label}`}
                        autoComplete="off"
                        {...field}
                        {...props}
                        style={
                            {
                                fontSize: "1rem",
                                padding: "0.75rem 0.75rem",
                            }
                        }
                        rows={props.rows ? props.rows : 3}
                        cols={props.cols ? props.cols : 30}
                    />

                )
            }


            {/* 
            // this is for phone number 
            * Phone number input field
            */}
            {
                // show if the type is phone_number
                props.type === 'phone_number' &&
                (
                    <>
                        <PhoneInput
                            className={
                                `  
                                ${((error && meta.touched) || showError) ? "is-invalid" : ""
                                }`
                            }
                            placeholder="Enter phone number"
                            {...field}
                            // value={props.value}
                            {...props}
                            type="tel"
                            defaultCountry="GB"
                            international
                            // give prime react text field a name
                            inputComponent={
                                InputText
                            }
                            numberInputProps={
                                {
                                    className: `form-control  ${((error && meta.touched) || showError) ? "is-invalid" : ""
                                        }`,
                                    style: {
                                        fontSize: "1rem",
                                        padding: "0.75rem 0.75rem",
                                    }
                                }
                            }

                            onChange={
                                (e) => {
                                    console.log("e", e);
                                    props.setFieldValue(props.name, e);
                                    props.onChange(e);
                                }
                            }

                            // show country flag on disabled input field
                            disabled={props.disabled}


                        />
                        {/* <InputMask
                            className={`form-control  ${((error && meta.touched) || showError) ? "is-invalid" : ""
                                }`}
                            {...field}
                            {...props}
                            type="tel"
                            autoComplete="off"
                            placeholder={"(999) 999-9999"}
                            style={
                                {
                                    fontSize: "1rem",
                                    padding: "0.75rem 0.75rem",
                                }
                            }
                            mask="(999) 999-9999"
                            max={14}
                            maxLength={14}
                            min={10}
                            minLength={10}
                        /> */}
                    </>
                )

            }


            {/* 
            // date fields  
            * Date input field
            */}
            {
                props.type === 'date' &&
                (

                    <Calendar
                        id={props.name}
                        {...field}
                        {...props}
                        inputClassName='form-control '
                        className={
                            "w-100 "
                            +
                            (error ? ' is-invalid p-invalid ' : '')

                        }
                        // allow user to enter date in mm/yy and also dd/mm/yyyy    
                        // dynamically set the view to month/year based on the length of the date string
                        dateFormat={
                            props.dateFormate === 'date' ? 'dd/mm/yy' :
                                props.dateFormate === 'month' ? 'mm/yy' :
                                    props.dateFormate === 'year' ? 'yy' : 'dd/mm/yy'
                        }
                        // onViewDateChange={(e) => setView(e.view)}
                        // value={props.value}
                        showButtonBar={props.showDateCalendarButtonBar}
                        clearButtonClassName='btn btn-danger text-danger'
                        showTime={false}
                        showIcon={props.showCalendarIcon}
                        icon={
                            classNames('pi', 'pi-calendar', {
                                // if errror show red icon with minus sign and bg-white
                                'pi-calendar-minus text-white': error
                            })
                        }
                        // chnage bg of icon
                        view={props.dateFormate}
                        // transitionOptions={{ name: 'slide', params: { direction: 'left' } }}
                        monthNavigator
                        yearNavigator
                        yearRange="2023:2030"
                        placeholder={`Enter ${label}`}
                        // set min date today
                        minDate={new Date()}
                        required={props.required}

                    // onBlur={
                    //     (e) => {
                    //         const enteredValue = e.target.value.trim();

                    //         if (!enteredValue) {
                    //             setValue(null);
                    //             props.setFieldValue(field.name, null);
                    //         }

                    //         props.onBlur && props.onBlur(e);

                    //     }
                    // }
                    // onChange={(e) => {
                    //     if (e.value === null) {
                    //         props.setFieldValue(props.name, null);
                    //         return;
                    //     }

                    //     let date = e.value;
                    //     // if (!date) {
                    //     //     date = new Date();
                    //     // }

                    //     if (e.view === "month") {
                    //         date.setMonth(e.value.getMonth());
                    //         setView("year");
                    //     } else if (e.view === "year") {
                    //         date.setFullYear(e.value.getFullYear());
                    //         setView("month");
                    //     }

                    //     props.setFieldValue(props.name, date);
                    // }}
                    />
                )

            }


            {/* 
            // this is for currency 
            * Currency input field
            */}
            {
                props.IsCurrency &&
                (
                    <InputNumber
                        inputClassName={` form-control ${((error && meta.touched) || showError) ? "is-invalid" : ""
                            }`}
                        className={` w-100 ${((error && meta.touched) || showError) ? "is-invalid" : ""
                            }`}
                        {...field}
                        {...props}
                        // type="number"
                        autoComplete="off"
                        placeholder={
                            (props.placeholder)
                                ? props.placeholder
                                :
                                `Enter ${label}`
                        }
                        inputStyle={
                            {
                                fontSize: "1rem",
                                padding: "0.75rem 0.75rem",
                            }
                        }
                        onValueChange={
                            (e) => {
                                props.onValueChange(e);
                            }
                        }

                        mode={
                            props.IsCurrency ? "currency" : "decimal"
                        }
                        currency="GBP"
                        locale="en-GB"
                    />
                )
            }


            {/*
            // this is for dropdown
            * Dropdown input field
            */}

            {
                props.IsDropDownWithTextArea &&
                (
                    <>
                        <Dropdown
                            value={props.value}
                            options={props.options}
                            showClear
                            placeholder={
                                (props.placeholder)
                                    ? props.placeholder
                                    :
                                    `Select ${label}`
                            }
                            className={` w-100 ${((error && meta.touched) || showError) ? "p-invalid" : ""
                                }`}
                            /**
                            * optionLabel is used to choose the property of the object to be displayed as the label
                             */
                            optionLabel={
                                props.optionLabel
                            }
                            dropdownIcon={
                                classNames('pi', 'pi-chevron-down', {
                                    // if errror show red icon with minus sign and bg-white
                                    'pi-chevron-down-minus text-danger': (error && meta.touched) || showError
                                })
                            }
                            readOnly={props.readOnly}
                            {...field}
                            {...props}
                            required={props.required}
                        />

                    </>
                )
            }

            {/*
            // this is for File Upload
            * File Upload input field
            */}
            {
                props.type === 'file' &&
                (
                    <>

                        {/* <FileUpload
                        name={props.name}
                        className={` w-100 ${((error && meta.touched) || showError) ? "p-invalid" : ""
                            }`}
                        url={'/api/upload'}
                        multiple accept="image/*"
                        maxFileSize={1000000}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} /> */}

                        {/* <FileUploaderCustomComponent
                            name={props.name}
                            className={` w-100 ${((error && meta.touched) || showError) ? "p-invalid" : ""
                                }`}

                            multipleFileAllowed={props.multipleFileAllowed}

                            url={props.url}

                            fileTypes={props.fileTypes}

                            maxFileSize={props.maxFileSize}

                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}

                            {...field}
                            {...props}
                        /> */}

                    </>



                )

            }


            {/* <input
                        className={`form-control  ${((error && meta.touched) || showError) ? "is-invalid" : ""
                            }`}
                        {...field}
                        {...props}
                        autoComplete="off"
                        placeholder={`Enter ${label}`}
                        style={
                            {
                                fontSize: "1rem",
                                padding: "0.75rem 0.75rem",

                            }

                        }
                    /> */}

            {/* show the error message if showError is true */}
            {
                showError && (
                    <span name={field.name} className="text-danger" style={{ fontSize: "0.8rem" }}>
                        {error}
                    </span>
                )
            }

            {/* show the error message if meta.touched is true */}
            {
                meta.touched && error && !showError ? (
                    <span
                        name={field.name}
                        className="text-danger"
                        style={{ fontSize: "0.8rem" }}
                    >

                        {error}
                    </span>
                ) : null
            }
        </div>
    );
}