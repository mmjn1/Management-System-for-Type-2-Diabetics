import React from 'react';
import { Field } from 'formik';
import { RadioButton } from 'primereact/radiobutton';
import { Message } from 'primereact/message';


export const RadioGroup = ({ label, name, options, stacked, value, ...rest }) => {

    return (
        <div className=
            {' gap-2 py-2 px-3 '
                + (stacked ? '  d-flex justify-content-center flex-column ' : ' d-inline-block ')
                // if listRadioGroup then add do not add card class
                + (rest.addCardClass ? ' ' : ' card ')
                + (rest.error ? ' is-invalid' : '')
                + (rest.className ? ' ' + rest.className + ' ' : '')
            }>


            {
                label && (
                    <label htmlFor={name} className="form-label">
                        {label}
                        {rest.required ? <span className="text-danger 12"> *</span> : null}
                    </label>
                )
            }

            {
                // show error bllock if there is an error
                rest.headError ? (
                    <Message
                        severity='error'
                        text={rest.headError}
                        style={
                            {
                                // this style comes from the parent component
                                ...rest.headErrorStyle
                            }
                        }
                        icon='pi pi-exclamation-triangle'
                        className={
                            ' my-2 justify-content-sm-center justify-content-md-start'
                        }
                    />
                ) : null

            }

            <div
                className={
                    " flex flex-wrap gap-3 "
                    + (stacked ? ' d-flex' : ' d-inline-block')
                }

            >
                <Field name={name}>
                    {({ field }) => {
                        return options.map((option) => {
                            return (
                                // ignore the key which does not have a value
                                option.key && (

                                    <div key={option.key} className="d-flex items-center gap-2">
                                        {rest.error &&
                                            <div className="error">{rest.error}</div>
                                        }
                                        <RadioButton
                                            id={option.value}
                                            {...field}
                                            {...rest}
                                            value={option.value}
                                            onChange={rest.onChange}
                                            checked={value === option.value}
                                            error={rest.error}
                                            // if there is tab index then add it
                                            tabIndex={option.tabIndex ? option.tabIndex : null}
                                        />


                                        <label htmlFor={option.value}>{option.key}</label>

                                    </div>
                                )
                            );
                        });
                    }}
                </Field>
            </div>
        </div>
    );
};