import bg from './images/bg40.png'
import srh from './images/srh.png'
import STI from './images/STI.png'
import '../../style.less'
import './triage.less'

const SE_Main_Triage = (props) => {
  return (
    <div className="main-page img" style={{ backgroundImage: 'url(' + bg + ')' }}>
      <header>
        <h1 className="page-title">
          We Offer two modules focusing on Sexual and Reproductive Health for Migrant Women and STI Prevention and Health Awareness
        </h1>
      </header>
      <ul className='flex-box'>
        <li className='li'>
          <div className='main-card'>
            <img src={srh} alt="Sexual and Reproductive Health" />
            <span className='main-card-tit'>This module covers:</span>
            <ul className='description-list'>
              <li>Reproductive Rights in Australia</li>
              <li>Family Planning Options</li>
              <li>Consent and Healthy Relationships</li>
            </ul>
          </div>
          <button onClick={() => { props.actType(2) }} className='main-btn'>Start</button>
        </li>
        <li className='li'>
          <div className='main-card'>
            <img src={STI} alt="STI Prevention and Health Awareness" />
            <span className='main-card-tit'>This module covers:</span>
            <ul className='description-list'>
              <li>Common STIs in Australia</li>
              <li>Prevention Tips</li>
              <li>Healthcare Resources for Migrant Women</li>
            </ul>
          </div>
          <button onClick={() => { props.actType(9) }} className='main-btn'>Start</button>
        </li>
      </ul>
    </div>
  );
}

export default SE_Main_Triage;