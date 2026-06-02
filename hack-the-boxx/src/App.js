import React, { useState } from 'react';
import './App.css';

function App() {
  const [machines, setMachines] = useState([
    { id: 1, name: 'LegacyOS', ip: '10.10.10.15', difficulty: 'Easy', points: 20, os: 'Windows', status: 'Stopped', realFlag: 'HTB{ms08_067_is_classic}', desc: 'An outdated Windows server running vulnerable SMB services. Perfect for testing remote code execution handshakes.' },
    { id: 2, name: 'InjectPHP', ip: '10.10.10.42', difficulty: 'Medium', points: 40, os: 'Linux', status: 'Stopped', realFlag: 'HTB{rce_via_user_agent_header}', desc: 'A custom Linux web stack demonstrating a broken input filter on user-agent logs, leading to immediate shell access.' },
    { id: 3, name: 'CapLog', ip: '10.10.10.89', difficulty: 'Hard', points: 80, os: 'Linux', status: 'Stopped', realFlag: 'HTB{log4j_unauthenticated_root}', desc: 'Enterprise Java logging platform prone to unauthenticated JNDI lookups. High difficulty privilege escalation required.' },
  ]);

  const [activeTab, setActiveTab] = useState(1);
  const [userPoints, setUserPoints] = useState(120); 
  const [inputs, setInputs] = useState({}); 
  const [systemMessage, setSystemMessage] = useState('');

  // Track captured status to feed our new progress engine dynamically
  const [capturedMachines, setCapturedMachines] = useState([]);

  const [leaderboard] = useState([
    { rank: 1, handle: '0xAlpha', score: 340, tier: 'Omniscient' },
    { rank: 2, handle: 'NullPointer', score: 280, tier: 'Elite' },
    { rank: 3, handle: 'RootKit_Ken', score: 220, tier: 'Pro' },
    { rank: 4, handle: 'NetSpy', score: 140, tier: 'Hacker' },
  ]);

  const toggleMachine = (id) => {
    setMachines(machines.map(m => {
      if (m.id === id) {
        const isStopping = m.status === 'Running';
        return { ...m, status: isStopping ? 'Stopped' : 'Running' };
      }
      return m;
    }));
  };

  const handleInputChange = (machineId, value) => {
    setInputs({ ...inputs, [machineId]: value });
  };

  const verifyFlag = (machine, e) => {
    e.preventDefault();
    const userGuess = inputs[machine.id] || '';

    if (machine.status !== 'Running') {
      setSystemMessage(`[ERROR] Machine ${machine.name} is offline. Spawn it first.`);
      return;
    }

    if (capturedMachines.includes(machine.id)) {
      setSystemMessage(`[INFO] Flag already submitted for ${machine.name}. Matrix matrix point allocations finalized.`);
      return;
    }

    if (userGuess.trim() === machine.realFlag) {
      setUserPoints(prev => prev + machine.points);
      setCapturedMachines([...capturedMachines, machine.id]);
      setSystemMessage(`[SUCCESS] Flag captured for ${machine.name}! +${machine.points} pts added.`);
      setInputs({ ...inputs, [machine.id]: '' });
    } else {
      setSystemMessage(`[INVALID] Access Denied. Incorrect flag sequence for ${machine.name}.`);
    }
  };

  const currentSelectedMachine = machines.find(m => m.id === activeTab);
  
  // Dynamic stats calculation
  const completionPercentage = Math.round((capturedMachines.length / machines.length) * 100);

  return (
    <div style={{ backgroundColor: '#0f0f12', color: '#fff', minHeight: '100vh', fontFamily: 'monospace', padding: '25px' }}>
      
      {/* Platform Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '15px', marginBottom: '25px' }}>
        <div>
          <h1 style={{ color: '#9fe52a', margin: 0 }}>CYBER-RANGE // LABS</h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>Gamified Virtual Vulnerability Assessment Portal</p>
        </div>
        <div style={{ textAlign: 'right', alignSelf: 'center', backgroundColor: '#141419', padding: '10px 20px', borderRadius: '4px', border: '1px solid #222' }}>
          <span style={{ color: '#aaa' }}>CURRENT RANK: </span>
          <span style={{ color: '#9fe52a', fontWeight: 'bold' }}>{userPoints >= 200 ? 'Omniscient Elite' : userPoints >= 140 ? 'Pro Hacker' : 'Script Kiddie'}</span>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>Score: {userPoints} pts</div>
        </div>
      </header>

      {/* Status Banner */}
      {systemMessage && (
        <div style={{ backgroundColor: systemMessage.includes('[SUCCESS]') ? '#0b2612' : '#260b0b', color: systemMessage.includes('[SUCCESS]') ? '#9fe52a' : '#ff4444', padding: '12px', borderRadius: '4px', marginBottom: '25px', border: '1px solid #333' }}>
          {systemMessage}
        </div>
      )}

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '25px', alignItems: 'start' }}>
        
        {/* Left Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Machine Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {machines.map((machine) => (
              <div 
                key={machine.id} 
                onClick={() => setActiveTab(machine.id)}
                style={{ 
                  backgroundColor: '#141419', padding: '20px', borderRadius: '6px', 
                  border: activeTab === machine.id ? '1px solid #9fe52a' : '1px solid #222',
                  cursor: 'pointer', position: 'relative'
                }}
              >
                {capturedMachines.includes(machine.id) && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#0b2612', color: '#9fe52a', border: '1px solid #9fe52a', fontSize: '10px', padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold' }}>
                    PWNED
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '18px', color: '#fff', paddingRight: '50px' }}>{machine.name}</h2>
                  {!capturedMachines.includes(machine.id) && (
                    <span style={{ color: machine.difficulty === 'Hard' ? '#ff4444' : machine.difficulty === 'Medium' ? '#ffbb00' : '#9fe52a', fontSize: '11px' }}>
                      [{machine.difficulty}]
                    </span>
                  )}
                </div>
                <p style={{ color: '#666', margin: '0 0 15px 0', fontSize: '12px' }}>OS: {machine.os} | {machine.points} Pts</p>

                <div style={{ backgroundColor: '#0f0f12', padding: '8px', borderRadius: '4px', marginBottom: '12px', fontSize: '12px' }}>
                  Status: <span style={{ color: machine.status === 'Running' ? '#9fe52a' : '#666', fontWeight: 'bold' }}>{machine.status}</span>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); toggleMachine(machine.id); }} 
                  style={{ width: '100%', backgroundColor: machine.status === 'Running' ? '#ff4444' : '#222', color: machine.status === 'Running' ? '#000' : '#9fe52a', border: '1px solid #9fe52a', padding: '8px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace', marginBottom: '12px' }}
                >
                  {machine.status === 'Running' ? 'Terminate Box' : 'Spawn Instance'}
                </button>

                <form onSubmit={(e) => verifyFlag(machine, e)} style={{ display: 'flex', gap: '5px' }}>
                  <input 
                    type="text" placeholder={capturedMachines.includes(machine.id) ? "Machine Pwned!" : "Submit Flag..."}
                    disabled={capturedMachines.includes(machine.id)}
                    value={inputs[machine.id] || ''}
                    onChange={(e) => handleInputChange(machine.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ flex: 2, backgroundColor: '#0f0f12', border: '1px solid #333', padding: '8px', color: '#fff', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <button type="submit" disabled={capturedMachines.includes(machine.id)} onClick={(e) => e.stopPropagation()} style={{ flex: 1, backgroundColor: '#9fe52a', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace', opacity: capturedMachines.includes(machine.id) ? 0.5 : 1 }}>
                    Send
                  </button>
                </form>
              </div>
            ))}
          </div>

          {/* Challenge Briefing Panel */}
          <div style={{ backgroundColor: '#141419', padding: '25px', borderRadius: '6px', border: '1px solid #222' }}>
            <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#9fe52a' }}>📋 Challenge Briefing: {currentSelectedMachine.name}</h2>
              <span style={{ color: '#666', fontSize: '12px' }}>Target Index ID: 0x0{currentSelectedMachine.id}</span>
            </div>
            
            <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '14px' }}>{currentSelectedMachine.desc}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div style={{ backgroundColor: '#0f0f12', padding: '15px', borderRadius: '4px', border: '1px solid #222' }}>
                <h4 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '13px' }}>🛠️ Suggested Attack Vectors</h4>
                <ul style={{ paddingLeft: '18px', margin: 0, color: '#888', fontSize: '12px', lineHeight: '1.8' }}>
                  <li>Execute reconnaissance scan using `nmap -sV -sC {currentSelectedMachine.status === 'Running' ? currentSelectedMachine.ip : '[IP_ADDR]'}`</li>
                  <li>Verify configuration states within private testing subnets.</li>
                <li>Identify standard service version handshakes.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#0f0f12', padding: '15px', borderRadius: '4px', border: '1px solid #222' }}>
                <h4 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '13px' }}>⚖️ Lab Assessment Compliance</h4>
                <p style={{ margin: 0, color: '#888', fontSize: '12px', lineHeight: '1.6' }}>
                  All network assessments inside this sandbox environment strictly mirror structured operational authorization frameworks. Ensure configurations comply safely within sandboxed host boundaries.
                </p>
              </div>
            </div>
          </div>

          {/* NEW MODULE: User Profile Progression & Badges */}
          <div style={{ backgroundColor: '#141419', padding: '25px', borderRadius: '6px', border: '1px solid #222' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>📊 Operator Profile Tracker</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'center' }}>
              {/* Progress Bar Display */}
              <div style={{ borderRight: '1px solid #222', paddingRight: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>LAB COMPLETION MATRIX</span>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#9fe52a' }}>{completionPercentage}%</div>
                <div style={{ width: '100%', backgroundColor: '#0f0f12', height: '8px', borderRadius: '4px', marginTop: '10px', overflow: 'hidden', border: '1px solid #222' }}>
                  <div style={{ width: `${completionPercentage}%`, backgroundColor: '#9fe52a', height: '100%', transition: 'width 0.4s ease' }} />
                </div>
              </div>

              {/* Achievement Badges Row */}
              <div>
                <span style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>✨ UNLOCKED RECONNAISSANCE COMMENDATIONS</span>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ backgroundColor: '#0f0f12', padding: '10px 15px', borderRadius: '4px', border: '1px solid #222', opacity: userPoints >= 120 ? 1 : 0.25, textAlign: 'center' }}>
                    <div style={{ fontSize: '18px' }}>⚡</div>
                    <div style={{ fontSize: '10px', color: '#9fe52a', fontWeight: 'bold', marginTop: '3px' }}>INITIAL ACCESS</div>
                  </div>
                  <div style={{ backgroundColor: '#0f0f12', padding: '10px 15px', borderRadius: '4px', border: '1px solid #222', opacity: capturedMachines.length >= 2 ? 1 : 0.25, textAlign: 'center' }}>
                    <div style={{ fontSize: '18px' }}>💀</div>
                    <div style={{ fontSize: '10px', color: '#ffbb00', fontWeight: 'bold', marginTop: '3px' }}>DOUBLE TAP</div>
                  </div>
                  <div style={{ backgroundColor: '#0f0f12', padding: '10px 15px', borderRadius: '4px', border: '1px solid #222', opacity: capturedMachines.includes(3) ? 1 : 0.25, textAlign: 'center' }}>
                    <div style={{ fontSize: '18px' }}>👑</div>
                    <div style={{ fontSize: '10px', color: '#ff4444', fontWeight: 'bold', marginTop: '3px' }}>ROOT COMPLIANT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Section: Sidebar Components */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Global Leaderboard */}
          <div style={{ backgroundColor: '#141419', padding: '20px', borderRadius: '6px', border: '1px solid #222' }}>
            <h3 style={{ color: '#9fe52a', margin: '0 0 15px 0', fontSize: '14px', textTransform: 'uppercase', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
              🏆 Global Rankings
            </h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '13px', lineHeight: '2' }}>
              {leaderboard.map((player) => (
                <li key={player.rank} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1c1c24', padding: '6px 0' }}>
                  <span style={{ color: '#aaa' }}>
                    <span style={{ color: player.rank <= 2 ? '#ffbb00' : '#666', marginRight: '8px' }}>#{player.rank}</span>
                    {player.handle}
                  </span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{player.score} pts</span>
                </li>
              ))}
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 6px 0', borderTop: '1px dashed #444', color: '#9fe52a', fontWeight: 'bold' }}>
                <span>You (Local)</span>
                <span>{userPoints} pts</span>
              </li>
            </ul>
          </div>
          
          {/* Connection Status */}
          <div style={{ backgroundColor: '#141419', padding: '15px', borderRadius: '6px', border: '1px solid #222', fontSize: '12px', color: '#666' }}>
            <span style={{ color: '#aaa', fontWeight: 'bold' }}>System Connection Status:</span>
            <p style={{ margin: '5px 0 0 0', color: '#00ff00' }}>● Listening on tunnel tun0</p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;