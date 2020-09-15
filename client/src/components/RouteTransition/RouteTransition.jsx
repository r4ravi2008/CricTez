import { motion } from "framer-motion";
import React from "react";

function RouteTransition(props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, type: "tween" }}
    >
      {props.children}
    </motion.div>
  );
}

export default RouteTransition;
