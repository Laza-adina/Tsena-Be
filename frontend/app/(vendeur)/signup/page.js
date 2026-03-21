'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { saveSession } from '../../../lib/auth';

const C = {
  cream:   '#FFFFFF',
  beige:   '#F5F5F5',
  sage:    '#D9D9D9',
  light:   '#EBEBEB',
  caramel: '#3C6E71',
  dark:    '#353535',
  muted:   '#284B63'
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ password: '', shopName: '', whatsapp: '', code: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [devCode, setDevCode] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSendCode = async () => {
    setError('');
    setSuccess('');
    setSendingCode(true);
    try {
      const { data } = await api.post('/auth/whatsapp/send-code', {
        whatsapp: form.whatsapp,
        purpose: 'signup'
      });
      setCodeSent(true);
      setWhatsappVerified(false);
      setVerificationToken('');
      setSuccess('Code envoyé sur votre WhatsApp.');
      setDevCode(data?.devCode || '');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi du code.');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    setSuccess('');
    setVerifyingCode(true);
    try {
      const { data } = await api.post('/auth/whatsapp/verify-code', {
        whatsapp: form.whatsapp,
        code: form.code,
        purpose: 'signup'
      });
      setWhatsappVerified(true);
      setVerificationToken(data.verificationToken);
      setSuccess('Numéro WhatsApp vérifié.');
    } catch (err) {
      setWhatsappVerified(false);
      setVerificationToken('');
      setError(err.response?.data?.error || 'Code invalide.');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!whatsappVerified || !verificationToken) {
      setError('Veuillez vérifier votre numéro WhatsApp avant de créer le compte.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        shopName: form.shopName,
        password: form.password,
        whatsapp: form.whatsapp,
        whatsappVerificationToken: verificationToken,
      });
      saveSession(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  const fadeItem = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0px)' : 'translateY(20px)',
    transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: `1px solid ${C.light}`,
    borderRadius: '8px', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    background: C.cream, color: C.dark,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '400',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const labelStyle = {
    fontSize: '12px', fontWeight: '600',
    color: C.dark, display: 'block', marginBottom: '7px',
    textTransform: 'uppercase', letterSpacing: '1px',
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.cream, fontFamily: "'DM Sans', sans-serif", padding: '40px 0' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus {
          border-color: ${C.caramel} !important;
          box-shadow: 0 0 0 3px ${C.caramel}22 !important;
        }
        input::placeholder { color: ${C.muted}; opacity: 0.5; }
        .btn-signup {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-signup:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(53,53,53,0.18);
        }
        .link-login {
          color: ${C.dark};
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid ${C.dark}40;
          padding-bottom: 1px;
          transition: border-color 0.2s;
        }
        .link-login:hover { border-color: ${C.dark}; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ ...fadeItem(0), textAlign: 'center', marginBottom: '44px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: '700', color: C.dark, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              Tsen<span style={{ color: C.caramel }}>@</span>be
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '300', color: C.muted, marginLeft: '10px', letterSpacing: '0' }}>by Keyros</span>
            </p>
          </a>
          <p style={{ fontSize: '14px', color: C.muted, margin: 0, fontWeight: '300' }}>
            Créez votre boutique en ligne
          </p>
        </div>

        {/* Card */}
        <div style={{ ...fadeItem(120), background: C.sage, borderRadius: '20px', padding: '36px 32px' }}>

          {error && (
            <div style={{ padding: '12px 14px', background: '#fff0f0', border: '1px solid #fcc', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', color: '#c00', fontWeight: '400' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '12px 14px', background: '#eef8ef', border: '1px solid #bfe3c1', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', color: '#1f6f2a', fontWeight: '400' }}>
              {success}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            <div>
              <label style={labelStyle}>Nom de la boutique</label>
              <input
                type="text"
                value={form.shopName}
                onChange={e => setForm({ ...form, shopName: e.target.value })}
                placeholder="Ex : Fringues Miora"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Mot de passe</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 6 caractères"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Numéro WhatsApp
                <span style={{ color: C.muted, fontWeight: '300', marginLeft: '8px', fontSize: '11px', textTransform: 'none', letterSpacing: '0' }}>
                  ex : 261341234567
                </span>
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={e => {
                  const nextWhatsapp = e.target.value;
                  setForm({ ...form, whatsapp: nextWhatsapp });
                  setWhatsappVerified(false);
                  setVerificationToken('');
                  setCodeSent(false);
                  setDevCode('');
                }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="261341234567"
                style={inputStyle}
              />
            </div>

            <button
              className="btn-signup"
              onClick={handleSendCode}
              disabled={sendingCode || !form.whatsapp}
              style={{
                width: '100%', padding: '12px',
                background: sendingCode ? C.muted : C.caramel,
                color: C.cream, border: 'none', borderRadius: '8px',
                fontSize: '13px', fontWeight: '600',
                cursor: sendingCode || !form.whatsapp ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.2px'
              }}
            >
              {sendingCode ? 'Envoi du code…' : 'Envoyer le code WhatsApp'}
            </button>

            {codeSent && (
              <>
                <div>
                  <label style={labelStyle}>Code de vérification</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    placeholder="Entrez le code reçu"
                    style={inputStyle}
                  />
                </div>
                <button
                  className="btn-signup"
                  onClick={handleVerifyCode}
                  disabled={verifyingCode || !form.code}
                  style={{
                    width: '100%', padding: '12px',
                    background: verifyingCode ? C.muted : C.dark,
                    color: C.cream, border: 'none', borderRadius: '8px',
                    fontSize: '13px', fontWeight: '600',
                    cursor: verifyingCode || !form.code ? 'not-allowed' : 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '0.2px'
                  }}
                >
                  {verifyingCode ? 'Vérification…' : 'Vérifier le numéro'}
                </button>
              </>
            )}

            {devCode && (
              <p style={{ fontSize: '12px', color: C.muted, marginTop: '-6px' }}>
                Code de test (dev): {devCode}
              </p>
            )}

            {whatsappVerified && (
              <p style={{ fontSize: '12px', color: '#1f6f2a', marginTop: '-6px', fontWeight: 600 }}>
                ✓ Numéro WhatsApp vérifié
              </p>
            )}

            <button
              className="btn-signup"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? C.muted : C.dark,
                color: C.cream, border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                marginTop: '6px',
                letterSpacing: '0.2px'
              }}
            >
              {loading ? 'Création…' : 'Créer ma boutique'}
            </button>
          </div>
        </div>

        <p style={{ ...fadeItem(240), textAlign: 'center', fontSize: '13px', color: C.muted, marginTop: '24px', fontWeight: '300' }}>
          Déjà un compte ?{' '}
          <a href="/login" className="link-login">
            Se connecter
          </a>
        </p>

        <p style={{ ...fadeItem(320), textAlign: 'center', fontSize: '12px', color: C.muted, marginTop: '44px', fontWeight: '300', opacity: 0.7 }}>
          Tsen@be — Développé par Keyros · Madagascar
        </p>
      </div>
    </div>
  );
}