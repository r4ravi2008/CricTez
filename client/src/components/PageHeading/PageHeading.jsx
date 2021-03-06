import { motion } from "framer-motion";
import React from "react";
import "./PageHeading.css";

function PageHeading({ text, children }) {
  const variantsUp = {
    initial: { opacity: 0, y: "-100%" },
    final: { opacity: 1, y: 0, transition: { duration: 0.5, type: "tween" } },
  };
  const variantsDown = {
    initial: { opacity: 0, y: "100%" },
    final: { opacity: 1, y: 0, transition: { duration: 0.5, type: "tween" } },
  };
  return (
    <div className="page-heading-container">
      <br />
      <div style={{ overflow: "hidden", height: "3.2rem" }}>
        <motion.h4
          className="page-heading"
          initial="initial"
          animate="final"
          variants={variantsDown}
        >
          {text.split(" ")[0]}
        </motion.h4>
      </div>
      <div style={{ overflow: "hidden", height: "2.2rem" }}>
        <motion.h1
          className="page-subheading"
          initial="initial"
          animate="final"
          variants={variantsUp}
        >
          {text.split(" ")[1]}
        </motion.h1>
      </div>
      <br />
      {children}
      <hr />
      <br />
    </div>
  );
}

export default PageHeading;
