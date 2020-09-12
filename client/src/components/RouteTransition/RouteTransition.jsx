import React from "react";
import { motion } from "framer-motion";

function RouteTransition(props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
    >
      {props.children}
    </motion.div>
  );
}

export default RouteTransition;
