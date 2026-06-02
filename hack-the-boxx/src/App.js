import React, { useState, useEffect, useRef } from 'react';

function App() {
  // --- ASSESSMENT RANGE STATE ---
  const [machines, setMachines] = useState([
    { id: 1, name: 'LegacyOS', ip: '10.10.10.15', difficulty: 'Easy', points: 20, os: 'Windows', status: 'Stopped', realFlag: 'HTB{ms08_067_is_classic}', desc: 'Outdated Windows server running vulnerable SMB services. Perfect for testing remote code execution handshakes.' },
    { id: 2, name: 'InjectPHP', ip: '10.10.10.42', difficulty: 'Medium', points: 40, os: 'Linux', status: 'Running', realFlag: 'HTB{rce_via_user_agent_header}', desc: 'Production web stack demonstrating a broken input filter on user-agent headers leading to immediate shell access.' },
    { id: 3, name: 'CapLog', ip: '10.10.10.89', difficulty: 'Hard', points: 80, os: 'Linux', status: 'Stopped', realFlag: 'HTB{log4j_unauthenticated_root}', desc: 'Java logging platform vulnerable to unauthenticated lookups. Requires multi-stage privilege escalation.' },
  ]);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedMachineId, setSelectedMachineId] = useState(2); // InjectPHP active by default
  const [userPoints, setUserPoints] = useState(120);
  const [flagInputs, setFlagInputs] = useState({});
  const [capturedMachines, setCapturedMachines] = useState([2]); 
  const [systemMessage, setSystemMessage] = useState('[SUCCESS] Flag captured for InjectPHP! +40 pts added.');

  // Kenyan Legislation Compliance Module State
  const [selectedAct, setSelectedAct] = useState('');
  const [auditPassed, setAuditPassed] = useState(false);

  // Active Tool Toggle for Script Library Simulation
  const [activeTool, setActiveTool] = useState('Nmap');

  // Terminal State Engine
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

  // --- INTERACTIVE HANDLERS ---
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
        '  hydra [options]     Brute-force credential verification tools.',
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
        response.push('Scanning target host mapping... Host discovery failed or box is offline.');
      }
    } else if (parts[0] === 'hydra') {
      response.push(
        'Scanning...',
        'Hydra crack result: [22/tcp] user: admin password: password123'
      );
    } else {
      response.push(`bash: command not found: ${parts[0]}. Input "help" for environment listing.`);
    }

    response.push('');
    setTerminalLogs(response);
    setTerminalInput('');
  };

  const handleToolClick = (toolName) => {
    setActiveTool(toolName);
    let toolCmd = '';
    if (toolName === 'Nmap') toolCmd = 'nmap 10.10.10.42';
    if (toolName === 'Hydra') toolCmd = 'hydra -l admin -P top10.txt 10.10.10.42 ssh';
    if (toolName === 'Metasploit') toolCmd = 'msfconsole -q -x "use exploit/multi/handler"';
    
    if (toolCmd) {
      setTerminalInput(toolCmd);
    }
  };

  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];
  const totalCompletion = Math.round((capturedMachines.length / machines.length) * 100);

  // --- PREMIUM HIGH-GLOSS THEME STYLES ---
  const styles = {
    container: {
      backgroundColor: '#02040a',
      backgroundImage: 'radial-gradient(circle at 50% 0%, #0d1527 0%, #02040a 80%)',
      color: '#f3f4f6',
      minHeight: '100vh',
      fontFamily: '"Inter", -apple-system, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      marginBottom: '20px'
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    cubeIcon: {
      width: '14px',
      height: '14px',
      border: '2px solid #00ffcc',
      transform: 'rotate(45deg)',
      boxShadow: '0 0 12px #00ffcc'
    },
    navItem: {
      color: '#9ca3af',
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      borderRadius: '4px',
      transition: 'all 0.2s'
    },
    navItemActive: {
      color: '#ffffff',
      background: 'rgba(255, 255, 255, 0.05)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
      borderBottom: '2px solid #00ffcc'
    },
    topMetricsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '14px',
      marginBottom: '20px'
    },
    topCard: {
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '8px',
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    },
    iconWrapper: {
      width: '36px',
      height: '36px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 2fr 1.1fr',
      gap: '16px'
    },
    widgetCard: {
      background: 'linear-gradient(180deg, rgba(13, 20, 38, 0.8) 0%, rgba(8, 12, 24, 0.9) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.07)',
      borderRadius: '8px',
      padding: '14px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px)',
      marginBottom: '16px'
    },
    widgetHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      paddingBottom: '8px',
      marginBottom: '12px',
      fontSize: '11px',
      fontWeight: '700',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    terminalContainer: {
      backgroundColor: '#030712',
      borderRadius: '6px 6px 0 0',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      fontFamily: 'monospace',
      height: '180px',
      overflowY: 'auto',
      padding: '12px',
      fontSize: '12px',
      lineHeight: '1.5',
      color: '#00ffcc'
    },
    toolButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '6px',
      padding: '10px',
      color: '#cbd5e1',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* --- PREMIUM NAVIGATION BAR --- */}
      <nav style={styles.navbar}>
        <div style={styles.logoSection}>
          <div style={styles.cubeIcon} />
          <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Hack <span style={{ color: '#00ffcc' }}>the</span> Boxx
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['Dashboard', 'Reports', 'Library', 'Alerts', 'Networking', 'Coding', 'Linux Lab', 'Cloud', 'Database'].map((tab) => (
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

      {/* --- FEEDBACK TOAST SYSTEM --- */}
      {systemMessage && (
        <div style={{
          padding: '10px 14px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px',
          backgroundColor: systemMessage.includes('[SUCCESS]') ? 'rgba(0, 255, 204, 0.08)' : 'rgba(30, 41, 59, 0.4)',
          borderLeft: `3px solid ${systemMessage.includes('[SUCCESS]') ? '#00ffcc' : '#3b82f6'}`,
          color: systemMessage.includes('[SUCCESS]') ? '#a7f3d0' : '#cbd5e1',
          boxShadow: systemMessage.includes('[SUCCESS]') ? '0 0 15px rgba(0, 255, 204, 0.15)' : 'none'
        }}>
          {systemMessage}
        </div>
      )}

      {/* --- TOP HIGH-GLOSS METRICS MATRIX --- */}
      <section style={styles.topMetricsRow}>
        <div style={{ ...styles.topCard, borderLeft: '3px solid #06b6d4' }}>
          <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>☁</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>78%</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Cloud Usage</div>
          </div>
        </div>
        <div style={{ ...styles.topCard, borderLeft: '3px solid #3b82f6' }}>
          <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>📊</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>350 <span style={{ fontSize: '10px', color: '#22c55e' }}>Active</span></div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>DB Queries</div>
          </div>
        </div>
        <div style={{ ...styles.topCard, borderLeft: '3px solid #ef4444' }}>
          <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>⚠️</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444' }}>8 Critical</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Threat Vectors</div>
          </div>
        </div>
        <div style={{ ...styles.topCard, borderLeft: '3px solid #22c55e' }}>
          <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>⚙️</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>16 <span style={{ fontSize: '10px', color: '#22c55e' }}>Pass</span></div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>DevOps Pipelines</div>
          </div>
        </div>
        <div style={{ ...styles.topCard, borderLeft: '3px solid #a855f7' }}>
          <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>⚡</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#a855f7' }}>13 Running</div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Live Ranges</div>
          </div>
        </div>
      </section>

      {/* --- CORE MONITORING INTERACTION CANVAS --- */}
      <main style={styles.dashboardGrid}>
        
        {/* --- LEFT COL: MONITORING AND PERFORMANCE FEEDS --- */}
        <div>
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Cloud Management</span><span>⚙️</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#06b6d4' }}>■ AWS Node Infrastructure</span><span style={{ fontFamily: 'monospace' }}>12 / 30%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#3b82f6' }}>■ Azure File Storage</span><span style={{ fontFamily: 'monospace' }}>6.4 TB / 55%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#a855f7' }}>■ GCP VM Workspace</span><span style={{ fontFamily: 'monospace' }}>8 Core / 88%</span></div>
            </div>
          </div>

          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Cost & Resource Analysis</span><span>📈</span></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '65px', padding: '4px 0' }}>
              {[40, 70, 25, 85, 45, 60, 95, 55, 35, 80].map((h, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: '#3b82f6', height: `${h}%`, borderRadius: '2px', opacity: 0.8, boxShadow: '0 0 8px rgba(59,130,246,0.4)' }} />
              ))}
            </div>
          </div>

          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Database Performance Control</span><span>💾</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Active Connections</span><span style={{ color: '#00ffcc', fontFamily: 'monospace' }}>5.2 / 2.8%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
              <span>Backup Synchronization</span><span style={{ color: '#22c55e' }}>Scheduled</span>
            </div>
            <div style={{ backgroundColor: '#111827', height: '6px', borderRadius: '3px', overflow: 'hidden', marginTop: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '82%', height: '100%', backgroundColor: '#00ffcc', boxShadow: '0 0 10px #00ffcc' }} />
            </div>
          </div>
        </div>

        {/* --- CENTER COL: TARGET HOST OPERATIONS & LINUX LAB --- */}
        <div>
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Target Environment Matrices</span><span>🎯</span></div>
            
            {/* Target Selectors Grid */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {machines.map(m => (
                <button 
                  key={m.id}
                  onClick={() => setSelectedMachineId(m.id)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: selectedMachineId === m.id ? 'rgba(0, 255, 204, 0.1)' : '#090d16',
                    color: selectedMachineId === m.id ? '#00ffcc' : '#94a3b8',
                    borderColor: selectedMachineId === m.id ? '#00ffcc' : 'rgba(255,255,255,0.08)',
                    boxShadow: selectedMachineId === m.id ? '0 0 10px rgba(0,255,204,0.1)' : 'none'
                  }}
                >
                  {m.name} {capturedMachines.includes(m.id) && '✓'}
                </button>
              ))}
            </div>

            {/* Active Box Detail Configuration */}
            <div style={{ backgroundColor: 'rgba(9, 13, 22, 0.6)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>{selectedMachine.name} <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>({selectedMachine.ip})</span></span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: selectedMachine.difficulty === 'Hard' ? '#ef4444' : '#f59e0b' }}>[{selectedMachine.difficulty}]</span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 12px 0', lineHeight: '1.4' }}>{selectedMachine.desc}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                <span style={{ fontSize: '12px' }}>Status: <b style={{ color: selectedMachine.status === 'Running' ? '#22c55e' : '#64748b' }}>{selectedMachine.status}</b></span>
                <button 
                  onClick={() => toggleMachineStatus(selectedMachine.id)}
                  style={{
                    backgroundColor: selectedMachine.status === 'Running' ? '#7f1d1d' : '#1e293b',
                    color: selectedMachine.status === 'Running' ? '#fca5a5' : '#f1f5f9',
                    border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '500'
                  }}
                >
                  {selectedMachine.status === 'Running' ? 'Terminate Box' : 'Spawn Instance'}
                </button>
              </div>

              {/* CTF Flag Token Input */}
              <form onSubmit={(e) => handleFlagSubmit(selectedMachine, e)} style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <input 
                  type="text"
                  value={flagInputs[selectedMachine.id] || ''}
                  onChange={(e) => setFlagInputs({ ...flagInputs, [selectedMachine.id]: e.target.value })}
                  placeholder={capturedMachines.includes(selectedMachine.id) ? "Machine Pwned! Token Accepted." : "Submit Capture Token (HTB{...})"}
                  disabled={capturedMachines.includes(selectedMachine.id)}
                  style={{ flex: 1, backgroundColor: '#030712', border: '1px solid #334155', padding: '8px', borderRadius: '4px', color: '#fff', fontSize: '12px', outline: 'none' }}
                />
                <button type="submit" disabled={capturedMachines.includes(selectedMachine.id)} style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '0 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* --- GLOSSY LINUX LAB TERMINAL PANEL --- */}
          <div style={{ marginBottom: '16px' }}>
            <div style={styles.terminalContainer}>
              {terminalLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.startsWith('kali@') ? '#60a5fa' : log.includes('VULNERABILITY') ? '#f59e0b' : '#00ffcc' }}>
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
              <span style={{ color: '#60a5fa', padding: '10px 0 10px 12px', fontFamily: 'monospace', fontSize: '12px' }}>$</span>
              <input 
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type 'help' or click tools below to automatically execute inputs..."
                style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'monospace', fontSize: '12px', padding: '10px 6px' }}
              />
            </form>
          </div>
        </div>

        {/* --- RIGHT COL: SCRIPT DIRECTORY & LEGISLATIVE COMPLIANCE --- */}
        <div>
          {/* Global Leaderboard Panel */}
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Global Rankings</span><span>🏆</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}><span>#1 0xAlpha</span><span>340 pts</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}><span>#2 NullPointer</span><span>280 pts</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}><span>#3 RootKit_Ken</span><span>220 pts</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', color: '#00ffcc', fontWeight: '700' }}>
                <span>You (Local Hub)</span><span>{userPoints} pts</span>
              </div>
            </div>
          </div>

          {/* Interactive Script Engine Framework */}
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Offensive Script Library</span><span>🛠️</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { name: 'Nmap', icon: '🌐' },
                { name: 'Hydra', icon: '🔓' },
                { name: 'Metasploit', icon: '💥' },
                { name: 'SQLMap', icon: '🗄️' },
              ].map((tool) => (
                <button 
                  key={tool.name}
                  onClick={() => handleToolClick(tool.name)}
                  style={{
                    ...styles.toolButton,
                    borderColor: activeTool === tool.name ? '#00ffcc' : 'rgba(255,255,255,0.06)',
                    backgroundColor: activeTool === tool.name ? 'rgba(0, 255, 204, 0.05)' : 'rgba(15, 23, 42, 0.6)'
                  }}
                >
                  <span>{tool.icon}</span>
                  <span>{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Localized Regulatory Audit Compliance Framework Module */}
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Compliance Sandbox Boundary</span><span>⚖️</span></div>
            {auditPassed ? (
              <div style={{ color: '#22c55e', fontSize: '12px', padding: '4px 0', lineHeight: '1.4' }}>
                ✓ Compliance report successfully cataloged. Statute infraction logged systematically.
              </div>
            ) : (
              <form onSubmit={verifyComplianceAudit} style={{ fontSize: '12px' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                  An unauthorized remote web shell execution violates which specific statute of Kenyan digital legislation?
                </p>
                <select 
                  value={selectedAct} 
                  onChange={(e) => setSelectedAct(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#030712', color: '#fff', border: '1px solid #334155', padding: '6px', borderRadius: '4px', outline: 'none', fontSize: '12px' }}
                >
                  <option value="">-- Select Active Statute --</option>
                  <option value="data_protection">Data Protection Act (2019)</option>
                  <option value="cmca_2018">Computer Misuse and Cybercrimes Act (2018)</option>
                </select>
                <button type="submit" style={{ width: '100%', border: '1px solid #a855f7', background: 'transparent', color: '#a855f7', padding: '6px', borderRadius: '4px', marginTop: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                  File Compliance Audit Report
                </button>
              </form>
            )}
          </div>

          {/* Matrix Metric Progress Tracker */}
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Operator Profile Tracker</span><span>📈</span></div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>LAB COMPLETION MATRIX</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e', fontFamily: 'monospace' }}>{totalCompletion}%</div>
            <div style={{ backgroundColor: '#111827', height: '4px', borderRadius: '2px', overflow: 'hidden', marginTop: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: `${totalCompletion}%`, height: '100%', backgroundColor: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;