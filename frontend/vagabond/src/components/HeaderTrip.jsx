import React from "react";
import { Typography } from "@mui/material";

//styles
import styles from "./HeaderTrip.module.css";

export default function HeaderTrip({mainPage}) {
  return (
    <div className={styles.menuDiv}>
      <div className={styles.backButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M15 6l-6 6l6 6" />
        </svg>
      </div>
      <div className={styles.texts}>
        <Typography
          textAlign="center"
          variant="h4"
          style={{ fontFamily: "Inter", fontWeight: 600 }}
        >
          Spain
        </Typography>
        <div className={styles.flag}>
          <img
            src="https://flagcdn.com/es.svg"
            // src={`https://flagcdn.com/${country_cod.toLowerCase()}.svg`}
            alt={"espain flag"}
          />
        </div>
				{mainPage ? 
				<svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.editIcon}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
          <path d="M16 5l3 3" />
        </svg> : <p></p>}
      </div>
        <Typography variant="body1" style={{ fontFamily: "Inter", fontWeight:500, paddingTop:10 }}>
          Barcelona {"23/7/2023"} - {"30/07/2023"}
        </Typography>

    </div>
  );
}
