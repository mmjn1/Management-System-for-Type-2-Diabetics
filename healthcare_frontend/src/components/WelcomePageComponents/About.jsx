import { Box, Container, styled, Typography } from "@mui/material";
import React from "react";
//import logoImg from "../media/logo.png";
//import starsImg from "../media/Star.png";
//import logosImg from "../media/logos.png";

const About = () => {
    const CustomContainer = styled(Container)(({ theme }) => ({
        display: "flex",
        justifyContent: "space-between",
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: theme.spacing(4),
        },
      }));


};

export default About;

// Give ChatGPT the code from the repo to give structure of the About us PAGE