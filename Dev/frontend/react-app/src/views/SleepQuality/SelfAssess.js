import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import axios from 'axios';
import './SelfAssess.css';
import e1 from '../../images/SQ/SQ_SA_e1.png';
import e2 from '../../images/SQ/SQ_SA_e2.png';
import e3 from '../../images/SQ/SQ_SA_e3.png';
import { useNavigate } from 'react-router-dom';
import SleepQualityGauge from './SleepQualityComponent';
// import Exp from '../../images/SQ/SQ_SA_Exp.jpg';
import Exp1 from '../../images/SQ/SQ_SA_Exp_1.png';
import Exp2 from '../../images/SQ/SQ_SA_Exp_2.png';

const SelfAssess = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [stressLevel, setStressLevel] = useState('');
  const [sleepDuration, setSleepDuration] = useState('');
  const [sleepStartTime, setSleepStartTime] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [updateKey, setUpdateKey] = useState(0);

  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setter(value);
    }
  };

  const handleSleepDurationChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 24)) {
      setSleepDuration(value);
    }
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 150)) {
      setAge(value);
    }
  };

  const handleAssess = async () => {
    if (!sleepDuration || !sleepStartTime) {
      setError('Please enter sleep duration and start time');
      return;
    }
    setError('');

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const day = yesterday.getDay() === 0 ? 7 : yesterday.getDay();

    let start = '0000';
    if (sleepStartTime) {
      const [hours, minutes] = sleepStartTime.split(':');
      start = hours.padStart(2, '0') + minutes.padStart(2, '0');
    }

    let params = new URLSearchParams({
      days: `[${day}]`,
      start: `[${start}]`,
      durations: `[${parseFloat(sleepDuration)}]`,
    });

    if (age) params.append('age', age);
    if (stressLevel) params.append('stress_levels', `[${stressLevel}]`);
    if (heartRate) params.append('heart_rates', `[${heartRate}]`);

    try {
      const response = await axios.get(`https://link2herresilience.com.au/sleep_quality/v1.1/analyse?${params.toString()}`);
      setResult(response.data);
      setUpdateKey(prevKey => prevKey + 1);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while analyzing. Please try again.');
      setResult(null);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    console.log('Rendering result:', result);
    console.log('Threshold Low:', result.threshold_low);
    console.log('Threshold High:', result.threshold_high);
    console.log('Overall Quality Mean:', result.overall_quality_mean);
    console.log('Overall Quality:', result.overall_quality);

    const qualityData = result.quality_category[0].quality;
    let qualityColor;
    switch (qualityData.category) {
      case 'GOOD':
        qualityColor = '#4CAF50';
        break;
      case 'NORMAL':
        qualityColor = '#FFC107';
        break;
      case 'BAD':
        qualityColor = '#F44336';
        break;
      default:
        qualityColor = 'black';
    }

    return (
      <div className="result-container">
        <h3>Sleep Quality Analysis Result:</h3>
        <div className="gauge-container">
          <SleepQualityGauge 
            key={updateKey}
            overallQualityMean={result.overall_quality_mean}
            thresholdLow={result.threshold_low}
            thresholdHigh={result.threshold_high}
            category={result.overall_quality}
          />
        </div>
        <p>Quality Category: <span style={{color: qualityColor, fontWeight: 'bold'}}>{qualityData.category}</span></p>
        <p>Ratio in Sample Population: {(qualityData.fraction * 100).toFixed(3)}%</p>
        <p>Suggestion: {qualityData.suggestion}</p>
      </div>
    );
  };

  useEffect(() => {
    const isValid = 
      (!age || (parseInt(age) >= 0 && parseInt(age) <= 150)) &&
      (!stressLevel || (parseInt(stressLevel) >= 0 && parseInt(stressLevel) <= 10)) &&
      (!heartRate || (parseInt(heartRate) >= 40 && parseInt(heartRate) <= 140)) &&
      sleepDuration &&
      sleepStartTime;

    const assessButton = document.querySelector('.assess-button');
    if (assessButton) {
      assessButton.disabled = !isValid;
    }
  }, [age, stressLevel, heartRate, sleepDuration, sleepStartTime]);

  const handleGoBack = () => {
    navigate('/sleep-quality');
  };

  return (
    <div className="self-assess-container">
      <h1 className="title">SLEEP QUALITY</h1>
      <div className="info-cards">
        <div className="info-card">
          <img src={e1} alt="Stress Level" />
          <h3>Stress Level</h3>
          <p>Reduced stress levels aids in improving health which is inversely related with sleep quality</p>
        </div>

        <div className="info-card">
          <img src={e2} alt="Stress Level" />
          <h3>Heart Rate</h3>
          <p>Resting heart rate of 70-72 bpm (beats per minute) assists in better sleep</p>
        </div>

        <div className="info-card">
            <img src={e3} alt="Stress Level" />
            <h3>Enough Sleep</h3>
          <p>Sufficient sleep supports cognitive function, emotional well-being, and immune system function.</p>
        </div>
      </div>

      <h2 className="SA_subtitle">SELF ASSESS YOURS</h2>
      <div className="form-container">
        <div className="form-row">
          <label>
            Past night Sleep duration (hours)
            <input 
              type="number" 
              step="0.1" 
              min="0" 
              max="24"
              value={sleepDuration} 
              onChange={handleSleepDurationChange}
              required 
            />
          </label>
          <label>
            Past night Sleep Start Time (click clock)
            <input 
              type="time" 
              value={sleepStartTime} 
              onChange={(e) => setSleepStartTime(e.target.value)}
              required 
            />
          </label>
        </div>
        <h4 className="optional-inputs-title">Optional inputs</h4>
        <div className="form-row">
          <label>
            Age (0-150)
            <input 
              type="number" 
              min="0" 
              max="150" 
              value={age} 
              onChange={handleAgeChange}
            />
          </label>
          <label>
            Stress level (0-10)
            <input 
              type="number" 
              min="0" 
              max="10" 
              value={stressLevel} 
              onChange={handleInputChange(setStressLevel)}
            />
          </label>
          <label>
            Heart rate (40-140)
            <input 
              type="number" 
              min="40" 
              max="140" 
              value={heartRate} 
              onChange={handleInputChange(setHeartRate)}
            />
          </label>
        </div>

        <button onClick={handleAssess} className="assess-button" disabled={!sleepDuration || !sleepStartTime}>Assess</button>
        {error && <p className="error">{error}</p>}
        {renderResult()}
      </div>

      <Button 
        className='size-btn' 
        type="link" 
        onClick={showModal}
        style={{ 
          background: 'none', 
          padding: 0,
          fontSize: '30px',
          marginLeft: '40px',
          display: 'inline-block'
        }}
      >
        Know about data
      </Button>
      <Modal 
        title={<div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '30px' }}>Effects of poor Sleep Quality</div>}
        open={isModalOpen} 
        onCancel={handleCancel}
        width={900}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        footer={null}
        closable={true}
      >
        <p style={{fontWeight: 'bold'}}>Source: Australian Institute of Health & Welfare (AIHW)</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <img src={Exp1} alt="Sleep Quality Effects 1" style={{ width: '49%', height: 'auto' }} />
          <img src={Exp2} alt="Sleep Quality Effects 2" style={{ width: '49%', height: 'auto' }} />
        </div>
      </Modal>

      <button 
        onClick={handleGoBack}
        className="SA-back-button"
      >
        back
      </button>
    </div>
  );
};

export default SelfAssess;