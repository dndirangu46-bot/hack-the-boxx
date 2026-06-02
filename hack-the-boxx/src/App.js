import React, { useState, useEffect, useRef } from 'react';

function App() {
  // --- RANGE ENVIRONMENT CORE ENGINE ---
  const [machines, setMachines] = useState([
    { id: 1, name: 'LegacyOS', ip: '10.10.10.15', difficulty: 'Easy', points: 20, os: 'Windows', status: 'Stopped', realFlag: 'HTB{ms08_067_is_classic}', desc: 'Outdated Windows server running vulnerable SMB services. Perfect for testing remote code execution handshakes.' },
    { id: 2, name: 'InjectPHP', ip: '10.10.10.42', difficulty: 'Medium', points: 40, os: 'Linux', status: 'Running', realFlag: 'HTB{rce_via_user_agent_header}', desc: 'Production web stack demonstrating a broken input filter on user-agent headers leading to immediate shell access.' },
    { id: 3, name: 'CapLog', ip: '10.10.10.89', difficulty: 'Hard', points: 80, os: 'Linux', status: 'Stopped', realFlag: 'HTB{log4j_unauthenticated_root}', desc: 'Java logging platform vulnerable to unauthenticated lookups. Requires multi-stage privilege escalation.' },
  ]);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedMachineId, setSelectedMachineId] = useState(2);
  const [userPoints, setUserPoints] = useState(120);
  const [flagInputs, setFlagInputs] = useState({ 1: '', 2: '', 3: '' });
  const [capturedMachines, setCapturedMachines] = useState([2]); 
  const [systemMessage, setSystemMessage] = useState('[SUCCESS] Flag captured for InjectPHP! +40 pts added.');
  const [selectedAct, setSelectedAct] = useState('');
  const [auditPassed, setAuditPassed] = useState(false);
  const [activeTool, setActiveTool] = useState('Nmap');

  // Interactive Mock File Explorer Engine
  const [currentFolder, setCurrentFolder] = useState('/home/kali');
  const mockFiles = {
    '/home/kali': ['proof.txt', 'loot.json', 'id_rsa'],
    '/Documents': ['network_report.pdf', 'compliance_audit.docx', 'kenya_cyber_act.pdf'],
    '/Scripts': ['exploit.py', 'scanner.sh', 'reverse_shell.php']
  };

  // Live Simulated Monitoring State Data
  const [aiMetrics, setAiMetrics] = useState([35, 45, 60, 40, 75, 50, 90, 65]);
  const [riMetrics, setRiMetrics] = useState([70, 50, 85, 40, 60, 95, 40, 80]);

  useEffect(() => {
    const dataStream = setInterval(() => {
      setAiMetrics(prev => [...prev.slice(1), Math.floor(Math.random() * 60) + 30]);
      setRiMetrics(prev => [...prev.slice(1), Math.floor(Math.random() * 55) + 40]);
    }, 4000);
    return () => clearInterval(dataStream);
  }, []);

  // Live Terminal Logs Engine
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

  // --- ACTION CONTROLLERS ---
  const toggleMachineStatus = (id) => {
    setMachines(machines.map(m => m.id === id ? { ...m, status: m.status === 'Running' ? 'Stopped' : 'Running' } : m));
  };

  const handleFlagSubmit = (machine, e) => {
    e.preventDefault();
    const guess = flagInputs[machine.id] || '';

    if (machine.status !== 'Running') {
      setSystemMessage(`[ALERT] Action denied. ${machine.name} is currently offline.`);
      return;
    }
    if (capturedMachines.includes(machine.id)) {
      setSystemMessage(`[INFO] Flag for ${machine.name} has already been verified.`);
      return;
    }
    if (guess.trim() === machine.realFlag) {
      setUserPoints(prev => prev + machine.points);
      setCapturedMachines([...capturedMachines, machine.id]);
      setSystemMessage(`[SUCCESS] Flag captured for ${machine.name}! +${machine.points} pts added to profile.`);
    } else {
      setSystemMessage(`[ERROR] Invalid token validation sequence for ${machine.name}.`);
    }
  };

  const verifyComplianceAudit = (e) => {
    e.preventDefault();
    if (selectedAct === 'cmca_2018') {
      setAuditPassed(true);
      setUserPoints(prev => prev + 25);
      setSystemMessage('[SUCCESS] Legal Audit Passed! Section 14 of the Computer Misuse and Cybercrimes Act logs authorization bounds correctly.');
    } else {
      setSystemMessage('[AUDIT FAILED] Mismatched statute rules. Web shell injection violates strict digital asset operational bounds.');
    }
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    let response = [...terminalLogs, `kali@linux-lab:~$ ${cmd}`];
    const parts = cmd.toLowerCase().split(' ');

    if (parts[0] === 'help') {
      response.push('Engines: nmap [target], hydra, clear, ls, cat [file]');
    } else if (parts[0] === 'ls') {
      response.push(mockFiles[currentFolder].join('    '));
    } else if (parts[0] === 'cat') {
      const filename = parts[1];
      if (filename && mockFiles[currentFolder].includes(filename)) {
        response.push(filename === 'proof.txt' ? 'HTB{user_access_validated_via_terminal}' : `[BINARY FEED] Data content stream for ${filename}`);
      } else {
        response.push('cat: file target parameter not specific or missing.');
      }
    } else if (parts[0] === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else {
      response.push(`Executed pipeline process instruction: ${cmd}`);
    }

    response.push('');
    setTerminalLogs(response);
    setTerminalInput('');
  };

  const handleToolClick = (toolName, commandStr) => {
    setActiveTool(toolName);
    setTerminalInput(commandStr);
    setSystemMessage(`[STAGED] Staging execution pattern for tool profile: ${toolName}`);
  };

  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];
  const totalCompletion = Math.round((capturedMachines.length / machines.length) * 100);

  // --- PREMIUM GLOSS CYBER STYLES ---
  const styles = {
    container: { backgroundColor: '#02040a', backgroundImage: 'radial-gradient(circle at 50% 0%, #0d1527 0%, #02040a 80%)', color: '#f3f4f6', minHeight: '100vh', fontFamily: '"Inter", sans-serif', padding: '20px', boxSizing: 'border-box' },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' },
    cubeIcon: { width: '14px', height: '14px', border: '2px solid #00ffcc', transform: 'rotate(45deg)', boxShadow: '0 0 12px #00ffcc' },
    navItem: { color: '#9ca3af', padding: '6px 12px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', borderRadius: '4px' },
    navItemActive: { color: '#ffffff', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '2px solid #00ffcc' },
    topMetricsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '20px' },
    topCard: { background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
    dashboardGrid: { display: 'grid', gridTemplateColumns: '1.1fr 2fr 1.1fr', gap: '16px' },
    widgetCard: { background: 'linear-gradient(180deg, rgba(13, 20, 38, 0.8) 0%, rgba(8, 12, 24, 0.9) 100%)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '8px', padding: '14px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)', marginBottom: '16px' },
    widgetHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px', marginBottom: '12px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
    terminalContainer: { backgroundColor: '#030712', borderRadius: '6px 6px 0 0', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'monospace', height: '150px', overflowY: 'auto', padding: '12px', fontSize: '12px', color: '#00ffcc' },
    toolButton: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '4px', padding: '8px 10px', color: '#cbd5e1', fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s' }
  };

  return (
    <div style={styles.container}>
      {/* --- HEADER --- */}
      <nav style={styles.navbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.cubeIcon} />
          <span style={{ fontSize: '18px', fontWeight: '800' }}>Hack <span style={{ color: '#00ffcc' }}>the</span> Boxx</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['Dashboard', 'Reports', 'Library', 'Alerts', 'Networking', 'Coding', 'Linux Lab', 'Cloud', 'Database'].map((tab) => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{...styles.navItem, ...(activeTab === tab ? styles.navItemActive : {})}}>{tab}</div>
          ))}
        </div>
      </nav>

      {/* --- BANNER TOAST FEED --- */}
      {systemMessage && (
        <div style={{ 
          padding: '10px 14px', borderRadius: '6px', fontSize: '12px', marginBottom: '14px', 
          backgroundColor: systemMessage.includes('[SUCCESS]') ? 'rgba(0, 255, 204, 0.08)' : 'rgba(30, 41, 59, 0.4)', 
          borderLeft: `3px solid ${systemMessage.includes('[SUCCESS]') ? '#00ffcc' : '#f59e0b'}`, 
          color: '#f1f5f9' 
        }}>
          {systemMessage}
        </div>
      )}

      {/* --- TOP MATRIX STATS --- */}
      <section style={styles.topMetricsRow}>
        <div style={{ ...styles.topCard, borderLeft: '3px solid #06b6d4' }}><div><div style={{ fontSize: '14px', fontWeight: '700' }}>78%</div><div style={{ fontSize: '10px', color: '#64748b' }}>Cloud Utilized</div></div></div>
        <div style={{ ...styles.topCard, borderLeft: '3px solid #3b82f6' }}><div><div style={{ fontSize: '14px', fontWeight: '700' }}>350 Active</div><div style={{ fontSize: '10px', color: '#64748b' }}>Database Clusters</div></div></div>
        <div style={{ ...styles.topCard, borderLeft: '3px solid #ef4444' }}><div><div style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444' }}>8 Critical</div><div style={{ fontSize: '10px', color: '#64748b' }}>Threat Targets</div></div></div>
        <div style={{ ...styles.topCard, borderLeft: '3px solid #22c55e' }}><div><div style={{ fontSize: '14px', fontWeight: '700' }}>16 Success</div><div style={{ fontSize: '10px', color: '#64748b' }}>DevOps Passes</div></div></div>
        <div style={{ ...styles.topCard, borderLeft: '3px solid #a855f7' }}><div><div style={{ fontSize: '14px', fontWeight: '700', color: '#a855f7' }}>13 Running</div><div style={{ fontSize: '10px', color: '#64748b' }}>Lab Sandboxes</div></div></div>
      </section>

      {/* --- MAIN OPERATIONAL LAYOUT CANVAS --- */}
      <main style={styles.dashboardGrid}>
        
        {/* LEFT COLUMN: CONTROL ARRAYS */}
        <div>
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Cloud Management Matrix</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#06b6d4' }}>■ AWS Instances</span><span>12 / 30%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#3b82f6' }}>■ Azure Storage Pods</span><span>6.4 TB / 55%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#a855f7' }}>■ GCP Container Blocks</span><span>8 Core / 88%</span></div>
            </div>
          </div>

          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Cost & Resource Load Analysis</span></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '65px', paddingBottom: '4px' }}>
              {[40, 70, 25, 85, 45, 60, 95, 55, 35, 80].map((h, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: '#3b82f6', height: `${h}%`, borderRadius: '2px', boxShadow: '0 0 6px rgba(59,130,246,0.5)' }} />
              ))}
            </div>
          </div>

          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Database Engine Pipeline</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Active Connections</span><span style={{ color: '#00ffcc', fontFamily: 'monospace' }}>5.2 / 2.80%</span>
            </div>
            <div style={{ backgroundColor: '#111827', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '82%', height: '100%', backgroundColor: '#00ffcc', boxShadow: '0 0 10px #00ffcc' }} />
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: TARGET SYSTEM CONSOLE & LAB EXECUTIONS */}
        <div>
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Target Environment Matrices</span></div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {machines.map(m => (
                <button key={m.id} onClick={() => setSelectedMachineId(m.id)} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', fontWeight: '600', backgroundColor: selectedMachineId === m.id ? 'rgba(0, 255, 204, 0.1)' : '#090d16', color: selectedMachineId === m.id ? '#00ffcc' : '#94a3b8', cursor: 'pointer', borderColor: selectedMachineId === m.id ? '#00ffcc' : 'rgba(255,255,255,0.08)' }}>
                  {m.name} {capturedMachines.includes(m.id) && '✓'}
                </button>
              ))}
            </div>

            <div style={{ backgroundColor: 'rgba(9, 13, 22, 0.6)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>{selectedMachine.name} <span style={{ color: '#64748b', fontFamily: 'monospace' }}>({selectedMachine.ip})</span></span>
                <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: '600' }}>[{selectedMachine.difficulty}]</span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0', lineHeight: '1.4' }}>{selectedMachine.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                <span style={{ fontSize: '12px' }}>Status: <b style={{ color: selectedMachine.status === 'Running' ? '#22c55e' : '#64748b' }}>{selectedMachine.status}</b></span>
                <button onClick={() => toggleMachineStatus(selectedMachine.id)} style={{ backgroundColor: selectedMachine.status === 'Running' ? '#7f1d1d' : '#1e293b', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>
                  {selectedMachine.status === 'Running' ? 'Terminate Box' : 'Spawn Instance'}
                </button>
              </div>

              <form onSubmit={(e) => handleFlagSubmit(selectedMachine, e)} style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <input type="text" value={flagInputs[selectedMachine.id] || ''} onChange={(e) => setFlagInputs({ ...flagInputs, [selectedMachine.id]: e.target.value })} placeholder={capturedMachines.includes(selectedMachine.id) ? "Machine Pwned! Token Accepted." : "Submit Capture Token (HTB{...})"} disabled={capturedMachines.includes(selectedMachine.id)} style={{ flex: 1, backgroundColor: '#030712', border: '1px solid #334155', padding: '8px', borderRadius: '4px', color: '#fff', fontSize: '12px', outline: 'none' }} />
                <button type="submit" disabled={capturedMachines.includes(selectedMachine.id)} style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '0 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Send</button>
              </form>
            </div>
          </div>

          {/* ADVANCED LINUX LAB TERMINAL WITH WIRED LIVE FILE MANAGER */}
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Linux Lab Interactive Engine</span></div>
            <div style={styles.terminalContainer}>
              {terminalLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.startsWith('kali@') ? '#60a5fa' : log.includes('VULNERABILITY') ? '#f59e0b' : '#00ffcc' }}>{log}</div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '2px' }}>
              <span style={{ color: '#60a5fa', padding: '8px 4px 8px 12px', fontFamily: 'monospace', fontSize: '12px' }}>$</span>
              <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="Type commands or trigger automated script library arrays..." style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }} />
            </form>

            {/* LIVE REACTIVE FILES EXPANSION MODULE */}
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#090d16', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                {['/home/kali', '/Documents', '/Scripts'].map(folder => (
                  <button key={folder} onClick={() => setCurrentFolder(folder)} style={{ background: currentFolder === folder ? 'rgba(0, 255, 204, 0.12)' : 'transparent', border: '1px solid rgba(255,255,255,0.05)', color: '#00ffcc', fontSize: '11px', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', fontWeight: '600' }}>📁 {folder}</button>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Active Folder Contents: {mockFiles[currentFolder].map(f => (
                  <span key={f} onClick={() => setTerminalInput(`cat ${f}`)} style={{ color: '#fff', marginLeft: '12px', fontFamily: 'monospace', cursor: 'pointer', textDecoration: 'underline' }}>📄 {f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECTIFIED ANALYTICS MATRIX & LEGISLATION STATUTES */}
        <div>
          {/* COMPLETE DEPLOYED TOOLKIT MATRIX PANEL */}
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Offensive Script Library</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { name: 'Nmap', cmd: 'nmap 10.10.10.42' },
                { name: 'Hydra', cmd: 'hydra -l admin -P pass.txt 10.10.10.42 ssh' },
                { name: 'Metasploit', cmd: 'msfconsole -q' },
                { name: 'SQLMap', cmd: 'sqlmap -u "http://10.10.10.42/index.php?id=1"' },
                { name: 'Wireshark', cmd: 'tshark -i eth0' },
                { name: 'OpenVAS', cmd: 'openvas-nasl -t 10.10.10.42' }
              ].map(tool => (
                <button key={tool.name} onClick={() => handleToolClick(tool.name, tool.cmd)} style={{...styles.toolButton, borderColor: activeTool === tool.name ? '#00ffcc' : 'rgba(255,255,255,0.06)', backgroundColor: activeTool === tool.name ? 'rgba(0,255,204,0.05)' : 'rgba(15,23,42,0.6)'}}>
                  <span>⚡ {tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STATUTE ASSIGNMENT CONTROLLER */}
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>Compliance Sandbox Boundary</span></div>
            {auditPassed ? (
              <div style={{ color: '#22c55e', fontSize: '12px', lineHeight: '1.4' }}>
                ✓ Compliance Audit Verification Logged. Section 14 Infraction recorded inside system profile ledger.
              </div>
            ) : (
              <form onSubmit={verifyComplianceAudit} style={{ fontSize: '12px' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                  An unauthorized web shell context execution violates which parameter of Kenyan digital legislation?
                </p>
                <select value={selectedAct} onChange={(e) => setSelectedAct(e.target.value)} style={{ width: '100%', backgroundColor: '#030712', color: '#fff', border: '1px solid #334155', padding: '8px', borderRadius: '4px', outline: 'none' }}>
                  <option value="">-- Choose Regulatory Framework --</option>
                  <option value="data_protection">Data Protection Act (2019)</option>
                  <option value="cmca_2018">Computer Misuse and Cybercrimes Act (2018)</option>
                </select>
                <button type="submit" style={{ width: '100%', border: '1px solid #a855f7', background: 'transparent', color: '#a855f7', padding: '8px', borderRadius: '4px', marginTop: '10px', cursor: 'pointer', fontWeight: '600' }}>
                  File Audit Evaluation
                </button>
              </form>
            )}
          </div>

          {/* WIRE RESILIENT ANIMATED CHARTS */}
          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>AI Anomaly Monitoring</span></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '50px' }}>
              {aiMetrics.map((val, idx) => (
                <div key={idx} style={{ flex: 1, backgroundColor: '#a855f7', height: `${val}%`, transition: 'height 0.4s ease', borderRadius: '1px' }} />
              ))}
            </div>
          </div>

          <div style={styles.widgetCard}>
            <div style={styles.widgetHeader}><span>System Forecast Analyzer</span></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '50px' }}>
              {riMetrics.map((val, idx) => (
                <div key={idx} style={{ flex: 1, backgroundColor: '#22c55e', height: `${val}%`, transition: 'height 0.4s ease', borderRadius: '1px' }} />
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;