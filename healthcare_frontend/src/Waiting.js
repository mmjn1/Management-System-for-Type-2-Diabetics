import React from "react";
import { InfinitySpin  } from  'react-loader-spinner'

// This component displays a loading spinner and a message while waiting for data to load.
export default function Waiting(props) {
    return (
        <div className="center-content">
            <InfinitySpin color="grey" />
            <div style={{ marginTop: 40 }}>{props.message}</div>
        </div>
    );
}
