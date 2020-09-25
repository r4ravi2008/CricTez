import { motion } from "framer-motion";
import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";

function TxToast(props) {
  const [show, setShow] = useState(true);
  const toggleShow = () => setShow(!show);

  const variantsUp = {
    initial: { opacity: 0, y: "-20" },
    final: { opacity: 1, y: 0, transition: { duration: 1, type: "tween" } },
  };

  return (
    <motion.div initial="initial" animate="final" variants={variantsUp}>
      <Toast
        show={show}
        onClose={toggleShow}
        animation={false}
        autohide={true}
        delay={10000}
      >
        <Toast.Body>{props.text}</Toast.Body>
      </Toast>
    </motion.div>
  );
}

export default TxToast;
