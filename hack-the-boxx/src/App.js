import React, { useState, useEffect, useRef } from 'react';

function App() {
  // --- HARDWARE HOST TO VM TARGET CONTEXT ---
  const [machines, setMachines] = useState([
    { id: 1, name: 'LegacyOS', ip: '10.10.10.15', difficulty: 'Easy', points: 20, os: 'Windows', status: 'Stopped', realFlag: 'HTB{ms08_067_is_classic}', desc: 'Outdated Windows server running vulnerable SMB services. Perfect for testing remote code execution handshakes.' },
    { id: 2, name: 'InjectPHP', ip: '10.10.10.42', difficulty: 'Medium', points: 40, os: 'Linux', status: 'Running', realFlag: 'HTB{rce_via_user_agent_header}', desc: 'Production web stack demonstrating a broken input filter on user-agent headers leading to immediate shell access.' },
    { id: 3, name: 'CapLog', ip: '10.10.10.89', difficulty: 'Hard', points: 80, os: 'Linux', status: 'Stopped', realFlag: 'HTB{log4j_unauthenticated_root}', desc: 'Java logging platform vulnerable to unauthenticated lookups. Requires multi-stage privilege escalation.' },
  ]);

  const [activeTab, setActiveTab] = useState(2); // InjectPHP active by default
  const [userPoints, setUserPoints] = useState(120); // Base matrix score
  const [inputs, setInputs] = useState({}); 
  const [systemMessage, setSystemMessage] = useState('[SUCCESS] Flag captured for InjectPHP! +40 pts added.');
  const [capturedMachines, setCapturedMachines] = useState([2]);

  // DIGITAL LEGISLATION STATE
  const [selectedAct, setSelectedAct] = useState('');
  const [auditPassed, setAuditPassed] = useState(false);

  // TERMINAL ENGINE STATE
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    'Welcome to CYBER-RANGE // Interactive Console v1.0.4',
    'Type "help" to view available offensive assessment tools.',
    'hacker@kali:~$ nmap 10.10.10.42',
    'Starting Nmap 7.92 reconnaissance probe at node 10.10.10.42...',
    'PORT      STATE SERVICE VERSION',
    '80/tcp    open  http    Apache httpd 2.4.41',
    '[+] VULNERABILITY DETECTED: Arbitrary PHP code payload injection accessible via HTTP User-Agent header.',
    'hacker@kali:~$ hydra -l admin -P pass.txt 10.10.10.42 ssh',
    '[STATUS] Attacking service ssh on port 22...',
    '[-] [ssh] user: admin - password: password123 - Access Denied',
    '[-] [ssh] user: admin - password: root - Access Denied',
    '[!] Alert: Service profile locked out. Hint: Nmap output noted port 80 HTTP vulnerability vector, not SSH dictionary authentication vectors.',
    ''
  ]);
  
  const terminalEndRef = useRef(null);

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
      setSystemMessage(`[ALERT] Action denied. ${machine.name} instance is currently offline.`);
      return;
    }

    if (capturedMachines.includes(machine.id)) {
      setSystemMessage(`[INFO] Flags for ${machine.name} have already been successfully submitted.`);
      return;
    }

    if (userGuess.trim() === machine.realFlag) {
      setUserPoints(prev => prev + machine.points);
      setCapturedMachines([...capturedMachines, machine.id]);
      setSystemMessage(`[SUCCESS] Flag captured for ${machine.name}! +${machine.points} pts added.`);
      setInputs({ ...inputs, [machine.id]: '' });
    } else {
      setSystemMessage(`[ERROR] Invalid flag token submitted for ${machine.name}.`);
    }
  };

  const verifyComplianceAudit = (e) => {
    e.preventDefault();
    if (selectedAct === 'cmca_2018') {
      setAuditPassed(true);
      setUserPoints(prev => prev + 20);
      setSystemMessage('[SUCCESS] Legal Audit Passed. Section 14 of the Computer Misuse and Cybercrimes Act mapped correctly.');
    } else {
      setSystemMessage('[AUDIT FAILED] Mismatched statute. This act does not address unauthorized access or data modification vectors.');
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
          'Available Environment Tools:',
          '  help                           Display commands directory overview.',
          '  clear                          Purge active console line history.',
          '  whoami                         Check session environment identity profile.',
          '  nmap [target_ip]               Initiate a basic network reconnaissance probe.',
          '  hydra -l [user] -P [file] [ip] Fire network brute-force login sequences.'
        );
        break;
      case 'clear':
        setTerminalLogs([]);
        setTerminalInput('');
        return;
      case 'whoami':
        newLogs.push('current_user: hacker // node: kali-attacker-framework');
        break;
      case 'nmap':
        const targetIp = parts[1];
        if (!targetIp) {
          newLogs.push('Usage: nmap [target_ip]');
        } else {
          const matched = machines.find(m => m.ip === targetIp);
          if (!matched || matched.status !== 'Running') {
            newLogs.push(`Host discovery failed: Node ${targetIp} is unresponsive.`);
          } else if (matched.id === 2) {
            newLogs.push('PORT      STATE SERVICE VERSION', '80/tcp    open  http    Apache httpd 2.4.41', '[+] VULNERABILITY DETECTED: Arbitrary PHP code payload injection.');
          } else {
            newLogs.push('Scanning target host mapping...', 'All 1000 scanned ports are in ignored states (closed).');
          }
        }
        break;
      default:
        newLogs.push(`bash: command not found: ${baseCmd}`);
    }

    newLogs.push('');
    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  const currentMachine = machines.find(m => m.id === activeTab) || machines[0];
  const completionPercentage = Math.round((capturedMachines.length / machines.length) * 100);

  // MODERNIZED COMPACT CLEAN SYSTEM UI THEME
  const styles = {
    wrapper: { backgroundColor: '#090d16', color: '#f1f5f9', minHeight: '100vh', fontFamily: '"Segoe UI", Roboto, sans-serif', padding: '24px' },
    header: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '20px' },
    title: { fontSize: '20px', fontWeight: '600', margin: 0, color: '#f8fafc' },
    scoreCard: { backgroundColor: '#111827', border: '1px solid #1e293b', padding: '10px 20px', borderRadius: '6px', textAlign: 'right' },
    alertBanner: { padding: '12px 16px', borderRadius: '4px', fontSize: '13px', marginBottom: '20px', borderLeft: '4px solid' },
    mainGrid: { display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' },
    card: { backgroundColor: '#111827', border: '1px solid #1e293b', padding: '20px', borderRadius: '8px', position: 'relative' },
    input: { backgroundColor: '#090d16', border: '1px solid #334155', padding: '8px 12px', color: '#f1f5f9', borderRadius: '4px', fontSize: '13px', outline: 'none' },
    btnPrimary: { backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    btnSecondary: { backgroundColor: 'transparent', color: '#a855f7', border: '1px solid #a855f7', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
    select: { backgroundColor: '#090d16', color: '#f1f5f9', border: '1px solid #334155', padding: '8px', borderRadius: '4px', fontSize: '13px', width: '100%', outline: 'none' }
  };

  return (
    <div style={styles.wrapper}>
      
      {/* Platform Header Area */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>CYBER-RANGE // Assessment Console</h1>
          <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Operational Sandbox Assurance Infrastructure</div>
        </div>
        <div style={styles.scoreCard}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Aggregated Points</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e', marginTop: '2px' }}>{userPoints} <span style={{ fontSize: '12px', color: '#64748b' }}>PTS</span></div>
        </div>
      </header>

      {/* Dynamic Toast Status Notifications */}
      {systemMessage && (
        <div style={{ 
          ...styles.alertBanner, 
          backgroundColor: systemMessage.includes('[SUCCESS]') ? '#064e3b' : '#1e293b', 
          borderColor: systemMessage.includes('[SUCCESS]') ? '#22c55e' : systemMessage.includes('[ERROR]') ? '#ef4444' : '#3b82f6',
          color: systemMessage.includes('[SUCCESS]') ? '#a7f3d0' : '#94a3b8'
        }}>
          {systemMessage}
        </div>
      )}

      {/* Primary Workspace Grid Split */}
      <div style={styles.mainGrid}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Targets Sub-Array Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {machines.map((machine) => (
              <div 
                key={machine.id} 
                onClick={() => setActiveTab(machine.id)}
                style={{ 
                  ...styles.card, 
                  borderColor: activeTab === machine.id ? '#22c55e' : '#1e293b',
                  cursor: 'pointer'
                }}
              >
                {capturedMachines.includes(machine.id) && (
                  <span style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#064e3b', color: '#22c55e', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                    PWNED
                  </span>
                )}
                
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>{machine.name}</h3>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                  {machine.ip} • <span style={{ color: machine.difficulty === 'Hard' ? '#ef4444' : machine.difficulty === 'Medium' ? '#f59e0b' : '#22c55e' }}>[{machine.difficulty}]</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#090d16', padding: '8px 12px', borderRadius: '4px', marginBottom: '12px', fontSize: '12px' }}>
                  <span style={{ color: '#64748b' }}>Status:</span>
                  <span style={{ color: machine.status === 'Running' ? '#22c55e' : '#64748b', fontWeight: '600' }}>{machine.status}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleMachine(machine.id); }} 
                    style={{ 
                      flex: 1, padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', border: 'none', fontWeight: '500',
                      backgroundColor: machine.status === 'Running' ? '#7f1d1d' : '#1e293b', 
                      color: machine.status === 'Running' ? '#fca5a5' : '#f1f5f9'
                    }}
                  >
                    {machine.status === 'Running' ? 'Terminate Box' : 'Spawn Instance'}
                  </button>
                </div>

                <form onSubmit={(e) => verifyFlag(machine, e)} style={{ display: 'flex', gap: '6px', marginTop: '10px' }} onClick={e => e.stopPropagation()}>
                  <input 
                    type="text" 
                    placeholder={capturedMachines.includes(machine.id) ? "Machine Pwned!" : "Submit Flag..."}
                    disabled={capturedMachines.includes(machine.id)}
                    value={inputs[machine.id] || ''}
                    onChange={(e) => handleInputChange(machine.id, e.target.value)}
                    style={{ ...styles.input, flex: 1, fontSize: '12px' }}
                  />
                  <button type="submit" disabled={capturedMachines.includes(machine.id)} style={{ ...styles.btnPrimary, padding: '0 12px', fontSize: '12px' }}>
                    Send
                  </button>
                </form>
              </div>
            ))}
          </div>

          {/* Lower Split: Briefing & Legal Panel alongside Terminal Console */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            
            {/* Dynamic Briefing Box */}
            <div style={{ ...styles.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#22c55e', textTransform: 'uppercase' }}>
                  Briefing: {currentMachine.name}
                </h4>
                <p style={{ color: '#94a3b8', lineHeight: '1.5', fontSize: '13px', margin: '0 0 16px 0' }}>
                  {currentMachine.desc}
                </p>
              </div>
              
              {/* Kenyan Legislation Audit Compliance module */}
              <div style={{ backgroundColor: '#090d16', padding: '14px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <h5 style={{ color: '#f8fafc', margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600' }}>Digital Legislation Compliance Audit</h5>
                {auditPassed ? (
                  <div style={{ color: '#22c55e', fontSize: '12px', fontWeight: '500' }}>
                    ✓ Legal Audit Report filed systematically. Section 14 infraction logged.
                  </div>
                ) : (
                  <form onSubmit={verifyComplianceAudit}>
                    <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '11px', lineHeight: '1.4' }}>
                      An unauthorized remote shell injection violates which specific statute of Kenyan digital legislation?
                    </p>
                    <select value={selectedAct} onChange={(e) => setSelectedAct(e.target.value)} style={styles.select}>
                      <option value="">-- Choose Statute --</option>
                      <option value="data_protection_2019">Data Protection Act (2019)</option>
                      <option value="cmca_2018">Computer Misuse and Cybercrimes Act (2018)</option>
                    </select>
                    <button type="submit" style={{ ...styles.btnSecondary, width: '100%', marginTop: '10px', fontSize: '12px', fontWeight: '500' }}>
                      File Legal Audit Report
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Interactive Terminal Shell Window */}
            <div style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '320px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#111827', padding: '8px 14px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '11px', fontFamily: 'monospace' }}>sh / terminal_instance_kali</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                </div>
              </div>

              <div style={{ flex: 1, padding: '12px', overflowY: 'auto', fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.5', color: '#22c55e' }}>
                {terminalLogs.map((log, index) => (
                  <div key={index} style={{ 
                    whiteSpace: 'pre-wrap', 
                    color: log.startsWith('hacker@') ? '#38bdf8' : 
                           log.includes('VULNERABILITY') ? '#f59e0b' : 
                           log.includes('found') ? '#ef4444' : '#22c55e' 
                  }}>
                    {log}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              <form onSubmit={handleTerminalSubmit} style={{ borderTop: '1px solid #1e293b', display: 'flex', backgroundColor: '#090d16' }}>
                <span style={{ color: '#38bdf8', padding: '10px 0 10px 12px', fontSize: '12px', fontFamily: 'monospace' }}>hacker@kali:~$</span>
                <input 
                  type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="type help..."
                  style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#f1f5f9', fontFamily: 'monospace', fontSize: '12px', padding: '10px 6px' }}
                />
              </form>
            </div>

          </div>

          {/* User Metrics Progress Tracker */}
          <div style={styles.card}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
              Operator Profile Tracker
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px', alignItems: 'center' }}>
              <div style={{ borderRight: '1px solid #1e293b', paddingRight: '20px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>LAB COMPLETION MATRIX</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#22c55e', marginTop: '4px' }}>{completionPercentage}%</div>
                <div style={{ width: '100%', backgroundColor: '#090d16', height: '6px', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${completionPercentage}%`, backgroundColor: '#22c55e', height: '100%' }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>Unlocked Reconnaissance Commendations</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#e2e8f0' }}>
                    🔥 Initial Access Validated
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Global Standings Sidebar Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={styles.card}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '600', color: '#22c55e', textTransform: 'uppercase' }}>
              Global Rankings
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>#1 0xAlpha</span><span>340 pts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>#2 NullPointer</span><span>280 pts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>#3 RootKit_Ken</span><span>220 pts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>#4 NetSpy</span><span>140 pts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '8px', color: '#22c55e', fontWeight: '600' }}>
                <span>You (Local)</span><span>{userPoints} pts</span>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>SYSTEM CONNECTION STATUS</div>
            <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
              Listening on tunnel tun0
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;