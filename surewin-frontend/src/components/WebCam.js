import { Button, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import Webcam from "react-webcam";
import useResponsive from "src/hooks/useResponsive";
import Iconify from "./Iconify";

export const WebcamCapture = ({
  setFile,
  setFileName,
  setImgSrc,
  setOpen,
  fileNameExt,
}) => {
  const [deviceId, setDeviceId] = React.useState({});
  const [devices, setDevices] = React.useState([]);

  const handleDevices = React.useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);
  const webcamRef = React.useRef(null);
  const [image, setImage] = useState("");
  const isDesktop = useResponsive("up", "md");
  const [device, setDevice] = useState(0);
  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    const base64 = await fetch(imageSrc);
    const blob = await base64.blob();
    setFile([
      new File([blob], `${Date.now()}-${fileNameExt}`, {
        type: "img/jpeg",
        lastModified: Date.now(),
      }),
    ]);
    setImgSrc(imageSrc);
    setFileName(`${Date.now()}-${fileNameExt}`);
  }, [webcamRef, setFile, setFileName, setImgSrc]);

  return devices.length > 0 ? (
    <div
      className="webcam-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        p: 2,
      }}
    >
      {image === "" ? (
        devices.length > 1 ? (
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{
                height: isDesktop ? 400 : "95vh",
                width: isDesktop ? 400 : "100%",
                objectFit: "cover",
              }}
              videoConstraints={{
                width: isDesktop ? 220 : "100%",
                height: isDesktop ? 200 : "100%",
                deviceId: devices[device].deviceId,
              }}
              mirrored
            />
            <IconButton
              aria-label="delete"
              onClick={() => (device === 0 ? setDevice(1) : setDevice(0))}
              sx={{
                position: "absolute",
                bottom: "70px",
                left: "45%",
                zIndex: 10,
                color: "white",
                fontSize: "2rem",
              }}
            >
              <Iconify icon="lucide:switch-camera" />
            </IconButton>
          </div>
        ) : (
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{
                height: isDesktop ? 400 : "95vh",
                width: isDesktop ? 400 : "100%",
                objectFit: "cover",
              }}
              videoConstraints={{
                width: isDesktop ? 220 : "100%",
                height: isDesktop ? 200 : "100%",
              }}
              mirrored
            />
          </div>
        )
      ) : (
        <img
          src={image}
          alt="capture"
          style={{
            height: isDesktop ? 400 : "95vh",
            width: isDesktop ? 400 : "100%",
            objectFit: "cover",
          }}
        />
      )}

      {image !== "" ? (
        <div style={{ display: "flex" }}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setImage("");
            }}
            variant="outlined"
            sx={{ my: isDesktop ? 2 : 0 }}
          >
            Retake
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
            variant="contained"
            sx={{ my: isDesktop ? 2 : 0 }}
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            capture();
          }}
          variant="contained"
          sx={{ my: isDesktop ? 2 : 0 }}
        >
          Capture
        </Button>
      )}
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <Typography variant="h5">
        <Iconify icon="ph:camera-slash-light" style={{ fontSize: "4rem" }} />
      </Typography>
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        No Camera Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 5, maxWidth: 400, mx: "auto" }}>
        Seems you dont have camera devices connected to your computer
      </Typography>
    </div>
  );
};
