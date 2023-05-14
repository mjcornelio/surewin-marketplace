import React, { useState, useEffect } from "react";
import { Formik, Form, useFormikContext } from "formik";
import FormNavigation from "./FormNavigation";
import { Step, Stepper, StepLabel } from "@mui/material";

import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import Iconify from "src/components/Iconify";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#003A6B",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#003A6B",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  fontSize: "24px",
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundColor: "#003A6B",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundColor: "#003A6B",
  }),
}));

export const getFieldErrorNames = (formikErrors) => {
  const transformObjectToDotNotation = (obj, prefix = "", result = []) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (!value) return;

      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object") {
        transformObjectToDotNotation(value, nextKey, result);
      } else {
        result.push(nextKey);
      }
    });

    return result;
  };

  return transformObjectToDotNotation(formikErrors);
};

export const ScrollToFieldError = ({
  scrollBehavior = { behavior: "smooth", block: "center" },
}) => {
  const { submitCount, isValid, errors } = useFormikContext();

  useEffect(() => {
    if (isValid) return;

    const fieldErrorNames = getFieldErrorNames(errors);
    if (fieldErrorNames.length <= 0) return;

    const element = document.querySelector(
      `input[name='${fieldErrorNames[0]}']`
    );
    if (!element) return;

    // Scroll to first known error into view
    element.scrollIntoView(scrollBehavior);

    // Formik doesn't (yet) provide a callback for a client-failed submission,
    // thus why this is implemented through a hook that listens to changes on
    // the submit count.
  }, [submitCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

function MultiStepForm({ children, initialValues, onSubmit, type, lastbtn }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = React.Children.toArray(children);
  const [snapshot, setSnapshot] = useState(initialValues);

  const step = steps[activeStep];
  const totalSteps = steps.length;
  const isLastStep = activeStep === totalSteps - 1;

  const handleNext = (values) => {
    setSnapshot(values);
    setActiveStep(activeStep + 1);
  };
  const handlePrevious = (values) => {
    setSnapshot(values);
    setActiveStep(activeStep - 1);
  };
  const handleSubmit = async (values, actions) => {
    if (step.props.onSubmit) {
      await step.props.onSubmit(values);
    }
    if (isLastStep) {
      return onSubmit(values, actions);
    } else {
      actions.setTouched({});

      handleNext(values);
    }
  };
  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
    let icons = {};
    if (type === "tenants") {
      icons = {
        1: <Iconify icon="fluent:person-info-20-filled" />,
        2: <Iconify icon="clarity:contract-solid" />,
        3: <Iconify icon="akar-icons:check" />,
      };
    } else if (type === "users") {
      icons = {
        1: <Iconify icon="fluent:person-info-20-filled" />,
        2: <Iconify icon="clarity:contract-solid" />,
        3: <Iconify icon="akar-icons:check" />,
      };
    } else if (type === "units") {
      icons = {
        1: <Iconify icon="healthicons:market-stall" />,
      };
    } else if (type === "transaction") {
      icons = {
        1: <Iconify icon="icon-park-outline:transaction-order" />,
      };
    }

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  return (
    <div>
      <Formik
        initialValues={snapshot}
        onSubmit={handleSubmit}
        validationSchema={step.props.validationSchema}
      >
        {(formik) => (
          <Form>
            <ScrollToFieldError />
            <Stepper
              connector={<ColorlibConnector />}
              activeStep={activeStep}
              alternativeLabel
              style={{ padding: "20px 5px", marginBottom: "15px" }}
            >
              {steps.map((currentStep) => {
                const label = currentStep.props.stepName;

                return (
                  <Step key={label}>
                    <StepLabel StepIconComponent={ColorlibStepIcon}>
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {step}
            <FormNavigation
              isLastStep={isLastStep}
              hasPrevious={activeStep > 0}
              onBackClick={() => handlePrevious(formik.values)}
              lastbtn={lastbtn}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default MultiStepForm;

export const FormStep = ({ stepName = "", children, onSubmit }) => children;
