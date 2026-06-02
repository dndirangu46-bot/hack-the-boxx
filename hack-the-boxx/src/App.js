import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [machines, setMachines] = useState([
    { id: 1, name: 'LegacyOS', ip: '10.10.10.15', difficulty: 'Easy', points: 20, os: 'Windows', status: 'Stopped', realFlag: 'HTB{ms08_067_is_classic}', desc: 'An outdated Windows server running vulnerable SMB services. Perfect for testing remote code execution handshakes.' },
    { id: 2, name: 'InjectPHP', ip: '10.10.10.42', difficulty: 'Medium', points: 40, os: 'Linux', status: 'Running', realFlag: 'HTB{rce_via_user_agent_header}', desc: 'A custom Linux web stack demonstrating a broken input filter on user-agent logs, leading to immediate shell access.' },
    { id: 3, name: 'CapLog', ip: '10.10.10.89', difficulty: 'Hard', points: 80, os: 'Linux', status: 'Stopped', realFlag: 'HTB{log4j_unauthenticated_root}', desc: 'Enterprise Java logging platform prone to unauthenticated JNDI lookups. High difficulty privilege escalation required.' },
  ]);

  const [activeTab, setActiveTab] = useState(2); // Keep active on InjectPHP based on progress
  const [userPoints, setUserPoints] = useState(160); // Persisting your current 160 points progress
  const [inputs, setInputs] = useState({}); 
  const [systemMessage, setSystemMessage] = useState('[SUCCESS] Flag captured for InjectPHP! +40 pts added.');
  const [capturedMachines, setCapturedMachines] = useState([2]); // InjectPHP is captured!

  // COMPLIANCE AUDIT STATE
  const [selectedAct, setSelectedAct] = useState('');
  const [auditPassed, setAuditPassed] = useState(false);

  // TERMINAL STATES
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    'Welcome to CYBER-RANGE // Interactive Console v1.0.4',
    'Type "help" to view available offensive assessment tools.',
    'hacker@kali:~$ nmap 10.10.10.42',
    'Starting Nmap 7.92 reconnaissance probe at node 10.10.10.42...',
    'PORT      STATE SERVICE VERSION',
    '80/tcp    open  http    Apache httpd 2.4.41',
    '[+] VULNERABILITY DETECTED: Arbitrary PHP code payload injection accessible via HTTP User-Agent header.',
    '',
    'hacker@kali:~$ hydra -l admin -P pass.txt 10.10.10.42 ssh',
    'Hydra v9.2 initializing parallel target cracking dictionary configurations...',
    '[STATUS] Attacking service ssh on port 22...',
    '[-] [ssh] user: admin - password: password123 - Access Denied',
    '[-] [ssh] user: admin - password: root - Access Denied',
    '[!] Alert: Service profile locked out. Hint: Nmap output noted port 80 HTTP Vulnerability payload vector, not SSH dictionary authentication vectors.',
    ''
  ]);
  
  const terminalEndRef = useRef(null);

  const [leaderboard] = useState([
    { rank: 1, handle: '0xAlpha', score: 340, tier: 'Omniscient' },
    { rank: 2, handle: 'NullPointer', score: 280, tier: 'Elite' },
    { rank: 3, handle: 'RootKit_Ken', score: 220, tier: 'Pro' },
    { rank: 4, handle: 'NetSpy', score: 140, tier: 'Hacker' },
  ]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

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
      setSystemMessage(`[INFO] Flag already submitted for ${machine.name}. Matrix point allocations finalized.`);
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

  // AUDIT COMPLIANCE VERIFIER
  const verifyComplianceAudit = (e) => {
    e.preventDefault();
    if (selectedAct === 'cmca_2018') {
      setAuditPassed(true);
      setUserPoints(prev => prev + 20); // Bonus points for legal compliance mapping
      setSystemMessage('[SUCCESS] Legal Framework Verified! +20 pts. Section 14 of CMCA (2018) penalizes unauthorized access and code injection execution.');
    } else {
      setSystemMessage('[AUDIT FAILED] Incorrect legal classification. Review data privacy definitions vs infrastructure breach laws.');
    }
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const command = terminalInput.trim();
    if (!command) return;

    let newLogs = [...terminalLogs, `hacker@kali:~$ ${command}`];
    const parts = command.split(' ');
    const baseCmd = parts[0].toLowerCase();

    switch (baseCmd) {
      case 'help':
        newLogs.push(
          'Available Operations:',
          '  help                           Display command registry framework.',
          '  clear                          Purge active terminal display screen logs.',
          '  whoami                         Print current operator clearance profile.',
          '  nmap [target_ip]               Execute a service probe footprint map.',
          '  hydra -l [user] -P [list] [ip] ssh   Execute dictionary brute-force target parameters.',
          '  curl -H [header] [ip]          Craft customized network exploitation requests.'
        );
        break;
      case 'clear':
        setTerminalLogs([]);
        setTerminalInput('');
        return;
      case 'whoami':
        newLogs.push('identity: operator_dev // active_clearance: level_3_pentester');
        break;
      case 'nmap':
        const targetIpNmap = parts[1];
        if (!targetIpNmap) {
          newLogs.push('Usage Error: nmap [target_ip]');
        } else {
          const matchedMachine = machines.find(m => m.ip === targetIpNmap);
          if (!matchedMachine || matchedMachine.status !== 'Running') {
            newLogs.push(`CRITICAL: Host ${targetIpNmap} appears down.`);
          } else if (matchedMachine.id === 2) {
            newLogs.push('PORT      STATE SERVICE VERSION', '80/tcp    open  http    Apache httpd 2.4.41', '[+] VULNERABILITY DETECTED: Arbitrary PHP code payload injection accessible via HTTP User-Agent header.');
          }
        }
        break;
      case 'curl':
        const targetIpCurl = parts.find(p => p.startsWith('10.10.10.'));
        const containsUserAgentHeader = command.toLowerCase().includes('user-agent');

        if (!targetIpCurl) {
          newLogs.push('Usage Error: curl -H "Header: payload" [target_ip]');
        } else {
          const matchedMachine = machines.find(m => m.ip === targetIpCurl);
          if (matchedMachine && matchedMachine.id === 2 && containsUserAgentHeader) {
            newLogs.push(`[+] Exploit Execution Successful! Token extracted: ${matchedMachine.realFlag}`);
          } else {
            newLogs.push('HTTP/1.1 200 OK', '', 'Standard index frame output.');
          }
        }
        break;
      default:
        newLogs.push(`bash: command not found: ${baseCmd}.`);
    }

    newLogs.push('');
    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  const currentSelectedMachine = machines.find(m => m.id === activeTab);
  const completionPercentage = Math.round((capturedMachines.length / machines.length) * 100);

  return (
    <div style={{ backgroundColor: '#0f0f12', color: '#fff', minHeight: '100vh', fontFamily: 'monospace', padding: '25px' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '15px', marginBottom: '25px' }}>
        <div>
          <h1 style={{ color: '#9fe52a', margin: 0 }}>CYBER-RANGE // LABS</h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>Gamified Virtual Vulnerability Assessment Portal</p>
        </div>
        <div style={{ textAlign: 'right', alignSelf: 'center', backgroundColor: '#141419', padding: '10px 20px', borderRadius: '4px', border: '1px solid #222' }}>
          <span style={{ color: '#aaa' }}>CURRENT RANK: </span>
          <span style={{ color: '#9fe52a', fontWeight: 'bold' }}>{userPoints >= 180 ? 'Omniscient Elite' : userPoints >= 140 ? 'Pro Hacker' : 'Script Kiddie'}</span>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>Score: {userPoints} pts</div>
        </div>
      </header>

      {/* Banner */}
      {systemMessage && (
        <div style={{ backgroundColor: systemMessage.includes('[SUCCESS]') ? '#0b2612' : '#260b0b', color: systemMessage.includes('[SUCCESS]') ? '#9fe52a' : '#ff4444', padding: '12px', borderRadius: '4px', marginBottom: '25px', border: '1px solid #333' }}>
          {systemMessage}
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '25px', alignItems: 'start' }}>
        
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
                  <h2 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>{machine.name}</h2>
                  <span style={{ color: machine.difficulty === 'Hard' ? '#ff4444' : machine.difficulty === 'Medium' ? '#ffbb00' : '#9fe52a', fontSize: '11px' }}>
                    [{machine.difficulty}]
                  </span>
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
                    style={{ flex: 2, backgroundColor: '#0f0f12', border: '1px solid #333', padding: '8px', color: '#fff', borderRadius: '4px', fontSize: '11px' }}
                  />
                  <button type="submit" disabled={capturedMachines.includes(machine.id)} style={{ flex: 1, backgroundColor: '#9fe52a', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                    Send
                  </button>
                </form>
              </div>
            ))}
          </div>

          {/* TWO PANEL MIDSECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Challenge Briefing */}
            <div style={{ backgroundColor: '#141419', padding: '20px', borderRadius: '6px', border: '1px solid #222', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
                  <h2 style={{ margin: 0, fontSize: '15px', color: '#9fe52a' }}>📋 Briefing: {currentSelectedMachine.name}</h2>
                </div>
                <p style={{ color: '#ccc', lineHeight: '1.5', fontSize: '13px', margin: '0 0 15px 0' }}>{currentSelectedMachine.desc}</p>
              </div>
              
              {/* COMPLIANCE AUDIT SUB-MODULE */}
              <div style={{ backgroundColor: '#111116', padding: '15px', borderRadius: '4px', border: '1px solid #333' }}>
                <h4 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '12px' }}>⚖️ Digital Legislation Compliance Audit</h4>
                {auditPassed ? (
                  <p style={{ margin: 0, color: '#9fe52a', fontSize: '12px', fontWeight: 'bold' }}>✓ Compliance Assessment Logged under CMCA (2018) Part III.</p>
                ) : (
                  <form onSubmit={verifyComplianceAudit}>
                    <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '11px' }}>
                      Executing an RCE shell injection violates which specific statute of Kenyan digital architecture?
                    </p>
                    <select 
                      value={selectedAct} 
                      onChange={(e) => setSelectedAct(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#0f0f12', color: '#fff', border: '1px solid #444', padding: '6px', fontSize: '11px', fontFamily: 'monospace', marginBottom: '10px' }}
                    >
                      <option value="">-- Choose Statute --</option>
                      <option value="data_act_2019">Data Protection Act (2019) // Statutory PII Processing Principles</option>
                      <option value="cmca_2018">Computer Misuse and Cybercrimes Act (2018) // Sec 14: Unauthorized System Access</option>
                    </select>
                    <button type="submit" style={{ width: '100%', backgroundColor: '#222', color: '#9fe52a', border: '1px solid #9fe52a', padding: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                      File Legal Audit Report
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* LIVE TERMINAL SIMULATOR */}
            <div style={{ backgroundColor: '#050507', border: '1px solid #222', borderRadius: '6px', display: 'flex', flexDirection: 'column', height: '320px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#111116', padding: '8px 15px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
                <span style={{ color: '#666', fontSize: '11px', marginLeft: '10px' }}>sh / terminal_instance_kali</span>
              </div>

              <div style={{ flex: 1, padding: '15px', overflowY: 'auto', fontSize: '12px', color: '#00ff00', lineHeight: '1.5' }}>
                {terminalLogs.map((log, index) => (
                  <div key={index} style={{ 
                    whiteSpace: 'pre-wrap', 
                    color: log.startsWith('hacker@') ? '#9fe52a' : 
                           log.includes('VULNERABILITY') || log.includes('[!]') ? '#ffbb00' : 
                           log.includes('CRITICAL') || log.includes('Usage Error') ? '#ff4444' : '#00ff00' 
                  }}>
                    {log}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              <form onSubmit={handleTerminalSubmit} style={{ borderTop: '1px solid #222', display: 'flex', backgroundColor: '#0a0a0f' }}>
                <span style={{ color: '#9fe52a', padding: '10px 0 10px 15px', fontSize: '12px', fontWeight: 'bold' }}>hacker@kali:~$</span>
                <input 
                  type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="type help..."
                  style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'monospace', fontSize: '12px', padding: '10px' }}
                />
              </form>
            </div>

          </div>

          {/* Profile Tracker */}
          <div style={{ backgroundColor: '#141419', padding: '25px', borderRadius: '6px', border: '1px solid #222' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fff', textTransform: 'uppercase' }}>📊 Operator Profile Tracker</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'center' }}>
              <div style={{ borderRight: '1px solid #222', paddingRight: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>LAB COMPLETION MATRIX</span>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#9fe52a' }}>{completionPercentage}%</div>
                <div style={{ width: '100%', backgroundColor: '#0f0f12', height: '8px', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${completionPercentage}%`, backgroundColor: '#9fe52a', height: '100%' }} />
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '12px', fontWeight: 'bold' }}>✨ UNLOCKED COMMENDATIONS</span>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ backgroundColor: '#0f0f12', padding: '10px 15px', borderRadius: '4px', border: '1px solid #222', textParagraph: 'center' }}>
                    <div style={{ fontSize: '18px' }}>⚡</div>
                    <div style={{ fontSize: '10px', color: '#9fe52a', fontWeight: 'bold', marginTop: '3px' }}>INITIAL ACCESS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#141419', padding: '20px', borderRadius: '6px', border: '1px solid #222' }}>
            <h3 style={{ color: '#9fe52a', margin: '0 0 15px 0', fontSize: '14px', textTransform: 'uppercase' }}>🏆 Global Rankings</h3>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '13px', lineHeight: '2' }}>
              {leaderboard.map((player) => (
                <li key={player.rank} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#aaa' }}><span style={{ color: '#666', marginRight: '8px' }}>#{player.rank}</span>{player.handle}</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{player.score} pts</span>
                </li>
              ))}
              <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 6px 0', borderTop: '1px dashed #444', color: '#9fe52a', fontWeight: 'bold' }}>
                <span>You (Local)</span><span>{userPoints} pts</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;