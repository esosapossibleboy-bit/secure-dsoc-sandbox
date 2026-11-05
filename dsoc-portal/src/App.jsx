// dsoc-portal/src/App.jsx
import { useState } from 'react';

export default function App() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('System Standby: Awaiting distributed mesh validation...');
    const [activeUser, setActiveUser] = useState(null);
    const [vaultDataStream, setVaultDataStream] = useState('');

    // 🔐 TASK 1: Transmit credentials down to Microservice A (Auth Node - Port 3040)
    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;

        const endpointPath = isLoginMode ? 'login' : 'register';
        setStatusMessage(`Contacting Auth-Audit Core Microservice Node [Port 3040] via /${endpointPath}...`);

        try {
            const response = await fetch(`http://localhost:3040/api/auth/${endpointPath}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // 🍪 Instructs the browser to capture the secure cookie token cross-origin!
                body: JSON.stringify({ username: username.trim(), password: password.trim() })
            });
            const data = await response.json();

            if (response.ok) {
                if (isLoginMode) {
                    setActiveUser(data.user?.username || username.trim());
                    setStatusMessage('🔒 AUTHENTICATED: Identity verified. Session cookie stored inside browser engine.');
                } else {
                    setStatusMessage('🛡️ PROFILE SECURED: Account generated on Node A! Switching to Login Door.');
                    setIsLoginMode(true);
                }
                setPassword('');
            } else {
                setStatusMessage(`Auth Node Refusal: ${data.error || 'Request rejected'}`);
            }
        } catch (err) {
            setStatusMessage('Network Error: Failed to drop packets into Auth-Audit Node 3040.');
        }
    };

    // 🔓 TASK 2: Use the injected cookie to query Microservice B (Vault Node - Port 3060)
    const handleFetchVaultPayload = async () => {
        setStatusMessage('Forwarding session tracking cookie down to isolated Vault Node [Port 3060]...');

        try {
            const response = await fetch('http://localhost:3060/api/vault/payloads', {
                method: 'GET',
                credentials: 'include' // 🍪 Transports the cookie signed by Node A seamlessly straight to Node B!
            });
            const data = await response.json();

            if (response.ok) {
                setVaultDataStream(data.confidentialPayloadStream);
                setStatusMessage('🏆 VAULT SIGNATURE VERIFIED: Distributed clearance token accepted!');
            } else {
                setStatusMessage(`Vault Node Refusal: ${data.error || 'Access Intercepted'}`);
            }
        } catch (err) {
            setStatusMessage('Network Error: Secure channel path to Vault Node 3060 is down.');
        }
    };

    const handleClearSession = () => {
        setActiveUser(null);
        setVaultDataStream('');
        setUsername('');
        setPassword('');
        setStatusMessage('Session flushed. Console context returned to default state.');
    };

    // 🛑 VIEW STATE A: If authenticated, open up the Distributed SOC Operational Command Room Panel
    if (activeUser) {
        return (
            <div style={{ maxWidth: '650px', margin: '60px auto', padding: '30px', fontFamily: 'monospace', background: '#090d16', color: '#f8fafc', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '15px', marginBottom: '25px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', color: '#10b981' }}>🛰️ Distributed SOC Control Panel</h2>
                        <small style={{ color: '#64748b' }}>Active Operator ID handle: <strong style={{ color: '#38bdf8' }}>{activeUser}</strong></small>
                    </div>
                    <button onClick={handleClearSession} style={{ padding: '6px 14px', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Disconnect Mesh 🔌</button>
                </div>

                <p style={{ background: '#111b27', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#cbd5e1', borderLeft: '4px solid #10b981', margin: '0 0 25px 0' }}>
                    📡 <strong>Distributed Trace Log:</strong> <span style={{ color: '#60a5fa' }}>{statusMessage}</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <button onClick={handleFetchVaultPayload} style={{ width: '100%', padding: '14px', background: 'linear-gradient(to right, #3b82f6, #4f46e5)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                        🔑 Query Isolated Vault Microservice Node [Port 3060]
                    </button>

                    {vaultDataStream && (
                        <div style={{ background: '#020617', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b', fontSize: '12px' }}>
                            <span style={{ color: '#e2e8f0', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🔓 CROSS-SERVICE TARGET ENVELOPE OPENED:</span>
                            <code style={{ color: '#34d399', display: 'block', background: '#0b1329', padding: '10px', borderRadius: '6px', border: '1px solid #1d2d44' }}>{vaultDataStream}</code>
                            <p style={{ color: '#475569', fontSize: '10px', margin: '15px 0 0 0', lineHeight: '1.5' }}>
                                🛡️ DevOps Distributed Mesh Architecture Verified: Node B successfully unpacked and validated the signature issued by Node A without querying any user tables!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 🛑 VIEW STATE B: Otherwise, render the secure authentication gate door
    return (
        <div style={{ maxWidth: '420px', margin: '100px auto', padding: '30px', fontFamily: 'monospace', background: '#090d16', color: '#f8fafc', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)', border: '1px solid #1e293b' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '15px', marginBottom: '25px' }}>
                <span style={{ fontSize: '32px' }}>🛰️</span>
                <h2 style={{ margin: '10px 0 5px 0', fontSize: '16px', color: '#38bdf8' }}>{isLoginMode ? 'DISTRIBUTED MESH LOGIN DOOR' : 'PROVISION DISTRIBUTED OPERATIVE'}</h2>
                <small style={{ color: '#64748b' }}>Multi-Service Cryptographic Authorization Sandbox</small>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px', color: '#94a3b8' }}>OPERATIVE ACCESS ID:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter handle..." style={{ width: '94%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px', color: '#94a3b8' }}>PASSPHRASE CODE MATRIX:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '94%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none' }} />
                </div>

                <button type="submit" style={{ width: '100%', padding: '12px', background: isLoginMode ? 'linear-gradient(to right, #0284c7, #4f46e5)' : 'linear-gradient(to right, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', marginTop: '10px' }}>
                    {isLoginMode ? '⚡ Authenticate Identity' : '🛡️ Secure Profile Access'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px' }}>
                <span style={{ color: '#64748b' }}>{isLoginMode ? "New operative?" : "Already hold access?"} </span>
                <span onClick={() => setIsLoginMode(!isLoginMode)} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
                    {isLoginMode ? 'Provision Operative Handle' : 'Return to Gate Door'}
                </span>
            </div>

            <div style={{ marginTop: '20px', padding: '10px', background: '#020617', borderRadius: '8px', fontSize: '10px', textAlign: 'center', border: '1px solid #1e293b', color: '#94a3b8' }}>
                {statusMessage}
            </div>
        </div>
    );
}
