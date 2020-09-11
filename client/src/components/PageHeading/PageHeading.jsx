import React from "react";
import "./PageHeading.css";
import { motion } from "framer-motion";

function PageHeading({ text }) {
  return (
    <div className="page-heading-container">
      <br />
      <h4 className="page-heading">{text.split(" ")[0]}</h4>
      <h1 className="page-subheading">{text.split(" ")[1]}</h1>
      <br />
      <hr />
      <br />
    </div>
  );
}

export default PageHeading;
