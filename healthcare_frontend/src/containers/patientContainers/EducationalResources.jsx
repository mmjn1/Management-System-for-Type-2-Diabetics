import React from 'react';

const EducationalResources = () => {
    return (
        <div className="home">
            <div className="homeContainer">
                <div className="content">
                    <div style={{ width: '100%' }}> 
                        <iframe 
                            title="NHS.UK Health A to Z widget" 
                            src="https://developer.api.nhs.uk/widgets/condition/?condition=/conditions/type-2-diabetes/&uid=125097d0-e17c-11ee-96db-59612fb32c36"                          
                            width="380%" 
                            height="900px" 
                            style={{ border: '1px solid #ccc' }}>
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EducationalResources;