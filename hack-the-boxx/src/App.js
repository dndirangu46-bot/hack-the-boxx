import React, { useState, useEffect, useRef } from 'react';

function App() {
  // --- APPLICATION STATE ENGINE ---
  const [machines, setMachines] = useState([
    { id: 1, name: 'LegacyOS', ip: '192.168.1.15', difficulty: 'Easy', points: 20, os: 'Windows', status: 'Stopped', realFlag: 'HTB{ms08_067_is_classic}', desc: 'Outdated Windows server running vulnerable SMB services.' },
    { id: 2, name: 'InjectPHP', ip: '192.168.1.10', difficulty: 'Medium', points: 40, os: 'Linux', status: 'Running', realFlag: 'HTB{rce_via_user_agent_header}', desc: 'Production web stack demonstrating a broken input filter on user-agent headers.' },
    { id: 3, name: 'CapLog', ip: '192.168.1.89', difficulty: 'Hard', points: 80, os: 'Linux', status: 'Stopped', realFlag: 'HTB{log4j_unauthenticated_root}', desc: 'Java logging platform vulnerable to unauthenticated lookups.' },
  ]);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedMachineId, setSelectedMachineId] = useState(2);
  const [userPoints, setUserPoints] = useState(120);
  const [flagInputs, setFlagInputs] = useState({ 1: '', 2: '', 3: '' });
  const [capturedMachines, setCapturedMachines] = useState([2]); 
  const [systemMessage, setSystemMessage] = useState('[SUCCESS] High-fidelity cyber-range console initialized.');
  const [selectedAct, setSelectedAct] = useState('');
  const [auditPassed, setAuditPassed] = useState(false);
  const [activeTool, setActiveTool] = useState('Nmap');

  // File System Workspace
  const [currentFolder, setCurrentFolder] = useState('/home/kali');
  const mockFiles = {
    '/home/kali': ['proof.txt', 'loot.json', 'id_rsa'],
    '/Documents': ['network_report.pdf', 'compliance_audit.docx', 'kenya_cyber_act.pdf'],
    '/Scripts': ['exploit.py', 'scanner.sh', 'reverse_shell.php']
  };

  // Real-Time Diagnostic Feed Simulation
  const [aiMetrics, setAiMetrics] = useState([40, 55, 45, 60, 50, 75, 40, 65, 80, 55, 70, 60]);
  const [riMetrics, setRiMetrics] = useState([65, 45, 70, 50, 85, 40, 60, 95, 50, 75, 60, 45]);

  useEffect(() => {
    const liveStream = setInterval(() => {
      setAiMetrics(prev => [...prev.slice(1), Math.floor(Math.random() * 50) + 35]);
      setRiMetrics(prev => [...prev.slice(1), Math.floor(Math.random() * 55) + 40]);
    }, 2500);
    return () => clearInterval(liveStream);
  }, []);

  // Sandbox Linux Terminal Terminal Feed
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    'Welcome to CYBER-RANGE // Interactive Workspace Console v1.0.4',
    'kali@linux-lab:~$ nmap -sV 192.168.1.10',
    'Scanning..',
    'Open Ports Found: 22, 80, 443',
    'Service Detection Complete.',
    ''
  ]);

  const terminalEndRef = useRef(null);
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // --- COMPONENT MUTATORS ---
  const handleFlagSubmit = (machine, e) => {
    e.preventDefault();
    const guess = flagInputs[machine.id] || '';
    if (machine.status !== 'Running') {
      setSystemMessage(`[ALERT] Action rejected. Target host node ${machine.name} is offline.`);
      return;
    }
    if (guess.trim() === machine.realFlag) {
      setUserPoints(prev => prev + machine.points);
      setCapturedMachines([...capturedMachines, machine.id]);
      setSystemMessage(`[SUCCESS] Root system compromised! +${machine.points} Score Points assigned.`);
    } else {
      setSystemMessage('[ERROR] Target validation challenge failed. Access signature signature mismatch.');
    }
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    let updatedLogs = [...terminalLogs, `kali@linux-lab:~$ ${cmd}`];
    const normalizedCmd = cmd.toLowerCase().split(' ');

    if (normalizedCmd[0] === 'help') {
      updatedLogs.push('Available tools: nmap, msfconsole, sqlmap, hydra, ls, cat [file], clear');
    } else if (normalizedCmd[0] === 'ls') {
      updatedLogs.push(mockFiles[currentFolder].join('    '));
    } else if (normalizedCmd[0] === 'cat') {
      const targetFile = normalizedCmd[1];
      if (targetFile && mockFiles[currentFolder].includes(targetFile)) {
        updatedLogs.push(targetFile === 'proof.txt' ? 'HTB{terminal_root_access_acquired}' : `[FEED STACK] Read payload out from ${targetFile}`);
      } else {
        updatedLogs.push('cat: designated file could not be mapped.');
      }
    } else if (normalizedCmd[0] === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else {
      updatedLogs.push(`Execution profile complete: ${normalizedCmd[0]}`);
    }

    updatedLogs.push('');
    setTerminalLogs(updatedLogs);
    setTerminalInput('');
  };

  const executeLibraryTool = (name, statement) => {
    setActiveTool(name);
    setTerminalInput(statement);
    setSystemMessage(`[STAGED] Loaded ${name} script toolkit vector.`);
  };

  const currentMachine = machines.find(m => m.id === selectedMachineId) || machines[0];

  const styles = {
    wrapper: { backgroundColor: '#02040a', backgroundImage: 'radial-gradient(circle at 50% 0%, #0c152b 0%, #02040a 85%)', color: '#f3f4f6', minHeight: '100vh', fontFamily: '"Inter", system-ui, sans-serif', padding: '16px', boxSizing: 'border-box' },
    navBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px' },
    branding: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '19px', fontWeight: '800', letterSpacing: '-0.5px' },
    brandCube: { width: '14px', height: '14px', border: '2px solid #00ffcc', transform: 'rotate(45deg)', boxShadow: '0 0 10px #00ffcc' },
    tabRow: { display: 'flex', gap: '4px' },
    tabElement: { color: '#94a3b8', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', borderRadius: '4px', transition: 'all 0.2s' },
    tabActive: { color: '#ffffff', backgroundColor: 'rgba(0, 255, 204, 0.06)', borderBottom: '2px solid #00ffcc' },
    statRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' },
    statBox: { background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.3) 100%)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '6px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' },
    appGrid: { display: 'grid', gridTemplateColumns: '1fr 1.8fr 1.2fr', gap: '14px' },
    panel: { background: 'linear-gradient(180deg, rgba(13, 20, 38, 0.85) 0%, rgba(8, 12, 24, 0.95) 100%)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '8px', padding: '14px', marginBottom: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '8px', marginBottom: '12px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
    cliScreen: { backgroundColor: '#030712', borderRadius: '6px 6px 0 0', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'monospace', height: '160px', overflowY: 'auto', padding: '10px', fontSize: '12px', color: '#00ffcc', lineHeight: '1.4' },
    gridButtons: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' },
    toolActionBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '4px', padding: '8px', color: '#cbd5e1', fontSize: '11px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' },
    progressPipe: { height: '8px', borderRadius: '4px', backgroundColor: '#1e293b', overflow: 'hidden', display: 'flex' }
  };

  return (
    <div style={styles.wrapper}>
      {/* HEADER BANNER NAVIGATION */}
      <nav style={styles.navBar}>
        <div style={styles.branding}>
          <div style={styles.brandCube} />
          <span>Hack <span style={{ color: '#00ffcc' }}>the</span> Boxx</span>
        </div>
        <div style={styles.tabRow}>
          {['Dashboard', 'Reports', 'Library', 'Alerts', 'Networking', 'Coding', 'Linux Lab', 'Cloud', 'Database', 'Admin'].map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{ ...styles.tabElement, ...(activeTab === tab ? styles.tabActive : {}) }}>{tab}</div>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: '#00ffcc', fontFamily: 'monospace', border: '1px solid #00ffcc', padding: '4px 10px', borderRadius: '4px', background: 'rgba(0,255,204,0.05)' }}>
          SCORE: {userPoints} PTS
        </div>
      </nav>

      {/* ERROR / EXCEPTION LOG STATUS BLOCK */}
      {systemMessage && (
        <div style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px', backgroundColor: 'rgba(0, 255, 204, 0.06)', borderLeft: '3px solid #00ffcc', color: '#cbd5e1', fontFamily: 'monospace' }}>
          {systemMessage}
        </div>
      )}

      {/* TOP DEPLOYMENT METRICS INFRASTRUCTURE */}
      <section style={styles.statRow}>
        <div style={{ ...styles.statBox, borderLeft: '3px solid #06b6d4' }}><div><div style={{ fontSize: '15px', fontWeight: '700' }}>78% <span style={{ fontSize: '10px', color: '#06b6d4' }}>Utilized</span></div><div style={{ fontSize: '10px', color: '#64748b' }}>Cloud Usage</div></div></div>
        <div style={{ ...styles.statBox, borderLeft: '3px solid #3b82f6' }}><div><div style={{ fontSize: '15px', fontWeight: '700' }}>350 <span style={{ fontSize: '10px', color: '#3b82f6' }}>Active</span></div><div style={{ fontSize: '10px', color: '#64748b' }}>Database Queries</div></div></div>
        <div style={{ ...styles.statBox, borderLeft: '3px solid #ef4444' }}><div><div style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444' }}>8 Critical</div><div style={{ fontSize: '10px', color: '#64748b' }}>Security Threats</div></div></div>
        <div style={{ ...styles.statBox, borderLeft: '3px solid #22c55e' }}><div><div style={{ fontSize: '15px', fontWeight: '700' }}>16 Success</div><div style={{ fontSize: '10px', color: '#64748b' }}>DevOps Pipelines</div></div></div>
        <div style={{ ...styles.statBox, borderLeft: '3px solid #a855f7' }}><div><div style={{ fontSize: '15px', fontWeight: '700', color: '#a855f7' }}>13 Running</div><div style={{ fontSize: '10px', color: '#64748b' }}>Live Labs</div></div></div>
      </section>

      {/* THREE PANELS VIEW LAYOUT FRAMEWORK */}
      <main style={styles.appGrid}>
        
        {/* LEFT COMPONENT COLUMN */}
        <div>
          <div style={styles.panel}>
            <div style={styles.panelHeader}><span>Cloud Management</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#06b6d4' }}>AWS Instances</span><span>12 / 30%</span></div>
                <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px' }}><div style={{ width: '30%', height: '100%', backgroundColor: '#06b6d4' }} /></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#3b82f6' }}>Azure Storage</span><span>6.4 TB / 55%</span></div>
                <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px' }}><div style={{ width: '55%', height: '100%', backgroundColor: '#3b82f6' }} /></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ color: '#a855f7' }}>GCP CPU Capacity</span><span>6DU / 88%</span></div>
                <div style={{ height: '4px', backgroundColor: '#1e293b', borderRadius: '2px' }}><div style={{ width: '88%', height: '100%', backgroundColor: '#a855f7' }} /></div>
              </div>
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}><span>Cost Analysis</span></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '65px', paddingBottom: '4px' }}>
              {[35, 55, 75, 40, 60, 90, 45, 65, 80, 50, 70, 95].map((h, i) => (
                <div key={i} style={{ flex: 1, backgroundColor: '#00ffcc', height: `${h}%`, borderRadius: '1px' }} />
              ))}
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}><span>Database Performance Control</span></div>
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

        {/* CENTER HIGH-FIDELITY COLUMN */}
        <div>
          {/* COMPREHENSIVE SECURITY THREAT CENTER PANEL */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}><span>Comprehensive Security Threat Center</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>Vulnerability Scan Results</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>High Risk Threats</span><span style={{ color: '#ef4444' }}>89%</span></div>
                    <div style={styles.progressPipe}><div style={{ width: '89%', backgroundColor: '#ef4444' }} /></div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>Medium Risk Threats</span><span style={{ color: '#f59e0b' }}>55%</span></div>
                    <div style={styles.progressPipe}><div style={{ width: '55%', backgroundColor: '#f59e0b' }} /></div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}><span>Low Risk Threats</span><span style={{ color: '#22c55e' }}>35%</span></div>
                    <div style={styles.progressPipe}><div style={{ width: '35%', backgroundColor: '#22c55e' }} /></div>
                  </div>
                </div>
              </div>
              
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: '16px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', marginBottom: '6px' }}>Build Pipeline Status</div>
                <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ color: '#22c55e' }}>✓ Code Checkin Complete</div>
                  <div style={{ color: '#f59e0b' }}>⚠️ Vulnerability Security Scan Alert</div>
                  <div style={{ color: '#22c55e' }}>✓ Environment Build Active</div>
                  <div style={{ color: '#22c55e' }}>✓ Remote Range Deployment</div>
                </div>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '12px', paddingTop: '8px', fontSize: '11px' }}>
              <span style={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>CVE Database Live Feed: </span>
              <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>CVE-2026-1742 (Critical PHP Agent Bypass) Description mapping ongoing...</span>
            </div>
          </div>

          {/* DYNAMIC TARGET WORKSTATION INTERFACE */}
          <div style={styles.panel}>
            <div style={{ ...styles.panelHeader, marginBottom: '6px' }}>
              <span>Linux Lab Workspace Ecosystem</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {machines.map(m => (
                  <button key={m.id} onClick={() => setSelectedMachineId(m.id)} style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid', fontSize: '10px', cursor: 'pointer', backgroundColor: selectedMachineId === m.id ? 'rgba(0, 255, 204, 0.1)' : 'transparent', color: selectedMachineId === m.id ? '#00ffcc' : '#64748b', borderColor: selectedMachineId === m.id ? '#00ffcc' : 'rgba(255,255,255,0.1)' }}>
                    {m.name} {capturedMachines.includes(m.id) && '✓'}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Node Panel Info */}
            <div style={{ backgroundColor: '#070a12', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px' }}>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>Target: {currentMachine.name} </span>
                <span style={{ fontFamily: 'monospace', color: '#64748b' }}>({currentMachine.ip})</span>
                <p style={{ margin: '2px 0 0 0', color: '#94a3b8' }}>{currentMachine.desc}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: '#f59e0b', display: 'block', marginBottom: '4px' }}>[{currentMachine.difficulty}]</span>
                <button onClick={() => {
                  setMachines(machines.map(m => m.id === currentMachine.id ? { ...m, status: m.status === 'Running' ? 'Stopped' : 'Running' } : m));
                }} style={{ padding: '3px 8px', fontSize: '10px', borderRadius: '3px', border: 'none', cursor: 'pointer', backgroundColor: currentMachine.status === 'Running' ? '#7f1d1d' : '#1e293b', color: '#fff' }}>
                  {currentMachine.status === 'Running' ? 'Halt Instance' : 'Deploy Target'}
                </button>
              </div>
            </div>

            {/* Interactive Workspace Console Output */}
            <div style={styles.cliScreen}>
              {terminalLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.startsWith('kali@') ? '#60a5fa' : log.includes('Ports') ? '#f59e0b' : '#00ffcc' }}>{log}</div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            
            <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', backgroundColor: '#030712', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: '2px' }}>
              <span style={{ color: '#60a5fa', padding: '6px 4px 6px 10px', fontFamily: 'monospace', fontSize: '12px' }}>$</span>
              <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="Type 'help' to review exploitation frameworks arrays..." style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }} />
            </form>

            {/* Active Workspace Node Directory Browser */}
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

            {/* Flag Capture Submissions Form */}
            <form onSubmit={(e) => handleFlagSubmit(currentMachine, e)} style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
              <input type="text" value={flagInputs[currentMachine.id] || ''} onChange={(e) => setFlagInputs({ ...flagInputs, [currentMachine.id]: e.target.value })} placeholder={capturedMachines.includes(currentMachine.id) ? "Target Root System Access Owned" : "Enter Captured Root Token Signature (HTB{...})"} disabled={capturedMachines.includes(currentMachine.id)} style={{ flex: 1, backgroundColor: '#020408', border: '1px solid #1e293b', padding: '6px 10px', borderRadius: '4px', color: '#fff', fontSize: '11px', outline: 'none' }} />
              <button type="submit" disabled={capturedMachines.includes(currentMachine.id)} style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '0 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>Submit</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN LAYOUT */}
        <div>
          {/* SCRIPT TOOLKIT ARRIVAL DESK */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}><span>Offensive Script Library</span></div>
            <div style={styles.gridButtons}>
              {[
                { name: 'Nmap Probes', cmd: 'nmap -sV 192.168.1.10' },
                { name: 'Metasploit Console', cmd: 'msfconsole -q' },
                { name: 'SQLMap Automator', cmd: 'sqlmap -u "http://192.168.1.10/" --dbs' },
                { name: 'Hydra SSH Toolkit', cmd: 'hydra -l admin -P top10.txt 192.168.1.10 ssh' },
                { name: 'Netstat Metrics', cmd: 'netstat -antp' },
                { name: 'Wireshark Sniffer', cmd: 'tshark -i eth0' },
                { name: 'Lynis Security Audit', cmd: 'lynis audit system' },
                { name: 'Clair Container Scan', cmd: 'clairctl check' }
              ].map(tool => (
                <button key={tool.name} onClick={() => executeLibraryTool(tool.name, tool.cmd)} style={{ ...styles.toolActionBtn, borderColor: activeTool === tool.name ? '#00ffcc' : 'rgba(255,255,255,0.06)', backgroundColor: activeTool === tool.name ? 'rgba(0,255,204,0.04)' : 'rgba(15,23,42,0.5)' }}>
                  <span style={{ color: activeTool === tool.name ? '#00ffcc' : '#94a3b8' }}>⚡</span> {tool.name}
                </button>
              ))}
            </div>
          </div>

          {/* GRAPH ANALYSIS ROW AREA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={styles.panel}>
              <div style={styles.panelHeader}><span>AI Analytics</span></div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '45px' }}>
                {aiMetrics.map((v, i) => <div key={i} style={{ flex: 1, backgroundColor: '#a855f7', height: `${v}%`, borderRadius: '1px', transition: 'height 0.3s ease' }} />)}
              </div>
            </div>
            <div style={styles.panel}>
              <div style={styles.panelHeader}><span>RI Analysis</span></div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '45px' }}>
                {riMetrics.map((v, i) => <div key={i} style={{ flex: 1, backgroundColor: '#22c55e', height: `${v}%`, borderRadius: '1px', transition: 'height 0.3s ease' }} />)}
              </div>
            </div>
          </div>

          {/* COMPLIANCE TESTING SANDBOX GRID */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}><span>Compliance Sandbox Boundary</span></div>
            {auditPassed ? (
              <div style={{ color: '#22c55e', fontSize: '11px', lineHeight: '1.4' }}>
                ✓ Framework Parameters Cleared. Authorization logs stored to encrypted instance ledger successfully.
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (selectedAct === 'cmca_2018') {
                  setAuditPassed(true);
                  setSystemMessage('[SUCCESS] Legal evaluation cleared: Section 14 boundaries aligned.');
                } else {
                  setSystemMessage('[AUDIT REJECTED] Non-compliant framework parameter matching setup.');
                }
              }} style={{ fontSize: '11px' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 8px 0' }}>Validate deployment actions against localized digital legislation metrics:</p>
                <select value={selectedAct} onChange={(e) => setSelectedAct(e.target.value)} style={{ width: '100%', backgroundColor: '#020408', color: '#fff', border: '1px solid #1e293b', padding: '6px', borderRadius: '4px', outline: 'none', marginBottom: '6px' }}>
                  <option value="">-- Choose Target Regulatory Act --</option>
                  <option value="data_protection">Data Protection Act (2019)</option>
                  <option value="cmca_2018">Computer Misuse and Cybercrimes Act (2018)</option>
                </select>
                <button type="submit" style={{ width: '100%', border: '1px solid #a855f7', background: 'transparent', color: '#a855f7', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                  Execute Legal Audit
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