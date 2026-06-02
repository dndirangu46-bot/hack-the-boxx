import React, { useState, useEffect, useRef } from 'react';

function App() {
  // --- STATE MOTORS ---
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
  const [systemMessage, setSystemMessage] = useState('[SUCCESS] Environment synced. Core cyber-range infrastructure online.');
  const [selectedAct, setSelectedAct] = useState('');
  const [auditPassed, setAuditPassed] = useState(false);
  const [activeTool, setActiveTool] = useState('Nmap');

  // File System State
  const [currentFolder, setCurrentFolder] = useState('/home/kali');
  const mockFiles = {
    '/home/kali': ['proof.txt', 'loot.json', 'id_rsa'],
    '/Documents': ['network_report.pdf', 'compliance_audit.docx', 'kenya_cyber_act.pdf'],
    '/Scripts': ['exploit.py', 'scanner.sh', 'reverse_shell.php']
  };

  // Live Chart Feeds
  const [aiMetrics, setAiMetrics] = useState([35, 45, 60, 40, 75, 50, 90, 65, 45, 70, 85, 40]);
  const [riMetrics, setRiMetrics] = useState([70, 50, 85, 40, 60, 95, 40, 80, 55, 90, 65, 30]);

  useEffect(() => {
    const dataStream = setInterval(() => {
      setAiMetrics(prev => [...prev.slice(1), Math.floor(Math.random() * 60) + 30]);
      setRiMetrics(prev => [...prev.slice(1), Math.floor(Math.random() * 55) + 40]);
    }, 3000);
    return () => clearInterval(dataStream);
  }, []);

  // Terminal Console Feed
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    'Welcome to CYBER-RANGE // Interactive Console v1.0.4',
    'Type "help" to view available offensive assessment tools.',
    'kali@linux-lab:~$ nmap 10.10.10.42',
    'Starting Nmap 7.92 reconnaissance probe at node 10.10.10.42...',
    'PORT      STATE SERVICE VERSION',
    '80/tcp    open  http    Apache httpd 2.4.41',
    '[+] VULNERABILITY DETECTED: Arbitrary PHP code payload injection accessible via HTTP User-Agent header.',
    ''
  ]);

  const terminalEndRef = useRef(null);
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // --- ACTIONS ---
  const toggleMachineStatus = (id) => {
    setMachines(machines.map(m => m.id === id ? { ...m, status: m.status === 'Running' ? 'Stopped' : 'Running' } : m));
  };

  const handleFlagSubmit = (machine, e) => {
    e.preventDefault();
    const guess = flagInputs[machine.id] || '';
    if (machine.status !== 'Running') {
      setSystemMessage(`[ALERT] Action denied. ${machine.name} is offline.`);
      return;
    }
    if (guess.trim() === machine.realFlag) {
      setUserPoints(prev => prev + machine.points);
      setCapturedMachines([...capturedMachines, machine.id]);
      setSystemMessage(`[SUCCESS] Flag captured for ${machine.name}! +${machine.points} pts.`);
    } else {
      setSystemMessage(`[ERROR] Invalid token validation sequence for ${machine.name}.`);
    }
  };

  const verifyComplianceAudit = (e) => {
    e.preventDefault();
    if (selectedAct === 'cmca_2018') {
      setAuditPassed(true);
      setUserPoints(prev => prev + 25);
      setSystemMessage('[SUCCESS] Legal Audit Passed! Section 14 authorization bounds mapped.');
    } else {
      setSystemMessage('[AUDIT FAILED] Non-compliant framework parameter selected.');
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
        response.push(filename === 'proof.txt' ? 'HTB{user_access_validated_via_terminal}' : `[BINARY FEED] Object data stream for ${filename}`);
      } else {
        response.push('cat: file missing or format unreadable.');
      }
    } else if (parts[0] === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else {
      response.push(`Process completed: ${parts[0]}`);
    }

    response.push('');
    setTerminalLogs(response);
    setTerminalInput('');
  };

  const handleToolClick = (toolName, commandStr) => {
    setActiveTool(toolName);
    setTerminalInput(commandStr);
  };

  const selectedMachine = machines.find(m => m.id === selectedMachineId) || machines[0];

  const styles = {
    container: { backgroundColor: '#02040a', backgroundImage: 'radial-gradient(circle at 50% 0%, #0c152b 0%, #02040a 80%)', color: '#f3f4f6', minHeight: '100vh', fontFamily: '"Inter", sans-serif', padding: '16px', boxSizing: 'border-box' },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px' },
    logo: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' },
    cube: { width: '12px', height: '12px', border: '2px solid #00ffcc', transform: 'rotate(45deg)', boxShadow: '0 0 10px #00ffcc' },
    navTabs: { display: 'flex', gap: '4px' },
    navItem: { color: '#94a3b8', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', borderRadius: '4px', transition: 'all 0.2s' },
    navItemActive: { color: '#ffffff', backgroundColor: 'rgba(0, 255, 204, 0.06)', borderBottom: '2px solid #00ffcc' },
    metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' },
    metricCard: { background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.3) 100%)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '6px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px' },
    layoutGrid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr 1.2fr', gap: '14px' },
    card: { background: 'linear-gradient(180deg, rgba(13, 20, 38, 0.85) 0%, rgba(8, 12, 24, 0.95) 100%)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '8px', padding: '14px', marginBottom: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px', marginBottom: '12px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
    terminal: { backgroundColor: '#030712', borderRadius: '6px 6px 0 0', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'monospace', height: '145px', overflowY: 'auto', padding: '10px', fontSize: '12px', color: '#00ffcc', lineHeight: '1.4' },
    toolGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' },
    toolBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '4px', padding: '8px', color: '#cbd5e1', fontSize: '11px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' },
    riskBar: { height: '8px', borderRadius: '4px', backgroundColor: '#1e293b', overflow: 'hidden', display: 'flex' }
  };

  return (
    <div style={styles.container}>
      {/* --- UPPER NAVIGATION NAVBAR --- */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <div style={styles.cube} />
          <span>Hack <span style={{ color: '#00ffcc' }}>the</span> Boxx</span>
        </div>
        <div style={styles.navTabs}>
          {['Dashboard', 'Reports', 'Library', 'Alerts', 'Networking', 'Coding', 'Linux Lab', 'Cloud', 'Database'].map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.navItem, ...(activeTab === tab ? styles.navItemActive : {}) }}>{tab}</div>
          ))}
        </div>
      </nav>

      {/* --- NOTIFICATION LOG BANNER --- */}
      {systemMessage && (
        <div style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px', backgroundColor: 'rgba(0, 255, 204, 0.06)', borderLeft: '3px solid #00ffcc', color: '#cbd5e1' }}>
          {systemMessage}
        </div>
      )}

      {/* --- TOP ROW GLOBAL METRICS --- */}
      <section style={styles.metricsRow}>
        <div style={{ ...styles.metricCard, borderLeft: '3px solid #06b6d4' }}><div><div style={{ fontSize: '15px', fontWeight: '700' }}>68% <span style={{ fontSize: '10px', color: '#06b6d4' }}>Utilized</span></div><div style={{ fontSize: '10px', color: '#64748b' }}>Cloud Usage</div></div></div>
        <div style={{ ...styles.metricCard, borderLeft: '3px solid #3b82f6' }}><div><div style={{ fontSize: '15px', fontWeight: '700' }}>310 <span style={{ fontSize: '10px', color: '#3b82f6' }}>Active</span></div><div style={{ fontSize: '10px', color: '#64748b' }}>Database Queries</div></div></div>
        <div style={{ ...styles.metricCard, borderLeft: '3px solid #ef4444' }}><div><div style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444' }}>6 Critical</div><div style={{ fontSize: '10px', color: '#64748b' }}>Security Threats</div></div></div>
        <div style={{ ...styles.metricCard, borderLeft: '3px solid #22c55e' }}><div><div style={{ fontSize: '15px', fontWeight: '700' }}>13 Triage</div><div style={{ fontSize: '10px', color: '#64748b' }}>DevOps Builds</div></div></div>
        <div style={{ ...styles.metricCard, borderLeft: '3px solid #a855f7' }}><div><div style={{ fontSize: '15px', fontWeight: '700', color: '#a855f7' }}>13 Running</div><div style={{ fontSize: '10px', color: '#64748b' }}>DevOps Builds</div></div></div>
      </section>

      {/* --- THREE COLUMN HIGH FIDELITY LAYOUT --- */}
      <main style={styles.layoutGrid}>
        
        {/* COLUMN 1: ARCHITECTURE CONTROL LIST */}
        <div>
          <div style={styles.card}>
            <div style={styles.cardHeader}><span>Cloud Management</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#06b6d4', fontWeight: '600' }}>AWS Instances</span><span>12 / 30%</span></div>
                <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px' }}><div style={{ width: '30%', height: '100%', backgroundColor: '#06b6d4' }} /></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#3b82f6', fontWeight: '600' }}>Azure Storage</span><span>6.4 TB / 55%</span></div>
                <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px' }}><div style={{ width: '55%', height: '100%', backgroundColor: '#3b82f6' }} /></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#a855f7', fontWeight: '600' }}>GCP CPU</span><span>6DU / 88%</span></div>
                <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px' }}><div style={{ width: '88%', height: '100%', backgroundColor: '#a855f7' }} /></div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}><span>Cost Analysis</span></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '65px', paddingBottom: '4px' }}>
              {[35, 55, 75, 40, 60, 90, 45, 65, 80, 50, 70, 95].map((h, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: '#00ffcc', height: `${h}%`, borderRadius: '1px', boxShadow: '0 0 4px rgba(0,255,204,0.3)' }} />
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}><span>Database Control</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Active Connections</span><span style={{ color: '#22c55e', fontFamily: 'monospace' }}>5.2 / 2.00%</span>
            </div>
            <div style={{ backgroundColor: '#111827', height: '5px', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{ width: '65%', height: '100%', backgroundColor: '#22c55e' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#64748b' }}>Backup Status</span><span style={{ color: '#00ffcc', fontWeight: '600' }}>Scheduled ➔</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: CENTER MATRIX & VIRTUAL CONSOLE */}
        <div>
          <div style={styles.card}>
            <div style={styles.cardHeader}><span>Target Environment Matrices</span></div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {machines.map(m => (
                <button key={m.id} onClick={() => setSelectedMachineId(m.id)} style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', fontWeight: '600', backgroundColor: selectedMachineId === m.id ? 'rgba(0, 255, 204, 0.08)' : '#070a12', color: selectedMachineId === m.id ? '#00ffcc' : '#94a3b8', cursor: 'pointer', borderColor: selectedMachineId === m.id ? '#00ffcc' : 'rgba(255,255,255,0.08)' }}>
                  {m.name} {capturedMachines.includes(m.id) && '✓'}
                </button>
              ))}
            </div>

            <div style={{ backgroundColor: '#070a12', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: '700' }}>{selectedMachine.name} <span style={{ color: '#64748b', fontFamily: 'monospace' }}>({selectedMachine.ip})</span></span>
                <span style={{ color: '#f59e0b', fontWeight: '600', fontSize: '11px' }}>[{selectedMachine.difficulty}]</span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '6px 0', lineHeight: '1.4' }}>{selectedMachine.desc}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px', fontSize: '11px' }}>
                <span>Node State: <b style={{ color: selectedMachine.status === 'Running' ? '#22c55e' : '#64748b' }}>{selectedMachine.status}</b></span>
                <button onClick={() => toggleMachineStatus(selectedMachine.id)} style={{ backgroundColor: selectedMachine.status === 'Running' ? '#7f1d1d' : '#1e293b', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>
                  {selectedMachine.status === 'Running' ? 'Terminate Node' : 'Spawn Node'}
                </button>
              </div>

              <form onSubmit={(e) => handleFlagSubmit(selectedMachine, e)} style={{ display: 'flex', gap: '4px' }}>
                <input type="text" value={flagInputs[selectedMachine.id] || ''} onChange={(e) => setFlagInputs({ ...flagInputs, [selectedMachine.id]: e.target.value })} placeholder={capturedMachines.includes(selectedMachine.id) ? "Target Root Compromised" : "Submit Root Flag Token (HTB{...})"} disabled={capturedMachines.includes(selectedMachine.id)} style={{ flex: 1, backgroundColor: '#020408', border: '1px solid #1e293b', padding: '6px 10px', borderRadius: '4px', color: '#fff', fontSize: '11px', outline: 'none' }} />
                <button type="submit" disabled={capturedMachines.includes(selectedMachine.id)} style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '0 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>Verify</button>
              </form>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}><span>Linux Lab Workstation</span></div>
            <div style={styles.terminal}>
              {terminalLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.startsWith('kali@') ? '#60a5fa' : log.includes('VULNERABILITY') ? '#f59e0b' : '#00ffcc' }}>{log}</div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '2px' }}>
              <span style={{ color: '#60a5fa', padding: '6px 4px 6px 10px', fontFamily: 'monospace', fontSize: '12px' }}>$</span>
              <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="Send instruction or load automated offensive tools array..." style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }} />
            </form>

            {/* INTEGRATED RECTIFIED FILE EXPLORER */}
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#070a12', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                {['/home/kali', '/Documents', '/Scripts'].map(folder => (
                  <button key={folder} onClick={() => setCurrentFolder(folder)} style={{ background: currentFolder === folder ? 'rgba(0, 255, 204, 0.1)' : 'transparent', border: '1px solid rgba(255,255,255,0.05)', color: '#00ffcc', fontSize: '11px', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}>📁 {folder}</button>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Directory Nodes: {mockFiles[currentFolder].map(f => (
                  <span key={f} onClick={() => setTerminalInput(`cat ${f}`)} style={{ color: '#ffffff', marginLeft: '10px', fontFamily: 'monospace', cursor: 'pointer', textDecoration: 'underline' }}>📄 {f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: CYBERSECURITY THREAT CENTER & ANALYTICS */}
        <div>
          {/* HIGH FIDELITY SEC CENTER UPGRADE */}
          <div style={styles.card}>
            <div style={styles.cardHeader}><span>Comprehensive Security Threat Center</span></div>
            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>High Risk Targets</span><span style={{ color: '#ef4444' }}>89%</span></div>
                <div style={styles.riskBar}><div style={{ width: '89%', backgroundColor: '#ef4444' }} /></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>Medium Risk Target Vectors</span><span style={{ color: '#f59e0b' }}>55%</span></div>
                <div style={styles.riskBar}><div style={{ width: '55%', backgroundColor: '#f59e0b' }} /></div>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px', marginTop: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>WAF Protection Rules</span><span style={{ color: '#22c55e' }}>Enabled</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginTop: '4px' }}>
                  <span>Intrusion Anomalies</span><span style={{ color: '#ef4444' }}>5 Detected</span>
                </div>
              </div>
            </div>
          </div>

          {/* SCRIPT TOOL LIBRARY EXPANSION ARRAYS */}
          <div style={styles.card}>
            <div style={styles.cardHeader}><span>Offensive Script Library</span></div>
            <div style={styles.toolGrid}>
              {[
                { name: 'Nmap', cmd: 'nmap -sV 10.10.10.42' },
                { name: 'Metasploit', cmd: 'msfconsole -q' },
                { name: 'SQLMap', cmd: 'sqlmap -u "http://10.10.10.42/"' },
                { name: 'Hydra', cmd: 'hydra -l root -P passes.txt 10.10.10.42 ssh' },
                { name: 'Netstat', cmd: 'netstat -antp' },
                { name: 'Wireshark', cmd: 'tshark -i eth0' },
                { name: 'HTop', cmd: 'htop' },
                { name: 'Lynis', cmd: 'lynis audit system' }
              ].map(tool => (
                <button key={tool.name} onClick={() => handleToolClick(tool.name, tool.cmd)} style={{ ...styles.toolBtn, borderColor: activeTool === tool.name ? '#00ffcc' : 'rgba(255,255,255,0.06)', backgroundColor: activeTool === tool.name ? 'rgba(0,255,204,0.04)' : 'rgba(15,23,42,0.5)' }}>
                  <span style={{ color: activeTool === tool.name ? '#00ffcc' : '#94a3b8' }}>⚡</span> {tool.name}
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC ANALYSIS DATA CHARTS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={styles.card}>
              <div style={styles.cardHeader}><span>AI Analytics</span></div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '45px' }}>
                {aiMetrics.map((v, i) => <div key={i} style={{ flex: 1, backgroundColor: '#a855f7', height: `${v}%`, borderRadius: '1px', transition: 'height 0.3s ease' }} />)}
              </div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardHeader}><span>RI Analysis</span></div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '45px' }}>
                {riMetrics.map((v, i) => <div key={i} style={{ flex: 1, backgroundColor: '#22c55e', height: `${v}%`, borderRadius: '1px', transition: 'height 0.3s ease' }} />)}
              </div>
            </div>
          </div>

          {/* COMPLIANCE BOUNDARY COMPONENT */}
          <div style={styles.card}>
            <div style={styles.cardHeader}><span>Compliance Sandbox Boundary</span></div>
            {auditPassed ? (
              <div style={{ color: '#22c55e', fontSize: '11px', lineHeight: '1.4' }}>
                ✓ Compliance Audit Verified. Section 14 Infraction recorded inside system profile ledger.
              </div>
            ) : (
              <form onSubmit={verifyComplianceAudit} style={{ fontSize: '11px' }}>
                <select value={selectedAct} onChange={(e) => setSelectedAct(e.target.value)} style={{ width: '100%', backgroundColor: '#020408', color: '#fff', border: '1px solid #1e293b', padding: '6px', borderRadius: '4px', outline: 'none' }}>
                  <option value="">-- Choose Regulatory Framework --</option>
                  <option value="data_protection">Data Protection Act (2019)</option>
                  <option value="cmca_2018">Computer Misuse and Cybercrimes Act (2018)</option>
                </select>
                <button type="submit" style={{ width: '100%', border: '1px solid #a855f7', background: 'transparent', color: '#a855f7', padding: '6px', borderRadius: '4px', marginTop: '6px', cursor: 'pointer', fontWeight: '600' }}>
                  File Evaluation
                </button>
              </form>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;