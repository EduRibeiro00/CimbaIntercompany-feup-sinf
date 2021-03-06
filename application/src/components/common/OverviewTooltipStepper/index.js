import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    color: '#fff',
    width: 25,
    height: 25,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0em 2em 0em 2em',
    fontSize: 'small'
  },
  active: {
    backgroundColor: '#ff4000',
    border: '2px solid #22333b',
  },
  completed: {
    backgroundColor: '#ff4000',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

export default function OverviewTooltipStepper({ activeStp, steps }) {
  const classes = useColorlibStepIconStyles();
  const [activeStep] = React.useState(activeStp);

  return (

    <div className={clsx(classes.root)}>
      <Stepper alternativeLabel activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{<span className='tooltiplabel'>{label}</span>}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
