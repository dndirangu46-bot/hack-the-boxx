import React, { useState, useEffect, useRef } from 'react';

function App() {
  // --- STATE FOR INTERACTIVE OFFENSIVE ASSESSMENTS ---
  const [machines, setMachines] = useState([
    { id: 1, name: 'LegacyOS', ip: '10.10.10.15', difficulty: 'Easy', points: 20, os: 'Windows', status: 'Stopped', realFlag: 'HTB{ms08_067_is_classic}', desc: 'Outdated Windows server running vulnerable SMB services. Perfect for testing remote code execution handshakes.' },
    { id: 2, name: 'InjectPHP', ip: '10.10.10.42', difficulty: 'Medium', points: 40, os: 'Linux', status: 'Running', realFlag: 'HTB{rce_via_user_agent_header}', desc: 'Production web stack demonstrating a broken input filter on user-agent headers leading to immediate shell access.' },
    { id: 3, name: 'CapLog', ip: '10.10.10.89', difficulty: 'Hard', points: 80, os: 'Linux', status: 'Stopped', realFlag: 'HTB{log4j_unauthenticated_root}', desc: 'Java logging platform vulnerable to unauthenticated lookups. Requires multi-stage privilege escalation.' },
  ]);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedMachineId, setSelectedMachineId] = useState(2); // Default to InjectPHP view
  const [userPoints, setUserPoints] = useState(120);
  const [flagInputs, setFlagInputs] = useState({});
  const [capturedMachines, setCapturedMachines] = useState([2]); // InjectPHP captured initially
  const [systemMessage, setSystemMessage] = useState('[SUCCESS] Flag captured for InjectPHP! +40 pts added.');

  // Kenyan Legislation Compliance Module State
  const [selectedAct, setSelectedAct] = useState('');
  const [auditPassed, setAuditPassed] = useState(false);

  // Terminal Simulator State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    'Welcome to CYBER-RANGE // Interactive Console v1.0.4',
    'Type "help" to view available offensive assessment tools.',
    'kali@linux-lab:~$ nmap 10.10.10.42',
    'Starting Nmap 7.92 reconnaissance probe at node 10.10.10.42...',
    'PORT      STATE SERVICE VERSION',
    '80/tcp    open  http    Apache httpd 2.4.41',
    '[+] VULNERABILITY DETECTED: Arbitrary PHP code payload injection accessible via HTTP User-Agent header.',
    'kali@linux-lab:~$ hydra -l admin -P pass.txt 10.10.10.42 ssh',
    'bash: command not found: hydra. Input "help" for environment listing.',
    ''
  ]);

  const terminalEndRef = useRef(null);
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // --- ACTIONS & HANDLERS ---
  const toggleMachineStatus = (id) => {
    setMachines(machines.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'Running' ? 'Stopped' : 'Running';
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const handleFlagSubmit = (machine, e) => {
    e.preventDefault();
    const guess = flagInputs[machine.id] || '';

    if (machine.status !== 'Running') {
      setSystemMessage(`[ALERT] Action denied. ${machine.name} instance is currently offline.`);
      return;
    }
    if (capturedMachines.includes(machine.id)) {
      setSystemMessage(`[INFO] Flags for ${machine.name} have already been successfully submitted.`);
      return;
    }
    if (guess.trim() === machine.realFlag) {
      setUserPoints(prev => prev + machine.points);
      setCapturedMachines([...capturedMachines, machine.id]);
      setSystemMessage(`[SUCCESS] Flag captured for ${machine.name}! +${machine.points} pts added.`);
      setFlagInputs({ ...flagInputs, [machine.id]: '' });
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
    const cmd = terminalInput.trim();
    if (!cmd) return;

    let response = [...terminalLogs, `kali@linux-lab:~$ ${cmd}`];
    const parts = cmd.toLowerCase().split(' ');

    if (parts[0] === 'help') {
      response.push(
        'Available Framework Engines:',
        '  nmap [target_ip]    Scan target infrastructure profile ports.',
        '  whoami              Display configuration context identity.',
        '  clear               Purge terminal view buffer.'
      );
    } else if (parts[0] === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else if (parts[0] === 'whoami') {
      response.push('current_user: kali // node: kali-attacker-framework');
    } else if (parts[0] === 'nmap') {
      const targetIp = parts[1];
      const matched = machines.find(m => m.ip === targetIp || targetIp === '10.10.10.42');
      if (matched && matched.status === 'Running') {
        response.push(
          'PORT      STATE SERVICE VERSION',
          '80/tcp    open  http    Apache httpd 2.4.41',
          '[+] VULNERABILITY DETECTED: Arbitrary PHP code payload injection.'
        );
      } else {
        response.push('Scanning target host mapping... Host discovery failed.');
      }
    } else {
      response.push(`bash: command not found: ${parts[0]}. Input "help" for environment listing.`);
    }

    response.push('');
    setTerminalLogs(response);
    setTerminalInput('');
  };

  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];
  const totalCompletion = Math.round((capturedMachines.length / machines.length) * 100);

  // --- PREMIUM NEON CLASSIC THEME STYLES ---
  const styles = {
    container: {
      backgroundColor: '#02040a',
      backgroundImage: 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #02040a 70%)',
      color: '#f3f4f6',
      minHeight: '100vh',
      fontFamily: '"Inter", -apple-system, sans-serif',
      padding: '24px',
      boxSizing: 'border-box'
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 10px 20px 10px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    cubeIcon: {
      width: '18px',
      height: '18px',
      border: '2px solid #22c55e',
      transform: 'rotate(45deg)',
      boxShadow: '0 0 15px rgba(34, 197, 94, 0.6)'
    },
    navItem: {
      color: '#9ca3af',
      padding: '8px 14px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    navItemActive: {
      color: '#ffffff',
      borderBottom: '2px solid #3b82f6',
      textShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
    },
    topMetricsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '16px',
      margin: '24px 0'
    },
    topCard: {
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 2fr 1.2fr',
      gap: '20px'
    },
    widgetCard: {
      background: 'rgba(10, 15, 30, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '10px',
      padding: '18px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      backdropFilter: 'blur(4px)',
      marginBottom: '20px'
    },
    widgetHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      paddingBottom: '10px',
      marginBottom: '14px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#cbd5e1',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    terminalContainer: {
      backgroundColor: '#020617',
      borderRadius: '8px 8px 0 0',
      border: '1px solid #1e293b',
      fontFamily: 'monospace',
      height: '190px',
      overflowY: 'auto',
      padding: '14px',
      fontSize: '12px',
      lineHeight: '1.5',
      color: '#34d399'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* --- BRANDING HEADER --- */}
      <nav style={styles.navbar}>
        <div style={styles.logoSection}>
          <div style={styles.cubeIcon} />
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Hack <span style={{ color: '#3b82f6' }}>the</span> Boxx
          </span>
        </div>
        <div style={{ display: 'flex' }}>
          {['Dashboard', 'Reports', 'Library', 'Alerts', 'Networking', 'Coding', 'Linux Lab', 'Cloud', 'Database', 'Admin'].map((tab) => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{...styles.navItem, ...(activeTab === tab ? styles.navItemActive : {})}}
            >
              {tab}
            </div>
          ))}
        </div>
      </nav>

      {/* --- GLOBAL TOAST SYSTEM NOTIFICATION FEED --- */}
      {systemMessage && (
        <div style={{
          padding: '12px 16px', borderRadius: '6px', fontSize: '13px', marginBottom: '4px',
          backgroundColor: systemMessage.includes('[SUCCESS]') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(30, 41, 59, 0.6)',
          borderLeft: `4px solid ${systemMessage.includes('[SUCCESS]') ? '#22c55e' : '#3b82f6'}`,
          color: systemMessage.includes('[SUCCESS]') ? '#86efac' : '#cbd5e1'
        }}>
          {systemMessage}
        </div>
      )}

      {/* --- INFRASTRUCTURE OVERVIEW ROW --- */}
      <section style={styles.topMetricsRow}>
        <div style={{ ...styles.topCard, borderLeft: '4px solid #06b6d4' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#06b6d4' }}>78%</div>
          <div>
            <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase' }}>Cloud Usage</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Utilized</div>
          </div>
        </div>
        <div style={{ ...styles.topCard, borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>350</div>
          <div>
            <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase' }}>Database Queries</div>
            <div style={{ fontSize: '11px', color: '#22c55e' }}>Active</div>
          </div>
        </div>
        <div style={{ ...styles.topCard, borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444' }}>8</div>
          <div>
            <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase' }}>Security Threats</div>
            <div style={{ fontSize: '11px', color: '#ef4444' }}>Critical</div>
          </div>
        </div>
        <div style={{ ...styles.topCard, borderLeft: '4px solid #22c55e' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#22c55e' }}>16</div>
          <div>
            <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase' }}>DevOps Builds</div>
            <div style={{ fontSize: '11px', color: '#22c55e' }}>Success</div>
          </div>
        </div>
        <div style={{ ...styles.topCard, borderLeft: '4px solid #a855f7' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#a855f7' }}>13</div>
          <div>
            <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase' }}>DevOps Builds</div>
            <div style={{ fontSize: '11px', color: '#a855f7' }}>Running</div>
          </div>
        </div>
      </section>

      {/* --- DASHBOARD MONITORING MATRIX GRID --- */}
      <main style={styles.dashboardGrid}>
        
        {/* --- LEFT HAND SIDEBAR COL --- */}
        <div>
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Cloud Management</span><span>▼</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#22c55e' }}>■ AWS Instances</span><span>12 / 30%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#3b82f6' }}>■ Azure Storage</span><span>6.4 TB / 55%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#a855f7' }}>■ GCP Workspace</span><span>6 Core / 88%</span></div>
            </div>
          </div>

          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Cost Analysis</span><span>▼</span></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '70px', padding: '5px 0' }}>
              {[45, 75, 30, 90, 50, 65, 95, 60, 40, 85].map((h, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: '#3b82f6', height: `${h}%`, borderRadius: '2px', opacity: 0.8 }} />
              ))}
            </div>
          </div>

          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Database Control</span><span>▼</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span>Active Connections</span><span style={{ color: '#22c55e' }}>5.2 / 2.8%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
              <span>Backup Status</span><span style={{ color: '#22c55e' }}>Scheduled</span>
            </div>
            <div style={{ backgroundColor: '#1e293b', height: '6px', borderRadius: '3px', overflow: 'hidden', marginTop: '10px' }}>
              <div style={{ width: '82%', height: '100%', backgroundColor: '#3b82f6' }} />
            </div>
          </div>
        </div>

        {/* --- CENTER CORE CONTROL AND ASSESSMENTS --- */}
        <div>
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Target Environment Matrices</span><span>▼</span></div>
            
            {/* Target Selectors Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              {machines.map(m => (
                <button 
                  key={m.id}
                  onClick={() => setSelectedMachineId(m.id)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: selectedMachineId === m.id ? 'rgba(59, 130, 246, 0.2)' : '#0f172a',
                    color: selectedMachineId === m.id ? '#ffffff' : '#94a3b8',
                    borderColor: selectedMachineId === m.id ? '#3b82f6' : '#1e293b'
                  }}
                >
                  {m.name} {capturedMachines.includes(m.id) && '✓'}
                </button>
              ))}
            </div>

            {/* Selected Target Operations Sub-Panel */}
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '6px', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{selectedMachine.name} <span style={{ fontSize: '11px', color: '#64748b' }}>({selectedMachine.ip})</span></span>
                <span style={{ fontSize: '11px', color: selectedMachine.difficulty === 'Hard' ? '#ef4444' : '#f59e0b' }}>[{selectedMachine.difficulty}]</span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 12px 0', lineHeight: '1.4' }}>{selectedMachine.desc}</p>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px' }}>Status: <b style={{ color: selectedMachine.status === 'Running' ? '#22c55e' : '#64748b' }}>{selectedMachine.status}</b></span>
                <button 
                  onClick={() => toggleMachineStatus(selectedMachine.id)}
                  style={{
                    backgroundColor: selectedMachine.status === 'Running' ? '#7f1d1d' : '#1e293b',
                    color: selectedMachine.status === 'Running' ? '#fca5a5' : '#f1f5f9',
                    border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer'
                  }}
                >
                  {selectedMachine.status === 'Running' ? 'Terminate Box' : 'Spawn Instance'}
                </button>
              </div>

              {/* Flag Submit Input */}
              <form onSubmit={(e) => handleFlagSubmit(selectedMachine, e)} style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <input 
                  type="text"
                  value={flagInputs[selectedMachine.id] || ''}
                  onChange={(e) => setFlagInputs({ ...flagInputs, [selectedMachine.id]: e.target.value })}
                  placeholder={capturedMachines.includes(selectedMachine.id) ? "Machine Pwned!" : "Submit Capture Token (HTB{...})"}
                  disabled={capturedMachines.includes(selectedMachine.id)}
                  style={{ flex: 1, backgroundColor: '#020617', border: '1px solid #334155', padding: '8px', borderRadius: '4px', color: '#fff', fontSize: '12px' }}
                />
                <button type="submit" disabled={capturedMachines.includes(selectedMachine.id)} style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* --- INTERACTIVE LINUX LAB VIRTUAL CONSOLE --- */}
          <div style={{ marginBottom: '20px' }}>
            <div style={styles.terminalContainer}>
              {terminalLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.startsWith('kali@') ? '#60a5fa' : log.includes('VULNERABILITY') ? '#f59e0b' : '#34d399' }}>
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', backgroundColor: '#020617', border: '1px solid #1e293b', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
              <span style={{ color: '#60a5fa', padding: '10px 0 10px 14px', fontFamily: 'monospace', fontSize: '12px' }}>$</span>
              <input 
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type 'help' or input simulation execution targets..."
                style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'monospace', fontSize: '12px', padding: '10px 8px' }}
              />
            </form>
          </div>
        </div>

        {/* --- RIGHT HAND SIDEBAR COL --- */}
        <div>
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Global Standings</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}><span>#1 0xAlpha</span><span>340 pts</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}><span>#2 NullPointer</span><span>280 pts</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}><span>#3 RootKit_Ken</span><span>220 pts</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', color: '#22c55e', fontWeight: '700' }}>
                <span>You (Local)</span><span>{userPoints} pts</span>
              </div>
            </div>
          </div>

          {/* Localized Regulatory Audit Compliance Framework Module */}
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Compliance Sandbox Boundary</span></div>
            {auditPassed ? (
              <div style={{ color: '#22c55e', fontSize: '12px', padding: '4px 0' }}>✓ Legal Audit Verification Form successfully cataloged. Section 14 logged.</div>
            ) : (
              <form onSubmit={verifyComplianceAudit} style={{ fontSize: '12px' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 10px 0', lineHeight: '1.4' }}>An unauthorized remote web shell payload violates which specific asset parameter of Kenyan digital legislation?</p>
                <select 
                  value={selectedAct} 
                  onChange={(e) => setSelectedAct(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#020617', color: '#fff', border: '1px solid #334155', padding: '6px', borderRadius: '4px', outline: 'none', fontSize: '12px' }}
                >
                  <option value="">-- Select Active Statute --</option>
                  <option value="data_protection">Data Protection Act (2019)</option>
                  <option value="cmca_2018">Computer Misuse and Cybercrimes Act (2018)</option>
                </select>
                <button type="submit" style={{ width: '100%', border: '1px solid #a855f7', background: 'transparent', color: '#a855f7', padding: '6px', borderRadius: '4px', marginTop: '10px', cursor: 'pointer', fontSize: '12px' }}>
                  File Compliance Audit Report
                </button>
              </form>
            )}
          </div>

          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Operator Profile Tracker</span></div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>LAB COMPLETION MATRIX</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>{totalCompletion}%</div>
            <div style={{ backgroundColor: '#1e293b', height: '4px', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
              <div style={{ width: `${totalCompletion}%`, height: '100%', backgroundColor: '#22c55e' }} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;