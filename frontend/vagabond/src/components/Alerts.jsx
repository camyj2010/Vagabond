import React, { useEffect } from "react";
import { Alert, AlertTitle, Collapse } from "@mui/material";

export default function Alerts({
  openAlert,
  setOpenAlert,
  alertData: { alertMessage, alertSeverity },
}) {
	useEffect(() => {
		if (openAlert) {
			setTimeout(() => {
				setOpenAlert(false);
			}, 2000);
		}
		return () => {
			clearTimeout();
		};
	}
	, [openAlert,setOpenAlert]);
  return (
    <Collapse
      in={openAlert}
      sx={{
        position: "fixed",
        top: 10,
        left: 10,
        right: 10,
        zIndex: 9999,
      }}
    >
      <Alert
        severity={alertSeverity}
        onClose={() => setOpenAlert(false)}
        variant="outlined"
      >
        <AlertTitle>
          {alertSeverity === "success"
            ? "Success!"
            : alertSeverity === "error"
            ? "Error!"
            : alertSeverity === "warning"
            ? "Warning!"
            : alertSeverity === "info"
            ? "Info!"
            : ""}
        </AlertTitle>
        {alertMessage}
      </Alert>
    </Collapse>
  );
}
