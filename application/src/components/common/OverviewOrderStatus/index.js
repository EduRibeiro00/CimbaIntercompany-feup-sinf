import LightTooltip from 'components/common/Tooltip';
import OverviewTooltipStepper from 'components/common/OverviewTooltipStepper';
import React from 'react';

import './styles.scss';

function getSteps() {
  return {
    sale: ['Order', 'Transp.', 'Invoice', 'Receipt',], 
    purchase: ['Order', 'Transp.', 'Invoice', 'Payment'],
    return_sale: ['Order', 'Transp', 'Credit Note'],
    return_purchase: ['Order', 'Transp', 'Credit Note']
  };
}

const OverviewOrderStatus = ({ row }) => {

  const colorFromStatus = {
    0: '#052423',
    1: '#0B5351',
    2: '#00A9A5',
    3: '#4E8098',
    4: '#90C2E7',
  }

  const style = {
    opacity: 1,
    color: colorFromStatus[row.state],
  }
  return (
    <div className='overviewStatusCell'>
      <LightTooltip
        title={
          <React.Fragment>
            <OverviewTooltipStepper activeStp={row.state} type={row.type} steps={getSteps()[row.type]}/>
          </React.Fragment>
        }
        placement="top"
      >
        <div className='overviewStatusCellContent'>
          <i style={style} className="overviewStatusIcon fas fa-circle"></i>
          <p>{getSteps()[row.type][row.state]}</p>
        </div>

      </LightTooltip>
    </div>);
}

export default OverviewOrderStatus;