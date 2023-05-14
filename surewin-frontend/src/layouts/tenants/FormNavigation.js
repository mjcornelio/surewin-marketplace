import { Button } from "@mui/material";
import React from "react";

function FormNavigation(props) {
  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "end" }}>
        {props.hasPrevious && (
          <Button
            variant="outlined"
            type="button"
            onClick={props.onBackClick}
            style={{
              marginRight: "10px",
              border: "2px solid #003A6B",
              color: "#000D6B",
              padding: "5px 40px",
            }}
          >
            Back
          </Button>
        )}
        <Button variant="contained" type="submit" size="large">
          {props.isLastStep ? props.lastbtn : "Next"}
        </Button>
      </div>
    </div>
  );
}

export default FormNavigation;
